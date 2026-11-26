import { randomUUID } from "node:crypto"
import type { AxeResults, Result as AxeResult } from "axe-core"
import { wcagCriteria } from "@/lib/wcag-data"
import type { FocusRun } from "@/lib/focus-order/focus-run"
import { CUSTOM_RULES, scHelpUrl } from "@/lib/url-audit/rules"
import type { RawCheck, RawCheckNode, RawPageFacts } from "@/lib/url-audit/page-checks"
import type { AuditFinding, CoverageEntry, FindingCategory, FindingNode, Impact, ManualCheck, Outcome } from "@/lib/url-audit/types"

/** Elements listed per finding. The count still covers every element. */
export const MAX_NODES_PER_FINDING = 15

/** axe rules the auditor turns on although axe ships them as experimental. Their failures are reported for review. */
export const EXPERIMENTAL_AXE_RULES = ["css-orientation-lock", "label-content-name-mismatch", "p-as-heading", "table-fake-caption", "td-has-header"]

const IMPACT_ORDER: Record<Impact, number> = { critical: 0, serious: 1, moderate: 2, minor: 3 }

const SC_BY_NUMBER = new Map(wcagCriteria.map((criterion) => [criterion.number, criterion]))

/** "wcag1410" -> "1.4.10". Level tags such as "wcag2aa" are not criteria and return null. */
export function scFromTag(tag: string): string | null {
  const match = tag.match(/^wcag(\d)(\d)(\d{1,2})$/)
  return match ? `${match[1]}.${match[2]}.${match[3]}` : null
}

function levelFor(wcag: string[], tags: string[] = []): AuditFinding["wcagLevel"] {
  const levels = wcag.map((sc) => SC_BY_NUMBER.get(sc)?.level).filter(Boolean) as ("A" | "AA" | "AAA")[]
  if (levels.includes("A")) return "A"
  if (levels.includes("AA")) return "AA"
  if (levels.includes("AAA")) return "AAA"
  if (tags.some((tag) => /^wcag2\d?aaa$/.test(tag))) return "AAA"
  if (tags.some((tag) => /^wcag2\d?aa$/.test(tag))) return "AA"
  if (tags.some((tag) => /^wcag2\d?a$/.test(tag))) return "A"
  return "Best practice"
}

const AXE_CATEGORY: Record<string, FindingCategory> = {
  "cat.text-alternatives": "images",
  "cat.color": "color",
  "cat.forms": "forms",
  "cat.keyboard": "keyboard",
  "cat.language": "language",
  "cat.aria": "aria",
  "cat.name-role-value": "aria",
  "cat.time-and-media": "media",
  "cat.sensory-and-visual-cues": "layout",
  "cat.tables": "structure",
  "cat.structure": "structure",
  "cat.semantics": "structure",
  "cat.parsing": "structure",
}

function axeCategory(rule: AxeResult): FindingCategory {
  if (/^(link-|bypass|skip-link|document-title|frame-title|identical-links)/.test(rule.id)) return "navigation"
  if (/^(meta-viewport|target-size|css-orientation)/.test(rule.id)) return "layout"
  for (const tag of rule.tags) if (AXE_CATEGORY[tag]) return AXE_CATEGORY[tag]
  return "structure"
}

/** axe's failure summary for one element as one line. axe lists why each check failed; for "any" checks, passing one is enough. */
function cleanSummary(summary: string | undefined): string | undefined {
  if (!summary) return undefined
  const parts: string[] = []
  for (const block of summary.split(/\n\s*\n/)) {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean)
    if (lines.length === 0) continue
    const heading = lines[0].match(/^Fix (any|all) of the following:?$/i)
    const items = (heading ? lines.slice(1) : lines).map((line) => line.replace(/\.$/, ""))
    if (items.length === 0) continue
    if (heading && items.length > 1) parts.push(`${heading[1].toLowerCase() === "any" ? "Why it fails (fixing any one is enough)" : "Why it fails"}: ${items.join("; ")}.`)
    else parts.push(`${items.join("; ")}.`)
  }
  const text = parts.join(" ")
  return text ? (text.length > 320 ? `${text.slice(0, 317)}…` : text) : undefined
}

