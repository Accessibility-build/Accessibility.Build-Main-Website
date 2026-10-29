"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

/** A code sample with a filename bar and a copy button that says when it worked. */
export function CodeSample({ code, filename }: { code: string; filename: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-slate-100">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-2">
        <span className="font-mono text-xs text-slate-300">{filename}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
        >
          {copied ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Copy aria-hidden="true" className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
          <span className="sr-only"> {filename}</span>
        </button>
      </div>
      {/* Focusable so keyboard users can scroll long lines; the page-wide two-tone ring shows on it. */}
      <pre tabIndex={0} className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
      <p className="sr-only" role="status">
        {copied ? "Copied to clipboard" : ""}
      </p>
    </div>
  )
}
