import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  billingOrders,
  creditTransactions,
  razorpayWebhookEvents,
  users,
} from '@/lib/db/schema'
import { getCatalogPack, isCheckoutCatalogKey } from './catalog'
import { convertUsdCentsToInrPaise, getUsdToInrQuote } from './fx'
import { logBillingFunnelEvent } from './events'
import {
  createRazorpayCustomer,
  createRazorpayOrder,
  createRazorpayPaymentLink,
  fetchRazorpayPayment,
  getRazorpayKeyId,
} from './razorpay'
import {
  BillingOrderMetadata,
  BillingOrderStatus,
  CatalogKey,
  CheckoutCurrency,
  CheckoutSessionResponse,
} from './types'
import { sendPurchaseConfirmationEmail, sendRefundNotificationEmail, formatAmountForEmail } from '@/lib/email/service'

type CustomerInput = {
  userId: string
  email?: string | null
  fullName?: string | null
}

type RazorpayWebhookInput = {
  eventId: string
  eventType: string
  payload: Record<string, unknown>
}

function parseOrderMetadata(metadata: unknown): BillingOrderMetadata {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return {}
  }

  return metadata as BillingOrderMetadata
}

function sanitizeCheckoutCurrency(value: string | undefined): CheckoutCurrency {
  return value === 'INR' ? 'INR' : 'USD'
}

function getCheckoutAmount(params: {
  baseAmountUsdCents: number
  currency: CheckoutCurrency
  usdToInrRate: number
}) {
  if (params.currency === 'USD') {
    return {
      amountMinor: params.baseAmountUsdCents,
      amountTotalUsdCents: params.baseAmountUsdCents,
    }
  }

  return {
    amountMinor: convertUsdCentsToInrPaise(params.baseAmountUsdCents, params.usdToInrRate),
    amountTotalUsdCents: params.baseAmountUsdCents,
  }
}

async function ensureRazorpayCustomerForUser({ userId, email, fullName }: CustomerInput) {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      razorpayCustomerId: users.razorpayCustomerId,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    throw new Error('User record not found for billing')
  }

  if (user.razorpayCustomerId) {
    return user.razorpayCustomerId
  }

  const customer = await createRazorpayCustomer({
    name:
      fullName ||
      [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
      undefined,
    email: email || user.email || undefined,
    notes: {
      userId,
    },
  }).catch(() => null)

  if (!customer?.id) {
    return null
  }

  await db
    .update(users)
    .set({
      razorpayCustomerId: customer.id,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))

  return customer.id
}

async function createFallbackPaymentLinkForOrder(params: {
  orderId: string
  userId: string
  email?: string | null
  fullName?: string | null
}) {
  const [order] = await db
    .select()
    .from(billingOrders)
    .where(eq(billingOrders.id, params.orderId))
    .limit(1)

  if (!order || order.paymentProvider !== 'razorpay') {
    throw new Error('Billing order not found for payment link creation')
  }

  const razorpayCustomerId = await ensureRazorpayCustomerForUser({
    userId: params.userId,
    email: params.email,
    fullName: params.fullName,
  }).catch(() => null)

  const link = await createRazorpayPaymentLink({
    amountMinor: order.amountTotal,
    currency: sanitizeCheckoutCurrency(order.currency),
    description: `Accessibility.build credits (${order.catalogKey})`,
    referenceId: order.id,
    customer: {
      name: params.fullName || undefined,
      email: params.email || undefined,
    },
    notes: {
      appOrderId: order.id,
      userId: params.userId,
      catalogKey: order.catalogKey,
      credits: String(order.credits),
      providerOrderId: order.providerOrderId || '',
      razorpayCustomerId: razorpayCustomerId || '',
    },
  })

  const metadata = parseOrderMetadata(order.metadata)
  await db
    .update(billingOrders)
    .set({
      providerPaymentLinkId: link.id,
      metadata: {
        ...metadata,
        fallbackPaymentLinkUrl: link.short_url,
      },
      updatedAt: new Date(),
    })
    .where(eq(billingOrders.id, order.id))

  return link.short_url
}

