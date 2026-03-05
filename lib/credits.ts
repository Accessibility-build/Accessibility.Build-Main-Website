import { db } from './db'
import { users, creditTransactions, toolUsage, type NewCreditTransaction, type NewToolUsage } from './db/schema'
import { and, desc, eq, gte, sql } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'

export const TOOL_CREDITS = {
  alt_text_generator: 1,
  contrast_checker: 0, // Free tool
  accessibility_checker: 2,
  accessibility_audit_helper: 1,
  url_accessibility_auditor: 5,
  accessibility_code_generator: 2,
  heading_analyzer: 0, // Free tool
  color_palette_generator: 0, // Free tool
  mobile_accessibility_checker: 2,
  password_generator: 0, // Free tool
  json_formatter: 0, // Free tool
} as const

export type ToolType = keyof typeof TOOL_CREDITS

type ClerkUserBootstrapInput = {
  userId: string
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  profileImageUrl?: string | null
}

function buildFallbackEmail(userId: string) {
  const sanitized = userId.toLowerCase().replace(/[^a-z0-9]/g, '')
  const suffix = sanitized || 'unknown'
  return `clerk-${suffix}@users.accessibility.build`
}

function sanitizeEmail(email: string | null | undefined, userId: string) {
  const trimmed = typeof email === 'string' ? email.trim().toLowerCase() : ''
  return trimmed || buildFallbackEmail(userId)
}

async function createBootstrapUser(input: ClerkUserBootstrapInput) {
  const defaultCredits = Number(process.env.DEFAULT_CREDITS) || 100
  const safeEmail = sanitizeEmail(input.email, input.userId)

  const [insertedUser] = await db
    .insert(users)
    .values({
      id: input.userId,
      email: safeEmail,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      profileImageUrl: input.profileImageUrl ?? null,
      credits: defaultCredits,
      totalCreditsEarned: defaultCredits,
      metadata: {
        source: 'clerk_bootstrap',
        syntheticEmail: safeEmail === buildFallbackEmail(input.userId),
      },
    })
    .returning()

  await createCreditTransaction({
    userId: input.userId,
    type: 'bonus',
    amount: defaultCredits,
    balanceBefore: 0,
    balanceAfter: defaultCredits,
    description: 'Welcome bonus - Free credits for new users (fallback)',
  })

  return insertedUser
}

export async function getOrCreateUserByClerkId(input: ClerkUserBootstrapInput) {
  const safeEmail = sanitizeEmail(input.email, input.userId)
  const existing = await db.query.users.findFirst({
    where: eq(users.id, input.userId),
  })

  if (existing) {
    return existing
  }

  // Recovery path for legacy rows where email exists under a different Clerk ID.
  const existingByEmail = await db.query.users.findFirst({
    where: eq(users.email, safeEmail),
  })

  if (existingByEmail) {
    console.warn(
      `Found existing user by email ${safeEmail} for Clerk ID ${input.userId}; reusing ${existingByEmail.id}`
    )
    return existingByEmail
  }

  console.log(`User ${input.userId} not found in database, creating minimal record`)

  try {
    return await createBootstrapUser(input)
  } catch (error) {
    // Handle race condition where another request created the user after our first read.
    const fallback = await db.query.users.findFirst({
      where: eq(users.id, input.userId),
    })

    if (fallback) {
      return fallback
    }

    const fallbackByEmail = await db.query.users.findFirst({
      where: eq(users.email, safeEmail),
    })

    if (fallbackByEmail) {
      return fallbackByEmail
    }

    throw error
  }
}

/**
 * Get user from database (webhook handles creation)
 */
export async function getUser() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    throw new Error('User not authenticated')
  }

  return getOrCreateUserByClerkId({
    userId: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || null,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    profileImageUrl: clerkUser.imageUrl,
  })
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

  if (!user.isActive) {
    throw new Error('Account is inactive. Please contact support to restore access.')
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
  const { balanceAfter } = await db.transaction(async (tx) => {
    const [updatedUser] = await tx
      .update(users)
      .set({
        credits: sql`${users.credits} - ${requiredCredits}`,
        totalCreditsUsed: sql`${users.totalCreditsUsed} + ${requiredCredits}`,
        updatedAt: new Date()
      })
      .where(and(eq(users.id, user.id), gte(users.credits, requiredCredits)))
      .returning({
        credits: users.credits
      })

    if (!updatedUser) {
      throw new Error(`Insufficient credits. Required: ${requiredCredits}, Available: ${user.credits}`)
    }

    const balanceAfter = updatedUser.credits
    const balanceBefore = balanceAfter + requiredCredits

    await tx.insert(creditTransactions).values({
      userId: user.id,
      type: 'usage',
      amount: -requiredCredits,
      balanceBefore,
      balanceAfter,
      description: `Used ${requiredCredits} credit${requiredCredits > 1 ? 's' : ''} for ${tool.replace(/_/g, ' ')}`,
      toolUsed: tool,
    })

    await tx.insert(toolUsage).values({
      userId: user.id,
      tool,
      creditsUsed: requiredCredits,
      inputData,
      outputData,
      success: true,
    })

    return { balanceAfter }
  })

  return {
    success: true,
    creditsUsed: requiredCredits,
    remainingCredits: balanceAfter
  }
}

/**
 * Add credits to user account
 */
export async function addCredits(
  userId: string,
  amount: number,
  description: string,
  type: 'purchase' | 'bonus' | 'refund' = 'purchase',
  metadata?: Record<string, any>
) {
  const { newBalance } = await db.transaction(async (tx) => {
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

    const newBalance = updatedUser.credits
    const balanceBefore = newBalance - amount

    await tx.insert(creditTransactions).values({
      userId,
      type,
      amount,
      balanceBefore,
      balanceAfter: newBalance,
      description,
      metadata
    })

    return { newBalance }
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
