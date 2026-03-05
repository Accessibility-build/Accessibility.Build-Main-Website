import { db } from '@/lib/db'
import {
  users,
  creditTransactions,
  toolUsage,
  urlAccessibilityAudits,
  auditViolations,
  billingOrders,
  billingFunnelEvents,
} from '@/lib/db/schema'
import { eq, desc, asc, count, sum, avg, and, gte, lte, or, ilike, sql } from 'drizzle-orm'
import { createCreditTransaction } from '@/lib/credits'
import type { BillingFunnelEventType, BillingProvider } from '@/lib/billing/types'

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
  billingActionRequired: number
  topTools: Array<{ tool: string; usage: number }>
  recentActivity: Array<{
    type: 'user_signup' | 'tool_usage' | 'credit_purchase' | 'audit_completed'
    description: string
    timestamp: Date
  }>
}

export type BillingFunnelRange = '24h' | '7d' | '30d'

export interface BillingFunnelKpis {
  range: BillingFunnelRange
  checkoutClicks: number
  checkoutAuthRequired: number
  checkoutSessionsCreated: number
  checkoutSessionsFailed: number
  checkoutFallbackPaymentLinks: number
  checkoutFallbackRate: number
  webhookPaid: number
  webhookPending: number
  webhookFailed: number
  webhookRefund: number
  webhookDuplicate: number
  webhookErrors: number
  manageClicks: number
  manageAuthRequired: number
  manageSessionsCreated: number
  manageSessionsFailed: number
  checkoutConversionRate: number
  manageSuccessRate: number
  providerEventCounts: {
    razorpay: number
    stripe: number
    unknown: number
  }
  paidOrdersByProvider: {
    razorpay: number
    stripe: number
  }
  paidOrdersByCurrency: {
    usd: number
    inr: number
  }
  fxDiagnostics: {
    trackedOrders: number
    avgUsdToInrRate: number | null
    latestUsdToInrRate: number | null
  }
  pendingOrdersOlderThan30Minutes: number
  actionRequiredOrders: number
}

export interface BillingFunnelEventFeedItem {
  id: string
  eventType: string
  eventSource: string
  userId: string | null
  orderId: string | null
  paymentProvider: BillingProvider | null
  catalogKey: string | null
  currency: string | null
  providerOrderId: string | null
  providerPaymentId: string | null
  stripeCheckoutSessionId: string | null
  status: string | null
  errorCode: string | null
  errorMessage: string | null
  metadata: Record<string, unknown> | null
  createdAt: Date
}

function getBillingFunnelRangeStart(range: BillingFunnelRange) {
  const now = Date.now()

  switch (range) {
    case '24h':
      return new Date(now - 24 * 60 * 60 * 1000)
    case '30d':
      return new Date(now - 30 * 24 * 60 * 60 * 1000)
    case '7d':
    default:
      return new Date(now - 7 * 24 * 60 * 60 * 1000)
  }
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
      totalToolUsage: sql<number>`COALESCE(COUNT(DISTINCT ${toolUsage.id}), 0)`,
      totalAudits: sql<number>`COALESCE(COUNT(DISTINCT ${urlAccessibilityAudits.id}), 0)`,
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
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

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

  // Revenue stats for current month
  const [revenueStats] = await db
    .select({
      revenueThisMonth: sql<number>`COALESCE(SUM(${billingOrders.amountTotal}), 0)`,
    })
    .from(billingOrders)
    .where(and(eq(billingOrders.status, 'paid'), gte(billingOrders.createdAt, monthStart)))

  // Billing orders requiring manual action
  const [actionRequiredStats] = await db
    .select({
      billingActionRequired: count(billingOrders.id),
    })
    .from(billingOrders)
    .where(eq(billingOrders.status, 'action_required'))

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
    revenueThisMonth: Number(revenueStats?.revenueThisMonth || 0),
    billingActionRequired: Number(actionRequiredStats?.billingActionRequired || 0),
    topTools: topTools.map(t => ({ tool: t.tool, usage: t.usage })),
    recentActivity
  }
}

