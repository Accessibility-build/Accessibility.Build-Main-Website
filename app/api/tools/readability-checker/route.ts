import { NextRequest, NextResponse } from "next/server"
import { fetchPublicHtml, parsePublicUrl } from "@/lib/public-url"
import { recordUrlToolRun, toolErrorResponse, urlToolRateLimit } from "@/lib/render/route"

// URL mode for the Readability Checker. The server only fetches the page's HTML, checking every
// redirect against the private-address guard, and hands it back. The browser parses it with
// DOMParser, which never runs scripts, and reads the text; nothing is rendered or stored here.

export const runtime = "nodejs"
export const maxDuration = 60

const rateLimit = urlToolRateLimit(30)

export async function POST(request: NextRequest) {
  const limited = await rateLimit(request)
  if (limited) return limited

  const started = performance.now()
  let url: URL | null = null
  try {
    const body = await request.json().catch(() => null)
    url = await parsePublicUrl(body?.url)
    const { html, finalUrl } = await fetchPublicHtml(url, { userAgent: "Accessibility.build Readability Checker/1.0" })
    recordUrlToolRun(request, {
      tool: "readability_checker",
      url,
      ok: true,
      durationMs: performance.now() - started,
      properties: { html_bytes: html.length },
    })
    return NextResponse.json({ html, finalUrl }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    recordUrlToolRun(request, {
      tool: "readability_checker",
      url,
      ok: false,
      durationMs: performance.now() - started,
      error: error instanceof Error ? error.message : "unknown",
    })
    return toolErrorResponse(error, "We couldn't load that page. Please try again.")
  }
}
