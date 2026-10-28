"use client"

import { useId, useMemo, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, CheckCircle2, ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NOTE_MAX_LENGTH,
  RATING_OPTIONS,
  proofPointsOf,
  summariseAssessment,
  type Rating,
} from "@/lib/maturity/assessment"
import { DIMENSIONS, LEVELS, MATURITY_MODEL_SOURCE, type Dimension } from "@/lib/maturity/model"
import { cn } from "@/lib/utils"
import { MaturityResults } from "./accessibility-maturity-assessment/results"
import { clearAssessment, isStorageUnavailable, updateAssessment, useAssessment } from "./accessibility-maturity-assessment/store"

// Accessibility Maturity Assessment: a self-assessment against the W3C Accessibility Maturity
// Model. One dimension per step (the step pattern from the EAA scope checker), every proof point
// rated on the model's four levels or as "not sure" or "does not apply", with optional notes.
// Answers are saved in this browser as they are given and never sent anywhere. Results are shown
// to everyone; there is no form in front of them.

const OVERVIEW = 0
const RESULTS = DIMENSIONS.length + 1

const NAV_BUTTON =
  "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
const PRIMARY = cn(NAV_BUTTON, "bg-teal-700 text-white hover:bg-teal-800")
const SECONDARY = cn(
  NAV_BUTTON,
  "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800",
)

