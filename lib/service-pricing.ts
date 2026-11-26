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

export type ServiceCurrency = "USD" | "INR" | "EUR" | "CAD"

export interface ServicePricingConfig {
  service: string
  contactService: string
  intro: string
  scopeNote: string
  tiers: ServicePricingTier[]
  addOns: ServicePricingAddOn[]
  assumptions: string[]
  /**
   * Market packages (SEBI in India, EAA in Europe, AODA in Ontario) are priced
   * in the buyer's own currency. Omitted means USD, the global default.
   */
  currency?: ServiceCurrency
  /** Replaces the default USD payment and currency terms for a market package. */
  paymentTerms?: string
  currencyTerms?: string
}

const currencyLocales: Record<ServiceCurrency, string> = {
  USD: "en-US",
  INR: "en-IN",
  EUR: "en-IE",
  // en-US renders CAD as "CA$", so the price is never mistaken for US dollars.
  CAD: "en-US",
}

/** Formats a whole-unit price in the package currency, e.g. ₹29,999 or €590. */
export function formatServicePrice(price: number, currency: ServiceCurrency = "USD") {
  return new Intl.NumberFormat(currencyLocales[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price)
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
  /*
   * Market packages. Each one answers a specific regulatory trigger and is
   * priced in the buyer's currency, so a broker in Mumbai, a Shopify merchant in
   * Dublin and an Ontario business each see a price they can approve without a
   * conversion. They reuse the audit method above; only scope and evidence
   * differ.
   */
  sebiAudit: {
    service: "SEBI IAAP accessibility audit",
    contactService: "audit",
    currency: "INR",
    intro:
      "Fixed-price packages for SEBI-regulated entities, sized by how many digital platforms you run. Every package includes usability testing by persons with disabilities, which the SEBI circular requires.",
    scopeNote:
      "A platform is one website, one web application or one mobile app (Android and iOS count as two). A template is a distinct page or screen pattern; a task flow is an end-to-end journey such as account opening, login, placing an order or raising a grievance.",
    paymentTerms: "50% at booking and 50% when the audit report is delivered.",
    currencyTerms: "prices are in Indian rupees and exclude 18% GST, which is added to the invoice.",
    tiers: [
      {
        name: "SEBI Website Audit",
        slug: "sebi-website-audit",
        price: 39999,
        description: "One website audited and documented for the SEBI filing.",
        bestFor: "Investment advisers, research analysts, PMS, AIFs and RTAs with one website",
        timeline: "7-10 business days",
        scope: ["1 website", "Up to 10 page templates", "2 critical task flows", "Usability testing with 2 participants with disabilities"],
        deliverables: [
          "Manual WCAG 2.2 AA audit, mapped to GIGW 3.0 and IS 17802",
          "Audit report signed by an IAAP-certified auditor, with IAAP ID for your filing",
          "Usability testing findings from participants with disabilities",
          "Severity-ranked issue register with fix guidance",
          "One verification retest after remediation and a closure report",
        ],
      },
      {
        name: "SEBI Platform Audit",
        slug: "sebi-platform-audit",
        price: 124999,
        description: "Your website and your customer app, the platforms investors actually use.",
        bestFor: "Stock brokers, depository participants and AMCs",
        timeline: "2-3 weeks",
        scope: [
          "Up to 4 platforms (e.g. website, trading web app, Android app, iOS app)",
          "Up to 30 templates or screens in total",
          "4 critical task flows",
          "Usability testing with 3 participants with disabilities",
        ],
        deliverables: [
          "Everything in the SEBI Website Audit, for each platform",
          "TalkBack and VoiceOver testing on the mobile apps",
          "Remediation walkthrough with your development team or vendor",
          "One verification retest and a closure report per platform",
        ],
        popular: true,
      },
      {
        name: "SEBI Annual Programme",
        slug: "sebi-annual-programme",
        price: 249999,
        description: "Audit, remediation support and next year's audit, so the annual requirement is covered.",
        bestFor: "Entities with a trading platform, several apps or vendor-built systems",
        timeline: "3-4 weeks for the first audit",
        scope: [
          "Up to 6 platforms",
          "Up to 50 templates or screens in total",
          "6 critical task flows",
          "Usability testing with 4 participants with disabilities",
        ],
        deliverables: [
          "Everything in the SEBI Platform Audit",
          "Two verification retest rounds",
          "Monthly developer clinic until the closure report",
          "Next year's annual audit of the same scope included",
        ],
      },
    ],
    addOns: [
      { name: "Additional template or screen", price: "₹3,500", detail: "Adds one distinct page or screen pattern." },
      { name: "Additional task flow", price: "₹7,500", detail: "Adds one end-to-end journey with its relevant states." },
      { name: "Additional participant with a disability", price: "₹6,000", detail: "Adds one moderated usability session, including honorarium." },
      { name: "Accessibility statement", price: "₹9,999", detail: "Prepared from the audit evidence for your website and apps." },
    ],
    assumptions: [
      "Where a broker uses an uncustomised vendor platform, the vendor's own IAAP audit report may be relied on for that platform; your website, KYC flow and customised apps still need an audit.",
      "Filing with SEBI, the exchanges or the depositories is done by the regulated entity; the report gives you the auditor details and findings the forms ask for.",
      "Regulatory mapping is context, not legal advice.",
    ],
  },
  eaaShopify: {
    service: "European Accessibility Act audit for Shopify stores",
    contactService: "audit",
    currency: "EUR",
    intro:
      "Fixed-price audits built around how a Shopify store is made: your theme, the apps you install and your content. Each package ends with the accessibility information the EAA asks you to publish.",
    scopeNote:
      "A template is a distinct theme template such as home, collection, product, cart, search, account or a content page. A task flow is an end-to-end journey such as finding a product and reaching payment. Shopify hosts the checkout; issues in it are reported separately from issues you can fix.",
    paymentTerms: "packages under €1,000 are paid at booking; larger ones are 50% at booking and 50% at delivery.",
    currencyTerms: "prices are in euros and exclude any applicable VAT or local taxes.",
    tiers: [
      {
        name: "Shopify Store Audit",
        slug: "shopify-store-audit",
        price: 590,
        description: "A manual audit of the templates every customer passes through.",
        bestFor: "Shopify and Shopify Advanced stores on a standard or lightly edited theme",
        timeline: "5-7 business days",
        scope: ["Up to 7 theme templates", "1 purchase flow, browse to payment", "Desktop and mobile"],
        deliverables: [
          "Manual WCAG 2.2 AA review against EN 301 549",
          "Keyboard, screen-reader and zoom checks",
          "Issues grouped by theme code, installed app and content",
          "Accessibility statement draft covering the EAA information duty",
          "One verification retest within 30 days",
        ],
      },
      {
        name: "Shopify Audit and Fix",
        slug: "shopify-audit-and-fix",
        price: 1490,
        description: "The audit, plus the theme fixes done for you on a duplicate theme.",
        bestFor: "Stores that want issues fixed, not just listed",
        timeline: "2-3 weeks",
        scope: ["Up to 10 theme templates", "3 task flows", "Desktop and mobile", "Theme fixes for up to 15 issues"],
        deliverables: [
          "Everything in the Shopify Store Audit",
          "Fixes in Liquid, CSS and JavaScript on an unpublished copy of your theme",
          "Review of installed apps, with replacement suggestions where an app blocks access",
          "Before-and-after evidence for each fix",
          "Retest of the published theme",
        ],
        popular: true,
      },
      {
        name: "Shopify Plus and Headless",
        slug: "shopify-plus-and-headless",
        price: 2900,
        description: "For custom storefronts, checkout extensions and more than one market.",
        bestFor: "Shopify Plus, Hydrogen and multi-market stores",
        timeline: "3-4 weeks",
        scope: ["Up to 15 templates", "5 task flows", "Checkout UI extensions", "Up to 2 languages or markets"],
        deliverables: [
          "Everything in the Shopify Store Audit",
          "Checkout extension and custom app review",
          "VoiceOver and TalkBack testing on mobile",
          "Prioritized remediation backlog for your developers",
          "Accessibility statement for each market",
        ],
      },
    ],
    addOns: [
      { name: "Additional template", price: "€120", detail: "Adds one distinct theme template." },
      { name: "Additional language or market", price: "€250", detail: "Adds a translated storefront and its statement." },
      { name: "Additional 10 theme fixes", price: "€690", detail: "Added after the audit, once the fixes are scoped." },
      { name: "Quarterly re-check", price: "€190", detail: "Re-tests your key templates after theme or app updates." },
    ],
    assumptions: [
      "Theme fixes are made on a duplicate theme and published by you or with your approval.",
      "Issues inside Shopify-hosted checkout or third-party apps are documented with evidence for you to raise with Shopify or the app developer.",
      "Microenterprise exemptions and legal scope are context, not legal advice.",
    ],
  },
  aoda: {
    service: "AODA website compliance",
    contactService: "audit",
    currency: "CAD",
    intro:
      "Fixed-price packages for Ontario organizations, from the WCAG 2.0 AA website audit the AODA requires to the policies and plan behind your compliance report.",
    scopeNote:
      "A template is a distinct page or screen pattern. A task flow is an end-to-end journey such as booking, applying, paying or contacting you.",
    paymentTerms: "packages under CA$1,500 are paid at booking; larger ones are 50% at booking and 50% at delivery.",
    currencyTerms: "prices are in Canadian dollars and exclude any applicable sales tax.",
    tiers: [
      {
        name: "AODA Website Audit",
        slug: "aoda-website-audit",
        price: 1190,
        description: "The website audit section 14 of the IASR calls for, with evidence you can keep on file.",
        bestFor: "Ontario businesses and non-profits with 50 or more employees",
        timeline: "7-10 business days",
        scope: ["Up to 8 page templates", "2 critical task flows", "Desktop and mobile"],
        deliverables: [
          "Manual WCAG 2.0 AA audit, with WCAG 2.1 and 2.2 gaps noted",
          "Keyboard and screen-reader checks",
          "Severity-ranked issue register with fix guidance",
          "Conformance summary to support your compliance report",
          "One verification retest within 30 days",
        ],
      },
      {
        name: "AODA Compliance Pack",
        slug: "aoda-compliance-pack",
        price: 2900,
        description: "The audit plus the documents behind your compliance report.",
        bestFor: "Organizations filing the 31 December 2026 compliance report",
        timeline: "2-3 weeks",
        scope: ["Up to 12 page templates", "3 task flows", "Policy and plan documents"],
        deliverables: [
          "Everything in the AODA Website Audit",
          "Accessibility policy and statement of commitment",
          "Multi-year accessibility plan",
          "Feedback and accessible-formats procedures",
          "Compliance report question-by-question evidence notes",
        ],
        popular: true,
      },
      {
        name: "Canada Accessibility Programme",
        slug: "canada-accessibility-programme",
        price: 5900,
        description: "For organizations covered by both the AODA and the Accessible Canada Act.",
        bestFor: "Federally regulated or multi-site organizations",
        timeline: "4-5 weeks",
        scope: ["Up to 20 templates", "1 mobile app", "5 task flows", "Policy, plan and report documents"],
        deliverables: [
          "Everything in the AODA Compliance Pack",
          "WCAG 2.1 AA audit mapped to CAN/ASC-EN 301 549:2024",
          "Accessible Canada Act plan or progress report support",
          "90-minute team training session",
          "Prioritized two-year remediation roadmap",
        ],
      },
    ],
    addOns: [
      { name: "Additional page template", price: "CA$150", detail: "Adds one distinct page or screen pattern." },
      { name: "Additional task flow", price: "CA$300", detail: "Adds one end-to-end journey with its relevant states." },
      { name: "French-language site", price: "CA$450", detail: "Audits the French version of the same templates." },
      { name: "PDF documents", price: "from CA$4/page", detail: "Remediates forms, reports and other web documents." },
    ],
    assumptions: [
      "The compliance report is filed by your organization through the Ontario government's reporting portal.",
      "Employee counts and which AODA and Accessible Canada Act duties apply are confirmed by you.",
      "Regulatory mapping is context, not legal advice.",
    ],
  },
} satisfies Record<string, ServicePricingConfig>

/**
 * PDF remediation is priced per page rather than per project, because the unit
 * of work is a page and document sets vary from 4 pages to several thousand.
 * The driver of cost is structural complexity, not page count, so the ladder is
 * banded by what actually has to be built: reading order and headings at the
 * bottom, table and form semantics in the middle, OCR and figure descriptions at
 * the top. A single document is banded per page, so a 40-page report with 6
 * table pages is billed as 34 standard plus 6 structured.
 */
export interface PdfPricingTier {
  name: string
  slug: string
  pricePerPage: number
  description: string
  bestFor: string
  turnaround: string
  characteristics: string[]
  deliverables: string[]
  popular?: boolean
}

export interface PdfPricingConfig {
  service: string
  contactService: string
  intro: string
  scopeNote: string
  minimumOrder: number
  tiers: PdfPricingTier[]
  addOns: ServicePricingAddOn[]
  assumptions: string[]
}

export const pdfPricing = {
  service: "PDF accessibility remediation",
  contactService: "pdf-remediation",
  intro:
    "Tagged, PDF/UA-conformant documents priced per page by complexity. Send the files and we band each page before quoting, so the total is fixed before work begins.",
  scopeNote:
    "Pages are banded individually within a document. A 40-page report with 6 table-heavy pages is billed as 34 standard pages plus 6 structured pages, not at the higher rate throughout.",
  minimumOrder: 150,
  tiers: [
    {
      name: "Standard page",
      slug: "standard-page",
      pricePerPage: 3,
      description: "Text-led pages with a single linear reading order.",
      bestFor: "Reports, policies, letters, and text-led brochures",
      turnaround: "3-5 business days",
      characteristics: [
        "Single-column, text-led layout",
        "Headings, lists, and links",
        "Decorative images that can be artifacted",
        "No tables, forms, or scanned content",
      ],
      deliverables: [
        "Full tag tree with correct semantic structure",
        "Logical reading order and tab order",
        "Heading hierarchy mapped to document outline",
        "Alt text on meaningful images",
        "Document language, title, and metadata set",
      ],
    },
    {
      name: "Structured page",
      slug: "structured-page",
      pricePerPage: 7,
      description: "Pages whose meaning depends on layout that must be rebuilt in the tag tree.",
      bestFor: "Financial statements, data reports, and multi-column publications",
      turnaround: "5-8 business days",
      characteristics: [
        "Data tables needing header scope and spans",
        "Multi-column or sidebar layouts",
        "Footnotes, endnotes, and cross-references",
        "Nested or multi-level lists",
      ],
      deliverables: [
        "Everything in Standard page",
        "Table header associations, scope, and merged-cell handling",
        "Corrected reading order across columns and callouts",
        "Footnote and reference links wired to their targets",
      ],
      popular: true,
    },
    {
      name: "Complex page",
      slug: "complex-page",
      pricePerPage: 12,
      description: "Pages needing interactive semantics, described visuals, or recovered text.",
      bestFor: "Application forms, prospectuses, scanned archives, and infographics",
      turnaround: "8-12 business days",
      characteristics: [
        "Interactive form fields needing labels and tooltips",
        "Charts, maps, and infographics needing described alternatives",
        "Scanned or image-only pages needing OCR",
        "Mathematical or scientific notation",
      ],
      deliverables: [
        "Everything in Structured page",
        "Labelled, keyboard-operable form fields in correct tab order",
        "Long descriptions for charts and infographics",
        "OCR with proofread text layer for scanned pages",
      ],
    },
  ],
  addOns: [
    { name: "Accessibility rush", price: "+35%", detail: "Roughly halves the agreed turnaround window." },
    { name: "Source file rebuild", price: "$18/page", detail: "Rebuilds tags in the InDesign or Word source so future exports stay accessible." },
    { name: "PDF/UA conformance report", price: "$120", detail: "Per document set, with checkpoint-by-checkpoint evidence." },
    { name: "Remediation training", price: "$600", detail: "Half-day session on tagging your own documents in Acrobat." },
  ],
  assumptions: [
    "Pricing assumes the supplied PDF is the final approved version; content changes after tagging are re-banded.",
    "Files are banded from the actual documents before a fixed total is confirmed, never estimated from page count alone.",
    "Every delivered file is checked against PDF/UA (ISO 14289-1) and the applicable WCAG 2.2 AA criteria before handover.",
    "Documents containing personal or regulated data are handled under a signed agreement before transfer.",
  ],
} satisfies PdfPricingConfig

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
    priceCurrency: pricing.currency ?? "USD",
    availability: "https://schema.org/InStock",
  }))
}
