import { wcagCriteria, type SuccessCriterion } from "./wcag-data"

// Single source of truth for which WCAG success criteria have a guide page at
// /wcag/<slug>. The hub, interactive checklist, sitemap, and criterion
// cross-links all derive from this module — update here when pages are added.
//
// All 86 WCAG 2.2 criteria have guide pages.

export function wcagSlug(number: string): string {
  return number.replace(/\./g, "-")
}

export function wcagPath(number: string): string {
  return `/wcag/${wcagSlug(number)}`
}

export const builtWcagNumbers: string[] = wcagCriteria.map((c) => c.number)

export function isWcagPageBuilt(number: string): boolean {
  return builtWcagNumbers.includes(number)
}

export function getCriterion(number: string): SuccessCriterion | undefined {
  return wcagCriteria.find((c) => c.number === number)
}

/** Previous/next criterion in spec order, for sequential navigation. */
export function getAdjacentCriteria(number: string): {
  prev: SuccessCriterion | null
  next: SuccessCriterion | null
} {
  const idx = wcagCriteria.findIndex((c) => c.number === number)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? wcagCriteria[idx - 1] : null,
    next: idx < wcagCriteria.length - 1 ? wcagCriteria[idx + 1] : null,
  }
}

/** Related criteria: same guideline first, then same principle, capped. */
export function getRelatedCriteria(number: string, max = 5): SuccessCriterion[] {
  const current = getCriterion(number)
  if (!current) return []
  const sameGuideline = wcagCriteria.filter(
    (c) => c.number !== number && c.guideline === current.guideline
  )
  const samePrinciple = wcagCriteria.filter(
    (c) =>
      c.number !== number &&
      c.guideline !== current.guideline &&
      c.principle === current.principle
  )
  return [...sameGuideline, ...samePrinciple].slice(0, max)
}
