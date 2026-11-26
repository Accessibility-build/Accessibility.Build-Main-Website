// Certificate rules: completion gate, name validation and credential codes. No database.
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { build } from "esbuild"
import { validateCourse } from "./course-content.mjs"

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "course-certificates-"))
try {
  const out = path.join(temp, "rules.mjs")
  await build({ entryPoints: ["lib/courses/certificate-rules.ts"], outfile: out, bundle: true, platform: "node", format: "esm" })
  const routesOut = path.join(temp, "routes.mjs")
  await build({ entryPoints: ["lib/courses/routes.ts"], outfile: routesOut, bundle: true, platform: "node", format: "esm" })
  const { certificateProgress, normalizeCertificateName, CERTIFICATE_CODE_RE, addMonthsUtc, certificateState, renewalWindow, renewedExpiry } = await import(pathToFileURL(out).href)
  const { isCertificatePrintPath, isCourseLearningPath } = await import(pathToFileURL(routesOut).href)

  const meta = {
    chapters: [
      { key: "a", number: 1, title: "A", activityIds: [], activityVersions: {} },
      { key: "b", number: 2, title: "B", activityIds: ["act-1"], activityVersions: { "act-1": "2" } },
    ],
  }
  const none = certificateProgress(meta, {})
  assert.equal(none.eligible, false)
  assert.equal(none.lessonsDone, 0)
  assert.equal(none.activitiesTotal, 1)

  const read = { chaptersDone: ["a", "b"] }
  assert.equal(certificateProgress(meta, read).eligible, false, "Reading alone must not earn a certificate when activities remain")

  const oldVersion = { ...read, study: { activities: { "act-1": { version: "1", completedAt: "2026-11-01T00:00:00Z" } } } }
  assert.equal(certificateProgress(meta, oldVersion).eligible, false, "An activity completed in an older version must be redone")

  const inProgress = { ...read, study: { activities: { "act-1": { version: "2" } } } }
  assert.equal(certificateProgress(meta, inProgress).eligible, false, "A started but unfinished activity does not count")

  const complete = { ...read, study: { activities: { "act-1": { version: "2", completedAt: "2026-11-21T00:00:00Z" } } } }
  const done = certificateProgress(meta, complete)
  assert.equal(done.eligible, true)
  assert.deepEqual([done.lessonsDone, done.activitiesDone], [2, 1])
  assert.equal(certificateProgress({ chapters: [] }, complete).eligible, false, "A course with no lessons cannot issue certificates")

  assert.equal(normalizeCertificateName("  Priya   Raghunathan-Okafor "), "Priya Raghunathan-Okafor")
  assert.equal(normalizeCertificateName("José Ñúñez O'Brien"), "José Ñúñez O'Brien")
  assert.equal(normalizeCertificateName("李小龍"), "李小龍")
  for (const bad of ["", "A", "x".repeat(81), "12345", "<script>", "a@b.com", "Name / Other", null, 42]) assert.equal(normalizeCertificateName(bad), null, `rejects ${bad}`)

  assert.ok(CERTIFICATE_CODE_RE.test("AB-7K3M-9Q2X"))
  for (const bad of ["AB-7K3M-9Q2", "ab-7k3m-9q2x", "AB-7K3M-9Q2O", "AB-1K3M-9Q2X", "XY-7K3M-9Q2X"]) assert.ok(!CERTIFICATE_CODE_RE.test(bad), bad)

  assert.ok(isCertificatePrintPath("/certificates/AB-7K3M-9Q2X/print"))
  assert.ok(!isCertificatePrintPath("/certificates/AB-7K3M-9Q2X"))
  assert.ok(!isCertificatePrintPath("/courses/x/learn"))
  assert.ok(isCourseLearningPath("/courses/accessible-design/learn/certificate"))

  // A skills course may ship without mock sets; exam-prep courses still need them weighted.
  const course = { slug: "s", chapters: [{ key: "a", blocks: [{ type: "p", text: "x" }] }], sections: [{ ref: "I.A", domain: 1, title: "A" }], questions: [{ id: "q1", set: "drill", d: 1, sec: "I.A", stem: "Q?", exp: "E", options: ["a", "b", "c", "d"], answer: 0 }], flashcards: [] }
  assert.deepEqual(validateCourse(course), [])
  assert.ok(validateCourse({ ...course, questions: [...course.questions, { ...course.questions[0], id: "q2", set: "A" }] }).some((e) => e.includes("weighting")))
  const svgCourse = (svg) => ({ ...course, chapters: [{ key: "a", blocks: [{ type: "figure", caption: "c", alt: "a", svg }] }] })
  assert.deepEqual(validateCourse(svgCourse('<svg viewBox="0 0 10 10"><rect width="5" height="5"/></svg>')), [])
  for (const evil of ['<svg viewBox="0 0 1 1"><script>alert(1)</script></svg>', '<svg viewBox="0 0 1 1" onload="x()"></svg>', '<svg viewBox="0 0 1 1"><a href="https://x.test"><rect/></a></svg>', '<svg viewBox="0 0 1 1"><foreignObject/></svg>', '<div>not svg</div>'])
    assert.ok(validateCourse(svgCourse(evil)).length > 0, `rejects ${evil}`)

  // Validity: two years, clamped month ends, states and the renewal window.
  const d = (iso) => new Date(iso)
  assert.equal(addMonthsUtc(d("2026-11-21T10:00:00Z"), 24).toISOString(), "2028-11-21T10:00:00.000Z")
  assert.equal(addMonthsUtc(d("2028-02-29T00:00:00Z"), 24).toISOString(), "2030-02-28T00:00:00.000Z", "leap day clamps to 28 February")
  assert.equal(addMonthsUtc(d("2026-01-31T00:00:00Z"), 1).toISOString(), "2026-02-28T00:00:00.000Z")
  const now = d("2027-06-01T00:00:00Z")
  assert.equal(certificateState({ revokedAt: null, expiresAt: "2028-01-01T00:00:00Z" }, now), "valid")
  assert.equal(certificateState({ revokedAt: null, expiresAt: "2027-05-31T00:00:00Z" }, now), "expired")
  assert.equal(certificateState({ revokedAt: "2027-01-01T00:00:00Z", expiresAt: "2027-05-31T00:00:00Z" }, now), "revoked", "revoked wins over expired")
  assert.equal(certificateState({ revokedAt: null, expiresAt: null }, now), "valid", "no expiry means valid")
  const rules = { opensDaysBefore: 60, closesMonthsAfter: 12 }
  const expiry = "2027-08-01T00:00:00Z"
  assert.equal(renewalWindow(expiry, rules, d("2027-05-01T00:00:00Z")).phase, "early")
  assert.equal(renewalWindow(expiry, rules, d("2027-06-15T00:00:00Z")).phase, "open", "opens 60 days before expiry")
  assert.equal(renewalWindow(expiry, rules, d("2028-07-31T00:00:00Z")).phase, "open", "still open 12 months after")
  assert.equal(renewalWindow(expiry, rules, d("2028-08-01T00:00:00Z")).phase, "closed")
  assert.equal(renewedExpiry(expiry, 24, d("2027-07-01T00:00:00Z")).toISOString(), "2029-08-01T00:00:00.000Z", "early renewal keeps the remaining time")
  assert.equal(renewedExpiry(expiry, 24, d("2028-03-10T00:00:00Z")).toISOString(), "2030-03-10T00:00:00.000Z", "late renewal starts from the renewal date")

  // The renewal product: signed-in only, priced from config, listed for the Dodo sync.
  const sellOut = path.join(temp, "sell.mjs")
  await build({ entryPoints: ["lib/billing/sellables.ts"], outfile: sellOut, bundle: true, platform: "node", format: "esm", alias: { "@": process.cwd() } })
  const sell = await import(pathToFileURL(sellOut).href)
  const renewalItem = sell.getSellable("renewal:accessible-design")
  assert.equal(renewalItem.kind, "renewal"); assert.equal(renewalItem.priceUsdCents, 2900); assert.deepEqual(renewalItem.renewal, { slug: "accessible-design", attempts: 3 })
  assert.equal(sell.getSellable("renewal:was-crash-course"), null, "courses without certificates have no renewal")
  assert.ok(sell.listSellableKeys().includes("renewal:accessible-design"))

  console.log("Certificate checks passed: completion gate, activity versions, name validation, credential codes, print route, validity and renewal window, renewal product, skills-course validation and SVG safety.")
} finally {
  fs.rmSync(temp, { recursive: true, force: true })
}
