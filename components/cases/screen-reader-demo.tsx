"use client"

import { useId, useState } from "react"
import { Eye, Volume2 } from "lucide-react"

// An interactive reconstruction of the barrier at the centre of the case.
//
// The complaint described images without text alternatives, links with no
// readable text and controls with no accessible name. Those phrases mean little
// until you see what is left once the visuals are removed, so this puts the two
// side by side: the order form as a sighted customer sees it, and the same form
// as it reaches a screen reader when the names are missing.
//
// The reconstruction is illustrative, built from the defects pleaded in the
// complaint. It is not a capture of Domino's website.

interface Row {
  /** What a sighted user perceives. */
  visual: string
  /** What a screen reader can announce when the accessible name is missing. */
  brokenAnnouncement: string
  /** What it should announce when the name is present. */
  fixedAnnouncement: string
  /** The success criterion the broken version fails. */
  criterion: string
}

const ROWS: Row[] = [
  {
    visual: "Domino's logo",
    brokenAnnouncement: "graphic",
    fixedAnnouncement: "Domino's, link to home page",
    criterion: "1.1.1",
  },
  {
    visual: "Photo of a pepperoni pizza",
    brokenAnnouncement: "graphic",
    fixedAnnouncement: "Pepperoni pizza",
    criterion: "1.1.1",
  },
  {
    visual: "Size chooser: Small, Medium, Large",
    brokenAnnouncement: "button. button. button.",
    fixedAnnouncement: "Small, radio button, 1 of 3, not selected",
    criterion: "4.1.2",
  },
  {
    visual: "A half-and-half toppings control",
    brokenAnnouncement: "clickable",
    fixedAnnouncement: "Add pepperoni to the left half, checkbox, not checked",
    criterion: "4.1.2",
  },
  {
    visual: "Delivery address field",
    brokenAnnouncement: "edit, blank",
    fixedAnnouncement: "Delivery address, required, edit, blank",
    criterion: "3.3.2",
  },
  {
    visual: "Green Add to order button",
    brokenAnnouncement: "button",
    fixedAnnouncement: "Add to order, button",
    criterion: "4.1.2",
  },
  {
    visual: "Checkout link",
    brokenAnnouncement: "link",
    fixedAnnouncement: "Checkout, link",
    criterion: "2.4.4",
  },
]

export function ScreenReaderDemo() {
  const [fixed, setFixed] = useState(false)
  const switchId = useId()
  const outputId = useId()

  return (
    <section
      aria-labelledby={`${switchId}-heading`}
      className="not-prose my-10 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40"
    >
      <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
        <h3
          id={`${switchId}-heading`}
          className="text-lg font-semibold text-slate-900 dark:text-white"
        >
          What the order form announced
        </h3>
        <p className="mt-2 max-w-[62ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
          The defects pleaded in this case sound abstract. This is what they mean in practice: the
          same ordering flow, seen and heard. Switch the accessible names on to hear the difference
          the fix would have made.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            id={switchId}
            role="switch"
            aria-checked={fixed}
            aria-describedby={outputId}
            onClick={() => setFixed((v) => !v)}
            className="inline-flex items-center gap-3 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
          >
            <span
              aria-hidden="true"
              className={`relative h-5 w-9 shrink-0 rounded-full transition-colors motion-reduce:transition-none ${
                fixed ? "bg-teal-700 dark:bg-teal-500" : "bg-slate-300 dark:bg-slate-600"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform motion-reduce:transition-none ${
                  fixed ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </span>
            Accessible names
            <span className="font-normal text-slate-500 dark:text-slate-400">
              {fixed ? "on" : "off"}
            </span>
          </button>
          <p id={outputId} aria-live="polite" className="text-sm text-slate-600 dark:text-slate-400">
            {fixed
              ? "Every control now announces what it is."
              : "As pleaded in the complaint: seven controls, almost no information."}
          </p>
        </div>
      </div>

      {/* Two columns on wide screens, stacked on narrow. Presented as a table so
          the pairing between the visual and the announcement is programmatic,
          not just spatial. */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            Each element of the order form, what a sighted user sees, and what a screen reader
            announces with accessible names {fixed ? "present" : "missing"}
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              >
                <span className="inline-flex items-center gap-2">
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  On screen
                </span>
              </th>
              <th
                scope="col"
                className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              >
                <span className="inline-flex items-center gap-2">
                  <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Announced
                </span>
              </th>
              <th
                scope="col"
                className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              >
                Criterion
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.visual}>
                <th
                  scope="row"
                  className="border-b border-slate-200 px-5 py-3 text-left font-normal text-slate-700 dark:border-slate-800 dark:text-slate-300"
                >
                  {row.visual}
                </th>
                <td className="border-b border-slate-200 px-5 py-3 dark:border-slate-800">
                  <span
                    className={
                      fixed
                        ? "font-mono text-[0.8rem] text-emerald-800 dark:text-emerald-300"
                        : "font-mono text-[0.8rem] text-rose-800 dark:text-rose-300"
                    }
                  >
                    &ldquo;{fixed ? row.fixedAnnouncement : row.brokenAnnouncement}&rdquo;
                  </span>
                </td>
                <td className="border-b border-slate-200 px-5 py-3 dark:border-slate-800">
                  <span
                    className={
                      fixed
                        ? "text-xs font-semibold text-emerald-800 dark:text-emerald-300"
                        : "text-xs font-semibold text-rose-800 dark:text-rose-300"
                    }
                  >
                    {fixed ? "passes" : "fails"} {row.criterion}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="border-t border-slate-200 px-5 py-4 text-xs leading-5 text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:px-6">
        Illustrative reconstruction built from the defects pleaded in the complaint, not a capture of
        Domino&apos;s website. Every criterion listed is Level A, the lowest tier of the standard.
      </p>
    </section>
  )
}
