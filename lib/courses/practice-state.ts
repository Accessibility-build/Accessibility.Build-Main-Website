import type { CourseFlashcard, CourseProgressData, CourseQuestion } from "./types"
import type { AnswerConfidence, CourseAttemptSnapshot, PracticeHistoryEntry, PracticeSession, ReviewSchedule } from "./practice-types"

const DAY = 86_400_000
const INTERVALS = [1, 3, 7, 14, 30, 60]

/** Repeating an answer in one sitting cannot establish delayed recall. */
export function scheduleReview(previous: ReviewSchedule | undefined, correct: boolean, confidence: AnswerConfidence, now = new Date()): ReviewSchedule {
  const delayed = !previous || now.getTime() - Date.parse(previous.lastReviewed) >= 20 * 60 * 60 * 1000
  const reliable = correct && confidence === "high"
  const successes = reliable ? Math.min(6, (previous?.successes ?? 0) + (delayed ? 1 : 0)) : 0
  const intervalDays = reliable ? INTERVALS[Math.max(0, successes - 1)] : 1
  return {
    dueAt: new Date(now.getTime() + intervalDays * DAY).toISOString(),
    intervalDays,
    successes,
    lapses: (previous?.lapses ?? 0) + (correct ? 0 : 1),
    lastReviewed: now.toISOString(),
  }
}

export function isReviewDue(schedule: ReviewSchedule | undefined, now = Date.now()) {
  return !schedule || !Number.isFinite(Date.parse(schedule.dueAt)) || Date.parse(schedule.dueAt) <= now
}

