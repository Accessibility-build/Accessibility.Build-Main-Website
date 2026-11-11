// The WCAG 2.2 dataset as an Excel workbook, written on the server with the
// xlsx (SheetJS) package already in the repo. Only the write path is used,
// from our own committed data; the published xlsx@0.18.5 advisories
// (CVE-2023-30533, CVE-2024-22363) are in the read/parse path.
//
// Sheets: "WCAG 2.2" (one row per criterion, header row, autofilter, every
// cell stored as text) and "About" (W3C attribution, licence, status and the
// column dictionary).

import * as XLSX from "xlsx"
import { W3C_WCAG22_META } from "./data/w3c-wcag22.meta"
import { WCAG_ATTRIBUTION, WCAG_COLUMNS, buildWcagDownload, cellText } from "./wcag-download"

const COLUMN_WIDTHS: Partial<Record<(typeof WCAG_COLUMNS)[number]["key"], number>> = {
  ref: 8,
  title: 34,
  level: 7,
  principle: 16,
  guideline: 30,
  w3c_id: 30,
  introduced_in: 12,
  new_in_2_2: 11,
  w3c_text: 90,
  w3c_spec_url: 50,
  understanding_url: 60,
  how_to_meet_url: 50,
  accessibility_build_url: 40,
  accessibility_build_summary: 70,
}

export function buildWcagXlsx(): Buffer {
  const { rows, counts } = buildWcagDownload()

  const header = WCAG_COLUMNS.map((c) => c.key)
  const data = rows.map((row) => WCAG_COLUMNS.map((c) => cellText(row, c.key)))
  // aoa_to_sheet stores JS strings as text cells ("s"), so 1.4.10 stays text.
  const dataSheet = XLSX.utils.aoa_to_sheet([header, ...data])
  dataSheet["!cols"] = WCAG_COLUMNS.map((c) => ({ wch: COLUMN_WIDTHS[c.key] ?? 20 }))
  dataSheet["!autofilter"] = {
    ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length, c: header.length - 1 } }),
  }

  const about: string[][] = [
    ["WCAG 2.2 success criteria", ""],
    ["", ""],
    ["Attribution", WCAG_ATTRIBUTION],
    ["Source document", `${W3C_WCAG22_META.specTitle}, ${W3C_WCAG22_META.specStatus}`],
    ["Source URL", W3C_WCAG22_META.specLatestUrl],
    ["Dated version", W3C_WCAG22_META.specDatedUrl],
    ["Document status", W3C_WCAG22_META.specStatus],
    ["Machine-readable source", W3C_WCAG22_META.sourceUrl],
    ["Source retrieved", W3C_WCAG22_META.retrievedOn],
    ["Copyright", W3C_WCAG22_META.copyrightNotice],
    ["Licence for W3C text", `${W3C_WCAG22_META.licenceName}: ${W3C_WCAG22_META.licenceUrl}`],
    [
      "Our columns",
      "accessibility_build_url and accessibility_build_summary are written by Accessibility.build. They are not WCAG text and are not endorsed by W3C.",
    ],
    ["Published by", "Accessibility.build, https://accessibility.build/resources/wcag-data"],
    ["Criteria", String(counts.total)],
    ["Level A", String(counts.byLevel.A)],
    ["Level AA", String(counts.byLevel.AA)],
    ["Level AAA", String(counts.byLevel.AAA)],
    ["Left out", "4.1.1 Parsing, which W3C lists for WCAG 2.0 and 2.1 only and removed from WCAG 2.2."],
    ["", ""],
    ["Column", "Source and meaning"],
    ...WCAG_COLUMNS.map((c) => [c.key, `${c.source}. ${c.description}`]),
  ]
  const aboutSheet = XLSX.utils.aoa_to_sheet(about)
  aboutSheet["!cols"] = [{ wch: 28 }, { wch: 120 }]

  const workbook = XLSX.utils.book_new()
  workbook.Props = {
    Title: "WCAG 2.2 success criteria",
    Author: "Accessibility.build",
    Company: "Accessibility.build",
    Comments: WCAG_ATTRIBUTION,
  }
  XLSX.utils.book_append_sheet(workbook, dataSheet, "WCAG 2.2")
  XLSX.utils.book_append_sheet(workbook, aboutSheet, "About")

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx", bookSST: true, compression: true }) as Buffer
}
