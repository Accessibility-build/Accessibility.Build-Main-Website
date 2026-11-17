// Synthetic React/DOM checks for the course workspace. Does not open a browser.
import assert from "node:assert/strict"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createRequire } from "node:module"
import { build } from "esbuild"
import { JSDOM } from "jsdom"

const require = createRequire(import.meta.url)
const temp = await mkdtemp(join(tmpdir(), "course-shell-ui-"))
const dom = new JSDOM("<!doctype html><html lang='en'><head><title>Course workspace test</title></head><body><main id='main-content'><div id='mount'></div></main></body></html>", { url: "https://example.test/courses/example/learn/chapters/lesson-two", pretendToBeVisual: true })
for (const key of ["window", "document", "Element", "HTMLElement", "Event", "MouseEvent", "KeyboardEvent"]) globalThis[key] = dom.window[key]
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true })
globalThis.IS_REACT_ACT_ENVIRONMENT = true
await build({
  stdin: { resolveDir: process.cwd(), loader: "tsx", contents: 'export { act, createElement } from "react"; export { createRoot, hydrateRoot } from "react-dom/client"; export { renderToString } from "react-dom/server"; export { CourseShell } from "./components/courses/course-shell";' },
  bundle: true, platform: "node", format: "cjs", outfile: join(temp, "shell.cjs"), jsx: "automatic", logLevel: "silent",
  plugins: [{ name: "shared-react", setup(build) {
    build.onResolve({ filter: /^(react|react-dom)(\/.*)?$/ }, (args) => ({ path: require.resolve(args.path), external: true }))
  } }, { name: "next-link-dom", setup(build) {
    build.onResolve({ filter: /^next\/link$/ }, () => ({ path: "next/link", namespace: "fixture" }))
    build.onLoad({ filter: /.*/, namespace: "fixture" }, () => ({ resolveDir: process.cwd(), loader: "js", contents: 'import {createElement,forwardRef} from "react"; export default forwardRef(function Link({href,children,prefetch,...rest},ref){return createElement("a",{...rest,href,ref},children)})' }))
  } }],
})
const { act, createElement: h, createRoot, hydrateRoot, renderToString, CourseShell } = require(join(temp, "shell.cjs"))
const axe = require("axe-core")
const mount = document.getElementById("mount")
let root = createRoot(mount)
const failures = []
const homeRoute = "/courses/example/learn"
const outline = {
  total: 3, doneCount: 1, percent: 33, totalMinutes: 75, next: null,
  parts: [
    { title: "First domain", doneCount: 1, lessons: [
      { key: "lesson-one", number: 1, title: "The foundations", done: true, readingMinutes: 25 },
      { key: "lesson-two", number: 2, title: "Applying the principles", done: false, readingMinutes: 20 },
    ] },
    { title: "Second domain", doneCount: 0, lessons: [{ key: "lesson-three", number: 3, title: "An applied exercise", done: false, readingMinutes: 30 }] },
  ],
}
const props = { title: "Example course", homeRoute, outline, view: "lesson", lessonKey: "lesson-two", hasTeam: true }
const child = h("section", { "aria-labelledby": "lesson-title" }, h("h1", { id: "lesson-title" }, "Applying the principles"), h("label", { htmlFor: "example-notes" }, "Lesson notes"), h("textarea", { id: "example-notes", defaultValue: "An unsaved thought" }))
async function render(overrides = {}) { await act(async () => root.render(h(CourseShell, { ...props, ...overrides }, child))) }
async function click(element) { assert(element, "Expected an interactive element"); await act(async () => element.click()) }
async function escape(element) { await act(async () => element.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))) }
const button = (label) => [...mount.querySelectorAll("button")].find((item) => item.textContent.trim() === label)
async function test(name, run) {
  try { await run(); console.log(`Passed: ${name}`) }
  catch (error) { failures.push({ name, error }); console.error(`FAILED: ${name}: ${error.message}`) }
  finally { await act(async () => root.unmount()); root = createRoot(mount); window.sessionStorage.clear() }
}

