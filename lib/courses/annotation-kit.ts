// Accessibility annotation sticker sheet for design files (Figma, Penpot, Sketch, Illustrator import SVG
// and keep each <g id> as a named layer). Every sticker is white text on a dark fill (at least 7:1).

const COLORS = { heading: "#5b21b6", landmark: "#0f766e", order: "#1d4ed8", name: "#9a3412", alt: "#9d174d", role: "#334155", state: "#3f6212", keyboard: "#1e3a8a", target: "#b91c1c", note: "#713f12" }
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

function tag(id: string, x: number, y: number, text: string, fill: string, minW = 0) {
  const w = Math.max(minW, Math.round(text.length * 9.2 + 30))
  return { w, svg: `<g id="${esc(id)}" transform="translate(${x} ${y})"><rect width="${w}" height="32" rx="6" fill="${fill}"/><text x="14" y="21" font-family="Inter, system-ui, sans-serif" font-size="15" font-weight="700" fill="#ffffff">${esc(text)}</text></g>` }
}
function badge(id: string, x: number, y: number, n: number) {
  return `<g id="${esc(id)}" transform="translate(${x} ${y})"><circle cx="18" cy="18" r="18" fill="${COLORS.order}"/><circle cx="18" cy="18" r="15.5" fill="none" stroke="#ffffff" stroke-width="2"/><text x="18" y="24" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="16" font-weight="800" fill="#ffffff">${n}</text></g>`
}
function callout(id: string, x: number, y: number, label: string, fill: string) {
  return `<g id="${esc(id)}" transform="translate(${x} ${y})"><rect width="300" height="64" rx="8" fill="#ffffff" stroke="${fill}" stroke-width="3"/><rect width="300" height="26" rx="8" fill="${fill}"/><rect y="18" width="300" height="8" fill="${fill}"/><text x="12" y="18" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="700" fill="#ffffff">${esc(label)}</text><text x="12" y="50" font-family="Inter, system-ui, sans-serif" font-size="14" fill="#374151">Write the exact text here</text></g>`
}

