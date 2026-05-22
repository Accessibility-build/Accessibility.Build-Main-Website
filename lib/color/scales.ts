import { hexToOklch, oklchToHex } from "./oklch"

export type ScaleStop = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
export const STOPS: ScaleStop[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

// OKLCH L targets — perceptually-tuned, Tailwind v4-inspired.
const L_TARGETS: Record<ScaleStop, number> = {
  50: 0.985,
  100: 0.965,
  200: 0.925,
  300: 0.870,
  400: 0.780,
  500: 0.680,
  600: 0.585,
  700: 0.500,
  800: 0.420,
  900: 0.340,
  950: 0.230,
}

// Chroma multipliers — peak around 500, taper at extremes.
const C_MULT: Record<ScaleStop, number> = {
  50: 0.05,
  100: 0.15,
  200: 0.35,
  300: 0.65,
  400: 0.9,
  500: 1.0,
  600: 0.95,
  700: 0.85,
  800: 0.75,
  900: 0.55,
  950: 0.35,
}

export type Scale = Record<ScaleStop, string>

export interface ScaleSpec {
  hex?: string
  hue?: number
  peakChroma?: number
  /** Low-chroma scale for neutrals. Caps chroma at ~0.02. */
  neutral?: boolean
}

export function generateScale(spec: ScaleSpec): Scale {
  let hue = spec.hue ?? 0
  let peakC = spec.peakChroma ?? 0.18

  if (spec.hex) {
    const base = hexToOklch(spec.hex)
    if (spec.hue === undefined) hue = base.h || hue
    if (spec.peakChroma === undefined) peakC = base.c || peakC
  }

  if (spec.neutral) {
    peakC = Math.min(peakC, 0.02)
  } else {
    // Floor so very desaturated inputs still produce a visible scale.
    peakC = Math.max(peakC, 0.08)
  }

  const result = {} as Scale
  for (const stop of STOPS) {
    const l = L_TARGETS[stop]
    const c = peakC * C_MULT[stop]
    result[stop] = oklchToHex({ l, c, h: hue })
  }
  return result
}

// Find the nearest stop to a given color (useful for "anchoring" the user's input).
export function nearestStop(scale: Scale, hex: string): ScaleStop {
  const target = hexToOklch(hex)
  let best: ScaleStop = 500
  let bestDist = Number.POSITIVE_INFINITY
  for (const stop of STOPS) {
    const sample = hexToOklch(scale[stop])
    const d = Math.abs(sample.l - target.l)
    if (d < bestDist) {
      bestDist = d
      best = stop
    }
  }
  return best
}

// Semantic preset hues (OKLCH H, in degrees).
export const SEMANTIC_HUES = {
  success: 145,
  warning: 80,
  danger: 25,
  info: 235,
} as const

export type SemanticName = keyof typeof SEMANTIC_HUES

export function semanticScale(name: SemanticName): Scale {
  // Warning gets slightly lower chroma so yellows don't blow out at light stops.
  const peakChroma = name === "warning" ? 0.16 : 0.2
  return generateScale({ hue: SEMANTIC_HUES[name], peakChroma })
}

// Family identifiers used throughout the studio.
export type FamilyName = "primary" | "secondary" | "accent" | "neutral" | SemanticName
export const FAMILY_NAMES: FamilyName[] = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "success",
  "warning",
  "danger",
  "info",
]

export interface PaletteScales {
  primary: Scale
  secondary: Scale
  accent: Scale
  neutral: Scale
  success: Scale
  warning: Scale
  danger: Scale
  info: Scale
}

export interface PaletteInputs {
  primary: string
  secondary?: string
  accent?: string
  neutralTilt?: "warm" | "cool" | "true"
}

/**
 * Generate a complete palette of 8 families × 11 stops from a primary hex.
 * Secondary/accent default to harmonic derivations of the primary hue.
 */
export function generatePalette(inputs: PaletteInputs): PaletteScales {
  const primaryOk = hexToOklch(inputs.primary)
  const baseHue = primaryOk.h || 0

  const secondaryHex =
    inputs.secondary ??
    oklchToHex({ l: primaryOk.l, c: Math.max(primaryOk.c, 0.12), h: (baseHue + 210) % 360 })
  const accentHex =
    inputs.accent ??
    oklchToHex({ l: primaryOk.l, c: Math.max(primaryOk.c, 0.14), h: (baseHue + 120) % 360 })

  let neutralHue = baseHue
  if (inputs.neutralTilt === "warm") neutralHue = 60
  else if (inputs.neutralTilt === "cool") neutralHue = 240
  else if (inputs.neutralTilt === "true") neutralHue = baseHue

  return {
    primary: generateScale({ hex: inputs.primary }),
    secondary: generateScale({ hex: secondaryHex }),
    accent: generateScale({ hex: accentHex }),
    neutral: generateScale({ hue: neutralHue, peakChroma: 0.015, neutral: true }),
    success: semanticScale("success"),
    warning: semanticScale("warning"),
    danger: semanticScale("danger"),
    info: semanticScale("info"),
  }
}
