"use client"

import { useId, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { activityCompletionIssues, activityPortfolio, activityPreview, checkActivityCode, initialActivityState } from "@/lib/courses/activity-checks"
import type { ActivityState, CourseActivity, LabCheckResult } from "@/lib/courses/activity-types"

const control = "min-h-11 rounded-md border border-slate-400 px-4 py-2 text-sm font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 dark:border-slate-600 dark:text-slate-100"
const primary = cn(control, "border-blue-800 bg-blue-800 text-white dark:border-blue-400 dark:bg-blue-400 dark:text-slate-950")
const field = "mt-2 w-full rounded-md border border-slate-400 bg-white p-3 text-base text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"

export function LearningActivity({ activity, initial, onChange }: { activity: CourseActivity; initial?: ActivityState; onChange?: (state: ActivityState) => void }) {
  const prefix = useId()
  const [state, setState] = useState(() => initialActivityState(activity, initial))
  const [checks, setChecks] = useState<LabCheckResult[]>([])
  const [hints, setHints] = useState(0)
  const [preview, setPreview] = useState("")
  const [modelVisible, setModelVisible] = useState(false)
  const [solutionVisible, setSolutionVisible] = useState(false)
  const [issues, setIssues] = useState<string[]>([])
  const [announcement, setAnnouncement] = useState("")
  const resultRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const parse = (html: string) => new DOMParser().parseFromString(html, "text/html")
  const update = (patch: Partial<ActivityState>) => {
    const next = { ...state, ...patch, completedAt: undefined }
    setState(next)
    onChange?.(next)
    setIssues([])
  }
  const toggle = (key: "criteria" | "manual", value: string) => update({ [key]: state[key].includes(value) ? state[key].filter((entry) => entry !== value) : [...state[key], value] })
  const checkCode = () => {
    const next = checkActivityCode(activity, state.code ?? "", parse)
    setChecks(next)
    update({ checked: [...new Set([...state.checked, "code"])] })
    setAnnouncement(`${next.filter((check) => check.passed).length} of ${next.length} structural checks passed. Manual verification is still required.`)
  }
  const finish = () => {
    const currentChecks = activity.checks?.length ? checkActivityCode(activity, state.code ?? "", parse) : []
    const remaining = activityCompletionIssues(activity, state, currentChecks)
    setChecks(currentChecks)
    setIssues(remaining)
    if (!remaining.length) {
      const next = { ...state, completedAt: new Date().toISOString() }
      setState(next)
      onChange?.(next)
      setAnnouncement("Activity recorded as practised. Your explanation and checklist are self-assessed.")
    }
    requestAnimationFrame(() => resultRef.current?.focus())
  }
  const download = () => {
    const url = URL.createObjectURL(new Blob([activityPortfolio(activity, state)], { type: "text/plain;charset=utf-8" }))
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${activity.id}-practice-record.txt`
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setAnnouncement("Your practice record was downloaded as a text file.")
  }

  return (
    <section aria-labelledby={`${prefix}-title`} className="my-8 rounded-xl border-2 border-blue-200 bg-white p-4 sm:p-6 dark:border-blue-900 dark:bg-slate-950">
      <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">{activity.kind === "lab" ? "Guided lab" : "Decision case"} · About {activity.minutes} minutes</p>
      <h3 ref={headingRef} id={`${prefix}-title`} tabIndex={-1} className="mt-2 scroll-mt-28 text-xl font-bold text-slate-900 dark:text-white">{activity.title}</h3>
      <p className="mt-3 text-slate-700 dark:text-slate-300">{activity.brief}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">{activity.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
      {initial && initial.version !== activity.version ? <p className="mt-3 text-sm text-amber-900 dark:text-amber-200">This activity has been revised. Complete the current version to record new practice.</p> : null}

      <div className="mt-6 space-y-6">
        {activity.steps.map((step, index) => {
          const selected = step.options.find((option) => option.id === state.answers[step.id])
          const checked = state.checked.includes(step.id)
          return (
            <fieldset key={step.id} className="space-y-3 border-t border-slate-200 pt-5 dark:border-slate-800">
              <legend className="max-w-full pr-3 font-semibold text-slate-900 dark:text-white">Decision {index + 1}: {step.prompt}</legend>
              {step.options.map((option) => <label key={option.id} className={cn("flex min-h-11 cursor-pointer items-start gap-3 rounded-md border p-3 text-sm", state.answers[step.id] === option.id ? "border-blue-700 bg-blue-50 dark:border-blue-400 dark:bg-blue-950" : "border-slate-300 dark:border-slate-700")}><input className="mt-1 h-4 w-4 shrink-0 accent-blue-700" type="radio" name={`${prefix}-${step.id}`} checked={state.answers[step.id] === option.id} onChange={() => update({ answers: { ...state.answers, [step.id]: option.id }, checked: state.checked.filter((entry) => entry !== step.id) })} /><span>{option.text}</span></label>)}
              <button type="button" className={primary} disabled={!selected} onClick={() => { update({ checked: [...new Set([...state.checked, step.id])] }); setAnnouncement(selected?.id === step.answer ? "Decision checked. Read the reasoning below." : "Consider the consequence below, then revise your decision.") }}>Check decision</button>
              {step.hint ? <details className="text-sm"><summary className="min-h-11 cursor-pointer py-3 font-semibold text-blue-800 dark:text-blue-300">A hint for this decision</summary><p className="pb-2">{step.hint}</p></details> : null}
              {checked && selected ? <div className={cn("rounded-md border p-4 text-sm", selected.id === step.answer ? "border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100" : "border-amber-500 bg-amber-50 text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100")}><p className="font-semibold">{selected.id === step.answer ? "A well-supported decision" : "Reconsider this decision"}</p><p className="mt-1">{selected.feedback}</p></div> : null}
            </fieldset>
          )
        })}
      </div>

      {activity.starterCode !== undefined ? <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
        <label htmlFor={`${prefix}-code`} className="font-semibold">Inspect and repair the example</label>
        <p id={`${prefix}-code-help`} className="mt-1 text-sm text-slate-600 dark:text-slate-400">Use the standard text editor below. Tab moves to the next control. Checks cover the named structural properties; they do not certify accessibility.</p>
        <textarea id={`${prefix}-code`} aria-describedby={`${prefix}-code-help`} spellCheck={false} rows={14} maxLength={20000} className={cn(field, "font-mono text-sm leading-relaxed")} value={state.code ?? ""} onChange={(event) => { update({ code: event.target.value, checked: state.checked.filter((entry) => entry !== "code"), manual: [] }); setChecks([]); setPreview("") }} />
        <div className="mt-3 flex flex-wrap gap-3">
          <button type="button" className={primary} onClick={checkCode}>Run structural checks</button>
          <button type="button" className={control} onClick={() => { setPreview(activityPreview(state.code ?? "", parse)); setAnnouncement("Static preview opened. Scripts and external resources are disabled.") }}>Preview markup</button>
          <button type="button" className={control} onClick={() => { if (window.confirm("Replace your edited code with the original example? Your explanation will be kept.")) { update({ code: activity.starterCode, checked: state.checked.filter((entry) => entry !== "code"), manual: [] }); setChecks([]); setPreview("") } }}>Reset code</button>
        </div>
        {checks.length ? <ul aria-label="Structural check results" className="mt-4 space-y-2 text-sm">{checks.map((check) => <li key={check.id} className={cn("rounded-md border p-3", check.passed ? "border-emerald-500 text-emerald-900 dark:text-emerald-200" : "border-amber-500 text-amber-900 dark:text-amber-200")}><strong>{check.passed ? "Passed: " : "Needs work: "}</strong>{check.label}</li>)}</ul> : null}
        {preview ? <div className="mt-4 space-y-2"><p className="text-sm text-slate-600 dark:text-slate-400">Static markup preview. Script behavior, forms, navigation and external resources are disabled. Use the code and manual procedure to evaluate dynamic behavior.</p><button type="button" className={control} onClick={() => { setPreview(""); headingRef.current?.focus() }}>Close preview and return to activity</button><iframe title={`${activity.title}: isolated markup preview`} sandbox="" referrerPolicy="no-referrer" srcDoc={preview} className="h-80 w-full rounded-md border border-slate-400 bg-white" /></div> : null}
        {activity.hints?.length ? <div className="mt-4"><button type="button" className={control} disabled={hints >= activity.hints.length} onClick={() => setHints((value) => value + 1)}>Show next repair hint ({hints} of {activity.hints.length})</button><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">{activity.hints.slice(0, hints).map((hint) => <li key={hint}>{hint}</li>)}</ol></div> : null}
        {activity.solutionCode && state.checked.includes("code") ? <div className="mt-4"><button type="button" className={control} aria-expanded={solutionVisible} onClick={() => setSolutionVisible((value) => !value)}>{solutionVisible ? "Hide" : "Compare with"} one possible repair</button>{solutionVisible ? <pre tabIndex={0} role="region" aria-label="One possible repair" className="mt-3 overflow-x-auto rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-900"><code>{activity.solutionCode}</code></pre> : null}</div> : null}
      </div> : null}

      {activity.manualChecks?.length ? <fieldset className="mt-6 space-y-3 border-t border-slate-200 pt-5 dark:border-slate-800"><legend className="pr-3 font-semibold">Verify the outcome</legend><p className="text-sm text-slate-600 dark:text-slate-400">Record what you personally checked. These are your attestations, not automated test results. If you cannot perform a check yet, leave the activity in progress.</p>{activity.manualChecks.map((item, index) => <label key={item} className="flex min-h-11 items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-blue-700" checked={state.manual.includes(String(index))} onChange={() => toggle("manual", String(index))} /><span>{item}</span></label>)}</fieldset> : null}

      <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
        <label htmlFor={`${prefix}-reflection`} className="font-semibold">Explain your reasoning and evidence</label>
        <p id={`${prefix}-reflection-help`} className="mt-2 text-sm">{activity.reflection.prompt}</p>
        <textarea id={`${prefix}-reflection`} aria-describedby={`${prefix}-reflection-help`} className={field} rows={5} maxLength={8000} value={state.reflection} onChange={(event) => update({ reflection: event.target.value, criteria: [] })} />
        <fieldset className="mt-4 space-y-3"><legend className="font-semibold">Self-assessment rubric</legend>{activity.reflection.criteria.map((criterion, index) => <label key={criterion} className="flex min-h-11 items-start gap-3 py-1 text-sm"><input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-blue-700" checked={state.criteria.includes(String(index))} onChange={() => toggle("criteria", String(index))} /><span>{criterion}</span></label>)}</fieldset>
        <button type="button" disabled={state.reflection.trim().length < 40} aria-expanded={modelVisible} className={control} onClick={() => setModelVisible((value) => !value)}>{modelVisible ? "Hide" : "Compare with"} the model reasoning</button>
        {modelVisible ? <p className="mt-3 rounded-md bg-slate-100 p-4 text-sm dark:bg-slate-900">{activity.reflection.example}</p> : null}
      </div>

      <fieldset className="mt-6 space-y-3 border-t border-slate-200 pt-5 dark:border-slate-800"><legend className="pr-3 font-semibold">Apply it to a new situation</legend><p>{activity.transfer.prompt}</p>{activity.transfer.options.map((option, index) => <label key={option.text} className="flex min-h-11 items-start gap-3 py-2 text-sm"><input type="radio" className="mt-1 h-4 w-4 shrink-0 accent-blue-700" name={`${prefix}-transfer`} checked={state.transfer === String(index)} onChange={() => update({ transfer: String(index), checked: state.checked.filter((entry) => entry !== "transfer") })} /><span>{option.text}</span></label>)}<button type="button" className={primary} disabled={state.transfer === undefined} onClick={() => { update({ checked: [...new Set([...state.checked, "transfer"])] }); setAnnouncement(Number(state.transfer) === activity.transfer.answer ? "Transfer answer checked. Read the feedback below." : "Review the transfer feedback and try again.") }}>Check new situation</button>{state.checked.includes("transfer") && state.transfer !== undefined ? <p className="rounded-md bg-slate-100 p-4 text-sm dark:bg-slate-900"><strong>{Number(state.transfer) === activity.transfer.answer ? "Correct. " : "Reconsider. "}</strong>{activity.transfer.options[Number(state.transfer)]?.feedback}</p> : null}</fieldset>

      <fieldset className="mt-6"><legend className="font-semibold">How confident are you applying this without hints?</legend><div className="mt-2 flex flex-wrap gap-4">{([['low', 'I need more practice'], ['medium', 'Somewhat confident'], ['high', 'Confident']] as const).map(([value, label]) => <label key={value} className="flex min-h-11 items-center gap-2 text-sm"><input type="radio" name={`${prefix}-confidence`} checked={state.confidence === value} onChange={() => update({ confidence: value })} />{label}</label>)}</div></fieldset>

      <div className="mt-6 flex flex-wrap gap-3"><button type="button" className={primary} onClick={finish}>Record completed practice</button><button type="button" className={control} onClick={download}>Download my practice record</button></div>
      <div ref={resultRef} tabIndex={-1} className="mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">{issues.length ? <div role="alert" className="rounded-md border border-amber-600 p-4 text-sm"><p className="font-semibold">Before recording this activity:</p><ul className="mt-2 list-disc pl-5">{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul></div> : state.completedAt ? <p className="rounded-md border border-emerald-600 p-4 text-sm">Practised on {new Date(state.completedAt).toLocaleDateString()}. Your explanation and manual checks are self-assessed. Return later and apply this skill to a different example.</p> : null}</div>
      <details className="mt-5 border-t border-slate-200 pt-2 text-sm dark:border-slate-800"><summary className="min-h-11 cursor-pointer py-3 font-semibold">Sources and learning objectives</summary><p>Objectives: {activity.objectiveRefs.join(", ")}</p><ul className="mt-2 list-disc space-y-2 pl-5">{activity.sources.map((source) => <li key={source.url}><a href={source.url} className="break-words text-blue-800 underline underline-offset-2 dark:text-blue-300" target="_blank" rel="noopener noreferrer">{source.title}<span className="sr-only"> (opens in a new tab)</span></a>{source.version ? ` · ${source.version}` : ""}{source.reviewedAt ? ` · reviewed ${source.reviewedAt}` : ""}</li>)}</ul></details>
    </section>
  )
}
