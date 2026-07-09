# <scheduled-task name="add-a-new-content-on-the-sit
_Exported on 07/09/2026 at 20:55:19 GMT+5:30 from Claude via WayLog_


**User**

<scheduled-task name="add-a-new-content-on-the-site-on-the-daily-basic" file="/Users/khushwantparihar/.claude/scheduled-tasks/add-a-new-content-on-the-site-on-the-daily-basic/SKILL.md">
This is an automated run of a scheduled task. The user is not present to answer questions. For implementation details, execute autonomously without asking clarifying questions — make reasonable choices and note them in your output. "write" actions (e.g. MCP tools that send, post, create, update, or delete), only take them if the task file asks for that specific action. When in doubt, producing a report of what you found is the correct output.

You are the lead Accessibility Consultant, Technical SEO Specialist, UX Expert, and Content Strategist for accessibility.build.

Your mission is to continuously improve accessibility.build by creating the highest-value accessibility content on the web.

Before making any changes:

1. Analyze the entire repository.
2. Understand existing content structure.
3. Identify content gaps.
4. Identify keyword opportunities.
5. Avoid duplicate or overlapping content.
6. Prioritize evergreen content over news content.

Content Creation Rules

You may create:

- Guides
- Tutorials
- Learning Paths
- Accessibility Checklists
- Accessibility Testing Guides
- WCAG Pages
- ARIA Reference Pages
- React Accessibility Examples
- Angular Accessibility Examples
- Mobile Accessibility Guides
- Screen Reader Testing Resources
- Accessibility Audit Templates
- VPAT Resources
- ADA Compliance Resources
- Section 508 Resources
- Accessibility Pattern Libraries
- Code Examples
- FAQs
- Glossary Pages
- Comparison Pages
- Case Studies

Do NOT create content solely to increase page count.

Every page must provide real value.

SEO Requirements

Every new page must:

- Target a primary keyword.
- Include related secondary keywords.
- Have a unique SEO title.
- Have a compelling meta description.
- Use proper heading hierarchy (H1 → H2 → H3).
- Include internal links to related pages.
- Include schema markup recommendations when relevant.
- Include FAQ sections when appropriate.
- Be optimized for search intent.
- Be written for humans first, search engines second.
- Avoid keyword stuffing.
- Be more comprehensive than competing pages.

Accessibility Requirements

Every page must:

- Use semantic HTML structure.
- Have a single H1.
- Follow proper heading hierarchy.
- Include descriptive link text.
- Use accessible tables when necessary.
- Avoid accessibility anti-patterns.
- Follow WCAG 2.2 AA guidance.
- Ensure examples demonstrate accessible implementation.
- Include keyboard accessibility considerations.
- Include screen reader considerations.
- Include color contrast considerations when applicable.

Content Quality Requirements

Every page should:

- Solve a real accessibility problem.
- Include practical examples.
- Include implementation guidance.
- Include testing guidance.
- Include common mistakes.
- Include remediation techniques.
- Include code samples where appropriate.
- Include FAQs.
- Include related resources.

Decision Framework

For every run:

1. Identify the single highest-value improvement opportunity.
2. Decide whether to:
   - Create a new page
   - Improve an existing page
   - Expand an existing page
   - Add examples
   - Add FAQs
   - Improve internal linking
   - Create reusable accessibility resources

3. Implement the improvement.

Content Priorities

Highest Priority:
- WCAG 2.2
- Accessibility Testing
- Screen Readers
- NVDA
- JAWS
- VoiceOver
- TalkBack
- Keyboard Accessibility
- Focus Management
- Accessible Forms
- Error Prevention
- ARIA Usage
- Mobile Accessibility
- React Accessibility
- AI Accessibility

Lower Priority:
- Accessibility industry news
- Opinion pieces
- Generic blog posts

Output Requirements

After completing work:

- Summarize what was created or updated.
- Explain why it improves accessibility.build.
- List targeted keywords.
- List new internal links added.
- List future content opportunities.
- Highlight any manual review recommendations.

Success Metric

The goal is not to publish more pages.

The goal is to make accessibility.build the most useful, discoverable, technically accurate, SEO-optimized, and accessible resource available for accessibility professionals, developers, testers, designers, and compliance teams.
</scheduled-task>

---


**Claude**

I'll start by analyzing the repository structure to understand the existing content and identify the highest-value opportunity.

---


**Claude**

I'll explore the app directory structure to understand existing content pages.

---


**Claude**

The WCAG section covers 1.1.1 through 2.4.4 but is missing many criteria. Let me examine an existing WCAG page to understand the template, and look at the WCAG index and key infrastructure.

