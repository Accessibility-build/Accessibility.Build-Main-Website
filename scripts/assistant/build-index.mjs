// Builds lib/assistant/site-index.json, the search index behind the Curb assistant.
//
// It reads the HTML that `next build` prerendered into .next/server/app, keeps the indexable
// public pages, and splits each page's main content into heading-sized sections. The API route
// searches those sections to ground answers in what the site actually says.
//
//   npm run build
//   npm run assistant:index
//
// Re-run after content changes and commit the JSON. Pages rendered only on demand (anything
// not prerendered) are not in the index; the assistant still sees the page a visitor is on,
// because the widget sends that page's text with each question.
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..")
const BUILD_DIR = path.join(ROOT, ".next/server/app")
const OUT_FILE = path.join(ROOT, "lib/assistant/site-index.json")

const EXCLUDED_PREFIXES = [
  "/admin",
  "/api",
  "/billing",
  "/dashboard",
  "/desktop/connect",
  "/embed",
  "/hell",
  "/onboarding",
  "/reports",
  "/sign-in",
  "/sign-up",
  "/welcome",
]
// Shared blocks that repeat across pages and would crowd out the page's own content. Everything
// under one of these headings (its card grid of h3s included) is skipped until the next heading
// at the same level or higher.
const BOILERPLATE_HEADING =
  /^(related( content| resources| guides| tools| articles| pages| success criteria)?|essential accessibility resources|practical accessibility updates for working teams|more from the blog|keep exploring|you might also like|more resources|share( and embed| this page)?|download, cite,? and share|get the data|add to this case study|on this page|table of contents|get (in touch|started)|need help.*|stay updated|subscribe.*)$/i
const MAX_CHUNK = 1400
const MIN_CHUNK = 60

if (!fs.existsSync(BUILD_DIR)) {
  console.error(`No build output at ${BUILD_DIR}. Run \`npm run build\` first.`)
  process.exit(1)
}

const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", mdash: "\u2014", ndash: "\u2013",
  hellip: "…", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", copy: "©",
  bull: "•", middot: "·", times: "×", rarr: "→", larr: "←", trade: "™",
  reg: "®", euro: "€", pound: "£", deg: "°", sect: "§",
}

function decode(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
      return Number.isFinite(n) ? String.fromCodePoint(n) : match
    }
    return ENTITIES[code.toLowerCase()] ?? match
  })
}

function toText(html) {
  return decode(
    html
      .replace(/<(br|hr)\b[^>]*>/gi, "\n")
      .replace(/<\/(p|li|h[1-6]|div|tr|dt|dd|blockquote|pre|section|article|figcaption|summary|details|ul|ol|table|caption)>/gi, "\n")
      .replace(/<\/(td|th)>/gi, " ")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/[ \t\f\v ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function stripNoise(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, "")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, "")
    .replace(/<template\b[\s\S]*?<\/template>/gi, "")
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
}

function mainContent(html) {
  const start = html.search(/<main\b[^>]*id="main-content"[^>]*>/i)
  if (start === -1) return null
  const open = html.indexOf(">", start) + 1
  // The root <main> closes last; pages that nest their own <main> close theirs first.
  const end = html.lastIndexOf("</main>")
  return end > open ? html.slice(open, end) : null
}

function splitLong(text) {
  if (text.length <= MAX_CHUNK) return [text]
  const parts = []
  let current = ""
  for (const para of text.split("\n")) {
    if (current && current.length + para.length + 1 > MAX_CHUNK) {
      parts.push(current)
      current = ""
    }
    // A single paragraph longer than the limit is cut at sentence ends.
    if (para.length > MAX_CHUNK) {
      for (const sentence of para.match(/[^.!?]+[.!?]*\s*/g) ?? [para]) {
        if (current.length + sentence.length > MAX_CHUNK && current) {
          parts.push(current)
          current = ""
        }
        current += sentence
      }
      continue
    }
    current = current ? `${current}\n${para}` : para
  }
  if (current) parts.push(current)
  return parts.map((p) => p.trim()).filter(Boolean)
}

function routeFor(file, html) {
  const canonical = html.match(/<link rel="canonical" href="https:\/\/accessibility\.build([^"]*)"/i)
  if (canonical) return canonical[1].replace(/\/$/, "") || "/"
  const rel = path.relative(BUILD_DIR, file).replace(/\.html$/, "")
  return rel === "index" ? "/" : `/${rel}`
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return entry.name.endsWith(".html") ? [full] : []
  })
}

const pages = []
const chunks = []
const seenRoutes = new Set()

for (const file of walk(BUILD_DIR).sort()) {
  const name = path.basename(file)
  if (name.startsWith("_")) continue
  const html = fs.readFileSync(file, "utf8")
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) continue
  const route = routeFor(file, html)
  if (EXCLUDED_PREFIXES.some((p) => route === p || route.startsWith(`${p}/`))) continue
  if (seenRoutes.has(route)) continue
  seenRoutes.add(route)

  const title = decode(html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? route)
    .replace(/\s*[|\-\u2013\u2014]\s*Accessibility\.build\s*$/i, "")
    .trim()
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? "").trim()
  const main = mainContent(html)
  if (!main) continue

  const pageIndex = pages.length
  pages.push({ path: route, title, description })

  const body = stripNoise(main)
  const headingRe = /<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi
  let heading = title
  let skipping = false
  let skipLevel = 0
  let last = 0
  const sections = []
  for (const match of body.matchAll(headingRe)) {
    sections.push({ heading, html: body.slice(last, match.index), skip: skipping })
    const level = Number(match[1])
    heading = toText(match[2]).replace(/\s+/g, " ") || heading
    if (skipping && level <= skipLevel) skipping = false
    if (!skipping && BOILERPLATE_HEADING.test(heading.trim())) {
      skipping = true
      skipLevel = level
    }
    last = match.index + match[0].length
  }
  sections.push({ heading, html: body.slice(last), skip: skipping })

  for (const section of sections) {
    if (section.skip) continue
    const text = toText(section.html)
    if (text.length < MIN_CHUNK) continue
    for (const part of splitLong(text)) {
      if (part.length >= MIN_CHUNK) chunks.push({ page: pageIndex, heading: section.heading, text: part })
    }
  }
}

// Drop text that repeats on many pages (shared CTAs, footers of cards, disclaimers).
const counts = new Map()
for (const c of chunks) counts.set(c.text, (counts.get(c.text) ?? 0) + 1)
const seenText = new Set()
const kept = chunks.filter((c) => {
  if ((counts.get(c.text) ?? 0) > 3) return false
  if (seenText.has(c.text)) return false
  seenText.add(c.text)
  return true
})

// One record per line keeps git diffs readable when the index is regenerated.
const lines = [
  "{",
  `"generatedAt": ${JSON.stringify(new Date().toISOString())},`,
  '"pages": [',
  pages.map((p) => JSON.stringify(p)).join(",\n"),
  "],",
  '"chunks": [',
  kept.map((c) => JSON.stringify(c)).join(",\n"),
  "]",
  "}",
]
fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
fs.writeFileSync(OUT_FILE, `${lines.join("\n")}\n`)

const bytes = fs.statSync(OUT_FILE).size
console.log(
  `Indexed ${pages.length} pages into ${kept.length} sections (${chunks.length - kept.length} repeated sections dropped), ${(bytes / 1024 / 1024).toFixed(2)} MB -> ${path.relative(ROOT, OUT_FILE)}`
)
