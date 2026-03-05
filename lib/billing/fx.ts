const OPEN_EXCHANGE_RATES_URL = 'https://openexchangerates.org/api/latest.json'
const FX_CACHE_TTL_MS = 10 * 60 * 1000
const DEFAULT_USD_TO_INR_FALLBACK = 83

type FxQuote = {
  usdToInr: number
  asOf: string
  source: 'openexchangerates' | 'env_fallback'
}

let cachedQuote: FxQuote | null = null
let cachedAtMs = 0

function getEnvFallbackRate() {
  const raw = process.env.BILLING_USD_INR_FALLBACK_RATE
  const parsed = raw ? Number(raw) : NaN

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed
  }

  return DEFAULT_USD_TO_INR_FALLBACK
}

function buildFallbackQuote(): FxQuote {
  return {
    usdToInr: getEnvFallbackRate(),
    asOf: new Date().toISOString(),
    source: 'env_fallback',
  }
}

async function fetchOpenExchangeRate(): Promise<FxQuote | null> {
  const appId = process.env.OPENEXCHANGERATES_APP_ID
  if (!appId) {
    return null
  }

  const url = `${OPEN_EXCHANGE_RATES_URL}?app_id=${encodeURIComponent(appId)}&symbols=INR`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const payload = (await response.json().catch(() => null)) as
    | { rates?: { INR?: number }; timestamp?: number }
    | null

  const rate = payload?.rates?.INR
  if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) {
    return null
  }

  const asOf =
    payload?.timestamp && Number.isFinite(payload.timestamp)
      ? new Date(payload.timestamp * 1000).toISOString()
      : new Date().toISOString()

  return {
    usdToInr: rate,
    asOf,
    source: 'openexchangerates',
  }
}

export async function getUsdToInrQuote(forceRefresh = false): Promise<FxQuote> {
  const nowMs = Date.now()
  const hasFreshCache = cachedQuote !== null && nowMs - cachedAtMs < FX_CACHE_TTL_MS

  if (!forceRefresh && hasFreshCache) {
    return cachedQuote as FxQuote
  }

  const liveQuote = await fetchOpenExchangeRate().catch(() => null)
  if (liveQuote) {
    cachedQuote = liveQuote
    cachedAtMs = nowMs
    return liveQuote
  }

  const fallback = buildFallbackQuote()
  cachedQuote = fallback
  cachedAtMs = nowMs
  return fallback
}

export function convertUsdCentsToInrPaise(amountUsdCents: number, usdToInrRate: number) {
  if (!Number.isFinite(amountUsdCents) || amountUsdCents <= 0) {
    return 0
  }

  if (!Number.isFinite(usdToInrRate) || usdToInrRate <= 0) {
    return 0
  }

  // 1 USD cent -> rate paise
  return Math.max(1, Math.round(amountUsdCents * usdToInrRate))
}
