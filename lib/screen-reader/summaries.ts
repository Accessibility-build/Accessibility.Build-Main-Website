import type { Summaries, Summary, SummaryNote, SummaryRow, TranscriptLine } from "./types"

// The lists a screen reader user pulls up to get around a page (headings, landmarks, links, form
// fields, images, buttons), each with the problems that make them hard to use flagged. The checks
// are the ones that can be decided from the accessibility tree alone; whether a name is accurate
// still needs a person.

/** What the transcript builder records about each element as it walks the tree. */
export interface Collected {
  headings: { level: number; name: string; line?: number }[]
  landmarks: { role: string; label: string; name: string; line?: number }[]
  links: { name: string; url: string; line?: number }[]
  fields: { label: string; name: string; states: string; line?: number }[]
  images: { name: string; isImg: boolean; insideControl: boolean; src: string; line?: number }[]
  buttons: { label: string; name: string; states: string; line?: number }[]
}

/** Rows kept per summary. Problem counts are always over the whole page. */
const ROW_CAPS = { headings: 300, landmarks: 100, links: 400, fields: 200, images: 200, buttons: 200 }

/** Link text that says nothing on its own, compared after lower-casing and dropping punctuation. */
const VAGUE_LINK_TEXT = new Set([
  "click here",
  "click",
  "here",
  "read more",
  "learn more",
  "more",
  "more info",
  "more information",
  "find out more",
  "continue",
  "continue reading",
  "details",
  "more details",
  "view details",
  "see details",
  "see more",
  "view more",
  "show more",
  "link",
  "this link",
  "go",
  "this",
  "info",
  "full story",
  "read full story",
  "read the full story",
])

function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

function wordsOnly(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function isVagueLinkText(name: string): boolean {
  return VAGUE_LINK_TEXT.has(wordsOnly(name))
}

/** A web address read out as the link text, such as "https://example.com/a/b" or "www.example.com". */
export function isUrlLinkText(name: string, url: string): boolean {
  const text = name.trim()
  if (!text || /\s/.test(text)) return false
  if (/^(https?:\/\/|www\.)\S+$/i.test(text)) return true
  if (/^[\w-]+(\.[\w-]+)+\/\S*$/.test(text)) return true
  return Boolean(url) && text.replace(/\/$/, "") === url.replace(/\/$/, "")
}

/** Where a link goes, ignoring the fragment and a trailing slash. Null for script links. */
export function destinationOf(url: string): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.protocol === "javascript:") return null
    parsed.hash = ""
    return `${parsed.origin}${parsed.pathname.replace(/\/$/, "")}${parsed.search}`
  } catch {
    return null
  }
}

/** The last part of an image address, for example "logo.svg". Empty for data: URLs. */
function fileName(src: string): string {
  if (!src || src.startsWith("data:")) return ""
  try {
    const path = new URL(src).pathname
    return clip(decodeURIComponent(path.slice(path.lastIndexOf("/") + 1)), 80)
  } catch {
    return ""
  }
}

/** Keeps every row with an issue (up to the cap), then fills with the rest in page order. */
function capRows(rows: SummaryRow[], max: number): SummaryRow[] {
  if (rows.length <= max) return rows
  const keep = new Set<number>()
  rows.forEach((row, index) => {
    if (row.issue && keep.size < max) keep.add(index)
  })
  for (let index = 0; index < rows.length && keep.size < max; index += 1) keep.add(index)
  return rows.filter((_, index) => keep.has(index))
}

interface Checked {
  rows: SummaryRow[]
  notes: SummaryNote[]
}

function build({ rows, notes }: Checked, cap: number): Summary {
  return {
    rows: capRows(rows, cap),
    total: rows.length,
    problems: rows.filter((row) => row.issue).length + notes.filter((note) => note.problem).length,
    notes,
  }
}

function headingChecks(headings: Collected["headings"]): Checked {
  const rows: SummaryRow[] = headings.map((heading, index) => {
    const previous = headings[index - 1]
    let issue: string | undefined
    if (!heading.name) issue = "Empty heading"
    else if (previous && heading.level > previous.level + 1) issue = `Skips from level ${previous.level} to level ${heading.level}`
    return { label: `h${heading.level}`, name: clip(heading.name, 200), issue, line: heading.line }
  })
  const notes: SummaryNote[] = []
  const h1s = headings.filter((heading) => heading.level === 1).length
  if (headings.length === 0) notes.push({ text: "The page has no headings, so there is no outline to move through.", problem: true })
  else if (h1s === 0) notes.push({ text: "No level 1 heading. Most pages have one h1 that says what the page is.", problem: true })
  if (h1s > 1) notes.push({ text: `${h1s} level 1 headings. This is allowed, but one h1 naming the page is the usual pattern.`, problem: false })
  return { rows, notes }
}

