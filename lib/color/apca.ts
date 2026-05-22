/**
 * APCA (Accessible Perceptual Contrast Algorithm) — the contrast model in the
 * WCAG 3 working draft. Returns Lc (lightness contrast), a signed value typically
 * in the range −108 to +106. Use absolute value for threshold checks.
 *
 * Algorithm follows APCA-W3 0.1.9 (https://github.com/Myndex/apca-w3).
 */

import { hexToRgb } from "./oklch"

// Coefficients
const SA_RC = 0.2126729
const SA_GC = 0.7151522
const SA_BC = 0.072175

const SA_TRC = 2.4

const SA_BG_THRESHOLD = 0.022
const SA_OFFSET_LOW = 0.0005
const SA_NORMAL_BG_EXP = 0.56
const SA_NORMAL_TEXT_EXP = 0.57
const SA_REVERSE_BG_EXP = 0.65
const SA_REVERSE_TEXT_EXP = 0.62
const SA_SCALE = 1.14
const SA_LOW_CLIP = 0.1
const SA_LOW_OFFSET = 0.027

function softClip(y: number): number {
  return y < SA_BG_THRESHOLD ? y + Math.pow(SA_BG_THRESHOLD - y, 1.414) : y
}

/** sRGB hex → "simple-gamma" luminance Y, per APCA spec. */
export function apcaLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  return SA_RC * Math.pow(r, SA_TRC) + SA_GC * Math.pow(g, SA_TRC) + SA_BC * Math.pow(b, SA_TRC)
}

/**
 * APCA Lc for foreground text on background.
 * Sign: positive = dark text on light bg (normal). Negative = light on dark (reverse).
 * Magnitude is what's checked against thresholds.
 */
export function apcaContrast(textHex: string, bgHex: string): number {
  const textY = softClip(apcaLuminance(textHex))
  const bgY = softClip(apcaLuminance(bgHex))

  if (Math.abs(bgY - textY) < SA_OFFSET_LOW) return 0

  let sapc: number
  let lc: number
  if (bgY > textY) {
    sapc = (Math.pow(bgY, SA_NORMAL_BG_EXP) - Math.pow(textY, SA_NORMAL_TEXT_EXP)) * SA_SCALE
    lc = sapc < SA_LOW_CLIP ? 0 : sapc - SA_LOW_OFFSET
  } else {
    sapc = (Math.pow(bgY, SA_REVERSE_BG_EXP) - Math.pow(textY, SA_REVERSE_TEXT_EXP)) * SA_SCALE
    lc = sapc > -SA_LOW_CLIP ? 0 : sapc + SA_LOW_OFFSET
  }

  return lc * 100
}

export type APCAUseCase =
  | "body-text" // ≤ 16px or fluent reading
  | "fluent-text" // body copy / paragraphs
  | "content-text" // 18px+ or 14px bold
  | "large-text" // headlines, 24px+
  | "ui-component" // buttons, form controls, focus rings
  | "non-text" // icons, dividers, decorative
  | "spot-text" // single words, brand marks

export type APCALevel = "Pass" | "Use Caution" | "Fail"

// Bronze Simple Mode thresholds (APCA-W3 readme).
const THRESHOLDS: Record<APCAUseCase, { pass: number; caution: number }> = {
  "body-text": { pass: 90, caution: 75 },
  "fluent-text": { pass: 75, caution: 60 },
  "content-text": { pass: 60, caution: 45 },
  "large-text": { pass: 45, caution: 30 },
  "ui-component": { pass: 60, caution: 45 },
  "non-text": { pass: 45, caution: 30 },
  "spot-text": { pass: 30, caution: 15 },
}

export function apcaLevel(lc: number, useCase: APCAUseCase = "fluent-text"): APCALevel {
  const abs = Math.abs(lc)
  const t = THRESHOLDS[useCase]
  if (abs >= t.pass) return "Pass"
  if (abs >= t.caution) return "Use Caution"
  return "Fail"
}

export function apcaThreshold(useCase: APCAUseCase): { pass: number; caution: number } {
  return THRESHOLDS[useCase]
}
