/**
 * Semantic typography tokens. One TypeStyle per role (display, h1…h6, lead,
 * body, small, caption, code) plus shared metadata (font families, max widths,
 * paragraph spacing).
 */

import { fontByKey, type FontStack } from "./presets"
import {
  buildScale,
  recommendedFontWeight,
  recommendedLetterSpacingEm,
  recommendedLineHeight,
  ROLE_STEPS,
  type ScaleOptions,
  type ScaleRoleKey,
} from "./scale"

export interface TypeStyle {
  fontSize: string
  fontSizePx: { min: number; max: number }
  lineHeight: number
  letterSpacingEm: number
  fontWeight: number
  fontFamily: "sans" | "serif" | "mono" | "display"
  textTransform?: "uppercase" | "none"
}

export type TypographyStyleMap = Record<ScaleRoleKey, TypeStyle>

export interface FontConfig {
  sans: FontStack
  serif: FontStack
  mono: FontStack
  /** Optional dedicated display font; falls back to sans if not set. */
  display?: FontStack
}

export interface TypographyTokens {
  fonts: {
    sans: string
    serif: string
    mono: string
    display: string
  }
  fontImports: string[]
  styles: TypographyStyleMap
  paragraphSpacing: string
  bodyMaxWidth: string
  basePx: number
  ratio: number
}

export interface TypographyInputs extends ScaleOptions {
  fonts: { sansKey: string; serifKey: string; monoKey: string; displayKey?: string }
  /** Extra line-height added across all roles (preset multiplier). */
  lineHeightBoost: number
  /** Extra letter-spacing in em across small sizes. */
  letterSpacingBoost: number
  /** Multiplier for paragraph spacing relative to font size. */
  paragraphSpacingMultiplier: number
  /** Max line length in ch (used for bodyMaxWidth). */
  maxLineLengthCh: number
}

const SYSTEM_FALLBACK: FontStack = {
  key: "system",
  label: "System",
  family: `system-ui, -apple-system, sans-serif`,
  category: "sans",
  notes: "fallback",
}

function ensureStack(key: string | undefined, fallback: FontStack): FontStack {
  if (!key) return fallback
  return fontByKey(key) ?? fallback
}

function familyToFontFamilyKey(category: FontStack["category"]): TypeStyle["fontFamily"] {
  if (category === "serif") return "serif"
  if (category === "mono") return "mono"
  if (category === "display") return "display"
  return "sans"
}

export function buildTypographyTokens(input: TypographyInputs): TypographyTokens {
  const sans = ensureStack(input.fonts.sansKey, SYSTEM_FALLBACK)
  const serif = ensureStack(input.fonts.serifKey, SYSTEM_FALLBACK)
  const mono = ensureStack(
    input.fonts.monoKey,
    {
      ...SYSTEM_FALLBACK,
      family: `ui-monospace, "SF Mono", Menlo, monospace`,
      category: "mono",
    }
  )
  const display = input.fonts.displayKey ? ensureStack(input.fonts.displayKey, sans) : undefined

  const fontImports = Array.from(
    new Set([sans.googleFontUrl, serif.googleFontUrl, mono.googleFontUrl, display?.googleFontUrl].filter(Boolean) as string[])
  )

  const scale = buildScale({
    basePx: input.basePx,
    ratio: input.ratio,
    fluid: input.fluid,
    minVw: input.minVw,
    maxVw: input.maxVw,
    fluidContrast: input.fluidContrast,
  })

  const styles = {} as TypographyStyleMap
  for (const role of Object.keys(ROLE_STEPS) as ScaleRoleKey[]) {
    const s = scale[role]
    const family =
      role === "code"
        ? mono
        : role === "display" || role === "h1" || role === "h2"
        ? (display ?? sans)
        : sans
    const lineHeight = round(recommendedLineHeight(s.maxPx) + input.lineHeightBoost)
    const letterSpacingEm =
      round(recommendedLetterSpacingEm(s.maxPx) + (s.maxPx < input.basePx + 4 ? input.letterSpacingBoost : 0))
    styles[role] = {
      fontSize: s.fontSize,
      fontSizePx: { min: s.minPx, max: s.maxPx },
      lineHeight,
      letterSpacingEm,
      fontWeight: recommendedFontWeight(role),
      fontFamily: familyToFontFamilyKey(family.category),
    }
  }

  return {
    fonts: {
      sans: sans.family,
      serif: serif.family,
      mono: mono.family,
      display: (display ?? sans).family,
    },
    fontImports,
    styles,
    paragraphSpacing: `${round(input.paragraphSpacingMultiplier)}em`,
    bodyMaxWidth: `${input.maxLineLengthCh}ch`,
    basePx: input.basePx,
    ratio: input.ratio,
  }
}

function round(n: number, places = 3): number {
  const p = Math.pow(10, places)
  return Math.round(n * p) / p
}

export type TypographyTokensWithFonts = TypographyTokens
