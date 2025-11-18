import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { getCheckoutSession } from '@/lib/stripe'

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    // Get session_id from query params
    const searchParams = req.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the session from Stripe
    const session = await getCheckoutSession(sessionId)

    // Verify the session belongs to the current user
    if (session.client_reference_id !== user.id && session.metadata?.userId !== user.id) {
      return NextResponse.json(
        { error: 'This session does not belong to you' },
        { status: 403 }
      )
    }

    // Extract relevant information
    const response = {
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_email,
      metadata: session.metadata,
      created: session.created,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Session verification error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to verify session. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

