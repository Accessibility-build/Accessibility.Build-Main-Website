import Stripe from 'stripe'

// Initialize Stripe instance with secret key (will throw on actual use if not set)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// Helper to check if Stripe is configured
export function isStripeConfigured(): boolean {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
}

/**
 * Creates a Stripe checkout session for one-time credit package purchase
 */
export async function createCheckoutSession({
  packageId,
  packageName,
  credits,
  amount,
  currency = 'usd',
  userId,
  userEmail,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  packageId: string
  packageName: string
  credits: number
  amount: number
  currency?: string
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}): Promise<Stripe.Checkout.Session> {
  try {
    // Merge default metadata with provided metadata
    const sessionMetadata = {
      userId,
      packageId,
      credits: credits.toString(),
      ...metadata, // Enhanced metadata from caller
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: packageName,
              description: `${credits.toLocaleString()} credits for Accessibility.build - Never expires`,
              images: ['https://accessibility.build/logo.png'],
              metadata: sessionMetadata, // Add metadata to product as well
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: sessionMetadata, // Session-level metadata for Stripe dashboard
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      payment_intent_data: {
        metadata: sessionMetadata, // Payment intent metadata for Stripe dashboard
      },
    })

    return session
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
}

/**
 * Retrieves a checkout session by ID
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer'],
    })
    return session
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    throw new Error('Failed to retrieve checkout session')
  }
}

/**
 * Retrieves or creates a Stripe customer for a user
 */
export async function getOrCreateCustomer({
  userId,
  email,
  name,
}: {
  userId: string
  email: string
  name?: string
}): Promise<Stripe.Customer> {
  try {
    // Search for existing customer
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0]
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    })

    return customer
  } catch (error) {
    console.error('Error getting or creating Stripe customer:', error)
    throw new Error('Failed to get or create customer')
  }
}

/**
 * Retrieves a payment intent by ID
 */
export async function getPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    throw new Error('Failed to retrieve payment intent')
  }
}

/**
 * Constructs a webhook event from the raw body and signature
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined')
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (error) {
    console.error('Error constructing webhook event:', error)
    throw new Error('Invalid webhook signature')
  }
}

/**
 * Formats amount from cents to dollars
 */
export function formatAmount(amountInCents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amountInCents / 100)
}

/**
 * Converts dollars to cents
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100)
}

