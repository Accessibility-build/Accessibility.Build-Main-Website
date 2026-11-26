"use client"

/**
 * "Which Title II date applies to us?" in two or three questions.
 *
 * Native radio groups in fieldsets, so the questions work with every screen
 * reader and with voice control by their visible labels. The result sits in a
 * polite live region and is announced as one sentence; the detail below it is
 * read on demand. Nothing is stored or sent anywhere.
 */

import { useId, useMemo, useState } from "react"
import Link from "next/link"
import { CalendarPlus, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CALENDAR_IDS,
  DATES,
  ENTITY_OPTIONS,
  POPULATION_QUESTION,
  SOURCES,
  resolveDeadline,
  type EntityKind,
  type PopulationAnswer,
} from "@/lib/title-ii/data"

const CAL = "/compliance/deadlines/calendar.ics?id="

function daysUntil(iso: string): number {
  const today = new Date()
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const [y, m, d] = iso.split("-").map(Number)
  return Math.round((Date.UTC(y, m - 1, d) - start) / 86_400_000)
}

function Countdown({ iso }: { iso: string }) {
  const days = daysUntil(iso)
  if (days < 0) return <>This date has passed.</>
  return (
    <>
      {days.toLocaleString("en-US")} days from today
    </>
  )
}

function Option({
  name,
  value,
  checked,
  onChange,
  label,
  hint,
}: {
  name: string
  value: string
  checked: boolean
  onChange: (v: string) => void
  label: string
  hint?: string
}) {
  const id = `${name}-${value}`
  return (
    <div
      className={cn(
        "relative flex gap-3 rounded-lg border p-3.5 transition-colors",
        checked
          ? "border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40"
          : "border-slate-300 bg-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500",
      )}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="mt-0.5 h-4 w-4 shrink-0 accent-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:accent-blue-400 dark:focus-visible:ring-offset-slate-900"
      />
      <div className="min-w-0">
        {/* The label stretches over the whole card, so the card is the hit area. */}
        <label htmlFor={id} className="font-medium text-slate-900 after:absolute after:inset-0 after:content-[''] dark:text-white">
          {label}
        </label>
        {hint ? (
          <p id={`${id}-hint`} className="mt-0.5 text-sm leading-snug text-slate-600 dark:text-slate-400">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function DateCard({
  tier,
  calendarId,
  emphasis,
}: {
  tier: "large" | "small"
  calendarId: string
  emphasis: boolean
}) {
  const date = DATES[tier]
  return (
    <div
      className={cn(
        "rounded-xl border p-5",
        emphasis
          ? "border-blue-700 bg-blue-700 text-white dark:border-blue-500 dark:bg-blue-800"
          : "border-slate-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
      )}
    >
      <p className={cn("text-xs font-semibold uppercase tracking-wider", emphasis ? "text-white" : "text-slate-600 dark:text-slate-400")}>
        {tier === "large" ? "Population 50,000 or more" : "Under 50,000, or a special district"}
      </p>
      <p className="mt-1 text-3xl font-bold tracking-tight">
        <time dateTime={date.iso}>{date.label}</time>
      </p>
      <p className={cn("mt-1 text-sm", emphasis ? "text-white" : "text-slate-600 dark:text-slate-400")}>
        <Countdown iso={date.iso} />. {date.cite}.
      </p>
      <a
        href={`${CAL}${calendarId}`}
        className={cn(
          "mt-4 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          emphasis
            ? "bg-white text-blue-800 hover:bg-blue-50 focus-visible:ring-white focus-visible:ring-offset-blue-700 dark:focus-visible:ring-offset-blue-800"
            : "border border-slate-300 text-slate-800 hover:bg-slate-100 focus-visible:ring-blue-600 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900",
        )}
      >
        <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        Add to calendar (.ics)
      </a>
    </div>
  )
}

export function TitleIIDeadlineChecker() {
  const uid = useId().replace(/:/g, "")
  const [entity, setEntity] = useState<EntityKind | null>(null)
  const [population, setPopulation] = useState<PopulationAnswer | null>(null)
  const [hhs, setHhs] = useState<"no" | "large" | "small" | null>(null)

  const popQuestion = entity ? POPULATION_QUESTION[entity] : undefined
  const result = useMemo(() => (entity ? resolveDeadline(entity, population) : null), [entity, population])

  const announcement = !result
    ? ""
    : result.tier === "either"
      ? `Your date is either ${DATES.large.label} or ${DATES.small.label}. Details follow.`
      : `Your Title II compliance date is ${DATES[result.tier].label}.`

  const chooseEntity = (v: string) => {
    setEntity(v as EntityKind)
    setPopulation(null)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-8 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-8">
          <fieldset>
            <legend className="text-base font-semibold text-slate-900 dark:text-white">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white dark:bg-white dark:text-slate-900" aria-hidden="true">
                1
              </span>
              What kind of public entity are you?
            </legend>
            <div className="mt-3 space-y-2">
              {ENTITY_OPTIONS.map((o) => (
                <Option
                  key={o.value}
                  name={`${uid}-entity`}
                  value={o.value}
                  checked={entity === o.value}
                  onChange={chooseEntity}
                  label={o.label}
                  hint={o.hint}
                />
              ))}
            </div>
          </fieldset>

          {popQuestion ? (
            <fieldset>
              <legend className="text-base font-semibold text-slate-900 dark:text-white">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white dark:bg-white dark:text-slate-900" aria-hidden="true">
                  2
                </span>
                {popQuestion.legend}
              </legend>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {popQuestion.hint}{" "}
                <a href={popQuestion.lookup.href} className="font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300">
                  {popQuestion.lookup.label}
                </a>
                .
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {(
                  [
                    ["large", "50,000 or more"],
                    ["small", "Under 50,000"],
                    ["unknown", "I don't know"],
                  ] as const
                ).map(([value, label]) => (
                  <Option
                    key={value}
                    name={`${uid}-pop`}
                    value={value}
                    checked={population === value}
                    onChange={(v) => setPopulation(v as PopulationAnswer)}
                    label={label}
                  />
                ))}
              </div>
            </fieldset>
          ) : null}

          <fieldset>
            <legend className="text-base font-semibold text-slate-900 dark:text-white">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white dark:bg-white dark:text-slate-900" aria-hidden="true">
                {popQuestion ? 3 : 2}
              </span>
              Do you receive funding from the US Department of Health and Human Services?
            </legend>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Public health departments, public hospitals and Medicaid agencies usually do. HHS has its own Section 504
              web rule with separate dates. Optional.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {(
                [
                  ["no", "No"],
                  ["large", "Yes, 15 or more employees"],
                  ["small", "Yes, fewer than 15"],
                ] as const
              ).map(([value, label]) => (
                <Option
                  key={value}
                  name={`${uid}-hhs`}
                  value={value}
                  checked={hhs === value}
                  onChange={(v) => setHhs(v as "no" | "large" | "small")}
                  label={label}
                />
              ))}
            </div>
          </fieldset>
        </div>

        {/* ---------- Result ---------- */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Your date</h3>
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {announcement}
          </p>

          {!result ? (
            <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              {entity && popQuestion
                ? "Answer the population question to see your date."
                : "Answer the first question to see which compliance date applies to you."}
            </div>
          ) : (
            <div className="mt-3 space-y-4">
              {result.tier === "either" ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <DateCard tier="large" calendarId={CALENDAR_IDS.large} emphasis={false} />
                  <DateCard tier="small" calendarId={CALENDAR_IDS.small} emphasis={false} />
                </div>
              ) : (
                <DateCard tier={result.tier} calendarId={CALENDAR_IDS[result.tier]} emphasis />
              )}

              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{result.reason}</p>

              {entity === "unsure" ? (
                <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  <li>
                    If you are an independent government with your own board and budget, set up for one or a few
                    functions, and the Census Bureau does not publish a population for you, you are probably a special
                    district: {DATES.small.label}.
                  </li>
                  <li>
                    If a city, county or state created you and controls you, use the population of that government.
                  </li>
                  <li>
                    <a href={SOURCES.censusGovernments} className="font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300">
                      Census of Governments
                    </a>{" "}
                    and your state attorney general or municipal league can confirm how you are classified.
                  </li>
                </ul>
              ) : null}

              {hhs && hhs !== "no" ? (
                <div className="rounded-lg border border-violet-300 bg-violet-50 p-4 text-sm leading-relaxed text-violet-950 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-100">
                  <p className="font-semibold">Also: HHS Section 504 rule</p>
                  <p className="mt-1">
                    As an HHS recipient with {hhs === "large" ? "15 or more" : "fewer than 15"} employees, your Section 504
                    date is{" "}
                    <time dateTime={DATES[hhs === "large" ? "hhsLarge" : "hhsSmall"].iso} className="font-semibold">
                      {DATES[hhs === "large" ? "hhsLarge" : "hhsSmall"].label}
                    </time>{" "}
                    ({DATES[hhs === "large" ? "hhsLarge" : "hhsSmall"].cite}). Both rules apply separately and both require
                    WCAG 2.1 AA, so work to whichever date comes first.{" "}
                    <a
                      href={`${CAL}${hhs === "large" ? CALENDAR_IDS.hhsLarge : CALENDAR_IDS.hhsSmall}`}
                      className="font-medium underline underline-offset-2"
                    >
                      Add it to your calendar
                    </a>
                    .
                  </p>
                </div>
              ) : null}

              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
                These dates come from the April 2026 interim rule, which is being challenged in court. A ruling could bring
                the earlier dates back, so see <a href="#rule-status" className="font-medium underline underline-offset-2">rule status</a>{" "}
                before you plan around the later one. This is general information, not legal advice.
              </div>

              <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a href={SOURCES.s35200} className="inline-flex items-center gap-1 font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300">
                  Read 28 CFR 35.200 on eCFR
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <Link href="/compliance/deadlines" className="font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300">
                  All accessibility deadlines
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
