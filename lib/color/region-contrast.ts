/**
 * Contrast of text over an image, measured at every background pixel.
 *
 * WCAG 1.4.3 asks for contrast between text and the background behind it. Over a photo or a
 * gradient the background is different under every letter, so the number that decides pass or fail
 * is the worst point, not the average. This module takes the pixels of the area a visitor marked,
 * decides which pixels are text, ignores the anti-aliased blends right next to the letters (they
 * are part letter, part background), and scores the text colour against every remaining pixel.
 *
 * The maths is `relativeLuminance` and `contrastRatioWCAG` from ./oklch exactly (channel / 255,
 * the 0.03928 threshold, the same order of operations), run through a 256-entry lookup table so a
 * 4 megapixel area takes a fraction of a second instead of building a hex string per pixel. Pure:
 * no DOM, so it runs in Node against synthetic images.
 */

import { apcaContrast } from "./apca"

/** RGBA pixels, 4 bytes each, as in ImageData. Alpha is ignored: flatten transparency first. */
export interface PixelImage {
  data: Uint8ClampedArray | Uint8Array
  width: number
  height: number
}

/** A colour as 0 to 255 channels. */
export interface Rgb8 {
  r: number
  g: number
  b: number
}

/** Per-pixel classification in `RegionContrastResult.mask`. */
export const MASK_PASS = 0
export const MASK_FAIL = 1
export const MASK_TEXT = 2
export const MASK_EDGE = 3

/** The thresholds every result reports, whatever the chosen one is. */
export const REPORTED_THRESHOLDS = [3, 4.5, 7] as const

