/**
 * Ready-made accessible UI palettes (light and dark) and color-blind-safe chart palettes for
 * /accessible-color-palettes. Every pairing is re-checked at build time by
 * checkUiPalette() and checkChartPalette() below, and the page shows the computed numbers,
 * so a color edited here cannot silently ship a failing claim. scripts/palettes/check.ts
 * fails if any palette drops below its targets.
 */

import { contrastRatioWCAG } from "@/lib/color/oklch"
import { apcaContrast } from "@/lib/color/apca"
import { simulateHex, type CVDType } from "@/lib/color/cvd"
import { deltaEOK } from "@/lib/color/distance"

export interface UiTheme {
  /** Page background */
  bg: string
  /** Cards, panels, table stripes */
  surface: string
  /** Body text */
  text: string
  /** Secondary text, captions, help text */
  muted: string
  /** Filled button and key accents */
  primary: string
  /** Text and icons on the primary color */
  onPrimary: string
  /** Links and text-colored accents on bg */
  link: string
  /** Input borders and other control boundaries */
  border: string
}

export interface UiPalette {
  slug: string
  name: string
  mood: string
  light: UiTheme
  dark: UiTheme
}

export interface ChartPalette {
  slug: string
  name: string
  credit: string
  creditHref: string
  colors: { hex: string; name: string }[]
  note: string
}

export const uiPalettes: UiPalette[] = [
  {
    slug: "ocean",
    name: "Ocean",
    mood: "Trustworthy blue for SaaS, finance and dashboards.",
    light: { bg: "#FFFFFF", surface: "#F1F5F9", text: "#0F172A", muted: "#475569", primary: "#1D4ED8", onPrimary: "#FFFFFF", link: "#1D4ED8", border: "#64748B" },
    dark: { bg: "#0B1220", surface: "#16213A", text: "#F1F5F9", muted: "#A3B1C6", primary: "#60A5FA", onPrimary: "#0B1220", link: "#93C5FD", border: "#7C8BA3" },
  },
  {
    slug: "forest",
    name: "Forest",
    mood: "Calm green for sustainability, health and outdoor brands.",
    light: { bg: "#FFFFFF", surface: "#F0FDF4", text: "#052E16", muted: "#3F5D4B", primary: "#15803D", onPrimary: "#FFFFFF", link: "#166534", border: "#5F7A68" },
    dark: { bg: "#0A1A10", surface: "#13291B", text: "#ECFDF5", muted: "#A7C4B2", primary: "#4ADE80", onPrimary: "#052E16", link: "#86EFAC", border: "#6E8F7A" },
  },
  {
    slug: "sunset",
    name: "Sunset",
    mood: "Warm orange for food, travel and consumer apps.",
    light: { bg: "#FFFBF7", surface: "#FFF1E6", text: "#2A1406", muted: "#6B4A36", primary: "#C2410C", onPrimary: "#FFFFFF", link: "#9A3412", border: "#8A6A57" },
    dark: { bg: "#1A0F08", surface: "#2A1A10", text: "#FFF4EC", muted: "#D2B4A0", primary: "#FB923C", onPrimary: "#1A0F08", link: "#FDBA74", border: "#9A7A66" },
  },
  {
    slug: "berry",
    name: "Berry",
    mood: "Bold purple for creative tools, education and events.",
    light: { bg: "#FFFFFF", surface: "#FAF5FF", text: "#1E1033", muted: "#5B4B6E", primary: "#7E22CE", onPrimary: "#FFFFFF", link: "#6B21A8", border: "#7A6A8C" },
    dark: { bg: "#140B1F", surface: "#221433", text: "#F5EEFF", muted: "#C2B2D6", primary: "#C084FC", onPrimary: "#140B1F", link: "#D8B4FE", border: "#8B7BA0" },
  },
  {
    slug: "clinic",
    name: "Clinic",
    mood: "Clean teal for healthcare, wellbeing and public services.",
    light: { bg: "#FFFFFF", surface: "#F0FDFA", text: "#042F2E", muted: "#3D5C5A", primary: "#0F766E", onPrimary: "#FFFFFF", link: "#115E59", border: "#5C7A78" },
    dark: { bg: "#071816", surface: "#102825", text: "#EEFDFB", muted: "#A3C7C2", primary: "#2DD4BF", onPrimary: "#042F2E", link: "#5EEAD4", border: "#6A8D88" },
  },
  {
    slug: "civic",
    name: "Civic",
    mood: "Serious red and navy for government, news and nonprofits.",
    light: { bg: "#FFFFFF", surface: "#F8FAFC", text: "#111827", muted: "#4B5563", primary: "#B91C1C", onPrimary: "#FFFFFF", link: "#1E3A8A", border: "#6B7280" },
    dark: { bg: "#0F1115", surface: "#1A1D24", text: "#F9FAFB", muted: "#B4BAC5", primary: "#F87171", onPrimary: "#0F1115", link: "#93C5FD", border: "#7D8593" },
  },
  {
    slug: "graphite",
    name: "Graphite",
    mood: "Neutral monochrome for portfolios, docs and developer tools.",
    light: { bg: "#FFFFFF", surface: "#F4F4F5", text: "#18181B", muted: "#52525B", primary: "#18181B", onPrimary: "#FFFFFF", link: "#1D4ED8", border: "#71717A" },
    dark: { bg: "#09090B", surface: "#18181B", text: "#FAFAFA", muted: "#A1A1AA", primary: "#FAFAFA", onPrimary: "#09090B", link: "#93C5FD", border: "#71717A" },
  },
  {
    slug: "honey",
    name: "Honey",
    mood: "Friendly amber with dark text, for retail and community sites.",
    light: { bg: "#FFFDF5", surface: "#FEF3C7", text: "#1C1917", muted: "#57534E", primary: "#D97706", onPrimary: "#1C1917", link: "#92400E", border: "#78716C" },
    dark: { bg: "#14110A", surface: "#241E10", text: "#FEF9EC", muted: "#C9BFA6", primary: "#FBBF24", onPrimary: "#1C1917", link: "#FCD34D", border: "#857B63" },
  },
]

