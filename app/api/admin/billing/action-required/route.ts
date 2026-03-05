import { NextRequest, NextResponse } from 'next/server'
import { and, desc, eq } from 'drizzle-orm'
import { AdminAccessError, requireAdminApi } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { billingOrders, users } from '@/lib/db/schema'
import { logAdminAction } from '@/lib/admin-utils'

function parseMetadata(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return value as Record<string, unknown>
}

function parseLimit(value: string | null) {
  if (!value) {
    return 50
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return 50
  }

  return Math.min(Math.max(Math.floor(parsed), 1), 200)
}

export async function GET(request: NextRequest) {
  try {
    await requireAdminApi()

    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get('limit'))

    const rows = await db
      .select({
        id: billingOrders.id,
        userId: billingOrders.userId,
        catalogKey: billingOrders.catalogKey,
        credits: billingOrders.credits,
        currency: billingOrders.currency,
        amountTotal: billingOrders.amountTotal,
        status: billingOrders.status,
        failureReason: billingOrders.failureReason,
        providerOrderId: billingOrders.providerOrderId,
        providerPaymentId: billingOrders.providerPaymentId,
        createdAt: billingOrders.createdAt,
        updatedAt: billingOrders.updatedAt,
        userEmail: users.email,
        userIsActive: users.isActive,
      })
      .from(billingOrders)
      .innerJoin(users, eq(billingOrders.userId, users.id))
      .where(eq(billingOrders.status, 'action_required'))
      .orderBy(desc(billingOrders.createdAt))
      .limit(limit)

    return NextResponse.json({ orders: rows })
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('Admin action-required billing fetch failed:', error)
    return NextResponse.json({ error: 'Failed to fetch action-required orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdminApi()
    const body = await request.json().catch(() => ({}))
    const orderId = typeof body.orderId === 'string' ? body.orderId.trim() : ''
    const note = typeof body.note === 'string' ? body.note.trim().slice(0, 500) : ''
    const reactivateUser = Boolean(body.reactivateUser)

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
    }

    const [resolvedOrder] = await db.transaction(async (tx) => {
      const [order] = await tx
        .select()
        .from(billingOrders)
        .where(and(eq(billingOrders.id, orderId), eq(billingOrders.status, 'action_required')))
        .limit(1)

      if (!order) {
        throw new Error('ACTION_REQUIRED_ORDER_NOT_FOUND')
      }

      if (reactivateUser) {
        await tx
          .update(users)
          .set({
            isActive: true,
            updatedAt: new Date(),
          })
          .where(eq(users.id, order.userId))
      }

      const metadata = parseMetadata(order.metadata)
      const [updatedOrder] = await tx
        .update(billingOrders)
        .set({
          status: 'partially_refunded',
          failureReason: note || 'Resolved by admin review',
          metadata: {
            ...metadata,
            actionRequiredResolution: {
              resolvedAt: new Date().toISOString(),
              resolvedBy: admin.id,
              resolvedByEmail: admin.emailAddresses[0]?.emailAddress || null,
              note: note || null,
              reactivatedUser: reactivateUser,
            },
          },
          updatedAt: new Date(),
        })
        .where(eq(billingOrders.id, order.id))
        .returning({
          id: billingOrders.id,
          userId: billingOrders.userId,
          status: billingOrders.status,
        })

      return [updatedOrder]
    })

    if (!resolvedOrder) {
      return NextResponse.json({ error: 'Failed to resolve order' }, { status: 500 })
    }

    await logAdminAction(admin.id, 'billing_action_required_resolved', {
      orderId: resolvedOrder.id,
      targetUserId: resolvedOrder.userId,
      reactivatedUser: reactivateUser,
      note: note || null,
    })

    return NextResponse.json({
      success: true,
      order: resolvedOrder,
    })
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    if (error instanceof Error && error.message === 'ACTION_REQUIRED_ORDER_NOT_FOUND') {
      return NextResponse.json({ error: 'Action-required order not found' }, { status: 404 })
    }

    console.error('Admin action-required billing resolve failed:', error)
    return NextResponse.json({ error: 'Failed to resolve action-required order' }, { status: 500 })
  }
}
