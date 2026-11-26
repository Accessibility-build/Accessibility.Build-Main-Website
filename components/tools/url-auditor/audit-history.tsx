"use client"

import { Loader2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AuditHistory } from "@/lib/url-accessibility-auditor-types"
import { hostOf, plural, scoreBand } from "./meta"

interface AuditHistoryListProps {
  history: AuditHistory | null
  loading: boolean
  onOpen: (auditId: string) => void
  onDelete: (auditId: string) => void
}

export function AuditHistoryList({ history, loading, onOpen, onDelete }: AuditHistoryListProps) {
  if (loading && !history) {
    return (
      <p className="flex items-center justify-center gap-2 py-12 text-sm text-slate-700 dark:text-slate-300">
        <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
        Loading your audits
      </p>
    )
  }
  if (!history || history.audits.length === 0) {
    return <p className="rounded-xl border border-dashed border-slate-300 px-4 py-12 text-center text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300">Audits you run while signed in appear here, so you can reopen them without paying again.</p>
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-4 font-serif text-2xl font-semibold text-slate-900 dark:text-white">Your recent audits</h2>
      <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
        {history.audits.map((entry) => {
          const score = entry.overallScore ?? 0
          const band = scoreBand(score)
          const when = new Date(entry.processingCompletedAt ?? entry.createdAt)
          return (
            <li key={entry.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
              <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-base font-bold tabular-nums", band.text, "border-current")} aria-hidden="true">
                {entry.overallScore ?? "–"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900 dark:text-white">
                  {entry.title || hostOf(entry.url)}
                  <span className="sr-only">, score {entry.overallScore ?? "not available"} of 100</span>
                </p>
                <p className="truncate text-sm text-slate-600 dark:text-slate-400">{entry.url}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  <time dateTime={when.toISOString()}>{when.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</time> · {plural(entry.totalViolations, "failing rule")}
                  {entry.criticalCount ? `, ${entry.criticalCount} critical` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => onOpen(entry.id)} className="inline-flex h-10 items-center rounded-lg border border-slate-300 px-3.5 text-sm font-medium text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800" aria-label={`Open the audit of ${entry.title || hostOf(entry.url)}`}>
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(entry.id)}
                  aria-label={`Delete the audit of ${entry.title || hostOf(entry.url)}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-red-950 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
