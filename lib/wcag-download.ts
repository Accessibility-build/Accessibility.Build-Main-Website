// WCAG 2.2 success criteria as a flat, downloadable dataset.
//
// Source of truth for the W3C columns is the committed snapshot of W3C's
// machine-readable file (lib/data/w3c-wcag22.json, provenance in
// lib/data/w3c-wcag22.meta.ts). The only non-W3C text is the
// accessibility_build_summary column, which comes from the `description`
// field of lib/wcag-data.ts and is our own paraphrase, never WCAG text.
//
// W3C's terms for this data: attribute and link the source, and do not change
// the content. So every W3C string here is copied verbatim; the only
// transformations are stripping HTML tags, decoding entities, collapsing
// whitespace and joining the structured parts of a criterion into one string.
//
// The W3C 2.2 file still contains 4.1.1 Parsing (versions 2.0 and 2.1, level
// ""). It is removed here by keeping only criteria whose versions include
// "2.2". buildWcagDownload() cross-checks every row against wcagCriteria and
// throws on any disagreement, so a bad snapshot fails the build.
//
// Relative imports (not "@/") so scripts/check-wcag-download.mjs can load this
// module through jiti without a path-alias resolver.

import w3cData from "./data/w3c-wcag22.json"
import { W3C_WCAG22_META } from "./data/w3c-wcag22.meta"
import { wcagCriteria, getWCAGStats } from "./wcag-data"
import { wcagPath } from "./wcag-pages"

// ---------------------------------------------------------------------------
// W3C JSON shape (only the fields we read)
// ---------------------------------------------------------------------------

interface W3CDetailItem {
  handle?: string
  text: string
}

type W3CDetail =
  | { type: "ulist"; items: W3CDetailItem[] }
  | { type: "note"; handle?: string; text: string }
  | { type: "p"; handle?: string; text: string }

interface W3CSuccessCriterion {
  id: string
  num: string
  handle: string
  title: string
  versions: string[]
  level: string
  details?: W3CDetail[]
}

interface W3CGuideline {
  id: string
  num: string
  handle: string
  successcriteria: W3CSuccessCriterion[]
}

interface W3CPrinciple {
  id: string
  num: string
  handle: string
  guidelines: W3CGuideline[]
}

interface W3CFile {
  principles: W3CPrinciple[]
}

// ---------------------------------------------------------------------------
// Output shape
// ---------------------------------------------------------------------------

export type WcagLevel = "A" | "AA" | "AAA"
export type WcagVersion = "2.0" | "2.1" | "2.2"

export interface WcagDownloadRow {
  ref: string
  title: string
  level: WcagLevel
  principle: string
  guideline: string
  w3c_id: string
  introduced_in: WcagVersion
  new_in_2_2: boolean
  w3c_text: string
  w3c_spec_url: string
  understanding_url: string
  how_to_meet_url: string
  accessibility_build_url: string
  accessibility_build_summary: string
}

export type WcagColumnKey = keyof WcagDownloadRow

export interface WcagColumn {
  key: WcagColumnKey
  /** Where the value comes from: copied from W3C, built from W3C ids, or ours. */
  source: "W3C" | "Built from W3C id" | "Accessibility.build"
  description: string
  example: string
}

