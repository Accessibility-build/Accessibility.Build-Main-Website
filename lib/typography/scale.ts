/**
 * Modular typography scale generator.
 *
 * Math: each step is base × ratio^step. We map 12 semantic roles
 * (display through caption) to integer steps along that scale, then
 * optionally wrap each in a fluid clamp() so size scales smoothly
 * between a minimum and maximum viewport.
 */

export type ScaleRoleKey =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "lead"
  | "body"
  | "small"
  | "caption"
  | "code"

export interface RatioOption {
  key: string
  label: string
  value: number
  note: string
}

export const RATIO_OPTIONS: RatioOption[] = [
  { key: "minor-second", label: "1.067 · Minor second", value: 1.067, note: "Very subtle" },
  { key: "major-second", label: "1.125 · Major second", value: 1.125, note: "Subtle" },
  { key: "minor-third", label: "1.2 · Minor third", value: 1.2, note: "Versatile default" },
  { key: "major-third", label: "1.25 · Major third", value: 1.25, note: "Confident" },
  { key: "perfect-fourth", label: "1.333 · Perfect fourth", value: 1.333, note: "Strong hierarchy" },
  { key: "augmented-fourth", label: "1.414 · Augmented fourth", value: 1.414, note: "Dramatic" },
  { key: "perfect-fifth", label: "1.5 · Perfect fifth", value: 1.5, note: "Editorial" },
  { key: "golden", label: "1.618 · Golden ratio", value: 1.618, note: "Display-heavy" },
]

/** Steps relative to the body baseline (step 0 = base font size). */
export const ROLE_STEPS: Record<ScaleRoleKey, number> = {
  display: 7,
  h1: 6,
  h2: 5,
  h3: 4,
  h4: 3,
  h5: 2,
  h6: 1,
  lead: 1,
  body: 0,
  small: -1,
  caption: -2,
  code: 0,
}

export interface ScaleOptions {
  /** Body / baseline font size in px (typically 16). */
  basePx: number
  /** Modular ratio. */
  ratio: number
  /** Enable fluid clamp() sizing. */
  fluid: boolean
  /** Min viewport for fluid scaling (px). Default 360. */
  minVw?: number
  /** Max viewport for fluid scaling (px). Default 1280. */
  maxVw?: number
  /** Scale factor between min and max viewport (1 = identical at both). Default 0.85. */
  fluidContrast?: number
}

export interface ScaleStep {
  role: ScaleRoleKey
  step: number
  /** Computed size at the max viewport (px). */
  maxPx: number
  /** Computed size at the min viewport (px). Falls back to maxPx when fluid is off. */
  minPx: number
  /** CSS font-size declaration — either a rem value or a clamp(). */
  fontSize: string
}

/** Modular size at a given step. */
export function sizeAtStep(basePx: number, ratio: number, step: number): number {
  return basePx * Math.pow(ratio, step)
}

const round = (n: number) => Math.round(n * 1000) / 1000

/** Convert a px value to a rem string. */
function pxToRem(px: number): string {
  return `${round(px / 16)}rem`
}

/**
 * Build a fluid clamp() that interpolates between minPx (at minVw) and maxPx (at maxVw).
 * Formula: clamp(MIN, INTERCEPT + SLOPE × 100vw, MAX)
 */
export function fluidClamp(
  minPx: number,
  maxPx: number,
  minVw: number,
  maxVw: number
): string {
  if (minPx === maxPx) return pxToRem(maxPx)
  const slopeVw = ((maxPx - minPx) / (maxVw - minVw)) * 100
  const interceptPx = minPx - ((maxPx - minPx) / (maxVw - minVw)) * minVw
  return `clamp(${pxToRem(minPx)}, ${pxToRem(interceptPx)} + ${round(slopeVw)}vw, ${pxToRem(maxPx)})`
}

export function buildScale(options: ScaleOptions): Record<ScaleRoleKey, ScaleStep> {
  const {
    basePx,
    ratio,
    fluid,
    minVw = 360,
    maxVw = 1280,
    fluidContrast = 0.85,
  } = options

  const result = {} as Record<ScaleRoleKey, ScaleStep>
  for (const role of Object.keys(ROLE_STEPS) as ScaleRoleKey[]) {
    const step = ROLE_STEPS[role]
    const maxPx = sizeAtStep(basePx, ratio, step)
    // Shrink larger sizes more aggressively on smaller viewports;
    // body and below stay constant.
    const reduction = step > 0 ? Math.pow(fluidContrast, step) : 1
    const minPx = fluid ? Math.max(basePx, maxPx * reduction) : maxPx
    const fontSize = fluid ? fluidClamp(minPx, maxPx, minVw, maxVw) : pxToRem(maxPx)
    result[role] = { role, step, maxPx, minPx, fontSize }
  }
  return result
}

/** Recommended line-height for a given font-size in px. Tightens at large sizes. */
export function recommendedLineHeight(px: number): number {
  if (px >= 48) return 1.05
  if (px >= 32) return 1.15
  if (px >= 24) return 1.25
  if (px >= 20) return 1.35
  if (px >= 18) return 1.5
  if (px >= 16) return 1.6
  return 1.65
}

/** Recommended letter-spacing for a given size. Tightens at large sizes. */
export function recommendedLetterSpacingEm(px: number): number {
  if (px >= 40) return -0.02
  if (px >= 28) return -0.01
  if (px >= 22) return -0.005
  if (px >= 18) return 0
  if (px >= 14) return 0.005
  return 0.015
}

/** Recommended font-weight: heavier for body-like, slightly lighter for display-like. */
export function recommendedFontWeight(role: ScaleRoleKey): number {
  if (role === "display" || role === "h1") return 800
  if (role === "h2" || role === "h3") return 700
  if (role === "h4" || role === "h5") return 600
  if (role === "h6" || role === "lead") return 500
  return 400
}