/** Returns the complete sticker sheet as an SVG document. */
export function annotationKitSvg(courseTitle: string) {
  const parts: string[] = []
  let y = 40
  const section = (title: string, note: string) => {
    parts.push(`<g id="section-${slug(title)}"><text x="40" y="${y}" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="800" fill="#0f172a">${esc(title)}</text><text x="40" y="${y + 24}" font-family="Inter, system-ui, sans-serif" font-size="14" fill="#475569">${esc(note)}</text></g>`)
    y += 44
  }
  const row = (items: Array<[string, string]>, fill: string, prefix: string, minW = 0) => {
    let x = 40
    for (const [id, text] of items) {
      const t = tag(`${prefix}-${id}`, x, y, text, fill, minW)
      if (x + t.w > 1160) { x = 40; y += 44 }
      const placed = tag(`${prefix}-${id}`, x, y, text, fill, minW)
      parts.push(placed.svg)
      x += placed.w + 12
    }
    y += 64
  }
  parts.push(`<text x="40" y="${y}" font-family="Inter, system-ui, sans-serif" font-size="30" font-weight="800" fill="#0f172a">Accessibility annotation kit</text><text x="40" y="${y + 28}" font-family="Inter, system-ui, sans-serif" font-size="15" fill="#475569">${esc(courseTitle)} · Accessibility.build · Drag stickers onto your designs; each is a named layer.</text>`)
  y += 76
  section("Headings", "Mark the level of every heading (1.3.1, 2.4.6). Visual size is not enough.")
  row(["H1", "H2", "H3", "H4", "H5", "H6"].map((h) => [h.toLowerCase(), h]), COLORS.heading, "heading", 56)
  section("Landmarks", "Wrap each region and name repeated ones (for example two navigation regions).")
  row([["header", "Header (banner)"], ["nav", "Navigation"], ["main", "Main"], ["search", "Search"], ["aside", "Complementary"], ["footer", "Footer (contentinfo)"], ["region", "Region: name it"], ["form", "Form: name it"]], COLORS.landmark, "landmark")
  section("Focus order", "Number interactive elements in the order keyboard focus should move (2.4.3).")
  { let x = 40; for (let n = 1; n <= 24; n++) { parts.push(badge(`focus-${n}`, x, y, n)); x += 46 } y += 58 }
  parts.push(`<g id="reading-order-arrow" transform="translate(40 ${y})"><line x1="0" y1="14" x2="150" y2="14" stroke="${COLORS.order}" stroke-width="4"/><path d="M150 4 L170 14 L150 24 Z" fill="${COLORS.order}"/><text x="184" y="20" font-family="Inter, system-ui, sans-serif" font-size="14" fill="#334155">Reading and focus order arrow</text></g>`)
  y += 56
  section("Names and text alternatives", "Give the exact accessible name for icon-only controls and the alt text for every image (1.1.1, 4.1.2, 2.5.3).")
  parts.push(callout("name-callout", 40, y, "Accessible name", COLORS.name), callout("alt-callout", 360, y, "Alt text", COLORS.alt))
  parts.push(tag("alt-decorative", 680, y + 16, 'Decorative: alt=""', COLORS.alt).svg)
  y += 96
  section("Roles", "Say what custom-looking elements are, so developers use the right element.")
  row([["button", "Button"], ["link", "Link"], ["toggle", "Toggle button"], ["checkbox", "Checkbox"], ["radio", "Radio group"], ["tabs", "Tabs"], ["menu", "Menu button"], ["dialog", "Dialog (modal)"], ["disclosure", "Disclosure"], ["combobox", "Combobox"], ["image", "Image"], ["table", "Data table"]], COLORS.role, "role")
  section("States and messages", "Annotate every state and how changes are announced (4.1.2, 4.1.3, 3.3.1).")
  row([["pressed", "Pressed / not pressed"], ["expanded", "Expanded / collapsed"], ["selected", "Selected"], ["current", "Current page"], ["disabled", "Disabled: why?"], ["required", "Required"], ["invalid", "Invalid + error text"], ["polite", "Announce politely"], ["assertive", "Announce immediately"], ["focus-move", "Move focus here"], ["focus-return", "Return focus to trigger"]], COLORS.state, "state")
  section("Keyboard", "Note any keys beyond Tab and Enter, such as arrows in tabs and menus (2.1.1).")
  row([["tab", "Tab / Shift+Tab"], ["arrows", "Arrow keys"], ["enter", "Enter"], ["space", "Space"], ["esc", "Esc closes"], ["home-end", "Home / End"], ["skip", "Skip link target"]], COLORS.keyboard, "key")
  section("Targets, zoom and motion", "Size checks and behavior that a static design cannot show (2.5.8, 1.4.10, 2.3.3).")
  parts.push(`<g id="target-24" transform="translate(40 ${y})"><rect width="24" height="24" fill="none" stroke="${COLORS.target}" stroke-width="2" stroke-dasharray="3 2"/><text x="34" y="17" font-family="Inter, system-ui, sans-serif" font-size="14" fill="#334155">24 × 24 CSS px (2.5.8 minimum)</text></g>`)
  parts.push(`<g id="target-44" transform="translate(320 ${y - 10})"><rect width="44" height="44" fill="none" stroke="${COLORS.target}" stroke-width="2" stroke-dasharray="3 2"/><text x="54" y="27" font-family="Inter, system-ui, sans-serif" font-size="14" fill="#334155">44 × 44 CSS px (2.5.5 enhanced)</text></g>`)
  y += 50
  row([["reflow", "Reflows at 320 CSS px"], ["zoom", "Text resizes to 200%"], ["spacing", "Tolerates text spacing"], ["reduced-motion", "Reduced-motion version"], ["pause", "Pause control"], ["hover", "Hover content dismissible"]], COLORS.note, "note")
  const height = y + 20
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 ${height}" width="1200" height="${height}" role="img" aria-labelledby="kit-title"><title id="kit-title">Accessibility annotation kit: stickers for headings, landmarks, focus order, names, alt text, roles, states, keyboard, targets, zoom and motion</title><rect width="1200" height="${height}" fill="#ffffff"/>${parts.join("")}</svg>\n`
}
