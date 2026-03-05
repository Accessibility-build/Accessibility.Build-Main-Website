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

const LOG_PREFIX = '[billing:checkout-session]'

// Module-level log — fires during cold-start import, before any request handler.
// If you see this in Vercel logs but NOT the request_start log, the handler is
// crashing between import and execution. If you don't see this at all, the
// module itself failed to load (check DATABASE_URL and import chain).
console.log(`${LOG_PREFIX} module_loaded`, JSON.stringify({
  region: process.env.VERCEL_REGION || process.env.AWS_REGION || 'unknown',
  hasDbUrl: Boolean(process.env.DATABASE_URL),
  hasRazorpayKey: Boolean(process.env.RAZORPAY_KEY_ID),
  nodeEnv: process.env.NODE_ENV,
}))

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
  const startMs = Date.now()
  const requestId = `chk_${startMs}_${Math.random().toString(36).slice(2, 8)}`

  console.log(`${LOG_PREFIX} ▶ request_start`, JSON.stringify({
    requestId,
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION || process.env.AWS_REGION || 'unknown',
    functionName: process.env.VERCEL_FUNCTION_NAME || 'unknown',
  }))

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

  console.log(`${LOG_PREFIX} ▶ request_parsed`, JSON.stringify({
    requestId,
    catalogKey,
    currency,
    provider,
    regionCountry: regionPolicy.countryCode,
    allowInr: regionPolicy.allowInr,
    requestedCurrency,
  }))

  try {
    // ── Step 1: Billing enabled check ──
    if (!isBillingEnabled()) {
      console.warn(`${LOG_PREFIX} ✗ billing_disabled`, JSON.stringify({ requestId }))

      await logBillingFunnelEvent({
        eventType: 'checkout_session_failed',
        eventSource: 'api:/api/billing/checkout-session',
        paymentProvider: provider,
        catalogKey,
        currency,
        status: 'billing_disabled',
        errorCode: 'billing_disabled',
        metadata: { returnPath, ...regionMetadata, requestId },
      })

      return NextResponse.json(
        { error: 'Billing checkout is temporarily disabled' },
        { status: 503 }
      )
    }

    // ── Step 2: Authentication ──
    console.log(`${LOG_PREFIX} … authenticating`, JSON.stringify({ requestId }))
    const authStartMs = Date.now()
    const identity = await getClerkApiIdentity()
    const authDurationMs = Date.now() - authStartMs

    if (!identity) {
      console.warn(`${LOG_PREFIX} ✗ auth_required`, JSON.stringify({
        requestId,
        authDurationMs,
      }))

      await logBillingFunnelEvent({
        eventType: 'checkout_auth_required',
        eventSource: 'api:/api/billing/checkout-session',
        paymentProvider: provider,
        catalogKey,
        currency,
        status: 'auth_required',
        metadata: { returnPath, ...regionMetadata, requestId },
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
    console.log(`${LOG_PREFIX} ✓ authenticated`, JSON.stringify({
      requestId,
      userId: identity.userId,
      authDurationMs,
    }))

    // ── Step 3: Catalog validation ──
    if (!isCheckoutCatalogKey(catalogKey)) {
      console.warn(`${LOG_PREFIX} ✗ invalid_catalog`, JSON.stringify({
        requestId,
        userId: identity.userId,
        catalogKey,
      }))

      await logBillingFunnelEvent({
        eventType: 'checkout_invalid_catalog',
        eventSource: 'api:/api/billing/checkout-session',
        userId: identity.userId,
        paymentProvider: provider,
        catalogKey,
        currency,
        status: 'invalid_catalog',
        errorCode: 'invalid_catalog_key',
        metadata: { returnPath, ...regionMetadata, requestId },
      })

      return NextResponse.json(
        {
          error: 'Invalid catalog key',
        },
        { status: 400 }
      )
    }

    // ── Step 4: Resolve user record ──
    console.log(`${LOG_PREFIX} … resolving_user`, JSON.stringify({
      requestId,
      userId: identity.userId,
    }))
    const userStartMs = Date.now()
    const user = await getOrCreateUserByClerkId({
      userId: identity.userId,
      email: identity.email,
      firstName: identity.firstName,
      lastName: identity.lastName,
      profileImageUrl: identity.profileImageUrl,
    })
    const userDurationMs = Date.now() - userStartMs
    console.log(`${LOG_PREFIX} ✓ user_resolved`, JSON.stringify({
      requestId,
      userId: user.id,
      userDurationMs,
    }))

    // ── Step 5: Create provider checkout session ──
    console.log(`${LOG_PREFIX} … creating_checkout_session`, JSON.stringify({
      requestId,
      userId: user.id,
      provider,
      catalogKey,
      currency,
    }))
    const checkoutStartMs = Date.now()
    const result = await createProviderCheckoutSessionForCatalog({
      userId: user.id,
      email: user.email || identity.email,
      fullName: [user.firstName, user.lastName].filter(Boolean).join(' ').trim(),
      catalogKey,
      currency,
    })
    const checkoutDurationMs = Date.now() - checkoutStartMs
    const totalDurationMs = Date.now() - startMs

    console.log(`${LOG_PREFIX} ✓ checkout_session_created`, JSON.stringify({
      requestId,
      userId: user.id,
      orderId: result.orderId,
      mode: result.mode,
      currency,
      checkoutDurationMs,
      totalDurationMs,
    }))

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
      metadata: { returnPath, ...regionMetadata, requestId },
    })

    return NextResponse.json(result)
  } catch (error) {
    const totalDurationMs = Date.now() - startMs
    const errorMessage = error instanceof Error ? error.message : 'Unknown checkout session error'
    const errorStack = error instanceof Error ? error.stack : undefined

    // ── This is the CRITICAL log — always prints to Vercel function logs ──
    console.error(`${LOG_PREFIX} ✗ CHECKOUT_FAILED`, JSON.stringify({
      requestId,
      userId: authenticatedUserId,
      provider,
      catalogKey,
      currency,
      region: process.env.VERCEL_REGION || process.env.AWS_REGION || 'unknown',
      errorMessage,
      errorStack,
      totalDurationMs,
      regionCountry: regionMetadata.countryCode,
    }))

    await logBillingFunnelEvent({
      eventType: 'checkout_session_failed',
      eventSource: 'api:/api/billing/checkout-session',
      userId: authenticatedUserId,
      paymentProvider: provider,
      catalogKey,
      currency,
      status: 'failed',
      errorCode: 'checkout_session_error',
      errorMessage,
      metadata: { returnPath, ...regionMetadata, requestId, errorStack, totalDurationMs },
    }).catch((funnelError) => {
      // If the DB is down, the funnel event write itself will fail —
      // make sure we still see it in Vercel logs.
      console.error(`${LOG_PREFIX} ✗ funnel_event_write_failed`, JSON.stringify({
        requestId,
        funnelError: funnelError instanceof Error ? funnelError.message : String(funnelError),
      }))
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
