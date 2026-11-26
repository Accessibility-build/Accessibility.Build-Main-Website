"use client"
import { useRef, useState } from "react"
import Link from "next/link"
import { Check, RotateCcw, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ReadinessQuestion {
  id: string
  sec: string
  topic: string
  stem: string
  code?: string
  options: string[]
  answer: number
  exp: string
  lesson?: { href: string; label: string }
}

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-slate-950"
const btn = cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-500 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800", ring)
const primary = cn(btn, "border-blue-700 bg-blue-700 text-white hover:bg-blue-800 dark:border-blue-400 dark:bg-blue-400 dark:text-slate-950 dark:hover:bg-blue-300")
const link = cn("rounded font-semibold text-blue-700 underline underline-offset-2 hover:decoration-2 dark:text-blue-300", ring)

/**
 * An optional rehearsal before the final exam: one question from every topic, with feedback.
 * Nothing is saved and it never uses an exam attempt. Its questions are kept out of the exam bank.
 */
export function ReadinessCheck({ questions, passPercent, examHref, retryHref }: { questions: ReadinessQuestion[]; passPercent: number; examHref: string; retryHref: string }) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [checked, setChecked] = useState(false)
  const [missing, setMissing] = useState<number[]>([])
  const summary = useRef<HTMLDivElement>(null)
  const result = useRef<HTMLHeadingElement>(null)

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const unanswered = questions.flatMap((q, i) => (answers[q.id] === undefined ? [i] : []))
    setMissing(unanswered)
    if (unanswered.length) { requestAnimationFrame(() => summary.current?.focus()); return }
    setChecked(true)
    requestAnimationFrame(() => result.current?.focus())
  }

  const correct = questions.filter((q) => answers[q.id] === q.answer)
  const wrong = questions.filter((q) => checked && answers[q.id] !== q.answer)
  const percent = questions.length ? Math.floor((correct.length / questions.length) * 100) : 0
  const ready = percent >= passPercent

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      {missing.length && !checked ? (
        <div ref={summary} tabIndex={-1} role="alert" className="max-w-3xl rounded-xl border-2 border-red-700 bg-red-50 p-5 text-red-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 dark:border-red-400 dark:bg-red-950 dark:text-red-100">
          <p className="font-semibold">{missing.length === 1 ? "1 question has no answer yet." : `${missing.length} questions have no answer yet.`}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            {missing.map((i) => <li key={i}><a href={`#rq-${i + 1}`} className="font-semibold underline underline-offset-2">Question {i + 1}: {questions[i].topic}</a></li>)}
          </ul>
        </div>
      ) : null}

      {checked ? (
        <section aria-labelledby="readiness-result" className={cn("max-w-3xl rounded-xl border-2 p-5 sm:p-6", ready ? "border-emerald-700 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950" : "border-amber-600 bg-amber-50 dark:border-amber-500 dark:bg-amber-950")}>
          <h2 id="readiness-result" ref={result} tabIndex={-1} className="text-xl font-bold text-slate-950 focus-visible:outline-none dark:text-white">You answered {correct.length} of {questions.length} correctly ({percent}%)</h2>
          <p className="mt-2 text-slate-900 dark:text-slate-100">
            {ready
              ? `That is at or above the exam's pass mark of ${passPercent}%. The exam is longer and every question in it is new, so look again at any topic you missed before you start.`
              : `That is below the exam's pass mark of ${passPercent}%. Go back to the topics below before you use an exam attempt.`}
          </p>
          {wrong.length ? (
            <>
              <h3 className="mt-4 font-semibold text-slate-950 dark:text-white">Topics to revisit</h3>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-900 dark:text-slate-100">
                {wrong.map((q) => <li key={q.id}>{q.topic}{q.lesson ? <>: <Link href={q.lesson.href} className={link}>{q.lesson.label}</Link></> : null}</li>)}
              </ul>
            </>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={examHref} className={primary}>Go to the final exam</Link>
            {/* A full page load draws a fresh set of questions. */}
            <a href={retryHref} className={btn}><RotateCcw aria-hidden="true" focusable="false" className="h-4 w-4" />Try a different set</a>
          </div>
        </section>
      ) : null}

      <ol role="list" className="max-w-3xl space-y-5">
        {questions.map((q, i) => {
          const chosen = answers[q.id]
          const right = chosen === q.answer
          return (
            <li key={q.id} id={`rq-${i + 1}`} tabIndex={-1} className="scroll-mt-4 rounded-xl border border-slate-200 bg-white p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-950">
              <fieldset>
                <legend className="font-semibold leading-relaxed text-slate-950 dark:text-white">
                  <span className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Question {i + 1} of {questions.length} · {q.topic}</span>
                  {q.stem}
                </legend>
                {q.code ? <pre tabIndex={0} aria-label={`Code for question ${i + 1}`} className={cn("my-3 overflow-auto rounded bg-slate-100 p-3 text-sm dark:bg-slate-900", ring)}><code>{q.code}</code></pre> : null}
                <div className="mt-4 space-y-2">
                  {q.options.map((option, j) => (
                    <label key={j} className={cn("flex min-h-11 items-start gap-3 rounded-lg border p-3 text-sm leading-relaxed", checked ? "cursor-default" : "cursor-pointer", chosen === j ? "border-blue-700 bg-blue-50 text-slate-950 dark:border-blue-400 dark:bg-blue-950 dark:text-white" : "border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300", !checked && chosen !== j && "hover:bg-slate-50 dark:hover:bg-slate-900")}>
                      <input type="radio" name={`rq-${q.id}`} value={j} disabled={checked} checked={chosen === j} onChange={() => setAnswers((a) => ({ ...a, [q.id]: j }))} className="mt-1 h-4 w-4 shrink-0 accent-blue-700 dark:accent-blue-400 dark:[color-scheme:dark]" />
                      <span>{option}{checked && j === q.answer ? <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"><Check aria-hidden="true" focusable="false" className="h-3 w-3" />Best answer</span> : null}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {checked ? (
                <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 leading-relaxed dark:border-slate-800">
                  <p className={cn("flex items-center gap-2 font-semibold", right ? "text-emerald-700 dark:text-emerald-300" : "text-red-800 dark:text-red-300")}>{right ? <Check aria-hidden="true" focusable="false" className="h-4 w-4 shrink-0" /> : <X aria-hidden="true" focusable="false" className="h-4 w-4 shrink-0" />}{right ? "Correct" : "Not the best answer"}</p>
                  <p>{q.exp}</p>
                  {!right && q.lesson ? <p className="text-sm">Revisit: <Link href={q.lesson.href} className={link}>{q.lesson.label}</Link></p> : null}
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>

      {!checked ? (
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={primary}>Check my answers</button>
          <span className="text-sm text-slate-600 dark:text-slate-400">Nothing here is saved or scored for your certificate.</span>
        </div>
      ) : null}
    </form>
  )
}
