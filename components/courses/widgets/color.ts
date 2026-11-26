// WCAG 2.2 relative luminance and contrast ratio. Ratios are truncated for display, never rounded up.
export function parseHex(value: string): [number, number, number] | null {
  const v = value.trim().replace(/^#/, "")
  const full = /^[0-9a-f]{3}$/i.test(v) ? v.split("").map((c) => c + c).join("") : v
  if (!/^[0-9a-f]{6}$/i.test(full)) return null
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number]
}

export function toHex([r, g, b]: [number, number, number]) {
  return `#${[r, g, b].map((n) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0")).join("")}`
}

export function luminance(rgb: [number, number, number]) {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string): number | null {
  const x = parseHex(a), y = parseHex(b)
  if (!x || !y) return null
  const [l1, l2] = [luminance(x), luminance(y)].sort((m, n) => n - m)
  return (l1 + 0.05) / (l2 + 0.05)
}

export const formatRatio = (r: number) => `${(Math.floor(r * 100) / 100).toFixed(2)}:1`

/** Nearest colour along the line to black or white that reaches the target ratio against bg. */
export function suggest(fg: string, bg: string, target: number): string | null {
  const f = parseHex(fg), b = parseHex(bg)
  if (!f || !b) return null
  const toward = luminance(b) > 0.18 ? [0, 0, 0] : [255, 255, 255]
  for (let t = 0; t <= 1.0001; t += 0.01) {
    const c = f.map((v, i) => v + (toward[i] - v) * t) as [number, number, number]
    const hex = toHex(c)
    if ((contrast(hex, bg) ?? 0) >= target) return hex
  }
  return null
}
