// Synthetic course fixtures only. No private paid content or learner records are used.
import assert from "node:assert/strict"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createRequire } from "node:module"
import { build } from "esbuild"
import { JSDOM } from "jsdom"

const require = createRequire(import.meta.url)
const temp = await mkdtemp(join(tmpdir(), "course-practice-test-"))
await build({ entryPoints: ["lib/courses/practice-state.ts", "lib/courses/practice-engine.ts"], bundle: true, platform: "node", format: "cjs", outdir: temp, logLevel: "silent" })
const state = require(join(temp, "practice-state.js"))
const { mountPractice } = require(join(temp, "practice-engine.js"))

const questions = ["A", "B", "drill", "drill"].flatMap((set, group) => [1, 2, 3].map((d) => ({
  id: `${set}-${group}-${d}`, set, d, sec: `${d}.A`, secTitle: `Topic ${d}`, ref: `${d}.A`, page: "1", version: "v1",
  stem: `Synthetic question ${group} in domain ${d}?`, options: ["Answer one", "Answer two", "Answer three", "Answer four"], answer: d % 4,
  exp: "The synthetic explanation identifies the deciding distinction.", lessonKey: `lesson-${d}`,
})))
const sections = [1, 2, 3].map((d) => ({ ref: `${d}.A`, domain: d, title: `Topic ${d}` }))
const flashcards = [{ id: "card-one", legacyIndex: 0, f: "First prompt", b: "First answer", ref: "1.A", d: 1 }, { id: "card-two", legacyIndex: 1, f: "Second prompt", b: "Second answer", ref: "2.A", d: 2 }]

