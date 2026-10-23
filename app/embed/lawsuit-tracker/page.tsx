import type { Metadata } from "next"
import { EmbedFooter, EmbedFrame } from "@/components/embed/embed-frame"
import { lawsuitsByYear, SEYFARTH_2025_URL } from "@/lib/data/lawsuit-statistics"

// Chromeless widget of the federal filings series from /research/accessibility-lawsuits,
// for other sites to iframe; the embed code is offered on that page. It reads the
// same data module, so it updates whenever the tracker does. noindex and absent from
// lib/site-routes.ts, like every /embed/ page (see app/embed/contrast-checker/page.tsx).
export const metadata: Metadata = {
  title: "Federal Accessibility Lawsuits Widget",
  description: "Embeddable chart of federal website accessibility lawsuit filings by year, from the Accessibility.build lawsuit tracker.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function LawsuitTrackerEmbedPage() {
  const latest = lawsuitsByYear[lawsuitsByYear.length - 1]
  const first = lawsuitsByYear[0]
  const max = Math.max(...lawsuitsByYear.map((row) => row.federalCourt))
  const change = latest.yearOverYearChange
  const direction = change >= 0 ? "up" : "down"

  return (
    <EmbedFrame>
      <div>
        <h1 className="text-base font-semibold">Federal website accessibility lawsuits by year</h1>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
          <strong className="font-semibold text-slate-900 dark:text-white">
            {latest.federalCourt.toLocaleString("en-US")} filings in {latest.year}
          </strong>
          , {direction} {Math.abs(change)}% on {latest.year - 1}. ADA Title III website cases in U.S.
          federal courts only; state-court filings are not included.
        </p>
      </div>

      <table className="w-full text-sm">
        <caption className="sr-only">
          Federal website accessibility lawsuit filings, {first.year} to {latest.year}
        </caption>
        <thead>
          <tr className="text-left text-xs text-slate-600 dark:text-slate-400">
            <th scope="col" className="w-14 pb-1 pr-3 font-medium">Year</th>
            <th scope="col" className="pb-1 font-medium">Filings</th>
          </tr>
        </thead>
        <tbody>
          {lawsuitsByYear.map((row) => (
            <tr key={row.year} className="border-t border-slate-200 dark:border-slate-800">
              <th scope="row" className="py-1.5 pr-3 text-left font-normal tabular-nums">{row.year}</th>
              <td className="py-1.5">
                <div className="flex items-center gap-3">
                  <span className="w-12 shrink-0 text-right font-medium tabular-nums">
                    {row.federalCourt.toLocaleString("en-US")}
                  </span>
                  {/* The number beside it carries the value; the bar only shows the trend. */}
                  <div aria-hidden="true" className="h-3 flex-1">
                    <div
                      className="h-full rounded-sm bg-blue-600 dark:bg-blue-500"
                      style={{ width: `${(row.federalCourt / max) * 100}%` }}
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Source:{" "}
        <a
          href={SEYFARTH_2025_URL}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-6 items-center font-medium text-blue-700 underline underline-offset-2 hover:no-underline dark:text-blue-400"
        >
          Seyfarth Shaw ADA Title III review
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>

      <EmbedFooter
        note="Compiled by Accessibility.build."
        href="/research/accessibility-lawsuits"
        linkText="Full lawsuit tracker"
      />
    </EmbedFrame>
  )
}