export const chartPalettes: ChartPalette[] = [
  {
    slug: "okabe-ito",
    name: "Okabe-Ito",
    credit: "Masataka Okabe and Kei Ito, Color Universal Design",
    creditHref: "https://jfly.uni-koeln.de/color/",
    colors: [
      { hex: "#E69F00", name: "Orange" },
      { hex: "#56B4E9", name: "Sky blue" },
      { hex: "#009E73", name: "Bluish green" },
      { hex: "#F0E442", name: "Yellow" },
      { hex: "#0072B2", name: "Blue" },
      { hex: "#D55E00", name: "Vermillion" },
      { hex: "#CC79A7", name: "Reddish purple" },
      { hex: "#000000", name: "Black" },
    ],
    note: "The most widely used color-blind-safe categorical set. Yellow and sky blue are too light for text on white; use them for fills with dark outlines or labels.",
  },
  {
    slug: "tol-bright",
    name: "Paul Tol bright",
    credit: "Paul Tol, SRON",
    creditHref: "https://personal.sron.nl/~pault/",
    colors: [
      { hex: "#4477AA", name: "Blue" },
      { hex: "#EE6677", name: "Red" },
      { hex: "#228833", name: "Green" },
      { hex: "#CCBB44", name: "Yellow" },
      { hex: "#66CCEE", name: "Cyan" },
      { hex: "#AA3377", name: "Purple" },
      { hex: "#BBBBBB", name: "Grey" },
    ],
    note: "Designed to stay distinct for people with color vision deficiency and in grayscale print. Keep series in this order.",
  },
  {
    slug: "tol-muted",
    name: "Paul Tol muted",
    credit: "Paul Tol, SRON",
    creditHref: "https://personal.sron.nl/~pault/",
    colors: [
      { hex: "#332288", name: "Indigo" },
      { hex: "#88CCEE", name: "Cyan" },
      { hex: "#44AA99", name: "Teal" },
      { hex: "#117733", name: "Green" },
      { hex: "#999933", name: "Olive" },
      { hex: "#DDCC77", name: "Sand" },
      { hex: "#CC6677", name: "Rose" },
      { hex: "#882255", name: "Wine" },
      { hex: "#AA4499", name: "Purple" },
    ],
    note: "Nine softer colors for charts that need many series. Add direct labels or patterns once you pass five or six series.",
  },
]

export interface PairCheck {
  label: string
  fg: string
  bg: string
  ratio: number
  /** Minimum WCAG ratio this pairing must meet */
  target: number
  criterion: "1.4.3" | "1.4.6" | "1.4.11"
  apca: number
  pass: boolean
}

function pair(label: string, fg: string, bg: string, target: number, criterion: PairCheck["criterion"]): PairCheck {
  const ratio = contrastRatioWCAG(fg, bg)
  return {
    label,
    fg,
    bg,
    ratio,
    target,
    criterion,
    apca: apcaContrast(fg, bg),
    pass: ratio >= target,
  }
}

export function checkUiTheme(t: UiTheme): PairCheck[] {
  return [
    pair("Body text on background", t.text, t.bg, 7, "1.4.6"),
    pair("Body text on surface", t.text, t.surface, 7, "1.4.6"),
    pair("Muted text on background", t.muted, t.bg, 4.5, "1.4.3"),
    pair("Muted text on surface", t.muted, t.surface, 4.5, "1.4.3"),
    pair("Button text on primary", t.onPrimary, t.primary, 4.5, "1.4.3"),
    pair("Link on background", t.link, t.bg, 4.5, "1.4.3"),
    pair("Primary button against background", t.primary, t.bg, 3, "1.4.11"),
    pair("Control border on background", t.border, t.bg, 3, "1.4.11"),
  ]
}

const CVD_TYPES: Exclude<CVDType, "normal" | "achromatopsia">[] = ["protanopia", "deuteranopia", "tritanopia"]

export interface ChartCheck {
  type: CVDType
  closest: { a: string; b: string; deltaOk: number }
}

/** Closest pair of colors (OKLab ΔE) under normal vision and each simulated deficiency. */
export function checkChartPalette(p: ChartPalette): ChartCheck[] {
  const types: CVDType[] = ["normal", ...CVD_TYPES]
  return types.map((type) => {
    const sim = p.colors.map((c) => ({ src: c.hex, hex: simulateHex(c.hex, type) }))
    let closest = { a: sim[0].src, b: sim[1].src, deltaOk: Infinity }
    for (let i = 0; i < sim.length; i++) {
      for (let j = i + 1; j < sim.length; j++) {
        const d = deltaEOK(sim[i].hex, sim[j].hex)
        if (d < closest.deltaOk) closest = { a: sim[i].src, b: sim[j].src, deltaOk: d }
      }
    }
    return { type, closest }
  })
}

export { simulateHex }
