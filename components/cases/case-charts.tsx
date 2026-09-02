// Data graphics shared by the case studies. Each one exists because a
// paragraph carried the same information badly: a set of figures that only
// make sense in proportion to each other, a pair of clocks that only make
// sense side by side, a before-and-after that only makes sense as a series.
//
// Every graphic has a text equivalent that reaches assistive technology, and
// no distinction is carried by colour alone.

import type { ReactNode } from "react"

/* ------------------------------------------------------------------ */
/* Money in proportion                                                 */
/* ------------------------------------------------------------------ */

export interface MoneyItem {
  label: string
  /** Dollars. Zero is allowed and is drawn as an empty track. */
  value: number
  /** Where the figure comes from, shown under the label. */
  note: string
  tone?: "spend" | "estimate" | "award" | "none"
}

const toneBar: Record<NonNullable<MoneyItem["tone"]>, string> = {
  spend: "bg-slate-700 dark:bg-slate-300",
  estimate: "bg-amber-600 dark:bg-amber-400",
  award: "bg-emerald-700 dark:bg-emerald-400",
  none: "bg-transparent",
}

const toneWord: Record<NonNullable<MoneyItem["tone"]>, string> = {
  spend: "spent",
  estimate: "estimated",
  award: "awarded",
  none: "nothing",
}

function dollars(n: number) {
  return n === 0 ? "$0" : `$${n.toLocaleString("en-US")}`
}

/**
 * Figures from the record drawn to one scale. The point is usually that one
 * of them is invisible next to the others, so the smallest bars keep a
 * two-pixel sliver and the number is always printed.
 */
