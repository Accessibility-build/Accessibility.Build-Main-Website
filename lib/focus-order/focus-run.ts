import "server-only"
import type { CDPSession, Page } from "puppeteer-core"
import { captureScreenshot } from "@/lib/render/browser"
import { FocusSequence, MIN_INDICATOR_PIXELS, PIXEL_THRESHOLD, backwardJumps, judgeIndicator, summariseFocus } from "@/lib/focus-order/analyse"
import { FREEZE_CSS, HELPERS_KEY, installHelpers, type InspectResult, type PageHelpers, type StopDetails } from "@/lib/focus-order/page-helpers"
import { decodePng, diffPixels, type DecodedPng } from "@/lib/focus-order/png"
import type { Box, FocusEnd, FocusProblem, FocusResult, FocusStop, IndicatorVerdict } from "@/lib/focus-order/types"

// Focus mode: press Tab the way a keyboard user does, and at every stop record what got focus,
// whether anything visibly changed, and whether other content was covering it.
//
// The visibility test is a pixel comparison, because computed styles cannot see an indicator drawn
// by a parent (:focus-within), a pseudo-element or a background image, and cannot tell an outline
// in the same colour as the page from a real one. For each stop: capture the element plus a margin
// while focused, move focus away and capture again, then focus it again. Chrome keeps
// :focus-visible on a script focus() after keyboard use (checked on real pages), so the restored
// state is the keyboard one. A third capture, taken only when something changed, catches regions
// that change on their own, such as videos and carousels.
//
// The run is budgeted by count (80 stops) and by time (25 seconds, or less if the page was slow to
// load), and the result says which limit ended it.

export const MAX_STOPS = 80
const LOOP_BUDGET_MS = 25_000
/** Presses spent inside one embedded frame before we stop following it. */
const MAX_FRAME_PRESSES = 40
/** Margin around the element for outlines and offsets, in CSS pixels. */
const CLIP_MARGIN = 8
/** Second look for indicators drawn on a surrounding container. */
const WIDE_CLIP_MARGIN = 40

type Helpers = Record<string, PageHelpers>

export interface FocusRunOptions {
  /** Epoch ms by which tabbing must stop, leaving time for the screenshot and the response. */
  deadline: number
}

export type FocusRun = Omit<FocusResult, "url" | "finalUrl" | "title" | "durationMs">

