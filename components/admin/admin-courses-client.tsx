"use client"

import { useCallback, useEffect, useState } from "react"

interface Licence {
  id: string
  courseSlug: string
  licenceType: string
  seats: number
  seatsUsed: number
  ownerEmail: string
  source: string
  note: string | null
  billingOrderId: string | null
  revokedAt: string | null
  createdAt: string
}

const field = "mt-1 w-full min-h-[44px] rounded-lg border-2 border-slate-400 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"

export function AdminCoursesClient() {
  const [licences, setLicences] = useState<Licence[]>([])
  const [courses, setCourses] = useState<Array<{ slug: string; title: string }>>([])
  const [form, setForm] = useState({ courseSlug: "cpacc-crash-course", email: "", licenceType: "individual", seats: "10", note: "" })
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/courses", { cache: "no-store" })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      setLicences(data.licences)
      setCourses(data.courses)
    } else setErr(data.error || "Could not load licences")
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function grant(e: React.FormEvent) {
    e.preventDefault()
    setMsg("")
    setErr("")
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "grant", ...form, seats: Number(form.seats) }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return setErr(data.error || "Grant failed")
    setMsg(`Access granted to ${form.email}.${data.matchedUser ? "" : " No account yet: it will activate when they sign up with that email."}`)
    setForm((f) => ({ ...f, email: "", note: "" }))
    load()
  }

  async function revoke(l: Licence) {
    const reason = window.prompt(`Reason for revoking ${l.ownerEmail}'s ${l.licenceType} licence?`)
    if (!reason) return
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "revoke", licenceId: l.id, reason }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return setErr(data.error || "Revoke failed")
    setMsg(`Revoked ${l.ownerEmail}'s licence.`)
    load()
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Course licences</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Purchases create licences automatically. Use this form for invoiced sales, refunds handled outside the checkout, or complimentary access.</p>
      </div>
      <p role="status" className="font-medium text-emerald-800 dark:text-emerald-300">{msg}</p>
      {err ? <p role="alert" className="font-medium text-red-800 dark:text-red-300">{err}</p> : null}

      <form onSubmit={grant} className="grid gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5 md:grid-cols-2">
        <h2 className="md:col-span-2 text-lg font-semibold text-slate-900 dark:text-white">Grant access</h2>
        <label className="font-medium text-slate-900 dark:text-white">Course
          <select className={field} value={form.courseSlug} onChange={(e) => setForm({ ...form, courseSlug: e.target.value })}>
            {courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          </select>
        </label>
        <label className="font-medium text-slate-900 dark:text-white">Email
          <input className={field} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label className="font-medium text-slate-900 dark:text-white">Licence
          <select className={field} value={form.licenceType} onChange={(e) => setForm({ ...form, licenceType: e.target.value })}>
            <option value="individual">Individual (1 seat)</option>
            <option value="team">Team</option>
          </select>
        </label>
        {form.licenceType === "team" ? (
          <label className="font-medium text-slate-900 dark:text-white">Seats
            <input className={field} type="number" min={2} max={100} value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} />
          </label>
        ) : <div />}
        <label className="md:col-span-2 font-medium text-slate-900 dark:text-white">Note (required, for example the invoice number)
          <input className={field} required value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </label>
        <div className="md:col-span-2">
          <button type="submit" className="min-h-[44px] rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">Grant access</button>
        </div>
      </form>

      <div role="region" aria-labelledby="lic-cap" tabIndex={0} className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
        <table className="w-full text-left text-sm">
          <caption id="lic-cap" className="p-3 text-left font-semibold text-slate-900 dark:text-white">Recent licences ({licences.length})</caption>
          <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
            <tr>
              {["Owner", "Course", "Licence", "Seats", "Source", "Created", "Status", ""].map((h, i) => <th key={i} scope="col" className="p-3">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {licences.map((l) => (
              <tr key={l.id}>
                <th scope="row" className="p-3 font-medium text-slate-900 dark:text-white break-all">{l.ownerEmail}</th>
                <td className="p-3">{l.courseSlug}</td>
                <td className="p-3">{l.licenceType}</td>
                <td className="p-3">{l.seatsUsed} of {l.seats}</td>
                <td className="p-3">{l.source}{l.note ? `: ${l.note}` : ""}</td>
                <td className="p-3">{new Date(l.createdAt).toISOString().slice(0, 10)}</td>
                <td className="p-3">{l.revokedAt ? "Revoked" : "Active"}</td>
                <td className="p-3">
                  {!l.revokedAt ? (
                    <button type="button" onClick={() => revoke(l)} aria-label={`Revoke licence for ${l.ownerEmail}`} className="min-h-[44px] rounded-lg border-2 border-slate-400 px-3 py-1.5 font-semibold hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">Revoke</button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
