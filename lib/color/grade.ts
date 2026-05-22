/**
 * State-aware grading. Builds standard UI pairings from a SemanticTokens object,
 * scores each pair through both WCAG 2.2 and APCA, and returns a structured report.
 */

import { contrastRatioWCAG, wcagLevel, type WCAGLevel } from "./oklch"
import { apcaContrast, apcaLevel, apcaThreshold, type APCALevel, type APCAUseCase } from "./apca"
import type { SemanticTokens } from "./tokens"

export type PairingState = "rest" | "hover" | "active" | "focus" | "disabled" | "overlay"
export type PairingIntent = "body-text" | "large-text" | "ui-component" | "focus-indicator"

export interface Pairing {
  id: string
  label: string
  group: "text" | "button" | "alert" | "border" | "focus" | "link"
  state: PairingState
  fg: string
  bg: string
  intent: PairingIntent
}

export interface GradedPairing extends Pairing {
  wcag: {
    ratio: number
    level: WCAGLevel
    required: number
    pass: boolean
  }
  apca: {
    lc: number
    level: APCALevel
    useCase: APCAUseCase
    threshold: number
  }
}

export interface PaletteReport {
  pairings: GradedPairing[]
  summary: {
    total: number
    pass: number
    caution: number
    fail: number
  }
}

const WCAG_REQUIRED: Record<PairingIntent, number> = {
  "body-text": 4.5,
  "large-text": 3,
  "ui-component": 3,
  "focus-indicator": 3,
}

const APCA_USE_CASE: Record<PairingIntent, APCAUseCase> = {
  "body-text": "fluent-text",
  "large-text": "large-text",
  "ui-component": "ui-component",
  "focus-indicator": "non-text",
}

export function gradePairing(p: Pairing): GradedPairing {
  const ratio = contrastRatioWCAG(p.fg, p.bg)
  const required = WCAG_REQUIRED[p.intent]
  const lc = apcaContrast(p.fg, p.bg)
  const useCase = APCA_USE_CASE[p.intent]

  return {
    ...p,
    wcag: {
      ratio,
      level: wcagLevel(ratio, p.intent === "large-text"),
      required,
      pass: ratio >= required,
    },
    apca: {
      lc,
      level: apcaLevel(lc, useCase),
      useCase,
      threshold: apcaThreshold(useCase).caution,
    },
  }
}

export function buildPairings(t: SemanticTokens): Pairing[] {
  const pairings: Pairing[] = [
    // === Text ===
    {
      id: "fg-on-bg",
      label: "Body text on background",
      group: "text",
      state: "rest",
      fg: t.foreground,
      bg: t.background,
      intent: "body-text",
    },
    {
      id: "fg-on-surface",
      label: "Body text on surface",
      group: "text",
      state: "rest",
      fg: t.foreground,
      bg: t.surface,
      intent: "body-text",
    },
    {
      id: "muted-on-bg",
      label: "Muted text on background",
      group: "text",
      state: "rest",
      fg: t.muted,
      bg: t.background,
      intent: "large-text",
    },
    {
      id: "subtle-on-bg",
      label: "Subtle text on background",
      group: "text",
      state: "rest",
      fg: t.subtle,
      bg: t.background,
      intent: "large-text",
    },

    // === Primary button ===
    {
      id: "primary-rest",
      label: "Primary button (rest)",
      group: "button",
      state: "rest",
      fg: t.primaryForeground,
      bg: t.primary,
      intent: "body-text",
    },
    {
      id: "primary-hover",
      label: "Primary button (hover)",
      group: "button",
      state: "hover",
      fg: t.primaryForeground,
      bg: t.primaryHover,
      intent: "body-text",
    },
    {
      id: "primary-active",
      label: "Primary button (active)",
      group: "button",
      state: "active",
      fg: t.primaryForeground,
      bg: t.primaryActive,
      intent: "body-text",
    },

    // === Secondary button ===
    {
      id: "secondary-rest",
      label: "Secondary button (rest)",
      group: "button",
      state: "rest",
      fg: t.secondaryForeground,
      bg: t.secondary,
      intent: "body-text",
    },
    {
      id: "secondary-hover",
      label: "Secondary button (hover)",
      group: "button",
      state: "hover",
      fg: t.secondaryForeground,
      bg: t.secondaryHover,
      intent: "body-text",
    },

    // === Disabled ===
    {
      id: "disabled",
      label: "Disabled button",
      group: "button",
      state: "disabled",
      fg: t.disabledForeground,
      bg: t.disabled,
      intent: "body-text",
    },

    // === Link ===
    {
      id: "link-on-bg",
      label: "Link on background",
      group: "link",
      state: "rest",
      fg: t.primary,
      bg: t.background,
      intent: "body-text",
    },
    {
      id: "link-on-surface",
      label: "Link on surface",
      group: "link",
      state: "rest",
      fg: t.primary,
      bg: t.surface,
      intent: "body-text",
    },

    // === Focus ring (UI 3:1) ===
    {
      id: "focus-on-bg",
      label: "Focus ring on background",
      group: "focus",
      state: "focus",
      fg: t.focus,
      bg: t.background,
      intent: "focus-indicator",
    },
    {
      id: "focus-on-surface",
      label: "Focus ring on surface",
      group: "focus",
      state: "focus",
      fg: t.focus,
      bg: t.surface,
      intent: "focus-indicator",
    },

    // === Borders ===
    {
      id: "border-on-bg",
      label: "Border on background",
      group: "border",
      state: "rest",
      fg: t.border,
      bg: t.background,
      intent: "ui-component",
    },

    // === Semantic alerts ===
    {
      id: "success-filled",
      label: "Success filled",
      group: "alert",
      state: "rest",
      fg: t.successForeground,
      bg: t.success,
      intent: "body-text",
    },
    {
      id: "success-tinted",
      label: "Success text on tint",
      group: "alert",
      state: "rest",
      fg: t.success,
      bg: t.successSurface,
      intent: "body-text",
    },
    {
      id: "warning-filled",
      label: "Warning filled",
      group: "alert",
      state: "rest",
      fg: t.warningForeground,
      bg: t.warning,
      intent: "body-text",
    },
    {
      id: "warning-tinted",
      label: "Warning text on tint",
      group: "alert",
      state: "rest",
      fg: t.warning,
      bg: t.warningSurface,
      intent: "body-text",
    },
    {
      id: "danger-filled",
      label: "Danger filled",
      group: "alert",
      state: "rest",
      fg: t.dangerForeground,
      bg: t.danger,
      intent: "body-text",
    },
    {
      id: "danger-tinted",
      label: "Danger text on tint",
      group: "alert",
      state: "rest",
      fg: t.danger,
      bg: t.dangerSurface,
      intent: "body-text",
    },
    {
      id: "info-filled",
      label: "Info filled",
      group: "alert",
      state: "rest",
      fg: t.infoForeground,
      bg: t.info,
      intent: "body-text",
    },
  ]
  return pairings
}

export function gradeTokens(t: SemanticTokens): PaletteReport {
  const pairings = buildPairings(t).map(gradePairing)
  const summary = pairings.reduce(
    (acc, p) => {
      acc.total++
      const wcagOk = p.wcag.pass
      const apcaOk = p.apca.level === "Pass"
      if (wcagOk && apcaOk) acc.pass++
      else if (p.wcag.ratio >= 3 || p.apca.level !== "Fail") acc.caution++
      else acc.fail++
      return acc
    },
    { total: 0, pass: 0, caution: 0, fail: 0 }
  )
  return { pairings, summary }
}
