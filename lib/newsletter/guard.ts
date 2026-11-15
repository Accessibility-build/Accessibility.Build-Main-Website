import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto'
import type { NextRequest } from 'next/server'

/**
 * Bot protection for the newsletter form.
 *
 * Between May and November 2026 a subscription-bombing bot posted about 610
 * other people's addresses to /api/newsletter/subscribe from Tor exit nodes,
 * and each one got a welcome email. These checks stop scripted posts, and
 * double opt-in (see the subscribe route) caps any address that gets through
 * at one confirmation email a day.
 */

const FORM_TOKEN_MIN_AGE_MS = 1_500
const FORM_TOKEN_MAX_AGE_MS = 2 * 60 * 60 * 1000

export const CONFIRM_LINK_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
export const CONFIRM_RESEND_COOLDOWN_MS = 24 * 60 * 60 * 1000

function formSecret(): string | null {
  return process.env.NEWSLETTER_FORM_SECRET || process.env.CLERK_SECRET_KEY || null
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return (forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown').trim()
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(`newsletter-form:${payload}`).digest('base64url')
}

/** A short-lived token, tied to the visitor's IP, that the form fetches before it can post. */
export function issueFormToken(ip: string): string {
  const secret = formSecret()
  const issuedAt = Date.now().toString()
  if (!secret) return issuedAt
  return `${issuedAt}.${sign(`${issuedAt}:${ip}`, secret)}`
}

export type FormTokenCheck = 'ok' | 'missing' | 'invalid' | 'too_fast' | 'expired'

export function checkFormToken(token: unknown, ip: string): FormTokenCheck {
  if (typeof token !== 'string' || token.length === 0) return 'missing'

  const secret = formSecret()
  const [issuedAt, signature] = token.split('.')
  const issuedMs = Number(issuedAt)
  if (!Number.isFinite(issuedMs)) return 'invalid'

  if (secret) {
    if (!signature) return 'invalid'
    const expected = Buffer.from(sign(`${issuedAt}:${ip}`, secret))
    const given = Buffer.from(signature)
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return 'invalid'
  } else {
    console.warn('[newsletter] No NEWSLETTER_FORM_SECRET or CLERK_SECRET_KEY set; form tokens are unsigned')
  }

  const age = Date.now() - issuedMs
  if (age < FORM_TOKEN_MIN_AGE_MS) return 'too_fast'
  if (age > FORM_TOKEN_MAX_AGE_MS) return 'expired'
  return 'ok'
}

/**
 * User agents no real browser sends. The 2026 bot sent its Chrome string
 * wrapped in literal double quotes on every request.
 */
export function isScriptedUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return true
  const ua = userAgent.trim()
  if (ua.startsWith('"') || ua.startsWith("'")) return true
  return /^(curl|wget|python-requests|python-urllib|go-http-client|java\/|okhttp|axios|node-fetch|undici|libwww|httpclient|postmanruntime)/i.test(ua)
}

export function createConfirmToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString('base64url')
  return { token, tokenHash: hashConfirmToken(token) }
}

export function hashConfirmToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
