import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { AdminAccessError, requireAdminApi } from '@/lib/admin-auth'
import { logAdminAction } from '@/lib/admin-utils'
import { db } from '@/lib/db'
import { emailSubscriptions, users } from '@/lib/db/schema'
import { sendMarketingCampaignEmail } from '@/lib/email/service'
import { getEmailFromAddress, isEmailServiceEnabled, isMarketingEmailEnabled } from '@/lib/email/resend'

const SYNTHETIC_EMAIL_DOMAIN = '@users.accessibility.build'
const SEND_CONCURRENCY = 8

const marketingAudienceSchema = z.enum(['active_users', 'newsletter_subscribers', 'all_contacts'])
type MarketingAudience = z.infer<typeof marketingAudienceSchema>

const baseCampaignSchema = z.object({
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(160),
  preheader: z.string().trim().max(200).optional(),
  heading: z.string().trim().max(160).optional(),
  body: z.string().trim().min(10, 'Body must be at least 10 characters').max(10000),
  ctaLabel: z.string().trim().max(80).optional(),
  ctaUrl: z.string().trim().url('CTA URL must be a valid URL').max(2048).optional(),
})

const sendCampaignSchema = baseCampaignSchema.extend({
  action: z.literal('send_campaign'),
  audience: marketingAudienceSchema,
  reason: z.string().trim().min(8, 'Reason must be at least 8 characters').max(500),
  limit: z.number().int().min(1).max(5000).optional(),
})

const sendTestSchema = baseCampaignSchema.extend({
  action: z.literal('send_test'),
  testEmail: z.string().trim().email('Please provide a valid test email'),
  reason: z.string().trim().min(8, 'Reason must be at least 8 characters').max(500).optional(),
})

const marketingRequestSchema = z.discriminatedUnion('action', [sendCampaignSchema, sendTestSchema])

type ActiveUserEmailRow = {
  email: string
  firstName: string | null
  lastName: string | null
}

type NewsletterEmailRow = {
  email: string
}

