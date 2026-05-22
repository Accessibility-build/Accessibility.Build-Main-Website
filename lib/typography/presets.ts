/**
 * Font stacks + accessibility presets.
 *
 * Font stacks include the Google-Fonts import URL (when applicable) so the
 * exports can wire up the font automatically.
 */

export interface FontStack {
  key: string
  label: string
  family: string // CSS value
  category: "sans" | "serif" | "mono" | "display" | "accessibility"
  googleFontUrl?: string
  notes: string
}

export const FONT_STACKS: FontStack[] = [
  {
    key: "system",
    label: "System (native)",
    family:
      `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    category: "sans",
    notes: "Fastest. Uses the OS UI font on every platform.",
  },
  {
    key: "inter",
    label: "Inter",
    family: `"Inter", system-ui, -apple-system, Arial, sans-serif`,
    category: "sans",
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
    notes: "Designed for screens. Versatile default for SaaS UI.",
  },
  {
    key: "geist",
    label: "Geist",
    family: `"Geist", system-ui, -apple-system, sans-serif`,
    category: "sans",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap",
    notes: "Vercel's neutral geometric sans. Crisp on dashboards.",
  },
  {
    key: "ibm-plex-sans",
    label: "IBM Plex Sans",
    family: `"IBM Plex Sans", system-ui, sans-serif`,
    category: "sans",
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
    notes: "Technical, slightly mechanical. Great for products that ship to engineers.",
  },
  {
    key: "atkinson",
    label: "Atkinson Hyperlegible",
    family: `"Atkinson Hyperlegible", system-ui, sans-serif`,
    category: "accessibility",
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap",
    notes: "Designed by the Braille Institute for maximum letterform distinction. Excellent for low-vision users.",
  },
  {
    key: "lexend",
    label: "Lexend",
    family: `"Lexend", system-ui, sans-serif`,
    category: "accessibility",
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap",
    notes: "Designed to reduce visual stress and improve reading proficiency.",
  },
  {
    key: "open-dyslexic",
    label: "OpenDyslexic",
    family: `"OpenDyslexic", "Comic Sans MS", system-ui, sans-serif`,
    category: "accessibility",
    googleFontUrl: undefined,
    notes:
      "Weighted bottoms aid readers with dyslexia. Self-hosted — see opendyslexic.org.",
  },
  {
    key: "georgia",
    label: "Georgia",
    family: `Georgia, "Iowan Old Style", Charter, serif`,
    category: "serif",
    notes: "Classic web serif. Reads well on screens.",
  },
  {
    key: "source-serif",
    label: "Source Serif",
    family: `"Source Serif Pro", Georgia, serif`,
    category: "serif",
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&display=swap",
    notes: "Editorial serif with strong screen readability.",
  },
  {
    key: "merriweather",
    label: "Merriweather",
    family: `Merriweather, Georgia, serif`,
    category: "serif",
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",
    notes: "Long-form reading serif.",
  },
  {
    key: "mono-system",
    label: "Mono (system)",
    family: `ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`,
    category: "mono",
    notes: "Native monospace stack.",
  },
  {
    key: "jetbrains-mono",
    label: "JetBrains Mono",
    family: `"JetBrains Mono", ui-monospace, Menlo, monospace`,
    category: "mono",
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap",
    notes: "Programming-oriented monospace with great ligatures.",
  },
]

export function fontByKey(key: string): FontStack | undefined {
  return FONT_STACKS.find((f) => f.key === key)
}

/* ───────────────────────────── Accessibility presets ─────────────────────────── */

export interface AccessibilityPreset {
  key: string
  label: string
  description: string
  basePx: number
  ratio: number
  lineHeightBoost: number
  letterSpacingBoost: number // additional em
  paragraphSpacingMultiplier: number
  maxLineLengthCh: number
  fontKey?: string
}

export const ACCESSIBILITY_PRESETS: AccessibilityPreset[] = [
  {
    key: "default",
    label: "WCAG 2.2 default",
    description: "Meets WCAG 2.2 AA minimums — 16px body, 1.5 line-height, 65ch max line.",
    basePx: 16,
    ratio: 1.25,
    lineHeightBoost: 0,
    letterSpacingBoost: 0,
    paragraphSpacingMultiplier: 1,
    maxLineLengthCh: 65,
  },
  {
    key: "dyslexia",
    label: "Dyslexia-friendly",
    description:
      "18px body, looser tracking and spacing, ≤ 60ch line length, Atkinson Hyperlegible. British Dyslexia Association recommended.",
    basePx: 18,
    ratio: 1.2,
    lineHeightBoost: 0.2,
    letterSpacingBoost: 0.03,
    paragraphSpacingMultiplier: 1.5,
    maxLineLengthCh: 60,
    fontKey: "atkinson",
  },
  {
    key: "low-vision",
    label: "Low-vision",
    description:
      "20px body, larger headings, generous spacing, ≤ 55ch line length. Optimized for screen magnifier use.",
    basePx: 20,
    ratio: 1.25,
    lineHeightBoost: 0.25,
    letterSpacingBoost: 0,
    paragraphSpacingMultiplier: 1.6,
    maxLineLengthCh: 55,
  },
  {
    key: "cognitive",
    label: "Cognitive load",
    description:
      "Calm hierarchy (1.2 ratio), 1.75 line-height, Lexend for reduced visual stress, ≤ 60ch.",
    basePx: 17,
    ratio: 1.2,
    lineHeightBoost: 0.15,
    letterSpacingBoost: 0.02,
    paragraphSpacingMultiplier: 1.5,
    maxLineLengthCh: 60,
    fontKey: "lexend",
  },
  {
    key: "editorial",
    label: "Editorial / long-form",
    description:
      "Larger 19px body in a serif, 1.65 line-height, ≤ 70ch for comfortable long-form reading.",
    basePx: 19,
    ratio: 1.25,
    lineHeightBoost: 0.05,
    letterSpacingBoost: 0,
    paragraphSpacingMultiplier: 1.4,
    maxLineLengthCh: 70,
    fontKey: "source-serif",
  },
  {
    key: "compact",
    label: "Compact UI",
    description:
      "14px body for dense data dashboards — still meets WCAG AA when contrast is high, but verify with the report.",
    basePx: 14,
    ratio: 1.2,
    lineHeightBoost: 0,
    letterSpacingBoost: 0,
    paragraphSpacingMultiplier: 1,
    maxLineLengthCh: 80,
  },
]

export function presetByKey(key: string): AccessibilityPreset | undefined {
  return ACCESSIBILITY_PRESETS.find((p) => p.key === key)
}
