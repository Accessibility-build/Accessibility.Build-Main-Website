// Shapes shared by the focus order checker's route (server) and its results view (browser).

export type CheckMode = "focus" | "targets"

export interface Box {
  x: number
  y: number
  width: number
  height: number
}

export interface PageScreenshot {
  /** data:image/jpeg;base64,... */
  dataUrl: string
  width: number
  height: number
  /** True when the page was taller than the capture. */
  truncated: boolean
}

export type Severity = "fail" | "warning" | "info"

export type FocusProblemKind =
  | "no-indicator"
  | "indicator-uncertain"
  | "obscured"
  | "partly-obscured"
  | "invisible"
  | "off-screen"
  | "positive-tabindex"
  | "backward-jump"
  | "frame"
  | "trap"
  | "focus-lost"
  | "consent-dialog"

export interface FocusProblem {
  kind: FocusProblemKind
  severity: Severity
  /** WCAG success criterion number, for example "2.4.7". */
  criterion: string | null
  message: string
}

export type IndicatorVerdict = "visible" | "none" | "uncertain" | "not-checked"

export interface FocusStop {
  /** 1-based position in the Tab order. */
  index: number
  selector: string
  tag: string
  role: string
  name: string
  tabindex: number | null
  /** Where the element was when it had focus, in page coordinates. */
  focusBox: Box
  /** Where to draw the marker on the screenshot, or null when the element is no longer shown. */
  marker: Box | null
  /** Inside a fixed or sticky container, so its page position moves with scrolling. */
  pinned: boolean
  frame: boolean
  indicator: IndicatorVerdict
  /** Pixels that changed between the focused and unfocused captures. */
  changedPixels: number
  /** Computed style properties that changed on focus: supporting evidence for the pixel test. */
  styleChanges: string[]
  /** How much of the element other content covered while it had focus. */
  covered: "none" | "partial" | "full"
  coveredBy: string | null
  problems: FocusProblem[]
}

export type FocusEnd =
  | "left-page"
  | "wrapped"
  | "stop-limit"
  | "time-limit"
  | "trap"
  | "dialog"
  | "frame-limit"
  | "no-focusable"
  | "navigated"

export interface FocusSummary {
  stops: number
  noIndicator: number
  uncertain: number
  obscured: number
  partlyObscured: number
  invisible: number
  positiveTabindex: number
  backwardJumps: number
  frames: number
  trap: boolean
}

export interface FocusResult {
  mode: "focus"
  url: string
  finalUrl: string
  title: string
  screenshot: PageScreenshot
  stops: FocusStop[]
  ended: FocusEnd
  /** One sentence on why tabbing stopped. */
  endNote: string
  /** Stops (1-based) that focus cycled between, when a trap or a dialog stopped the run. */
  loop: number[]
  /** For a trap or dialog: which standard key got focus out, if any. */
  trapExit: "escape" | "shift-tab" | "none" | null
  /** Positive tabindex anywhere on the page, focusable or not reached. */
  positiveTabindex: { count: number; selectors: string[] }
  /** Times Tab moved focus back to an element it had already visited. */
  revisits: { after: number; to: number }[]
  /** Page-wide problems that do not belong to one stop. */
  problems: FocusProblem[]
  summary: FocusSummary
  durationMs: number
}

export type TargetStatus = "fail" | "spacing" | "inline" | "user-agent"

export interface TargetItem {
  /** 1-based number shown on the screenshot. */
  index: number
  selector: string
  tag: string
  role: string
  name: string
  box: Box
  status: TargetStatus
  /** For failures: names of the nearby targets the 24 px circle touches. */
  conflicts: string[]
  /** It has a ::before or ::after hit area, but that area overlaps another target, so only the
   * element's own box was measured. */
  hitArea?: "overlaps"
}

export interface TargetTotals {
  targets: number
  largeEnough: number
  undersized: number
  failing: number
  passBySpacing: number
  inline: number
  userAgent: number
  /** Targets that reach 24 by 24 pixels only through a ::before or ::after hit area. Absent in
   * results from before hit areas were measured. */
  pseudoHitAreas?: number
}

/** Target size can be measured at a desktop or a phone viewport; focus order always runs on desktop. */
export type TargetDevice = "desktop" | "mobile"

export interface TargetsResult {
  mode: "targets"
  /** The viewport the targets were measured at. Absent in results from before the phone option. */
  device?: TargetDevice
  url: string
  finalUrl: string
  title: string
  screenshot: PageScreenshot
  /** Undersized targets only, failures first. */
  targets: TargetItem[]
  /** True when there were more undersized targets than the list returns. */
  listTruncated: boolean
  totals: TargetTotals
  durationMs: number
}

export type CheckResult = FocusResult | TargetsResult
