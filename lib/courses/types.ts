// Shapes of the course data loaded by scripts/courses/seed-course.mjs.
import type { CourseActivity, CourseSource } from "./activity-types"
import type { CourseStudyProgress } from "./progress-contract"
import type { PracticeHistoryEntry, PracticeSession, ReviewSchedule } from "./practice-types"

export type { CourseSource, CourseActivity } from "./activity-types"

export const COURSE_WIDGET_IDS = ["text-scaling", "caption-styler", "screen-reader-preview", "alt-text-writer", "form-error-designer", "component-states", "heading-outline", "link-text", "contrast-checker", "color-vision", "focus-indicator", "target-size", "text-spacing", "reflow", "reduced-motion", "focus-order", "annotation-overlay"] as const
export type CourseWidgetId = (typeof COURSE_WIDGET_IDS)[number]

export interface AuditElement {
  id: string
  kind: "box" | "text" | "button" | "input" | "icon" | "image" | "bar" | "line"
  x: number
  y: number
  w: number
  h: number
  name?: string
  selectable?: boolean
  text?: string
  placeholder?: string
  value?: string
  fill?: string
  stroke?: string
  strokeWidth?: number
  radius?: number
  color?: string
  size?: number
  weight?: number
  align?: "start" | "middle"
  icon?: string
  pattern?: "stripes" | "dots"
  issue?: { title: string; sc: string; explanation: string }
}

export type CourseBlock =
  | { type: "p" | "h2" | "h3"; text: string }
  | { type: "bullets" | "numbered"; items: string[] }
  | { type: "table"; caption: string; headers: string[]; rows: string[][] }
  | { type: "keyterms"; items: Array<{ term: string; def: string }> }
  | { type: "callout"; kind: "exam-focus" | "memory-aid" | "watch-out" | "today"; title: string; text: string }
  | { type: "code"; caption: string; lang?: string; text: string }
  /** Illustration authored as inline SVG in the private course store. Always shown on white. */
  | { type: "figure"; caption: string; alt: string; svg: string }
  /** Side-by-side "avoid" and "prefer" examples. */
  | { type: "compare"; caption: string; items: Array<{ verdict: "avoid" | "prefer"; label: string; alt: string; note: string; svg: string }> }
  /** "Spot the issues": a screen drawn from simple elements; the learner selects the ones with problems. */
  | { type: "audit"; title: string; intro: string; alt: string; canvas: { w: number; h: number; bg?: string }; elements: AuditElement[] }
  /** Third-party demonstration video, loaded from the host only when the learner presses play. The summary stands in for it. */
  | { type: "video"; provider: "youtube"; videoId: string; title: string; duration: string; credit: string; license: string; url: string; sourceUrl: string; summary: string }
  /** Interactive practice tool rendered by components/courses/widgets. */
  | { type: "widget"; widget: CourseWidgetId; title: string; intro: string; preset?: Record<string, string> }

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
  examQuestionCount?: number
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
  /** "readiness": kept out of lessons and the exam bank, and used only by the readiness check before the final exam. */
  use?: "readiness"
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
