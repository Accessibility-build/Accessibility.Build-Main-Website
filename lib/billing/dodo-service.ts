import "server-only"
import { and, eq, isNull, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { billingOrders, creditTransactions, dodoWebhookEvents, productEntitlements, users } from "@/lib/db/schema"
import { grantCourseLicence, revokeCourseLicenceForOrder } from "@/lib/courses/access"
import { normalizeEmail } from "@/lib/courses/config"
import { sendCoursePurchaseEmail, sendTemplatePurchaseEmail } from "@/lib/email/course-emails"
import { formatAmountForEmail, sendPurchaseConfirmationEmail, sendRefundNotificationEmail } from "@/lib/email/service"
import { getDodoClient, resolveDodoProductId } from "./dodo"
import { logBillingFunnelEvent } from "./events"
import { getSellable } from "./sellables"
import { getPublicAppUrl } from "./stripe"
import type { CheckoutSessionResponse } from "./types"
import { verifyGuestCheckoutToken } from "./guest-checkout"

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]
type Order = typeof billingOrders.$inferSelect

// ── Checkout ──────────────────────────────────────────────────────────────────────────────────

/**
 * Create a pending order and a Dodo hosted checkout session for any sellable key (credit pack,
 * course licence or template). Returns the session URL for a redirect.
 */
export async function createDodoCheckout(params: {
  userId: string | null
  email?: string | null
  fullName?: string | null
  key: string
  guestTokenHash?: string
}): Promise<Extract<CheckoutSessionResponse, { mode: "payment_link" }>> {
  const item = getSellable(params.key)
  if (!item) throw new Error("Unknown product")
  if (!params.userId && (item.kind === "credits" || !params.guestTokenHash || !/^[a-f0-9]{64}$/.test(params.guestTokenHash))) {
    throw new Error("Guest checkout is only available for courses and templates")
  }
  const productId = await resolveDodoProductId(item.key)
  const appUrl = getPublicAppUrl()

  const [order] = await db
    .insert(billingOrders)
    .values({
      userId: params.userId,
      paymentProvider: "dodo",
      catalogKey: item.key,
      credits: item.credits,
      currency: "USD",
      amountSubtotal: item.priceUsdCents,
      amountTax: 0,
      amountTotal: item.priceUsdCents,
      baseAmountUsdCents: item.priceUsdCents,
      amountTotalUsdCents: item.priceUsdCents,
      status: "pending",
      metadata: {
        source: "dodo_checkout", kind: item.kind, dodoProductId: productId,
        ...(!params.userId ? { guestCheckout: true, guestCheckoutTokenHash: params.guestTokenHash } : {}),
      },
    })
    .returning({ id: billingOrders.id })

  try {
    const session = await getDodoClient().checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: params.email ? { email: params.email, name: params.fullName || params.email } : undefined,
      metadata: { order_id: order.id, sku: item.key, ...(params.userId ? { user_id: params.userId } : {}) },
      return_url: `${appUrl}/billing/return?order=${order.id}`,
      cancel_url: `${appUrl}${item.cancelPath}`,
      feature_flags: { allow_discount_code: true },
    } as Parameters<ReturnType<typeof getDodoClient>["checkoutSessions"]["create"]>[0])

    if (!session.checkout_url) throw new Error("Dodo did not return a checkout URL")
    await db
      .update(billingOrders)
      .set({ providerOrderId: session.session_id, updatedAt: new Date() })
      .where(eq(billingOrders.id, order.id))
    return { mode: "payment_link", orderId: order.id, url: session.checkout_url }
  } catch (err) {
    await db
      .update(billingOrders)
      .set({ status: "failed", failureReason: err instanceof Error ? err.message.slice(0, 500) : "checkout failed", updatedAt: new Date() })
      .where(eq(billingOrders.id, order.id))
    throw err
  }
}

// ── Webhooks ──────────────────────────────────────────────────────────────────────────────────

export interface DodoWebhookEvent {
  business_id?: string
  type: string
  timestamp?: string
  data: Record<string, unknown>
}