// sRGB byte to linear light, the WCAG 2.x formula used by relativeLuminance().
const LINEAR = new Float64Array(256)
for (let i = 0; i < 256; i += 1) {
  const c = i / 255
  LINEAR[i] = c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/** WCAG relative luminance of a 0 to 255 colour. Identical to relativeLuminance(hex). */
export function luminance8(r: number, g: number, b: number): number {
  return 0.2126 * LINEAR[r] + 0.7152 * LINEAR[g] + 0.0722 * LINEAR[b]
}

/** WCAG contrast ratio between two luminances. Identical to contrastRatioWCAG. */
export function ratioFromLuminance(l1: number, l2: number): number {
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

export function rgb8ToHex({ r, g, b }: Rgb8): string {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

/** Parses #rgb or #rrggbb (with or without the #). Returns null for anything else. */
export function hexToRgb8(value: string): Rgb8 | null {
  const hex = value.trim().replace(/^#/, "")
  if (/^[0-9a-f]{3}$/i.test(hex)) {
    const [r, g, b] = hex.split("").map((c) => parseInt(c + c, 16))
    return { r, g, b }
  }
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    const n = parseInt(hex, 16)
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
  }
  return null
}

export interface TextColourGuess {
  color: Rgb8
  /** Share of the area within the default tolerance of that colour. */
  share: number
  /** True when the text came from the lighter of the two groups. */
  lightText: boolean
}

/** The default distance, in 0 to 255 RGB units, within which a pixel counts as the text colour. */
export const DEFAULT_TOLERANCE = 32

/**
 * Guesses the text colour. Two-means on lightness splits the area into a dark and a light group,
 * and each group's most common exact colour is a candidate (the solid fill of letters is one colour
 * repeated; anti-aliased blends and photo grain are spread over many).
 *
 * Which candidate is the text is decided by shape, not size alone. Letters are thin strokes that
 * stay inside the marked area, so text pixels mostly sit next to something else and rarely touch
 * the area's border, while background is broad and runs off the edges. "The smaller group is the
 * text" is only the tie-breaker: white text on a dark-to-light gradient puts the text in the larger,
 * lighter group, and the minority rule alone picks the dark end of the gradient.
 *
 * Returns null for a single-tone area.
 */
export function detectTextColour(image: PixelImage): TextColourGuess | null {
  const { data, width, height } = image
  const n = width * height
  if (n === 0) return null

  // Gamma-encoded luma, bucketed 0 to 255: it spaces dark and light tones closer to how they look,
  // which splits dark text on a mid-tone photo better than linear luminance would.
  const lightness = new Uint8Array(n)
  const hist = new Float64Array(256)
  for (let i = 0, p = 0; i < n; i += 1, p += 4) {
    const v = Math.round((2126 * data[p] + 7152 * data[p + 1] + 722 * data[p + 2]) / 10000)
    lightness[i] = v
    hist[v] += 1
  }
  let lo = 0
  while (lo < 255 && hist[lo] === 0) lo += 1
  let hi = 255
  while (hi > 0 && hist[hi] === 0) hi -= 1
  if (lo >= hi) return null

  // Two-means in one dimension: the split converges to the midpoint of the two group means.
  let split = (lo + hi) / 2
  for (let iteration = 0; iteration < 64; iteration += 1) {
    let darkSum = 0
    let darkCount = 0
    let lightSum = 0
    let lightCount = 0
    for (let v = 0; v < 256; v += 1) {
      if (v <= split) {
        darkSum += v * hist[v]
        darkCount += hist[v]
      } else {
        lightSum += v * hist[v]
        lightCount += hist[v]
      }
    }
    const next = (darkSum / darkCount + lightSum / lightCount) / 2
    const done = Math.abs(next - split) < 0.01
    split = next
    if (done) break
  }
  let darkCount = 0
  for (let v = 0; v <= split; v += 1) darkCount += hist[v]

  const dark = { color: groupMode(data, lightness, (v) => v <= split), lightText: false }
  const light = { color: groupMode(data, lightness, (v) => v > split), lightText: true }
  const darkShape = candidateShape(image, dark.color)
  const lightShape = candidateShape(image, light.color)
  const darkScore = darkShape.thinness * (1 - darkShape.border)
  const lightScore = lightShape.thinness * (1 - lightShape.border)

  let pick: "dark" | "light"
  if (Math.max(darkScore, lightScore) > 1.25 * Math.min(darkScore, lightScore)) {
    pick = lightScore > darkScore ? "light" : "dark"
  } else {
    pick = darkCount >= n - darkCount ? "light" : "dark"
  }
  const chosen = pick === "light" ? light : dark
  return { color: chosen.color, lightText: chosen.lightText, share: (pick === "light" ? lightShape : darkShape).share }
}

/** The most common exact colour among pixels whose lightness passes `inGroup`, via 4-bit bins first. */
function groupMode(data: PixelImage["data"], lightness: Uint8Array, inGroup: (v: number) => boolean): Rgb8 {
  const bins = new Uint32Array(4096)
  for (let i = 0, p = 0; i < lightness.length; i += 1, p += 4) {
    if (inGroup(lightness[i])) bins[((data[p] >> 4) << 8) | ((data[p + 1] >> 4) << 4) | (data[p + 2] >> 4)] += 1
  }
  let bestBin = 0
  for (let k = 1; k < 4096; k += 1) if (bins[k] > bins[bestBin]) bestBin = k
  const exact = new Map<number, number>()
  for (let i = 0, p = 0; i < lightness.length; i += 1, p += 4) {
    if (!inGroup(lightness[i])) continue
    if ((((data[p] >> 4) << 8) | ((data[p + 1] >> 4) << 4) | (data[p + 2] >> 4)) !== bestBin) continue
    const key = (data[p] << 16) | (data[p + 1] << 8) | data[p + 2]
    exact.set(key, (exact.get(key) ?? 0) + 1)
  }
  let bestKey = 0
  let bestCount = -1
  for (const [key, count] of exact) {
    if (count > bestCount) {
      bestKey = key
      bestCount = count
    }
  }
  return { r: (bestKey >> 16) & 255, g: (bestKey >> 8) & 255, b: bestKey & 255 }
}

/**
 * How text-like the pixels matching a colour are. `thinness`: the share of them that sit on the edge
 * of a connected shape, with both a matching and a non-matching neighbour (strokes are mostly edge;
 * broad background is mostly interior; scattered photo grain has no matching neighbours at all).
 * `border`: the share of the area's border they cover (background runs off the edges, letters
 * seldom do).
 */
function candidateShape(image: PixelImage, color: Rgb8): { thinness: number; border: number; share: number } {
  const { data, width, height } = image
  const n = width * height
  const tolerance2 = DEFAULT_TOLERANCE * DEFAULT_TOLERANCE
  const match = new Uint8Array(n)
  let count = 0
  for (let i = 0, p = 0; i < n; i += 1, p += 4) {
    const dr = data[p] - color.r
    const dg = data[p + 1] - color.g
    const db = data[p + 2] - color.b
    if (dr * dr + dg * dg + db * db <= tolerance2) {
      match[i] = 1
      count += 1
    }
  }
  if (count === 0) return { thinness: 0, border: 1, share: 0 }

  let boundary = 0
  let onBorder = 0
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = y * width + x
      if (!match[i]) continue
      // Outside the area counts as neither, so the border itself does not make background look thin.
      const left = x > 0 ? match[i - 1] : 2
      const right = x < width - 1 ? match[i + 1] : 2
      const up = y > 0 ? match[i - width] : 2
      const down = y < height - 1 ? match[i + width] : 2
      const hasOther = left === 0 || right === 0 || up === 0 || down === 0
      const hasSame = left === 1 || right === 1 || up === 1 || down === 1
      if (hasOther && hasSame) boundary += 1
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) onBorder += 1
    }
  }
  const borderLength = width === 1 || height === 1 ? n : 2 * (width + height) - 4
  return { thinness: boundary / count, border: onBorder / borderLength, share: count / n }
}

