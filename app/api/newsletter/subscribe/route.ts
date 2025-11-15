import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { emailSubscriptions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  source: z.enum(['footer', 'blog', 'other']).default('footer'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validation = subscribeSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error.errors[0].message 
        },
        { status: 400 }
      )
    }

    const { email, source } = validation.data

    // Check if email already exists
    const existingSubscription = await db
      .select()
      .from(emailSubscriptions)
      .where(eq(emailSubscriptions.email, email))
      .limit(1)

    if (existingSubscription.length > 0) {
      const subscription = existingSubscription[0]
      
      // If already subscribed and active
      if (subscription.isActive) {
        return NextResponse.json({
          success: true,
          message: 'You are already subscribed to our newsletter!',
          alreadySubscribed: true
        })
      }
      
      // If previously unsubscribed, reactivate
      await db
        .update(emailSubscriptions)
        .set({ 
          isActive: true, 
          subscribedAt: new Date(),
          unsubscribedAt: null,
          source
        })
        .where(eq(emailSubscriptions.email, email))

      return NextResponse.json({
        success: true,
        message: 'Welcome back! You have been resubscribed to our newsletter.',
        resubscribed: true
      })
    }

    // Create new subscription
    await db.insert(emailSubscriptions).values({
      email,
      source,
      metadata: {
        userAgent: request.headers.get('user-agent'),
        referrer: request.headers.get('referer'),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        subscribedAt: new Date().toISOString()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! You will receive the latest accessibility insights, WCAG updates, and tool announcements.',
      newSubscription: true
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    
    // Handle unique constraint violation (email already exists)
    if (error instanceof Error && error.message.includes('unique constraint')) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to our newsletter!',
        alreadySubscribed: true
      })
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to subscribe to newsletter. Please try again.' 
      },
      { status: 500 }
    )
  }
}
