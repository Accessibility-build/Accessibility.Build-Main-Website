// Completion rule for skills-course certificates. Pure functions: shared by the server (which decides)
// and the learner's certificate page (which explains what is left).
import type { CourseMeta, CourseProgressData } from "./types"

export interface CertificateProgress {
  lessonsTotal: number
  lessonsDone: number
  activitiesTotal: number
  activitiesDone: number
  remainingLessons: Array<{ key: string; number: number; title: string }>
  remainingActivities: Array<{ id: string; chapterKey: string; chapterNumber: number; chapterTitle: string }>
  eligible: boolean
}

/** A certificate needs every lesson marked complete and every design activity completed in its current version. */
export function certificateProgress(meta: CourseMeta, progress: CourseProgressData): CertificateProgress {
  const done = new Set(progress.chaptersDone ?? [])
  const activities = progress.study?.activities ?? {}
  const remainingLessons = meta.chapters.filter((c) => !done.has(c.key)).map((c) => ({ key: c.key, number: c.number, title: c.title }))
  const allActivities = meta.chapters.flatMap((c) => (c.activityIds ?? []).map((id) => ({ id, chapterKey: c.key, chapterNumber: c.number, chapterTitle: c.title, version: c.activityVersions?.[id] })))
  const remainingActivities = allActivities
    .filter((a) => { const s = activities[a.id]; return !s?.completedAt || (a.version !== undefined && s.version !== a.version) })
    .map(({ version: _version, ...rest }) => rest)
  return {
    lessonsTotal: meta.chapters.length,
    lessonsDone: meta.chapters.length - remainingLessons.length,
    activitiesTotal: allActivities.length,
    activitiesDone: allActivities.length - remainingActivities.length,
    remainingLessons,
    remainingActivities,
    eligible: meta.chapters.length > 0 && remainingLessons.length === 0 && remainingActivities.length === 0,
  }
}

/** Names as they should print: trimmed, single-spaced, 2 to 80 characters, letters required, no markup characters. */
export function normalizeCertificateName(raw: unknown): string | null {
  if (typeof raw !== "string") return null
  const name = raw.normalize("NFC").replace(/\s+/g, " ").trim()
  if (name.length < 2 || name.length > 80) return null
  if (!/\p{L}/u.test(name) || /[<>{}[\]\\/@#$%^*=_|~`"]/.test(name)) return null
  return name
}

/** Codes avoid look-alike characters (no 0/O, 1/I/L) so they can be read aloud or typed. */
export const CERTIFICATE_CODE_RE = /^AB-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{4}$/

export function formatCertificateDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
}

// ── Validity and renewal ──

/** Adds calendar months in UTC, clamping to the month's last day (31 Jan + 1 month = 28 or 29 Feb). */
export function addMonthsUtc(date: Date, months: number) {
  const d = new Date(date.getTime())
  const day = d.getUTCDate()
  d.setUTCDate(1)
  d.setUTCMonth(d.getUTCMonth() + months)
  const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate()
  d.setUTCDate(Math.min(day, last))
  return d
}

export type CertificateState = "valid" | "expired" | "revoked"

export function certificateState(cert: { revokedAt: Date | string | null; expiresAt: Date | string | null }, now = new Date()): CertificateState {
  if (cert.revokedAt) return "revoked"
  if (cert.expiresAt && new Date(cert.expiresAt).getTime() <= now.getTime()) return "expired"
  return "valid"
}

export interface RenewalWindow {
  opensAt: Date
  closesAt: Date
  /** early: not yet open; open: can renew now; closed: too late, the full course and exam are needed. */
  phase: "early" | "open" | "closed"
}

export function renewalWindow(expiresAt: Date | string, rules: { opensDaysBefore: number; closesMonthsAfter: number }, now = new Date()): RenewalWindow {
  const expiry = new Date(expiresAt)
  const opensAt = new Date(expiry.getTime() - rules.opensDaysBefore * 24 * 60 * 60 * 1000)
  const closesAt = addMonthsUtc(expiry, rules.closesMonthsAfter)
  const t = now.getTime()
  return { opensAt, closesAt, phase: t < opensAt.getTime() ? "early" : t >= closesAt.getTime() ? "closed" : "open" }
}

/** Renewing early adds time to the current expiry; renewing after expiry starts from the renewal date. */
export function renewedExpiry(expiresAt: Date | string, months: number, now = new Date()) {
  const base = new Date(Math.max(new Date(expiresAt).getTime(), now.getTime()))
  return addMonthsUtc(base, months)
}
