// Synthetic fixtures only. Optional --database uses a disposable, isolated schema
// and never reads or writes the site's learner progress or user tables.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { createRequire } from "node:module"
import { build } from "esbuild"

const require = createRequire(import.meta.url)
const scratch = await fs.mkdtemp(path.join(os.tmpdir(), "course-progress-tests-"))
const project = process.cwd()
await fs.symlink(path.join(project, "node_modules"), path.join(scratch, "node_modules"), "dir")
async function bundle(entry, name, plugins = []) {
  const outfile = path.join(scratch, `${name}.cjs`)
  await build({ entryPoints: [path.join(project, entry)], outfile, bundle: true, platform: "node", format: "cjs", packages: "external", plugins })
  return require(outfile)
}
class MemoryStorage {
  values = new Map()
  get length() { return this.values.size }
  key(i) { return [...this.values.keys()][i] ?? null }
  getItem(key) { return this.values.get(key) ?? null }
  setItem(key, value) { this.values.set(key, value) }
  removeItem(key) { this.values.delete(key) }
  clear() { this.values.clear() }
}
const later = () => new Promise((resolve) => setImmediate(resolve))
const fixture = (n = 1) => ({ history: [], cards: {}, missed: { D001: n }, session: null, sessions: {}, exposure: {}, cardReview: {}, questionReview: {}, edition: "fixture-1" })

