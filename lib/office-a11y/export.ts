import { CRITERIA, wcagPath, type CheckStatus, type OfficeReport } from "./types"

// Rows for the CSV and Excel downloads: one per finding, plus one per check
// that passed or had nothing to check, so the export shows the passes too.

export const EXPORT_HEADER = [
  "Check",
  "Result",
  "Severity",
  "WCAG criterion",
  "Criterion name",
  "Level",
  "Location",
  "Issue",
  "How to fix (Microsoft 365)",
  "WCAG page",
]

export const STATUS_LABEL: Record<CheckStatus, string> = {
  pass: "Passed",
  fail: "Failed",
  review: "Review",
  "not-applicable": "Nothing to check",
}

const SITE = "https://accessibility.build"

export function exportRows(report: OfficeReport): string[][] {
  const rows: string[][] = []
  for (const check of report.checks) {
    if (check.findings.length === 0) {
      const c = CRITERIA[check.criterion]
      rows.push([check.title, STATUS_LABEL[check.status], "", check.criterion, c?.name ?? "", c?.level ?? "", "", check.summary, "", `${SITE}${wcagPath(check.criterion)}`])
      continue
    }
    for (const f of check.findings) {
      const id = f.criterion ?? check.criterion
      const c = CRITERIA[id]
      rows.push([
        check.title,
        STATUS_LABEL[check.status],
        f.severity[0].toUpperCase() + f.severity.slice(1),
        id,
        c?.name ?? "",
        c?.level ?? "",
        f.location,
        f.message,
        check.fix,
        `${SITE}${wcagPath(id)}`,
      ])
    }
  }
  return rows
}

/**
 * Quote a CSV cell. Cells that start with = + - @ or a tab get a leading
 * apostrophe so a spreadsheet does not run text from the document as a
 * formula when the CSV is opened.
 */
function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

export function toCsv(report: OfficeReport): string {
  const lines = [EXPORT_HEADER, ...exportRows(report)].map((row) => row.map(csvCell).join(","))
  // The byte order mark makes Excel read the file as UTF-8.
  return `\ufeff${lines.join("\r\n")}\r\n`
}

/** File name for the downloads: report.docx -> report-accessibility-check. */
export function exportBaseName(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "")
  return `${base || "document"}-accessibility-check`
}
