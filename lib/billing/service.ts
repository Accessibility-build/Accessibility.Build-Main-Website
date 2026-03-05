import Stripe from 'stripe'
import { and, desc, eq, lte, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  billingOrders,
  creditTransactions,
  stripeWebhookEvents,
  users,
} from '@/lib/db/schema'
import {
  getCatalogPack,
  getStripePriceIdForCatalogKey,
  isCheckoutCatalogKey,
} from './catalog'
import {
  MIN_ADMIN_BILLING_REASON_LENGTH,
  normalizeAdminBillingReason,
} from './admin-operations'
import {
  BillingOrderMetadata,
  BillingOrderStatus,
  CatalogKey,
  CheckoutCurrency,
  CheckoutSessionResponse,
} from './types'
import {
  getPublicAppUrl,
  getStripeClient,
  getStripePortalConfigurationId,
} from './stripe'
import { logBillingFunnelEvent } from './events'
import { getBillingProvider } from './provider'
import {
  createRazorpayCheckoutForCatalog,
  createRazorpayPaymentLinkForOrder,
  processRazorpayWebhookEvent,
} from './razorpay-service'
import { sendPurchaseConfirmationEmail, sendRefundNotificationEmail, formatAmountForEmail } from '@/lib/email/service'

type CustomerInput = {
  userId: string
  email?: string | null
  fullName?: string | null
}

const STALE_WEBHOOK_PROCESSING_MS = 5 * 60 * 1000

function parseOrderMetadata(metadata: unknown): BillingOrderMetadata {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return {}
  }

  return metadata as BillingOrderMetadata
}

function sanitizeReturnPath(returnPath: string | undefined, fallback: string) {
  if (!returnPath) {
    return fallback
  }

  const trimmed = returnPath.trim()
  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.includes('\\') ||
    /[\u0000-\u001F]/.test(trimmed)
  ) {
    return fallback
  }

  return trimmed
}

async function ensureStripeCustomerForUser({ userId, email, fullName }: CustomerInput) {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      stripeCustomerId: users.stripeCustomerId,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    throw new Error('User record not found for billing')
  }

  if (user.stripeCustomerId) {
    return user.stripeCustomerId
  }

  const stripe = getStripeClient()

  const customer = await stripe.customers.create(
    {
      email: email || user.email || undefined,
      name:
        fullName ||
        [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
        undefined,
      metadata: {
        userId,
      },
    },
    {
      idempotencyKey: `create_customer_for_user_${userId}`,
    }
  )

  await db
    .update(users)
    .set({
      stripeCustomerId: customer.id,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))

  return customer.id
}

export async function createCheckoutSessionForCatalog(params: {
  userId: string
  email?: string | null
  fullName?: string | null
  catalogKey: CatalogKey
}) {
  const { userId, email, fullName, catalogKey } = params
  const pack = getCatalogPack(catalogKey)

  if (!pack.checkoutEnabled || !isCheckoutCatalogKey(pack.key)) {
    throw new Error('Selected catalog pack is not checkout enabled')
  }

  const stripe = getStripeClient()
  const appUrl = getPublicAppUrl()
  const customerId = await ensureStripeCustomerForUser({ userId, email, fullName })

  const [order] = await db
    .insert(billingOrders)
    .values({
      userId,
      catalogKey: pack.key,
      credits: pack.credits,
      currency: pack.baseCurrency,
      amountSubtotal: pack.amountCents,
      amountTax: 0,
      amountTotal: pack.amountCents,
      status: 'pending',
      stripeCustomerId: customerId,
      metadata: {
        source: 'stripe_checkout',
      },
    })
    .returning({
      id: billingOrders.id,
    })

  const priceId = getStripePriceIdForCatalogKey(pack.key)

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      automatic_tax: {
        enabled: true,
      },
      invoice_creation: {
        enabled: true,
      },
      metadata: {
        orderId: order.id,
        userId,
        catalogKey: pack.key,
        credits: String(pack.credits),
      },
      success_url: `${appUrl}/billing?checkout=success&order=${order.id}`,
      cancel_url: `${appUrl}/billing?checkout=cancelled&order=${order.id}`,
    })
  } catch (error) {
    await db
      .update(billingOrders)
      .set({
        status: 'failed',
        failureReason:
          error instanceof Error ? `Checkout session creation failed: ${error.message}` : 'Checkout session creation failed',
        updatedAt: new Date(),
      })
      .where(eq(billingOrders.id, order.id))

    throw error
  }

  await db
    .update(billingOrders)
    .set({
      stripeCheckoutSessionId: session.id,
      updatedAt: new Date(),
    })
    .where(eq(billingOrders.id, order.id))

  if (!session.url) {
    await db
      .update(billingOrders)
      .set({
        status: 'failed',
        failureReason: 'Checkout session was created without a redirect URL',
        updatedAt: new Date(),
      })
      .where(eq(billingOrders.id, order.id))

    throw new Error('Stripe checkout session did not return a URL')
  }

  return {
    orderId: order.id,
    url: session.url,
  }
}

