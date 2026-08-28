/**
 * Shared guards for tools that fetch a user-supplied URL.
 *
 * Anything that takes a URL from a form and fetches it server-side is an SSRF
 * hole unless loopback, link-local and RFC1918 targets are refused first. These
 * helpers mirror the checks already used by the scope checker so every
 * URL-fetching tool refuses the same set of hosts.
 */

/** Strip the leading www. so two spellings of one host compare equal. */
export function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/^www\./, "")
}

/** RFC1918, loopback and malformed dotted-quad addresses. */
export function isPrivateIPv4(hostname: string): boolean {
  const ipv4 = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (!ipv4) return false

  const octets = ipv4.slice(1).map((part) => Number.parseInt(part, 10))
  // An out-of-range octet is not a real address; refuse rather than guess.
  if (octets.some((octet) => octet < 0 || octet > 255)) return true

  const [a, b] = octets
  if (a === 10 || a === 127) return true
  if (a === 0) return true
  if (a === 169 && b === 254) return true // link-local, covers cloud metadata
  if (a === 192 && b === 168) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  return false
}

export function isBlockedHostname(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase()
  return (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local") ||
    normalized.endsWith(".internal") ||
    normalized === "::1" ||
    normalized === "[::1]" ||
    normalized.startsWith("[fd") || // unique local IPv6
    normalized.startsWith("[fe80") || // link-local IPv6
    isPrivateIPv4(normalized)
  )
}

/** Accept "example.com" as readily as "https://example.com". */
export function normalizeInputUrl(rawUrl: string): URL | null {
  const trimmed = (rawUrl || "").trim()
  if (!trimmed) return null

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    const parsed = new URL(candidate)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null
    if (!parsed.hostname) return null
    return parsed
  } catch {
    return null
  }
}

export async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
  init?: RequestInit
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}
