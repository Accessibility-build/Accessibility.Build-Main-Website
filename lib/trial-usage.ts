import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { trialUsage } from '@/lib/db/schema'
import { eq, and, gte, desc } from 'drizzle-orm'

interface TrialLimitResult {
  allowed: boolean
  remaining: number
  resetTime: Date
  message: string
}

// Trial limits configuration
const TRIAL_LIMITS = {
  perIP: 5,              // 5 uses per IP per day
  blockedTools: [        // Tools that require authentication
    'accessibility_code_generator'
  ],
  // Tighter per-tool caps, counted inside the same 24 hour window. The URL
  // auditor launches a headless browser and an AI summary per run, so an
  // anonymous visitor gets one scan a day. It was fully blocked until
  // Sept 2026; opening a single free scan is what lets search traffic reach
  // the one tool that produces a domain plus real findings.
  perTool: {
    url_accessibility_auditor: 1,
    // The alt text checker's AI review sends up to eight images to a vision model.
    alt_text_checker: 2,
  } as Record<string, number>,
}

/** Tools with a per-tool cap are expensive; never fail open for them. */
function isCostlyTool(toolName: string): boolean {
  return toolName in TRIAL_LIMITS.perTool
}

const TRIAL_STATUS_TOOLS = [
  'alt_text_generator',
  'contrast_checker',
  'accessibility_audit_helper',
] as const

async function getClientIP(): Promise<string | null> {
  try {
    const headersList = await headers()
    
    // Try multiple IP headers in order of preference
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIP = headersList.get('x-real-ip')
    const cfConnectingIP = headersList.get('cf-connecting-ip')

    if (cfConnectingIP) return cfConnectingIP
    if (realIP) return realIP
    if (forwardedFor) {
      // x-forwarded-for can be a comma-separated list, take the first one
      return forwardedFor.split(',')[0].trim()
    }

    return null
  } catch (error) {
    console.error('Error getting client IP:', error)
    return null
  }
}

export async function checkTrialLimit(
  toolName: string,
  _sessionId?: string
): Promise<TrialLimitResult> {
  try {
    // Check if tool requires authentication
    if (TRIAL_LIMITS.blockedTools.includes(toolName)) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(),
        message: 'This tool requires authentication. Please sign in to continue.'
      }
    }

    const clientIP = await getClientIP()
    
    if (!clientIP) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(),
        message: 'Unable to verify trial usage. Please try again.'
      }
    }

    // Calculate reset time (start of next day)
    const now = new Date()
    const resetTime = new Date(now)
    resetTime.setHours(24, 0, 0, 0) // Next midnight

    // Get usage from last 24 hours
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000))

    const recentUsage = await db
      .select()
      .from(trialUsage)
      .where(
        and(
          eq(trialUsage.ipAddress, clientIP),
          gte(trialUsage.createdAt, twentyFourHoursAgo)
        )
      )
      .orderBy(desc(trialUsage.createdAt))

    const ipUsageCount = recentUsage.length
    const remaining = Math.max(0, TRIAL_LIMITS.perIP - ipUsageCount)

    const toolCap = TRIAL_LIMITS.perTool[toolName]
    if (toolCap !== undefined) {
      const toolUsageCount = recentUsage.filter((row) => row.tool === toolName).length
      if (toolUsageCount >= toolCap) {
        return {
          allowed: false,
          remaining: 0,
          resetTime,
          message:
            "You have used today's free scan. Create a free account for 100 credits, enough for 20 more audits with saved history.",
        }
      }
    }

    if (ipUsageCount >= TRIAL_LIMITS.perIP) {
      return {
        allowed: false,
        remaining: 0,
        resetTime,
        message: `Trial limit reached. You can try ${TRIAL_LIMITS.perIP} tools per day. Limit resets at midnight.`
      }
    }

    return {
      allowed: true,
      remaining,
      resetTime,
      message: `${remaining} trial uses remaining today.`
    }

  } catch (error) {
    console.error('Error checking trial limit:', error)

    // A costly tool must not become unlimited because the usage lookup failed.
    if (isCostlyTool(toolName)) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(),
        message: 'Free scans are temporarily unavailable. Please sign in or try again shortly.'
      }
    }

    // In case of error, allow usage but log the issue
    return {
      allowed: true,
      remaining: 1,
      resetTime: new Date(),
      message: 'Trial verification unavailable. Limited access granted.'
    }
  }
}

/**
 * Records one anonymous use and returns the new row id, or null when it could
 * not be written. `data` lets a tool keep what was submitted and what came back,
 * which the URL auditor uses to hold the full result until the visitor unlocks it.
 */
export async function recordTrialUsage(
  toolName: string,
  _sessionId?: string,
  data?: { inputData?: unknown; outputData?: unknown }
): Promise<string | null> {
  try {
    const clientIP = await getClientIP()
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || undefined

    if (!clientIP) {
      console.warn('Could not record trial usage: IP address unavailable')
      return null
    }

    const [row] = await db.insert(trialUsage).values({
      ipAddress: clientIP,
      tool: toolName as (typeof trialUsage.$inferInsert)["tool"],
      usageCount: 1,
      userAgent,
      success: true,
      ...(data?.inputData !== undefined ? { inputData: data.inputData } : {}),
      ...(data?.outputData !== undefined ? { outputData: data.outputData } : {}),
      createdAt: new Date(),
    }).returning({ id: trialUsage.id })

    return row?.id ?? null

  } catch (error) {
    console.error('Error recording trial usage:', error)
    // Don't throw error - this shouldn't block the user
    return null
  }
}

// Get all trial status for all tools
export async function getAllTrialStatus(): Promise<Array<{ tool: string } & TrialLimitResult>> {
  try {
    const results = []

    for (const toolName of TRIAL_STATUS_TOOLS) {
      const status = await checkTrialLimit(toolName, undefined)
      results.push({
        tool: toolName,
        ...status
      })
    }

    return results
  } catch (error) {
    console.error('Error getting all trial status:', error)
    return []
  }
}