export interface RegionContrastOptions {
  textColor: Rgb8
  /** Pixels within this RGB distance (0 to 441) of the text colour count as text. Default 32. */
  tolerance?: number
  /** Background pixels this close to text (square neighbourhood) are ignored as blends. Default 2. */
  edgeRadius?: number
  /** The ratio the pass share, mask and hotspot use. Default 4.5. */
  threshold?: number
}

export interface RegionContrastResult {
  width: number
  height: number
  textHex: string
  threshold: number
  textPixels: number
  edgePixels: number
  backgroundPixels: number
  /** The lowest ratio against any background pixel, where it is, and APCA Lc there. */
  worst: { ratio: number; hex: string; x: number; y: number; apcaLc: number; where: string } | null
  /** 5th percentile and median of the ratio, rounded down to 0.01. */
  percentile5: number | null
  median: number | null
  /** Share of background pixels at or above the chosen threshold. */
  passShare: number | null
  /** Share of background pixels at or above each of REPORTED_THRESHOLDS. */
  shares: { ratio: number; share: number }[]
  /** The ninth of the area holding the most failing pixels. */
  hotspot: { where: string; failShare: number; shareOfFailures: number } | null
  /** MASK_PASS, MASK_FAIL, MASK_TEXT or MASK_EDGE per pixel, row by row. */
  mask: Uint8Array
  /** Each distinct background colour once, packed 0xRRGGBB, for the overlay search. */
  backgroundColors: Uint32Array
}

const ROWS = ["top", "middle", "bottom"]
const COLUMNS = ["left", "centre", "right"]

/** "top left", "centre", "bottom right" and so on for a point in a width by height area. */
export function describePosition(x: number, y: number, width: number, height: number): string {
  const column = Math.min(2, Math.floor((x * 3) / Math.max(1, width)))
  const row = Math.min(2, Math.floor((y * 3) / Math.max(1, height)))
  return cellName(row, column)
}

function cellName(row: number, column: number): string {
  if (row === 1 && column === 1) return "centre"
  return `${ROWS[row]} ${COLUMNS[column]}`
}

