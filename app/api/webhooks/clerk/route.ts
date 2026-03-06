import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { z } from 'zod'
import { db } from '@/lib/db'
import { users, creditTransactions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { errorLogger } from '@/lib/error-logger'
import { sendWelcomeEmail, sendServicesIntroEmail } from '@/lib/email/service'

export const runtime = 'nodejs'

const DEFAULT_CREDITS = 100

const webhookEventSchema = z.object({
  type: z.string().min(1),
  data: z.object({ id: z.string().min(1) }).passthrough(),
})

const clerkUserSchema = z.object({
  id: z.string().min(1),
  email_addresses: z.array(
    z.object({
      email_address: z.string(),
      id: z.string().optional(),
    })
  ).default([]),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  created_at: z.number().optional(),
  updated_at: z.number().optional(),
})

type ClerkUserData = z.infer<typeof clerkUserSchema>

function getWebhookSecret() {
  const secret = process.env.CLERK_WEBHOOK_SECRET?.trim()
  return secret || null
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

function parseClerkDate(timestamp: number | undefined, fallback: Date = new Date()) {
  if (!timestamp || !Number.isFinite(timestamp)) {
    return fallback
  }

  // Clerk usually sends milliseconds, but support seconds defensively.
  const normalized = timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp
  const parsed = new Date(normalized)
  return Number.isNaN(parsed.getTime()) ? fallback : parsed
}

function getDefaultCredits() {
  const parsed = Number.parseInt(process.env.DEFAULT_CREDITS || String(DEFAULT_CREDITS), 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_CREDITS
}

function isUniqueViolation(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = String((error as { code?: string }).code || '')
    if (code === '23505') {
      return true
    }
  }

  if (error instanceof Error) {
    const lower = error.message.toLowerCase()
    return lower.includes('duplicate key') || lower.includes('unique constraint')
  }

  return false
}

async function syncUserIdentity(params: {
  userId: string
  safeEmail: string
  firstName: string | null
  lastName: string | null
  profileImageUrl: string | null
  updatedAt: Date
  activateUser?: boolean
}) {
  const emailOwner = await db.query.users.findFirst({
    where: eq(users.email, params.safeEmail),
  })

  const emailConflictUserId =
    emailOwner && emailOwner.id !== params.userId ? emailOwner.id : null

  const updatePayload: {
    firstName: string | null
    lastName: string | null
    profileImageUrl: string | null
    updatedAt: Date
    isActive?: boolean
    email?: string
  } = {
    firstName: params.firstName,
    lastName: params.lastName,
    profileImageUrl: params.profileImageUrl,
    updatedAt: params.updatedAt,
  }

  if (params.activateUser) {
    updatePayload.isActive = true
  }

  if (!emailConflictUserId) {
    updatePayload.email = params.safeEmail
  }

  const updated = await db
    .update(users)
    .set(updatePayload)
    .where(eq(users.id, params.userId))
    .returning({ id: users.id })

  return {
    updated: updated.length > 0,
    emailConflictUserId,
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = getWebhookSecret()

  try {
    if (!webhookSecret) {
      console.error('CLERK_WEBHOOK_SECRET is not set')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Get headers
    const svixId = req.headers.get('svix-id')
    const svixTimestamp = req.headers.get('svix-timestamp')
    const svixSignature = req.headers.get('svix-signature')

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('Missing svix headers')
      return NextResponse.json(
        { error: 'Missing svix headers' },
        { status: 400 }
      )
    }

    // Get the body
    const payload = await req.text()

    // Verify the webhook
    const wh = new Webhook(webhookSecret)
    let evt: unknown

    try {
      evt = wh.verify(payload, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      })
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      )
    }

    const parsedEvent = webhookEventSchema.safeParse(evt)
    if (!parsedEvent.success) {
      console.error('[clerk:webhook] Invalid event payload shape', parsedEvent.error.flatten())
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      )
    }

    const { type, data } = parsedEvent.data
    console.log(`[clerk:webhook] Processing ${type} for user ${data.id} (event ${svixId})`)

    switch (type) {
      case 'user.created': {
        const parsedUser = clerkUserSchema.safeParse(data)
        if (!parsedUser.success) {
          return NextResponse.json(
            { error: 'Invalid user.created payload' },
            { status: 400 }
          )
        }
        await handleUserCreated(parsedUser.data)
        break
      }
      case 'user.updated': {
        const parsedUser = clerkUserSchema.safeParse(data)
        if (!parsedUser.success) {
          return NextResponse.json(
            { error: 'Invalid user.updated payload' },
            { status: 400 }
          )
        }
        await handleUserUpdated(parsedUser.data)
        break
      }
      case 'user.deleted':
        await handleUserDeleted(data.id)
        break
      default:
        console.log(`[clerk:webhook] Ignoring unhandled event type: ${type}`)
    }

    return NextResponse.json({ received: true, eventType: type, eventId: svixId })

  } catch (error) {
    console.error('Webhook processing error:', error)
    
    errorLogger.logMajorError('Clerk webhook processing failed', {
      component: 'clerk-webhook',
      error: error instanceof Error ? error : new Error(String(error)),
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleUserCreated(userData: ClerkUserData) {
  try {
    const defaultCredits = getDefaultCredits()
    const safeEmail = sanitizeEmail(userData.email_addresses[0]?.email_address, userData.id)
    const createdAt = parseClerkDate(userData.created_at)
    const updatedAt = parseClerkDate(userData.updated_at, createdAt)
    
    // Check if user already exists (shouldn't happen, but safety check)
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userData.id)
    })

    if (existingUser) {
      await syncUserIdentity({
        userId: userData.id,
        safeEmail,
        firstName: userData.first_name ?? null,
        lastName: userData.last_name ?? null,
        profileImageUrl: userData.image_url ?? null,
        updatedAt,
        activateUser: true,
      })
      console.log(`[clerk:webhook] user.created received for existing user ${userData.id}; synced profile`)
      return
    }

    // Recovery path for users that already exist with the same email but older/different Clerk IDs.
    const existingByEmail = await db.query.users.findFirst({
      where: eq(users.email, safeEmail),
    })

    if (existingByEmail) {
      console.log(
        `User email ${safeEmail} already exists under ${existingByEmail.id}; skipping duplicate insert for ${userData.id}`
      )

      await db
        .update(users)
        .set({
          firstName: userData.first_name ?? null,
          lastName: userData.last_name ?? null,
          profileImageUrl: userData.image_url ?? null,
          isActive: true,
          updatedAt,
        })
        .where(eq(users.id, existingByEmail.id))

      return
    }

    // Create new user with free credits
    const newUser = {
      id: userData.id,
      email: safeEmail,
      firstName: userData.first_name ?? null,
      lastName: userData.last_name ?? null,
      profileImageUrl: userData.image_url ?? null,
      credits: defaultCredits,
      totalCreditsEarned: defaultCredits,
      totalCreditsUsed: 0,
      createdAt,
      updatedAt,
      isActive: true,
    }

    console.log(`Creating new user: ${userData.id} with ${defaultCredits} credits`)

    await db.transaction(async (tx) => {
      await tx.insert(users).values(newUser)

      // Create welcome bonus transaction
      await tx.insert(creditTransactions).values({
        userId: userData.id,
        type: 'bonus',
        amount: defaultCredits,
        balanceBefore: 0,
        balanceAfter: defaultCredits,
        description: `Welcome bonus - ${defaultCredits} free credits for new users!`,
        status: 'completed',
      })
    })

    // Send welcome email (fire-and-forget — never blocks webhook response)
    sendWelcomeEmail({
      type: 'welcome',
      recipient: {
        email: safeEmail,
        firstName: userData.first_name ?? null,
        lastName: userData.last_name ?? null,
      },
      credits: defaultCredits,
    })

    // Send services intro email (fire-and-forget — second email after signup)
    sendServicesIntroEmail({
      type: 'services_intro',
      recipient: {
        email: safeEmail,
        firstName: userData.first_name ?? null,
        lastName: userData.last_name ?? null,
      },
    })

    console.log(`Successfully created user ${userData.id} with ${defaultCredits} credits`)

  } catch (error) {
    if (isUniqueViolation(error)) {
      console.warn(`[clerk:webhook] Duplicate create ignored for ${userData.id}`)
      return
    }

    console.error(`Error creating user ${userData.id}:`, error)
    
    errorLogger.logMajorError('Failed to create user from webhook', {
      component: 'clerk-webhook-user-created',
      userId: userData.id,
      error: error instanceof Error ? error : new Error(String(error)),
    })
    
    throw error
  }
}

async function handleUserUpdated(userData: ClerkUserData) {
  try {
    console.log(`Updating user: ${userData.id}`)
    const safeEmail = sanitizeEmail(userData.email_addresses[0]?.email_address, userData.id)
    const updatedAt = parseClerkDate(userData.updated_at)

    const syncResult = await syncUserIdentity({
      userId: userData.id,
      safeEmail,
      firstName: userData.first_name ?? null,
      lastName: userData.last_name ?? null,
      profileImageUrl: userData.image_url ?? null,
      updatedAt,
      activateUser: true,
    })

    if (!syncResult.updated) {
      console.warn(`[clerk:webhook] user.updated for missing user ${userData.id}; creating record`)
      await handleUserCreated(userData)
      return
    }

    if (syncResult.emailConflictUserId) {
      console.warn(
        `[clerk:webhook] Email ${safeEmail} belongs to ${syncResult.emailConflictUserId}; updated profile only for ${userData.id}`
      )
    }

    console.log(`Successfully updated user ${userData.id}`)

  } catch (error) {
    console.error(`Error updating user ${userData.id}:`, error)
    
    errorLogger.logMajorError('Failed to update user from webhook', {
      component: 'clerk-webhook-user-updated',
      userId: userData.id,
      error: error instanceof Error ? error : new Error(String(error)),
    })
  }
}

async function handleUserDeleted(userId: string) {
  try {
    console.log(`Deleting user: ${userId}`)

    // Soft delete by setting isActive to false (preserves data for analytics)
    await db
      .update(users)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({ id: users.id })

    console.log(`Successfully soft-deleted user ${userId}`)

  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error)
    
    errorLogger.logMajorError('Failed to delete user from webhook', {
      component: 'clerk-webhook-user-deleted',
      userId: userId,
      error: error instanceof Error ? error : new Error(String(error)),
    })
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    message: 'Clerk webhook endpoint is operational',
    timestamp: new Date().toISOString()
  })
} 
