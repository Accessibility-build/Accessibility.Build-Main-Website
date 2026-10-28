import type { FocusResult, FocusStop, TargetsResult } from "@/lib/focus-order/types"

// Sentences the results view needs in more than one place: the status announcement, the
// screenshot's alt text and the summary. Kept pure so the wording can be checked without a browser.

export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`
}

export function stopHasFailure(stop: FocusStop): boolean {
  return stop.problems.some((problem) => problem.severity === "fail")
}

export function stopHasProblem(stop: FocusStop): boolean {
  return stop.problems.some((problem) => problem.severity !== "info")
}

export function focusHeadline(result: FocusResult): string {
  const { summary } = result
  const failing = result.stops.filter(stopHasFailure).length + (summary.trap ? 1 : 0)
  const parts = [`${plural(summary.stops, "focus stop")} checked`]
  if (failing === 0 && summary.positiveTabindex === 0) parts.push("no failures found")
  else {
    if (summary.noIndicator) parts.push(`${summary.noIndicator} without a visible focus indicator`)
    if (summary.obscured) parts.push(`${summary.obscured} hidden behind other content`)
    if (summary.invisible) parts.push(`${summary.invisible} on an invisible or off-screen element`)
    if (summary.trap) parts.push("a keyboard trap")
    if (summary.positiveTabindex) parts.push(`${plural(summary.positiveTabindex, "positive tabindex", "positive tabindex values")}`)
  }
  return `${parts.join(", ")}.`
}

export function targetsHeadline(result: TargetsResult): string {
  const { totals } = result
  if (totals.targets === 0) return "No visible pointer targets were found on this page."
  const parts = [`${plural(totals.targets, "target")} measured`, `${totals.undersized} under 24 by 24 pixels`]
  parts.push(totals.failing === 0 ? "none of them fail 2.5.8" : `${totals.failing} fail 2.5.8`)
  return `${parts.join(", ")}.`
}

export function focusAltText(result: FocusResult): string {
  const drawn = result.stops.filter((stop) => stop.marker).length
  const problems = result.stops.filter(stopHasProblem).length
  return (
    `Screenshot of ${result.title || "the page"} with ${plural(drawn, "numbered focus stop")} drawn in Tab order and joined by a line. ` +
    `${problems === 0 ? "None are marked as a problem" : `${plural(problems, "stop is", "stops are")} marked as a problem with a square badge and a dashed outline`}. ` +
    "The list of stops describes each one."
  )
}

export function targetsAltText(result: TargetsResult): string {
  const { totals } = result
  return (
    `Screenshot of ${result.title || "the page"} with undersized targets outlined: ` +
    `${plural(totals.failing, "failing target")} with a solid outline and square badge, ` +
    `${plural(totals.passBySpacing, "target")} that pass only by spacing with a dashed outline and round badge. ` +
    "The list of targets describes each one."
  )
}
