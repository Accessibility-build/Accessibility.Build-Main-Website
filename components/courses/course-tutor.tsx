"use client"
import { useEffect, useRef, useState } from "react"
import { ChevronRight, Lightbulb, MessageCircle, Send, Square } from "lucide-react"
import { studyButton } from "./study-save-status"
import { cn } from "@/lib/utils"

export function CourseTutor({ slug, chapterKey }: { slug: string; chapterKey: string }) {
  return <TutorSession key={`${slug}:${chapterKey}`} slug={slug} chapterKey={chapterKey} />
}

function TutorSession({ slug, chapterKey }: { slug: string; chapterKey: string }) {
  const [question, setQuestion] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<{ answer: string; edition: string; sources: Array<{ id: number; title: string; href: string }> } | null>(null)
  const abort = useRef<AbortController | null>(null)
  const answer = useRef<HTMLDivElement>(null)
  useEffect(() => () => abort.current?.abort(), [])
  async function ask(event: React.FormEvent) {
    event.preventDefault(); setError(""); setBusy(true); setResult(null)
    const controller = new AbortController(); abort.current = controller
    try {
      const response = await fetch(`/api/courses/${slug}/tutor`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chapterKey, question }), signal: controller.signal })
      const value = await response.json()
      if (controller.signal.aborted || abort.current !== controller) return
      if (!response.ok) throw new Error(value.error || value.message || "Study help is unavailable.")
      setResult(value); requestAnimationFrame(() => { if (!controller.signal.aborted && abort.current === controller) answer.current?.focus() })
    } catch (e) { if (!controller.signal.aborted && abort.current === controller) setError(e instanceof Error ? e.message : "Study help is unavailable.") }
    finally { if (!controller.signal.aborted && abort.current === controller) setBusy(false) }
  }
  return <details className="group/tutor mt-8 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-900/50">
    <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2.5 rounded-lg text-lg font-semibold tracking-tight text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 [&::-webkit-details-marker]:hidden dark:text-white"><MessageCircle aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" /><span className="flex-1">Ask for a hint about this lesson</span><ChevronRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0 text-slate-500 group-open/tutor:rotate-90 dark:text-slate-400" /></summary>
    <p id="coach-help" className="mt-3 text-sm text-slate-600 dark:text-slate-400">The AI study coach uses excerpts from this lesson and links to them. Check its explanation against the sources. Your question and relevant lesson excerpts are sent to our AI provider; personal notes and mock answer banks are not included.</p>
    <form onSubmit={ask} className="mt-5"><label htmlFor="coach-question" className="font-semibold text-slate-950 dark:text-white">What distinction or concept would you like help with?</label><textarea id="coach-question" aria-describedby="coach-help" required minLength={5} maxLength={1000} rows={3} value={question} onChange={(e) => setQuestion(e.target.value)} className="mt-3 w-full rounded-lg border border-slate-500 bg-white p-3 leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 dark:border-slate-500 dark:bg-slate-950" /><div className="mt-3 flex flex-wrap gap-2"><button className={cn(studyButton, "gap-2 bg-white dark:bg-slate-950")} disabled={busy} type="submit"><Send aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" />{busy ? "Preparing guidance…" : "Get a hint and explanation"}</button>{busy ? <button className={cn(studyButton, "gap-2 bg-white dark:bg-slate-950")} type="button" onClick={() => { abort.current?.abort(); setBusy(false) }}><Square aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" />Stop</button> : null}</div></form>
    <p role="status" className="mt-2 text-sm">{busy ? "Looking for guidance in this lesson." : ""}</p>
    {error ? <p role="alert" className="mt-3 text-sm text-red-800 dark:text-red-200">{error}</p> : null}
    {result ? <div ref={answer} tabIndex={-1} className="mt-4 rounded-xl border border-slate-200 bg-white p-4 focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 dark:border-slate-800 dark:bg-slate-950"><h3 className="flex items-center gap-2 font-semibold text-slate-950 dark:text-white"><Lightbulb aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" />Study guidance · edition {result.edition}</h3><p className="mt-3 whitespace-pre-wrap leading-relaxed">{result.answer}</p><ul className="mt-4 space-y-2 border-t border-slate-200 pt-3 dark:border-slate-800">{result.sources.map((source) => <li key={source.id}><a href={source.href} className={cn("rounded text-sm font-medium text-blue-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 dark:text-blue-300")}>[{source.id}] {source.title}</a></li>)}</ul></div> : null}
  </details>
}
