import "server-only"
import { captureScreenshot, scrollThrough, withRenderedPage, type Screenshot } from "@/lib/render/browser"

/**
 * One screenshot of a public page for the website vision simulator. The filters run in the
 * visitor's browser, so the server's whole job is a faithful capture: a 1280 wide desktop viewport,
 * reduced motion so carousels hold still, a scroll through so lazy images load, then a JPEG of up
 * to 4000 px from the top.
 *
 * The JSON has to stay well under Vercel's 4.5 MB response cap, so a capture over about 3 MB is
 * retaken at lower quality, and as a last resort shorter. Failed navigations (Chrome's own error
 * page) are refused by withRenderedPage before this runs.
 */

export const VISION_VIEWPORT = { width: 1280, height: 800 }
export const VISION_MAX_HEIGHT = 4000
/** Data URL characters, which is also the JSON cost. */
export const VISION_MAX_DATA_URL = 3_000_000
const QUALITIES = [70, 55, 40]

export interface VisionScreenshot extends Screenshot {
  /** The JPEG quality the capture ended at. */
  quality: number
  /** Decoded size of the JPEG. */
  bytes: number
}

export interface VisionCapture {
  finalUrl: string
  title: string
  screenshot: VisionScreenshot
}

export async function captureForVision(url: URL): Promise<VisionCapture> {
  return withRenderedPage(url, { viewport: VISION_VIEWPORT, reducedMotion: true }, async ({ page, finalUrl, title }) => {
    await scrollThrough(page, VISION_MAX_HEIGHT)

    let quality = QUALITIES[0]
    let maxHeight = VISION_MAX_HEIGHT
    let shot = await captureScreenshot(page, { maxHeight, quality })
    for (const next of QUALITIES.slice(1)) {
      if (shot.dataUrl.length <= VISION_MAX_DATA_URL) break
      quality = next
      shot = await captureScreenshot(page, { maxHeight, quality })
    }
    // Still too large at the lowest quality (very busy imagery): capture less of the page.
    while (shot.dataUrl.length > VISION_MAX_DATA_URL && maxHeight > 1600) {
      maxHeight = Math.round(maxHeight * 0.7)
      shot = await captureScreenshot(page, { maxHeight, quality })
    }

    const base64Length = shot.dataUrl.length - shot.dataUrl.indexOf(",") - 1
    return {
      finalUrl,
      title: title.replace(/\s+/g, " ").trim().slice(0, 200),
      screenshot: { ...shot, quality, bytes: Math.floor((base64Length * 3) / 4) },
    }
  })
}