/** Scores the text colour against every background pixel in the area. */
export function analyseRegion(image: PixelImage, options: RegionContrastOptions): RegionContrastResult {
  const { data, width, height } = image
  const n = width * height
  const tolerance = Math.max(0, options.tolerance ?? DEFAULT_TOLERANCE)
  const radius = Math.max(0, Math.floor(options.edgeRadius ?? 2))
  const threshold = options.threshold ?? 4.5
  const { r: tr, g: tg, b: tb } = options.textColor
  const textLuminance = luminance8(tr, tg, tb)
  const mask = new Uint8Array(n) // MASK_PASS until classified

  // 1. Text: close enough in colour to the text colour.
  const tolerance2 = tolerance * tolerance
  let textPixels = 0
  for (let i = 0, p = 0; i < n; i += 1, p += 4) {
    const dr = data[p] - tr
    const dg = data[p + 1] - tg
    const db = data[p + 2] - tb
    if (dr * dr + dg * dg + db * db <= tolerance2) {
      mask[i] = MASK_TEXT
      textPixels += 1
    }
  }

  // 2. Edges: dilate the text mask by `radius` in a square. Rows first (distance to the nearest
  // text pixel either side), then a sliding window down each column.
  let edgePixels = 0
  if (radius > 0 && textPixels > 0) {
    const near = new Uint8Array(n)
    for (let y = 0; y < height; y += 1) {
      const row = y * width
      let last = -Infinity
      for (let x = 0; x < width; x += 1) {
        if (mask[row + x] === MASK_TEXT) last = x
        if (x - last <= radius) near[row + x] = 1
      }
      last = Infinity
      for (let x = width - 1; x >= 0; x -= 1) {
        if (mask[row + x] === MASK_TEXT) last = x
        if (last - x <= radius) near[row + x] = 1
      }
    }
    const counts = new Uint16Array(width)
    for (let y = 0; y <= Math.min(radius, height - 1); y += 1) {
      for (let x = 0; x < width; x += 1) counts[x] += near[y * width + x]
    }
    for (let y = 0; y < height; y += 1) {
      const row = y * width
      for (let x = 0; x < width; x += 1) {
        if (counts[x] > 0 && mask[row + x] !== MASK_TEXT) {
          mask[row + x] = MASK_EDGE
          edgePixels += 1
        }
      }
      const leaving = y - radius
      if (leaving >= 0) for (let x = 0; x < width; x += 1) counts[x] -= near[leaving * width + x]
      const entering = y + radius + 1
      if (entering < height) for (let x = 0; x < width; x += 1) counts[x] += near[entering * width + x]
    }
  }

  // 3. Background: the ratio at every remaining pixel.
  const hist = new Uint32Array(2001) // ratio 1.00 to 21.00 in steps of 0.01
  const passCounts = REPORTED_THRESHOLDS.map(() => 0)
  const cellTotal = new Uint32Array(9)
  const cellFail = new Uint32Array(9)
  const seen = new Uint32Array(1 << 19) // one bit per 24-bit colour
  let unique = new Uint32Array(4096)
  let uniqueCount = 0
  let backgroundPixels = 0
  let passing = 0
  let failing = 0
  let worstRatio = Infinity
  let worstIndex = -1

  for (let y = 0; y < height; y += 1) {
    const cellRow = Math.min(2, Math.floor((y * 3) / height)) * 3
    for (let x = 0; x < width; x += 1) {
      const i = y * width + x
      if (mask[i] !== MASK_PASS) continue
      const p = i * 4
      const r = data[p]
      const g = data[p + 1]
      const b = data[p + 2]
      const ratio = ratioFromLuminance(luminance8(r, g, b), textLuminance)
      backgroundPixels += 1
      hist[Math.min(2000, Math.floor((ratio - 1) * 100))] += 1
      for (let t = 0; t < REPORTED_THRESHOLDS.length; t += 1) if (ratio >= REPORTED_THRESHOLDS[t]) passCounts[t] += 1
      if (ratio < worstRatio) {
        worstRatio = ratio
        worstIndex = i
      }
      const cell = cellRow + Math.min(2, Math.floor((x * 3) / width))
      cellTotal[cell] += 1
      if (ratio >= threshold) {
        passing += 1
      } else {
        mask[i] = MASK_FAIL
        cellFail[cell] += 1
        failing += 1
      }
      const key = (r << 16) | (g << 8) | b
      const word = key >>> 5
      const bit = 1 << (key & 31)
      if ((seen[word] & bit) === 0) {
        seen[word] |= bit
        if (uniqueCount === unique.length) {
          const grown = new Uint32Array(unique.length * 2)
          grown.set(unique)
          unique = grown
        }
        unique[uniqueCount] = key
        uniqueCount += 1
      }
    }
  }

  const textHex = rgb8ToHex(options.textColor)
  const percentile = (fraction: number): number | null => {
    if (backgroundPixels === 0) return null
    const target = Math.max(1, Math.ceil(backgroundPixels * fraction))
    let cumulative = 0
    for (let bin = 0; bin < hist.length; bin += 1) {
      cumulative += hist[bin]
      if (cumulative >= target) return 1 + bin / 100
    }
    return 21
  }

  let worst: RegionContrastResult["worst"] = null
  if (worstIndex >= 0) {
    const p = worstIndex * 4
    const hex = rgb8ToHex({ r: data[p], g: data[p + 1], b: data[p + 2] })
    const x = worstIndex % width
    const y = Math.floor(worstIndex / width)
    worst = { ratio: worstRatio, hex, x, y, apcaLc: apcaContrast(textHex, hex), where: describePosition(x, y, width, height) }
  }

  let hotspot: RegionContrastResult["hotspot"] = null
  if (failing > 0) {
    let best = 0
    for (let cell = 1; cell < 9; cell += 1) if (cellFail[cell] > cellFail[best]) best = cell
    hotspot = {
      where: cellName(Math.floor(best / 3), best % 3),
      failShare: cellFail[best] / cellTotal[best],
      shareOfFailures: cellFail[best] / failing,
    }
  }

  return {
    width,
    height,
    textHex,
    threshold,
    textPixels,
    edgePixels,
    backgroundPixels,
    worst,
    percentile5: percentile(0.05),
    median: percentile(0.5),
    passShare: backgroundPixels ? passing / backgroundPixels : null,
    shares: REPORTED_THRESHOLDS.map((ratio, t) => ({ ratio, share: backgroundPixels ? passCounts[t] / backgroundPixels : 0 })),
    hotspot,
    mask,
    backgroundColors: unique.slice(0, uniqueCount),
  }
}

