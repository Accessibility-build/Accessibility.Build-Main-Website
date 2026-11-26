import type { AuditFinding, CoverageEntry, FindingCategory, Impact } from "@/lib/url-audit/types"

// Labels and colours shared by the auditor's results view. Every colour pair here is at least
// 4.5:1 for its text in both themes; status is never shown by colour alone.

export const IMPACTS: Impact[] = ["critical", "serious", "moderate", "minor"]

export const IMPACT_META: Record<Impact, { label: string; chip: string; bar: string; dot: string; help: string }> = {
  critical: {
    label: "Critical",
    chip: "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/60 dark:text-red-200",
    bar: "bg-red-600 dark:bg-red-500",
    dot: "bg-red-600",
    help: "Blocks a task completely for some people.",
  },
  serious: {
    label: "Serious",
    chip: "border-orange-300 bg-orange-50 text-orange-900 dark:border-orange-800 dark:bg-orange-950/60 dark:text-orange-200",
    bar: "bg-orange-500 dark:bg-orange-400",
    dot: "bg-orange-500",
    help: "Makes a task very hard for some people.",
  },
  moderate: {
    label: "Moderate",
    chip: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200",
    bar: "bg-amber-400 dark:bg-amber-300",
    dot: "bg-amber-400",
    help: "Causes friction or confusion.",
  },
  minor: {
    label: "Minor",
    chip: "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-200",
    bar: "bg-sky-500 dark:bg-sky-400",
    dot: "bg-sky-500",
    help: "Polish; worth fixing alongside other work.",
  },
}

export const CATEGORY_LABEL: Record<FindingCategory, string> = {
  images: "Images",
  color: "Colour",
  forms: "Forms",
  keyboard: "Keyboard",
  navigation: "Links & navigation",
  structure: "Structure",
  aria: "ARIA & names",
  media: "Media & motion",
  layout: "Layout & zoom",
  language: "Language",
}

export const COVERAGE_META: Record<CoverageEntry["status"], { label: string; tile: string; symbol: string; legend: string }> = {
  fail: {
    label: "Fails",
    tile: "border-red-300 bg-red-50 text-red-900 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100 dark:hover:bg-red-950",
    symbol: "✕",
    legend: "A confirmed failure was found.",
  },
  review: {
    label: "Review",
    tile: "border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100 dark:hover:bg-amber-950",
    symbol: "?",
    legend: "Something to check by hand was found.",
  },
  tested: {
    label: "No issues found",
    tile: "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100",
    symbol: "✓",
    legend: "Automated checks ran and found nothing. Not the same as passing.",
  },
  manual: {
    label: "Manual",
    tile: "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
    symbol: "–",
    legend: "Needs a person: no automated check covers it.",
  },
}

export function scoreBand(score: number): { label: string; text: string; ring: string } {
  if (score >= 90) return { label: "Few automated issues", text: "text-emerald-700 dark:text-emerald-300", ring: "stroke-emerald-600 dark:stroke-emerald-400" }
  if (score >= 70) return { label: "Some barriers", text: "text-amber-700 dark:text-amber-300", ring: "stroke-amber-500 dark:stroke-amber-400" }
  if (score >= 40) return { label: "Significant barriers", text: "text-orange-700 dark:text-orange-300", ring: "stroke-orange-600 dark:stroke-orange-400" }
  return { label: "Severe barriers", text: "text-red-700 dark:text-red-300", ring: "stroke-red-600 dark:stroke-red-400" }
}

export const plural = (n: number, word: string, many = `${word}s`) => `${n.toLocaleString("en")} ${n === 1 ? word : many}`

export function sourceLabel(finding: Pick<AuditFinding, "source">): string {
  return finding.source === "axe-core" ? "axe-core" : "accessibility.build"
}

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}
