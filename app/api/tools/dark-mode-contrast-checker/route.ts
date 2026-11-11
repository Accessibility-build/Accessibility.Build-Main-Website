import { NextRequest, NextResponse } from "next/server"
import { parsePublicUrl } from "@/lib/public-url"
import { withRenderedPage } from "@/lib/render/browser"
import { recordUrlToolRun, toolErrorResponse, urlToolRateLimit } from "@/lib/render/route"
import { runDarkModeCheck } from "@/lib/dark-mode/run"
import type { DarkModeResult } from "@/lib/dark-mode/types"

export const runtime = "nodejs"
export const maxDuration = 60

// POST { url }. Loads the page once in headless Chrome with a light colour scheme, then switches
// the emulated preference to dark and reloads, running axe colour contrast in each, and finally
// takes a screenshot with Chromium's automatic dark theme as a stand-in for Safari's Adaptive
// Dark Mode. Everything has to finish in about 50 seconds, page load included; the work in
// lib/dark-mode/run.ts budgets each step against that deadline.

const rateLimit = urlToolRateLimit(15)
const RUN_BUDGET_MS = 50_000

export async function POST(request: NextRequest) {
  const limited = await rateLimit(request)
  if (limited) return limited

  const started = Date.now()
  let url: URL | null = null
  try {
    const body = await request.json().catch(() => ({}))
    url = await parsePublicUrl(body?.url)
    const target = url

    const result: DarkModeResult = await withRenderedPage(
      target,
      { viewport: { width: 1280, height: 800 }, reducedMotion: true, colorScheme: "light", navigationTimeoutMs: 20_000 },
      async (rendered) => {
        const run = await runDarkModeCheck(rendered, { deadline: started + RUN_BUDGET_MS })
        return { ...run, url: target.toString(), durationMs: Date.now() - started }
      },
    )

    recordUrlToolRun(request, {
      tool: "dark_mode_contrast_checker",
      url,
      ok: true,
      durationMs: Date.now() - started,
      properties: {
        supports: result.declaration.supports,
        verdict: result.adaptive.verdict,
        dark_only: result.counts.darkOnly,
        light_only: result.counts.lightOnly,
        both: result.counts.both,
        invisible: result.counts.invisible,
        responds_to_dark: result.darkTheme.respondsToPreference,
        dark_tested: result.dark !== null,
      },
    })
    return NextResponse.json(result)
  } catch (error) {
    recordUrlToolRun(request, {
      tool: "dark_mode_contrast_checker",
      url,
      ok: false,
      durationMs: Date.now() - started,
      error: error instanceof Error ? error.message.slice(0, 200) : "unknown",
    })
    return toolErrorResponse(error, "The dark mode contrast check failed. Please try again.")
  }
}
