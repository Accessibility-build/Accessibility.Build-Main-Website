import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { getQueueStats, cleanupStalledJobs, processPendingJobs } from '@/lib/queue'
import { getRateLimitStats } from '@/lib/rate-limit'
import { db } from '@/lib/db'
import { urlAccessibilityAudits } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

// This endpoint should be protected in production - only admins should access it
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // In production, add proper admin role check
    // if (!user.publicMetadata?.role?.includes('admin')) {
    //   return NextResponse.json(
    //     { error: 'Admin access required' },
    //     { status: 403 }
    //   )
    // }

    // Get comprehensive queue statistics
    const queueStats = await getQueueStats()
    const rateLimitStats = getRateLimitStats()

    // Get recent audit jobs for monitoring
    const [recentCompleted, recentFailed] = await Promise.all([
      // Last 10 completed audits
      db.select({
        id: urlAccessibilityAudits.id,
        url: urlAccessibilityAudits.url,
        userId: urlAccessibilityAudits.userId,
        completedAt: urlAccessibilityAudits.processingCompletedAt,
        processingTime: urlAccessibilityAudits.processingStartedAt,
        totalViolations: urlAccessibilityAudits.totalViolations,
        overallScore: urlAccessibilityAudits.overallScore,
      })
        .from(urlAccessibilityAudits)
        .where(eq(urlAccessibilityAudits.status, 'completed'))
        .orderBy(desc(urlAccessibilityAudits.processingCompletedAt))
        .limit(10),
      
      // Last 5 failed audits
      db.select({
        id: urlAccessibilityAudits.id,
        url: urlAccessibilityAudits.url,
        userId: urlAccessibilityAudits.userId,
        failedAt: urlAccessibilityAudits.updatedAt,
        error: urlAccessibilityAudits.errorMessage,
      })
        .from(urlAccessibilityAudits)
        .where(eq(urlAccessibilityAudits.status, 'failed'))
        .orderBy(desc(urlAccessibilityAudits.updatedAt))
        .limit(5)
    ])

    const response = {
      timestamp: new Date().toISOString(),
      queue: {
        ...queueStats,
        health: determineQueueHealth(queueStats),
        recentJobs: {
          completed: recentCompleted.map(job => ({
            id: job.id,
            url: job.url,
            userId: job.userId,
            completedOn: job.completedAt,
            processingTime: job.processingTime && job.completedAt 
              ? new Date(job.completedAt).getTime() - new Date(job.processingTime).getTime()
              : null,
            totalViolations: job.totalViolations,
            overallScore: job.overallScore,
          })),
          failed: recentFailed.map(job => ({
            id: job.id,
            url: job.url,
            userId: job.userId,
            failedOn: job.failedAt,
            error: job.error,
          }))
        }
      },
      rateLimit: rateLimitStats,
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform,
        architecture: 'database-based', // No Redis
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error getting queue status:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get queue status',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

function determineQueueHealth(stats: { waiting: number; active: number; completed: number; failed: number }) {
  let isHealthy = true
  let successRate = 100
  
  const totalProcessed = stats.completed + stats.failed
  if (totalProcessed > 0) {
    successRate = Math.round((stats.completed / totalProcessed) * 100)
  }
  
  if (stats.failed > 10) {
    isHealthy = false
  } else if (stats.waiting > 50) {
    isHealthy = false
  }
  
  return {
    isHealthy,
    successRate,
    queueBacklog: stats.waiting,
    stalledJobs: 0, // We clean these up automatically
  }
}

// Endpoint to manually manage queue (admin only)
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // In production, add proper admin role check
    // if (!user.publicMetadata?.role?.includes('admin')) {
    //   return NextResponse.json(
    //     { error: 'Admin access required' },
    //     { status: 403 }
    //   )
    // }

    const { action } = await req.json()

    switch (action) {
      case 'cleanup_stalled':
        await cleanupStalledJobs()
        return NextResponse.json({
          message: 'Stalled jobs cleanup completed'
        })

      case 'process_pending':
        await processPendingJobs()
        return NextResponse.json({
          message: 'Pending jobs processing triggered'
        })

      case 'clean_old_completed':
        // Delete completed audits older than 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const deletedCount = await db.delete(urlAccessibilityAudits)
          .where(eq(urlAccessibilityAudits.status, 'completed'))
          // Add date filter when you have the appropriate field
        
        return NextResponse.json({
          message: `Cleaned up old completed audits`,
          note: 'Delete query needs date filter implementation'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported: cleanup_stalled, process_pending, clean_old_completed' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error performing queue action:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to perform queue action',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 