function landmarkChecks(landmarks: Collected["landmarks"]): Checked {
  const navigations = landmarks.filter((landmark) => landmark.role === "navigation").length
  const rows: SummaryRow[] = landmarks.map((landmark) => ({
    label: landmark.label,
    name: clip(landmark.name, 120),
    issue:
      landmark.role === "navigation" && navigations > 1 && !landmark.name
        ? `One of ${navigations} navigation landmarks, with no name to tell it apart`
        : undefined,
    line: landmark.line,
  }))
  const notes: SummaryNote[] = []
  const mains = landmarks.filter((landmark) => landmark.role === "main").length
  if (mains === 0) notes.push({ text: "No main landmark, so there is no quick way to jump to the main content.", problem: true })
  if (mains > 1) notes.push({ text: `${mains} main landmarks. A page should have one.`, problem: true })
  return { rows, notes }
}

function linkChecks(links: Collected["links"]): Checked {
  // Same text, different places: group by the words of the name.
  const destinations = new Map<string, Set<string>>()
  const counts = new Map<string, number>()
  for (const link of links) {
    const key = wordsOnly(link.name)
    if (!key) continue
    counts.set(key, (counts.get(key) ?? 0) + 1)
    const destination = destinationOf(link.url)
    if (destination) destinations.set(key, (destinations.get(key) ?? new Set()).add(destination))
  }

  const rows: SummaryRow[] = links.map((link) => {
    const issues: string[] = []
    const key = wordsOnly(link.name)
    if (!link.name) issues.push("No accessible name")
    else if (isUrlLinkText(link.name, link.url)) issues.push("Web address used as the link text")
    else if (isVagueLinkText(link.name)) issues.push("Vague text that only makes sense in context")
    const places = destinations.get(key)?.size ?? 0
    if (key && places > 1) issues.push(`${counts.get(key)} links say this but go to ${places} different places`)
    return {
      label: "link",
      name: clip(link.name, 200),
      detail: link.url ? clip(link.url, 160) : undefined,
      issue: issues.length ? issues.join("; ") : undefined,
      line: link.line,
    }
  })
  return { rows, notes: [] }
}

function controlChecks(controls: Collected["fields"]): Checked {
  const rows: SummaryRow[] = controls.map((control) => ({
    label: control.label,
    name: clip(control.name, 160),
    detail: control.states || undefined,
    issue: control.name ? undefined : "No accessible name",
    line: control.line,
  }))
  return { rows, notes: [] }
}

function imageChecks(images: Collected["images"]): Checked {
  const rows: SummaryRow[] = images.map((image) => {
    let issue: string | undefined
    // An unnamed SVG icon inside a link or button is the control's problem, if the control has no
    // name; an <img> without alt fails wherever it is.
    if (!image.name && (image.isImg || !image.insideControl)) issue = image.isImg ? "No alt text" : "No text alternative"
    const where = image.insideControl ? "Inside a link or button" : ""
    // With no name to go on, the file name is how to find the image in the source.
    const file = !image.name ? fileName(image.src) : ""
    return {
      label: image.isImg ? "img" : "svg or role img",
      name: clip(image.name, 200),
      detail: [where, file && `File: ${file}`].filter(Boolean).join(". ") || undefined,
      issue,
      line: image.line,
    }
  })
  return { rows, notes: [] }
}

/** Builds the six summaries and copies each problem onto the transcript line that announces it. */
export function summarise(collected: Collected, lines: TranscriptLine[]): Summaries {
  const checked = {
    headings: headingChecks(collected.headings),
    landmarks: landmarkChecks(collected.landmarks),
    links: linkChecks(collected.links),
    fields: controlChecks(collected.fields),
    images: imageChecks(collected.images),
    buttons: controlChecks(collected.buttons),
  }
  // Marked from every row, before the row lists are capped.
  for (const { rows } of Object.values(checked)) {
    for (const row of rows) {
      if (!row.issue || row.line === undefined || !lines[row.line]) continue
      const line = lines[row.line]
      if (!line.issue) line.issue = row.issue
      else if (!line.issue.includes(row.issue)) line.issue = `${line.issue}; ${row.issue}`
    }
  }
  return {
    headings: build(checked.headings, ROW_CAPS.headings),
    landmarks: build(checked.landmarks, ROW_CAPS.landmarks),
    links: build(checked.links, ROW_CAPS.links),
    fields: build(checked.fields, ROW_CAPS.fields),
    images: build(checked.images, ROW_CAPS.images),
    buttons: build(checked.buttons, ROW_CAPS.buttons),
  }
}
