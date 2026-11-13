"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"

interface Seat {
  id: string
  email: string
  claimed: boolean
  isOwner: boolean
}

export function TeamSeats({ slug, licenceId, seats: initialSeats, limit }: { slug: string; licenceId: string; seats: Seat[]; limit: number }) {
  const router = useRouter()
  const [seats, setSeats] = useState<Seat[]>(initialSeats)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const full = seats.length >= limit
  const fid = `seat-email-${licenceId.slice(0, 8)}`

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setStatus("")
    if (!email.trim()) {
      setError("Enter an email address.")
      inputRef.current?.focus()
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address, like name@example.com.")
      inputRef.current?.focus()
      return
    }
    setBusy(true)
    const res = await fetch(`/api/courses/${slug}/seats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licenceId, email }),
    }).catch(() => null)
    setBusy(false)
    const data = await res?.json().catch(() => ({}))
    if (!res || !res.ok) {
      setError(data?.error || "Could not add that person. Try again.")
      inputRef.current?.focus()
      return
    }
    setSeats((list) => [...list, { id: data.seatId, email: data.email, claimed: false, isOwner: false }])
    setStatus(`${data.email} added. We have emailed them an invitation.`)
    setEmail("")
    router.refresh()
  }

  async function remove(seat: Seat) {
    if (!window.confirm(`Remove ${seat.email} from this licence? They will lose access to the course.`)) return
    setError("")
    setStatus("")
    const res = await fetch(`/api/courses/${slug}/seats`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licenceId, seatId: seat.id }),
    }).catch(() => null)
    if (!res || !res.ok) {
      const data = await res?.json().catch(() => ({}))
      setError(data?.error || "Could not remove that person. Try again.")
      return
    }
    setSeats((list) => list.filter((x) => x.id !== seat.id))
    setStatus(`${seat.email} removed.`)
    inputRef.current?.focus()
    router.refresh()
  }

  return (
    <div className="space-y-8">
      <p role="status" className="text-emerald-800 dark:text-emerald-300 font-medium min-h-[1.5rem]">{status}</p>
      <section aria-labelledby={`${fid}-seats`}>
        <h2 id={`${fid}-seats`} className="text-xl font-semibold text-slate-900 dark:text-white">
          People on this licence ({seats.length} of {limit} seats used)
        </h2>
        <ul className="mt-3 divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800" role="list">
          {seats.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <span>
                <span className="font-medium text-slate-900 dark:text-white break-all">{s.email}</span>
                <span className="block text-sm text-slate-600 dark:text-slate-400">
                  {s.isOwner ? "You (licence owner)" : s.claimed ? "Has signed in" : "Invited, not signed in yet"}
                </span>
              </span>
              {!s.isOwner ? (
                <button
                  type="button"
                  onClick={() => remove(s)}
                  aria-label={`Remove ${s.email}`}
                  className="min-h-[44px] rounded-lg border-2 border-slate-400 px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  Remove
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby={`${fid}-add`}>
        <h2 id={`${fid}-add`} className="text-xl font-semibold text-slate-900 dark:text-white">Add a colleague</h2>
        {full ? (
          <p className="mt-2 text-slate-700 dark:text-slate-300">All {limit} seats are in use. Remove someone to add another person.</p>
        ) : (
          <form onSubmit={add} noValidate className="mt-3 space-y-3">
            <div>
              <label htmlFor={fid} className="block font-semibold text-slate-900 dark:text-white">Their email address</label>
              <p id={`${fid}-hint`} className="text-sm text-slate-600 dark:text-slate-400">They get access when they sign in to Accessibility.build with this email.</p>
              <input
                ref={inputRef}
                id={fid}
                type="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby={error ? `${fid}-hint ${fid}-error` : `${fid}-hint`}
                aria-invalid={error ? true : undefined}
                className="mt-2 w-full max-w-md min-h-[44px] rounded-lg border-2 border-slate-400 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              />
              {error ? <p id={`${fid}-error`} className="mt-2 font-medium text-red-800 dark:text-red-300">{error}</p> : null}
            </div>
            <button
              type="submit"
              disabled={busy}
              className="min-h-[44px] rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
            >
              {busy ? "Adding..." : "Add and send invitation"}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