function trimHtml(html: string): string {
  if (html.length <= 300) return html
  const open = html.match(/^<[^>]{0,400}>/)?.[0] ?? html.slice(0, 260)
  return `${open.slice(0, 400)}…`
}

function axeNodes(rule: AxeResult): FindingNode[] {
  return rule.nodes.slice(0, MAX_NODES_PER_FINDING).map((node) => ({
    selector: node.target.map((part) => (Array.isArray(part) ? part.join(" >>> ") : String(part))).join(" >>> "),
    html: trimHtml(node.html || ""),
    note: cleanSummary(node.failureSummary),
  }))
}

function fromAxe(rule: AxeResult, outcome: Outcome): AuditFinding {
  const wcag = Array.from(new Set(rule.tags.map(scFromTag).filter((sc): sc is string => !!sc)))
  const experimental = rule.tags.includes("experimental")
  return {
    id: randomUUID(),
    ruleId: rule.id,
    source: "axe-core",
    outcome: experimental ? "review" : outcome,
    title: rule.help,
    description: rule.description,
    impact: (rule.impact as Impact) || "moderate",
    category: axeCategory(rule),
    wcag,
    wcagLevel: levelFor(wcag, rule.tags),
    helpUrl: rule.helpUrl,
    fix: rule.help,
    nodes: axeNodes(rule),
    nodeCount: rule.nodes.length,
  }
}

export function custom(ruleId: string, nodes: RawCheckNode[], count: number, overrides: Partial<Pick<AuditFinding, "outcome" | "impact" | "description">> = {}): AuditFinding {
  const rule = CUSTOM_RULES[ruleId]
  if (!rule) throw new Error(`Unknown audit rule ${ruleId}`)
  return {
    id: randomUUID(),
    ruleId,
    source: "accessibility.build",
    outcome: overrides.outcome ?? rule.outcome,
    title: rule.title,
    description: overrides.description ?? rule.description,
    impact: overrides.impact ?? rule.impact,
    category: rule.category,
    wcag: rule.wcag,
    wcagLevel: rule.level,
    helpUrl: scHelpUrl(rule.wcag[0]),
    fix: rule.fix,
    nodes: nodes.slice(0, MAX_NODES_PER_FINDING).map((node) => ({ ...node, html: trimHtml(node.html) })),
    nodeCount: Math.max(count, nodes.length),
  }
}

/**
 * Every confirmed axe violation and every axe "needs review" result. An experimental rule's
 * failures are reported for review, so the same rule can arrive twice as review (failed nodes and
 * undecided nodes); those are merged into one finding.
 */
export function axeFindings(results: AxeResults): AuditFinding[] {
  const all = [...results.violations.map((rule) => fromAxe(rule, "violation")), ...results.incomplete.filter((rule) => rule.nodes.length > 0).map((rule) => fromAxe(rule, "review"))]
  const merged = new Map<string, AuditFinding>()
  for (const finding of all) {
    const key = `${finding.ruleId}:${finding.outcome}`
    const existing = merged.get(key)
    if (!existing) {
      merged.set(key, finding)
      continue
    }
    existing.nodes = [...existing.nodes, ...finding.nodes].slice(0, MAX_NODES_PER_FINDING)
    existing.nodeCount += finding.nodeCount
    if (IMPACT_ORDER[finding.impact] < IMPACT_ORDER[existing.impact]) existing.impact = finding.impact
  }
  return Array.from(merged.values())
}

export function domFindings(checks: RawCheck[]): AuditFinding[] {
  return checks.filter((check) => CUSTOM_RULES[check.id] && check.count > 0).map((check) => custom(check.id, check.nodes, check.count))
}

const GENERIC_TITLE = /^(home|home page|homepage|index|untitled|untitled document|page|new page|welcome|document|default|test|my site|website)$/i

