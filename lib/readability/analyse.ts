import { countSyllables } from "@/lib/typography/metrics"
import {
  LOWER_SECONDARY_GRADE,
  SMOG_SAMPLE_SENTENCES,
  fleschBand,
  readingAge,
  scoreText,
  sentenceGrade,
  type FleschBand,
  type ReadabilityScores,
  type ReadingAge,
  type TextCounts,
} from "./formulas"
import { normaliseText, segment, type Paragraph, type Sentence, type WordToken } from "./segment"
import { LONGEST_PHRASE, PLAIN_ALTERNATIVES } from "./word-list"

/**
 * The Readability Checker's analysis: scores for the whole text plus plain-language findings,
 * each tied to the exact passage so the page can highlight it and link to it.
 *
 * Every finding is a heuristic. Passive voice is spotted from "be" plus a past participle,
 * abbreviations from capital letters, adverbs from "-ly". The page says so next to each one.
 */

export const THRESHOLDS = {
  /** A sentence over this many words is very long. */
  longSentenceWords: 25,
  /** Sentence grades at or above these mark hard and very hard sentences. */
  hardSentenceGrade: 10,
  veryHardSentenceGrade: 14,
  /** Shorter sentences are not graded: one long word in a five-word sentence is not hard reading. */
  minWordsToGrade: 8,
  /** A paragraph over this many words is long. */
  longParagraphWords: 100,
  /** Below this many words the scores swing too much to rely on. */
  minWordsForScores: 100,
  /** Text longer than this is cut at a paragraph break. */
  maxCharacters: 60_000,
} as const

export type FindingKind =
  | "veryHardSentence"
  | "hardSentence"
  | "longSentence"
  | "longParagraph"
  | "passive"
  | "complexWord"
  | "abbreviation"
  | "adverb"

/** Findings that cover a whole sentence or paragraph rather than a few words. */
export const SENTENCE_KINDS: ReadonlySet<FindingKind> = new Set(["veryHardSentence", "hardSentence", "longSentence"])

export interface Finding {
  kind: FindingKind
  /** Element id of the highlighted passage: a sentence, a paragraph or a word-level mark. */
  anchor: string
  start: number
  end: number
  paragraph: number
  sentence: number | null
  /** The flagged words, or the start of the sentence or paragraph. */
  excerpt: string
  /** A plainer word for complex words. */
  suggestion?: string
  /** "32 words", "grade 15", "used 4 times" */
  detail?: string
}

export interface ReadabilityReport {
  /** The normalised text every offset refers to. */
  text: string
  paragraphs: Paragraph[]
  counts: TextCounts & { paragraphs: number }
  wordsPerSentence: number
  syllablesPerWord: number
  scores: ReadabilityScores
  fleschBand: FleschBand
  readingAge: ReadingAge
  /** Average grade above about lower secondary level (WCAG 3.1.5). */
  aboveLowerSecondary: boolean
  findings: Finding[]
  byKind: Record<FindingKind, Finding[]>
  /** Notes about reliability: short text, under 30 sentences, cut to length. */
  warnings: string[]
  truncated: boolean
}

export interface AnalyseOptions {
  /** Abbreviations the page already explains, for example with <abbr title>. */
  explainedAbbreviations?: Iterable<string>
}

const BE_FORMS = new Set([
  "am", "is", "are", "was", "were", "be", "been", "being",
  "isn't", "aren't", "wasn't", "weren't",
])

/** Words that can sit between "be" and the participle: "was not approved", "is often used". */
const BETWEEN = new Set([
  "not", "never", "also", "always", "often", "already", "just", "still", "now", "then", "being",
  "all", "both", "each", "ever", "further", "sometimes", "usually", "generally", "typically",
])

const IRREGULAR_PARTICIPLES = new Set(
  (
    "arisen awoken beaten become begun bent bet bid bitten bled blown born borne bought bound bred " +
    "brought broken built burnt burst cast caught chosen clung come cost crept cut dealt done drawn " +
    "dreamt driven drunk dug eaten fallen fed felt fled flown forbidden forecast forgiven forgotten " +
    "fought found frozen given gone ground grown hung heard held hidden hit hurt kept knelt known " +
    "laid led learnt left lent let lit lost made meant met mistaken overcome overtaken overthrown " +
    "paid proven put quit read rebuilt rid ridden risen run rung said sat seen sent set sewn shaken " +
    "shed shone shot shown shut slain slid sold sought sown spent spilt split spoken spread sprung " +
    "stolen struck stuck stung sunk sworn swept swum taken taught thrown thought told torn " +
    "understood undertaken undone upheld upset withdrawn withheld won worn wound woven written"
  ).split(" "),
)

