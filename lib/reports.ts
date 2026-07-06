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
