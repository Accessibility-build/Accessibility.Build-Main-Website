// Draws "spot the issues" audit screens as a standalone SVG document, so learners can open the same
// screens in their own design tool (each element arrives as a named layer). The element data stays in
// the private course store; this file only knows how to draw it.
import type { AuditElement } from "./types"

export const AUDIT_ICONS: Record<string, string> = {
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-3.5-3.5",
  heart: "M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z",
  cart: "M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6M9 21h.01M18 21h.01",
  close: "M18 6 6 18M6 6l12 12",
  menu: "M4 6h16M4 12h16M4 18h16",
  info: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 16v-4M12 8h.01",
  check: "M20 6 9 17l-5-5",
  alert: "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01",
  star: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2 1.2-6.8-5-4.9 6.9-1Z",
  chevron: "m9 18 6-6-6-6",
  user: "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 21a8 8 0 0 1 16 0",
  play: "M6 4l14 8-14 8Z",
  filter: "M3 5h18l-7 8v6l-4 2v-8Z",
  download: "M12 3v12M7 10l5 5 5-5M5 21h14",
}

/** Breaks text into lines that fit a width, at about 0.55 of the font size per character. */
export function wrapAuditText(text: string, width: number, size: number) {
  const per = Math.max(4, Math.floor(width / (size * 0.55)))
  const lines: string[] = []
  let line = ""
  for (const word of text.split(/\s+/)) {
    if ((line + " " + word).trim().length > per && line) { lines.push(line); line = word } else line = (line + " " + word).trim()
  }
  if (line) lines.push(line)
  return lines
}

export interface AuditScreen {
  title: string
  canvas: { w: number; h: number; bg?: string }
  elements: AuditElement[]
}

const FONT = "Inter, system-ui, sans-serif"
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
const layer = (s: string) => esc(s.replace(/[^a-zA-Z0-9 _-]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 60) || "layer")
const n = (v: number) => String(Math.round(v * 100) / 100)

function lines(text: string, x: number, top: number, lh: number, attrs: string, anchor = "start") {
  return `<text ${attrs} text-anchor="${anchor}">${text.split("\n").map((l, i) => `<tspan x="${n(x)}" y="${n(top + i * lh)}">${esc(l)}</tspan>`).join("")}</text>`
}

