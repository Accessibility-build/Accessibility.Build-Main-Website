// Toolkit downloads and design audits: signed print links, the annotation kit SVG, audit validation. No database.
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { build } from "esbuild"
import { JSDOM } from "jsdom"
import { validateCourse } from "./course-content.mjs"

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "course-toolkit-"))
try {
  const stub = path.join(temp, "server-only.js"); fs.writeFileSync(stub, "export {}")
  const bundle = async (entry, name) => { const out = path.join(temp, name); await build({ entryPoints: [entry], outfile: out, bundle: true, platform: "node", format: "esm", alias: { "server-only": stub } }); return import(pathToFileURL(out).href) }
  process.env.TOOLKIT_SIGNING_SECRET = "test-secret-not-real"
  const token = await bundle("lib/courses/toolkit-token.ts", "token.mjs")
  const t = token.toolkitToken("accessible-design", 60)
  assert.ok(token.verifyToolkitToken("accessible-design", t), "a fresh token verifies")
  assert.ok(!token.verifyToolkitToken("was-crash-course", t), "a token is bound to its course")
  assert.ok(!token.verifyToolkitToken("accessible-design", t.replace(/.$/, (c) => (c === "A" ? "B" : "A"))), "a tampered token fails")
  assert.ok(!token.verifyToolkitToken("accessible-design", token.toolkitToken("accessible-design", -5)), "an expired token fails")
  assert.ok(!token.verifyToolkitToken("accessible-design", null))

  const kit = await bundle("lib/courses/annotation-kit.ts", "kit.mjs")
  const svg = kit.annotationKitSvg("Accessible Design for Designers")
  const doc = new JSDOM(svg, { contentType: "image/svg+xml" }).window.document
  assert.equal(doc.documentElement.nodeName, "svg", "well-formed SVG")
  for (const id of ["heading-h1", "landmark-main", "focus-1", "focus-24", "name-callout", "alt-callout", "role-button", "state-expanded", "key-esc", "target-24", "note-reduced-motion"]) assert.ok(doc.getElementById(id), `named layer ${id}`)
  assert.ok(doc.querySelector("title")?.textContent.includes("annotation kit"), "the file has a title")

  // Audits validate: a valid audit passes; unsafe or incomplete ones fail.
  const el = (id, extra = {}) => ({ id, kind: "box", x: 0, y: 0, w: 10, h: 10, name: `Element ${id}`, ...extra })
  const audit = { type: "audit", title: "Audit", intro: "Find the 1 issue.", alt: "A screen.", canvas: { w: 100, h: 100 }, elements: [el("a", { issue: { title: "Low contrast", sc: "1.4.3 Contrast (Minimum) (AA)", explanation: "Why." } }), el("b")] }
  const course = (blocks) => ({ slug: "s", chapters: [{ key: "a", blocks }], sections: [{ ref: "I.A", domain: 1, title: "A" }], questions: [{ id: "q1", set: "drill", d: 1, sec: "I.A", stem: "Q?", exp: "E", options: ["a", "b", "c", "d"], answer: 0 }], flashcards: [] })
  assert.deepEqual(validateCourse(course([audit])), [])
  assert.ok(validateCourse(course([{ ...audit, elements: [el("a"), el("a")] }])).length, "duplicate ids fail")
  assert.ok(validateCourse(course([{ ...audit, elements: [el("a")] }])).length, "an audit needs at least one issue")
  assert.ok(validateCourse(course([{ ...audit, elements: [el("a", { kind: "script", issue: audit.elements[0].issue })] }])).length, "unknown element kinds fail")
  assert.ok(validateCourse(course([{ ...audit, elements: [el("a", { name: undefined, issue: audit.elements[0].issue })] }])).length, "selectable elements need a name")

  // Video blocks: only a complete, https-linked YouTube reference with a written summary is accepted.
  const video = { type: "video", provider: "youtube", videoId: "abcDEF12345", title: "Demo", duration: "3:41", credit: "Publisher", license: "Creative Commons Attribution", url: "https://www.youtube.com/watch?v=abcDEF12345", sourceUrl: "https://example.org/post", summary: "What the video shows." }
  assert.deepEqual(validateCourse(course([video])), [])
  assert.ok(validateCourse(course([{ ...video, videoId: "short" }])).length, "a video needs an 11-character id")
  assert.ok(validateCourse(course([{ ...video, summary: "" }])).length, "a video needs a written summary")
  assert.ok(validateCourse(course([{ ...video, url: "http://insecure.example" }])).length, "video links must be https")
  assert.ok(validateCourse(course([{ ...video, provider: "other" }])).length, "only the known provider is accepted")

  // Capstone files: the screens file carries the design and no findings; the solution adds numbered findings.
  const drawing = await bundle("lib/courses/audit-svg.ts", "audit-svg.mjs")
  const screen = { title: "Home <page>", canvas: { w: 400, h: 300 }, elements: [
    { id: "logo", kind: "text", x: 20, y: 20, w: 200, h: 30, text: "Clinic & co", size: 22, weight: 700, color: "#111827", name: "Logo" },
    { id: "cta", kind: "button", x: 20, y: 80, w: 160, h: 44, text: "Book now", fill: "#9ca3af", color: "#ffffff", name: "Button", issue: { title: "Low contrast label", sc: "1.4.3 Contrast (Minimum) (AA)", explanation: "White on light gray is hard to read for people with low vision. Darken the button fill until the label reaches 4.5:1." } },
    { id: "search", kind: "icon", x: 300, y: 20, w: 18, h: 18, icon: "search", color: "#111827", name: "Icon", issue: { title: "Target too small", sc: "2.5.8 Target Size (Minimum) (AA)", explanation: "The target is under 24 by 24 CSS px." } },
    { id: "photo", kind: "image", x: 220, y: 80, w: 160, h: 120, fill: "#93c5fd", name: "Photo" },
    { id: "bar", kind: "bar", x: 20, y: 200, w: 40, h: 60, fill: "#2563eb", pattern: "stripes", name: "Bar" },
    { id: "rule", kind: "line", x: 0, y: 290, w: 400, h: 0, selectable: false },
  ] }
  const plain = drawing.auditScreensSvg({ heading: "Screens", note: "Note", screens: [screen, { ...screen, title: "Second" }] })
  const marked = drawing.auditScreensSvg({ heading: "Solution", note: "Note", screens: [screen], solution: true })
  for (const [label, text] of [["screens", plain], ["solution", marked]]) {
    const d = new JSDOM(text, { contentType: "image/svg+xml" }).window.document
    assert.equal(d.documentElement.nodeName, "svg", `${label}: well-formed SVG`)
    assert.ok(d.getElementById("s1-cta") && d.getElementById("s1-logo") && d.getElementById("s1-design"), `${label}: elements are named layers`)
    const ids = [...d.querySelectorAll("[id]")].map((e) => e.id)
    assert.equal(new Set(ids).size, ids.length, `${label}: ids are unique`)
    assert.ok(!/<script|on[a-z]+=|javascript:/i.test(text), `${label}: nothing executable`)
  }
  assert.ok(plain.includes("Clinic &amp; co") && plain.includes("Home &lt;page&gt;"), "text is escaped")
  assert.ok(!plain.includes("Low contrast label") && !plain.includes("1.4.3") && !plain.includes("finding"), "the screens file reveals no findings")
  assert.ok(new JSDOM(plain, { contentType: "image/svg+xml" }).window.document.getElementById("s2-cta"), "each screen gets its own layer prefix")
  const solutionDoc = new JSDOM(marked, { contentType: "image/svg+xml" }).window.document
  assert.ok(solutionDoc.getElementById("s1-finding-1") && solutionDoc.getElementById("s1-finding-2") && !solutionDoc.getElementById("s1-finding-3"), "one numbered finding per issue")
  assert.ok(marked.includes("1. Low contrast label") && marked.includes("2.5.8 Target Size (Minimum) (AA)"), "findings are listed with their criterion")
  assert.deepEqual(drawing.wrapAuditText("one two three four", 70, 16), ["one two", "three", "four"])

  console.log("Toolkit checks passed: signed print links (course-bound, expiring, tamper-proof), annotation kit layers, design audit and video validation, and capstone design files.")
} finally {
  fs.rmSync(temp, { recursive: true, force: true })
}
