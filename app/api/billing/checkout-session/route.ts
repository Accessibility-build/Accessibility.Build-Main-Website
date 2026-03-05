import { NextRequest, NextResponse } from 'next/server'
import { isCheckoutCatalogKey } from '@/lib/billing/catalog'
import { logBillingFunnelEvent } from '@/lib/billing/events'
import { createProviderCheckoutSessionForCatalog } from '@/lib/billing/service'
import { getBillingProvider, isBillingEnabled } from '@/lib/billing/provider'
import { CheckoutCurrency } from '@/lib/billing/types'
import { getOrCreateUserByClerkId } from '@/lib/credits'
import { errorLogger } from '@/lib/error-logger'
import { getClerkApiIdentity } from '@/lib/clerk-auth'
import {
  getBillingCurrencyPolicyFromRequestHeaders,
  sanitizeCheckoutCurrencyForPolicy,
} from '@/lib/billing/region'

function sanitizeReturnPath(value: unknown, fallback = '/pricing') {
  if (typeof value !== 'string') {
    return fallback
  }

  const trimmed = value.trim()
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

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const catalogKey = typeof body.catalogKey === 'string' ? body.catalogKey : ''
  const regionPolicy = getBillingCurrencyPolicyFromRequestHeaders(request.headers)
  const currency: CheckoutCurrency = sanitizeCheckoutCurrencyForPolicy(body.currency, regionPolicy)
  const returnPath = sanitizeReturnPath(body.returnPath, '/pricing')
  const provider = getBillingProvider()
  const requestedCurrency = typeof body.currency === 'string' ? body.currency : undefined
  const regionMetadata = {
    countryCode: regionPolicy.countryCode,
    allowInr: regionPolicy.allowInr,
    requestedCurrency,
  }
  let authenticatedUserId: string | undefined

  try {
    if (!isBillingEnabled()) {
      await logBillingFunnelEvent({
        eventType: 'checkout_session_failed',
        eventSource: 'api:/api/billing/checkout-session',
        paymentProvider: provider,
        catalogKey,
        currency,
        status: 'billing_disabled',
        errorCode: 'billing_disabled',
        metadata: { returnPath, ...regionMetadata },
      })

      return NextResponse.json(
        { error: 'Billing checkout is temporarily disabled' },
        { status: 503 }
      )
    }

    const identity = await getClerkApiIdentity()

    if (!identity) {
      await logBillingFunnelEvent({
        eventType: 'checkout_auth_required',
        eventSource: 'api:/api/billing/checkout-session',
        paymentProvider: provider,
        catalogKey,
        currency,
        status: 'auth_required',
        metadata: { returnPath, ...regionMetadata },
      })

      const returnUrl = isCheckoutCatalogKey(catalogKey)
        ? `${returnPath}${returnPath.includes('?') ? '&' : '?'}checkoutCatalogKey=${catalogKey}&checkoutCurrency=${currency}`
        : returnPath

      const signInUrl = `/sign-in?redirect_url=${encodeURIComponent(returnUrl)}`

      return NextResponse.json(
        {
          error: 'Authentication required',
          signInUrl,
        },
        { status: 401 }
      )
    }

    authenticatedUserId = identity.userId

    if (!isCheckoutCatalogKey(catalogKey)) {
      await logBillingFunnelEvent({
        eventType: 'checkout_invalid_catalog',
        eventSource: 'api:/api/billing/checkout-session',
        userId: identity.userId,
        paymentProvider: provider,
        catalogKey,
        currency,
        status: 'invalid_catalog',
        errorCode: 'invalid_catalog_key',
        metadata: { returnPath, ...regionMetadata },
      })

      return NextResponse.json(
        {
          error: 'Invalid catalog key',
        },
        { status: 400 }
      )
    }

    const user = await getOrCreateUserByClerkId({
      userId: identity.userId,
      email: identity.email,
      firstName: identity.firstName,
      lastName: identity.lastName,
      profileImageUrl: identity.profileImageUrl,
    })

    const result = await createProviderCheckoutSessionForCatalog({
      userId: user.id,
      email: user.email || identity.email,
      fullName: [user.firstName, user.lastName].filter(Boolean).join(' ').trim(),
      catalogKey,
      currency,
    })

    await logBillingFunnelEvent({
      eventType: 'checkout_session_created',
      eventSource: 'api:/api/billing/checkout-session',
      userId: user.id,
      orderId: result.orderId,
      paymentProvider: provider,
      catalogKey,
      currency,
      providerOrderId: result.mode === 'razorpay_order' ? result.razorpayOrderId : undefined,
      status: result.mode,
      metadata: { returnPath, ...regionMetadata },
    })

    return NextResponse.json(result)
  } catch (error) {
    await logBillingFunnelEvent({
      eventType: 'checkout_session_failed',
      eventSource: 'api:/api/billing/checkout-session',
      userId: authenticatedUserId,
      paymentProvider: provider,
      catalogKey,
      currency,
      status: 'failed',
      errorCode: 'checkout_session_error',
      errorMessage: error instanceof Error ? error.message : 'Unknown checkout session error',
      metadata: { returnPath, ...regionMetadata },
    })

    errorLogger.logMajorError('Failed to create provider checkout session', {
      component: 'billing-checkout-session-api',
      error: error instanceof Error ? error : new Error(String(error)),
    })

    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
      },
      { status: 500 }
    )
  }
}
