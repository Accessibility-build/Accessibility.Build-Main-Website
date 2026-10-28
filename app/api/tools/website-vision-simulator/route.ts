import { NextRequest, NextResponse } from "next/server"
import { PublicUrlError, parsePublicUrl } from "@/lib/public-url"
import { recordUrlToolRun, toolErrorResponse, urlToolRateLimit } from "@/lib/render/route"
import { captureForVision } from "@/lib/vision/capture"

export const runtime = "nodejs"
export const maxDuration = 60

const rateLimit = urlToolRateLimit(15)

/**
 * POST { url } returns { finalUrl, title, screenshot } for the website vision simulator. The
 * screenshot is a JPEG data URL; every filter is applied in the visitor's browser.
 */
export async function POST(request: NextRequest) {
  const limited = await rateLimit(request)
  if (limited) return limited

  const started = Date.now()
  let url: URL | null = null
  try {
    const body = await request.json().catch(() => null)
    url = await parsePublicUrl(body?.url)
    const capture = await captureForVision(url)
    recordUrlToolRun(request, {
      tool: "website_vision_simulator",
      url,
      ok: true,
      durationMs: Date.now() - started,
      properties: {
        screenshot_height: capture.screenshot.height,
        screenshot_bytes: capture.screenshot.bytes,
        truncated: capture.screenshot.truncated,
        quality: capture.screenshot.quality,
      },
    })
    return NextResponse.json(capture)
  } catch (error) {
    recordUrlToolRun(request, {
      tool: "website_vision_simulator",
      url,
      ok: false,
      durationMs: Date.now() - started,
      error: error instanceof PublicUrlError ? error.message : "internal_error",
    })
    return toolErrorResponse(error, "The page couldn't be captured. Please try again.")
  }
}