export async function createProviderCheckoutSessionForCatalog(params: {
  userId: string
  email?: string | null
  fullName?: string | null
  catalogKey: CatalogKey
  currency?: CheckoutCurrency
}): Promise<CheckoutSessionResponse> {
  const provider = getBillingProvider()

  if (provider === 'razorpay') {
    return createRazorpayCheckoutForCatalog({
      userId: params.userId,
      email: params.email,
      fullName: params.fullName,
      catalogKey: params.catalogKey,
      currency: params.currency,
    })
  }

  const stripeSession = await createCheckoutSessionForCatalog({
    userId: params.userId,
    email: params.email,
    fullName: params.fullName,
    catalogKey: params.catalogKey,
  })

  return {
    mode: 'payment_link',
    orderId: stripeSession.orderId,
    url: stripeSession.url,
  }
}

export async function createProviderPaymentLinkForOrder(params: {
  orderId: string
  userId: string
  email?: string | null
  fullName?: string | null
}) {
  const provider = getBillingProvider()
  if (provider === 'razorpay') {
    return createRazorpayPaymentLinkForOrder(params)
  }

  throw new Error('Payment link fallback is only available for Razorpay')
}

export async function createManageSessionForUser(params: {
  userId: string
  email?: string | null
  fullName?: string | null
  returnPath?: string
}) {
  const provider = getBillingProvider()
  const appUrl = getPublicAppUrl()
  const returnPath = sanitizeReturnPath(params.returnPath, '/billing/manage')

  if (provider === 'razorpay') {
    return {
      url: `${appUrl}${returnPath}`,
    }
  }

  return createPortalSessionForUser(params)
}

export async function createPortalSessionForUser(params: {
  userId: string
  email?: string | null
  fullName?: string | null
  returnPath?: string
}) {
  const stripe = getStripeClient()
  const appUrl = getPublicAppUrl()
  const configuration = getStripePortalConfigurationId()

  const customerId = await ensureStripeCustomerForUser(params)

  const returnPath = sanitizeReturnPath(params.returnPath, '/billing')
  const returnUrl = `${appUrl}${returnPath}`

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    configuration,
    return_url: returnUrl,
  })

  return {
    url: session.url,
  }
}

