// React + jsdom integration tests. All lesson material is synthetic; no browser is opened.
import assert from "node:assert/strict"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createRequire } from "node:module"
import { build } from "esbuild"
import { JSDOM } from "jsdom"

const require = createRequire(import.meta.url)
const temp = await mkdtemp(join(tmpdir(), "course-learning-ui-"))
const dom = new JSDOM("<!doctype html><html lang='en'><head><title>Learning test</title></head><body><main><h1>Course lesson</h1><div id='mount'></div></main></body></html>", { url: "https://example.test/courses/example/learn/chapters/lesson-one", pretendToBeVisual: true })
for (const key of ["window", "document", "HTMLElement", "HTMLInputElement", "HTMLTextAreaElement", "HTMLSelectElement", "Event", "MouseEvent", "DOMParser", "localStorage", "sessionStorage"]) globalThis[key] = dom.window[key]
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true })
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window)
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window)
globalThis.IS_REACT_ACT_ENVIRONMENT = true
const scrolled = []
dom.window.HTMLElement.prototype.scrollIntoView = function () { scrolled.push(this.id) }
const downloads = []
URL.createObjectURL = (blob) => { downloads.push(blob); return `blob:synthetic-${downloads.length}` }
URL.revokeObjectURL = () => {}
const anchorClick = dom.window.HTMLAnchorElement.prototype.click
dom.window.HTMLAnchorElement.prototype.click = function () { if (!this.hasAttribute("download")) anchorClick.call(this) }

await build({
  stdin: { resolveDir: process.cwd(), loader: "tsx", contents: `
    export { act, createElement } from "react";
    export { createRoot } from "react-dom/client";
    export { LessonReading } from "./components/courses/lesson-reading";
    export { LessonWorkspace } from "./components/courses/lesson-workspace";
    export { CourseLibrary } from "./components/courses/course-library";
    export { StudyPlan } from "./components/courses/study-plan";
    export { CourseTutor } from "./components/courses/course-tutor";
  ` }, bundle: true, platform: "node", format: "cjs", outfile: join(temp, "ui.cjs"), jsx: "automatic", logLevel: "silent",
  plugins: [{ name: "shared-react-runtime", setup(build) {
    build.onResolve({ filter: /^(react|react-dom)(\/.*)?$/ }, (args) => ({ path: require.resolve(args.path), external: true }))
  } }, { name: "link-dom-fixture", setup(build) {
    // Link destinations are verified; Next router behavior is covered by practice route tests.
    build.onResolve({ filter: /^next\/link$/ }, () => ({ path: "next/link", namespace: "fixture" }))
    build.onLoad({ filter: /.*/, namespace: "fixture" }, () => ({ resolveDir: process.cwd(), loader: "js", contents: 'import {createElement,forwardRef} from "react"; export default forwardRef(function Link({href,children,prefetch,...rest},ref){return createElement("a",{...rest,href,ref},children)})' }))
  } }],
})
const { act, createElement: h, createRoot, LessonReading, LessonWorkspace, CourseLibrary, StudyPlan, CourseTutor } = require(join(temp, "ui.cjs"))
const axe = require("axe-core")
const mount = document.querySelector("#mount")
let root = createRoot(mount)
const failures = []
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const settle = (ms = 0) => act(async () => { await pause(ms) })
async function render(component, props) { await act(async () => { root.render(h(component, props)) }) }
async function clear() {
  await act(async () => root.unmount())
  root = createRoot(mount)
  localStorage.clear(); sessionStorage.clear(); window.location.hash = ""
  await settle()
}
const byText = (selector, text) => [...mount.querySelectorAll(selector)].find((element) => element.textContent.trim() === text)
async function click(element) { assert(element, "Missing element to click"); await act(async () => element.click()) }
async function input(element, value) {
  assert(element, "Missing input")
  await act(async () => {
    const prototype = element.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype : element.tagName === "SELECT" ? window.HTMLSelectElement.prototype : window.HTMLInputElement.prototype
    Object.getOwnPropertyDescriptor(prototype, "value").set.call(element, value)
    element.dispatchEvent(new window.Event(element.tagName === "SELECT" ? "change" : "input", { bubbles: true }))
  })
}
function identifiers() {
  const ids = [...mount.querySelectorAll("[id]")].map((element) => element.id)
  assert.equal(ids.length, new Set(ids).size, "Rendered IDs must be unique")
  for (const element of mount.querySelectorAll("[aria-labelledby],[aria-describedby]")) {
    for (const attr of ["aria-labelledby", "aria-describedby"]) for (const id of (element.getAttribute(attr) ?? "").split(/\s+/).filter(Boolean)) assert(document.getElementById(id), `Broken ${attr}: ${id}`)
  }
}
async function structuralAxe() {
  mount.querySelectorAll("details").forEach((element) => { element.open = true })
  identifiers()
  const result = await axe.run(mount, { runOnly: { type: "rule", values: ["aria-allowed-attr", "aria-valid-attr", "aria-valid-attr-value", "aria-required-attr", "aria-required-children", "aria-required-parent", "button-name", "label", "select-name", "frame-title", "duplicate-id-aria", "table-duplicate-name", "td-headers-attr"] } })
  assert.deepEqual(result.violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) })), [], "Structural accessibility checks")
}
async function test(name, fn) {
  try { await fn(); console.log(`Passed: ${name}`) }
  catch (error) { failures.push({ name, error }); console.error(`FAILED: ${name}: ${error.message}`) }
  finally { await clear() }
}

