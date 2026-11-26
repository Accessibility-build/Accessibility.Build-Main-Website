"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertTriangle, ArrowLeft, ArrowRight, Award, CheckCircle2, Clock, Flag, ListChecks, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CourseFinalExam, CourseRenewal } from "@/lib/courses/config"
import type { ExamOverview, RenewalOverview } from "@/lib/courses/exam"

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-slate-950"
const btn = cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-500 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800", ring)
const primary = cn(btn, "border-blue-700 bg-blue-700 text-white hover:bg-blue-800 dark:border-blue-400 dark:bg-blue-400 dark:text-slate-950 dark:hover:bg-blue-300")

interface Question { n: number; stem: string; code?: string; options: string[] }
interface Paper { id: string; kind?: "final" | "renewal"; attemptNo: number; expiresAt: string; timed: boolean; questions: Question[]; answers: Record<string, number> }
interface Result { kind?: "final" | "renewal"; renewedUntil?: string | null; percent: number; correct: number; total: number; passed: boolean; sections: Record<string, { correct: number; total: number }>; roundFailed: boolean; endReason: string | null }

interface Props {
  slug: string
  homeRoute: string
  exam: CourseFinalExam
  timeOptions: number[]
  sectionTitles: Record<string, string>
  questionCount: number
  courseComplete: boolean
  remaining: { lessons: number; activities: number }
  /** Set when the course has a readiness check to offer before an attempt. */
  readinessHref?: string
  initial: ExamOverview
  /** Renewal mode: the paid renewal exam that extends a certificate. */
  mode?: "final" | "renewal"
  renewal?: { overview: RenewalOverview; rules: CourseRenewal; validityMonths: number }
}

