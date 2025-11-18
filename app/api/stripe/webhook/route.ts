import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { users, creditTransactions, payments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { constructWebhookEvent } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    // Get the raw body as text for signature verification
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('Missing stripe-signature header')
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify and construct the event
    let event: Stripe.Event
    try {
      event = constructWebhookEvent(body, signature)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('Processing checkout.session.completed:', session.id)

        // Extract metadata
        const userId = session.metadata?.userId
        const packageId = session.metadata?.packageId || 'dynamic'
        const credits = parseInt(session.metadata?.credits || '0')

        if (!userId || !credits) {
          console.error('Missing required metadata in session:', session.id)
          return NextResponse.json(
            { error: 'Missing metadata' },
            { status: 400 }
          )
        }

        // Get user's current balance
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1)

        if (!user) {
          console.error('User not found:', userId)
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          )
        }

        const balanceBefore = user.credits
        const balanceAfter = balanceBefore + credits

        // Create credit transaction
        const [transaction] = await db
          .insert(creditTransactions)
          .values({
            userId,
            type: 'purchase',
            amount: credits,
            balanceBefore,
            balanceAfter,
            description: `Purchased ${credits.toLocaleString()} credits`,
            status: 'completed',
            metadata: {
              sessionId: session.id,
              packageId,
              amountPaid: session.amount_total,
              currency: session.currency,
            },
          })
          .returning()

        // Update user's credit balance
        await db
          .update(users)
          .set({
            credits: balanceAfter,
            totalCreditsEarned: user.totalCreditsEarned + credits,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId))

        // Create payment record (packageId is now optional for dynamic pricing)
        await db.insert(payments).values({
          userId,
          packageId: null, // Dynamic pricing doesn't use fixed packages
          transactionId: transaction.id,
          paymentId: session.payment_intent as string,
          orderId: session.id,
          amount: session.amount_total || 0,
          currency: session.currency?.toUpperCase() || 'USD',
          status: 'completed',
          paymentMethod: session.payment_method_types?.[0] || 'card',
          paymentData: {
            customerEmail: session.customer_email,
            customerDetails: session.customer_details,
            paymentStatus: session.payment_status,
            credits,
            dynamicPricing: true,
          },
        })

        console.log('Successfully processed payment for user:', userId, 'Credits added:', credits)

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('Processing checkout.session.expired:', session.id)

        const userId = session.metadata?.userId

        if (userId) {
          // Mark payment as cancelled
          await db.insert(payments).values({
            userId,
            packageId: null,
            transactionId: null,
            paymentId: null,
            orderId: session.id,
            amount: session.amount_total || 0,
            currency: session.currency?.toUpperCase() || 'USD',
            status: 'cancelled',
            paymentMethod: null,
            paymentData: {
              reason: 'session_expired',
            },
          })

          console.log('Marked expired session as cancelled:', session.id)
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        console.log('Processing payment_intent.payment_failed:', paymentIntent.id)

        // Find the payment record and mark as failed
        // Note: This might not have a payment record yet if it failed before completion
        // We'll log it for now
        console.log('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message)

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    
    return NextResponse.json(
      { 
        error: 'Webhook handler failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Disable body parsing for webhooks - we need the raw body for signature verification
export const runtime = 'nodejs'