const source = { title: "Synthetic primary source", url: "https://example.org/spec", version: "1", context: "exam" }
const blocks = [{ type: "h2", text: "First topic" }, { type: "p", text: "First explanation." }, { type: "h3", text: "A useful distinction" }, { type: "p", text: "A worked example." }, { type: "h2", text: "Second topic" }, { type: "p", text: "Second explanation." }, { type: "table", caption: "Example comparisons", headers: ["Option", "Result"], rows: [["One", "Works"], ["Two", "Needs a change"]] }, { type: "keyterms", items: [{ term: "Example", def: "A synthetic learning fixture." }] }]
const activity = {
  id: "case-one", version: "1", kind: "case", title: "Plan an accessible workshop", brief: "A synthetic case for testing the interface.", outcomes: ["Explain a decision"], objectiveRefs: ["I.A"], minutes: 10, sources: [source],
  steps: [{ id: "decision-one", prompt: "Which action addresses the barrier?", options: [{ id: "yes", text: "Make the documented change", feedback: "This addresses the stated task." }, { id: "no", text: "Leave the barrier in place", feedback: "The task remains blocked." }], answer: "yes", hint: "Consider the stated task." }],
  reflection: { prompt: "Explain your decision and evidence.", criteria: ["I identified the barrier", "I described the evidence"], example: "The change addresses the named task and should be verified with the participant." },
  transfer: { prompt: "A new participant has another preference. What next?", options: [{ text: "Ask about the new preference", feedback: "Check the person's stated needs." }, { text: "Assume the previous change is enough", feedback: "Needs can differ." }], answer: 0 },
}
const question = { id: "D1", set: "drill", d: 1, sec: "I.A", secTitle: "Models", ref: "I.A", page: "2", stem: "Which synthetic answer fits?", options: ["First answer", "Second answer", "Third answer", "Fourth answer"], answer: 1, exp: "The second answer matches the task; the other choices do not.", sources: [source] }
const chapter = { key: "lesson-one", number: 1, title: "First lesson", part: "Domain One", outlineRef: "I.A", objectiveRefs: ["I.A"], bokPages: "1–2", blocks, activities: [activity] }
const meta = { slug: "example", edition: "1.1", built: "November 2026", parts: [{ title: "Domain One", chapters: ["lesson-one", "lesson-two"] }], chapters: [{ ...chapter, readingMinutes: 35, activityIds: [activity.id], activityVersions: { [activity.id]: activity.version } }, { ...chapter, key: "lesson-two", number: 2, title: "Second lesson", readingMinutes: 25, activityIds: [] }], sections: [{ ref: "I.A", domain: 1, title: "Models" }], questionCount: 1, flashcardCount: 1 }

