import { createHash } from "node:crypto"
import type { ActivityState } from "./activity-types"
import type { CourseProgressData, CourseQuestion } from "./types"
import { scheduleReview } from "./practice-state"
import { MAX_PROGRESS_BYTES, MAX_PROGRESS_REQUEST_BYTES, PRACTICE_FIELDS, type CourseStudyProgress, type StudyChange } from "./progress-contract"

type Receipt = { id: string; digest: string; scope: string; revision: number }
type StoredProgress = CourseProgressData & { practiceRevision?: number; study?: CourseStudyProgress; _receipts?: Receipt[] }
type JsonObject = Record<string, unknown>

export class ProgressValidationError extends Error {}
export class ProgressConflictError extends Error {
  constructor(public readonly progress: CourseProgressData, public readonly revision: number) {
    super("Your progress changed in another tab or device. Your unsaved work has been kept; choose which version to continue.")
  }
}

function invalid(message: string): never { throw new ProgressValidationError(message) }
function object(value: unknown, label: string): JsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) invalid(`${label} must be an object`)
  return value as JsonObject
}
function string(value: unknown, max: number, label: string): string {
  if (typeof value !== "string" || value.length > max) invalid(`${label} is too long or invalid`)
  return value
}
function integer(value: unknown, max: number, label: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0 || (value as number) > max) invalid(`${label} is invalid`)
  return value as number
}
function key(value: unknown): string {
  const result = string(value, 160, "Item identifier")
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_.:-]*$/.test(result) || ["constructor", "prototype", "__proto__"].includes(result)) invalid("Item identifier is invalid")
  return result
}
function keysOnly(value: JsonObject, allowed: string[]) {
  if (Object.keys(value).some((name) => !allowed.includes(name))) invalid("Unexpected progress field")
}
function safeJson(value: unknown, maxBytes: number) {
  const visit = (item: unknown, depth: number) => {
    if (depth > 12) invalid("Progress is too deeply nested")
    if (typeof item === "number" && !Number.isFinite(item)) invalid("Progress contains an invalid number")
    if (typeof item === "string" && item.length > 48000) invalid("A progress field is too long")
    if (item === undefined || typeof item === "function" || typeof item === "bigint") invalid("Progress must contain JSON values")
    if (item && typeof item === "object") {
      for (const [name, child] of Object.entries(item)) {
        if (["__proto__", "constructor", "prototype"].includes(name)) invalid("Invalid progress key")
        visit(child, depth + 1)
      }
    }
  }
  visit(value, 0)
  if (Buffer.byteLength(JSON.stringify(value), "utf8") > maxBytes) invalid("Progress is too large to save")
}
function dictionary(value: unknown, label: string, limit: number, validate: (item: unknown) => void) {
  const entries = Object.entries(object(value, label))
  if (entries.length > limit) invalid(`${label} has too many items`)
  for (const [name, item] of entries) { key(name); validate(item) }
}
function strings(value: unknown, label: string, maxItems: number, maxLength = 160): string[] {
  if (!Array.isArray(value) || value.length > maxItems) invalid(`${label} has too many items or is invalid`)
  return value.map((item) => string(item, maxLength, label))
}

