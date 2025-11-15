import { db } from '@/lib/db'
import { users, creditTransactions, toolUsage, urlAccessibilityAudits, auditViolations } from '@/lib/db/schema'
import { eq, desc, asc, count, sum, avg, and, gte, lte, or, ilike, sql } from 'drizzle-orm'
import { createCreditTransaction } from '@/lib/credits'

// Types
export interface AdminUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  profileImageUrl: string | null
  credits: number
  totalCreditsEarned: number
  totalCreditsUsed: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  totalToolUsage: number
  totalAudits: number
  mostUsedTool?: string
}

export interface ToolPerformanceMetrics {
  tool: string
  totalUsage: number
  successRate: number
  avgProcessingTime: number
  totalCreditsSpent: number
  last24Hours: number
  last7Days: number
  last30Days: number
  popularityTrend: 'up' | 'down' | 'stable'
}

export interface AdminAuditLog {
  id: string
  adminId: string
  adminEmail: string
  action: string
  targetUserId?: string
  details: Record<string, any>
  timestamp: Date
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalCreditsDistributed: number
  totalToolUsage: number
  totalAudits: number
  revenueThisMonth: number
  topTools: Array<{ tool: string; usage: number }>
  recentActivity: Array<{
    type: 'user_signup' | 'tool_usage' | 'credit_purchase' | 'audit_completed'
    description: string
    timestamp: Date
  }>
}

/**
 * Get all users with their stats and usage metrics
 */
export async function getAllUsers(filters?: {
  search?: string
  isActive?: boolean
  minCredits?: number
  maxCredits?: number
  sortBy?: 'name' | 'email' | 'credits' | 'created' | 'lastLogin'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}): Promise<{ users: AdminUser[]; total: number }> {
  
  const {
    search,
    isActive,
    minCredits,
    maxCredits,
    sortBy = 'created',
    sortOrder = 'desc',
    limit = 50,
    offset = 0
  } = filters || {}

  // Build where conditions
  const whereConditions = []
  
  if (search) {
    whereConditions.push(
      or(
        ilike(users.email, `%${search}%`),
        ilike(users.firstName, `%${search}%`),
        ilike(users.lastName, `%${search}%`)
      )
    )
  }
  
  if (isActive !== undefined) {
    whereConditions.push(eq(users.isActive, isActive))
  }
  
  if (minCredits !== undefined) {
    whereConditions.push(gte(users.credits, minCredits))
  }
  
  if (maxCredits !== undefined) {
    whereConditions.push(lte(users.credits, maxCredits))
  }

  // Get users with usage stats
  const usersWithStats = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      profileImageUrl: users.profileImageUrl,
      credits: users.credits,
      totalCreditsEarned: users.totalCreditsEarned,
      totalCreditsUsed: users.totalCreditsUsed,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      totalToolUsage: sql<number>`COALESCE(${count(toolUsage.id)}, 0)`,
      totalAudits: sql<number>`COALESCE(${count(urlAccessibilityAudits.id)}, 0)`,
      mostUsedTool: sql<string>`
        (SELECT tool FROM ${toolUsage} 
         WHERE ${toolUsage.userId} = ${users.id} 
         GROUP BY tool 
         ORDER BY COUNT(*) DESC 
         LIMIT 1)
      `
    })
    .from(users)
    .leftJoin(toolUsage, eq(users.id, toolUsage.userId))
    .leftJoin(urlAccessibilityAudits, eq(users.id, urlAccessibilityAudits.userId))
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .groupBy(users.id)
    .orderBy(
      sortOrder === 'asc' ? 
        (sortBy === 'name' ? asc(users.firstName) :
         sortBy === 'email' ? asc(users.email) :
         sortBy === 'credits' ? asc(users.credits) :
         asc(users.createdAt)) :
        (sortBy === 'name' ? desc(users.firstName) :
         sortBy === 'email' ? desc(users.email) :
         sortBy === 'credits' ? desc(users.credits) :
         desc(users.createdAt))
    )
    .limit(limit)
    .offset(offset)

  // Get total count
  const totalResult = await db
    .select({ count: count() })
    .from(users)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

  return {
    users: usersWithStats as AdminUser[],
    total: totalResult[0]?.count || 0
  }
}

/**
 * Get tool performance metrics
 */
