/**
 * Typography accessibility grading.
 *
 * Three categories of checks:
 *   1. Size & spacing (WCAG 1.4.4 / 1.4.12) — the typography itself.
 *   2. Line length (WCAG 1.4.8) — readable column width.
 *   3. Contrast against background tokens (WCAG 1.4.3 + APCA), when a palette
 *      is loaded.
 */

import { apcaContrast, apcaLevel, type APCALevel } from "@/lib/color/apca"
import { contrastRatioWCAG, wcagLevel, type WCAGLevel } from "@/lib/color/oklch"
import type { SemanticTokens } from "@/lib/color/tokens"
import { charsPerLine, maxWidthToPx } from "./metrics"
import type { ScaleRoleKey } from "./scale"
import type { TypographyTokens, TypeStyle } from "./tokens"

export type Verdict = "pass" | "caution" | "fail"

export interface GradedCheck {
  id: string
  category: "size" | "spacing" | "line-length" | "contrast" | "wcag-1.4.12" | "weight"
  label: string
  detail: string
  verdict: Verdict
  scId?: string
  scUrl?: string
}

export interface GradedRoleContrast {
  role: ScaleRoleKey
  fg: string
  bg: string
  wcag: { ratio: number; level: WCAGLevel; required: number; pass: boolean }
  apca: { lc: number; level: APCALevel; pass: boolean }
}

export interface TypographyReport {
  checks: GradedCheck[]
  contrasts: GradedRoleContrast[]
  summary: { pass: number; caution: number; fail: number }
}

const SC_URL = (sc: string) => `https://www.w3.org/WAI/WCAG22/quickref/#${sc}`

const ROLES_TO_GRADE: ScaleRoleKey[] = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "lead",
  "body",
  "small",
  "caption",
]

/** Body-text quality checks against WCAG 2.2. */
function checkBody(tokens: TypographyTokens): GradedCheck[] {
  const body = tokens.styles.body
  const checks: GradedCheck[] = []

  // Body size — 16px minimum on desktop is the de-facto rule.
  checks.push({
    id: "body-size",
    category: "size",
    label: "Body font size",
    detail: `${Math.round(body.fontSizePx.max)}px max / ${Math.round(body.fontSizePx.min)}px min`,
    verdict: body.fontSizePx.min >= 16 ? "pass" : body.fontSizePx.min >= 14 ? "caution" : "fail",
    scId: "1.4.4",
    scUrl: SC_URL("resize-text"),
  })

  // Line height for body (WCAG 1.4.12 — text spacing override)
  checks.push({
    id: "body-line-height",
    category: "wcag-1.4.12",
    label: "Body line height ≥ 1.5",
    detail: `${body.lineHeight}`,
    verdict: body.lineHeight >= 1.5 ? "pass" : body.lineHeight >= 1.4 ? "caution" : "fail",
    scId: "1.4.12",
    scUrl: SC_URL("text-spacing"),
  })

  // Letter-spacing — WCAG 1.4.12 requires text to remain readable when forced to ≥ 0.12em.
  checks.push({
    id: "body-letter-spacing",
    category: "wcag-1.4.12",
    label: "Body letter-spacing safe",
    detail: `${body.letterSpacingEm > 0 ? "+" : ""}${body.letterSpacingEm}em`,
    verdict: body.letterSpacingEm >= -0.01 ? "pass" : "caution",
    scId: "1.4.12",
    scUrl: SC_URL("text-spacing"),
  })

  return checks
}

function checkLineLength(tokens: TypographyTokens): GradedCheck[] {
  const bodyMaxPx = maxWidthToPx(tokens.bodyMaxWidth) ?? 720
  const cpl = charsPerLine(bodyMaxPx, tokens.styles.body.fontSizePx.max)
  const verdict: Verdict = cpl >= 45 && cpl <= 80 ? "pass" : cpl >= 35 && cpl <= 95 ? "caution" : "fail"
  return [
    {
      id: "line-length",
      category: "line-length",
      label: "Line length 45–80 chars",
      detail: `~${Math.round(cpl)} chars per line at ${tokens.bodyMaxWidth}`,
      verdict,
      scId: "1.4.8",
      scUrl: SC_URL("visual-presentation"),
    },
  ]
}

function checkHeadingHierarchy(tokens: TypographyTokens): GradedCheck[] {
  const sizes: { role: ScaleRoleKey; px: number }[] = [
    { role: "h1", px: tokens.styles.h1.fontSizePx.max },
    { role: "h2", px: tokens.styles.h2.fontSizePx.max },
    { role: "h3", px: tokens.styles.h3.fontSizePx.max },
    { role: "h4", px: tokens.styles.h4.fontSizePx.max },
    { role: "h5", px: tokens.styles.h5.fontSizePx.max },
    { role: "h6", px: tokens.styles.h6.fontSizePx.max },
  ]
  let strictly = true
  let weakSpread = false
  for (let i = 1; i < sizes.length; i++) {
    if (sizes[i].px >= sizes[i - 1].px) {
      strictly = false
      break
    }
    if (sizes[i - 1].px - sizes[i].px < 1.5) weakSpread = true
  }
  return [
    {
      id: "heading-hierarchy",
      category: "size",
      label: "Heading hierarchy clear",
      detail: strictly ? "Sizes decrease consistently h1→h6" : "Hierarchy is muddy — H tags overlap",
      verdict: !strictly ? "fail" : weakSpread ? "caution" : "pass",
      scId: "1.3.1",
      scUrl: SC_URL("info-and-relationships"),
    },
  ]
}

