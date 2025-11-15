import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, urlAccessibilityAudits, creditTransactions, toolUsage } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { queueAudit, getQueueStats } from '@/lib/queue'
import { auditRateLimit, auditSlowDown } from '@/lib/rate-limit'

const CREDIT_COST = 5 // URL audits cost more credits due to complexity

const auditRequestSchema = z.object({
  url: z.string()
    .url('Please enter a valid URL')
    .refine((url) => {
      try {
        const parsed = new URL(url)
        return ['http:', 'https:'].includes(parsed.protocol)
      } catch {
        return false
      }
    }, 'Only HTTP and HTTPS URLs are supported'),
})

interface AuditRequest {
  url: string
}

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting first
    const rateLimitResponse = await auditRateLimit(req)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Apply slow down middleware
    const delay = await auditSlowDown(req)
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body: AuditRequest = await req.json()
    const validation = auditRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { url } = validation.data

    // Additional URL validation for security
    try {
      const parsedUrl = new URL(url)
      const hostname = parsedUrl.hostname.toLowerCase()
      
      // Block private/internal networks (SSRF protection)
      const blockedPatterns = [
        /^localhost$/,
        /^127\./,
        /^192\.168\./,
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^169\.254\./, // Link-local
        /^0\.0\.0\.0$/,
        /^::1$/, // IPv6 localhost
        /^fe80:/, // IPv6 link-local
        /^fc00:/, // IPv6 unique local
      ]
      
      if (blockedPatterns.some(pattern => pattern.test(hostname))) {
        return NextResponse.json(
          { error: 'URLs pointing to private/internal networks are not allowed' },
          { status: 400 }
        )
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Check user credits
    const [userRecord] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1)

    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const currentCredits = userRecord.credits

    if (currentCredits < CREDIT_COST) {
      return NextResponse.json(
        { 
          error: `Insufficient credits. You need ${CREDIT_COST} credits but have ${currentCredits}.`,
          code: 'INSUFFICIENT_CREDITS',
          requiredCredits: CREDIT_COST,
          currentCredits: currentCredits
        },
        { status: 402 }
      )
    }

    // Get queue statistics for better UX
    const queueStats = await getQueueStats()
    const estimatedWaitTime = calculateEstimatedWaitTime(queueStats)

    // Create audit record
    const [auditRecord] = await db
      .insert(urlAccessibilityAudits)
      .values({
        userId: user.id,
        url: url,
        status: 'pending',
        creditsUsed: CREDIT_COST,
      })
      .returning()

    // Deduct credits
    const newBalance = currentCredits - CREDIT_COST

    await Promise.all([
      // Update user credits
      db.update(users)
        .set({ 
          credits: newBalance,
          totalCreditsUsed: userRecord.totalCreditsUsed + CREDIT_COST,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id)),
      
      // Record credit transaction
      db.insert(creditTransactions).values({
        userId: userRecord.id,
        type: 'usage',
        amount: -CREDIT_COST,
        balanceBefore: currentCredits,
        balanceAfter: newBalance,
        description: 'URL Accessibility Audit',
        toolUsed: 'url_accessibility_auditor',
        metadata: {
          url: url,
          auditId: auditRecord.id,
        },
      }),

      // Record tool usage
      db.insert(toolUsage).values({
        userId: userRecord.id,
        tool: 'url_accessibility_auditor',
        creditsUsed: CREDIT_COST,
        inputData: {
          url: url,
        },
        outputData: {
          auditId: auditRecord.id,
          status: 'pending',
        },
        success: true,
      })
    ])

    // Add to production job queue
    try {
      await queueAudit(auditRecord.id)
      console.log(`✓ Audit ${auditRecord.id} added to queue`)
    } catch (queueError) {
      console.error('Failed to add audit to queue:', queueError)
      
      // Update audit status to failed
      await db
        .update(urlAccessibilityAudits)
        .set({
          status: 'failed',
          errorMessage: 'Failed to queue audit for processing',
          updatedAt: new Date(),
        })
        .where(eq(urlAccessibilityAudits.id, auditRecord.id))

      return NextResponse.json(
        { error: 'Failed to queue audit. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      auditId: auditRecord.id,
      status: 'pending',
      creditsUsed: CREDIT_COST,
      remainingCredits: newBalance,
      queuePosition: queueStats.waiting + 1,
      estimatedProcessingTime: estimatedWaitTime,
      message: 'Audit queued successfully. You will be notified when it completes.',
      queueStats: {
        waiting: queueStats.waiting,
        active: queueStats.active,
        completed: queueStats.completed,
        failed: queueStats.failed
      }
    })

  } catch (error) {
    console.error('Error starting URL accessibility audit:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to start accessibility audit. Please try again.',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Calculate estimated wait time based on queue stats
function calculateEstimatedWaitTime(queueStats: { waiting: number; active: number }): string {
  const processingTimePerAudit = 3 // Average 3 minutes per audit
  const totalWaitTime = (queueStats.waiting + queueStats.active) * processingTimePerAudit
  
  if (totalWaitTime <= 0) {
    return '1-3 minutes'
  } else if (totalWaitTime <= 5) {
    return '3-5 minutes'
  } else if (totalWaitTime <= 10) {
    return '5-10 minutes'
  } else {
    return `${Math.ceil(totalWaitTime / 5) * 5}-${Math.ceil(totalWaitTime / 5) * 5 + 5} minutes`
  }
} 