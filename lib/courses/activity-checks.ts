import type { ActivityState, CourseActivity, LabCheckResult } from "./activity-types"

export function initialActivityState(activity: CourseActivity, saved?: ActivityState): ActivityState {
  if (saved?.version === activity.version) return saved
  return { version: activity.version, answers: {}, checked: [], reflection: "", criteria: [], manual: [], ...(activity.starterCode ? { code: activity.starterCode } : {}) }
}

/** The parser is supplied by the caller so this is testable without opening a browser. */
export function checkActivityCode(activity: CourseActivity, code: string, parse: (html: string) => Document): LabCheckResult[] {
  const document = parse(code)
  return (activity.checks ?? []).map((check) => {
    let passed = false
    try {
      if (check.pattern) passed = new RegExp(check.pattern, "im").test(code)
      else if (check.selector) {
        const nodes = Array.from(document.querySelectorAll(check.selector))
        passed = nodes.length >= (check.minCount ?? 1) && (check.maxCount === undefined || nodes.length <= check.maxCount)
        if (passed && check.attribute) passed = nodes.every((node) => check.equals === undefined ? node.hasAttribute(check.attribute!) : node.getAttribute(check.attribute!) === check.equals)
        if (passed && check.textIncludes) passed = nodes.every((node) => (node.textContent ?? "").toLowerCase().includes(check.textIncludes!.toLowerCase()))
      }
    } catch { passed = false }
    return { id: check.id, label: check.label, passed }
  })
}

export function activityCompletionIssues(activity: CourseActivity, state: ActivityState, checks: LabCheckResult[]): string[] {
  const issues: string[] = []
  if (state.version !== activity.version) issues.push("Restart this activity for the current edition.")
  if (activity.steps.some((step) => !state.checked.includes(step.id) || state.answers[step.id] !== step.answer)) issues.push("Review each decision and check a correct answer.")
  if (activity.checks?.length && (!state.checked.includes("code") || checks.length !== activity.checks.length || checks.some((check) => !check.passed))) issues.push("Run the code checks and address the remaining findings.")
  if ((activity.manualChecks ?? []).some((_, index) => !state.manual.includes(String(index)))) issues.push("Complete the manual verification checklist.")
  if (state.reflection.trim().length < 40) issues.push("Write a short explanation of your decision and evidence (at least 40 characters).")
  if (activity.reflection.criteria.some((_, index) => !state.criteria.includes(String(index)))) issues.push("Compare your explanation with every self-assessment criterion.")
  if (!state.checked.includes("transfer") || Number(state.transfer) !== activity.transfer.answer) issues.push("Check your answer to the new situation.")
  if (!state.confidence) issues.push("Record how confident you feel about applying this skill.")
  return issues
}

/** A static, isolated rendering: no script execution, navigation, forms or external resources. */
export function activityPreview(code: string, parse: (html: string) => Document): string {
  const document = parse(code)
  document.querySelectorAll("script,iframe,object,embed,link,meta,base,svg,math").forEach((node) => node.remove())
  document.querySelectorAll("*").forEach((node) => {
    for (const attribute of Array.from(node.attributes)) {
      if (/^on/i.test(attribute.name) || ["src", "srcset", "href", "action", "formaction", "autofocus", "srcdoc", "contenteditable"].includes(attribute.name.toLowerCase())) node.removeAttribute(attribute.name)
    }
  })
  const styles = Array.from(document.querySelectorAll("style")).map((node) => node.outerHTML).join("")
  document.querySelectorAll("style").forEach((node) => node.remove())
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; form-action \'none\'; base-uri \'none\'"><style>body{font:16px/1.5 system-ui,sans-serif;color:#18252e;background:white;padding:20px}input,button,select,textarea{font:inherit}button,input,select{min-height:32px}label{display:block}*:focus-visible{outline:3px solid #164e83;outline-offset:3px}</style>' + styles + '</head><body>' + document.body.innerHTML + "</body></html>"
}

export function activityPortfolio(activity: CourseActivity, state: ActivityState): string {
  return [activity.title, `Activity ${activity.id} · version ${activity.version}`, `Recorded: ${state.completedAt ?? "In progress"}`, "", activity.brief, "", ...activity.steps.flatMap((step) => [step.prompt, step.options.find((option) => option.id === state.answers[step.id])?.text ?? "Not answered", ""]), "My explanation", state.reflection, "", "Manual checks (learner attestation)", ...(activity.manualChecks ?? []).map((text, index) => `${state.manual.includes(String(index)) ? "[x]" : "[ ]"} ${text}`), "", "Self-assessment", ...activity.reflection.criteria.map((text, index) => `${state.criteria.includes(String(index)) ? "[x]" : "[ ]"} ${text}`), "", "Applying this to a new situation", activity.transfer.prompt, state.transfer === undefined ? "Not answered" : activity.transfer.options[Number(state.transfer)]?.text ?? "Not answered", "", `Confidence: ${state.confidence ?? "Not recorded"}`, "", ...(state.code ? ["My code", state.code, ""] : []), "Sources", ...activity.sources.map((source) => `${source.title}: ${source.url}`), "", "This is a course practice record. Checklist completion is self-assessed, not independent accessibility certification."].join("\n")
}
