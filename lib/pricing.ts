/**
 * Dynamic pricing calculation for credit purchases
 * Implements tiered discounts based on credit quantity
 */

export interface PricingTier {
  minCredits: number
  maxCredits: number | null
  basePrice: number
  discount: number
  pricePerCredit: number
  label: string
}

export interface PricingCalculation {
  credits: number
  tier: PricingTier
  pricePerCredit: number
  subtotal: number
  discount: number
  total: number
  savings: number
}

// Base price per credit (in dollars)
const BASE_PRICE_PER_CREDIT = 0.04

// Pricing tiers with automatic discounts
export const PRICING_TIERS: PricingTier[] = [
  {
    minCredits: 100,
    maxCredits: 999,
    basePrice: BASE_PRICE_PER_CREDIT,
    discount: 0,
    pricePerCredit: 0.04,
    label: 'Starter',
  },
  {
    minCredits: 1000,
    maxCredits: 4999,
    basePrice: BASE_PRICE_PER_CREDIT,
    discount: 5,
    pricePerCredit: 0.038,
    label: 'Popular',
  },
  {
    minCredits: 5000,
    maxCredits: 9999,
    basePrice: BASE_PRICE_PER_CREDIT,
    discount: 10,
    pricePerCredit: 0.036,
    label: 'Best Value',
  },
  {
    minCredits: 10000,
    maxCredits: 24999,
    basePrice: BASE_PRICE_PER_CREDIT,
    discount: 15,
    pricePerCredit: 0.034,
    label: 'Professional',
  },
  {
    minCredits: 25000,
    maxCredits: null,
    basePrice: BASE_PRICE_PER_CREDIT,
    discount: 20,
    pricePerCredit: 0.032,
    label: 'Enterprise',
  },
]

// Credit limits
export const MIN_CREDITS = 100
export const MAX_CREDITS = 50000

// Suggested credit amounts (shown as quick select buttons)
export const SUGGESTED_AMOUNTS = [
  { credits: 500, label: 'Starter', popular: false },
  { credits: 1000, label: 'Popular', popular: true },
  { credits: 5000, label: 'Best Value', popular: false },
  { credits: 10000, label: 'Enterprise', popular: false },
]

/**
 * Get the pricing tier for a given credit amount
 */
export function getPricingTier(credits: number): PricingTier {
  const tier = PRICING_TIERS.find(
    (t) => credits >= t.minCredits && (t.maxCredits === null || credits <= t.maxCredits)
  )
  
  if (!tier) {
    // Default to highest tier if somehow out of range
    return PRICING_TIERS[PRICING_TIERS.length - 1]
  }
  
  return tier
}

/**
 * Calculate the total price for a given credit amount
 * Returns detailed pricing breakdown
 */
export function calculatePrice(credits: number): PricingCalculation {
  // Clamp credits to valid range
  const validCredits = Math.max(MIN_CREDITS, Math.min(MAX_CREDITS, credits))
  
  // Get the appropriate pricing tier
  const tier = getPricingTier(validCredits)
  
  // Calculate pricing
  const subtotal = validCredits * BASE_PRICE_PER_CREDIT
  const discountAmount = subtotal * (tier.discount / 100)
  const total = subtotal - discountAmount
  const pricePerCredit = total / validCredits
  const savings = subtotal - total
  
  return {
    credits: validCredits,
    tier,
    pricePerCredit,
    subtotal,
    discount: tier.discount,
    total,
    savings,
  }
}

/**
 * Format price to cents (for Stripe)
 */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100)
}

/**
 * Format credits with commas
 */
export function formatCredits(credits: number): string {
  return credits.toLocaleString()
}

/**
 * Format price as currency
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Get the next tier benefit message
 */
export function getNextTierMessage(credits: number): string | null {
  const currentTier = getPricingTier(credits)
  const currentIndex = PRICING_TIERS.indexOf(currentTier)
  
  if (currentIndex < PRICING_TIERS.length - 1) {
    const nextTier = PRICING_TIERS[currentIndex + 1]
    const creditsNeeded = nextTier.minCredits - credits
    
    return `Add ${formatCredits(creditsNeeded)} more credits to save ${nextTier.discount}% (${nextTier.label} tier)`
  }
  
  return null
}

/**
 * Validate credit amount
 */
export function validateCredits(credits: number): { valid: boolean; error?: string } {
  if (credits < MIN_CREDITS) {
    return { valid: false, error: `Minimum purchase is ${formatCredits(MIN_CREDITS)} credits` }
  }
  
  if (credits > MAX_CREDITS) {
    return { valid: false, error: `Maximum purchase is ${formatCredits(MAX_CREDITS)} credits` }
  }
  
  if (!Number.isInteger(credits)) {
    return { valid: false, error: 'Credit amount must be a whole number' }
  }
  
  return { valid: true }
}

