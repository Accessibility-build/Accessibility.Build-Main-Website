#!/usr/bin/env node
// Builds lib/data/en-301-549-v4-checklist.json from the official ETSI PDF of
// EN 301 549 V4.1.1 (2026-09), and diffs it against the committed V3.2.1
// dataset (lib/data/en-301-549-checklist.json).
//
//   node scripts/en301549/build-v4-checklist.mjs --v4 <en_301549v040101p.pdf> [--v3 <en_301549v030201p.pdf>]
//   node scripts/en301549/build-v4-checklist.mjs --v4 <pdf> --needs      # list rows that still need a summary
//   node scripts/en301549/build-v4-checklist.mjs --v4 <pdf> --check      # verify the committed JSON is current
//
// Source PDFs (not committed; ETSI text is quoted, not reproduced):
//   https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.01_60/en_301549v040101p.pdf
//   https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf
//   (etsi.org returns 403 to curl's default user agent; pass a browser UA.)
//
// Requires poppler's `pdftotext` on PATH (tested with 25.09.0). The script
// runs `pdftotext -layout`, which keeps the column alignment ETSI uses for
// clause headings and Annex tables; the non-layout mode splits headings over
// two lines and is useless for the tables.
//
// METHOD
//
// 1. Clause structure. Every heading in the body of clauses 4 to 13 is a
//    line of the form `<number><2+ spaces><Title>` starting in column 0. A
//    title wrapped onto a second line is indented by 8+ spaces (body text
//    starts in column 0 and NOTEs in column 3), so such a line is joined to
//    the heading above. Rows of the dataset are the LEAF clauses, i.e.
//    headings with no sub-clause, exactly as the V3.2.1 dataset was built.
//    With --v3 the same extractor is run on the V3.2.1 PDF and its leaf set
//    must equal the 325 clauses of the committed v3 JSON, which proves the
//    method reproduces the earlier hand-verified dataset.
//
// 2. Classification, reconciled against the normative Annex C. Each leaf
//    must have a C.<clause> entry in Annex C (asserted). The entry decides
//    the kind: "is informative only / contains no testable requirements"
//    marks informative clauses, which are dropped (as in v3); "Void" marks
//    numbering placeholders, kept as void rows so the WCAG-aligned numbering
//    stays explainable; "recommendation" (and a normative sentence written
//    with "should" and no "shall") marks advisory rows, kept as checkable
//    requirements with advisory=true; everything else with a "Type of
//    assessment" or "Scenario" test block is a requirement. Headings titled
//    "General" or "Introduction" are informative in this edition (Annex C
//    confirms each one) and are dropped.
//
// 3. Clause 9 (web) is asserted to contain exactly the WCAG 2.2 Level A and
//    AA success criteria as WCAG-mapped rows (55 in WCAG 2.2: the 50 of
//    WCAG 2.1 plus 2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8, minus 4.1.1
//    Parsing, which WCAG 2.2 removed and which EN 301 549 V4.1.1 makes
//    "Void"), plus 9.6 (WCAG conformance requirements) and the new 9.7
//    (User preferences for web pages). Clauses 10 and 11 map the same
//    numbers; their void slots (for example 10.2.4.1 Bypass blocks) are
//    kept as void rows. Levels and page links come from lib/wcag-data.ts and
//    app/wcag/<n-n-n>/.
//
// 4. Clause 11 closed-functionality variants. V3.2.1 split many software
//    clauses into X.1 (open functionality) and X.2 (closed functionality,
//    redirecting to clause 5.1). V4.1.1 removes the split: each clause is a
//    single requirement whose precondition excludes functionality that is
//    "closed to programmatic access of information by assistive
//    technologies", and clause 5.1 (now including the new 5.1.8) carries
//    the closed-functionality requirements. The rule here: a v4 clause X
//    inherits from v3 X.1 (changeType "changed", previous = X.1, summary
//    reused when the base title is unchanged); every v3 X.2 variant is
//    listed as removed with a note pointing at clause 5.1. The precondition
//    text sets appliesTo to "Non-web software (open functionality)" when
//    the closed-functionality exclusion is present.
//
// 5. changeType is derived by diffing clause numbers and titles against the
//    v3 JSON: same number + same title => "unchanged"; same number +
//    different title => "changed"; a v4 number absent from v3 whose title
//    exactly matches a v3 clause that no longer exists => "changed" (moved);
//    the RENUMBERED map below records the moves the title match cannot see
//    (documented one by one); anything else => "new". V3 clauses that no v4
//    row inherits from are emitted under removedFromV3 with changeType
//    "removed". Clause 8.3 (stationary ICT) was rewritten with reused
//    numbers, so it is handled as a rewritten section: its v4 rows are new
//    and its v3 rows removed, except the moves listed explicitly. A short
//    list of SUBSTANTIVE exceptions marks rows whose number and title are
//    unchanged but whose normative status changed (clause 4 criteria now
//    written with "shall"). Wording-level rewrites (every v4 precondition
//    now reads "Where ICT is, or includes, ...") are deliberately NOT
//    treated as changes.
//
// 6. Summaries are original accessibility.build prose, never the normative
//    text. Unchanged rows (and moved or merged rows with the same base
//    title) reuse the v3 summary; every other row must have an authored
//    summary in scripts/en301549/v4-summaries.json, and the build fails if
//    one is missing (run with --needs to list them with their normative
//    sentence). No em dashes are allowed anywhere in the output.
//
// 7. Cross-checks. The five conformance tables of clause A.2 (the EAA
//    presumption-of-conformity tables for web pages, documents, software,
//    hardware and all ICT) are extracted and their union must equal the set
//    of non-advisory requirement rows. The published Table A.4 misnumbers
//    four stationary-ICT rows (it prints 8.3.10.1/8.3.10.2 for the free
//    space clauses 8.3.11.1/8.3.11.2 and 8.3.11.2/8.3.11.3 for the obstructed
//    side reach clauses 8.3.10.2/8.3.10.3); the TABLE_A4_ERRATA map corrects
//    them and the row titles are checked to confirm the correction.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..")
const OUT = path.join(root, "lib/data/en-301-549-v4-checklist.json")
const V3_JSON = path.join(root, "lib/data/en-301-549-checklist.json")
const SUMMARIES = path.join(root, "scripts/en301549/v4-summaries.json")
const WCAG_DATA = path.join(root, "lib/wcag-data.ts")
const WCAG_PAGES = path.join(root, "app/wcag")

