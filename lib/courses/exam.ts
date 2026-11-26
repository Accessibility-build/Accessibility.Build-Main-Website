import "server-only"
import { randomInt } from "node:crypto"
import { and, asc, desc, eq, isNull, sql } from "drizzle-orm"
import { cache } from "react"
import { db } from "@/lib/db"
import { courseCertificates, courseContent, courseExamAttempts, courseExamStatus, type CourseCertificate, type CourseExamStatus } from "@/lib/db/schema"
import type { CourseConfig, CourseFinalExam } from "./config"
import { certificateState, renewalWindow, renewedExpiry } from "./certificate-rules"
import { buildPaper, gradePaper, paperQuestionIds, sanitizeAnswers, spreadCounts, viewPaper, type ExamBankQuestion, type ExamResult, type PaperItem } from "./exam-paper"
import { renewCertificateExpiry } from "./certificates"
import { resetCourseCompletion } from "./progress"

export type ExamKind = "final" | "renewal"

/** Time choices in minutes; 0 means untimed. Standard, time and a half, double time, untimed. */
export function examTimeOptions(minutes: number) {
  return [minutes, Math.round(minutes * 1.5), minutes * 2, 0]
}
/** Network grace after the deadline, and how long an untimed attempt stays open. */
const GRACE_MS = 2 * 60 * 1000
const UNTIMED_MS = 7 * 24 * 60 * 60 * 1000
const random = () => randomInt(0, 2 ** 32) / 2 ** 32

export class ExamError extends Error {
  constructor(message: string, public readonly status: number, public readonly code: string) { super(message) }
}

export const getExamBank = cache(async (slug: string): Promise<ExamBankQuestion[]> => {
  const rows = await db.select({ data: courseContent.data }).from(courseContent)
    .where(and(eq(courseContent.courseSlug, slug), eq(courseContent.kind, "exam"))).orderBy(asc(courseContent.position))
  return rows.map((r) => r.data as ExamBankQuestion)
})

type HistoryEntry = { at: string; by: string; action: string; detail?: string }
const entry = (by: string, action: string, detail?: string): HistoryEntry => ({ at: new Date().toISOString(), by, action, ...(detail ? { detail } : {}) })
const logEntry = (e: HistoryEntry) => sql`${courseExamStatus.history} || ${JSON.stringify([e])}::jsonb`
const allowed = (status: Pick<CourseExamStatus, "extraAttempts">, exam: CourseFinalExam) => exam.attemptsPerRound + status.extraAttempts
const sortSections = (bank: ExamBankQuestion[]) => [...new Set(bank.map((q) => q.sec))].sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
const statusWhere = (userId: string, slug: string) => and(eq(courseExamStatus.userId, userId), eq(courseExamStatus.courseSlug, slug))

async function statusRow(userId: string, slug: string) {
  const [row] = await db.select().from(courseExamStatus).where(statusWhere(userId, slug)).limit(1)
  return row ?? null
}

async function certificateFor(userId: string, slug: string): Promise<CourseCertificate | null> {
  const [row] = await db.select().from(courseCertificates).where(and(eq(courseCertificates.userId, userId), eq(courseCertificates.courseSlug, slug))).limit(1)
  return row ?? null
}

export interface AttemptSummary { id: string; round: number; attemptNo: number; startedAt: string; submittedAt: string | null; percent: number | null; passed: boolean | null; endReason: string | null; sections: ExamResult["sections"] | null }
export interface OpenAttempt { id: string; expiresAt: string; timed: boolean; answered: number; total: number }

export interface ExamOverview {
  round: number
  attemptsUsed: number
  attemptsAllowed: number
  attemptsLeft: number
  cooldownUntil: string | null
  passedAt: string | null
  /** The certificate expired and its renewal window closed: the learner may start the course again. */
  canRestart: boolean
  open: OpenAttempt | null
  history: AttemptSummary[]
}