export function titleFinding(title: string, hostname: string): AuditFinding | null {
  const trimmed = title.trim()
  if (!trimmed) return null // axe's document-title rule reports a missing title.
  const bareHost = hostname.replace(/^www\./, "").toLowerCase()
  if (GENERIC_TITLE.test(trimmed) || trimmed.toLowerCase() === bareHost || trimmed.toLowerCase() === hostname.toLowerCase()) {
    return custom("ab-title-generic", [{ selector: "head > title", html: `<title>${trimmed.slice(0, 120)}</title>` }], 1)
  }
  return null
}

/** Turns the keyboard pass (lib/focus-order) into findings, grouped by problem. */
export function keyboardFindings(run: FocusRun): AuditFinding[] {
  const groups = new Map<string, { nodes: RawCheckNode[]; count: number }>()
  const push = (ruleId: string, node: RawCheckNode) => {
    const group = groups.get(ruleId) ?? { nodes: [], count: 0 }
    group.count += 1
    if (group.nodes.length < MAX_NODES_PER_FINDING) group.nodes.push(node)
    groups.set(ruleId, group)
  }
  const describe = (stop: FocusRun["stops"][number]) => `<${stop.tag}${stop.role && stop.role !== stop.tag ? ` role="${stop.role}"` : ""}>${stop.name ? ` ${stop.name.slice(0, 80)}` : ""}`

  for (const stop of run.stops) {
    for (const problem of stop.problems) {
      const ruleId =
        problem.kind === "no-indicator"
          ? "ab-focus-not-visible"
          : problem.kind === "invisible" || problem.kind === "off-screen"
            ? "ab-focus-hidden-element"
            : problem.kind === "indicator-uncertain"
              ? "ab-focus-uncertain"
              : problem.kind === "obscured"
                ? "ab-focus-obscured"
                : problem.kind === "backward-jump"
                  ? "ab-focus-order-jump"
                  : null
      if (ruleId) push(ruleId, { selector: stop.selector, html: describe(stop), note: `Tab stop ${stop.index}: ${problem.message}` })
    }
  }

  for (const problem of run.problems) {
    if (problem.kind === "trap") {
      const loopStops = run.loop.map((index) => run.stops[index - 1]).filter(Boolean)
      const ruleId = problem.severity === "fail" ? "ab-keyboard-trap" : "ab-keyboard-trap-soft"
      const nodes = loopStops.length > 0 ? loopStops.map((stop) => ({ selector: stop.selector, html: describe(stop), note: problem.message })) : [{ selector: "", html: "", note: problem.message }]
      groups.set(ruleId, { nodes: nodes.slice(0, MAX_NODES_PER_FINDING), count: nodes.length })
    } else if (problem.kind === "focus-lost") {
      const after = Number(problem.message.match(/After stop (\d+)/)?.[1])
      const stop = Number.isFinite(after) ? run.stops[after - 1] : undefined
      push("ab-focus-lost", { selector: stop?.selector ?? "", html: stop ? describe(stop) : "", note: problem.message })
    }
  }

  return Array.from(groups.entries()).map(([ruleId, group]) => custom(ruleId, group.nodes, group.count))
}

/** Most severe first, violations before review items, then by how many elements are affected. */
export function sortFindings(findings: AuditFinding[]): AuditFinding[] {
  return [...findings].sort(
    (a, b) =>
      (a.outcome === b.outcome ? 0 : a.outcome === "violation" ? -1 : 1) ||
      IMPACT_ORDER[a.impact] - IMPACT_ORDER[b.impact] ||
      b.nodeCount - a.nodeCount,
  )
}

/** Counts of confirmed violations (rules, not elements) by impact. */
export function countViolations(findings: AuditFinding[]) {
  const violations = findings.filter((finding) => finding.outcome === "violation")
  return {
    totalViolations: violations.length,
    criticalCount: violations.filter((v) => v.impact === "critical").length,
    seriousCount: violations.filter((v) => v.impact === "serious").length,
    moderateCount: violations.filter((v) => v.impact === "moderate").length,
    minorCount: violations.filter((v) => v.impact === "minor").length,
  }
}

