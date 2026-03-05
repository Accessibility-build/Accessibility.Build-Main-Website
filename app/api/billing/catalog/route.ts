import { NextRequest, NextResponse } from 'next/server'
import { getCatalogPresentationPacks } from '@/lib/billing/catalog'
import { getUsdToInrQuote } from '@/lib/billing/fx'
import { getBillingProvider, isBillingEnabled } from '@/lib/billing/provider'
import {
  getBillingCurrencyPolicyFromRequestHeaders,
  sanitizeCheckoutCurrencyForPolicy,
} from '@/lib/billing/region'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const regionPolicy = getBillingCurrencyPolicyFromRequestHeaders(request.headers)
  const currency = sanitizeCheckoutCurrencyForPolicy(searchParams.get('currency'), regionPolicy)
  const fxQuote = await getUsdToInrQuote()

  const packs = getCatalogPresentationPacks({
    currency,
    usdToInrRate: fxQuote.usdToInr,
  })

  return NextResponse.json({
    packs,
    currencies: regionPolicy.allowedCurrencies,
    defaultCurrency: regionPolicy.defaultCurrency,
    provider: getBillingProvider(),
    billingEnabled: isBillingEnabled(),
    region: {
      countryCode: regionPolicy.countryCode,
      allowInr: regionPolicy.allowInr,
    },
    fx: {
      usdToInr: fxQuote.usdToInr,
      asOf: fxQuote.asOf,
      source: fxQuote.source,
    },
  })
}
