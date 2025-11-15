import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { urlAccessibilityAudits, auditViolations } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

interface AuditStatusResponse {
  auditId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  url: string
  title?: string
  createdAt: string
  processingStartedAt?: string
  processingCompletedAt?: string
  errorMessage?: string
  
  // Results (only when completed)
  totalViolations?: number
  criticalCount?: number
  seriousCount?: number
  moderateCount?: number
  minorCount?: number
  overallScore?: number
  aiSummary?: string
  priorityRecommendations?: any[]
  violations?: any[]
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ auditId: string }> }
) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { auditId } = await params

    // Get audit record (ensure it belongs to the current user)
    const [auditRecord] = await db
      .select()
      .from(urlAccessibilityAudits)
      .where(and(
        eq(urlAccessibilityAudits.id, auditId),
        eq(urlAccessibilityAudits.userId, user.id)
      ))
      .limit(1)

    if (!auditRecord) {
      return NextResponse.json(
        { error: 'Audit not found or access denied' },
        { status: 404 }
      )
    }

    const response: AuditStatusResponse = {
      auditId: auditRecord.id,
      status: auditRecord.status,
      url: auditRecord.url,
      title: auditRecord.title || undefined,
      createdAt: auditRecord.createdAt.toISOString(),
      processingStartedAt: auditRecord.processingStartedAt?.toISOString(),
      processingCompletedAt: auditRecord.processingCompletedAt?.toISOString(),
      errorMessage: auditRecord.errorMessage || undefined,
    }

    // If completed, include detailed results
    if (auditRecord.status === 'completed') {
      // Get violation details
      const violations = await db
        .select()
        .from(auditViolations)
        .where(eq(auditViolations.auditId, auditId))

      response.totalViolations = auditRecord.totalViolations || 0
      response.criticalCount = auditRecord.criticalCount || 0
      response.seriousCount = auditRecord.seriousCount || 0
      response.moderateCount = auditRecord.moderateCount || 0
      response.minorCount = auditRecord.minorCount || 0
      response.overallScore = auditRecord.overallScore || 0
      response.aiSummary = auditRecord.aiSummary || undefined
      response.priorityRecommendations = auditRecord.priorityRecommendations as any[] || []
      response.violations = violations.map(violation => ({
        id: violation.id,
        violationId: violation.violationId,
        description: violation.description,
        impact: violation.impact,
        helpUrl: violation.helpUrl,
        wcagCriteria: violation.wcagCriteria,
        wcagLevel: violation.wcagLevel,
        selector: violation.selector,
        html: violation.html,
        target: violation.target,
        aiExplanation: violation.aiExplanation,
        fixSuggestion: violation.fixSuggestion,
        codeExample: violation.codeExample,
      }))
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error fetching audit status:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch audit status' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ auditId: string }> }
) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { auditId } = await params

    // Delete audit record (cascade will handle violations)
    const result = await db
      .delete(urlAccessibilityAudits)
      .where(and(
        eq(urlAccessibilityAudits.id, auditId),
        eq(urlAccessibilityAudits.userId, user.id)
      ))

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting audit:', error)
    
    return NextResponse.json(
      { error: 'Failed to delete audit' },
      { status: 500 }
    )
  }
} 