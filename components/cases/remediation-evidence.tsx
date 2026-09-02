"use client"

import { useState } from "react"
import { Check, Info } from "lucide-react"

// Measured from archived captures of the Domino's home page, taken with the
// Internet Archive's `id_` modifier so the bytes are the original response and
// not the archive's own injected toolbar. Counts are of the served HTML.
const SNAPSHOTS = [
  { date: "Sep 2025", images: 111, decorative: 92, links: 78, buttons: 64, aria: 124 },
  { date: "Oct 2025", images: 89, decorative: 70, links: 76, buttons: 64, aria: 124 },
  { date: "Nov 2025", images: 63, decorative: 47, links: 76, buttons: 57, aria: 130 },
  { date: "Dec 2025", images: 52, decorative: 39, links: 84, buttons: 40, aria: 106 },
  { date: "Jan 2026", images: 50, decorative: 39, links: 71, buttons: 49, aria: 101 },
  { date: "Feb 2026", images: 52, decorative: 39, links: 71, buttons: 53, aria: 106 },
  { date: "Mar 2026", images: 50, decorative: 41, links: 70, buttons: 49, aria: 101 },
  { date: "Apr 2026", images: 52, decorative: 41, links: 70, buttons: 53, aria: 106 },
  { date: "May 2026", images: 52, decorative: 43, links: 72, buttons: 49, aria: 101 },
  { date: "Jun 2026", images: 52, decorative: 43, links: 72, buttons: 49, aria: 101 },
] as const

const TOTAL_IMAGES = SNAPSHOTS.reduce((a, s) => a + s.images, 0)

const DEFECTS = [
  { alleged: "Images with no text alternative", criterion: "1.1.1", found: 0, of: `${TOTAL_IMAGES} images` },
  { alleged: "Links with no readable text", criterion: "2.4.4", found: 0, of: "744 links" },
  { alleged: "Controls with no accessible name", criterion: "4.1.2", found: 0, of: "527 buttons" },
  { alleged: "Fields without labels", criterion: "3.3.2", found: 0, of: "every form field" },
] as const

/**
 * Did the site actually get fixed?
 *
 * The obvious way to answer that is to compare the site before, during and
 * after the litigation. The archive cannot support it: there is no usable
 * capture of the ordering pages for 2016 to 2018, and every capture before
 * September 2025 is a JavaScript shell with no markup to measure. What can be
 * measured is the current state, and that is what this shows, with the gap
 * stated rather than glossed over.
 */
export function RemediationEvidence() {
  const [showAll, setShowAll] = useState(false)

  return (
    <section
      aria-labelledby="remediation-heading"
      className="not-prose my-10 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40"
    >
      <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
          Original measurement
        </p>
        <h3
          id="remediation-heading"
          className="mt-2 text-xl font-semibold text-slate-900 dark:text-white"
        >
          Did the site actually get fixed?
        </h3>
        <p className="mt-3 max-w-[62ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
          We measured ten archived captures of the Domino&apos;s home page, from September 2025 to
          June 2026, for the four defect classes the complaint alleged. Every one of them now
          measures clean in the served markup.
        </p>
      </div>

      <ul className="grid gap-px bg-slate-200 sm:grid-cols-2 dark:bg-slate-800">
        {DEFECTS.map((d) => (
          <li key={d.alleged} className="bg-white p-5 dark:bg-slate-900/40">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                <Check className="h-3.5 w-3.5 text-emerald-800 dark:text-emerald-300" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{d.alleged}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-mono font-semibold text-emerald-800 dark:text-emerald-300">
                    {d.found} found
                  </span>{" "}
                  across {d.of}. Alleged as a failure of {d.criterion}.
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-slate-200 p-5 dark:border-slate-800 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Each capture also carries a screen-reader assistance line and a link to the accessibility
            policy, and roughly 100 to 130 ARIA attributes.
          </p>
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
          >
            {showAll ? "Hide the captures" : "Show all ten captures"}
          </button>
        </div>

        {showAll ? (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">
                Accessibility markers measured in ten archived captures of the Domino&apos;s home
                page
              </caption>
              <thead>
                <tr>
                  {["Capture", "Images", "Decorative", "Links", "Buttons", "ARIA attributes"].map(
                    (h, i) => (
                      <th
                        key={h}
                        scope="col"
                        className={`border-b border-slate-300 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:text-slate-400 ${i === 0 ? "text-left" : "text-right"}`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {SNAPSHOTS.map((s) => (
                  <tr key={s.date}>
                    <th
                      scope="row"
                      className="border-b border-slate-200 py-2 text-left font-normal text-slate-700 dark:border-slate-800 dark:text-slate-300"
                    >
                      {s.date}
                    </th>
                    {[s.images, s.decorative, s.links, s.buttons, s.aria].map((n, i) => (
                      <td
                        key={i}
                        className="border-b border-slate-200 py-2 text-right font-mono tabular-nums text-slate-700 dark:border-slate-800 dark:text-slate-300"
                      >
                        {n}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="mt-5 flex items-start gap-3 rounded-md bg-slate-50 p-4 dark:bg-slate-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
          <div className="min-w-0 text-sm leading-6 text-slate-600 dark:text-slate-400">
            <p className="font-medium text-slate-900 dark:text-white">What this cannot show</p>
            <p className="mt-1">
              There is no before-and-after here, because the archive cannot support one. The Internet
              Archive holds no usable capture of the Domino&apos;s ordering pages for 2016 to 2018,
              the years the case was about, and every capture before September 2025 is a JavaScript
              shell containing no markup to measure. Counting the served HTML also finds only the
              machine-detectable defects, which is the class this case turned on but not the whole of
              accessibility. A clean count is not the same as a usable checkout.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