try {
  await test("course-only navigation, progress and server children remain available", async () => {
    await render()
    assert.equal(document.querySelectorAll("main").length, 1, "The parent layout owns the single main landmark")
    assert.equal(mount.querySelector('a[href="/courses"]').textContent.trim(), "Exit course")
    const sections = mount.querySelector('nav[aria-label="Course sections"]')
    assert.deepEqual([...sections.querySelectorAll("a")].map((a) => [a.textContent, a.getAttribute("href")]), [
      ["Overview", homeRoute], ["Practice and mock exams", `${homeRoute}/practice`], ["Flashcards", `${homeRoute}/practice?view=flashcards`], ["Search and saved work", `${homeRoute}/library`], ["Team", `${homeRoute}/team`],
    ])
    assert.equal(mount.querySelector("progress").value, 1)
    assert.equal(mount.querySelector("progress").max, 3)
    assert.match(document.getElementById("course-progress-label").textContent, /1 of 3 lessons \(33%\)/)
    assert.equal(document.getElementById("desk-lesson-lesson-two").getAttribute("aria-current"), "page")
    assert.match(document.getElementById("desk-lesson-lesson-one").textContent, /completed/)
    assert.equal(document.getElementById("desk-lesson-lesson-two").closest("details").open, true)
    assert.equal(document.getElementById("desk-lesson-lesson-three").closest("details").open, false)
    assert.equal(document.getElementById("example-notes").value, "An unsaved thought")
    const workspace = mount.querySelector("[data-course-workspace]")
    for (const container of [workspace, workspace.querySelector("header"), document.getElementById("course-content")]) {
      assert(!/\b(max-w-|mx-auto|fixed\b|h-screen\b)/.test(container.className), "The frame must not reintroduce a capped or fixed-height outer page")
    }
    assert.equal(document.body.style.overflow, "", "The document remains the scrolling surface")
    await render({ view: "flashcards", hasTeam: false })
    assert.equal(mount.querySelector('nav[aria-label="Course sections"] [aria-current="page"]').textContent, "Flashcards")
    assert(![...sections.querySelectorAll("a")].some((a) => a.textContent === "Team"))
  })

  await test("desktop focus mode collapses the outline without resetting lesson work", async () => {
    await render()
    const notes = document.getElementById("example-notes")
    notes.value = "Keep this draft while I focus"
    const desktop = document.getElementById("desktop-course-outline")
    assert.equal(desktop.hidden, false)
    await click(button("Hide outline"))
    assert.equal(desktop.hidden, true)
    assert.equal(button("Show outline").getAttribute("aria-expanded"), "false")
    assert.equal(document.getElementById("example-notes"), notes)
    assert.equal(notes.value, "Keep this draft while I focus")
    await click(button("Show outline"))
    const lesson = document.getElementById("desk-lesson-lesson-two")
    lesson.focus()
    await escape(lesson)
    assert.equal(desktop.hidden, true)
    assert.equal(document.activeElement, button("Show outline"), "Escape returns focus to the visible outline control")
  })

  await test("desktop outline preference survives navigation and stays scoped to its course", async () => {
    await render()
    await click(button("Hide outline"))
    await act(async () => root.unmount())
    root = createRoot(mount)
    await render({ lessonKey: "lesson-three" })
    assert.equal(document.getElementById("desktop-course-outline").hidden, true, "The next lesson restores focus mode")
    assert.equal(button("Show outline").getAttribute("aria-expanded"), "false")
    await render({ homeRoute: "/courses/another/learn", view: "overview" })
    assert.equal(document.getElementById("desktop-course-outline").hidden, false, "Another course starts with its own open outline")
    await render({ view: "practice" })
    assert.equal(document.getElementById("desktop-course-outline").hidden, true, "Returning to this course restores its choice")
    await click(button("Show outline"))
    await act(async () => root.unmount())
    root = createRoot(mount)
    await render()
    assert.equal(document.getElementById("desktop-course-outline").hidden, false, "Explicitly reopening the outline replaces the saved choice")
  })

  await test("outline controls still work when browser storage is unavailable", async () => {
    const original = Object.getOwnPropertyDescriptor(window, "sessionStorage")
    Object.defineProperty(window, "sessionStorage", { configurable: true, get() { throw new Error("Storage disabled") } })
    try {
      await render()
      assert.equal(document.getElementById("desktop-course-outline").hidden, false)
      await click(button("Hide outline"))
      assert.equal(document.getElementById("desktop-course-outline").hidden, true)
      await click(button("Show outline"))
      assert.equal(document.getElementById("desktop-course-outline").hidden, false)
    } finally {
      Object.defineProperty(window, "sessionStorage", original)
    }
  })

  await test("server markup hydrates before restoring a saved collapsed outline", async () => {
    await render()
    await click(button("Hide outline"))
    await act(async () => root.unmount())
    const tree = h(CourseShell, props, child)
    const originalWindow = globalThis.window
    let serverMarkup
    try {
      globalThis.window = undefined
      serverMarkup = renderToString(tree)
    } finally {
      globalThis.window = originalWindow
    }
    mount.innerHTML = serverMarkup
    assert.equal(button("Hide outline").getAttribute("aria-expanded"), "true", "Server markup consistently starts open without browser storage")
    const hydrationErrors = []
    await act(async () => { root = hydrateRoot(mount, tree, { onRecoverableError: (error) => hydrationErrors.push(error.message) }) })
    assert.deepEqual(hydrationErrors, [], "Restoring the preference must not cause a hydration mismatch")
    assert.equal(document.getElementById("desktop-course-outline").hidden, true)
  })

  await test("mobile disclosure has explicit controls, Escape and close focus restoration", async () => {
    await render()
    const toggle = button("Course outline")
    const mobile = document.getElementById(toggle.getAttribute("aria-controls"))
    assert.equal(mobile.hidden, true)
    await click(toggle)
    assert.equal(toggle.getAttribute("aria-expanded"), "true")
    assert.equal(mobile.hidden, false)
    assert(!mount.querySelector('[role="dialog"], [aria-modal="true"]'), "The mobile outline is a disclosure, not a trapped dialog")
    document.getElementById("mob-lesson-lesson-two").focus()
    await escape(document.activeElement)
    assert.equal(mobile.hidden, true)
    assert.equal(document.activeElement, toggle)
    await click(toggle)
    await click(button("Close outline"))
    assert.equal(mobile.hidden, true)
    assert.equal(document.activeElement, toggle)
  })

  await test("choosing a mobile lesson closes navigation and preserves a usable focus destination", async () => {
    await render()
    await click(button("Course outline"))
    const lesson = document.getElementById("mob-lesson-lesson-two")
    lesson.addEventListener("click", (event) => event.preventDefault(), { once: true })
    lesson.focus()
    await click(lesson)
    assert.equal(document.getElementById("mobile-course-outline").hidden, true)
    assert.equal(document.activeElement, document.getElementById("course-content"))
    document.getElementById("example-notes").focus()
    assert(!document.getElementById("course-content").hasAttribute("tabindex"), "Temporary focusability is cleaned up on blur")
    await click(button("Course outline"))
    lesson.addEventListener("click", (event) => event.preventDefault(), { once: true })
    await act(async () => lesson.dispatchEvent(new MouseEvent("click", { bubbles: true, ctrlKey: true })))
    assert.equal(document.getElementById("mobile-course-outline").hidden, false, "Opening another tab does not close the current course outline")
  })

  await test("skip navigation, unique references and structural accessibility", async () => {
    await render()
    await click(button("Course outline"))
    const skip = mount.querySelector('a[href="#course-content"]')
    skip.addEventListener("click", (event) => event.preventDefault(), { once: true })
    await click(skip)
    assert.equal(document.activeElement.id, "course-content")
    const ids = [...mount.querySelectorAll("[id]")].map((element) => element.id)
    assert.equal(ids.length, new Set(ids).size)
    for (const element of mount.querySelectorAll("[aria-controls],[aria-labelledby]")) {
      for (const attr of ["aria-controls", "aria-labelledby"]) for (const id of (element.getAttribute(attr) ?? "").split(/\s+/).filter(Boolean)) assert(document.getElementById(id), `Missing ${attr} target ${id}`)
    }
    mount.querySelectorAll("details").forEach((element) => { element.open = true })
    const result = await axe.run(mount, { runOnly: { type: "rule", values: ["aria-allowed-attr", "aria-valid-attr", "aria-valid-attr-value", "aria-required-attr", "aria-required-children", "aria-required-parent", "button-name", "link-name", "label", "duplicate-id-aria"] } })
    assert.deepEqual(result.violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) })), [])
  })
} finally {
  await act(async () => root.unmount())
  dom.window.close()
  await rm(temp, { recursive: true, force: true })
}
if (failures.length) process.exitCode = 1
else console.log("All course shell interaction and structural accessibility checks passed.")
