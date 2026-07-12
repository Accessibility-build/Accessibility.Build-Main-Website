/**
 * Ready-to-send marketing email templates for the admin marketing panel.
 *
 * The email renderer automatically prepends "Hi {firstName || 'there'}," before
 * the body (see renderMarketingCampaignEmail in lib/email/templates.ts), so the
 * body below must NOT include its own greeting. Start with the opening line.
 *
 * Line breaks are preserved in the rendered HTML (each blank-line-separated
 * chunk becomes a <p>).
 */

export type MarketingTemplateCategory =
  | 'outreach'
  | 'promotion'
  | 'follow_up'
  | 'newsletter'
  | 'announcement'
  | 're_engagement'
  | 'social_proof'

export interface MarketingEmailTemplate {
  id: string
  name: string
  category: MarketingTemplateCategory
  description: string
  subject: string
  preheader: string
  heading: string
  body: string
  ctaLabel?: string
  ctaUrl?: string
  reason: string
}

const CATEGORY_LABELS: Record<MarketingTemplateCategory, string> = {
  outreach: 'Cold outreach',
  promotion: 'Promotion',
  follow_up: 'Follow-up',
  newsletter: 'Newsletter',
  announcement: 'Announcement',
  re_engagement: 'Re-engagement',
  social_proof: 'Social proof',
}

export function getMarketingCategoryLabel(category: MarketingTemplateCategory): string {
  return CATEGORY_LABELS[category]
}

