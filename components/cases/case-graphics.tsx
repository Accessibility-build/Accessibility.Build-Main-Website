"use client"

import { useId, useState } from "react"
import { Check, Minus, X } from "lucide-react"

// Information graphics for the case study. Each one exists because the point it
// carries is hard to make in a sentence, not to decorate the page.

// ---------------------------------------------------------------------------
// Where each federal circuit stands
// ---------------------------------------------------------------------------

const CIRCUITS = [
  {
    stance: "A physical nexus is required",
    detail:
      "The site is covered when it connects customers to a physical place of business. This is the rule Robles settled for the Ninth.",
    circuits: ["3rd", "6th", "9th"],
    tone: "nexus" as const,
  },
  {
    stance: "A website can qualify on its own",
    detail:
      "No physical connection is needed; a site offering the goods and services Title III lists is covered by itself.",
    circuits: ["1st", "7th"],
    tone: "broad" as const,
  },
  {
    stance: "District courts are divided",
    detail: "No controlling appellate holding, and trial courts within the circuit have gone both ways.",
    circuits: ["2nd"],
    tone: "split" as const,
  },
  {
    stance: "Unsettled after a vacated opinion",
    detail:
      "A panel held a website was not a public accommodation, then the court vacated that opinion as moot in December 2021. Nothing binding survives it.",
    circuits: ["11th"],
    tone: "vacated" as const,
  },
  {
    stance: "Not squarely decided at appellate level",
    detail: "No controlling decision on whether Title III reaches a website.",
    circuits: ["4th", "5th", "8th", "10th", "D.C.", "Fed."],
    tone: "none" as const,
  },
]

const TONE_STYLES: Record<string, { chip: string; rail: string }> = {
  nexus: {
    chip: "bg-teal-100 text-teal-900 dark:bg-teal-900/50 dark:text-teal-200",
    rail: "bg-teal-700 dark:bg-teal-400",
  },
  broad: {
    chip: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200",
    rail: "bg-emerald-700 dark:bg-emerald-400",
  },
  split: {
    chip: "bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200",
    rail: "bg-amber-600 dark:bg-amber-400",
  },
  vacated: {
    chip: "bg-rose-100 text-rose-900 dark:bg-rose-900/50 dark:text-rose-200",
    rail: "bg-rose-700 dark:bg-rose-400",
  },
  none: {
    chip: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    rail: "bg-slate-400 dark:bg-slate-600",
  },
}

