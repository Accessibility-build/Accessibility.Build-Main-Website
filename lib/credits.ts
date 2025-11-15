import { db } from './db'
import { users, creditTransactions, toolUsage, type NewCreditTransaction, type NewToolUsage } from './db/schema'
import { eq, desc } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'

export const TOOL_CREDITS = {
  alt_text_generator: 1,
  contrast_checker: 0, // Free tool
  accessibility_checker: 2,
  accessibility_audit_helper: 2,
  url_accessibility_auditor: 5,
  accessibility_code_generator: 2,
  heading_analyzer: 0, // Free tool
  color_palette_generator: 0, // Free tool
  mobile_accessibility_checker: 2,
  password_generator: 0, // Free tool
  json_formatter: 0, // Free tool
} as const

export type ToolType = keyof typeof TOOL_CREDITS

/**
 * Get user from database (webhook handles creation)
 */
export async function getUser() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    throw new Error('User not authenticated')
  }

  // Find existing user (should exist via webhook)
  const user = await db.query.users.findFirst({
    where: eq(users.id, clerkUser.id)
  })

  // If user doesn't exist, it means webhook hasn't processed yet
  // Create minimal user record as fallback
  if (!user) {
    console.log(`User ${clerkUser.id} not found in database, creating minimal record`)
    
    const defaultCredits = Number(process.env.DEFAULT_CREDITS) || 100
    const newUser = {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      profileImageUrl: clerkUser.imageUrl,
      credits: defaultCredits,
      totalCreditsEarned: defaultCredits,
    }

    const [insertedUser] = await db.insert(users).values(newUser).returning()
    
    // Create welcome bonus transaction
    await createCreditTransaction({
      userId: clerkUser.id,
      type: 'bonus',
      amount: defaultCredits,
      balanceBefore: 0,
      balanceAfter: defaultCredits,
      description: 'Welcome bonus - Free credits for new users (fallback)',
    })

    return insertedUser
  }

  return user
}

/**
 * Get user's current credit balance
 */
export async function getUserCredits(userId?: string) {
  if (!userId) {
    const user = await getUser()
    return user.credits
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })

  return user?.credits || 0
}

/**
 * Check if user has enough credits for a tool
 */
export async function hasEnoughCredits(tool: ToolType, userId?: string) {
  const requiredCredits = TOOL_CREDITS[tool]
  const userCredits = await getUserCredits(userId)
  
  return userCredits >= requiredCredits
}

/**
 * Create a credit transaction
 */
export async function createCreditTransaction(transaction: NewCreditTransaction) {
  const [newTransaction] = await db.insert(creditTransactions).values(transaction).returning()
  return newTransaction
}

/**
 * Use credits for a tool
 */
export async function useCredits(
  tool: ToolType,
  inputData: any,
  outputData?: any,
  userId?: string
) {
  const user = userId ? 
    await db.query.users.findFirst({ where: eq(users.id, userId) }) :
    await getUser()

  if (!user) {
    throw new Error('User not found')
  }

  const requiredCredits = TOOL_CREDITS[tool]
  
  // Check if tool is free
  if (requiredCredits === 0) {
    // Log usage even for free tools
    await logToolUsage({
      userId: user.id,
      tool,
      creditsUsed: 0,
      inputData,
      outputData,
      success: true,
    })
    return { success: true, creditsUsed: 0, remainingCredits: user.credits }
  }

  // Check if user has enough credits
  if (user.credits < requiredCredits) {
    throw new Error(`Insufficient credits. Required: ${requiredCredits}, Available: ${user.credits}`)
  }

  const newBalance = user.credits - requiredCredits

  // Update user credits
  await db
    .update(users)
    .set({ 
      credits: newBalance,
      totalCreditsUsed: user.totalCreditsUsed + requiredCredits,
      updatedAt: new Date()
    })
    .where(eq(users.id, user.id))

  // Create transaction record
  await createCreditTransaction({
    userId: user.id,
    type: 'usage',
    amount: -requiredCredits,
    balanceBefore: user.credits,
    balanceAfter: newBalance,
    description: `Used ${requiredCredits} credit${requiredCredits > 1 ? 's' : ''} for ${tool.replace('_', ' ')}`,
    toolUsed: tool,
  })

  // Log tool usage
  await logToolUsage({
    userId: user.id,
    tool,
    creditsUsed: requiredCredits,
    inputData,
    outputData,
    success: true,
  })

  return {
    success: true,
    creditsUsed: requiredCredits,
    remainingCredits: newBalance
  }
}

/**
 * Add credits to user account
 */
export async function addCredits(
  userId: string,
  amount: number,
  description: string,
  type: 'purchase' | 'bonus' | 'refund' = 'purchase'
) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })

  if (!user) {
    throw new Error('User not found')
  }

  const newBalance = user.credits + amount

  // Update user credits
  await db
    .update(users)
    .set({ 
      credits: newBalance,
      totalCreditsEarned: user.totalCreditsEarned + amount,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId))

  // Create transaction record
  await createCreditTransaction({
    userId,
    type,
    amount,
    balanceBefore: user.credits,
    balanceAfter: newBalance,
    description,
  })

  return {
    success: true,
    creditsAdded: amount,
    newBalance
  }
}

/**
 * Log tool usage
 */
export async function logToolUsage(usage: NewToolUsage) {
  const [newUsage] = await db.insert(toolUsage).values(usage).returning()
  return newUsage
}

/**
 * Get user's credit transaction history
 */
export async function getCreditHistory(userId: string, limit = 50) {
  return await db.query.creditTransactions.findMany({
    where: eq(creditTransactions.userId, userId),
    orderBy: desc(creditTransactions.createdAt),
    limit
  })
}

/**
 * Get user's tool usage history
 */
export async function getToolUsageHistory(userId: string, limit = 50) {
  return await db.query.toolUsage.findMany({
    where: eq(toolUsage.userId, userId),
    orderBy: desc(toolUsage.createdAt),
    limit
  })
}

/**
 * Get user stats for dashboard
 */
export async function getUserStats(userId?: string) {
  const user = userId ? 
    await db.query.users.findFirst({ where: eq(users.id, userId) }) :
    await getUser()

  if (!user) {
    throw new Error('User not found')
  }

  const recentTransactions = await getCreditHistory(user.id, 10)
  const recentUsage = await getToolUsageHistory(user.id, 10)

  return {
    currentCredits: user.credits,
    totalCreditsEarned: user.totalCreditsEarned,
    totalCreditsUsed: user.totalCreditsUsed,
    recentTransactions,
    recentUsage,
    user
  }
} 