// Shapes shared by the Word and PowerPoint checks, the page and the exports.

export type Severity = "error" | "warning" | "tip"
export type OfficeKind = "docx" | "pptx"

/**
 * pass: the check ran and found nothing.
 * fail: at least one error or warning.
 * review: only tips, things worth a look that are not failures.
 * not-applicable: nothing of that kind in the file (no tables, no links).
 */
export type CheckStatus = "pass" | "fail" | "review" | "not-applicable"

export interface Finding {
  severity: Severity
  /** What is wrong, in one or two plain sentences. */
  message: string
  /** Where: a page and paragraph excerpt in Word, a slide and shape in PowerPoint. */
  location: string
  /** Set when one finding maps to a different criterion from its check (audio and video). */
  criterion?: string
}

export interface CheckResult {
  id: string
  title: string
  criterion: string
  status: CheckStatus
  /** One sentence on what was found, shown whether the check passed or not. */
  summary: string
  /** How to fix it in Microsoft 365. */
  fix: string
  findings: Finding[]
}

export interface OfficeReport {
  kind: OfficeKind
  fileName: string
  /** Short facts about the file for the summary (pages, slides, images, tables). */
  facts: { label: string; value: string }[]
  checks: CheckResult[]
  counts: Record<Severity, number>
}

export interface Criterion {
  id: string
  name: string
  level: "A" | "AA"
}

export const CRITERIA: Record<string, Criterion> = {
  "1.1.1": { id: "1.1.1", name: "Non-text Content", level: "A" },
  "1.2.1": { id: "1.2.1", name: "Audio-only and Video-only (Prerecorded)", level: "A" },
  "1.2.2": { id: "1.2.2", name: "Captions (Prerecorded)", level: "A" },
  "1.3.1": { id: "1.3.1", name: "Info and Relationships", level: "A" },
  "1.3.2": { id: "1.3.2", name: "Meaningful Sequence", level: "A" },
  "1.4.3": { id: "1.4.3", name: "Contrast (Minimum)", level: "AA" },
  "2.4.2": { id: "2.4.2", name: "Page Titled", level: "A" },
  "2.4.4": { id: "2.4.4", name: "Link Purpose (In Context)", level: "A" },
  "2.4.6": { id: "2.4.6", name: "Headings and Labels", level: "AA" },
  "3.1.1": { id: "3.1.1", name: "Language of Page", level: "A" },
}

/** The site's page for a criterion: 1.4.3 -> /wcag/1-4-3. */
export function wcagPath(criterion: string): string {
  return `/wcag/${criterion.replace(/\./g, "-")}`
}

export function criterionLabel(criterion: string): string {
  const c = CRITERIA[criterion]
  return c ? `${c.id} ${c.name} (Level ${c.level})` : criterion
}

export interface CheckDefinition {
  id: string
  title: string
  criterion: string
  fix: string
}

/**
 * Build a check result from its definition and findings. The status follows
 * from the findings, so a check can never claim a pass it did not earn.
 */
export function makeCheck(
  def: CheckDefinition,
  findings: Finding[],
  summary: string,
  applicable = true,
): CheckResult {
  let status: CheckStatus = "pass"
  if (!applicable && findings.length === 0) status = "not-applicable"
  else if (findings.some((f) => f.severity !== "tip")) status = "fail"
  else if (findings.length > 0) status = "review"
  return { id: def.id, title: def.title, criterion: def.criterion, status, summary, fix: def.fix, findings }
}

export function countSeverities(checks: CheckResult[]): Record<Severity, number> {
  const counts: Record<Severity, number> = { error: 0, warning: 0, tip: 0 }
  for (const c of checks) for (const f of c.findings) counts[f.severity]++
  return counts
}

/** Shared wording for the alt text quality checks. */
export function altQualitySummary(withAlt: number, flagged: number): string {
  const base = `${withAlt} ${withAlt === 1 ? "object has" : "objects have"} alt text`
  return flagged
    ? `${base}; ${flagged} ${flagged === 1 ? "description needs" : "descriptions need"} a second look. Only a person can judge whether the rest are accurate.`
    : `${base}, and none looks generated or like a file name. Only a person can judge whether it is accurate.`
}
