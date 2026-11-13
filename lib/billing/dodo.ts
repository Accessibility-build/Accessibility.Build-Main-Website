import "server-only"
import DodoPayments from "dodopayments"

// Dodo Payments client. Env:
//   DODO_PAYMENTS_API_KEY        dodo_test_... or dodo_live_...
//   DODO_PAYMENTS_WEBHOOK_KEY    whsec_... from Developer > Webhooks > endpoint
//   DODO_PAYMENTS_ENVIRONMENT    test_mode | live_mode (default: inferred from the key prefix)
//   DODO_PRODUCT_IDS             optional JSON {"<sellable key>": "pdt_..."}; otherwise products are
//                                found by metadata.sku (create them with scripts/billing/dodo-sync-products.mjs)

let client: DodoPayments | null = null

export function getDodoEnvironment(): "test_mode" | "live_mode" {
  const raw = process.env.DODO_PAYMENTS_ENVIRONMENT?.trim()
  if (raw === "live_mode" || raw === "test_mode") return raw
  return process.env.DODO_PAYMENTS_API_KEY?.startsWith("dodo_live_") ? "live_mode" : "test_mode"
}

export function getDodoClient(): DodoPayments {
  if (client) return client
  const bearerToken = process.env.DODO_PAYMENTS_API_KEY
  if (!bearerToken) throw new Error("DODO_PAYMENTS_API_KEY is not set")
  client = new DodoPayments({
    bearerToken,
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY || null,
    environment: getDodoEnvironment(),
  })
  return client
}

let productCache: { at: number; map: Map<string, string> } | null = null
const CACHE_MS = 5 * 60 * 1000

function overrideIds(): Record<string, string> {
  try {
    const raw = process.env.DODO_PRODUCT_IDS
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

/** Dodo product id for a sellable key, from DODO_PRODUCT_IDS or by metadata.sku lookup. */
export async function resolveDodoProductId(sku: string): Promise<string> {
  const o = overrideIds()[sku]
  if (o) return o
  if (!productCache || Date.now() - productCache.at > CACHE_MS) {
    const map = new Map<string, string>()
    for await (const p of getDodoClient().products.list({ archived: false })) {
      const s = (p.metadata as Record<string, string> | undefined)?.sku
      if (s) map.set(s, p.product_id)
    }
    productCache = { at: Date.now(), map }
  }
  const id = productCache.map.get(sku)
  if (!id) throw new Error(`No Dodo product for "${sku}". Run scripts/billing/dodo-sync-products.mjs or set DODO_PRODUCT_IDS.`)
  return id
}

export function isDodoConfigured() {
  return Boolean(process.env.DODO_PAYMENTS_API_KEY)
}