export async function createRazorpayCheckoutForCatalog(params: {
  userId: string
  email?: string | null
  fullName?: string | null
  catalogKey: CatalogKey
  currency?: CheckoutCurrency
}): Promise<CheckoutSessionResponse> {
  const LOG_PREFIX = '[razorpay-service:createCheckout]'
  const { userId, email, fullName, catalogKey } = params
  const pack = getCatalogPack(catalogKey)

  if (!pack.checkoutEnabled || !isCheckoutCatalogKey(pack.key)) {
    console.error(`${LOG_PREFIX} ✗ pack_not_checkout_enabled`, JSON.stringify({ catalogKey, packKey: pack.key }))
    throw new Error('Selected catalog pack is not checkout enabled')
  }

  const selectedCurrency = sanitizeCheckoutCurrency(params.currency)

  // ── FX Quote ──
  console.log(`${LOG_PREFIX} … fetching_fx_quote`, JSON.stringify({ userId, selectedCurrency }))
  const fxStartMs = Date.now()
  const fxQuote = await getUsdToInrQuote()
  const fxDurationMs = Date.now() - fxStartMs
  console.log(`${LOG_PREFIX} ✓ fx_quote`, JSON.stringify({
    userId,
    usdToInr: fxQuote.usdToInr,
    source: fxQuote.source,
    fxDurationMs,
  }))

  const checkoutAmount = getCheckoutAmount({
    baseAmountUsdCents: pack.amountCents,
    currency: selectedCurrency,
    usdToInrRate: fxQuote.usdToInr,
  })

  if (checkoutAmount.amountMinor <= 0) {
    console.error(`${LOG_PREFIX} ✗ zero_amount`, JSON.stringify({
      userId,
      catalogKey,
      selectedCurrency,
      amountMinor: checkoutAmount.amountMinor,
      baseAmountCents: pack.amountCents,
      usdToInr: fxQuote.usdToInr,
    }))
    throw new Error(`Checkout amount resolved to ${checkoutAmount.amountMinor} — cannot create order with zero amount`)
  }

  // ── DB Insert: billing order ──
  console.log(`${LOG_PREFIX} … inserting_order`, JSON.stringify({
    userId,
    catalogKey: pack.key,
    amountMinor: checkoutAmount.amountMinor,
    currency: selectedCurrency,
  }))
  const dbInsertStartMs = Date.now()
  const [order] = await db
    .insert(billingOrders)
    .values({
      userId,
      paymentProvider: 'razorpay',
      catalogKey: pack.key,
      credits: pack.credits,
      currency: selectedCurrency,
      amountSubtotal: checkoutAmount.amountMinor,
      amountTax: 0,
      amountTotal: checkoutAmount.amountMinor,
      baseAmountUsdCents: pack.amountCents,
      amountTotalUsdCents: checkoutAmount.amountTotalUsdCents,
      fxRateUsdToInr: String(fxQuote.usdToInr),
      fxRateTimestamp: new Date(fxQuote.asOf),
      status: 'pending',
      metadata: {
        source: 'razorpay_checkout',
        fxSource: fxQuote.source,
      },
    })
    .returning({
      id: billingOrders.id,
    })
  const dbInsertDurationMs = Date.now() - dbInsertStartMs
  console.log(`${LOG_PREFIX} ✓ order_inserted`, JSON.stringify({
    userId,
    orderId: order.id,
    dbInsertDurationMs,
  }))

  // ── Razorpay API: create order ──
  console.log(`${LOG_PREFIX} … creating_razorpay_order`, JSON.stringify({
    userId,
    orderId: order.id,
    amountMinor: checkoutAmount.amountMinor,
    currency: selectedCurrency,
  }))
  const rpStartMs = Date.now()
  const razorpayOrder = await createRazorpayOrder({
    amountMinor: checkoutAmount.amountMinor,
    currency: selectedCurrency,
    receipt: `ab_${order.id.replace(/-/g, '').slice(0, 32)}`,
    notes: {
      appOrderId: order.id,
      userId,
      catalogKey: pack.key,
      credits: String(pack.credits),
    },
  })
  const rpDurationMs = Date.now() - rpStartMs
  console.log(`${LOG_PREFIX} ✓ razorpay_order_created`, JSON.stringify({
    userId,
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id,
    rpDurationMs,
  }))

  // ── Fallback payment link (optional) ──
  let fallbackPaymentLinkUrl: string | undefined
  try {
    fallbackPaymentLinkUrl = await createFallbackPaymentLinkForOrder({
      orderId: order.id,
      userId,
      email,
      fullName,
    })
  } catch (fallbackError) {
    // Payment-link fallback is optional and must not block checkout.
    console.warn(`${LOG_PREFIX} ⚠ fallback_link_failed`, JSON.stringify({
      userId,
      orderId: order.id,
      error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
    }))
  }

  // ── DB Update: attach Razorpay order ID ──
  await db
    .update(billingOrders)
    .set({
      providerOrderId: razorpayOrder.id,
      updatedAt: new Date(),
    })
    .where(eq(billingOrders.id, order.id))

  return {
    mode: 'razorpay_order',
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id,
    keyId: getRazorpayKeyId(),
    amountMinor: checkoutAmount.amountMinor,
    currency: selectedCurrency,
    name: 'Accessibility.build',
    description: `${pack.name} (${pack.credits.toLocaleString()} credits)`,
    prefill: {
      name: fullName || undefined,
      email: email || undefined,
    },
    notes: {
      appOrderId: order.id,
      catalogKey: pack.key,
      userId,
    },
    fallbackPaymentLinkUrl,
  }
}