export interface RenewalOverview {
  certificate: { code: string; expiresAt: string; state: "valid" | "expired" | "revoked"; renewalCount: number } | null
  window: { opensAt: string; closesAt: string; phase: "early" | "open" | "closed" } | null
  attemptsLeft: number
  open: OpenAttempt | null
  history: AttemptSummary[]
}

/** Grades an unfinished attempt whose time (plus grace) has run out, using the answers saved so far. */
export async function finalizeExpired(userId: string, course: CourseConfig) {
  const [open] = await db.select().from(courseExamAttempts)
    .where(and(eq(courseExamAttempts.userId, userId), eq(courseExamAttempts.courseSlug, course.slug), isNull(courseExamAttempts.submittedAt))).limit(1)
  if (open && open.expiresAt.getTime() + GRACE_MS < Date.now()) await finishAttempt(userId, course, open.id, undefined, "time_expired")
}

async function attemptsOf(userId: string, slug: string, kind: ExamKind) {
  return db.select().from(courseExamAttempts)
    .where(and(eq(courseExamAttempts.userId, userId), eq(courseExamAttempts.courseSlug, slug), eq(courseExamAttempts.kind, kind))).orderBy(desc(courseExamAttempts.startedAt)).limit(30)
}
function summarize(attempts: Awaited<ReturnType<typeof attemptsOf>>) {
  const open = attempts.find((a) => !a.submittedAt) ?? null
  return {
    open: open ? { id: open.id, expiresAt: open.expiresAt.toISOString(), timed: open.timeLimitSeconds > 0, answered: Object.keys(open.answers as object).length, total: open.total } : null,
    history: attempts.filter((a) => a.submittedAt).map((a) => ({ id: a.id, round: a.round, attemptNo: a.attemptNo, startedAt: a.startedAt.toISOString(), submittedAt: a.submittedAt?.toISOString() ?? null, percent: a.correct === null ? null : Math.floor((a.correct / a.total) * 100), passed: a.passed, endReason: a.endReason, sections: (a.sectionScores as ExamResult["sections"]) ?? null })),
  }
}

function restartAllowed(cert: CourseCertificate | null, course: CourseConfig) {
  if (!cert?.expiresAt || cert.revokedAt || !course.certificate) return false
  return renewalWindow(cert.expiresAt, course.certificate.renewal).phase === "closed"
}

export async function getExamOverview(userId: string, course: CourseConfig): Promise<ExamOverview> {
  const exam = course.finalExam!
  await finalizeExpired(userId, course)
  const [status, attempts, cert] = await Promise.all([statusRow(userId, course.slug), attemptsOf(userId, course.slug, "final"), certificateFor(userId, course.slug)])
  const used = status?.attemptsUsed ?? 0
  const allowedNow = allowed(status ?? { extraAttempts: 0 }, exam)
  return {
    round: status?.round ?? 1, attemptsUsed: used, attemptsAllowed: allowedNow, attemptsLeft: Math.max(0, allowedNow - used),
    cooldownUntil: status?.cooldownUntil?.toISOString() ?? null, passedAt: status?.passedAt?.toISOString() ?? null,
    canRestart: Boolean(status?.passedAt) && restartAllowed(cert, course),
    ...summarize(attempts),
  }
}

export async function getRenewalOverview(userId: string, course: CourseConfig): Promise<RenewalOverview> {
  await finalizeExpired(userId, course)
  const [status, attempts, cert] = await Promise.all([statusRow(userId, course.slug), attemptsOf(userId, course.slug, "renewal"), certificateFor(userId, course.slug)])
  const win = cert?.expiresAt && course.certificate ? renewalWindow(cert.expiresAt, course.certificate.renewal) : null
  return {
    certificate: cert?.expiresAt ? { code: cert.code, expiresAt: cert.expiresAt.toISOString(), state: certificateState(cert), renewalCount: cert.renewalCount } : null,
    window: win ? { opensAt: win.opensAt.toISOString(), closesAt: win.closesAt.toISOString(), phase: win.phase } : null,
    attemptsLeft: status?.renewalAttemptsLeft ?? 0,
    ...summarize(attempts),
  }
}

