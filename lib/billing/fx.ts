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
  const LOG_PREFIX = '[billing:fx]'
  const nowMs = Date.now()
  const hasFreshCache = cachedQuote !== null && nowMs - cachedAtMs < FX_CACHE_TTL_MS

  if (!forceRefresh && hasFreshCache) {
    console.log(`${LOG_PREFIX} ✓ cache_hit`, JSON.stringify({
      usdToInr: cachedQuote!.usdToInr,
      source: cachedQuote!.source,
      cacheAgeMs: nowMs - cachedAtMs,
    }))
    return cachedQuote as FxQuote
  }

  console.log(`${LOG_PREFIX} … fetching_live_rate`, JSON.stringify({
    hasAppId: Boolean(process.env.OPENEXCHANGERATES_APP_ID),
    forceRefresh,
  }))

  const liveQuote = await fetchOpenExchangeRate().catch((err) => {
    console.warn(`${LOG_PREFIX} ⚠ live_fetch_error`, JSON.stringify({
      error: err instanceof Error ? err.message : String(err),
    }))
    return null
  })

  if (liveQuote) {
    cachedQuote = liveQuote
    cachedAtMs = nowMs
    console.log(`${LOG_PREFIX} ✓ live_rate`, JSON.stringify({
      usdToInr: liveQuote.usdToInr,
      source: liveQuote.source,
    }))
    return liveQuote
  }

  const fallback = buildFallbackQuote()
  cachedQuote = fallback
  cachedAtMs = nowMs
  console.warn(`${LOG_PREFIX} ⚠ using_fallback`, JSON.stringify({
    usdToInr: fallback.usdToInr,
    source: fallback.source,
  }))
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
