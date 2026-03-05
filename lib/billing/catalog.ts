import { convertUsdCentsToInrPaise } from './fx'
import {
  CatalogDisplayAmount,
  CatalogKey,
  CatalogPack,
  CatalogPackPresentation,
  CheckoutCatalogKey,
  CheckoutCurrency,
} from './types'

const TAX_NOTE = 'Taxes are applied by the payment provider at checkout'
const DEFAULT_USD_TO_INR_RATE = 83

const CATALOG_ORDER: CatalogKey[] = [
  'starter_50',
  'pro_200',
  'business_500',
  'growth_2500',
  'team_5000',
  'team_15000',
  'enterprise_contact',
]

const BILLING_CATALOG: Record<CatalogKey, CatalogPack> = {
  starter_50: {
    key: 'starter_50',
    name: 'Starter Pack',
    description: '50 credits for smaller workloads',
    credits: 50,
    amountCents: 499,
    baseCurrency: 'USD',
    checkoutCurrencies: ['USD', 'INR'],
    checkoutEnabled: true,
    cta: 'Buy Credits',
    isPopular: false,
    features: [
      '50 credits (one-time purchase)',
      'All core accessibility tools',
      'Secure Razorpay checkout',
      'Billing managed inside Accessibility.build',
    ],
  },
  pro_200: {
    key: 'pro_200',
    name: 'Pro Pack',
    description: '200 credits for ongoing accessibility work',
    credits: 200,
    amountCents: 1499,
    baseCurrency: 'USD',
    checkoutCurrencies: ['USD', 'INR'],
    checkoutEnabled: true,
    cta: 'Buy Credits',
    isPopular: true,
    features: [
      '200 credits (one-time purchase)',
      'All core accessibility tools',
      'Priority email support',
      'Billing managed inside Accessibility.build',
    ],
  },
  business_500: {
    key: 'business_500',
    name: 'Business Pack',
    description: '500 credits for high-frequency accessibility workflows',
    credits: 500,
    amountCents: 2999,
    baseCurrency: 'USD',
    checkoutCurrencies: ['USD', 'INR'],
    checkoutEnabled: true,
    cta: 'Buy Credits',
    isPopular: false,
    features: [
      '500 credits (one-time purchase)',
      'All core accessibility tools',
      'Higher-volume workflows',
      'Billing managed inside Accessibility.build',
    ],
  },
  growth_2500: {
    key: 'growth_2500',
    name: 'Growth Pack',
    description: '2,500 credits for agencies and scale',
    credits: 2500,
    amountCents: 8900,
    baseCurrency: 'USD',
    checkoutCurrencies: ['USD', 'INR'],
    checkoutEnabled: true,
    cta: 'Buy Credits',
    isPopular: false,
    features: [
      '2,500 credits (one-time purchase)',
      'All core accessibility tools',
      'Best value for ongoing client work',
      'Billing managed inside Accessibility.build',
    ],
  },
  team_5000: {
    key: 'team_5000',
    name: 'Team Pack - Medium',
    description: '5,000 credits for teams with shared accessibility workloads',
    credits: 5000,
    amountCents: 29900,
    baseCurrency: 'USD',
    checkoutCurrencies: ['USD', 'INR'],
    checkoutEnabled: true,
    isTeamPlan: true,
    cta: 'Buy Team Credits',
    isPopular: false,
    features: [
      '5,000 credits (one-time purchase)',
      'Team-level volume for shared workflows',
      'Billing managed inside Accessibility.build',
      'Priority email support',
    ],
  },
  team_15000: {
    key: 'team_15000',
    name: 'Team Pack - Large',
    description: '15,000 credits for larger teams and sustained usage',
    credits: 15000,
    amountCents: 79900,
    baseCurrency: 'USD',
    checkoutCurrencies: ['USD', 'INR'],
    checkoutEnabled: true,
    isTeamPlan: true,
    cta: 'Buy Team Credits',
    isPopular: true,
    features: [
      '15,000 credits (one-time purchase)',
      'High-volume team workflows',
      'Billing managed inside Accessibility.build',
      'Priority support routing',
    ],
  },
  enterprise_contact: {
    key: 'enterprise_contact',
    name: 'Enterprise',
    description: 'Custom volume and onboarding through sales',
    credits: 0,
    amountCents: 0,
    baseCurrency: 'USD',
    checkoutCurrencies: ['USD'],
    checkoutEnabled: false,
    isTeamPlan: true,
    cta: 'Contact Sales',
    isPopular: false,
    features: [
      'Custom credit volumes',
      'Procurement and invoicing support',
      'Dedicated onboarding path',
      'Contract and SLA options',
    ],
  },
}

const CHECKOUT_PRICE_ENV_KEYS: Record<CheckoutCatalogKey, string> = {
  starter_50: 'STRIPE_PRICE_STARTER_50',
  pro_200: 'STRIPE_PRICE_PRO_200',
  business_500: 'STRIPE_PRICE_BUSINESS_500',
  growth_2500: 'STRIPE_PRICE_GROWTH_2500',
  team_5000: 'STRIPE_PRICE_TEAM_5000',
  team_15000: 'STRIPE_PRICE_TEAM_15000',
}

const STARTER_BASE_KEY: CheckoutCatalogKey = 'starter_50'

function formatCurrency(amountCents: number, currency: CheckoutCurrency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amountCents / 100)
}