try {
  assert.equal(state.drillQuestions(questions).length, 6)
  for (let n = 0; n < 40; n++) {
    const selected = state.selectQuickQuestions(questions, [1, 1, 1])
    assert.equal(selected.length, 3)
    assert(selected.every((id) => questions.find((q) => q.id === id).set === "drill"), "quick quiz must never expose mock items")
  }
  assert.deepEqual(state.migrateCardMarks({ "0": 1, "1": 0 }, flashcards.slice().reverse()), { "card-two": 0, "card-one": 1 }, "legacy migration follows explicit stable mappings, not current position")
  assert.equal(state.flashcardId({ f: "Prompt", b: "Answer", ref: "I.A", d: 1 }, 0), state.flashcardId({ f: "Prompt", b: "Answer", ref: "I.A", d: 1 }, 99))
  const day1 = new Date("2026-11-01T12:00:00Z")
  const first = state.scheduleReview(undefined, true, "high", day1)
  assert.equal(first.successes, 1)
  const immediate = state.scheduleReview(first, true, "high", new Date("2026-11-01T12:05:00Z"))
  assert.equal(immediate.successes, 1, "same-sitting repeats do not demonstrate delayed recall")
  const later = state.scheduleReview(first, true, "high", new Date("2026-11-02T12:00:00Z"))
  assert.equal(later.successes, 2)
  assert.equal(later.intervalDays, 3)
  assert.equal(state.scheduleReview(later, true, "low", day1).successes, 0, "a guessed correct answer stays eligible for review")
  assert.equal(state.isReviewDue(first, Date.parse("2026-11-01T18:00:00Z")), false)
  assert.equal(state.isReviewDue(first, Date.parse("2026-11-03T00:00:00Z")), true)

  const session = state.makeSession({ title: "Mock Exam A", mode: "exam", ids: questions.filter((q) => q.set === "A").map((q) => q.id), limit: 7200, edition: "1.1", questions, exposure: { "A-0-1": 2 } }, day1)
  assert.equal(state.reconcileSession(session, questions, "1.1").changed.length, 0)
  assert.equal(state.reconcileSession(session, questions.filter((q) => q.id !== "A-0-1"), "1.2").changed.length, 1)
  assert.equal(state.reconcileSession(session, questions.map((q) => q.id === "A-0-1" ? { ...q, version: "v2" } : q), "1.2").changed.length, 1)
  session.ans["A-0-1"] = 1; session.confidence["A-0-1"] = "high"; session.everPaused = true; session.continuedUntimed = true
  const snapshot = state.finishSnapshot(session, questions)
  assert.equal(snapshot.correct, 1)
  assert.equal(snapshot.repeatedQuestions, 1)
  assert.equal(state.historyEntry(snapshot, []).firstAttempt, undefined, "empty recent history cannot prove this is a first-ever attempt")
  assert.match(state.timingLabel(snapshot.timing), /paused.*continued/)
  const oldText = snapshot.questions[0].stem
  const copiedBank = structuredClone(questions)
  const independent = state.finishSnapshot(session, copiedBank)
  copiedBank[0].stem = "Changed after finishing"
  assert.equal(independent.questions[0].stem, oldText, "completed review must retain original question text")

  const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", { url: "https://example.test/courses/example/learn/practice" })
  globalThis.window = dom.window
  globalThis.document = dom.window.document
  globalThis.CustomEvent = dom.window.CustomEvent
  dom.window.scrollTo = () => {}
  dom.window.HTMLDialogElement.prototype.showModal = function () { this.open = true }
  dom.window.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new dom.window.Event("close")) }
  const root = document.querySelector("#root")
  root.innerHTML = '<div data-practice-main></div><div data-practice-live></div><dialog><h2 data-dlg-title tabindex="-1"></h2><div data-dlg-body></div><div data-dlg-btns></div></dialog>'
  let lastSave = null
  const attempts = new Map()
  const routes = []
  let delayLoad = false
  let releaseLoad
  const engine = mountPractice({
    root, slug: "example", edition: "1.1", courseTitle: "Synthetic course",
    exam: { name: "Example", domains: { 1: "One", 2: "Two", 3: "Three" }, weights: [40, 40, 20], mock: [1, 1, 1], quick: [1, 1, 1] },
    bank: { questions, flashcards, sections }, initial: {},
    onSave(value) { lastSave = value }, onRoute(value) { routes.push(value) },
    async onAttempt(value) { attempts.set(value.id, structuredClone(value)); return true },
    async onLoadAttempt(id) { if (delayLoad) return new Promise((resolve) => { releaseLoad = resolve }); if (!attempts.has(id)) throw new Error("missing"); return attempts.get(id) },
    async onListAttempts() { return { attempts: [...attempts.values()].map((attempt) => state.historyEntry(attempt, [], true)), nextOffset: null } },
  })
  const click = (text) => {
    const button = [...root.querySelectorAll("button")].find((b) => b.textContent === text)
    assert(button, `Missing button: ${text}`)
    assert(!button.disabled, `Disabled button: ${text}`)
    button.click()
  }
  assert.equal(root.querySelectorAll(".card-heading svg").length, 6, "each practice activity has a matching SVG icon")
  for (const icon of root.querySelectorAll("svg")) {
    assert.equal(icon.namespaceURI, "http://www.w3.org/2000/svg")
    assert.equal(icon.getAttribute("aria-hidden"), "true", "decorative icons must not duplicate control names")
    assert.equal(icon.getAttribute("focusable"), "false")
    assert.equal(icon.querySelector("title"), null, "button names come from their visible text")
  }
  engine.suspend()
  assert.equal(lastSave, null, "an unchanged practice overview must not create recovery data or increment its revision")
  click("Choose topics")
  assert.equal(root.querySelector("#pool").value, "drill")
  const sectionBox = root.querySelector('input[name="sec"]')
  sectionBox.checked = true
  click("Start practice")
  engine.suspend()
  assert(lastSave.session.ids.every((id) => questions.find((q) => q.id === id).set === "drill"))
  const firstSessionId = lastSave.session.id
  engine.navigate({})
  click("Set up Mock Exam A")
  click("Start Mock Exam A")
  assert(root.querySelector("dialog").open, "starting another activity must ask how to preserve current work")
  engine.suspend()
  assert.equal(lastSave.session.id, firstSessionId, "new session is not created before a learner chooses")
  click("Save it and start another")
  engine.suspend()
  assert(lastSave.sessions[firstSessionId], "archived session retains original answers")
  const examId = lastSave.session.id
  engine.navigate({ session: examId })
  const flagButton = [...root.querySelectorAll("button")].find((button) => button.textContent === "Flag for review")
  flagButton.focus()
  click("Flag for review")
  assert.equal(document.activeElement.textContent, "Flag for review", "adding an icon must not break focus restoration after flagging")
  click("Question list")
  const flaggedQuestion = root.querySelector('.navlist button[aria-current="true"]')
  assert.equal(flaggedQuestion.textContent, "1", "a flagged question keeps its visible numeric label without a Unicode icon")
  assert.equal(flaggedQuestion.getAttribute("aria-label"), "Question 1, not answered, flagged")
  assert.equal(flaggedQuestion.querySelector('svg[data-practice-icon="flag"]')?.getAttribute("aria-hidden"), "true")
  flaggedQuestion.click()
  click("Pause timer")
  assert.equal(root.querySelector("[data-practice-main] h1").textContent, "Session paused")
  assert.equal(root.querySelectorAll('input[name="opt"]').length, 0, "paused exam must hide the questions")
  click("Resume")
  const current = questions.find((q) => q.id === "A-0-1")
  const radio = root.querySelector(`input[name="opt"][value="${current.answer}"]`)
  radio.checked = true; radio.dispatchEvent(new dom.window.Event("change"))
  const confidence = root.querySelector("#answerConfidence")
  confidence.value = "high"; confidence.dispatchEvent(new dom.window.Event("change"))
  click("Finish exam")
  click("Finish and see results")
  await new Promise((resolve) => setTimeout(resolve, 0))
  assert.equal(attempts.size, 1)
  assert(root.querySelector('button svg[data-practice-icon="download"]'), "retained review download keeps its visible action and decorative icon")
  assert.equal(attempts.get(examId).timing.paused, true)
  assert.equal(attempts.get(examId).answers["A-0-1"], current.answer)
  engine.suspend()
  assert.equal(lastSave.history[0].detailSaved, true)
  assert(!Object.keys(lastSave.questionReview).some((id) => id.startsWith("A-")), "mock feedback stays in retained reports, not the general drill review queue")
  assert(lastSave.exposure["A-0-3"], "submitting an unanswered question exposes its answer in the retained review")
  const legacySummary = structuredClone(lastSave)
  legacySummary.history[0].firstAttempt = true
  engine.replaceState(legacySummary)
  engine.navigate({})
  assert(root.textContent.includes("Oldest result in recent history"))
  assert(root.textContent.includes("up to 60 attempt summaries"))
  assert(!root.textContent.includes("First attempt:"))
  engine.navigate({ view: "flashcards" })
  assert.equal(root.querySelector("[data-practice-main] h1").textContent, "Flashcards", "query navigation reaches the requested view")
  click("Start flashcards")
  click("Reveal answer")
  assert.match(root.textContent, /Reference:/)
  click("Recalled and can explain")
  engine.suspend()
  assert.equal(Object.keys(lastSave.cardReview).length, 1)
  assert(Object.keys(lastSave.cardReview)[0].startsWith("card-"))
  engine.navigate({ attempt: examId })
  await new Promise((resolve) => setTimeout(resolve, 0))
  assert.match(root.querySelector("[data-practice-main] h1").textContent, /Review: Mock Exam A/)
  assert(routes.some((route) => route.session === examId))
  engine.navigate({})
  click("All saved reviews")
  await new Promise((resolve) => setTimeout(resolve, 0))
  assert.equal(root.querySelector("[data-practice-main] h1").textContent, "All saved reviews")
  assert(root.querySelector("[data-practice-main] table").textContent.includes("Mock Exam A"))
  delayLoad = true
  engine.navigate({ attempt: examId })
  engine.navigate({ session: firstSessionId })
  releaseLoad(attempts.get(examId))
  await new Promise((resolve) => setTimeout(resolve, 0))
  assert.match(root.querySelector("[data-practice-main] h1").textContent, /^Question /, "a late report response must not replace a newly resumed session")
  engine.destroy()
  dom.window.close()
  console.log("Course practice passed: mock isolation, stable IDs, delayed recall, edition reconciliation, immutable reports, session preservation, pause behavior, route navigation, and retained attempt review.")
} finally { await rm(temp, { recursive: true, force: true }) }
