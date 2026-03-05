import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { logBillingFunnelEvent } from '@/lib/billing/events'
import { processStripeWebhookEvent } from '@/lib/billing/service'
import { getStripeClient, getStripeWebhookSecret } from '@/lib/billing/stripe'
import { isProviderEnabled } from '@/lib/billing/provider'
import { errorLogger } from '@/lib/error-logger'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    if (!isProviderEnabled('stripe')) {
      await logBillingFunnelEvent({
        eventType: 'webhook_error',
        eventSource: 'api:/api/webhooks/stripe',
        paymentProvider: 'stripe',
        status: 'billing_disabled',
        errorCode: 'billing_disabled',
      })

      return NextResponse.json({ received: true, skipped: true, reason: 'billing_disabled' })
    }

    const stripeSignature = request.headers.get('stripe-signature')

    if (!stripeSignature) {
      await logBillingFunnelEvent({
        eventType: 'webhook_error',
        eventSource: 'api:/api/webhooks/stripe',
        paymentProvider: 'stripe',
        status: 'invalid_request',
        errorCode: 'missing_signature',
      })

      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    const rawBody = await request.text()

    const stripe = getStripeClient()
    const webhookSecret = getStripeWebhookSecret()
    const event = stripe.webhooks.constructEvent(rawBody, stripeSignature, webhookSecret)

    const result = await processStripeWebhookEvent(event)

    return NextResponse.json({
      received: true,
      duplicate: result.duplicate,
      orderId: result.orderId,
    })
  } catch (error) {
    errorLogger.logMajorError('Stripe webhook processing failed', {
      component: 'stripe-webhook',
      error: error instanceof Error ? error : new Error(String(error)),
    })

    const isSignatureError = error instanceof Stripe.errors.StripeSignatureVerificationError
    await logBillingFunnelEvent({
      eventType: 'webhook_error',
      eventSource: 'api:/api/webhooks/stripe',
      paymentProvider: 'stripe',
      status: isSignatureError ? 'signature_invalid' : 'processing_failed',
      errorCode: isSignatureError ? 'invalid_signature' : 'webhook_processing_error',
      errorMessage: error instanceof Error ? error.message : 'Unknown webhook processing error',
    })

    return NextResponse.json(
      { error: isSignatureError ? 'Invalid Stripe webhook signature' : 'Stripe webhook processing failed' },
      { status: isSignatureError ? 400 : 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'Stripe webhook endpoint is operational',
    timestamp: new Date().toISOString(),
  })
}
