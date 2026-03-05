import { NextRequest, NextResponse } from 'next/server'
import { logBillingFunnelEvent } from '@/lib/billing/events'
import { createProviderPaymentLinkForOrder } from '@/lib/billing/service'
import { getBillingProvider, isBillingEnabled } from '@/lib/billing/provider'
import { getOrCreateUserByClerkId } from '@/lib/credits'
import { errorLogger } from '@/lib/error-logger'
import { getClerkApiIdentity } from '@/lib/clerk-auth'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const orderId = typeof body.orderId === 'string' ? body.orderId.trim() : ''
  const provider = getBillingProvider()
  let authenticatedUserId: string | undefined

  try {
    if (!isBillingEnabled()) {
      return NextResponse.json({ error: 'Billing is temporarily disabled' }, { status: 503 })
    }

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
    }

    const identity = await getClerkApiIdentity()
    if (!identity) {
      return NextResponse.json(
        {
          error: 'Authentication required',
          signInUrl: '/sign-in?redirect_url=%2Fbilling',
        },
        { status: 401 }
      )
    }

    authenticatedUserId = identity.userId
    const user = await getOrCreateUserByClerkId({
      userId: identity.userId,
      email: identity.email,
      firstName: identity.firstName,
      lastName: identity.lastName,
      profileImageUrl: identity.profileImageUrl,
    })

    const result = await createProviderPaymentLinkForOrder({
      orderId,
      userId: user.id,
      email: user.email || identity.email,
      fullName: [user.firstName, user.lastName].filter(Boolean).join(' ').trim(),
    })

    await logBillingFunnelEvent({
      eventType: 'checkout_fallback_payment_link',
      eventSource: 'api:/api/billing/payment-link',
      userId: user.id,
      orderId,
      paymentProvider: provider,
      status: 'created',
    })

    return NextResponse.json(result)
  } catch (error) {
    await logBillingFunnelEvent({
      eventType: 'checkout_session_failed',
      eventSource: 'api:/api/billing/payment-link',
      userId: authenticatedUserId,
      orderId: orderId || undefined,
      paymentProvider: provider,
      status: 'failed',
      errorCode: 'payment_link_error',
      errorMessage: error instanceof Error ? error.message : 'Failed to create fallback payment link',
    })

    errorLogger.logMajorError('Failed to create payment link fallback', {
      component: 'billing-payment-link-api',
      error: error instanceof Error ? error : new Error(String(error)),
    })

    return NextResponse.json({ error: 'Failed to create payment link' }, { status: 500 })
  }
}
