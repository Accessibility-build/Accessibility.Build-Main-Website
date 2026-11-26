"use client"
import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Award, CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { CredentialPage } from "@/components/courses/credential-page"
import type { CertificateProgress } from "@/lib/courses/certificate-rules"

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-slate-950"
const btn = cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-500 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800", ring)
const primary = cn(btn, "border-blue-700 bg-blue-700 text-white hover:bg-blue-800 dark:border-blue-400 dark:bg-blue-400 dark:text-slate-950 dark:hover:bg-blue-300")

interface Props {
  slug: string
  homeRoute: string
  courseTitle: string
  status: CertificateProgress
  suggestedName: string
  examPassed: boolean
  renewal: { attemptsLeft: number; phase: "early" | "open" | "closed" | null; opensAt: string | null; closesAt: string | null; priceUsd: number; attemptsPerPurchase: number; questions: number; validityMonths: number } | null
  certificate: { code: string; recipientName: string; issuedAt: string; revoked: boolean; revokedAt: string | null; expiresAt: string | null; summary: string; skills: string[] } | null
}

function Meter({ id, label, done, total }: { id: string; label: string; done: number; total: number }) {
  return (
    <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
      <p id={id} className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">{done} of {total}</p>
      <progress aria-labelledby={id} max={total || 1} value={done} className="course-progress mt-3 h-2 w-full" />
    </div>
  )
}

