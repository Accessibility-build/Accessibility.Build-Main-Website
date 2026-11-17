import "server-only"
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { courseProgress, courseContent } from "@/lib/db/schema"
import type { CourseProgressData, CourseQuestion } from "./types"
import { applyChapterChange, applyPracticeChange, applyStudyChange, publicProgress, validateStudyChange } from "./progress-model"

export { ProgressConflictError, ProgressValidationError } from "./progress-model"

export async function getCourseProgress(userId: string, slug: string): Promise<CourseProgressData> {
  const [row] = await db
    .select({ data: courseProgress.data })
    .from(courseProgress)
    .where(and(eq(courseProgress.userId, userId), eq(courseProgress.courseSlug, slug)))
    .limit(1)
  return publicProgress((row?.data as CourseProgressData) ?? {})
}

/**
 * Create the row before locking it. Concurrent first writes serialize on the unique
 * key, and every later read/modify/write takes this same row lock. A chapter, note,
 * or practice update therefore cannot accidentally replace an unrelated change.
 */
async function changeProgress<T>(userId: string, slug: string, change: (data: CourseProgressData) => { data: CourseProgressData; value: T }): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.insert(courseProgress).values({ userId, courseSlug: slug, data: {} }).onConflictDoNothing({ target: [courseProgress.userId, courseProgress.courseSlug] })
    const where = and(eq(courseProgress.userId, userId), eq(courseProgress.courseSlug, slug))
    const [row] = await tx.select({ data: courseProgress.data }).from(courseProgress).where(where).for("update")
    const result = change((row?.data as CourseProgressData) ?? {})
    await tx.update(courseProgress).set({ data: result.data, updatedAt: new Date() }).where(where)
    return result.value
  })
}

export async function setChapterDone(userId: string, slug: string, key: string, done: boolean) {
  return changeProgress(userId, slug, (current) => {
    const data = applyChapterChange(current, key, done)
    return { data, value: publicProgress(data) }
  })
}

/** Compare-and-swap the practice snapshot; never silently overwrite another device. */
export async function savePracticeState(userId: string, slug: string, practice: unknown, baseRevision: unknown, requestId: unknown) {
  return changeProgress(userId, slug, (current) => {
    const { data, revision } = applyPracticeChange(current, practice, baseRevision, requestId)
    return { data, value: { ok: true as const, revision, progress: publicProgress(data) } }
  })
}

/** Study edits merge one item at a time, independently of practice and other notes. */
export async function saveStudyState(userId: string, slug: string, change: unknown, requestId: unknown) {
  const validated = validateStudyChange(change)
  // Inline checks may use drill questions only. Read one entitled-course row,
  // never the whole bank or a caller-supplied answer key.
  let question: CourseQuestion | undefined
  if (validated.kind === "check") {
    const [row] = await db.select({ data: courseContent.data }).from(courseContent)
      .where(and(eq(courseContent.courseSlug, slug), eq(courseContent.kind, "question"), eq(courseContent.key, validated.questionId))).limit(1)
    question = row?.data as CourseQuestion | undefined
  }
  return changeProgress(userId, slug, (current) => {
    const { data, revision } = applyStudyChange(current, validated, requestId, new Date().toISOString(), question)
    return { data, value: { ok: true as const, revision, progress: publicProgress(data) } }
  })
}
