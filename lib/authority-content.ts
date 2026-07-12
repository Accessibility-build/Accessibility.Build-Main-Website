export interface CaseStudy {
  slug: string
  title: string
  category: string
  summary: string
  engagement: string
  disclosure: string
  challenge: string
  approach: string[]
  deliverables: string[]
  outcomes: string[]
  technologies: string[]
  evidenceLevel: "Founder project record"
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "enterprise-accessibility-operations-suite",
    title: "Enterprise Accessibility Operations Suite",
    category: "Platform architecture and accessible delivery",
    summary:
      "A connected client, administration, and developer platform for managing the accessibility lifecycle from audit intake through remediation and ongoing maintenance.",
    engagement: "Product architecture, accessible frontend engineering, workflow design, and quality validation",
    disclosure:
      "The client identity and confidential implementation details are withheld. This selected-work record is based on Khushwant Parihar's delivery record and is not presented as a client endorsement.",
    challenge:
      "Accessibility work was distributed across teams, spreadsheets, documents, and status updates. Different roles needed one dependable workflow without losing ownership, evidence, or remediation history.",
    approach: [
      "Designed separate client, administration, and developer experiences around role-specific tasks.",
      "Modelled the complete audit, validation, remediation, verification, and maintenance lifecycle.",
      "Applied semantic structure, keyboard operation, focus management, status communication, and accessible form patterns across shared components.",
      "Created role-based access and review states so findings could move through the workflow without losing accountability.",
      "Tested critical workflows using keyboard interaction, screen-reader review, and automated checks as supporting evidence.",
    ],
    deliverables: [
      "Three connected role-based portals",
      "Audit and finding lifecycle workflows",
      "Accessible shared component patterns",
      "Remediation ownership and status history",
      "Validation and handoff documentation",
    ],
    outcomes: [
      "Created one operational source of truth for accessibility activity.",
      "Made ownership and remediation status visible across client and delivery roles.",
      "Embedded accessibility behavior into the platform interface instead of treating it as a reporting-only feature.",
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "REST APIs", "WCAG 2.2"],
    evidenceLevel: "Founder project record",
  },
  {
    slug: "accessible-audit-management-platform",
    title: "Accessible Audit Management Platform",
    category: "Audit workflow and remediation operations",
    summary:
      "A web application for organizing accessibility findings, severity review, evidence, ownership, and remediation progress across a product team.",
    engagement: "Accessible application development, audit workflow modelling, and AI-assisted triage design",
    disclosure:
      "The organization and proprietary product details are confidential. This page describes the founder's contribution and does not imply a public client testimonial or independent outcome verification.",
    challenge:
      "Audit teams needed to turn large volumes of findings into consistent, reviewable work without allowing automated classification to replace practitioner judgment.",
    approach: [
      "Designed a structured issue model for criterion mapping, severity, evidence, user impact, ownership, and retest state.",
      "Used AI-assisted classification as a draft signal while retaining human review and correction before findings became authoritative.",
      "Implemented keyboard-accessible tables, forms, filters, status controls, and error handling.",
      "Separated detected, confirmed, remediated, verified, and residual-risk states to avoid overstating conformance.",
      "Built reporting views for engineering teams and decision-makers with different information needs.",
    ],
    deliverables: [
      "Finding and evidence management workflow",
      "Human-reviewed severity and classification flow",
      "Accessible filtering and status controls",
      "Engineering and stakeholder reporting views",
      "Remediation and verification history",
    ],
    outcomes: [
      "Reduced reliance on disconnected documents and manual status reconciliation.",
      "Made human review explicit in AI-assisted accessibility operations.",
      "Improved traceability from an original barrier through remediation and verification.",
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "AI-assisted workflows", "axe-core"],
    evidenceLevel: "Founder project record",
  },
  {
    slug: "legacy-cms-accessibility-remediation",
    title: "Legacy CMS Accessibility Remediation",
    category: "WordPress, Shopify, and Drupal remediation",
    summary:
      "Accessibility remediation across legacy content-management themes and templates, focusing on reusable fixes rather than isolated page patches.",
    engagement: "Audit support, theme and component remediation, keyboard testing, and implementation guidance",
    disclosure:
      "Multiple client identities and site details are confidential. Outcomes are intentionally qualitative because no client-approved public measurements or endorsements are available.",
    challenge:
      "Legacy themes repeated the same barriers across navigation, forms, product cards, dialogs, and content templates. Fixing individual pages would have left the underlying components unchanged.",
    approach: [
      "Identified repeated barriers at theme, template, plugin, and shared-component level.",
      "Prioritized native HTML and corrected semantics before introducing ARIA.",
      "Remediated keyboard navigation, focus behavior, form labels, validation, headings, names, and contrast issues.",
      "Tested representative templates and high-value user journeys instead of claiming every generated URL was reviewed.",
      "Documented maintenance guidance so future content and plugin changes could be checked consistently.",
    ],
    deliverables: [
      "Representative-template issue register",
      "Theme and component code changes",
      "Keyboard and screen-reader validation notes",
      "Content-author guidance",
      "Residual-risk and maintenance recommendations",
    ],
    outcomes: [
      "Moved recurring fixes into reusable templates and components.",
      "Reduced the likelihood that the same barrier would be recreated on every page instance.",
      "Provided maintainers with a clearer accessibility review process for future changes.",
    ],
    technologies: ["WordPress", "Shopify", "Drupal", "PHP", "JavaScript", "WCAG 2.2"],
    evidenceLevel: "Founder project record",
  },
]