---


**Claude**

Some pages are "Coming Soon" stubs. Let me look at a fully-built WCAG page to understand the rich content template, and check the WCAG index page.

---


**Claude**

The complete pages use a `client-page.tsx`. Let me examine the full template and the WCAG index to understand the content pattern and what's linked.

---


**Claude**

Let me look at the WCAG index page to understand how criteria are catalogued and what's marked available vs coming soon.

---


**Claude**

This is revealing. The WCAG index is significantly out of date — it lists only 10 criteria and marks several **already-built** pages (1.3.1, 1.3.2, 1.3.3, 1.4.1) as "Coming Soon", while not linking to ~12 built pages at all. More importantly, **none of the new WCAG 2.2 criteria exist** — the single highest-priority gap per my mandate.

Let me examine the metadata helper, a guide page (for the server-rendered content pattern), and the sitemap to plan the best addition.

---


**Claude**

Now let me read a full guide page to match the server-rendered content pattern, including JSON-LD schema, FAQ, breadcrumbs, and internal linking conventions.

---


**Claude**

This is an excellent, clean template. Let me check the structured-data component exports and the RelatedContent registry (so my new page is discoverable in related links).

---


**Claude**

Let me check the internal-linking registry — I should register my new page there so it surfaces across the site.

---


**Claude**

I now have everything I need. Let me verify which WCAG pages are genuinely built vs. stubs, so I can both add my new page and correct the out-of-date index.

---


**Claude**

Now the picture is crystal clear. This is the highest-value opportunity: **~18 fully-built, content-rich WCAG criterion pages (600–2,200 lines each) are buried** — the index lists only 10 criteria, mislabels built pages (1.3.1, 1.3.2, 1.3.3, 1.4.1, 1.4.3, 1.2.2, 1.2.3) as "Coming Soon" with disabled buttons, and never links to 1.4.2, 2.1.1, 2.1.2, 2.1.4, 2.2.1, 2.2.2, 2.3.1, 2.4.1–2.4.3 at all. Meanwhile **zero WCAG 2.2 new criteria exist** — my #1 content priority.

So I'll deliver two tightly-coupled improvements: (1) create a new comprehensive **WCAG 2.5.8 Target Size (Minimum)** page filling the most glaring content gap, and (2) fix the WCAG index to surface all built pages + the new one. Let me check the sitemap registration first.

---


**Claude**

The sitemap has zero `/wcag/*` routes — another discoverability gap I'll address. Let me confirm the structured-data component signatures, then build.

---


**Claude**

I have everything I need. Let me mark a chapter and build the comprehensive WCAG 2.5.8 page.

---


**Claude**

The new page is built. Now let me fix the WCAG index to surface all built criteria plus the new 2.5.8. First, update the imports and the data array.

---


**Claude**

Now update the stale "first 10 criteria" copy and add the "New in 2.2" badge to the AA cards.

---


**Claude**

Now add the "New in 2.2" badge to the AA cards. Let me update the AA section's badge block:

---


**Claude**

Now register the new page in the internal-linking registry so it surfaces in RelatedContent sitewide. Let me add an entry before the closing `]`.

---


**Claude**

Now add the missing `/wcag/*` routes to the sitemap — currently none are present. Let me insert a generated WCAG block before the route mapping.

---


**Claude**

Now let me verify everything compiles. Let me typecheck the changed files and run the build/lint.

---


**Claude**

These errors are pre-existing in unrelated API routes. Let me confirm my changed files are clean.

---


**Claude**

My changed files are clean. Now let me verify the page renders correctly in the browser preview.

---


**Claude**

Let me wait for the route to compile, then check it loaded correctly.

---


**Claude**

The page renders with a single H1, all sections, and all three structured-data schemas (Article, BreadcrumbList, FAQPage). Let me take a screenshot to confirm visual layout and check the index page renders the expanded criteria list.

---


**Claude**

The HTML confirms full content renders, but the screenshot is blank — likely a timing/navigation issue in the preview frame. Let me reload and re-capture.

---


**Claude**

The preview iframe is stuck on a `chrome-error` origin from my earlier absolute-URL navigation — a preview-tool quirk, not a page problem. Curl already confirmed the route returns 200 with full correct HTML and all schemas. Let me authoritatively verify both pages via curl and check for runtime errors.

---


**Claude**

Let me confirm all the newly-surfaced Level A criteria (2.1.1, 2.4.3, etc.) actually render on the index — my grep pattern may have missed them due to JSX text-node splitting.

---


**Claude**

