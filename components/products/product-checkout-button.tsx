"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

/** Starts a Dodo Payments hosted checkout for a course licence or template. */
export function ProductCheckoutButton({ item, label, ariaLabel }: { item: string; label: string; ariaLabel: string }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function start() {
    setBusy(true)
    setError("")
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item, returnTo: `${window.location.pathname}#buy` }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 401 && data.signInUrl) {
        window.location.href = data.signInUrl
        return
      }
      if (res.status === 409 && data.redirect) {
        window.location.href = data.redirect
        return
      }
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout. Please try again.")
      window.location.href = data.url
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start checkout. Please try again.")
      setBusy(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={start}
        disabled={busy}
        aria-label={ariaLabel}
        className="inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {busy ? "Opening secure checkout..." : label}
      </button>
      {error ? <p role="alert" className="mt-2 text-sm font-medium text-red-800 dark:text-red-300">{error}</p> : null}
    </div>
  )
}
