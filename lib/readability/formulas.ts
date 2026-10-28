import type { TextStats } from "@/lib/typography/metrics"
import { fleschKincaidGrade, fleschReadingEase, type ReadabilityResult } from "@/lib/typography/readability"

/**
 * The six readability formulas, each from its published definition. Flesch Reading Ease and
 * Flesch-Kincaid come from lib/typography/readability.ts; the other four are here.
 *
 * - Gunning Fog (Gunning, 1952): 0.4 x (words per sentence + 100 x complex words / words).
 *   Complex words have three or more syllables, not counting proper nouns, compound words, or the
 *   -es, -ed and -ing endings.
 * - SMOG (McLaughlin, 1969): 1.0430 x sqrt(polysyllables x 30 / sentences) + 3.1291. It was normed
 *   on 30-sentence samples, so shorter texts are scaled up to 30 and the result is less reliable.
 * - Coleman-Liau (Coleman and Liau, 1975): 0.0588 L - 0.296 S - 15.8, where L is letters per 100
 *   words and S is sentences per 100 words.
 * - Automated Readability Index (Smith and Senter, 1967): 4.71 x characters per word + 0.5 x
 *   words per sentence - 21.43, where characters are letters and digits.
 *
 * All four grade formulas give a US school grade. They are estimates from word and sentence
 * length; none of them knows whether the words are familiar to the reader.
 */

export interface TextCounts {
  words: number
  sentences: number
  syllables: number
  /** Letters A to Z inside words (Coleman-Liau). */
  letters: number
  /** Letters and digits inside words (ARI). */
  characters: number
  /** Words of three or more syllables (SMOG). */
  polysyllables: number
  /** Gunning's complex words (Gunning Fog). */
  complexWords: number
}

export interface ReadabilityScores {
  fleschReadingEase: number
  fleschKincaidGrade: number
  gunningFog: number
  smog: number
  colemanLiau: number
  automatedReadabilityIndex: number
  /** Mean of the five grade formulas, each floored at zero. */
  averageGrade: number
}

export type FleschBand = ReadabilityResult["readingLevel"]

/** WCAG 3.1.5's "lower secondary education level", taken as about nine years of school. */
export const LOWER_SECONDARY_GRADE = 9
/** SMOG was normed on samples of this many sentences. */
export const SMOG_SAMPLE_SENTENCES = 30

function toTextStats(counts: TextCounts): TextStats {
  const { words, sentences } = counts
  return {
    characters: counts.characters,
    charactersWithSpaces: counts.characters,
    words,
    sentences,
    syllables: counts.syllables,
    longWords: counts.polysyllables,
    averageWordsPerSentence: sentences === 0 ? 0 : words / sentences,
    averageSyllablesPerWord: words === 0 ? 0 : counts.syllables / words,
    averageLetterCount: words === 0 ? 0 : counts.letters / words,
  }
}

export function gunningFog({ words, sentences, complexWords }: TextCounts): number {
  if (words === 0 || sentences === 0) return 0
  return 0.4 * (words / sentences + (100 * complexWords) / words)
}

export function smogGrade({ sentences, polysyllables }: TextCounts): number {
  if (sentences === 0) return 0
  return 1.043 * Math.sqrt((polysyllables * SMOG_SAMPLE_SENTENCES) / sentences) + 3.1291
}

export function colemanLiauIndex({ words, sentences, letters }: TextCounts): number {
  if (words === 0) return 0
  const lettersPer100 = (letters / words) * 100
  const sentencesPer100 = (sentences / words) * 100
  return 0.0588 * lettersPer100 - 0.296 * sentencesPer100 - 15.8
}

export function automatedReadabilityIndex({ words, sentences, characters }: TextCounts): number {
  if (words === 0 || sentences === 0) return 0
  return 4.71 * (characters / words) + 0.5 * (words / sentences) - 21.43
}

const round1 = (value: number) => Math.round(value * 10) / 10

export function scoreText(counts: TextCounts): ReadabilityScores {
  const stats = toTextStats(counts)
  const grades = {
    fleschKincaidGrade: fleschKincaidGrade(stats),
    gunningFog: gunningFog(counts),
    smog: smogGrade(counts),
    colemanLiau: colemanLiauIndex(counts),
    automatedReadabilityIndex: automatedReadabilityIndex(counts),
  }
  const values = Object.values(grades)
  const average = values.reduce((sum, grade) => sum + Math.max(0, grade), 0) / values.length
  return {
    fleschReadingEase: round1(fleschReadingEase(stats)),
    fleschKincaidGrade: round1(grades.fleschKincaidGrade),
    gunningFog: round1(grades.gunningFog),
    smog: round1(grades.smog),
    colemanLiau: round1(grades.colemanLiau),
    automatedReadabilityIndex: round1(grades.automatedReadabilityIndex),
    averageGrade: round1(average),
  }
}

/** Flesch's own bands for Reading Ease, with the same names lib/typography uses. */
export function fleschBand(score: number): FleschBand {
  if (score >= 90) return "Very easy"
  if (score >= 80) return "Easy"
  if (score >= 70) return "Fairly easy"
  if (score >= 60) return "Standard"
  if (score >= 50) return "Fairly difficult"
  if (score >= 30) return "Difficult"
  return "Very difficult"
}

export interface ReadingAge {
  /** "13 to 14", "18 or over" */
  label: string
  /** US grade the age is based on, rounded. */
  grade: number
}

/**
 * The age at which a typical reader has finished that many years of school. A US grade is
 * roughly the age minus five or six: grade 8 readers are 13 to 14.
 */
export function readingAge(grade: number): ReadingAge {
  const rounded = Math.round(Math.max(0, grade))
  if (rounded < 1) return { label: "6 or under", grade: rounded }
  if (rounded >= 13) return { label: "18 or over (university level)", grade: rounded }
  return { label: `${rounded + 5} to ${rounded + 6}`, grade: rounded }
}

/** The Flesch-Kincaid grade of one sentence, used to flag hard and very hard sentences. */
export function sentenceGrade(words: number, syllables: number): number {
  return fleschKincaidGrade(
    toTextStats({ words, sentences: 1, syllables, letters: 0, characters: 0, polysyllables: 0, complexWords: 0 }),
  )
}
