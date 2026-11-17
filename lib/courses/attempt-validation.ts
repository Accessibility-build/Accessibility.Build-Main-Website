import { z } from "zod"
import type { CourseAttemptSnapshot } from "./practice-types"

const key = z.string().min(1).max(120).regex(/^[a-zA-Z0-9_.:-]+$/)
const source = z.object({ title: z.string().max(500), url: z.string().url().max(2000).refine((s) => s.startsWith("https://")), version: z.string().max(100).optional(), reviewedAt: z.string().max(100).optional(), context: z.enum(["exam", "practice", "unconfirmed"]).optional() })
const question = z.object({
  id: key, set: z.enum(["A", "B", "drill"]), d: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  sec: z.string().max(100), secTitle: z.string().max(500), ref: z.string().max(500),
  stem: z.string().min(1).max(10000), code: z.string().max(20000).optional(),
  options: z.array(z.string().min(1).max(5000)).length(4), answer: z.number().int().min(0).max(3),
  exp: z.string().max(15000), page: z.string().max(500), version: z.string().max(100).optional(),
  sourceUrl: z.string().url().max(2000).optional(), sources: z.array(source).max(20).optional(),
  lessonKey: key.optional(), objectiveRefs: z.array(z.string().max(100)).max(30).optional(),
})
const schema = z.object({
  id: key, edition: z.string().min(1).max(100), title: z.string().min(1).max(200), mode: z.enum(["exam", "study"]),
  startedAt: z.string().datetime(), finishedAt: z.string().datetime(),
  timing: z.object({ limitSeconds: z.number().finite().min(0).max(86400), elapsedSeconds: z.number().finite().min(0).max(31536000), paused: z.boolean(), continuedUntimed: z.boolean() }),
  ids: z.array(key).min(1).max(1000), answers: z.record(key, z.number().int().min(0).max(3)),
  confidence: z.record(key, z.enum(["low", "medium", "high"])), questions: z.array(question).min(1).max(1000),
  repeatedQuestions: z.number().int().min(0).max(1000),
})

/** Scores are derived from the stored snapshot; caller-supplied totals are ignored. */
export function validateAttempt(value: unknown): CourseAttemptSnapshot {
  const data = schema.parse(value)
  const ids = new Set(data.ids)
  if (ids.size !== data.ids.length || data.questions.length !== ids.size) throw new Error("Question identifiers must be unique and complete.")
  const questions = new Map(data.questions.map((q) => [q.id, q]))
  if (questions.size !== ids.size || data.ids.some((id) => !questions.has(id))) throw new Error("Question snapshots do not match this attempt.")
  if ([...Object.keys(data.answers), ...Object.keys(data.confidence)].some((id) => !ids.has(id))) throw new Error("Answer is outside this attempt.")
  if (Date.parse(data.finishedAt) < Date.parse(data.startedAt)) throw new Error("Attempt dates are out of order.")
  if (data.repeatedQuestions > ids.size) throw new Error("Invalid exposure count.")
  const dom: Record<string, [number, number]> = {}
  let correct = 0
  for (const id of data.ids) {
    const q = questions.get(id)!
    const pair = dom[q.d] ?? (dom[q.d] = [0, 0])
    pair[1]++
    if (data.answers[id] === q.answer) { correct++; pair[0]++ }
  }
  return { ...data, correct, total: data.ids.length, dom }
}