export default function AccessibilityMaturityAssessment() {
  const state = useAssessment()
  const [step, setStep] = useState(OVERVIEW)
  const [status, setStatus] = useState("")
  const headingRef = useRef<HTMLHeadingElement>(null)
  const id = useId()
  const summary = useMemo(() => summariseAssessment(state), [state])

  const goTo = (next: number) => {
    setStep(next)
    setStatus("")
    // Focus the new step's heading so keyboard and screen reader users start at the top of it.
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  const setRating = (pointId: string, rating: Rating) =>
    updateAssessment((current) => ({ ...current, ratings: { ...current.ratings, [pointId]: rating } }))

  const setNote = (pointId: string, note: string) =>
    updateAssessment((current) => {
      const notes = { ...current.notes }
      if (note) notes[pointId] = note.slice(0, NOTE_MAX_LENGTH)
      else delete notes[pointId]
      return { ...current, notes }
    })

  const startOver = () => {
    if (!window.confirm("Clear every rating and note in this assessment? This cannot be undone.")) return
    clearAssessment()
    goTo(OVERVIEW)
    setStatus("The assessment has been cleared.")
  }

  const firstUnfinished = DIMENSIONS.findIndex((dimension) => proofPointsOf(dimension).some((point) => !state.ratings[point.id]))
  const stepLabel =
    step === OVERVIEW ? "Overview" : step === RESULTS ? "Results" : `Dimension ${step} of ${DIMENSIONS.length}`

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stepLabel}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {summary.answered} of {summary.total} proof points answered
        </p>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>

      {isStorageUnavailable() && (
        <p className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          This browser is blocking storage, so your answers will be lost if you leave or reload the page. Download
          the Excel file from the results to keep them.
        </p>
      )}

      {step === OVERVIEW && (
        <section aria-labelledby={`${id}-step`}>
          <h2
            id={`${id}-step`}
            ref={headingRef}
            tabIndex={-1}
            className="scroll-mt-28 rounded-sm font-serif text-2xl font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white"
          >
            How the assessment works
          </h2>
          <div className="mt-3 max-w-[68ch] space-y-3 leading-7 text-slate-700 dark:text-slate-300">
            <p>
              The model looks at seven dimensions of how an organisation works. For each one you rate its proof
              points, the evidence the model looks for, against four levels. Choose &ldquo;Not sure&rdquo; when you
              don&apos;t know and &ldquo;Does not apply&rdquo; when a proof point doesn&apos;t fit your organisation.
              The W3C suggests doing this with people from across the organisation rather than alone.
            </p>
            <p>
              Answers are saved in this browser as you go, so you can stop and come back. Nothing is sent to us.
            </p>
          </div>

          <h3 className="mt-6 font-semibold text-slate-900 dark:text-white">The four levels</h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {LEVELS.map((level) => (
              <div key={level.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <dt className="font-semibold text-slate-900 dark:text-white">{level.name}</dt>
                <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{level.meaning}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 max-w-md">
            <label htmlFor={`${id}-org`} className="block text-sm font-semibold text-slate-900 dark:text-white">
              Organisation or team name (optional)
            </label>
            <Input
              id={`${id}-org`}
              value={state.organisation}
              maxLength={200}
              autoComplete="organization"
              onChange={(event) => updateAssessment((current) => ({ ...current, organisation: event.target.value }))}
              aria-describedby={`${id}-org-help`}
              className="mt-2 h-11 bg-background text-base"
            />
            <p id={`${id}-org-help`} className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Shown on the Excel and PDF downloads.
            </p>
          </div>

          <h3 className="mt-8 font-semibold text-slate-900 dark:text-white">The seven dimensions</h3>
          <ol className="mt-3 space-y-2">
            {DIMENSIONS.map((dimension, index) => {
              const points = proofPointsOf(dimension)
              const answered = points.filter((point) => state.ratings[point.id]).length
              const done = answered === points.length
              return (
                <li key={dimension.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <span className="flex items-center gap-2 text-slate-900 dark:text-white">
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                    ) : (
                      <ListChecks className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                    )}
                    <span className="font-medium">{dimension.name}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {answered} of {points.length} answered{done ? ", complete" : ""}
                    </span>
                  </span>
                  <Button type="button" variant="outline" size="sm" onClick={() => goTo(index + 1)}>
                    {answered === 0 ? "Start" : done ? "Review" : "Continue"}
                    <span className="sr-only"> {dimension.name}</span>
                  </Button>
                </li>
              )
            })}
          </ol>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className={PRIMARY} onClick={() => goTo(firstUnfinished === -1 ? RESULTS : firstUnfinished + 1)}>
              {summary.answered === 0 ? "Start the assessment" : firstUnfinished === -1 ? "See your results" : "Continue where you left off"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            {summary.answered > 0 && firstUnfinished !== -1 && (
              <button type="button" className={SECONDARY} onClick={() => goTo(RESULTS)}>
                See results so far
              </button>
            )}
            {summary.answered > 0 && (
              <button type="button" className={SECONDARY} onClick={startOver}>
                Start over
              </button>
            )}
          </div>
        </section>
      )}

      {step > OVERVIEW && step < RESULTS && (
        <DimensionStep
          key={DIMENSIONS[step - 1].id}
          dimension={DIMENSIONS[step - 1]}
          ratings={state.ratings}
          notes={state.notes}
          headingRef={headingRef}
          onRate={setRating}
          onNote={setNote}
        />
      )}

      {step > OVERVIEW && step < RESULTS && (
        <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
          <button type="button" className={SECONDARY} onClick={() => goTo(step - 1)}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {step === 1 ? "Overview" : `Back to ${DIMENSIONS[step - 2].name}`}
          </button>
          <button type="button" className={PRIMARY} onClick={() => goTo(step + 1)}>
            {step === DIMENSIONS.length ? "See your results" : `Next: ${DIMENSIONS[step].name}`}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {step === RESULTS && (
        <>
          <MaturityResults
            state={state}
            summary={summary}
            headingRef={headingRef}
            onEdit={(index) => goTo(index + 1)}
            onStartOver={startOver}
          />
          <div className="mt-6">
            <button type="button" className={SECONDARY} onClick={() => goTo(OVERVIEW)}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to the overview
            </button>
          </div>
        </>
      )}

      <p className="mt-8 text-xs leading-5 text-slate-600 dark:text-slate-400">
        Based on the W3C{" "}
        <a href={MATURITY_MODEL_SOURCE.versionUrl} className="font-medium text-teal-800 underline underline-offset-2 dark:text-teal-300">
          {MATURITY_MODEL_SOURCE.title}
        </a>{" "}
        ({MATURITY_MODEL_SOURCE.status}, {MATURITY_MODEL_SOURCE.publishedLabel}). Proof points are paraphrased in
        our own words; dimension and level names are the W3C&apos;s.
      </p>
    </div>
  )
}

interface DimensionStepProps {
  dimension: Dimension
  ratings: Record<string, Rating>
  notes: Record<string, string>
  headingRef: React.RefObject<HTMLHeadingElement | null>
  onRate: (pointId: string, rating: Rating) => void
  onNote: (pointId: string, note: string) => void
}

function DimensionStep({ dimension, ratings, notes, headingRef, onRate, onNote }: DimensionStepProps) {
  const id = useId()
  const points = proofPointsOf(dimension)
  const answered = points.filter((point) => ratings[point.id]).length
  // Notes that already have text start open. Fixed for the life of the step, so React never
  // touches the open attribute again and the visitor's own opening and closing is kept.
  const [openAtStart] = useState(() => new Set(points.filter((point) => notes[point.id]).map((point) => point.id)))

  return (
    <section aria-labelledby={`${id}-heading`}>
      <h2
        id={`${id}-heading`}
        ref={headingRef}
        tabIndex={-1}
        className="scroll-mt-28 rounded-sm font-serif text-2xl font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white"
      >
        {dimension.name}
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Section {dimension.section} of the W3C model. {answered} of {points.length} proof points answered.
      </p>
      <p className="mt-3 max-w-[68ch] leading-7 text-slate-700 dark:text-slate-300">{dimension.summary}</p>

      <details open className="mt-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
        <summary className="cursor-pointer rounded-sm font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white">
          What each level looks like for {dimension.name}
        </summary>
        <dl className="mt-3 space-y-2 text-sm leading-6">
          {LEVELS.map((level) => (
            <div key={level.id} className="sm:flex sm:gap-3">
              <dt className="font-semibold text-slate-900 dark:text-white sm:w-24 sm:shrink-0">{level.name}</dt>
              <dd className="text-slate-700 dark:text-slate-300">{dimension.levels[level.id]}</dd>
            </div>
          ))}
        </dl>
      </details>

      {dimension.groups.map((group) => (
        <div key={group.section} className="mt-8">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {group.title} <span className="font-normal text-slate-600 dark:text-slate-400">({group.section})</span>
          </h3>
          <div className="mt-3 space-y-4">
            {group.proofPoints.map((point) => {
              const rating = ratings[point.id]
              const note = notes[point.id] ?? ""
              const noteId = `${id}-${point.id}-note`
              return (
                <fieldset key={point.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <legend className="float-left mb-3 w-full leading-7 text-slate-900 dark:text-white">{point.text}</legend>
                  <div className="clear-left flex flex-wrap gap-2">
                    {RATING_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className="inline-flex min-h-[2.5rem] cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-800 hover:border-teal-600 has-[:checked]:border-teal-700 has-[:checked]:bg-teal-50 has-[:checked]:font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-600 dark:border-slate-600 dark:text-slate-200 dark:has-[:checked]:border-teal-400 dark:has-[:checked]:bg-teal-950/50"
                      >
                        <input
                          type="radio"
                          name={`${id}-${point.id}`}
                          value={option.value}
                          checked={rating === option.value}
                          onChange={() => onRate(point.id, option.value)}
                          className="h-4 w-4 accent-teal-700"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  <details className="mt-3" open={openAtStart.has(point.id)}>
                    <summary className="cursor-pointer rounded-sm text-sm font-medium text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-teal-300">
                      Note (optional){note ? ", added" : ""}
                    </summary>
                    <label htmlFor={noteId} className="sr-only">
                      Note on: {point.text}
                    </label>
                    <textarea
                      id={noteId}
                      value={note}
                      maxLength={NOTE_MAX_LENGTH}
                      rows={3}
                      onChange={(event) => onNote(point.id, event.target.value)}
                      className="mt-2 w-full rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </details>
                </fieldset>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}
