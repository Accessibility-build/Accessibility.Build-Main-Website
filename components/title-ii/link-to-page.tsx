"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

/**
 * Ready-made link text for staff adding this page to a resource list. A
 * visible, selectable field plus a copy button, so it works whether or not
 * the clipboard API is allowed (many government browsers lock it down).
 */
export function LinkToPage({ url, title }: { url: string; title: string }) {
  const html = `<a href="${url}">${title}</a>`
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(value: string, what: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(what)
      window.setTimeout(() => setCopied(null), 2500)
    } catch {
      setCopied("blocked")
    }
  }

  const rows: { id: string; label: string; value: string }[] = [
    { id: "link-url", label: "Address", value: url },
    { id: "link-html", label: "HTML link", value: html },
  ]

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.id}>
          <label htmlFor={row.id} className="mb-1 block text-sm font-medium text-slate-900 dark:text-white">
            {row.label}
          </label>
          <div className="flex gap-2">
            <input
              id={row.id}
              readOnly
              value={row.value}
              onFocus={(e) => e.currentTarget.select()}
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <button
              type="button"
              onClick={() => copy(row.value, row.label)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {copied === row.label ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              Copy<span className="sr-only"> {row.label.toLowerCase()}</span>
            </button>
          </div>
        </div>
      ))}
      <p role="status" className="min-h-[1.25rem] text-sm text-slate-600 dark:text-slate-400">
        {copied === "blocked"
          ? "Your browser blocked copying. Select the text in the field and copy it instead."
          : copied
            ? `${copied} copied.`
            : ""}
      </p>
    </div>
  )
}
