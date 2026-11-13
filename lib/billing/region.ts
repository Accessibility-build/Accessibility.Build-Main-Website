import { headers } from 'next/headers'
import type { CheckoutCurrency } from './types'

type HeaderReader = {
  get(name: string): string | null
}

type BillingCurrencyPolicy = {
  countryCode: string | null
  defaultCurrency: CheckoutCurrency
  allowedCurrencies: CheckoutCurrency[]
  allowInr: boolean
}

const INR_ENABLED_COUNTRIES = new Set(['IN'])
const COUNTRY_HEADER_KEYS = [
  'x-vercel-ip-country',
  'cf-ipcountry',
  'x-country-code',
  'x-geo-country',
]

function normalizeCountryCode(value: string | null | undefined) {
  if (!value || typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().toUpperCase()
  if (!/^[A-Z]{2}$/.test(normalized)) {
    return null
  }

  return normalized
}

export function getCountryCodeFromHeaders(headersList: HeaderReader) {
  for (const key of COUNTRY_HEADER_KEYS) {
    const countryCode = normalizeCountryCode(headersList.get(key))
    if (countryCode) {
      return countryCode
    }
  }

  return null
}

export function getBillingCurrencyPolicy(countryCode: string | null): BillingCurrencyPolicy {
  const normalizedCountryCode = normalizeCountryCode(countryCode)
  // Dodo Payments charges the USD product price and can show local currency itself (Adaptive
  // Currency), so the site's own INR option only applies to the legacy Razorpay provider.
  const legacyRazorpay = (process.env.BILLING_PROVIDER || '').trim().toLowerCase() === 'razorpay'
  const allowInr = legacyRazorpay && normalizedCountryCode ? INR_ENABLED_COUNTRIES.has(normalizedCountryCode) : false

  return {
    countryCode: normalizedCountryCode,
    defaultCurrency: 'USD',
    allowedCurrencies: allowInr ? ['USD', 'INR'] : ['USD'],
    allowInr,
  }
}

export function getBillingCurrencyPolicyFromRequestHeaders(headersList: HeaderReader) {
  const countryCode = getCountryCodeFromHeaders(headersList)
  return getBillingCurrencyPolicy(countryCode)
}

export async function getBillingCurrencyPolicyFromHeaders() {
  const headersList = await headers()
  return getBillingCurrencyPolicyFromRequestHeaders(headersList)
}

export function sanitizeCheckoutCurrencyForPolicy(
  value: unknown,
  policy: BillingCurrencyPolicy
): CheckoutCurrency {
  const requestedCurrency: CheckoutCurrency = value === 'INR' ? 'INR' : 'USD'
  return policy.allowedCurrencies.includes(requestedCurrency)
    ? requestedCurrency
    : policy.defaultCurrency
}