export async function getBillingOrdersForUser(
  userId: string,
  limit = 30,
  options?: { includeProviders?: 'all' | 'active' }
) {
  const provider = getBillingProvider()
  const includeAll = options?.includeProviders === 'all'

  return db
    .select({
      id: billingOrders.id,
      paymentProvider: billingOrders.paymentProvider,
      catalogKey: billingOrders.catalogKey,
      credits: billingOrders.credits,
      currency: billingOrders.currency,
      amountSubtotal: billingOrders.amountSubtotal,
      amountTax: billingOrders.amountTax,
      amountTotal: billingOrders.amountTotal,
      baseAmountUsdCents: billingOrders.baseAmountUsdCents,
      amountTotalUsdCents: billingOrders.amountTotalUsdCents,
      fxRateUsdToInr: billingOrders.fxRateUsdToInr,
      fxRateTimestamp: billingOrders.fxRateTimestamp,
      providerOrderId: billingOrders.providerOrderId,
      providerPaymentId: billingOrders.providerPaymentId,
      providerPaymentLinkId: billingOrders.providerPaymentLinkId,
      providerRefundId: billingOrders.providerRefundId,
      status: billingOrders.status,
      stripeInvoiceId: billingOrders.stripeInvoiceId,
      stripeCheckoutSessionId: billingOrders.stripeCheckoutSessionId,
      stripePaymentIntentId: billingOrders.stripePaymentIntentId,
      stripeChargeId: billingOrders.stripeChargeId,
      stripeRefundId: billingOrders.stripeRefundId,
      failureReason: billingOrders.failureReason,
      metadata: billingOrders.metadata,
      createdAt: billingOrders.createdAt,
      updatedAt: billingOrders.updatedAt,
    })
    .from(billingOrders)
    .where(
      includeAll
        ? eq(billingOrders.userId, userId)
        : and(eq(billingOrders.userId, userId), eq(billingOrders.paymentProvider, provider))
    )
    .orderBy(desc(billingOrders.createdAt))
    .limit(limit)
}

