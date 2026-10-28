import { ALL_PROOF_POINTS, DIMENSIONS, LEVELS, LEVEL_NAME, type Dimension, type MaturityLevel, type ProofPoint } from "./model"

/**
 * Self-assessment logic for the W3C Accessibility Maturity Model: what a stored assessment may
 * contain, and the per-dimension summary the results page shows.
 *
 * The Note has no numeric score. An evaluator decides which level a dimension's evidence
 * supports, levels build on each other, and proof points must be fully complete for Optimize.
 * Our summary follows that: a dimension sits at the level that at least half of its rated proof
 * points have reached (the lower median), and it only reaches Optimize when every rated proof
 * point is at Optimize. "Not sure" and "does not apply" answers are left out of the summary and
 * counted separately. This rule is ours, and the page says so.
 */

export type Rating = MaturityLevel | "unsure" | "na"

export const RATING_OPTIONS: { value: Rating; label: string }[] = [
  ...LEVELS.map((level) => ({ value: level.id as Rating, label: level.name })),
  { value: "unsure", label: "Not sure" },
  { value: "na", label: "Does not apply" },
]

export const RATING_LABEL: Record<Rating, string> = Object.fromEntries(
  RATING_OPTIONS.map((option) => [option.value, option.label]),
) as Record<Rating, string>

export interface AssessmentState {
  ratings: Record<string, Rating>
  notes: Record<string, string>
  /** Optional name for the exports. */
  organisation: string
  /** ISO time of the last change. */
  updatedAt: string | null
}

export const EMPTY_ASSESSMENT: AssessmentState = { ratings: {}, notes: {}, organisation: "", updatedAt: null }

export const NOTE_MAX_LENGTH = 2000

const PROOF_POINT_IDS = new Set(ALL_PROOF_POINTS.map((point) => point.id))
const RATINGS = new Set<string>(RATING_OPTIONS.map((option) => option.value))
const LEVEL_INDEX: Record<MaturityLevel, number> = { inactive: 0, launch: 1, integrate: 2, optimize: 3 }
const LEVEL_ORDER: MaturityLevel[] = ["inactive", "launch", "integrate", "optimize"]

/** Keeps only known proof points, known ratings and strings, so a stale or edited store can't break the page. */
export function sanitiseAssessment(value: unknown): AssessmentState {
  if (!value || typeof value !== "object") return EMPTY_ASSESSMENT
  const raw = value as Record<string, unknown>
  const ratings: Record<string, Rating> = {}
  const notes: Record<string, string> = {}
  if (raw.ratings && typeof raw.ratings === "object") {
    for (const [id, rating] of Object.entries(raw.ratings as Record<string, unknown>)) {
      if (PROOF_POINT_IDS.has(id) && typeof rating === "string" && RATINGS.has(rating)) ratings[id] = rating as Rating
    }
  }
  if (raw.notes && typeof raw.notes === "object") {
    for (const [id, note] of Object.entries(raw.notes as Record<string, unknown>)) {
      if (PROOF_POINT_IDS.has(id) && typeof note === "string" && note) notes[id] = note.slice(0, NOTE_MAX_LENGTH)
    }
  }
  return {
    ratings,
    notes,
    organisation: typeof raw.organisation === "string" ? raw.organisation.slice(0, 200) : "",
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : null,
  }
}

export interface DimensionSummary {
  dimension: Dimension
  total: number
  /** Proof points rated on one of the four levels. */
  rated: number
  unsure: number
  notApplicable: number
  unanswered: number
  counts: Record<MaturityLevel, number>
  /** Our summary level, or null when nothing is rated. */
  level: MaturityLevel | null
  /** Fewer than half of the applicable proof points have a level, so the summary rests on little evidence. */
  provisional: boolean
  /** The next level up, for next steps. */
  nextLevel: MaturityLevel | null
  /** Up to three proof points with the lowest rating, to start with. */
  lowest: ProofPoint[]
  /** Mean level index of the rated proof points, used only to order equal summaries. */
  mean: number
}

export function proofPointsOf(dimension: Dimension): ProofPoint[] {
  return dimension.groups.flatMap((group) => group.proofPoints)
}