export async function createRazorpayPaymentLinkForOrder(params: {
  orderId: string
  userId: string
  email?: string | null
  fullName?: string | null
}): Promise<{ url: string }> {
  const [order] = await db
    .select()
    .from(billingOrders)
    .where(and(eq(billingOrders.id, params.orderId), eq(billingOrders.userId, params.userId)))
    .limit(1)

  if (!order) {
    throw new Error('Order not found')
  }

  if (order.paymentProvider !== 'razorpay') {
    throw new Error('Order does not support Razorpay payment links')
  }

  const metadata = parseOrderMetadata(order.metadata)
  const existingFallbackUrl =
    typeof (metadata as Record<string, unknown>).fallbackPaymentLinkUrl === 'string'
      ? ((metadata as Record<string, unknown>).fallbackPaymentLinkUrl as string)
      : null

  if (existingFallbackUrl) {
    return { url: existingFallbackUrl }
  }

  const url = await createFallbackPaymentLinkForOrder(params)
  return { url }
}

async function claimRazorpayWebhookEvent(input: RazorpayWebhookInput) {
  const [inserted] = await db
    .insert(razorpayWebhookEvents)
    .values({
      eventId: input.eventId,
      eventType: input.eventType,
      processingStatus: 'processing',
      payload: input.payload,
    })
    .onConflictDoNothing()
    .returning({
      eventId: razorpayWebhookEvents.eventId,
    })

  if (inserted) {
    return true
  }

  const [existing] = await db
    .select({
      processingStatus: razorpayWebhookEvents.processingStatus,
    })
    .from(razorpayWebhookEvents)
    .where(eq(razorpayWebhookEvents.eventId, input.eventId))
    .limit(1)

  if (!existing) {
    return false
  }

  if (existing.processingStatus === 'processed') {
    return false
  }

  if (existing.processingStatus === 'failed') {
    const [reclaimed] = await db
      .update(razorpayWebhookEvents)
      .set({
        processingStatus: 'processing',
        errorMessage: null,
        processedAt: null,
        payload: input.payload,
      })
      .where(
        and(
          eq(razorpayWebhookEvents.eventId, input.eventId),
          eq(razorpayWebhookEvents.processingStatus, 'failed')
        )
      )
      .returning({
        eventId: razorpayWebhookEvents.eventId,
      })

    return Boolean(reclaimed)
  }

  throw new Error(`Razorpay webhook ${input.eventId} is already being processed`)
}

async function completeRazorpayWebhookEvent(
  eventId: string,
  payload: { status: 'processed' | 'failed'; orderId?: string; errorMessage?: string }
) {
  await db
    .update(razorpayWebhookEvents)
    .set({
      processingStatus: payload.status,
      orderId: payload.orderId,
      errorMessage: payload.errorMessage,
      processedAt: new Date(),
    })
    .where(eq(razorpayWebhookEvents.eventId, eventId))
}