/** Whether a renewal can be bought or taken now: a certificate that expires, is not revoked, inside its window. */
export async function renewalEligibility(userId: string, course: CourseConfig) {
  const cert = await certificateFor(userId, course.slug)
  if (!course.certificate || !cert?.expiresAt) return { ok: false as const, reason: "You need a certificate before you can renew it." }
  if (cert.revokedAt) return { ok: false as const, reason: "A revoked certificate cannot be renewed." }
  const win = renewalWindow(cert.expiresAt, course.certificate.renewal)
  if (win.phase === "early") return { ok: false as const, reason: `Renewal opens on ${win.opensAt.toISOString().slice(0, 10)}.` }
  if (win.phase === "closed") return { ok: false as const, reason: "The renewal window has closed. Complete the course and the final exam again to earn a new certificate." }
  return { ok: true as const, cert }
}

/** Starts an attempt; it counts immediately, so abandoning a paper still uses it. */
export async function startExam(userId: string, course: CourseConfig, edition: string, minutes: number, kind: ExamKind = "final") {
  const exam = course.finalExam!
  const renewal = course.certificate?.renewal
  if (kind === "renewal" && !renewal) throw new ExamError("This course has no renewal exam.", 404, "NO_RENEWAL")
  if (!examTimeOptions(kind === "renewal" ? renewal!.minutes : exam.minutes).includes(minutes)) throw new ExamError("Choose one of the time options.", 400, "BAD_TIME")
  const bank = await getExamBank(course.slug)
  const sections = sortSections(bank)
  if (sections.length < 2 || bank.length < exam.questions) throw new ExamError("The exam is being updated. Try again later.", 503, "NO_BANK")
  if (kind === "renewal") {
    const eligible = await renewalEligibility(userId, course)
    if (!eligible.ok) throw new ExamError(eligible.reason, 409, "NOT_RENEWABLE")
  }
  await finalizeExpired(userId, course)
  return db.transaction(async (tx) => {
    await tx.insert(courseExamStatus).values({ userId, courseSlug: course.slug }).onConflictDoNothing()
    const [status] = await tx.select().from(courseExamStatus).where(statusWhere(userId, course.slug)).for("update")
    const [open] = await tx.select({ id: courseExamAttempts.id, kind: courseExamAttempts.kind }).from(courseExamAttempts).where(and(eq(courseExamAttempts.userId, userId), eq(courseExamAttempts.courseSlug, course.slug), isNull(courseExamAttempts.submittedAt))).limit(1)
    if (open) {
      if (open.kind !== kind) throw new ExamError("Finish your other exam attempt first.", 409, "OTHER_OPEN")
      return { id: open.id, resumed: true }
    }
    const previous = await tx.select({ paper: courseExamAttempts.paper }).from(courseExamAttempts).where(and(eq(courseExamAttempts.userId, userId), eq(courseExamAttempts.courseSlug, course.slug)))
    const seen = new Set(previous.flatMap((p) => paperQuestionIds(p.paper as PaperItem[])))
    const now = Date.now()
    const expiresAt = new Date(now + (minutes ? minutes * 60_000 : UNTIMED_MS))
    if (kind === "renewal") {
      if (status.renewalAttemptsLeft < 1) throw new ExamError("Buy a renewal to take the renewal exam.", 402, "NO_RENEWAL_ATTEMPTS")
      const done = await tx.select({ id: courseExamAttempts.id }).from(courseExamAttempts).where(and(eq(courseExamAttempts.userId, userId), eq(courseExamAttempts.courseSlug, course.slug), eq(courseExamAttempts.kind, "renewal")))
      const paper = buildPaper({ bank, counts: spreadCounts(sections, renewal!.questions, random), seen, random })
      const [attempt] = await tx.insert(courseExamAttempts).values({ userId, courseSlug: course.slug, kind, round: status.round, attemptNo: done.length + 1, edition, paper, answers: {}, timeLimitSeconds: minutes * 60, startedAt: new Date(now), expiresAt, total: paper.length }).returning({ id: courseExamAttempts.id })
      await tx.update(courseExamStatus).set({ renewalAttemptsLeft: status.renewalAttemptsLeft - 1, updatedAt: new Date() }).where(statusWhere(userId, course.slug))
      return { id: attempt.id, resumed: false }
    }
    if (status.passedAt) throw new ExamError("You have already passed the final exam.", 409, "PASSED")
    let { round, attemptsUsed, extraAttempts } = status
    if (attemptsUsed >= allowed(status, exam)) {
      if (status.cooldownUntil && status.cooldownUntil.getTime() > Date.now()) throw new ExamError(`You can take the exam again from ${status.cooldownUntil.toISOString().slice(0, 10)}.`, 409, "COOLDOWN")
      // The cooldown is over and the course has been completed again: a fresh round of attempts.
      round += 1; attemptsUsed = 0; extraAttempts = 0
    }
    const paper = buildPaper({ bank, counts: spreadCounts(sections, exam.questions, random), seen, random })
    const [attempt] = await tx.insert(courseExamAttempts).values({ userId, courseSlug: course.slug, kind, round, attemptNo: attemptsUsed + 1, edition, paper, answers: {}, timeLimitSeconds: minutes * 60, startedAt: new Date(now), expiresAt, total: paper.length }).returning({ id: courseExamAttempts.id })
    await tx.update(courseExamStatus).set({ round, attemptsUsed: attemptsUsed + 1, extraAttempts, cooldownUntil: null, updatedAt: new Date() }).where(statusWhere(userId, course.slug))
    return { id: attempt.id, resumed: false }
  })
}

