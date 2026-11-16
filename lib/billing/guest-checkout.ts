import "server-only"
import { createHash, randomBytes, timingSafeEqual } from "node:crypto"

export const GUEST_CHECKOUT_COOKIE_MAX_AGE = 7 * 24 * 60 * 60

export function guestCheckoutCookieName(orderId: string) {
  return `dodo_guest_${orderId}`
}

/** The browser keeps the token; only its digest is stored with the pending order. */
export function createGuestCheckoutToken() {
  const token = randomBytes(32).toString("base64url")
  return { token, hash: createHash("sha256").update(token).digest("hex") }
}

export function verifyGuestCheckoutToken(token: string | undefined, expectedHash: unknown) {
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token) || typeof expectedHash !== "string" || !/^[a-f0-9]{64}$/.test(expectedHash)) return false
  const actual = createHash("sha256").update(token).digest()
  return timingSafeEqual(actual, Buffer.from(expectedHash, "hex"))
}
