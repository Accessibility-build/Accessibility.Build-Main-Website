export interface ServicePricingTier {
  name: string
  slug: string
  price: number
  description: string
  bestFor: string
  timeline: string
  scope: string[]
  deliverables: string[]
  popular?: boolean
}

export interface ServicePricingAddOn {
  name: string
  price: string
  detail: string
}

export interface ServicePricingConfig {
  service: string
  contactService: string
  intro: string
  scopeNote: string
  tiers: ServicePricingTier[]
  addOns: ServicePricingAddOn[]
  assumptions: string[]
}

export const servicePricing = {
  audits: {
    service: "Accessibility audit",
    contactService: "audit",
    intro:
      "Choose the audit depth that matches your product. Every package uses a representative sample agreed before testing and is billed as a fixed project.",
    scopeNote:
      "A template is a distinct page or screen pattern. A task flow is an end-to-end journey such as sign-in, checkout, or application submission.",
    tiers: [
      {
        name: "Essential Audit",
        slug: "essential-audit",
        price: 950,
        description: "A focused baseline for a small website or a single product area.",
        bestFor: "Marketing sites and early-stage products",
        timeline: "7-10 business days",
        scope: ["Up to 5 page templates", "1 critical task flow", "1 agreed desktop environment"],
        deliverables: [
          "Automated and manual WCAG 2.2 AA review",
          "Keyboard and screen-reader checks",
          "Severity-ranked issue register with evidence",
          "30-minute findings walkthrough",
          "One focused verification retest within 30 days",
        ],
      },
      {
        name: "Product Audit",
        slug: "product-audit",
        price: 2750,
        description: "A deeper audit of the journeys customers rely on most.",
        bestFor: "SaaS products, commerce, education, and healthcare",
        timeline: "2-3 weeks",
        scope: ["Up to 15 page templates", "3 critical task flows", "2 agreed test environments"],
        deliverables: [
          "Full WCAG 2.2 AA evaluation across the sample",
          "Keyboard, zoom, reflow, and assistive-technology testing",
          "Executive brief and detailed technical report",
          "Prioritized remediation backlog with code guidance",
          "60-minute stakeholder review",
          "Two verification retests within 60 days",
        ],
        popular: true,
      },
      {
        name: "Complex Product Audit",
        slug: "complex-product-audit",
        price: 5900,
        description: "Broad evidence for complex products, procurement, or regulated teams.",
        bestFor: "Multi-role applications and regulated organizations",
        timeline: "4-5 weeks",
        scope: ["Up to 30 page templates", "6 critical task flows", "3 agreed test environments"],
        deliverables: [
          "Expanded WCAG 2.2 AA manual evaluation",
          "Testing across agreed user roles and responsive states",
          "Leadership summary and engineering-ready issue register",
          "Procurement-ready evidence package",
          "Remediation planning workshop",
          "Two verification cycles within 90 days",
        ],
      },
    ],
    addOns: [
      { name: "Additional page template", price: "$175", detail: "Adds one distinct page or screen pattern." },
      { name: "Additional task flow", price: "$350", detail: "Adds one end-to-end journey with its relevant states." },
      { name: "Accessibility statement draft", price: "$350", detail: "Prepared from the completed audit evidence." },
      { name: "Expedited delivery", price: "+25%", detail: "Shortens the agreed delivery window by approximately one-third." },
    ],
    assumptions: [
      "The client provides working access, test accounts, and stable test data before kickoff.",
      "Testing covers the agreed representative sample, not every URL generated from a template.",
      "Material scope changes are priced from the published add-ons and approved before work continues.",
    ],
  },
  training: {
    service: "Accessibility training",
    contactService: "training",
    intro:
      "Live remote workshops are priced by program, not by time spent preparing. Every package includes role-relevant examples and accessible participant materials.",
    scopeNote:
      "Attendance limits preserve time for questions and practical exercises. Larger groups can be added using the published attendee add-on.",
    tiers: [
      {
        name: "Team Essentials",
        slug: "team-essentials",
        price: 600,
        description: "A practical introduction that gives one team a shared accessibility vocabulary.",
        bestFor: "Cross-functional teams beginning accessibility work",
        timeline: "90-minute live session",
        scope: ["Up to 20 attendees", "One role mix", "Remote delivery"],
        deliverables: [
          "Pre-session needs questionnaire",
          "WCAG and disability-impact fundamentals",
          "Live examples from common product patterns",
          "Accessible slide deck and takeaway checklist",
          "Question and answer session",
        ],
      },
      {
        name: "Role Workshop",
        slug: "role-workshop",
        price: 1400,
        description: "Hands-on training for designers, developers, testers, or content teams.",
        bestFor: "Teams responsible for delivery quality",
        timeline: "3-hour live workshop",
        scope: ["Up to 30 attendees", "One role-specific track", "Remote delivery"],
        deliverables: [
          "Customized examples from your product or design system",
          "Guided exercises and group review",
          "Role-specific reference workbook",
          "Knowledge check and recommended next steps",
          "30 days of follow-up questions by email",
        ],
        popular: true,
      },
      {
        name: "Team Enablement",
        slug: "team-enablement",
        price: 3200,
        description: "A structured program that turns accessibility guidance into team practice.",
        bestFor: "Organizations building repeatable capability",
        timeline: "Two 3-hour workshops over 2-3 weeks",
        scope: ["Up to 50 attendees", "Two role-specific tracks", "Remote delivery"],
        deliverables: [
          "Training plan based on a stakeholder intake",
          "Two customized role workshops",
          "Product-specific exercises and critique",
          "Knowledge checks and completion summary",
          "One 60-minute follow-up clinic",
          "60 days of follow-up questions by email",
        ],
      },
    ],
    addOns: [
      { name: "Additional attendees", price: "$20 each", detail: "Applies above the package attendance limit." },
      { name: "Additional role track", price: "$650", detail: "Adds a separate role-specific module and materials." },
      { name: "Follow-up clinic", price: "$450", detail: "A 60-minute live review of questions and work produced after training." },
      { name: "On-site delivery", price: "+$750", detail: "Facilitation surcharge; pre-approved travel costs are separate." },
    ],
    assumptions: [
      "Remote sessions use the client's preferred meeting platform or a mutually agreed accessible platform.",
      "The client supplies product examples at least five business days before customized workshops.",
      "Rescheduling is included once when requested at least three business days before delivery.",
    ],
  },
  remediation: {
    service: "Accessibility remediation",
    contactService: "remediation",
    intro:
      "Remediation is packaged around an agreed backlog. We confirm the exact findings included before kickoff, so the project has a fixed price and a clear acceptance test.",
    scopeNote:
      "Finding counts refer to distinct agreed defects, not every repeated occurrence. Shared component fixes include their repeated instances when they share one root cause.",
    tiers: [
      {
        name: "Guided Remediation",
        slug: "guided-remediation",
        price: 1250,
        description: "Your team implements while we provide technical direction and verification.",
        bestFor: "Engineering teams that need an accessibility specialist",
        timeline: "1-2 weeks",
        scope: ["Up to 20 audit findings", "One codebase", "Client implements fixes"],
        deliverables: [
          "Backlog triage and implementation order",
          "Code patterns for agreed high-impact findings",
          "Two technical review meetings",
          "Pull-request or patch review",
          "One verification pass on the agreed findings",
        ],
      },
      {
        name: "Implementation Sprint",
        slug: "implementation-sprint",
        price: 3800,
        description: "We implement a prioritized set of fixes in your existing codebase.",
        bestFor: "Teams with a defined audit backlog and a release deadline",
        timeline: "2-4 weeks",
        scope: ["Up to 25 agreed findings", "One codebase", "One staging environment"],
        deliverables: [
          "Technical scoping and dependency review",
          "Code-level remediation through reviewable changes",
          "Keyboard and assistive-technology validation",
          "Regression notes for affected components",
          "Handoff walkthrough for your engineering team",
          "One post-merge verification pass",
        ],
        popular: true,
      },
      {
        name: "Release Remediation",
        slug: "release-remediation",
        price: 7500,
        description: "A multi-sprint engagement for a substantial release or compliance milestone.",
        bestFor: "Products addressing a broad, prioritized audit backlog",
        timeline: "4-8 weeks",
        scope: ["Up to 60 agreed findings", "One codebase", "Up to 2 delivery sprints"],
        deliverables: [
          "Remediation plan with sprint allocation",
          "Implementation of agreed fixes",
          "Component-level regression coverage where practical",
          "Validation against original audit evidence",
          "Weekly delivery summary",
          "Final residual-risk and handoff report",
        ],
      },
    ],
    addOns: [
      { name: "Additional 10-finding batch", price: "$1,250", detail: "Added after technical scoping and written approval." },
      { name: "Additional codebase", price: "$900", detail: "Covers setup, conventions, and validation for a second repository." },
      { name: "Post-release production check", price: "$600", detail: "Validates agreed fixes after deployment." },
      { name: "Expedited sprint", price: "+25%", detail: "Reserves priority delivery capacity for an agreed deadline." },
    ],
    assumptions: [
      "The client provides repository, build, test, and staging access before kickoff.",
      "Product redesigns, framework migrations, and unrelated feature work are excluded unless added in writing.",
      "A package is fixed only after the backlog has been reviewed and the included findings are listed in the statement of work.",
    ],
  },
  designReviews: {
    service: "Accessible design review",
    contactService: "design-review",
    intro:
      "Reviews are priced by the number of unique screens, states, flows, and components. You receive annotated design feedback before implementation makes changes expensive.",
    scopeNote:
      "A screen includes one primary responsive state. Materially different error, empty, modal, mobile, or interaction states count as additional screens.",
    tiers: [
      {
        name: "Feature Review",
        slug: "feature-review",
        price: 650,
        description: "Fast accessibility feedback for one feature before development begins.",
        bestFor: "New flows, redesigns, and sprint-ready features",
        timeline: "3-5 business days",
        scope: ["Up to 10 screens or states", "1 primary user flow", "One design review round"],
        deliverables: [
          "Annotated design file or review document",
          "Contrast, typography, layout, and interaction review",
          "Keyboard and focus-order recommendations",
          "Component and content guidance",
          "30-minute designer handoff",
        ],
      },
      {
        name: "Product Flow Review",
        slug: "product-flow-review",
        price: 1500,
        description: "A connected review of several high-value product journeys.",
        bestFor: "Product teams preparing a release or redesign",
        timeline: "1-2 weeks",
        scope: ["Up to 30 screens or states", "Up to 3 user flows", "Two design review rounds"],
        deliverables: [
          "Annotated findings mapped to WCAG 2.2 AA",
          "Interaction, error, loading, and responsive-state review",
          "Accessible pattern recommendations",
          "Prioritized design backlog",
          "60-minute cross-functional review",
        ],
        popular: true,
      },
      {
        name: "Design System Review",
        slug: "design-system-review",
        price: 3400,
        description: "A systematic review of reusable foundations and component behavior.",
        bestFor: "Teams scaling accessibility across multiple products",
        timeline: "2-3 weeks",
        scope: ["Up to 40 components", "Token and documentation review", "2 representative product flows"],
        deliverables: [
          "Color, type, spacing, and state-token evaluation",
          "Component behavior and variant review",
          "Keyboard, focus, naming, and status-message guidance",
          "Prioritized system-level recommendations",
          "Pattern examples for high-risk components",
          "90-minute design-system workshop",
        ],
      },
    ],
    addOns: [
      { name: "Additional screen or state", price: "$45", detail: "Adds one materially distinct design state." },
      { name: "Additional component", price: "$70", detail: "Adds one component and its documented variants." },
      { name: "Additional review round", price: "$350", detail: "Reviews revisions after the included rounds are complete." },
      { name: "Expedited delivery", price: "+25%", detail: "Shortens the agreed review window by approximately one-third." },
    ],
    assumptions: [
      "Editable design files and relevant component documentation are available at kickoff.",
      "The review covers design intent; coded implementation testing is a separate audit service.",
      "New screens added after kickoff use the published screen or component add-on price.",
    ],
  },
  userTesting: {
    service: "Accessibility user testing",
    contactService: "user-testing",
    intro:
      "Packages include research planning, standard participant recruitment and honoraria, moderated remote sessions, analysis, and a findings readout.",
    scopeNote:
      "Standard recruitment covers adult participants who use common assistive technologies. Highly specific professional, medical, geographic, or demographic criteria use the specialized recruitment add-on.",
    tiers: [
      {
        name: "Focused Study",
        slug: "focused-study",
        price: 2400,
        description: "A quick qualitative study of one important journey.",
        bestFor: "Early validation and post-remediation checks",
        timeline: "2-3 weeks",
        scope: ["3 disabled participants", "1 task flow", "Sessions up to 60 minutes"],
        deliverables: [
          "Research plan and accessible session materials",
          "Standard recruitment and participant honoraria",
          "Moderated remote sessions",
          "Task completion and barrier analysis",
          "Concise findings report",
          "45-minute stakeholder readout",
        ],
      },
      {
        name: "Product Study",
        slug: "product-study",
        price: 4200,
        description: "Balanced coverage across core journeys and assistive-technology experiences.",
        bestFor: "Product releases and experience validation",
        timeline: "3-4 weeks",
        scope: ["5 disabled participants", "Up to 2 task flows", "Sessions up to 60 minutes"],
        deliverables: [
          "Research plan and participant screener",
          "Recruitment and participant honoraria",
          "Moderated remote sessions",
          "Task metrics, observations, and anonymized quotations",
          "Severity-ranked findings with recommendations",
          "60-minute findings workshop",
        ],
        popular: true,
      },
      {
        name: "Extended Study",
        slug: "extended-study",
        price: 6800,
        description: "Broader evidence across multiple journeys and disability experiences.",
        bestFor: "Complex products and major redesigns",
        timeline: "4-6 weeks",
        scope: ["8 disabled participants", "Up to 4 task flows", "Sessions up to 75 minutes"],
        deliverables: [
          "Research plan, screener, and pilot session",
          "Recruitment and participant honoraria",
          "Moderated sessions across agreed access needs",
          "Quantitative task summary and qualitative analysis",
          "Detailed findings report and prioritized roadmap",
          "90-minute stakeholder workshop",
        ],
      },
    ],
    addOns: [
      { name: "Additional participant", price: "$650", detail: "Includes standard recruitment, honorarium, session, and analysis." },
      { name: "Additional task flow", price: "$400", detail: "Adds planning and analysis for one connected journey." },
      { name: "Specialized recruitment", price: "$300", detail: "Adds targeted sourcing for one specialized participant profile." },
      { name: "Edited highlight reel", price: "$500", detail: "An anonymized, captioned video summary subject to participant consent." },
    ],
    assumptions: [
      "The client provides a stable prototype or test environment and safe test accounts before sessions begin.",
      "Participant identities are protected and raw recordings are shared only when consent and the package allow it.",
      "Recruitment delays caused by unusually narrow criteria may extend the timeline and are discussed before kickoff.",
    ],
  },
  documentation: {
    service: "Accessibility compliance documentation",
    contactService: "documentation",
    intro:
      "Documentation is prepared from verifiable evidence and written for the audience that will use it, from customers and employees to procurement and legal teams.",
    scopeNote:
      "An ACR is a completed VPAT template. It must reflect current evaluation evidence; an audit is required when sufficient recent evidence is not available.",
    tiers: [
      {
        name: "Accessibility Statement",
        slug: "accessibility-statement",
        price: 450,
        description: "A clear public statement aligned with your current accessibility work.",
        bestFor: "Websites and products formalizing public commitments",
        timeline: "5 business days",
        scope: ["1 digital product", "1 stakeholder intake", "One revision round"],
        deliverables: [
          "Evidence and policy intake",
          "Custom accessibility statement",
          "Known limitations and feedback-channel wording",
          "Review and update schedule",
          "Web-ready and document formats",
        ],
      },
      {
        name: "Procurement Readiness Pack",
        slug: "procurement-readiness-pack",
        price: 1600,
        description: "A coherent documentation set for customer and procurement conversations.",
        bestFor: "B2B products responding to accessibility reviews",
        timeline: "2 weeks",
        scope: ["1 digital product", "Up to 2 stakeholder interviews", "Two revision rounds"],
        deliverables: [
          "Accessibility statement",
          "Internal accessibility policy",
          "Prioritized remediation roadmap",
          "Standard accessibility questionnaire response bank",
          "Evidence inventory and maintenance schedule",
          "60-minute stakeholder handoff",
        ],
        popular: true,
      },
      {
        name: "WCAG ACR Package",
        slug: "wcag-acr-package",
        price: 3400,
        description: "A completed WCAG-edition VPAT based on current audit evidence.",
        bestFor: "Software vendors entering enterprise or public procurement",
        timeline: "2-3 weeks after evidence is accepted",
        scope: ["1 product version", "WCAG edition VPAT", "One evidence set"],
        deliverables: [
          "Audit-evidence sufficiency review",
          "Completed Accessibility Conformance Report",
          "Criterion-level remarks and evidence traceability",
          "Internal risk and disclosure notes",
          "Stakeholder review meeting",
          "One revision round",
        ],
      },
    ],
    addOns: [
      { name: "Section 508 or EN 301 549 edition", price: "$650", detail: "Adds one additional VPAT edition using the same accepted evidence." },
      { name: "Additional product variant", price: "$1,200", detail: "Adds a related version with a documented difference review." },
      { name: "Annual ACR refresh", price: "$900", detail: "Updates one ACR when current change and test evidence is supplied." },
      { name: "Expedited delivery", price: "+25%", detail: "Shortens the documentation window by approximately one-third." },
    ],
    assumptions: [
      "The client confirms factual product, policy, support, and testing information before publication.",
      "The WCAG ACR package does not include a new audit; an audit package is added when current evidence is insufficient.",
      "Legal review and jurisdiction-specific legal advice are not included.",
    ],
  },
} satisfies Record<string, ServicePricingConfig>

export const serviceStartingPrices = {
  audits: servicePricing.audits.tiers[0].price,
  training: servicePricing.training.tiers[0].price,
  remediation: servicePricing.remediation.tiers[0].price,
  designReviews: servicePricing.designReviews.tiers[0].price,
  userTesting: servicePricing.userTesting.tiers[0].price,
  documentation: servicePricing.documentation.tiers[0].price,
}

export function toStructuredOffers(pricing: ServicePricingConfig) {
  return pricing.tiers.map((tier) => ({
    name: tier.name,
    description: tier.description,
    price: tier.price,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  }))
}
