import "server-only"
import { getDodoClient, getDodoEnvironment } from "./dodo"
import { getSellable, listSellableKeys } from "./sellables"

export interface DodoSyncRow {
  key: string
  name: string
  priceUsdCents: number
  action: "create" | "update" | "ok"
  productId?: string
}

/** Create or update one Dodo product per sellable, matched by metadata.sku. Dry run unless apply. */
export async function syncDodoProducts(apply: boolean): Promise<{ environment: string; rows: DodoSyncRow[] }> {
  const dodo = getDodoClient()
  const existing = new Map<string, { id: string; price: number | null; name: string }>()
  for await (const p of dodo.products.list({ archived: false })) {
    const sku = (p.metadata as Record<string, string> | undefined)?.sku
    if (sku) existing.set(sku, { id: p.product_id, price: (p as { price?: number | null }).price ?? null, name: p.name ?? "" })
  }
  const rows: DodoSyncRow[] = []
  for (const key of listSellableKeys()) {
    const s = getSellable(key)
    if (!s) continue
    const price = { type: "one_time_price" as const, currency: "USD" as const, price: s.priceUsdCents, discount_bps: 0, purchasing_power_parity: false, tax_inclusive: false }
    const found = existing.get(key)
    if (!found) {
      let productId: string | undefined
      if (apply) {
        const p = await dodo.products.create({ name: s.name, description: s.description, tax_category: s.taxCategory, price, metadata: { sku: key } } as Parameters<typeof dodo.products.create>[0])
        productId = p.product_id
      }
      rows.push({ key, name: s.name, priceUsdCents: s.priceUsdCents, action: "create", productId })
      continue
    }
    const changed = found.name !== s.name || (found.price !== null && found.price !== s.priceUsdCents)
    if (apply && changed) {
      await dodo.products.update(found.id, { name: s.name, description: s.description, tax_category: s.taxCategory, price } as Parameters<typeof dodo.products.update>[1])
    }
    rows.push({ key, name: s.name, priceUsdCents: s.priceUsdCents, action: changed ? "update" : "ok", productId: found.id })
  }
  return { environment: getDodoEnvironment(), rows }
}
