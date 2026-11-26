// Final exam engine: paper drawing, no key in the browser view, grading, generated variants. No database.
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { build } from "esbuild"

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "course-exam-"))
try {
  const bundle = async (entry, name) => { const out = path.join(temp, name); await build({ entryPoints: [entry], outfile: out, bundle: true, platform: "node", format: "esm" }); return import(pathToFileURL(out).href) }
  const paperMod = await bundle("lib/courses/exam-paper.ts", "paper.mjs")
  const variants = await bundle("lib/courses/exam-variants.ts", "variants.mjs")
  const model = await bundle("lib/courses/progress-model.ts", "model.mjs")
  const { buildPaper, viewPaper, gradePaper, paperQuestionIds, sanitizeAnswers, spreadCounts } = paperMod
  const { renderVariant, VARIANT_SECTIONS, ratioOf } = variants

  // A synthetic bank: 16 sections x 8 questions; correct option is index 0 in the source.
  const sections = ["I.A", "I.B", "I.C", "I.D", "I.E", "I.F", "II.A", "II.B", "II.C", "II.D", "II.E", "II.F", "III.A", "III.B", "III.C", "III.D"]
  const bank = sections.flatMap((sec) => Array.from({ length: 8 }, (_, i) => ({ id: `${sec}-${i}`, sec, stem: `Question ${sec} ${i}?`, options: [`right ${sec}${i}`, `wrong a ${sec}${i}`, `wrong b ${sec}${i}`, `wrong c ${sec}${i}`], answer: 0 })))
  let seed = 42; const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

  const paper = buildPaper({ bank, counts: spreadCounts(sections, 48, random), seen: new Set(), random })
  assert.equal(paper.length, 48, "48 questions")
  const perSec = {}
  const view = viewPaper(paper, bank)
  const graded = gradePaper(paper, bank, {}, 80)
  for (const [sec, s] of Object.entries(graded.sections)) perSec[sec] = s.total
  assert.deepEqual(Object.values(perSec), Array(16).fill(3), "3 per section")
  assert.equal(paper.filter((p) => p.k === "v").length, Object.keys(VARIANT_SECTIONS).length, "one generated question per templated section")
  assert.ok(view.every((q) => !("answer" in q) && !("sec" in q) && !("id" in q)), "the browser view carries no key, section or id")
  assert.ok(!JSON.stringify(view).includes('"answer"'))
  assert.ok(view.every((q) => q.options.length === 4 && new Set(q.options).size === 4))

  // Perfect answers pass; a blank paper fails; 80% is the line (39 of 48).
  const perfect = Object.fromEntries(paper.map((item, i) => [String(i), item.o.indexOf(item.k === "b" ? 0 : renderVariant(item.t, item.s).answer)]))
  const best = gradePaper(paper, bank, perfect, 80)
  assert.equal(best.correct, 48); assert.ok(best.passed)
  assert.equal(gradePaper(paper, bank, {}, 80).passed, false)
  const keys = Object.keys(perfect)
  const wrongOne = (n) => Object.fromEntries(keys.map((k, i) => [k, i < n ? (perfect[k] + 1) % 4 : perfect[k]]))
  assert.equal(gradePaper(paper, bank, wrongOne(9), 80).passed, true, "39 of 48 (81%) passes")
  assert.equal(gradePaper(paper, bank, wrongOne(10), 80).passed, false, "38 of 48 (79%) fails")

  // Option order is shuffled per paper, and retakes prefer unseen questions.
  const seen = new Set(paperQuestionIds(paper))
  const second = buildPaper({ bank, counts: spreadCounts(sections, 48, random), seen, random })
  const reused = paperQuestionIds(second).filter((id) => seen.has(id)).length
  assert.equal(reused, 0, "with enough questions, a retake reuses none")
  assert.ok(paper.some((p) => p.o.join() !== "0,1,2,3"), "options are shuffled")

  // Renewal paper: 24 questions, every section at least once, no section more than twice.
  const counts = spreadCounts(sections, 24, random)
  assert.equal(Object.values(counts).reduce((a, b) => a + b, 0), 24)
  assert.ok(Object.values(counts).every((n) => n === 1 || n === 2))
  const renewal = buildPaper({ bank, counts, seen: new Set([...seen, ...paperQuestionIds(second)]), random })
  assert.equal(renewal.length, 24)
  const renewalSecs = gradePaper(renewal, bank, {}, 80).sections
  assert.equal(Object.keys(renewalSecs).length, 16, "every section appears")

  // A course with more sections keeps a 48-question paper: every section two or three times.
  const wide = [...sections, "I.G", "II.G", "II.H", "III.E", "III.F", "III.G"]
  const wideCounts = spreadCounts(wide, 48, random)
  assert.equal(Object.keys(wideCounts).length, 22)
  assert.equal(Object.values(wideCounts).reduce((a, b) => a + b, 0), 48, "48 questions over 22 sections")
  assert.ok(Object.values(wideCounts).every((n) => n === 2 || n === 3), "an even share, then one extra for a few sections")
  assert.equal(Object.values(wideCounts).filter((n) => n === 3).length, 4)
  const wideRenewal = spreadCounts(wide, 24, random)
  assert.equal(Object.values(wideRenewal).reduce((a, b) => a + b, 0), 24)
  assert.ok(Object.values(wideRenewal).every((n) => n === 1 || n === 2), "renewal still reaches every section")
  assert.deepEqual(spreadCounts([], 48, random), {})

  // Readiness check: one question per section in section order, only from the readiness pool.
  const { drawReadiness } = await bundle("lib/courses/readiness.ts", "readiness.mjs")
  const secs = [{ ref: "I.A", domain: 1, title: "A" }, { ref: "I.B", domain: 1, title: "B" }, { ref: "II.A", domain: 2, title: "C" }]
  const rq = (id, sec, use) => ({ id, sec, use, set: "drill", d: 1, secTitle: "", ref: sec, stem: "Q?", options: ["a", "b", "c", "d"], answer: 0, exp: "", page: "" })
  const pool = [rq("r1", "I.A", "readiness"), rq("r2", "I.A", "readiness"), rq("lesson", "I.A"), rq("r3", "II.A", "readiness"), rq("lesson2", "I.B")]
  assert.deepEqual(drawReadiness(pool, secs, () => 0).map((q) => q.id), ["r1", "r3"], "lesson checks are never drawn; a section with no readiness question is skipped")
  assert.deepEqual(drawReadiness(pool, secs, (n) => n - 1).map((q) => q.id), ["r2", "r3"])
  assert.deepEqual(drawReadiness(pool, secs, () => 99).map((q) => q.id), ["r2", "r3"], "an out-of-range pick is clamped")
  assert.deepEqual(drawReadiness([], secs, () => 0), [])

  // Browser answers are sanitized: no out-of-range positions or options.
  assert.deepEqual(sanitizeAnswers({ 0: 1, 1: 7, 99: 2, x: 1, 2: -1, 3: 2.5 }, 48), { 0: 1 })

  // Generated questions: deterministic, four distinct options, and the keyed answer independently correct.
  const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  for (const type of Object.keys(VARIANT_SECTIONS)) {
    for (let s = 1; s <= 400; s++) {
      const q = renderVariant(type, s * 7777)
      assert.deepEqual(q, renderVariant(type, s * 7777), `${type} is deterministic`)
      assert.equal(new Set(q.options).size, 4, `${type} options distinct`)
      assert.ok(q.answer >= 0 && q.answer < 4)
      const right = q.options[q.answer]
      if (type === "contrast-text" || type === "focus-contrast") {
        const [fg, bg] = q.stem.match(/#[0-9A-F]{6}/g).slice(type === "contrast-text" ? 0 : 0, 2).map(hexToRgb)
        const colors = type === "contrast-text" ? [fg, bg] : [bg, fg]
        const r = ratioOf(...colors)
        assert.ok(right.includes(`${(Math.floor(r * 100) / 100).toFixed(2)}:1`), `${type} keyed option states the true ratio`)
        if (type === "contrast-text") {
          const px = Number(q.stem.match(/(\d+) px (bold|regular)/)[1]); const bold = q.stem.includes(" px bold")
          const large = px >= 24 || (bold && px >= 18.67)
          assert.ok(right.includes(large ? "large text needs 3:1" : "normal-size text needs 4.5:1"), "correct size category")
          assert.equal(right.startsWith("It passes"), r >= (large ? 3 : 4.5), "correct verdict")
          assert.ok(Math.abs(r - (large ? 3 : 4.5)) >= 0.19, "never near the threshold")
        } else {
          assert.equal(right.startsWith("It reaches"), r >= 3)
        }
      }
      if (type === "target-size") {
        const [, size, gap] = q.stem.match(/is (\d+) by \d+ CSS px with (\d+) CSS px/).map(Number)
        const expected = size >= 24 ? "at least 24 by 24" : size + gap >= 24 ? "spacing exception" : "circles overlap"
        assert.ok(right.includes(expected), `target ${size}/${gap}`)
      }
      if (type === "text-spacing") {
        const f = Number(q.stem.match(/is (\d+) px/)[1]); const n = (x) => `${Number((x * f).toFixed(2))} px`
        assert.equal(right, `Line height ${n(1.5)}, paragraph spacing ${n(2)}, letter spacing ${n(0.12)}, word spacing ${n(0.16)}`)
      }
      if (type === "reflow-zoom") {
        const w = Number(q.stem.match(/is (\d+) CSS px wide/)[1])
        assert.equal(right, `${Math.round((w / 320) * 100)}%`)
      }
    }
  }

  // Failed round reset: completion cleared, own notes and writing kept, activity revisions bumped.
  const progress = { chaptersDone: ["a", "b"], study: { notes: { a: "My note" }, bookmarks: ["a-1"], activities: { act: { version: "2", answers: { s1: "a" }, checked: ["s1", "transfer"], reflection: "My reasoning here", criteria: ["0"], manual: ["0"], code: "<p>mine</p>", transfer: "0", confidence: "high", completedAt: "2026-11-21T00:00:00Z" } }, revisions: { "activity:act": 4 } } }
  const reset = model.applyCompletionReset(progress)
  assert.deepEqual(reset.chaptersDone, [])
  assert.equal(reset.study.notes.a, "My note"); assert.deepEqual(reset.study.bookmarks, ["a-1"])
  const act = reset.study.activities.act
  assert.equal(act.reflection, "My reasoning here"); assert.equal(act.code, "<p>mine</p>")
  assert.equal(act.completedAt, undefined); assert.equal(act.confidence, undefined); assert.deepEqual(act.checked, [])
  assert.equal(reset.study.revisions["activity:act"], 5)

  console.log("Exam checks passed: 48-question stratified papers, no key in the browser view, 80% pass line, unseen-first retakes, answer sanitizing, 2,000 generated questions verified independently, and the completion reset.")
} finally {
  fs.rmSync(temp, { recursive: true, force: true })
}