/**
 * After a certificate has expired and its renewal window has closed, the learner starts again: course
 * completion is reset and a new round of final-exam attempts opens. Their notes and written work stay.
 */
export async function restartCourse(userId: string, course: CourseConfig) {
  const [status, cert] = await Promise.all([statusRow(userId, course.slug), certificateFor(userId, course.slug)])
  if (!status?.passedAt || !restartAllowed(cert, course)) throw new ExamError("You can only start again after your certificate has expired and its renewal window has closed.", 409, "NO_RESTART")
  await db.update(courseExamStatus).set({ passedAt: null, passedAttemptId: null, round: status.round + 1, attemptsUsed: 0, extraAttempts: 0, cooldownUntil: null, updatedAt: new Date(), history: logEntry(entry("learner", "restarted", "Certificate expired past the renewal window; course started again")) }).where(statusWhere(userId, course.slug))
  await resetCourseCompletion(userId, course.slug)
}

async function ownAttempt(userId: string, slug: string, id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ExamError("Attempt not found.", 404, "NOT_FOUND")
  const [a] = await db.select().from(courseExamAttempts).where(and(eq(courseExamAttempts.id, id), eq(courseExamAttempts.userId, userId), eq(courseExamAttempts.courseSlug, slug))).limit(1)
  if (!a) throw new ExamError("Attempt not found.", 404, "NOT_FOUND")
  return a
}

/** The open paper for the learner's browser: questions and options only. */
export async function getAttemptView(userId: string, course: CourseConfig, id: string) {
  const a = await ownAttempt(userId, course.slug, id)
  if (a.submittedAt) throw new ExamError("This attempt has ended.", 409, "ENDED")
  const bank = await getExamBank(course.slug)
  return { id: a.id, kind: a.kind as ExamKind, attemptNo: a.attemptNo, expiresAt: a.expiresAt.toISOString(), timed: a.timeLimitSeconds > 0, questions: viewPaper(a.paper as PaperItem[], bank), answers: a.answers as Record<string, number> }
}