export function CertificateClaim({ slug, homeRoute, courseTitle, status, suggestedName, certificate, examPassed, renewal }: Props) {
  const router = useRouter()
  const [name, setName] = useState(suggestedName)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function claim(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (name.trim().length < 2) { setError("Enter your name as you want it to appear on the certificate."); inputRef.current?.focus(); return }
    setBusy(true)
    const res = await fetch(`/api/courses/${slug}/certificate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) { setError(data.error || "Your certificate could not be issued. Try again."); inputRef.current?.focus(); return }
    router.refresh()
  }

  if (certificate) {
    return (
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">Your certificate</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{certificate.revoked ? "This certificate has been revoked" : "Congratulations, you completed the course"}</h1>
          <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">{certificate.revoked ? "Contact us if you think this is a mistake." : "Download your certificate as a PDF, share your verification page or add it to LinkedIn."}</p>
        </div>
        <CredentialPage headingLevel={2} data={{ code: certificate.code, recipientName: certificate.recipientName, courseTitle, courseRoute: `/courses/${slug}`, summary: certificate.summary, skills: certificate.skills, issuedAt: certificate.issuedAt, revokedAt: certificate.revokedAt, expiresAt: certificate.expiresAt }} />
        {!certificate.revoked && certificate.expiresAt && renewal ? <RenewalPanel slug={slug} homeRoute={homeRoute} expiresAt={certificate.expiresAt} renewal={renewal} /> : null}
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <Link href={`/certificates/${certificate.code}`} className="font-semibold text-blue-800 underline underline-offset-2 dark:text-blue-300">Open your public verification page</Link>. Name spelled wrong? <Link href="/contact" className="underline underline-offset-2">Contact us</Link> with your credential ID ({certificate.code}) and we will correct it.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">Your certificate</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{status.eligible && examPassed ? "Your certificate is ready" : "Earn your certificate"}</h1>
        <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">Three steps: complete every lesson, complete every design activity, then pass the final exam.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Meter id="cert-lessons" label="Lessons completed" done={status.lessonsDone} total={status.lessonsTotal} />
        <Meter id="cert-activities" label="Design activities completed" done={status.activitiesDone} total={status.activitiesTotal} />
      </div>

      {status.eligible && !examPassed ? (
        <div className="rounded-xl border-2 border-blue-700 bg-blue-50 p-5 dark:border-blue-400 dark:bg-blue-950 sm:p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Next: pass the final exam</h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">You have completed the course. Pass the final exam to issue your certificate.</p>
          <Link href={`${homeRoute}/exam`} className={cn(primary, "mt-4")}>Go to the final exam</Link>
        </div>
      ) : status.eligible ? (
        <form onSubmit={claim} noValidate className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-5 dark:border-emerald-800 dark:bg-emerald-950/30 sm:p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Issue your certificate</h2>
          <label htmlFor="cert-name" className="mt-4 block font-semibold text-slate-900 dark:text-white">Name on your certificate</label>
          <p id="cert-name-hint" className="text-sm text-slate-600 dark:text-slate-400">Exactly as you want it to appear. To change it later, contact us.</p>
          <input ref={inputRef} id="cert-name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} aria-describedby={error ? "cert-name-hint cert-name-error" : "cert-name-hint"} aria-invalid={Boolean(error)}
            className={cn("mt-2 block min-h-11 w-full max-w-md rounded-lg border border-slate-500 bg-white px-3 py-2 text-base text-slate-950 dark:bg-slate-900 dark:text-white", ring)} />
          {error ? <p id="cert-name-error" className="mt-2 text-sm font-medium text-red-800 dark:text-red-300">{error}</p> : null}
          <button type="submit" disabled={busy} className={cn(primary, "mt-4")}><Award aria-hidden="true" className="h-4 w-4" />{busy ? "Issuing your certificate…" : "Issue my certificate"}</button>
        </form>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section aria-labelledby="left-lessons" className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
            <h2 id="left-lessons" className="text-lg font-bold text-slate-900 dark:text-white">Lessons still to complete ({status.remainingLessons.length})</h2>
            {status.remainingLessons.length ? (
              <ul role="list" className="mt-3 space-y-1">
                {status.remainingLessons.map((l) => <li key={l.key}><Link href={`${homeRoute}/chapters/${l.key}`} className={cn("flex min-h-11 items-center gap-2 rounded-md px-2 text-slate-800 underline-offset-2 hover:underline dark:text-slate-200", ring)}><Circle aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-500" />Lesson {l.number}: {l.title}</Link></li>)}
              </ul>
            ) : <p className="mt-3 flex items-center gap-2 text-slate-700 dark:text-slate-300"><CheckCircle2 aria-hidden="true" className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />All lessons complete.</p>}
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Press the “Lesson read” button at the end of each lesson.</p>
          </section>
          <section aria-labelledby="left-activities" className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
            <h2 id="left-activities" className="text-lg font-bold text-slate-900 dark:text-white">Design activities still to complete ({status.remainingActivities.length})</h2>
            {status.remainingActivities.length ? (
              <ul role="list" className="mt-3 space-y-1">
                {status.remainingActivities.map((a) => <li key={a.id}><Link href={`${homeRoute}/chapters/${a.chapterKey}`} className={cn("flex min-h-11 items-center gap-2 rounded-md px-2 text-slate-800 underline-offset-2 hover:underline dark:text-slate-200", ring)}><Circle aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-500" />Activity in lesson {a.chapterNumber}: {a.chapterTitle}</Link></li>)}
              </ul>
            ) : <p className="mt-3 flex items-center gap-2 text-slate-700 dark:text-slate-300"><CheckCircle2 aria-hidden="true" className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />All activities complete.</p>}
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Finish each activity with “Record completed practice”.</p>
          </section>
        </div>
      )}
    </div>
  )
}

const dateText = (iso: string) => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })

/** Validity and renewal: when renewal opens, buying it, taking the renewal exam, or starting again. */
function RenewalPanel({ slug, homeRoute, expiresAt, renewal }: { slug: string; homeRoute: string; expiresAt: string; renewal: NonNullable<Props["renewal"]> }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const expired = new Date(expiresAt).getTime() <= Date.now()
  async function buy() {
    setBusy(true); setError("")
    const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ item: `renewal:${slug}` }) })
    const data = await res.json().catch(() => ({}))
    if (res.status === 409 && data.redirect) { window.location.href = data.redirect; return }
    if (!res.ok || !data.url) { setError(data.error || "Could not open checkout. Try again."); setBusy(false); return }
    window.location.href = data.url
  }
  const years = renewal.validityMonths / 12
  const price = `$${renewal.priceUsd}`
  return (
    <section aria-labelledby="renewal-heading" className="rounded-xl border border-slate-200 p-5 dark:border-slate-800 sm:p-6">
      <h2 id="renewal-heading" className="text-xl font-bold text-slate-900 dark:text-white">Validity and renewal</h2>
      <p className="mt-2 text-slate-700 dark:text-slate-300">Your certificate {expired ? "expired on" : "is valid until"} <strong>{dateText(expiresAt)}</strong>.{expired ? "" : ` Certificates last ${years} years, so they reflect current guidance.`}</p>
      {renewal.phase === "early" && renewal.opensAt ? (
        <p className="mt-2 text-slate-700 dark:text-slate-300">Renewal opens on {dateText(renewal.opensAt)}. You can then take a {renewal.questions}-question renewal exam to extend your certificate by {years} years.</p>
      ) : renewal.phase === "open" ? (
        renewal.attemptsLeft > 0 ? (
          <div className="mt-4">
            <p className="text-slate-700 dark:text-slate-300">You have {renewal.attemptsLeft} renewal {renewal.attemptsLeft === 1 ? "attempt" : "attempts"}. Pass the {renewal.questions}-question renewal exam to extend your certificate by {years} years, keeping the same credential ID.</p>
            <Link href={`${homeRoute}/exam?mode=renewal`} className={cn(primary, "mt-4")}>Take the renewal exam</Link>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-slate-700 dark:text-slate-300">Renew for <strong>{price}</strong>. It includes {renewal.attemptsPerPurchase} attempts at a {renewal.questions}-question renewal exam. Passing extends your certificate by {years} years {expired ? "from the day you pass" : "from its current expiry date"}, with the same credential ID.{renewal.closesAt ? ` Renewal stays open until ${dateText(renewal.closesAt)}.` : ""}</p>
            <button type="button" onClick={buy} disabled={busy} className={cn(primary, "mt-4")}>{busy ? "Opening secure checkout…" : `Renew for ${price}`}</button>
            {error ? <p role="alert" className="mt-2 text-sm font-medium text-red-800 dark:text-red-300">{error}</p> : null}
          </div>
        )
      ) : renewal.phase === "closed" ? (
        <div className="mt-4">
          <p className="text-slate-700 dark:text-slate-300">The renewal window closed{renewal.closesAt ? ` on ${dateText(renewal.closesAt)}` : ""}. To hold a current certificate again, complete the course and pass the final exam again. Your notes and written work are kept.</p>
          <Link href={`${homeRoute}/exam`} className={cn(btn, "mt-4")}>Start the course again</Link>
        </div>
      ) : null}
    </section>
  )
}
