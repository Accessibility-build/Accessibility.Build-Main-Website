import { Resend } from 'resend'

let resendClient: Resend | null = null

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
  const raw = process.env.EMAIL_SERVICE_ENABLED

  if (raw === undefined) {
    return Boolean(process.env.RESEND_API_KEY)
  }

  return raw.toLowerCase() === 'true'
}
