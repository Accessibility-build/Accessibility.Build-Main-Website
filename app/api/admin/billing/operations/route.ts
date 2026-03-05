import { NextRequest, NextResponse } from 'next/server'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { AdminAccessError, requireAdminApi } from '@/lib/admin-auth'
import { logAdminAction } from '@/lib/admin-utils'
import {
  isAdminBillingReasonValid,
  MIN_ADMIN_BILLING_REASON_LENGTH,
  normalizeAdminBillingReason,
} from '@/lib/billing/admin-operations'
import { getCatalogPack, isCheckoutCatalogKey, isCheckoutCurrency } from '@/lib/billing/catalog'
import { sendPurchaseConfirmationEmail, formatAmountForEmail } from '@/lib/email/service'
import { getBillingProvider } from '@/lib/billing/provider'
import {
  createProviderCheckoutSessionForCatalog,
  createProviderPaymentLinkForOrder,
  markBillingOrderPaidManually,
} from '@/lib/billing/service'
import { db } from '@/lib/db'
import { billingOrders, users } from '@/lib/db/schema'

type OperationsAction =
  | 'create_payment_link'
  | 'create_payment_link_for_order'
  | 'mark_order_paid_manual'

type BillingOrderStatusFilter =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'
  | 'action_required'

const DEFAULT_ORDER_STATUSES: readonly BillingOrderStatusFilter[] = [
  'pending',
  'failed',
  'action_required',
] as const
const ALL_ORDER_STATUSES: readonly BillingOrderStatusFilter[] = [
  'pending',
  'paid',
  'failed',
  'refunded',
  'partially_refunded',
  'action_required',
] as const

function parseString(value: unknown, maxLength = 256) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim().slice(0, maxLength)
}

function parseLimit(value: string | null) {
  if (!value) {
    return 30
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return 30
  }

  return Math.min(Math.max(Math.floor(parsed), 1), 200)
}

function parseOrderStatuses(value: string | null): BillingOrderStatusFilter[] {
  if (!value) {
    return [...DEFAULT_ORDER_STATUSES]
  }

  const requested = value
    .split(',')
    .map((status) => status.trim())
    .filter((status) => status.length > 0)

  const filtered = requested.filter((status): status is BillingOrderStatusFilter =>
    ALL_ORDER_STATUSES.includes(status as BillingOrderStatusFilter)
  )

  return filtered.length > 0 ? filtered : [...DEFAULT_ORDER_STATUSES]
}

function parseMetadata(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return value as Record<string, unknown>
}

function getReasonValidationError(reason: string) {
  if (!reason) {
    return 'reason is required'
  }

  if (!isAdminBillingReasonValid(reason)) {
    return `reason must be at least ${MIN_ADMIN_BILLING_REASON_LENGTH} characters`
  }

  return null
}

function fullNameForUser(user: {
  firstName: string | null
  lastName: string | null
}) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  return fullName || undefined
}

async function appendAdminPaymentLinkMetadata(params: {
  orderId: string
  adminId: string
  adminEmail: string | null
  reason: string
  mode: 'new_order' | 'existing_order'
  paymentLinkUrl: string
}) {
  await db.transaction(async (tx) => {
    const [order] = await tx
      .select({
        id: billingOrders.id,
        metadata: billingOrders.metadata,
      })
      .from(billingOrders)
      .where(eq(billingOrders.id, params.orderId))
      .limit(1)

    if (!order) {
      return
    }

    const metadata = parseMetadata(order.metadata)
    const adminRequests = Array.isArray(metadata.adminPaymentLinkRequests)
      ? metadata.adminPaymentLinkRequests
      : []

    await tx
      .update(billingOrders)
      .set({
        metadata: {
          ...metadata,
          adminPaymentLinkRequests: [
            ...adminRequests,
            {
              requestedAt: new Date().toISOString(),
              requestedBy: params.adminId,
              requestedByEmail: params.adminEmail,
              reason: params.reason,
              mode: params.mode,
              paymentLinkUrl: params.paymentLinkUrl,
            },
          ],
        },
        updatedAt: new Date(),
      })
      .where(eq(billingOrders.id, params.orderId))
  })
}

