import "server-only"
import { and, eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { courseProgress } from "@/lib/db/schema"
import type { CourseProgressData } from "./types"

const MAX_BYTES = 256 * 1024

export async function getCourseProgress(userId: string, slug: string): Promise<CourseProgressData> {
  const [row] = await db
    .select({ data: courseProgress.data })
    .from(courseProgress)
    .where(and(eq(courseProgress.userId, userId), eq(courseProgress.courseSlug, slug)))
    .limit(1)
  return (row?.data as CourseProgressData) ?? {}
}

async function save(userId: string, slug: string, data: CourseProgressData) {
  const json = JSON.stringify(data)
  if (json.length > MAX_BYTES) throw new Error("Progress data too large")
  await db
    .insert(courseProgress)
    .values({ userId, courseSlug: slug, data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: [courseProgress.userId, courseProgress.courseSlug],
      set: { data: sql`excluded.data`, updatedAt: new Date() },
    })
}

/** Mark a chapter as done or not done. */
export async function setChapterDone(userId: string, slug: string, key: string, done: boolean) {
  const data = await getCourseProgress(userId, slug)
  const set = new Set(data.chaptersDone ?? [])
  if (done) set.add(key)
  else set.delete(key)
  await save(userId, slug, { ...data, chaptersDone: [...set] })
}

/** Replace the practice part of the progress (history, missed, flashcards, open session). */
export async function savePracticeState(userId: string, slug: string, practice: Pick<CourseProgressData, "history" | "missed" | "cards" | "session">) {
  const data = await getCourseProgress(userId, slug)
  const clean: CourseProgressData = {
    ...data,
    history: Array.isArray(practice.history) ? practice.history.slice(-60) : data.history,
    missed: practice.missed && typeof practice.missed === "object" ? practice.missed : data.missed,
    cards: practice.cards && typeof practice.cards === "object" ? practice.cards : data.cards,
    session: practice.session ?? null,
  }
  await save(userId, slug, clean)
}
