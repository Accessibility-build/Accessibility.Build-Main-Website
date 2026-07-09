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

This gives me a clear template. Let me check how the sitemap registers WCAG pages and confirm 2.4.6 isn't already present.

---


**Claude**

2.4.6 is referenced by other pages but has no page yet — it's a genuine gap. Let me check the sitemap's built-criteria list.

---


**Claude**

This is a genuine high-value gap. **WCAG 2.4.6 Headings and Labels (AA)** is one of the most common audit criteria, is referenced by three existing pages with no target page, and complements the existing structure/forms cluster. I'll create it.

---


**Claude**

Let me verify the internal links I used actually exist, then register the page in the sitemap and index.

---


**Claude**

The heading tool is at `heading-analyzer`. Let me confirm its exact route.

---


**Claude**

The correct route is `/tools/heading-analyzer`. Let me fix both references.

---


**Claude**

Now register the page in the sitemap and add it to the WCAG index.

---


**Claude**

Now add the criterion to the WCAG index page. Let me look at how an entry with `available: true` is structured near the end to match the format (including icon import).

---


**Claude**

Now let me verify it compiles and renders. Let me start the dev server.

---


**Claude**

Page returns **200**. The preview shell just needs a reload.

---


**Claude**

The preview harness is stuck on a placeholder page. Let me verify the rendered HTML directly via curl, which is more reliable here.

---


**Claude**

The page renders correctly — 200 status, correct H1, title, FAQ + breadcrumb structured data, and all internal links present. Let me confirm the index page now surfaces it and links correctly.

---


**Claude**

Everything is wired correctly: index card links to the page, sitemap includes it, and the page renders with full structured data. Let me stop the preview and commit.

---


**Claude**

Committed and pushed to `main` (`aeb0377`). Deployment will pick it up.

## Summary

**Created:** [WCAG 2.4.6 Headings and Labels](app/wcag/2-4-6/page.tsx) — a comprehensive Level AA success criterion page (~2,800 words), matching the established WCAG page template.

**Why this was the highest-value opportunity:**
- **Genuine gap, not padding.** 2.4.6 is one of the most common audit findings and was already *referenced by three existing pages* ([3.3.2](app/wcag/3-3-2/page.tsx), [4.1.2](app/wcag/4-1-2/page.tsx), [2.4.4](app/wcag/2-4-4/page.tsx)) with no target page to link to — those internal links were effectively dangling. It's also a foundational AA criterion (heading structure + form labels) that developers hit constantly.
- **Clarifies a widely-misunderstood rule** — that 2.4.6 is a *quality* bar (descriptive), not a *presence* requirement (that's 1.3.1 / 3.3.2) — which competing pages rarely explain well.

**Content included:** full normative text, why it matters for screen reader navigation, what counts as a "label" (broader than `<label>`), the descriptive-vs-present distinction, copy-ready HTML examples (vague vs. descriptive headings, real form labels, distinguishing repeated links), 8 common mistakes, a 5-step manual testing workflow, related-criteria cluster, and 6 FAQs.

**SEO:** primary keyword *WCAG 2.4.6 / Headings and Labels*; secondaries include *descriptive headings, form label accessibility, screen reader headings, generic link text, placeholder label*. Unique title + meta description, canonical URL, OpenGraph/Twitter cards, and **schema markup** (Article + BreadcrumbList + FAQPage — all verified in the rendered HTML).

**Accessibility:** semantic HTML, single H1, correct H1→H2→H3 hierarchy, `aria-label`/`aria-labelledby` landmarks, descriptive link text, accessible `<details>` FAQ, dark-mode support.

**New internal links added:** → `/wcag/1-3-1`, `/wcag/3-3-2`, `/wcag/2-4-4`, `/wcag/4-1-2`, `/wcag`, `/tools/heading-analyzer`, `/checklists/wcag-2-2`. Registered in [sitemap.ts](app/sitemap.ts) (priority 0.9) and added as a card on the [WCAG index](app/wcag/page.tsx).

**Verification:** dev server returned HTTP 200 for the new page, the WCAG index, and the sitemap; H1, title, and all structured data confirmed in rendered output.

**Future content opportunities (next-highest gaps):** 2.5.3 Label in Name (A), 3.1.1 Language of Page (A), 1.4.4 Resize Text (AA), 2.4.5 Multiple Ways (AA), and the pointer-input trio 2.5.1/2.5.2/2.5.4 (A).

**Manual review recommendation:** none blocking — one judgment call I made autonomously was pointing the testing/tool links at the existing `/tools/heading-analyzer` (the repo's heading tool) rather than a "structure checker" slug that doesn't exist.

---