export async function getBillingFunnelKpis(
  range: BillingFunnelRange = '7d',
  paymentProvider?: BillingProvider
): Promise<BillingFunnelKpis> {
  const rangeStart = getBillingFunnelRangeStart(range)
  const stalePendingThreshold = new Date(Date.now() - 30 * 60 * 1000)
  const eventConditions = [gte(billingFunnelEvents.createdAt, rangeStart)]
  const paidOrderConditions = [eq(billingOrders.status, 'paid'), gte(billingOrders.createdAt, rangeStart)]
  const pendingOrderConditions = [eq(billingOrders.status, 'pending'), lte(billingOrders.createdAt, stalePendingThreshold)]
  const actionRequiredConditions = [eq(billingOrders.status, 'action_required')]

  if (paymentProvider) {
    eventConditions.push(eq(billingFunnelEvents.paymentProvider, paymentProvider))
    paidOrderConditions.push(eq(billingOrders.paymentProvider, paymentProvider))
    pendingOrderConditions.push(eq(billingOrders.paymentProvider, paymentProvider))
    actionRequiredConditions.push(eq(billingOrders.paymentProvider, paymentProvider))
  }

  const [groupedEvents, groupedProviderEvents, paidOrders, pendingStats, actionRequiredStats] = await Promise.all([
    db
      .select({
        eventType: billingFunnelEvents.eventType,
        total: count(billingFunnelEvents.id),
      })
      .from(billingFunnelEvents)
      .where(and(...eventConditions))
      .groupBy(billingFunnelEvents.eventType),
    db
      .select({
        paymentProvider: billingFunnelEvents.paymentProvider,
        total: count(billingFunnelEvents.id),
      })
      .from(billingFunnelEvents)
      .where(and(...eventConditions))
      .groupBy(billingFunnelEvents.paymentProvider),
    db
      .select({
        paymentProvider: billingOrders.paymentProvider,
        currency: billingOrders.currency,
        fxRateUsdToInr: billingOrders.fxRateUsdToInr,
      })
      .from(billingOrders)
      .where(and(...paidOrderConditions))
      .orderBy(desc(billingOrders.createdAt)),
    db
      .select({
        total: count(billingOrders.id),
      })
      .from(billingOrders)
      .where(and(...pendingOrderConditions)),
    db
      .select({
        total: count(billingOrders.id),
      })
      .from(billingOrders)
      .where(and(...actionRequiredConditions)),
  ])

  const counts = Object.fromEntries(
    groupedEvents.map((row) => [row.eventType, Number(row.total || 0)])
  )
  const providerCounts = groupedProviderEvents.reduce(
    (acc, row) => {
      if (row.paymentProvider === 'stripe') {
        acc.stripe += Number(row.total || 0)
      } else if (row.paymentProvider === 'razorpay') {
        acc.razorpay += Number(row.total || 0)
      } else {
        acc.unknown += Number(row.total || 0)
      }

      return acc
    },
    {
      razorpay: 0,
      stripe: 0,
      unknown: 0,
    }
  )

  const checkoutClicks = counts.checkout_click || 0
  const checkoutAuthRequired = counts.checkout_auth_required || 0
  const checkoutSessionsCreated = counts.checkout_session_created || 0
  const checkoutSessionsFailed = counts.checkout_session_failed || 0
  const checkoutFallbackPaymentLinks = counts.checkout_fallback_payment_link || 0
  const webhookPaid = counts.webhook_paid || 0
  const webhookPending = counts.webhook_pending || 0
  const webhookFailed = counts.webhook_failed || 0
  const webhookRefund = counts.webhook_refund || 0
  const webhookDuplicate = counts.webhook_duplicate || 0
  const webhookErrors = counts.webhook_error || 0
  // Include legacy portal events to keep one-release compatibility.
  const manageClicks = (counts.manage_click || 0) + (counts.portal_click || 0)
  const manageAuthRequired = (counts.manage_auth_required || 0) + (counts.portal_auth_required || 0)
  const manageSessionsCreated =
    (counts.manage_session_created || 0) + (counts.portal_session_created || 0)
  const manageSessionsFailed =
    (counts.manage_session_failed || 0) + (counts.portal_session_failed || 0)

  const checkoutConversionRate =
    checkoutSessionsCreated > 0 ? Number(((webhookPaid / checkoutSessionsCreated) * 100).toFixed(2)) : 0
  const checkoutFallbackRate =
    checkoutSessionsCreated > 0
      ? Number(((checkoutFallbackPaymentLinks / checkoutSessionsCreated) * 100).toFixed(2))
      : 0
  const manageSuccessRate =
    manageClicks > 0 ? Number(((manageSessionsCreated / manageClicks) * 100).toFixed(2)) : 0

  let razorpayPaidOrders = 0
  let stripePaidOrders = 0
  let usdPaidOrders = 0
  let inrPaidOrders = 0
  const fxRates: number[] = []
  let latestFxRate: number | null = null

  for (const order of paidOrders) {
    if (order.paymentProvider === 'razorpay') {
      razorpayPaidOrders += 1
    } else if (order.paymentProvider === 'stripe') {
      stripePaidOrders += 1
    }

    if (order.currency === 'USD') {
      usdPaidOrders += 1
    } else if (order.currency === 'INR') {
      inrPaidOrders += 1
      const rate = Number(order.fxRateUsdToInr)
      if (Number.isFinite(rate) && rate > 0) {
        fxRates.push(rate)
        if (latestFxRate === null) {
          latestFxRate = rate
        }
      }
    }
  }

  const avgFxRate =
    fxRates.length > 0 ? Number((fxRates.reduce((sum, rate) => sum + rate, 0) / fxRates.length).toFixed(4)) : null
  const pendingOrdersOlderThan30Minutes = Number(pendingStats[0]?.total || 0)
  const actionRequiredOrders = Number(actionRequiredStats[0]?.total || 0)

  return {
    range,
    checkoutClicks,
    checkoutAuthRequired,
    checkoutSessionsCreated,
    checkoutSessionsFailed,
    checkoutFallbackPaymentLinks,
    checkoutFallbackRate,
    webhookPaid,
    webhookPending,
    webhookFailed,
    webhookRefund,
    webhookDuplicate,
    webhookErrors,
    manageClicks,
    manageAuthRequired,
    manageSessionsCreated,
    manageSessionsFailed,
    checkoutConversionRate,
    manageSuccessRate,
    providerEventCounts: providerCounts,
    paidOrdersByProvider: {
      razorpay: razorpayPaidOrders,
      stripe: stripePaidOrders,
    },
    paidOrdersByCurrency: {
      usd: usdPaidOrders,
      inr: inrPaidOrders,
    },
    fxDiagnostics: {
      trackedOrders: fxRates.length,
      avgUsdToInrRate: avgFxRate,
      latestUsdToInrRate: latestFxRate,
    },
    pendingOrdersOlderThan30Minutes,
    actionRequiredOrders,
  }
}