export async function markBillingOrderPaidManually(params: {
  orderId: string
  adminId: string
  reason: string
  providerPaymentId?: string
  providerOrderId?: string
}) {
  const trimmedReason = normalizeAdminBillingReason(params.reason)
  if (!trimmedReason) {
    throw new Error('MANUAL_MARK_REASON_REQUIRED')
  }
  if (trimmedReason.length < MIN_ADMIN_BILLING_REASON_LENGTH) {
    throw new Error('MANUAL_MARK_REASON_TOO_SHORT')
  }

  return db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT ${billingOrders.id} FROM ${billingOrders} WHERE ${billingOrders.id} = ${params.orderId} FOR UPDATE`
    )

    const [order] = await tx
      .select()
      .from(billingOrders)
      .where(eq(billingOrders.id, params.orderId))
      .limit(1)

    if (!order) {
      throw new Error('BILLING_ORDER_NOT_FOUND')
    }

    const nextProviderOrderId = params.providerOrderId?.trim() || order.providerOrderId
    const nextProviderPaymentId = params.providerPaymentId?.trim() || order.providerPaymentId

    if (order.creditTransactionId) {
      return {
        orderId: order.id,
        status: order.status,
        creditsGranted: false,
        creditTransactionId: order.creditTransactionId,
        providerOrderId: nextProviderOrderId || null,
        providerPaymentId: nextProviderPaymentId || null,
      }
    }

    if (
      order.status === 'refunded' ||
      order.status === 'partially_refunded' ||
      order.status === 'action_required'
    ) {
      throw new Error('BILLING_ORDER_NOT_SETTLEABLE')
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
        description: `Admin manual settlement: ${order.catalogKey}`,
        status: 'completed',
        metadata: {
          billingOrderId: order.id,
          providerOrderId: nextProviderOrderId || undefined,
          providerPaymentId: nextProviderPaymentId || undefined,
          adminManualSettlement: true,
          adminId: params.adminId,
          reason: trimmedReason,
        },
      })
      .returning({
        id: creditTransactions.id,
      })

    const existingMetadata = parseOrderMetadata(order.metadata)
    const manualSettlements = Array.isArray(existingMetadata.manualSettlements)
      ? existingMetadata.manualSettlements
      : []

    await tx
      .update(billingOrders)
      .set({
        status: 'paid',
        providerOrderId: nextProviderOrderId || null,
        providerPaymentId: nextProviderPaymentId || null,
        creditTransactionId: purchaseTransaction.id,
        metadata: {
          ...existingMetadata,
          billingProvider: order.paymentProvider,
          providerOrderId: nextProviderOrderId || undefined,
          providerPaymentId: nextProviderPaymentId || undefined,
          purchaseTransactionId: purchaseTransaction.id,
          manualSettlements: [
            ...manualSettlements,
            {
              action: 'mark_paid',
              settledAt: new Date().toISOString(),
              settledBy: params.adminId,
              reason: trimmedReason,
              providerOrderId: nextProviderOrderId || null,
              providerPaymentId: nextProviderPaymentId || null,
            },
          ],
        },
        failureReason: null,
        updatedAt: new Date(),
      })
      .where(eq(billingOrders.id, order.id))

    return {
      orderId: order.id,
      status: 'paid' as const,
      creditsGranted: true,
      creditTransactionId: purchaseTransaction.id,
      providerOrderId: nextProviderOrderId || null,
      providerPaymentId: nextProviderPaymentId || null,
    }
  })
}

export async function processProviderWebhookEvent(params: {
  provider: 'stripe' | 'razorpay'
  eventId: string
  eventType?: string
  payload: Record<string, unknown>
}) {
  if (params.provider === 'razorpay') {
    return processRazorpayWebhookEvent({
      eventId: params.eventId,
      eventType: params.eventType || '',
      payload: params.payload,
    })
  }

  throw new Error('Use processStripeWebhookEvent for Stripe events')
}

async function claimStripeWebhookEvent(event: Stripe.Event) {
  const [inserted] = await db
    .insert(stripeWebhookEvents)
    .values({
      eventId: event.id,
      eventType: event.type,
      livemode: event.livemode,
      processingStatus: 'processing',
      payload: event,
    })
    .onConflictDoNothing()
    .returning({
      eventId: stripeWebhookEvents.eventId,
    })

  if (inserted) {
    return true
  }

  const [existing] = await db
    .select({
      processingStatus: stripeWebhookEvents.processingStatus,
      processedAt: stripeWebhookEvents.processedAt,
      createdAt: stripeWebhookEvents.createdAt,
    })
    .from(stripeWebhookEvents)
    .where(eq(stripeWebhookEvents.eventId, event.id))
    .limit(1)

  if (!existing) {
    return false
  }

  if (existing.processingStatus === 'processed') {
    return false
  }

  if (existing?.processingStatus === 'failed') {
    const reclaimedFailed = await db
      .update(stripeWebhookEvents)
      .set({
        processingStatus: 'processing',
        errorMessage: null,
        processedAt: null,
        payload: event,
      })
      .where(
        and(
          eq(stripeWebhookEvents.eventId, event.id),
          eq(stripeWebhookEvents.processingStatus, 'failed')
        )
      )
      .returning({
        eventId: stripeWebhookEvents.eventId,
      })

    if (reclaimedFailed[0]) {
      return true
    }

    throw new Error(`Stripe webhook event ${event.id} changed state while reclaiming failed event`)
  }

  if (existing.processingStatus === 'processing') {
    const staleThreshold = new Date(Date.now() - STALE_WEBHOOK_PROCESSING_MS)
    const isStale = !existing.processedAt && existing.createdAt <= staleThreshold

    if (isStale) {
      const reclaimedStale = await db
        .update(stripeWebhookEvents)
        .set({
          processingStatus: 'processing',
          errorMessage: null,
          processedAt: null,
          payload: event,
        })
        .where(
          and(
            eq(stripeWebhookEvents.eventId, event.id),
            eq(stripeWebhookEvents.processingStatus, 'processing'),
            sql`${stripeWebhookEvents.processedAt} IS NULL`,
            lte(stripeWebhookEvents.createdAt, staleThreshold)
          )
        )
        .returning({
          eventId: stripeWebhookEvents.eventId,
        })

      if (reclaimedStale[0]) {
        return true
      }
    }

    throw new Error(`Stripe webhook event ${event.id} is already being processed`)
  }

  return false
}

async function completeStripeWebhookEvent(eventId: string, payload: {
  status: 'processed' | 'failed'
  orderId?: string
  errorMessage?: string
}) {
  await db
    .update(stripeWebhookEvents)
    .set({
      processingStatus: payload.status,
      orderId: payload.orderId,
      errorMessage: payload.errorMessage,
      processedAt: new Date(),
    })
    .where(eq(stripeWebhookEvents.eventId, eventId))
}

async function findOrderBySession(session: Stripe.Checkout.Session) {
  const orderIdFromMetadata = session.metadata?.orderId

  if (orderIdFromMetadata) {
    const [metadataMatch] = await db
      .select()
      .from(billingOrders)
      .where(eq(billingOrders.id, orderIdFromMetadata))
      .limit(1)

    if (metadataMatch) {
      return metadataMatch
    }
  }

  const [sessionMatch] = await db
    .select()
    .from(billingOrders)
    .where(eq(billingOrders.stripeCheckoutSessionId, session.id))
    .limit(1)

  return sessionMatch
}

async function resolvePaymentIntentDetails(paymentIntentId: string | null | undefined) {
  if (!paymentIntentId) {
    return {
      paymentIntentId: null,
      chargeId: null,
    }
  }

  const stripe = getStripeClient()
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ['latest_charge'],
  })

  return {
    paymentIntentId,
    chargeId:
      typeof paymentIntent.latest_charge === 'string'
        ? paymentIntent.latest_charge
        : paymentIntent.latest_charge?.id || null,
  }
}

async function grantCreditsForPaidOrder(orderId: string, session: Stripe.Checkout.Session) {
  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id || null

  const invoiceId =
    typeof session.invoice === 'string' ? session.invoice : session.invoice?.id || null

  const paymentIntent = await resolvePaymentIntentDetails(paymentIntentId)

  await db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT ${billingOrders.id} FROM ${billingOrders} WHERE ${billingOrders.id} = ${orderId} FOR UPDATE`
    )

    const [order] = await tx
      .select()
      .from(billingOrders)
      .where(eq(billingOrders.id, orderId))
      .limit(1)

    if (!order) {
      throw new Error(`Billing order ${orderId} not found`)
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

    if (order.status !== 'pending' && order.status !== 'failed') {
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
      throw new Error(`Could not update user ${order.userId} for paid order ${order.id}`)
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
        description: `Stripe purchase: ${order.catalogKey}`,
        status: 'completed',
        metadata: {
          billingOrderId: order.id,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntent.paymentIntentId,
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
        amountSubtotal: session.amount_subtotal ?? order.amountSubtotal,
        amountTax: session.total_details?.amount_tax ?? order.amountTax,
        amountTotal: session.amount_total ?? order.amountTotal,
        stripePaymentIntentId: paymentIntent.paymentIntentId,
        stripeInvoiceId: invoiceId,
        stripeChargeId: paymentIntent.chargeId,
        creditTransactionId: purchaseTransaction.id,
        metadata: {
          ...existingMetadata,
          purchaseTransactionId: purchaseTransaction.id,
        },
        failureReason: null,
        updatedAt: new Date(),
      })
      .where(eq(billingOrders.id, order.id))
  })
}

