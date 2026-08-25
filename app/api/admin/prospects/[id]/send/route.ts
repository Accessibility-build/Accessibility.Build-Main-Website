import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { AdminAccessError, requireAdminApi } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { prospects } from '@/lib/db/schema'
import { serializeProspect } from '@/lib/prospects'
import { sendProspectOutreachEmail } from '@/lib/email/service'
import { isEmailServiceEnabled } from '@/lib/email/resend'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const MAX_SUBJECT_LENGTH = 300
const MAX_BODY_LENGTH = 20000

// Tiers where the whole point is NOT to cold-email the company. A real send to
// one of these is blocked outright; only a test-to-yourself is allowed.
const BLOCKED_TIERS = new Set(['linkedin-only', 'hold'])

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Send the outreach email for a single prospect. This is the only place in the
 * app that sends a prospect a message, and it only ever fires on an explicit
 * operator POST. Guardrails: sending must be configured, the tier must permit a
 * real send, an address must exist, and a second send to the same prospect
 * needs `confirmResend`. `test: true` sends the draft to the signed-in admin
 * instead and never mutates the row.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdminApi()
    const adminEmail = admin.emailAddresses?.[0]?.emailAddress?.trim() || null

    const { id } = await params
    if (!UUID_PATTERN.test(id)) {
      return NextResponse.json({ error: 'Invalid prospect id' }, { status: 400 })
    }

    if (!isEmailServiceEnabled()) {
      return NextResponse.json(
        { error: 'Email sending is not configured. Set RESEND_API_KEY and RESEND_FROM_ADDRESS, then redeploy.' },
        { status: 503 },
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      body = {}
    }

    const {
      subject: subjectInput,
      body: bodyInput,
      test: testInput,
      confirmResend,
      includeOptOut,
    } = (body ?? {}) as {
      subject?: unknown
      body?: unknown
      test?: unknown
      confirmResend?: unknown
      includeOptOut?: unknown
    }

    const isTest = testInput === true

    const [record] = await db.select().from(prospects).where(eq(prospects.id, id)).limit(1)
    if (!record) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })
    }

    // Resolve subject and body: prefer what the operator edited in the UI,
    // fall back to the stored draft.
    const subject = (typeof subjectInput === 'string' ? subjectInput : record.subject ?? '').trim()
    const emailBody = (typeof bodyInput === 'string' ? bodyInput : record.emailBody ?? '').trim()

    if (!subject) {
      return NextResponse.json({ error: 'A subject line is required before sending.' }, { status: 400 })
    }
    if (!emailBody) {
      return NextResponse.json({ error: 'The email body is empty.' }, { status: 400 })
    }
    if (subject.length > MAX_SUBJECT_LENGTH) {
      return NextResponse.json({ error: `Subject must be ${MAX_SUBJECT_LENGTH} characters or fewer.` }, { status: 400 })
    }
    if (emailBody.length > MAX_BODY_LENGTH) {
      return NextResponse.json({ error: `Body must be ${MAX_BODY_LENGTH} characters or fewer.` }, { status: 400 })
    }

    // Choose recipient. A test goes to the admin; a real send goes to the
    // prospect's verified published address.
    let recipient: string
    if (isTest) {
      if (!adminEmail || !EMAIL_PATTERN.test(adminEmail)) {
        return NextResponse.json(
          { error: 'Could not determine your own email address for the test send.' },
          { status: 400 },
        )
      }
      recipient = adminEmail
    } else {
      const address = record.emailAddress?.trim() ?? ''
      if (!address || !EMAIL_PATTERN.test(address)) {
        return NextResponse.json(
          { error: 'This prospect has no verified email address. Reach out on LinkedIn instead.' },
          { status: 422 },
        )
      }
      if (BLOCKED_TIERS.has(record.tier ?? '')) {
        return NextResponse.json(
          {
            error: `Sending is blocked for the "${record.tier}" tier. This company should be approached on LinkedIn, not by cold email.`,
          },
          { status: 422 },
        )
      }
      if (record.sentAt && confirmResend !== true) {
        return NextResponse.json(
          {
            error: 'This prospect was already emailed.',
            code: 'ALREADY_SENT',
            sentAt: record.sentAt.toISOString(),
          },
          { status: 409 },
        )
      }
      recipient = address
    }

    const result = await sendProspectOutreachEmail({
      prospectId: record.id,
      to: recipient,
      subject,
      body: emailBody,
      replyTo: adminEmail ?? undefined,
      includeOptOut: includeOptOut !== false,
      idempotencySuffix: isTest ? `test_${Date.now()}` : record.sentAt ? `resend_${Date.now()}` : undefined,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error ?? 'The email provider rejected the send.' }, { status: 502 })
    }

    // A test never changes the pipeline.
    if (isTest) {
      return NextResponse.json({ success: true, test: true, resendId: result.resendId ?? null, to: recipient })
    }

    const now = new Date()
    const [updated] = await db
      .update(prospects)
      .set({
        status: 'sent',
        sentAt: now,
        resendId: result.resendId ?? null,
        updatedAt: now,
      })
      .where(eq(prospects.id, record.id))
      .returning()

    return NextResponse.json({
      success: true,
      test: false,
      resendId: result.resendId ?? null,
      to: recipient,
      prospect: updated ? serializeProspect(updated) : null,
    })
  } catch (error) {
    console.error('Admin prospect send error:', error)

    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json({ error: 'Failed to send the email.' }, { status: 500 })
  }
}
