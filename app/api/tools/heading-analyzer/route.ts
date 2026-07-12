import { isIP } from "node:net"
import { resolve4, resolve6 } from "node:dns/promises"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 15

const MAX_HTML_BYTES = 2_000_000
const MAX_REDIRECTS = 3

function isPrivateAddress(address: string): boolean {
  const normalized = address.toLowerCase()

  if (normalized === "::1" || normalized.startsWith("fe80:") || normalized.startsWith("fc") || normalized.startsWith("fd")) {
    return true
  }

  const parts = normalized.split(".").map(Number)
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return false

  const [a, b] = parts
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  )
}

async function assertPublicUrl(url: URL): Promise<void> {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only HTTP and HTTPS URLs are supported")
  }

  const hostname = url.hostname.toLowerCase()
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
    throw new Error("Private or local network URLs are not supported")
  }

  if (isIP(hostname)) {
    if (isPrivateAddress(hostname)) throw new Error("Private or local network URLs are not supported")
    return
  }

  const [ipv4, ipv6] = await Promise.all([
    resolve4(hostname).catch(() => []),
    resolve6(hostname).catch(() => []),
  ])
  const addresses = [...ipv4, ...ipv6]
  if (addresses.length === 0) throw new Error("The website hostname could not be resolved")
  if (addresses.some(isPrivateAddress)) throw new Error("Private or local network URLs are not supported")
}

async function fetchHtml(initialUrl: URL): Promise<{ html: string; finalUrl: string }> {
  let currentUrl = initialUrl

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    await assertPublicUrl(currentUrl)

    const response = await fetch(currentUrl, {
      redirect: "manual",
      signal: AbortSignal.timeout(10_000),
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Accessibility.build Heading Analyzer/1.0",
      },
    })

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location")
      if (!location) throw new Error("The website returned an invalid redirect")
      currentUrl = new URL(location, currentUrl)
      continue
    }

    if (!response.ok) throw new Error(`The website returned HTTP ${response.status}`)

    const contentType = response.headers.get("content-type") || ""
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error("The URL did not return an HTML document")
    }

    const declaredLength = Number(response.headers.get("content-length") || 0)
    if (declaredLength > MAX_HTML_BYTES) throw new Error("The HTML document is larger than 2 MB")

    const bytes = await response.arrayBuffer()
    if (bytes.byteLength > MAX_HTML_BYTES) throw new Error("The HTML document is larger than 2 MB")

    return {
      html: new TextDecoder().decode(bytes),
      finalUrl: currentUrl.toString(),
    }
  }

  throw new Error("The website redirected too many times")
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { url?: unknown }
    if (typeof body.url !== "string" || !body.url.trim()) {
      return NextResponse.json({ error: "A website URL is required" }, { status: 400 })
    }

    const candidate = /^https?:\/\//i.test(body.url.trim()) ? body.url.trim() : `https://${body.url.trim()}`
    const result = await fetchHtml(new URL(candidate))
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch this website"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
