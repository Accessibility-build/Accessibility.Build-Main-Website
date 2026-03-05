export type CheckoutCatalogKey =
  | 'starter_50'
  | 'pro_200'
  | 'business_500'
  | 'growth_2500'
  | 'team_5000'
  | 'team_15000'

export type CatalogKey = CheckoutCatalogKey | 'enterprise_contact'
export type CheckoutCurrency = 'USD' | 'INR'
export type BillingProvider = 'stripe' | 'razorpay'

export type BillingOrderStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'
  | 'action_required'

export interface CatalogPack {
  key: CatalogKey
  name: string
  description: string
  credits: number
  amountCents: number
  baseCurrency: 'USD'
  checkoutCurrencies: CheckoutCurrency[]
  checkoutEnabled: boolean
  isTeamPlan?: boolean
  isPopular?: boolean
  features?: string[]
  cta: string
}

export interface CatalogDisplayAmount {
  amountCents: number
  currency: CheckoutCurrency
  formattedPrice: string
  pricePerCreditCents: number | null
}

export interface CatalogPackPresentation {
  key: CatalogKey
  name: string
  description: string
  credits: number
  amountCents: number
  amountUsdCents: number
  currency: CheckoutCurrency
  pricePerCreditCents: number | null
  valueLabel: string | null
  taxNote: string
  checkoutEnabled: boolean
  ctaLabel: string
  isPopular: boolean
  isTeamPlan: boolean
  features: string[]
  displayAmounts: Record<CheckoutCurrency, CatalogDisplayAmount>
}

export const BILLING_FUNNEL_EVENT_TYPES = [
  'checkout_click',
  'checkout_auth_required',
  'checkout_session_created',
  'checkout_session_failed',
  'checkout_invalid_catalog',
  'checkout_fallback_payment_link',
  'manage_click',
  'manage_auth_required',
  'manage_session_created',
  'manage_session_failed',
  'portal_click',
  'portal_auth_required',
  'portal_session_created',
  'portal_session_failed',
  'webhook_paid',
  'webhook_pending',
  'webhook_failed',
  'webhook_refund',
  'webhook_duplicate',
  'webhook_error',
] as const

export type BillingFunnelEventType = (typeof BILLING_FUNNEL_EVENT_TYPES)[number]

export interface BillingFunnelEventInput {
  eventType: BillingFunnelEventType
  eventSource: string
  userId?: string
  orderId?: string
  paymentProvider?: BillingProvider
  catalogKey?: string
  currency?: CheckoutCurrency
  providerOrderId?: string
  providerPaymentId?: string
  stripeCheckoutSessionId?: string
  status?: string
  errorCode?: string
  errorMessage?: string
  metadata?: Record<string, unknown>
}

export type CheckoutSessionResponse =
  | {
      mode: 'razorpay_order'
      orderId: string
      razorpayOrderId: string
      keyId: string
      amountMinor: number
      currency: CheckoutCurrency
      name: string
      description: string
      prefill?: {
        name?: string
        email?: string
      }
      notes?: Record<string, string>
      fallbackPaymentLinkUrl?: string
    }
  | {
      mode: 'payment_link'
      orderId: string
      url: string
    }

export interface BillingOrderMetadata {
  refundedCredits?: number
  refundTransactionIds?: string[]
  purchaseTransactionId?: string
  billingProvider?: BillingProvider
  providerOrderId?: string
  providerPaymentId?: string
  providerPaymentLinkId?: string
  providerRefundId?: string
  refundEvents?: Array<{
    eventId: string
    providerPaymentId?: string
    chargeId?: string
    refundId?: string
    amountRefunded: number
    creditsReversed: number
    timestamp: string
  }>
  actionRequiredReason?: string
  adminPaymentLinkRequests?: Array<{
    requestedAt: string
    requestedBy: string
    requestedByEmail?: string | null
    reason: string
    mode: 'new_order' | 'existing_order'
    paymentLinkUrl?: string
  }>
  manualSettlements?: Array<{
    action: 'mark_paid'
    settledAt: string
    settledBy: string
    reason: string
    providerOrderId?: string | null
    providerPaymentId?: string | null
  }>
}
