import type { AuditExtras, AuditFinding } from "@/lib/url-audit/types"

export interface UrlAuditResult {
  auditId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  url: string
  title?: string
  createdAt: string
  processingStartedAt?: string
  processingCompletedAt?: string
  errorMessage?: string

  // Results (when completed). Counts are confirmed violations, one per failing rule.
  totalViolations?: number
  criticalCount?: number
  seriousCount?: number
  moderateCount?: number
  minorCount?: number
  /** Findings a person has to judge (axe "needs review" and our heuristics). Not in the score. */
  reviewCount?: number
  /** Elements affected by the confirmed violations, counted over every finding even when a free scan shows only some. */
  violationElements?: number
  overallScore?: number
  /** JSON string: lib/url-audit/types AiSummary, or the older business-summary shape. */
  aiSummary?: string

  /** Violations first, most severe first, then items to review. */
  findings?: AuditFinding[]
  /** Coverage map, keyboard pass, page facts and manual checks. Absent on audits saved before November 2026. */
  extras?: AuditExtras
  /** data:image/jpeg of the first screen. Only on a fresh result, never stored. */
  screenshot?: string

  /**
   * Present only on an anonymous free scan. `findings` then holds just the
   * most severe ones; the rest stay on the server until the visitor unlocks
   * them with `scanId`.
   */
  preview?: {
    scanId: string
    lockedCount: number
  }
}

export interface AuditHistory {
  audits: Array<{
    id: string
    url: string
    title?: string
    status: string
    overallScore?: number
    totalViolations: number
    criticalCount?: number
    seriousCount?: number
    moderateCount?: number
    minorCount?: number
    processingCompletedAt?: string
    createdAt: string
  }>
}