export interface ScrimFit {
  scrim: "black" | "white"
  /** The smallest whole-percent opacity, 0 to 1, at which every background pixel passes. */
  opacity: number
  /** The worst ratio with the overlay applied. */
  worstRatio: number
}

/**
 * The smallest black or white overlay opacity (in whole percent) that lifts every background
 * colour to `threshold` against the text. Assumes the text sits on top of the overlay, as live
 * HTML text over a CSS background image does. Each composite is rounded to 8 bits, exactly like
 * compositeOver() in ./oklch. Returns null when even a fully opaque overlay is not enough.
 *
 * The worst ratio is not monotonic in the opacity when some background is lighter than the text
 * and some darker (darkening passes through the text's own lightness), so this walks every
 * percent upwards rather than bisecting. A pixel that failed at one step is checked first at the
 * next, which skips almost all of the work.
 */
export function smallestScrim(backgroundColors: Uint32Array, text: Rgb8, threshold: number, scrim: "black" | "white"): ScrimFit | null {
  const textLuminance = luminance8(text.r, text.g, text.b)
  const s = scrim === "white" ? 1 : 0
  const channel = (c: number, a: number) => Math.round(Math.max(0, Math.min(1, s * a + (c / 255) * (1 - a))) * 255)
  const ratioAt = (packed: number, a: number) =>
    ratioFromLuminance(luminance8(channel((packed >> 16) & 255, a), channel((packed >> 8) & 255, a), channel(packed & 255, a)), textLuminance)

  let witness = -1
  for (let percent = 0; percent <= 100; percent += 1) {
    const a = percent / 100
    if (witness >= 0 && ratioAt(backgroundColors[witness], a) < threshold) continue
    let failed = -1
    for (let k = 0; k < backgroundColors.length; k += 1) {
      if (ratioAt(backgroundColors[k], a) < threshold) {
        failed = k
        break
      }
    }
    if (failed < 0) {
      let worstRatio = 21
      for (let k = 0; k < backgroundColors.length; k += 1) worstRatio = Math.min(worstRatio, ratioAt(backgroundColors[k], a))
      return { scrim, opacity: a, worstRatio }
    }
    witness = failed
  }
  return null
}

/** Formats a ratio rounded down, so 4.499 shows as 4.49 rather than a passing-looking 4.5. */
export function formatRatio(ratio: number): string {
  return (Math.floor(ratio * 100 + 1e-9) / 100).toFixed(2)
}
