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

  // WCAG does not count overlapping area toward a target's size. A hit area that a ::before or
  // ::after extends over another target is not trusted, and the element's own box is measured
  // instead: two overlapping 44 px hit areas fail, two that only touch pass.
  const overlap = (a: MeasuredTarget["box"], b: MeasuredTarget["box"]) =>
    Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 0.5 && Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 0.5
  const nested = (i: number, j: number) => measured[i].ancestors.includes(j) || measured[j].ancestors.includes(i)
  const overlapping = new Set<number>()
  measured.forEach((target, i) => {
    if (!target.expanded) return
    if (measured.some((other, j) => j !== i && !nested(i, j) && other.pinned === target.pinned && overlap(target.box, other.box))) overlapping.add(i)
  })
  const effective = measured.map((target, i) => (overlapping.has(i) ? { ...target, box: target.ownBox } : target))
  const pseudoHitAreas = effective.filter((target, i) => target.expanded && !overlapping.has(i) && isUndersized(target.ownBox) && !isUndersized(target.box)).length

  const conflicts = spacingConflicts(
    effective.map((target) => ({
      box: target.box,
      needsSpacing: isUndersized(target.box) && !target.exempt,
      ancestors: target.ancestors,
      pinned: target.pinned,
    })),
  )

  const undersized: { target: MeasuredTarget; status: TargetStatus; conflicts: number[]; overlaps: boolean }[] = []
  effective.forEach((target, i) => {
    if (!isUndersized(target.box)) return
    const clash = conflicts.get(i) ?? []
    const status: TargetStatus = target.exempt ?? (clash.length > 0 ? "fail" : "spacing")
    undersized.push({ target, status, conflicts: clash, overlaps: overlapping.has(i) })
  })
  undersized.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.target.box.y - b.target.box.y || a.target.box.x - b.target.box.x)

  const label = (target: MeasuredTarget) => target.name || target.selector || target.tag
  const targets: TargetItem[] = undersized.slice(0, MAX_LISTED).map(({ target, status, conflicts: clash, overlaps }, i) => ({
    index: i + 1,
    selector: target.selector,
    tag: target.tag,
    role: target.role,
    name: target.name,
    box: roundBox(target.box),
    status,
    conflicts: clash.slice(0, 3).map((j) => label(measured[j])),
    ...(overlaps ? { hitArea: "overlaps" as const } : {}),
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
      pseudoHitAreas,
    },
  }
}

function roundBox(box: MeasuredTarget["box"]) {
  const tenth = (value: number) => Math.round(value * 10) / 10
  return { x: tenth(box.x), y: tenth(box.y), width: tenth(box.width), height: tenth(box.height) }
}
