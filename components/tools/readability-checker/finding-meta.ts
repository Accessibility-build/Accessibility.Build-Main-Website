import { THRESHOLDS, type Finding, type FindingKind } from "@/lib/readability/analyse"

/**
 * How each kind of finding is named, explained and drawn. Every highlight has a distinct
 * underline or border style and a visible text badge, so none of them depends on colour, and a
 * screen reader label that says what the highlight means.
 */
export interface FindingMeta {
  /** Heading for the list of findings: "Very long sentences". */
  title: string
  /** Visible badge text in the passage: "Long". */
  badge: string
  /** What the finding means and what to do about it. */
  explanation: string
  /** Shown highlighted when results first appear. */
  defaultOn: boolean
  /** Classes for the highlighted element. */
  className: string
  /** The label a screen reader hears with the highlight. */
  srLabel: (finding: Finding) => string
}

export const FINDING_ORDER: FindingKind[] = [
  "veryHardSentence",
  "hardSentence",
  "longSentence",
  "longParagraph",
  "passive",
  "complexWord",
  "abbreviation",
  "adverb",
]

export const FINDING_META: Record<FindingKind, FindingMeta> = {
  veryHardSentence: {
    title: "Very hard sentences",
    badge: "Very hard",
    explanation: `Sentences of ${THRESHOLDS.minWordsToGrade} words or more that score grade ${THRESHOLDS.veryHardSentenceGrade} or above on their own. Split them, and swap long words for short ones.`,
    defaultOn: true,
    className: "bg-rose-100 dark:bg-rose-950/70",
    srLabel: (finding) => `Very hard sentence, ${finding.detail}`,
  },
  hardSentence: {
    title: "Hard sentences",
    badge: "Hard",
    explanation: `Sentences that score grade ${THRESHOLDS.hardSentenceGrade} to ${THRESHOLDS.veryHardSentenceGrade - 1} on their own, above lower secondary level. Shorten them or split them in two.`,
    defaultOn: true,
    className: "bg-amber-100 dark:bg-amber-950/70",
    srLabel: (finding) => `Hard sentence, ${finding.detail}`,
  },
  longSentence: {
    title: "Very long sentences",
    badge: "Long",
    explanation: `Sentences over ${THRESHOLDS.longSentenceWords} words. Readers lose track of long sentences, especially on a phone. Aim for one idea per sentence.`,
    defaultOn: true,
    className: "border-b-2 border-dashed border-slate-600 dark:border-slate-300",
    srLabel: (finding) => `Very long sentence, ${finding.detail}`,
  },
  longParagraph: {
    title: "Long paragraphs",
    badge: "Long paragraph",
    explanation: `Paragraphs over ${THRESHOLDS.longParagraphWords} words. Break them up, or turn a run of items into a list, so the page is easier to scan.`,
    defaultOn: true,
    className: "border-l-4 border-double border-slate-600 pl-3 dark:border-slate-300",
    srLabel: (finding) => `Long paragraph, ${finding.detail}`,
  },
  passive: {
    title: "Possible passive voice",
    badge: "Passive",
    explanation:
      "A form of \"be\" followed by a past participle, such as \"was approved\". Active sentences say who does what: \"we approved\". This is a pattern match, so some hits are adjectives (\"we are pleased\") and are fine.",
    defaultOn: true,
    className: "underline decoration-sky-700 decoration-2 underline-offset-[6px] dark:decoration-sky-300",
    srLabel: () => "possible passive voice",
  },
  complexWord: {
    title: "Wordy words and phrases",
    badge: "Simpler",
    explanation:
      "Words and phrases with a plainer alternative, from our own list. The alternative is a suggestion: check it means the same thing in your sentence.",
    defaultOn: true,
    className: "underline decoration-violet-700 decoration-dotted decoration-2 underline-offset-[3px] dark:decoration-violet-300",
    srLabel: (finding) => `wordy, simpler: ${finding.suggestion}`,
  },
  abbreviation: {
    title: "Unexplained abbreviations",
    badge: "Abbreviation",
    explanation:
      "Capitalised abbreviations with no expansion in brackets next to them, and no abbr title on the page. WCAG 3.1.4 (Level AAA) asks for a way to find out what each one means. Spell it out the first time you use it.",
    defaultOn: true,
    className: "underline decoration-teal-700 decoration-dashed decoration-2 underline-offset-[3px] dark:decoration-teal-300",
    srLabel: (finding) => `unexplained abbreviation, ${finding.detail}`,
  },
  adverb: {
    title: "Adverbs",
    badge: "Adverb",
    explanation:
      "Words ending in -ly. Often fine, sometimes padding: \"very quickly\" says little more than \"quickly\". A light hint only, so it starts switched off.",
    defaultOn: false,
    className: "underline decoration-slate-500 decoration-wavy decoration-1 underline-offset-[3px] dark:decoration-slate-400",
    srLabel: () => "adverb",
  },
}

export function badgeText(finding: Finding): string {
  return finding.kind === "complexWord" ? `simpler: ${finding.suggestion}` : FINDING_META[finding.kind].badge
}
