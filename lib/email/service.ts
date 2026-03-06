import {
  getResendClient,
  getEmailFromAddress,
  isEmailServiceEnabled,
  isMarketingEmailEnabled,
} from './resend'
import {
  renderWelcomeEmail,
  renderServicesIntroEmail,
  renderNewsletterWelcomeEmail,
  renderMarketingCampaignEmail,
  renderPurchaseConfirmationEmail,
  renderRefundNotificationEmail,
} from './templates'
import type {
  TransactionalEmailData,
  EmailSendResult,
  WelcomeEmailData,
  ServicesIntroEmailData,
  NewsletterWelcomeEmailData,
  MarketingCampaignEmailData,
  PurchaseConfirmationEmailData,
  RefundNotificationEmailData,
} from './types'

const LOG_PREFIX = '[email:service]'

const SYNTHETIC_EMAIL_DOMAIN = '@users.accessibility.build'

function isSyntheticEmail(email: string): boolean {
  return email.endsWith(SYNTHETIC_EMAIL_DOMAIN)
}

function sanitizeEmailForIdempotency(email: string): string {
  return email.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function buildIdempotencyKey(data: TransactionalEmailData): string {
  switch (data.type) {
    case 'welcome':
      return `welcome_${data.recipient.email}`
    case 'services_intro':
      return `services_intro_${data.recipient.email}`
    case 'newsletter_welcome':
      return `newsletter_${data.recipient.email}`
    case 'marketing_campaign':
      return `marketing_${data.campaignId}_${sanitizeEmailForIdempotency(data.recipient.email)}`
    case 'purchase_confirmation':
      return `purchase_${data.orderId}`
    case 'refund_notification':
      return `refund_${data.orderId}`
  }
}

export function formatAmountForEmail(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
  }).format(amountMinor / 100)
}

async function sendEmailViaResend(params: {
  to: string
  subject: string
  html: string
  idempotencyKey: string
  emailType: string
}): Promise<EmailSendResult> {
  const startMs = Date.now()

  console.log(`${LOG_PREFIX} ▶ ${params.emailType}`, JSON.stringify({
    to: params.to,
    idempotencyKey: params.idempotencyKey,
  }))

  try {
    const client = getResendClient()
    const from = getEmailFromAddress()

    const { data, error } = await client.emails.send({
      from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      headers: {
        'X-Entity-Ref-ID': params.idempotencyKey,
      },
    })

    const durationMs = Date.now() - startMs

    if (error) {
      console.error(`${LOG_PREFIX} ✗ API_ERROR ${params.emailType}`, JSON.stringify({
        durationMs,
        error: error.message,
        idempotencyKey: params.idempotencyKey,
      }))
      return { success: false, error: error.message }
    }

    console.log(`${LOG_PREFIX} ✓ ${params.emailType}`, JSON.stringify({
      durationMs,
      resendId: data?.id,
      idempotencyKey: params.idempotencyKey,
    }))

    return { success: true, resendId: data?.id }
  } catch (networkError) {
    const durationMs = Date.now() - startMs
    console.error(`${LOG_PREFIX} ✗ NETWORK_ERROR ${params.emailType}`, JSON.stringify({
      durationMs,
      error: networkError instanceof Error ? networkError.message : String(networkError),
      errorType: networkError instanceof Error ? networkError.constructor.name : typeof networkError,
      idempotencyKey: params.idempotencyKey,
    }))
    return {
      success: false,
      error: networkError instanceof Error ? networkError.message : String(networkError),
    }
  }
}

/** Fire-and-forget: sends welcome email. Never throws. */
export function sendWelcomeEmail(data: WelcomeEmailData): void {
  if (!isEmailServiceEnabled()) return
  if (!data.recipient.email || isSyntheticEmail(data.recipient.email)) return

  const { subject, html } = renderWelcomeEmail({
    firstName: data.recipient.firstName,
    credits: data.credits,
  })

  const idempotencyKey = buildIdempotencyKey(data)

  sendEmailViaResend({
    to: data.recipient.email,
    subject,
    html,
    idempotencyKey,
    emailType: 'welcome',
  }).catch((err) => {
    console.error(`${LOG_PREFIX} ✗ unhandled_welcome`, JSON.stringify({
      error: err instanceof Error ? err.message : String(err),
      to: data.recipient.email,
    }))
  })
}

