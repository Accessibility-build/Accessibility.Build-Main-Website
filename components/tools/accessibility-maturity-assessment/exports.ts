"use client"

import {
  DIMENSION_ROW_HEADER,
  dimensionRows,
  proofPointRows,
  type AssessmentState,
  type AssessmentSummary,
} from "@/lib/maturity/assessment"
import { MATURITY_MODEL_SOURCE } from "@/lib/maturity/model"

// Excel and PDF downloads of the assessment. Both libraries are imported on demand so they only
// load for visitors who export. The Excel file is the accessible format; jsPDF writes an
// untagged PDF, which suits printing and sharing but not screen readers, and the page says so.

const PROOF_POINT_HEADER = ["Dimension", "Proof point group", "Proof point", "Your rating", "Your notes"]

export const SUMMARY_RULE =
  "The W3C Note defines no numeric score. Our summary is the level that at least half of the rated proof points have reached, and Optimize only when every rated proof point is at Optimize. Not sure and Does not apply answers are left out."

const ATTRIBUTION =
  "Proof points are paraphrased from the W3C Note by Accessibility.build. Dimension and level names are the W3C's."

function sourceLine(): string {
  return `${MATURITY_MODEL_SOURCE.title}, ${MATURITY_MODEL_SOURCE.status}, ${MATURITY_MODEL_SOURCE.publishedLabel}`
}

function fileDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export async function downloadExcel(state: AssessmentState, summary: AssessmentSummary) {
  const XLSX = await import("xlsx")
  const workbook = XLSX.utils.book_new()

  const dimensions = XLSX.utils.aoa_to_sheet([DIMENSION_ROW_HEADER, ...dimensionRows(summary)])
  dimensions["!cols"] = [{ wch: 30 }, { wch: 9 }, { wch: 26 }, ...DIMENSION_ROW_HEADER.slice(3).map(() => ({ wch: 14 }))]
  XLSX.utils.book_append_sheet(workbook, dimensions, "Summary")

  const points = XLSX.utils.aoa_to_sheet([PROOF_POINT_HEADER, ...proofPointRows(state)])
  points["!cols"] = [{ wch: 28 }, { wch: 48 }, { wch: 90 }, { wch: 16 }, { wch: 60 }]
  points["!autofilter"] = { ref: XLSX.utils.encode_range(XLSX.utils.decode_range(points["!ref"] || "A1")) }
  XLSX.utils.book_append_sheet(workbook, points, "Proof points")

  const about = XLSX.utils.aoa_to_sheet([
    ["Accessibility maturity self-assessment"],
    [""],
    ["Organisation", state.organisation || "Not given"],
    ["Exported", new Date().toLocaleDateString("en-GB")],
    ["Proof points answered", `${summary.answered} of ${summary.total}`],
    [""],
    ["Based on", sourceLine()],
    ["Source", MATURITY_MODEL_SOURCE.versionUrl],
    [""],
    [ATTRIBUTION],
    [SUMMARY_RULE],
    [""],
    ["Exported from https://accessibility.build/tools/accessibility-maturity-assessment"],
  ])
  about["!cols"] = [{ wch: 24 }, { wch: 90 }]
  XLSX.utils.book_append_sheet(workbook, about, "About")

  XLSX.writeFile(workbook, `accessibility-maturity-assessment-${fileDate()}.xlsx`)
}

export async function downloadPdf(state: AssessmentState, summary: AssessmentSummary) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")])
  const doc = new jsPDF("l", "mm", "a4")
  const width = doc.internal.pageSize.getWidth() - 28

  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("Accessibility maturity self-assessment", 14, 18)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  const lines = [
    `Organisation: ${state.organisation || "Not given"}`,
    `Exported: ${new Date().toLocaleDateString("en-GB")}. Proof points answered: ${summary.answered} of ${summary.total}.`,
    `Based on the ${sourceLine()}: ${MATURITY_MODEL_SOURCE.versionUrl}`,
    ATTRIBUTION,
    SUMMARY_RULE,
  ]
  let y = 27
  for (const line of lines) {
    const wrapped = doc.splitTextToSize(line, width) as string[]
    doc.text(wrapped, 14, y)
    y += wrapped.length * 5
  }

  autoTable(doc, {
    head: [DIMENSION_ROW_HEADER],
    body: dimensionRows(summary),
    startY: y + 3,
    margin: { left: 14, right: 14 },
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [15, 118, 110], textColor: [255, 255, 255] },
  })

  const after = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y + 60
  autoTable(doc, {
    head: [PROOF_POINT_HEADER],
    body: proofPointRows(state),
    startY: after + 8,
    margin: { left: 14, right: 14 },
    styles: { fontSize: 8, cellPadding: 2, overflow: "linebreak" },
    headStyles: { fillColor: [15, 118, 110], textColor: [255, 255, 255] },
    columnStyles: { 0: { cellWidth: 34 }, 1: { cellWidth: 48 }, 2: { cellWidth: 108 }, 3: { cellWidth: 24 }, 4: { cellWidth: 55 } },
  })

  doc.save(`accessibility-maturity-assessment-${fileDate()}.pdf`)
}