function checkBodyVsHeading(tokens: TypographyTokens): GradedCheck[] {
  const body = tokens.styles.body.fontSizePx.max
  const h1 = tokens.styles.h1.fontSizePx.max
  const ratio = h1 / body
  return [
    {
      id: "body-heading-ratio",
      category: "size",
      label: "Heading vs body contrast",
      detail: `H1 is ${ratio.toFixed(2)}× body`,
      verdict: ratio >= 2 ? "pass" : ratio >= 1.5 ? "caution" : "fail",
    },
  ]
}

function checkParagraphSpacing(tokens: TypographyTokens): GradedCheck[] {
  const m = tokens.paragraphSpacing.match(/^([\d.]+)em$/)
  const value = m ? parseFloat(m[1]) : 1
  return [
    {
      id: "paragraph-spacing",
      category: "wcag-1.4.12",
      label: "Paragraph spacing ≥ 1em (2× preferred)",
      detail: `${value}em`,
      verdict: value >= 2 ? "pass" : value >= 1 ? "caution" : "fail",
      scId: "1.4.12",
      scUrl: SC_URL("text-spacing"),
    },
  ]
}

function checkContrast(
  tokens: TypographyTokens,
  palette: SemanticTokens | undefined
): { checks: GradedCheck[]; contrasts: GradedRoleContrast[] } {
  if (!palette) return { checks: [], contrasts: [] }

  const contrasts: GradedRoleContrast[] = []
  const checks: GradedCheck[] = []

  for (const role of ROLES_TO_GRADE) {
    const style = tokens.styles[role] as TypeStyle
    const isLarge = style.fontSizePx.max >= 18 || (style.fontSizePx.max >= 14 && style.fontWeight >= 600)
    const requiredRatio = isLarge ? 3 : 4.5
    const apcaTarget = isLarge ? 60 : 75

    // Test against the page background.
    const bg = palette.background
    const fg = roleForeground(role, palette)
    const ratio = contrastRatioWCAG(fg, bg)
    const lc = apcaContrast(fg, bg)
    contrasts.push({
      role,
      fg,
      bg,
      wcag: {
        ratio,
        level: wcagLevel(ratio, isLarge),
        required: requiredRatio,
        pass: ratio >= requiredRatio,
      },
      apca: {
        lc,
        level: apcaLevel(lc, isLarge ? "large-text" : "fluent-text"),
        pass: Math.abs(lc) >= apcaTarget,
      },
    })
  }

  // Roll up worst body / heading contrast into checks
  const bodyContrast = contrasts.find((c) => c.role === "body")
  if (bodyContrast) {
    checks.push({
      id: "body-contrast",
      category: "contrast",
      label: "Body text contrast on background",
      detail: `WCAG ${bodyContrast.wcag.ratio.toFixed(2)}:1 · APCA Lc ${Math.round(
        Math.abs(bodyContrast.apca.lc)
      )}`,
      verdict:
        bodyContrast.wcag.pass && bodyContrast.apca.pass
          ? "pass"
          : bodyContrast.wcag.pass || bodyContrast.apca.pass
          ? "caution"
          : "fail",
      scId: "1.4.3",
      scUrl: SC_URL("contrast-minimum"),
    })
  }

  return { checks, contrasts }
}

function roleForeground(role: ScaleRoleKey, palette: SemanticTokens): string {
  switch (role) {
    case "small":
    case "caption":
      return palette.muted
    case "code":
      return palette.foreground
    default:
      return palette.foreground
  }
}

export function gradeTypography(
  tokens: TypographyTokens,
  palette?: SemanticTokens
): TypographyReport {
  const allChecks: GradedCheck[] = [
    ...checkBody(tokens),
    ...checkLineLength(tokens),
    ...checkHeadingHierarchy(tokens),
    ...checkBodyVsHeading(tokens),
    ...checkParagraphSpacing(tokens),
  ]
  const { checks: contrastChecks, contrasts } = checkContrast(tokens, palette)
  allChecks.push(...contrastChecks)

  const summary = allChecks.reduce(
    (acc, c) => {
      acc[c.verdict]++
      return acc
    },
    { pass: 0, caution: 0, fail: 0 }
  )

  return { checks: allChecks, contrasts, summary }
}