Everything checks out — the doubled counts are just RSC flight-data serialization (HTML + payload). All 20 available criteria now render with "View Guide" links, "Coming Soon" is correctly limited to 2.4.4 only, and the sitemap has 23 WCAG URLs. Let me run a final lint on the changed files.

---


**Claude**

Clean — **0 errors**, only pre-existing warnings (`CardDescription` was already imported-but-unused; the `any` warnings are in untouched Sanity code). All verification passed. Let me stop the preview server.

---


**Claude**

Work complete. Here's the summary of this scheduled run.

## What I created and updated

**1. New comprehensive page — [WCAG 2.5.8 Target Size (Minimum)](app/wcag/2-5-8/page.tsx)** (`/wcag/2-5-8`)
A ~2,600-word, fully server-rendered reference guide covering: the 24×24 CSS-pixel rule, all five exceptions (Spacing, Equivalent, Inline, User-agent control, Essential), the spacing-offset technique, four copy-ready code examples (CSS hit-area expansion, pseudo-element overlay, accessible React icon button, toolbar spacing), common mistakes, a 5-step testing workflow, related criteria, and a 6-question FAQ. Ships Article + BreadcrumbList + FAQPage JSON-LD, a single H1 with clean H2→H3 hierarchy, semantic `<article>`/`<nav>`/`<section>`, native keyboard-operable `<details>` FAQ, and dark-mode support.

**2. Fixed the [WCAG index](app/wcag/page.tsx)** — the highest-impact discoverability bug. It listed only 10 criteria and mislabeled **8 fully-built pages** (1.3.1, 1.3.2, 1.3.3, 1.4.1, 1.4.3, 1.2.2, 1.2.3) as "Coming Soon" with dead buttons, while never linking 1.4.2, 2.1.1, 2.1.2, 2.1.4, 2.2.1, 2.2.2, 2.3.1, 2.4.1–2.4.3 at all. It now surfaces all **20 available criteria** with working "View Guide" links, a "New in 2.2" badge for 2.5.8, and "Coming Soon" correctly limited to the lone 2.4.4 stub.

**3. [Sitemap](app/sitemap.ts)** — added the `/wcag` hub plus all 20 built criterion routes (previously **zero** `/wcag/*` URLs were in the sitemap), with a priority boost for the new 2.5.8 page.

**4. [Internal-linking registry](lib/internal-linking.ts)** — registered `/wcag/2-5-8` and the `/wcag` hub so they auto-surface in "Related Resources" across the site.

## Why it improves accessibility.build
It fills the **single most glaring content gap** — zero WCAG 2.2 *new* criteria existed despite WCAG 2.2 being the #1 priority — while simultaneously rescuing ~18 rich, already-built pages (600–2,200 lines each) that were buried from both users and crawlers. Net effect: one new authoritative page plus a large recovery of internal-link equity and crawl coverage.

## Targeted keywords
Primary: **WCAG 2.5.8**, **target size minimum**, **24×24 pixels**. Secondary: tap/touch target size, minimum target size accessibility, pointer target size, button size accessibility, spacing exception, mobile accessibility, WCAG 2.2 Level AA.

## New internal links added
- New page → `/wcag/2-4-1`, `/guides/keyboard-accessibility`, `/tools/mobile-accessibility-checker`, `/tools/url-accessibility-auditor`, plus auto Related Resources.
- Index now links to all 20 built `/wcag/*` criterion pages (previously ~8).
- `/wcag/2-5-8` and `/wcag` now eligible as related links sitewide.

## Verification
Route returns HTTP 200; single H1, all 8 sections, and all 3 JSON-LD schemas confirmed in rendered HTML; index renders 20 "View Guide" links with "Coming Soon" only on 2.4.4; sitemap exposes 23 WCAG URLs. `tsc` and ESLint pass on all changed files with **0 errors** (pre-existing warnings only).

## Future content opportunities
- Build out the remaining WCAG 2.2 new criteria: **2.4.11 Focus Not Obscured**, **2.4.13 Focus Appearance**, **2.5.7 Dragging Movements**, **3.2.6 Consistent Help**, **3.3.7 Redundant Entry**, **3.3.8 Accessible Authentication**.
- Replace the **2.4.4 Link Purpose** stub with a full guide.
- Add missing AA staples: 1.4.4 Resize Text, 1.4.10 Reflow, 1.4.11 Non-text Contrast, 2.4.7 Focus Visible.

## Manual review recommendation
The new FAQ uses native `<details>` (good keyboard/AT support); if you prefer the animated accordion used elsewhere, swap in the shared component. Otherwise no manual changes needed — content is accurate to the WCAG 2.2 Recommendation.

---