/** Only practice-owned fields are ever replaceable by the practice client. */
export function validatePractice(value: unknown): CourseProgressData {
  const state = object(value, "Practice state")
  keysOnly(state, [...PRACTICE_FIELDS])
  safeJson(state, MAX_PROGRESS_REQUEST_BYTES - 1024)
  if (state.history !== undefined) {
    if (!Array.isArray(state.history) || state.history.length > 60) invalid("Practice history must contain at most 60 attempts")
    for (const entry of state.history) {
      const attempt = object(entry, "Attempt")
      string(attempt.title, 200, "Attempt title"); string(attempt.date, 40, "Attempt date")
      const total = integer(attempt.total, 1000, "Attempt total")
      integer(attempt.correct, total, "Attempt score")
      const domains = object(attempt.dom, "Domain scores")
      for (const [domain, score] of Object.entries(domains)) {
        if (!["1", "2", "3"].includes(domain) || !Array.isArray(score) || score.length !== 2) invalid("Domain score is invalid")
        integer(score[0], integer(score[1], total, "Domain total"), "Domain score")
      }
    }
  }
  for (const field of ["missed", "exposure"] as const) if (state[field] !== undefined) dictionary(state[field], field, 3000, (n) => { integer(n, 1000000, field) })
  if (state.cards !== undefined) dictionary(state.cards, "Flashcards", 3000, (n) => { integer(n, 1, "Flashcard mark") })
  for (const field of ["cardReview", "questionReview"] as const) if (state[field] !== undefined) dictionary(state[field], field, 3000, (review) => {
    const item = object(review, "Review")
    keysOnly(item, ["dueAt", "intervalDays", "successes", "lapses", "lastReviewed"])
    for (const date of [item.dueAt, item.lastReviewed]) if (typeof date !== "string" || date.length > 40 || !Number.isFinite(Date.parse(date))) invalid("Review date is invalid")
    if (typeof item.intervalDays !== "number" || !Number.isFinite(item.intervalDays) || item.intervalDays < 0 || item.intervalDays > 36500) invalid("Review interval is invalid")
    integer(item.successes, 1000000, "Review successes"); integer(item.lapses, 1000000, "Review lapses")
  })
  if (state.edition !== undefined) string(state.edition, 80, "Course edition")
  const session = (input: unknown) => {
    const s = object(input, "Session")
    string(s.title, 200, "Session title")
    if (!["exam", "study"].includes(String(s.mode))) invalid("Session mode is invalid")
    strings(s.ids, "Session questions", 1000).forEach(key)
    if (s.ans !== undefined) dictionary(s.ans, "Answers", 1000, (n) => { integer(n, 3, "Answer") })
    for (const name of ["flag", "checked", "priorExposure", "seen"] as const) if (s[name] !== undefined) dictionary(s[name], name, 1000, (v) => { if (typeof v !== "boolean") invalid("Session state is invalid") })
    if (s.confidence !== undefined) dictionary(s.confidence, "Confidence", 1000, (v) => { if (!["low", "medium", "high"].includes(String(v))) invalid("Answer confidence is invalid") })
    for (const name of ["limit", "left", "elapsedSeconds"] as const) if (s[name] !== undefined && (typeof s[name] !== "number" || !Number.isFinite(s[name]) || Number(s[name]) < 0 || Number(s[name]) > 365 * 86400)) invalid("Session timing is invalid")
    safeJson(s, 256 * 1024)
  }
  if (state.session !== undefined && state.session !== null) session(state.session)
  if (state.sessions !== undefined) dictionary(state.sessions, "Saved sessions", 8, session)
  return structuredClone(state) as CourseProgressData
}

function validateSettings(input: unknown) {
  const v = object(input, "Study settings")
  keysOnly(v, ["minutesPerDay", "examDate", "experience"])
  if (!Number.isInteger(v.minutesPerDay) || Number(v.minutesPerDay) < 5 || Number(v.minutesPerDay) > 240) invalid("Choose a daily study time between 5 and 240 minutes")
  if (v.examDate !== undefined && v.examDate !== "" && (typeof v.examDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v.examDate) || !Number.isFinite(Date.parse(v.examDate)))) invalid("Exam date is invalid")
  if (v.experience !== undefined && !["new", "some", "experienced"].includes(String(v.experience))) invalid("Experience choice is invalid")
}

function validateActivity(input: unknown): ActivityState {
  const v = object(input, "Activity")
  keysOnly(v, ["answers", "checked", "code", "reflection", "criteria", "manual", "transfer", "confidence", "completedAt", "version"])
  dictionary(v.answers, "Activity answers", 100, (answer) => { string(answer, 4000, "Activity answer") })
  strings(v.checked, "Checked steps", 100).forEach(key)
  strings(v.criteria, "Criteria", 100, 240)
  strings(v.manual, "Manual checks", 100, 240)
  string(v.reflection, 8000, "Reflection")
  string(v.version, 80, "Activity version")
  if (v.code !== undefined) string(v.code, 24000, "Lab code")
  if (v.transfer !== undefined) string(v.transfer, 8000, "Transfer response")
  if (v.confidence !== undefined && !["low", "medium", "high"].includes(String(v.confidence))) invalid("Confidence is invalid")
  if (v.completedAt !== undefined && (typeof v.completedAt !== "string" || v.completedAt.length > 40 || !Number.isFinite(Date.parse(v.completedAt)))) invalid("Completion date is invalid")
  safeJson(v, 64 * 1024)
  return v as unknown as ActivityState
}

