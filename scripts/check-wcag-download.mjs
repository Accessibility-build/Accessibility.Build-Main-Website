#!/usr/bin/env node
// Verifies the WCAG 2.2 download dataset (lib/wcag-download.ts) before it
// ships. Exits non-zero, listing every failure, when:
//   - the committed W3C snapshot does not match its recorded sha256;
//   - the W3C criteria and lib/wcag-data.ts disagree on the set, titles,
//     levels, guidelines or version introduced (buildWcagDownload throws);
//   - the totals or the A/AA/AAA split differ from getWCAGStats();
//   - 4.1.1 appears anywhere in the 2.2 set;
//   - W3C text contains leftover HTML or entities, or starts with a
//     formula-trigger character (which would make the CSV guard alter it);
//   - the CSV, JSON or workbook do not round-trip to the same rows.
//
//   node scripts/check-wcag-download.mjs
//
// Loads the TypeScript modules through jiti (installed with eslint), which is
// why lib/wcag-download.ts uses relative imports.

import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { createJiti } from "jiti"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const jiti = createJiti(import.meta.url)

const failures = []
const fail = (msg) => failures.push(msg)

const { W3C_WCAG22_META } = await jiti.import(join(root, "lib/data/w3c-wcag22.meta.ts"))
const { getWCAGStats, wcagCriteria } = await jiti.import(join(root, "lib/wcag-data.ts"))
const dl = await jiti.import(join(root, "lib/wcag-download.ts"))
const { buildWcagXlsx } = await jiti.import(join(root, "lib/wcag-download-xlsx.ts"))
const XLSX = await import("xlsx")

// 1. Snapshot integrity
const raw = readFileSync(join(root, "lib/data/w3c-wcag22.json"))
const sha = createHash("sha256").update(raw).digest("hex")
if (sha !== W3C_WCAG22_META.sha256) fail(`snapshot sha256 ${sha} != recorded ${W3C_WCAG22_META.sha256}`)
if (raw.length !== W3C_WCAG22_META.bytes) fail(`snapshot is ${raw.length} bytes, recorded ${W3C_WCAG22_META.bytes}`)

// 2. Build (throws on any disagreement with lib/wcag-data.ts)
let built
try {
  built = dl.buildWcagDownload()
} catch (err) {
  console.error(String(err.message ?? err))
  process.exit(1)
}
const { rows, counts, excluded } = built
const stats = getWCAGStats()

// 3. Counts, derived from lib/wcag-data.ts, never literals
if (rows.length !== stats.total) fail(`rows ${rows.length} != getWCAGStats().total ${stats.total}`)
if (rows.length !== wcagCriteria.length) fail(`rows ${rows.length} != wcagCriteria.length ${wcagCriteria.length}`)
for (const level of ["A", "AA", "AAA"]) {
  if (counts.byLevel[level] !== stats.byLevel[level]) {
    fail(`level ${level}: ${counts.byLevel[level]} != getWCAGStats() ${stats.byLevel[level]}`)
  }
}
const introducedFromOurs = { "2.0": 0, "2.1": 0, "2.2": 0 }
for (const c of wcagCriteria) introducedFromOurs[c.introduced] += 1
for (const v of ["2.0", "2.1", "2.2"]) {
  if (counts.byIntroducedIn[v] !== introducedFromOurs[v]) {
    fail(`introduced ${v}: ${counts.byIntroducedIn[v]} != lib/wcag-data.ts ${introducedFromOurs[v]}`)
  }
}

// 4. 4.1.1 must be excluded, and must be the only exclusion
if (rows.some((r) => r.ref === "4.1.1")) fail("4.1.1 is in the 2.2 rows")
if (excluded.length !== 1 || excluded[0].ref !== "4.1.1") {
  fail(`expected exactly one exclusion (4.1.1), got ${JSON.stringify(excluded)}`)
}

