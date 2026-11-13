// Derived views of a course for the course shell, dashboard and lesson pages.
import type { CourseBlock, CourseChapterIndexEntry, CourseMeta, CourseProgressData } from "./types"

export interface OutlinePart {
  title: string
  lessons: Array<CourseChapterIndexEntry & { done: boolean }>
  doneCount: number
}

export interface CourseOutline {
  parts: OutlinePart[]
  total: number
  doneCount: number
  percent: number
  next: CourseChapterIndexEntry | null
  totalMinutes: number
}

export function buildOutline(meta: CourseMeta, progress: CourseProgressData): CourseOutline {
  const done = new Set(progress.chaptersDone ?? [])
  const byKey = new Map(meta.chapters.map((c) => [c.key, c]))
  const parts = meta.parts.map((p) => {
    const lessons = p.chapters
      .map((k) => byKey.get(k))
      .filter((c): c is CourseChapterIndexEntry => Boolean(c))
      .map((c) => ({ ...c, done: done.has(c.key) }))
    return { title: p.title, lessons, doneCount: lessons.filter((l) => l.done).length }
  })
  const total = meta.chapters.length
  const doneCount = meta.chapters.filter((c) => done.has(c.key)).length
  return {
    parts,
    total,
    doneCount,
    percent: total ? Math.round((doneCount / total) * 100) : 0,
    next: meta.chapters.find((c) => !done.has(c.key)) ?? null,
    totalMinutes: meta.chapters.reduce((n, c) => n + (c.readingMinutes ?? 0), 0),
  }
}

export function formatMinutes(m: number | undefined): string {
  if (!m) return ""
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const r = m % 60
  return r ? `${h} h ${r} min` : `${h} h`
}

/** Headings shown in a lesson's "On this page" list. Ids match ChapterBlocks. */
export function lessonHeadings(blocks: CourseBlock[], idPrefix: string): Array<{ id: string; text: string }> {
  const out: Array<{ id: string; text: string }> = []
  blocks.forEach((b, i) => {
    if (b.type === "h2") out.push({ id: `${idPrefix}-${i}`, text: b.text.replace(/\*\*/g, "") })
    if (b.type === "keyterms") out.push({ id: `${idPrefix}-${i}`, text: "Key terms" })
  })
  return out
}

/** Practice sections a lesson maps to, from its outline reference (for example "I.C, I.F" or "I.BC.6"). */
export function lessonSections(outlineRef: string, meta: CourseMeta): Array<{ ref: string; title: string }> {
  const refs = outlineRef.match(/\b(?:I{1,3})\.[A-Z]{1,2}(?:\.\d{1,2})?\b/g) ?? []
  const found = new Map<string, string>()
  for (const r of refs) {
    const match = meta.sections
      .filter((s) => r === s.ref || r.startsWith(`${s.ref}.`) || s.ref.startsWith(`${r}.`))
      .sort((a, b) => b.ref.length - a.ref.length)
    const exact = match.find((s) => s.ref === r) ?? match.find((s) => r.startsWith(`${s.ref}.`))
    const list = exact ? [exact] : match
    for (const s of list) found.set(s.ref, s.title)
  }
  return [...found].map(([ref, title]) => ({ ref, title }))
}

export interface PracticeSummary {
  answeredSessions: number
  bestMock: Record<string, number | null>
  lastMock: { title: string; correct: number; total: number } | null
  cardsKnown: number
}

export function practiceSummary(progress: CourseProgressData): PracticeSummary {
  const history = progress.history ?? []
  const best = (title: string) => {
    const scores = history.filter((h) => h.title === title && h.total).map((h) => Math.round((100 * h.correct) / h.total))
    return scores.length ? Math.max(...scores) : null
  }
  const mocks = history.filter((h) => h.title.startsWith("Mock Exam"))
  return {
    answeredSessions: history.length,
    bestMock: { A: best("Mock Exam A"), B: best("Mock Exam B") },
    lastMock: mocks.length ? mocks[mocks.length - 1] : null,
    cardsKnown: Object.values(progress.cards ?? {}).filter((v) => v === 1).length,
  }
}
