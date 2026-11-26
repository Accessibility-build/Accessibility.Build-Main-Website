"use client"

import type { UrlAuditResult } from "@/lib/url-accessibility-auditor-types"
import type { AuditFinding } from "@/lib/url-audit/types"
import { hostOf } from "./meta"

// Report downloads. The spreadsheet and PDF libraries load only when someone asks for a file.

function baseName(audit: UrlAuditResult): string {
  const day = (audit.processingCompletedAt ?? audit.createdAt).slice(0, 10)
  return `accessibility-audit-${hostOf(audit.url).replace(/[^a-z0-9.-]/gi, "-")}-${day}`
}

function rows(findings: AuditFinding[]) {
  return findings.map((finding) => ({
    Outcome: finding.outcome === "violation" ? "Violation" : "Needs review",
    Severity: finding.impact,
    Finding: finding.title,
    WCAG: finding.wcag.join(", ") || "Best practice",
    Level: finding.wcagLevel,
    Elements: finding.nodeCount,
    "Detected by": finding.source,
    Rule: finding.ruleId,
    "How to fix": finding.fix,
    "First selectors": finding.nodes
      .slice(0, 5)
      .map((node) => node.selector)
      .filter(Boolean)
      .join("\n"),
    "Learn more": finding.helpUrl,
  }))
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function exportCsv(audit: UrlAuditResult) {
  const data = rows(audit.findings ?? [])
  const headers = Object.keys(data[0] ?? { Finding: "" })
  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`
  const csv = [headers.map(escape).join(","), ...data.map((row) => headers.map((key) => escape(row[key as keyof typeof row])).join(","))].join("\r\n")
  download(new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" }), `${baseName(audit)}.csv`)
}

export async function exportXlsx(audit: UrlAuditResult) {
  const XLSX = await import("xlsx")
  const workbook = XLSX.utils.book_new()
  const summary = [
    { Field: "Page", Value: audit.url },
    { Field: "Title", Value: audit.title ?? "" },
    { Field: "Scanned", Value: new Date(audit.processingCompletedAt ?? audit.createdAt).toLocaleString("en-GB") },
    { Field: "Score", Value: audit.overallScore ?? "" },
    { Field: "Failing rules", Value: audit.totalViolations ?? 0 },
    { Field: "Critical", Value: audit.criticalCount ?? 0 },
    { Field: "Serious", Value: audit.seriousCount ?? 0 },
    { Field: "Moderate", Value: audit.moderateCount ?? 0 },
    { Field: "Minor", Value: audit.minorCount ?? 0 },
    { Field: "To review", Value: audit.reviewCount ?? 0 },
    { Field: "Engine", Value: "axe-core plus accessibility.build keyboard, reflow, text spacing, motion and page checks" },
  ]
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summary), "Summary")
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows(audit.findings ?? [])), "Findings")
  if (audit.extras) {
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(audit.extras.coverage.map((entry) => ({ Criterion: entry.sc, Title: entry.title, Level: entry.level, Status: entry.status, Findings: entry.findings }))),
      "WCAG coverage",
    )
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(audit.extras.manualChecks.map((check) => ({ Check: check.title, WCAG: check.sc.join(", "), Why: check.reason, Steps: check.steps.join("\n") }))),
      "Manual checks",
    )
  }
  XLSX.writeFile(workbook, `${baseName(audit)}.xlsx`)
}

export async function exportPdf(audit: UrlAuditResult) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")])
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
  doc.setProperties({ title: `Accessibility audit: ${audit.title ?? audit.url}`, subject: audit.url, creator: "accessibility.build" })
  doc.setFontSize(18)
  doc.text("Accessibility audit", 14, 18)
  doc.setFontSize(10)
  doc.text(audit.url, 14, 25)
  doc.text(
    `Score ${audit.overallScore ?? "-"}/100   Failing rules ${audit.totalViolations ?? 0} (critical ${audit.criticalCount ?? 0}, serious ${audit.seriousCount ?? 0}, moderate ${audit.moderateCount ?? 0}, minor ${audit.minorCount ?? 0})   To review ${audit.reviewCount ?? 0}`,
    14,
    31,
  )
  doc.text(`Scanned ${new Date(audit.processingCompletedAt ?? audit.createdAt).toLocaleString("en-GB")} with axe-core and accessibility.build checks. Automated results; verify before quoting.`, 14, 37)

  autoTable(doc, {
    startY: 43,
    head: [["Outcome", "Severity", "Finding", "WCAG", "Elements", "How to fix", "First selector"]],
    body: (audit.findings ?? []).map((finding) => [
      finding.outcome === "violation" ? "Violation" : "Review",
      finding.impact,
      finding.title,
      finding.wcag.join(", ") || "Best practice",
      String(finding.nodeCount),
      finding.fix,
      finding.nodes[0]?.selector ?? "",
    ]),
    styles: { fontSize: 7.5, cellPadding: 1.8, overflow: "linebreak" },
    headStyles: { fillColor: [15, 118, 110] },
    columnStyles: { 0: { cellWidth: 18 }, 1: { cellWidth: 17 }, 2: { cellWidth: 58 }, 3: { cellWidth: 20 }, 4: { cellWidth: 15 }, 5: { cellWidth: 90 }, 6: { cellWidth: 51 } },
  })
  doc.save(`${baseName(audit)}.pdf`)
}