async function claimEvent(eventId: string, event: DodoWebhookEvent) {
  const [inserted] = await db
    .insert(dodoWebhookEvents)
    .values({ eventId, eventType: event.type, processingStatus: "processing", payload: event as unknown as Record<string, unknown> })
    .onConflictDoNothing()
    .returning({ eventId: dodoWebhookEvents.eventId })
  if (inserted) return true
  const [existing] = await db
    .select({ status: dodoWebhookEvents.processingStatus })
    .from(dodoWebhookEvents)
    .where(eq(dodoWebhookEvents.eventId, eventId))
    .limit(1)
  if (!existing || existing.status === "processed") return false
  if (existing.status === "failed") {
    const [re] = await db
      .update(dodoWebhookEvents)
      .set({ processingStatus: "processing", errorMessage: null, processedAt: null })
      .where(and(eq(dodoWebhookEvents.eventId, eventId), eq(dodoWebhookEvents.processingStatus, "failed")))
      .returning({ eventId: dodoWebhookEvents.eventId })
    return Boolean(re)
  }
  throw new Error(`Dodo webhook ${eventId} is already being processed`)
}

async function completeEvent(eventId: string, status: "processed" | "failed", orderId?: string, errorMessage?: string) {
  await db
    .update(dodoWebhookEvents)
    .set({ processingStatus: status, orderId, errorMessage, processedAt: new Date() })
    .where(eq(dodoWebhookEvents.eventId, eventId))
}

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v : undefined)
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : undefined)

async function findOrder(refs: { orderId?: string; sessionId?: string; paymentId?: string }): Promise<Order | undefined> {
  if (refs.orderId && /^[0-9a-f-]{36}$/i.test(refs.orderId)) {
    const [o] = await db.select().from(billingOrders).where(eq(billingOrders.id, refs.orderId)).limit(1)
    if (o) return o
  }
  if (refs.sessionId) {
    const [o] = await db.select().from(billingOrders).where(eq(billingOrders.providerOrderId, refs.sessionId)).limit(1)
    if (o) return o
  }
  if (refs.paymentId) {
    const [o] = await db.select().from(billingOrders).where(eq(billingOrders.providerPaymentId, refs.paymentId)).limit(1)
    if (o) return o
  }
  return undefined
}

function orderMeta(o: Order): Record<string, unknown> {
  return o.metadata && typeof o.metadata === "object" && !Array.isArray(o.metadata) ? (o.metadata as Record<string, unknown>) : {}
}