/** Words ending in -ed that are not past participles. */
const ED_NOT_PARTICIPLE = new Set(
  (
    "bed bred breed creed deed embed exceed feed greed heed hundred indeed kindred naked need proceed " +
    "red reed sacred seed shed speed steed succeed wed weed wicked"
  ).split(" "),
)

/** Words ending in -ly that are not adverbs, or are adverbs plain writing needs anyway. */
const LY_NOT_ADVERB = new Set(
  (
    "ally anomaly apply assembly belly bully butterfly chilly comply costly curly daily deadly early " +
    "elderly family fly friendly holy homely hourly imply italy jolly july lily likely lively lonely " +
    "lovely monthly multiply oily only orderly ply quarterly rally rely reply silly sly supply tally " +
    "timely ugly unlikely weekly woolly worldly yearly"
  ).split(" "),
)

const ROMAN_NUMERALS = new Set("II III IV VI VII VIII IX XI XII XIII XIV XV XVI XVII XVIII XIX XX".split(" "))
const COMMON_CAPITALS = new Set(["OK"])

function lower(word: WordToken): string {
  return word.core.toLowerCase()
}

/** Gunning's complex word: three or more syllables once -es, -ed and -ing are set aside. */
function isComplexWord(word: WordToken, firstInSentence: boolean): boolean {
  const core = word.core
  if (core.includes("-")) return false // compound words
  if (/^[A-Z]/.test(core) && !firstInSentence) return false // proper nouns
  if (/^[A-Z0-9&]+$/.test(core)) return false // abbreviations
  let stem = core.toLowerCase()
  const suffix = stem.match(/(ing|ed|es)$/)?.[0]
  if (suffix && stem.length - suffix.length >= 3) stem = stem.slice(0, -suffix.length)
  return countSyllables(stem) >= 3
}

function isParticiple(word: string): boolean {
  if (IRREGULAR_PARTICIPLES.has(word)) return true
  return word.length >= 4 && word.endsWith("ed") && !ED_NOT_PARTICIPLE.has(word)
}

/** "[noun] was [adverb] approved": a form of "be", up to two fillers, then a past participle. */
function findPassives(sentence: Sentence): { start: number; end: number; excerpt: string }[] {
  const found: { start: number; end: number; excerpt: string }[] = []
  const { words } = sentence
  for (let i = 0; i < words.length; i += 1) {
    if (!BE_FORMS.has(lower(words[i])) || words[i].trailing) continue
    for (let j = i + 1; j < Math.min(words.length, i + 4); j += 1) {
      const word = lower(words[j])
      if (isParticiple(word)) {
        found.push({ start: words[i].start, end: words[j].end, excerpt: sentence.text.slice(words[i].start - sentence.start, words[j].end - sentence.start) })
        i = j
        break
      }
      const filler = BETWEEN.has(word) || (word.endsWith("ly") && word.length > 4)
      if (!filler || words[j].trailing) break
    }
  }
  return found
}

/** Wordy words and phrases from our list, longest match first, never across punctuation. */
function findComplexWords(sentence: Sentence): { start: number; end: number; excerpt: string; suggestion: string }[] {
  const found: { start: number; end: number; excerpt: string; suggestion: string }[] = []
  const { words } = sentence
  for (let i = 0; i < words.length; i += 1) {
    for (let length = Math.min(LONGEST_PHRASE, words.length - i); length >= 1; length -= 1) {
      const run = words.slice(i, i + length)
      if (run.slice(0, -1).some((word) => word.trailing)) continue
      const key = run.map(lower).join(" ")
      const suggestion = PLAIN_ALTERNATIVES.get(key)
      if (!suggestion) continue
      const start = run[0].start
      const end = run[run.length - 1].end
      found.push({ start, end, excerpt: sentence.text.slice(start - sentence.start, end - sentence.start), suggestion })
      i += length - 1
      break
    }
  }
  return found
}

function abbreviationOf(word: WordToken): string | null {
  const core = word.core
  const match = core.match(/^([A-Z][A-Z0-9&]*[A-Z0-9])s?$/)
  if (!match) return null
  const base = core.length > 2 && core.endsWith("s") && /[A-Z0-9]s$/.test(core) ? core.slice(0, -1) : core
  // Longer runs of capitals are almost always ordinary words set in capitals ("ENGLAND").
  if ((base.match(/[A-Z]/g) ?? []).length < 2 || base.length > 6) return null
  // Digits mean a code (SW1A, SE16, A4) rather than an abbreviation, except the B2B pattern.
  if (/\d/.test(base) && !/^[A-Z]2[A-Z]$/.test(base)) return null
  if (ROMAN_NUMERALS.has(base) || COMMON_CAPITALS.has(base)) return null
  return base
}

