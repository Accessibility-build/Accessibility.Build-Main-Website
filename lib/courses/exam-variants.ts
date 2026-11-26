// Generated final-exam questions. Each template draws its values from a seed and computes the answer,
// so the same template produces a different question on every paper and memorized answers do not
// transfer. Pure functions: rendered and graded on the server only.

export interface VariantQuestion {
  sec: string
  stem: string
  options: string[]
  answer: number
}

export type VariantType = "contrast-text" | "focus-contrast" | "target-size" | "text-spacing" | "reflow-zoom"

/** Which section each template belongs to. */
export const VARIANT_SECTIONS: Record<VariantType, string> = {
  "contrast-text": "I.B",
  "text-spacing": "I.D",
  "reflow-zoom": "I.E",
  "focus-contrast": "II.A",
  "target-size": "II.B",
}

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const pick = <T,>(r: () => number, list: readonly T[]) => list[Math.floor(r() * list.length)]

const hex = (n: number[]) => `#${n.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase()}`
function lum(rgb: number[]) {
  const [R, G, B] = rgb.map((c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 })
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}
export function ratioOf(a: number[], b: number[]) {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}
/** Truncated, never rounded up: 4.499 shows as 4.49. */
const shown = (r: number) => (Math.floor(r * 100) / 100).toFixed(2)
/** A naive (and wrong) ratio: no gamma correction. Used for a plausible miscalculation. */
function naiveRatio(a: number[], b: number[]) {
  const l = (c: number[]) => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255
  const [x, y] = [l(a), l(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

/** A random colour whose ratio against bg falls inside [lo, hi]. */
function colorInBand(r: () => number, bg: number[], lo: number, hi: number, darkText: boolean) {
  for (let i = 0; i < 4000; i++) {
    const c = darkText ? [0, 0, 0].map(() => Math.floor(r() * 170)) : [0, 0, 0].map(() => 90 + Math.floor(r() * 166))
    const q = ratioOf(c, bg)
    if (q >= lo && q <= hi) return c
  }
  return null
}

const LIGHT_BGS = [[255, 255, 255], [249, 250, 251], [243, 244, 246], [255, 251, 235], [240, 249, 255], [245, 243, 255]]
const DARK_BGS = [[17, 24, 39], [30, 41, 59], [15, 23, 42], [31, 41, 55]]

function shuffleWithAnswer(r: () => number, correct: string, wrong: string[]) {
  const all = [correct, ...wrong]
  const order = all.map((_, i) => i).sort(() => r() - 0.5)
  const options = order.map((i) => all[i])
  return { options, answer: options.indexOf(correct) }
}

function contrastText(r: () => number): VariantQuestion | null {
  // Sizes include traps: 18 px bold and 22 px regular are NOT large text (large is 24 px, or 18.66 px bold).
  const size = pick(r, [
    { px: 14, bold: false, large: false }, { px: 16, bold: false, large: false }, { px: 18, bold: true, large: false },
    { px: 22, bold: false, large: false }, { px: 20, bold: true, large: true }, { px: 24, bold: false, large: true }, { px: 28, bold: false, large: true },
  ] as const)
  const req = size.large ? 3 : 4.5
  const passes = r() < 0.5
  const dark = r() < 0.75
  const bg = dark ? pick(r, LIGHT_BGS) : pick(r, DARK_BGS)
  const fg = passes ? colorInBand(r, bg, req + 0.2, req + 2.2, dark) : colorInBand(r, bg, Math.max(1.6, req - 1.8), req - 0.2, dark)
  if (!fg) return null
  const ratio = ratioOf(fg, bg)
  const naive = naiveRatio(fg, bg)
  if (Math.abs(naive - ratio) < 0.4 || Math.abs(ratio - 7) < 0.2) return null
  const R = shown(ratio), N = shown(naive)
  const label = size.large ? "large text" : "normal-size text"
  const other = size.large ? "normal-size text" : "large text"
  const otherReq = size.large ? 4.5 : 3
  const verdict = (ok: boolean) => (ok ? "It passes" : "It fails")
  const correct = `${verdict(passes)}: the ratio is ${R}:1 and ${label} needs ${req}:1.`
  const wrong = [
    `${verdict(ratio >= otherReq)}: the ratio is ${R}:1 and this counts as ${other}, which needs ${otherReq}:1.`,
    `${verdict(ratio >= 7)}: the ratio is ${R}:1 and Level AA needs 7:1 for this text.`,
    `${verdict(naive >= req)}: the ratio is ${N}:1 and ${label} needs ${req}:1.`,
  ]
  if (new Set([correct, ...wrong]).size < 4) return null
  const where = pick(r, ["A product card", "A pricing table", "A sign-up form hint", "A dashboard label", "A footer link list", "A banner"])
  return { sec: "I.B", stem: `${where} uses ${hex(fg)} text on a ${hex(bg)} background. The text is ${size.px} px ${size.bold ? "bold" : "regular"}. Measured against 1.4.3 Contrast (Minimum), what is the result?`, ...shuffleWithAnswer(r, correct, wrong) }
}

function focusContrast(r: () => number): VariantQuestion | null {
  const passes = r() < 0.5
  const dark = r() < 0.6
  const bg = dark ? pick(r, LIGHT_BGS) : pick(r, DARK_BGS)
  const ring = passes ? colorInBand(r, bg, 3.25, 6, dark) : colorInBand(r, bg, 1.6, 2.75, dark)
  if (!ring) return null
  const ratio = ratioOf(ring, bg), naive = naiveRatio(ring, bg)
  if (Math.abs(naive - ratio) < 0.4) return null
  const R = shown(ratio), N = shown(naive)
  const yes = (ok: boolean) => (ok ? "It reaches 3:1" : "It does not reach 3:1")
  const correct = `${yes(passes)}: the ratio against the background is ${R}:1.`
  const wrong = [
    `${yes(naive >= 3)}: the ratio against the background is ${N}:1.`,
    `${ratio >= 4.5 ? "It is enough" : "It is not enough"}: focus indicators need 4.5:1, the same as body text, and this is ${R}:1.`,
    `It cannot be judged: contrast only applies to text, so focus indicators are never measured.`,
  ]
  const thick = pick(r, [2, 3])
  return { sec: "II.A", stem: `A button on a ${hex(bg)} page shows focus with a ${thick} px solid ${hex(ring)} outline drawn outside the button, so the outline sits on the page background. Checked against the 3:1 ratio used by 1.4.11 Non-text Contrast, what is the result?`, ...shuffleWithAnswer(r, correct, wrong) }
}

function targetSize(r: () => number): VariantQuestion | null {
  const size = pick(r, [16, 18, 20, 22, 26, 28, 32, 40])
  const gap = Math.floor(r() * 15)
  const sum = size + gap
  if (size < 24 && sum >= 22 && sum <= 26) return null
  const where = pick(r, ["a toolbar of icon buttons", "a row of pagination links", "a row of social media icon links", "a set of carousel dot buttons"])
  const big = "It meets 2.5.8: each target is at least 24 by 24 CSS px."
  const spaced = "It meets 2.5.8 through the spacing exception: a 24 CSS px circle centred on each target does not overlap another target or circle."
  const fails = "It fails 2.5.8: the targets are under 24 CSS px and the 24 px circles overlap."
  const aaa = "It fails 2.5.8: Level AA requires targets of at least 44 by 44 CSS px."
  const needsGap = "It fails 2.5.8: targets must also have at least 24 CSS px of space between them."
  // When targets are already 24 px, the spacing statement would also read as true, so it is not offered.
  const correct = size >= 24 ? big : sum >= 24 ? spaced : fails
  const wrong = size >= 24 ? [fails, aaa, needsGap] : [big, spaced, fails, aaa].filter((o) => o !== correct)
  return { sec: "II.B", stem: `In ${where}, each target is ${size} by ${size} CSS px with ${gap} CSS px between neighbours. The targets sit in a single row with nothing else above or below them. What is the result against 2.5.8 Target Size (Minimum)?`, ...shuffleWithAnswer(r, correct, wrong.slice(0, 3)) }
}

const px = (n: number) => `${Number(n.toFixed(2))} px`
function textSpacing(r: () => number): VariantQuestion {
  const f = pick(r, [14, 15, 17, 18, 20, 22])
  const set = (lh: number, ps: number, ls: number, ws: number) => `Line height ${px(lh * f)}, paragraph spacing ${px(ps * f)}, letter spacing ${px(ls * f)}, word spacing ${px(ws * f)}`
  const correct = set(1.5, 2, 0.12, 0.16)
  const wrong = [set(2, 1.5, 0.12, 0.16), set(1.5, 2, 0.16, 0.12), set(1.2, 1.5, 0.12, 0.16)]
  return { sec: "I.D", stem: `Body text in a card is ${f} px. To meet 1.4.12 Text Spacing, the card must not lose content when users apply which spacing values?`, ...shuffleWithAnswer(r, correct, wrong) }
}

function reflowZoom(r: () => number): VariantQuestion {
  const w = pick(r, [960, 1120, 1280, 1440, 1600, 1920])
  const pct = (n: number) => `${Math.round(n)}%`
  const correct = pct((w / 320) * 100)
  const pool = [pct(200), pct((w / 256) * 100), pct(w === 1280 ? 300 : 400), pct((w / 320) * 100 + 100)]
  const wrong = [...new Set(pool.filter((o) => o !== correct))].slice(0, 3)
  return { sec: "I.E", stem: `A designer checks a page in a desktop browser window that is ${w} CSS px wide. Which zoom level makes the viewport equal to the width that 1.4.10 Reflow uses for vertically scrolling content?`, ...shuffleWithAnswer(r, correct, wrong) }
}

const BUILDERS: Record<VariantType, (r: () => number) => VariantQuestion | null> = {
  "contrast-text": contrastText,
  "focus-contrast": focusContrast,
  "target-size": targetSize,
  "text-spacing": textSpacing,
  "reflow-zoom": reflowZoom,
}

/** Deterministic: the same type and seed always produce the same question and answer. */
export function renderVariant(type: VariantType, seed: number): VariantQuestion {
  for (let attempt = 0; attempt < 50; attempt++) {
    const q = BUILDERS[type](rng(seed + attempt * 7919))
    if (q) return q
  }
  throw new Error(`Variant ${type} could not be generated for seed ${seed}`)
}

export function variantTypeForSection(sec: string): VariantType | null {
  return (Object.entries(VARIANT_SECTIONS).find(([, s]) => s === sec)?.[0] as VariantType | undefined) ?? null
}
