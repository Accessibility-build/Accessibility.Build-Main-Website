import type { Box, FocusProblem, FocusStop, FocusSummary, IndicatorVerdict } from "@/lib/focus-order/types"

// The judgement calls of the focus order checker, kept apart from the browser automation so they
// can be tested on plain numbers: when a run of Tab presses is a trap, when a pixel difference is a
// visible focus indicator, which jumps up the page are worth a note, and the WCAG 2.5.8 spacing
// test for undersized targets.

/** Presses on the same element, after the first, before we call it stuck. */
export const STUCK_PRESSES = 2
/** Consecutive presses that only revisit earlier elements before we call it a loop. */
export const LOOP_PRESSES = 12

export type StepOutcome =
  | { type: "new" }
  | { type: "same" }
  | { type: "revisit"; id: number }
  | { type: "wrapped" }
  | { type: "stuck" }
  /** `fromId` is the earliest element in the loop; the loop runs from it to the latest new element. */
  | { type: "loop"; fromId: number }

/**
 * Follows the ids of the elements Tab lands on (each element gets an id the first time it is
 * focused, counting from 0) and says when the sequence has ended, wrapped or got stuck.
 */
export class FocusSequence {
  private first: number | null = null
  private last: number | null = null
  private samePresses = 0
  private revisitRun: number[] = []
  private readonly seen = new Set<number>()

  next(id: number): StepOutcome {
    if (this.first === null) {
      this.first = id
      this.last = id
      this.seen.add(id)
      return { type: "new" }
    }
    if (id === this.last) {
      this.samePresses += 1
      return this.samePresses >= STUCK_PRESSES ? { type: "stuck" } : { type: "same" }
    }
    this.samePresses = 0
    this.last = id
    if (id === this.first) return { type: "wrapped" }
    if (this.seen.has(id)) {
      this.revisitRun.push(id)
      if (this.revisitRun.length >= LOOP_PRESSES) return { type: "loop", fromId: Math.min(...this.revisitRun) }
      return { type: "revisit", id }
    }
    this.revisitRun = []
    this.seen.add(id)
    return { type: "new" }
  }
}

/**
 * Per-pixel threshold: a colour channel has to change by more than this (0 to 255) for the pixel to
 * count. It ignores antialiasing differences between two renders of the same state.
 */
export const PIXEL_THRESHOLD = 32

/**
 * Fewest changed pixels that count as a visible indicator. Calibrated on about 470 focus stops
 * across GOV.UK, BBC News, NPR, IKEA, Wikipedia, Dishoom, Monmouth Coffee and TodoMVC (October
 * 2026): stops with an indicator changed 78 pixels or more (the smallest was a 1 px ring
 * around a 20 px radio button), and stops without one, checked by eye, changed 0 to 3. A 1 px
 * outline around even a 6 by 16 px link changes well over 24.
 */
export const MIN_INDICATOR_PIXELS = 24

/**
 * Decides whether focus is visible from the pixel counts of three captures: focused (A), after
 * blur (B), and focused again (C). If A and C differ by as much as A and B, the area is changing on
 * its own (a video, a carousel, a ticker) and the comparison cannot be trusted.
 */
export function judgeIndicator(focusedVsBlurred: number, focusedVsRefocused: number | null): IndicatorVerdict {
  if (focusedVsBlurred < MIN_INDICATOR_PIXELS) return "none"
  if (focusedVsRefocused === null) return "visible"
  if (focusedVsRefocused >= MIN_INDICATOR_PIXELS && focusedVsRefocused * 2 >= focusedVsBlurred) return "uncertain"
  return "visible"
}

/** How far focus has to move back up the page, in CSS pixels, before it is worth a note. */
export const BACKWARD_JUMP_PX = 600

/** Marks stops where focus jumped well back up the page. Pinned elements and frames are ignored. */
export function backwardJumps(stops: Pick<FocusStop, "index" | "focusBox" | "pinned" | "frame">[]): { index: number; distance: number }[] {
  const jumps: { index: number; distance: number }[] = []
  for (let i = 1; i < stops.length; i += 1) {
    const previous = stops[i - 1]
    const current = stops[i]
    if (previous.pinned || current.pinned || previous.frame || current.frame) continue
    const distance = previous.focusBox.y - current.focusBox.y
    if (distance > BACKWARD_JUMP_PX) jumps.push({ index: current.index, distance: Math.round(distance) })
  }
  return jumps
}