async function markOrderAsyncFailure(session: Stripe.Checkout.Session) {
  const order = await findOrderBySession(session)

  if (!order) {
    return undefined
  }

  await db
    .update(billingOrders)
    .set({
      status: order.status === 'pending' ? 'failed' : order.status,
      failureReason: order.status === 'pending' ? 'Async payment failed' : order.failureReason,
      updatedAt: new Date(),
    })
    .where(eq(billingOrders.id, order.id))

  return order.id
}

async function handleRefundedCharge(charge: Stripe.Charge, eventId: string) {
  const paymentIntentId =
    typeof charge.payment_intent === 'string'
      ? charge.payment_intent
      : charge.payment_intent?.id || null

  const [orderByCharge] = await db
    .select()
    .from(billingOrders)
    .where(eq(billingOrders.stripeChargeId, charge.id))
    .limit(1)

  const order =
    orderByCharge ||
    (paymentIntentId
      ? (
          await db
            .select()
            .from(billingOrders)
            .where(eq(billingOrders.stripePaymentIntentId, paymentIntentId))
            .limit(1)
        )[0]
      : null)

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
    const refundRatio = Math.min(1, charge.amount_refunded / orderTotal)
    const targetRefundedCredits = Math.min(
      currentOrder.credits,
      Math.round(currentOrder.credits * refundRatio)
    )
    const creditsToReverse = Math.max(0, targetRefundedCredits - alreadyRefundedCredits)

    const latestRefundId = charge.refunds?.data?.[0]?.id

    if (creditsToReverse <= 0) {
      const status: BillingOrderStatus =
        targetRefundedCredits >= currentOrder.credits ? 'refunded' : 'partially_refunded'

      await tx
        .update(billingOrders)
        .set({
          status,
          stripeRefundId: latestRefundId || currentOrder.stripeRefundId,
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
          stripeRefundId: latestRefundId || currentOrder.stripeRefundId,
          metadata: {
            ...metadata,
            actionRequiredReason: 'insufficient_credits_for_refund_reversal',
            refundedCredits: alreadyRefundedCredits,
            refundEvents: [
              ...(metadata.refundEvents || []),
              {
                eventId,
                chargeId: charge.id,
                refundId: latestRefundId,
                amountRefunded: charge.amount_refunded,
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
        description: `Credit reversal for Stripe refund: ${currentOrder.catalogKey}`,
        status: 'completed',
        metadata: {
          billingOrderId: currentOrder.id,
          stripeChargeId: charge.id,
          stripeRefundId: latestRefundId,
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
        stripeRefundId: latestRefundId || currentOrder.stripeRefundId,
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
              eventId,
              chargeId: charge.id,
              refundId: latestRefundId,
              amountRefunded: charge.amount_refunded,
              creditsReversed: creditsToReverse,
              timestamp: new Date().toISOString(),
            },
          ],
        },
        updatedAt: new Date(),
      })
      .where(eq(billingOrders.id, currentOrder.id))
  })

  return order.id
}