const args = process.argv.slice(2)
const opt = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}
const flag = (name) => args.includes(name)

const v4Pdf = opt("--v4")
const v3Pdf = opt("--v3")
if (!v4Pdf) {
  console.error("Usage: build-v4-checklist.mjs --v4 <en_301549v040101p.pdf> [--v3 <en_301549v030201p.pdf>] [--needs] [--check]")
  process.exit(2)
}

// ---------------------------------------------------------------------------
// Rules that are not derivable from the PDF alone (each one documented).
// ---------------------------------------------------------------------------

/** v4 clause => v3 clause it continues, where the title match cannot see it. */
const RENUMBERED = {
  "5.10.1": "11.8.1", // Authoring tools moved from clause 11.8 to clause 5.10
  "5.10.2": "11.8.2",
  "5.10.3": "11.8.3",
  "5.10.4": "11.8.4",
  "5.10.5": "11.8.5",
  "5.5": "5.5.2", // Operable parts discernibility became the single clause 5.5
  "6.1.2": "6.1", // Audio bandwidth for speech, now capture and presentation
  "6.2.2.2": "6.2.2.3", // Speaker identification became Active communicator indication
  "6.2.2.3": "6.2.2.4", // Visual indicator of audio with RTT, renumbered
  "6.2.10": "6.2.3", // Interoperability became RTT interoperability
  "8.3.14": "8.3.6", // Installation instructions (the rest of 8.3 was rewritten)
  "8.6": "8.1.2", // Standard connections moved out of 8.1
  "8.7": "8.1.3", // Colour became Colour on hardware
  "12.1": "12.1.2", // Accessible documentation became Accessible information about products
  "12.3": "12.1.1", // Accessibility and compatibility features
}

/** v3 clauses whose requirement was dropped or merged, with the reason. */
const REMOVED_NOTES = {
  "4.1": "Clause 4.1 is informative in V4.1.1 (Annex C.4.1 has no test); the functional performance criteria of 4.2 are now testable requirements in their own right.",
  "5.5.1": "Dropped as a generic requirement; the hardware clause 8.4.2.1 (Means of operation) still covers operable parts that need grasping, pinching or twisting.",
  "6.2.2.2": "The programmatically determinable send and receive direction requirement was dropped; V4.1.1 specifies RTT display in 6.2.2.1 to 6.2.2.5 instead.",
  "8.1.1": "Clause 8.1 is now an informative pointer to clause 5; the generic requirements still apply to hardware.",
  "11.5.1": "Clause 11.5.1 is informative in V4.1.1; software with closed functionality is covered by clause 5.1 instead of an exemption from 11.5.2.",
  "11.5.2.2": "Merged into 11.5.2.1 (platform interoperability with assistive technologies); the number is void in V4.1.1.",
  "12.2.2": "Merged into 12.2 (accessible information about services), which routes service information to clauses 9, 10 or 11.",
  "12.2.3": "Effective communication by support services is no longer a separate clause; service information is covered by 12.2 and support services by the EAA service requirements in Annex ZB.",
  "12.2.4": "Merged into 12.2 (accessible information about services).",
  "13.1.2": "The five per-service relay clauses (13.1.2 to 13.1.6) were replaced by 13.1.3.1 (relaying action) plus the invocation requirements of 13.1.2.",
  "13.1.3": "Replaced by 13.1.3.1 (relaying action), which covers every relay service type.",
  "13.1.4": "Replaced by 13.1.3.1 (relaying action), which covers every relay service type.",
  "13.1.5": "Replaced by 13.1.3.1 (relaying action), which covers every relay service type.",
  "13.1.6": "Replaced by 13.1.3.1 (relaying action), which covers every relay service type.",
  "13.3": "Access to emergency services is informative in V4.1.1; the requirements moved into the emergency scenarios 6.0.6 to 6.0.9.",
}

/** Sections rewritten with reused numbers: same-number matches are not continuity. */
const REWRITTEN_SECTIONS = ["8.3."]
const REWRITTEN_NOTE =
  "Clause 8.3 (stationary ICT) was rewritten in V4.1.1 with new reach, height and free-space rules; its numbers do not correspond to V3.2.1."