export function validateStudyChange(input: unknown): StudyChange {
  const change = object(input, "Study change")
  switch (change.kind) {
    case "note":
      keysOnly(change, ["kind", "key", "text", "baseRevision"])
      key(change.key); string(change.text, 12000, "Note"); integer(change.baseRevision, Number.MAX_SAFE_INTEGER, "Note revision")
      break
    case "bookmark":
      keysOnly(change, ["kind", "key", "bookmarked"])
      key(change.key); if (typeof change.bookmarked !== "boolean") invalid("Bookmark state is invalid")
      break
    case "location":
      keysOnly(change, ["kind", "chapterKey", "anchor"])
      key(change.chapterKey); if (change.anchor !== undefined && change.anchor !== "") key(change.anchor)
      break
    case "settings":
      keysOnly(change, ["kind", "value", "baseRevision"])
      validateSettings(change.value); integer(change.baseRevision, Number.MAX_SAFE_INTEGER, "Settings revision")
      break
    case "activity":
      keysOnly(change, ["kind", "key", "value", "baseRevision"])
      key(change.key); validateActivity(change.value); integer(change.baseRevision, Number.MAX_SAFE_INTEGER, "Activity revision")
      break
    case "check":
      keysOnly(change, ["kind", "questionId", "answer", "confidence", "baseRevision"])
      key(change.questionId); integer(change.answer, 3, "Answer")
      integer(change.baseRevision, Number.MAX_SAFE_INTEGER, "Question review revision; refresh the lesson to save")
      if (!["low", "medium", "high"].includes(String(change.confidence))) invalid("Answer confidence is invalid")
      break
    default: invalid("Unknown study change")
  }
  safeJson(change, 70 * 1024)
  return structuredClone(change) as unknown as StudyChange
}

export function publicProgress(input: CourseProgressData): CourseProgressData {
  const progress = { ...input } as StoredProgress
  delete progress._receipts
  return progress as CourseProgressData
}

function receipt(data: StoredProgress, requestId: string, payload: unknown, scope: string, currentRevision: number, event = false): { repeated: boolean; digest: string } {
  if (!/^[a-zA-Z0-9_.:-]{8,100}$/.test(requestId)) invalid("A valid request identifier is required")
  const digest = createHash("sha256").update(JSON.stringify(payload)).digest("hex")
  const seen = data._receipts?.find((r) => r.id === requestId)
  if (seen) {
    if (seen.digest !== digest || seen.scope !== scope) invalid("A request identifier cannot be reused for different changes")
    if (!event && seen.revision !== currentRevision) throw new ProgressConflictError(publicProgress(data), currentRevision)
    return { repeated: true, digest }
  }
  return { repeated: false, digest }
}
function remember(data: StoredProgress, id: string, digest: string, scope: string, revision: number): StoredProgress {
  const result = { ...data, _receipts: [...(data._receipts ?? []), { id, digest, scope, revision }].slice(-80) }
  safeJson(result, MAX_PROGRESS_BYTES)
  return result
}

export function applyPracticeChange(current: CourseProgressData, input: unknown, baseRevision: unknown, requestId: unknown): { data: CourseProgressData; revision: number } {
  const state = validatePractice(input)
  const expected = integer(baseRevision, Number.MAX_SAFE_INTEGER, "Practice revision; refresh the course to save")
  const id = string(requestId, 100, "Request identifier")
  const data = current as StoredProgress
  const revision = data.practiceRevision ?? 0
  const acknowledged = receipt(data, id, { state, baseRevision: expected }, "practice", revision)
  if (acknowledged.repeated) return { data, revision }
  if (expected !== revision) throw new ProgressConflictError(publicProgress(data), revision)
  const next = { ...data, ...state, practiceRevision: revision + 1 }
  return { data: remember(next, id, acknowledged.digest, "practice", revision + 1), revision: revision + 1 }
}

