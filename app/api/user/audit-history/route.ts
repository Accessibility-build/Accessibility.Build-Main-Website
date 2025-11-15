import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { urlAccessibilityAudits } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fetch user's audit history
    const audits = await db
      .select({
        id: urlAccessibilityAudits.id,
        url: urlAccessibilityAudits.url,
        title: urlAccessibilityAudits.title,
        status: urlAccessibilityAudits.status,
        overallScore: urlAccessibilityAudits.overallScore,
        totalViolations: urlAccessibilityAudits.totalViolations,
        criticalCount: urlAccessibilityAudits.criticalCount,
        seriousCount: urlAccessibilityAudits.seriousCount,
        moderateCount: urlAccessibilityAudits.moderateCount,
        minorCount: urlAccessibilityAudits.minorCount,
        createdAt: urlAccessibilityAudits.createdAt,
        processingCompletedAt: urlAccessibilityAudits.processingCompletedAt
      })
      .from(urlAccessibilityAudits)
      .where(eq(urlAccessibilityAudits.userId, userId))
      .orderBy(desc(urlAccessibilityAudits.createdAt))
      .limit(50) // Limit to last 50 audits

    return NextResponse.json({
      audits: audits.map(audit => ({
        ...audit,
        totalViolations: audit.totalViolations || 0
      }))
    })

  } catch (error) {
    console.error('Failed to fetch audit history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit history' },
      { status: 500 }
    )
  }
} 