/**
 * Auto-fix engine. Given a failing fg/bg pair, binary-search in OKLCH lightness
 * space for the smallest nudge that brings the pair above a target contrast.
 *
 * Monotonicity: as L decreases (for fg on light bg) or increases (fg on dark bg),
 * both WCAG luminance ratio and APCA |Lc| increase monotonically. So binary
 * search is well-defined.
 */

import { contrastRatioWCAG, hexToOklch, oklchToHex, relativeLuminance } from "./oklch"
import { apcaContrast } from "./apca"

export type ContrastMetric = "wcag" | "apca"

export interface NudgeOptions {
  /** Target contrast value (WCAG ratio or APCA |Lc|). */
  target: number
  /** Metric to optimise. Default 'wcag'. */
  metric?: ContrastMetric
  /** Side to nudge. Default 'fg'. */
  side?: "fg" | "bg"
  /** Max binary-search iterations. Default 24 (≈ 1e-7 precision). */
  iterations?: number
}

function evaluate(fg: string, bg: string, metric: ContrastMetric): number {
  return metric === "wcag" ? contrastRatioWCAG(fg, bg) : Math.abs(apcaContrast(fg, bg))
}

/** Returns the adjusted hex, or the original if no improvement is possible. */
export function nudgeForContrast(
  fg: string,
  bg: string,
  options: NudgeOptions
): string {
  const { target, metric = "wcag", side = "fg", iterations = 24 } = options
  const moving = side === "fg" ? fg : bg
  const fixed = side === "fg" ? bg : fg

  // Already passing → no change.
  const initial = evaluate(fg, bg, metric)
  if (initial >= target) return moving

  const mv = hexToOklch(moving)
  const fixedLum = relativeLuminance(fixed)

  // Direction: move L away from the fixed color's lightness to gain contrast.
  // For fg on light bg: decrease L. For fg on dark bg: increase L.
  // (Same logic regardless of which side we're moving.)
  const goDown = fixedLum > 0.5

  let lo: number
  let hi: number
  if (goDown) {
    lo = 0
    hi = mv.l
  } else {
    lo = mv.l
    hi = 1
  }

  // Verify the extreme passes; otherwise the target is unreachable along this axis.
  const extremeHex = oklchToHex({ l: goDown ? lo : hi, c: mv.c, h: mv.h })
  const extremeFg = side === "fg" ? extremeHex : fg
  const extremeBg = side === "fg" ? bg : extremeHex
  if (evaluate(extremeFg, extremeBg, metric) < target) {
    // Can't reach target even at black/white — also try zeroing chroma (sometimes helps).
    const zeroC = oklchToHex({ l: goDown ? lo : hi, c: 0, h: mv.h })
    return zeroC
  }

  for (let i = 0; i < iterations; i++) {
    const mid = (lo + hi) / 2
    const candHex = oklchToHex({ l: mid, c: mv.c, h: mv.h })
    const trialFg = side === "fg" ? candHex : fg
    const trialBg = side === "fg" ? bg : candHex
    const v = evaluate(trialFg, trialBg, metric)

    if (goDown) {
      // Passing → try higher L (less aggressive)
      if (v >= target) lo = mid
      else hi = mid
    } else {
      // Passing → try lower L (less aggressive)
      if (v >= target) hi = mid
      else lo = mid
    }
  }

  const finalL = goDown ? lo : hi
  return oklchToHex({ l: finalL, c: mv.c, h: mv.h })
}

export interface AutoFixSuggestion {
  pairingId: string
  before: { fg: string; bg: string; value: number }
  after: { fg: string; bg: string; value: number }
  side: "fg" | "bg"
  metric: ContrastMetric
}