try {
  const model = await bundle("lib/courses/progress-model.ts", "model")
  const client = await bundle("lib/courses/progress-client.ts", "client")

  let state = model.applyChapterChange({}, "lesson-one", true)
  const saved = model.applyPracticeChange(state, fixture(), 0, "request-0001")
  assert.equal(saved.revision, 1)
  assert.deepEqual(saved.data.chaptersDone, ["lesson-one"])
  assert.equal(model.applyPracticeChange(saved.data, fixture(), 0, "request-0001").revision, 1, "An uncertain response must be safe to retry")
  assert.throws(() => model.applyPracticeChange(saved.data, fixture(2), 0, "request-0002"), model.ProgressConflictError)
  assert.throws(() => model.applyPracticeChange(saved.data, fixture(2), 1, "request-0001"), model.ProgressValidationError, "A request ID cannot acknowledge a different change")
  assert.throws(() => model.applyPracticeChange({}, fixture(), undefined, undefined), model.ProgressValidationError, "Legacy clients must refresh before replacing progress")
  assert.throws(() => model.validatePractice({ ...fixture(), study: { notes: { secret: "overwrite" } } }), model.ProgressValidationError)
  assert.throws(() => model.validatePractice(JSON.parse('{"cards":{"__proto__":1}}')), model.ProgressValidationError)
  assert.throws(() => model.validatePractice({ cards: { card1: 2 } }), model.ProgressValidationError)
  assert.throws(() => model.validatePractice({ cardReview: { card1: { dueAt: "invalid", lastReviewed: "invalid", intervalDays: -1, successes: 0, lapses: 0 } } }), model.ProgressValidationError)
  assert.throws(() => model.applyChapterChange({}, "lesson-one", "false"), model.ProgressValidationError)
  assert.equal(model.publicProgress(saved.data)._receipts, undefined)

  state = model.applyStudyChange(saved.data, { kind: "note", key: "lesson-one", text: "My first note", baseRevision: 0 }, "study-00001").data
  state = model.applyStudyChange(state, { kind: "note", key: "lesson-two", text: "Independent note", baseRevision: 0 }, "study-00002").data
  assert.equal(state.study.notes["lesson-one"], "My first note")
  assert.equal(state.study.notes["lesson-two"], "Independent note")
  assert.equal(state.practiceRevision, 1)
  assert.throws(() => model.applyStudyChange(state, { kind: "note", key: "lesson-one", text: "Stale overwrite", baseRevision: 0 }, "study-00003"), model.ProgressConflictError)
  const duplicateNote = model.applyStudyChange(state, { kind: "note", key: "lesson-one", text: "My first note", baseRevision: 0 }, "study-00001")
  assert.equal(duplicateNote.revision, 1)
  state = model.applyStudyChange(state, { kind: "bookmark", key: "lesson-one", bookmarked: true }, "study-00004").data
  state = model.applyChapterChange(state, "lesson-two", true)
  assert.deepEqual(state.study.bookmarks, ["lesson-one"])
  assert.deepEqual(state.chaptersDone, ["lesson-one", "lesson-two"])
  assert.throws(() => model.validateStudyChange({ kind: "note", key: "lesson-one", text: "x".repeat(12001), baseRevision: 0 }), model.ProgressValidationError)

  // Inline learning checks use the server answer key and the same delayed-review schedule.
  const drill = { id: "D001", set: "drill", answer: 2 }
  const check = { kind: "check", questionId: drill.id, answer: 2, confidence: "high", baseRevision: 0 }
  const firstCheck = model.applyStudyChange({}, check, "inline-check-001", "2026-01-01T00:00:00.000Z", drill)
  assert.equal(firstCheck.data.questionReview.D001.successes, 1)
  assert.equal(firstCheck.data.exposure.D001, 1)
  assert.equal(firstCheck.data.practiceRevision, 1)
  const sameSitting = model.applyStudyChange(firstCheck.data, { ...check, baseRevision: 1 }, "inline-check-002", "2026-01-01T00:01:00.000Z", drill)
  assert.equal(sameSitting.data.questionReview.D001.successes, 1, "Repeated clicks in one sitting cannot claim delayed mastery")
  const repeated = model.applyStudyChange(sameSitting.data, check, "inline-check-001", "2026-01-03T00:00:00.000Z", drill)
  assert.deepEqual(repeated.data.questionReview, sameSitting.data.questionReview, "A replay of an earlier check cannot reschedule it")
  assert.equal(repeated.data.exposure.D001, 2)
  assert.equal(repeated.data.practiceRevision, 2)
  const delayed = model.applyStudyChange(sameSitting.data, { ...check, baseRevision: 2 }, "inline-check-003", "2026-01-03T00:00:00.000Z", drill)
  assert.equal(delayed.data.questionReview.D001.successes, 2)
  assert.equal(delayed.data.questionReview.D001.intervalDays, 3)
  const wrong = model.applyStudyChange(delayed.data, { ...check, answer: 0, baseRevision: 3 }, "inline-check-004", "2026-01-04T00:00:00.000Z", drill)
  assert.equal(wrong.data.questionReview.D001.successes, 0)
  assert.equal(wrong.data.questionReview.D001.lapses, 1)
  assert.equal(wrong.data.missed.D001, 1)
  assert.throws(() => model.applyPracticeChange(firstCheck.data, fixture(), 0, "stale-open-practice"), model.ProgressConflictError)
  assert.throws(() => model.applyStudyChange({}, check, "inline-mock-denied", undefined, { ...drill, set: "A" }), model.ProgressValidationError)
  assert.throws(() => model.applyStudyChange({}, check, "inline-missing-denied"), model.ProgressValidationError)
  assert.throws(() => model.validateStudyChange({ ...check, correct: true }), model.ProgressValidationError, "Caller-supplied correctness is never accepted")
  let pruned = firstCheck.data
  for (let i = 0; i < 90; i++) pruned = model.applyStudyChange(pruned, { kind: "location", chapterKey: "lesson-one" }, `receipt-pruning-${i}`).data
  assert.equal(pruned._receipts.some((item) => item.id === "inline-check-001"), false)
  assert.throws(() => model.applyStudyChange(pruned, check, "inline-check-001", "2026-02-01T00:00:00.000Z", drill), model.ProgressConflictError, "A replay after receipt pruning cannot become a delayed successful recall")
  assert.equal(pruned.exposure.D001, 1)
  assert.equal(pruned.questionReview.D001.successes, 1)
  assert.equal(pruned.practiceRevision, 1)
  assert.equal(pruned.study.revisions["check:D001"], 1)

  // Requests are genuinely serialized, including changes made during a slow save.
  const calls = []
  const storage = new MemoryStorage()
  const queue = client.createPracticeSaveController({ slug: "synthetic-course", userId: "synthetic-user", initial: {}, storage, tabId: "tab-serial", fetch: (_url, init) => new Promise((resolve) => { calls.push({ body: JSON.parse(init.body), resolve }) }) })
  queue.enqueue(fixture(1)); queue.enqueue(fixture(2)); queue.enqueue(fixture(3))
  assert.equal(calls.length, 1)
  assert.equal(calls[0].body.baseRevision, 0)
  calls[0].resolve(Response.json({ ok: true, revision: 1, progress: { ...fixture(1), practiceRevision: 1 } }))
  await later()
  assert.equal(calls.length, 2)
  assert.equal(calls[1].body.baseRevision, 1)
  assert.equal(calls[1].body.state.missed.D001, 3, "The newest queued state must follow the acknowledged save")
  calls[1].resolve(Response.json({ ok: true, revision: 2, progress: { ...fixture(3), practiceRevision: 2 } }))
  await queue.flush()
  assert.equal(queue.getStatus().state, "saved")
  assert.equal(storage.length, 0, "Acknowledged recovery data is removed")
  queue.dispose()

  // Server commit followed by a lost response: retry the same ID, not a new write.
  let server = {}
  const uncertainIds = []
  const uncertain = client.createPracticeSaveController({ slug: "synthetic-course", userId: "synthetic-user", initial: {}, storage, tabId: "tab-uncertain", fetch: async (_url, init) => {
    const body = JSON.parse(init.body); uncertainIds.push(body.requestId)
    const applied = model.applyPracticeChange(server, body.state, body.baseRevision, body.requestId)
    server = applied.data
    if (uncertainIds.length === 1) throw new Error("Synthetic response loss")
    return Response.json({ ok: true, revision: applied.revision, progress: model.publicProgress(server) })
  } })
  uncertain.enqueue(fixture())
  await uncertain.flush()
  assert.equal(uncertain.getStatus().state, "offline")
  await uncertain.retry()
  assert.equal(uncertainIds[0], uncertainIds[1])
  assert.equal(server.practiceRevision, 1)
  assert.equal(uncertain.getStatus().state, "saved")
  uncertain.dispose()

  // Concurrent device conflicts retain a downloadable local copy and stop sending.
  const conflictRemote = { ...fixture(9), practiceRevision: 4 }
  let conflictCalls = 0
  const conflict = client.createPracticeSaveController({ slug: "synthetic-course", userId: "synthetic-user", initial: {}, storage, tabId: "tab-conflict", fetch: async () => { conflictCalls++; return Response.json({ error: "Changed elsewhere", code: "PROGRESS_CONFLICT", revision: 4, progress: conflictRemote }, { status: 409 }) } })
  conflict.enqueue(fixture(2)); await conflict.flush()
  assert.equal(conflict.getStatus().state, "conflict")
  conflict.enqueue(fixture(3)); await conflict.retry()
  assert.equal(conflictCalls, 1)
  assert.equal(JSON.parse(conflict.exportLocal()).state.missed.D001, 3)
  assert.deepEqual(conflict.useRemote(), conflictRemote)
  assert.equal(conflict.getStatus().state, "saved")
  conflict.dispose()

  // Recovery survives a tab being closed and remains scoped to the signed-in account.
  const offline = client.createPracticeSaveController({ slug: "synthetic-course", userId: "owner-a", initial: {}, storage, tabId: "old-tab", fetch: async () => { throw new Error("Synthetic offline") } })
  offline.enqueue(fixture(7)); await offline.flush(); offline.dispose(); await later()
  const otherAccount = client.createPracticeSaveController({ slug: "synthetic-course", userId: "owner-b", initial: {}, storage, tabId: "new-tab" })
  assert.equal(otherAccount.getRecovery(), null)
  otherAccount.dispose()
  let recoveryCalls = 0
  const restored = client.createPracticeSaveController({ slug: "synthetic-course", userId: "owner-a", initial: {}, storage, tabId: "new-tab", fetch: async (_url, init) => {
    recoveryCalls++; const body = JSON.parse(init.body)
    return Response.json({ ok: true, revision: 1, progress: { ...body.state, practiceRevision: 1 } })
  } })
  assert.equal(restored.getStatus().state, "recovery")
  assert.equal(recoveryCalls, 0, "Local work is never applied without a choice")
  assert.equal(restored.recoverLocal().missed.D001, 7)
  await restored.flush()
  assert.equal(recoveryCalls, 1)
  assert.equal(restored.getStatus().state, "saved")
  restored.dispose()
  console.log("Course progress unit checks passed: validation, isolated merges, CAS, idempotency, sequential saves, response-loss retry, conflicts and account-scoped recovery.")

  if (process.argv.includes("--database")) {
    const dotenv = require("dotenv")
    for (const file of [".env", ".env.local"]) {
      try { Object.assign(process.env, dotenv.parse(await fs.readFile(file))) } catch { /* environment may already be supplied */ }
    }
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for --database")
    const postgres = require("postgres")
    const sql = postgres(process.env.DATABASE_URL, { max: 4, prepare: false, connect_timeout: 10, onnotice: () => {} })
    const schemaName = `course_progress_test_${process.pid}_${Date.now()}`
    assert.match(schemaName, /^course_progress_test_\d+_\d+$/)
    globalThis.__courseProgressTestSql = sql
    const plugins = [{ name: "isolated-course-test-database", setup(builder) {
      builder.onResolve({ filter: /^server-only$/ }, () => ({ path: "server-only", namespace: "test-empty" }))
      builder.onLoad({ filter: /.*/, namespace: "test-empty" }, () => ({ contents: "export {}", loader: "js", resolveDir: project }))
      builder.onResolve({ filter: /^@\/lib\/db$/ }, () => ({ path: "database", namespace: "test-database" }))
      builder.onLoad({ filter: /.*/, namespace: "test-database" }, () => ({ contents: 'import {drizzle} from "drizzle-orm/postgres-js"; export const db=drizzle(globalThis.__courseProgressTestSql);', loader: "js", resolveDir: project }))
      builder.onResolve({ filter: /^@\/lib\/db\/schema$/ }, () => ({ path: "schema", namespace: "test-schema" }))
      builder.onLoad({ filter: /.*/, namespace: "test-schema" }, () => ({ contents: `import {pgSchema,text,jsonb,timestamp,primaryKey} from "drizzle-orm/pg-core";const schema=pgSchema(${JSON.stringify(schemaName)}); export const courseProgress=schema.table('course_progress',{userId:text('user_id').notNull(),courseSlug:text('course_slug').notNull(),data:jsonb('data').notNull().default({}),updatedAt:timestamp('updated_at').notNull().defaultNow()},t=>({pk:primaryKey({columns:[t.userId,t.courseSlug]})}));export const courseContent=schema.table('course_content',{courseSlug:text('course_slug').notNull(),kind:text('kind').notNull(),key:text('key').notNull(),data:jsonb('data').notNull()});`, loader: "js", resolveDir: project }))
    } }]
    let created = false
    try {
      await sql`CREATE SCHEMA ${sql(schemaName)}`; created = true
      await sql`CREATE TABLE ${sql(schemaName)}.course_progress (user_id text NOT NULL, course_slug text NOT NULL, data jsonb NOT NULL DEFAULT '{}', updated_at timestamp NOT NULL DEFAULT now(), PRIMARY KEY (user_id, course_slug))`
      await sql`CREATE TABLE ${sql(schemaName)}.course_content (course_slug text NOT NULL, kind text NOT NULL, key text NOT NULL, data jsonb NOT NULL)`
      await sql`INSERT INTO ${sql(schemaName)}.course_content (course_slug, kind, key, data) VALUES ('synthetic-course', 'question', 'D001', ${sql.json(drill)}), ('synthetic-course', 'question', 'A001', ${sql.json({ ...drill, id: "A001", set: "A" })})`
      const dbProgress = await bundle("lib/courses/progress.ts", "database-progress", plugins)
      // The row does not exist initially: INSERT ON CONFLICT + row locking must preserve all three writes.
      await Promise.all([
        dbProgress.setChapterDone("synthetic-user", "synthetic-course", "lesson-one", true),
        dbProgress.setChapterDone("synthetic-user", "synthetic-course", "lesson-two", true),
        dbProgress.saveStudyState("synthetic-user", "synthetic-course", { kind: "note", key: "lesson-one", text: "Synthetic note", baseRevision: 0 }, "database-note-1"),
      ])
      const merged = await dbProgress.getCourseProgress("synthetic-user", "synthetic-course")
      assert.deepEqual([...merged.chaptersDone].sort(), ["lesson-one", "lesson-two"])
      assert.equal(merged.study.notes["lesson-one"], "Synthetic note")
      const writes = await Promise.allSettled([
        dbProgress.savePracticeState("synthetic-user", "synthetic-course", fixture(1), 0, "database-practice-1"),
        dbProgress.savePracticeState("synthetic-user", "synthetic-course", fixture(2), 0, "database-practice-2"),
      ])
      assert.equal(writes.filter((item) => item.status === "fulfilled").length, 1)
      const rejected = writes.find((item) => item.status === "rejected")
      assert.equal(rejected.reason.constructor.name, "ProgressConflictError")
      const after = await dbProgress.getCourseProgress("synthetic-user", "synthetic-course")
      assert.equal(after.practiceRevision, 1)
      assert.equal(after.study.notes["lesson-one"], "Synthetic note")
      const checked = await dbProgress.saveStudyState("synthetic-user", "synthetic-course", check, "database-inline-1")
      assert.equal(checked.progress.practiceRevision, 2)
      assert.equal(checked.progress.exposure.D001, 1)
      const checkedAgain = await dbProgress.saveStudyState("synthetic-user", "synthetic-course", check, "database-inline-1")
      assert.equal(checkedAgain.progress.practiceRevision, 2)
      assert.equal(checkedAgain.progress.exposure.D001, 1)
      await assert.rejects(() => dbProgress.saveStudyState("synthetic-user", "synthetic-course", { ...check, questionId: "A001" }, "database-mock-denied"), /Reserved mock/)
      await assert.rejects(() => dbProgress.saveStudyState("synthetic-user", "other-course", check, "database-other-course"), /not available/)
      console.log("Course progress database checks passed: concurrent first writes merge atomically, and competing practice revisions allow exactly one winner.")
    } finally {
      if (created) await sql`DROP SCHEMA ${sql(schemaName)} CASCADE`
      await sql.end()
      delete globalThis.__courseProgressTestSql
    }
  }
} finally { await fs.rm(scratch, { recursive: true, force: true }) }
