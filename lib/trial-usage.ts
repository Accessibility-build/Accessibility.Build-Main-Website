import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { trialUsage } from '@/lib/db/schema'
import { eq, and, gte, desc } from 'drizzle-orm'

interface TrialUsageData {
  ipAddress: string | null
  userAgent?: string
  toolUsed: string
  sessionId?: string
}

interface TrialLimitResult {
  allowed: boolean
  remaining: number
  resetTime: Date
  message: string
}

// Trial limits configuration
const TRIAL_LIMITS = {
  perIP: 5,              // 5 uses per IP per day
  perSession: 3,         // 3 uses per session
  cooldownHours: 24,     // Reset every 24 hours
  blockedTools: [        // Tools that require authentication
    'url_accessibility_auditor',
    'accessibility_code_generator'
  ]
}

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
  sessionId?: string
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
    
    // In case of error, allow usage but log the issue
    return {
      allowed: true,
      remaining: 1,
      resetTime: new Date(),
      message: 'Trial verification unavailable. Limited access granted.'
    }
  }
}

export async function recordTrialUsage(toolName: string, sessionId?: string): Promise<void> {
  try {
    const clientIP = await getClientIP()
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || undefined

    if (!clientIP) {
      console.warn('Could not record trial usage: IP address unavailable')
      return
    }

    await db.insert(trialUsage).values({
      ipAddress: clientIP,
      tool: toolName as any, // Type assertion for enum compatibility
      usageCount: 1,
      userAgent,
      success: true,
      createdAt: new Date(),
    })

  } catch (error) {
    console.error('Error recording trial usage:', error)
    // Don't throw error - this shouldn't block the user
  }
}

// Get all trial status for all tools
export async function getAllTrialStatus(): Promise<any[]> {
  try {
    const results = []
    
    for (const [toolName, limit] of Object.entries(TRIAL_LIMITS)) {
      if (toolName === 'blockedTools') continue // Skip the blockedTools array
      
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