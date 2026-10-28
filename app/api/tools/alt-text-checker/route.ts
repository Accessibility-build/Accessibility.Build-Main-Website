import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { parsePublicUrl } from "@/lib/public-url"
import { scrollThrough, withRenderedPage } from "@/lib/render/browser"
import { recordUrlToolRun, toolErrorResponse, urlToolRateLimit } from "@/lib/render/route"
import { hasEnoughCredits, useCredits as chargeCredits } from "@/lib/credits"
import { checkTrialLimit, recordTrialUsage } from "@/lib/trial-usage"
import { hasServerUnlimitedAccess } from "@/lib/unlimited-access-server"
import { collectImages } from "@/lib/alt-text-audit/collector"
import { auditImages, countOutcomes, rankForReview } from "@/lib/alt-text-audit/rules"
import { CAPTURE_ATTRIBUTE, MAX_REVIEWED, captureImages, reviewImages, type Capture } from "@/lib/alt-text-audit/review"
import type { AiStatus, AltTextCheckResponse, CheckedImage } from "@/lib/alt-text-audit/types"

export const runtime = "nodejs"
export const maxDuration = 60

const TOOL = "alt_text_checker"
const MAX_IMAGES = 300
/** Leave room under the 60 s function limit for the response after the model call. */
const BUDGET_MS = 55_000
const MODEL_TIMEOUT_MS = 25_000
const MIN_MODEL_MS = 8_000

const rateLimit = urlToolRateLimit(15)

type Access =
  | { allowed: true; mode: "unlimited" | "trial" }
  | { allowed: true; mode: "credits"; userId: string }
  | { allowed: false; reason: "trial" | "credits" | "unavailable"; message: string }

/**
 * Who pays for the AI review: unlimited-access visitors nothing, signed-in visitors credits,
 * anonymous visitors their daily free reviews. Nothing is charged here; that happens only after
 * the model has answered. The messages are this tool's own, not the trial module's, which talks
 * about URL audits.
 */
async function checkAiAccess(): Promise<Access> {
  try {
    if (await hasServerUnlimitedAccess()) return { allowed: true, mode: "unlimited" }
    const user = await currentUser()
    if (user) {
      if (await hasEnoughCredits(TOOL, user.id)) return { allowed: true, mode: "credits", userId: user.id }
      return {
        allowed: false,
        reason: "credits",
        message: "The AI review costs 2 credits and your account doesn't have enough. The rule checks below are complete and free.",
      }
    }
    const trial = await checkTrialLimit(TOOL)
    if (trial.allowed) return { allowed: true, mode: "trial" }
    return {
      allowed: false,
      reason: "trial",
      message:
        "Free AI reviews are limited to two a day without an account, and this one wasn't available. The rule checks below are complete. Create a free account to run the AI review with credits.",
    }
  } catch (error) {
    console.error("Alt text checker access check failed:", error)
    return { allowed: false, reason: "unavailable", message: "We couldn't check your AI review allowance just now, so only the rule checks ran." }
  }
}

/** Records the use after a successful review. migration 0017 adds the enum value; until it is applied this logs and moves on. */
async function charge(access: Access & { allowed: true }, url: string, reviewed: number): Promise<number> {
  try {
    if (access.mode === "credits") {
      const result = await chargeCredits(TOOL, { url, reviewed }, { reviewed }, access.userId)
      return result.creditsUsed
    }
    if (access.mode === "trial") {
      const id = await recordTrialUsage(TOOL, undefined, { inputData: { url, reviewed } })
      if (!id) console.error("Alt text checker trial use was not recorded")
    }
  } catch (error) {
    console.error("Alt text checker could not record usage:", error)
  }
  return 0
}