export async function runFocusOrder(page: Page, session: CDPSession, { deadline }: FocusRunOptions): Promise<FocusRun> {
  await page.bringToFront().catch(() => {})
  await page.evaluate(installHelpers, HELPERS_KEY)
  await page.evaluate((key: string, css: string) => (window as unknown as Helpers)[key].start(css), HELPERS_KEY, FREEZE_CSS)

  const inspect = () => page.evaluate((key: string) => (window as unknown as Helpers)[key].inspect(), HELPERS_KEY)
  const loopEnds = Math.min(Date.now() + LOOP_BUDGET_MS, deadline)
  const stops: FocusStop[] = []
  // The page numbers every element it sees, including ones only met while probing a trap, so a
  // stop's position in the list and the page's id for it can differ.
  const pageIds: number[] = []
  const stopOf = new Map<number, number>()
  const frameIds = new Set<number>()
  const revisits: FocusRun["revisits"] = []
  const focusLost: number[] = []
  const problems: FocusProblem[] = []
  let sequence = new FocusSequence()
  let ended: FocusEnd | null = null
  let loopIds: number[] = []
  let trapExit: TrapExit | null = null
  let consentClosed = false
  let lastId: number | null = null
  let emptyPresses = 0
  let framePresses = 0

  const classifyLoop = async (ids: number[]): Promise<{ end: FocusEnd; exit: TrapExit }> => ({
    end: (await allInDialog(page, ids)) ? "dialog" : "trap",
    exit: await probeExit(page, ids),
  })

  for (;;) {
    while (!ended) {
      if (stops.length >= MAX_STOPS) {
        ended = "stop-limit"
        break
      }
      if (Date.now() > loopEnds) {
        ended = "time-limit"
        break
      }

      let info: InspectResult
      try {
        await page.keyboard.press("Tab")
        info = await inspect()
      } catch {
        // The execution context went away: something navigated the page on focus.
        ended = "navigated"
        break
      }

      if (info.kind === "none") {
        if (stops.length === 0) {
          if (++emptyPresses >= 2) ended = "no-focusable"
          continue
        }
        // After the last element Chrome moves focus to its own controls, and one more Tab comes
        // back to the start. If it reaches a new element instead, a script dropped focus mid-page.
        try {
          await page.keyboard.press("Tab")
          info = await inspect()
        } catch {
          ended = "navigated"
          break
        }
        if (info.kind === "none" || !info.isNew) {
          ended = "left-page"
          break
        }
        focusLost.push(stops.length)
      }

      // Inside an embedded frame the parent document only sees the frame element, press after press.
      if (info.id === lastId && frameIds.has(info.id)) {
        if (++framePresses >= MAX_FRAME_PRESSES) ended = "frame-limit"
        continue
      }
      framePresses = 0
      lastId = info.id

      const outcome = sequence.next(info.id)
      if (outcome.type === "same") continue
      if (outcome.type === "stuck" || outcome.type === "loop") {
        loopIds = outcome.type === "stuck" ? [info.id] : pageIds.filter((id) => id >= outcome.fromId)
        ;({ end: ended, exit: trapExit } = await classifyLoop(loopIds))
        break
      }
      if (outcome.type === "wrapped") {
        // Chrome sends focus to its own controls after the last element, so going straight back
        // to the first stop means a script moved it. That is harmless if nothing was skipped.
        const unvisited = await page.evaluate((key: string) => (window as unknown as Helpers)[key].unvisitedFocusable(), HELPERS_KEY).catch(() => 0)
        if (unvisited > 0) {
          const firstId = info.id
          loopIds = pageIds.filter((id) => id >= firstId)
          ;({ end: ended, exit: trapExit } = await classifyLoop(loopIds))
        } else {
          ended = "wrapped"
        }
        break
      }
      if (outcome.type === "revisit") {
        const after = stops.length
        const to = stopOf.get(info.id)
        if (to && !revisits.some((entry) => entry.after === after && entry.to === to)) revisits.push({ after, to })
        continue
      }

      if (!info.details) continue
      if (info.details.frame) frameIds.add(info.id)
      const stop = await inspectStop(page, session, info.id, stops.length + 1, info.details)
      stops.push(stop)
      pageIds.push(info.id)
      stopOf.set(info.id, stop.index)
    }

    // A cookie consent dialog that holds focus is doing what a modal dialog should. Close it once,
    // with its reject button where there is one, and carry on with the page behind it.
    if (ended !== "dialog" || consentClosed || Date.now() > loopEnds) break
    const clicked = await page
      .evaluate((key: string, ids: number[]) => (window as unknown as Helpers)[key].dismissConsent(ids), HELPERS_KEY, loopIds)
      .catch(() => null)
    if (!clicked) break
    const held = loopIds.map((id) => stopOf.get(id)).filter((index): index is number => !!index)
    problems.push({
      kind: "consent-dialog",
      severity: "info",
      criterion: null,
      message: `A cookie dialog held focus (${stopRange(held)}), which is right for a modal dialog. We closed it with its "${clicked}" button and carried on with the page behind it.`,
    })
    consentClosed = true
    ended = null
    loopIds = []
    trapExit = null
    lastId = null
    sequence = new FocusSequence()
    await new Promise((resolve) => setTimeout(resolve, 600))
  }

  await session.send("Runtime.releaseObjectGroup", { objectGroup: OBJECT_GROUP }).catch(() => {})

  // Markers are measured where the screenshot will be taken: focus removed, scrolled to the top.
  await page.evaluate((key: string) => (window as unknown as Helpers)[key].finish(), HELPERS_KEY).catch(() => {})
  await new Promise((resolve) => setTimeout(resolve, 300))
  const markers = await page.evaluate((key: string) => (window as unknown as Helpers)[key].markers(), HELPERS_KEY).catch(() => [] as (Box | null)[])
  const positive = await page
    .evaluate((key: string) => (window as unknown as Helpers)[key].positiveTabindex(), HELPERS_KEY)
    .catch(() => ({ count: 0, selectors: [] as string[] }))
  const screenshot = await captureScreenshot(page, { maxHeight: 5000, quality: 60 })

  // Prefer where the element is in the screenshot. An element that is only shown while focused
  // (a skip link) is drawn where it appeared; a pinned one is not, since its page position moved.
  const inImage = (box: Box | null) =>
    !!box && box.x + box.width > 0 && box.x < screenshot.width && box.y + box.height > 0 && box.y < screenshot.height
  stops.forEach((stop, i) => {
    const now = roundBox(markers[pageIds[i]] ?? null)
    if (inImage(now) && (now!.width > 1 || now!.height > 1)) stop.marker = now
    else if (!stop.pinned && inImage(stop.focusBox) && stop.focusBox.width > 1) stop.marker = stop.focusBox
  })
  for (const jump of backwardJumps(stops)) {
    stops[jump.index - 1].problems.push({
      kind: "backward-jump",
      severity: "info",
      criterion: "2.4.3",
      message: `Focus jumped ${jump.distance} px back up the page from stop ${jump.index - 1}. Check that this order makes sense.`,
    })
  }

  const finalEnd: FocusEnd = ended ?? "stop-limit"
  const loop = loopIds.map((id) => stopOf.get(id)).filter((index): index is number => !!index)
  if (finalEnd === "trap") problems.push(trapProblem(loop, trapExit ?? "none"))
  for (const after of focusLost) {
    problems.push({
      kind: "focus-lost",
      severity: "warning",
      criterion: "2.4.3",
      message: `After stop ${after}, focus was dropped to the page itself, then the next Tab carried on to stop ${after + 1}. Keyboard and screen reader users lose their place when this happens.`,
    })
  }
  if (positive.count > 0) {
    problems.push({
      kind: "positive-tabindex",
      severity: "warning",
      criterion: "2.4.3",
      message: `${positive.count} element${positive.count === 1 ? " has" : "s have"} a positive tabindex, which moves ${positive.count === 1 ? "it" : "them"} ahead of everything else in the Tab order.`,
    })
  }

  return {
    mode: "focus",
    screenshot,
    stops,
    ended: finalEnd,
    endNote: endNote(finalEnd, stops.length, loop, trapExit),
    loop,
    trapExit,
    positiveTabindex: positive,
    // A revisit inside the loop that ended the run is the loop itself, already reported.
    revisits: revisits.filter((entry) => !loop.includes(entry.to)).slice(0, 20),
    problems,
    summary: summariseFocus(stops, positive.count, finalEnd === "trap" && trapExit === "none"),
  }
}

