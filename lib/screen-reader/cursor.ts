import type { TranscriptLine } from "./types"

// The browser side of the screen reader preview: which lines a filter shows, and where the virtual
// cursor goes next. Pure, so it can be tested without a page.

export type LineFilter = "all" | "headings" | "landmarks" | "links" | "forms"

export const FILTERS: { value: LineFilter; label: string }[] = [
  { value: "all", label: "Everything" },
  { value: "headings", label: "Headings" },
  { value: "landmarks", label: "Landmarks" },
  { value: "links", label: "Links" },
  { value: "forms", label: "Form fields and buttons" },
]

/** A line with its position in the full transcript, which stays the same under any filter. */
export interface IndexedLine extends TranscriptLine {
  index: number
}

export function matchesFilter(line: TranscriptLine, filter: LineFilter): boolean {
  switch (filter) {
    case "headings":
      return line.kind === "heading"
    case "landmarks":
      return line.kind === "landmark"
    case "links":
      return line.kind === "link" || line.link === true
    case "forms":
      return line.kind === "field" || line.kind === "button"
    default:
      return true
  }
}

export function filterLines(lines: TranscriptLine[], filter: LineFilter): IndexedLine[] {
  const out: IndexedLine[] = []
  lines.forEach((line, index) => {
    if (matchesFilter(line, filter)) out.push({ ...line, index })
  })
  return out
}

/** Where the cursor sits in the visible lines: the line itself, or the first visible line after it. */
export function positionOf(visible: IndexedLine[], cursor: number): number {
  if (visible.length === 0) return -1
  const exact = visible.findIndex((line) => line.index >= cursor)
  return exact === -1 ? visible.length - 1 : exact
}

/** The transcript index one visible line before or after the cursor, or null at either end. */
export function stepLine(visible: IndexedLine[], cursor: number, direction: 1 | -1): number | null {
  const position = positionOf(visible, cursor)
  if (position === -1) return null
  // A cursor hidden by the filter counts as sitting just before the next visible line.
  const onLine = visible[position]?.index === cursor
  const target = direction === 1 ? (onLine ? position + 1 : position) : position - 1
  return visible[target]?.index ?? null
}

/** The transcript index of the next or previous visible heading, or null when there is none. */
export function stepHeading(visible: IndexedLine[], cursor: number, direction: 1 | -1): number | null {
  if (direction === 1) return visible.find((line) => line.kind === "heading" && line.index > cursor)?.index ?? null
  for (let i = visible.length - 1; i >= 0; i -= 1) {
    if (visible[i].kind === "heading" && visible[i].index < cursor) return visible[i].index
  }
  return null
}

/** Plain text of the visible lines, for copying. */
export function transcriptText(visible: IndexedLine[]): string {
  return visible
    .map((line) => `${line.index + 1}. ${line.text}${line.issue ? `  [Problem: ${line.issue}]` : ""}`)
    .join("\n")
}