export const MARKETING_EMAIL_TEMPLATES: MarketingEmailTemplate[] = [
  {
    id: 'free-audit-offer',
    name: 'Free Accessibility Audit Offer',
    category: 'outreach',
    description:
      'Offer a no-strings audit on a few high-priority pages and send back a plain-English report.',
    subject: "A free accessibility audit on a few of your key pages",
    preheader:
      "We'll audit 3–5 high-priority pages and send you a plain-English report — no strings attached.",
    heading: "A free look at your site's accessibility",
    body: `Hope you're doing well.

We're running a short program this month where we audit 3 to 5 high-priority pages on a handful of sites and send the team a short, plain-English report.

Here's what's included:
- A WCAG 2.2 AA scan of the pages you pick (home, checkout, account, anything critical)
- A ranked list of the most impactful issues — not a 400-item dump
- Specific fixes your developers can act on this week

If the report is useful and you'd like help fixing what we find, we can jump on a 20-minute call to scope the work. If it isn't, you keep the report either way.

Just reply with the pages you'd like us to look at and we'll take it from there.

— Khushwant Parihar, Accessibility.build`,
    ctaLabel: 'Request your free audit',
    ctaUrl: 'https://accessibility.build/contact',
    reason: 'Cold outreach offering a free multi-page accessibility audit',
  },
  {
    id: 'ada-lawsuit-risk',
    name: 'ADA Lawsuit Risk Awareness',
    category: 'outreach',
    description:
      'Surface the legal risk of an inaccessible site and point to a free risk scan.',
    subject: 'Could accessibility barriers be creating avoidable risk?',
    preheader:
      'A focused scan can surface common barriers, but it is not a legal opinion or conformance audit.',
    heading: 'Find common barriers before they compound',
    body: `Digital accessibility complaints and procurement reviews often surface recurring barriers such as missing text alternatives, unlabeled fields, inaccessible menus, keyboard failures, and insufficient contrast. Their impact and remediation effort depend on the product and implementation.

Accessibility.build provides a free risk-screening tool for a public page. It can help identify common technical signals and organize next steps, but it is not a complete audit, certification, or legal opinion.

If it surfaces something that needs hands-on help, we're happy to talk. No pressure either way.

— Khushwant Parihar, Accessibility.build`,
    ctaLabel: "Check your site's ADA risk",
    ctaUrl: 'https://accessibility.build/tools/ada-compliance-risks',
    reason: 'Educational outreach on ADA lawsuit risk with free scan CTA',
  },
  {
    id: 'scoped-audit-introduction',
    name: 'Scoped Accessibility Audit Introduction',
    category: 'outreach',
    description:
      'Introduce the published audit packages and invite a clearly scoped enquiry.',
    subject: 'A defined accessibility audit scope for your priority journeys',
    preheader:
      'Manual and automated testing with documented evidence, limitations, and remediation guidance.',
    heading: 'Start with a scope your team can evaluate',
    body: `Accessibility.build publishes fixed-scope starting packages so you can review the sample, deliverables, timeline, assumptions, and price before making an enquiry. A typical audit can include:

- WCAG 2.2 evaluation across agreed pages and important user journeys
- Manual testing with screen readers and keyboard-only flows
- A prioritized remediation roadmap your team can work from
- A named findings readout and documented limitations

The exact page sample, environments, assistive technologies, delivery date, and retest terms are confirmed in writing before work begins.

Use the link below to inspect the published package details, or reply with the workflows you need assessed.

— Khushwant Parihar, Accessibility.build`,
    ctaLabel: 'Review audit packages',
    ctaUrl: 'https://accessibility.build/services/accessibility-audits',
    reason: 'Truthful introduction to published accessibility audit packages',
  },
  {
    id: 'free-report-delivered',
    name: 'Free Report Delivered (Follow-up)',
    category: 'follow_up',
    description:
      'Deliver a completed free audit report and offer a 20-minute review call.',
    subject: 'Your free accessibility report is ready',
    preheader:
      "Here's what we found on the pages you shared, and what to do next.",
    heading: 'Your accessibility snapshot',
    body: `Thanks for letting us take a look at your site. We've finished the audit on the pages you shared, and your report is ready to review.

A few headlines before you open it:
- We found a handful of high-impact issues that affect keyboard and screen reader users on your most-visited flows
- Most of them can be addressed by your team without a full redesign
- A smaller set are architectural and are worth a short conversation

Nothing about this is urgent on our end — take your time with it. If you'd like to walk through the findings together, grab a slot on our calendar below.

— Khushwant Parihar, Accessibility.build`,
    ctaLabel: 'Book a 20-minute review',
    ctaUrl: 'https://accessibility.build/contact',
    reason: 'Delivering completed free audit report with follow-up call offer',
  },
  {
    id: 'audit-proposal',
    name: 'Post-Audit Remediation Proposal',
    category: 'follow_up',
    description:
      'Propose a scoped remediation engagement after a free or paid audit.',
    subject: 'A proposal for the issues we found in your audit',
    preheader:
      "How we'd tackle the high-impact items from your accessibility report, step by step.",
    heading: "Let's fix what we found",
    body: `Following up on the accessibility report we shared. We've put together a short proposal for how we'd work alongside your team to close out the high and medium-impact issues over the next few weeks.

At a glance, it includes:
- Fixes for the top accessibility barriers, in order of impact
- Clear handoff docs and patches your developers can merge directly
- A final re-test so you have documented evidence of the work

Everything is scoped so you can start small — a single journey, a single template — and expand if it's useful.

Happy to walk through it on a call, or just send you the full document. Whatever is easier.

— Khushwant Parihar, Accessibility.build`,
    ctaLabel: 'View the proposal',
    ctaUrl: 'https://accessibility.build/contact',
    reason: 'Following up a free audit with a paid remediation proposal',
  },
  {
    id: 'wcag-2-2-update',
    name: 'WCAG 2.2 Update (Newsletter)',
    category: 'newsletter',
    description:
      'Educational newsletter summarizing the three WCAG 2.2 criteria that affect most teams.',
    subject: 'WCAG 2.2 in 5 minutes — what actually changed',
    preheader:
      'Nine new success criteria, and the three that are most likely to affect your team.',
    heading: "WCAG 2.2 is live — here's what it means",
    body: `WCAG 2.2 is a W3C Recommendation and adds nine success criteria to WCAG 2.1. Laws, policies, and procurement requirements may reference different WCAG versions and conformance levels, so teams should confirm the standard that applies to their context.

The three worth knowing about first:
- Focus Not Obscured — sticky headers and cookie banners can no longer hide the focused element
- Dragging Movements — drag-based interactions need a non-dragging alternative
- Accessible Authentication — sign-in flows can't require users to memorize passwords or solve cognitive puzzles

We put together a short checklist that maps each new criterion to the code patterns teams most often get wrong. It's free, no form to fill in.

— Khushwant Parihar, Accessibility.build`,
    ctaLabel: 'Read the WCAG 2.2 checklist',
    ctaUrl: 'https://accessibility.build/checklists/wcag-2-2',
    reason: 'Monthly newsletter: plain-English WCAG 2.2 summary',
  },
  {
    id: 'sample-report-evidence',
    name: 'Sample Audit Report Evidence',
    category: 'outreach',
    description:
      'Share the public sample report so prospects can inspect the deliverable structure.',
    subject: 'Inspect an accessibility audit report before engaging',
    preheader:
      'A clearly labelled fictional example covering scope, findings, evidence, remediation, and limitations.',
    heading: 'See how findings are documented',
    body: `Accessibility.build has published a sample accessibility audit report so teams can inspect the reporting structure before commissioning work.

The sample covers:
- Scope, environments, standards, and exclusions
- Reproducible findings with user impact and WCAG mapping
- Evidence, remediation guidance, and verification status
- Report-level limitations and interpretation notes

The scenario and product are fictional and clearly labelled. It is a format example, not a client engagement, endorsement, certification, or claim of conformance.

The accessible HTML version is the primary format, with a downloadable PDF also available.

— Khushwant Parihar, Accessibility.build`,
    ctaLabel: 'Inspect the sample report',
    ctaUrl: 'https://accessibility.build/sample-audit-report',
    reason: 'Share a clearly labelled report-format example without client claims',
  },
  {
    id: 're-engagement',
    name: 'Dormant Lead Re-engagement',
    category: 're_engagement',
    description:
      'Low-pressure check-in for leads who went quiet, with free resources as the next step.',
    subject: "Still thinking about accessibility? We're still here.",
    preheader:
      "A low-pressure check-in and a couple of free resources if you're ready to pick it back up.",
    heading: "It's been a minute",
    body: `We haven't heard from you in a while, which is completely fine — accessibility work rarely gets to be the top priority until it suddenly has to be.

If you're ready to look at it again, a few low-friction starting points:
- Run our free scanner on any page and see where you stand
- Flip through our WCAG 2.2 checklist for a baseline
- Or just reply to this email with where you're stuck and we'll point you in the right direction

No follow-up sequence, no sales call — just here when it's useful.

— Khushwant Parihar, Accessibility.build`,
    ctaLabel: 'Run a free scan',
    ctaUrl: 'https://accessibility.build/tools/url-accessibility-auditor',
    reason: 'Re-engagement email for dormant leads with free scanner CTA',
  },
  {
    id: 'product-update',
    name: 'Product Update (Active Users)',
    category: 'announcement',
    description:
      'Announce published business, delivery, and evidence resources to active users.',
    subject: "New ways to evaluate Accessibility.build before engaging",
    preheader:
      'Founder identity, sample deliverables, selected work, and procurement details are now public.',
    heading: 'More evidence, clearer accountability',
    body: `A short update on the public evidence now available from Accessibility.build:

- A named founder profile with professional experience and authorship
- A sample accessibility audit report in accessible HTML and downloadable PDF
- Selected-work records with explicit confidentiality and evidence limitations
- A procurement centre with GST registration, scope, data, and provider information

These pages are public so teams can inspect how work is scoped and documented before starting a conversation. Questions or corrections are welcome by reply.

— Khushwant Parihar, Accessibility.build`,
    ctaLabel: 'Review the trust centre',
    ctaUrl: 'https://accessibility.build/trust',
    reason: 'Announce verified authority and procurement resources',
  },
  {
    id: 'discovery-call',
    name: 'Free 20-Minute Working Session',
    category: 'outreach',
    description:
      'Invite prospects to a no-pitch 20-minute working session to map a roadmap.',
    subject: '20 minutes to map out your accessibility roadmap',
    preheader:
      'A free working session — no slides, no pitch, just a plan you can take back to your team.',
    heading: 'A quick working session on us',
    body: `If accessibility is on your roadmap this quarter and you're not sure where to start, we're offering a free 20-minute working session this month.

How it works:
- You send us a URL and a rough idea of your team's size and timeline
- We audit the page live with you on the call
- You walk away with a prioritized list of what to tackle first — and an honest read on whether you need outside help at all

No slides, no pitch deck, no sales follow-up you didn't ask for. Just a working plan you can use however you like.

— Khushwant Parihar, Accessibility.build`,
    ctaLabel: 'Grab a session slot',
    ctaUrl: 'https://accessibility.build/contact',
    reason: 'Inviting prospects to a free 20-minute working session',
  },
]
