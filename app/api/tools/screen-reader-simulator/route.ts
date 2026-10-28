import { NextRequest, NextResponse } from "next/server"
import { PublicUrlError, parsePublicUrl } from "@/lib/public-url"
import { scrollThrough, withRenderedPage } from "@/lib/render/browser"
import { recordUrlToolRun, toolErrorResponse, urlToolRateLimit } from "@/lib/render/route"
import { buildTranscript, displayMapFromSnapshot } from "@/lib/screen-reader/transcript"
import type { ScreenReaderResult } from "@/lib/screen-reader/types"

// Screen reader preview: renders a public page in headless Chrome, reads the computed
// accessibility tree over CDP, and returns a browse-mode transcript plus the headings, landmarks,
// links, fields, images and buttons a screen reader user would list. Only the compact transcript
// leaves the server; the raw tree runs to megabytes on a large page.

export const runtime = "nodejs"
export const maxDuration = 60

const TOOL = "screen_reader_simulator"
const limit = urlToolRateLimit(15)

/**
 * Elements read from a very large page. The single-page HTML specification has over 300,000, and
 * its tree alone outgrows the function's time and memory; Wikipedia's United Kingdom article has
 * about 19,000. Past this, the rest of the page is removed before the tree is read.
 */
const MAX_ELEMENTS = 30_000
/** Budget for reading the tree once the page has rendered. */
const TREE_TIMEOUT_MS = 15_000

/** Runs in the page: removes everything after the first `max` elements in source order. */
function trimPage(max: number): { elements: number; read: number } {
  const all = document.getElementsByTagName("*")
  const total = all.length
  if (total <= max) return { elements: total, read: total }
  const cut = all[max]
  let node: Node | null = cut
  while (node && node !== document.documentElement) {
    while (node.nextSibling) node.parentNode?.removeChild(node.nextSibling)
    node = node.parentNode
  }
  cut.parentNode?.removeChild(cut)
  return { elements: total, read: document.getElementsByTagName("*").length }
}

function withTimeout<T>(work: Promise<T>, ms: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new PublicUrlError(message, 504)), ms)
  })
  return Promise.race([work, timeout]).finally(() => clearTimeout(timer))
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now()
  const limited = await limit(request)
  if (limited) return limited

  let url: URL | null = null
  try {
    const body = await request.json().catch(() => null)
    const target = await parsePublicUrl(body?.url)
    url = target

    const result: ScreenReaderResult = await withRenderedPage(target, { blockMedia: true, reducedMotion: true }, async (rendered) => {
      // Lazy sections only join the tree once they have been scrolled near.
      await scrollThrough(rendered.page)
      const size = await rendered.page.evaluate(trimPage, MAX_ELEMENTS)
      const cdp = await rendered.cdp()
      await cdp.send("Accessibility.enable")
      const { nodes } = await withTimeout(
        cdp.send("Accessibility.getFullAXTree"),
        TREE_TIMEOUT_MS,
        "This page is too large to preview in the time we have. Try a shorter page from the same site.",
      )
      // Display values tell inline elements from blocks, so text joins into lines the way it reads.
      // Without them the builder falls back to a structural guess.
      const display = await cdp
        .send("DOMSnapshot.captureSnapshot", { computedStyles: ["display"] })
        .then(displayMapFromSnapshot)
        .catch(() => undefined)
      const transcript = buildTranscript(nodes, { display })
      return {
        ...transcript,
        title: transcript.title || rendered.title,
        url: target.toString(),
        finalUrl: rendered.finalUrl,
        trimmed: size.read < size.elements ? size : undefined,
      }
    })

    const problems = Object.values(result.summaries).reduce((sum, summary) => sum + summary.problems, 0)
    recordUrlToolRun(request, {
      tool: TOOL,
      url,
      ok: true,
      durationMs: Date.now() - startedAt,
      properties: { lines: result.totalLines, truncated: result.truncated, trimmed: Boolean(result.trimmed), problems },
    })
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    recordUrlToolRun(request, {
      tool: TOOL,
      url,
      ok: false,
      durationMs: Date.now() - startedAt,
      error: error instanceof PublicUrlError ? error.message : "unexpected",
    })
    return toolErrorResponse(error, "The screen reader preview failed. Please try again.")
  }
}