function shape(e: AuditElement, prefix: string) {
  const size = e.size ?? 16
  const font = (fill: string) => `font-family="${FONT}" font-size="${size}" font-weight="${e.weight ?? 400}" fill="${esc(fill)}"`
  const label = (t: string, anchor: "start" | "middle", x: number) => {
    const wrapped = wrapAuditText(t, e.w - (anchor === "start" ? 24 : 16), size)
    const lh = size * 1.3
    const top = e.y + e.h / 2 - ((wrapped.length - 1) * lh) / 2 + size * 0.35
    return lines(wrapped.join("\n"), x, top, lh, font(e.color ?? "#111827"), anchor)
  }
  const rect = (rx: number, fill: string, stroke: string) => `<rect x="${n(e.x)}" y="${n(e.y)}" width="${n(e.w)}" height="${n(e.h)}" rx="${rx}" fill="${esc(fill)}" stroke="${esc(stroke)}" stroke-width="${e.strokeWidth ?? 1}"/>`
  switch (e.kind) {
    case "box":
      return rect(e.radius ?? 0, e.fill ?? "#f9fafb", e.stroke ?? "none") + (e.text ? label(e.text, e.align ?? "start", e.align === "middle" ? e.x + e.w / 2 : e.x + 12) : "")
    case "text": {
      const anchor = e.align ?? "start"
      return lines(wrapAuditText(e.text ?? "", e.w, size).join("\n"), anchor === "middle" ? e.x + e.w / 2 : e.x, e.y + size, size * 1.3, font(e.color ?? "#111827"), anchor)
    }
    case "button":
      return rect(e.radius ?? 6, e.fill ?? "#1d4ed8", e.stroke ?? "none") + label(e.text ?? "", "middle", e.x + e.w / 2)
    case "input":
      return rect(e.radius ?? 4, e.fill ?? "#ffffff", e.stroke ?? "#6b7280") + `<text ${font(e.color ?? (e.value ? "#111827" : "#6b7280"))} x="${n(e.x + 12)}" y="${n(e.y + e.h / 2 + size * 0.35)}">${esc(e.value ?? e.placeholder ?? "")}</text>`
    case "icon": {
      const s = Math.min(e.w, e.h) * (e.fill ? 0.6 : 0.9)
      return (e.fill ? `<rect x="${n(e.x)}" y="${n(e.y)}" width="${n(e.w)}" height="${n(e.h)}" rx="${e.radius ?? 6}" fill="${esc(e.fill)}"/>` : "") +
        `<g transform="translate(${n(e.x + (e.w - s) / 2)} ${n(e.y + (e.h - s) / 2)}) scale(${n(s / 24)})"><path d="${AUDIT_ICONS[e.icon ?? "info"] ?? AUDIT_ICONS.info}" fill="none" stroke="${esc(e.color ?? "#111827")}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>`
    }
    case "image": {
      const id = `${prefix}-g-${e.id}`
      const p = (fx: number, fy: number) => `${n(e.x + e.w * fx)} ${n(e.y + e.h * fy)}`
      return `<defs><linearGradient id="${esc(id)}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${esc(e.fill ?? "#93c5fd")}"/><stop offset="1" stop-color="#1e3a8a" stop-opacity="0.55"/></linearGradient></defs>` +
        `<rect x="${n(e.x)}" y="${n(e.y)}" width="${n(e.w)}" height="${n(e.h)}" rx="${e.radius ?? 8}" fill="url(#${esc(id)})"/>` +
        `<path d="M${p(0.15, 0.8)} L${p(0.4, 0.45)} L${p(0.55, 0.62)} L${p(0.7, 0.38)} L${p(0.88, 0.8)} Z" fill="#ffffff" fill-opacity="0.55"/>` + (e.text ? label(e.text, "middle", e.x + e.w / 2) : "")
    }
    case "bar": {
      const id = `${prefix}-p-${e.id}`
      const defs = e.pattern ? `<defs><pattern id="${esc(id)}" width="8" height="8" patternUnits="userSpaceOnUse"${e.pattern === "stripes" ? ' patternTransform="rotate(45)"' : ""}><rect width="8" height="8" fill="${esc(e.fill ?? "#2563eb")}"/>${e.pattern === "stripes" ? '<rect width="3" height="8" fill="#ffffff" fill-opacity="0.7"/>' : '<circle cx="4" cy="4" r="1.6" fill="#ffffff" fill-opacity="0.8"/>'}</pattern></defs>` : ""
      return defs + `<rect x="${n(e.x)}" y="${n(e.y)}" width="${n(e.w)}" height="${n(e.h)}" fill="${e.pattern ? `url(#${esc(id)})` : esc(e.fill ?? "#2563eb")}" stroke="${esc(e.stroke ?? "none")}"/>`
    }
    case "line":
      return `<line x1="${n(e.x)}" y1="${n(e.y)}" x2="${n(e.x + e.w)}" y2="${n(e.y + e.h)}" stroke="${esc(e.stroke ?? "#d1d5db")}" stroke-width="${e.strokeWidth ?? 1}"/>`
    default:
      return ""
  }
}

const GAP = 96
const MARGIN = 48
const HEAD = 150
const NOTE = 15

/**
 * All screens side by side in one document. With `solution`, every element that has an issue is
 * outlined and numbered, and the findings are listed under its screen.
 */
export function auditScreensSvg(input: { heading: string; note: string; screens: AuditScreen[]; solution?: boolean }) {
  const { heading, note, screens, solution = false } = input
  const parts: string[] = []
  let x = MARGIN
  let bottom = 0
  screens.forEach((screen, index) => {
    const prefix = `s${index + 1}`
    const { w, h, bg } = screen.canvas
    const drawn = screen.elements.map((e) => `<g id="${prefix}-${layer(e.id)}">${shape(e, prefix)}</g>`).join("")
    const issues = screen.elements.filter((e) => e.selectable !== false && e.issue)
    let extra = ""
    let below = h
    if (solution) {
      extra += issues.map((e, i) => {
        const cx = Math.min(e.x + e.w + 4, w - 14), cy = Math.max(e.y - 4, 14)
        return `<g id="${prefix}-finding-${i + 1}"><rect x="${n(e.x - 5)}" y="${n(e.y - 5)}" width="${n(e.w + 10)}" height="${n(Math.max(e.h, 1) + 10)}" rx="6" fill="none" stroke="#b91c1c" stroke-width="3"/><circle cx="${n(cx)}" cy="${n(cy)}" r="13" fill="#b91c1c"/><circle cx="${n(cx)}" cy="${n(cy)}" r="11" fill="none" stroke="#ffffff" stroke-width="1.5"/><text x="${n(cx)}" y="${n(cy + 5)}" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="800" fill="#ffffff">${i + 1}</text></g>`
      }).join("")
      let y = h + 44
      const list = issues.map((e, i) => {
        const body = wrapAuditText(e.issue!.explanation, w - 34, NOTE)
        const block = `<g id="${prefix}-note-${i + 1}"><text x="0" y="${y}" font-family="${FONT}" font-size="16" font-weight="800" fill="#0f172a">${i + 1}. ${esc(e.issue!.title)}</text><text x="20" y="${y + 22}" font-family="${FONT}" font-size="${NOTE}" font-weight="700" fill="#b91c1c">${esc(e.issue!.sc)}</text>${lines(body.join("\n"), 20, y + 44, NOTE * 1.4, `font-family="${FONT}" font-size="${NOTE}" fill="#334155"`)}</g>`
        y += 44 + body.length * NOTE * 1.4 + 22
        return block
      }).join("")
      extra += `<g id="${prefix}-findings">${list}</g>`
      below = y
    }
    parts.push(`<g id="${layer(`Screen ${index + 1} ${screen.title}`)}" transform="translate(${x} ${HEAD})"><text x="0" y="-16" font-family="${FONT}" font-size="20" font-weight="800" fill="#0f172a">${esc(screen.title)}</text><rect id="${prefix}-frame" x="-1" y="-1" width="${w + 2}" height="${h + 2}" fill="${esc(bg ?? "#ffffff")}" stroke="#64748b" stroke-width="2"/><g id="${prefix}-design">${drawn}</g>${extra}</g>`)
    x += w + GAP
    bottom = Math.max(bottom, below)
  })
  const width = Math.max(x - GAP + MARGIN, 900)
  const height = HEAD + bottom + MARGIN
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(width)} ${n(height)}" width="${n(width)}" height="${n(height)}"><rect id="page" width="${n(width)}" height="${n(height)}" fill="#f1f5f9"/><g id="about"><text x="${MARGIN}" y="62" font-family="${FONT}" font-size="30" font-weight="800" fill="#0f172a">${esc(heading)}</text><text x="${MARGIN}" y="92" font-family="${FONT}" font-size="15" fill="#334155">${esc(note)}</text></g>${parts.join("")}</svg>\n`
}
