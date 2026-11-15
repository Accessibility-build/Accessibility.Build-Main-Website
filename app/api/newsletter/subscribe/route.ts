import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { emailSubscriptions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { sendNewsletterConfirmEmail } from '@/lib/email/service'
import { getPostHogClient } from '@/lib/posthog-server'
import { createRateLimit } from '@/lib/rate-limit'
import { SITE_URL } from '@/lib/reports'
import {
  CONFIRM_RESEND_COOLDOWN_MS,
  checkFormToken,
  createConfirmToken,
  getClientIp,
  isScriptedUserAgent,
  issueFormToken,
} from '@/lib/newsletter/guard'

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  source: z.enum(['footer', 'blog', 'other']).default('footer'),
  formToken: z.string().optional(),
  // Honeypot: hidden from people and assistive tech, so only bots fill it in.
  website: z.string().optional(),
})

// Per-IP limit on top of the per-address cooldown. In-memory, so it is per
// server instance; the per-address cooldown in the database is the real cap.
const subscribeRateLimit = createRateLimit({
  max: 5,
  windowMs: 60 * 60 * 1000,
  message: 'Too many signup attempts. Please try again later.',
  keyGenerator: (req) => `newsletter:${getClientIp(req)}`,
})

const CHECK_INBOX_MESSAGE =
  'Check your inbox: we have sent a link to confirm your subscription. If you are already subscribed, there is nothing more to do.'

/** Same response a real signup gets, so bots learn nothing from being dropped. */
function checkInboxResponse() {
  return NextResponse.json({ success: true, message: CHECK_INBOX_MESSAGE, pendingConfirmation: true })
}

function noStore(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store')
  return response
}

/** The signup form fetches a token first; posts without a valid one are refused. */
export async function GET(request: NextRequest) {
  return noStore(NextResponse.json({ token: issueFormToken(getClientIp(request)) }))
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const userAgent = request.headers.get('user-agent')

  try {
    const limited = await subscribeRateLimit(request)
    if (limited) return limited

    const body = await request.json().catch(() => null)
    const validation = subscribeSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0]?.message || 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    const { email, source, formToken, website } = validation.data

    if (website || isScriptedUserAgent(userAgent)) {
      console.warn('[newsletter] Dropped bot signup', JSON.stringify({ ip, reason: website ? 'honeypot' : 'user_agent' }))
      return checkInboxResponse()
    }

    const tokenCheck = checkFormToken(formToken, ip)
    if (tokenCheck !== 'ok') {
      console.warn('[newsletter] Rejected signup without a valid form token', JSON.stringify({ ip, tokenCheck }))
      return NextResponse.json(
        { success: false, error: 'Please reload the page and try again.' },
        { status: 400 }
      )
    }

    const [existing] = await db
      .select()
      .from(emailSubscriptions)
      .where(eq(emailSubscriptions.email, email))
      .limit(1)

    if (existing?.isActive) return checkInboxResponse()

    const previous = (existing?.metadata ?? {}) as Record<string, unknown>
    const lastSent = typeof previous.confirmSentAt === 'string' ? Date.parse(previous.confirmSentAt) : NaN
    if (Number.isFinite(lastSent) && Date.now() - lastSent < CONFIRM_RESEND_COOLDOWN_MS) {
      // One confirmation email per address per day, however many times it is submitted.
      return checkInboxResponse()
    }

    const { token, tokenHash } = createConfirmToken()
    const now = new Date()
    const requestMeta = {
      userAgent,
      referrer: request.headers.get('referer'),
      ipAddress: ip,
    }

    if (existing) {
      await db
        .update(emailSubscriptions)
        .set({
          source,
          metadata: {
            ...previous,
            ...requestMeta,
            confirmTokenHash: tokenHash,
            confirmSentAt: now.toISOString(),
          },
        })
        .where(eq(emailSubscriptions.email, email))
    } else {
      await db.insert(emailSubscriptions).values({
        email,
        source,
        isActive: false,
        metadata: {
          ...requestMeta,
          requestedAt: now.toISOString(),
          confirmTokenHash: tokenHash,
          confirmSentAt: now.toISOString(),
        },
      })
    }

    sendNewsletterConfirmEmail({
      type: 'newsletter_confirm',
      recipient: { email },
      confirmUrl: `${SITE_URL}/newsletter/confirm?token=${encodeURIComponent(token)}`,
      nonce: now.getTime().toString(),
    })

    const posthog = getPostHogClient()
    if (posthog) {
      posthog.capture({
        distinctId: 'newsletter_subscriber',
        event: 'newsletter_confirmation_sent',
        properties: { source, returning: Boolean(existing) },
      })
      await posthog.flush()
    }

    return checkInboxResponse()
  } catch (error) {
    if (error instanceof Error && error.message.includes('unique constraint')) {
      return checkInboxResponse()
    }

    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe to newsletter. Please try again.' },
      { status: 500 }
    )
  }
}
