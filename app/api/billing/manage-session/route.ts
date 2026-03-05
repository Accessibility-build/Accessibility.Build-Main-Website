import { NextRequest, NextResponse } from 'next/server'
import { logBillingFunnelEvent } from '@/lib/billing/events'
import { createManageSessionForUser } from '@/lib/billing/service'
import { getBillingProvider, isBillingEnabled } from '@/lib/billing/provider'
import { getOrCreateUserByClerkId } from '@/lib/credits'
import { errorLogger } from '@/lib/error-logger'
import { getClerkApiIdentity } from '@/lib/clerk-auth'

function sanitizeReturnPath(value: unknown, fallback = '/billing/manage') {
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
  const returnPath = sanitizeReturnPath(body.returnPath, '/billing/manage')
  const provider = getBillingProvider()
  let authenticatedUserId: string | undefined

  try {
    if (!isBillingEnabled()) {
      await logBillingFunnelEvent({
        eventType: 'manage_session_failed',
        eventSource: 'api:/api/billing/manage-session',
        paymentProvider: provider,
        status: 'billing_disabled',
        errorCode: 'billing_disabled',
        metadata: { returnPath },
      })

      return NextResponse.json({ error: 'Billing management is temporarily disabled' }, { status: 503 })
    }

    const identity = await getClerkApiIdentity()

    if (!identity) {
      await logBillingFunnelEvent({
        eventType: 'manage_auth_required',
        eventSource: 'api:/api/billing/manage-session',
        paymentProvider: provider,
        status: 'auth_required',
        metadata: { returnPath },
      })

      return NextResponse.json(
        {
          error: 'Authentication required',
          signInUrl: '/sign-in?redirect_url=%2Fbilling%2Fmanage',
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

    const session = await createManageSessionForUser({
      userId: user.id,
      email: user.email || identity.email,
      fullName: [user.firstName, user.lastName].filter(Boolean).join(' ').trim(),
      returnPath,
    })

    await logBillingFunnelEvent({
      eventType: 'manage_session_created',
      eventSource: 'api:/api/billing/manage-session',
      userId: user.id,
      paymentProvider: provider,
      status: 'created',
      metadata: { returnPath },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    await logBillingFunnelEvent({
      eventType: 'manage_session_failed',
      eventSource: 'api:/api/billing/manage-session',
      userId: authenticatedUserId,
      paymentProvider: provider,
      status: 'failed',
      errorCode: 'manage_session_error',
      errorMessage: error instanceof Error ? error.message : 'Unknown manage-session error',
      metadata: { returnPath },
    })

    errorLogger.logMajorError('Failed to create billing manage session', {
      component: 'billing-manage-session-api',
      error: error instanceof Error ? error : new Error(String(error)),
    })

    return NextResponse.json({ error: 'Failed to open billing management' }, { status: 500 })
  }
}