export async function getToolPerformanceMetrics(days: number = 30): Promise<ToolPerformanceMetrics[]> {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const metrics = await db
    .select({
      tool: toolUsage.tool,
      totalUsage: count(toolUsage.id),
      successRate: sql<number>`(COUNT(CASE WHEN ${toolUsage.success} = true THEN 1 END) * 100.0 / COUNT(*))`,
      avgProcessingTime: sql<number>`AVG(${toolUsage.processingTime})`,
      totalCreditsSpent: sum(toolUsage.creditsUsed),
      last24Hours: sql<number>`COUNT(CASE WHEN ${toolUsage.createdAt} >= ${oneDayAgo.toISOString()} THEN 1 END)`,
      last7Days: sql<number>`COUNT(CASE WHEN ${toolUsage.createdAt} >= ${sevenDaysAgo.toISOString()} THEN 1 END)`,
      last30Days: count(toolUsage.id)
    })
    .from(toolUsage)
    .where(gte(toolUsage.createdAt, startDate))
    .groupBy(toolUsage.tool)
    .orderBy(desc(count(toolUsage.id)))

  // Calculate popularity trend (simplified)
  return metrics.map(metric => ({
    tool: metric.tool,
    totalUsage: metric.totalUsage,
    successRate: Number(metric.successRate) || 0,
    avgProcessingTime: Number(metric.avgProcessingTime) || 0,
    totalCreditsSpent: Number(metric.totalCreditsSpent) || 0,
    last24Hours: Number(metric.last24Hours) || 0,
    last7Days: Number(metric.last7Days) || 0,
    last30Days: Number(metric.last30Days) || 0,
    popularityTrend: (metric.last7Days > metric.last30Days / 4) ? 'up' : 
                     (metric.last7Days < metric.last30Days / 6) ? 'down' : 'stable'
  }))
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  // Get basic stats
  const [userStats] = await db
    .select({
      totalUsers: count(users.id),
      activeUsers: sql<number>`COUNT(CASE WHEN ${users.isActive} = true THEN 1 END)`,
      totalCreditsDistributed: sum(users.totalCreditsEarned)
    })
    .from(users)

  // Get tool usage stats
  const [toolUsageStats] = await db
    .select({
      totalToolUsage: count(toolUsage.id)
    })
    .from(toolUsage)

  // Get audit stats
  const [auditStats] = await db
    .select({
      totalAudits: count(urlAccessibilityAudits.id)
    })
    .from(urlAccessibilityAudits)

  // Get top tools
  const topTools = await db
    .select({
      tool: toolUsage.tool,
      usage: count(toolUsage.id)
    })
    .from(toolUsage)
    .where(gte(toolUsage.createdAt, thirtyDaysAgo))
    .groupBy(toolUsage.tool)
    .orderBy(desc(count(toolUsage.id)))
    .limit(5)

  // Get recent activity
  const recentUsers = await db
    .select({
      type: sql<'user_signup'>`'user_signup'`,
      description: sql<string>`'New user: ' || ${users.email}`,
      timestamp: users.createdAt
    })
    .from(users)
    .where(gte(users.createdAt, oneDayAgo))
    .orderBy(desc(users.createdAt))
    .limit(10)

  const recentToolUsage = await db
    .select({
      type: sql<'tool_usage'>`'tool_usage'`,
      description: sql<string>`'Tool used: ' || ${toolUsage.tool}`,
      timestamp: toolUsage.createdAt
    })
    .from(toolUsage)
    .where(gte(toolUsage.createdAt, oneDayAgo))
    .orderBy(desc(toolUsage.createdAt))
    .limit(10)

  const recentActivity = [...recentUsers, ...recentToolUsage]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10)

  return {
    totalUsers: userStats?.totalUsers || 0,
    activeUsers: userStats?.activeUsers || 0,
    totalCreditsDistributed: Number(userStats?.totalCreditsDistributed) || 0,
    totalToolUsage: toolUsageStats?.totalToolUsage || 0,
    totalAudits: auditStats?.totalAudits || 0,
    revenueThisMonth: 0, // TODO: Calculate from payments table
    topTools: topTools.map(t => ({ tool: t.tool, usage: t.usage })),
    recentActivity
  }
}

/**
 * Update user status (activate/deactivate)
 */
export async function updateUserStatus(userId: string, isActive: boolean, adminId: string): Promise<boolean> {
  try {
    await db
      .update(users)
      .set({ 
        isActive, 
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))

    // Log admin action
    await logAdminAction(adminId, 'user_status_update', {
      targetUserId: userId,
      newStatus: isActive ? 'active' : 'inactive'
    })

    return true
  } catch (error) {
    console.error('Error updating user status:', error)
    return false
  }
}