function stopRange(indexes: number[]): string {
  if (indexes.length === 0) return "its own buttons"
  return indexes.length === 1 ? `stop ${indexes[0]}` : `stops ${indexes[0]} to ${indexes[indexes.length - 1]}`
}

const OBJECT_GROUP = "focus-order-checker"

async function inspectStop(page: Page, session: CDPSession, id: number, index: number, info: StopDetails): Promise<FocusStop> {
  const problems: FocusProblem[] = []
  let indicator: IndicatorVerdict = "not-checked"
  let changedPixels = 0
  let styleChanges: string[] = []

  if (!info.frame && info.visibleBox) {
    const viewport = await viewportSize(page)
    let test = await compareFocus(page, session, id, clipFor(info.visibleBox, info.scrollX, info.scrollY, viewport, CLIP_MARGIN))
    // An indicator drawn on a container (a card that highlights through :focus-within) can sit
    // outside the tight clip. Look once more, wider, before calling it missing.
    if (test && test.verdict === "none") {
      const wider = await compareFocus(page, session, id, clipFor(info.visibleBox, info.scrollX, info.scrollY, viewport, WIDE_CLIP_MARGIN))
      if (wider && wider.verdict !== "none") test = wider
    }
    if (test) {
      indicator = test.verdict
      changedPixels = test.changed
      if (test.blurredStyle) styleChanges = Object.keys(info.style).filter((property) => info.style[property] !== test!.blurredStyle![property])
    }
  }

  const ax = await accessibleName(session, id)
  const name = ax?.name || info.name
  const role = ax?.role || info.roleAttr || info.tag

  // Pixels outrank geometry: a transparent control whose indicator shows on a sibling is fine,
  // and an element counted as covered while its indicator visibly changed is not entirely hidden.
  const hidden = info.hidden && info.visibleBox && indicator !== "none" ? null : info.hidden
  const covered = info.covered === "full" && indicator === "visible" ? "partial" : info.covered
  // A hidden control tested through its label is judged by the label: if the label was covered, that is the problem.
  const labelCovered = !!info.visibleBox && covered === "full"

  if (info.frame) {
    problems.push({
      kind: "frame",
      severity: "info",
      criterion: null,
      message: "Focus entered an embedded frame. Stops inside it are not inspected.",
    })
  } else if (hidden === "off-screen" && !labelCovered) {
    problems.push({
      kind: "off-screen",
      severity: "fail",
      criterion: "2.4.7",
      message: info.visibleBox
        ? "Focus landed on a control positioned off-screen, and its label did not change to show it."
        : "Focus landed on an element positioned off-screen, so nothing visible has focus.",
    })
  } else if (hidden && !labelCovered) {
    problems.push({
      kind: "invisible",
      severity: "fail",
      criterion: "2.4.7",
      message:
        hidden === "transparent"
          ? "Focus landed on a transparent element (opacity 0), and nothing on screen changed to show it."
          : hidden === "clipped"
            ? info.visibleBox
              ? "Focus landed on a visually hidden control, and its label did not change to show it."
              : "Focus landed on an element that is zero-size or clipped out of sight."
            : "Focus landed on an element that is not rendered.",
    })
  } else if (covered === "full") {
    problems.push({
      kind: "obscured",
      severity: "fail",
      criterion: "2.4.11",
      message: `The focused element was entirely hidden behind ${info.coveredBy ?? "other content"}. If that layer can be closed without moving focus, for example with Escape, this can still pass.`,
    })
  } else {
    if (indicator === "none") {
      const typing = /^(input|textarea)$/.test(info.tag) || /^(textbox|searchbox|combobox)$/.test(role)
      problems.push({
        kind: "no-indicator",
        severity: "fail",
        criterion: "2.4.7",
        message:
          (styleChanges.length > 0
            ? `No visible focus indicator: the ${listWords(styleChanges)} changed, but nothing on screen did.`
            : "No visible focus indicator: the element looks the same focused and unfocused.") +
          (typing ? " The blinking text cursor is not counted." : ""),
      })
    } else if (indicator === "uncertain") {
      problems.push({
        kind: "indicator-uncertain",
        severity: "info",
        criterion: "2.4.7",
        message: "This area changes on its own (a video, animation or carousel), so we could not tell whether focus is visible. Check it by hand.",
      })
    }
    if (covered === "partial") {
      problems.push({
        kind: "partly-obscured",
        severity: "info",
        criterion: "2.4.12",
        message: `Part of the focused element was behind ${info.coveredBy ?? "other content"}. That passes 2.4.11 (AA) but not 2.4.12 (AAA).`,
      })
    }
  }
  if (info.tabindex !== null && info.tabindex > 0) {
    problems.push({
      kind: "positive-tabindex",
      severity: "warning",
      criterion: "2.4.3",
      message: `tabindex="${info.tabindex}" takes this element out of the page's natural order.`,
    })
  }

  // A visually hidden control is placed where its label is, which is what a sighted user sees.
  const placed = info.hidden && info.visibleBox ? info.visibleBox : info.rect
  return {
    index,
    selector: info.selector,
    tag: info.tag,
    role,
    name,
    tabindex: info.tabindex,
    focusBox: roundBox({ x: placed.x + info.scrollX, y: placed.y + info.scrollY, width: placed.width, height: placed.height })!,
    marker: null,
    pinned: info.pinned,
    frame: info.frame,
    indicator,
    changedPixels,
    styleChanges,
    covered,
    coveredBy: covered === "none" ? null : info.coveredBy,
    problems,
  }
}

