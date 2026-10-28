import "server-only"
import { isIP } from "node:net"
import { lookup } from "node:dns/promises"
import { isBlockedHostname, normalizeInputUrl } from "@/lib/url-safety"

/**
 * Server-side guard for tools that load a visitor's URL.
 *
 * `lib/url-safety.ts` only reads the hostname string, so a public name that resolves to a private
 * address gets through it. This module resolves the name the way fetch and Chromium will (the OS
 * resolver, so /etc/hosts counts too) and refuses loopback, private, link-local, carrier-grade NAT,
 * multicast and reserved ranges, including IPv4 written inside IPv6. Every redirect hop is checked
 * again, and `createHostGuard` lets a headless browser check each request it makes.
 */

export class PublicUrlError extends Error {
  readonly status: number
  constructor(message: string, status = 400) {
    super(message)
    this.name = "PublicUrlError"
    this.status = status
  }
}

const PRIVATE_MESSAGE = "Private or local network addresses can't be checked. Enter a public website address."

function privateIPv4(address: string): boolean {
  const parts = address.split(".").map(Number)
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return true
  const [a, b, c] = parts
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
    (a === 169 && b === 254) || // link-local, covers cloud metadata
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0 && c === 0) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) || // benchmarking
    a >= 224 // multicast and reserved
  )
}

/** True for any address a server-side fetch must never reach. */
export function isPrivateAddress(address: string): boolean {
  const normalized = address.trim().toLowerCase().replace(/^\[|\]$/g, "")
  const version = isIP(normalized)
  if (version === 4) return privateIPv4(normalized)
  if (version !== 6) return true

  // IPv4 inside IPv6: ::ffff:10.0.0.1, ::10.0.0.1, 64:ff9b::10.0.0.1 (NAT64).
  const embedded = normalized.match(/(\d{1,3}(?:\.\d{1,3}){3})$/)
  if (embedded) return privateIPv4(embedded[1])
  const mappedHex = normalized.match(/^(?:::ffff:|64:ff9b::)([0-9a-f]{1,4}):([0-9a-f]{1,4})$/)
  if (mappedHex) {
    const high = parseInt(mappedHex[1], 16)
    const low = parseInt(mappedHex[2], 16)
    return privateIPv4(`${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`)
  }

  return (
    normalized === "::" ||
    normalized === "::1" ||
    /^f[cd][0-9a-f]{2}:/.test(normalized) || // unique local fc00::/7
    /^fe[89ab][0-9a-f]:/.test(normalized) || // link-local fe80::/10
    normalized.startsWith("ff") // multicast
  )
}

async function publicHost(hostname: string): Promise<boolean> {
  const host = hostname.trim().toLowerCase().replace(/^\[|\]$/g, "")
  if (!host || isBlockedHostname(host)) return false
  if (isIP(host)) return !isPrivateAddress(host)
  const addresses = await lookup(host, { all: true, verbatim: true }).catch(() => [])
  return addresses.length > 0 && addresses.every((entry) => !isPrivateAddress(entry.address))
}

/** Throws a PublicUrlError unless the URL is http(s) and its host resolves only to public addresses. */
export async function assertPublicUrl(url: URL): Promise<void> {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new PublicUrlError("Only http and https addresses can be checked.")
  }
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "")
  if (isBlockedHostname(host) || (isIP(host) && isPrivateAddress(host))) throw new PublicUrlError(PRIVATE_MESSAGE)
  if (isIP(host)) return

  const addresses = await lookup(host, { all: true, verbatim: true }).catch(() => [])
  if (addresses.length === 0) {
    throw new PublicUrlError(`We couldn't find ${url.hostname}. Check the address is spelled correctly.`)
  }
  if (addresses.some((entry) => isPrivateAddress(entry.address))) throw new PublicUrlError(PRIVATE_MESSAGE)
}

/** Parses what a visitor typed ("example.com" or a full URL) and refuses anything that is not a public web address. */
export async function parsePublicUrl(raw: unknown): Promise<URL> {
  if (typeof raw !== "string" || !raw.trim()) throw new PublicUrlError("Enter a website address, for example https://example.com")
  if (raw.length > 2048) throw new PublicUrlError("That address is too long.")
  const url = normalizeInputUrl(raw)
  if (!url || (!url.hostname.includes(".") && !isIP(url.hostname.replace(/^\[|\]$/g, "")))) {
    throw new PublicUrlError("Enter a website address, for example https://example.com")
  }
  url.hash = ""
  await assertPublicUrl(url)
  return url
}

/**
 * A cached per-hostname check for every request a headless browser makes, so a public page cannot
 * pull in, redirect to, or post to a private address.
 */
export function createHostGuard(): (hostname: string) => Promise<boolean> {
  const cache = new Map<string, Promise<boolean>>()
  return (hostname) => {
    const key = hostname.toLowerCase()
    let verdict = cache.get(key)
    if (!verdict) {
      verdict = publicHost(key).catch(() => false)
      cache.set(key, verdict)
    }
    return verdict
  }
}

/** Decodes with the charset from the Content-Type header or a meta tag, falling back to UTF-8. */
function decodeHtml(bytes: ArrayBuffer, contentType: string): string {
  const head = new TextDecoder("latin1").decode(bytes.slice(0, 4096))
  const label =
    contentType.match(/charset=["']?([\w-]+)/i)?.[1] ??
    head.match(/<meta[^>]+charset=["']?([\w-]+)/i)?.[1] ??
    "utf-8"
  try {
    return new TextDecoder(label).decode(bytes)
  } catch {
    return new TextDecoder().decode(bytes)
  }
}

/** Fetches a public HTML page without a browser, checking every redirect hop. */
export async function fetchPublicHtml(
  initialUrl: URL,
  { userAgent, maxBytes = 2_000_000, timeoutMs = 10_000, maxRedirects = 3 }: { userAgent: string; maxBytes?: number; timeoutMs?: number; maxRedirects?: number },
): Promise<{ html: string; finalUrl: string }> {
  let currentUrl = initialUrl
  for (let hop = 0; hop <= maxRedirects; hop += 1) {
    await assertPublicUrl(currentUrl)
    let response: Response
    try {
      response = await fetch(currentUrl, {
        redirect: "manual",
        signal: AbortSignal.timeout(timeoutMs),
        headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": userAgent },
      })
    } catch {
      throw new PublicUrlError(`${currentUrl.hostname} didn't respond in time. Try again, or check the address.`, 502)
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location")
      if (!location) throw new PublicUrlError("The website sent a redirect with no address.", 502)
      currentUrl = new URL(location, currentUrl)
      continue
    }
    if (!response.ok) throw new PublicUrlError(`The website returned HTTP ${response.status}.`, 502)

    const contentType = response.headers.get("content-type") || ""
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new PublicUrlError("That address didn't return a web page.")
    }
    if (Number(response.headers.get("content-length") || 0) > maxBytes) {
      throw new PublicUrlError(`The page is larger than ${Math.round(maxBytes / 1_000_000)} MB.`)
    }
    const bytes = await response.arrayBuffer()
    if (bytes.byteLength > maxBytes) throw new PublicUrlError(`The page is larger than ${Math.round(maxBytes / 1_000_000)} MB.`)
    return { html: decodeHtml(bytes, contentType), finalUrl: currentUrl.toString() }
  }
  throw new PublicUrlError("The website redirected too many times.", 502)
}
