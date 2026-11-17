import "server-only"
import { and, eq, desc, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { courseAttempts } from "@/lib/db/schema"
import type { CourseAttemptSnapshot } from "./practice-types"
import type { PracticeHistoryEntry } from "./practice-types"
import { timingLabel } from "./practice-state"

export async function saveCourseAttempt(userId: string, slug: string, attempt: CourseAttemptSnapshot) {
  await db.insert(courseAttempts).values({ userId, courseSlug: slug, id: attempt.id, data: attempt }).onConflictDoNothing()
  // Idempotent retries return the original immutable snapshot.
  return getCourseAttempt(userId, slug, attempt.id)
}

export async function getCourseAttempt(userId: string, slug: string, id: string): Promise<CourseAttemptSnapshot | null> {
  const [row] = await db.select({ data: courseAttempts.data }).from(courseAttempts)
    .where(and(eq(courseAttempts.userId, userId), eq(courseAttempts.courseSlug, slug), eq(courseAttempts.id, id))).limit(1)
  return (row?.data as CourseAttemptSnapshot) ?? null
}

export async function listCourseAttempts(userId: string, slug: string, offset = 0) {
  const rows = await db.select({ id: courseAttempts.id, summary: sql<Omit<PracticeHistoryEntry, "id">>`jsonb_build_object('title', ${courseAttempts.data}->'title', 'edition', ${courseAttempts.data}->'edition', 'date', ${courseAttempts.data}->'finishedAt', 'mode', ${courseAttempts.data}->'mode', 'correct', ${courseAttempts.data}->'correct', 'total', ${courseAttempts.data}->'total', 'dom', ${courseAttempts.data}->'dom', 'timing', ${courseAttempts.data}->'timing', 'repeatedQuestions', ${courseAttempts.data}->'repeatedQuestions')` })
    .from(courseAttempts).where(and(eq(courseAttempts.userId, userId), eq(courseAttempts.courseSlug, slug)))
    .orderBy(desc(courseAttempts.createdAt), desc(courseAttempts.id)).limit(51).offset(offset)
  return { attempts: rows.slice(0, 50).map(({ id, summary }) => ({ ...summary, id, date: summary.date.slice(0, 10), detailSaved: true, timingLabel: summary.timing ? timingLabel(summary.timing) : "Timing not recorded" })), nextOffset: rows.length > 50 ? offset + 50 : null }
}
