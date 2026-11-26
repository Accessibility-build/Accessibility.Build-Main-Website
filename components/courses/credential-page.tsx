import Link from "next/link"
import { BadgeCheck, Clock3, ShieldAlert } from "lucide-react"
import { Logo } from "@/components/logo"
import { CertificateSeal } from "@/components/courses/certificate-document"
import { CredentialActions } from "@/components/courses/credential-actions"
import { certificateState, formatCertificateDate } from "@/lib/courses/certificate-rules"

export interface CredentialPageData {
  code: string
  recipientName: string
  courseTitle: string
  courseRoute: string
  summary: string
  skills: string[]
  issuedAt: string
  revokedAt: string | null
  /** Null: the certificate does not expire. */
  expiresAt: string | null
}

/**
 * The shareable web page for a credential. It is designed for the screen (responsive, themed) and
 * deliberately does not imitate the certificate: the certificate itself is the downloadable PDF.
 */
export function CredentialPage({ data, headingLevel = 1 }: { data: CredentialPageData; headingLevel?: 1 | 2 }) {
  const H = headingLevel === 1 ? "h1" : "h2"
  const H2 = headingLevel === 1 ? "h2" : "h3"
  const state = certificateState(data)
  const revoked = state === "revoked"
  const expired = state === "expired"
  return (
    <article aria-labelledby={`credential-${data.code}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1b3f] via-[#12296b] to-[#1e3a8a] px-6 py-8 text-white sm:px-10 sm:py-10">
        <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 text-white/5" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="currentColor" /></svg>
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <p className="flex items-center gap-3 text-lg font-bold tracking-tight">
            <Logo className="h-10 w-10" foreground="#ffffff" background="#0b1b3f" />Accessibility.build
          </p>
          <p className={revoked ? "inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm font-bold text-red-900" : expired ? "inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-950" : "inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-900"}>
            {revoked ? <ShieldAlert aria-hidden="true" className="h-4 w-4" /> : expired ? <Clock3 aria-hidden="true" className="h-4 w-4" /> : <BadgeCheck aria-hidden="true" className="h-4 w-4" />}
            {revoked ? "Revoked credential" : expired ? "Expired credential" : "Verified credential"}
          </p>
        </div>
        <div className="relative mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="shrink-0 self-start sm:self-auto"><CertificateSeal size={128} id={`credential-${data.code}`} /></div>
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Certificate of completion</p>
            <H id={`credential-${data.code}`} className="mt-2 break-words text-3xl font-extrabold tracking-tight sm:text-4xl">{data.recipientName}</H>
            <p className="mt-2 text-lg text-indigo-100">completed <strong className="font-semibold text-white">{data.courseTitle}</strong></p>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-6 py-8 sm:px-10">
        {revoked ? (
          <p role="note" className="rounded-lg border-2 border-red-700 bg-red-50 p-4 font-medium text-red-900 dark:border-red-400 dark:bg-red-950 dark:text-red-100">
            Accessibility.build revoked this credential on {formatCertificateDate(data.revokedAt!)}. It is no longer valid.
          </p>
        ) : expired ? (
          <p role="note" className="rounded-lg border-2 border-amber-600 bg-amber-50 p-4 font-medium text-amber-950 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-100">
            This credential expired on {formatCertificateDate(data.expiresAt!)}. It was valid from {formatCertificateDate(data.issuedAt)} until then. The holder can renew it by passing a renewal exam.
          </p>
        ) : (
          <CredentialActions code={data.code} courseTitle={data.courseTitle} issuedAt={data.issuedAt} expiresAt={data.expiresAt} />
        )}

        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Credential ID", <span key="c" className="font-mono">{data.code}</span>],
            ["Issued", formatCertificateDate(data.issuedAt)],
            [expired ? "Expired" : "Valid until", data.expiresAt ? formatCertificateDate(data.expiresAt) : "Does not expire"],
            ["Status", revoked ? "Revoked" : expired ? "Expired" : "Valid"],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <dt className="text-sm text-slate-600 dark:text-slate-400">{label}</dt>
              <dd className="mt-1 break-words text-base font-semibold text-slate-900 dark:text-white">{value}</dd>
            </div>
          ))}
        </dl>

        <section aria-labelledby={`skills-${data.code}`}>
          <H2 id={`skills-${data.code}`} className="text-lg font-bold text-slate-900 dark:text-white">Skills covered</H2>
          <ul role="list" className="mt-3 flex flex-wrap gap-2">
            {data.skills.map((s) => <li key={s} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-900 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-100">{s}</li>)}
          </ul>
        </section>

        <section aria-labelledby={`about-${data.code}`}>
          <H2 id={`about-${data.code}`} className="text-lg font-bold text-slate-900 dark:text-white">What this certificate shows</H2>
          <p className="mt-2 max-w-3xl leading-relaxed text-slate-700 dark:text-slate-300">{data.summary} It records completion of an Accessibility.build course and its final exam{data.expiresAt ? ", and stays valid for two years from issue or from the last renewal" : ""}. It is not a professional certification.</p>
          <p className="mt-3"><Link href={data.courseRoute} className="font-semibold text-blue-800 underline underline-offset-2 hover:decoration-2 dark:text-blue-300">About {data.courseTitle}</Link></p>
        </section>
      </div>
    </article>
  )
}
