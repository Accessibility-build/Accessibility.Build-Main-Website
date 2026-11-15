// Simple, server-rendered charts for the Fortune 100 study.
//
// Accessibility choices:
// - Every bar chart is a real <table> with a caption, column headers and row
//   headers. The bar inside the cell is decoration (aria-hidden); the value is
//   always printed as text next to it, so nothing depends on colour or shape.
// - No hover tooltips, so there is no hover-only content (WCAG 1.4.13).
// - The 100-square chart has a text alternative (figcaption) and a visible
//   legend with counts. Its three groups are contiguous blocks, and the
//   "failed axe" squares also carry a diagonal stripe, so colour is never the
//   only cue (WCAG 1.4.1). All marks keep 3:1 against the page (WCAG 1.4.11).
// - In forced-colors mode marks keep their colours via forced-color-adjust.
// Colours are CSS custom properties set on .f100 in page.tsx.

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

const STRIPE = "repeating-linear-gradient(45deg, transparent 0 3px, rgba(255,255,255,0.45) 3px 4.5px)"

export function OutcomeWaffle({ cleanBoth, axeCleanOnly, failedAxe }: { cleanBoth: number; axeCleanOnly: number; failedAxe: number }) {
  const groups = [
    { key: "both", label: "Passed the scan and every manual check", n: cleanBoth, color: "var(--f-s3)", stripe: false },
    { key: "hidden", label: "Passed the scan, failed a manual check", n: axeCleanOnly, color: "var(--f-s1)", stripe: false },
    { key: "axe", label: "Failed at least one axe-core rule", n: failedAxe, color: "var(--f-s2)", stripe: true },
  ]
  const cells = groups.flatMap((g) => Array.from({ length: g.n }, () => g))
  return (
    <figure>
      <figcaption className="sr-only">
        Of 100 Fortune 100 homepages, {cleanBoth} passed both the axe-core scan and every manual check, {axeCleanOnly} passed the
        scan but failed a manual check, and {failedAxe} failed at least one axe-core rule.
      </figcaption>
      <div aria-hidden="true" className="f100-mark grid grid-cols-10 gap-1">
        {cells.map((c, idx) => (
          <div key={idx} className="aspect-square rounded-[3px]" style={{ background: c.stripe ? `${STRIPE}, ${c.color}` : c.color }} />
        ))}
      </div>
      <ul aria-hidden="true" className="mt-5 space-y-2 text-sm">
        {groups.map((g) => (
          <li key={g.key} className="flex items-center gap-3">
            <span className="f100-mark h-3.5 w-3.5 shrink-0 rounded-[3px]" style={{ background: g.stripe ? `${STRIPE}, ${g.color}` : g.color }} />
            <span className="w-7 font-mono font-semibold tabular-nums text-slate-900 dark:text-white">{g.n}</span>
            <span className="text-slate-600 dark:text-slate-300">{g.label}</span>
          </li>
        ))}
      </ul>
    </figure>
  )
}

export function SplitBar({ parts, caption }: { parts: { label: string; value: number; color: string; ink: string }[]; caption: string }) {
  const total = parts.reduce((s, p) => s + p.value, 0)
  return (
    <figure>
      <figcaption className="sr-only">{caption}</figcaption>
      <div aria-hidden="true" className="f100-mark flex h-12 gap-[2px] overflow-hidden rounded-lg">
        {parts.map((p) => (
          <div
            key={p.label}
            className="flex items-center justify-center font-mono text-base font-semibold tabular-nums"
            style={{ width: `${(100 * p.value) / total}%`, background: p.color, color: p.ink }}
          >
            {p.value}
          </div>
        ))}
      </div>
      <ul aria-hidden="true" className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-2">
            <span className="f100-mark h-3 w-3 rounded-[3px]" style={{ background: p.color }} />
            {p.label}: <span className="font-mono tabular-nums text-slate-900 dark:text-white">{p.value}</span>
          </li>
        ))}
      </ul>
    </figure>
  )
}

export interface BarColumn {
  header: string
  align?: "left" | "right"
}

/**
 * A data table whose last column is the charted value: the number is printed,
 * and a bar beside it shows its size relative to `max`.
 * `cells` holds the other columns; the first cell is the row header.
 */
export function BarTable({
  caption,
  columns,
  valueHeader,
  rows,
  max,
}: {
  caption: string
  columns: BarColumn[]
  valueHeader: string
  rows: { key: string; cells: ReactNode[]; value: number }[]
  max: number
}) {
  const th = "border-b border-slate-200 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:text-slate-400"
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={caption}
      className="relative overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
    >
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.header} scope="col" className={cn(th, c.align === "right" ? "text-right" : "text-left")}>
                {c.header}
              </th>
            ))}
            <th scope="col" className={cn(th, "min-w-[11rem] text-left")}>{valueHeader}</th>
          </tr>
        </thead>
        <tbody className="text-slate-700 dark:text-slate-300">
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-slate-100 last:border-0 dark:border-slate-800/70">
              {r.cells.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="whitespace-nowrap px-3 py-2.5 text-left font-medium text-slate-900 dark:text-white">{c}</th>
                ) : (
                  <td key={i} className={cn("px-3 py-2.5", columns[i]?.align === "right" && "text-right font-mono tabular-nums")}>{c}</td>
                ),
              )}
              <td className="px-3 py-2.5">
                <span className="flex items-center gap-3">
                  <span className="w-9 shrink-0 text-right font-mono font-semibold tabular-nums text-slate-900 dark:text-white">{r.value}</span>
                  <span aria-hidden="true" className="h-2.5 flex-1">
                    <span className="f100-mark block h-full rounded-r-[3px]" style={{ width: `${Math.max(1.5, (100 * r.value) / max)}%`, background: "var(--f-s1)" }} />
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
