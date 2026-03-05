'use client'

import { BillingFunnelEventType, BillingProvider, CheckoutCurrency } from '@/lib/billing/types'

type ClientBillingEventPayload = {
  eventType: BillingFunnelEventType
  sourcePath?: string
  catalogKey?: string
  orderId?: string
  paymentProvider?: BillingProvider
  currency?: CheckoutCurrency
  providerOrderId?: string
  providerPaymentId?: string
  status?: string
  errorCode?: string
  errorMessage?: string
  metadata?: Record<string, unknown>
}

export function trackBillingClientEvent(payload: ClientBillingEventPayload) {
  void fetch('/api/billing/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // Billing event tracking must never block user actions.
  })
}
