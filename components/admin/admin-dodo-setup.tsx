"use client"

import { useEffect, useState } from "react"
import { AdminDodoProducts } from "./admin-dodo-products"

interface Status {
  environment: string
  url: string
  endpoint: { id: string; disabled: boolean } | null
  secretConfigured: boolean
}

/** Dodo Payments setup: API key check, webhook endpoint registration and product sync. */
export function AdminDodoSetup() {
  const [status, setStatus] = useState<Status | null>(null)
  const [error, setError] = useState("")
  const [secret, setSecret] = useState("")
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState("")

  async function load() {
    const res = await fetch("/api/admin/billing/dodo-webhook", { cache: "no-store" })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return setError(data.error || "Could not reach Dodo")
    setError("")
    setStatus(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function setup() {
    setBusy(true)
    setError("")
    const res = await fetch("/api/admin/billing/dodo-webhook", { method: "POST" })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) return setError(data.error || "Webhook setup failed")
    setSecret(data.secret)
    load()
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(secret)
      setCopied("Copied to the clipboard.")
    } catch {
      setCopied("Copy failed: select the text and copy it.")
    }
  }

  const keyMissing = error.includes("DODO_PAYMENTS_API_KEY")
  return (
    <div className="space-y-6">
      <section aria-labelledby="dodo-setup-h" className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <h2 id="dodo-setup-h" className="text-lg font-semibold text-slate-900 dark:text-white">Dodo Payments setup</h2>
        <ol className="list-decimal space-y-3 pl-6 text-slate-700 dark:text-slate-300">
          <li>
            <strong className="text-slate-900 dark:text-white">API key.</strong>{" "}
            {keyMissing ? (
              <>Not set. In the Dodo dashboard open Developer, then API Keys, create a test key, and add it as <code>DODO_PAYMENTS_API_KEY</code> in <code>.env.local</code> and on Vercel. Then reload this page.</>
            ) : status ? (
              <>Set ({status.environment === "live_mode" ? "live mode" : "test mode"}).</>
            ) : error ? (
              <>Could not check: {error}</>
            ) : (
              <>Checking...</>
            )}
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Webhook endpoint.</strong>{" "}
            {status?.endpoint ? (
              <>Registered: <code className="break-all">{status.url}</code>{status.endpoint.disabled ? " (disabled in Dodo: enable it there)" : ""}.</>
            ) : status ? (
              <>Not registered yet. Use the button below.</>
            ) : (
              <>Needs the API key first.</>
            )}
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Signing secret on this deployment.</strong>{" "}
            {status?.secretConfigured ? <>Set.</> : <>Not set. Press the button, then add the secret as <code>DODO_PAYMENTS_WEBHOOK_KEY</code> in <code>.env.local</code> and on Vercel, and redeploy.</>}
          </li>
        </ol>
        {status ? (
          <button
            type="button"
            onClick={setup}
            disabled={busy}
            className="min-h-[44px] rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            {busy ? "Working..." : status.endpoint ? "Show the webhook signing secret" : "Set up webhook"}
          </button>
        ) : null}
        {error && !keyMissing ? <p role="alert" className="font-medium text-red-800 dark:text-red-300">{error}</p> : null}
        {secret ? (
          <div className="rounded-lg border-2 border-amber-600 bg-amber-50 p-4 dark:bg-slate-900">
            <p className="font-semibold text-slate-900 dark:text-white">Signing secret (keep it private)</p>
            <label htmlFor="dodo-secret" className="mt-2 block text-sm text-slate-700 dark:text-slate-300">DODO_PAYMENTS_WEBHOOK_KEY</label>
            <input id="dodo-secret" readOnly value={secret} onFocus={(e) => e.currentTarget.select()} className="mt-1 w-full min-h-[44px] rounded-lg border-2 border-slate-400 bg-white px-3 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-white" />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" onClick={copy} className="min-h-[44px] rounded-lg border-2 border-blue-700 px-4 py-2 font-semibold text-blue-700 dark:border-blue-400 dark:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">Copy secret</button>
              <p role="status" className="text-sm text-slate-700 dark:text-slate-300">{copied}</p>
            </div>
          </div>
        ) : null}
      </section>
      {status ? <AdminDodoProducts /> : null}
    </div>
  )
}