/** 100 minus 10, 5, 2 and 1 points per critical, serious, moderate and minor failing rule, floored at 0. */
export function scoreFrom(counts: ReturnType<typeof countViolations>): number {
  return Math.max(0, 100 - counts.criticalCount * 10 - counts.seriousCount * 5 - counts.moderateCount * 2 - counts.minorCount)
}

/**
 * The WCAG 2.2 A and AA map: failed, needs review, tested with nothing found, or not testable by
 * machine on this page.
 */
export function buildCoverage(findings: AuditFinding[], axePasses: AxeResult[], testedByChecks: string[]): CoverageEntry[] {
  const tested = new Set<string>(testedByChecks)
  for (const rule of axePasses) for (const tag of rule.tags) {
    const sc = scFromTag(tag)
    if (sc) tested.add(sc)
  }
  return wcagCriteria
    .filter((criterion) => (criterion.level === "A" || criterion.level === "AA") && criterion.number !== "4.1.1")
    .map((criterion) => {
      const related = findings.filter((finding) => finding.wcag.includes(criterion.number))
      const failing = related.filter((finding) => finding.outcome === "violation")
      const status: CoverageEntry["status"] = failing.length > 0 ? "fail" : related.length > 0 ? "review" : tested.has(criterion.number) ? "tested" : "manual"
      return {
        sc: criterion.number,
        title: criterion.title,
        level: criterion.level as "A" | "AA",
        principle: criterion.principle.replace(/^\d+\.\s*/, ""),
        status,
        findings: related.length,
      }
    })
}

const plural = (n: number, word: string, many = `${word}s`) => `${n} ${n === 1 ? word : many}`

