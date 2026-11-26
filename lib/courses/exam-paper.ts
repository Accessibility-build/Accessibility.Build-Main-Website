// Final exam papers: drawing, rendering without the key, and grading. Pure functions; the server
// stores the paper and the answer key never leaves it.
import { renderVariant, variantTypeForSection, type VariantType } from "./exam-variants"

export interface ExamBankQuestion {
  id: string
  sec: string
  stem: string
  code?: string
  options: string[]
  answer: number
}

/** b = bank question, v = generated variant. o = the order options are shown in (indexes into the source). */
export type PaperItem = { k: "b"; id: string; o: number[] } | { k: "v"; t: VariantType; s: number; o: number[] }

export interface PaperQuestionView {
  n: number
  stem: string
  code?: string
  options: string[]
}

function shuffle<T>(list: T[], random: () => number): T[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Shares a paper of `total` questions across the sections: every section gets the same whole-number
 * share, and what is left over goes one each to randomly chosen different sections. 48 questions over
 * 16 sections is 3 each; over 22 sections it is 2 each plus 4 sections with a third question.
 */
export function spreadCounts(sections: string[], total: number, random: () => number) {
  if (!sections.length) return {}
  const share = Math.floor(total / sections.length)
  const counts = Object.fromEntries(sections.map((s) => [s, share]))
  for (const s of shuffle(sections, random).slice(0, Math.max(0, total - share * sections.length))) counts[s]++
  return counts
}

/**
 * Draws counts[section] questions from each section. Questions this learner saw in earlier attempts
 * are used only when a section runs out of unseen ones. A section with a generated template and at
 * least two questions contributes one freshly generated question. Question and option order are shuffled.
 */
export function buildPaper(input: { bank: ExamBankQuestion[]; counts: Record<string, number>; seen: Set<string>; random: () => number }): PaperItem[] {
  const { bank, counts, seen, random } = input
  const items: PaperItem[] = []
  for (const [sec, n] of Object.entries(counts)) {
    const pool = bank.filter((q) => q.sec === sec)
    const variant = n >= 2 ? variantTypeForSection(sec) : null
    const fromBank = Math.min(pool.length, variant ? n - 1 : n)
    const unseen = shuffle(pool.filter((q) => !seen.has(q.id)), random)
    const reused = shuffle(pool.filter((q) => seen.has(q.id)), random)
    for (const q of [...unseen, ...reused].slice(0, fromBank)) items.push({ k: "b", id: q.id, o: shuffle([0, 1, 2, 3], random) })
    if (variant) items.push({ k: "v", t: variant, s: Math.floor(random() * 2 ** 31), o: shuffle([0, 1, 2, 3], random) })
  }
  return shuffle(items, random)
}

function source(item: PaperItem, byId: Map<string, ExamBankQuestion>) {
  if (item.k === "v") { const v = renderVariant(item.t, item.s); return { stem: v.stem, code: undefined, options: v.options, answer: v.answer, sec: v.sec } }
  const q = byId.get(item.id)
  if (!q) throw new Error(`Exam question ${item.id} is missing from the bank`)
  return { stem: q.stem, code: q.code, options: q.options, answer: q.answer, sec: q.sec }
}

/** What the learner's browser receives: no answer, no section, no source ids. */
export function viewPaper(items: PaperItem[], bank: ExamBankQuestion[]): PaperQuestionView[] {
  const byId = new Map(bank.map((q) => [q.id, q]))
  return items.map((item, i) => {
    const s = source(item, byId)
    return { n: i + 1, stem: s.stem, ...(s.code ? { code: s.code } : {}), options: item.o.map((j) => s.options[j]) }
  })
}

export interface ExamResult {
  correct: number
  total: number
  percent: number
  passed: boolean
  sections: Record<string, { correct: number; total: number }>
}

/** answers maps question position (0-based) to the position of the chosen option as shown. */
export function gradePaper(items: PaperItem[], bank: ExamBankQuestion[], answers: Record<string, number>, passPercent: number): ExamResult {
  const byId = new Map(bank.map((q) => [q.id, q]))
  const sections: ExamResult["sections"] = {}
  let correct = 0
  items.forEach((item, i) => {
    const s = source(item, byId)
    const chosen = answers[String(i)]
    const ok = Number.isInteger(chosen) && item.o[chosen] === s.answer
    sections[s.sec] ??= { correct: 0, total: 0 }
    sections[s.sec].total++
    if (ok) { sections[s.sec].correct++; correct++ }
  })
  const total = items.length
  const percent = total ? Math.floor((correct / total) * 100) : 0
  return { correct, total, percent, passed: total > 0 && correct / total >= passPercent / 100, sections }
}

export function paperQuestionIds(items: PaperItem[]) {
  return items.flatMap((i) => (i.k === "b" ? [i.id] : []))
}

/** Validates answers sent by the browser: position -> option index, within the paper. */
export function sanitizeAnswers(input: unknown, length: number): Record<string, number> {
  const out: Record<string, number> = {}
  if (!input || typeof input !== "object" || Array.isArray(input)) return out
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    const i = Number(k)
    if (Number.isInteger(i) && i >= 0 && i < length && Number.isInteger(v) && (v as number) >= 0 && (v as number) <= 3) out[String(i)] = v as number
  }
  return out
}
