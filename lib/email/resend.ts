import { Resend } from 'resend'

let resendClient: Resend | null = null

function parseEnvBoolean(value: string | undefined): boolean | null {
  if (value === undefined) {
    return null
  }

  const normalized = value.trim().toLowerCase()
  if (normalized === 'true') {
    return true
  }

  if (normalized === 'false') {
    return false
  }

  return null
}

export function getResendClient(): Resend {
  if (resendClient) {
    return resendClient
  }

  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  resendClient = new Resend(apiKey)
  return resendClient
}

export function getEmailFromAddress(): string {
  const from = process.env.RESEND_FROM_ADDRESS

  if (!from) {
    throw new Error('RESEND_FROM_ADDRESS is not configured')
  }

  return from
}

export function isEmailServiceEnabled(): boolean {
  const enabled = parseEnvBoolean(process.env.EMAIL_SERVICE_ENABLED)
  if (enabled === null) {
    return Boolean(process.env.RESEND_API_KEY)
  }

  return enabled
}

export function isMarketingEmailEnabled(): boolean {
  const enabled = parseEnvBoolean(process.env.EMAIL_MARKETING_ENABLED)
  if (enabled === null) {
    return isEmailServiceEnabled()
  }

  return enabled
}
