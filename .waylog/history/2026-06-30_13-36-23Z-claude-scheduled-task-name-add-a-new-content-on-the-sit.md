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

The error-handling family (3.3.1, 3.3.2) is on the site and repeatedly references **3.3.3 Error Suggestion (AA)** as the natural next step — but that page doesn't exist yet. The 3.3.1 page even has a dangling link pointing at `/wcag/1-3-1` where 3.3.3 should be. Creating **WCAG 3.3.3 Error Suggestion** is the highest-value move: it completes the forms/error-handling cluster (a top-priority topic), fixes a broken internal reference, and targets strong keywords. Let me check the WCAG index to wire it in.

---


**Claude**

The index lists criteria via the `successCriteria` array. I have enough context. Now let me create the WCAG 3.3.3 Error Suggestion page and wire it in. First, let me write the new page.

---


**Claude**

Now let me wire it into the WCAG index and fix the dangling link in the 3.3.1 page.

---


**Claude**

Now fix the dangling reference in the 3.3.1 page that pointed at `/wcag/1-3-1` where 3.3.3 should be:

---


**Claude**

Let me check whether the sitemap needs a manual entry for the new page.

---


**Claude**

Now let me verify the new page builds/typechecks. Let me run a lint/typecheck on the changed files:

---


**Claude**

Typecheck is clean for the changed files. This is a browser-observable change, so let me verify it renders in the preview.

---


**Claude**

The preview window is stuck on its placeholder. Let me verify the route renders by hitting the dev server directly:

---


**Claude**

The page renders correctly (HTTP 200, H1 present, content intact). Let me verify the index page and the edited 3.3.1 page still render, plus the sitemap includes the new route:

---


**Claude**

All verified: the new page returns 200 with full content, the `/wcag` index shows the new "Error Suggestion" card linking to `/wcag/3-3-3`, the 3.3.1 dangling link now resolves correctly, and the sitemap includes the route. Let me commit and push.

---


**Claude**

Pushed to `main` as commit `b78f666`. Deployment will pick it up.

## Summary of this run

**What was created**
- **New page: [WCAG 3.3.3 Error Suggestion guide](app/wcag/3-3-3/page.tsx)** — a comprehensive ~2,700-word Level AA guide covering what the criterion requires, the security/purpose exception (sign-in forms, quizzes), how to write a useful suggestion (good vs. bad message comparison), four copy-ready code examples (HTML, the secure sign-in pattern, a rule-derived suggestion builder, and an accessible React field), common mistakes, a 5-step testing procedure, related criteria, and an FAQ. Includes full SEO + structured data (Article, Breadcrumb, FAQPage schema).

**What was updated**
- [app/wcag/page.tsx](app/wcag/page.tsx) — added 3.3.3 to the success-criteria index so it appears in the Level AA list with a working "View Guide" link.
- [app/wcag/3-3-1/page.tsx](app/wcag/3-3-1/page.tsx) — fixed a **dangling cross-reference** that pointed at `/wcag/1-3-1` where 3.3.3 belonged; it now links correctly to the new page.
- [app/sitemap.ts](app/sitemap.ts) — registered `/wcag/3-3-3` and gave it a priority boost as a high-value forms criterion.

**Why it improves accessibility.build**
It completes the form error-handling family (3.3.1 → 3.3.2 → 3.3.3), one of the site's top-priority topics (Accessible Forms / Error Prevention). The 3.3.1 page already pointed readers to "3.3.3 Error Suggestion" but the page didn't exist — this fills the gap *and* repairs the broken internal link, strengthening the cluster's topical authority.

**Targeted keywords:** primary — *WCAG 3.3.3*, *Error Suggestion*; secondary — *suggest correction form error*, *accessible error messages*, *error recovery accessibility*, *helpful error messages*, *aria-describedby*, *Level AA*, *input assistance*.

**New internal links added:** 3.3.3 → 3.3.1, 3.3.2, 4.1.3, `/wcag`, `/checklists/wcag-2-2`, `/tools/url-accessibility-auditor`, `/guides/screen-reader-testing`; and the index + sitemap → 3.3.3; 3.3.1 → 3.3.3 (fixed).

**Verification:** Dev server returned HTTP 200 for the new page with H1, official-text, and code blocks intact; the `/wcag` index renders the new card and link; the 3.3.1 link now resolves to `/wcag/3-3-3`; sitemap.xml includes the route. TypeScript check clean.

**Future content opportunities:** 3.3.4 Error Prevention (Legal, Financial, Data) — the last piece of the 3.3 family and referenced as a placeholder in this new page; plus WCAG 2.2 forms criteria 3.3.7 Redundant Entry and 3.3.8 Accessible Authentication, which are high-value and not yet covered.

**Manual review:** none required — the page follows the established, proven 3.3.1 template; an optional polish would be upgrading the plain-text "3.3.4" reference to a link once that page exists.

---
