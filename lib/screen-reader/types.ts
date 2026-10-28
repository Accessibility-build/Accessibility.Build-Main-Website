// Shapes shared by the screen reader preview route and its browser component. The route sends
// these instead of Chrome's raw accessibility tree, which runs to megabytes on a large page.

/** What a transcript line announces, for filtering and styling. */
export type LineKind =
  | "heading"
  | "landmark"
  | "link"
  | "field"
  | "button"
  | "image"
  | "list"
  | "table"
  | "frame"
  | "dialog"
  | "text"
  | "other"

export interface TranscriptLine {
  /** What would be announced, for example "heading level 2, Pricing". */
  text: string
  kind: LineKind
  /** Heading level, so the virtual cursor can jump between headings. */
  level?: number
  /** Set when the line also announces a link: a link inside a heading, or a heading inside a link. */
  link?: true
  /** A problem with what this line announces, such as "No accessible name". */
  issue?: string
  /** Information that is not a problem, such as "Frame content is not included". */
  note?: string
}

export interface SummaryRow {
  /** Heading level, landmark role or control type: "h2", "navigation", "check box". */
  label: string
  name: string
  /** The destination of a link, or the states of a field or button. */
  detail?: string
  issue?: string
  /** Index of the transcript line that announces it, when that line is within the cap. */
  line?: number
}

export interface SummaryNote {
  text: string
  /** False for information worth knowing that is not a failure, such as more than one h1. */
  problem: boolean
}

export interface Summary {
  rows: SummaryRow[]
  /** How many there are on the page; rows may be capped below this. */
  total: number
  /** Rows with an issue plus notes that are problems, counted over the whole page. */
  problems: number
  notes: SummaryNote[]
}

export interface Summaries {
  headings: Summary
  landmarks: Summary
  links: Summary
  fields: Summary
  images: Summary
  buttons: Summary
}

export interface Transcript {
  /** The page title, from the root of the tree. */
  title: string
  lines: TranscriptLine[]
  /** True when the page had more lines than the cap and the transcript stops early. */
  truncated: boolean
  /** Lines the full page would have produced, including any past the cap. */
  totalLines: number
  summaries: Summaries
}

export interface ScreenReaderResult extends Transcript {
  url: string
  finalUrl: string
  /** Set when the page was too large to read whole: elements on the page, and how many were read. */
  trimmed?: { elements: number; read: number }
}