// One list drives the CSV header, the JSON column dictionary, the Excel About
// sheet and the column table on the page, so they cannot drift apart.
export const WCAG_COLUMNS: WcagColumn[] = [
  {
    key: "ref",
    source: "W3C",
    description: "Success criterion number. Stored as text, so 1.4.10 never turns into a number or a date.",
    example: "1.4.3",
  },
  {
    key: "title",
    source: "W3C",
    description: "Short name of the success criterion (the W3C handle), verbatim.",
    example: "Contrast (Minimum)",
  },
  {
    key: "level",
    source: "W3C",
    description: "Conformance level: A, AA or AAA.",
    example: "AA",
  },
  {
    key: "principle",
    source: "W3C",
    description: "Principle number and name.",
    example: "1 Perceivable",
  },
  {
    key: "guideline",
    source: "W3C",
    description: "Guideline number and name.",
    example: "1.4 Distinguishable",
  },
  {
    key: "w3c_id",
    source: "W3C",
    description: "W3C's identifier for the criterion, used in its URLs and in wcag.json.",
    example: "contrast-minimum",
  },
  {
    key: "introduced_in",
    source: "W3C",
    description: "The WCAG version that first included the criterion: 2.0, 2.1 or 2.2.",
    example: "2.0",
  },
  {
    key: "new_in_2_2",
    source: "W3C",
    description: "true when the criterion was introduced in WCAG 2.2, derived from introduced_in.",
    example: "false",
  },
  {
    key: "w3c_text",
    source: "W3C",
    description:
      "Full normative text of the criterion, verbatim: the lead sentence, then each listed condition or exception on its own line starting with \"- \", then any notes. HTML tags are removed; the words are unchanged.",
    example: "The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for the following: ...",
  },
  {
    key: "w3c_spec_url",
    source: "Built from W3C id",
    description: "Link to the criterion in the WCAG 2.2 Recommendation.",
    example: "https://www.w3.org/TR/WCAG22/#contrast-minimum",
  },
  {
    key: "understanding_url",
    source: "Built from W3C id",
    description: "W3C's Understanding document for the criterion (intent, examples, techniques).",
    example: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
  },
  {
    key: "how_to_meet_url",
    source: "Built from W3C id",
    description: "The criterion in W3C's How to Meet WCAG 2.2 quick reference.",
    example: "https://www.w3.org/WAI/WCAG22/quickref/#contrast-minimum",
  },
  {
    key: "accessibility_build_url",
    source: "Accessibility.build",
    description: "Our guide page for the criterion.",
    example: "https://accessibility.build/wcag/1-4-3",
  },
  {
    key: "accessibility_build_summary",
    source: "Accessibility.build",
    description:
      "A one-sentence plain-language summary written by Accessibility.build. It is not WCAG text, is not endorsed by W3C, and must not be quoted as the success criterion.",
    example: "Text has a contrast ratio of at least 4.5:1 (3:1 for large text).",
  },
]

// ---------------------------------------------------------------------------
// Attribution and file names
// ---------------------------------------------------------------------------

const SITE = "https://accessibility.build"
export const WCAG_DATA_PAGE_PATH = "/resources/wcag-data"

export const WCAG_DOWNLOAD_FILES = {
  csv: {
    path: `${WCAG_DATA_PAGE_PATH}/wcag-2.2.csv`,
    filename: "wcag-2.2.csv",
    contentType: "text/csv; charset=utf-8",
    encodingFormat: "text/csv",
    label: "CSV",
  },
  xlsx: {
    path: `${WCAG_DATA_PAGE_PATH}/wcag-2.2.xlsx`,
    filename: "wcag-2.2.xlsx",
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    encodingFormat: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    label: "Excel",
  },
  json: {
    path: `${WCAG_DATA_PAGE_PATH}/wcag-2.2.json`,
    filename: "wcag-2.2.json",
    contentType: "application/json; charset=utf-8",
    encodingFormat: "application/json",
    label: "JSON",
  },
} as const

export type WcagDownloadFormat = keyof typeof WCAG_DOWNLOAD_FILES

export const WCAG_ATTRIBUTION = [
  `The success criterion numbers, titles, levels, principles, guidelines, identifiers, versions and text in this file are copied without change from ${W3C_WCAG22_META.specTitle}, ${W3C_WCAG22_META.specStatus}, ${W3C_WCAG22_META.specLatestUrl} (dated version ${W3C_WCAG22_META.specDatedUrl}), using W3C's machine-readable file ${W3C_WCAG22_META.sourceUrl}.`,
  `${W3C_WCAG22_META.copyrightNotice} ${W3C_WCAG22_META.licenceUrl}`,
  "The accessibility_build_url and accessibility_build_summary columns are added by Accessibility.build. They are not WCAG text and are not endorsed by W3C.",
].join(" ")

// ---------------------------------------------------------------------------
// Text handling
// ---------------------------------------------------------------------------

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
}

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body: string) => {
    if (body[0] === "#") {
      const code = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : match
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match
  })
}

/**
 * Plain text from a W3C string that may hold inline HTML (abbr, em, cite, and
 * in one note a ul/li list). List items become "- " lines; every other tag is
 * dropped and its text kept. Only ever run on the committed W3C snapshot.
 */
export function w3cPlainText(html: string): string {
  const withBreaks = html
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<\/(ul|ol)>/gi, "\n")
  const stripped = withBreaks.replace(/<[^>]*>/g, "")
  return decodeEntities(stripped)
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0)
    .join("\n")
}