function getDisplayAmounts(pack: CatalogPack, usdToInrRate: number): Record<CheckoutCurrency, CatalogDisplayAmount> {
  const amountUsdCents = pack.amountCents
  const amountInrPaise = convertUsdCentsToInrPaise(amountUsdCents, usdToInrRate)

  const usdPerCredit =
    pack.checkoutEnabled && pack.credits > 0
      ? Number((amountUsdCents / pack.credits).toFixed(4))
      : null
  const inrPerCredit =
    pack.checkoutEnabled && pack.credits > 0
      ? Number((amountInrPaise / pack.credits).toFixed(4))
      : null

  return {
    USD: {
      amountCents: amountUsdCents,
      currency: 'USD',
      formattedPrice: formatCurrency(amountUsdCents, 'USD'),
      pricePerCreditCents: usdPerCredit,
    },
    INR: {
      amountCents: amountInrPaise,
      currency: 'INR',
      formattedPrice: formatCurrency(amountInrPaise, 'INR'),
      pricePerCreditCents: inrPerCredit,
    },
  }
}

function getSavingsLabel(
  pack: CatalogPack,
  starterPack: CatalogPack,
  currency: CheckoutCurrency,
  usdToInrRate: number
) {
  if (!pack.checkoutEnabled || pack.credits <= 0) {
    return null
  }

  if (pack.key === STARTER_BASE_KEY) {
    return null
  }

  const starterAmounts = getDisplayAmounts(starterPack, usdToInrRate)
  const currentAmounts = getDisplayAmounts(pack, usdToInrRate)

  const starterPerCredit = starterAmounts[currency].amountCents / starterPack.credits
  const currentPerCredit = currentAmounts[currency].amountCents / pack.credits
  const savingsPercent = Math.round((1 - currentPerCredit / starterPerCredit) * 100)

  if (savingsPercent <= 0) {
    return null
  }

  return `${savingsPercent}% better value than Starter`
}

export function getCatalogPack(key: CatalogKey): CatalogPack {
  const pack = BILLING_CATALOG[key]

  if (!pack) {
    throw new Error(`Unknown billing catalog key: ${key}`)
  }

  return pack
}

export function getAllCatalogPacks(): CatalogPack[] {
  return CATALOG_ORDER.map((key) => BILLING_CATALOG[key])
}

export function getCheckoutCatalogPacks(): CatalogPack[] {
  return getAllCatalogPacks().filter((pack) => pack.checkoutEnabled)
}

export function isCheckoutCatalogKey(value: string): value is CheckoutCatalogKey {
  return value in CHECKOUT_PRICE_ENV_KEYS
}

export function isCheckoutCurrency(value: string): value is CheckoutCurrency {
  return value === 'USD' || value === 'INR'
}

export function getStripePriceIdForCatalogKey(key: CheckoutCatalogKey): string {
  const envKey = CHECKOUT_PRICE_ENV_KEYS[key]
  const priceId = process.env[envKey]

  if (!priceId) {
    throw new Error(`Missing Stripe price id env var: ${envKey}`)
  }

  return priceId
}

export function getCatalogPresentationPacks(options?: {
  includeEnterprise?: boolean
  teamOnly?: boolean
  individualOnly?: boolean
  checkoutOnly?: boolean
  currency?: CheckoutCurrency
  usdToInrRate?: number
}): CatalogPackPresentation[] {
  const {
    includeEnterprise = true,
    teamOnly = false,
    individualOnly = false,
    checkoutOnly = false,
    currency = 'USD',
    usdToInrRate = DEFAULT_USD_TO_INR_RATE,
  } = options || {}

  const starterPack = getCatalogPack(STARTER_BASE_KEY)

  return getAllCatalogPacks()
    .filter((pack) => (includeEnterprise ? true : pack.key !== 'enterprise_contact'))
    .filter((pack) => (checkoutOnly ? pack.checkoutEnabled : true))
    .filter((pack) => (teamOnly ? Boolean(pack.isTeamPlan) : true))
    .filter((pack) => (individualOnly ? !pack.isTeamPlan : true))
    .map((pack) => {
      const displayAmounts = getDisplayAmounts(pack, usdToInrRate)
      const selectedAmount = displayAmounts[currency]

      return {
        key: pack.key,
        name: pack.name,
        description: pack.description,
        credits: pack.credits,
        amountCents: selectedAmount.amountCents,
        amountUsdCents: displayAmounts.USD.amountCents,
        currency,
        pricePerCreditCents: selectedAmount.pricePerCreditCents,
        valueLabel: getSavingsLabel(pack, starterPack, currency, usdToInrRate),
        taxNote: pack.checkoutEnabled ? TAX_NOTE : '',
        checkoutEnabled: pack.checkoutEnabled,
        ctaLabel: pack.cta,
        isPopular: Boolean(pack.isPopular),
        isTeamPlan: Boolean(pack.isTeamPlan),
        features: pack.features || [],
        displayAmounts,
      }
    })
}

export function validateCatalogIntegrity() {
  for (const pack of getCheckoutCatalogPacks()) {
    if (!isCheckoutCatalogKey(pack.key)) {
      throw new Error(`Invalid checkout catalog key: ${pack.key}`)
    }

    if (pack.amountCents <= 0 || pack.credits <= 0) {
      throw new Error(`Checkout pack ${pack.key} must have positive amount and credits`)
    }
  }
}
