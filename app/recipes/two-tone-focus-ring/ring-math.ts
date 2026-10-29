import { contrastRatioWCAG, isValidHex, relativeLuminance } from "@/lib/color/oklch"

/** This site's own focus blue, used as the single-colour ring in the comparisons. */
export const BLUE = "#2563eb"
export const WHITE = "#ffffff"
export const BLACK = "#000000"

/** WCAG 1.4.11's minimum for a focus indicator against what is next to it. */
export const NON_TEXT_MIN = 3
/** C40: two colours at least 9:1 apart guarantee one of them reaches 3:1 on any solid colour. */
export const PAIR_MIN = 9

export function normaliseHex(value: string): string | null {
  const v = value.trim().startsWith("#") ? value.trim() : `#${value.trim()}`
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) || !isValidHex(v)) return null
  const hex = v.length === 4 ? `#${[...v.slice(1)].map((c) => c + c).join("")}` : v
  return hex.toLowerCase()
}

/** Both bands of the black and white ring against a background, plus their product (always 21). */
export function twoTone(bg: string) {
  const white = contrastRatioWCAG(WHITE, bg)
  const black = contrastRatioWCAG(BLACK, bg)
  return { white, black, best: Math.max(white, black), product: white * black }
}

/** The 9:1 rule: the weaker of the two bands can never drop below the square root of the pair's contrast. */
export function pairGuarantee(inner: string, outer: string) {
  const ratio = contrastRatioWCAG(inner, outer)
  const floor = Math.sqrt(ratio)
  // The background that hurts most sits halfway between the two (on the luminance scale WCAG uses).
  const worstLuminance = Math.sqrt((relativeLuminance(inner) + 0.05) * (relativeLuminance(outer) + 0.05)) - 0.05
  return { ratio, floor, guaranteed: ratio >= PAIR_MIN, worstBackground: greyFor(worstLuminance) }
}

/** The grey with a given WCAG relative luminance. */
export function greyFor(luminance: number): string {
  const l = Math.min(1, Math.max(0, luminance))
  const srgb = l <= 0.0031308 ? 12.92 * l : 1.055 * Math.pow(l, 1 / 2.4) - 0.055
  const byte = Math.round(Math.min(1, Math.max(0, srgb)) * 255).toString(16).padStart(2, "0")
  return `#${byte}${byte}${byte}`
}

/** Black or white, whichever reads better on the background. */
export function readableOn(bg: string): string {
  return contrastRatioWCAG(BLACK, bg) >= contrastRatioWCAG(WHITE, bg) ? BLACK : WHITE
}

/** WCAG ratios are never rounded up, so 2.999 must not display as 3.00. */
export function formatRatio(ratio: number): string {
  return `${(Math.floor(ratio * 100) / 100).toFixed(2)}:1`
}

export { contrastRatioWCAG }