async function findOrderByProviderRefs(input: {
  orderId?: string | null
  providerOrderId?: string | null
  providerPaymentId?: string | null
}) {
  if (input.orderId) {
    const [orderById] = await db
      .select()
      .from(billingOrders)
      .where(eq(billingOrders.id, input.orderId))
      .limit(1)
    if (orderById) {
      return orderById
    }
  }

  if (input.providerOrderId) {
    const [orderByProviderOrder] = await db
      .select()
      .from(billingOrders)
      .where(eq(billingOrders.providerOrderId, input.providerOrderId))
      .limit(1)
    if (orderByProviderOrder) {
      return orderByProviderOrder
    }
  }

  if (input.providerPaymentId) {
    const [orderByProviderPayment] = await db
      .select()
      .from(billingOrders)
      .where(eq(billingOrders.providerPaymentId, input.providerPaymentId))
      .limit(1)
    if (orderByProviderPayment) {
      return orderByProviderPayment
    }
  }

  return undefined
}

async function grantCreditsForPaidRazorpayOrder(params: {
  orderId: string
  providerOrderId?: string | null
  providerPaymentId?: string | null
  providerPaymentLinkId?: string | null
  amountMinor?: number | null
  eventId: string
}) {
  await db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT ${billingOrders.id} FROM ${billingOrders} WHERE ${billingOrders.id} = ${params.orderId} FOR UPDATE`
    )

    const [order] = await tx
      .select()
      .from(billingOrders)
      .where(eq(billingOrders.id, params.orderId))
      .limit(1)

    if (!order) {
      throw new Error(`Billing order ${params.orderId} not found`)
    }

    if (order.creditTransactionId) {
      return
    }

    if (
      order.status === 'paid' ||
      order.status === 'refunded' ||
      order.status === 'partially_refunded' ||
      order.status === 'action_required'
    ) {
      return
    }

    const [updatedUser] = await tx
      .update(users)
      .set({
        credits: sql`${users.credits} + ${order.credits}`,
        totalCreditsEarned: sql`${users.totalCreditsEarned} + ${order.credits}`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, order.userId))
      .returning({
        credits: users.credits,
      })

    if (!updatedUser) {
      throw new Error(`Could not update user ${order.userId} for order ${order.id}`)
    }

    const balanceAfter = updatedUser.credits
    const balanceBefore = balanceAfter - order.credits

    const [purchaseTransaction] = await tx
      .insert(creditTransactions)
      .values({
        userId: order.userId,
        type: 'purchase',
        amount: order.credits,
        balanceBefore,
        balanceAfter,
        description: `Razorpay purchase: ${order.catalogKey}`,
        status: 'completed',
        metadata: {
          billingOrderId: order.id,
          providerOrderId: params.providerOrderId || order.providerOrderId,
          providerPaymentId: params.providerPaymentId || order.providerPaymentId,
          eventId: params.eventId,
        },
      })
      .returning({
        id: creditTransactions.id,
      })

    const existingMetadata = parseOrderMetadata(order.metadata)

    await tx
      .update(billingOrders)
      .set({
        status: 'paid',
        amountSubtotal: params.amountMinor ?? order.amountSubtotal,
        amountTotal: params.amountMinor ?? order.amountTotal,
        providerOrderId: params.providerOrderId || order.providerOrderId,
        providerPaymentId: params.providerPaymentId || order.providerPaymentId,
        providerPaymentLinkId: params.providerPaymentLinkId || order.providerPaymentLinkId,
        creditTransactionId: purchaseTransaction.id,
        metadata: {
          ...existingMetadata,
          purchaseTransactionId: purchaseTransaction.id,
          billingProvider: 'razorpay',
          providerOrderId: params.providerOrderId || order.providerOrderId || undefined,
          providerPaymentId: params.providerPaymentId || order.providerPaymentId || undefined,
          providerPaymentLinkId:
            params.providerPaymentLinkId || order.providerPaymentLinkId || undefined,
        },
        failureReason: null,
        updatedAt: new Date(),
      })
      .where(eq(billingOrders.id, order.id))
  })

  // Send purchase confirmation email (fire-and-forget, outside transaction)
  try {
    const [paidOrder] = await db
      .select({
        id: billingOrders.id,
        userId: billingOrders.userId,
        catalogKey: billingOrders.catalogKey,
        credits: billingOrders.credits,
        amountTotal: billingOrders.amountTotal,
        currency: billingOrders.currency,
      })
      .from(billingOrders)
      .where(eq(billingOrders.id, params.orderId))
      .limit(1)

    if (paidOrder) {
      const [paidUser] = await db
        .select({ email: users.email, firstName: users.firstName, lastName: users.lastName, credits: users.credits })
        .from(users)
        .where(eq(users.id, paidOrder.userId))
        .limit(1)

      if (paidUser) {
        const pack = getCatalogPack(paidOrder.catalogKey as CatalogKey)
        sendPurchaseConfirmationEmail({
          type: 'purchase_confirmation',
          recipient: { email: paidUser.email, firstName: paidUser.firstName, lastName: paidUser.lastName },
          orderId: paidOrder.id,
          packName: pack.name,
          credits: paidOrder.credits,
          amountFormatted: formatAmountForEmail(paidOrder.amountTotal, paidOrder.currency),
          currency: paidOrder.currency,
          paymentProvider: 'razorpay',
          newBalance: paidUser.credits,
        })
      }
    }
  } catch {
    // Email dispatch must never fail the payment flow
  }
}

async function markRazorpayOrderFailed(params: {
  orderId?: string | null
  providerOrderId?: string | null
  providerPaymentId?: string | null
  reason?: string
}) {
  const order = await findOrderByProviderRefs(params)
  if (!order) {
    return undefined
  }

  await db
    .update(billingOrders)
    .set({
      status: order.status === 'pending' ? 'failed' : order.status,
      failureReason:
        order.status === 'pending'
          ? params.reason || 'Payment failed at Razorpay'
          : order.failureReason,
      providerOrderId: params.providerOrderId || order.providerOrderId,
      providerPaymentId: params.providerPaymentId || order.providerPaymentId,
      updatedAt: new Date(),
    })
    .where(eq(billingOrders.id, order.id))

  return order.id
}

async function handleRazorpayRefund(params: {
  eventId: string
  providerRefundId?: string | null
  providerPaymentId?: string | null
  providerOrderId?: string | null
  amountMinor: number
}) {
  const order = await findOrderByProviderRefs({
    providerPaymentId: params.providerPaymentId,
    providerOrderId: params.providerOrderId,
  })

  if (!order) {
    return undefined
  }

  await db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT ${billingOrders.id} FROM ${billingOrders} WHERE ${billingOrders.id} = ${order.id} FOR UPDATE`
    )

    const [currentOrder] = await tx
      .select()
      .from(billingOrders)
      .where(eq(billingOrders.id, order.id))
      .limit(1)

    if (!currentOrder) {
      throw new Error(`Billing order ${order.id} disappeared during refund handling`)
    }

    const metadata = parseOrderMetadata(currentOrder.metadata)
    const alreadyRefundedCredits = Number(metadata.refundedCredits || 0)
    const orderTotal = Math.max(currentOrder.amountTotal, 1)
    const refundRatio = Math.min(1, params.amountMinor / orderTotal)
    const targetRefundedCredits = Math.min(
      currentOrder.credits,
      Math.round(currentOrder.credits * refundRatio)
    )
    const creditsToReverse = Math.max(0, targetRefundedCredits - alreadyRefundedCredits)

    if (creditsToReverse <= 0) {
      const status: BillingOrderStatus =
        targetRefundedCredits >= currentOrder.credits ? 'refunded' : 'partially_refunded'

      await tx
        .update(billingOrders)
        .set({
          status,
          providerRefundId: params.providerRefundId || currentOrder.providerRefundId,
          metadata: {
            ...metadata,
            refundedCredits: Math.max(alreadyRefundedCredits, targetRefundedCredits),
          },
          updatedAt: new Date(),
        })
        .where(eq(billingOrders.id, currentOrder.id))

      return
    }

    const [currentUser] = await tx
      .select({
        id: users.id,
        credits: users.credits,
      })
      .from(users)
      .where(eq(users.id, currentOrder.userId))
      .limit(1)

    if (!currentUser) {
      throw new Error(`User ${currentOrder.userId} not found for refund order ${currentOrder.id}`)
    }

    if (currentUser.credits < creditsToReverse) {
      await tx
        .update(users)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(users.id, currentUser.id))

      await tx
        .update(billingOrders)
        .set({
          status: 'action_required',
          failureReason: 'Refund exceeded available credits; account placed on hold',
          providerRefundId: params.providerRefundId || currentOrder.providerRefundId,
          metadata: {
            ...metadata,
            actionRequiredReason: 'insufficient_credits_for_refund_reversal',
            refundedCredits: alreadyRefundedCredits,
            refundEvents: [
              ...(metadata.refundEvents || []),
              {
                eventId: params.eventId,
                providerPaymentId: params.providerPaymentId || currentOrder.providerPaymentId || undefined,
                refundId: params.providerRefundId || undefined,
                amountRefunded: params.amountMinor,
                creditsReversed: 0,
                timestamp: new Date().toISOString(),
              },
            ],
          },
          updatedAt: new Date(),
        })
        .where(eq(billingOrders.id, currentOrder.id))

      return
    }

    const [updatedUser] = await tx
      .update(users)
      .set({
        credits: sql`${users.credits} - ${creditsToReverse}`,
        totalCreditsUsed: sql`${users.totalCreditsUsed} + ${creditsToReverse}`,
        updatedAt: new Date(),
      })
      .where(and(eq(users.id, currentUser.id), sql`${users.credits} >= ${creditsToReverse}`))
      .returning({
        credits: users.credits,
      })

    if (!updatedUser) {
      throw new Error('Credit reversal failed due to concurrent balance update')
    }

    const balanceAfter = updatedUser.credits
    const balanceBefore = balanceAfter + creditsToReverse

    const [refundTransaction] = await tx
      .insert(creditTransactions)
      .values({
        userId: currentOrder.userId,
        type: 'refund',
        amount: -creditsToReverse,
        balanceBefore,
        balanceAfter,
        description: `Credit reversal for Razorpay refund: ${currentOrder.catalogKey}`,
        status: 'completed',
        metadata: {
          billingOrderId: currentOrder.id,
          providerPaymentId: params.providerPaymentId || currentOrder.providerPaymentId,
          providerRefundId: params.providerRefundId || currentOrder.providerRefundId,
          creditsReversed: creditsToReverse,
        },
      })
      .returning({
        id: creditTransactions.id,
      })

    const totalRefundedCredits = alreadyRefundedCredits + creditsToReverse
    const nextStatus: BillingOrderStatus =
      totalRefundedCredits >= currentOrder.credits ? 'refunded' : 'partially_refunded'

    await tx
      .update(billingOrders)
      .set({
        status: nextStatus,
        providerRefundId: params.providerRefundId || currentOrder.providerRefundId,
        metadata: {
          ...metadata,
          refundedCredits: totalRefundedCredits,
          refundTransactionIds: [
            ...(metadata.refundTransactionIds || []),
            refundTransaction.id,
          ],
          refundEvents: [
            ...(metadata.refundEvents || []),
            {
              eventId: params.eventId,
              providerPaymentId: params.providerPaymentId || currentOrder.providerPaymentId || undefined,
              refundId: params.providerRefundId || undefined,
              amountRefunded: params.amountMinor,
              creditsReversed: creditsToReverse,
              timestamp: new Date().toISOString(),
            },
          ],
        },
        updatedAt: new Date(),
      })
      .where(eq(billingOrders.id, currentOrder.id))
  })

  // Send refund notification email (fire-and-forget, outside transaction)
  try {
    const [refundedOrder] = await db
      .select({
        id: billingOrders.id,
        userId: billingOrders.userId,
        catalogKey: billingOrders.catalogKey,
        currency: billingOrders.currency,
      })
      .from(billingOrders)
      .where(eq(billingOrders.id, order.id))
      .limit(1)

    if (refundedOrder) {
      const [refundUser] = await db
        .select({ email: users.email, firstName: users.firstName, lastName: users.lastName, credits: users.credits })
        .from(users)
        .where(eq(users.id, refundedOrder.userId))
        .limit(1)

      if (refundUser) {
        const pack = getCatalogPack(refundedOrder.catalogKey as CatalogKey)
        sendRefundNotificationEmail({
          type: 'refund_notification',
          recipient: { email: refundUser.email, firstName: refundUser.firstName, lastName: refundUser.lastName },
          orderId: refundedOrder.id,
          packName: pack.name,
          creditsReversed: params.amountMinor > 0 ? Math.round(order.credits * Math.min(1, params.amountMinor / Math.max(order.amountTotal, 1))) : 0,
          refundAmountFormatted: formatAmountForEmail(params.amountMinor, refundedOrder.currency),
          currency: refundedOrder.currency,
          remainingBalance: refundUser.credits,
        })
      }
    }
  } catch {
    // Email dispatch must never fail the refund flow
  }

  return order.id
}

