import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { createCheckoutSession } from '@/lib/stripe'
import { calculatePrice, validateCredits, toCents, formatCredits } from '@/lib/pricing'

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to purchase credits.' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { credits } = body

    if (!credits || typeof credits !== 'number') {
      return NextResponse.json(
        { error: 'Credit amount is required and must be a number' },
        { status: 400 }
      )
    }

    // Validate credit amount
    const validation = validateCredits(credits)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Calculate pricing
    const pricing = calculatePrice(credits)

    // Get the base URL for redirect
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin') || 'http://localhost:3000'

    // Create comprehensive metadata for Stripe dashboard
    const metadata = {
      // User Information
      userId: user.id,
      userEmail: user.emailAddresses[0]?.emailAddress || '',
      userName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      
      // Purchase Details
      credits: pricing.credits.toString(),
      creditsFormatted: formatCredits(pricing.credits),
      
      // Pricing Breakdown
      pricePerCredit: pricing.pricePerCredit.toFixed(4),
      subtotal: pricing.subtotal.toFixed(2),
      discountPercent: pricing.discount.toString(),
      discountAmount: pricing.savings.toFixed(2),
      totalAmount: pricing.total.toFixed(2),
      pricingTier: pricing.tier.label,
      
      // Package Info
      packageType: 'dynamic',
      packageName: `${formatCredits(pricing.credits)} Credits`,
      
      // Timestamps
      purchaseDate: new Date().toISOString(),
      purchaseTimestamp: Date.now().toString(),
    }

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      packageId: 'dynamic',
      packageName: `${formatCredits(pricing.credits)} Credits`,
      credits: pricing.credits,
      amount: toCents(pricing.total),
      currency: 'usd',
      userId: user.id,
      userEmail: user.emailAddresses[0]?.emailAddress || '',
      successUrl: `${baseUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/pricing?canceled=true`,
      metadata, // Pass enhanced metadata
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Checkout session creation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

