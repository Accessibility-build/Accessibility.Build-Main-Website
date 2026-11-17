// Exercises the actual React hook in a DOM, including Strict Mode and lost responses.
// Only synthetic study data and mocked HTTP requests are used.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { createRequire } from "node:module"
import { build } from "esbuild"

const require = createRequire(import.meta.url)
const { JSDOM } = require("jsdom")
const React = require("react")
const { createRoot } = require("react-dom/client")
const { act } = React
const scratch = await fs.mkdtemp(path.join(os.tmpdir(), "course-study-tests-"))
await fs.symlink(path.join(process.cwd(), "node_modules"), path.join(scratch, "node_modules"), "dir")
async function bundle(file, name) {
  const outfile = path.join(scratch, `${name}.cjs`)
  await build({ entryPoints: [file], outfile, bundle: true, platform: "node", format: "cjs", packages: "external" })
  return require(outfile)
}
const later = () => new Promise((resolve) => setImmediate(resolve))
const originalFetch = globalThis.fetch
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://course.test" })
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.localStorage = dom.window.localStorage
globalThis.sessionStorage = dom.window.sessionStorage
globalThis.IS_REACT_ACT_ENVIRONMENT = true
let mounted = null

try {
  const { useStudyProgress } = await bundle("hooks/use-study-progress.ts", "hook")
  const model = await bundle("lib/courses/progress-model.ts", "model")
  let state
  async function mount({ initial = {}, userId = "synthetic-user", strict = false, recordLocation = false } = {}) {
    const host = document.createElement("div")
    document.body.append(host)
    const root = createRoot(host)
    function Harness() {
      const current = useStudyProgress("synthetic-course", userId, initial)
      state = current
      React.useEffect(() => { if (recordLocation) current.change({ kind: "location", chapterKey: "lesson-one" }) }, [])
      return React.createElement("p", { role: "status" }, current.recovery ? "Recovery available" : current.status)
    }
    await act(async () => root.render(strict ? React.createElement(React.StrictMode, null, React.createElement(Harness)) : React.createElement(Harness)))
    mounted = { root, host }
  }
  async function unmount() {
    if (!mounted) return
    await act(async () => { mounted.root.unmount(); await later() })
    mounted.host.remove(); mounted = null
  }
  const acknowledge = (server, body) => {
    const question = body.change.kind === "check" ? { id: body.change.questionId, set: "drill", answer: 2 } : undefined
    const result = model.applyStudyChange(server.value, body.change, body.requestId, undefined, question)
    server.value = result.data
    return Response.json({ ok: true, revision: result.revision, progress: model.publicProgress(result.data) })
  }

  // Changes typed during a slow save remain separate from that immutable request.
  const slowServer = { value: {} }
  const slowCalls = []
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(init.body)
    if (!slowCalls.length) return new Promise((resolve) => slowCalls.push({ body, resolve }))
    slowCalls.push({ body })
    return acknowledge(slowServer, body)
  }
  await mount()
  await act(async () => { state.change({ kind: "note", key: "lesson-one", text: "First draft" }); void state.flush() })
  await act(async () => {
    state.change({ kind: "note", key: "lesson-one", text: "Revised draft" })
    state.change({ kind: "note", key: "lesson-two", text: "Independent note" })
  })
  assert.equal(slowCalls.length, 1)
  await act(async () => { slowCalls[0].resolve(acknowledge(slowServer, slowCalls[0].body)); await state.flush() })
  assert.equal(slowCalls[1].body.change.baseRevision, 1)
  assert.equal(slowServer.value.study.notes["lesson-one"], "Revised draft")
  assert.equal(slowServer.value.study.notes["lesson-two"], "Independent note")
  assert.equal(state.status, "saved")
  await unmount()

  // A server commit with a lost response must retry its original request ID before later edits.
  const lostServer = { value: {} }
  const lostCalls = []
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(init.body); lostCalls.push(body)
    const result = acknowledge(lostServer, body)
    if (lostCalls.length === 1) throw new Error("Synthetic response loss")
    return result
  }
  await mount()
  await act(async () => { state.change({ kind: "note", key: "lesson-one", text: "Before disconnect" }); await state.flush() })
  assert.equal(state.status, "error")
  await act(async () => {
    state.change({ kind: "note", key: "lesson-one", text: "Written while offline" })
    state.change({ kind: "bookmark", key: "lesson-two", bookmarked: true })
    state.retry(); await state.flush()
  })
  assert.equal(lostCalls[0].requestId, lostCalls[1].requestId)
  assert.equal(lostCalls[2].change.baseRevision, 1)
  assert.equal(lostServer.value.study.revisions["note:lesson-one"], 2)
  assert.equal(lostServer.value.study.notes["lesson-one"], "Written while offline")
  assert.deepEqual(lostServer.value.study.bookmarks, ["lesson-two"])
  assert.equal(state.status, "saved")
  await unmount()

  // Accepting the remote version of one note must preserve unrelated queued work.
  const conflictServer = { value: model.applyStudyChange({}, { kind: "note", key: "lesson-one", text: "Other device's note", baseRevision: 0 }, "external-note-1").data }
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(init.body)
    try { return acknowledge(conflictServer, body) }
    catch (error) {
      if (!(error instanceof model.ProgressConflictError)) throw error
      return Response.json({ error: error.message, code: "PROGRESS_CONFLICT", revision: error.revision, progress: error.progress }, { status: 409 })
    }
  }
  await mount()
  await act(async () => {
    state.change({ kind: "note", key: "lesson-one", text: "Conflicting local note" })
    state.change({ kind: "note", key: "lesson-two", text: "Keep this unrelated work" })
    await state.flush()
  })
  assert.equal(state.status, "conflict")
  assert.match(state.exportLocal(), /Conflicting local note/)
  await act(async () => { state.resolve(false); await state.flush() })
  assert.equal(state.study.notes["lesson-one"], "Other device's note")
  assert.equal(conflictServer.value.study.notes["lesson-two"], "Keep this unrelated work")
  assert.equal(state.status, "saved")
  await unmount()

  // Recovery is discovered before a lesson's location effect; Strict Mode must not erase it.
  localStorage.clear(); sessionStorage.clear()
  const recoveryKey = "course-study-v2:synthetic-user:synthetic-course:closed-tab"
  const recoveryValue = { version: 2, savedAt: new Date().toISOString(), active: { change: { kind: "note", key: "lesson-one", text: "Unsaved note from last visit", baseRevision: 0 }, requestId: "recovery-note-0001" }, changes: [] }
  const rawRecovery = JSON.stringify(recoveryValue)
  localStorage.setItem(recoveryKey, rawRecovery)
  const recoveryServer = { value: {} }
  let recoveryCalls = 0
  globalThis.fetch = async (_url, init) => { recoveryCalls++; return acknowledge(recoveryServer, JSON.parse(init.body)) }
  await mount({ strict: true, recordLocation: true })
  assert.equal(state.recovery, true)
  assert.equal(recoveryCalls, 0)
  assert.equal(localStorage.getItem(recoveryKey), rawRecovery)
  await unmount()
  assert.equal(localStorage.getItem(recoveryKey), rawRecovery)
  await mount({ userId: "different-user", strict: true })
  assert.equal(state.recovery, false, "A different signed-in account cannot discover the note")
  await unmount()
  await mount({ strict: true, recordLocation: true })
  await act(async () => { state.recover(true); await state.flush() })
  assert.equal(recoveryCalls, 1)
  assert.equal(recoveryServer.value.study.notes["lesson-one"], "Unsaved note from last visit")
  assert.equal(localStorage.getItem(recoveryKey), null)
  assert.equal(state.recovery, false)
  assert.equal(state.status, "saved")
  await unmount()

  // A normal Strict Mode mount with a location write must not invent a recovery prompt.
  localStorage.clear(); sessionStorage.clear()
  const strictServer = { value: {} }
  globalThis.fetch = async (_url, init) => acknowledge(strictServer, JSON.parse(init.body))
  await mount({ strict: true, recordLocation: true })
  await act(async () => { await state.flush() })
  assert.equal(state.recovery, false)
  assert.equal(state.status, "saved")
  assert.equal(strictServer.value.study.lastLocation.chapterKey, "lesson-one")
  await unmount()
  // Inline check events are persisted without changing the note/activity workspace state.
  const inlineServer = { value: {} }
  globalThis.fetch = async (_url, init) => acknowledge(inlineServer, JSON.parse(init.body))
  await mount({ initial: { notes: { "lesson-one": "Keep this note" } } })
  await act(async () => { state.change({ kind: "check", questionId: "D001", answer: 2, confidence: "high" }); await state.flush() })
  assert.equal(state.study.notes["lesson-one"], "Keep this note")
  assert.equal(inlineServer.value.questionReview.D001.successes, 1)
  assert.equal(inlineServer.value.study.revisions["check:D001"], 1)
  await act(async () => { state.change({ kind: "check", questionId: "D001", answer: 2, confidence: "high" }); await state.flush() })
  assert.equal(inlineServer.value.questionReview.D001.successes, 1)
  assert.equal(inlineServer.value.exposure.D001, 2)
  assert.equal(state.status, "saved")
  await unmount()
  // A recovered check older than the receipt window must conflict without adding recall.
  localStorage.clear(); sessionStorage.clear()
  const staleCheck = { kind: "check", questionId: "D001", answer: 2, confidence: "high", baseRevision: 0 }
  const staleQuestion = { id: "D001", set: "drill", answer: 2 }
  const staleServer = { value: model.applyStudyChange({}, staleCheck, "stale-inline-001", "2026-01-01T00:00:00.000Z", staleQuestion).data }
  for (let i = 0; i < 90; i++) staleServer.value = model.applyStudyChange(staleServer.value, { kind: "location", chapterKey: "lesson-one" }, `stale-receipt-pruning-${i}`).data
  const staleRecovery = {
    version: 2, savedAt: new Date().toISOString(), active: { change: staleCheck, requestId: "stale-inline-001" },
    changes: [{ change: { kind: "note", key: "lesson-two", text: "Preserve this queued note", baseRevision: 0 }, requestId: "stale-note-001" }],
  }
  localStorage.setItem("course-study-v2:synthetic-user:synthetic-course:closed-tab", JSON.stringify(staleRecovery))
  globalThis.fetch = async (_url, init) => {
    try { return acknowledge(staleServer, JSON.parse(init.body)) }
    catch (error) {
      if (!(error instanceof model.ProgressConflictError)) throw error
      return Response.json({ error: error.message, code: "PROGRESS_CONFLICT", revision: error.revision, progress: error.progress }, { status: 409 })
    }
  }
  await mount({ initial: model.publicProgress(staleServer.value).study })
  await act(async () => { state.recover(true); await state.flush() })
  assert.equal(state.status, "conflict")
  assert.equal(staleServer.value.exposure.D001, 1)
  assert.equal(staleServer.value.questionReview.D001.successes, 1)
  assert.equal(staleServer.value.practiceRevision, 1)
  await act(async () => { state.resolve(false); await state.flush() })
  assert.equal(staleServer.value.study.notes["lesson-two"], "Preserve this queued note")
  assert.equal(staleServer.value.exposure.D001, 1)
  assert.equal(state.status, "saved")
  await unmount()
  console.log("Study progress DOM checks passed: slow-save ordering, lost-response replay, independent edits, explicit conflicts, account-scoped recovery and Strict Mode/location safety.")
} finally {
  if (mounted) await act(async () => mounted.root.unmount())
  globalThis.fetch = originalFetch
  dom.window.close()
  delete globalThis.window; delete globalThis.document; delete globalThis.localStorage; delete globalThis.sessionStorage; delete globalThis.IS_REACT_ACT_ENVIRONMENT
  await fs.rm(scratch, { recursive: true, force: true })
}