/** The full SC text: lead sentence, then listed items and notes, in W3C order. */
function flattenCriterionText(sc: W3CSuccessCriterion): string {
  const parts: string[] = [w3cPlainText(sc.title)]
  for (const detail of sc.details ?? []) {
    if (detail.type === "ulist") {
      for (const item of detail.items) {
        const text = w3cPlainText(item.text)
        parts.push(item.handle ? `- ${w3cPlainText(item.handle)}: ${text}` : `- ${text}`)
      }
    } else {
      const text = w3cPlainText(detail.text)
      parts.push(detail.type === "note" && detail.handle ? `${w3cPlainText(detail.handle)}: ${text}` : text)
    }
  }
  return parts.join("\n")
}

// ---------------------------------------------------------------------------
// Build and verify
// ---------------------------------------------------------------------------

export interface WcagDownloadCounts {
  total: number
  byLevel: Record<WcagLevel, number>
  byIntroducedIn: Record<WcagVersion, number>
}

export interface WcagDownload {
  rows: WcagDownloadRow[]
  counts: WcagDownloadCounts
  /** Criteria present in the W3C file but left out of the 2.2 set (4.1.1). */
  excluded: { ref: string; title: string; versions: string[] }[]
}

const LEVELS: WcagLevel[] = ["A", "AA", "AAA"]
const VERSIONS: WcagVersion[] = ["2.0", "2.1", "2.2"]

function isLevel(value: string): value is WcagLevel {
  return (LEVELS as string[]).includes(value)
}

function isVersion(value: string): value is WcagVersion {
  return (VERSIONS as string[]).includes(value)
}

let cached: WcagDownload | null = null

/**
 * The WCAG 2.2 rows, verified against lib/wcag-data.ts. Throws, listing every
 * problem, if the two sources disagree on the set of criteria, a title, a
 * level, a guideline, the version introduced, or the counts.
 */
export function buildWcagDownload(): WcagDownload {
  if (cached) return cached

  const file = w3cData as unknown as W3CFile
  const problems: string[] = []
  const rows: WcagDownloadRow[] = []
  const excluded: WcagDownload["excluded"] = []
  const ours = new Map(wcagCriteria.map((c) => [c.number, c]))

  for (const principle of file.principles) {
    for (const guideline of principle.guidelines) {
      for (const sc of guideline.successcriteria) {
        if (!sc.versions.includes("2.2")) {
          excluded.push({ ref: sc.num, title: sc.handle, versions: sc.versions })
          continue
        }
        const own = ours.get(sc.num)
        const introduced = sc.versions[0]
        if (!own) {
          problems.push(`${sc.num} is in the W3C 2.2 set but not in lib/wcag-data.ts`)
          continue
        }
        if (!isLevel(sc.level)) problems.push(`${sc.num} has unexpected W3C level "${sc.level}"`)
        if (!isVersion(introduced)) problems.push(`${sc.num} has unexpected first version "${introduced}"`)
        if (own.title !== sc.handle) problems.push(`${sc.num} title: ours "${own.title}", W3C "${sc.handle}"`)
        if (own.level !== sc.level) problems.push(`${sc.num} level: ours ${own.level}, W3C ${sc.level}`)
        if (own.introduced !== introduced) {
          problems.push(`${sc.num} introduced: ours ${own.introduced}, W3C ${introduced}`)
        }
        const guidelineLabel = `${guideline.num} ${guideline.handle}`
        if (own.guideline !== guidelineLabel) {
          problems.push(`${sc.num} guideline: ours "${own.guideline}", W3C "${guidelineLabel}"`)
        }
        if (!isLevel(sc.level) || !isVersion(introduced)) continue

        rows.push({
          ref: sc.num,
          title: sc.handle,
          level: sc.level,
          principle: `${principle.num} ${principle.handle}`,
          guideline: guidelineLabel,
          w3c_id: sc.id,
          introduced_in: introduced,
          new_in_2_2: introduced === "2.2",
          w3c_text: flattenCriterionText(sc),
          w3c_spec_url: `https://www.w3.org/TR/WCAG22/#${sc.id}`,
          understanding_url: `https://www.w3.org/WAI/WCAG22/Understanding/${sc.id}.html`,
          how_to_meet_url: `https://www.w3.org/WAI/WCAG22/quickref/#${sc.id}`,
          accessibility_build_url: `${SITE}${wcagPath(sc.num)}`,
          accessibility_build_summary: own.description,
        })
      }
    }
  }

  const inW3C = new Set(rows.map((r) => r.ref))
  for (const c of wcagCriteria) {
    if (!inW3C.has(c.number)) problems.push(`${c.number} is in lib/wcag-data.ts but not in the W3C 2.2 set`)
  }
  if (rows.some((r) => r.ref === "4.1.1")) problems.push("4.1.1 Parsing must not be in the WCAG 2.2 set")

  const counts: WcagDownloadCounts = {
    total: rows.length,
    byLevel: { A: 0, AA: 0, AAA: 0 },
    byIntroducedIn: { "2.0": 0, "2.1": 0, "2.2": 0 },
  }
  for (const r of rows) {
    counts.byLevel[r.level] += 1
    counts.byIntroducedIn[r.introduced_in] += 1
  }

  const stats = getWCAGStats()
  if (counts.total !== stats.total) problems.push(`total: W3C ${counts.total}, lib/wcag-data.ts ${stats.total}`)
  for (const level of LEVELS) {
    if (counts.byLevel[level] !== stats.byLevel[level]) {
      problems.push(`level ${level}: W3C ${counts.byLevel[level]}, lib/wcag-data.ts ${stats.byLevel[level]}`)
    }
  }

  if (problems.length > 0) {
    throw new Error(`WCAG 2.2 download data does not match lib/wcag-data.ts:\n- ${problems.join("\n- ")}`)
  }

  cached = { rows, counts, excluded }
  return cached
}

