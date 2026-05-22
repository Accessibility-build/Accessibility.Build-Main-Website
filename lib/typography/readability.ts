/**
 * Readability scoring: Flesch Reading Ease + Flesch-Kincaid Grade Level.
 * Pairs with metrics.ts (which already counts words / sentences / syllables).
 */

import { analyzeText, type TextStats } from "./metrics"

export interface ReadabilityResult extends TextStats {
  fleschReadingEase: number // 0-100ish, higher = easier
  fleschKincaidGrade: number // US school grade
  readingLevel:
    | "Very easy" // 90-100, 5th grade
    | "Easy" // 80-89
    | "Fairly easy" // 70-79
    | "Standard" // 60-69, ~8-9th grade
    | "Fairly difficult" // 50-59
    | "Difficult" // 30-49
    | "Very difficult" // 0-29
  recommendation: string
}

/** Flesch Reading Ease (US, 1948). 60+ is recommended for general audiences. */
export function fleschReadingEase(stats: TextStats): number {
  if (stats.words === 0 || stats.sentences === 0) return 0
  return (
    206.835 -
    1.015 * (stats.words / stats.sentences) -
    84.6 * (stats.syllables / stats.words)
  )
}

/** Flesch-Kincaid Grade Level (US, 1975). Returns approximate school grade. */
export function fleschKincaidGrade(stats: TextStats): number {
  if (stats.words === 0 || stats.sentences === 0) return 0
  return (
    0.39 * (stats.words / stats.sentences) +
    11.8 * (stats.syllables / stats.words) -
    15.59
  )
}

function levelForScore(score: number): ReadabilityResult["readingLevel"] {
  if (score >= 90) return "Very easy"
  if (score >= 80) return "Easy"
  if (score >= 70) return "Fairly easy"
  if (score >= 60) return "Standard"
  if (score >= 50) return "Fairly difficult"
  if (score >= 30) return "Difficult"
  return "Very difficult"
}

function recommendationFor(stats: TextStats, fre: number): string {
  const tips: string[] = []
  if (fre < 60) tips.push("Aim for Flesch Reading Ease ≥ 60 for general audiences.")
  if (stats.averageWordsPerSentence > 22)
    tips.push("Shorten sentences — aim for ≤ 20 words on average.")
  if (stats.averageSyllablesPerWord > 1.7)
    tips.push("Prefer shorter, more common words where possible.")
  if (stats.longWords / Math.max(1, stats.words) > 0.18)
    tips.push("More than 18% of words have 3+ syllables — replace where you can.")
  if (tips.length === 0) tips.push("Reads comfortably for most audiences.")
  return tips.join(" ")
}

export function analyzeReadability(text: string): ReadabilityResult {
  const stats = analyzeText(text)
  const fre = fleschReadingEase(stats)
  const grade = fleschKincaidGrade(stats)
  return {
    ...stats,
    fleschReadingEase: Math.round(fre * 10) / 10,
    fleschKincaidGrade: Math.round(grade * 10) / 10,
    readingLevel: levelForScore(fre),
    recommendation: recommendationFor(stats, fre),
  }
}
