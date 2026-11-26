"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
const field = cn("mt-1 w-full min-h-[44px] rounded-lg border-2 border-slate-400 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white", ring)
const label = "block font-medium text-slate-900 dark:text-white"
const btn = cn("min-h-[44px] rounded-lg border-2 border-slate-400 px-4 py-2 font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800", ring)
const primary = cn("min-h-[44px] rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800", ring)
const day = (d: string | null) => (d ? new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC" : "")

interface Lookup {
  email: string
  exam: { attemptsPerRound: number; passPercent: number }
  status: { round: number; attemptsUsed: number; extraAttempts: number; renewalAttemptsLeft: number; cooldownUntil: string | null; passedAt: string | null; history: Array<{ at: string; by: string; action: string; detail?: string }> } | null
  attempts: Array<{ id: string; kind: string; round: number; attemptNo: number; startedAt: string; submittedAt: string | null; correct: number | null; total: number; passed: boolean | null; endReason: string | null; timeLimitSeconds: number }>
}

/** Support view: a learner's final exam status, with extra attempts and early cooldown release. */
export function AdminExamSupport({ courses }: { courses: Array<{ slug: string; title: string }> }) {
  const [q, setQ] = useState({ email: "", course: courses[0]?.slug ?? "" })
  const [data, setData] = useState<Lookup | null>(null)
  const [reason, setReason] = useState("")
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault()
    setErr(""); setMsg("")
    const res = await fetch(`/api/admin/exams?${new URLSearchParams(q)}`, { cache: "no-store" })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) { setData(null); setErr(body.error || "Lookup failed"); return }
    setData(body)
  }
  async function act(action: "grant-attempt" | "clear-cooldown" | "grant-renewal") {
    setErr(""); setMsg("")
    const res = await fetch("/api/admin/exams", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, email: q.email, courseSlug: q.course, reason }) })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) { setErr(body.error || "That did not work"); return }
    setMsg(action === "grant-attempt" ? "Granted one extra attempt. The learner still needs a complete course to start it." : action === "grant-renewal" ? "Granted a free renewal (3 attempts). It can be used while the renewal window is open." : "Cooldown ended. A new round of attempts starts once the course is complete.")
    setReason("")
    lookup()
  }

  const s = data?.status
  return (
    <section aria-labelledby="exam-support-heading" className="space-y-5 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
      <h2 id="exam-support-heading" className="text-lg font-semibold text-slate-900 dark:text-white">Final exam support</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">Look up a learner to see their attempts. Scores only: individual answers stay private to protect the question bank.</p>
      <form onSubmit={lookup} className="grid gap-4 md:grid-cols-[2fr_1fr_auto] md:items-end">
        <label className={label}>Learner email<input className={field} type="email" required autoComplete="off" value={q.email} onChange={(e) => setQ({ ...q, email: e.target.value })} /></label>
        <label className={label}>Course<select className={field} value={q.course} onChange={(e) => setQ({ ...q, course: e.target.value })}>{courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}</select></label>
        <button type="submit" className={primary}>Look up</button>
      </form>
      <p role="status" className="font-medium text-emerald-800 dark:text-emerald-300">{msg}</p>
      {err ? <p role="alert" className="font-medium text-red-800 dark:text-red-300">{err}</p> : null}
      {data ? (
        <div className="space-y-5">
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Status", s?.passedAt ? `Passed ${day(s.passedAt)}` : s ? "Not passed" : "No attempts yet"],
              ["Round", String(s?.round ?? 1)],
              ["Attempts used", s ? `${s.attemptsUsed} of ${data.exam.attemptsPerRound + s.extraAttempts}` : `0 of ${data.exam.attemptsPerRound}`],
              ["Cooldown until", s?.cooldownUntil ? day(s.cooldownUntil) : "None"],
              ["Renewal attempts left", String(s?.renewalAttemptsLeft ?? 0)],
            ].map(([k, v]) => <div key={k} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800"><dt className="text-sm text-slate-600 dark:text-slate-400">{k}</dt><dd className="font-semibold text-slate-900 dark:text-white">{v}</dd></div>)}
          </dl>
          {data.attempts.length ? (
            <div role="region" aria-labelledby="exam-attempts-cap" tabIndex={0} className={cn("overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800", ring)}>
              <table className="w-full text-left text-sm">
                <caption id="exam-attempts-cap" className="p-3 text-left font-semibold text-slate-900 dark:text-white">Attempts for {data.email}</caption>
                <thead className="bg-slate-100 dark:bg-slate-900"><tr>{["Attempt", "Started", "Ended", "Score", "Result"].map((h) => <th key={h} scope="col" className="p-3">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {data.attempts.map((a) => <tr key={a.id}><th scope="row" className="p-3 font-medium">{a.kind === "renewal" ? `Renewal attempt ${a.attemptNo}` : `Round ${a.round}, attempt ${a.attemptNo}`}{a.timeLimitSeconds ? "" : " (untimed)"}</th><td className="p-3">{day(a.startedAt)}</td><td className="p-3">{a.submittedAt ? `${day(a.submittedAt)}${a.endReason === "time_expired" ? " (time ran out)" : ""}` : "In progress"}</td><td className="p-3">{a.correct === null ? "" : `${a.correct} of ${a.total} (${Math.floor((a.correct / a.total) * 100)}%)`}</td><td className="p-3">{a.passed === null ? "" : a.passed ? "Passed" : "Not passed"}</td></tr>)}
                </tbody>
              </table>
            </div>
          ) : null}
          {data ? (
            <div className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <label className={label}>Reason (kept in the learner&apos;s exam history)<input className={field} value={reason} onChange={(e) => setReason(e.target.value)} /></label>
              <div className="flex flex-wrap gap-3">
                {!s?.passedAt ? <button type="button" className={btn} onClick={() => act("grant-attempt")}>Grant one extra attempt</button> : null}
                {s?.passedAt ? <button type="button" className={btn} onClick={() => act("grant-renewal")}>Grant a free renewal (3 attempts)</button> : null}
                {s?.cooldownUntil ? <button type="button" className={btn} onClick={() => act("clear-cooldown")}>End cooldown now</button> : null}
              </div>
            </div>
          ) : null}
          {s?.history?.length ? (
            <details><summary className={cn("cursor-pointer rounded font-semibold", ring)}>Exam history ({s.history.length})</summary>
              <ol className="mt-3 space-y-2 text-sm">{s.history.map((h, i) => <li key={i} className="rounded border border-slate-200 p-2 dark:border-slate-800"><span className="font-semibold">{h.action}</span> · {day(h.at)} · {h.by}{h.detail ? ` · ${h.detail}` : ""}</li>)}</ol>
            </details>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
