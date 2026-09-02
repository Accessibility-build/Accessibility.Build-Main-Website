"use client"

import { useId, useState } from "react"

// Federal website-accessibility lawsuit filings, by year.
// Source: Seyfarth Shaw's ADA Title III tracker (federal courts only; counts
// that include state courts run considerably higher and must not be mixed in).
const DATA = [
  { year: 2017, filings: 814 },
  { year: 2018, filings: 2258 },
  { year: 2019, filings: 2256 },
  { year: 2020, filings: 2523 },
  { year: 2021, filings: 2895 },
  { year: 2022, filings: 3255 },
  { year: 2023, filings: 2794 },
  { year: 2024, filings: 2452 },
  { year: 2025, filings: 3117 },
] as const

// Years the argument turns on, called out on the plot itself so the point does
// not depend on reading the whole axis.
const ANNOTATIONS: Record<number, string> = {
  2018: "Filings triple after the DOJ withdraws its web rulemaking",
  2019: "Flat, in the year certiorari was denied",
}

const MAX = 3400
const CHART_H = 260
const BAR_GAP = 2

export function FilingsChart() {
  const [active, setActive] = useState<number | null>(null)
  const [showTable, setShowTable] = useState(false)
  const titleId = useId()
  const descId = useId()

  const activeDatum = DATA.find((d) => d.year === active) ?? null

  return (
    <figure className="not-prose my-10">
      <figcaption className="mb-1 text-lg font-semibold text-slate-900 dark:text-white" id={titleId}>
        Federal website accessibility filings, by year
      </figcaption>
      <p id={descId} className="mb-5 max-w-[60ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
        The step change came in 2018, after the Justice Department withdrew its web rulemaking. 2019,
        the year the Supreme Court declined this case, was flat against the year before.
      </p>

      <div role="group" aria-labelledby={titleId} aria-describedby={descId} className="relative rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40 sm:p-6">
        {/* The plot. Each bar is focusable so the figures are reachable by
            keyboard, not only by pointer. */}
        <div className="relative">
          <svg
            viewBox={`0 0 720 ${CHART_H + 34}`}
            className="w-full"
            aria-hidden="true"
            style={{ ["--series" as string]: "#0d9488" }}
          >
            {/* Recessive gridlines with value labels. */}
            {[0, 1000, 2000, 3000].map((v) => {
              const y = CHART_H - (v / MAX) * CHART_H
              return (
                <g key={v}>
                  <line
                    x1={38}
                    x2={720}
                    y1={y}
                    y2={y}
                    className="stroke-slate-200 dark:stroke-slate-800"
                    strokeWidth={1}
                  />
                  <text
                    x={32}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-500 text-[11px] dark:fill-slate-400"
                  >
                    {v === 0 ? "0" : `${v / 1000}k`}
                  </text>
                </g>
              )
            })}

            {DATA.map((d, i) => {
              const slot = (720 - 38) / DATA.length
              const barW = slot - BAR_GAP * 2
              const x = 38 + i * slot + BAR_GAP
              const h = (d.filings / MAX) * CHART_H
              const y = CHART_H - h
              const isActive = active === d.year
              const isAnnotated = d.year in ANNOTATIONS
              return (
                <g key={d.year}>
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={h}
                    rx={4}
                    className="pointer-events-none transition-opacity motion-reduce:transition-none"
                    fill="var(--series)"
                    opacity={active === null || isActive ? 1 : 0.45}
                  />
                  {/* Selective direct labels: the two years that carry the argument,
                      plus whichever bar is being inspected. */}
                  {(isAnnotated || isActive) && (
                    <text
                      x={x + barW / 2}
                      y={y - 7}
                      textAnchor="middle"
                      className="pointer-events-none fill-slate-900 text-[11px] font-semibold tabular-nums dark:fill-white"
                    >
                      {d.filings.toLocaleString("en-US")}
                    </text>
                  )}
                  <text
                    x={x + barW / 2}
                    y={CHART_H + 18}
                    textAnchor="middle"
                    className={
                      isActive
                        ? "pointer-events-none fill-slate-900 text-[11px] font-semibold dark:fill-white"
                        : "pointer-events-none fill-slate-500 text-[11px] dark:fill-slate-400"
                    }
                  >
                    {d.year}
                  </text>
                </g>
              )
            })}
            <line
              x1={38}
              x2={720}
              y1={CHART_H}
              y2={CHART_H}
              className="stroke-slate-300 dark:stroke-slate-700"
              strokeWidth={1}
            />
          </svg>

          {/* Real buttons over the plot. SVG child elements do not reliably take
              keyboard focus across browsers, so the interactive layer is HTML;
              the drawing above is aria-hidden and purely visual. */}
          <ul className="absolute inset-0 flex list-none" style={{ paddingLeft: `${(38 / 720) * 100}%` }}>
            {DATA.map((d) => {
              const isAnnotated = d.year in ANNOTATIONS
              return (
                <li key={d.year} className="min-w-0 flex-1">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(d.year)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(d.year)}
                    onBlur={() => setActive(null)}
                    className="h-full w-full cursor-default rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-1 dark:focus-visible:ring-teal-300 dark:focus-visible:ring-offset-slate-900"
                  >
                    <span className="sr-only">
                      {d.year}: {d.filings.toLocaleString("en-US")} filings
                      {isAnnotated ? `. ${ANNOTATIONS[d.year]}` : ""}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Readout for the inspected bar. Polite, so a screen reader is not
            interrupted while arrowing across the plot. */}
        <p
          aria-live="polite"
          className="mt-3 min-h-[2.75rem] border-t border-slate-200 pt-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400"
        >
          {activeDatum ? (
            <>
              <span className="font-semibold text-slate-900 dark:text-white">
                {activeDatum.year}: {activeDatum.filings.toLocaleString("en-US")} filings
              </span>
              {ANNOTATIONS[activeDatum.year] ? `. ${ANNOTATIONS[activeDatum.year]}.` : ""}
            </>
          ) : (
            "Hover or tab across the bars for the figure for each year."
          )}
        </p>

        <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Federal courts only. Source: Seyfarth Shaw ADA Title III tracker.
          </p>
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            aria-expanded={showTable}
            className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
          >
            {showTable ? "Hide table" : "View as table"}
          </button>
        </div>

        {showTable ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">
                Federal website accessibility filings by year, 2017 to 2025
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b border-slate-300 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:text-slate-400"
                  >
                    Year
                  </th>
                  <th
                    scope="col"
                    className="border-b border-slate-300 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:text-slate-400"
                  >
                    Filings
                  </th>
                </tr>
              </thead>
              <tbody>
                {DATA.map((d) => (
                  <tr key={d.year}>
                    <th
                      scope="row"
                      className="border-b border-slate-200 py-2 text-left font-normal text-slate-700 dark:border-slate-800 dark:text-slate-300"
                    >
                      {d.year}
                    </th>
                    <td className="border-b border-slate-200 py-2 text-right font-mono tabular-nums text-slate-700 dark:border-slate-800 dark:text-slate-300">
                      {d.filings.toLocaleString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </figure>
  )
}
