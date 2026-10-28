// Shapes shared by the in-page collector, the rules, the AI review, the route and the browser UI.
// Nothing here imports server code, so the client component can use the same types.

export type ImageKind = "img" | "input-image" | "area" | "role-img" | "svg"

/** The link or button an image sits in, or the image itself for input type=image and area. */
export interface ImageControl {
  kind: "link" | "button"
  /** True for input type=image and area, which are controls in their own right. */
  self: boolean
  /** Absolute destination, when the control is a link. */
  href: string | null
  /** aria-label or aria-labelledby text on the control itself. */
  label: string
  /** The control's other content: its text and the alt of any other images, without this image. */
  text: string
  title: string
}

export interface CollectedImage {
  /** 1-based, in visual order. Also the value of the data attribute that marks the element. */
  id: number
  kind: ImageKind
  tag: string
  /** null when the attribute is absent, "" when it is empty. */
  alt: string | null
  ariaLabel: string | null
  /** Text of the elements aria-labelledby points to. */
  labelledbyText: string | null
  title: string | null
  role: string | null
  /** Only collected for an aria-hidden image that is the sole content of a control. */
  ariaHidden: boolean
  /** For svg: the text of its title child element. */
  svgTitle: string | null
  /** http(s) source, when there is one. */
  src: string | null
  fileName: string | null
  inPicture: boolean
  naturalWidth: number
  naturalHeight: number
  width: number
  height: number
  /** Document position of the top left corner, in CSS pixels. */
  x: number
  y: number
  /** False when an img has not loaded (broken, or lazy and never scrolled to). */
  loaded: boolean
  control: ImageControl | null
  caption: string | null
  nearbyText: string | null
  heading: string | null
}

export interface CollectionResult {
  images: CollectedImage[]
  /** Images found before the cap, after skipping hidden ones and tracking pixels. */
  totalFound: number
  truncated: boolean
  skipped: { hidden: number; tracking: number }
  /** Elements with a CSS background image of a visible size. Out of scope, but worth saying. */
  backgroundImages: number
  lang: string
}

export type Severity = "fail" | "warning" | "advice"

/** fail: a rule failed. review: something a person should look at. decorative / pass: fine by the rules. */
export type Outcome = "fail" | "review" | "decorative" | "pass"

export type RuleId =
  | "missing-alt"
  | "control-no-name"
  | "file-name"
  | "placeholder"
  | "redundant-phrase"
  | "too-long"
  | "repeats-caption"
  | "repeats-link-text"
  | "duplicate-alt"
  | "link-phrase"
  | "svg-no-name"
  | "role-img-no-name"
  | "title-only"
  | "whitespace-alt"
  | "presentation-role"

export interface WcagRef {
  id: string
  name: string
  href: string
}

export interface Finding {
  rule: RuleId
  severity: Severity
  title: string
  detail: string
  wcag: WcagRef[]
}

export type AltState = "missing" | "empty" | "present"

export type NameSource = "alt" | "aria-label" | "aria-labelledby" | "title" | "svg title" | "none"

export interface AuditedImage extends CollectedImage {
  altState: AltState
  /** The name assistive technology gets for the image itself, "" when none. */
  name: string
  nameSource: NameSource
  /** Treated as decorative: alt="", presentation role, hidden, or an unnamed icon inside a named control. */
  decorative: boolean
  /** The image is the only content of its link or button, so its alt is the control's name. */
  onlyContent: boolean
  findings: Finding[]
  outcome: Outcome
}

export type AiVerdictKind =
  | "accurate"
  | "incomplete"
  | "inaccurate"
  | "should_be_decorative"
  | "decorative_and_fine"
  | "needs_alt"

export interface AiVerdict {
  verdict: AiVerdictKind
  reason: string
  /** "" means the image should be decorative (alt=""). */
  suggestedAlt: string
}

export interface CheckedImage extends AuditedImage {
  ai?: AiVerdict
  /** data:image/jpeg;base64 of the element as it rendered, for images sent to the AI review. */
  capture?: string
}

export type AiStatus =
  | { status: "off" }
  | { status: "done"; reviewed: number; creditsUsed: number }
  | { status: "refused"; reason: "trial" | "credits" | "unavailable"; message: string }
  | { status: "failed"; message: string }

export interface AltTextCheckResponse {
  url: string
  title: string
  lang: string
  checkedAt: string
  images: CheckedImage[]
  summary: Record<Outcome, number> & {
    total: number
    totalFound: number
    truncated: boolean
    hidden: number
    tracking: number
    backgroundImages: number
  }
  ai: AiStatus
}
