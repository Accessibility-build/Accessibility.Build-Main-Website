/**
 * The filters behind the website vision simulator, as plain data a component turns into an inline
 * SVG <filter>. Pure, so the matrices and parameters are testable without a browser.
 *
 * Colour vision deficiency uses the Machado, Oliveira and Fernandes (2009) matrices from
 * lib/color/cvd.ts, which are defined on linear RGB. SVG filter primitives work in linearRGB by
 * default (`color-interpolation-filters`), so a feColorMatrix applies them exactly as cvd.ts's
 * simulateHex does at full severity; the filters set the property explicitly anyway, in case a
 * stylesheet ever changes it.
 *
 * Partial severity (anomalous trichromacy: protanomaly, deuteranomaly, tritanomaly) interpolates
 * between the identity and the full matrix, M(s) = (1 - s) I + s M, in linear light. Machado
 * published separate matrices for each severity step that differ somewhat from this straight-line
 * blend, so intermediate severities are an approximation of the model, not the paper's values.
 */

import { cvdSvgMatrixValues } from "@/lib/color/cvd"

export type VisionCondition = "none" | "protan" | "deutan" | "tritan" | "achromatopsia" | "blur" | "low-contrast"
export type BlurLevel = "mild" | "moderate" | "strong"

type DichromacyType = "protanopia" | "deuteranopia" | "tritanopia"

export interface ConditionInfo {
  id: VisionCondition
  label: string
  /** What the filter does and what it cannot show. Shown under the selector. */
  description: string
  /** Has a severity slider (the three cone types). */
  severity: boolean
  /** Names at full and partial severity, for the slider's readout and the alt text. */
  fullName?: string
  partialName?: string
  dichromacy?: DichromacyType
}

export const CONDITIONS: ConditionInfo[] = [
  {
    id: "none",
    label: "No simulation",
    description: "The page as captured, with no filter.",
    severity: false,
  },
  {
    id: "protan",
    label: "Protan (red cones)",
    description:
      "Red cones missing (protanopia) or shifted (protanomaly). Reds look darker and are easily confused with greens and browns. Look for red and green used as the only difference between states.",
    severity: true,
    fullName: "protanopia",
    partialName: "protanomaly",
    dichromacy: "protanopia",
  },
  {
    id: "deutan",
    label: "Deutan (green cones)",
    description:
      "Green cones missing (deuteranopia) or shifted (deuteranomaly), the most common form of colour vision deficiency. Reds, greens and oranges move towards the same yellows and browns.",
    severity: true,
    fullName: "deuteranopia",
    partialName: "deuteranomaly",
    dichromacy: "deuteranopia",
  },
  {
    id: "tritan",
    label: "Tritan (blue cones)",
    description:
      "Blue cones missing (tritanopia) or shifted (tritanomaly), which is rare. Blues and greens become hard to tell apart, as do yellows and pinks.",
    severity: true,
    fullName: "tritanopia",
    partialName: "tritanomaly",
    dichromacy: "tritanopia",
  },
  {
    id: "achromatopsia",
    label: "Achromatopsia (no colour)",
    description:
      "Only lightness remains, so anything told apart by hue alone disappears. Real achromatopsia also brings sensitivity to light and lower sharpness, which this filter does not show.",
    severity: false,
  },
  {
    id: "blur",
    label: "Blurred vision",
    description:
      "Uncorrected or low vision makes small text and thin lines run together. The levels are illustrative: how blurred a page looks to someone depends on their eyes, the screen and the distance, so they are not calibrated to an acuity value.",
    severity: false,
  },
  {
    id: "low-contrast",
    label: "Low contrast sensitivity",
    description:
      "Contrast is halved and the image softened slightly, as a rough stand-in for the faded view that comes with cataracts, some eye conditions and age. Pale text and faint borders are the first to go.",
    severity: false,
  },
]

export const BLUR_LEVELS: { id: BlurLevel; label: string; stdDeviation: number }[] = [
  { id: "mild", label: "Mild", stdDeviation: 1.5 },
  { id: "moderate", label: "Moderate", stdDeviation: 3 },
  { id: "strong", label: "Strong", stdDeviation: 6 },
]

/** Low contrast sensitivity: an sRGB contrast of 0.5 around mid-grey, then a slight blur. */
export const LOW_CONTRAST = { slope: 0.5, intercept: 0.25, stdDeviation: 0.75 }

const IDENTITY = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]

/** Rec. 709 luminance weights in every colour row: applied in linear light, the output is the pixel's luminance as grey. */
export const ACHROMATOPSIA_MATRIX = [
  0.2126, 0.7152, 0.0722, 0, 0, 0.2126, 0.7152, 0.0722, 0, 0, 0.2126, 0.7152, 0.0722, 0, 0, 0, 0, 0, 1, 0,
]

/** The 4 by 5 feColorMatrix values for a cone type at severity 0 (no change) to 1 (dichromacy). */
export function cvdMatrix(type: DichromacyType, severity: number): number[] {
  const full = cvdSvgMatrixValues(type).trim().split(/\s+/).map(Number)
  const s = Math.max(0, Math.min(1, severity))
  return full.map((value, i) => (1 - s) * IDENTITY[i] + s * value)
}

export type FilterPrimitive =
  | { kind: "matrix"; values: number[] }
  | { kind: "blur"; stdDeviation: number }
  | { kind: "contrast"; slope: number; intercept: number }

export interface FilterSettings {
  /** 0 to 1, for the cone types. */
  severity: number
  blur: BlurLevel
  /** Displayed width over natural width, so a blur stays the same size relative to the page. */
  scale: number
}

/** The primitives for a condition, or null for no filter. Blur sizes are in displayed pixels. */
export function filterPrimitives(condition: VisionCondition, { severity, blur, scale }: FilterSettings): FilterPrimitive[] | null {
  const info = CONDITIONS.find((c) => c.id === condition)
  if (!info || condition === "none") return null
  if (info.dichromacy) return severity <= 0 ? null : [{ kind: "matrix", values: cvdMatrix(info.dichromacy, severity) }]
  if (condition === "achromatopsia") return [{ kind: "matrix", values: ACHROMATOPSIA_MATRIX }]
  if (condition === "blur") {
    const level = BLUR_LEVELS.find((b) => b.id === blur) ?? BLUR_LEVELS[1]
    return [{ kind: "blur", stdDeviation: round(level.stdDeviation * scale) }]
  }
  return [
    { kind: "contrast", slope: LOW_CONTRAST.slope, intercept: LOW_CONTRAST.intercept },
    { kind: "blur", stdDeviation: round(LOW_CONTRAST.stdDeviation * scale) },
  ]
}

/** "Deuteranomaly, 60% severity", "Blurred vision, moderate" and so on, for alt text and captions. */
export function describeSimulation(condition: VisionCondition, { severity, blur }: Pick<FilterSettings, "severity" | "blur">): string {
  const info = CONDITIONS.find((c) => c.id === condition)
  if (!info || condition === "none") return "no simulation"
  if (info.dichromacy) {
    const percent = Math.round(severity * 100)
    return percent >= 100 ? `${info.fullName} (full severity)` : `${info.partialName} at ${percent}% severity`
  }
  if (condition === "blur") return `blurred vision, ${(BLUR_LEVELS.find((b) => b.id === blur) ?? BLUR_LEVELS[1]).label.toLowerCase()}`
  if (condition === "achromatopsia") return "achromatopsia (no colour)"
  return "low contrast sensitivity"
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}
