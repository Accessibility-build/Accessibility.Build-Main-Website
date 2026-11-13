// Shapes of the course data loaded by scripts/courses/seed-course.mjs.

export type CourseBlock =
  | { type: "p" | "h2" | "h3"; text: string }
  | { type: "bullets" | "numbered"; items: string[] }
  | { type: "table"; caption: string; headers: string[]; rows: string[][] }
  | { type: "keyterms"; items: Array<{ term: string; def: string }> }
  | { type: "callout"; kind: "exam-focus" | "memory-aid" | "watch-out" | "today"; title: string; text: string }
  | { type: "code"; caption: string; lang?: string; text: string }

export interface CourseChapterIndexEntry {
  key: string
  number: number
  title: string
  part: string
  outlineRef: string
  bokPages: string
  /** Estimated reading time, set by the seed script. */
  readingMinutes?: number
}

export interface CourseChapter extends CourseChapterIndexEntry {
  blocks: CourseBlock[]
}

export interface CourseSection {
  ref: string
  domain: number
  title: string
}

export interface CourseMeta {
  slug: string
  edition: string
  built: string
  parts: Array<{ title: string; chapters: string[] }>
  chapters: CourseChapterIndexEntry[]
  sections: CourseSection[]
  questionCount: number
  flashcardCount: number
}

export interface CourseQuestion {
  id: string
  set: "A" | "B" | "drill"
  d: 1 | 2 | 3
  sec: string
  secTitle: string
  ref: string
  stem: string
  /** Optional code snippet shown under the stem (WAS course). */
  code?: string
  options: string[]
  answer: number
  exp: string
  page: string
}

export interface CourseFlashcard {
  f: string
  b: string
  ref: string
  d: number
}

export interface CourseProgressData {
  chaptersDone?: string[]
  history?: Array<{ title: string; date: string; correct: number; total: number; dom: Record<string, [number, number]> }>
  missed?: Record<string, number>
  cards?: Record<string, 0 | 1>
  session?: unknown
}
