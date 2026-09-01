/**
 * Data behind /sample-audit-report.
 *
 * Northstar Checkout is fictional. The point of this file is to model what a
 * real audit finding has to carry to be actionable: not just "what is wrong"
 * but where it happens, how to reproduce it, what a developer sees versus what
 * they should see, who it hurts, and what to do about it. A finding missing
 * repro steps is a complaint, not a defect report.
 */

export type Severity = "Critical" | "High" | "Medium" | "Low"
export type ConformanceLevel = "A" | "AA"
export type Principle = "Perceivable" | "Operable" | "Understandable" | "Robust"

export interface Criterion {
  /** Dotted number, e.g. "2.1.2" */
  id: string
  name: string
  level: ConformanceLevel
  /** Route on this site, derived from the id */
  href: string
  principle: Principle
}

export interface Finding {
  id: string
  title: string
  /** What the defect actually is, in plain terms. */
  description: string
  severity: Severity
  /** The strictest level implicated. Failing an A criterion means A is not met. */
  conformanceLevel: ConformanceLevel
  criteria: Criterion[]
  /** Where in the product. */
  location: string
  /** The specific element or component at fault. */
  component: string
  /** Numbered, so a developer can follow them exactly. */
  reproSteps: string[]
  actualResult: string
  expectedResult: string
  userImpact: string
  /** Which groups of disabled users hit this. */
  affectedGroups: string[]
  /** What to do about it, written for the team doing the remediation. */
  suggestedResolution: string
  /** Optional before/after so the fix is unambiguous. */
  codeExample?: { bad: string; good: string }
  status: string
}

const criterion = (
  id: string,
  name: string,
  level: ConformanceLevel,
  principle: Principle,
): Criterion => ({
  id,
  name,
  level,
  principle,
  href: `/wcag/${id.replace(/\./g, "-")}`,
})

export const severityOrder: Severity[] = ["Critical", "High", "Medium", "Low"]

export const severityMeta: Record<
  Severity,
  { blurb: string; sla: string }
> = {
  Critical: {
    blurb: "Blocks a disabled user from completing the task. No workaround.",
    sla: "Fix before next release",
  },
  High: {
    blurb: "Task is completable but only with significant difficulty or guesswork.",
    sla: "Fix within the current cycle",
  },
  Medium: {
    blurb: "Creates friction or confusion; a workaround exists.",
    sla: "Schedule within the quarter",
  },
  Low: {
    blurb: "Minor inconsistency with limited practical impact.",
    sla: "Backlog",
  },
}

