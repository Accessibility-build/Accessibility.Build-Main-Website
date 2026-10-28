import { countSyllables } from "@/lib/typography/metrics"

/**
 * Splits text into paragraphs, sentences and words, keeping every offset so findings can be
 * highlighted in place.
 *
 * Word tokens follow the rule in `analyzeText` (lib/typography/metrics.ts): a run of
 * non-whitespace that contains a letter, with syllables from `countSyllables`. Sentences are
 * split more carefully than `analyzeText` does, because a period inside "e.g.", "Dr." or "U.S."
 * is not the end of a sentence and a heading with no full stop is.
 */

export interface WordToken {
  /** The token as written, punctuation included: "well-known," */
  raw: string
  /** The token without surrounding punctuation: "well-known" */
  core: string
  /** Offsets of `core` in the normalised text. */
  start: number
  end: number
  syllables: number
  /** Punctuation that followed the word, for example "," or ".". */
  trailing: string
}

export interface Sentence {
  index: number
  paragraph: number
  start: number
  end: number
  text: string
  words: WordToken[]
}

export interface Paragraph {
  index: number
  start: number
  end: number
  text: string
  sentences: Sentence[]
  wordCount: number
}

/**
 * Line breaks, non-breaking and zero-width spaces made consistent, runs of spaces collapsed.
 * All offsets refer to the string this returns.
 */
export function normaliseText(raw: string): string {
  return raw
    .replace(/\r\n?/g, "\n")
    .replace(/[   ]/g, " ")
    .replace(/[​‌‍﻿­]/g, "")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

/** Words that end in a full stop without ending the sentence ("Dr. Patel", "approx. 20"). */
const NO_BREAK_AFTER = new Set([
  "mr", "mrs", "ms", "mx", "dr", "prof", "rev", "st", "mt", "jr", "sr", "sir", "vs", "v", "no", "nos",
  "fig", "figs", "approx", "ca", "cf", "dept", "est", "inc", "ltd", "co", "corp", "vol", "pp", "p",
  "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec",
])

// Closing quotes, brackets and citation markers ("possible.[1] Plain") belong to the sentence they end.
const SENTENCE_END_RE = /[.!?…]+(?:["'”’)\]]|\[\d{1,3}\])*/g

/** A new line starts a new paragraph unless it plainly continues the previous line (hard-wrapped text). */
function splitParagraphs(text: string): { start: number; end: number }[] {
  const spans: { start: number; end: number }[] = []
  let start = 0
  let cursor = 0
  const lines = text.split("\n")
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const lineEnd = cursor + line.length
    const next = lines[i + 1]
    const continues =
      next !== undefined && next !== "" && line !== "" && /[a-z,;]$/.test(line) && /^[a-z]/.test(next)
    if (!continues) {
      if (lineEnd > start) spans.push({ start, end: lineEnd })
      start = lineEnd + 1
    }
    cursor = lineEnd + 1
  }
  return spans.filter((span) => text.slice(span.start, span.end).trim() !== "")
}

function isSentenceBreak(text: string, punctStart: number, punctEnd: number): boolean {
  const rest = text.slice(punctEnd)
  if (!/^\s/.test(rest) && rest !== "") return false
  const after = rest.trimStart()
  if (after === "") return true
  // The next sentence starts with a capital, a digit, or an opening quote or bracket.
  if (!/^["'“‘(\[]?[A-Z0-9]/.test(after)) return false
  const mark = text.slice(punctStart, punctEnd)
  if (!mark.startsWith(".") || mark.startsWith("..")) return true
  const before = text.slice(0, punctStart).match(/(\S+)$/)?.[1] ?? ""
  const word = before.replace(/^["'“‘(\[]+/, "")
  if (/^[A-Z]$/.test(word)) return false // an initial: "J. Smith"
  if (/[A-Za-z]\.[A-Za-z]/.test(word)) return false // "U.S. Office", "e.g. The"
  return !NO_BREAK_AFTER.has(word.toLowerCase())
}

function tokenise(text: string, offset: number): WordToken[] {
  const words: WordToken[] = []
  for (const match of text.matchAll(/\S+/g)) {
    const raw = match[0]
    if (!/[a-zA-Z]/.test(raw)) continue
    const lead = raw.match(/^[^A-Za-z0-9]*/)?.[0].length ?? 0
    // "e.g." keeps its inner dot: the core is "e.g" and the trailing "." is punctuation.
    const core = raw
      .slice(lead)
      .replace(/(?:\[\d{1,3}\])+[^A-Za-z0-9]*$/, "")
      .replace(/[^A-Za-z0-9]+$/, "")
    const start = offset + (match.index ?? 0) + lead
    words.push({
      raw,
      core,
      start,
      end: start + core.length,
      syllables: countSyllables(raw),
      trailing: raw.slice(lead + core.length),
    })
  }
  return words
}

/** Paragraphs, each with its sentences and words. `text` must already be normalised. */
export function segment(text: string): Paragraph[] {
  const paragraphs: Paragraph[] = []
  let sentenceIndex = 0
  for (const span of splitParagraphs(text)) {
    const body = text.slice(span.start, span.end)
    const sentences: Sentence[] = []
    let sentenceStart = 0
    const pushSentence = (end: number) => {
      const slice = body.slice(sentenceStart, end)
      const leading = slice.length - slice.trimStart().length
      const trimmed = slice.trim()
      if (trimmed) {
        const start = span.start + sentenceStart + leading
        const words = tokenise(trimmed, start)
        if (words.length > 0) {
          sentences.push({
            index: sentenceIndex++,
            paragraph: paragraphs.length,
            start,
            end: start + trimmed.length,
            text: trimmed,
            words,
          })
        }
      }
      sentenceStart = end
    }
    for (const match of body.matchAll(SENTENCE_END_RE)) {
      const punctStart = match.index ?? 0
      const punctEnd = punctStart + match[0].length
      if (isSentenceBreak(body, punctStart, punctEnd)) pushSentence(punctEnd)
    }
    pushSentence(body.length)
    if (sentences.length === 0) continue
    paragraphs.push({
      index: paragraphs.length,
      start: span.start,
      end: span.end,
      text: body,
      sentences,
      wordCount: sentences.reduce((sum, sentence) => sum + sentence.words.length, 0),
    })
  }
  return paragraphs
}
