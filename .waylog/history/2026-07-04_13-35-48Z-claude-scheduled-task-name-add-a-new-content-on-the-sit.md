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

After this once you have done everything I want you to properly commit and push all the changes to the main branch so it can be deployed properly
</scheduled-task>

---


**Claude**

I'll start by analyzing the repository structure to understand the existing content and identify the highest-value opportunity.

---


**Claude**

The recent commits show WCAG guides are being added. Let me look at the WCAG structure and recent guide patterns to understand the content format.

---


**Claude**

Let me examine a recent WCAG guide to understand the format, and check the WCAG index page.

---


**Claude**

I now understand the format well. Let me check the WCAG index page to see which criteria are registered and identify gaps.

---


**Claude**

Let me look at the data structure for one entry and check what fields are needed to register a new criterion.

---


**Claude**

The site is systematically building out WCAG 2.2 criteria. The clear gap is **3.2.6 Consistent Help** — a Level A criterion, new in WCAG 2.2, and the natural sibling to the recently-added 3.3.7 (the two Level A additions in 2.2). Let me verify the referenced internal links exist before building.

---


**Claude**

All referenced links exist. Now I'll create the WCAG 3.2.6 Consistent Help guide following the established pattern exactly.

---


**Claude**

Now let me register the new criterion in the WCAG index page so it appears in the hub. I'll add it after the 3.3.8 entry.

---


**Claude**

I used `HelpCircle` as the icon — I need to verify it's imported. Let me check the imports in the index page.

---


**Claude**

`HelpCircle` isn't imported. Let me add it.

---


**Claude**

Now let me check the sitemap to see if WCAG pages need to be registered there.

---


**Claude**

Now let me check the internal-linking.ts to add the new page for cross-linking (RelatedContent likely uses it), following the pattern of existing WCAG entries.

---


**Claude**

Let me find where the most recent entry (3-3-7) is to insert after it.

---


**Claude**

Now let me verify the build compiles by type-checking the changed files, then start the preview to verify the page renders.

---


**Claude**

No type errors in the changed files. Let me start the preview server and verify the page renders correctly.

---


**Claude**

The page renders with HTTP 200. Let me verify the WCAG hub page includes the new criterion and that there are no runtime errors.

---


**Claude**

Everything works: single H1, structured data present, hub updated, no server errors. Let me capture a screenshot as proof.

---


**Claude**

The preview needs a moment to reconnect. The curl checks already confirmed correct rendering. Let me re-screenshot.

---


**Claude**

The preview harness iframe is stuck on "Awaiting server," but that's a display-layer issue — the curl checks already confirmed the page returns HTTP 200 with the correct H1, single-H1 structure, structured data, and no server errors. Verification is solid. Now I'll commit and push as the task requires.

---


**Claude**

Committed and pushed to `main` (`474136e..b7d98d2`). Let me stop the preview server to clean up.

---


**Claude**

Done. Here's the summary of this run.

## What I created

A new evergreen reference page: **[WCAG 3.2.6 Consistent Help](app/wcag/3-2-6/page.tsx)** — a comprehensive Level A guide (~2,700 words) covering the criterion new in WCAG 2.2.

I picked this by analyzing the repo's content trajectory: the site has been systematically building out WCAG 2.2's new criteria (3.3.7, 3.3.8, 2.5.7, 2.4.11 all landed in recent commits). The one remaining **Level A** addition in WCAG 2.2 — **3.2.6 Consistent Help** — was missing entirely, making it the highest-value, no-overlap gap. It's also the natural sibling to the just-published 3.3.7 (the two Level A cognitive-load criteria in 2.2), so it reinforces an existing cluster.

The page follows the established template exactly: Level A / Principle 3 / "New in WCAG 2.2" badges, full official-text callout, "on this page" nav, why-it-matters, the four covered help mechanisms, a passes/fails treatment of "same relative order," compliant patterns, four code examples (shared header, root-layout chat widget, semantic footer contact, and an anti-pattern), common mistakes, a 5-step testing method, related criteria, and 7 FAQs.

## Why it improves accessibility.build
- **Fills a real gap** — the only Level A WCAG 2.2 criterion with no page, now covered.
- **Solves a genuine problem** — teams routinely fail 3.2.6 by moving/removing help on checkout and form pages; the guide gives concrete shared-component fixes.
- **Fully wired for discovery** — registered in the [WCAG hub](app/wcag/page.tsx), [sitemap.ts](app/sitemap.ts) (priority 0.9), and [internal-linking.ts](lib/internal-linking.ts) so `RelatedContent` surfaces it across the site.

## SEO
- **Primary keyword:** WCAG 3.2.6 / Consistent Help
- **Secondary:** help mechanism accessibility, same relative order, contact information accessibility, chat widget accessibility, consistent navigation, cognitive accessibility, Level A, WCAG 2.2
- Unique title + meta description, single H1 → H2 → H3 hierarchy, Article + Breadcrumb + FAQPage schema, OpenGraph/Twitter cards.

## New internal links added
- Guide → `/wcag/3-3-7`, `/wcag/3-3-8`, `/wcag/3-3-2`, `/wcag`, `/checklists/wcag-2-2`, `/guides/section-504-web-accessibility-deadline`, `/tools/url-accessibility-auditor`, `/guides/screen-reader-testing`
- Inbound: WCAG hub card, sitemap entry, and internal-linking graph now point to `/wcag/3-2-6`.

## Verification
HTTP 200, single H1, structured data present, hub renders the new card, no server errors, `tsc` clean on all changed files.

## Future content opportunities
- The remaining **AAA** WCAG 2.2 additions: 2.4.12 Focus Not Obscured (Enhanced), 2.4.13 Focus Appearance, 3.3.9 Accessible Authentication (Enhanced).
- Missing common Level AA criteria: 1.4.4 Resize Text, 1.4.5 Images of Text, 1.4.10 Reflow, 1.4.12 Text Spacing, 1.4.13 Content on Hover or Focus, 2.4.5 Multiple Ways, 2.4.6 Headings and Labels, 3.2.3 Consistent Navigation, 3.2.4 Consistent Identification.
- A "Consistent Help" pattern could seed a broader **predictable help/support UX** guide linking design + compliance.

**Manual review recommendation:** the preview harness iframe showed "Awaiting server" (a display-layer hiccup) — page correctness was confirmed via curl, but a quick eyeball of `/wcag/3-2-6` in a browser after deploy is worth a glance.

---