export function MoneyBars({
  title,
  lede,
  items,
  note,
}: {
  title: string
  lede: string
  items: MoneyItem[]
  note?: ReactNode
}) {
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <figure className="not-prose my-10">
      <figcaption className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </figcaption>
      <p className="mb-5 max-w-[62ch] text-sm leading-6 text-slate-600 dark:text-slate-400">{lede}</p>
      <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40 sm:p-6">
        <ol className="space-y-4" role="list">
          {items.map((item) => {
            const pct = item.value === 0 ? 0 : Math.max((item.value / max) * 100, 0.4)
            const tone = item.tone ?? "spend"
            return (
              <li key={item.label} className="grid gap-x-6 gap-y-1 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                  <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">{item.note}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 flex-1 overflow-hidden rounded-sm bg-slate-100 dark:bg-slate-800"
                    aria-hidden="true"
                  >
                    <div className={`h-full ${toneBar[tone]}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="w-28 shrink-0 text-right font-mono text-sm tabular-nums text-slate-900 dark:text-white">
                    {dollars(item.value)}
                    <span className="sr-only"> {toneWord[tone]}</span>
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
        {note ? (
          <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500 dark:border-slate-800 dark:text-slate-400">
            {note}
          </p>
        ) : null}
      </div>
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/* Two clocks                                                          */
/* ------------------------------------------------------------------ */

export interface SpanBar {
  label: string
  start: string // ISO date
  end: string // ISO date
  tone: "injunction" | "appeal"
}

export interface SpanMarker {
  label: string
  date: string // ISO date
}

function monthsBetween(a: string, b: string) {
  const da = new Date(a)
  const db = new Date(b)
  return (db.getFullYear() - da.getFullYear()) * 12 + (db.getMonth() - da.getMonth()) + (db.getDate() - da.getDate()) / 30
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
}

/**
 * Two spans on one time axis, with the events that matter marked. Built for
 * Winn-Dixie, where the appeal outlived the injunction it was appealing, but
 * it will draw any pair of overlapping periods.
 */
export function TwoClocks({
  title,
  lede,
  from,
  to,
  bars,
  markers,
  summary,
}: {
  title: string
  lede: string
  from: string
  to: string
  bars: SpanBar[]
  markers: SpanMarker[]
  /** One sentence for assistive technology and for the caption. */
  summary: string
}) {
  const total = monthsBetween(from, to)
  const x = (d: string) => 40 + (monthsBetween(from, d) / total) * 680
  const yearTicks: string[] = []
  for (let y = new Date(from).getFullYear() + 1; y <= new Date(to).getFullYear(); y++) {
    yearTicks.push(`${y}-01-01`)
  }
  const toneFill = {
    injunction: "fill-emerald-700 dark:fill-emerald-400",
    appeal: "fill-slate-500 dark:fill-slate-400",
  }

  return (
    <figure className="not-prose my-10">
      <figcaption className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </figcaption>
      <p className="mb-5 max-w-[62ch] text-sm leading-6 text-slate-600 dark:text-slate-400">{lede}</p>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40 sm:p-6">
        <svg viewBox="0 0 760 236" className="w-full min-w-[560px]" aria-hidden="true">
          {yearTicks.map((t) => (
            <g key={t}>
              <line
                x1={x(t)}
                x2={x(t)}
                y1={20}
                y2={176}
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth={1}
              />
              <text
                x={x(t)}
                y={14}
                textAnchor="middle"
                className="fill-slate-500 text-[11px] dark:fill-slate-400"
              >
                {new Date(t).getFullYear()}
              </text>
            </g>
          ))}
          {bars.map((bar, i) => {
            const y = 40 + i * 62
            return (
              <g key={bar.label}>
                <rect
                  x={x(bar.start)}
                  y={y}
                  width={Math.max(x(bar.end) - x(bar.start), 2)}
                  height={18}
                  rx={3}
                  className={toneFill[bar.tone]}
                />
                <text
                  x={x(bar.start)}
                  y={y - 6}
                  className="fill-slate-900 text-[12px] font-semibold dark:fill-white"
                >
                  {bar.label}
                </text>
                <text
                  x={x(bar.start)}
                  y={y + 31}
                  className="fill-slate-500 text-[11px] dark:fill-slate-400"
                >
                  {fmt(bar.start)} to {fmt(bar.end)}
                </text>
              </g>
            )
          })}
          {markers.map((m, i) => {
            const mx = x(m.date)
            const anchor = mx > 600 ? "end" : mx < 120 ? "start" : "middle"
            return (
              <g key={m.label}>
                <line
                  x1={mx}
                  x2={mx}
                  y1={30}
                  y2={176}
                  className="stroke-rose-700 dark:stroke-rose-400"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                />
                <circle cx={mx} cy={176} r={4} className="fill-rose-700 dark:fill-rose-400" />
                <text
                  x={mx}
                  y={198 + (i % 2) * 16}
                  textAnchor={anchor}
                  className="fill-slate-700 text-[11px] dark:fill-slate-300"
                >
                  {m.label}
                </text>
              </g>
            )
          })}
        </svg>
        <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">{summary}</p>
        <ul className="sr-only">
          {bars.map((b) => (
            <li key={b.label}>
              {b.label}: {fmt(b.start)} to {fmt(b.end)}.
            </li>
          ))}
          {markers.map((m) => (
            <li key={m.label}>
              {m.label}: {fmt(m.date)}.
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/* Archived captures as a series                                        */
/* ------------------------------------------------------------------ */

export interface CaptureRow {
  date: string
  /** Where the capture sits in the story, e.g. "During the suit". */
  phase: string
  images: number
  missingAlt: number
  unnamedLinks: number
  unnamedButtons?: number
  /** Image-map hotspots, the barrier the Target complaint named. */
  mapAreas?: number
  mapAreasMissingAlt?: number
  /** Undefined where the capture was not checked for it. */
  accessibilityLink?: boolean
  lang: boolean
}

/**
 * The same home page measured at several points in time. Automated counts of
 * the served markup: they find the class of defect these cases pleaded, and
 * nothing more, which the note under the table says out loud.
 */
export function CaptureSeries({
  title,
  lede,
  site,
  rows,
  note,
}: {
  title: string
  lede: string
  site: string
  rows: CaptureRow[]
  note: ReactNode
}) {
  const showButtons = rows.some((r) => typeof r.unnamedButtons === "number")
  const showAreas = rows.some((r) => typeof r.mapAreas === "number")
  const showA11yLink = rows.some((r) => typeof r.accessibilityLink === "boolean")
  return (
    <figure className="not-prose my-10">
      <figcaption className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </figcaption>
      <p className="mb-5 max-w-[62ch] text-sm leading-6 text-slate-600 dark:text-slate-400">{lede}</p>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            Accessibility markers measured in archived captures of the {site} home page
          </caption>
          <thead>
            <tr>
              {[
                ["Capture", false],
                ["Phase", false],
                ["Images", true],
                ["Missing alt", true],
                ["Unnamed links", true],
                ...(showButtons ? [["Unnamed buttons", true] as const] : []),
                ...(showAreas ? [["Image-map areas", true] as const, ["Areas missing alt", true] as const] : []),
                ...(showA11yLink ? [["Accessibility link", false] as const] : []),
                ["Language set", false],
              ].map(([h, numeric]) => (
                <th
                  key={String(h)}
                  scope="col"
                  className={`border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 ${numeric ? "text-right" : "text-left"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const bad = r.missingAlt > 0
              return (
                <tr key={r.date}>
                  <th
                    scope="row"
                    className="border-b border-slate-200 px-4 py-3 text-left font-mono text-xs text-slate-700 dark:border-slate-800 dark:text-slate-300"
                  >
                    {r.date}
                  </th>
                  <td className="border-b border-slate-200 px-4 py-3 text-slate-600 dark:border-slate-800 dark:text-slate-400">
                    {r.phase}
                  </td>
                  <td className="border-b border-slate-200 px-4 py-3 text-right font-mono tabular-nums text-slate-700 dark:border-slate-800 dark:text-slate-300">
                    {r.images}
                  </td>
                  <td
                    className={`border-b border-slate-200 px-4 py-3 text-right font-mono tabular-nums dark:border-slate-800 ${bad ? "font-semibold text-rose-800 dark:text-rose-300" : "text-emerald-800 dark:text-emerald-300"}`}
                  >
                    {r.missingAlt}
                  </td>
                  <td className="border-b border-slate-200 px-4 py-3 text-right font-mono tabular-nums text-slate-700 dark:border-slate-800 dark:text-slate-300">
                    {r.unnamedLinks}
                  </td>
                  {showButtons ? (
                    <td className="border-b border-slate-200 px-4 py-3 text-right font-mono tabular-nums text-slate-700 dark:border-slate-800 dark:text-slate-300">
                      {typeof r.unnamedButtons === "number" ? r.unnamedButtons : "n/a"}
                    </td>
                  ) : null}
                  {showAreas ? (
                    <>
                      <td className="border-b border-slate-200 px-4 py-3 text-right font-mono tabular-nums text-slate-700 dark:border-slate-800 dark:text-slate-300">
                        {typeof r.mapAreas === "number" ? r.mapAreas : "n/a"}
                      </td>
                      <td
                        className={`border-b border-slate-200 px-4 py-3 text-right font-mono tabular-nums dark:border-slate-800 ${(r.mapAreasMissingAlt ?? 0) > 0 ? "font-semibold text-rose-800 dark:text-rose-300" : "text-slate-700 dark:text-slate-300"}`}
                      >
                        {typeof r.mapAreasMissingAlt === "number" ? r.mapAreasMissingAlt : "n/a"}
                      </td>
                    </>
                  ) : null}
                  {showA11yLink ? (
                    <td className="border-b border-slate-200 px-4 py-3 text-slate-700 dark:border-slate-800 dark:text-slate-300">
                      {typeof r.accessibilityLink === "boolean" ? (r.accessibilityLink ? "Yes" : "No") : "n/a"}
                    </td>
                  ) : null}
                  <td className="border-b border-slate-200 px-4 py-3 text-slate-700 dark:border-slate-800 dark:text-slate-300">
                    {r.lang ? "Yes" : "No"}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="px-4 py-4 text-xs leading-5 text-slate-500 dark:text-slate-400">{note}</p>
      </div>
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/* What a ruling kept and what it cut                                  */
/* ------------------------------------------------------------------ */

/**
 * A holding that split a website down the middle, shown as the two halves.
 * Icon plus label on each side, never colour alone.
 */
export function KeptAndCut({
  title,
  lede,
  keptHeading,
  cutHeading,
  kept,
  cut,
  note,
}: {
  title: string
  lede: string
  keptHeading: string
  cutHeading: string
  kept: string[]
  cut: string[]
  note?: ReactNode
}) {
  return (
    <figure className="not-prose my-10">
      <figcaption className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </figcaption>
      <p className="mb-5 max-w-[62ch] text-sm leading-6 text-slate-600 dark:text-slate-400">{lede}</p>
      <div className="grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 md:grid-cols-2">
        <section aria-labelledby="kept-heading" className="bg-white p-5 dark:bg-slate-900 sm:p-6">
          <h3
            id="kept-heading"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-800 dark:text-emerald-300"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                d="M3 8.5l3.5 3.5L13 4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {keptHeading}
          </h3>
          <ul className="mt-4 space-y-2.5 text-[0.95rem] leading-6 text-slate-700 dark:text-slate-300">
            {kept.map((k) => (
              <li key={k} className="grid grid-cols-[0.75rem_1fr] gap-3">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 rounded-full bg-emerald-700 dark:bg-emerald-400" />
                {k}
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="cut-heading" className="bg-white p-5 dark:bg-slate-900 sm:p-6">
          <h3
            id="cut-heading"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-rose-800 dark:text-rose-300"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
            </svg>
            {cutHeading}
          </h3>
          <ul className="mt-4 space-y-2.5 text-[0.95rem] leading-6 text-slate-700 dark:text-slate-300">
            {cut.map((c) => (
              <li key={c} className="grid grid-cols-[0.75rem_1fr] gap-3">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 rounded-full bg-rose-700 dark:bg-rose-400" />
                {c}
              </li>
            ))}
          </ul>
        </section>
      </div>
      {note ? (
        <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">{note}</p>
      ) : null}
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/* Who was actually speaking                                           */
/* ------------------------------------------------------------------ */

/**
 * A discussion about a group of people, with the comments from that group
 * picked out. The two numbers say it; the grid makes it land. Pass a count of
 * surviving comments, never a descendant total, which includes deleted items.
 */
export function VoiceShare({
  total,
  highlighted,
  title,
  lede,
  labels,
}: {
  total: number
  highlighted: number
  title: string
  lede: string
  labels: { total: string; highlighted: string; share: string }
}) {
  return (
    <figure className="not-prose my-10">
      <figcaption className="text-lg font-semibold text-slate-900 dark:text-white">{title}</figcaption>
      <p className="mt-2 max-w-[62ch] text-sm leading-6 text-slate-600 dark:text-slate-400">{lede}</p>
      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40 sm:p-6">
        <div aria-hidden="true" className="flex flex-wrap gap-[3px]">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={`h-[7px] w-[7px] rounded-full ${
                i < highlighted ? "bg-teal-600 dark:bg-teal-400" : "bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
        <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {labels.total}
            </dt>
            <dd className="mt-0.5 font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {total}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {labels.highlighted}
            </dt>
            <dd className="mt-0.5 font-mono text-xl font-semibold tabular-nums text-teal-700 dark:text-teal-300">
              {highlighted}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {labels.share}
            </dt>
            <dd className="mt-0.5 font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {((highlighted / total) * 100).toFixed(1)}%
            </dd>
          </div>
        </dl>
      </div>
    </figure>
  )
}
