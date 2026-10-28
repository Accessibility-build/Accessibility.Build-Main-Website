import "server-only"
import { NextRequest, NextResponse } from "next/server"
import { PublicUrlError } from "@/lib/public-url"
import { getPostHogClient } from "@/lib/posthog-server"
import { clientIpFrom, hashIp } from "@/lib/case-comments-server"
import { createRateLimit } from "@/lib/rate-limit"

/**
 * Shared plumbing for the free URL tools: one rate limit shape, one error shape the client helper
 * understands, and one server-side PostHog event per run (tool, domain, outcome) so we can see which
 * sites people check. Only the hashed IP is sent, never the address itself.
 */

/** Per-IP hourly limit. In memory, so it is per server instance: a brake on abuse, not a quota. */
export function urlToolRateLimit(max = 15) {
  return createRateLimit({
    max,
    windowMs: 60 * 60 * 1000,
    message: `You've run this check ${max} times in the last hour. Please wait a while and try again.`,
  })
}

/** Turns any thrown error into `{ error }` JSON. Only PublicUrlError messages reach the visitor verbatim. */
export function toolErrorResponse(error: unknown, fallback = "The check failed. Please try again."): NextResponse {
  if (error instanceof PublicUrlError) return NextResponse.json({ error: error.message }, { status: error.status })
  console.error(fallback, error)
  return NextResponse.json({ error: fallback }, { status: 500 })
}

export function recordUrlToolRun(
  request: NextRequest,
  event: { tool: string; url: URL | null; ok: boolean; durationMs: number; error?: string; properties?: Record<string, unknown> },
): void {
  const client = getPostHogClient()
  if (!client) return
  const visitor = hashIp(clientIpFrom(request.headers)) ?? "anonymous"
  try {
    client.capture({
      distinctId: `tool-visitor-${visitor}`,
      event: "url_tool_run",
      properties: {
        tool: event.tool,
        domain: event.url?.hostname.replace(/^www\./, "") ?? null,
        path: event.url?.pathname ?? null,
        ok: event.ok,
        duration_ms: Math.round(event.durationMs),
        error: event.error ?? null,
        $process_person_profile: false,
        ...event.properties,
      },
    })
  } catch (error) {
    console.error("url_tool_run capture failed:", error)
  }
}
