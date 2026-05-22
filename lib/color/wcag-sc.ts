/**
 * WCAG 2.2 Success Criteria references for each pairing intent.
 * Used to deep-link from the report into the official W3C quick reference.
 */

import type { PairingIntent } from "./grade"

export interface WCAGSCRef {
  id: string
  level: "A" | "AA" | "AAA"
  title: string
  url: string
  summary: string
}

const QR = (sc: string) => `https://www.w3.org/WAI/WCAG22/quickref/#${sc}`

export const SC: Record<string, WCAGSCRef> = {
  "1.4.3": {
    id: "1.4.3",
    level: "AA",
    title: "Contrast (Minimum)",
    url: QR("contrast-minimum"),
    summary: "Text and images of text have a contrast ratio of at least 4.5:1 (3:1 for large text).",
  },
  "1.4.6": {
    id: "1.4.6",
    level: "AAA",
    title: "Contrast (Enhanced)",
    url: QR("contrast-enhanced"),
    summary: "Text has a contrast ratio of at least 7:1 (4.5:1 for large text).",
  },
  "1.4.11": {
    id: "1.4.11",
    level: "AA",
    title: "Non-text Contrast",
    url: QR("non-text-contrast"),
    summary: "UI components and graphical objects have a contrast ratio of at least 3:1 against adjacent colors.",
  },
  "1.4.1": {
    id: "1.4.1",
    level: "A",
    title: "Use of Color",
    url: QR("use-of-color"),
    summary: "Color is not used as the only visual means of conveying information.",
  },
  "2.4.7": {
    id: "2.4.7",
    level: "AA",
    title: "Focus Visible",
    url: QR("focus-visible"),
    summary: "Any keyboard operable interface has a mode of operation where the keyboard focus indicator is visible.",
  },
  "2.4.13": {
    id: "2.4.13",
    level: "AAA",
    title: "Focus Appearance",
    url: QR("focus-appearance"),
    summary: "Focus indicators meet specific size, contrast, and unobscured requirements (WCAG 2.2).",
  },
}

const INTENT_TO_SC: Record<PairingIntent, string[]> = {
  "body-text": ["1.4.3", "1.4.6"],
  "large-text": ["1.4.3"],
  "ui-component": ["1.4.11"],
  "focus-indicator": ["1.4.11", "2.4.7", "2.4.13"],
}

export function scForIntent(intent: PairingIntent): WCAGSCRef[] {
  return INTENT_TO_SC[intent].map((id) => SC[id]).filter(Boolean)
}

export const APCA_DOC_URL = "https://github.com/Myndex/apca-w3#--lookup-tables"