/**
 * Assign credits to a user
 */
export async function assignCreditsToUser(
  userId: string, 
  amount: number, 
  adminId: string, 
  reason: string
): Promise<boolean> {
  try {
    // Get current user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      throw new Error('User not found')
    }

    // Create credit transaction
    await createCreditTransaction({
      userId,
      type: 'bonus',
      amount,
      balanceBefore: user.credits,
      balanceAfter: user.credits + amount,
      description: `Admin credit assignment: ${reason}`,
      metadata: { adminId, reason }
    })

    // Update user credits
    await db
      .update(users)
      .set({ 
        credits: user.credits + amount,
        totalCreditsEarned: user.totalCreditsEarned + amount,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))

    // Log admin action
    await logAdminAction(adminId, 'credit_assignment', {
      targetUserId: userId,
      amount,
      reason
    })

    return true
  } catch (error) {
    console.error('Error assigning credits:', error)
    return false
  }
}

/**
 * Bulk assign credits to multiple users
 */
export async function bulkAssignCredits(
  userIds: string[], 
  amount: number, 
  adminId: string, 
  reason: string
): Promise<{ success: number; failed: number }> {
  let success = 0
  let failed = 0

  for (const userId of userIds) {
    const result = await assignCreditsToUser(userId, amount, adminId, reason)
    if (result) {
      success++
    } else {
      failed++
    }
  }

  // Log bulk action
  await logAdminAction(adminId, 'bulk_credit_assignment', {
    totalUsers: userIds.length,
    amount,
    reason,
    success,
    failed
  })

  return { success, failed }
}

/**
 * Log admin actions for audit trail
 */
export async function logAdminAction(
  adminId: string, 
  action: string, 
  details: Record<string, any>
): Promise<void> {
  // For now, we'll create a simple credit transaction to track admin actions
  // In a full implementation, you might want a dedicated admin_audit_log table
  await createCreditTransaction({
    userId: adminId,
    type: 'bonus',
    amount: 0,
    balanceBefore: 0,
    balanceAfter: 0,
    description: `Admin action: ${action}`,
    metadata: { adminAction: true, action, details, timestamp: new Date() }
  })
}

/**
 * Get recent admin actions
 */
export async function getRecentAdminActions(limit: number = 50): Promise<AdminAuditLog[]> {
  const actions = await db
    .select({
      id: creditTransactions.id,
      userId: creditTransactions.userId,
      description: creditTransactions.description,
      metadata: creditTransactions.metadata,
      createdAt: creditTransactions.createdAt,
      adminEmail: users.email
    })
    .from(creditTransactions)
    .leftJoin(users, eq(creditTransactions.userId, users.id))
    .where(sql`${creditTransactions.metadata} ->> 'adminAction' = 'true'`)
    .orderBy(desc(creditTransactions.createdAt))
    .limit(limit)

  // Transform to AdminAuditLog format
  return actions.map(action => ({
    id: action.id,
    adminId: action.userId,
    adminEmail: action.adminEmail || '',
    action: (action.metadata as any)?.action || 'unknown',
    targetUserId: (action.metadata as any)?.details?.targetUserId,
    details: (action.metadata as any)?.details || {},
    timestamp: action.createdAt
  }))
}

/**
 * Get user details by ID
 */
export async function getUserDetails(userId: string): Promise<AdminUser | null> {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      profileImageUrl: users.profileImageUrl,
      credits: users.credits,
      totalCreditsEarned: users.totalCreditsEarned,
      totalCreditsUsed: users.totalCreditsUsed,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      totalToolUsage: sql<number>`COALESCE(${count(toolUsage.id)}, 0)`,
      totalAudits: sql<number>`COALESCE(${count(urlAccessibilityAudits.id)}, 0)`,
      mostUsedTool: sql<string>`
        (SELECT tool FROM ${toolUsage} 
         WHERE ${toolUsage.userId} = ${users.id} 
         GROUP BY tool 
         ORDER BY COUNT(*) DESC 
         LIMIT 1)
      `
    })
    .from(users)
    .leftJoin(toolUsage, eq(users.id, toolUsage.userId))
    .leftJoin(urlAccessibilityAudits, eq(users.id, urlAccessibilityAudits.userId))
    .where(eq(users.id, userId))
    .groupBy(users.id)
    .limit(1)

  return user as AdminUser | null
} 