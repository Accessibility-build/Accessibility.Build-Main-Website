import type { CourseBlock } from "./types"

/** Plain text of a lesson block, for search, the study coach and reading-time estimates. */
export function blockPlainText(block: CourseBlock, rowSeparator = " "): string {
  switch (block.type) {
    case "table":
      return [block.caption, ...block.headers, ...block.rows.map((row) => row.join(rowSeparator === " " ? " " : " | "))].join(rowSeparator)
    case "keyterms":
      return block.items.map((item) => `${item.term}: ${item.def}`).join(rowSeparator)
    case "bullets":
    case "numbered":
      return block.items.join(rowSeparator)
    case "callout":
      return `${block.title}${rowSeparator}${block.text}`
    case "figure":
      return `${block.caption}${rowSeparator}${block.alt}`
    case "compare":
      return [block.caption, ...block.items.map((item) => `${item.verdict === "avoid" ? "Avoid" : "Prefer"}: ${item.label}. ${item.note}`)].join(rowSeparator)
    case "audit":
      return [block.title, block.intro, block.alt].join(rowSeparator)
    case "widget":
      return `${block.title}${rowSeparator}${block.intro}`
    case "video":
      return `Video: ${block.title}${rowSeparator}${block.summary}`
    default:
      return block.text
  }
}