export async function saveAnswers(userId: string, slug: string, id: string, answers: unknown) {
  const a = await ownAttempt(userId, slug, id)
  if (a.submittedAt || a.expiresAt.getTime() + GRACE_MS < Date.now()) throw new ExamError("This attempt has ended.", 409, "ENDED")
  const clean = sanitizeAnswers(answers, a.total)
  await db.update(courseExamAttempts).set({ answers: clean }).where(and(eq(courseExamAttempts.id, id), isNull(courseExamAttempts.submittedAt)))
  return { saved: Object.keys(clean).length }
}

/**
 * Grades and closes an attempt once.
 * Final exam: a pass records the pass; using the last attempt of a round starts the cooldown and resets completion.
 * Renewal exam: a pass moves the certificate's expiry forward by the validity period.
 */
export async function finishAttempt(userId: string, course: CourseConfig, id: string, answers: unknown, reason: "submitted" | "time_expired") {
  const exam = course.finalExam!
  const bank = await getExamBank(course.slug)
  const outcome = await db.transaction(async (tx) => {
    const [a] = await tx.select().from(courseExamAttempts).where(and(eq(courseExamAttempts.id, id), eq(courseExamAttempts.userId, userId), eq(courseExamAttempts.courseSlug, course.slug))).for("update")
    if (!a) throw new ExamError("Attempt not found.", 404, "NOT_FOUND")
    if (a.submittedAt) return { attempt: a, roundFailed: false, renewedUntil: null as Date | null }
    const kind = a.kind as ExamKind
    const passPercent = kind === "renewal" ? course.certificate!.renewal.passPercent : exam.passPercent
    const late = a.expiresAt.getTime() + GRACE_MS < Date.now()
    const finalAnswers = !late && answers !== undefined ? sanitizeAnswers(answers, a.total) : (a.answers as Record<string, number>)
    const result = gradePaper(a.paper as PaperItem[], bank, finalAnswers, passPercent)
    const [updated] = await tx.update(courseExamAttempts).set({ answers: finalAnswers, submittedAt: new Date(), correct: result.correct, passed: result.passed, sectionScores: result.sections, endReason: late ? "time_expired" : reason }).where(eq(courseExamAttempts.id, id)).returning()
    const [status] = await tx.select().from(courseExamStatus).where(statusWhere(userId, course.slug)).for("update")
    if (kind === "renewal") {
      if (!result.passed) return { attempt: updated, roundFailed: false, renewedUntil: null }
      const [cert] = await tx.select().from(courseCertificates).where(and(eq(courseCertificates.userId, userId), eq(courseCertificates.courseSlug, course.slug))).for("update")
      if (!cert?.expiresAt || cert.revokedAt) throw new ExamError("Your certificate cannot be renewed.", 409, "NOT_RENEWABLE")
      const until = renewedExpiry(cert.expiresAt, course.certificate!.validityMonths)
      await renewCertificateExpiry(cert.id, until, "system", `Renewal exam passed with ${result.percent}%; valid until ${until.toISOString().slice(0, 10)}`, tx)
      await tx.update(courseExamStatus).set({ updatedAt: new Date(), history: logEntry(entry("system", "renewed", `${result.percent}% on renewal attempt ${a.attemptNo}`)) }).where(statusWhere(userId, course.slug))
      return { attempt: updated, roundFailed: false, renewedUntil: until }
    }
    let roundFailed = false
    if (result.passed) {
      await tx.update(courseExamStatus).set({ passedAt: new Date(), passedAttemptId: id, updatedAt: new Date(), history: logEntry(entry("system", "passed", `${result.percent}% on attempt ${a.attemptNo} of round ${a.round}`)) }).where(statusWhere(userId, course.slug))
    } else if (status && status.round === a.round && status.attemptsUsed >= allowed(status, exam)) {
      roundFailed = true
      const until = new Date(Date.now() + exam.cooldownDays * 24 * 60 * 60 * 1000)
      await tx.update(courseExamStatus).set({ cooldownUntil: until, updatedAt: new Date(), history: logEntry(entry("system", "round-failed", `Round ${a.round} used; completion reset; cooldown until ${until.toISOString().slice(0, 10)}`)) }).where(statusWhere(userId, course.slug))
    }
    return { attempt: updated, roundFailed, renewedUntil: null }
  })
  if (outcome.roundFailed) await resetCourseCompletion(userId, course.slug)
  const a = outcome.attempt
  return { id: a.id, kind: a.kind as ExamKind, percent: a.correct === null ? 0 : Math.floor((a.correct / a.total) * 100), correct: a.correct ?? 0, total: a.total, passed: Boolean(a.passed), sections: (a.sectionScores as ExamResult["sections"]) ?? {}, roundFailed: outcome.roundFailed, renewedUntil: outcome.renewedUntil?.toISOString() ?? null, endReason: a.endReason }
}