function getNestedEntity(payload: Record<string, unknown>, key: string) {
  const root = payload.payload as Record<string, unknown> | undefined
  const container = root?.[key] as Record<string, unknown> | undefined
  return (container?.entity as Record<string, unknown> | undefined) || undefined
}

function getString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function getNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

export async function processRazorpayWebhookEvent(input: RazorpayWebhookInput) {
  const claimed = await claimRazorpayWebhookEvent(input)

  if (!claimed) {
    await logBillingFunnelEvent({
      eventType: 'webhook_duplicate',
      eventSource: 'service:processRazorpayWebhookEvent',
      paymentProvider: 'razorpay',
      status: 'duplicate',
      metadata: {
        razorpayEventId: input.eventId,
        razorpayEventType: input.eventType,
      },
    })

    return { duplicate: true as const, orderId: undefined }
  }

  let processedOrderId: string | undefined

  try {
    switch (input.eventType) {
      case 'payment.captured': {
        const payment = getNestedEntity(input.payload, 'payment')
        const notes = (payment?.notes as Record<string, unknown> | undefined) || {}
        const providerPaymentId = getString(payment?.id)
        const providerOrderId = getString(payment?.order_id)
        const appOrderId = getString(notes.appOrderId)
        const amountMinor = getNumber(payment?.amount)
        const currency = sanitizeCheckoutCurrency(getString(payment?.currency))

        const order = await findOrderByProviderRefs({
          orderId: appOrderId,
          providerOrderId,
          providerPaymentId,
        })

        if (order) {
          await grantCreditsForPaidRazorpayOrder({
            orderId: order.id,
            providerOrderId,
            providerPaymentId,
            amountMinor,
            eventId: input.eventId,
          })
          processedOrderId = order.id
        }

        await logBillingFunnelEvent({
          eventType: 'webhook_paid',
          eventSource: 'service:processRazorpayWebhookEvent',
          paymentProvider: 'razorpay',
          orderId: processedOrderId,
          currency,
          providerOrderId,
          providerPaymentId,
          status: 'captured',
          metadata: {
            razorpayEventId: input.eventId,
            razorpayEventType: input.eventType,
          },
        })
        break
      }

      case 'payment.failed': {
        const payment = getNestedEntity(input.payload, 'payment')
        const notes = (payment?.notes as Record<string, unknown> | undefined) || {}
        const providerPaymentId = getString(payment?.id)
        const providerOrderId = getString(payment?.order_id)
        const appOrderId = getString(notes.appOrderId)
        const error = (payment?.error_description as string | undefined) || 'Payment failed at Razorpay'

        processedOrderId = await markRazorpayOrderFailed({
          orderId: appOrderId,
          providerOrderId,
          providerPaymentId,
          reason: error,
        })

        await logBillingFunnelEvent({
          eventType: 'webhook_failed',
          eventSource: 'service:processRazorpayWebhookEvent',
          paymentProvider: 'razorpay',
          orderId: processedOrderId,
          providerOrderId,
          providerPaymentId,
          status: 'failed',
          metadata: {
            razorpayEventId: input.eventId,
            razorpayEventType: input.eventType,
            error,
          },
        })
        break
      }

      case 'payment_link.paid': {
        const link = getNestedEntity(input.payload, 'payment_link')
        const linkNotes = (link?.notes as Record<string, unknown> | undefined) || {}
        const appOrderId = getString(link?.reference_id) || getString(linkNotes.appOrderId)
        const providerPaymentLinkId = getString(link?.id)
        const paymentIdFromLink = Array.isArray(link?.payments)
          ? getString((link?.payments as Array<Record<string, unknown>>)[0]?.payment_id)
          : undefined

        let providerOrderId: string | undefined
        let providerPaymentId = paymentIdFromLink
        let amountMinor: number | undefined
        let currency: CheckoutCurrency = 'USD'

        if (providerPaymentId) {
          const payment = await fetchRazorpayPayment(providerPaymentId).catch(() => null)
          providerOrderId = payment?.order_id
          amountMinor = payment?.amount
          currency = sanitizeCheckoutCurrency(payment?.currency)
        }

        const order = await findOrderByProviderRefs({
          orderId: appOrderId,
          providerOrderId,
          providerPaymentId,
        })

        if (order) {
          await grantCreditsForPaidRazorpayOrder({
            orderId: order.id,
            providerOrderId: providerOrderId || order.providerOrderId,
            providerPaymentId: providerPaymentId || order.providerPaymentId,
            providerPaymentLinkId: providerPaymentLinkId || order.providerPaymentLinkId,
            amountMinor,
            eventId: input.eventId,
          })
          processedOrderId = order.id
        }

        await logBillingFunnelEvent({
          eventType: 'webhook_paid',
          eventSource: 'service:processRazorpayWebhookEvent',
          paymentProvider: 'razorpay',
          orderId: processedOrderId,
          currency,
          providerOrderId,
          providerPaymentId,
          status: 'payment_link_paid',
          metadata: {
            razorpayEventId: input.eventId,
            razorpayEventType: input.eventType,
            providerPaymentLinkId,
          },
        })
        break
      }

      case 'refund.processed':
      case 'payment.refunded': {
        const refund = getNestedEntity(input.payload, 'refund')
        const providerRefundId = getString(refund?.id)
        const providerPaymentId = getString(refund?.payment_id)
        const providerOrderId = getString(refund?.order_id)
        const amountMinor = getNumber(refund?.amount) || 0

        processedOrderId = await handleRazorpayRefund({
          eventId: input.eventId,
          providerRefundId,
          providerPaymentId,
          providerOrderId,
          amountMinor,
        })

        await logBillingFunnelEvent({
          eventType: 'webhook_refund',
          eventSource: 'service:processRazorpayWebhookEvent',
          paymentProvider: 'razorpay',
          orderId: processedOrderId,
          providerOrderId,
          providerPaymentId,
          status: 'refunded',
          metadata: {
            razorpayEventId: input.eventId,
            razorpayEventType: input.eventType,
            providerRefundId,
            amountMinor,
          },
        })
        break
      }

      default: {
        await logBillingFunnelEvent({
          eventType: 'webhook_pending',
          eventSource: 'service:processRazorpayWebhookEvent',
          paymentProvider: 'razorpay',
          status: `ignored:${input.eventType}`,
          metadata: {
            razorpayEventId: input.eventId,
            razorpayEventType: input.eventType,
          },
        })
      }
    }

    await completeRazorpayWebhookEvent(input.eventId, {
      status: 'processed',
      orderId: processedOrderId,
    })

    return {
      duplicate: false as const,
      orderId: processedOrderId,
    }
  } catch (error) {
    await completeRazorpayWebhookEvent(input.eventId, {
      status: 'failed',
      orderId: processedOrderId,
      errorMessage: error instanceof Error ? error.message : String(error),
    })

    await logBillingFunnelEvent({
      eventType: 'webhook_error',
      eventSource: 'service:processRazorpayWebhookEvent',
      paymentProvider: 'razorpay',
      orderId: processedOrderId,
      status: 'failed',
      errorCode: 'webhook_processing_error',
      errorMessage: error instanceof Error ? error.message : String(error),
      metadata: {
        razorpayEventId: input.eventId,
        razorpayEventType: input.eventType,
      },
    })

    throw error
  }
}
