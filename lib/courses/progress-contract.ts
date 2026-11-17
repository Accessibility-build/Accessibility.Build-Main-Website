import type { ActivityState } from "./activity-types"
import type { CourseProgressData } from "./types"

/** Shared request shapes; no credentials or database imports belong in this module. */
export interface CourseStudySettings {
  minutesPerDay: number
  examDate?: string
  experience?: "new" | "some" | "experienced"
}

export interface CourseStudyProgress {
  notes?: Record<string, string>
  bookmarks?: string[]
  lastLocation?: { chapterKey: string; anchor?: string; updatedAt: string }
  settings?: CourseStudySettings
  activities?: Record<string, ActivityState>
  /** Revisions are per editable item, so saving a note cannot conflict with a lab. */
  revisions?: Record<string, number>
}

export type StudyChange =
  | { kind: "note"; key: string; text: string; baseRevision: number }
  | { kind: "bookmark"; key: string; bookmarked: boolean }
  | { kind: "location"; chapterKey: string; anchor?: string }
  | { kind: "settings"; value: CourseStudySettings; baseRevision: number }
  | { kind: "activity"; key: string; value: ActivityState; baseRevision: number }
  | { kind: "check"; questionId: string; answer: number; confidence: "low" | "medium" | "high"; baseRevision: number }

export interface PracticeSaveRequest {
  op: "practice"
  state: CourseProgressData
  baseRevision: number
  requestId: string
}

export interface ProgressSaveResult {
  ok: true
  revision: number
  progress: CourseProgressData
}

export interface ProgressConflictResult {
  error: string
  code: "PROGRESS_CONFLICT"
  revision: number
  progress: CourseProgressData
}

export const MAX_PROGRESS_REQUEST_BYTES = 768 * 1024
export const MAX_PROGRESS_BYTES = 2 * 1024 * 1024
export const PRACTICE_FIELDS = ["history", "missed", "cards", "session", "sessions", "edition", "cardReview", "questionReview", "exposure"] as const