export async function POST(request: NextRequest) {
  const limited = await rateLimit(request)
  if (limited) return limited

  const started = Date.now()
  let url: URL | null = null
  try {
    const body = await request.json().catch(() => ({}))
    url = await parsePublicUrl(body?.url)
    const wantsAi = body?.ai === true
    const access = wantsAi ? await checkAiAccess() : null
    // Screenshots stop here so the model call still has its full timeout inside the budget.
    const captureDeadline = started + BUDGET_MS - MODEL_TIMEOUT_MS

    const rendered = await withRenderedPage(url, { viewport: { width: 1280, height: 800 }, reducedMotion: true }, async ({ page, finalUrl, title }) => {
      await scrollThrough(page, 6000, { unlock: true })
      const collection = await page.evaluate(collectImages, { max: MAX_IMAGES, attribute: CAPTURE_ATTRIBUTE })
      const images = auditImages(collection.images)
      let captures: Capture[] = []
      if (access?.allowed) {
        captures = await captureImages(page, rankForReview(images), { max: MAX_REVIEWED, deadline: captureDeadline })
      }
      return { finalUrl, title, collection, images, captures }
    })

    const { collection, captures } = rendered
    const images: CheckedImage[] = rendered.images
    let ai: AiStatus = { status: "off" }

    if (access && !access.allowed) {
      ai = { status: "refused", reason: access.reason, message: access.message }
    } else if (access?.allowed) {
      const remaining = started + BUDGET_MS - Date.now()
      if (remaining < MIN_MODEL_MS || (!captures.length && Date.now() > captureDeadline)) {
        ai = { status: "failed", message: "The page took too long to load to leave time for the AI review. Nothing was charged." }
      } else if (!captures.length) {
        ai = {
          status: "failed",
          message: "None of the images could be captured for the AI review (they had not loaded, were too small, or sat in hidden carousel slides), so it didn't run and nothing was charged.",
        }
      } else {
        const signal = AbortSignal.any([AbortSignal.timeout(Math.min(MODEL_TIMEOUT_MS, remaining)), request.signal])
        const verdicts = await reviewImages({
          captures,
          page: { url: rendered.finalUrl, title: rendered.title, lang: collection.lang },
          signal,
        })
        if (!verdicts) {
          ai = { status: "failed", message: "The AI review didn't complete. The rule checks below are unaffected and nothing was charged." }
        } else {
          const byId = new Map(captures.map((capture) => [capture.image.id, capture]))
          for (const image of images) {
            const verdict = verdicts.get(image.id)
            const capture = byId.get(image.id)
            if (!verdict || !capture) continue
            image.ai = verdict
            image.capture = `data:image/jpeg;base64,${Buffer.from(capture.jpeg).toString("base64")}`
          }
          const creditsUsed = await charge(access, rendered.finalUrl, verdicts.size)
          ai = { status: "done", reviewed: verdicts.size, creditsUsed }
        }
      }
    }

    const counts = countOutcomes(images)
    const response: AltTextCheckResponse = {
      url: rendered.finalUrl,
      title: rendered.title,
      lang: collection.lang,
      checkedAt: new Date().toISOString(),
      images,
      summary: {
        ...counts,
        total: images.length,
        totalFound: collection.totalFound,
        truncated: collection.truncated,
        hidden: collection.skipped.hidden,
        tracking: collection.skipped.tracking,
        backgroundImages: collection.backgroundImages,
      },
      ai,
    }

    recordUrlToolRun(request, {
      tool: TOOL,
      url,
      ok: true,
      durationMs: Date.now() - started,
      properties: {
        images: images.length,
        failures: counts.fail,
        needs_review: counts.review,
        ai_requested: wantsAi,
        ai_status: ai.status,
        ai_reviewed: ai.status === "done" ? ai.reviewed : 0,
      },
    })
    return NextResponse.json(response)
  } catch (error) {
    recordUrlToolRun(request, {
      tool: TOOL,
      url,
      ok: false,
      durationMs: Date.now() - started,
      error: error instanceof Error ? error.message.slice(0, 200) : "unknown",
    })
    return toolErrorResponse(error, "The alt text check failed. Please try again.")
  }
}