export function applyStudyChange(current: CourseProgressData, input: unknown, requestId: unknown, now = new Date().toISOString(), question?: Pick<CourseQuestion, "id" | "set" | "answer">): { data: CourseProgressData; revision: number } {
  const change = validateStudyChange(input)
  const id = string(requestId, 100, "Request identifier")
  const data = current as StoredProgress
  const study: CourseStudyProgress = structuredClone(data.study ?? {})
  const scope = change.kind === "check" ? `check:${change.questionId}` : change.kind === "note" || change.kind === "activity" ? `${change.kind}:${change.key}` : change.kind === "bookmark" ? `bookmark:${change.key}` : change.kind
  const revision = study.revisions?.[scope] ?? 0
  const acknowledged = receipt(data, id, change, scope, revision, change.kind === "check")
  if (acknowledged.repeated) return { data, revision }
  // Check revisions are retained per question even after the bounded receipt log
  // expires. A very old retry must conflict, never become a fresh retrieval event.
  if ("baseRevision" in change && change.baseRevision !== revision) throw new ProgressConflictError(publicProgress(data), revision)
  switch (change.kind) {
    case "note":
      study.notes = { ...study.notes, [change.key]: change.text }
      break
    case "bookmark": {
      const set = new Set(study.bookmarks ?? [])
      if (change.bookmarked) set.add(change.key); else set.delete(change.key)
      study.bookmarks = [...set]
      break
    }
    case "location":
      study.lastLocation = { chapterKey: change.chapterKey, ...(change.anchor ? { anchor: change.anchor } : {}), updatedAt: now }
      break
    case "settings": study.settings = change.value; break
    case "activity": study.activities = { ...study.activities, [change.key]: change.value }; break
    case "check": {
      if (!question || question.id !== change.questionId || question.set !== "drill") invalid("This question is not available as a lesson check. Reserved mock questions stay in the exam area.")
      integer(question.answer, 3, "Question answer key")
      const correct = change.answer === question.answer
      const review = scheduleReview(data.questionReview?.[question.id], correct, change.confidence, new Date(now))
      const missed = { ...data.missed }
      if (!correct || change.confidence !== "high") missed[question.id] = (missed[question.id] ?? 0) + 1
      else if (review.successes >= 2) delete missed[question.id]
      study.revisions = { ...study.revisions, [scope]: revision + 1 }
      const next = {
        ...data, study,
        questionReview: { ...data.questionReview, [question.id]: review },
        exposure: { ...data.exposure, [question.id]: (data.exposure?.[question.id] ?? 0) + 1 },
        missed,
        practiceRevision: (data.practiceRevision ?? 0) + 1,
      }
      return { data: remember(next, id, acknowledged.digest, scope, revision + 1), revision: revision + 1 }
    }
  }
  if (Object.keys(study.notes ?? {}).length > 200 || Object.keys(study.activities ?? {}).length > 200 || (study.bookmarks?.length ?? 0) > 200) invalid("The course has too many saved study items")
  study.revisions = { ...study.revisions, [scope]: revision + 1 }
  return { data: remember({ ...data, study }, id, acknowledged.digest, scope, revision + 1), revision: revision + 1 }
}

export function applyChapterChange(current: CourseProgressData, chapterKey: unknown, done: unknown): CourseProgressData {
  const chapter = key(chapterKey)
  if (typeof done !== "boolean") invalid("Lesson completion must be true or false")
  const completed = new Set(current.chaptersDone ?? [])
  if (done) completed.add(chapter); else completed.delete(chapter)
  if (completed.size > 200) invalid("Too many completed lessons")
  const result = { ...current, chaptersDone: [...completed] }
  safeJson(result, MAX_PROGRESS_BYTES)
  return result
}

/**
 * After a final-exam round is used up, the learner works through the course again. Lesson completion
 * and activity completion (decisions, checks, attestations, transfer, confidence) are cleared; the
 * learner's own notes, bookmarks, written explanations and code are kept. Each activity's revision is
 * bumped so an open tab cannot silently restore the old completed state.
 */
export function applyCompletionReset(current: CourseProgressData): CourseProgressData {
  const study: CourseStudyProgress = structuredClone(current.study ?? {})
  const revisions = { ...study.revisions }
  const activities: NonNullable<CourseStudyProgress["activities"]> = {}
  for (const [key, state] of Object.entries(study.activities ?? {})) {
    activities[key] = { version: state.version, answers: {}, checked: [], reflection: state.reflection ?? "", criteria: [], manual: [], ...(state.code !== undefined ? { code: state.code } : {}) }
    revisions[`activity:${key}`] = (revisions[`activity:${key}`] ?? 0) + 1
  }
  return { ...current, chaptersDone: [], study: { ...study, activities, revisions } }
}
