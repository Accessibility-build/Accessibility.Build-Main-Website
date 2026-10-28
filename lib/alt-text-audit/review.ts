import "server-only"
import { generateText, tool } from "ai"
import type { Page } from "puppeteer-core"
import { z } from "zod"
import { ASSISTANT_MODEL, NO_REASONING, openrouterFor } from "@/lib/assistant/model"
import { locateForCapture } from "./collector"
import { normalizeText } from "./rules"
import type { AiVerdict, AiVerdictKind, AuditedImage } from "./types"

// The optional AI review: screenshots of up to eight images, each sent with its current alt and
// its context, in one vision call. The model judges the alt text in context and suggests better
// text. A forced tool call returns the verdicts as validated structured data, as in
// lib/assistant/intent.ts (Claude via OpenRouter does not return reliable JSON through
// response_format).

// Its own client so the review's spend shows separately from Curb's on OpenRouter.
const reviewProvider = openrouterFor("Accessibility.build Alt Text Checker")

export const CAPTURE_ATTRIBUTE = "data-alt-check"
export const MAX_REVIEWED = 8
const LONGEST_SIDE = 768
const SHORTEST_UPSCALED = 96

export interface Capture {
  image: AuditedImage
  /** JPEG bytes, longest side at most 768 px. */
  jpeg: Uint8Array
}

/**
 * Screenshots the ranked images in order until `max` have been captured, skipping any that a
 * screenshot would misrepresent (clipped or faded carousel slides). Each image is shot on its own,
 * with the rest of the page hidden, so banners and text laid over it are not in the picture.
 */
export async function captureImages(page: Page, ranked: AuditedImage[], { max = MAX_REVIEWED, deadline }: { max?: number; deadline: number }): Promise<Capture[]> {
  const captures: Capture[] = []
  if (!ranked.length) return captures

  // Straight to CDP rather than elementHandle.screenshot or page.screenshot: both drop the clip's
  // scale when the clip is inside the viewport, and scale is what keeps the longest side at 768 px.
  const session = await page.createCDPSession()
  try {
    for (const image of ranked.slice(0, max * 2)) {
      if (captures.length >= max || Date.now() > deadline) break
      try {
        const box = await page.evaluate(locateForCapture, { attribute: CAPTURE_ATTRIBUTE, id: image.id })
        if ("skip" in box) continue
        const longest = Math.max(box.width, box.height)
        const scale = longest > LONGEST_SIDE ? LONGEST_SIDE / longest : longest < SHORTEST_UPSCALED ? Math.min(4, SHORTEST_UPSCALED / longest) : 1
        const shot = await withTimeout(
          session.send("Page.captureScreenshot", { format: "jpeg", quality: 70, clip: { ...box, scale }, captureBeyondViewport: false }),
          5_000,
        )
        if (shot?.data) captures.push({ image, jpeg: new Uint8Array(Buffer.from(shot.data, "base64")) })
      } catch {
        // A failed capture just means this image is not reviewed.
      }
    }
  } finally {
    await session.detach().catch(() => {})
  }
  return captures
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([promise, new Promise<null>((resolve) => setTimeout(() => resolve(null), ms))])
}

const VERDICTS = ["accurate", "incomplete", "inaccurate", "should_be_decorative", "decorative_and_fine", "needs_alt"] as const

const ReviewSchema = z.object({
  verdicts: z
    .array(
      z.object({
        image: z.number().int().describe("The image number from the prompt."),
        verdict: z
          .enum(VERDICTS)
          .describe(
            "accurate: the current alt conveys what the image contributes here. incomplete: on the right lines but misses something that matters, such as text in the image or a linked image's destination. inaccurate: describes something else, or is a file name, placeholder or misleading. should_be_decorative: has alt text, but the image is pure decoration (a pattern, divider, background flourish, mood texture) or the alt repeats text right next to it almost word for word, so alt=\"\" is better. Not for a photo whose alt describes who or what it shows, and never for the only content of a link or button. decorative_and_fine: alt is empty and the image is decoration or duplicates adjacent text. needs_alt: alt is missing or empty but the image carries information or is the only content of a link or button.",
          ),
        reason: z.string().describe("One plain sentence, under 160 characters, saying why."),
        suggestedAlt: z
          .string()
          .describe("The alt text you recommend. Empty string when the image should be decorative. Repeat the current alt when it is already accurate."),
      }),
    )
    .describe("One entry per image, in order."),
})

