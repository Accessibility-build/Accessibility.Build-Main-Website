// Synthetic fixtures, stubbed authentication/AI, and optional disposable-schema DB tests.
// No learner records, payment services, or paid model requests are used.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { createRequire } from "node:module"
import { build } from "esbuild"

const require = createRequire(import.meta.url)
const { NextRequest } = require("next/server")
const project = process.cwd()
const scratch = await fs.mkdtemp(path.join(os.tmpdir(), "course-api-tests-"))
await fs.symlink(path.join(project, "node_modules"), path.join(scratch, "node_modules"), "dir")
async function bundle(entry, name, plugins = []) {
  const outfile = path.join(scratch, `${name}.cjs`)
  await build({ entryPoints: [entry], outfile, bundle: true, platform: "node", format: "cjs", packages: "external", plugins })
  return require(outfile)
}
const slug = "synthetic-course"
const ctx = (extra = {}, course = slug) => ({ params: Promise.resolve({ slug: course, ...extra }) })
const request = (pathname, body, headers = {}) => new NextRequest(`https://course.test/api/courses/${slug}/${pathname}`, body === undefined ? { headers } : { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) })
const question = (id, d, answer) => ({ id, set: "drill", d, sec: `${d}.fixture`, secTitle: "Synthetic objective", ref: "Synthetic reference", stem: `Synthetic question ${id}?`, options: ["First", "Second", "Third", "Fourth"], answer, exp: "Synthetic explanation for a test only.", page: "1" })
const fixture = (id = "attempt-001") => ({
  id, edition: "fixture-1", title: "Synthetic practice", mode: "study", startedAt: "2026-01-01T00:00:00.000Z", finishedAt: "2026-01-01T00:05:00.000Z",
  timing: { limitSeconds: 0, elapsedSeconds: 300, paused: false, continuedUntimed: false },
  ids: ["Q1", "Q2"], answers: { Q1: 1, Q2: 0 }, confidence: { Q1: "high", Q2: "low" }, questions: [question("Q1", 1, 1), question("Q2", 3, 2)], repeatedQuestions: 0,
  correct: 999, total: 999, dom: { 1: [999, 999] },
})
const chapter = { key: "fixture-lesson", number: 1, title: "Synthetic keyboard lesson", part: "Test", outlineRef: "I.B", bokPages: "1", blocks: [{ type: "h2", text: "Keyboard interaction" }, { type: "p", text: "A button has keyboard interaction. Test the expected behavior and focus before and after activating the control." }] }
let backend
let access
let failData = false
let configured = true
let progress = {}
let aiResult = "Consider the keyboard behavior first. The lesson explains the expected focus transition [1]."
let aiFailure = false
const calls = []
const stored = new Map()
const memory = {
  async saveCourseAttempt(userId, course, value) { const key = `${userId}|${course}|${value.id}`; if (!stored.has(key)) stored.set(key, structuredClone(value)); return stored.get(key) },
  async getCourseAttempt(userId, course, id) { return stored.get(`${userId}|${course}|${id}`) ?? null },
  async listCourseAttempts(userId, course, offset) { return { attempts: [...stored].filter(([key]) => key.startsWith(`${userId}|${course}|`)).slice(offset, offset + 50).map(([, value]) => ({ id: value.id, correct: value.correct, total: value.total })), nextOffset: null } },
}
const state = {
  async getCourseAccess(course) { calls.push(["access", course]); return access },
  async getCourseChapter(course, key) { calls.push(["chapter", course, key]); if (failData) throw new Error("Synthetic database failure"); return key === chapter.key ? chapter : null },
  async getCourseMeta(course) { calls.push(["meta", course]); if (failData) throw new Error("Synthetic database failure"); return { edition: "fixture-1" } },
  async getCourseChapters(course) { calls.push(["chapters", course]); if (failData) throw new Error("Synthetic database failure"); return [chapter] },
  async getCourseBank() { throw new Error("Tutor/search must never retrieve the question bank") },
  async getCourseProgress(userId, course) { calls.push(["progress", userId, course]); if (failData) throw new Error("Synthetic database failure"); return progress },
  async attempt(name, ...args) { calls.push([name, ...args.slice(0, 3)]); if (failData) throw new Error("Synthetic database failure"); return backend[name](...args) },
  configured: () => configured,
  async generateText(options) { calls.push(["ai", options]); if (aiFailure) throw new Error("Synthetic model failure"); return { text: aiResult } },
}
globalThis.__courseApiTest = state
const modules = {
  "@/lib/courses/access": 'export const getCourseAccess=(...args)=>globalThis.__courseApiTest.getCourseAccess(...args);',
  "@/lib/courses/config": `export const getCourse=(slug)=>[${JSON.stringify(slug)},"other-course"].includes(slug)?{slug}:null;`,
  "@/lib/courses/content": ["getCourseChapter", "getCourseMeta", "getCourseChapters", "getCourseBank"].map((name) => `export const ${name}=(...args)=>globalThis.__courseApiTest.${name}(...args);`).join("\n"),
  "@/lib/courses/progress": 'export const getCourseProgress=(...args)=>globalThis.__courseApiTest.getCourseProgress(...args);',
  "@/lib/courses/attempts": ["saveCourseAttempt", "getCourseAttempt", "listCourseAttempts"].map((name) => `export const ${name}=(...args)=>globalThis.__courseApiTest.attempt(${JSON.stringify(name)},...args);`).join("\n"),
  "@/lib/assistant/model": 'export const ASSISTANT_MODEL="synthetic";export const NO_REASONING={};export const openrouterFor=()=>({chatModel:()=>({id:"synthetic"})});',
  "@/lib/openrouter": 'export const isOpenRouterConfigured=()=>globalThis.__courseApiTest.configured();',
  "@/lib/rate-limit": 'export const createRateLimit=()=>async()=>null;',
  ai: 'export const generateText=(...args)=>globalThis.__courseApiTest.generateText(...args);',
}
const routePlugin = { name: "synthetic-course-api-dependencies", setup(builder) {
  builder.onResolve({ filter: /.*/ }, (args) => modules[args.path] ? { path: args.path, namespace: "course-api-fixture" } : undefined)
  builder.onLoad({ filter: /.*/, namespace: "course-api-fixture" }, (args) => ({ contents: modules[args.path], loader: "js", resolveDir: project }))
} }
const allow = (userId = "user-a") => { access = { viewer: { userId }, hasAccess: true } }

