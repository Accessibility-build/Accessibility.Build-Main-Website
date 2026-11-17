import type { CourseQuestion } from "./types"

export type AnswerConfidence = "low" | "medium" | "high"

export interface ReviewSchedule {
  dueAt: string
  intervalDays: number
  successes: number
  lapses: number
  lastReviewed: string
}

export interface AttemptTiming {
  limitSeconds: number
  elapsedSeconds: number
  paused: boolean
  continuedUntimed: boolean
}

export interface PracticeSession {
  id: string
  edition: string
  title: string
  mode: "exam" | "study"
  ids: string[]
  i: number
  ans: Record<string, number>
  checked: Record<string, boolean>
  flag: Record<string, boolean>
  confidence: Record<string, AnswerConfidence>
  questionVersions: Record<string, string>
  /** Items already encountered before this attempt, measured at its start. */
  priorExposure: Record<string, boolean>
  seen: Record<string, boolean>
  startedAt: string
  limit: number
  left: number
  elapsedSeconds: number
  paused: boolean
  everPaused: boolean
  untimed: boolean
  continuedUntimed: boolean
}

export interface PracticeHistoryEntry {
  id?: string
  edition?: string
  title: string
  date: string
  correct: number
  total: number
  dom: Record<string, [number, number]>
  mode?: "exam" | "study"
  timing?: AttemptTiming
  timingLabel?: string
  repeatedQuestions?: number
  /** Legacy hint inferred from capped history. Do not use it to claim a first-ever attempt. */
  firstAttempt?: boolean
  confidenceLow?: number
  detailSaved?: boolean
}

export interface CourseAttemptSnapshot {
  id: string
  edition: string
  title: string
  mode: "exam" | "study"
  startedAt: string
  finishedAt: string
  timing: AttemptTiming
  ids: string[]
  answers: Record<string, number>
  confidence: Record<string, AnswerConfidence>
  questions: CourseQuestion[]
  repeatedQuestions: number
  correct: number
  total: number
  dom: Record<string, [number, number]>
}

export interface PracticeStart {
  view?: "flashcards" | "topics" | "review" | "history"
  topics?: string[]
  attempt?: string
  session?: string
  mock?: "A" | "B"
}
