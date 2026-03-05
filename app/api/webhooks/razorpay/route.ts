import { NextRequest, NextResponse } from 'next/server'
import { logBillingFunnelEvent } from '@/lib/billing/events'
import { isProviderEnabled } from '@/lib/billing/provider'
import { processProviderWebhookEvent } from '@/lib/billing/service'
import { verifyRazorpayWebhookSignature } from '@/lib/billing/razorpay'
import { errorLogger } from '@/lib/error-logger'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    if (!isProviderEnabled('razorpay')) {
      await logBillingFunnelEvent({
        eventType: 'webhook_error',
        eventSource: 'api:/api/webhooks/razorpay',
        paymentProvider: 'razorpay',
        status: 'billing_disabled',
        errorCode: 'billing_disabled',
      })

      return NextResponse.json({ received: true, skipped: true, reason: 'billing_disabled' })
    }

    const signature = request.headers.get('x-razorpay-signature')
    if (!signature) {
      await logBillingFunnelEvent({
        eventType: 'webhook_error',
        eventSource: 'api:/api/webhooks/razorpay',
        paymentProvider: 'razorpay',
        status: 'invalid_request',
        errorCode: 'missing_signature',
      })

      return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 })
    }

    const rawBody = await request.text()
    const isValid = verifyRazorpayWebhookSignature(rawBody, signature)
    if (!isValid) {
      await logBillingFunnelEvent({
        eventType: 'webhook_error',
        eventSource: 'api:/api/webhooks/razorpay',
        paymentProvider: 'razorpay',
        status: 'signature_invalid',
        errorCode: 'invalid_signature',
      })

      return NextResponse.json({ error: 'Invalid Razorpay webhook signature' }, { status: 400 })
    }

    const payload = (JSON.parse(rawBody) as Record<string, unknown>) || {}
    const eventType =
      typeof payload.event === 'string' ? payload.event : request.headers.get('x-razorpay-event') || ''

    const eventIdHeader = request.headers.get('x-razorpay-event-id')
    const eventId =
      eventIdHeader ||
      `${eventType || 'unknown'}:${(payload.created_at as number | undefined) || Date.now()}:${rawBody.length}`

    const result = await processProviderWebhookEvent({
      provider: 'razorpay',
      eventId,
      eventType,
      payload,
    })

    return NextResponse.json({
      received: true,
      duplicate: result.duplicate,
      orderId: result.orderId,
    })
  } catch (error) {
    errorLogger.logMajorError('Razorpay webhook processing failed', {
      component: 'razorpay-webhook',
      error: error instanceof Error ? error : new Error(String(error)),
    })

    await logBillingFunnelEvent({
      eventType: 'webhook_error',
      eventSource: 'api:/api/webhooks/razorpay',
      paymentProvider: 'razorpay',
      status: 'processing_failed',
      errorCode: 'webhook_processing_error',
      errorMessage: error instanceof Error ? error.message : 'Unknown webhook processing error',
    })

    return NextResponse.json({ error: 'Razorpay webhook processing failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'Razorpay webhook endpoint is operational',
    timestamp: new Date().toISOString(),
  })
}