/** A sentence written in capitals (a shouty heading) is not full of abbreviations. */
function isAllCaps(sentence: Sentence): boolean {
  const capitalised = sentence.words.filter((word) => /^[A-Z0-9&'.-]+$/.test(word.core)).length
  return sentence.words.length >= 3 && capitalised / sentence.words.length >= 0.6
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function excerptOf(text: string, max = 80): string {
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const space = cut.lastIndexOf(" ")
  return `${cut.slice(0, space > 40 ? space : max).replace(/[,;:]$/, "")}...`
}

const PRIORITY: Record<FindingKind, number> = {
  veryHardSentence: 0,
  hardSentence: 0,
  longSentence: 0,
  longParagraph: 0,
  passive: 1,
  complexWord: 2,
  abbreviation: 3,
  adverb: 4,
}

/**
 * Word-level highlights may nest (a wordy word inside a passive phrase) but must not cross, or
 * the passage could not be marked up. When two cross, the higher-priority finding is kept.
 */
function dropCrossingMarks(marks: Finding[]): Finding[] {
  const kept: Finding[] = []
  for (const mark of [...marks].sort((a, b) => PRIORITY[a.kind] - PRIORITY[b.kind])) {
    const crosses = kept.some(
      (other) =>
        (mark.start < other.start && mark.end > other.start && mark.end < other.end) ||
        (mark.start > other.start && mark.start < other.end && mark.end > other.end) ||
        (mark.start === other.start && mark.end === other.end),
    )
    if (!crosses) kept.push(mark)
  }
  return kept.sort((a, b) => a.start - b.start || b.end - a.end)
}

export function analyseReadability(rawText: string, options: AnalyseOptions = {}): ReadabilityReport {
  let text = normaliseText(rawText)
  let truncated = false
  if (text.length > THRESHOLDS.maxCharacters) {
    const cut = text.lastIndexOf("\n", THRESHOLDS.maxCharacters)
    text = text.slice(0, cut > THRESHOLDS.maxCharacters / 2 ? cut : THRESHOLDS.maxCharacters).trim()
    truncated = true
  }

  const paragraphs = segment(text)
  const sentences = paragraphs.flatMap((paragraph) => paragraph.sentences)
  const counts: TextCounts & { paragraphs: number } = {
    words: 0,
    sentences: sentences.length,
    syllables: 0,
    letters: 0,
    characters: 0,
    polysyllables: 0,
    complexWords: 0,
    paragraphs: paragraphs.length,
  }

  const sentenceFindings: Finding[] = []
  const wordMarks: Finding[] = []
  const explained = new Set(options.explainedAbbreviations ?? [])
  const abbreviationUses = new Map<string, { first: WordToken; sentence: Sentence; uses: number }>()

  for (const sentence of sentences) {
    let syllables = 0
    sentence.words.forEach((word, position) => {
      syllables += word.syllables
      counts.letters += word.raw.replace(/[^a-zA-Z]/g, "").length
      counts.characters += word.core.replace(/[^a-zA-Z0-9]/g, "").length
      if (word.syllables >= 3) counts.polysyllables += 1
      if (isComplexWord(word, position === 0)) counts.complexWords += 1
    })
    counts.words += sentence.words.length
    counts.syllables += syllables

    const base = { paragraph: sentence.paragraph, sentence: sentence.index, start: sentence.start, end: sentence.end }
    const anchor = `rc-s-${sentence.index}`
    const wordCount = sentence.words.length
    if (wordCount > THRESHOLDS.longSentenceWords) {
      sentenceFindings.push({ ...base, kind: "longSentence", anchor, excerpt: excerptOf(sentence.text), detail: `${wordCount} words` })
    }
    // Headings, labels and list items have no full stop; grade them only when they run long.
    const isProse = /[.!?…]["'”’)\]]*$/.test(sentence.text) || wordCount >= 15
    if (wordCount >= THRESHOLDS.minWordsToGrade && isProse) {
      const grade = sentenceGrade(wordCount, syllables)
      const kind = grade >= THRESHOLDS.veryHardSentenceGrade ? "veryHardSentence" : grade >= THRESHOLDS.hardSentenceGrade ? "hardSentence" : null
      if (kind) sentenceFindings.push({ ...base, kind, anchor, excerpt: excerptOf(sentence.text), detail: `grade ${Math.round(grade)}` })
    }

    const wordBase = { paragraph: sentence.paragraph, sentence: sentence.index, anchor: "" }
    for (const passive of findPassives(sentence)) wordMarks.push({ ...wordBase, kind: "passive", ...passive })
    const complex = findComplexWords(sentence)
    for (const match of complex) wordMarks.push({ ...wordBase, kind: "complexWord", ...match })

    const caps = isAllCaps(sentence)
    sentence.words.forEach((word, position) => {
      const neighbours = [sentence.words[position - 1], sentence.words[position + 1]]
      // "MAINLAND ENGLAND": a run of capitalised words, not two abbreviations.
      const inCapsRun = word.core.length >= 4 && neighbours.some((other) => other && other.core.length >= 4 && /^[A-Z]+$/.test(other.core))
      const abbreviation = caps || inCapsRun ? null : abbreviationOf(word)
      if (abbreviation) {
        const seen = abbreviationUses.get(abbreviation)
        if (seen) seen.uses += 1
        else abbreviationUses.set(abbreviation, { first: word, sentence, uses: 1 })
        return
      }
      const lowered = lower(word)
      const isAdverb =
        lowered.length >= 5 &&
        lowered.endsWith("ly") &&
        !LY_NOT_ADVERB.has(lowered) &&
        !(position > 0 && /^[A-Z]/.test(word.core)) &&
        !complex.some((match) => word.start >= match.start && word.end <= match.end)
      if (isAdverb) {
        wordMarks.push({ ...wordBase, kind: "adverb", start: word.start, end: word.end, excerpt: word.core })
      }
    })
  }

  // An abbreviation counts as explained if it appears in brackets after its expansion,
  // "Web Content Accessibility Guidelines (WCAG)", or is followed by one, "WCAG (Web Content...)".
  for (const [abbreviation, { first, sentence, uses }] of abbreviationUses) {
    if (explained.has(abbreviation)) continue
    // A word that also appears in ordinary case ("England") is a word set in capitals.
    const occurrences = text.matchAll(new RegExp(`\\b${escapeRegExp(abbreviation)}\\b`, "gi"))
    if (abbreviation.length >= 4 && [...occurrences].some((match) => match[0] !== abbreviation)) continue
    const inBrackets = new RegExp(`\\(\\s*${escapeRegExp(abbreviation)}s?\\s*[),;]`).test(text)
    const followedByBrackets = /^\S*\s*\(/.test(text.slice(first.end))
    if (inBrackets || followedByBrackets) continue
    wordMarks.push({
      kind: "abbreviation",
      anchor: "",
      start: first.start,
      end: first.end,
      paragraph: sentence.paragraph,
      sentence: sentence.index,
      excerpt: first.core,
      detail: uses === 1 ? "used once" : `used ${uses} times`,
    })
  }

  const marks = dropCrossingMarks(wordMarks).map((mark, index) => ({ ...mark, anchor: `rc-w-${index}` }))

  const paragraphFindings: Finding[] = paragraphs
    .filter((paragraph) => paragraph.wordCount > THRESHOLDS.longParagraphWords)
    .map((paragraph) => ({
      kind: "longParagraph" as const,
      anchor: `rc-p-${paragraph.index}`,
      start: paragraph.start,
      end: paragraph.end,
      paragraph: paragraph.index,
      sentence: null,
      excerpt: excerptOf(paragraph.text),
      detail: `${paragraph.wordCount} words`,
    }))

  const findings = [...paragraphFindings, ...sentenceFindings, ...marks].sort((a, b) => a.start - b.start || b.end - a.end)
  const byKind = Object.fromEntries(
    (Object.keys(PRIORITY) as FindingKind[]).map((kind) => [kind, findings.filter((finding) => finding.kind === kind)]),
  ) as Record<FindingKind, Finding[]>

  const scores = scoreText(counts)
  const warnings: string[] = []
  if (truncated) warnings.push(`The text was longer than ${THRESHOLDS.maxCharacters.toLocaleString("en-GB")} characters, so only the first part was checked.`)
  if (counts.words > 0 && counts.words < THRESHOLDS.minWordsForScores) {
    warnings.push(`With fewer than ${THRESHOLDS.minWordsForScores} words the scores swing a lot from one sentence to the next. Treat them as a rough guide.`)
  }
  if (counts.sentences > 0 && counts.sentences < SMOG_SAMPLE_SENTENCES) {
    warnings.push(`SMOG was designed for samples of ${SMOG_SAMPLE_SENTENCES} sentences or more. This text has ${counts.sentences}, so its SMOG grade is scaled up and less reliable.`)
  }

  return {
    text,
    paragraphs,
    counts,
    wordsPerSentence: counts.sentences ? Math.round((counts.words / counts.sentences) * 10) / 10 : 0,
    syllablesPerWord: counts.words ? Math.round((counts.syllables / counts.words) * 100) / 100 : 0,
    scores,
    fleschBand: fleschBand(scores.fleschReadingEase),
    readingAge: readingAge(scores.averageGrade),
    aboveLowerSecondary: scores.averageGrade > LOWER_SECONDARY_GRADE,
    findings,
    byKind,
    warnings,
    truncated,
  }
}
