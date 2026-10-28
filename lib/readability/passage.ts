import type { Finding, FindingKind, ReadabilityReport } from "./analyse"
import { SENTENCE_KINDS } from "./analyse"
import type { Sentence } from "./segment"

/**
 * Turns a report into a tree the page can render as highlighted text: paragraphs, sentences,
 * and word-level marks nested inside them. Kept separate from the component so the nesting,
 * which is where highlighting usually goes wrong, can be tested without a browser.
 */

export type PassageNode =
  | { type: "text"; text: string }
  | { type: "mark"; finding: Finding; children: PassageNode[] }

export interface PassageSentence {
  sentence: Sentence
  /** Sentence-level findings: very long, hard, very hard. */
  kinds: FindingKind[]
  details: string[]
  nodes: PassageNode[]
}

export interface PassageParagraph {
  index: number
  longParagraph: Finding | null
  /** Sentences in order, with the whitespace between them. */
  parts: ({ type: "gap"; text: string } | { type: "sentence"; value: PassageSentence })[]
}

function buildNodes(text: string, from: number, to: number, marks: Finding[]): PassageNode[] {
  const nodes: PassageNode[] = []
  let cursor = from
  let i = 0
  while (i < marks.length) {
    const mark = marks[i]
    let j = i + 1
    while (j < marks.length && marks[j].end <= mark.end) j += 1
    if (mark.start > cursor) nodes.push({ type: "text", text: text.slice(cursor, mark.start) })
    nodes.push({ type: "mark", finding: mark, children: buildNodes(text, mark.start, mark.end, marks.slice(i + 1, j)) })
    cursor = mark.end
    i = j
  }
  if (cursor < to) nodes.push({ type: "text", text: text.slice(cursor, to) })
  return nodes
}

export function buildPassage(report: ReadabilityReport): PassageParagraph[] {
  const { text } = report
  const bySentence = new Map<number, Finding[]>()
  const sentenceLevel = new Map<number, Finding[]>()
  const longParagraphs = new Map<number, Finding>()
  for (const finding of report.findings) {
    if (finding.kind === "longParagraph") longParagraphs.set(finding.paragraph, finding)
    else if (finding.sentence === null) continue
    else {
      const target = SENTENCE_KINDS.has(finding.kind) ? sentenceLevel : bySentence
      target.set(finding.sentence, [...(target.get(finding.sentence) ?? []), finding])
    }
  }

  return report.paragraphs.map((paragraph) => {
    const parts: PassageParagraph["parts"] = []
    let cursor = paragraph.start
    for (const sentence of paragraph.sentences) {
      if (sentence.start > cursor) parts.push({ type: "gap", text: text.slice(cursor, sentence.start) })
      const marks = (bySentence.get(sentence.index) ?? []).sort((a, b) => a.start - b.start || b.end - a.end)
      const own = sentenceLevel.get(sentence.index) ?? []
      parts.push({
        type: "sentence",
        value: {
          sentence,
          kinds: own.map((finding) => finding.kind),
          details: own.map((finding) => finding.detail ?? ""),
          nodes: buildNodes(text, sentence.start, sentence.end, marks),
        },
      })
      cursor = sentence.end
    }
    if (paragraph.end > cursor) parts.push({ type: "gap", text: text.slice(cursor, paragraph.end) })
    return { index: paragraph.index, longParagraph: longParagraphs.get(paragraph.index) ?? null, parts }
  })
}