try {
  backend = memory; allow()
  const validation = await bundle("lib/courses/attempt-validation.ts", "validation")
  const attempts = await bundle("app/api/courses/[slug]/attempts/route.ts", "attempts-route", [routePlugin])
  const detail = await bundle("app/api/courses/[slug]/attempts/[id]/route.ts", "detail-route", [routePlugin])
  const search = await bundle("app/api/courses/[slug]/search/route.ts", "search-route", [routePlugin])
  const tutor = await bundle("app/api/courses/[slug]/tutor/route.ts", "tutor-route", [routePlugin])
  const validated = validation.validateAttempt(fixture())
  assert.equal(validated.correct, 1); assert.equal(validated.total, 2)
  assert.deepEqual(validated.dom, { 1: [1, 1], 3: [0, 1] })
  assert.throws(() => validation.validateAttempt({ ...fixture(), ids: ["Q1", "Q1"] }))
  assert.throws(() => validation.validateAttempt({ ...fixture(), answers: { Q3: 1 } }))
  assert.throws(() => validation.validateAttempt({ ...fixture(), confidence: { Q3: "high" } }))
  assert.throws(() => validation.validateAttempt({ ...fixture(), repeatedQuestions: 3 }))
  assert.throws(() => validation.validateAttempt({ ...fixture(), finishedAt: "2025-01-01T00:00:00.000Z" }))

  for (const gate of [{ viewer: null, hasAccess: false }, { viewer: { userId: "user-a" }, hasAccess: false }]) {
    access = gate; calls.length = 0
    const expected = gate.viewer ? 403 : 401
    assert.equal((await attempts.GET(request("attempts"), ctx())).status, expected)
    assert.equal((await attempts.POST(request("attempts", fixture()), ctx())).status, expected)
    assert.equal((await detail.GET(request("attempts/attempt-001"), ctx({ id: "attempt-001" }))).status, expected)
    assert.equal((await search.GET(request("search?q=keyboard"), ctx())).status, expected)
    assert.equal((await tutor.POST(request("tutor", { chapterKey: chapter.key, question: "How should keyboard focus behave?" }), ctx())).status, expected)
    assert.equal(calls.filter(([name]) => name !== "access").length, 0, "Entitlement must be checked before content, snapshots, or AI access")
  }
  allow()
  assert.equal((await attempts.GET(request("attempts"), ctx({}, "missing-course"))).status, 404)
  assert.equal((await attempts.GET(request("attempts?offset=-1"), ctx())).status, 400)
  assert.equal((await attempts.GET(request("attempts?offset=1.5"), ctx())).status, 400)
  assert.equal((await attempts.POST(request("attempts", "{"), ctx())).status, 400)
  assert.equal((await attempts.POST(request("attempts", "x".repeat(2 * 1024 * 1024 + 1)), ctx())).status, 413)
  const saved = await attempts.POST(request("attempts", fixture()), ctx())
  assert.equal(saved.status, 200)
  assert.equal((await saved.json()).attempt.correct, 1)
  const replay = await attempts.POST(request("attempts", { ...fixture(), title: "Changed after saving" }), ctx())
  assert.equal((await replay.json()).attempt.title, "Synthetic practice")
  assert.equal((await detail.GET(request("attempts/attempt-001"), ctx({ id: "attempt-001" }))).status, 200)
  allow("user-b")
  assert.equal((await detail.GET(request("attempts/attempt-001"), ctx({ id: "attempt-001" }))).status, 404)
  allow()
  assert.equal((await detail.GET(request("attempts/attempt-001"), ctx({ id: "attempt-001" }, "other-course"))).status, 404)
  const found = await search.GET(request("search?q=keyboard"), ctx())
  assert.equal(found.status, 200); assert.ok((await found.json()).hits.length > 0)
  assert.match(found.headers.get("cache-control"), /no-store/)

  const coachQuestion = { chapterKey: chapter.key, question: "How should keyboard focus behave?" }
  calls.length = 0
  progress = { session: { mode: "exam" } }
  assert.equal((await tutor.POST(request("tutor", coachQuestion), ctx())).status, 409)
  assert.equal(calls.filter(([name]) => name === "ai").length, 0)
  progress = {}; configured = false
  assert.equal((await tutor.POST(request("tutor", coachQuestion), ctx())).status, 503)
  configured = true
  assert.equal((await tutor.POST(request("tutor", coachQuestion, { origin: "https://other.test" }), ctx())).status, 403)
  assert.equal((await tutor.POST(request("tutor", { ...coachQuestion, chapterKey: "missing-lesson" }), ctx())).status, 404)
  calls.length = 0
  const coached = await tutor.POST(request("tutor", coachQuestion), ctx())
  assert.equal(coached.status, 200)
  const coachBody = await coached.json()
  assert.equal(coachBody.edition, "fixture-1")
  assert.ok(coachBody.sources.every((item) => item.href.startsWith(`/courses/${slug}/learn/chapters/${chapter.key}`)))
  const aiCall = calls.find(([name]) => name === "ai")[1]
  const prompt = JSON.parse(aiCall.prompt)
  assert.equal(prompt.sources.length, 1)
  assert.match(prompt.sources[0].text, /keyboard interaction/)
  assert.ok(!("questions" in prompt), "The model receives selected lesson evidence, not the question bank")
  aiFailure = true
  assert.equal((await tutor.POST(request("tutor", coachQuestion), ctx())).status, 503)
  aiFailure = false; aiResult = " "
  assert.equal((await tutor.POST(request("tutor", coachQuestion), ctx())).status, 502)
  aiResult = "Synthetic explanation [1]."

  failData = true
  assert.equal((await attempts.GET(request("attempts"), ctx())).status, 503)
  assert.equal((await attempts.POST(request("attempts", fixture("unavailable")), ctx())).status, 503)
  assert.equal((await detail.GET(request("attempts/attempt-001"), ctx({ id: "attempt-001" }))).status, 503)
  assert.equal((await search.GET(request("search?q=keyboard"), ctx())).status, 503)
  assert.equal((await tutor.POST(request("tutor", coachQuestion), ctx())).status, 503)
  failData = false
  console.log("Course API checks passed: ownership/entitlement gates, immutable retries, score recomputation, validation, private search, active-exam tutor blocking, bounded lesson evidence, and graceful failures. AI calls were stubbed.")

  if (process.argv.includes("--database")) {
    const dotenv = require("dotenv")
    for (const file of [".env", ".env.local"]) { try { Object.assign(process.env, dotenv.parse(await fs.readFile(file))) } catch {} }
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for --database")
    const sql = require("postgres")(process.env.DATABASE_URL, { prepare: false, max: 4, connect_timeout: 10, onnotice: () => {} })
    const schemaName = `course_attempt_test_${process.pid}_${Date.now()}`
    assert.match(schemaName, /^course_attempt_test_\d+_\d+$/)
    globalThis.__courseAttemptTestSql = sql
    const dbPlugin = { name: "isolated-attempt-test-database", setup(builder) {
      builder.onResolve({ filter: /^server-only$/ }, () => ({ path: "empty", namespace: "attempt-db-empty" }))
      builder.onLoad({ filter: /.*/, namespace: "attempt-db-empty" }, () => ({ contents: "export {}", loader: "js" }))
      builder.onResolve({ filter: /^@\/lib\/db$/ }, () => ({ path: "database", namespace: "attempt-db" }))
      builder.onLoad({ filter: /.*/, namespace: "attempt-db" }, () => ({ contents: 'import {drizzle} from "drizzle-orm/postgres-js";export const db=drizzle(globalThis.__courseAttemptTestSql);', loader: "js", resolveDir: project }))
      builder.onResolve({ filter: /^@\/lib\/db\/schema$/ }, () => ({ path: "schema", namespace: "attempt-schema" }))
      builder.onLoad({ filter: /.*/, namespace: "attempt-schema" }, () => ({ contents: `import {pgSchema,text,jsonb,timestamp,primaryKey} from "drizzle-orm/pg-core";export const courseAttempts=pgSchema(${JSON.stringify(schemaName)}).table('course_attempts',{userId:text('user_id').notNull(),courseSlug:text('course_slug').notNull(),id:text('id').notNull(),data:jsonb('data').notNull(),createdAt:timestamp('created_at').defaultNow().notNull()},t=>({pk:primaryKey({columns:[t.userId,t.courseSlug,t.id]})}));`, loader: "js", resolveDir: project }))
    } }
    let created = false
    try {
      await sql`CREATE SCHEMA ${sql(schemaName)}`; created = true
      await sql`CREATE TABLE ${sql(schemaName)}.course_attempts (user_id text NOT NULL, course_slug text NOT NULL, id text NOT NULL, data jsonb NOT NULL, created_at timestamp NOT NULL DEFAULT now(), PRIMARY KEY (user_id, course_slug, id))`
      backend = await bundle("lib/courses/attempts.ts", "database-attempts", [dbPlugin])
      const original = validation.validateAttempt(fixture("stable-attempt"))
      await backend.saveCourseAttempt("user-a", slug, original)
      const replayed = await backend.saveCourseAttempt("user-a", slug, { ...original, title: "Attempted overwrite" })
      assert.equal(replayed.title, original.title)
      assert.equal(await backend.getCourseAttempt("user-b", slug, original.id), null)
      assert.equal(await backend.getCourseAttempt("user-a", "other-course", original.id), null)
      await backend.saveCourseAttempt("user-b", slug, { ...original, title: "Other owner's separate review" })
      assert.equal((await backend.getCourseAttempt("user-a", slug, original.id)).title, original.title)
      const rows = Array.from({ length: 52 }, (_, i) => ({ user_id: "user-a", course_slug: slug, id: `page-attempt-${String(i).padStart(3, "0")}`, data: JSON.stringify(validation.validateAttempt(fixture(`page-attempt-${String(i).padStart(3, "0")}`))) }))
      await sql`INSERT INTO ${sql(schemaName)}.course_attempts ${sql(rows, "user_id", "course_slug", "id", "data")}`
      const first = await backend.listCourseAttempts("user-a", slug, 0)
      const second = await backend.listCourseAttempts("user-a", slug, first.nextOffset)
      assert.equal(first.attempts.length, 50); assert.equal(first.nextOffset, 50)
      assert.equal(second.attempts.length, 3); assert.equal(second.nextOffset, null)
      const ids = [...first.attempts, ...second.attempts].map((item) => item.id)
      assert.equal(new Set(ids).size, 53)
      for (const summary of [...first.attempts, ...second.attempts]) {
        assert.equal(summary.questions, undefined); assert.equal(summary.answers, undefined); assert.equal(summary.confidence, undefined)
        assert.equal(summary.detailSaved, true); assert.equal(typeof summary.timingLabel, "string")
      }
      assert.equal((await backend.listCourseAttempts("user-b", slug)).attempts.length, 1)
      console.log("Course attempt database checks passed: immutable snapshots, owner/course isolation, 50-item pagination without question payloads, and stable review summaries.")
    } finally {
      if (created) await sql`DROP SCHEMA ${sql(schemaName)} CASCADE`
      await sql.end(); delete globalThis.__courseAttemptTestSql
    }
  }
} finally { delete globalThis.__courseApiTest; await fs.rm(scratch, { recursive: true, force: true }) }
