"use client"

import { useId, useState } from "react"
import { AlertTriangle, CheckCircle2, CircleSlash, FileText, Keyboard, Layers, MonitorSmartphone, Sparkles, Type, Wand2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AiSummary, AuditExtras, ManualCheck } from "@/lib/url-audit/types"
import { IMPACTS, IMPACT_META, plural, scoreBand } from "./meta"

// ---------------------------------------------------------------------------------------------
// Score

interface ScorePanelProps {
  score: number
  counts: Record<(typeof IMPACTS)[number], number>
  totalViolations: number
  elements: number
  reviewCount: number
  extras?: AuditExtras
}

export function ScorePanel({ score, counts, totalViolations, elements, reviewCount, extras }: ScorePanelProps) {
  const clean = totalViolations === 0
  const band = clean ? { ...scoreBand(100), label: "No confirmed failures" } : scoreBand(score)
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const max = Math.max(1, ...IMPACTS.map((impact) => counts[impact]))

  return (
    <div className="grid content-center items-center gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-[auto_minmax(0,1fr)] sm:p-6">
      <div className="flex items-center gap-5">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r={radius} className="fill-none stroke-slate-200 dark:stroke-slate-800" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              className={cn("fill-none transition-[stroke-dashoffset] duration-700 motion-reduce:transition-none", band.ring)}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - score / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold tabular-nums text-slate-900 dark:text-white">{score}</span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">of 100</span>
          </div>
        </div>
        <div className="sm:hidden">
          <p className={cn("text-lg font-semibold", band.text)}>{band.label}</p>
        </div>
      </div>

      <div className="min-w-0">
        <p className={cn("hidden text-lg font-semibold sm:block", band.text)}>{band.label}</p>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
          <span className="sr-only">Score {score} out of 100. </span>
          {clean
            ? reviewCount > 0
              ? `Automated checks found nothing they could confirm as a failure. ${plural(reviewCount, "item needs", "items need")} a person to decide.`
              : "Automated checks found nothing they could confirm as a failure."
            : `${plural(totalViolations, "failing rule")} across ${plural(elements, "element")}${reviewCount > 0 ? `, plus ${plural(reviewCount, "item")} to check by hand` : ""}.`}
        </p>
        {clean ? (
          <ul className="mt-4 space-y-2 text-sm">
            {cleanChecks(extras).map((item) => (
              <li key={item} className="flex gap-2 text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                {item}
              </li>
            ))}
            {reviewCount > 0 && (
              <li className="flex gap-2 font-medium text-amber-900 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                {plural(reviewCount, "item")} to check by hand
              </li>
            )}
          </ul>
        ) : (
          <dl className="mt-4 space-y-2">
            {IMPACTS.map((impact) => (
              <div key={impact} className="grid grid-cols-[5.5rem_minmax(0,1fr)_2rem] items-center gap-3 text-sm">
                <dt className="font-medium text-slate-800 dark:text-slate-200">{IMPACT_META[impact].label}</dt>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden="true">
                  <div className={cn("h-full rounded-full", IMPACT_META[impact].bar)} style={{ width: `${(counts[impact] / max) * 100}%` }} />
                </div>
                <dd className="text-right font-semibold tabular-nums text-slate-900 dark:text-white">{counts[impact]}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="mt-4 text-xs leading-5 text-slate-600 dark:text-slate-400">The score counts confirmed failures only. Use it to track this page over time; it is not a measure of conformance.</p>
      </div>
    </div>
  )
}

/** What the checks confirmed on a page with no failures, from the run's own numbers. */
function cleanChecks(extras: AuditExtras | undefined): string[] {
  if (!extras) return ["No axe-core rule failed"]
  const items = [`${plural(extras.engine.rulesPassed, "axe-core rule")} passed`]
  if (extras.keyboard.ran && extras.keyboard.stops > 0) items.push(`Focus visible at all ${plural(extras.keyboard.stops, "Tab stop")} checked`)
  if (extras.layout.reflowChecked) items.push("Fits a 320 pixel wide screen without sideways scrolling")
  if (extras.layout.textSpacingChecked) items.push("No text cut off with wider text spacing")
  return items
}

// ---------------------------------------------------------------------------------------------
// Signals: the checks that go beyond axe-core, at a glance

type Tone = "good" | "bad" | "warn" | "neutral"

const TONE: Record<Tone, { card: string; icon: typeof CheckCircle2; iconClass: string; word: string }> = {
  good: { card: "border-emerald-200 dark:border-emerald-900", icon: CheckCircle2, iconClass: "text-emerald-700 dark:text-emerald-400", word: "Good" },
  bad: { card: "border-red-200 dark:border-red-900", icon: XCircle, iconClass: "text-red-700 dark:text-red-400", word: "Problem" },
  warn: { card: "border-amber-200 dark:border-amber-800", icon: AlertTriangle, iconClass: "text-amber-700 dark:text-amber-400", word: "Check" },
  neutral: { card: "border-slate-200 dark:border-slate-800", icon: CircleSlash, iconClass: "text-slate-500 dark:text-slate-400", word: "Not checked" },
}

interface Signal {
  key: string
  icon: typeof Keyboard
  label: string
  value: string
  detail: string
  tone: Tone
}

export function SignalCards({ extras }: { extras: AuditExtras }) {
  const { keyboard, layout, facts } = extras
  const overflow = layout.reflowScrollWidth !== null ? layout.reflowScrollWidth - 320 : null

  const signals: Signal[] = [
    {
      key: "keyboard",
      icon: Keyboard,
      label: "Keyboard",
      value: !keyboard.ran ? "Not run" : keyboard.trap ? "Focus trapped" : keyboard.noIndicator > 0 ? `${keyboard.noIndicator} without visible focus` : `${keyboard.stops} Tab stops`,
      detail: keyboard.ran ? `${plural(keyboard.stops, "Tab stop")} checked with screenshots${keyboard.obscured ? `, ${keyboard.obscured} hidden behind other content` : ""}.` : "Ran out of time before the keyboard pass.",
      tone: !keyboard.ran ? "neutral" : keyboard.trap || keyboard.noIndicator > 0 || keyboard.obscured > 0 ? "bad" : keyboard.stops === 0 ? "warn" : "good",
    },
    {
      key: "reflow",
      icon: MonitorSmartphone,
      label: "Reflow at 320 px",
      value: overflow === null ? "Not run" : overflow > 8 ? `Scrolls ${overflow} px sideways` : "Fits the width",
      detail: overflow === null ? "Ran out of time before the reflow check." : "The width of a phone, or a desktop zoomed to 400% (WCAG 1.4.10).",
      tone: overflow === null ? "neutral" : overflow > 8 ? "bad" : "good",
    },
    {
      key: "spacing",
      icon: Type,
      label: "Text spacing",
      value: !layout.textSpacingChecked ? "Not run" : layout.textSpacingClipped > 0 ? `${layout.textSpacingClipped} cut off` : "Nothing cut off",
      detail: "Line, letter, word and paragraph spacing raised to the WCAG 1.4.12 values.",
      tone: !layout.textSpacingChecked ? "neutral" : layout.textSpacingClipped > 0 ? "warn" : "good",
    },
    {
      key: "motion",
      icon: Wand2,
      label: "Reduced motion",
      value: facts.runningAnimations === 0 ? "No looping animation" : facts.respectsReducedMotion === null ? "Not run" : facts.respectsReducedMotion ? "Respected" : "Ignored",
      detail: facts.runningAnimations === 0 ? "Nothing looped forever when the page loaded." : `${plural(facts.runningAnimations, "looping animation")}, re-checked with prefers-reduced-motion on.`,
      tone: facts.runningAnimations === 0 ? "good" : facts.respectsReducedMotion === null ? "neutral" : facts.respectsReducedMotion ? "good" : "warn",
    },
    {
      key: "overlay",
      icon: Layers,
      label: "Overlay widget",
      value: facts.overlay ?? "None detected",
      detail: facts.overlay ? "Overlays do not fix the underlying code and are named in many lawsuits. Fix the source instead." : "No known accessibility overlay script on the page.",
      tone: facts.overlay ? "warn" : "good",
    },
    {
      key: "statement",
      icon: FileText,
      label: "Accessibility statement",
      value: facts.statementLink ? "Linked" : "No link found",
      detail: facts.statementLink ? facts.statementLink : "Required for public sector sites in the UK and EU, and expected under the European Accessibility Act.",
      tone: facts.statementLink ? "good" : "warn",
    },
  ]

  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {signals.map((signal) => {
        const tone = TONE[signal.tone]
        const Icon = signal.icon
        const ToneIcon = tone.icon
        return (
          <li key={signal.key} className={cn("rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900", tone.card)}>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {signal.label}
              </span>
              <ToneIcon className={cn("h-5 w-5", tone.iconClass)} aria-label={tone.word} role="img" />
            </div>
            <p className="mt-2 text-lg font-semibold leading-snug text-slate-900 dark:text-white">{signal.value}</p>
            <p className="mt-1 break-words text-sm leading-5 text-slate-600 dark:text-slate-400">{signal.detail}</p>
          </li>
        )
      })}
    </ul>
  )
}

// ---------------------------------------------------------------------------------------------
// AI summary

interface LegacySummary {
  quickWins?: string[]
  businessRecommendations?: { prioritize?: string }
}

export function parseSummary(raw: string | undefined): AiSummary | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<AiSummary> & LegacySummary & { error?: string }
    if (parsed.error) return null
    if (parsed.headline && parsed.summary) {
      return { headline: parsed.headline, summary: parsed.summary, fixFirst: parsed.fixFirst ?? [], quickWins: parsed.quickWins ?? [] }
    }
    // Audits saved before November 2026 used a business-summary shape; keep the parts that came from the findings.
    if (parsed.quickWins?.length || parsed.businessRecommendations?.prioritize) {
      return {
        headline: parsed.businessRecommendations?.prioritize || "Where to start",
        summary: "",
        fixFirst: [],
        quickWins: parsed.quickWins ?? [],
      }
    }
  } catch {
    return null
  }
  return null
}

export function AiSummaryPanel({ summary }: { summary: AiSummary }) {
  return (
    <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5 dark:border-teal-900 dark:from-teal-950/40 dark:to-slate-900 sm:p-6">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-900 dark:text-teal-200">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        Summary written by AI from the findings
      </p>
      <p className="mt-2 font-serif text-xl font-semibold leading-snug text-slate-900 dark:text-white">{summary.headline}</p>
      {summary.summary && <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{summary.summary}</p>}
      {(summary.fixFirst.length > 0 || summary.quickWins.length > 0) && (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {summary.fixFirst.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Fix first</h3>
              <ol className="mt-2 space-y-2">
                {summary.fixFirst.map((item, index) => (
                  <li key={item.title} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white" aria-hidden="true">
                      {index + 1}
                    </span>
                    <span>
                      <span className="font-medium text-slate-900 dark:text-white">{item.title}.</span> <span className="text-slate-700 dark:text-slate-300">{item.why}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {summary.quickWins.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Quick wins</h3>
              <ul className="mt-2 space-y-2">
                {summary.quickWins.map((win) => (
                  <li key={win} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                    {win}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">Check it against the findings below before quoting it.</p>
    </div>
  )
}

// ---------------------------------------------------------------------------------------------
// What a clean result means. Written from the run's facts, never by AI: with nothing confirmed
// there is nothing for a model to summarise, and wording such as "issues" contradicts the score.

interface CleanResultPanelProps {
  reviewTitles: string[]
  reviewCount: number
  extras?: AuditExtras
}

export function CleanResultPanel({ reviewTitles, reviewCount, extras }: CleanResultPanelProps) {
  const automated = extras ? extras.coverage.filter((entry) => entry.status !== "manual").length : null
  const total = extras?.coverage.length ?? 0
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-900 dark:text-teal-200">What this result means</p>
      <p className="mt-2 font-serif text-xl font-semibold leading-snug text-slate-900 dark:text-white">A clean automated result is where manual testing starts.</p>
      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
        {automated !== null
          ? `Machines could test ${automated} of the ${total} WCAG 2.2 Level A and AA criteria on this page, and confirmed no failures in them. The rest need a person.`
          : "Machines can test only part of WCAG, and confirmed no failures in that part. The rest needs a person."}
      </p>
      <ol className="mt-4 space-y-3 text-sm">
        {reviewCount > 0 && (
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white" aria-hidden="true">1</span>
            <span className="min-w-0">
              <a href="#audit-findings" className="font-medium text-teal-800 underline underline-offset-2 hover:decoration-2 dark:text-teal-300">
                Check the {plural(reviewCount, "item")} flagged for review
              </a>
              {reviewTitles.length > 0 && <span className="mt-1 block text-slate-700 dark:text-slate-300">{reviewTitles.join("; ")}.</span>}
            </span>
          </li>
        )}
        {extras && (
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white" aria-hidden="true">{reviewCount > 0 ? 2 : 1}</span>
            <span className="min-w-0">
              <a href="#audit-manual" className="font-medium text-teal-800 underline underline-offset-2 hover:decoration-2 dark:text-teal-300">
                Work through the manual testing plan
              </a>
              <span className="mt-1 block text-slate-700 dark:text-slate-300">{plural(extras.manualChecks.length, "check")} chosen for what this page contains.</span>
            </span>
          </li>
        )}
      </ol>
    </div>
  )
}

// ---------------------------------------------------------------------------------------------
// Page structure and keyboard walk-through

export function PageStructure({ extras }: { extras: AuditExtras }) {
  const { facts, keyboard } = extras
  const landmarks: [string, number][] = [
    ["main", facts.landmarks.main],
    ["navigation", facts.landmarks.nav],
    ["banner (header)", facts.landmarks.header],
    ["contentinfo (footer)", facts.landmarks.footer],
    ["search", facts.landmarks.search],
    ["complementary", facts.landmarks.aside],
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Heading outline</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          What a screen reader user hears when they list the headings. {plural(facts.headingCount, "heading")}
          {facts.lang ? `, page language "${facts.lang}"` : ", no page language set"}.
        </p>
        {facts.headings.length === 0 ? (
          <p className="mt-3 text-sm font-medium text-red-700 dark:text-red-300">No headings: screen reader users cannot skim this page.</p>
        ) : (
          <ol className="mt-3 max-h-80 space-y-1 overflow-auto pr-2 text-sm" tabIndex={0} aria-label="Heading outline">
            {facts.headings.map((heading, index) => (
              <li key={index} className="flex items-baseline gap-2" style={{ paddingLeft: `${Math.max(0, heading.level - 1) * 14}px` }}>
                <span className="w-7 shrink-0 font-mono text-xs font-semibold text-teal-800 dark:text-teal-300">H{heading.level}</span>
                <span className="min-w-0 break-words text-slate-800 dark:text-slate-200">{heading.text}</span>
              </li>
            ))}
            {facts.headingCount > facts.headings.length && <li className="text-xs text-slate-600 dark:text-slate-400">and {facts.headingCount - facts.headings.length} more</li>}
          </ol>
        )}
        <h4 className="mt-5 text-sm font-semibold text-slate-900 dark:text-white">Landmarks</h4>
        <ul className="mt-2 flex flex-wrap gap-1.5 text-xs">
          {landmarks.map(([name, n]) => (
            <li key={name} className={cn("rounded-full border px-2.5 py-1", n > 0 ? "border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" : "border-dashed border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400")}>
              {name}: <strong className="tabular-nums">{n}</strong>
            </li>
          ))}
          <li className={cn("rounded-full border px-2.5 py-1", facts.skipLink ? "border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" : "border-dashed border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400")}>
            skip link: <strong>{facts.skipLink ? "yes" : "no"}</strong>
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Keyboard walk-through</h3>
        {keyboard.ran ? (
          <>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{keyboard.endNote}</p>
            {keyboard.firstStops.length > 0 && (
              <div className="mt-3 max-h-80 overflow-auto rounded-lg border border-slate-200 dark:border-slate-800" tabIndex={0} role="region" aria-label="Tab stops">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Tab stops in order, with whether focus was visible</caption>
                  <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <tr>
                      <th scope="col" className="px-3 py-2">#</th>
                      <th scope="col" className="px-3 py-2">Element</th>
                      <th scope="col" className="px-3 py-2">Focus visible</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {keyboard.firstStops.map((stop) => {
                      const verdict =
                        stop.covered === "full"
                          ? { text: "Hidden behind content", cls: "text-red-700 dark:text-red-300" }
                          : stop.indicator === "visible"
                            ? { text: "Yes", cls: "text-emerald-700 dark:text-emerald-300" }
                            : stop.indicator === "none"
                              ? { text: "No", cls: "font-semibold text-red-700 dark:text-red-300" }
                              : stop.indicator === "uncertain"
                                ? { text: "Unclear", cls: "text-amber-700 dark:text-amber-300" }
                                : { text: "Not checked", cls: "text-slate-600 dark:text-slate-400" }
                      return (
                        <tr key={stop.index}>
                          <td className="px-3 py-2 tabular-nums text-slate-600 dark:text-slate-400">{stop.index}</td>
                          <td className="px-3 py-2">
                            <span className="block break-words text-slate-900 dark:text-white">{stop.name || <em className="text-slate-600 dark:text-slate-400">no name</em>}</span>
                            <span className="text-xs text-slate-600 dark:text-slate-400">{stop.role}</span>
                          </td>
                          <td className={cn("px-3 py-2", verdict.cls)}>{verdict.text}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">The keyboard pass did not run on this page. The Focus Order Checker runs it on its own with a screenshot of every stop.</p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------------------------
// Manual testing plan

export function ManualChecks({ checks }: { checks: ManualCheck[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({})
  const baseId = useId()
  const completed = checks.filter((check) => done[check.id]).length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">Built from what this page contains. Tick them off as you go; nothing is saved.</p>
        <p className="text-sm font-medium tabular-nums text-slate-800 dark:text-slate-200" aria-live="polite">
          {completed} of {checks.length} done
        </p>
      </div>
      <ul className="grid gap-3 md:grid-cols-2">
        {checks.map((check) => {
          const id = `${baseId}-${check.id}`
          return (
            <li key={check.id} className={cn("rounded-xl border bg-white p-4 transition-colors dark:bg-slate-900", done[check.id] ? "border-emerald-300 dark:border-emerald-800" : "border-slate-200 dark:border-slate-800")}>
              <div className="flex items-start gap-3">
                <input id={id} type="checkbox" checked={!!done[check.id]} onChange={(event) => setDone((state) => ({ ...state, [check.id]: event.target.checked }))} className="mt-1 h-5 w-5 shrink-0 accent-teal-700" />
                <div className="min-w-0">
                  <label htmlFor={id} className={cn("block font-semibold text-slate-900 dark:text-white", done[check.id] && "line-through decoration-2")}>
                    {check.title}
                  </label>
                  <p className="mt-0.5 text-xs font-medium text-teal-800 dark:text-teal-300">WCAG {check.sc.join(", ")}</p>
                  <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-300">{check.reason}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                    {check.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------------------------
// What ran

export function EngineDetails({ extras }: { extras: AuditExtras }) {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
      <summary className="cursor-pointer font-semibold text-slate-900 marker:text-slate-500 dark:text-white">
        What ran on this page ({(extras.engine.durationMs / 1000).toFixed(0)} seconds)
      </summary>
      <ul className="mt-3 space-y-2">
        {extras.engine.checks.map((check) => (
          <li key={check.id} className="flex gap-2">
            {check.status === "ok" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-label="Ran" role="img" /> : <CircleSlash className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-label="Skipped" role="img" />}
            <span>
              <span className="font-medium text-slate-900 dark:text-white">{check.label}.</span> <span className="text-slate-700 dark:text-slate-300">{check.detail}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">Desktop Chrome at 1280 by 800, no cookies, one page in its first state. The reflow check narrows the same page to 320 by 640.</p>
    </details>
  )
}