let fetcher = async () => { throw new Error("Unexpected request") }
globalThis.fetch = (...args) => fetcher(...args)
let serverStudy = {}
let requests = []
let failNextSave = false
function setupStudyServer() {
  serverStudy = { notes: {}, bookmarks: [], activities: {}, revisions: {} }; requests = []; failNextSave = false
  const completed = new Map()
  fetcher = async (url, options) => {
    assert(String(url).endsWith("/progress"), `Unexpected study endpoint: ${url}`)
    assert.equal(options.method, "PATCH")
    const payload = JSON.parse(options.body); requests.push(payload)
    if (failNextSave) { failNextSave = false; throw new Error("Synthetic offline failure") }
    if (completed.has(payload.requestId)) return { ok: true, status: 200, json: async () => completed.get(payload.requestId) }
    const c = payload.change
    const key = c.kind === "check" ? `check:${c.questionId}` : c.kind === "note" || c.kind === "activity" || c.kind === "bookmark" ? `${c.kind}:${c.key}` : c.kind
    if (c.kind === "location") serverStudy.lastLocation = { chapterKey: c.chapterKey, anchor: c.anchor, updatedAt: new Date().toISOString() }
    if (c.kind === "note") serverStudy.notes[c.key] = c.text
    if (c.kind === "activity") serverStudy.activities[c.key] = c.value
    if (c.kind === "settings") serverStudy.settings = c.value
    if (c.kind === "bookmark") serverStudy.bookmarks = c.bookmarked ? [...new Set([...serverStudy.bookmarks, c.key])] : serverStudy.bookmarks.filter((key) => key !== c.key)
    serverStudy.revisions[key] = (serverStudy.revisions[key] ?? 0) + 1
    const result = { ok: true, revision: serverStudy.revisions[key], progress: { study: structuredClone(serverStudy) } }
    completed.set(payload.requestId, result)
    return { ok: true, status: 200, json: async () => result }
  }
}