/** Fulfil a paid order exactly once. Returns the kind fulfilled, or null if already handled. */
async function fulfilOrder(orderId: string, payment: Record<string, unknown>, eventId: string) {
  return db.transaction(async (tx: Tx) => {
    await tx.execute(sql`SELECT id FROM billing_orders WHERE id = ${orderId} FOR UPDATE`)
    const [order] = await tx.select().from(billingOrders).where(eq(billingOrders.id, orderId)).limit(1)
    if (!order) throw new Error(`Order ${orderId} not found`)
    if (order.paymentProvider !== "dodo") throw new Error("Not a Dodo order")
    if (order.status !== "pending" && order.status !== "failed") return null
    const item = getSellable(order.catalogKey)
    if (!item) throw new Error(`Order ${orderId} has unknown catalog key ${order.catalogKey}`)

    const paymentId = str(payment.payment_id)
    const totalAmount = num(payment.total_amount)
    const currency = str(payment.currency)
    const tax = num(payment.tax)
    const paidFields = {
      status: "paid" as const,
      providerPaymentId: paymentId ?? order.providerPaymentId,
      currency: currency ?? order.currency,
      amountTotal: totalAmount ?? order.amountTotal,
      amountTax: tax ?? order.amountTax,
      amountSubtotal: totalAmount !== undefined && tax !== undefined ? totalAmount - tax : order.amountSubtotal,
      failureReason: null,
      updatedAt: new Date(),
    }
    const meta = { ...orderMeta(order), billingProvider: "dodo", providerPaymentId: paymentId, eventId, invoiceUrl: str(payment.invoice_url) }

    if (item.kind === "credits") {
      if (!order.userId) throw new Error("Credit purchases require an account")
      const [u] = await tx
        .update(users)
        .set({
          credits: sql`${users.credits} + ${order.credits}`,
          totalCreditsEarned: sql`${users.totalCreditsEarned} + ${order.credits}`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, order.userId))
        .returning({ credits: users.credits })
      if (!u) throw new Error(`User ${order.userId} not found for order ${order.id}`)
      const [txRow] = await tx
        .insert(creditTransactions)
        .values({
          userId: order.userId,
          type: "purchase",
          amount: order.credits,
          balanceBefore: u.credits - order.credits,
          balanceAfter: u.credits,
          description: `Dodo Payments purchase: ${order.catalogKey}`,
          status: "completed",
          metadata: { billingOrderId: order.id, providerPaymentId: paymentId, eventId },
        })
        .returning({ id: creditTransactions.id })
      await tx
        .update(billingOrders)
        .set({ ...paidFields, creditTransactionId: txRow.id, metadata: { ...meta, purchaseTransactionId: txRow.id } })
        .where(eq(billingOrders.id, order.id))
      return { kind: item.kind, order }
    }

    const [buyer] = order.userId
      ? await tx.select({ email: users.email }).from(users).where(eq(users.id, order.userId)).limit(1)
      : []
    const accountEmail = buyer?.email && !buyer.email.endsWith("@users.accessibility.build") ? buyer.email : undefined
    const buyerEmail = normalizeEmail(accountEmail || str((payment.customer as Record<string, unknown> | undefined)?.email) || "")
    if (buyerEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
      throw new Error("The confirmed payment is missing a valid buyer email")
    }

    if (item.kind === "course" && item.course) {
      await grantCourseLicence(
        { slug: item.course.slug, licenceType: item.course.licence, ownerUserId: order.userId, ownerEmail: buyerEmail, billingOrderId: order.id, source: "purchase" },
        tx
      )
    } else if (item.kind === "template" && item.template) {
      await tx
        .insert(productEntitlements)
        .values({ userId: order.userId, email: buyerEmail, productSlug: item.template.slug, licence: item.template.licence, billingOrderId: order.id, source: "purchase" })
        .onConflictDoNothing()
    }
    await tx.update(billingOrders).set({ ...paidFields, metadata: { ...meta, buyerEmail } }).where(eq(billingOrders.id, order.id))
    return { kind: item.kind, order }
  })
}

async function sendFulfilmentEmail(kind: string, orderId: string) {
  try {
    if (kind === "course") return void (await sendCoursePurchaseEmail(orderId))
    if (kind === "template") return void (await sendTemplatePurchaseEmail(orderId))
    const [o] = await db.select().from(billingOrders).where(eq(billingOrders.id, orderId)).limit(1)
    if (!o?.userId) return
    const [u] = await db.select({ email: users.email, firstName: users.firstName, lastName: users.lastName, credits: users.credits }).from(users).where(eq(users.id, o.userId)).limit(1)
    const item = getSellable(o.catalogKey)
    if (!u || !item) return
    sendPurchaseConfirmationEmail({
      type: "purchase_confirmation",
      recipient: { email: u.email, firstName: u.firstName, lastName: u.lastName },
      orderId: o.id,
      packName: item.name,
      credits: o.credits,
      amountFormatted: formatAmountForEmail(o.amountTotal, o.currency),
      currency: o.currency,
      paymentProvider: "dodo",
      newBalance: u.credits,
    })
  } catch {
    // Email must never fail the webhook.
  }
}

async function markFailed(order: Order, reason: string) {
  if (order.status !== "pending") return
  await db
    .update(billingOrders)
    .set({ status: "failed", failureReason: reason.slice(0, 500), updatedAt: new Date() })
    .where(and(eq(billingOrders.id, order.id), eq(billingOrders.status, "pending")))
}

