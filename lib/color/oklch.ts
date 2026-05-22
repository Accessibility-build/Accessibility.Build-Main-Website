import {
  clampChroma,
  converter,
  formatHex,
  parse,
} from "culori/fn"

import "culori/css"

const toOklch = converter("oklch")
const toRgb = converter("rgb")

export type OKLCH = { l: number; c: number; h: number }
export type RGB = { r: number; g: number; b: number }

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i

export function isValidHex(value: string): boolean {
  return HEX_RE.test(value.trim())
}

export function hexToOklch(hex: string): OKLCH {
  const parsed = parse(hex)
  if (!parsed) {
    return { l: 0, c: 0, h: 0 }
  }
  const o = toOklch(parsed)
  return {
    l: o?.l ?? 0,
    c: o?.c ?? 0,
    h: o?.h ?? 0,
  }
}

export function oklchToHex(oklch: OKLCH): string {
  // Gamut-map into displayable sRGB by reducing chroma while preserving lightness/hue.
  const mapped = clampChroma(
    { mode: "oklch", l: oklch.l, c: oklch.c, h: oklch.h },
    "oklch"
  )
  return formatHex(mapped) ?? "#000000"
}

export function hexToRgb(hex: string): RGB {
  const parsed = parse(hex)
  if (!parsed) return { r: 0, g: 0, b: 0 }
  const rgb = toRgb(parsed)
  return {
    r: clamp01(rgb?.r ?? 0),
    g: clamp01(rgb?.g ?? 0),
    b: clamp01(rgb?.b ?? 0),
  }
}

export function rgbToHex({ r, g, b }: RGB): string {
  return formatHex({ mode: "rgb", r: clamp01(r), g: clamp01(g), b: clamp01(b) }) ?? "#000000"
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0
  if (n < 0) return 0
  if (n > 1) return 1
  return n
}

// WCAG 2.x relative luminance (sRGB linear)
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function contrastRatioWCAG(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg)
  const l2 = relativeLuminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export type WCAGLevel = "AAA" | "AA" | "AA Large" | "Fail"

export function wcagLevel(ratio: number, largeText = false): WCAGLevel {
  if (largeText) {
    if (ratio >= 4.5) return "AAA"
    if (ratio >= 3) return "AA"
    return "Fail"
  }
  if (ratio >= 7) return "AAA"
  if (ratio >= 4.5) return "AA"
  if (ratio >= 3) return "AA Large"
  return "Fail"
}

// Composite a foreground color with alpha onto a solid background (sRGB straight-alpha).
// Returns the resulting opaque hex. Use this before scoring text on translucent surfaces.
export function compositeOver(fgHex: string, fgAlpha: number, bgHex: string): string {
  const a = clamp01(fgAlpha)
  const f = hexToRgb(fgHex)
  const b = hexToRgb(bgHex)
  return rgbToHex({
    r: f.r * a + b.r * (1 - a),
    g: f.g * a + b.g * (1 - a),
    b: f.b * a + b.b * (1 - a),
  })
}

// Pick black or white for best contrast against a given background.
export function readableTextOn(bgHex: string, options?: { dark?: string; light?: string }): string {
  const dark = options?.dark ?? "#0b0f19"
  const light = options?.light ?? "#ffffff"
  return contrastRatioWCAG(dark, bgHex) >= contrastRatioWCAG(light, bgHex) ? dark : light
}
