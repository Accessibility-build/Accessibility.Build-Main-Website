export const sampleAuditReport = {
  title: "Sample Accessibility Audit Report",
  product: "Northstar Checkout",
  disclosure:
    "Northstar Checkout is a fictional product created solely to demonstrate the structure and evidence quality of an Accessibility.build audit report. It is not a client, endorsement, or conformance claim.",
  version: "1.0",
  issued: "July 12, 2026",
  target: "WCAG 2.2 Level A and AA",
  scope: [
    "Checkout entry page",
    "Delivery address form",
    "Payment method step",
    "Order review dialog",
    "Confirmation state",
  ],
  environments: [
    "Chrome with NVDA on Windows",
    "Safari with VoiceOver on macOS",
    "Keyboard-only interaction",
    "Browser zoom and responsive reflow review",
    "Automated axe-based checks used as supporting evidence",
  ],
  limitations: [
    "This sample covers five representative states, not every possible checkout configuration.",
    "No disabled-user research is represented in this fictional sample.",
    "Legal compliance and full product conformance cannot be established from this sample.",
  ],
  findings: [
    {
      id: "NS-001",
      title: "Order review dialog does not keep keyboard focus within the modal",
      severity: "Critical",
      criteria: ["2.1.2 No Keyboard Trap", "2.4.3 Focus Order"],
      userImpact:
        "Keyboard and screen-reader users can move into content behind the open dialog and lose the relationship between the review task and available actions.",
      evidence: [
        "Open the order review dialog from the payment step.",
        "Press Tab repeatedly after focus reaches the final dialog action.",
        "Focus moves to the page navigation behind the modal while the modal remains visible.",
      ],
      remediation:
        "Use a native dialog implementation or a tested modal pattern. Move focus to a meaningful element when the dialog opens, constrain sequential focus while it is modal, support Escape where appropriate, and restore focus to the invoking control when it closes.",
      status: "Open in sample",
    },
    {
      id: "NS-002",
      title: "Address validation errors are not announced after submission",
      severity: "High",
      criteria: ["3.3.1 Error Identification", "4.1.3 Status Messages"],
      userImpact:
        "A screen-reader user receives no programmatic notification that submission failed or which fields need correction.",
      evidence: [
        "Leave the postal code and city fields empty.",
        "Activate Continue.",
        "Visual error text appears, but focus remains on Continue and no status or error summary is announced.",
      ],
      remediation:
        "Provide an error summary with links to invalid fields, move focus to the summary after unsuccessful submission, associate each field error using aria-describedby, and maintain aria-invalid until the value is corrected.",
      status: "Open in sample",
    },
    {
      id: "NS-003",
      title: "Visible payment option text is not included in the accessible name",
      severity: "Medium",
      criteria: ["2.5.3 Label in Name", "4.1.2 Name, Role, Value"],
      userImpact:
        "Speech-input users cannot reliably activate the option by saying the visible label, and screen-reader output differs from the text presented visually.",
      evidence: [
        "Inspect the option labelled Pay by bank transfer.",
        "Its accessible name is Transfer payment method.",
        "The visible words Pay by bank transfer are not contained in the computed name.",
      ],
      remediation:
        "Use the visible text as the control's accessible name. Prefer an associated native label and remove the conflicting aria-label unless additional context is genuinely required.",
      status: "Open in sample",
    },
    {
      id: "NS-004",
      title: "Order summary requires horizontal scrolling at 400 percent zoom",
      severity: "Medium",
      criteria: ["1.4.10 Reflow"],
      userImpact:
        "People using browser zoom must repeatedly scroll in two dimensions to compare item names, quantities, and totals.",
      evidence: [
        "Set a 1280 CSS pixel viewport and zoom the browser to 400 percent.",
        "Navigate to the order review step.",
        "The summary table retains a fixed minimum width and creates horizontal page scrolling.",
      ],
      remediation:
        "Replace the fixed-width layout with a responsive summary pattern. Allow labels and values to wrap, move secondary metadata below the item name, and test at an effective viewport width of 320 CSS pixels.",
      status: "Open in sample",
    },
  ],
} as const