type MarketingRecipient = {
  email: string
  firstName?: string | null
  lastName?: string | null
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function getConfiguredFromAddress(): string | null {
  try {
    return getEmailFromAddress()
  } catch {
    return null
  }
}

function toRecipientMap(params: {
  audience: MarketingAudience
  activeUsersRows: ActiveUserEmailRow[]
  newsletterRows: NewsletterEmailRow[]
}): Map<string, MarketingRecipient> {
  const recipients = new Map<string, MarketingRecipient>()

  if (params.audience === 'active_users' || params.audience === 'all_contacts') {
    for (const userRow of params.activeUsersRows) {
      const email = normalizeEmail(userRow.email)
      if (!email || email.endsWith(SYNTHETIC_EMAIL_DOMAIN)) {
        continue
      }

      recipients.set(email, {
        email,
        firstName: userRow.firstName,
        lastName: userRow.lastName,
      })
    }
  }

  if (params.audience === 'newsletter_subscribers' || params.audience === 'all_contacts') {
    for (const row of params.newsletterRows) {
      const email = normalizeEmail(row.email)
      if (!email || email.endsWith(SYNTHETIC_EMAIL_DOMAIN)) {
        continue
      }

      if (!recipients.has(email)) {
        recipients.set(email, { email })
      }
    }
  }

  return recipients
}

async function fetchAudienceRows(): Promise<{
  activeUsersRows: ActiveUserEmailRow[]
  newsletterRows: NewsletterEmailRow[]
}> {
  const [activeUsersRows, newsletterRows] = await Promise.all([
    db
      .select({
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(users)
      .where(eq(users.isActive, true)),
    db
      .select({
        email: emailSubscriptions.email,
      })
      .from(emailSubscriptions)
      .where(eq(emailSubscriptions.isActive, true)),
  ])

  return { activeUsersRows, newsletterRows }
}

function ensureValidCallToAction(params: { ctaLabel?: string; ctaUrl?: string }): string | null {
  const hasLabel = Boolean(params.ctaLabel?.trim())
  const hasUrl = Boolean(params.ctaUrl?.trim())

  if (hasLabel === hasUrl) {
    return null
  }

  return 'Provide both CTA label and CTA URL, or leave both blank'
}

export async function GET() {
  try {
    await requireAdminApi()

    const emailServiceEnabled = isEmailServiceEnabled()
    const marketingEmailEnabled = isMarketingEmailEnabled()
    const fromAddress = getConfiguredFromAddress()
    const { activeUsersRows, newsletterRows } = await fetchAudienceRows()

    const activeUserRecipients = toRecipientMap({
      audience: 'active_users',
      activeUsersRows,
      newsletterRows,
    })
    const newsletterRecipients = toRecipientMap({
      audience: 'newsletter_subscribers',
      activeUsersRows,
      newsletterRows,
    })
    const allRecipients = toRecipientMap({
      audience: 'all_contacts',
      activeUsersRows,
      newsletterRows,
    })

    return NextResponse.json({
      emailServiceEnabled,
      marketingEmailEnabled,
      fromAddress,
      audienceCounts: {
        activeUsers: activeUserRecipients.size,
        newsletterSubscribers: newsletterRecipients.size,
        allContacts: allRecipients.size,
      },
    })
  } catch (error) {
    console.error('Admin marketing GET error:', error)

    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json({ error: 'Failed to load marketing audience data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdminApi()

    if (!isEmailServiceEnabled()) {
      return NextResponse.json(
        { error: 'Email service is disabled. Set EMAIL_SERVICE_ENABLED=true and configure Resend keys.' },
        { status: 503 }
      )
    }

    if (!isMarketingEmailEnabled()) {
      return NextResponse.json(
        { error: 'Marketing email is disabled. Set EMAIL_MARKETING_ENABLED=true to send campaigns.' },
        { status: 503 }
      )
    }

    const rawBody = await request.json()
    const parsed = marketingRequestSchema.safeParse(rawBody)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid request payload' },
        { status: 400 }
      )
    }

    const payload = parsed.data
    const ctaError = ensureValidCallToAction({
      ctaLabel: payload.ctaLabel,
      ctaUrl: payload.ctaUrl,
    })

    if (ctaError) {
      return NextResponse.json({ error: ctaError }, { status: 400 })
    }

    if (payload.action === 'send_test') {
      const testResult = await sendMarketingCampaignEmail({
        type: 'marketing_campaign',
        campaignId: `test_${crypto.randomUUID()}`,
        recipient: {
          email: payload.testEmail,
        },
        subject: payload.subject,
        preheader: payload.preheader,
        heading: payload.heading,
        body: payload.body,
        ctaLabel: payload.ctaLabel,
        ctaUrl: payload.ctaUrl,
      })

      if (!testResult.success) {
        return NextResponse.json(
          { error: testResult.error || 'Failed to send test email' },
          { status: 502 }
        )
      }

      await logAdminAction(admin.id, 'marketing_test_email_sent', {
        recipient: payload.testEmail,
        subject: payload.subject,
        resendId: testResult.resendId,
        reason: payload.reason || 'Marketing test email from admin panel',
      })

      return NextResponse.json({
        success: true,
        message: `Test email sent to ${payload.testEmail}`,
        resendId: testResult.resendId,
      })
    }

    const { activeUsersRows, newsletterRows } = await fetchAudienceRows()
    const recipients = Array.from(
      toRecipientMap({
        audience: payload.audience,
        activeUsersRows,
        newsletterRows,
      }).values()
    )

    const finalRecipients = payload.limit ? recipients.slice(0, payload.limit) : recipients

    if (finalRecipients.length === 0) {
      return NextResponse.json(
        { error: 'No eligible recipients found for the selected audience' },
        { status: 400 }
      )
    }

    const campaignId = crypto.randomUUID()
    let successCount = 0
    const failedRecipients: Array<{ email: string; error: string }> = []

    for (let index = 0; index < finalRecipients.length; index += SEND_CONCURRENCY) {
      const chunk = finalRecipients.slice(index, index + SEND_CONCURRENCY)

      const chunkResults = await Promise.all(
        chunk.map(async (recipient) => {
          const result = await sendMarketingCampaignEmail({
            type: 'marketing_campaign',
            campaignId,
            recipient: {
              email: recipient.email,
              firstName: recipient.firstName,
              lastName: recipient.lastName,
            },
            subject: payload.subject,
            preheader: payload.preheader,
            heading: payload.heading,
            body: payload.body,
            ctaLabel: payload.ctaLabel,
            ctaUrl: payload.ctaUrl,
          })

          return { email: recipient.email, result }
        })
      )

      for (const chunkResult of chunkResults) {
        if (chunkResult.result.success) {
          successCount += 1
          continue
        }

        failedRecipients.push({
          email: chunkResult.email,
          error: chunkResult.result.error || 'Unknown send failure',
        })
      }
    }

    const failedCount = failedRecipients.length

    await logAdminAction(admin.id, 'marketing_campaign_sent', {
      campaignId,
      audience: payload.audience,
      subject: payload.subject,
      reason: payload.reason,
      requestedRecipientCount: recipients.length,
      sentRecipientCount: successCount,
      failedRecipientCount: failedCount,
      limitedTo: payload.limit || null,
    })

    return NextResponse.json({
      success: true,
      campaignId,
      summary: {
        audience: payload.audience,
        requestedRecipients: recipients.length,
        processedRecipients: finalRecipients.length,
        sent: successCount,
        failed: failedCount,
      },
      failedRecipients: failedRecipients.slice(0, 50),
    })
  } catch (error) {
    console.error('Admin marketing POST error:', error)

    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json({ error: 'Failed to send marketing campaign' }, { status: 500 })
  }
}