export async function getBillingFunnelEventsFeed(params?: {
  range?: BillingFunnelRange
  eventType?: BillingFunnelEventType
  paymentProvider?: BillingProvider
  limit?: number
}): Promise<BillingFunnelEventFeedItem[]> {
  const range = params?.range || '7d'
  const limit = Math.min(Math.max(params?.limit || 50, 1), 200)
  const rangeStart = getBillingFunnelRangeStart(range)

  const conditions = [gte(billingFunnelEvents.createdAt, rangeStart)]
  if (params?.eventType) {
    conditions.push(eq(billingFunnelEvents.eventType, params.eventType))
  }
  if (params?.paymentProvider) {
    conditions.push(eq(billingFunnelEvents.paymentProvider, params.paymentProvider))
  }

  const rows = await db
    .select({
      id: billingFunnelEvents.id,
      eventType: billingFunnelEvents.eventType,
      eventSource: billingFunnelEvents.eventSource,
      userId: billingFunnelEvents.userId,
      orderId: billingFunnelEvents.orderId,
      paymentProvider: billingFunnelEvents.paymentProvider,
      catalogKey: billingFunnelEvents.catalogKey,
      currency: billingFunnelEvents.currency,
      providerOrderId: billingFunnelEvents.providerOrderId,
      providerPaymentId: billingFunnelEvents.providerPaymentId,
      stripeCheckoutSessionId: billingFunnelEvents.stripeCheckoutSessionId,
      status: billingFunnelEvents.status,
      errorCode: billingFunnelEvents.errorCode,
      errorMessage: billingFunnelEvents.errorMessage,
      metadata: billingFunnelEvents.metadata,
      createdAt: billingFunnelEvents.createdAt,
    })
    .from(billingFunnelEvents)
    .where(and(...conditions))
    .orderBy(desc(billingFunnelEvents.createdAt))
    .limit(limit)

  return rows.map((row) => ({
    id: row.id,
    eventType: row.eventType,
    eventSource: row.eventSource,
    userId: row.userId,
    orderId: row.orderId,
    paymentProvider: row.paymentProvider,
    catalogKey: row.catalogKey,
    currency: row.currency,
    providerOrderId: row.providerOrderId,
    providerPaymentId: row.providerPaymentId,
    stripeCheckoutSessionId: row.stripeCheckoutSessionId,
    status: row.status,
    errorCode: row.errorCode,
    errorMessage: row.errorMessage,
    metadata:
      row.metadata && typeof row.metadata === 'object' && !Array.isArray(row.metadata)
        ? (row.metadata as Record<string, unknown>)
        : null,
    createdAt: row.createdAt,
  }))
}