const findings: Finding[] = [
  {
    id: "NS-001",
    title: "Order review dialog does not keep keyboard focus within the modal",
    description:
      "The order review dialog is presented as a modal visually, but it does not constrain sequential focus. Tabbing past the final action inside the dialog moves focus into the page behind it, which is still reachable and operable while the dialog overlays it.",
    severity: "Critical",
    conformanceLevel: "A",
    criteria: [
      criterion("2.1.2", "No Keyboard Trap", "A", "Operable"),
      criterion("2.4.3", "Focus Order", "A", "Operable"),
      criterion("4.1.2", "Name, Role, Value", "A", "Robust"),
    ],
    location: "Payment step, order review overlay",
    component: "div.review-modal (custom overlay, not a native dialog)",
    reproSteps: [
      "Navigate to the payment step and complete the card fields.",
      "Activate the Review order button to open the overlay.",
      "Press Tab repeatedly until focus passes the last control inside the overlay.",
      "Continue pressing Tab and observe where the focus indicator goes.",
    ],
    actualResult:
      "Focus leaves the overlay and lands on the site navigation behind it. The overlay stays open and visually covers the focused links, so the focus indicator is hidden behind the scrim. A screen reader continues reading background content as though the overlay were not there.",
    expectedResult:
      "While the dialog is modal, sequential focus stays inside it and cycles from the last control back to the first. Content behind the dialog is inert and not reachable by Tab or screen reader browse mode. Escape closes the dialog and focus returns to the Review order button.",
    userImpact:
      "A keyboard or screen reader user loses the relationship between the review task and its actions. They can silently operate background controls while believing they are still in the review step, which in a checkout means editing or abandoning an order without realising it.",
    affectedGroups: ["Screen reader users", "Keyboard-only users", "Switch device users"],
    suggestedResolution:
      "Replace the custom overlay with the native dialog element and call showModal(), which provides focus containment, the inert backdrop, and Escape handling from the platform. If a custom implementation is required, move focus to the dialog on open, contain Tab and Shift+Tab within it, apply inert or aria-hidden to the rest of the page, and restore focus to the invoking control on close.",
    codeExample: {
      bad: `<div class="review-modal" role="dialog">
  <h2>Review your order</h2>
  <!-- No focus containment, background stays reachable -->
  <button>Place order</button>
</div>`,
      good: `<dialog id="review" aria-labelledby="review-title">
  <h2 id="review-title">Review your order</h2>
  <button>Place order</button>
</dialog>

<script>
  // showModal() gives focus containment, an inert backdrop,
  // and Escape-to-close from the platform.
  const dialog = document.getElementById("review")
  openBtn.addEventListener("click", () => dialog.showModal())
  dialog.addEventListener("close", () => openBtn.focus())
</script>`,
    },
    status: "Open",
  },
  {
    id: "NS-002",
    title: "Delivery date picker cannot be operated with a keyboard",
    description:
      "The delivery date calendar is built from div elements with click handlers. The trigger can be reached by Tab, but once the calendar opens no date can be selected without a pointer, and the calendar grid is not exposed with any role.",
    severity: "Critical",
    conformanceLevel: "A",
    criteria: [
      criterion("2.1.1", "Keyboard", "A", "Operable"),
      criterion("4.1.2", "Name, Role, Value", "A", "Robust"),
    ],
    location: "Delivery address form, preferred delivery date",
    component: "div.datepicker-grid, individual day cells as div[onclick]",
    reproSteps: [
      "Open the delivery address form.",
      "Tab to the Preferred delivery date field and press Enter to open the calendar.",
      "Attempt to move between dates using the arrow keys.",
      "Attempt to select a date using Enter or Space.",
    ],
    actualResult:
      "The calendar opens, but arrow keys scroll the page instead of moving between dates. No day cell can receive focus because the cells are div elements without tabindex. There is no way to choose a date without a mouse or touch. A screen reader announces the grid as unlabelled text.",
    expectedResult:
      "Arrow keys move focus between days, Home and End move to the start and end of the week, Page Up and Page Down change month, and Enter or Space selects the focused date. The grid exposes a role of grid or uses a native date input, and the selected date is announced.",
    userImpact:
      "A keyboard-only user cannot select a delivery date at all, which halts the checkout entirely. This is a hard stop rather than an inconvenience: there is no alternate path to complete the order.",
    affectedGroups: [
      "Keyboard-only users",
      "Screen reader users",
      "Switch device users",
      "Voice control users",
    ],
    suggestedResolution:
      "Prefer a native input of type date, which provides the full keyboard model and platform date picker at no cost. Where a custom calendar is genuinely required, implement the ARIA grid pattern with roving tabindex, wire the documented arrow, Home, End, Page Up and Page Down keys, and label the grid with the visible month and year.",
    codeExample: {
      bad: `<div class="datepicker-grid">
  <div class="day" onclick="select(14)">14</div>
  <div class="day" onclick="select(15)">15</div>
</div>`,
      good: `<!-- Simplest correct answer: let the platform do it -->
<label for="delivery">Preferred delivery date</label>
<input type="date" id="delivery" name="delivery"
       min="2026-08-20" max="2026-09-30">`,
    },
    status: "Open",
  },
  {
    id: "NS-003",
    title: "Address validation errors are not announced after submission",
    description:
      "When submission fails, error text is inserted visually next to each invalid field, but nothing is announced. Focus stays on the Continue button, there is no error summary, and the inserted text is not associated with its input.",
    severity: "High",
    conformanceLevel: "A",
    criteria: [
      criterion("3.3.1", "Error Identification", "A", "Understandable"),
      criterion("4.1.3", "Status Messages", "AA", "Robust"),
      criterion("3.3.2", "Labels or Instructions", "A", "Understandable"),
    ],
    location: "Delivery address form",
    component: "span.field-error, injected on submit",
    reproSteps: [
      "Open the delivery address form with a screen reader running.",
      "Leave the postal code and city fields empty.",
      "Activate the Continue button.",
      "Listen for any announcement and note where focus is.",
    ],
    actualResult:
      "Red error text appears beside both fields visually. Nothing is announced. Focus remains on the Continue button. The error text is a sibling span with no programmatic relationship to its input, so moving to the field announces only its label. Nothing tells a non-visual user that submission failed at all.",
    expectedResult:
      "After a failed submission an error summary appears at the top of the form, receives focus, and lists each problem as a link to the field concerned. Each input carries aria-invalid and is associated with its message through aria-describedby, so moving to the field announces the label followed by the error.",
    userImpact:
      "A screen reader user activates Continue and receives no feedback. The most common outcome is repeatedly pressing the button, assuming it is broken, and abandoning the purchase, because nothing indicates which fields need attention.",
    affectedGroups: [
      "Screen reader users",
      "Users with cognitive disabilities",
      "Users with low vision using magnification",
    ],
    suggestedResolution:
      "Render an error summary in a container that is present in the DOM before submission, move focus to it on failure, and link each item to its field. Associate individual messages with aria-describedby and set aria-invalid until the value is corrected. Do not make the same node both an aria-describedby target and a live region, which causes a double announcement.",
    codeExample: {
      bad: `<input id="postcode" name="postcode">
<span class="field-error">Enter a postal code</span>`,
      good: `<div id="err-postcode" class="field-error">Enter a postal code</div>
<label for="postcode">Postal code</label>
<input id="postcode" name="postcode"
       aria-invalid="true"
       aria-describedby="err-postcode">`,
    },
    status: "Open",
  },
  {
    id: "NS-004",
    title: "Promotional code helper text falls below minimum contrast",
    description:
      "The helper text beneath the promotional code field is rendered in a light grey on white. Measured contrast is 2.9:1, below the 4.5:1 required for body text. The same token is used for helper text across the checkout, so the defect repeats.",
    severity: "High",
    conformanceLevel: "AA",
    criteria: [criterion("1.4.3", "Contrast (Minimum)", "AA", "Perceivable")],
    location: "Payment step, promotional code field. Token reused site-wide.",
    component: "--color-text-muted (#9AA3AE on #FFFFFF)",
    reproSteps: [
      "Open the payment step.",
      "Locate the helper text under the promotional code field reading Codes are case sensitive.",
      "Sample the foreground and background colours with a contrast checker.",
      "Compare the ratio against the 4.5:1 requirement for text below 18.66px bold or 24px regular.",
    ],
    actualResult:
      "The helper text renders at #9AA3AE on #FFFFFF, a ratio of 2.9:1, against a requirement of 4.5:1. The same muted token is applied to helper text throughout the checkout, so the shortfall is systemic rather than isolated to this field.",
    expectedResult:
      "Body text meets at least 4.5:1 against its background. Darkening the token to #6B7480 yields 4.6:1 and preserves the visual hierarchy that separates helper text from primary content.",
    userImpact:
      "Users with low vision, reduced contrast sensitivity, or age-related sight loss cannot read the instruction, and in this case the instruction explains why a valid code is being rejected. It also disappears in bright ambient light for users with no visual impairment at all.",
    affectedGroups: [
      "Users with low vision",
      "Users with colour vision deficiency",
      "Older users",
      "Anyone in bright sunlight",
    ],
    suggestedResolution:
      "Darken the muted text token to at least #6B7480 and verify every place it is consumed, since the same variable drives helper text, timestamps, and placeholder copy. Add a contrast assertion to the design token tests so the value cannot regress silently.",
    status: "Open",
  },
  {
    id: "NS-005",
    title: "Visible payment option text is not included in the accessible name",
    description:
      "The radio option displays Pay by bank transfer, but an aria-label overrides that with Transfer payment method. The visible string is not contained in the computed accessible name.",
    severity: "Medium",
    conformanceLevel: "A",
    criteria: [
      criterion("2.5.3", "Label in Name", "A", "Operable"),
      criterion("4.1.2", "Name, Role, Value", "A", "Robust"),
    ],
    location: "Payment step, payment method selection",
    component: "input[type=radio][aria-label='Transfer payment method']",
    reproSteps: [
      "Open the payment step.",
      "Inspect the radio option labelled Pay by bank transfer in the accessibility tree.",
      "Compare the computed accessible name against the visible text.",
      "With voice control active, say the visible label to attempt selection.",
    ],
    actualResult:
      "The computed accessible name is Transfer payment method. The visible words Pay by bank transfer appear nowhere in it. Saying the visible label with voice control does not activate the option, and a screen reader announces text that differs from what a sighted colleague sees.",
    expectedResult:
      "The accessible name contains the visible label text, ideally matching it exactly. Voice control users can activate the control by speaking what they see, and screen reader output matches the visual presentation.",
    userImpact:
      "Voice control users cannot select the option by speaking its visible name, which is the primary interaction model for people with limited hand mobility. It also breaks shared understanding when a sighted person is helping over the phone.",
    affectedGroups: [
      "Voice control users",
      "Screen reader users",
      "Users with motor disabilities",
    ],
    suggestedResolution:
      "Remove the conflicting aria-label and associate the visible text through a native label element. Where extra context is genuinely needed, keep the visible text at the start of the accessible name rather than replacing it.",
    codeExample: {
      bad: `<input type="radio" name="pay" id="bank"
       aria-label="Transfer payment method">
<span>Pay by bank transfer</span>`,
      good: `<input type="radio" name="pay" id="bank">
<label for="bank">Pay by bank transfer</label>`,
    },
    status: "Open",
  },
  {
    id: "NS-006",
    title: "Order summary requires horizontal scrolling at 400 percent zoom",
    description:
      "The order summary table carries a fixed min-width of 720px. At 400 percent zoom on a 1280px viewport, the effective width falls to 320 CSS pixels and the table forces the whole page to scroll sideways.",
    severity: "Medium",
    conformanceLevel: "AA",
    criteria: [criterion("1.4.10", "Reflow", "AA", "Perceivable")],
    location: "Order review step, summary table",
    component: "table.order-summary { min-width: 720px }",
    reproSteps: [
      "Set the browser viewport to 1280 CSS pixels wide.",
      "Zoom the browser to 400 percent, giving an effective width of 320 CSS pixels.",
      "Navigate to the order review step.",
      "Attempt to read an item name and its total without scrolling horizontally.",
    ],
    actualResult:
      "The summary keeps its 720px minimum width and the page scrolls horizontally. Reading a single row means scrolling right to see the total, then left again to see which item it belongs to, for every line.",
    expectedResult:
      "At 320 CSS pixels of effective width the content reflows into a single column with no horizontal page scrolling. Each item's label and value stay visible together, whether by stacking cells or by letting the table scroll within its own labelled container.",
    userImpact:
      "People who rely on zoom must scroll in two dimensions to compare an item against its price, holding the association in working memory across scroll positions. In a checkout this is where people lose confidence that the total is correct.",
    affectedGroups: [
      "Users with low vision",
      "Users with cognitive disabilities",
      "Mobile users on narrow viewports",
    ],
    suggestedResolution:
      "Remove the fixed minimum width and let the summary stack below a defined breakpoint, pairing each label with its value. If the tabular relationship must be preserved, wrap the table in a container with overflow-x auto, role of region, an accessible name, and tabindex of 0 so it can be scrolled by keyboard, which keeps the page itself from scrolling sideways.",
    status: "Open",
  },
  {
    id: "NS-007",
    title: "Card number field does not declare its input purpose",
    description:
      "The card number, expiry, and name-on-card fields carry no autocomplete attribute, so browsers and assistive tools cannot identify their purpose or offer stored values.",
    severity: "Medium",
    conformanceLevel: "AA",
    criteria: [
      criterion("1.3.5", "Identify Input Purpose", "AA", "Perceivable"),
      criterion("3.3.7", "Redundant Entry", "A", "Understandable"),
    ],
    location: "Payment step, card details fieldset",
    component: "input#cardNumber, input#cardExpiry, input#cardName",
    reproSteps: [
      "Open the payment step in a browser with saved payment details.",
      "Place focus in the card number field.",
      "Observe whether the browser offers to autofill a stored card.",
      "Inspect the field markup for an autocomplete attribute.",
    ],
    actualResult:
      "No autofill is offered on any card field. The markup contains no autocomplete attribute, so nothing identifies the purpose of the inputs programmatically. Every value must be typed by hand from the physical card.",
    expectedResult:
      "Each field declares its purpose with the documented autocomplete token, cc-number, cc-exp, and cc-name. Browsers and password managers offer stored values, and assistive tools that adapt input can present the field appropriately.",
    userImpact:
      "Users with motor disabilities face avoidable typing on a long numeric string, and users with cognitive disabilities or dyslexia have to transcribe digits accurately under time pressure. Both are exactly the conditions autofill exists to remove.",
    affectedGroups: [
      "Users with motor disabilities",
      "Users with cognitive disabilities",
      "Users with dyslexia",
      "Users of password managers",
    ],
    suggestedResolution:
      "Add the correct autocomplete tokens to every field in the card fieldset and to the billing address fields above it. This is an attribute-level change with no visual or behavioural cost, and it also satisfies the redundant entry expectation when billing repeats delivery details.",
    codeExample: {
      bad: `<input id="cardNumber" name="cardNumber" inputmode="numeric">`,
      good: `<input id="cardNumber" name="cardNumber" inputmode="numeric"
       autocomplete="cc-number">`,
    },
    status: "Open",
  },
  {
    id: "NS-008",
    title: "Checkout progress indicator conveys the current step by colour alone",
    description:
      "The four-step progress bar marks the current step with a filled accent colour and nothing else. There is no text, shape, or programmatic state distinguishing it from completed or upcoming steps.",
    severity: "Low",
    conformanceLevel: "A",
    criteria: [
      criterion("1.4.1", "Use of Color", "A", "Perceivable"),
      criterion("1.3.1", "Info and Relationships", "A", "Perceivable"),
    ],
    location: "All checkout steps, header progress indicator",
    component: "ol.progress-steps > li.is-current",
    reproSteps: [
      "Open any checkout step.",
      "Apply a greyscale filter to the page, or view it with a colour vision deficiency simulator.",
      "Attempt to identify which step is current.",
      "Inspect the current step in the accessibility tree.",
    ],
    actualResult:
      "In greyscale, all four steps render at similar lightness and the current one cannot be identified. The list item carries only a CSS class, with no aria-current and no text alternative, so a screen reader announces four items with no indication of position.",
    expectedResult:
      "The current step is distinguished by something other than hue, such as a visible marker, weight change, or the words Step 2 of 4. The current item carries aria-current with a value of step so assistive technology announces it as the current position.",
    userImpact:
      "Users with colour vision deficiency and screen reader users cannot tell how far through the checkout they are. The impact is limited because the page heading also names the step, which is why this is rated Low rather than Medium.",
    affectedGroups: ["Users with colour vision deficiency", "Screen reader users"],
    suggestedResolution:
      "Add aria-current with a value of step to the active item and pair the colour change with a non-colour cue. Including visually hidden text of the form Step 2 of 4 gives screen reader users the position directly and costs nothing visually.",
    codeExample: {
      bad: `<li class="is-current">Payment</li>`,
      good: `<li class="is-current" aria-current="step">
  Payment <span class="sr-only">(step 3 of 4)</span>
</li>`,
    },
    status: "Open",
  },
]

