"use client"
import { useEffect, useRef, useState } from "react"
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
  return <details className="mt-8 rounded-xl border border-slate-300 p-5 dark:border-slate-700">
    <summary className="cursor-pointer rounded text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">Ask for a hint about this lesson</summary>
    <p id="coach-help" className="mt-3 text-sm text-slate-600 dark:text-slate-400">The AI study coach uses excerpts from this lesson and links to them. Check its explanation against the sources. Your question and relevant lesson excerpts are sent to our AI provider; personal notes and mock answer banks are not included.</p>
    <form onSubmit={ask} className="mt-4"><label htmlFor="coach-question" className="font-medium">What distinction or concept would you like help with?</label><textarea id="coach-question" aria-describedby="coach-help" required minLength={5} maxLength={1000} rows={3} value={question} onChange={(e) => setQuestion(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-400 bg-white p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-slate-950" /><div className="mt-2 flex gap-2"><button className={studyButton} disabled={busy} type="submit">{busy ? "Preparing guidance…" : "Get a hint and explanation"}</button>{busy ? <button className={studyButton} type="button" onClick={() => { abort.current?.abort(); setBusy(false) }}>Stop</button> : null}</div></form>
    <p role="status" className="mt-2 text-sm">{busy ? "Looking for guidance in this lesson." : ""}</p>
    {error ? <p role="alert" className="mt-3 text-sm text-red-800 dark:text-red-200">{error}</p> : null}
    {result ? <div ref={answer} tabIndex={-1} className="mt-4 rounded border-t border-slate-300 pt-4 focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700"><h3 className="font-semibold">Study guidance · edition {result.edition}</h3><p className="mt-2 whitespace-pre-wrap">{result.answer}</p><ul className="mt-3 space-y-2">{result.sources.map((source) => <li key={source.id}><a href={source.href} className={cn("rounded text-sm font-medium text-blue-800 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300")}>[{source.id}] {source.title}</a></li>)}</ul></div> : null}
  </details>
}
