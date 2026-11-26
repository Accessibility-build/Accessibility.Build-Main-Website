import "server-only"
import { and, eq, inArray } from "drizzle-orm"
import { db } from "@/lib/db"
import { courseCertificates, courseExamStatus, courseProgress } from "@/lib/db/schema"
import { teamReportRow, type TeamReportRow } from "./team-report-model"
import type { CourseMeta, CourseProgressData } from "./types"

/**
 * Completion facts for every seat of a Team licence. The caller must already have checked that the
 * viewer owns the licence. `withExam` adds the final exam and certificate for skills courses.
 */
export async function getTeamReport(slug: string, meta: CourseMeta, seats: Array<{ email: string; userId: string | null }>, withExam: boolean): Promise<TeamReportRow[]> {
  const ids = [...new Set(seats.flatMap((s) => (s.userId ? [s.userId] : [])))]
  if (!ids.length) return seats.map((s) => teamReportRow(meta, { email: s.email, userId: null }))
  const [progressRows, examRows, certRows] = await Promise.all([
    db.select({ userId: courseProgress.userId, data: courseProgress.data }).from(courseProgress).where(and(eq(courseProgress.courseSlug, slug), inArray(courseProgress.userId, ids))),
    withExam ? db.select({ userId: courseExamStatus.userId, passedAt: courseExamStatus.passedAt }).from(courseExamStatus).where(and(eq(courseExamStatus.courseSlug, slug), inArray(courseExamStatus.userId, ids))) : Promise.resolve([]),
    withExam ? db.select({ userId: courseCertificates.userId, code: courseCertificates.code, issuedAt: courseCertificates.issuedAt, expiresAt: courseCertificates.expiresAt, revokedAt: courseCertificates.revokedAt }).from(courseCertificates).where(and(eq(courseCertificates.courseSlug, slug), inArray(courseCertificates.userId, ids))) : Promise.resolve([]),
  ])
  const progress = new Map(progressRows.map((r) => [r.userId, r.data as CourseProgressData]))
  const exam = new Map(examRows.map((r) => [r.userId, r.passedAt]))
  const certs = new Map(certRows.flatMap((r) => (r.userId ? [[r.userId, r] as const] : [])))
  return seats.map((s) => teamReportRow(meta, { email: s.email, userId: s.userId, progress: s.userId ? progress.get(s.userId) : null, examPassedAt: s.userId ? exam.get(s.userId) : null, certificate: s.userId ? certs.get(s.userId) : null }))
}
