/**
 * Text analysis primitives: word/sentence/syllable counts plus character-per-line
 * estimates. Used by readability scoring and the WCAG line-length guidance.
 */

const VOWEL_GROUP_RE = /[aeiouy]+/gi
const SENTENCE_END_RE = /[.!?…]+/g

/**
 * Approximate syllable count for an English word.
 * Heuristic: count vowel groups, subtract 1 for silent terminal "e".
 * Not perfect but accurate enough for Flesch-Kincaid.
 */
export function countSyllables(word: string): number {
  if (!word) return 0
  const cleaned = word
    .toLowerCase()
    .replace(/[^a-z]/g, "")
  if (cleaned.length === 0) return 0
  if (cleaned.length <= 3) return 1

  // Strip silent terminal patterns: -e, -es, -ed (when not preceded by t or d)
  const normalized = cleaned
    .replace(/(?:[^laeiouy]es|[^laeiouy]e)$/, "")
    .replace(/^y/, "")

  const matches = normalized.match(VOWEL_GROUP_RE)
  return matches ? Math.max(1, matches.length) : 1
}

export interface TextStats {
  characters: number // excluding whitespace
  charactersWithSpaces: number
  words: number
  sentences: number
  syllables: number
  longWords: number // 3+ syllables
  averageWordsPerSentence: number
  averageSyllablesPerWord: number
  averageLetterCount: number
}

export function analyzeText(text: string): TextStats {
  const trimmed = text.trim()
  if (!trimmed) {
    return {
      characters: 0,
      charactersWithSpaces: 0,
      words: 0,
      sentences: 0,
      syllables: 0,
      longWords: 0,
      averageWordsPerSentence: 0,
      averageSyllablesPerWord: 0,
      averageLetterCount: 0,
    }
  }

  const charactersWithSpaces = trimmed.length
  const characters = trimmed.replace(/\s+/g, "").length

  // Words: split on whitespace
  const wordTokens = trimmed.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w))
  const words = wordTokens.length

  // Sentences: split on punctuation, count non-empty chunks
  const sentences = Math.max(
    1,
    trimmed
      .split(SENTENCE_END_RE)
      .map((s) => s.trim())
      .filter(Boolean).length
  )

  let syllables = 0
  let longWords = 0
  let letterTotal = 0
  for (const w of wordTokens) {
    const s = countSyllables(w)
    syllables += s
    if (s >= 3) longWords++
    letterTotal += w.replace(/[^a-zA-Z]/g, "").length
  }

  return {
    characters,
    charactersWithSpaces,
    words,
    sentences,
    syllables,
    longWords,
    averageWordsPerSentence: words === 0 ? 0 : words / sentences,
    averageSyllablesPerWord: words === 0 ? 0 : syllables / words,
    averageLetterCount: words === 0 ? 0 : letterTotal / words,
  }
}

/**
 * Estimate characters per line for a given column width and font size.
 * Uses a calibrated average glyph width of ~0.52em (a sane Inter-like estimate).
 */
export function charsPerLine(columnPx: number, fontSizePx: number, glyphEm = 0.52): number {
  if (fontSizePx <= 0) return 0
  return columnPx / (fontSizePx * glyphEm)
}

/**
 * Convert a CSS max-width string into px for line-length estimation.
 * Supports rem, px, ch, ' ch'. Returns null when conversion is impossible.
 */
export function maxWidthToPx(value: string, baseFontPx = 16): number | null {
  const m = value.trim().match(/^([\d.]+)\s*(rem|px|ch|em)?$/i)
  if (!m) return null
  const num = parseFloat(m[1])
  const unit = (m[2] ?? "px").toLowerCase()
  if (unit === "px") return num
  if (unit === "rem") return num * baseFontPx
  if (unit === "em") return num * baseFontPx
  if (unit === "ch") return num * baseFontPx * 0.52
  return null
}
