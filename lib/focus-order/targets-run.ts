import "server-only"
import type { Page } from "puppeteer-core"
import { captureScreenshot, scrollThrough } from "@/lib/render/browser"
import { MIN_TARGET, isUndersized, spacingConflicts } from "@/lib/focus-order/analyse"
import { FREEZE_CSS, HELPERS_KEY, installHelpers, type MeasuredTarget, type PageHelpers } from "@/lib/focus-order/page-helpers"
import type { TargetItem, TargetStatus, TargetsResult } from "@/lib/focus-order/types"

// Targets mode, WCAG 2.5.8 Target Size (Minimum): measure every visible pointer target against
// 24 by 24 CSS pixels, then apply the exceptions a page can show evidence for. Spacing is
// geometry; inline is a link inside a sentence; user agent is a native control left at the
// browser's default size. The essential exception needs human judgement and is left to the copy.

/** Most undersized targets returned, so the response stays small on link-heavy pages. */
const MAX_LISTED = 300
const STATUS_ORDER: Record<TargetStatus, number> = { fail: 0, spacing: 1, inline: 2, "user-agent": 3 }

export type TargetsRun = Omit<TargetsResult, "url" | "finalUrl" | "title" | "durationMs">

export async function runTargetSize(page: Page): Promise<TargetsRun> {
  // Lazy content loads as the page scrolls, and would shift everything measured before it.
  await scrollThrough(page, 5000)
  await page.evaluate(installHelpers, HELPERS_KEY)
  const measured = await page.evaluate(
    (key: string, css: string, minSize: number) => {
      const helpers = (window as unknown as Record<string, PageHelpers>)[key]
      helpers.start(css)
      return helpers.measureTargets(minSize)
    },
    HELPERS_KEY,
    FREEZE_CSS,
    MIN_TARGET - 0.05,
  )
  const screenshot = await captureScreenshot(page, { maxHeight: 5000, quality: 60 })

  const conflicts = spacingConflicts(
    measured.map((target) => ({
      box: target.box,
      needsSpacing: isUndersized(target.box) && !target.exempt,
      ancestors: target.ancestors,
      pinned: target.pinned,
    })),
  )

  const undersized: { target: MeasuredTarget; status: TargetStatus; conflicts: number[] }[] = []
  measured.forEach((target, i) => {
    if (!isUndersized(target.box)) return
    const clash = conflicts.get(i) ?? []
    const status: TargetStatus = target.exempt ?? (clash.length > 0 ? "fail" : "spacing")
    undersized.push({ target, status, conflicts: clash })
  })
  undersized.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.target.box.y - b.target.box.y || a.target.box.x - b.target.box.x)

  const label = (target: MeasuredTarget) => target.name || target.selector || target.tag
  const targets: TargetItem[] = undersized.slice(0, MAX_LISTED).map(({ target, status, conflicts: clash }, i) => ({
    index: i + 1,
    selector: target.selector,
    tag: target.tag,
    role: target.role,
    name: target.name,
    box: roundBox(target.box),
    status,
    conflicts: clash.slice(0, 3).map((j) => label(measured[j])),
  }))

  const count = (status: TargetStatus) => undersized.filter((entry) => entry.status === status).length
  return {
    mode: "targets",
    screenshot,
    targets,
    listTruncated: undersized.length > MAX_LISTED,
    totals: {
      targets: measured.length,
      largeEnough: measured.length - undersized.length,
      undersized: undersized.length,
      failing: count("fail"),
      passBySpacing: count("spacing"),
      inline: count("inline"),
      userAgent: count("user-agent"),
    },
  }
}

function roundBox(box: MeasuredTarget["box"]) {
  const tenth = (value: number) => Math.round(value * 10) / 10
  return { x: tenth(box.x), y: tenth(box.y), width: tenth(box.width), height: tenth(box.height) }
}
