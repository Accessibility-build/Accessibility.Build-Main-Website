// Shapes shared by the URL Accessibility Auditor's server action (lib/url-audit/run.ts, the
// action in app/actions) and its results view (components/tools/url-auditor). Client-safe: no
// server imports.

export type Impact = "critical" | "serious" | "moderate" | "minor"

/**
 * violation: a confirmed failure, counted in the score.
 * review: something a check found but cannot decide (axe "incomplete", or one of our heuristics).
 * A person has to look; it is never counted in the score.
 */
export type Outcome = "violation" | "review"

/** Which engine produced a finding. "axe-core" for Deque's rules, "accessibility.build" for ours. */
export type FindingSource = "axe-core" | "accessibility.build"

export type FindingCategory =
  | "images"
  | "color"
  | "forms"
  | "keyboard"
  | "navigation"
  | "structure"
  | "aria"
  | "media"
  | "layout"
  | "language"

export interface FindingNode {
  selector: string
  html: string
  /** What is wrong with this element in particular, when it differs from the finding's text. */
  note?: string
}

export interface AuditFinding {
  id: string
  /** axe rule id, or "ab-..." for an accessibility.build check. */
  ruleId: string
  source: FindingSource
  outcome: Outcome
  /** One line, for example "Images must have alternative text". */
  title: string
  /** What the rule tests and why it matters. */
  description: string
  impact: Impact
  category: FindingCategory
  /** Success criteria, for example ["1.1.1"]. Empty for best-practice rules. */
  wcag: string[]
  wcagLevel: "A" | "AA" | "AAA" | "Best practice"
  helpUrl: string
  /** How to fix it, in plain words. */
  fix: string
  /** Up to MAX_NODES_PER_FINDING affected elements. */
  nodes: FindingNode[]
  /** All affected elements, including ones not listed in nodes. */
  nodeCount: number
}

export interface PageFacts {
  finalUrl: string
  lang: string | null
  title: string
  headings: { level: number; text: string }[]
  headingCount: number
  landmarks: { main: number; nav: number; header: number; footer: number; search: number; aside: number }
  images: number
  imagesWithAlt: number
  decorativeImages: number
  links: number
  buttons: number
  forms: number
  formFields: number
  passwordFields: number
  tables: number
  iframes: number
  videos: number
  audio: number
  /** YouTube, Vimeo, Wistia and similar players embedded in iframes. */
  embeddedPlayers: number
  /** Elements that open popups or tooltips: aria-haspopup, aria-expanded, title. */
  disclosureControls: number
  draggable: number
  /** Overlay widget vendor, for example "accessiBe", when the page loads one. */
  overlay: string | null
  /** Link to an accessibility statement found on the page. */
  statementLink: string | null
  skipLink: boolean
  /** Infinite CSS or Web Animations running on the page when it loaded. */
  runningAnimations: number
  /** Whether the infinite animations stopped when prefers-reduced-motion: reduce was turned on. */
  respectsReducedMotion: boolean | null
}

export interface KeyboardSummary {
  /** Tab stops visited. */
  stops: number
  noIndicator: number
  obscured: number
  trap: boolean
  /** One sentence on why tabbing stopped. */
  endNote: string
  /** The first few stops, for the keyboard walk-through panel. */
  firstStops: { index: number; name: string; role: string; indicator: string; covered: string }[]
  /** False when the keyboard pass could not run (time ran out, page refused focus). */
  ran: boolean
}

export interface LayoutSummary {
  /** Page width at a 320 CSS px viewport; more than 320 means sideways scrolling. */
  reflowScrollWidth: number | null
  reflowChecked: boolean
  textSpacingChecked: boolean
  textSpacingClipped: number
}

/** One success criterion in the coverage map. */
export interface CoverageEntry {
  sc: string
  title: string
  level: "A" | "AA"
  principle: string
  /**
   * fail: a confirmed violation. review: something to check. tested: automated checks ran and found
   * nothing (not the same as conforming). manual: no automated check covers it on this page.
   */
  status: "fail" | "review" | "tested" | "manual"
  findings: number
}

export interface ManualCheck {
  id: string
  sc: string[]
  title: string
  /** Why this page in particular needs the check, for example "2 forms with 9 fields". */
  reason: string
  steps: string[]
}

/** One row of the "what ran" panel. */
export interface EngineCheck {
  id: string
  label: string
  /** ok: ran. skipped: not applicable or out of time. */
  status: "ok" | "skipped"
  detail: string
}

export interface AuditExtras {
  version: 2
  facts: PageFacts
  keyboard: KeyboardSummary
  layout: LayoutSummary
  coverage: CoverageEntry[]
  manualChecks: ManualCheck[]
  engine: {
    axeVersion: string
    checks: EngineCheck[]
    durationMs: number
    rulesRun: number
    rulesPassed: number
  }
}

/** The AI summary, stored as a JSON string in url_accessibility_audits.ai_summary. */
export interface AiSummary {
  headline: string
  summary: string
  fixFirst: { title: string; why: string }[]
  quickWins: string[]
}