try {
  await test("guided reading preserves source anchors and follows deep links", async () => {
    await render(LessonReading, { blocks, idPrefix: "c1" })
    assert(document.getElementById("c1-0") && document.getElementById("c1-4"))
    await click(mount.querySelector('input[type="checkbox"]'))
    assert.equal(document.getElementById("c1-4"), null)
    await act(async () => { window.location.hash = "#c1-4"; window.dispatchEvent(new window.HashChangeEvent("hashchange")); await pause(40) })
    assert(document.getElementById("c1-4")); assert.equal(document.getElementById("c1-0"), null)
    assert(scrolled.includes("c1-4"))
    await click(byText("button", "Previous section"))
    await settle(40)
    assert.equal(window.location.hash, "#c1-0", "Section buttons must update the resumable location")
    assert(document.getElementById("c1-0")); assert.match(document.activeElement.textContent, /Section 1 of 2/)
    await click(mount.querySelector('input[type="checkbox"]'))
    assert(document.getElementById("c1-4"))
    await structuralAxe()
  })

  await test("guided section buttons save real anchors and restore a prose introduction", async () => {
    setupStudyServer()
    const introduction = [{ type: "p", text: "An introduction before the first heading." }, { type: "p", text: "More context." }, { type: "h2", text: "Apply the idea" }, { type: "p", text: "An explanation to practise." }]
    const readingChapter = { ...chapter, blocks: introduction, activities: [] }
    const CombinedLesson = () => h("div", null,
      h(LessonReading, { blocks: introduction, idPrefix: "c1" }),
      h(LessonWorkspace, { slug: "example", userId: "person-one", chapter: readingChapter, edition: "1.1", initial: {}, questions: [] }))
    await render(CombinedLesson, {})
    await click(mount.querySelector('input[type="checkbox"]'))
    assert(document.getElementById("c1-0"), "Prose introductions need a real anchor too")
    assert.equal(document.getElementById("c1-2"), null)
    await click(byText("button", "Next section"))
    await settle(750)
    assert.equal(window.location.hash, "#c1-2")
    assert(document.getElementById("c1-2"))
    assert.equal(serverStudy.lastLocation.anchor, "c1-2", "Workspace must save the section reached by its Next button")
    await click(byText("button", "Previous section"))
    await settle(750)
    assert.equal(serverStudy.lastLocation.anchor, "c1-0")
    assert(document.getElementById("c1-0"))
    assert.match(document.activeElement.textContent, /Section 1 of 2/)
    await structuralAxe()
    await click(byText("button", "Next section"))
    await settle(750)
    const savedAnchor = serverStudy.lastLocation.anchor
    await act(async () => root.unmount())
    root = createRoot(mount)
    await act(async () => { window.location.hash = savedAnchor })
    await render(LessonReading, { blocks: introduction, idPrefix: "c1" })
    await settle(40)
    await click(mount.querySelector('input[type="checkbox"]'))
    assert(document.getElementById("c1-2"), "Reopening the saved URL must select its section")
    assert.equal(document.getElementById("c1-0"), null)
    await structuralAxe()
  })

  await test("notes, bookmarks, inline checks and case evidence save through PATCH", async () => {
    setupStudyServer()
    await render(LessonWorkspace, { slug: "example", userId: "person-one", chapter, edition: "1.1", initial: {}, questions: [question] })
    await input(document.getElementById("lesson-notes"), "A useful distinction to revisit.")
    await click(byText("button", "Bookmark this lesson"))
    await click(mount.querySelector('input[name="check-D1"][value="1"]'))
    await input(document.getElementById("confidence-D1"), "high")
    await click(byText("button", "Check answer"))
    assert(mount.textContent.includes(question.exp))
    await click(byText("label", "Make the documented change").querySelector("input"))
    await click(byText("button", "Check decision"))
    const reflection = [...mount.querySelectorAll("textarea")].find((element) => element.id.endsWith("-reflection"))
    await input(reflection, "The documented change removes the named barrier, and I will verify task completion with the participant.")
    for (const text of activity.reflection.criteria) await click(byText("label", text).querySelector("input"))
    await click(byText("label", "Ask about the new preference").querySelector("input"))
    await click(byText("button", "Check new situation"))
    await click(byText("label", "Confident").querySelector("input"))
    await click(byText("button", "Record completed practice"))
    await settle(750)
    assert.equal(serverStudy.notes[chapter.key], "A useful distinction to revisit.")
    assert(serverStudy.bookmarks.includes(chapter.key))
    assert.equal(serverStudy.activities[`checks-${chapter.key}`].answers.D1, "1")
    assert(serverStudy.activities[activity.id].completedAt)
    assert.equal(serverStudy.activities[activity.id].answers["decision-one"], "yes")
    assert.equal(serverStudy.activities[activity.id].criteria.length, 2)
    assert(requests.every((request) => request.op === "study" && request.requestId))
    assert.deepEqual(requests.find((request) => request.change.kind === "check")?.change, { kind: "check", questionId: "D1", answer: 1, confidence: "high", baseRevision: 0 }, "lesson feedback sends the atomic server-graded review operation")
    await structuralAxe()
    failNextSave = true
    await input(document.getElementById("lesson-notes"), "Retain this newer note while offline.")
    await settle(750)
    const failed = requests.at(-1)
    assert(byText("button", "Retry saving"))
    await click(byText("button", "Retry saving")); await settle()
    assert.equal(requests.at(-1).requestId, failed.requestId, "a retry keeps its idempotency key")
    assert.equal(serverStudy.notes[chapter.key], "Retain this newer note while offline.")
  })

  await test("search aborts older requests and never replaces new results with stale responses", async () => {
    const calls = []
    fetcher = (url, options) => new Promise((resolve) => calls.push({ url, signal: options.signal, resolve }))
    await render(CourseLibrary, { slug: "example", meta, progress: { study: {} } })
    const search = document.getElementById("course-search")
    await input(search, "focus"); await settle(340)
    assert.equal(calls.length, 1)
    await input(search, "aria"); await settle(340)
    assert.equal(calls.length, 2); assert(calls[0].signal.aborted)
    const hit = (title) => ({ chapterKey: "lesson-one", anchor: "c1-0", title, heading: "Topic", excerpt: "Synthetic search excerpt." })
    await act(async () => calls[1].resolve({ ok: true, json: async () => ({ hits: [hit("New ARIA result")] }) }))
    await act(async () => calls[0].resolve({ ok: true, json: async () => ({ hits: [hit("Stale focus result")] }) }))
    assert(mount.textContent.includes("New ARIA result")); assert(!mount.textContent.includes("Stale focus result"))
    assert.equal([...mount.querySelectorAll("a")].find((link) => link.textContent.includes("New ARIA result")).getAttribute("href"), "/courses/example/learn/chapters/lesson-one#c1-0")
    await input(search, "errors"); await settle(340)
    await act(async () => calls[2].resolve({ ok: false, json: async () => ({}) }))
    assert(mount.textContent.includes("Search could not load"))
    assert(!mount.textContent.includes("New ARIA result"), "failed new query must not present previous query's results as matches")
    await input(search, "x"); assert.equal(mount.querySelectorAll("ol li").length, 0)
    await structuralAxe()
  })

  await test("library export retains decisions, rubric and manual evidence", async () => {
    const evidence = { version: "1", answers: { "decision-one": "yes" }, checked: ["decision-one", "transfer"], reflection: "My reasoned conclusion.", criteria: ["0", "1"], manual: ["0"], transfer: "0", confidence: "high" }
    await render(CourseLibrary, { slug: "example", meta, progress: { study: { notes: { "lesson-one": "My saved note." }, activities: { "case-one": evidence } } } })
    await click(byText("button", "Download my learning record"))
    const text = await downloads.at(-1).text()
    assert(text.includes("My saved note."))
    for (const field of ["answers", "checked", "criteria", "manual", "transfer", "confidence"]) assert(text.includes(`"${field}"`), `Export omitted ${field}`)
    assert(text.includes("self-assessed"))
    await structuralAxe()
  })

  await test("study settings save and warn when reading exceeds available time", async () => {
    setupStudyServer()
    await render(StudyPlan, { slug: "example", userId: "person-one", meta, progress: { study: {} } })
    const selects = mount.querySelectorAll("select")
    await input(selects[0], "10"); await input(selects[1], "new")
    await input(mount.querySelector('input[type="date"]'), "2000-01-01")
    await settle(750)
    assert.equal(serverStudy.settings.minutesPerDay, 10)
    assert.equal(serverStudy.settings.experience, "new")
    assert(mount.textContent.includes("remaining reading alone exceeds"))
    await input(mount.querySelector('input[type="date"]'), "")
    await settle(750)
    assert.equal(serverStudy.settings.examDate, "")
    assert(!mount.textContent.includes("remaining reading alone exceeds"))
    await structuralAxe()
  })

  await test("tutor reports API errors, ignores canceled answers and renders cited guidance", async () => {
    const calls = []
    fetcher = (url, options) => new Promise((resolve) => calls.push({ url, options, resolve }))
    await render(CourseTutor, { slug: "example", chapterKey: "lesson-one" })
    mount.querySelector("details").open = true
    await input(mount.querySelector("textarea"), "Explain this distinction with a hint")
    const submit = () => act(async () => mount.querySelector("form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true })))
    await submit()
    assert.deepEqual(JSON.parse(calls[0].options.body), { chapterKey: "lesson-one", question: "Explain this distinction with a hint" })
    await act(async () => calls[0].resolve({ ok: false, json: async () => ({ error: "Finish the mock before requesting hints." }) }))
    assert.equal(mount.querySelector('[role="alert"]').textContent, "Finish the mock before requesting hints.")
    await submit(); await click(byText("button", "Stop")); assert(calls[1].options.signal.aborted)
    await submit()
    const answer = { answer: "Current guidance based on the lesson.", edition: "1.1", sources: [{ id: 1, title: "Lesson source", href: "/courses/example/learn/chapters/lesson-one#c1-0" }] }
    await act(async () => calls[2].resolve({ ok: true, json: async () => answer }))
    await act(async () => calls[1].resolve({ ok: true, json: async () => ({ ...answer, answer: "Canceled stale guidance" }) }))
    await settle(35)
    assert(mount.textContent.includes(answer.answer)); assert(!mount.textContent.includes("Canceled stale guidance"))
    assert.equal(mount.querySelector("a").getAttribute("href"), answer.sources[0].href)
    assert.match(document.activeElement.textContent, /Study guidance/)
    await structuralAxe()
  })
} finally {
  await act(async () => root.unmount())
  dom.window.close()
  await rm(temp, { recursive: true, force: true })
}
if (failures.length) {
  console.error(`${failures.length} learner UI checks failed.`)
  for (const failure of failures) console.error(failure.error.stack)
  process.exitCode = 1
} else console.log("Learner UI integration passed. Structural accessibility checks exclude contrast, layout, screen-reader behavior and native browser keyboard navigation.")
