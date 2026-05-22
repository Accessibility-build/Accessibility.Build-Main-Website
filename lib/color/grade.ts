/**
 * State-aware grading. Builds standard UI pairings from a SemanticTokens object,
 * scores each pair through both WCAG 2.2 and APCA, and returns a structured report.
 */

import { contrastRatioWCAG, wcagLevel, type WCAGLevel } from "./oklch"
import { apcaContrast, apcaLevel, apcaThreshold, type APCALevel, type APCAUseCase } from "./apca"
import { simulateHex, type CVDType } from "./cvd"
import { deltaEOK } from "./distance"
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
  /** Which SemanticTokens key the fg comes from — used by auto-fix to apply overrides. */
  fgKey: keyof SemanticTokens
  bgKey: keyof SemanticTokens
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

type PairingSpec = {
  id: string
  label: string
  group: Pairing["group"]
  state: PairingState
  fgKey: keyof SemanticTokens
  bgKey: keyof SemanticTokens
  intent: PairingIntent
}

const PAIRING_SPECS: PairingSpec[] = [
  // === Text ===
  { id: "fg-on-bg", label: "Body text on background", group: "text", state: "rest", fgKey: "foreground", bgKey: "background", intent: "body-text" },
  { id: "fg-on-surface", label: "Body text on surface", group: "text", state: "rest", fgKey: "foreground", bgKey: "surface", intent: "body-text" },
  { id: "muted-on-bg", label: "Muted text on background", group: "text", state: "rest", fgKey: "muted", bgKey: "background", intent: "large-text" },
  { id: "subtle-on-bg", label: "Subtle text on background", group: "text", state: "rest", fgKey: "subtle", bgKey: "background", intent: "large-text" },
  // === Primary button ===
  { id: "primary-rest", label: "Primary button (rest)", group: "button", state: "rest", fgKey: "primaryForeground", bgKey: "primary", intent: "body-text" },
  { id: "primary-hover", label: "Primary button (hover)", group: "button", state: "hover", fgKey: "primaryForeground", bgKey: "primaryHover", intent: "body-text" },
  { id: "primary-active", label: "Primary button (active)", group: "button", state: "active", fgKey: "primaryForeground", bgKey: "primaryActive", intent: "body-text" },
  // === Secondary ===
  { id: "secondary-rest", label: "Secondary button (rest)", group: "button", state: "rest", fgKey: "secondaryForeground", bgKey: "secondary", intent: "body-text" },
  { id: "secondary-hover", label: "Secondary button (hover)", group: "button", state: "hover", fgKey: "secondaryForeground", bgKey: "secondaryHover", intent: "body-text" },
  // === Disabled ===
  { id: "disabled", label: "Disabled button", group: "button", state: "disabled", fgKey: "disabledForeground", bgKey: "disabled", intent: "body-text" },
  // === Links ===
  { id: "link-on-bg", label: "Link on background", group: "link", state: "rest", fgKey: "primary", bgKey: "background", intent: "body-text" },
  { id: "link-on-surface", label: "Link on surface", group: "link", state: "rest", fgKey: "primary", bgKey: "surface", intent: "body-text" },
  // === Focus ===
  { id: "focus-on-bg", label: "Focus ring on background", group: "focus", state: "focus", fgKey: "focus", bgKey: "background", intent: "focus-indicator" },
  { id: "focus-on-surface", label: "Focus ring on surface", group: "focus", state: "focus", fgKey: "focus", bgKey: "surface", intent: "focus-indicator" },
  // === Borders ===
  { id: "border-on-bg", label: "Border on background", group: "border", state: "rest", fgKey: "border", bgKey: "background", intent: "ui-component" },
  // === Alerts ===
  { id: "success-filled", label: "Success filled", group: "alert", state: "rest", fgKey: "successForeground", bgKey: "success", intent: "body-text" },
  { id: "success-tinted", label: "Success text on tint", group: "alert", state: "rest", fgKey: "success", bgKey: "successSurface", intent: "body-text" },
  { id: "warning-filled", label: "Warning filled", group: "alert", state: "rest", fgKey: "warningForeground", bgKey: "warning", intent: "body-text" },
  { id: "warning-tinted", label: "Warning text on tint", group: "alert", state: "rest", fgKey: "warning", bgKey: "warningSurface", intent: "body-text" },
  { id: "danger-filled", label: "Danger filled", group: "alert", state: "rest", fgKey: "dangerForeground", bgKey: "danger", intent: "body-text" },
  { id: "danger-tinted", label: "Danger text on tint", group: "alert", state: "rest", fgKey: "danger", bgKey: "dangerSurface", intent: "body-text" },
  { id: "info-filled", label: "Info filled", group: "alert", state: "rest", fgKey: "infoForeground", bgKey: "info", intent: "body-text" },
]

export function buildPairings(t: SemanticTokens): Pairing[] {
  return PAIRING_SPECS.map((spec) => ({
    ...spec,
    fg: t[spec.fgKey] as string,
    bg: t[spec.bgKey] as string,
  }))
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

// ─── CVD collision detection ────────────────────────────────────────────────

export interface CVDCollision {
  cvd: CVDType
  pairs: { a: { name: string; hex: string }; b: { name: string; hex: string }; deltaOk: number }[]
}

const SEMANTIC_PAIRS: { name: string; key: keyof SemanticTokens }[] = [
  { name: "primary", key: "primary" },
  { name: "secondary", key: "secondary" },
  { name: "accent", key: "accent" },
  { name: "success", key: "success" },
  { name: "warning", key: "warning" },
  { name: "danger", key: "danger" },
  { name: "info", key: "info" },
]

/**
 * Returns any semantic-color pairs that become visually indistinguishable
 * under the given CVD. Useful for catching success/danger collapse under
 * deuteranopia (the classic red-green confusion).
 */
export function detectCVDCollisions(
  t: SemanticTokens,
  cvds: CVDType[] = ["protanopia", "deuteranopia", "tritanopia"],
  threshold = 0.06
): CVDCollision[] {
  const items = SEMANTIC_PAIRS.map((s) => ({ name: s.name, hex: t[s.key] as string }))
  const results: CVDCollision[] = []
  for (const cvd of cvds) {
    const simulated = items.map((it) => ({ ...it, simHex: simulateHex(it.hex, cvd) }))
    const collisions: CVDCollision["pairs"] = []
    for (let i = 0; i < simulated.length; i++) {
      for (let j = i + 1; j < simulated.length; j++) {
        const d = deltaEOK(simulated[i].simHex, simulated[j].simHex)
        if (d < threshold) {
          collisions.push({
            a: { name: simulated[i].name, hex: simulated[i].hex },
            b: { name: simulated[j].name, hex: simulated[j].hex },
            deltaOk: d,
          })
        }
      }
    }
    if (collisions.length) results.push({ cvd, pairs: collisions })
  }
  return results
}
