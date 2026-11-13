"use client"

import { useState } from "react"

interface Row {
  key: string
  name: string
  priceUsdCents: number
  action: "create" | "update" | "ok"
  productId?: string
}

export function AdminDodoProducts() {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [env, setEnv] = useState("")
  const [msg, setMsg] = useState("")
  const [busy, setBusy] = useState(false)

  async function run(apply: boolean) {
    setBusy(true)
    setMsg("")
    const res = apply
      ? await fetch("/api/admin/billing/dodo-products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ apply: true }) })
      : await fetch("/api/admin/billing/dodo-products", { cache: "no-store" })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) return setMsg(data.error || "Request failed")
    setRows(data.rows)
    setEnv(data.environment)
    setMsg(apply ? "Products are in sync with Dodo." : "Checked. Nothing has been changed yet.")
  }

  const pending = rows?.filter((r) => r.action !== "ok").length ?? 0
  return (
    <section aria-labelledby="dodo-h" className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
      <h2 id="dodo-h" className="text-lg font-semibold text-slate-900 dark:text-white">Dodo Payments products</h2>
      <p className="text-slate-600 dark:text-slate-400">Every credit pack, course licence and template needs a matching product in Dodo. Check, then create or update them. Run this once in test mode and again after switching to live keys.</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => run(false)} className="min-h-[44px] rounded-lg border-2 border-blue-700 px-4 py-2 font-semibold text-blue-700 dark:border-blue-400 dark:text-blue-300 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">Check products</button>
        {rows && pending > 0 ? (
          <button type="button" disabled={busy} onClick={() => run(true)} className="min-h-[44px] rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">Create and update {pending} products</button>
        ) : null}
      </div>
      <p role="status" className="font-medium text-slate-800 dark:text-slate-200">{msg}</p>
      {rows ? (
        <div role="region" aria-labelledby="dodo-cap" tabIndex={0} className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
          <table className="w-full text-left text-sm">
            <caption id="dodo-cap" className="p-3 text-left font-semibold text-slate-900 dark:text-white">Products in Dodo ({env === "live_mode" ? "live mode" : "test mode"})</caption>
            <thead className="bg-slate-100 dark:bg-slate-900"><tr><th scope="col" className="p-3">Product</th><th scope="col" className="p-3">Price</th><th scope="col" className="p-3">Status</th><th scope="col" className="p-3">Dodo id</th></tr></thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {rows.map((r) => (
                <tr key={r.key}>
                  <th scope="row" className="p-3 font-medium">{r.name}<span className="block text-xs font-normal text-slate-600 dark:text-slate-400">{r.key}</span></th>
                  <td className="p-3">${(r.priceUsdCents / 100).toFixed(2)}</td>
                  <td className="p-3">{r.action === "ok" ? "In sync" : r.action === "create" ? "Missing" : "Needs update"}</td>
                  <td className="p-3 break-all">{r.productId ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}