const dateText = (iso: string) => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
const timeLabel = (m: number, standard: number) => (m === 0 ? "No time limit" : `${m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`}${m === standard ? " (standard)" : ` (${m / standard}× time)`}`)
function clock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return `${h ? `${h}:` : ""}${String(m).padStart(h ? 2 : 1, "0")}:${String(sec).padStart(2, "0")}`
}

export function ExamApp(props: Props) {
  const { slug, homeRoute, exam, sectionTitles } = props
  const router = useRouter()
  const [overview, setOverview] = useState(props.initial)
  const [paper, setPaper] = useState<Paper | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [flags, setFlags] = useState<number[]>([])
  const [index, setIndex] = useState(0)
  const [reviewing, setReviewing] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [minutes, setMinutes] = useState(exam.minutes)
  const [understood, setUnderstood] = useState(false)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [saveState, setSaveState] = useState("")
  const [now, setNow] = useState(() => Date.now())
  const [announce, setAnnounce] = useState("")
  const headingRef = useRef<HTMLHeadingElement>(null)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const confirmRef = useRef<HTMLDialogElement>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warned = useRef<Set<number>>(new Set())
  const submitting = useRef(false)
  const api = `/api/courses/${slug}/exam`
  const renewalMode = props.mode === "renewal" && props.renewal
  const [renewalOverview, setRenewalOverview] = useState(props.renewal?.overview)
  const restartRef = useRef<HTMLDialogElement>(null)

  const loadPaper = useCallback(async (id: string) => {
    setBusy(true); setError("")
    const res = await fetch(`${api}?attempt=${encodeURIComponent(id)}`, { cache: "no-store" })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) { setError(data.error || "The exam could not be loaded."); return }
    setPaper(data); setAnswers(data.answers ?? {}); setIndex(0); setReviewing(false)
    requestAnimationFrame(() => headingRef.current?.focus())
  }, [api])

  async function start(e: React.FormEvent) {
    e.preventDefault()
    if (!understood) { setError("Confirm that you understand the attempt rules before you start."); return }
    setBusy(true); setError("")
    const res = await fetch(api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "start", minutes, ...(renewalMode ? { mode: "renewal" } : {}) }) })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) { setError(data.error || "The exam could not be started."); return }
    await loadPaper(data.id)
  }

  const save = useCallback((next: Record<string, number>) => {
    if (!paper) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaveState("Saving…")
    saveTimer.current = setTimeout(async () => {
      const res = await fetch(api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save", attemptId: paper.id, answers: next }) }).catch(() => null)
      setSaveState(res?.ok ? "All answers saved" : "Not saved yet. Check your connection; your answers will be sent when you submit.")
    }, 600)
  }, [api, paper])

  const submit = useCallback(async (reason: "submitted" | "time") => {
    if (!paper || submitting.current) return
    submitting.current = true
    confirmRef.current?.close()
    setBusy(true); setError("")
    if (saveTimer.current) clearTimeout(saveTimer.current)
    const res = await fetch(api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "submit", attemptId: paper.id, answers }) }).catch(() => null)
    const data = res ? await res.json().catch(() => ({})) : {}
    setBusy(false)
    submitting.current = false
    if (!res?.ok) { setError(data.error || "Your exam could not be submitted. Your answers are saved; try again."); return }
    setResult({ ...data, endReason: reason === "time" ? "time_expired" : data.endReason })
    setPaper(null)
    const fresh = await fetch(renewalMode ? `${api}?mode=renewal` : api, { cache: "no-store" }).then((r) => r.json()).catch(() => null)
    if (fresh) { if (renewalMode) setRenewalOverview(fresh); else setOverview(fresh) }
    // The course outline is refreshed when the learner leaves the results, so they are never lost.
    requestAnimationFrame(() => resultRef.current?.focus())
  }, [answers, api, paper, renewalMode])

  // Timer: updates the visible clock every second, announces only at set points, submits at zero.
  useEffect(() => {
    if (!paper?.timed) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [paper])
  useEffect(() => {
    if (!paper?.timed) return
    const left = new Date(paper.expiresAt).getTime() - now
    for (const mins of [10, 5, 1]) {
      if (left <= mins * 60_000 && left > (mins * 60_000) - 5000 && !warned.current.has(mins)) { warned.current.add(mins); setAnnounce(`${mins} ${mins === 1 ? "minute" : "minutes"} left.`) }
    }
    if (left <= 0) submit("time")
  }, [now, paper, submit])

  useEffect(() => { if (paper || result) requestAnimationFrame(() => headingRef.current?.focus()) }, [index, reviewing, paper, result])

  // ── Results ──
  if (result && result.kind === "renewal" && props.renewal) {
    const left = renewalOverview?.attemptsLeft ?? 0
    return (
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">Renewal exam result</p>
          <h1 ref={resultRef} tabIndex={-1} className="mt-2 flex items-center gap-3 text-3xl font-bold tracking-tight text-slate-900 focus-visible:outline-none dark:text-white">
            {result.passed ? <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-emerald-700 dark:text-emerald-400" /> : <XCircle aria-hidden="true" className="h-8 w-8 text-red-700 dark:text-red-400" />}
            {result.passed ? "Your certificate is renewed" : "You did not pass this time"}
          </h1>
          <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">You scored <strong>{result.percent}%</strong> ({result.correct} of {result.total} correct). The pass mark is {props.renewal.rules.passPercent}%.{result.endReason === "time_expired" ? " Time ran out, so your saved answers were marked." : ""}</p>
          {result.passed && result.renewedUntil ? <p className="mt-2 text-lg text-slate-700 dark:text-slate-300">Your certificate is now valid until <strong>{dateText(result.renewedUntil)}</strong>, with the same credential ID.</p> : null}
        </div>
        {result.passed ? (
          <Link href={`${homeRoute}/certificate`} className={primary}><Award aria-hidden="true" className="h-4 w-4" />Go to your certificate</Link>
        ) : (
          <p className="text-slate-700 dark:text-slate-300">{left ? `You have ${left} renewal ${left === 1 ? "attempt" : "attempts"} left.` : "You have used the attempts in this renewal. You can buy another renewal from your certificate page while the renewal window is open."}</p>
        )}
        <SectionTable sections={result.sections} titles={sectionTitles} caption="Your score by topic" />
        <p className="text-sm text-slate-600 dark:text-slate-400">To keep the exam fair for everyone, individual questions and answers are not shown after the exam.</p>
        {!result.passed ? <Link href={`${homeRoute}/certificate`} className={btn}><ArrowLeft aria-hidden="true" className="h-4 w-4" />Back to your certificate</Link> : null}
      </div>
    )
  }

  if (result) {
    const left = overview.attemptsLeft
    return (
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">Final exam result</p>
          <h1 ref={resultRef} tabIndex={-1} className="mt-2 flex items-center gap-3 text-3xl font-bold tracking-tight text-slate-900 focus-visible:outline-none dark:text-white">
            {result.passed ? <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-emerald-700 dark:text-emerald-400" /> : <XCircle aria-hidden="true" className="h-8 w-8 text-red-700 dark:text-red-400" />}
            {result.passed ? "You passed the final exam" : "You did not pass this time"}
          </h1>
          <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">You scored <strong>{result.percent}%</strong> ({result.correct} of {result.total} correct). The pass mark is {exam.passPercent}%.{result.endReason === "time_expired" ? " Time ran out, so your saved answers were marked." : ""}</p>
        </div>
        {result.passed ? (
          <Link href={`${homeRoute}/certificate`} className={primary}><Award aria-hidden="true" className="h-4 w-4" />Claim your certificate</Link>
        ) : result.roundFailed ? (
          <div role="note" className="rounded-xl border-2 border-amber-600 bg-amber-50 p-5 text-amber-950 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-100">
            <p className="font-bold">You have used all {overview.attemptsAllowed} attempts for this round.</p>
            <p className="mt-2">Your lesson and activity completion has been reset so you can work through the course again. Your notes, bookmarks and written explanations are kept. {overview.cooldownUntil ? `You can take the exam again from ${dateText(overview.cooldownUntil)}, once the course is complete.` : ""} There is no extra charge.</p>
          </div>
        ) : (
          <p className="text-slate-700 dark:text-slate-300">You have <strong>{left} {left === 1 ? "attempt" : "attempts"}</strong> left in this round. Revisit the topics with the lowest scores before trying again; each attempt draws new questions.</p>
        )}
        <SectionTable sections={result.sections} titles={sectionTitles} caption="Your score by topic" />
        <p className="text-sm text-slate-600 dark:text-slate-400">To keep the exam fair for everyone, individual questions and answers are not shown after the exam.</p>
        {!result.passed ? <button type="button" className={btn} onClick={() => { setResult(null); router.refresh() }}><ArrowLeft aria-hidden="true" className="h-4 w-4" />Back to the exam overview</button> : null}
      </div>
    )
  }

  // ── Runner ──
  if (paper) {
    const q = paper.questions[index]
    const total = paper.questions.length
    const answered = Object.keys(answers).length
    const left = paper.timed ? new Date(paper.expiresAt).getTime() - now : null
    const choose = (i: number) => { const next = { ...answers, [String(index)]: i }; setAnswers(next); save(next) }
    const flagged = flags.includes(index)
    const unanswered = paper.questions.filter((_, i) => answers[String(i)] === undefined).map((x) => x.n)
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="sticky top-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
          <p className="font-semibold text-slate-900 dark:text-white">{paper.kind === "renewal" ? "Renewal exam" : "Final exam"} · attempt {paper.attemptNo}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span>{answered} of {total} answered</span>
            {left !== null ? <span className={cn("inline-flex items-center gap-1.5 font-semibold tabular-nums", left < 5 * 60_000 && "text-red-800 dark:text-red-300")}><Clock aria-hidden="true" className="h-4 w-4" /><span className="sr-only">Time left: </span>{clock(left)}</span> : <span className="inline-flex items-center gap-1.5"><Clock aria-hidden="true" className="h-4 w-4" />No time limit</span>}
            <span className="text-slate-600 dark:text-slate-400">{saveState}</span>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">{announce}</p>
        {error ? <p role="alert" className="font-medium text-red-800 dark:text-red-300">{error}</p> : null}

        {reviewing ? (
          <section aria-labelledby="exam-review" className="space-y-5">
            <h1 id="exam-review" ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-slate-900 focus-visible:outline-none dark:text-white">Review before you submit</h1>
            <p>{unanswered.length ? `${unanswered.length} ${unanswered.length === 1 ? "question is" : "questions are"} unanswered: ${unanswered.join(", ")}. Unanswered questions count as wrong.` : "Every question has an answer."} {flags.length ? `You flagged ${flags.length} for review.` : ""}</p>
            <QuestionMap total={total} answers={answers} flags={flags} current={-1} onPick={(i) => { setReviewing(false); setIndex(i) }} />
            <div className="flex flex-wrap gap-3">
              <button type="button" className={btn} onClick={() => setReviewing(false)}><ArrowLeft aria-hidden="true" className="h-4 w-4" />Back to the questions</button>
              <button type="button" className={primary} disabled={busy} onClick={() => confirmRef.current?.showModal()}>Submit exam</button>
            </div>
          </section>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (index < total - 1) setIndex(index + 1); else setReviewing(true) }} className="max-w-3xl space-y-6">
            <fieldset>
              <legend className="w-full">
                <h1 ref={headingRef} tabIndex={-1} className="text-sm font-semibold uppercase tracking-wider text-blue-700 focus-visible:outline-none dark:text-blue-300">Question {q.n} of {total}{flagged ? " (flagged)" : ""}</h1>
                <span className="mt-3 block text-xl font-semibold leading-relaxed text-slate-900 dark:text-white">{q.stem}</span>
              </legend>
              {q.code ? <pre tabIndex={0} role="region" aria-label={`Code for question ${q.n}`} className={cn("mt-4 overflow-x-auto rounded-lg border border-slate-300 bg-slate-50 p-4 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100", ring)}><code>{q.code}</code></pre> : null}
              <div className="mt-5 space-y-3">
                {q.options.map((o, i) => (
                  <label key={i} className={cn("flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border-2 p-4 text-base leading-relaxed", answers[String(index)] === i ? "border-blue-700 bg-blue-50 dark:border-blue-400 dark:bg-blue-950" : "border-slate-300 hover:border-slate-500 dark:border-slate-700")}>
                    <input type="radio" name={`q-${index}`} checked={answers[String(index)] === i} onChange={() => choose(i)} className="mt-1 h-5 w-5 shrink-0 accent-blue-700" />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className={btn} disabled={index === 0} onClick={() => setIndex(index - 1)}><ArrowLeft aria-hidden="true" className="h-4 w-4" />Previous</button>
              <button type="submit" className={primary}>{index < total - 1 ? <>Next<ArrowRight aria-hidden="true" className="h-4 w-4" /></> : <>Review answers<ListChecks aria-hidden="true" className="h-4 w-4" /></>}</button>
              <button type="button" aria-pressed={flagged} className={cn(btn, flagged && "border-amber-700 bg-amber-50 text-amber-950 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-100")} onClick={() => setFlags(flagged ? flags.filter((f) => f !== index) : [...flags, index])}><Flag aria-hidden="true" className="h-4 w-4" />Flag for review</button>
              <button type="button" className={btn} onClick={() => setReviewing(true)}><ListChecks aria-hidden="true" className="h-4 w-4" />Review and submit</button>
            </div>
            <details className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <summary className={cn("cursor-pointer rounded font-semibold", ring)}>Go to a question</summary>
              <div className="mt-4"><QuestionMap total={total} answers={answers} flags={flags} current={index} onPick={setIndex} /></div>
            </details>
          </form>
        )}

        <dialog ref={confirmRef} aria-labelledby="exam-confirm-title" className="w-[min(32rem,calc(100vw-2rem))] rounded-xl border border-slate-300 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-950/50 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
          <h2 id="exam-confirm-title" className="text-xl font-bold">Submit your exam?</h2>
          <p className="mt-2">{unanswered.length ? `${unanswered.length} unanswered ${unanswered.length === 1 ? "question counts" : "questions count"} as wrong. ` : ""}You cannot change your answers after you submit.</p>
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <button type="button" className={btn} onClick={() => confirmRef.current?.close()}>Keep working</button>
            <button type="button" className={primary} disabled={busy} onClick={() => submit("submitted")}>{busy ? "Submitting…" : "Submit exam"}</button>
          </div>
        </dialog>
      </div>
    )
  }

  // ── Overview: renewal exam ──
  if (renewalMode && renewalOverview && props.renewal) {
    const rules = props.renewal.rules
    const ro = renewalOverview
    const years = props.renewal.validityMonths / 12
    const canStart = ro.window?.phase === "open" && ro.attemptsLeft > 0 && !ro.open
    return (
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">Certificate renewal</p>
          <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-3xl font-bold tracking-tight text-slate-900 focus-visible:outline-none dark:text-white">Renewal exam</h1>
          <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">Pass to extend your certificate by {years} years{ro.certificate ? `; it is ${ro.certificate.state === "expired" ? "expired since" : "valid until"} ${dateText(ro.certificate.expiresAt)}` : ""}.</p>
        </div>
        <section aria-labelledby="renewal-rules" className="max-w-3xl rounded-xl border border-slate-200 p-5 dark:border-slate-800 sm:p-6">
          <h2 id="renewal-rules" className="text-lg font-bold text-slate-900 dark:text-white">How the renewal exam works</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-300">
            <li>{rules.questions} questions covering every topic, drawn at random from the current edition of the course. You need {rules.passPercent}% to pass.</li>
            <li>Standard time is {rules.minutes} minutes. Time and a half, double time and no time limit are available and do not affect your result.</li>
            <li>A renewal includes {rules.attemptsPerPurchase} attempts. Starting an attempt uses it, even if you leave without submitting.</li>
            <li>Passing extends your certificate by {years} years from its current expiry date, or from the day you pass if it has already expired. The credential ID stays the same.</li>
            <li>You will see your score for each topic, but not the individual answers.</li>
          </ul>
        </section>
        {error ? <p role="alert" className="font-medium text-red-800 dark:text-red-300">{error}</p> : null}
        {ro.open ? (
          <div className="rounded-xl border-2 border-blue-700 bg-blue-50 p-5 dark:border-blue-400 dark:bg-blue-950">
            <p className="font-semibold text-blue-950 dark:text-blue-100">You have a renewal attempt in progress: {ro.open.answered} of {ro.open.total} answered.</p>
            <button type="button" className={cn(primary, "mt-4")} disabled={busy} onClick={() => loadPaper(ro.open!.id)}>Resume the renewal exam</button>
          </div>
        ) : canStart ? (
          <form onSubmit={start} noValidate className="max-w-3xl space-y-5 rounded-xl border border-slate-200 p-5 dark:border-slate-800 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Start a renewal attempt ({ro.attemptsLeft} left)</h2>
            <fieldset>
              <legend className="font-semibold text-slate-900 dark:text-white">Time</legend>
              <div className="mt-2 space-y-1">
                {props.timeOptions.map((m) => <label key={m} className="flex min-h-11 cursor-pointer items-center gap-3"><input type="radio" name="minutes" checked={minutes === m} onChange={() => setMinutes(m)} className="h-5 w-5 accent-blue-700" />{timeLabel(m, rules.minutes)}</label>)}
              </div>
            </fieldset>
            <label className="flex cursor-pointer items-start gap-3"><input type="checkbox" checked={understood} onChange={(e) => setUnderstood(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-blue-700" /><span>I understand that starting uses one of my {ro.attemptsLeft} renewal {ro.attemptsLeft === 1 ? "attempt" : "attempts"}.</span></label>
            <button type="submit" className={primary} disabled={busy}>{busy ? "Preparing your exam…" : "Start the renewal exam"}</button>
          </form>
        ) : (
          <div className="rounded-xl border border-slate-300 p-5 dark:border-slate-700">
            <p className="text-slate-800 dark:text-slate-200">{!ro.certificate ? "You need a certificate before you can renew it." : ro.window?.phase === "early" ? `Renewal opens on ${dateText(ro.window.opensAt)}.` : ro.window?.phase === "closed" ? "The renewal window has closed. Complete the course and the final exam again to hold a current certificate." : "Buy a renewal on your certificate page to take the renewal exam."}</p>
            <Link href={`${homeRoute}/certificate`} className={cn(btn, "mt-4")}>Go to your certificate</Link>
          </div>
        )}
      </div>
    )
  }

  // ── Overview ──
  const cooldown = overview.cooldownUntil && new Date(overview.cooldownUntil).getTime() > Date.now() ? overview.cooldownUntil : null
  const newRound = !cooldown && overview.attemptsLeft === 0
  const attemptsShown = newRound ? exam.attemptsPerRound : overview.attemptsLeft
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">Final exam</p>
        <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-3xl font-bold tracking-tight text-slate-900 focus-visible:outline-none dark:text-white">{overview.passedAt ? "You passed the final exam" : "Final exam"}</h1>
        <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">Pass the final exam to earn your certificate. It checks that you can apply what the course teaches to real design decisions.</p>
      </div>

      <section aria-labelledby="exam-rules" className="max-w-3xl rounded-xl border border-slate-200 p-5 dark:border-slate-800 sm:p-6">
        <h2 id="exam-rules" className="text-lg font-bold text-slate-900 dark:text-white">How the exam works</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-300">
          <li>{props.questionCount} questions drawn at random for every attempt, with every topic covered. Most are design scenarios; some ask you to work out a value.</li>
          <li>You need {exam.passPercent}% to pass. Each question has one best answer.</li>
          <li>Standard time is {exam.minutes} minutes. You can choose time and a half, double time or no time limit; the choice does not affect your result.</li>
          <li>Answers save as you go. If you are disconnected, come back and resume. If time runs out, your saved answers are marked.</li>
          <li>You have {exam.attemptsPerRound} attempts. Starting an attempt uses it, even if you leave without submitting.</li>
          <li>If all {exam.attemptsPerRound} attempts are used without a pass, your lesson and activity completion resets, you work through the course again, and you can retake the exam after {exam.cooldownDays} days. Your notes and written work are kept, and there is no extra charge.</li>
          <li>To keep the exam fair, you will see your score for each topic but not the individual answers.</li>
        </ul>
      </section>

      {props.readinessHref && !overview.passedAt && !overview.open ? (
        <section aria-labelledby="readiness-offer" className="max-w-3xl rounded-xl border border-blue-200 border-l-4 border-l-blue-700 bg-blue-50/60 p-5 dark:border-blue-900 dark:border-l-blue-400 dark:bg-blue-950/30 sm:p-6">
          <h2 id="readiness-offer" className="text-lg font-bold text-slate-900 dark:text-white">Not sure you are ready?</h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">Take the readiness check first: one question from every topic, with the answer and reasoning for each. It is optional and does not use an attempt.</p>
          <Link href={props.readinessHref} className={cn(btn, "mt-4")}>Take the readiness check</Link>
        </section>
      ) : null}

      {error ? <p role="alert" className="font-medium text-red-800 dark:text-red-300">{error}</p> : null}

      {overview.canRestart ? (
        <div className="rounded-xl border-2 border-amber-600 bg-amber-50 p-5 text-amber-950 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-100">
          <p className="font-semibold">Your certificate has expired and its renewal window has closed.</p>
          <p className="mt-2">To hold a current certificate again, start the course again: your lesson and activity completion resets, then you take the final exam. Your notes and written work are kept, and there is no extra charge.</p>
          <button type="button" className={cn(primary, "mt-4")} onClick={() => restartRef.current?.showModal()}>Start the course again</button>
          <dialog ref={restartRef} aria-labelledby="restart-title" className="w-[min(32rem,calc(100vw-2rem))] rounded-xl border border-slate-300 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-950/50 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
            <h2 id="restart-title" className="text-xl font-bold">Start the course again?</h2>
            <p className="mt-2">Your lessons and activities will be marked as not done. Your notes, bookmarks and written explanations stay.</p>
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button type="button" className={btn} onClick={() => restartRef.current?.close()}>Cancel</button>
              <button type="button" className={primary} disabled={busy} onClick={async () => { setBusy(true); const res = await fetch(api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "restart" }) }); setBusy(false); restartRef.current?.close(); if (res.ok) { window.location.assign(homeRoute) } else { const d = await res.json().catch(() => ({})); setError(d.error || "That did not work. Try again.") } }}>Start again</button>
            </div>
          </dialog>
        </div>
      ) : overview.passedAt ? (
        <div className="rounded-xl border-2 border-emerald-700 bg-emerald-50 p-5 dark:border-emerald-400 dark:bg-emerald-950">
          <p className="font-semibold text-emerald-950 dark:text-emerald-100">Passed on {dateText(overview.passedAt)}.</p>
          <Link href={`${homeRoute}/certificate`} className={cn(primary, "mt-4")}><Award aria-hidden="true" className="h-4 w-4" />Go to your certificate</Link>
        </div>
      ) : overview.open ? (
        <div className="rounded-xl border-2 border-blue-700 bg-blue-50 p-5 dark:border-blue-400 dark:bg-blue-950">
          <p className="font-semibold text-blue-950 dark:text-blue-100">You have an attempt in progress: {overview.open.answered} of {overview.open.total} answered.{overview.open.timed ? ` It ends at ${new Date(overview.open.expiresAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}.` : ""}</p>
          <button type="button" className={cn(primary, "mt-4")} disabled={busy} onClick={() => loadPaper(overview.open!.id)}>Resume the exam</button>
        </div>
      ) : cooldown ? (
        <div role="note" className="rounded-xl border-2 border-amber-600 bg-amber-50 p-5 text-amber-950 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-100">
          <p className="font-semibold">You can take the exam again from {dateText(cooldown)}.</p>
          <p className="mt-2">Before then, work through the lessons and activities again{props.courseComplete ? " (done)" : `: ${props.remaining.lessons} lessons and ${props.remaining.activities} activities are left`}.</p>
        </div>
      ) : !props.courseComplete ? (
        <div className="rounded-xl border border-slate-300 p-5 dark:border-slate-700">
          <p className="flex items-start gap-2 font-semibold text-slate-900 dark:text-white"><AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />The exam opens when you have completed every lesson and design activity.</p>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{props.remaining.lessons} lessons and {props.remaining.activities} activities are left. <Link href={`${homeRoute}/certificate`} className="font-semibold text-blue-800 underline underline-offset-2 dark:text-blue-300">See what is left</Link>.</p>
        </div>
      ) : (
        <form onSubmit={start} noValidate className="max-w-3xl space-y-5 rounded-xl border border-slate-200 p-5 dark:border-slate-800 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Start attempt {newRound ? 1 : overview.attemptsUsed + 1} of {newRound ? exam.attemptsPerRound : overview.attemptsAllowed}</h2>
          <fieldset>
            <legend className="font-semibold text-slate-900 dark:text-white">Time</legend>
            <div className="mt-2 space-y-1">
              {props.timeOptions.map((m) => (
                <label key={m} className="flex min-h-11 cursor-pointer items-center gap-3"><input type="radio" name="minutes" checked={minutes === m} onChange={() => setMinutes(m)} className="h-5 w-5 accent-blue-700" />{timeLabel(m, exam.minutes)}</label>
              ))}
            </div>
          </fieldset>
          <label className="flex cursor-pointer items-start gap-3"><input type="checkbox" checked={understood} onChange={(e) => setUnderstood(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-blue-700" aria-describedby={error ? "exam-start-error" : undefined} /><span>I understand that starting uses one of my {attemptsShown} remaining {attemptsShown === 1 ? "attempt" : "attempts"}.</span></label>
          {error ? <p id="exam-start-error" className="sr-only">{error}</p> : null}
          <button type="submit" className={primary} disabled={busy}>{busy ? "Preparing your exam…" : "Start the exam"}</button>
        </form>
      )}

      {overview.history.length ? (
        <section aria-labelledby="exam-history">
          <h2 id="exam-history" className="text-lg font-bold text-slate-900 dark:text-white">Your attempts</h2>
          <div role="region" aria-label="Table of your attempts" tabIndex={0} className={cn("mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800", ring)}>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-900"><tr>{["Attempt", "Date", "Score", "Result"].map((h) => <th key={h} scope="col" className="p-3">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {overview.history.map((h) => (
                  <tr key={h.id}>
                    <th scope="row" className="p-3 font-medium">Round {h.round}, attempt {h.attemptNo}</th>
                    <td className="p-3">{h.submittedAt ? dateText(h.submittedAt) : ""}</td>
                    <td className="p-3 tabular-nums">{h.percent ?? 0}%{h.endReason === "time_expired" ? " (time ran out)" : ""}</td>
                    <td className="p-3 font-semibold">{h.passed ? "Passed" : "Not passed"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {overview.history[0]?.sections ? <div className="mt-6"><SectionTable sections={overview.history[0].sections} titles={sectionTitles} caption="Your latest attempt by topic" /></div> : null}
        </section>
      ) : null}
    </div>
  )
}

function QuestionMap({ total, answers, flags, current, onPick }: { total: number; answers: Record<string, number>; flags: number[]; current: number; onPick: (i: number) => void }) {
  return (
    <ol role="list" className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-12" aria-label="Questions">
      {Array.from({ length: total }, (_, i) => {
        const done = answers[String(i)] !== undefined, flag = flags.includes(i)
        return (
          <li key={i}>
            <button type="button" onClick={() => onPick(i)} aria-current={i === current ? "step" : undefined} className={cn("relative flex h-11 w-full items-center justify-center rounded-md border-2 text-sm font-semibold", done ? "border-blue-700 bg-blue-700 text-white dark:border-blue-400 dark:bg-blue-400 dark:text-slate-950" : "border-slate-400 bg-white text-slate-900 dark:bg-slate-900 dark:text-white", i === current && "ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-950", ring)}>
              {i + 1}{flag ? <Flag aria-hidden="true" className="absolute -right-1 -top-1 h-4 w-4 rounded-sm bg-amber-300 p-0.5 text-amber-950" /> : null}
              <span className="sr-only">{done ? ", answered" : ", unanswered"}{flag ? ", flagged" : ""}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

function SectionTable({ sections, titles, caption }: { sections: Record<string, { correct: number; total: number }>; titles: Record<string, string>; caption: string }) {
  const rows = Object.entries(sections).sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true }))
  return (
    <div role="region" aria-label={caption} tabIndex={0} className={cn("overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800", ring)}>
      <table className="w-full text-left text-sm">
        <caption className="p-3 text-left font-semibold text-slate-900 dark:text-white">{caption}</caption>
        <thead className="bg-slate-100 dark:bg-slate-900"><tr><th scope="col" className="p-3">Topic</th><th scope="col" className="p-3">Correct</th></tr></thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {rows.map(([sec, s]) => <tr key={sec}><th scope="row" className="p-3 font-medium">{titles[sec] ?? sec}</th><td className="p-3 tabular-nums">{s.correct} of {s.total}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