/** Same number and title, but the normative status changed. */
const SUBSTANTIVE = {
  "4.2.1": "Written with \"shall\" in V4.1.1: the functional performance criteria are now testable requirements (Annex C.4.2) rather than descriptive statements.",
  "4.2.2": "Written with \"shall\" in V4.1.1: the functional performance criteria are now testable requirements (Annex C.4.2) rather than descriptive statements.",
  "4.2.3": "Written with \"shall\" in V4.1.1: the functional performance criteria are now testable requirements (Annex C.4.2) rather than descriptive statements.",
  "4.2.4": "Written with \"shall\" in V4.1.1: the functional performance criteria are now testable requirements (Annex C.4.2) rather than descriptive statements.",
  "4.2.5": "Written with \"shall\" in V4.1.1: the functional performance criteria are now testable requirements (Annex C.4.2) rather than descriptive statements.",
  "4.2.6": "Written with \"shall\" in V4.1.1: the functional performance criteria are now testable requirements (Annex C.4.2) rather than descriptive statements.",
  "4.2.7": "Written with \"shall\" in V4.1.1: the functional performance criteria are now testable requirements (Annex C.4.2) rather than descriptive statements.",
  "4.2.8": "Written with \"shall\" in V4.1.1 and now scoped to stationary, free-standing or installed ICT.",
  "4.2.9": "Written with \"shall\" in V4.1.1; the seizure-safe mode must now be the default mode, or audiovisual material must carry an advance warning.",
  "4.2.10": "Written with \"shall\" in V4.1.1 and now scoped to ICT that provides information or requires user interaction.",
  "4.2.11": "Written with \"shall\" in V4.1.1: privacy must be maintained whenever accessibility features are used.",
  "5.1.3.3": "Advisory in V3.2.1 (\"should\"); a testable requirement in V4.1.1.",
  "7.1.5": "Reworded: the player must be able to output spoken subtitles that are available, not generate them.",
  "9.6": "Now references the five WCAG 2.2 conformance requirements at Level AA.",
  "11.7": "Rewritten: software must follow the user's platform accessibility preferences (colour filters, contrast, text size, pointer size, text cursor) unless essential; the V3.2.1 list of units, colour, contrast, font and focus cursor is gone.",
}

/** Table A.4 of the published PDF misnumbers four rows; corrected by title. */
const TABLE_A4_ERRATA = {
  "8.3.10.1": "8.3.11.1",
  "8.3.10.2": "8.3.11.2",
  "8.3.11.2": "8.3.10.2",
  "8.3.11.3": "8.3.10.3",
}

/** Short applicability labels by clause prefix (first match wins; exact keys first). */
const APPLIES_TO = [
  ["4.", "All ICT"],
  ["5.1.", "Closed functionality"],
  ["5.10.", "Authoring tools"],
  ["5.", "Generic ICT capabilities"],
  ["6.0.", "Communication clients and systems (operational scenarios)"],
  ["6.1.", "Real-time voice communication"],
  ["6.2.", "Real-time text (RTT)"],
  ["6.3", "Real-time voice communication"],
  ["6.4", "Voice mail, auto-attendant and IVR"],
  ["6.5.", "Voice + real-time video"],
  ["6.6", "Voice + real-time video"],
  ["6.7.", "Total conversation (voice, video and RTT)"],
  ["7.", "ICT with video capabilities"],
  ["8.2.", "Hardware with speech output"],
  ["8.3.", "Stationary ICT"],
  ["8.4.", "Operable parts"],
  ["8.5", "Hardware for public use with speech output"],
  ["8.", "Hardware"],
  ["9.", "Web pages"],
  ["10.", "Non-web documents"],
  ["11.5.2.1", "Platform software"],
  ["11.6.1", "Platform software"],
  ["11.5.2.4", "Assistive technology"],
  ["11.5.2.", "Software & platforms (AT interoperability)"],
  ["11.", "Non-web software"],
  ["12.1", "Product information"],
  ["12.2", "Service information"],
  ["12.3", "Product documentation"],
  ["12.4", "Electronic programme guides"],
  ["12.5", "Electronic programme guides"],
  ["13.", "Relay & emergency services"],
]

// ---------------------------------------------------------------------------
// PDF text extraction and parsing
// ---------------------------------------------------------------------------

function extractText(pdf) {
  if (!fs.existsSync(pdf)) throw new Error(`PDF not found: ${pdf}`)
  return execFileSync("pdftotext", ["-layout", pdf, "-"], { maxBuffer: 64 * 1024 * 1024 }).toString("utf8")
}

