import type { CourseBlock, CourseChapter } from "./types"

export interface CourseSearchHit { chapterKey: string; title: string; heading: string; anchor: string; excerpt: string }
function blockText(block: CourseBlock): string {
  if ("text" in block) return block.text
  if (block.type === "table") return [block.caption, ...block.headers, ...block.rows.flat()].join(" ")
  if (block.type === "keyterms") return block.items.map((item) => `${item.term}: ${item.def}`).join(" ")
  return block.items.join(" ")
}

/** Search only lesson material. Reserved mock stems and answers are never indexed here. */
export function searchCourse(chapters: CourseChapter[], rawQuery: string): CourseSearchHit[] {
  const query = rawQuery.trim().toLocaleLowerCase().slice(0, 100)
  if (query.length < 2) return []
  const terms = query.split(/\s+/).filter(Boolean).slice(0, 8)
  const hits: Array<CourseSearchHit & { score: number }> = []
  for (const chapter of chapters) {
    let heading = chapter.title, anchor = ""
    for (let i = 0; i < chapter.blocks.length; i++) {
      const block = chapter.blocks[i]
      if (block.type === "h2" || block.type === "h3" || block.type === "keyterms") {
        heading = block.type === "keyterms" ? "Key terms" : block.text
        anchor = `c${chapter.number}-${i}`
      }
      const text = blockText(block).replace(/\*\*/g, "")
      const searchable = `${chapter.title} ${heading} ${text}`.toLocaleLowerCase()
      if (!terms.every((term) => searchable.includes(term))) continue
      const position = Math.max(0, text.toLocaleLowerCase().indexOf(terms[0]))
      const start = Math.max(0, position - 65)
      const excerpt = `${start ? "…" : ""}${text.slice(start, start + 300)}${text.length > start + 300 ? "…" : ""}`
      const score = (text.toLocaleLowerCase().includes(query) ? 5 : 0) + (heading.toLocaleLowerCase().includes(query) ? 4 : 0) + (chapter.title.toLocaleLowerCase().includes(query) ? 2 : 0)
      hits.push({ chapterKey: chapter.key, title: chapter.title, heading, anchor, excerpt, score })
    }
  }
  const seen = new Set<string>()
  return hits.sort((a, b) => b.score - a.score).filter((hit) => {
    const key = `${hit.chapterKey}:${hit.anchor}`
    if (seen.has(key)) return false
    seen.add(key); return true
  }).slice(0, 20).map(({ score: _score, ...hit }) => hit)
}
