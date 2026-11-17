// Shapes of the course data loaded by scripts/courses/seed-course.mjs.
import type { CourseActivity, CourseSource } from "./activity-types"
import type { CourseStudyProgress } from "./progress-contract"
import type { PracticeHistoryEntry, PracticeSession, ReviewSchedule } from "./practice-types"

export type { CourseSource, CourseActivity } from "./activity-types"

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
  objectiveRefs?: string[]
  outcomes?: string[]
  activityCount?: number
  activityIds?: string[]
  activityVersions?: Record<string, string>
}

export interface CourseChapter extends CourseChapterIndexEntry {
  blocks: CourseBlock[]
  activities?: CourseActivity[]
  sources?: CourseSource[]
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
  activityCount?: number
  changeCount?: number
  codeQuestionCount?: number
  drillQuestionIds?: string[]
  flashcardIds?: string[]
  releaseNotes?: string[]
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
  version?: string
  sourceUrl?: string
  sources?: CourseSource[]
  lessonKey?: string
  objectiveRefs?: string[]
}

export interface CourseFlashcard {
  id?: string
  legacyIndex?: number
  version?: string
  sourceUrl?: string
  sources?: CourseSource[]
  lessonKey?: string
  objectiveRefs?: string[]
  f: string
  b: string
  ref: string
  d: number
}

export interface CourseProgressData {
  chaptersDone?: string[]
  history?: PracticeHistoryEntry[]
  missed?: Record<string, number>
  cards?: Record<string, 0 | 1>
  session?: PracticeSession | null
  sessions?: Record<string, PracticeSession>
  practiceRevision?: number
  study?: CourseStudyProgress
  edition?: string
  exposure?: Record<string, number>
  cardReview?: Record<string, ReviewSchedule>
  questionReview?: Record<string, ReviewSchedule>
}