// ---------------------------------------------------------------------------
// Serialisers (CSV and JSON; the workbook is in lib/wcag-download-xlsx.ts)
// ---------------------------------------------------------------------------

/** Cell value as a string, for CSV and spreadsheet cells. */
export function cellText(row: WcagDownloadRow, key: WcagColumnKey): string {
  const value = row[key]
  return typeof value === "boolean" ? (value ? "true" : "false") : value
}

function csvField(value: string): string {
  // Defensive against spreadsheet formula injection. No W3C or summary value
  // starts with one of these characters today (the check script asserts it),
  // so this never alters the verbatim text.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

/** RFC 4180 CSV: UTF-8 with a byte order mark, CRLF between records, header row first. */
export function buildWcagCsv(): string {
  const { rows } = buildWcagDownload()
  const lines = [WCAG_COLUMNS.map((c) => csvField(c.key)).join(",")]
  for (const row of rows) {
    lines.push(WCAG_COLUMNS.map((c) => csvField(cellText(row, c.key))).join(","))
  }
  return `﻿${lines.join("\r\n")}\r\n`
}

export function buildWcagJsonObject() {
  const { rows, counts, excluded } = buildWcagDownload()
  return {
    metadata: {
      title: "WCAG 2.2 success criteria",
      description:
        "Every WCAG 2.2 success criterion as one flat record, with W3C's verbatim text and links, plus a separately labelled Accessibility.build summary.",
      publisher: { name: "Accessibility.build", url: `${SITE}${WCAG_DATA_PAGE_PATH}` },
      source: {
        name: W3C_WCAG22_META.specTitle,
        status: W3C_WCAG22_META.specStatus,
        url: W3C_WCAG22_META.specLatestUrl,
        datedUrl: W3C_WCAG22_META.specDatedUrl,
        machineReadableUrl: W3C_WCAG22_META.sourceUrl,
        machineReadableReadme: W3C_WCAG22_META.readmeUrl,
        retrievedOn: W3C_WCAG22_META.retrievedOn,
        sourceLastModified: W3C_WCAG22_META.sourceLastModified,
        sha256: W3C_WCAG22_META.sha256,
      },
      licence: {
        w3cText: {
          name: W3C_WCAG22_META.licenceName,
          url: W3C_WCAG22_META.licenceUrl,
          copyright: W3C_WCAG22_META.copyrightNotice,
          appliesTo: WCAG_COLUMNS.filter((c) => c.source !== "Accessibility.build").map((c) => c.key),
        },
        accessibilityBuild: {
          appliesTo: WCAG_COLUMNS.filter((c) => c.source === "Accessibility.build").map((c) => c.key),
          note: "Written by Accessibility.build. Not WCAG text, not covered by the W3C licence, not endorsed by W3C.",
        },
      },
      attribution: WCAG_ATTRIBUTION,
      counts,
      excluded: excluded.map((e) => ({
        ...e,
        reason: "Not part of WCAG 2.2: W3C lists it only for versions 2.0 and 2.1.",
      })),
      columns: WCAG_COLUMNS,
    },
    criteria: rows,
  }
}

export function buildWcagJson(): string {
  return `${JSON.stringify(buildWcagJsonObject(), null, 2)}\n`
}
