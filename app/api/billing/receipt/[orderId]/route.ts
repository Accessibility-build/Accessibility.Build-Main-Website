import { NextRequest, NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { jsPDF } from 'jspdf'
import { db } from '@/lib/db'
import { billingOrders } from '@/lib/db/schema'
import { getOrCreateUserByClerkId } from '@/lib/credits'
import { getClerkApiIdentity } from '@/lib/clerk-auth'

export const runtime = 'nodejs'

const RECEIPT_READY_STATUSES = new Set([
  'paid',
  'refunded',
  'partially_refunded',
  'action_required',
])

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format((amountMinor || 0) / 100)
}

function normalizeParams(
  params: Promise<{ orderId?: string }> | { orderId?: string }
): Promise<{ orderId: string }> {
  if (params instanceof Promise) {
    return params.then((resolved) => ({ orderId: resolved.orderId || '' }))
  }

  return Promise.resolve({ orderId: params.orderId || '' })
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ orderId?: string }> | { orderId?: string } }
) {
  try {
    const identity = await getClerkApiIdentity()
    if (!identity) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await getOrCreateUserByClerkId({
      userId: identity.userId,
      email: identity.email,
      firstName: identity.firstName,
      lastName: identity.lastName,
      profileImageUrl: identity.profileImageUrl,
    })
    const { orderId } = await normalizeParams(context.params)
    const trimmedOrderId = orderId.trim()

    if (!trimmedOrderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
    }

    const [order] = await db
      .select({
        id: billingOrders.id,
        userId: billingOrders.userId,
        paymentProvider: billingOrders.paymentProvider,
        catalogKey: billingOrders.catalogKey,
        credits: billingOrders.credits,
        currency: billingOrders.currency,
        amountSubtotal: billingOrders.amountSubtotal,
        amountTax: billingOrders.amountTax,
        amountTotal: billingOrders.amountTotal,
        status: billingOrders.status,
        providerOrderId: billingOrders.providerOrderId,
        providerPaymentId: billingOrders.providerPaymentId,
        providerPaymentLinkId: billingOrders.providerPaymentLinkId,
        providerRefundId: billingOrders.providerRefundId,
        createdAt: billingOrders.createdAt,
      })
      .from(billingOrders)
      .where(
        and(
          eq(billingOrders.id, trimmedOrderId),
          eq(billingOrders.userId, user.id),
          eq(billingOrders.paymentProvider, 'razorpay')
        )
      )
      .limit(1)

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!RECEIPT_READY_STATUSES.has(order.status)) {
      return NextResponse.json(
        { error: 'Receipt is available after payment is completed' },
        { status: 400 }
      )
    }

    const doc = new jsPDF()
    const receiptNumber = `AB-${order.id.slice(0, 8).toUpperCase()}`

    doc.setFontSize(18)
    doc.text('Accessibility.build Receipt', 14, 20)

    doc.setFontSize(11)
    doc.text(`Receipt Number: ${receiptNumber}`, 14, 30)
    doc.text(`Order ID: ${order.id}`, 14, 36)
    doc.text(`Date: ${new Date(order.createdAt).toISOString()}`, 14, 42)
    doc.text(`Status: ${order.status}`, 14, 48)
    doc.text(`Provider: ${order.paymentProvider}`, 14, 54)

    doc.setFontSize(12)
    doc.text('Purchase Summary', 14, 66)
    doc.setFontSize(11)
    doc.text(`Catalog Pack: ${order.catalogKey}`, 14, 74)
    doc.text(`Credits: ${order.credits.toLocaleString()}`, 14, 80)
    doc.text(`Subtotal: ${formatCurrency(order.amountSubtotal, order.currency)}`, 14, 86)
    doc.text(`Tax: ${formatCurrency(order.amountTax, order.currency)}`, 14, 92)
    doc.text(`Total: ${formatCurrency(order.amountTotal, order.currency)}`, 14, 98)

    doc.setFontSize(12)
    doc.text('Provider References', 14, 112)
    doc.setFontSize(11)
    doc.text(`Provider Order ID: ${order.providerOrderId || 'n/a'}`, 14, 120)
    doc.text(`Provider Payment ID: ${order.providerPaymentId || 'n/a'}`, 14, 126)
    doc.text(`Payment Link ID: ${order.providerPaymentLinkId || 'n/a'}`, 14, 132)
    doc.text(`Refund ID: ${order.providerRefundId || 'n/a'}`, 14, 138)

    doc.setFontSize(10)
    doc.text(
      'For billing support, contact support@accessibility.build and include your order ID.',
      14,
      154
    )

    const bytes = Buffer.from(doc.output('arraybuffer'))
    const filename = `receipt-${order.id.slice(0, 8)}.pdf`

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=\"${filename}\"`,
        'Cache-Control': 'private, no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error('Receipt generation failed', error)
    return NextResponse.json({ error: 'Failed to generate receipt' }, { status: 500 })
  }
}
