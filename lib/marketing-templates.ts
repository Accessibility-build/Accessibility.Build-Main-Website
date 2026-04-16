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

— The Accessibility.build team`,
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
    subject: 'ADA web lawsuits are still rising — is your site covered?',
    preheader:
      'A quick scan can tell you where you stand before a demand letter does.',
    heading: 'Know your ADA exposure before someone else does',
    body: `Over 4,000 ADA-related web accessibility lawsuits were filed last year, and the number keeps climbing. Most of them come from a small set of predictable issues — missing alt text, unlabeled form fields, inaccessible menus, low contrast — all of which are usually easy to fix once you know where to look.

We put together a free risk scan that flags the most common legal red flags on any public page. It takes about a minute to run, and you'll get a prioritized list of what to address first.

If it surfaces something that needs hands-on help, we're happy to talk. No pressure either way.

— The Accessibility.build team`,
    ctaLabel: "Check your site's ADA risk",
    ctaUrl: 'https://accessibility.build/tools/ada-compliance-risks',
    reason: 'Educational outreach on ADA lawsuit risk with free scan CTA',
  },
  {
    id: 'first-audit-discount',
    name: '30% Off First Audit (Limited Time)',
    category: 'promotion',
    description:
      'Month-long promotion — 30% off the full accessibility audit package.',
    subject: '30% off your first accessibility audit — this month only',
    preheader:
      'A full WCAG 2.2 AA audit and remediation roadmap at our lowest price of the year.',
    heading: '30% off, just for this month',
    body: `For the rest of this month, we're offering 30% off our standard accessibility audit package. That includes:

- A full WCAG 2.2 AA audit across your most important user journeys
- Manual testing with screen readers and keyboard-only flows
- A prioritized remediation roadmap your team can work from
- A 60-minute walkthrough with one of our accessibility engineers

If accessibility has been sitting on your backlog and you want a clean starting point, this is a good moment.

The offer ends at the end of the month. Use the link below or just reply to this email and we'll get you set up.

— The Accessibility.build team`,
    ctaLabel: 'Claim your 30% off',
    ctaUrl: 'https://accessibility.build/services/accessibility-audits',
    reason: 'Limited-time 30% off promotion on accessibility audits',
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

— The Accessibility.build team`,
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

— The Accessibility.build team`,
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
    body: `WCAG 2.2 is now the recommended standard for most web accessibility laws and procurement requirements. It adds nine new success criteria on top of 2.1 — but only a few will realistically change how most teams build.

The three worth knowing about first:
- Focus Not Obscured — sticky headers and cookie banners can no longer hide the focused element
- Dragging Movements — drag-based interactions need a non-dragging alternative
- Accessible Authentication — sign-in flows can't require users to memorize passwords or solve cognitive puzzles

We put together a short checklist that maps each new criterion to the code patterns teams most often get wrong. It's free, no form to fill in.

— The Accessibility.build team`,
    ctaLabel: 'Read the WCAG 2.2 checklist',
    ctaUrl: 'https://accessibility.build/checklists/wcag-2-2',
    reason: 'Monthly newsletter: plain-English WCAG 2.2 summary',
  },
  {
    id: 'case-study',
    name: 'Customer Case Study (Social Proof)',
    category: 'social_proof',
    description:
      'Short outcome-focused case study to build trust with prospects on the fence.',
    subject: 'How one team cut accessibility issues by 84% in six weeks',
    preheader:
      'A short look at how a fintech team moved from failing audits to shipping confidently.',
    heading: 'From 312 issues to 48 — in six weeks',
    body: `We recently wrapped up an engagement with a mid-sized fintech team that was preparing for a procurement review. Their initial audit flagged 312 WCAG 2.2 AA issues across their main product — enough to block the deal.

Six weeks later:
- 264 issues resolved, 48 remaining (most minor)
- A single re-audit pass, fully documented
- An accessibility statement they were comfortable publishing
- And, importantly, the deal went through

The work wasn't glamorous — it was two engineers focused on the right issues, in the right order, with clear tests. That's most of what accessibility work actually is.

If you've got a deadline of your own coming up, we'd be glad to talk through what a similar plan would look like for your team.

— The Accessibility.build team`,
    ctaLabel: 'Talk to our team',
    ctaUrl: 'https://accessibility.build/contact',
    reason: 'Case study email — 84% issue reduction, used for social proof',
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

— The Accessibility.build team`,
    ctaLabel: 'Run a free scan',
    ctaUrl: 'https://accessibility.build/tools/url-accessibility-auditor',
    reason: 'Re-engagement email for dormant leads with free scanner CTA',
  },
  {
    id: 'product-update',
    name: 'Product Update (Active Users)',
    category: 'announcement',
    description:
      'Monthly product changelog for active users — shipped features and improvements.',
    subject: "What's new in Accessibility.build this month",
    preheader:
      'A sharper dashboard, faster audits, and a handful of fixes you asked for.',
    heading: 'Updates worth a minute of your time',
    body: `A short update on what's shipped in Accessibility.build over the last few weeks:

- Faster audits — single-page scans now run in under a second on most sites
- Clearer reports — issues are grouped by user impact, not raw rule ID
- Team workspaces — share audits and remediation tasks across your team without juggling exports
- A couple of fixes for false positives on custom form widgets (thanks for the reports)

Everything above is already live in your dashboard. If you try the new report view and have thoughts, we'd genuinely like to hear them — just reply to this email.

— The Accessibility.build team`,
    ctaLabel: 'Open your dashboard',
    ctaUrl: 'https://accessibility.build/dashboard',
    reason: 'Monthly product update / changelog for active users',
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

— The Accessibility.build team`,
    ctaLabel: 'Grab a session slot',
    ctaUrl: 'https://accessibility.build/contact',
    reason: 'Inviting prospects to a free 20-minute working session',
  },
]
