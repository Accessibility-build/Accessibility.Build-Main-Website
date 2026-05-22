/**
 * Color vision deficiency (CVD) simulation using Machado, Oliveira & Fernandes (2009)
 * matrices applied to linear sRGB. Severity is 1.0 (full dichromacy).
 *
 * Reference: "A Physiologically-based Model for Simulation of Color Vision Deficiency"
 * doi:10.1109/TVCG.2009.113
 */

import { hexToRgb, rgbToHex, type RGB } from "./oklch"

export type CVDType = "normal" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia"

export const CVD_LABELS: Record<CVDType, string> = {
  normal: "Normal vision",
  protanopia: "Protanopia (no red cones)",
  deuteranopia: "Deuteranopia (no green cones)",
  tritanopia: "Tritanopia (no blue cones)",
  achromatopsia: "Achromatopsia (no color)",
}

type Matrix3 = readonly [
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
]

// Machado 2009 matrices (severity 1.0).
const MATRICES: Record<Exclude<CVDType, "normal" | "achromatopsia">, Matrix3> = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function linearToSrgb(c: number): number {
  if (c <= 0) return 0
  if (c >= 1) return 1
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

function applyMatrix(m: Matrix3, rgb: RGB): RGB {
  const r = srgbToLinear(rgb.r)
  const g = srgbToLinear(rgb.g)
  const b = srgbToLinear(rgb.b)
  return {
    r: linearToSrgb(m[0][0] * r + m[0][1] * g + m[0][2] * b),
    g: linearToSrgb(m[1][0] * r + m[1][1] * g + m[1][2] * b),
    b: linearToSrgb(m[2][0] * r + m[2][1] * g + m[2][2] * b),
  }
}

/** Simulate a hex color under a given CVD. Returns original hex if type is "normal". */
export function simulateHex(hex: string, type: CVDType): string {
  if (type === "normal") return hex
  const rgb = hexToRgb(hex)

  if (type === "achromatopsia") {
    // Rec. 709 luma — preserves perceived lightness.
    const y = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b
    return rgbToHex({ r: y, g: y, b: y })
  }

  return rgbToHex(applyMatrix(MATRICES[type], rgb))
}

/** Returns a CSS filter that approximates the CVD using stock SVG color matrices. */
export function cvdCssFilter(type: CVDType): string | null {
  switch (type) {
    case "normal":
      return null
    case "achromatopsia":
      return "grayscale(1)"
    case "protanopia":
      return "url(#cvd-protanopia)"
    case "deuteranopia":
      return "url(#cvd-deuteranopia)"
    case "tritanopia":
      return "url(#cvd-tritanopia)"
  }
}

/**
 * SVG `<feColorMatrix>` values for use with an inline SVG filter, so the entire UI
 * can be rendered through the CVD by setting CSS `filter: url(#cvd-…)`.
 * Format is "r g b a 0" for each row (4 rows = R/G/B/A).
 */
export function cvdSvgMatrixValues(type: Exclude<CVDType, "normal" | "achromatopsia">): string {
  const m = MATRICES[type]
  return [
    `${m[0][0]} ${m[0][1]} ${m[0][2]} 0 0`,
    `${m[1][0]} ${m[1][1]} ${m[1][2]} 0 0`,
    `${m[2][0]} ${m[2][1]} ${m[2][2]} 0 0`,
    `0 0 0 1 0`,
  ].join(" ")
}

export const CVD_TYPES: CVDType[] = [
  "normal",
  "protanopia",
  "deuteranopia",
  "tritanopia",
  "achromatopsia",
]
