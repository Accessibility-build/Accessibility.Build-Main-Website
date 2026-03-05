import type { BillingProvider } from './types'

export function getBillingProvider(): BillingProvider {
  const raw = process.env.BILLING_PROVIDER?.trim().toLowerCase()

  if (raw === 'razorpay' || raw === 'stripe') {
    return raw
  }

  return 'razorpay'
}

export function isBillingEnabled() {
  const raw =
    process.env.BILLING_ENABLED ??
    process.env.RAZORPAY_BILLING_ENABLED ??
    process.env.STRIPE_BILLING_ENABLED

  if (raw === undefined) {
    return true
  }

  return raw.toLowerCase() === 'true'
}

export function isProviderEnabled(provider: BillingProvider) {
  if (!isBillingEnabled()) {
    return false
  }

  return getBillingProvider() === provider
}
