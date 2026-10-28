import { NextRequest, NextResponse } from "next/server"
import { parsePublicUrl } from "@/lib/public-url"
import { withRenderedPage } from "@/lib/render/browser"
import { recordUrlToolRun, toolErrorResponse, urlToolRateLimit } from "@/lib/render/route"
import { runFocusOrder } from "@/lib/focus-order/focus-run"
import { runTargetSize } from "@/lib/focus-order/targets-run"
import type { CheckMode, CheckResult, TargetDevice } from "@/lib/focus-order/types"

export const runtime = "nodejs"
export const maxDuration = 60

// POST { url, mode: "focus" | "targets", device?: "desktop" | "mobile" }. Loads the page in
// headless Chrome and either tabs through it (focus order, visibility, traps) or measures its
// pointer targets (WCAG 2.5.8). Targets can be measured on a phone viewport too, where touch
// targets matter most; tabbing is always done on desktop.
// The whole run has to finish in about 50 seconds, page load included, so tabbing is budgeted by
// time as well as by count and the result says when it stopped early.

const rateLimit = urlToolRateLimit(15)
const RUN_BUDGET_MS = 50_000
const DESKTOP = { width: 1280, height: 800 }
// A mid-sized phone: emulated touch and meta viewport, and a mobile user agent for sites that pick
// their layout from it.
const PHONE = { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true }
const PHONE_USER_AGENT =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36"
/** Time kept back after tabbing for the full-page screenshot and closing the browser. */
const SCREENSHOT_RESERVE_MS = 6_000

export async function POST(request: NextRequest) {
  const limited = await rateLimit(request)
  if (limited) return limited

  const started = Date.now()
  let url: URL | null = null
  let mode: CheckMode = "focus"
  let device: TargetDevice = "desktop"
  try {
    const body = await request.json().catch(() => ({}))
    mode = body?.mode === "targets" ? "targets" : "focus"
    device = mode === "targets" && body?.device === "mobile" ? "mobile" : "desktop"
    url = await parsePublicUrl(body?.url)
    const target = url

    const result: CheckResult = await withRenderedPage(
      target,
      {
        viewport: device === "mobile" ? PHONE : DESKTOP,
        userAgent: device === "mobile" ? PHONE_USER_AGENT : undefined,
        reducedMotion: true,
        navigationTimeoutMs: 20_000,
      },
      async (rendered) => {
        const run =
          mode === "focus"
            ? await runFocusOrder(rendered.page, await rendered.cdp(), { deadline: started + RUN_BUDGET_MS - SCREENSHOT_RESERVE_MS })
            : { ...(await runTargetSize(rendered.page)), device }
        return { ...run, url: target.toString(), finalUrl: rendered.finalUrl, title: rendered.title, durationMs: Date.now() - started }
      },
    )

    recordUrlToolRun(request, {
      tool: "focus_order_checker",
      url,
      ok: true,
      durationMs: Date.now() - started,
      properties: {
        mode,
        device,
        ...(result.mode === "focus"
          ? { stops: result.summary.stops, ended: result.ended }
          : { targets: result.totals.targets, failing: result.totals.failing }),
      },
    })
    return NextResponse.json(result)
  } catch (error) {
    recordUrlToolRun(request, {
      tool: "focus_order_checker",
      url,
      ok: false,
      durationMs: Date.now() - started,
      error: error instanceof Error ? error.message.slice(0, 200) : "unknown",
      properties: { mode, device },
    })
    return toolErrorResponse(error, "The focus order check failed. Please try again.")
  }
}
