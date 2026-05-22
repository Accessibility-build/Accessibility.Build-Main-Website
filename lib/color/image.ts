/**
 * Extract a palette from an image via k-means clustering in OKLab space.
 *
 * Why OKLab? Euclidean distance in OKLab approximates perceptual difference,
 * so k-means in OKLab produces visually distinct clusters — much better than
 * naive RGB k-means.
 *
 * Browser-only: relies on the Canvas API.
 */

import { converter, formatHex, type Oklab } from "culori/fn"

const toOklab = converter("oklab")
const toRgb = converter("rgb")

const MAX_SAMPLES = 8000

/** Decode an image file into ImageData via a temporary canvas. */
async function readImage(file: File | Blob): Promise<ImageData> {
  const bitmap = await createImageBitmap(file)
  // Cap dimensions so very large photos stay fast.
  const maxDim = 320
  const ratio = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  const w = Math.max(1, Math.round(bitmap.width * ratio))
  const h = Math.max(1, Math.round(bitmap.height * ratio))
  const canvas =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(w, h)
      : Object.assign(document.createElement("canvas"), { width: w, height: h })
  const ctx = (canvas as HTMLCanvasElement).getContext("2d", { willReadFrequently: true }) ??
    (canvas as unknown as { getContext(t: string): CanvasRenderingContext2D | null }).getContext("2d")
  if (!ctx) throw new Error("Canvas 2D context unavailable")
  ctx.drawImage(bitmap as unknown as CanvasImageSource, 0, 0, w, h)
  return ctx.getImageData(0, 0, w, h)
}

interface LabPoint {
  L: number
  a: number
  b: number
}

function pixelToLab(r: number, g: number, b: number): LabPoint {
  const ok = toOklab({ mode: "rgb", r: r / 255, g: g / 255, b: b / 255 }) as Oklab | undefined
  return { L: ok?.l ?? 0, a: ok?.a ?? 0, b: ok?.b ?? 0 }
}

function labDistanceSq(p: LabPoint, q: LabPoint): number {
  const dL = p.L - q.L
  const da = p.a - q.a
  const db = p.b - q.b
  return dL * dL + da * da + db * db
}

function samplePixels(img: ImageData): LabPoint[] {
  const { data, width, height } = img
  const total = width * height
  const stride = Math.max(1, Math.floor(total / MAX_SAMPLES))
  const points: LabPoint[] = []
  for (let i = 0; i < total; i += stride) {
    const idx = i * 4
    const alpha = data[idx + 3]
    if (alpha < 200) continue // skip transparent
    const r = data[idx]
    const g = data[idx + 1]
    const b = data[idx + 2]
    // Skip near-white and near-black to surface "real" colors.
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    if (max > 245 && min > 245) continue
    if (max < 12) continue
    points.push(pixelToLab(r, g, b))
  }
  return points
}

/** k-means++ initial seeds. Picks well-spread starting centers. */
function kmeansPlusPlusSeed(points: LabPoint[], k: number): LabPoint[] {
  if (points.length === 0) return []
  const seeds: LabPoint[] = [points[Math.floor(Math.random() * points.length)]]
  for (let i = 1; i < k; i++) {
    const distances = points.map((p) => {
      let min = Infinity
      for (const s of seeds) {
        const d = labDistanceSq(p, s)
        if (d < min) min = d
      }
      return min
    })
    const total = distances.reduce((a, b) => a + b, 0)
    if (total === 0) break
    let r = Math.random() * total
    let chosen = points.length - 1
    for (let j = 0; j < distances.length; j++) {
      r -= distances[j]
      if (r <= 0) {
        chosen = j
        break
      }
    }
    seeds.push(points[chosen])
  }
  return seeds
}

function kmeans(
  points: LabPoint[],
  k: number,
  maxIter = 20,
  tolerance = 1e-4
): { centers: LabPoint[]; counts: number[] } {
  if (points.length === 0) return { centers: [], counts: [] }
  let centers = kmeansPlusPlusSeed(points, k)
  const assignments = new Int32Array(points.length)
  const counts: number[] = new Array(centers.length).fill(0)

  for (let iter = 0; iter < maxIter; iter++) {
    // Assign
    for (let i = 0; i < points.length; i++) {
      let best = 0
      let bestDist = Infinity
      for (let c = 0; c < centers.length; c++) {
        const d = labDistanceSq(points[i], centers[c])
        if (d < bestDist) {
          bestDist = d
          best = c
        }
      }
      assignments[i] = best
    }

    // Recompute centers
    const sums: LabPoint[] = centers.map(() => ({ L: 0, a: 0, b: 0 }))
    counts.fill(0)
    for (let i = 0; i < points.length; i++) {
      const c = assignments[i]
      sums[c].L += points[i].L
      sums[c].a += points[i].a
      sums[c].b += points[i].b
      counts[c]++
    }
    let maxShift = 0
    const newCenters = centers.map((center, c) => {
      if (counts[c] === 0) return center
      const next = { L: sums[c].L / counts[c], a: sums[c].a / counts[c], b: sums[c].b / counts[c] }
      const shift = labDistanceSq(center, next)
      if (shift > maxShift) maxShift = shift
      return next
    })
    centers = newCenters
    if (maxShift < tolerance) break
  }

  return { centers, counts }
}

function labToHex(p: LabPoint): string {
  const rgb = toRgb({ mode: "oklab", l: p.L, a: p.a, b: p.b })
  return formatHex(rgb) ?? "#000000"
}

export interface ExtractedSwatch {
  hex: string
  share: number // 0–1, share of sampled pixels
}

/** Extract a k-color palette from an image, ordered by prevalence. */
export async function extractPaletteFromImage(file: File | Blob, k = 6): Promise<ExtractedSwatch[]> {
  const img = await readImage(file)
  const points = samplePixels(img)
  if (points.length === 0) return []
  const { centers, counts } = kmeans(points, k)
  const total = counts.reduce((a, b) => a + b, 0) || 1
  const swatches = centers.map((c, i) => ({
    hex: labToHex(c),
    share: counts[i] / total,
  }))
  return swatches.sort((a, b) => b.share - a.share)
}

/** Heuristic: pick the most useful color as the "primary brand" from extracted swatches.
 *  Prefers high-chroma, mid-lightness over neutral/grayscale stops. */
export function pickPrimaryFromExtracted(swatches: ExtractedSwatch[]): string {
  if (swatches.length === 0) return "#3b82f6"
  // Score each: chroma weighted higher than share, penalize extreme lightness
  const scored = swatches.map((s) => {
    const rgb = parseHexToRgb(s.hex)
    const ok = toOklab({ mode: "rgb", r: rgb.r, g: rgb.g, b: rgb.b }) as Oklab
    const c = Math.sqrt(ok.a * ok.a + ok.b * ok.b)
    const lightnessPenalty = Math.abs(ok.l - 0.55) // closer to 0.55 is best
    return { hex: s.hex, score: c * 4 + s.share - lightnessPenalty * 0.5 }
  })
  scored.sort((a, b) => b.score - a.score)
  return scored[0].hex
}

function parseHexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "")
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  }
}