const SYSTEM = `You review the alt text of images on a web page for an accessibility checker. For each numbered image you get a screenshot of the image as it appears on the page, its current text alternative, the link or button it sits in (if any) and nearby text. Judge the current alt text in that context, then suggest the alt text the page should use.

Each screenshot shows only the image: the rest of the page, including any text laid over the image, is hidden, and grey areas are transparent parts of the image. Text you can see in a screenshot is part of the image itself.

Good alt text depends on what the image is doing:
- Informative image: say what it shows that matters here, in a short phrase or sentence, usually under 125 characters. Leave out details that do not matter in this context.
- Functional image (the only content of a link or button): say where the link goes or what the button does, for example "Acme home page" or "Search", not what the picture looks like.
- Decorative image, or one whose alt would repeat text right next to it (a caption, the link's own text): alt="" so screen readers skip it. A photo that shows something the surrounding text does not say (who or what is pictured, a place, a product) is informative even beside a headline, so judge whether its alt describes it; choose should_be_decorative only for pure decoration or alt that repeats nearby text almost word for word.
- Image inside a link or button that already has its own text: that text names the control, even when it is visually hidden. Use alt="" unless the image shows something the text does not, and never repeat the text in the alt.
- Image of text (a logo, a banner, a button graphic): include the words shown when they matter.
- Complex image (a chart, a diagram, a map): a short summary of the point it makes; the detail belongs in nearby text or a linked description.

Rules for suggestions:
- Never start with "image of", "picture of", "graphic of" or "photo of", and never say that it is a link or a button.
- Write in the page's language.
- Do not invent details you cannot see in the screenshot or read in the context, such as names of people or places.
- If a screenshot is blank, cut off or clearly not the image described, say so in the reason and judge from the context, choosing "incomplete" when you cannot tell.

Call the record_verdicts tool once, with a verdict for every image.`

function quote(text: string | null | undefined, limit = 240): string {
  const value = (text || "").replace(/\s+/g, " ").trim()
  return value.length > limit ? `"${value.slice(0, limit - 1)}…"` : `"${value}"`
}

function describe(image: AuditedImage, index: number): string {
  const lines = [`Image ${index}`]
  if (image.kind === "svg" || image.kind === "role-img") {
    lines.push(`Element: ${image.kind === "svg" ? "inline svg" : `<${image.tag} role="img">`}`)
    lines.push(`Current name: ${image.ariaHidden ? "hidden with aria-hidden" : image.name ? quote(image.name) : "none"}`)
  } else {
    lines.push(`Element: ${image.kind === "input-image" ? '<input type="image"> (an image button)' : "<img>"}`)
    lines.push(
      `Current alt: ${
        image.ariaHidden
          ? "hidden with aria-hidden"
          : image.altState === "missing"
            ? `missing (no alt attribute)${image.name ? `; the ${image.nameSource} is ${quote(image.name)}` : ""}`
            : image.altState === "empty"
              ? 'empty (alt=""), marked as decorative'
              : quote(image.alt)
      }`,
    )
  }
  const control = image.control
  if (control && !control.self) {
    const destination = control.href ? ` to ${control.href}` : ""
    lines.push(
      image.onlyContent
        ? `Inside a ${control.kind}${destination}. The image is the only content of the ${control.kind}, so its alt is the ${control.kind}'s name and it can never be decorative.`
        : `Inside a ${control.kind}${destination} that already has its own text, ${quote(control.label || control.text || control.title)}, which names it. Any alt on this image is read as well.`,
    )
  } else if (control?.self && control.href) {
    lines.push(`It is an image map link to ${control.href}.`)
  }
  if (image.caption) lines.push(`Figure caption: ${quote(image.caption)}`)
  if (image.heading) lines.push(`Nearest heading before it: ${quote(image.heading, 120)}`)
  if (image.nearbyText) lines.push(`Nearby text: ${quote(image.nearbyText)}`)
  lines.push(`Shown at ${image.width} by ${image.height} pixels.`)
  return lines.join("\n")
}

function tidy(text: string, limit: number): string {
  const value = text.replace(/\s+/g, " ").trim()
  return value.length > limit ? `${value.slice(0, limit - 1)}…` : value
}

