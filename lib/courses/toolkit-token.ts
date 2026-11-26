import "server-only"
import { createHmac, timingSafeEqual } from "node:crypto"

// Short-lived signed links let server-side Chrome render a buyer-only print page without a session.
function secret() {
  const s = process.env.TOOLKIT_SIGNING_SECRET || process.env.CLERK_SECRET_KEY
  if (!s) throw new Error("No signing secret configured for toolkit downloads")
  return s
}
const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url")

export function toolkitToken(slug: string, ttlSeconds = 120) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds
  return `${exp}.${sign(`${slug}.${exp}`)}`
}

export function verifyToolkitToken(slug: string, token: string | undefined | null) {
  if (!token) return false
  const [expRaw, mac] = token.split(".")
  const exp = Number(expRaw)
  if (!Number.isInteger(exp) || exp < Date.now() / 1000 || !mac) return false
  const expected = Buffer.from(sign(`${slug}.${exp}`))
  const given = Buffer.from(mac)
  return expected.length === given.length && timingSafeEqual(expected, given)
}