interface FocusComparison {
  verdict: IndicatorVerdict
  changed: number
  blurredStyle: Record<string, string> | null
}

/** Captures the clip focused, blurred and (when something changed) focused again, and judges the difference. */
async function compareFocus(page: Page, session: CDPSession, id: number, clip: Clip): Promise<FocusComparison | null> {
  const focused = await capture(session, clip)
  const blurredStyle = await page.evaluate((key: string, stopId: number) => (window as unknown as Helpers)[key].blur(stopId), HELPERS_KEY, id).catch(() => null)
  const blurred = await capture(session, clip)
  await page.evaluate((key: string, stopId: number) => (window as unknown as Helpers)[key].refocus(stopId), HELPERS_KEY, id).catch(() => null)
  const changed = focused && blurred ? diffPixels(focused, blurred, PIXEL_THRESHOLD) : null
  if (!focused || !changed) return null
  let again: number | null = null
  if (changed.changed >= MIN_INDICATOR_PIXELS) {
    const refocused = await capture(session, clip)
    again = refocused ? (diffPixels(focused, refocused, PIXEL_THRESHOLD)?.changed ?? null) : null
  }
  return { verdict: judgeIndicator(changed.changed, again), changed: changed.changed, blurredStyle }
}

async function viewportSize(page: Page): Promise<{ width: number; height: number }> {
  const viewport = page.viewport()
  return { width: viewport?.width ?? 1280, height: viewport?.height ?? 800 }
}