// 5. Text hygiene
for (const r of rows) {
  if (/[<>]|&[a-z#0-9]+;/i.test(r.w3c_text)) fail(`${r.ref} w3c_text has leftover markup: ${r.w3c_text.slice(0, 120)}`)
  for (const col of dl.WCAG_COLUMNS) {
    const v = dl.cellText(r, col.key)
    if (/^[=+\-@\t\r]/.test(v)) fail(`${r.ref} ${col.key} starts with a formula character; the CSV guard would alter it`)
    if (v.trim() === "") fail(`${r.ref} ${col.key} is empty`)
  }
  if (r.accessibility_build_summary === r.w3c_text) {
    // Allowed (a few summaries equal the W3C lead sentence), just report it.
  }
}

// 6. Column dictionary examples match the 1.4.3 row (w3c_text example is truncated)
const sample = rows.find((r) => r.ref === "1.4.3")
for (const col of dl.WCAG_COLUMNS) {
  const actual = dl.cellText(sample, col.key)
  const ok = col.key === "w3c_text" ? actual.startsWith(col.example.replace(/ \.\.\.$/, "")) : actual === col.example
  if (!ok) fail(`column ${col.key} example "${col.example}" does not match 1.4.3 value "${actual}"`)
}

// 7. CSV round trip (RFC 4180 parser, quoted newlines allowed)
function parseCsv(text) {
  const out = []
  let row = []
  let field = ""
  let i = 0
  let quoted = false
  while (i < text.length) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue }
      if (ch === '"') { quoted = false; i += 1; continue }
      field += ch; i += 1; continue
    }
    if (ch === '"') { quoted = true; i += 1; continue }
    if (ch === ",") { row.push(field); field = ""; i += 1; continue }
    if (ch === "\r" && text[i + 1] === "\n") { row.push(field); out.push(row); row = []; field = ""; i += 2; continue }
    if (ch === "\n") { fail("CSV has a bare LF record separator"); row.push(field); out.push(row); row = []; field = ""; i += 1; continue }
    field += ch; i += 1
  }
  if (field !== "" || row.length) { row.push(field); out.push(row) }
  return out
}
const csv = dl.buildWcagCsv()
if (!csv.startsWith("﻿")) fail("CSV has no UTF-8 BOM")
const records = parseCsv(csv.slice(1))
if (records.length !== stats.total + 1) fail(`CSV has ${records.length} records, expected ${stats.total + 1}`)
const keys = dl.WCAG_COLUMNS.map((c) => c.key)
if (records[0].join(",") !== keys.join(",")) fail(`CSV header mismatch: ${records[0].join(",")}`)
records.slice(1).forEach((rec, idx) => {
  keys.forEach((k, ci) => {
    if (rec[ci] !== dl.cellText(rows[idx], k)) fail(`CSV row ${idx + 1} column ${k} does not round-trip`)
  })
})

// 8. JSON round trip
const json = JSON.parse(dl.buildWcagJson())
if (json.criteria.length !== stats.total) fail(`JSON criteria length ${json.criteria.length}`)
if (json.metadata.counts.total !== stats.total) fail("JSON metadata.counts.total mismatch")
if (json.metadata.licence.w3cText.url !== W3C_WCAG22_META.licenceUrl) fail("JSON licence URL mismatch")
if (JSON.stringify(json.criteria) !== JSON.stringify(rows)) fail("JSON criteria do not equal the built rows")

// 9. Workbook round trip
const wb = XLSX.read(buildWcagXlsx(), { type: "buffer" })
if (wb.SheetNames.join("|") !== "WCAG 2.2|About") fail(`sheet names: ${wb.SheetNames.join("|")}`)
const sheetRows = XLSX.utils.sheet_to_json(wb.Sheets["WCAG 2.2"], { header: 1, raw: false })
if (sheetRows.length !== stats.total + 1) fail(`workbook data sheet has ${sheetRows.length} rows`)
sheetRows.slice(1).forEach((rec, idx) => {
  keys.forEach((k, ci) => {
    if ((rec[ci] ?? "") !== dl.cellText(rows[idx], k)) fail(`xlsx row ${idx + 1} column ${k} does not round-trip`)
  })
})
const refCell = wb.Sheets["WCAG 2.2"]["A2"]
if (refCell?.t !== "s") fail(`ref cells must be text, A2 type is ${refCell?.t}`)

if (failures.length > 0) {
  console.error(`WCAG download check FAILED (${failures.length}):\n- ${failures.join("\n- ")}`)
  process.exit(1)
}
console.log(
  `WCAG download check passed: ${counts.total} criteria (A ${counts.byLevel.A}, AA ${counts.byLevel.AA}, AAA ${counts.byLevel.AAA}; ` +
    `introduced 2.0 ${counts.byIntroducedIn["2.0"]}, 2.1 ${counts.byIntroducedIn["2.1"]}, 2.2 ${counts.byIntroducedIn["2.2"]}); ` +
    `excluded ${excluded.map((e) => e.ref).join(", ")}; CSV ${Buffer.byteLength(csv)} bytes.`,
)