/** Reverse an order after a refund or a lost dispute. */
async function reverseOrder(order: Order, amountMinor: number, isPartial: boolean, reason: string, refundId?: string) {
  const item = getSellable(order.catalogKey)
  const full = !isPartial && amountMinor >= order.amountTotal
  if (!item || item.kind !== "credits") {
    if (item?.kind === "course") await revokeCourseLicenceForOrder(order.id, reason)
    if (item?.kind === "template") {
      await db
        .update(productEntitlements)
        .set({ revokedAt: new Date(), note: reason })
        .where(and(eq(productEntitlements.billingOrderId, order.id), isNull(productEntitlements.revokedAt)))
    }
    await db
      .update(billingOrders)
      .set({ status: full ? "refunded" : "partially_refunded", providerRefundId: refundId ?? order.providerRefundId, updatedAt: new Date() })
      .where(eq(billingOrders.id, order.id))
    return
  }
  if (!order.userId) throw new Error("Credit refund requires an account")

  let reversedCredits = 0
  await db.transaction(async (tx: Tx) => {
    await tx.execute(sql`SELECT id FROM billing_orders WHERE id = ${order.id} FOR UPDATE`)
    const [o] = await tx.select().from(billingOrders).where(eq(billingOrders.id, order.id)).limit(1)
    if (!o?.userId) return
    const meta = orderMeta(o)
    const already = Number(meta.refundedCredits || 0)
    const ratio = Math.min(1, amountMinor / Math.max(o.amountTotal, 1))
    const target = full ? o.credits : Math.min(o.credits, Math.round(o.credits * ratio))
    const toReverse = Math.max(0, target - already)
    if (toReverse === 0) return
    const [u] = await tx.select({ credits: users.credits }).from(users).where(eq(users.id, o.userId)).limit(1)
    if (!u || u.credits < toReverse) {
      await tx
        .update(billingOrders)
        .set({ status: "action_required", metadata: { ...meta, actionRequiredReason: "insufficient_credits_for_refund_reversal" }, updatedAt: new Date() })
        .where(eq(billingOrders.id, o.id))
      return
    }
    const [after] = await tx
      .update(users)
      .set({ credits: sql`${users.credits} - ${toReverse}`, updatedAt: new Date() })
      .where(eq(users.id, o.userId))
      .returning({ credits: users.credits })
    const [t] = await tx
      .insert(creditTransactions)
      .values({
        userId: o.userId,
        type: "refund",
        amount: -toReverse,
        balanceBefore: after.credits + toReverse,
        balanceAfter: after.credits,
        description: `Credit reversal (${reason}): ${o.catalogKey}`,
        status: "completed",
        metadata: { billingOrderId: o.id, refundId },
      })
      .returning({ id: creditTransactions.id })
    reversedCredits = toReverse
    const total = already + toReverse
    await tx
      .update(billingOrders)
      .set({
        status: total >= o.credits ? "refunded" : "partially_refunded",
        providerRefundId: refundId ?? o.providerRefundId,
        metadata: { ...meta, refundedCredits: total, refundTransactionIds: [...((meta.refundTransactionIds as string[]) || []), t.id] },
        updatedAt: new Date(),
      })
      .where(eq(billingOrders.id, o.id))
  })

  if (!reversedCredits) return
  try {
    const [u] = await db.select({ email: users.email, firstName: users.firstName, lastName: users.lastName, credits: users.credits }).from(users).where(eq(users.id, order.userId)).limit(1)
    if (u) {
      sendRefundNotificationEmail({
        type: "refund_notification",
        recipient: { email: u.email, firstName: u.firstName, lastName: u.lastName },
        orderId: order.id,
        packName: item.name,
        creditsReversed: reversedCredits,
        refundAmountFormatted: formatAmountForEmail(amountMinor, order.currency),
        currency: order.currency,
        remainingBalance: u.credits,
      })
    }
  } catch {
    // Email must never fail the webhook.
  }
}