export async function GET(request: NextRequest) {
  try {
    await requireAdminApi()

    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get('limit'))
    const statuses = parseOrderStatuses(searchParams.get('status'))
    const userId = parseString(searchParams.get('userId'), 128)

    const conditions = [
      eq(billingOrders.paymentProvider, 'razorpay'),
      inArray(billingOrders.status, statuses),
    ]
    if (userId) {
      conditions.push(eq(billingOrders.userId, userId))
    }

    const orders = await db
      .select({
        id: billingOrders.id,
        userId: billingOrders.userId,
        userEmail: users.email,
        catalogKey: billingOrders.catalogKey,
        credits: billingOrders.credits,
        currency: billingOrders.currency,
        amountTotal: billingOrders.amountTotal,
        status: billingOrders.status,
        providerOrderId: billingOrders.providerOrderId,
        providerPaymentId: billingOrders.providerPaymentId,
        providerPaymentLinkId: billingOrders.providerPaymentLinkId,
        failureReason: billingOrders.failureReason,
        metadata: billingOrders.metadata,
        createdAt: billingOrders.createdAt,
        updatedAt: billingOrders.updatedAt,
      })
      .from(billingOrders)
      .innerJoin(users, eq(users.id, billingOrders.userId))
      .where(and(...conditions))
      .orderBy(desc(billingOrders.createdAt))
      .limit(limit)

    return NextResponse.json({ orders })
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('Admin billing operations GET failed:', error)
    return NextResponse.json({ error: 'Failed to fetch admin billing operations data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdminApi()
    const body = await request.json().catch(() => ({}))

    const action = parseString((body as Record<string, unknown>).action, 64) as OperationsAction
    const provider = getBillingProvider()
    if (provider !== 'razorpay') {
      return NextResponse.json(
        { error: 'Admin billing operations are currently configured for Razorpay only' },
        { status: 409 }
      )
    }

    const adminEmail = admin.emailAddresses[0]?.emailAddress || null

    if (action === 'create_payment_link') {
      const userId = parseString((body as Record<string, unknown>).userId, 128)
      const catalogKey = parseString((body as Record<string, unknown>).catalogKey, 64)
      const currencyInput = parseString((body as Record<string, unknown>).currency, 8)
      const reason = normalizeAdminBillingReason(
        parseString((body as Record<string, unknown>).reason, 500)
      )

      if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 })
      }

      if (!isCheckoutCatalogKey(catalogKey)) {
        return NextResponse.json({ error: 'Invalid checkout catalogKey' }, { status: 400 })
      }

      const reasonValidationError = getReasonValidationError(reason)
      if (reasonValidationError) {
        return NextResponse.json({ error: reasonValidationError }, { status: 400 })
      }

      const currency = isCheckoutCurrency(currencyInput) ? currencyInput : 'USD'

      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)

      if (!user) {
        return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
      }

      const checkout = await createProviderCheckoutSessionForCatalog({
        userId: user.id,
        email: user.email,
        fullName: fullNameForUser(user),
        catalogKey,
        currency,
      })

      if (checkout.mode !== 'razorpay_order') {
        return NextResponse.json(
          { error: 'Unexpected provider response while creating admin payment link' },
          { status: 500 }
        )
      }

      let paymentLinkUrl = checkout.fallbackPaymentLinkUrl
      if (!paymentLinkUrl) {
        const fallback = await createProviderPaymentLinkForOrder({
          orderId: checkout.orderId,
          userId: user.id,
          email: user.email,
          fullName: fullNameForUser(user),
        })
        paymentLinkUrl = fallback.url
      }

      await appendAdminPaymentLinkMetadata({
        orderId: checkout.orderId,
        adminId: admin.id,
        adminEmail,
        reason,
        mode: 'new_order',
        paymentLinkUrl,
      })

      await logAdminAction(admin.id, 'billing_admin_payment_link_created', {
        targetUserId: user.id,
        orderId: checkout.orderId,
        providerOrderId: checkout.razorpayOrderId,
        catalogKey,
        currency,
        paymentLinkUrl,
        reason,
      })

      return NextResponse.json({
        success: true,
        action,
        orderId: checkout.orderId,
        providerOrderId: checkout.razorpayOrderId,
        paymentLinkUrl,
      })
    }

    if (action === 'create_payment_link_for_order') {
      const orderId = parseString((body as Record<string, unknown>).orderId, 128)
      const reason = normalizeAdminBillingReason(
        parseString((body as Record<string, unknown>).reason, 500)
      )

      if (!orderId) {
        return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
      }
      const reasonValidationError = getReasonValidationError(reason)
      if (reasonValidationError) {
        return NextResponse.json({ error: reasonValidationError }, { status: 400 })
      }

      const [order] = await db
        .select({
          id: billingOrders.id,
          userId: billingOrders.userId,
          status: billingOrders.status,
          paymentProvider: billingOrders.paymentProvider,
          providerOrderId: billingOrders.providerOrderId,
          providerPaymentId: billingOrders.providerPaymentId,
          userEmail: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(billingOrders)
        .innerJoin(users, eq(users.id, billingOrders.userId))
        .where(eq(billingOrders.id, orderId))
        .limit(1)

      if (!order) {
        return NextResponse.json({ error: 'Billing order not found' }, { status: 404 })
      }
      if (order.paymentProvider !== 'razorpay') {
        return NextResponse.json({ error: 'Order is not a Razorpay order' }, { status: 400 })
      }
      if (order.status === 'paid') {
        return NextResponse.json({ error: 'Order is already paid' }, { status: 409 })
      }
      if (order.status === 'refunded' || order.status === 'partially_refunded') {
        return NextResponse.json({ error: 'Cannot create payment link for refunded order' }, { status: 409 })
      }

      const link = await createProviderPaymentLinkForOrder({
        orderId: order.id,
        userId: order.userId,
        email: order.userEmail,
        fullName: fullNameForUser(order),
      })

      await appendAdminPaymentLinkMetadata({
        orderId: order.id,
        adminId: admin.id,
        adminEmail,
        reason,
        mode: 'existing_order',
        paymentLinkUrl: link.url,
      })

      await logAdminAction(admin.id, 'billing_admin_payment_link_regenerated', {
        targetUserId: order.userId,
        orderId: order.id,
        providerOrderId: order.providerOrderId,
        providerPaymentId: order.providerPaymentId,
        paymentLinkUrl: link.url,
        reason,
      })

      return NextResponse.json({
        success: true,
        action,
        orderId: order.id,
        paymentLinkUrl: link.url,
      })
    }

    if (action === 'mark_order_paid_manual') {
      const orderId = parseString((body as Record<string, unknown>).orderId, 128)
      const reason = normalizeAdminBillingReason(
        parseString((body as Record<string, unknown>).reason, 500)
      )
      const providerPaymentId = parseString((body as Record<string, unknown>).providerPaymentId, 128)
      const providerOrderId = parseString((body as Record<string, unknown>).providerOrderId, 128)

      if (!orderId) {
        return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
      }
      const reasonValidationError = getReasonValidationError(reason)
      if (reasonValidationError) {
        return NextResponse.json({ error: reasonValidationError }, { status: 400 })
      }

      const [order] = await db
        .select({
          id: billingOrders.id,
          paymentProvider: billingOrders.paymentProvider,
          status: billingOrders.status,
        })
        .from(billingOrders)
        .where(eq(billingOrders.id, orderId))
        .limit(1)

      if (!order) {
        return NextResponse.json({ error: 'Billing order not found' }, { status: 404 })
      }
      if (order.paymentProvider !== 'razorpay') {
        return NextResponse.json({ error: 'Order is not a Razorpay order' }, { status: 400 })
      }

      const result = await markBillingOrderPaidManually({
        orderId,
        adminId: admin.id,
        reason,
        providerPaymentId: providerPaymentId || undefined,
        providerOrderId: providerOrderId || undefined,
      })

      await logAdminAction(admin.id, 'billing_order_manual_paid', {
        orderId,
        reason,
        providerOrderId: providerOrderId || null,
        providerPaymentId: providerPaymentId || null,
        creditsGranted: result.creditsGranted,
        creditTransactionId: result.creditTransactionId,
      })

      // Send purchase confirmation email for admin settlement (fire-and-forget)
      if (result.creditsGranted) {
        try {
          const [settledOrder] = await db.select().from(billingOrders).where(eq(billingOrders.id, orderId)).limit(1)
          if (settledOrder) {
            const [orderUser] = await db
              .select({ email: users.email, firstName: users.firstName, lastName: users.lastName, credits: users.credits })
              .from(users)
              .where(eq(users.id, settledOrder.userId))
              .limit(1)
            if (orderUser?.email) {
              const pack = isCheckoutCatalogKey(settledOrder.catalogKey) ? getCatalogPack(settledOrder.catalogKey) : null
              sendPurchaseConfirmationEmail({
                type: 'purchase_confirmation',
                recipient: { email: orderUser.email, firstName: orderUser.firstName, lastName: orderUser.lastName },
                orderId: settledOrder.id,
                packName: pack?.name || settledOrder.catalogKey,
                credits: settledOrder.credits,
                amountFormatted: formatAmountForEmail(settledOrder.amountTotal, settledOrder.currency),
                currency: settledOrder.currency,
                paymentProvider: settledOrder.paymentProvider as 'stripe' | 'razorpay',
                newBalance: orderUser.credits,
              })
            }
          }
        } catch (emailErr) {
          console.error('[admin:billing] Failed to dispatch purchase confirmation email', emailErr)
        }
      }

      return NextResponse.json({
        success: true,
        action,
        result,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    if (error instanceof Error) {
      if (error.message === 'MANUAL_MARK_REASON_REQUIRED') {
        return NextResponse.json({ error: 'reason is required' }, { status: 400 })
      }
      if (error.message === 'MANUAL_MARK_REASON_TOO_SHORT') {
        return NextResponse.json(
          { error: `reason must be at least ${MIN_ADMIN_BILLING_REASON_LENGTH} characters` },
          { status: 400 }
        )
      }
      if (error.message === 'BILLING_ORDER_NOT_FOUND') {
        return NextResponse.json({ error: 'Billing order not found' }, { status: 404 })
      }
      if (error.message === 'BILLING_ORDER_NOT_SETTLEABLE') {
        return NextResponse.json(
          { error: 'Order cannot be manually marked paid in its current state' },
          { status: 409 }
        )
      }
    }

    console.error('Admin billing operations POST failed:', error)
    return NextResponse.json({ error: 'Failed to run admin billing operation' }, { status: 500 })
  }
}