type Clip = { x: number; y: number; width: number; height: number; scale: number }

/** The element's visible part plus a margin for outlines, kept inside the viewport, in page coordinates. */
function clipFor(box: Box, scrollX: number, scrollY: number, viewport: { width: number; height: number }, margin: number): Clip {
  const left = Math.max(0, Math.floor(box.x - margin))
  const top = Math.max(0, Math.floor(box.y - margin))
  const right = Math.min(viewport.width, Math.ceil(box.x + box.width + margin))
  const bottom = Math.min(viewport.height, Math.ceil(box.y + box.height + margin))
  return { x: left + scrollX, y: top + scrollY, width: Math.max(1, right - left), height: Math.max(1, bottom - top), scale: 1 }
}

async function capture(session: CDPSession, clip: Clip): Promise<DecodedPng | null> {
  try {
    const { data } = await session.send("Page.captureScreenshot", { format: "png", clip, captureBeyondViewport: false, fromSurface: true })
    return decodePng(Buffer.from(data, "base64"))
  } catch {
    return null
  }
}

/** Chrome's own computed role and name for the stop, from the accessibility tree. */
async function accessibleName(session: CDPSession, id: number): Promise<{ role: string; name: string } | null> {
  try {
    const { result } = await session.send("Runtime.evaluate", {
      expression: `window[${JSON.stringify(HELPERS_KEY)}].stops[${id}]`,
      objectGroup: OBJECT_GROUP,
    })
    if (!result.objectId) return null
    const { nodes } = await session.send("Accessibility.getPartialAXTree", { objectId: result.objectId, fetchRelatives: false })
    const node = nodes.find((candidate) => !candidate.ignored) ?? nodes[0]
    if (!node) return null
    const role = typeof node.role?.value === "string" ? node.role.value : ""
    const name = typeof node.name?.value === "string" ? node.name.value.replace(/\s+/g, " ").trim() : ""
    return { role: role === "generic" || role === "none" ? "" : role, name: name.length > 80 ? `${name.slice(0, 77)}...` : name }
  } catch {
    return null
  }
}

type TrapExit = NonNullable<FocusResult["trapExit"]>

/**
 * When Tab stops making progress, tries the standard ways out: Escape then Tab (code editors and
 * menus), and for a single stuck element, Shift+Tab. 2.1.2 only fails when none of them work, or
 * when a non-standard way out is not explained to the user.
 */