/** The manual checks this particular page needs, from what it contains. */
export function buildManualChecks(facts: RawPageFacts, keyboardRan: boolean): ManualCheck[] {
  const checks: ManualCheck[] = []

  checks.push({
    id: "screen-reader",
    sc: ["1.3.1", "4.1.2", "2.4.6"],
    title: "Listen to the page with a screen reader",
    reason: `The page has ${plural(facts.headingCount, "heading")}, ${plural(facts.landmarks.main + facts.landmarks.nav + facts.landmarks.header + facts.landmarks.footer, "main landmark")} and ${plural(facts.buttons, "button")}. Automated rules confirm names exist, not that they make sense.`,
    steps: [
      "Turn on VoiceOver (Cmd+F5) or NVDA and move through the headings list. Does it outline the page?",
      "Tab through the buttons and links. Is every name meaningful out of context?",
      "Open and close menus and dialogs. Is the new state announced?",
    ],
  })

  checks.push({
    id: "keyboard",
    sc: ["2.1.1", "2.4.3", "2.4.7"],
    title: keyboardRan ? "Finish the keyboard walk-through by hand" : "Walk through the page with the keyboard",
    reason: keyboardRan
      ? "Our keyboard pass presses Tab only. Menus, sliders, carousels and dialogs also need Enter, Space, Escape and the arrow keys."
      : "The automated keyboard pass did not run on this page.",
    steps: [
      "Put the mouse away and press Tab from the top. Can you reach and operate everything?",
      "Open each menu, dropdown and dialog with Enter or Space; close it with Escape. Does focus return to where it was?",
      "Is the focus order the same as the visual order?",
    ],
  })

  if (facts.imagesWithAlt > 0) {
    checks.push({
      id: "alt-meaning",
      sc: ["1.1.1"],
      title: "Read the alt text in context",
      reason: `${plural(facts.imagesWithAlt, "image has", "images have")} alt text. A machine can tell it exists, not whether it says what the image conveys.`,
      steps: ["For each image, ask: if the image did not load, would the alt text give the same information?", "Check that decorative images use alt=\"\" and that charts and infographics have a full text equivalent."],
    })
  }

  if (facts.formFields > 0) {
    checks.push({
      id: "forms",
      sc: ["3.3.1", "3.3.3", "3.3.4"],
      title: "Submit the forms with mistakes",
      reason: `The page has ${plural(facts.formFields, "form field")}. Error handling only shows up when a form is submitted.`,
      steps: [
        "Submit each form empty, then with an invalid email or date.",
        "Is each error shown as text next to its field, and announced by a screen reader?",
        "Does the message say how to fix the problem? Is anything entered kept?",
      ],
    })
  }

  if (facts.passwordFields > 0) {
    checks.push({
      id: "authentication",
      sc: ["3.3.8"],
      title: "Check that signing in needs no memory test",
      reason: `There ${facts.passwordFields === 1 ? "is a password field" : `are ${facts.passwordFields} password fields`} on this page.`,
      steps: ["Can the password be pasted and filled by a password manager?", "If there is a CAPTCHA or puzzle, is there an alternative that does not rely on recognising objects or remembering?"],
    })
  }

  if (facts.videos > 0 || facts.embeddedPlayers > 0 || facts.audio > 0) {
    const media = facts.videos + facts.embeddedPlayers
    checks.push({
      id: "media",
      sc: ["1.2.2", "1.2.5", "1.2.1"],
      title: "Watch the media with sound off, then with eyes closed",
      reason: `${media > 0 ? plural(media, "video") : ""}${media > 0 && facts.audio > 0 ? " and " : ""}${facts.audio > 0 ? plural(facts.audio, "audio player") : ""} on this page. Caption accuracy and audio description cannot be judged automatically, and players in iframes are not inspected.`,
      steps: ["With sound off, do accurate captions cover all speech and important sounds?", "With eyes closed, is everything important that is shown also said, or provided by audio description?", "Can each player be paused and operated with the keyboard?"],
    })
  }

  if (facts.disclosureControls > 0) {
    checks.push({
      id: "hover-content",
      sc: ["1.4.13", "4.1.2"],
      title: "Open the menus, tooltips and popups",
      reason: `${plural(facts.disclosureControls, "control opens", "controls open")} extra content (menus, accordions or popups).`,
      steps: ["Hover and focus each one. Can the popup be dismissed with Escape without moving the pointer?", "Can the pointer move onto the popup without it closing?", "Does the expanded or collapsed state get announced?"],
    })
  }

  if (facts.draggable > 0) {
    checks.push({
      id: "dragging",
      sc: ["2.5.7"],
      title: "Find a non-dragging way for each drag action",
      reason: `${plural(facts.draggable, "element is", "elements are")} draggable.`,
      steps: ["For each drag interaction, is there a single-pointer alternative such as buttons or a menu?"],
    })
  }

  if (facts.runningAnimations > 0) {
    checks.push({
      id: "motion",
      sc: ["2.2.2", "2.3.1"],
      title: "Check moving and flashing content",
      reason: `${plural(facts.runningAnimations, "animation loops", "animations loop")} forever on this page.`,
      steps: ["Can every carousel, ticker or animation that runs more than five seconds be paused, stopped or hidden?", "Does anything flash more than three times a second?"],
    })
  }

  checks.push({
    id: "zoom",
    sc: ["1.4.4", "1.4.10", "1.3.4"],
    title: "Zoom to 200% and 400%, and rotate a phone",
    reason: "We test reflow at a 320 pixel wide window. Zooming a real browser also changes fonts, sticky headers and menus.",
    steps: ["Zoom to 200%. Is all text readable and nothing cut off or overlapping?", "Zoom to 400%. Does content fit the width without sideways scrolling?", "On a phone, does the page work in both portrait and landscape?"],
  })

  checks.push({
    id: "consistency",
    sc: ["3.2.3", "3.2.4", "3.2.6"],
    title: "Compare with two other pages on the site",
    reason: "Consistent navigation, identification and help are judged across pages; this scan sees one.",
    steps: ["Is the main navigation in the same place and order on other pages?", "Do icons and buttons with the same function have the same name everywhere?", "If help (contact details, chat) is offered, is it in the same place on every page?"],
  })

  return checks
}
