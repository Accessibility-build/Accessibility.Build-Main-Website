import { randomBytes } from 'crypto'

export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://accessibility.build'

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/** Short, unguessable, URL-safe slug for a shared report (62^10 ≈ 8e17). */
export function generateSlug(len = 10): string {
  const bytes = randomBytes(len)
  let out = ''
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length]
  return out
}

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

/** Validate that a base64 string decodes to a real PNG within a size cap. */
export function validatePngBase64(base64: string, maxBytes = 3_500_000): { ok: true } | { ok: false; error: string } {
  if (!base64) return { ok: false, error: 'missing image' }
  let buffer: Buffer
  try {
    buffer = Buffer.from(base64, 'base64')
  } catch {
    return { ok: false, error: 'invalid base64' }
  }
  if (buffer.length < 8 || !buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    return { ok: false, error: 'not a PNG image' }
  }
  if (buffer.length > maxBytes) return { ok: false, error: 'image too large' }
  return { ok: true }
}

/** Postgres unique-violation detection (slug collision retry). */
export function isUniqueViolation(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: string }).code === '23505'
}
