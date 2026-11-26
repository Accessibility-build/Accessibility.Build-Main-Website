"use client"

import { cn } from "@/lib/utils"
import type { CoverageEntry } from "@/lib/url-audit/types"
import { COVERAGE_META, plural } from "./meta"

const PRINCIPLES = ["Perceivable", "Operable", "Understandable", "Robust"]
const ORDER: CoverageEntry["status"][] = ["fail", "review", "tested", "manual"]

interface CoverageMapProps {
  coverage: CoverageEntry[]
  selected: string | null
  onSelect: (sc: string) => void
}

/**
 * Every WCAG 2.2 Level A and AA success criterion, coloured by what this scan could say about it.
 * Status is spelled out in each tile's text and symbol, not carried by colour.
 */
export function CoverageMap({ coverage, selected, onSelect }: CoverageMapProps) {
  const totals = ORDER.map((status) => ({ status, count: coverage.filter((entry) => entry.status === status).length }))
  const automated = coverage.length - (totals.find((t) => t.status === "manual")?.count ?? 0)

  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
        Automated checks reached {automated} of the {coverage.length} Level A and AA criteria on this page. The rest need a person, which is normal: no tool can judge most of WCAG. Select a failing or review criterion to filter the findings.
      </p>

      <ul className="flex flex-wrap gap-2 text-sm" aria-label="Coverage totals">
        {totals.map(({ status, count }) => (
          <li key={status} className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1", COVERAGE_META[status].tile)}>
            <span aria-hidden="true" className="font-bold">
              {COVERAGE_META[status].symbol}
            </span>
            <span>
              <strong className="font-semibold tabular-nums">{count}</strong> {COVERAGE_META[status].label.toLowerCase()}
            </span>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        {PRINCIPLES.map((principle) => {
          const entries = coverage.filter((entry) => entry.principle === principle)
          if (entries.length === 0) return null
          return (
            <section key={principle} aria-label={principle}>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">{principle}</h3>
              <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-5">
                {entries.map((entry) => {
                  const meta = COVERAGE_META[entry.status]
                  const actionable = entry.status === "fail" || entry.status === "review"
                  const label = `${entry.sc} ${entry.title}, level ${entry.level}: ${meta.label}${entry.findings ? `, ${plural(entry.findings, "finding")}` : ""}`
                  const body = (
                    <>
                      <span className="flex items-center justify-between gap-1">
                        <span className="font-mono text-xs font-semibold tabular-nums">{entry.sc}</span>
                        <span aria-hidden="true" className="text-xs font-bold">
                          {meta.symbol}
                        </span>
                      </span>
                      <span className="mt-0.5 line-clamp-2 text-[11px] leading-tight">{entry.title}</span>
                    </>
                  )
                  return (
                    <li key={entry.sc}>
                      {actionable ? (
                        <button
                          type="button"
                          onClick={() => onSelect(entry.sc)}
                          aria-pressed={selected === entry.sc}
                          aria-label={label}
                          title={label}
                          className={cn(
                            "flex h-full min-h-14 w-full flex-col rounded-md border px-2 py-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1",
                            meta.tile,
                            selected === entry.sc && "ring-2 ring-slate-900 ring-offset-1 dark:ring-white dark:ring-offset-slate-950",
                          )}
                        >
                          {body}
                        </button>
                      ) : (
                        <div role="img" aria-label={label} title={label} className={cn("flex h-full min-h-14 flex-col rounded-md border px-2 py-1.5", meta.tile)}>
                          {body}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>

      <dl className="grid gap-2 text-xs text-slate-700 dark:text-slate-300 sm:grid-cols-2">
        {ORDER.map((status) => (
          <div key={status} className="flex gap-2">
            <dt className="font-semibold">
              <span aria-hidden="true">{COVERAGE_META[status].symbol}</span> {COVERAGE_META[status].label}:
            </dt>
            <dd>{COVERAGE_META[status].legend}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
