/**
 * Shared rules for the anonymous free scan on the URL Accessibility Auditor.
 * Used by the server action (what to hold back) and the unlock route (what to
 * release), so both agree on ordering and on how many findings are free.
 */

/** Findings shown before the visitor unlocks the rest. */
export const FREE_SCAN_VISIBLE_FINDINGS = 3

const SEVERITY_RANK: Record<string, number> = {
  critical: 0,
  serious: 1,
  moderate: 2,
  minor: 3,
}

/** Most severe first; stable within a severity so axe's own order is kept. */
export function sortBySeverity<T extends { impact: string }>(violations: T[]): T[] {
  return violations
    .map((violation, index) => ({ violation, index }))
    .sort(
      (a, b) =>
        (SEVERITY_RANK[a.violation.impact] ?? 9) - (SEVERITY_RANK[b.violation.impact] ?? 9) ||
        a.index - b.index
    )
    .map(({ violation }) => violation)
}

/** A 0 to 100 priority for the prospects list, weighted like the audit score. */
export function inboundLeadScore(counts: { criticalCount: number; seriousCount: number }): number {
  return Math.min(100, 60 + counts.criticalCount * 10 + counts.seriousCount * 4)
}

/**
 * sessionStorage key a tool page uses to hand a URL to the auditor. A query
 * string would do the same job but would also mint a crawlable URL variant for
 * every address anyone typed.
 */
export const SCAN_HANDOFF_STORAGE_KEY = "a11y:scan-handoff-url"
