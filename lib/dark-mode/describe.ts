import type { AdaptiveVerdict, DarkModeResult, RiskKind, Support, Where } from "@/lib/dark-mode/types"

// Plain-language text for the dark mode contrast checker, shared by the client page and anything
// that summarises a run.

export function plural(count: number, word: string, many = `${word}s`): string {
  return `${count} ${count === 1 ? word : many}`
}

export function headline(result: DarkModeResult): string {
  const { counts } = result
  const light = counts.lightOnly + counts.both
  const dark = counts.darkOnly + counts.both
  const invisible = counts.invisible > 0 ? ` ${plural(counts.invisible, "element")} with invisible text (the same colour as the background).` : ""
  if (!result.dark) return `${plural(light, "contrast failure")} in light mode. Dark mode could not be tested.${invisible}`
  if (light === 0 && dark === 0) return `No automated contrast failures in light or dark mode.${invisible}`
  return `${plural(dark, "contrast failure")} in dark mode and ${light} in light mode; ${counts.darkOnly} only appear in dark.${invisible}`
}

export const SUPPORT_LABEL: Record<Support, string> = {
  none: "Not declared",
  light: "Light (without only, so not an opt-out)",
  "light-dark": "Light and dark",
  dark: "Dark only",
  "light-only": "Light, opted out (only)",
}

export const VERDICT_LABEL: Record<AdaptiveVerdict, string> = {
  "skipped-declares-light-dark": "Safari leaves this page alone",
  "skipped-declares-dark": "Safari is likely to leave this page alone",
  "opted-out-light-only": "Opted out (not honoured in Safari 27.3 beta 1)",
  "already-dark": "Probably left alone: already dark",
  "will-adapt": "Safari will adapt this page",
}

export const WHERE_LABEL: Record<Where | "dark-only" | "light-only", string> = {
  light: "Light",
  dark: "Dark",
  both: "Both modes",
  "dark-only": "Dark only",
  "light-only": "Light only",
}

const REASONS: Record<string, string> = {
  bgImage: "Text sits on a background image",
  bgGradient: "Text sits on a gradient",
  imgNode: "Text is inside an image element",
  bgOverlap: "Another element overlaps the text",
  fgAlpha: "Text colour is partly transparent",
  elmPartiallyObscured: "Partly covered by another element",
  elmPartiallyObscuring: "Partly covers other content",
  outsideViewport: "Outside the visible area",
  pseudoContent: "Background comes from a ::before or ::after element",
  complexTextShadows: "A text shadow makes contrast hard to measure",
  shortTextContent: "Too little text to judge, such as an icon",
  emptyValue: "Empty field",
  nonBmp: "Icon font or special characters",
  colorParse: "A colour could not be read",
}

export function reasonLabel(reason: string): string {
  return REASONS[reason] ?? reason
}

export const RISK_INFO: Record<RiskKind, { title: string; explain: string }> = {
  "bitmap-logo": {
    title: "Bitmap logos and header images",
    explain:
      "Safari leaves most images unchanged and inverts only simple black and white logos. A dark logo on a transparent background can vanish on a dark page; one with a white background shows as a light box. SVG with currentColor, or a <picture> source for dark mode, avoids both.",
  },
  canvas: {
    title: "Canvas elements",
    explain: "Safari leaves <canvas> content unchanged, so a chart or drawing made for a light background stays light on a dark page.",
  },
  mask: {
    title: "CSS masks",
    explain: "WebKit says Adaptive Dark Mode turns mask effects off in some cases. Check that icons drawn with a mask still show.",
  },
  "blend-mode": {
    title: "Blend modes",
    explain: "WebKit says mix-blend-mode effects may be turned off in some cases, and a blend tuned for a light background can look very different on a dark one.",
  },
  "tiled-background": {
    title: "Repeating background images",
    explain: "WebKit advises replacing tiled background images with CSS colours and gradients, which it can adapt.",
  },
}

/** A CSS colour from axe or getComputedStyle, or null when it is not a plain hex or rgb() value. */
export function safeColour(value: string | null | undefined): string | null {
  if (!value) return null
  return /^(#[0-9a-f]{3,8}|rgba?\([\d.,\s%]+\))$/i.test(value.trim()) ? value.trim() : null
}

export function formatRatio(ratio: number | null): string {
  return ratio === null ? "n/a" : `${ratio}:1`
}