/** Strips quotes and a leading "image of", which the prompt asks for but models still write. */
function tidyAlt(text: string): string {
  const value = tidy(text, 250)
    .replace(/^["'“”‘’]+|["'“”‘’]+$/g, "")
    .replace(/^(?:an? |the )?(?:image|picture|graphic|photo|photograph) of\s+/i, "")
    .trim()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * Keeps a verdict consistent with facts the rules already know, since the model sometimes slips:
 * the only content of a link or button can never be decorative, and the two decorative verdicts
 * depend on whether there is alt text now.
 */
function settle(image: AuditedImage, entry: { verdict: AiVerdictKind; reason: string; suggestedAlt: string }): AiVerdict {
  let verdict = entry.verdict
  let reason = tidy(entry.reason, 240)
  const decorative = verdict === "should_be_decorative" || verdict === "decorative_and_fine"
  if (decorative && (image.onlyContent || image.control?.self)) {
    verdict = image.name ? "incomplete" : "needs_alt"
    reason = `It is the only content of its ${image.control?.kind ?? "control"}, so it cannot be decorative: its alt is the ${image.control?.kind ?? "control"}'s name.`
    return { verdict, reason, suggestedAlt: tidyAlt(entry.suggestedAlt) }
  }
  if (verdict === "decorative_and_fine" && image.name) verdict = "should_be_decorative"
  if (verdict === "accurate" && !image.name && image.altState === "empty") verdict = "decorative_and_fine"
  // "Incomplete" with the current alt as the suggestion gives nobody anything to change.
  const suggestion = tidyAlt(entry.suggestedAlt)
  if ((verdict === "incomplete" || verdict === "inaccurate") && image.name && normalizeText(suggestion) === normalizeText(image.name)) verdict = "accurate"
  // "Inaccurate" with an empty suggestion means the model wants alt="".
  if ((verdict === "incomplete" || verdict === "inaccurate") && image.name && !suggestion) verdict = "should_be_decorative"
  if (verdict === "should_be_decorative" && image.altState === "empty" && !image.name) verdict = "decorative_and_fine"
  if (verdict === "should_be_decorative" || verdict === "decorative_and_fine") return { verdict, reason, suggestedAlt: "" }
  return { verdict, reason, suggestedAlt: suggestion || (verdict === "accurate" ? image.name : "") }
}

/**
 * One vision call for all the captures. Returns verdicts keyed by image id, or null if the model
 * failed, timed out or returned nothing usable.
 */
export async function reviewImages({
  captures,
  page,
  signal,
}: {
  captures: Capture[]
  page: { url: string; title: string; lang: string }
  signal?: AbortSignal
}): Promise<Map<number, AiVerdict> | null> {
  if (!captures.length) return null
  const content: ({ type: "text"; text: string } | { type: "image"; image: Uint8Array; mediaType: string })[] = [
    {
      type: "text",
      text: `Page: ${quote(page.title, 160)} at ${page.url}${page.lang ? `, language ${page.lang}` : ""}.\n${captures.length} image${captures.length === 1 ? "" : "s"} follow.`,
    },
  ]
  captures.forEach((capture, index) => {
    content.push({ type: "text", text: describe(capture.image, index + 1) })
    content.push({ type: "image", image: capture.jpeg, mediaType: "image/jpeg" })
  })

  try {
    const result = await generateText({
      model: reviewProvider.chatModel(ASSISTANT_MODEL),
      system: SYSTEM,
      messages: [{ role: "user", content }],
      tools: { record_verdicts: tool({ description: "Record a verdict and suggested alt text for every image.", inputSchema: ReviewSchema }) },
      toolChoice: { type: "tool", toolName: "record_verdicts" },
      temperature: 0,
      maxOutputTokens: 2000,
      providerOptions: NO_REASONING,
      abortSignal: signal,
    })
    const parsed = ReviewSchema.safeParse(result.toolCalls[0]?.input)
    if (!parsed.success) {
      console.error("Alt text review returned an unusable result:", parsed.error.issues.slice(0, 3))
      return null
    }
    const verdicts = new Map<number, AiVerdict>()
    for (const entry of parsed.data.verdicts) {
      const capture = captures[entry.image - 1]
      if (!capture || verdicts.has(capture.image.id)) continue
      verdicts.set(capture.image.id, settle(capture.image, entry))
    }
    return verdicts.size ? verdicts : null
  } catch (error) {
    if (!signal?.aborted) console.error("Alt text review failed:", error)
    else console.error("Alt text review timed out")
    return null
  }
}
