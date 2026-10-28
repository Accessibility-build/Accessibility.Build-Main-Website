import { inflateSync } from "node:zlib"

// Just enough PNG decoding to compare two of Chrome's own screenshots: 8-bit RGB or RGBA,
// not interlaced, which is what Page.captureScreenshot produces. Doing it here with node:zlib
// avoids a dependency, and avoids decoding inside the visitor's page, whose CSP may block the
// data URL an <img> would need.

export interface DecodedPng {
  width: number
  height: number
  /** Bytes per pixel: 3 (RGB) or 4 (RGBA). */
  channels: number
  data: Uint8Array
}

const SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10]

export function decodePng(input: Uint8Array): DecodedPng | null {
  if (input.length < 33 || SIGNATURE.some((byte, i) => input[i] !== byte)) return null
  const view = new DataView(input.buffer, input.byteOffset, input.byteLength)
  let offset = 8
  let width = 0
  let height = 0
  let channels = 0
  const idat: Uint8Array[] = []

  while (offset + 8 <= input.length) {
    const length = view.getUint32(offset)
    const type = String.fromCharCode(input[offset + 4], input[offset + 5], input[offset + 6], input[offset + 7])
    const start = offset + 8
    if (start + length > input.length) return null
    if (type === "IHDR") {
      width = view.getUint32(start)
      height = view.getUint32(start + 4)
      const bitDepth = input[start + 8]
      const colourType = input[start + 9]
      const interlace = input[start + 12]
      if (bitDepth !== 8 || interlace !== 0) return null
      if (colourType === 6) channels = 4
      else if (colourType === 2) channels = 3
      else return null
    } else if (type === "IDAT") {
      idat.push(input.subarray(start, start + length))
    } else if (type === "IEND") {
      break
    }
    offset = start + length + 4 // skip the CRC
  }
  if (!width || !height || !channels || idat.length === 0) return null

  let raw: Uint8Array
  try {
    raw = inflateSync(Buffer.concat(idat))
  } catch {
    return null
  }
  const stride = width * channels
  if (raw.length < height * (stride + 1)) return null

  const data = new Uint8Array(height * stride)
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)]
    const source = y * (stride + 1) + 1
    const row = y * stride
    const previous = row - stride
    for (let x = 0; x < stride; x += 1) {
      const value = raw[source + x]
      const left = x >= channels ? data[row + x - channels] : 0
      const up = y > 0 ? data[previous + x] : 0
      const upLeft = y > 0 && x >= channels ? data[previous + x - channels] : 0
      let predicted = 0
      if (filter === 1) predicted = left
      else if (filter === 2) predicted = up
      else if (filter === 3) predicted = (left + up) >> 1
      else if (filter === 4) predicted = paeth(left, up, upLeft)
      else if (filter !== 0) return null
      data[row + x] = (value + predicted) & 0xff
    }
  }
  return { width, height, channels, data }
}

function paeth(a: number, b: number, c: number): number {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  if (pa <= pb && pa <= pc) return a
  return pb <= pc ? b : c
}

export interface PixelDiff {
  /** Pixels where at least one colour channel differs by more than the threshold. */
  changed: number
  total: number
}

/**
 * Counts the pixels that differ between two same-sized captures. A channel has to move by more
 * than `threshold` (0 to 255) to count, which ignores antialiasing and JPEG-like noise but catches
 * any outline, underline, background or colour change a person would notice.
 */
export function diffPixels(a: DecodedPng, b: DecodedPng, threshold = 32): PixelDiff | null {
  if (a.width !== b.width || a.height !== b.height) return null
  let changed = 0
  const total = a.width * a.height
  for (let i = 0; i < total; i += 1) {
    const ia = i * a.channels
    const ib = i * b.channels
    if (
      Math.abs(a.data[ia] - b.data[ib]) > threshold ||
      Math.abs(a.data[ia + 1] - b.data[ib + 1]) > threshold ||
      Math.abs(a.data[ia + 2] - b.data[ib + 2]) > threshold
    ) {
      changed += 1
    }
  }
  return { changed, total }
}