export function summariseDimension(dimension: Dimension, state: AssessmentState): DimensionSummary {
  const points = proofPointsOf(dimension)
  const counts: Record<MaturityLevel, number> = { inactive: 0, launch: 0, integrate: 0, optimize: 0 }
  const rated: { point: ProofPoint; level: MaturityLevel }[] = []
  let unsure = 0
  let notApplicable = 0
  for (const point of points) {
    const rating = state.ratings[point.id]
    if (rating === "unsure") unsure += 1
    else if (rating === "na") notApplicable += 1
    else if (rating) {
      counts[rating] += 1
      rated.push({ point, level: rating })
    }
  }

  let level: MaturityLevel | null = null
  if (rated.length > 0) {
    const sorted = rated.map((entry) => LEVEL_INDEX[entry.level]).sort((a, b) => a - b)
    const median = sorted[Math.floor((sorted.length - 1) / 2)]
    const allOptimize = sorted[0] === LEVEL_INDEX.optimize
    level = LEVEL_ORDER[median === LEVEL_INDEX.optimize && !allOptimize ? LEVEL_INDEX.integrate : median]
  }

  const applicable = points.length - notApplicable
  const lowestIndex = rated.length ? Math.min(...rated.map((entry) => LEVEL_INDEX[entry.level])) : null
  return {
    dimension,
    total: points.length,
    rated: rated.length,
    unsure,
    notApplicable,
    unanswered: points.length - rated.length - unsure - notApplicable,
    counts,
    level,
    provisional: level !== null && rated.length * 2 < applicable,
    nextLevel: level && level !== "optimize" ? LEVEL_ORDER[LEVEL_INDEX[level] + 1] : null,
    lowest:
      lowestIndex === null || lowestIndex === LEVEL_INDEX.optimize
        ? []
        : rated.filter((entry) => LEVEL_INDEX[entry.level] === lowestIndex).slice(0, 3).map((entry) => entry.point),
    mean: rated.length ? rated.reduce((sum, entry) => sum + LEVEL_INDEX[entry.level], 0) / rated.length : 0,
  }
}

export interface AssessmentSummary {
  dimensions: DimensionSummary[]
  /** Up to three dimensions with the lowest summary below Optimize, lowest first. */
  weakest: DimensionSummary[]
  answered: number
  total: number
  /** Some dimension sits at Inactive or Launch. */
  earlyStage: boolean
}

export function summariseAssessment(state: AssessmentState): AssessmentSummary {
  const dimensions = DIMENSIONS.map((dimension) => summariseDimension(dimension, state))
  const weakest = dimensions
    .filter((summary) => summary.level !== null && summary.level !== "optimize")
    .sort(
      (a, b) =>
        LEVEL_INDEX[a.level as MaturityLevel] - LEVEL_INDEX[b.level as MaturityLevel] ||
        a.mean - b.mean ||
        DIMENSIONS.indexOf(a.dimension) - DIMENSIONS.indexOf(b.dimension),
    )
    .slice(0, 3)
  return {
    dimensions,
    weakest,
    answered: Object.keys(state.ratings).length,
    total: ALL_PROOF_POINTS.length,
    earlyStage: dimensions.some((summary) => summary.level === "inactive" || summary.level === "launch"),
  }
}

/** Level position from 1 (Inactive) to 4 (Optimize), for the chart; 0 when there is no summary. */
export function levelPosition(level: MaturityLevel | null): number {
  return level === null ? 0 : LEVEL_INDEX[level] + 1
}

export function summaryLabel(summary: DimensionSummary): string {
  if (!summary.level) return "Not enough answers"
  return `${LEVEL_NAME[summary.level]}${summary.provisional ? " (provisional)" : ""}`
}

/** One row per proof point, for the Excel and PDF exports. */
export function proofPointRows(state: AssessmentState): string[][] {
  return DIMENSIONS.flatMap((dimension) =>
    dimension.groups.flatMap((group) =>
      group.proofPoints.map((point) => [
        dimension.name,
        `${group.section} ${group.title}`,
        point.text,
        state.ratings[point.id] ? RATING_LABEL[state.ratings[point.id]] : "Not answered",
        state.notes[point.id] ?? "",
      ]),
    ),
  )
}

/** One row per dimension: name, section, our summary and the spread of answers. */
export function dimensionRows(summary: AssessmentSummary): string[][] {
  return summary.dimensions.map((entry) => [
    entry.dimension.name,
    entry.dimension.section,
    summaryLabel(entry),
    ...LEVEL_ORDER.map((level) => String(entry.counts[level])),
    String(entry.unsure),
    String(entry.notApplicable),
    String(entry.unanswered),
  ])
}

export const DIMENSION_ROW_HEADER = [
  "Dimension",
  "Section",
  "Our summary",
  ...LEVELS.map((level) => level.name),
  "Not sure",
  "Does not apply",
  "Not answered",
]
