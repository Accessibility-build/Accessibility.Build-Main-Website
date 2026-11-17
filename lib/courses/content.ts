import "server-only"
import { and, asc, eq, inArray } from "drizzle-orm"
import { createHash } from "node:crypto"
import { cache } from "react"
import { db } from "@/lib/db"
import { courseContent } from "@/lib/db/schema"
import type { CourseChapter, CourseFlashcard, CourseMeta, CourseQuestion } from "./types"

export const getCourseMeta = cache(async (slug: string): Promise<CourseMeta | null> => {
  const [row] = await db
    .select({ data: courseContent.data })
    .from(courseContent)
    .where(and(eq(courseContent.courseSlug, slug), eq(courseContent.kind, "meta"), eq(courseContent.key, "meta")))
    .limit(1)
  return (row?.data as CourseMeta) ?? null
})

export async function getCourseChapter(slug: string, key: string): Promise<CourseChapter | null> {
  const [row] = await db
    .select({ data: courseContent.data })
    .from(courseContent)
    .where(and(eq(courseContent.courseSlug, slug), eq(courseContent.kind, "chapter"), eq(courseContent.key, key)))
    .limit(1)
  return (row?.data as CourseChapter) ?? null
}

export const getCourseBank = cache(async (slug: string): Promise<{ questions: CourseQuestion[]; flashcards: CourseFlashcard[] }> => {
  const rows = await db
    .select({ kind: courseContent.kind, data: courseContent.data })
    .from(courseContent)
    .where(and(eq(courseContent.courseSlug, slug), inArray(courseContent.kind, ["question", "flashcard"])))
    .orderBy(asc(courseContent.kind), asc(courseContent.position))
  return {
    questions: rows.filter((r) => r.kind === "question").map((r) => {
      const q = r.data as CourseQuestion
      return { ...q, version: q.version ?? createHash("sha256").update(JSON.stringify([q.stem, q.code, q.options, q.answer, q.exp])).digest("hex").slice(0, 16) }
    }),
    flashcards: rows.filter((r) => r.kind === "flashcard").map((r, i) => {
      const f = r.data as CourseFlashcard
      return { ...f, id: f.id ?? `card-${createHash("sha256").update(JSON.stringify([slug, f.f, f.ref])).digest("hex").slice(0, 16)}`, version: f.version ?? createHash("sha256").update(JSON.stringify([f.f, f.b, f.ref])).digest("hex").slice(0, 16), legacyIndex: f.legacyIndex ?? (!f.id ? i : undefined) }
    }),
  }
})

export const getCourseChapters = cache(async (slug: string): Promise<CourseChapter[]> => {
  const rows = await db.select({ data: courseContent.data }).from(courseContent)
    .where(and(eq(courseContent.courseSlug, slug), eq(courseContent.kind, "chapter"))).orderBy(asc(courseContent.position))
  return rows.map((row) => row.data as CourseChapter)
})
