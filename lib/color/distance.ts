/**
 * Perceptual color difference (ΔE).
 *
 * Two metrics:
 *   - ΔE-OK (Euclidean in OKLab) — fast, good for rough distinguishability checks.
 *     ~0.5 is a just-noticeable difference; >2 is clearly different.
 *   - ΔE2000 (CIEDE2000) — the gold standard for perceptual difference in CIELab.
 *     ~1.0 is a JND; >2 is clearly different.
 */

import { differenceCiede2000, differenceEuclidean, parse } from "culori/fn"

const deltaEOkFn = differenceEuclidean("oklab")
const deltaE2000Fn = differenceCiede2000()

function parseSafe(hex: string) {
  return parse(hex) ?? { mode: "rgb", r: 0, g: 0, b: 0 }
}

export function deltaEOK(a: string, b: string): number {
  return deltaEOkFn(parseSafe(a), parseSafe(b))
}

export function deltaE2000(a: string, b: string): number {
  return deltaE2000Fn(parseSafe(a), parseSafe(b))
}

export type DistinguishabilityLevel = "identical" | "subtle" | "noticeable" | "clear"

/** Categorize an OKLab ΔE into a human-readable distinguishability bucket. */
export function distinguishability(deltaOk: number): DistinguishabilityLevel {
  if (deltaOk < 0.02) return "identical"
  if (deltaOk < 0.05) return "subtle"
  if (deltaOk < 0.1) return "noticeable"
  return "clear"
}

/**
 * Audit a categorical palette (e.g. chart colors). Returns the closest pair and
 * a list of any pairs that are visually too close to distinguish.
 */
export interface PaletteAudit {
  closestPair: { a: string; b: string; deltaOk: number } | null
  collisions: { a: string; b: string; deltaOk: number }[]
  averageDistance: number
}

export function auditCategorical(colors: string[], threshold = 0.05): PaletteAudit {
  if (colors.length < 2) {
    return { closestPair: null, collisions: [], averageDistance: 0 }
  }
  let closest: PaletteAudit["closestPair"] = null
  const collisions: PaletteAudit["collisions"] = []
  let sum = 0
  let n = 0
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const d = deltaEOK(colors[i], colors[j])
      sum += d
      n++
      if (!closest || d < closest.deltaOk) closest = { a: colors[i], b: colors[j], deltaOk: d }
      if (d < threshold) collisions.push({ a: colors[i], b: colors[j], deltaOk: d })
    }
  }
  return { closestPair: closest, collisions, averageDistance: n ? sum / n : 0 }
}
