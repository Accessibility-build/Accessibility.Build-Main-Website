import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  logBillingFunnelEvent,
  normalizeBillingFunnelEventInput,
} from '@/lib/billing/events'

function sanitizeSourcePath(value: unknown) {
  if (typeof value !== 'string') {
    return 'unknown'
  }

  const trimmed = value.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('\\')) {
    return 'unknown'
  }

  return trimmed.slice(0, 128)
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
  }

  const { userId } = await auth()
  const sourcePath = sanitizeSourcePath((body as Record<string, unknown>).sourcePath)

  const normalized = normalizeBillingFunnelEventInput({
    eventType: (body as Record<string, unknown>).eventType,
    eventSource: `client:${sourcePath}`,
    userId: userId || undefined,
    orderId: (body as Record<string, unknown>).orderId,
    paymentProvider: (body as Record<string, unknown>).paymentProvider,
    catalogKey: (body as Record<string, unknown>).catalogKey,
    currency: (body as Record<string, unknown>).currency,
    providerOrderId: (body as Record<string, unknown>).providerOrderId,
    providerPaymentId: (body as Record<string, unknown>).providerPaymentId,
    status: (body as Record<string, unknown>).status,
    errorCode: (body as Record<string, unknown>).errorCode,
    errorMessage: (body as Record<string, unknown>).errorMessage,
    stripeCheckoutSessionId: (body as Record<string, unknown>).stripeCheckoutSessionId,
    metadata: (body as Record<string, unknown>).metadata,
  })

  if (!normalized) {
    return NextResponse.json({ error: 'Invalid billing event payload' }, { status: 400 })
  }

  try {
    await logBillingFunnelEvent(normalized)
  } catch (error) {
    console.error("[billing/events] Failed to log billing funnel event:", error)
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 })
  }
  return NextResponse.json({ accepted: true })
}
