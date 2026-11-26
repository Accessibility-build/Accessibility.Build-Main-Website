// Team progress report: completion facts only, safe CSV. No database.
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { build } from "esbuild"

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "course-team-report-"))
try {
  const out = path.join(temp, "model.mjs")
  await build({ entryPoints: ["lib/courses/team-report-model.ts"], outfile: out, bundle: true, platform: "node", format: "esm" })
  const { teamReportRow, teamReportCsv } = await import(pathToFileURL(out).href)

  const meta = { slug: "s", edition: "1", built: "", parts: [], sections: [], questionCount: 0, flashcardCount: 0, chapters: [
    { key: "a", number: 1, title: "A", part: "", outlineRef: "", bokPages: "", activityIds: ["act-1"], activityVersions: { "act-1": "2" } },
    { key: "b", number: 2, title: "B", part: "", outlineRef: "", bokPages: "", activityIds: ["act-2"], activityVersions: { "act-2": "1" } },
  ] }
  const now = new Date("2026-11-25T00:00:00Z")

  // Invited but not signed in: nothing is reported as done.
  const invited = teamReportRow(meta, { email: "new@example.com", userId: null }, now)
  assert.deepEqual([invited.joined, invited.lessonsDone, invited.lessonsTotal, invited.activitiesDone, invited.activitiesTotal, invited.examPassedAt, invited.certificate], [false, 0, 2, 0, 2, null, null])

  // A member part way through. An activity completed in an old version does not count.
  const progress = { chaptersDone: ["a"], study: { notes: { a: "private note" }, activities: { "act-1": { version: "1", completedAt: "2026-11-01T00:00:00Z" }, "act-2": { version: "1", completedAt: "2026-11-02T00:00:00Z" } } } }
  const member = teamReportRow(meta, { email: "sam@example.com", userId: "u1", progress, examPassedAt: null }, now)
  assert.deepEqual([member.joined, member.lessonsDone, member.activitiesDone, member.examPassedAt], [true, 1, 1, null])
  assert.ok(!JSON.stringify(member).includes("private note"), "notes never reach the report")

  // Certificate states: valid, expired, revoked.
  const base = { email: "x@example.com", userId: "u2", progress: { chaptersDone: ["a", "b"] }, examPassedAt: new Date("2026-06-01T10:00:00Z") }
  const cert = (extra) => teamReportRow(meta, { ...base, certificate: { code: "AB-2345-6789", issuedAt: "2026-06-01T10:00:00Z", expiresAt: "2028-06-01T10:00:00Z", revokedAt: null, ...extra } }, now).certificate
  assert.equal(cert({}).state, "valid")
  assert.equal(cert({ expiresAt: "2026-01-01T00:00:00Z" }).state, "expired")
  assert.equal(cert({ revokedAt: "2026-07-01T00:00:00Z" }).state, "revoked")
  assert.equal(cert({ expiresAt: null }).expiresAt, null, "a certificate with no expiry stays open-ended")

  // CSV: a header, one line per seat, quoted where needed, and no cell a spreadsheet would run as a formula.
  const rows = [
    teamReportRow(meta, { ...base, email: 'odd,"name"@example.com', certificate: { code: "AB-2345-6789", issuedAt: "2026-06-01T10:00:00Z", expiresAt: "2028-06-01T10:00:00Z", revokedAt: null } }, now),
    teamReportRow(meta, { email: "=cmd|calc@example.com", userId: null }, now),
  ]
  const csv = teamReportCsv(rows, { exam: true })
  assert.ok(csv.startsWith("﻿Email,Joined,Lessons completed"), "UTF-8 mark and header")
  const lines = csv.trimEnd().split("\r\n")
  assert.equal(lines.length, 3)
  assert.ok(lines[1].startsWith('"odd,""name""@example.com",Yes,2,2,0,2,2026-06-01,AB-2345-6789,valid,2026-06-01,2028-06-01'), lines[1])
  assert.ok(lines[2].startsWith("'=cmd|calc@example.com,No,0,2,0,2,,,,,"), lines[2])
  const short = teamReportCsv(rows, { exam: false }).trimEnd().split("\r\n")
  assert.equal(short[0].split(",").length, 6, "courses without a final exam get no exam or certificate columns")

  console.log("Team report checks passed: completion facts only, outdated activity versions excluded, certificate states, and formula-safe CSV.")
} finally {
  fs.rmSync(temp, { recursive: true, force: true })
}