export function summariseFocus(stops: FocusStop[], positiveTabindex: number, trap: boolean): FocusSummary {
  const has = (stop: FocusStop, kind: FocusProblem["kind"]) => stop.problems.some((problem) => problem.kind === kind)
  return {
    stops: stops.length,
    noIndicator: stops.filter((stop) => has(stop, "no-indicator")).length,
    uncertain: stops.filter((stop) => has(stop, "indicator-uncertain")).length,
    obscured: stops.filter((stop) => has(stop, "obscured")).length,
    partlyObscured: stops.filter((stop) => has(stop, "partly-obscured")).length,
    invisible: stops.filter((stop) => has(stop, "invisible") || has(stop, "off-screen")).length,
    positiveTabindex,
    backwardJumps: stops.filter((stop) => has(stop, "backward-jump")).length,
    frames: stops.filter((stop) => stop.frame).length,
    trap,
  }
}

// WCAG 2.5.8 Target Size (Minimum)

export const MIN_TARGET = 24
/** Subpixel layout can put a 24 px control at 23.98 px; that is not a real shortfall. */
const SIZE_TOLERANCE = 0.05

export function isUndersized(box: Box): boolean {
  return box.width < MIN_TARGET - SIZE_TOLERANCE || box.height < MIN_TARGET - SIZE_TOLERANCE
}

export interface SpacingTarget {
  box: Box
  /** Undersized and not covered by the inline or user agent exception, so it needs the spacing test. */
  needsSpacing: boolean
  /** Indexes (into the same array) of targets that contain this one, such as a link around a button. */
  ancestors: number[]
  /** In a fixed or sticky layer. Targets in different layers are not compared: a cookie banner's
   * buttons sit over the page, and the page targets under them cannot be pressed there. */
  pinned?: boolean
}

function distanceToBox(x: number, y: number, box: Box): number {
  const dx = Math.max(box.x - x, 0, x - (box.x + box.width))
  const dy = Math.max(box.y - y, 0, y - (box.y + box.height))
  return Math.hypot(dx, dy)
}

/**
 * The spacing exception of 2.5.8: a 24 px diameter circle centred on each undersized target must
 * not intersect another target, or the circle of another undersized target. Returns, for each
 * target that needs the test, the indexes of the targets it conflicts with (empty means it passes
 * by spacing). Targets nested inside each other are the same control and never conflict, and
 * targets in a pinned layer are only compared with each other.
 */
export function spacingConflicts(targets: SpacingTarget[]): Map<number, number[]> {
  const radius = MIN_TARGET / 2
  const result = new Map<number, number[]>()
  const nested = (a: number, b: number) => targets[a].ancestors.includes(b) || targets[b].ancestors.includes(a)

  for (let i = 0; i < targets.length; i += 1) {
    if (!targets[i].needsSpacing) continue
    const { box } = targets[i]
    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2
    const conflicts: number[] = []
    for (let j = 0; j < targets.length; j += 1) {
      if (j === i || nested(i, j) || !!targets[j].pinned !== !!targets[i].pinned) continue
      const other = targets[j]
      // Cheap reject before the exact tests: nothing within 2 diameters can touch.
      if (other.box.x > cx + MIN_TARGET * 2 || other.box.x + other.box.width < cx - MIN_TARGET * 2) continue
      if (other.box.y > cy + MIN_TARGET * 2 || other.box.y + other.box.height < cy - MIN_TARGET * 2) continue
      if (distanceToBox(cx, cy, other.box) < radius - 0.01) {
        conflicts.push(j)
        continue
      }
      if (other.needsSpacing) {
        const ox = other.box.x + other.box.width / 2
        const oy = other.box.y + other.box.height / 2
        if (Math.hypot(cx - ox, cy - oy) < MIN_TARGET - 0.01) conflicts.push(j)
      }
    }
    result.set(i, conflicts)
  }
  return result
}
