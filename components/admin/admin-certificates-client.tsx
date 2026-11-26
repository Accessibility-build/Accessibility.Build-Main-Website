"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { AdminExamSupport } from "@/components/admin/admin-exam-support"

interface HistoryEntry { at: string; by: string; action: string; detail?: string }
interface Certificate {
  id: string
  code: string
  courseSlug: string
  recipientName: string
  recipientEmail: string
  edition: string
  source: string
  issuedAt: string
  expiresAt: string | null
  renewalCount: number
  revokedAt: string | null
  revokedReason: string | null
  history: HistoryEntry[]
}
type Action = { kind: "rename" | "revoke" | "reinstate" | "history"; cert: Certificate }

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
const field = cn("mt-1 w-full min-h-[44px] rounded-lg border-2 border-slate-400 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white", ring)
const label = "block font-medium text-slate-900 dark:text-white"
const btn = cn("min-h-[44px] rounded-lg border-2 border-slate-400 px-3 py-1.5 font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800", ring)
const primary = cn("min-h-[44px] rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800", ring)
const danger = cn("min-h-[44px] rounded-lg bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800", ring)
const day = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })

export function AdminCertificatesClient() {
  const [rows, setRows] = useState<Certificate[]>([])
  const [courses, setCourses] = useState<Array<{ slug: string; title: string }>>([])
  const [filters, setFilters] = useState({ q: "", course: "", status: "" })
  const [form, setForm] = useState({ courseSlug: "", email: "", name: "", note: "" })
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")
  const [action, setAction] = useState<Action | null>(null)
  const [actionName, setActionName] = useState("")
  const [actionReason, setActionReason] = useState("")
  const [actionErr, setActionErr] = useState("")
  const dialogRef = useRef<HTMLDialogElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  const load = useCallback(async (f = filters) => {
    setLoading(true)
    const res = await fetch(`/api/admin/certificates?${new URLSearchParams(f)}`, { cache: "no-store" })
    const data = await res.json().catch(() => ({}))
    setLoading(false)
    if (!res.ok) return setErr(data.error || "Could not load certificates")
    setRows(data.certificates)
    setCourses(data.courses)
    setForm((x) => (x.courseSlug || !data.courses[0] ? x : { ...x, courseSlug: data.courses[0].slug }))
  }, [filters])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load() }, [])

  async function post(body: Record<string, unknown>) {
    const res = await fetch("/api/admin/certificates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    return { ok: res.ok, data: await res.json().catch(() => ({})) }
  }

  async function issue(e: React.FormEvent) {
    e.preventDefault()
    setMsg(""); setErr("")
    const { ok, data } = await post({ action: "issue", ...form })
    if (!ok) return setErr(data.error || "Could not issue the certificate")
    setMsg(data.created ? `Issued ${data.certificate.code} to ${data.certificate.recipientName}.` : `That account already has certificate ${data.certificate.code}; nothing new was issued.`)
    setForm((f) => ({ ...f, email: "", name: "", note: "" }))
    load()
  }

  function open(kind: Action["kind"], cert: Certificate, trigger: HTMLElement) {
    returnFocus.current = trigger
    setAction({ kind, cert })
    setActionName(cert.recipientName)
    setActionReason("")
    setActionErr("")
    requestAnimationFrame(() => dialogRef.current?.showModal())
  }
  function close() {
    dialogRef.current?.close()
  }

  async function submitAction(e: React.FormEvent) {
    e.preventDefault()
    if (!action || action.kind === "history") return close()
    setActionErr("")
    const { ok, data } = await post({ action: action.kind, id: action.cert.id, name: actionName, reason: actionReason })
    if (!ok) return setActionErr(data.error || "That did not work")
    const verb = { rename: "Renamed", revoke: "Revoked", reinstate: "Reinstated" }[action.kind]
    setMsg(`${verb} ${action.cert.code}.`)
    close()
    load()
  }

  const titleOf = (slug: string) => courses.find((c) => c.slug === slug)?.title ?? slug
  const dialogTitle = action ? { rename: "Correct the name", revoke: "Revoke certificate", reinstate: "Reinstate certificate", history: "Certificate history" }[action.kind] : ""

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Certificates and final exams</h1>
        <p className="mt-1 max-w-3xl text-slate-600 dark:text-slate-400">Learners get a certificate automatically when they finish every lesson and activity of a skills course. Use this page to correct a name, revoke or reinstate a certificate, or issue one manually. Every change is kept in the certificate&apos;s history.</p>
      </div>
      <p role="status" className="font-medium text-emerald-800 dark:text-emerald-300">{msg}</p>
      {err ? <p role="alert" className="font-medium text-red-800 dark:text-red-300">{err}</p> : null}

      <form onSubmit={(e) => { e.preventDefault(); load() }} className="grid gap-4 rounded-xl border border-slate-200 p-5 dark:border-slate-800 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end" aria-labelledby="find-heading">
        <h2 id="find-heading" className="text-lg font-semibold text-slate-900 dark:text-white md:col-span-4">Find certificates</h2>
        <label className={label}>Name, email or credential ID
          <input className={field} type="search" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        </label>
        <label className={label}>Course
          <select className={field} value={filters.course} onChange={(e) => setFilters({ ...filters, course: e.target.value })}>
            <option value="">All courses</option>
            {courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          </select>
        </label>
        <label className={label}>Status
          <select className={field} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Any</option>
            <option value="active">Valid</option>
            <option value="revoked">Revoked</option>
          </select>
        </label>
        <button type="submit" className={primary}>Search</button>
      </form>

      <div role="region" aria-labelledby="cert-cap" tabIndex={0} className={cn("overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800", ring)}>
        <table className="w-full text-left text-sm">
          <caption id="cert-cap" className="p-3 text-left font-semibold text-slate-900 dark:text-white">{loading ? "Loading certificates…" : `Certificates (${rows.length}${rows.length === 300 ? ", showing the newest 300" : ""})`}</caption>
          <thead className="bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white">
            <tr>{["Recipient", "Credential ID", "Course", "Issued", "Valid until", "Source", "Status", "Actions"].map((h) => <th key={h} scope="col" className="p-3">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
            {!loading && !rows.length ? <tr><td colSpan={8} className="p-4">No certificates match.</td></tr> : null}
            {rows.map((c) => (
              <tr key={c.id} className="align-top">
                <th scope="row" className="p-3 font-medium text-slate-900 dark:text-white"><span className="block">{c.recipientName}</span><span className="block break-all font-normal text-slate-600 dark:text-slate-400">{c.recipientEmail}</span></th>
                <td className="p-3"><a href={`/certificates/${c.code}`} target="_blank" rel="noopener noreferrer" className="font-mono text-blue-800 underline underline-offset-2 dark:text-blue-300">{c.code}<span className="sr-only"> (opens the public certificate in a new tab)</span></a>{!c.revokedAt && !(c.expiresAt && new Date(c.expiresAt).getTime() <= Date.now()) ? <a href={`/certificates/${c.code}/pdf`} download className="ml-3 text-blue-800 underline underline-offset-2 dark:text-blue-300">PDF<span className="sr-only"> for {c.code}</span></a> : null}</td>
                <td className="p-3">{titleOf(c.courseSlug)}</td>
                <td className="p-3 whitespace-nowrap">{day(c.issuedAt)}</td>
                <td className="p-3 whitespace-nowrap">{c.expiresAt ? day(c.expiresAt) : "No expiry"}{c.renewalCount ? <span className="block text-slate-600 dark:text-slate-400">Renewed {c.renewalCount}×</span> : null}</td>
                <td className="p-3">{c.source === "admin" ? "Manual" : "Earned"}</td>
                <td className="p-3">{c.revokedAt ? <span className="font-semibold text-red-800 dark:text-red-300">Revoked {day(c.revokedAt)}</span> : c.expiresAt && new Date(c.expiresAt).getTime() <= Date.now() ? <span className="font-semibold text-amber-800 dark:text-amber-300">Expired</span> : <span className="font-semibold text-emerald-800 dark:text-emerald-300">Valid</span>}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className={btn} onClick={(e) => open("rename", c, e.currentTarget)}>Rename<span className="sr-only"> {c.recipientName}</span></button>
                    {c.revokedAt
                      ? <button type="button" className={btn} onClick={(e) => open("reinstate", c, e.currentTarget)}>Reinstate<span className="sr-only"> {c.code}</span></button>
                      : <button type="button" className={btn} onClick={(e) => open("revoke", c, e.currentTarget)}>Revoke<span className="sr-only"> {c.code}</span></button>}
                    <button type="button" className={btn} onClick={(e) => open("history", c, e.currentTarget)}>History<span className="sr-only"> of {c.code}</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {courses.length ? <AdminExamSupport courses={courses} /> : null}

      <form onSubmit={issue} className="grid gap-4 rounded-xl border border-slate-200 p-5 dark:border-slate-800 md:grid-cols-2" aria-labelledby="issue-heading">
        <h2 id="issue-heading" className="text-lg font-semibold text-slate-900 dark:text-white md:col-span-2">Issue a certificate manually</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 md:col-span-2">For example after an offline course or a progress-saving fault. If the email belongs to an account, the certificate appears in that person&apos;s course.</p>
        <label className={label}>Course
          <select className={field} value={form.courseSlug} onChange={(e) => setForm({ ...form, courseSlug: e.target.value })}>
            {courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          </select>
        </label>
        <label className={label}>Recipient email
          <input className={field} type="email" required autoComplete="off" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label className={label}>Name to print
          <input className={field} required maxLength={80} autoComplete="off" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className={label}>Reason (kept in the history)
          <input className={field} required value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </label>
        <div className="md:col-span-2"><button type="submit" className={primary}>Issue certificate</button></div>
      </form>

      <dialog ref={dialogRef} aria-labelledby="cert-dialog-title" onClose={() => { setAction(null); returnFocus.current?.focus() }} className="w-[min(36rem,calc(100vw-2rem))] rounded-xl border border-slate-300 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-950/50 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
        {action ? (
          <form onSubmit={submitAction} className="space-y-4 p-6">
            <h2 id="cert-dialog-title" className="text-xl font-bold">{dialogTitle}</h2>
            <p className="text-sm text-slate-700 dark:text-slate-300"><span className="font-mono">{action.cert.code}</span> · {action.cert.recipientName} · {action.cert.recipientEmail}</p>
            {action.kind === "history" ? (
              <ol className="max-h-80 space-y-3 overflow-y-auto text-sm">
                {(action.cert.history ?? []).map((h, i) => (
                  <li key={i} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <p className="font-semibold capitalize">{h.action} <span className="font-normal text-slate-600 dark:text-slate-400">· {new Date(h.at).toLocaleString("en-GB", { timeZone: "UTC" })} UTC</span></p>
                    <p>By {h.by}</p>
                    {h.detail ? <p className="text-slate-700 dark:text-slate-300">{h.detail}</p> : null}
                  </li>
                ))}
              </ol>
            ) : (
              <>
                {action.kind === "rename" ? (
                  <label className={label}>Corrected name
                    <input className={field} required maxLength={80} value={actionName} onChange={(e) => setActionName(e.target.value)} />
                  </label>
                ) : null}
                {action.kind === "revoke" ? <p className="text-sm">The public certificate page will show it as revoked from now on. You can reinstate it later.</p> : null}
                <label className={label}>Reason (kept in the history)
                  <input className={field} required value={actionReason} onChange={(e) => setActionReason(e.target.value)} aria-describedby={actionErr ? "cert-dialog-err" : undefined} aria-invalid={Boolean(actionErr)} />
                </label>
                {actionErr ? <p id="cert-dialog-err" role="alert" className="text-sm font-medium text-red-800 dark:text-red-300">{actionErr}</p> : null}
              </>
            )}
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button type="button" className={btn} onClick={close}>{action.kind === "history" ? "Close" : "Cancel"}</button>
              {action.kind === "rename" ? <button type="submit" className={primary}>Save name</button> : null}
              {action.kind === "revoke" ? <button type="submit" className={danger}>Revoke certificate</button> : null}
              {action.kind === "reinstate" ? <button type="submit" className={primary}>Reinstate certificate</button> : null}
            </div>
          </form>
        ) : null}
      </dialog>
    </div>
  )
}