export const subprocessors = [
  {
    provider: "Clerk",
    purpose: "Authentication, account management, and session security",
    data: "Account identifiers, name, email, authentication and session data",
    location: "Provider-controlled global infrastructure",
    conditional: "Used for account features",
    policy: "https://clerk.com/legal/privacy",
  },
  {
    provider: "Vercel",
    purpose: "Hosting, content delivery, performance, and aggregate analytics",
    data: "Request, device, network, performance, and deployment data",
    location: "Provider-controlled global infrastructure",
    conditional: "Used across the website",
    policy: "https://vercel.com/legal/privacy-policy",
  },
  {
    provider: "Google Analytics",
    purpose: "Optional website usage analytics",
    data: "Consent-dependent browser, page, event, and approximate location data",
    location: "Provider-controlled global infrastructure",
    conditional: "Loads only after analytics consent",
    policy: "https://policies.google.com/privacy",
  },
  {
    provider: "Stripe",
    purpose: "International payment processing, billing, fraud prevention, and refunds",
    data: "Billing identity, payment and transaction data",
    location: "Provider-controlled global infrastructure",
    conditional: "Used when Stripe is the selected payment provider",
    policy: "https://stripe.com/privacy",
  },
  {
    provider: "Razorpay",
    purpose: "India-region payment processing, billing, fraud prevention, and refunds",
    data: "Billing identity, payment and transaction data",
    location: "India and provider-controlled infrastructure",
    conditional: "Used when Razorpay is the selected payment provider",
    policy: "https://razorpay.com/privacy/",
  },
  {
    provider: "OpenAI",
    purpose: "AI-assisted tool features",
    data: "Feature input such as prompts, images, code, or issue descriptions",
    location: "Provider-controlled global infrastructure",
    conditional: "Used only by features configured for OpenAI",
    policy: "https://openai.com/policies/privacy-policy/",
  },
  {
    provider: "Anthropic and OpenRouter",
    purpose: "Alternative AI-assisted analysis and generation",
    data: "Feature input such as prompts, code, or issue descriptions",
    location: "Provider-controlled global infrastructure",
    conditional: "Used only when the relevant model provider is selected",
    policy: "https://www.anthropic.com/legal/privacy",
  },
  {
    provider: "Sanity",
    purpose: "Content management and blog delivery",
    data: "Published editorial content and content-management account data",
    location: "Provider-controlled global infrastructure",
    conditional: "Used for published content",
    policy: "https://www.sanity.io/legal/privacy",
  },
  {
    provider: "Formspree and Resend",
    purpose: "Contact-form delivery and requested or transactional email",
    data: "Name, email, message, organization, and email delivery metadata",
    location: "Provider-controlled global infrastructure",
    conditional: "Used when a form or email workflow is requested",
    policy: "https://formspree.io/legal/privacy-policy/",
  },
] as const