export async function hasPassedExam(userId: string, slug: string) {
  const status = await statusRow(userId, slug)
  return Boolean(status?.passedAt)
}

// ── Payment fulfilment for renewals (called inside the webhook transaction) ──

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

export async function grantRenewalAttempts(tx: Tx, userId: string, slug: string, attempts: number, orderId: string) {
  await tx.insert(courseExamStatus).values({ userId, courseSlug: slug }).onConflictDoNothing()
  await tx.update(courseExamStatus).set({ renewalAttemptsLeft: sql`${courseExamStatus.renewalAttemptsLeft} + ${attempts}`, updatedAt: new Date(), history: logEntry(entry("payment", "renewal-purchased", `Order ${orderId}: ${attempts} renewal attempts`)) }).where(statusWhere(userId, slug))
}

/** A refunded renewal removes up to its attempts that are still unused. Attempts already taken stay used. */
export async function revokeRenewalAttempts(userId: string, slug: string, attempts: number, orderId: string, reason: string) {
  await db.update(courseExamStatus).set({ renewalAttemptsLeft: sql`greatest(${courseExamStatus.renewalAttemptsLeft} - ${attempts}, 0)`, updatedAt: new Date(), history: logEntry(entry("payment", "renewal-refunded", `Order ${orderId}: ${reason}`)) }).where(statusWhere(userId, slug))
}

// ── Admin support actions ──

export async function adminExamLookup(userId: string, slug: string) {
  const status = await statusRow(userId, slug)
  const attempts = await db.select({ id: courseExamAttempts.id, kind: courseExamAttempts.kind, round: courseExamAttempts.round, attemptNo: courseExamAttempts.attemptNo, startedAt: courseExamAttempts.startedAt, submittedAt: courseExamAttempts.submittedAt, correct: courseExamAttempts.correct, total: courseExamAttempts.total, passed: courseExamAttempts.passed, endReason: courseExamAttempts.endReason, timeLimitSeconds: courseExamAttempts.timeLimitSeconds })
    .from(courseExamAttempts).where(and(eq(courseExamAttempts.userId, userId), eq(courseExamAttempts.courseSlug, slug))).orderBy(desc(courseExamAttempts.startedAt)).limit(50)
  return { status, attempts }
}

export async function adminExamAction(userId: string, slug: string, action: "grant-attempt" | "clear-cooldown" | "grant-renewal", by: string, reason: string, renewalAttempts = 3) {
  await db.insert(courseExamStatus).values({ userId, courseSlug: slug }).onConflictDoNothing()
  const where = statusWhere(userId, slug)
  const log = logEntry(entry(by, action, reason))
  if (action === "grant-attempt") await db.update(courseExamStatus).set({ extraAttempts: sql`${courseExamStatus.extraAttempts} + 1`, cooldownUntil: null, updatedAt: new Date(), history: log }).where(where)
  else if (action === "grant-renewal") await db.update(courseExamStatus).set({ renewalAttemptsLeft: sql`${courseExamStatus.renewalAttemptsLeft} + ${renewalAttempts}`, updatedAt: new Date(), history: log }).where(where)
  else await db.update(courseExamStatus).set({ cooldownUntil: new Date(), updatedAt: new Date(), history: log }).where(where)
  return statusRow(userId, slug)
}