const HEAD = /^(\d{1,2}(?:\.\d{1,2})+|\d{1,2})\s{2,}([A-Z(][^\t]*?)\s*$/
// V3.2.1 splits some tests into lettered items (C.6.2.3.a, C.6.2.3.b ...).
const HEAD_C = /^C\.(\d{1,2}(?:\.\d{1,2})*(?:\.[a-z])?)\s{2,}([A-Z(][^\t]*?)\s*$/
const CONTINUATION_STOP = /^\s*(NOTE|EXAMPLE|Table|Figure)\b/
const PAGE_CHROME = /ETSI CEN CENELEC|EN 301 549 V\d\.\d\.\d \(\d{4}-\d{2}\)\s*$/

function findLine(lines, re, from = 0) {
  for (let i = from; i < lines.length; i++) if (re.test(lines[i])) return i
  throw new Error(`Marker not found: ${re}`)
}

function isContinuation(line) {
  if (!line || !line.trim()) return false
  const indent = line.length - line.trimStart().length
  return indent >= 8 && !CONTINUATION_STOP.test(line)
}

function parseStandard(text) {
  const lines = text.split("\n")
  const version = (text.match(/EN 301 549 V(\d\.\d\.\d) \((\d{4}-\d{2})\)/) || [])[0]
  const tocEnd = findLine(lines, /^Intellectual Property Rights\s*$/, 100)
  const body4 = findLine(lines, /^4\s{2,}Functional [Pp]erformance\s*$/, tocEnd)
  const body14 = findLine(lines, /^14\s{2,}Conformance\s*$/, body4)
  const annexC = findLine(lines, /^Annex C \(normative\):/, body14)
  const annexD = findLine(lines, /^Annex D \(informative\):/, annexC)

  // Body headings of clauses 4 to 13
  const headings = []
  for (let i = body4; i < body14; i++) {
    const m = HEAD.exec(lines[i])
    if (!m) continue
    let title = m[2]
    if (title.includes("✓") || /\s{3,}/.test(title)) continue // table row, not a heading
    let next = i + 1
    if (isContinuation(lines[next])) {
      title = `${title} ${lines[next].trim()}`
      next++
    }
    headings.push({ line: i, bodyStart: next, num: m[1], title: title.replace(/\s+/g, " ").trim() })
  }
  const nums = new Set(headings.map((h) => h.num))
  const hasChild = (n) => [...nums].some((m) => m !== n && m.startsWith(`${n}.`))
  const leaves = headings.filter((h) => !hasChild(h.num))
  const idx = new Map(headings.map((h, k) => [h.num, k]))

  /** Normative text of a leaf: its body up to the first NOTE/EXAMPLE or next heading. */
  const clauseText = (leaf) => {
    const k = idx.get(leaf.num)
    const end = k + 1 < headings.length ? headings[k + 1].line : body14
    const out = []
    for (let i = leaf.bodyStart; i < end; i++) {
      const s = lines[i].trim()
      if (!s) continue
      if (/^(NOTE|EXAMPLE)\b/.test(s)) break
      if (PAGE_CHROME.test(s) || /^\d+\s*$/.test(s)) continue
      out.push(s)
    }
    return out.join(" ").replace(/\s+/g, " ").trim()
  }

  /** Whole body of a leaf including notes and tables (for cross-checks only). */
  const clauseFullText = (leaf) => {
    const k = idx.get(leaf.num)
    const end = k + 1 < headings.length ? headings[k + 1].line : body14
    return lines
      .slice(leaf.bodyStart, end)
      .map((l) => l.trim())
      .filter((s) => s && !PAGE_CHROME.test(s))
      .join(" ")
      .replace(/\s+/g, " ")
  }

  // Annex C entries
  const annex = new Map()
  let cur = null
  for (let i = annexC; i < annexD; i++) {
    const m = HEAD_C.exec(lines[i])
    if (m) {
      let title = m[2]
      let next = i + 1
      if (isContinuation(lines[next]) && !/Type of assessment|Scenario/.test(lines[next])) {
        title = `${title} ${lines[next].trim()}`
        next++
      }
      cur = { num: m[1], title: title.replace(/\s+/g, " ").trim(), text: [] }
      annex.set(m[1], cur)
      i = next - 1
      continue
    }
    if (cur && cur.text.length < 6 && lines[i].trim() && !PAGE_CHROME.test(lines[i])) cur.text.push(lines[i].trim())
  }

  const classifyAnnex = (num) => {
    const e = annex.get(num)
    if (!e) {
      // Lettered sub-tests (C.6.2.3.a ...) with no parent entry: a tested requirement.
      for (const key of annex.keys()) if (new RegExp(`^${num.replace(/\./g, "\\.")}\\.[a-z]$`).test(key)) return "test"
      return "missing"
    }
    const t = e.text.join(" ")
    if (/^Void\b|\(Void\)\s*$/i.test(e.title)) return "void"
    if (/informative|no (testable )?requirements requiring test|contains no testable requirements/i.test(t) && !/Type of assessment|Scenario/.test(t)) {
      if (/recommendation|advisory only/i.test(t)) return "recommendation"
      return "informative"
    }
    if (/recommendation/i.test(t) && !/Type of assessment|Scenario/.test(t)) return "recommendation"
    if (/Type of assessment|Scenario/.test(t)) return "test"
    return "other"
  }

  // Chapter titles
  const chapters = {}
  for (const h of headings) if (/^\d{1,2}$/.test(h.num)) chapters[h.num] = h.title

  return { lines, version, headings, leaves, clauseText, clauseFullText, annex, classifyAnnex, chapters, body14 }
}

/** Rows (leaf clauses minus informative ones), classified. */
function buildRows(std) {
  const rows = []
  for (const leaf of std.leaves) {
    const title = leaf.title
    const cls = std.classifyAnnex(leaf.num)
    const text = std.clauseText(leaf)
    // V3.2.1 has no per-clause Annex C entries for clause 4 ("Clause 4 is
    // informative"); its functional performance statements are kept as
    // non-checkable "statement" rows. V4.1.1 gives each criterion a test.
    if (cls === "missing" && leaf.num.startsWith("4.")) {
      rows.push({ clause: leaf.num, title, chapter: "4", kind: "statement", advisory: false, text })
      continue
    }
    if (/\(informative\)/i.test(title) || /^(General|Introduction)$/i.test(title)) continue
    if (cls === "missing") throw new Error(`No Annex C entry for clause ${leaf.num} (${title})`)
    let kind = "requirement"
    let advisory = false
    if (/^Void$/i.test(title) || /\(Void\)\s*$/i.test(title) || cls === "void") {
      kind = "void"
    } else if (/^Not applicable\.?$/i.test(text)) {
      // V3.2.1 closed-functionality slots for Parsing, Name/role/value and Status messages.
      kind = "na"
    } else if (/\(recommendation\)/i.test(title) || cls === "recommendation" || (/\bshould\b/.test(text) && !/\bshall\b/.test(text))) {
      // "should" clauses: V4.1.1 labels them "(recommendation)"; V3.2.1's Annex C
      // calls them informative or advisory. Kept as checkable advisory rows.
      advisory = true
    } else if (cls === "informative") {
      continue
    }
    rows.push({ clause: leaf.num, title, chapter: leaf.num.split(".")[0], kind, advisory, text, fullText: std.clauseFullText(leaf) })
  }
  return rows
}

// ---------------------------------------------------------------------------
// Reference data from the repo
// ---------------------------------------------------------------------------

function loadWcagLevels() {
  const src = fs.readFileSync(WCAG_DATA, "utf8")
  const levels = new Map()
  const re = /number:\s*"(\d\.\d\.\d{1,2})"[\s\S]*?level:\s*"(A{1,3})"/g
  let m
  while ((m = re.exec(src))) levels.set(m[1], m[2])
  if (levels.size < 80) throw new Error("Could not read WCAG criteria from lib/wcag-data.ts")
  return levels
}

const normTitle = (t) =>
  t
    .toLowerCase()
    .replace(/\s*\((recommendation|informative)\)\s*$/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

const BASE_TITLE = (t) => normTitle(t).replace(/\s*(open|closed) functionality\s*$/, "").replace(/\s*(pre recorded|live)\s*$/, (s) => s).trim()

function stripVariant(t) {
  // "Non-text content (open functionality)" -> "Non-text content"
  // "Audio-only and video-only (pre-recorded - open functionality)" -> "Audio-only and video-only (pre-recorded)"
  return t.replace(/\s*\(open functionality\)/i, "").replace(/\s*-\s*open functionality\)/i, ")").trim()
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const v3 = JSON.parse(fs.readFileSync(V3_JSON, "utf8"))
const v3Rows = new Map(v3.rows.map((r) => [r.clause, r]))
const summaries = fs.existsSync(SUMMARIES) ? JSON.parse(fs.readFileSync(SUMMARIES, "utf8")) : {}
const wcagLevels = loadWcagLevels()

const v4Text = extractText(v4Pdf)
if (!/EN 301 549 V4\.1\.1 \(2026-09\)/.test(v4Text)) throw new Error("This is not the EN 301 549 V4.1.1 (2026-09) PDF")
const std = parseStandard(v4Text)
const raw = buildRows(std)

// Optional: prove the extractor reproduces the committed v3 dataset.
if (v3Pdf) {
  const t3 = extractText(v3Pdf)
  if (!/EN 301 549 V3\.2\.1 \(2021-03\)/.test(t3)) throw new Error("--v3 is not the EN 301 549 V3.2.1 (2021-03) PDF")
  const s3 = parseStandard(t3)
  const r3 = buildRows(s3).map((r) => r.clause)
  const want = [...v3Rows.keys()]
  const missing = want.filter((c) => !r3.includes(c))
  const extra = r3.filter((c) => !v3Rows.has(c))
  if (missing.length || extra.length) {
    throw new Error(`v3 reproduction failed. Missing: ${missing.join(", ")}. Extra: ${extra.join(", ")}`)
  }
  console.error(`v3 check: extractor reproduces all ${want.length} clauses of the committed V3.2.1 dataset`)
}

// Clause A.2 tables (EAA conformance tables)
function parseA2Tables(std) {
  const { lines } = std
  const starts = {}
  const keys = ["A.2.1", "A.2.2", "A.2.3", "A.2.4", "A.2.5"]
  const annexA = findLine(lines, /^Annex A \(informative\):/, std.body14)
  for (const k of keys) starts[k] = findLine(lines, new RegExp(`^${k.replace(/\./g, "\\.")}\\s{2,}`), annexA)
  const end = findLine(lines, /^Annex B \(informative\):/, starts["A.2.5"])
  const rowRe = /^\s*(\d{1,2}(?:\.\d{1,2})+)\s{2,}(.*?)\s+C\.(\d{1,2}(?:\.\d{1,2})*)\s*$/
  const tables = {}
  keys.forEach((k, j) => {
    const a = starts[k]
    const b = j + 1 < keys.length ? starts[keys[j + 1]] : end
    const list = []
    for (let i = a; i < b; i++) {
      const m = rowRe.exec(lines[i])
      if (!m) continue
      let clause = m[1]
      if (k === "A.2.4" && TABLE_A4_ERRATA[clause]) {
        const fixed = TABLE_A4_ERRATA[clause]
        const row = raw.find((r) => r.clause === fixed)
        const firstWords = m[2].trim().split(/\s+/).slice(0, 3).join(" ").toLowerCase()
        if (!row || !row.title.toLowerCase().startsWith(firstWords)) {
          throw new Error(`Table A.4 erratum correction ${clause} -> ${fixed} does not match row title "${m[2]}"`)
        }
        clause = fixed
      }
      list.push(clause)
    }
    tables[k] = list
  })
  return tables
}
const a2 = parseA2Tables(std)

// ---------------------------------------------------------------------------
// Diff against v3 and assemble rows
// ---------------------------------------------------------------------------

const v4Nums = new Set(raw.map((r) => r.clause))
const v3ByTitle = new Map()
for (const r of v3.rows) {
  const k = normTitle(r.title)
  v3ByTitle.set(k, [...(v3ByTitle.get(k) || []), r.clause])
}
const claimed = new Set() // v3 clauses inherited by some v4 row

function previousFor(row) {
  const n = row.clause
  if (RENUMBERED[n]) return { clause: RENUMBERED[n], via: "renumbered" }
  const rewritten = REWRITTEN_SECTIONS.some((p) => n.startsWith(p))
  if (!rewritten && v3Rows.has(n)) return { clause: n, via: "same-number" }
  // Clause 11 open/closed merge: v4 X inherits v3 X.1
  if (row.chapter === "11" && v3Rows.has(`${n}.1`) && /open functionality/i.test(v3Rows.get(`${n}.1`).title)) {
    return { clause: `${n}.1`, via: "open-variant" }
  }
  if (!rewritten) {
    const cands = (v3ByTitle.get(normTitle(row.title)) || []).filter((c) => !v4Nums.has(c))
    if (cands.length === 1) return { clause: cands[0], via: "title-match" }
  }
  return null
}

/** Void slots explain themselves from the WCAG number they hold. */
function voidSummary(r) {
  const parts = r.clause.split(".")
  const sc = parts.length === 4 && ["1", "2", "3", "4"].includes(parts[1]) ? parts.slice(1).join(".") : null
  if (sc === "4.1.1") return "Void. WCAG 2.2 removed Success Criterion 4.1.1 Parsing, so EN 301 549 V4.1.1 leaves this slot empty to keep the numbering aligned."
  if (sc && wcagLevels.get(sc) === "AAA") return `Void. This slot keeps the numbering aligned with WCAG 2.2; criterion ${sc} is Level AAA and is not required by EN 301 549.`
  if (sc && wcagLevels.has(sc)) return `Void. EN 301 549 V4.1.1 does not apply WCAG 2.2 Success Criterion ${sc} in this context, and keeps the slot so the numbering stays aligned with clause 9.`
  if (r.clause === "11.5.2.2") return "Void. The V3.2.1 requirement for platform support of assistive technology was merged into 11.5.2.1."
  if (r.clause === "13.2") return "Void. Access to relay services is now covered throughout clause 13.1."
  return "Void slot kept so the clause numbering stays aligned; there is nothing to test here."
}

const rows = []
const needs = []
for (const r of raw) {
  const prev = previousFor(r)
  const v3row = prev ? v3Rows.get(prev.clause) : null
  if (prev && !v3row) throw new Error(`Rule points ${r.clause} at missing v3 clause ${prev.clause}`)
  if (v3row) claimed.add(prev.clause)

  let changeType = "new"
  let changeNote = null
  if (v3row) {
    const sameTitle = normTitle(v3row.title) === normTitle(r.title)
    const sameBase = normTitle(stripVariant(v3row.title)) === normTitle(r.title)
    if (prev.via === "same-number" && sameTitle) changeType = SUBSTANTIVE[r.clause] ? "changed" : "unchanged"
    else changeType = "changed"
    if (SUBSTANTIVE[r.clause]) changeNote = SUBSTANTIVE[r.clause]
    else if (prev.via === "open-variant") changeNote = `V3.2.1 split this into ${prev.clause} (open functionality) and ${r.clause.replace(/^(11(?:\.\d+)+)$/, "$1")}.2 (closed functionality). V4.1.1 keeps one clause whose precondition excludes closed functionality; clause 5.1 covers the closed case.`
    else if (prev.via === "renumbered") changeNote = `Was ${prev.clause} (${v3row.title}) in V3.2.1.`
    else if (prev.via === "title-match") changeNote = `Was ${prev.clause} in V3.2.1.`
    else if (!sameTitle) changeNote = `Titled "${v3row.title}" in V3.2.1.`
    r.sameBase = sameTitle || sameBase
  } else if (REWRITTEN_SECTIONS.some((p) => r.clause.startsWith(p))) {
    changeNote = REWRITTEN_NOTE
  }
  if (v3row && r.kind === "requirement" && v3row.kind === "requirement" && v3row.advisory !== r.advisory) {
    changeType = "changed"
    changeNote = r.advisory
      ? "A requirement (\"shall\") in V3.2.1; a recommendation (\"should\") in V4.1.1."
      : "Advisory (\"should\") in V3.2.1; a testable requirement (\"shall\") in V4.1.1."
    r.statusChanged = true
  }
  if (r.kind === "void" && v3row && v3row.kind !== "void") changeNote = `Was a requirement in V3.2.1 (${v3row.title}); void in V4.1.1.`
  if (r.kind === "requirement" && v3row && v3row.kind === "void") changeNote = "Void in V3.2.1; V4.1.1 applies this criterion here."
  if (r.clause === "9.4.1.1" || r.clause === "10.4.1.1" || r.clause === "11.4.1.1") changeNote = "WCAG 2.2 removed Success Criterion 4.1.1 Parsing, so V4.1.1 makes this slot void."
  if (r.clause === "11.5.2.2") changeNote = REMOVED_NOTES["11.5.2.2"]
  if (r.clause === "13.2") changeNote = "Void in V4.1.1: access to relay services is now covered throughout clause 13.1."

  // WCAG mapping for clauses 9, 10, 11
  let wcag = null
  let wcagLevel = null
  let wcagPage = null
  if (["9", "10", "11"].includes(r.chapter) && r.kind !== "void") {
    const parts = r.clause.split(".")
    // Only the four WCAG principles (x.1 to x.4) map to success criteria;
    // 11.5.2.n (accessibility services) is EN-only.
    if (parts.length === 4 && ["1", "2", "3", "4"].includes(parts[1])) {
      const sc = parts.slice(1).join(".")
      // Clauses 10 and 11 adapt 38 criteria in tables; the table's note names
      // the WCAG 2.2 criterion it is "identical to", so check the whole body.
      // 10.2.4.2 and 11.2.4.2 ("titled") restate 2.4.2 without citing it.
      const scRe = sc.replace(/\./g, "\\.")
      const mentioned =
        new RegExp(`Success Criteri(on|a)\\s+${scRe}\\b`, "i").test(r.fullText) ||
        new RegExp(`WCAG 2\\.2[\\s\\w,:()]{0,60}\\b${scRe}\\b`).test(r.fullText) ||
        ["10.2.4.2", "11.2.4.2"].includes(r.clause)
      if (!mentioned) throw new Error(`Clause ${r.clause} does not reference WCAG 2.2 Success Criterion ${sc}: ${r.text.slice(0, 120)}`)
      if (!/WCAG 2\.2/.test(r.fullText) && !["10.2.4.2", "11.2.4.2"].includes(r.clause)) throw new Error(`Clause ${r.clause} does not reference WCAG 2.2`)
      wcag = sc
      wcagLevel = wcagLevels.get(sc) || null
      if (!wcagLevel) throw new Error(`Unknown WCAG criterion ${sc} for clause ${r.clause}`)
      if (wcagLevel === "AAA") throw new Error(`Clause ${r.clause} maps to a AAA criterion`)
      const dir = path.join(WCAG_PAGES, sc.replace(/\./g, "-"))
      wcagPage = fs.existsSync(dir) ? `/wcag/${sc.replace(/\./g, "-")}` : null
    }
  }

  // appliesTo
  let appliesTo = null
  for (const [prefix, label] of APPLIES_TO) {
    const exact = !prefix.endsWith(".")
    if ((exact && r.clause === prefix) || (!exact && r.clause.startsWith(prefix))) {
      appliesTo = label
      break
    }
  }
  if (!appliesTo) throw new Error(`No appliesTo rule for ${r.clause}`)
  if (r.chapter === "11" && appliesTo === "Non-web software" && /not closed to programmatic access/i.test(r.text)) {
    appliesTo = "Non-web software (open functionality)"
  }

  // Summary
  let summary = summaries[r.clause] || null
  const mustAuthor = Boolean(SUBSTANTIVE[r.clause]) || r.statusChanged
  if (!summary && !mustAuthor && v3row && r.kind !== "void" && (changeType === "unchanged" || r.sameBase)) summary = v3row.summary
  if (r.kind === "void") summary = voidSummary(r)
  if (!summary) needs.push({ ...r, changeType, previous: prev ? prev.clause : null })

  rows.push({
    clause: r.clause,
    title: r.title,
    chapter: r.chapter,
    kind: r.kind,
    appliesTo,
    wcag,
    wcagLevel,
    wcagPage,
    advisory: r.advisory,
    summary: summary || "",
    changeType,
    previous: v3row ? { clause: v3row.clause, title: v3row.title } : null,
    changeNote,
  })
}

// Removed v3 clauses
const removedFromV3 = []
for (const r of v3.rows) {
  if (claimed.has(r.clause)) continue
  let note = REMOVED_NOTES[r.clause] || null
  if (!note && r.chapter === "11" && /closed functionality/i.test(r.title)) {
    note = "Closed-functionality variant. V4.1.1 covers closed functionality in clause 5.1 (including the new 5.1.8 Identify input purpose) instead of per-clause software variants."
  }
  if (!note && REWRITTEN_SECTIONS.some((p) => r.clause.startsWith(p))) note = REWRITTEN_NOTE
  if (!note && r.chapter === "11" && /open functionality/i.test(r.title)) {
    throw new Error(`Open-functionality clause ${r.clause} was not inherited by a v4 row`)
  }
  if (!note) throw new Error(`v3 clause ${r.clause} (${r.title}) is neither inherited nor explained as removed`)
  removedFromV3.push({ clause: r.clause, title: r.title, chapter: r.chapter, kind: r.kind, changeType: "removed", note })
}

// ---------------------------------------------------------------------------
// Assertions
// ---------------------------------------------------------------------------

const ch9 = rows.filter((r) => r.chapter === "9")
const ch9Wcag = ch9.filter((r) => r.wcag).map((r) => r.wcag).sort()
const expected = [...wcagLevels.entries()].filter(([, l]) => l !== "AAA").map(([n]) => n).sort()
if (JSON.stringify(ch9Wcag) !== JSON.stringify(expected)) {
  throw new Error(`Clause 9 WCAG rows differ from WCAG 2.2 A/AA. Got ${ch9Wcag.length}: ${ch9Wcag.join(" ")}`)
}
const ch9Other = ch9.filter((r) => !r.wcag && r.kind !== "void").map((r) => r.clause)
if (JSON.stringify(ch9Other) !== JSON.stringify(["9.6", "9.7"])) throw new Error(`Clause 9 non-WCAG rows: ${ch9Other.join(", ")}`)
if (ch9.filter((r) => r.kind === "void").length !== 14) throw new Error("Clause 9 should have 14 void slots")

for (const r of rows) {
  const okAnnex = r.advisory ? ["recommendation", "informative"] : ["test", "other"]
  if (r.kind === "requirement" && !okAnnex.includes(std.classifyAnnex(r.clause))) {
    throw new Error(`Requirement ${r.clause} has an unexpected Annex C entry (${std.classifyAnnex(r.clause)})`)
  }
  if (r.kind === "void" && std.classifyAnnex(r.clause) !== "void") throw new Error(`Void ${r.clause} is not void in Annex C`)
}

const a2Union = new Set(Object.values(a2).flat())
const normative = rows.filter((r) => r.kind === "requirement" && !r.advisory).map((r) => r.clause)
const notInA2 = normative.filter((c) => !a2Union.has(c))
const notInRows = [...a2Union].filter((c) => !normative.includes(c))
if (notInA2.length || notInRows.length) {
  throw new Error(`Clause A.2 tables do not match requirement rows. Rows missing from A.2: ${notInA2.join(", ")}. A.2 entries without a row: ${notInRows.join(", ")}`)
}

for (const r of rows) {
  if (!r.summary) continue
  if (/[\u2014\u2013]/.test(`${r.summary} ${r.title} ${r.changeNote || ""}`)) throw new Error(`Em or en dash in ${r.clause}`)
  // Reused v3 prose must not point at V3.2.1 numbering or WCAG 2.1.
  if (/\b11\.8\b|\bv3\.2\.1\b|WCAG 2\.1|two-way/.test(r.summary)) throw new Error(`Stale V3.2.1 reference in summary of ${r.clause}: ${r.summary}`)
}
if (needs.length) {
  console.error(`${needs.length} rows still need an authored summary in scripts/en301549/v4-summaries.json:`)
  if (flag("--needs")) {
    for (const n of needs) console.log(`### ${n.clause} | ${n.title} | ${n.changeType}${n.previous ? ` (was ${n.previous})` : ""}\n${n.text.slice(0, 900)}\n`)
  } else {
    console.error(needs.map((n) => n.clause).join(" "))
  }
  process.exit(1)
}
const unusedSummaries = Object.keys(summaries).filter((c) => !v4Nums.has(c))
if (unusedSummaries.length) throw new Error(`Summaries for clauses that do not exist in V4.1.1: ${unusedSummaries.join(", ")}`)

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

const counts = {
  rows: rows.length,
  requirements: rows.filter((r) => r.kind === "requirement").length,
  advisory: rows.filter((r) => r.advisory).length,
  void: rows.filter((r) => r.kind === "void").length,
  new: rows.filter((r) => r.changeType === "new").length,
  changed: rows.filter((r) => r.changeType === "changed").length,
  unchanged: rows.filter((r) => r.changeType === "unchanged").length,
  removedFromV3: removedFromV3.length,
}

const output = {
  standard: "EN 301 549",
  version: "V4.1.1 (2026-09)",
  sourceNote:
    "Clause numbers and titles follow EN 301 549 V4.1.1 (2026-09), published by ETSI, CEN and CENELEC on 2 September 2026 under the European Commission's standardisation request M/587 for the European Accessibility Act. Rows were extracted from the official PDF by scripts/en301549/build-v4-checklist.mjs, reconciled against Annex C and the clause A.2 conformance tables, and diffed against the V3.2.1 dataset. Plain-language summaries are original accessibility.build prose, verified against the published standard on 19 October 2026. WCAG-mapped clause summaries reuse this site's criterion descriptions.",
  verified: "2026-10-19",
  legalStatus: {
    published: "2026-09-02",
    adopted: "2026-08-24",
    citedInOfficialJournal: false,
    citedUnder: [],
    note:
      "V4.1.1 is published but not yet cited in the Official Journal of the EU. Until it is cited under Directive (EU) 2019/882, no edition of EN 301 549 gives a presumption of conformity with the European Accessibility Act; V3.2.1 remains the edition cited for the Web Accessibility Directive (Decision (EU) 2018/2048 as amended by 2021/1339). ETSI's national transposition dates: announcement by 30 November 2026, national publication by 31 May 2027, withdrawal of conflicting national standards by 31 May 2028.",
  },
  chapters: std.chapters,
  eaaTables: {
    "A.1": { label: "Where the ICT is, or includes, a web page", clauses: a2["A.2.1"] },
    "A.2": { label: "Where the ICT is, or includes, a non-web document", clauses: a2["A.2.2"] },
    "A.3": { label: "Where the ICT is, or includes, non-web software that provides a user interface", clauses: a2["A.2.3"] },
    "A.4": { label: "Where the ICT is, or includes, hardware", clauses: a2["A.2.4"] },
    "A.5": { label: "All ICT", clauses: a2["A.2.5"] },
  },
  counts,
  rows,
  removedFromV3,
}

const json = `${JSON.stringify(output, null, 1)}\n`
if (flag("--check")) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : ""
  if (current !== json) {
    console.error("lib/data/en-301-549-v4-checklist.json is out of date; re-run without --check")
    process.exit(1)
  }
  console.error("lib/data/en-301-549-v4-checklist.json is current")
} else {
  fs.writeFileSync(OUT, json)
  console.error(`Wrote ${path.relative(root, OUT)}: ${JSON.stringify(counts)}`)
}