export async function processDodoWebhook(eventId: string, event: DodoWebhookEvent) {
  const claimed = await claimEvent(eventId, event)
  if (!claimed) {
    await logBillingFunnelEvent({ eventType: "webhook_duplicate", eventSource: "service:processDodoWebhook", paymentProvider: "dodo", status: "duplicate", metadata: { eventId, type: event.type } })
    return { duplicate: true as const }
  }
  const d = event.data || {}
  let orderId: string | undefined
  try {
    switch (event.type) {
      case "payment.succeeded": {
        const metadata = (d.metadata as Record<string, unknown>) || {}
        const order = await findOrder({ orderId: str(metadata.order_id), sessionId: str(d.checkout_session_id), paymentId: str(d.payment_id) })
        if (order) {
          orderId = order.id
          const result = await fulfilOrder(order.id, d, eventId)
          if (result) await sendFulfilmentEmail(result.kind, order.id)
        }
        await logBillingFunnelEvent({ eventType: "webhook_paid", eventSource: "service:processDodoWebhook", paymentProvider: "dodo", orderId, providerPaymentId: str(d.payment_id), status: order ? "paid" : "order_not_found", metadata: { eventId } })
        break
      }
      case "payment.failed":
      case "payment.cancelled": {
        const metadata = (d.metadata as Record<string, unknown>) || {}
        const order = await findOrder({ orderId: str(metadata.order_id), sessionId: str(d.checkout_session_id), paymentId: str(d.payment_id) })
        if (order) {
          orderId = order.id
          await markFailed(order, str(d.error_message) || event.type)
        }
        await logBillingFunnelEvent({ eventType: "webhook_failed", eventSource: "service:processDodoWebhook", paymentProvider: "dodo", orderId, providerPaymentId: str(d.payment_id), status: event.type, errorMessage: str(d.error_message) })
        break
      }
      case "payment.processing": {
        await logBillingFunnelEvent({ eventType: "webhook_pending", eventSource: "service:processDodoWebhook", paymentProvider: "dodo", providerPaymentId: str(d.payment_id), status: "processing" })
        break
      }
      case "refund.succeeded": {
        const order = await findOrder({ paymentId: str(d.payment_id) })
        if (order) {
          orderId = order.id
          await reverseOrder(order, num(d.amount) ?? order.amountTotal, Boolean(d.is_partial), "refund", str(d.refund_id))
        }
        await logBillingFunnelEvent({ eventType: "webhook_refund", eventSource: "service:processDodoWebhook", paymentProvider: "dodo", orderId, providerPaymentId: str(d.payment_id), status: "refunded" })
        break
      }
      case "dispute.lost": {
        const order = await findOrder({ paymentId: str(d.payment_id) })
        if (order) {
          orderId = order.id
          await reverseOrder(order, order.amountTotal, false, "dispute lost")
        }
        await logBillingFunnelEvent({ eventType: "webhook_refund", eventSource: "service:processDodoWebhook", paymentProvider: "dodo", orderId, providerPaymentId: str(d.payment_id), status: "dispute_lost" })
        break
      }
      default:
        break
    }
    await completeEvent(eventId, "processed", orderId)
    return { duplicate: false as const, orderId }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await completeEvent(eventId, "failed", orderId, message.slice(0, 1000))
    await logBillingFunnelEvent({ eventType: "webhook_error", eventSource: "service:processDodoWebhook", paymentProvider: "dodo", orderId, status: "error", errorMessage: message })
    throw err
  }
}

/** For the return page: the order's current status, owned by this user. */
export async function getOrderStatusForViewer(orderId: string, userId?: string, guestToken?: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)) return null
  const [o] = await db
    .select()
    .from(billingOrders)
    .where(eq(billingOrders.id, orderId))
    .limit(1)
  if (!o) return null
  const ownsOrder = Boolean(userId && o.userId === userId)
  const item = getSellable(o.catalogKey)
  const meta = orderMeta(o)
  const guestCanView = o.paymentProvider === "dodo" && item && item.kind !== "credits" && meta.guestCheckout === true
    && verifyGuestCheckoutToken(guestToken, meta.guestCheckoutTokenHash)
  if (!ownsOrder && !guestCanView) return null
  return { id: o.id, status: o.status, item, requiresSignIn: !ownsOrder }
}

/** Admin settlement of a Dodo order paid outside the webhook (for example after a webhook outage). */
export async function settleDodoOrderManually(orderId: string, providerPaymentId?: string) {
  const order = await findOrder({ orderId })
  let payment: Record<string, unknown> = providerPaymentId ? { payment_id: providerPaymentId } : {}
  if (order && !order.userId) {
    if (!providerPaymentId) throw new Error("A confirmed Dodo payment is required to settle a guest order")
    const confirmed = await getDodoClient().payments.retrieve(providerPaymentId)
    if (confirmed.status !== "succeeded" || confirmed.metadata?.order_id !== order.id) throw new Error("Payment does not match this guest order")
    payment = confirmed as unknown as Record<string, unknown>
  }
  const result = await fulfilOrder(orderId, payment, `manual:${Date.now()}`)
  if (result) await sendFulfilmentEmail(result.kind, orderId)
  return result
}