async function probeExit(page: Page, stuckIds: number[]): Promise<TrapExit> {
  const stuck = new Set(stuckIds)
  const escaped = async () => {
    const now = await page.evaluate((key: string) => (window as unknown as Helpers)[key].inspect(), HELPERS_KEY)
    return now.kind === "none" || !stuck.has(now.id)
  }
  try {
    await page.keyboard.press("Escape")
    await page.keyboard.press("Tab")
    if (await escaped()) return "escape"
    if (stuck.size === 1) {
      await page.keyboard.down("Shift")
      await page.keyboard.press("Tab")
      await page.keyboard.up("Shift")
      if (await escaped()) return "shift-tab"
    }
  } catch {
    // The page navigated or closed; report what we saw before.
  }
  return "none"
}

function trapProblem(loop: number[], exit: TrapExit): FocusProblem {
  const where = stopRange(loop)
  if (exit === "escape") {
    return {
      kind: "trap",
      severity: "warning",
      criterion: "2.1.2",
      message:
        loop.length === 1
          ? `Tab does not move past ${where}, but pressing Escape and then Tab does. That passes only if the page tells keyboard users how to move on.`
          : `Tab cycles through ${where} until Escape is pressed. That passes only if the page tells keyboard users how to get out.`,
    }
  }
  if (exit === "shift-tab") {
    return {
      kind: "trap",
      severity: "warning",
      criterion: "2.1.2",
      message: `Tab does not move past ${where} because the page intercepts the key. Shift+Tab moves focus back, so focus is not completely trapped, but nothing after this stop can be reached with Tab.`,
    }
  }
  return {
    kind: "trap",
    severity: "fail",
    criterion: "2.1.2",
    message:
      loop.length === 1
        ? `Focus stayed on ${where} when Tab was pressed again, and neither Escape nor Shift+Tab moved it. Keyboard users are stuck there.`
        : `Tab kept cycling through ${where}, and Escape did not break the cycle, so the rest of the page cannot be reached.`,
  }
}

async function allInDialog(page: Page, ids: number[]): Promise<boolean> {
  if (ids.length === 0) return false
  return page.evaluate((key: string, list: number[]) => (window as unknown as Helpers)[key].allInDialog(list), HELPERS_KEY, ids).catch(() => false)
}

function roundBox(box: Box | null): Box | null {
  if (!box) return null
  return { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height) }
}

function listWords(words: string[]): string {
  if (words.length <= 1) return words.join("")
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`
}

function endNote(ended: FocusEnd, count: number, loop: number[], exit: TrapExit | null): string {
  const stops = `${count} stop${count === 1 ? "" : "s"}`
  switch (ended) {
    case "left-page":
      return `Tabbing reached the end of the page: after ${stops}, focus left the page for the browser's own controls.`
    case "wrapped":
      return `After ${stops}, focus went straight back to the first stop. Every visible focusable element had been reached.`
    case "stop-limit":
      return `We stopped after ${stops}, the most one check follows. Later stops on this page were not checked.`
    case "time-limit":
      return `We stopped after ${stops} because the time for one check ran out. Later stops on this page were not checked.`
    case "trap":
      return loop.length === 1
        ? `Tab stopped moving forward at stop ${loop[0]}, so we stopped there.`
        : `Tab kept cycling through ${stopRange(loop)}, so we stopped there.`
    case "dialog": {
      const where = stopRange(loop)
      return (
        `Focus stayed inside a dialog (${where}), so the rest of the page was not reached. That is right for a modal dialog, as long as it can be closed from the keyboard. ` +
        (exit === "escape" ? "Pressing Escape released focus." : "Pressing Escape did not release focus, so check that the dialog's own buttons close it.")
      )
    }
    case "frame-limit":
      return `Focus went into an embedded frame and stayed there for ${MAX_FRAME_PRESSES} presses, so we stopped after ${stops}.`
    case "no-focusable":
      return "Pressing Tab did not focus anything on this page."
    case "navigated":
      return `The page navigated away while we were tabbing, so we stopped after ${stops}.`
  }
}