export function flashcardId(card: CourseFlashcard, _index?: number): string {
  // Content loading supplies a stable ID. The fallback is content-derived, never the position.
  if (card.id) return card.id
  let hash = 2166136261
  for (const char of `${card.ref}|${card.f}|${card.b}`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return `legacy-card-${(hash >>> 0).toString(36)}`
}

export function migrateCardMarks(cards: CourseProgressData["cards"], flashcards: CourseFlashcard[]): Record<string, 0 | 1> {
  const result: Record<string, 0 | 1> = {}
  flashcards.forEach((card, index) => {
    const id = flashcardId(card, index)
    const legacy = card.legacyIndex
    // Only a server-supplied legacy mapping is safe after an edition changes.
    const mark = cards?.[id] ?? (legacy === undefined ? undefined : cards?.[String(legacy)])
    if (mark === 0 || mark === 1) result[id] = mark
  })
  return result
}

export function questionVersion(question: CourseQuestion): string {
  if (question.version) return question.version
  let hash = 2166136261
  const text = JSON.stringify([question.stem, question.code ?? "", question.options, question.answer, question.exp])
  for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return (hash >>> 0).toString(36)
}

export function drillQuestions(questions: CourseQuestion[], sections?: string[]) {
  return questions.filter((q) => q.set === "drill" && (!sections?.length || sections.includes(q.sec)))
}

export function shuffle<T>(items: T[], random = Math.random): T[] {
  const result = items.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function selectQuickQuestions(questions: CourseQuestion[], counts: [number, number, number], exposure: Record<string, number> = {}) {
  const drills = drillQuestions(questions)
  return shuffle(counts.flatMap((n, index) => {
    const pool = shuffle(drills.filter((q) => q.d === index + 1))
    pool.sort((a, b) => (exposure[a.id] ?? 0) - (exposure[b.id] ?? 0))
    return pool.slice(0, n)
  })).map((q) => q.id)
}

export function makeSession(input: { title: string; mode: "exam" | "study"; ids: string[]; limit?: number; edition: string; questions: CourseQuestion[]; exposure?: Record<string, number> }, now = new Date()): PracticeSession {
  const bank = new Map(input.questions.map((q) => [q.id, q]))
  const ids = [...new Set(input.ids)].filter((id) => bank.has(id))
  return {
    id: crypto.randomUUID(), edition: input.edition, title: input.title, mode: input.mode,
    ids, i: 0, ans: {}, checked: {}, flag: {}, confidence: {}, seen: {},
    questionVersions: Object.fromEntries(ids.map((id) => [id, questionVersion(bank.get(id)!)])),
    priorExposure: Object.fromEntries(ids.map((id) => [id, Boolean(input.exposure?.[id])])),
    startedAt: now.toISOString(), limit: input.limit ?? 0, left: input.limit ?? 0,
    elapsedSeconds: 0, paused: false, everPaused: false, untimed: !input.limit, continuedUntimed: false,
  }
}

/** Old sessions remain usable when their question IDs still exist. New sessions additionally detect edits. */
export function reconcileSession(raw: unknown, questions: CourseQuestion[], edition: string): { session: PracticeSession | null; changed: string[] } {
  if (!raw || typeof raw !== "object") return { session: null, changed: [] }
  const old = raw as Partial<PracticeSession>
  if (!Array.isArray(old.ids) || !old.ids.every((id) => typeof id === "string") || !old.ids.length) return { session: null, changed: [] }
  const bank = new Map(questions.map((q) => [q.id, q]))
  const changed = old.ids.filter((id) => !bank.has(id) || Boolean(old.questionVersions?.[id] && old.questionVersions[id] !== questionVersion(bank.get(id)!)))
  const session: PracticeSession = {
    id: old.id || crypto.randomUUID(), edition: old.edition || edition, title: old.title || "Saved practice",
    mode: old.mode === "exam" ? "exam" : "study", ids: old.ids, i: Math.min(Math.max(0, old.i || 0), old.ids.length - 1),
    ans: old.ans || {}, checked: old.checked || {}, flag: old.flag || {}, confidence: old.confidence || {},
    questionVersions: old.questionVersions || {}, priorExposure: old.priorExposure || {}, seen: old.seen || {},
    startedAt: old.startedAt || new Date().toISOString(), limit: old.limit || 0,
    left: Math.max(0, old.left ?? old.limit ?? 0), elapsedSeconds: old.elapsedSeconds || 0,
    paused: Boolean(old.paused), everPaused: Boolean(old.everPaused || old.paused), untimed: old.untimed ?? !old.limit,
    continuedUntimed: Boolean(old.continuedUntimed),
  }
  return { session, changed }
}

export function timingLabel(timing: CourseAttemptSnapshot["timing"]) {
  const base = timing.limitSeconds ? `${Math.round(timing.limitSeconds / 60)}-minute timer` : "Untimed"
  return `${base}${timing.paused ? "; paused" : ""}${timing.continuedUntimed ? "; continued after time" : ""}`
}

export function finishSnapshot(session: PracticeSession, questions: CourseQuestion[], now = new Date()): CourseAttemptSnapshot {
  const bank = new Map(questions.map((q) => [q.id, q]))
  const snapshots = session.ids.map((id) => bank.get(id)).filter((q): q is CourseQuestion => Boolean(q))
  const dom: Record<string, [number, number]> = {}
  let correct = 0
  snapshots.forEach((q) => {
    const ok = session.ans[q.id] === q.answer
    dom[q.d] ??= [0, 0]
    dom[q.d][1]++
    if (ok) { dom[q.d][0]++; correct++ }
  })
  return {
    id: session.id, edition: session.edition, title: session.title, mode: session.mode,
    startedAt: session.startedAt, finishedAt: now.toISOString(),
    timing: { limitSeconds: session.limit, elapsedSeconds: Math.round(session.elapsedSeconds), paused: session.everPaused, continuedUntimed: session.continuedUntimed },
    ids: snapshots.map((q) => q.id), answers: { ...session.ans }, confidence: { ...session.confidence },
    questions: structuredClone(snapshots), repeatedQuestions: snapshots.filter((q) => session.priorExposure[q.id]).length,
    correct, total: snapshots.length, dom,
  }
}

export function historyEntry(attempt: CourseAttemptSnapshot, _previous: PracticeHistoryEntry[], detailSaved = false): PracticeHistoryEntry {
  return {
    id: attempt.id, title: attempt.title, edition: attempt.edition, date: attempt.finishedAt.slice(0, 10),
    correct: attempt.correct, total: attempt.total, dom: attempt.dom, mode: attempt.mode,
    timing: attempt.timing, timingLabel: timingLabel(attempt.timing), repeatedQuestions: attempt.repeatedQuestions,
    // Recent progress is capped; absence here cannot prove a first-ever attempt.
    confidenceLow: Object.values(attempt.confidence).filter((value) => value !== "high").length,
    detailSaved,
  }
}