/** Fire-and-forget: sends services intro marketing email. Never throws. */
export function sendServicesIntroEmail(data: ServicesIntroEmailData): void {
  if (!isEmailServiceEnabled()) return
  if (!isMarketingEmailEnabled()) return
  if (!data.recipient.email || isSyntheticEmail(data.recipient.email)) return

  const { subject, html } = renderServicesIntroEmail({
    firstName: data.recipient.firstName,
  })

  const idempotencyKey = buildIdempotencyKey(data)

  sendEmailViaResend({
    to: data.recipient.email,
    subject,
    html,
    idempotencyKey,
    emailType: 'services_intro',
  }).catch((err) => {
    console.error(`${LOG_PREFIX} ✗ unhandled_services_intro`, JSON.stringify({
      error: err instanceof Error ? err.message : String(err),
      to: data.recipient.email,
    }))
  })
}

/** Fire-and-forget: sends newsletter welcome email. Never throws. */
export function sendNewsletterWelcomeEmail(data: NewsletterWelcomeEmailData): void {
  if (!isEmailServiceEnabled()) return
  if (!isMarketingEmailEnabled()) return
  if (!data.recipient.email || isSyntheticEmail(data.recipient.email)) return

  const { subject, html } = renderNewsletterWelcomeEmail({
    firstName: data.recipient.firstName,
  })

  const idempotencyKey = buildIdempotencyKey(data)

  sendEmailViaResend({
    to: data.recipient.email,
    subject,
    html,
    idempotencyKey,
    emailType: 'newsletter_welcome',
  }).catch((err) => {
    console.error(`${LOG_PREFIX} ✗ unhandled_newsletter_welcome`, JSON.stringify({
      error: err instanceof Error ? err.message : String(err),
      to: data.recipient.email,
    }))
  })
}

export async function sendMarketingCampaignEmail(data: MarketingCampaignEmailData): Promise<EmailSendResult> {
  if (!isEmailServiceEnabled()) {
    return { success: false, error: 'Email service is disabled' }
  }

  if (!isMarketingEmailEnabled()) {
    return { success: false, error: 'Marketing email service is disabled' }
  }

  if (!data.recipient.email || isSyntheticEmail(data.recipient.email)) {
    return { success: false, error: 'Recipient email is not eligible' }
  }

  const { subject, html } = renderMarketingCampaignEmail({
    subject: data.subject,
    firstName: data.recipient.firstName,
    preheader: data.preheader,
    heading: data.heading,
    body: data.body,
    ctaLabel: data.ctaLabel,
    ctaUrl: data.ctaUrl,
  })

  const idempotencyKey = buildIdempotencyKey(data)

  return sendEmailViaResend({
    to: data.recipient.email,
    subject,
    html,
    idempotencyKey,
    emailType: 'marketing_campaign',
  })
}

/** Fire-and-forget: sends purchase confirmation. Never throws. */
export function sendPurchaseConfirmationEmail(data: PurchaseConfirmationEmailData): void {
  if (!isEmailServiceEnabled()) return
  if (!data.recipient.email || isSyntheticEmail(data.recipient.email)) return

  const { subject, html } = renderPurchaseConfirmationEmail({
    firstName: data.recipient.firstName,
    orderId: data.orderId,
    packName: data.packName,
    credits: data.credits,
    amountFormatted: data.amountFormatted,
    newBalance: data.newBalance,
  })

  const idempotencyKey = buildIdempotencyKey(data)

  sendEmailViaResend({
    to: data.recipient.email,
    subject,
    html,
    idempotencyKey,
    emailType: 'purchase_confirmation',
  }).catch((err) => {
    console.error(`${LOG_PREFIX} ✗ unhandled_purchase`, JSON.stringify({
      error: err instanceof Error ? err.message : String(err),
      orderId: data.orderId,
    }))
  })
}

/** Fire-and-forget: sends refund notification. Never throws. */
export function sendRefundNotificationEmail(data: RefundNotificationEmailData): void {
  if (!isEmailServiceEnabled()) return
  if (!data.recipient.email || isSyntheticEmail(data.recipient.email)) return

  const { subject, html } = renderRefundNotificationEmail({
    firstName: data.recipient.firstName,
    orderId: data.orderId,
    packName: data.packName,
    creditsReversed: data.creditsReversed,
    refundAmountFormatted: data.refundAmountFormatted,
    remainingBalance: data.remainingBalance,
  })

  const idempotencyKey = buildIdempotencyKey(data)

  sendEmailViaResend({
    to: data.recipient.email,
    subject,
    html,
    idempotencyKey,
    emailType: 'refund_notification',
  }).catch((err) => {
    console.error(`${LOG_PREFIX} ✗ unhandled_refund`, JSON.stringify({
      error: err instanceof Error ? err.message : String(err),
      orderId: data.orderId,
    }))
  })
}
