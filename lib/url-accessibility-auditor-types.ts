
export interface UrlAuditResult {
  auditId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  url: string
  title?: string
  createdAt: string
  processingStartedAt?: string
  processingCompletedAt?: string
  errorMessage?: string
  
  // Results (when completed)
  totalViolations?: number
  criticalCount?: number
  seriousCount?: number
  moderateCount?: number
  minorCount?: number
  overallScore?: number
  aiSummary?: string
  priorityRecommendations?: Array<{
    title: string
    description: string
    impact: string
    effort: string
  }>
  violations?: Array<{
    id: string
    violationId: string
    description: string
    impact: 'critical' | 'serious' | 'moderate' | 'minor'
    helpUrl: string
    wcagCriteria: any[]
    wcagLevel: string
    selector: string
    html: string
    target: string[]
    aiExplanation: string
    fixSuggestion: string
    codeExample?: string
  }>
}

export interface AuditHistory {
  audits: Array<{
    id: string
    url: string
    title?: string
    status: string
    overallScore?: number
    totalViolations: number
    createdAt: string
  }>
}
