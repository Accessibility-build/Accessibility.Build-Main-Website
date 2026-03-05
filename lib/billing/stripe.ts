import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripeClient() {
  if (stripeClient) {
    return stripeClient
  }

  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }

  stripeClient = new Stripe(secretKey)
  return stripeClient
}

export function getStripeWebhookSecret() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured')
  }

  return webhookSecret
}

export function getStripePortalConfigurationId() {
  const configurationId = process.env.STRIPE_PORTAL_CONFIGURATION_ID

  if (!configurationId) {
    throw new Error('STRIPE_PORTAL_CONFIGURATION_ID is not configured')
  }

  return configurationId
}

export function getPublicAppUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!appUrl) {
    throw new Error('NEXT_PUBLIC_APP_URL is not configured')
  }

  return appUrl.replace(/\/$/, '')
}

export function isStripeBillingEnabled() {
  const raw = process.env.STRIPE_BILLING_ENABLED

  if (raw === undefined) {
    return true
  }

  return raw.toLowerCase() === 'true'
}
