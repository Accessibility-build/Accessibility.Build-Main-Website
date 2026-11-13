import "server-only"
import { and, asc, eq } from "drizzle-orm"
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

export async function getCourseBank(slug: string): Promise<{ questions: CourseQuestion[]; flashcards: CourseFlashcard[] }> {
  const rows = await db
    .select({ kind: courseContent.kind, data: courseContent.data })
    .from(courseContent)
    .where(eq(courseContent.courseSlug, slug))
    .orderBy(asc(courseContent.kind), asc(courseContent.position))
  return {
    questions: rows.filter((r) => r.kind === "question").map((r) => r.data as CourseQuestion),
    flashcards: rows.filter((r) => r.kind === "flashcard").map((r) => r.data as CourseFlashcard),
  }
}