/**
 * Update user status (activate/deactivate)
 */
export async function updateUserStatus(userId: string, isActive: boolean, adminId: string): Promise<boolean> {
  const updated = await db
    .update(users)
    .set({ 
      isActive, 
      updatedAt: new Date() 
    })
    .where(eq(users.id, userId))
    .returning({ id: users.id })

  if (updated.length === 0) {
    throw new Error('User not found')
  }

  // Log admin action (best effort)
  await logAdminAction(adminId, 'user_status_update', {
    targetUserId: userId,
    newStatus: isActive ? 'active' : 'inactive'
  })

  return true
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
  await db.transaction(async (tx) => {
    const [updatedUser] = await tx
      .update(users)
      .set({
        credits: sql`${users.credits} + ${amount}`,
        totalCreditsEarned: sql`${users.totalCreditsEarned} + ${amount}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning({
        credits: users.credits
      })

    if (!updatedUser) {
      throw new Error('User not found')
    }

    const balanceAfter = updatedUser.credits
    const balanceBefore = balanceAfter - amount

    await tx.insert(creditTransactions).values({
      userId,
      type: 'bonus',
      amount,
      balanceBefore,
      balanceAfter,
      description: `Admin credit assignment: ${reason}`,
      metadata: { adminId, reason }
    })
  })

  // Log admin action (best effort)
  await logAdminAction(adminId, 'credit_assignment', {
    targetUserId: userId,
    amount,
    reason
  })

  return true
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
    try {
      const result = await assignCreditsToUser(userId, amount, adminId, reason)
      if (result) {
        success++
      } else {
        failed++
      }
    } catch (error) {
      console.error(`Bulk credit assignment failed for user ${userId}:`, error)
      failed++
    }
  }

  // Log bulk action (best effort)
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
  try {
    // For now, we'll create a simple credit transaction to track admin actions
    // In a full implementation, you might want a dedicated admin_audit_log table
    const [adminUser] = await db
      .select({ id: users.id, credits: users.credits })
      .from(users)
      .where(eq(users.id, adminId))
      .limit(1)

    if (!adminUser) {
      console.warn(`Skipping admin action log for missing admin user ${adminId}`)
      return
    }

    await createCreditTransaction({
      userId: adminId,
      type: 'bonus',
      amount: 0,
      balanceBefore: adminUser.credits,
      balanceAfter: adminUser.credits,
      description: `Admin action: ${action}`,
      metadata: { adminAction: true, action, details, timestamp: new Date() }
    })
  } catch (error) {
    console.warn('Failed to write admin action log:', error)
  }
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
      totalToolUsage: sql<number>`COALESCE(COUNT(DISTINCT ${toolUsage.id}), 0)`,
      totalAudits: sql<number>`COALESCE(COUNT(DISTINCT ${urlAccessibilityAudits.id}), 0)`,
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
