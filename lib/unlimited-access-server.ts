import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

export const UNLIMITED_ACCESS_COOKIE_NAME = 'unlimited_access_token'
const UNLIMITED_ACCESS_DURATION_MS = 24 * 60 * 60 * 1000

interface UnlimitedAccessPayload {
  exp: number
  iat: number
}

function getUnlimitedAccessSigningSecret() {
  return process.env.UNLIMITED_ACCESS_COOKIE_SECRET || process.env.UNLIMITED_ACCESS_KEY || ''
}

function signPayload(payloadBase64: string, secret: string) {
  return createHmac('sha256', secret).update(payloadBase64).digest('base64url')
}

export function validateUnlimitedAccessSecret(secretKey: string): boolean {
  const envSecretKey = process.env.UNLIMITED_ACCESS_KEY

  if (!envSecretKey || !secretKey) {
    return false
  }

  const provided = Buffer.from(secretKey)
  const expected = Buffer.from(envSecretKey)

  if (provided.length !== expected.length) {
    return false
  }

  return timingSafeEqual(provided, expected)
}

export function createUnlimitedAccessToken() {
  const secret = getUnlimitedAccessSigningSecret()

  if (!secret) {
    throw new Error('Unlimited access signing secret is not configured')
  }

  const now = Date.now()
  const payload: UnlimitedAccessPayload = {
    iat: now,
    exp: now + UNLIMITED_ACCESS_DURATION_MS
  }

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = signPayload(payloadBase64, secret)

  return `${payloadBase64}.${signature}`
}

export function verifyUnlimitedAccessToken(token: string): boolean {
  if (!token) {
    return false
  }

  const secret = getUnlimitedAccessSigningSecret()

  if (!secret) {
    return false
  }

  const [payloadBase64, signature] = token.split('.')

  if (!payloadBase64 || !signature) {
    return false
  }

  const expectedSignature = signPayload(payloadBase64, secret)
  const providedBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (providedBuffer.length !== expectedBuffer.length) {
    return false
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return false
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8')) as UnlimitedAccessPayload
    return typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}

export async function hasServerUnlimitedAccess() {
  const cookieStore = await cookies()
  const token = cookieStore.get(UNLIMITED_ACCESS_COOKIE_NAME)?.value

  if (!token) {
    return false
  }

  const valid = verifyUnlimitedAccessToken(token)

  if (!valid) {
    cookieStore.delete(UNLIMITED_ACCESS_COOKIE_NAME)
  }

  return valid
}

export const unlimitedAccessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: Math.floor(UNLIMITED_ACCESS_DURATION_MS / 1000)
}