export async function processStripeWebhookEvent(event: Stripe.Event) {
  const claimed = await claimStripeWebhookEvent(event)

  if (!claimed) {
    await logBillingFunnelEvent({
      eventType: 'webhook_duplicate',
      eventSource: 'service:processStripeWebhookEvent',
      status: 'duplicate',
      metadata: {
        stripeEventId: event.id,
        stripeEventType: event.type,
      },
    })

    return {
      duplicate: true,
    }
  }

  let processedOrderId: string | undefined

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session
        const order = await findOrderBySession(session)

        if (order && session.payment_status === 'paid') {
          await grantCreditsForPaidOrder(order.id, session)
          processedOrderId = order.id

          // Send purchase confirmation email (fire-and-forget)
          try {
            const [freshOrder] = await db.select().from(billingOrders).where(eq(billingOrders.id, order.id)).limit(1)
            const [orderUser] = await db.select({ email: users.email, firstName: users.firstName, lastName: users.lastName, credits: users.credits }).from(users).where(eq(users.id, order.userId)).limit(1)
            if (freshOrder && orderUser?.email) {
              const pack = isCheckoutCatalogKey(freshOrder.catalogKey) ? getCatalogPack(freshOrder.catalogKey) : null
              sendPurchaseConfirmationEmail({
                type: 'purchase_confirmation',
                recipient: { email: orderUser.email, firstName: orderUser.firstName, lastName: orderUser.lastName },
                orderId: freshOrder.id,
                packName: pack?.name || freshOrder.catalogKey,
                credits: freshOrder.credits,
                amountFormatted: formatAmountForEmail(freshOrder.amountTotal, freshOrder.currency),
                currency: freshOrder.currency,
                paymentProvider: 'stripe',
                newBalance: orderUser.credits,
              })
            }
          } catch (emailErr) {
            console.error('[billing:service] Failed to dispatch purchase confirmation email', emailErr)
          }

          await logBillingFunnelEvent({
            eventType: 'webhook_paid',
            eventSource: 'service:processStripeWebhookEvent',
            userId: order.userId,
            orderId: order.id,
            catalogKey: order.catalogKey,
            stripeCheckoutSessionId: session.id,
            status: 'paid',
            metadata: {
              stripeEventId: event.id,
              stripeEventType: event.type,
            },
          })
        } else if (order && session.payment_status !== 'paid') {
          // Keep order pending until payment is confirmed by a paid event.
          await db
            .update(billingOrders)
            .set({
              status: order.status === 'paid' ? 'paid' : 'pending',
              updatedAt: new Date(),
            })
            .where(eq(billingOrders.id, order.id))
          processedOrderId = order.id

          await logBillingFunnelEvent({
            eventType: 'webhook_pending',
            eventSource: 'service:processStripeWebhookEvent',
            userId: order.userId,
            orderId: order.id,
            catalogKey: order.catalogKey,
            stripeCheckoutSessionId: session.id,
            status: session.payment_status,
            metadata: {
              stripeEventId: event.id,
              stripeEventType: event.type,
            },
          })
        }

        break
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session
        processedOrderId = await markOrderAsyncFailure(session)

        await logBillingFunnelEvent({
          eventType: 'webhook_failed',
          eventSource: 'service:processStripeWebhookEvent',
          orderId: processedOrderId,
          stripeCheckoutSessionId: session.id,
          status: 'async_payment_failed',
          metadata: {
            stripeEventId: event.id,
            stripeEventType: event.type,
          },
        })

        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        processedOrderId = await handleRefundedCharge(charge, event.id)

        // Send refund notification email (fire-and-forget)
        if (processedOrderId) {
          try {
            const [refundedOrder] = await db.select().from(billingOrders).where(eq(billingOrders.id, processedOrderId)).limit(1)
            if (refundedOrder) {
              const [refundUser] = await db.select({ email: users.email, firstName: users.firstName, lastName: users.lastName, credits: users.credits }).from(users).where(eq(users.id, refundedOrder.userId)).limit(1)
              if (refundUser?.email) {
                const refundMeta = parseOrderMetadata(refundedOrder.metadata)
                const totalRefundedCredits = Number(refundMeta.refundedCredits || 0)
                const pack = isCheckoutCatalogKey(refundedOrder.catalogKey) ? getCatalogPack(refundedOrder.catalogKey) : null
                sendRefundNotificationEmail({
                  type: 'refund_notification',
                  recipient: { email: refundUser.email, firstName: refundUser.firstName, lastName: refundUser.lastName },
                  orderId: refundedOrder.id,
                  packName: pack?.name || refundedOrder.catalogKey,
                  creditsReversed: totalRefundedCredits,
                  refundAmountFormatted: formatAmountForEmail(charge.amount_refunded, refundedOrder.currency),
                  currency: refundedOrder.currency,
                  remainingBalance: refundUser.credits,
                })
              }
            }
          } catch (emailErr) {
            console.error('[billing:service] Failed to dispatch refund notification email', emailErr)
          }
        }

        await logBillingFunnelEvent({
          eventType: 'webhook_refund',
          eventSource: 'service:processStripeWebhookEvent',
          orderId: processedOrderId,
          status: 'charge_refunded',
          metadata: {
            stripeEventId: event.id,
            stripeEventType: event.type,
            stripeChargeId: charge.id,
            amountRefunded: charge.amount_refunded,
          },
        })

        break
      }

      default:
        break
    }

    await completeStripeWebhookEvent(event.id, {
      status: 'processed',
      orderId: processedOrderId,
    })

    return {
      duplicate: false,
      orderId: processedOrderId,
    }
  } catch (error) {
    await completeStripeWebhookEvent(event.id, {
      status: 'failed',
      orderId: processedOrderId,
      errorMessage: error instanceof Error ? error.message : String(error),
    })

    await logBillingFunnelEvent({
      eventType: 'webhook_error',
      eventSource: 'service:processStripeWebhookEvent',
      orderId: processedOrderId,
      status: 'failed',
      errorCode: 'webhook_processing_error',
      errorMessage: error instanceof Error ? error.message : String(error),
      metadata: {
        stripeEventId: event.id,
        stripeEventType: event.type,
      },
    })

    throw error
  }
}

export async function getRevenueThisMonthCents() {
  const now = new Date()
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0))

  const [result] = await db
    .select({
      total: sql<number>`COALESCE(SUM(${billingOrders.amountTotal}), 0)`,
    })
    .from(billingOrders)
    .where(
      and(
        eq(billingOrders.status, 'paid'),
        sql`${billingOrders.createdAt} >= ${monthStart.toISOString()}`
      )
    )

  return Number(result?.total || 0)
}

export async function getBillingActionRequiredCount() {
  const [result] = await db
    .select({
      total: sql<number>`COUNT(*)`,
    })
    .from(billingOrders)
    .where(eq(billingOrders.status, 'action_required'))

  return Number(result?.total || 0)
}
