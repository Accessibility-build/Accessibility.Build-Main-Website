// The services Curb's intent classifier can recognise, with display labels. Shared by the
// classifier, the lead endpoint and the admin page, so it must stay free of server-only imports.

export const SERVICE_KEYS = [
  "audit",
  "remediation",
  "pdf_remediation",
  "compliance_documentation",
  "training",
  "design_review",
  "user_testing",
  "other",
] as const

export type ServiceKey = (typeof SERVICE_KEYS)[number]

export const SERVICE_LABELS: Record<ServiceKey, string> = {
  audit: "Accessibility audit",
  remediation: "Remediation support",
  pdf_remediation: "PDF remediation",
  compliance_documentation: "VPAT, ACR or accessibility statement",
  training: "Training",
  design_review: "Design review",
  user_testing: "User testing",
  other: "Other",
}

export const INTENT_LABELS: Record<string, string> = {
  hire: "Wants to hire",
  evaluate: "Weighing services",
  learn: "Learning",
  support: "Needs site help",
  other: "Other",
  unclassified: "Not classified",
}

export const TRIGGER_LABELS: Record<string, string> = {
  legal_threat: "Legal threat or demand letter",
  procurement: "Procurement requirement",
  regulatory_deadline: "Regulatory deadline",
  redesign_or_launch: "Redesign or launch",
  proactive: "Proactive",
  unknown: "Unknown",
}
