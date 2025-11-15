import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { db } from '@/lib/db'
import { users, creditTransactions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { errorLogger } from '@/lib/error-logger'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

interface ClerkWebhookEvent {
  type: string
  data: {
    id: string
    email_addresses: Array<{
      email_address: string
      id: string
    }>
    first_name: string | null
    last_name: string | null
    image_url: string
    created_at: number
    updated_at: number
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!webhookSecret) {
      console.error('CLERK_WEBHOOK_SECRET is not set')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Get headers
    const headerPayload = await headers()
    const svixId = headerPayload.get('svix-id')
    const svixTimestamp = headerPayload.get('svix-timestamp')
    const svixSignature = headerPayload.get('svix-signature')

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
    let evt: ClerkWebhookEvent

    try {
      evt = wh.verify(payload, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as ClerkWebhookEvent
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      )
    }

    // Handle the webhook event
    const { type, data } = evt

    console.log(`Processing Clerk webhook: ${type} for user ${data.id}`)

    switch (type) {
      case 'user.created':
        await handleUserCreated(data)
        break
      
      case 'user.updated':
        await handleUserUpdated(data)
        break
      
      case 'user.deleted':
        await handleUserDeleted(data.id)
        break
      
      default:
        console.log(`Unhandled webhook event type: ${type}`)
    }

    return NextResponse.json({ received: true })

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

async function handleUserCreated(userData: ClerkWebhookEvent['data']) {
  try {
    const defaultCredits = Number(process.env.DEFAULT_CREDITS) || 100
    
    // Check if user already exists (shouldn't happen, but safety check)
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userData.id)
    })

    if (existingUser) {
      console.log(`User ${userData.id} already exists in database`)
      return
    }

    // Create new user with free credits
    const newUser = {
      id: userData.id,
      email: userData.email_addresses[0]?.email_address || '',
      firstName: userData.first_name,
      lastName: userData.last_name,
      profileImageUrl: userData.image_url,
      credits: defaultCredits,
      totalCreditsEarned: defaultCredits,
      totalCreditsUsed: 0,
      createdAt: new Date(userData.created_at),
      updatedAt: new Date(userData.updated_at),
    }

    console.log(`Creating new user: ${userData.id} with ${defaultCredits} credits`)

    const [insertedUser] = await db.insert(users).values(newUser).returning()
    
    // Create welcome bonus transaction
    await db.insert(creditTransactions).values({
      userId: userData.id,
      type: 'bonus',
      amount: defaultCredits,
      balanceBefore: 0,
      balanceAfter: defaultCredits,
      description: `Welcome bonus - ${defaultCredits} free credits for new users!`,
      status: 'completed',
    })

    console.log(`Successfully created user ${userData.id} with ${defaultCredits} credits`)

  } catch (error) {
    console.error(`Error creating user ${userData.id}:`, error)
    
    errorLogger.logMajorError('Failed to create user from webhook', {
      component: 'clerk-webhook-user-created',
      userId: userData.id,
      error: error instanceof Error ? error : new Error(String(error)),
    })
    
    throw error
  }
}

async function handleUserUpdated(userData: ClerkWebhookEvent['data']) {
  try {
    console.log(`Updating user: ${userData.id}`)

    // Update user data (but don't touch credits)
    await db
      .update(users)
      .set({
        email: userData.email_addresses[0]?.email_address || '',
        firstName: userData.first_name,
        lastName: userData.last_name,
        profileImageUrl: userData.image_url,
        updatedAt: new Date(userData.updated_at),
      })
      .where(eq(users.id, userData.id))

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