export const sampleAuditReport = {
  title: "Sample Accessibility Audit Report",
  product: "Northstar Checkout",
  client: "Northstar Retail Group (fictional)",
  disclosure:
    "Northstar Checkout is a fictional product created solely to demonstrate the structure and evidence quality of an Accessibility.build audit report. It is not a client, an endorsement, or a conformance claim, and the findings below describe a product that does not exist.",
  version: "1.0",
  issued: "July 12, 2026",
  auditor: "Khushwant Parihar (CPACC, DHS Trusted Tester)",
  target: "WCAG 2.2 Level A and AA",
  methodology:
    "Manual testing against WCAG 2.2 Level A and AA, carried out by a CPACC-certified auditor, with automated checks used only to surface candidates for manual review. Every finding below was reproduced by hand.",
  scope: [
    "Checkout entry page",
    "Delivery address form",
    "Payment method step",
    "Order review dialog",
    "Confirmation state",
  ],
  environments: [
    "Chrome 128 with NVDA 2025.1 on Windows 11",
    "Safari 18 with VoiceOver on macOS 15",
    "Keyboard-only interaction across all five states",
    "Browser zoom to 400 percent and reflow at 320 CSS pixels",
    "axe-core 4.10 used as supporting evidence only",
  ],
  limitations: [
    "This sample covers five representative states, not every possible checkout configuration.",
    "No usability testing with disabled participants is represented in this fictional sample.",
    "Conformance cannot be claimed from a sample. A conformance claim requires every page in scope to be evaluated.",
  ],
  findings,
} as const

/** Counts used by the dashboard. Derived, never hand-maintained. */
export function getReportStats() {
  const bySeverity = severityOrder.map((severity) => ({
    severity,
    count: findings.filter((f) => f.severity === severity).length,
  }))

  const byLevel = (["A", "AA"] as ConformanceLevel[]).map((level) => ({
    level,
    count: findings.filter((f) => f.conformanceLevel === level).length,
  }))

  const principles: Principle[] = [
    "Perceivable",
    "Operable",
    "Understandable",
    "Robust",
  ]
  const byPrinciple = principles.map((principle) => ({
    principle,
    count: findings.filter((f) =>
      f.criteria.some((c) => c.principle === principle),
    ).length,
  }))

  const uniqueCriteria = new Set(
    findings.flatMap((f) => f.criteria.map((c) => c.id)),
  )

  return {
    total: findings.length,
    bySeverity,
    byLevel,
    byPrinciple,
    uniqueCriteria: uniqueCriteria.size,
    blocking: findings.filter(
      (f) => f.severity === "Critical" || f.severity === "High",
    ).length,
  }
}