/** Which rule applies where, which is the question a business actually has. */
export function CircuitPositions() {
  const headingId = useId()
  return (
    <section aria-labelledby={headingId} className="not-prose my-10">
      <h3 id={headingId} className="text-lg font-semibold text-slate-900 dark:text-white">
        Where each federal circuit stands
      </h3>
      <p className="mt-2 max-w-[62ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
        Robles binds the Ninth Circuit. It does not settle the country, and the answer to
        &ldquo;does this apply to us&rdquo; still depends on where a claim is brought.
      </p>

      <ul className="mt-5 space-y-3">
        {CIRCUITS.map((row) => {
          const tone = TONE_STYLES[row.tone]
          return (
            <li
              key={row.stance}
              className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40"
            >
              <span aria-hidden="true" className={`w-1 shrink-0 rounded-full ${tone.rail}`} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900 dark:text-white">{row.stance}</p>
                  <span className="flex flex-wrap gap-1">
                    {row.circuits.map((c) => (
                      <span
                        key={c}
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold tabular-nums ${tone.chip}`}
                      >
                        {c}
                      </span>
                    ))}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {row.detail}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Positions as at 2026. Circuit numbers are shown as chips; a business is exposed to the rule
        of the circuit where it is sued, not where it is based.
      </p>
    </section>
  )
}

// ---------------------------------------------------------------------------
// How each defence argument fared
// ---------------------------------------------------------------------------

type Fate = "won" | "lost" | "untested"

const ARGUMENTS: { argument: string; district2017: Fate; ninth2019: Fate; final: Fate; note: string }[] = [
  {
    argument: "The ADA does not reach a website",
    district2017: "lost",
    ninth2019: "lost",
    final: "lost",
    note: "Rejected at every stage. The statute covers the services of a public accommodation.",
  },
  {
    argument: "No federal technical rule, so enforcing it denies due process",
    district2017: "won",
    ninth2019: "lost",
    final: "lost",
    note: "The only argument that ever won, and it was reversed.",
  },
  {
    argument: "Defer to the Department of Justice first",
    district2017: "won",
    ninth2019: "lost",
    final: "lost",
    note: "Reversed once the DOJ withdrew its rulemaking, making delay indefinite.",
  },
  {
    argument: "A telephone line is an adequate alternative",
    district2017: "untested",
    ninth2019: "untested",
    final: "lost",
    note: "Decided on the facts in 2021: two calls, more than forty-five minutes on hold each.",
  },
  {
    argument: "Compliance is too costly across the industry",
    district2017: "untested",
    ninth2019: "untested",
    final: "untested",
    note: "Made as policy in the cert petition. Never pleaded as undue burden for its own site.",
  },
]

const FATE_META: Record<Fate, { label: string; className: string; Icon: typeof Check }> = {
  won: {
    label: "Succeeded",
    className: "text-emerald-800 dark:text-emerald-300",
    Icon: Check,
  },
  lost: { label: "Failed", className: "text-rose-800 dark:text-rose-300", Icon: X },
  untested: { label: "Not decided", className: "text-slate-500 dark:text-slate-400", Icon: Minus },
}

function FateCell({ fate }: { fate: Fate }) {
  const meta = FATE_META[fate]
  const { Icon } = meta
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${meta.className}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  )
}

/** Five arguments against three stages. Status is never colour alone. */
export function DefenceScorecard() {
  const headingId = useId()
  return (
    <section aria-labelledby={headingId} className="not-prose my-10">
      <h3 id={headingId} className="text-lg font-semibold text-slate-900 dark:text-white">
        How each argument fared
      </h3>
      <p className="mt-2 max-w-[62ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
        One argument succeeded, once, and was reversed. Two were never tested at all, including the
        one about cost.
      </p>
      <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            Each argument Domino&apos;s made, and its outcome at the district court in 2017, the
            Ninth Circuit in 2019, and finally
          </caption>
          <thead>
            <tr>
              {["Argument", "District, 2017", "Ninth Circuit, 2019", "Final"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="whitespace-nowrap border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ARGUMENTS.map((a) => (
              <tr key={a.argument}>
                <th
                  scope="row"
                  className="border-b border-slate-200 px-4 py-3 text-left font-normal align-top text-slate-700 dark:border-slate-800 dark:text-slate-300"
                >
                  {a.argument}
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    {a.note}
                  </span>
                </th>
                <td className="border-b border-slate-200 px-4 py-3 align-top dark:border-slate-800">
                  <FateCell fate={a.district2017} />
                </td>
                <td className="border-b border-slate-200 px-4 py-3 align-top dark:border-slate-800">
                  <FateCell fate={a.ninth2019} />
                </td>
                <td className="border-b border-slate-200 px-4 py-3 align-top dark:border-slate-800">
                  <FateCell fate={a.final} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Who was actually speaking
// ---------------------------------------------------------------------------

/**
 * 591 comments about blind people, three of them from someone blind. A dot grid
 * makes the proportion visible in a way the two numbers do not.
 */
export function WhoWasSpeaking() {
  const headingId = useId()
  const total = 591
  const blind = 3
  return (
    <section aria-labelledby={headingId} className="not-prose my-10">
      <h3 id={headingId} className="text-lg font-semibold text-slate-900 dark:text-white">
        Who was actually speaking
      </h3>
      <p className="mt-2 max-w-[62ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
        The largest public discussion of this case ran to {total} comments about whether blind
        customers should be able to order a pizza. {blind} came from someone identifying as blind.
      </p>

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40 sm:p-6">
        <div
          aria-hidden="true"
          className="flex flex-wrap gap-[3px]"
        >
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={`h-[7px] w-[7px] rounded-full ${
                i < blind ? "bg-teal-600 dark:bg-teal-400" : "bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
        <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Comments
            </dt>
            <dd className="mt-0.5 font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {total}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              From a blind commenter
            </dt>
            <dd className="mt-0.5 font-mono text-xl font-semibold tabular-nums text-teal-700 dark:text-teal-300">
              {blind}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Share
            </dt>
            <dd className="mt-0.5 font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {((blind / total) * 100).toFixed(1)}%
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// What to do if you are the defendant
// ---------------------------------------------------------------------------

const PLAYBOOK = [
  {
    when: "Before anyone complains",
    dos: [
      "Run an automated scan on your main journeys and fix every Level A failure it finds. That is the class this case turned on.",
      "Publish an accessibility contact route with a named owner, and answer it.",
      "Put an automated check in the pipeline so a release cannot silently remove a label.",
    ],
    donts: [
      "Do not buy an overlay and treat the problem as closed. The defendant here did not, and the reason is that it does not work.",
    ],
  },
  {
    when: "When a complaint arrives",
    dos: [
      "Reproduce it on the device and software the complainant actually used.",
      "Fix what is reproducible before arguing about what is not.",
      "Get a written scope and a date for the rest.",
    ],
    donts: [
      "Do not offer a phone line as the remedy without measuring what happens when someone calls it.",
      "Do not rely on the absence of a federal technical rule. Courts have declined to wait for one since 2019.",
    ],
  },
  {
    when: "If it becomes litigation",
    dos: [
      "Decide early whether you are fighting the barrier or the duty. Fighting the duty is what cost six years here.",
      "Preserve the evidence: the build, the device, the dates.",
      "If you intend to argue undue burden, plead it, with your own numbers.",
    ],
    donts: [
      "Do not assume your own expert will help. Here, the defendant's expert could not place an order either.",
    ],
  },
]

/** The practical translation, which is the part a client actually needs. */
export function DefendantPlaybook() {
  const headingId = useId()
  const [open, setOpen] = useState<string | null>(PLAYBOOK[0].when)
  return (
    <section aria-labelledby={headingId} className="not-prose my-10">
      <h3 id={headingId} className="text-lg font-semibold text-slate-900 dark:text-white">
        What to do if you are on the receiving end
      </h3>
      <p className="mt-2 max-w-[62ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
        The practical translation of the six exit points above, in the order you are likely to need
        them.
      </p>

      <div className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
        {PLAYBOOK.map((stage) => {
          const isOpen = open === stage.when
          const panelId = `playbook-${stage.when.replace(/\s+/g, "-").toLowerCase()}`
          return (
            <div key={stage.when} className="bg-white dark:bg-slate-900/40">
              <h4>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : stage.when)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600 dark:text-white dark:hover:bg-slate-800/60"
                >
                  {stage.when}
                  <span
                    aria-hidden="true"
                    className={`shrink-0 text-slate-400 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
              </h4>
              <div id={panelId} hidden={!isOpen} className="px-5 pb-5">
                <ul className="space-y-2">
                  {stage.dos.map((d) => (
                    <li key={d} className="flex gap-2.5 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      <Check
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                      <span>
                        <span className="sr-only">Do: </span>
                        {d}
                      </span>
                    </li>
                  ))}
                  {stage.donts.map((d) => (
                    <li key={d} className="flex gap-2.5 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      <X
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-rose-700 dark:text-rose-400"
                        aria-hidden="true"
                      />
                      <span>
                        <span className="sr-only">Avoid: </span>
                        {d}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
