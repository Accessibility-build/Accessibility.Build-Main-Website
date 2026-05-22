/**
 * Derive semantic UI tokens (background/foreground/primary/border/focus/…) from
 * a PaletteScales object. Produces a light-mode and a dark-mode token set ready
 * for use in the live UI preview and for export.
 */

import { readableTextOn } from "./oklch"
import type { PaletteScales } from "./scales"

export type Mode = "light" | "dark"

export interface SemanticTokens {
  mode: Mode
  /** Page background */
  background: string
  /** Cards, panels — one elevation up from background */
  surface: string
  /** Modals, popovers, top-elevation surfaces */
  raised: string

  /** Primary text */
  foreground: string
  /** Secondary text (labels, metadata) */
  muted: string
  /** Tertiary text (caption, placeholder) */
  subtle: string

  /** Default border */
  border: string
  /** Stronger border for emphasis */
  borderStrong: string

  /** Primary action button */
  primary: string
  primaryHover: string
  primaryActive: string
  primaryForeground: string
  /** Light tint for primary backgrounds (tags, badges) */
  primarySurface: string

  secondary: string
  secondaryHover: string
  secondaryForeground: string
  secondarySurface: string

  accent: string
  accentHover: string
  accentForeground: string
  accentSurface: string

  success: string
  successForeground: string
  successSurface: string
  warning: string
  warningForeground: string
  warningSurface: string
  danger: string
  dangerForeground: string
  dangerSurface: string
  info: string
  infoForeground: string
  infoSurface: string

  /** Focus ring color */
  focus: string
  /** Focus halo (translucent / lighter for outer ring) */
  focusRing: string

  disabled: string
  disabledForeground: string

  /** Categorical chart palette — distinguishable hues */
  chartColors: string[]
}

export interface TokenSet {
  light: SemanticTokens
  dark: SemanticTokens
}

const WHITE = "#ffffff"

export function deriveTokens(scales: PaletteScales): TokenSet {
  return {
    light: deriveLight(scales),
    dark: deriveDark(scales),
  }
}

function deriveLight(s: PaletteScales): SemanticTokens {
  const primary = s.primary[600]
  const secondary = s.secondary[600]
  const accent = s.accent[600]

  return {
    mode: "light",
    background: s.neutral[50],
    surface: WHITE,
    raised: WHITE,

    foreground: s.neutral[900],
    muted: s.neutral[600],
    subtle: s.neutral[500],

    border: s.neutral[200],
    borderStrong: s.neutral[300],

    primary,
    primaryHover: s.primary[700],
    primaryActive: s.primary[800],
    primaryForeground: readableTextOn(primary),
    primarySurface: s.primary[100],

    secondary,
    secondaryHover: s.secondary[700],
    secondaryForeground: readableTextOn(secondary),
    secondarySurface: s.secondary[100],

    accent,
    accentHover: s.accent[700],
    accentForeground: readableTextOn(accent),
    accentSurface: s.accent[100],

    success: s.success[700],
    successForeground: WHITE,
    successSurface: s.success[100],
    warning: s.warning[700],
    warningForeground: WHITE,
    warningSurface: s.warning[100],
    danger: s.danger[700],
    dangerForeground: WHITE,
    dangerSurface: s.danger[100],
    info: s.info[700],
    infoForeground: WHITE,
    infoSurface: s.info[100],

    focus: s.accent[500],
    focusRing: s.accent[300],

    disabled: s.neutral[200],
    disabledForeground: s.neutral[500],

    chartColors: [
      s.primary[600],
      s.accent[500],
      s.success[600],
      s.warning[600],
      s.info[600],
      s.danger[600],
      s.secondary[600],
      s.primary[300],
    ],
  }
}

function deriveDark(s: PaletteScales): SemanticTokens {
  const primary = s.primary[500]
  const secondary = s.secondary[500]
  const accent = s.accent[400]

  return {
    mode: "dark",
    background: s.neutral[950],
    surface: s.neutral[900],
    raised: s.neutral[800],

    foreground: s.neutral[50],
    muted: s.neutral[400],
    subtle: s.neutral[500],

    border: s.neutral[800],
    borderStrong: s.neutral[700],

    primary,
    primaryHover: s.primary[400],
    primaryActive: s.primary[300],
    primaryForeground: readableTextOn(primary, { dark: s.primary[950], light: WHITE }),
    primarySurface: s.primary[900],

    secondary,
    secondaryHover: s.secondary[400],
    secondaryForeground: readableTextOn(secondary, { dark: s.secondary[950], light: WHITE }),
    secondarySurface: s.secondary[900],

    accent,
    accentHover: s.accent[300],
    accentForeground: readableTextOn(accent, { dark: s.accent[950], light: WHITE }),
    accentSurface: s.accent[900],

    success: s.success[400],
    successForeground: s.success[950],
    successSurface: s.success[900],
    warning: s.warning[400],
    warningForeground: s.warning[950],
    warningSurface: s.warning[900],
    danger: s.danger[400],
    dangerForeground: s.danger[950],
    dangerSurface: s.danger[900],
    info: s.info[400],
    infoForeground: s.info[950],
    infoSurface: s.info[900],

    focus: s.accent[400],
    focusRing: s.accent[600],

    disabled: s.neutral[800],
    disabledForeground: s.neutral[500],

    chartColors: [
      s.primary[400],
      s.accent[400],
      s.success[400],
      s.warning[400],
      s.info[400],
      s.danger[400],
      s.secondary[400],
      s.primary[200],
    ],
  }
}
