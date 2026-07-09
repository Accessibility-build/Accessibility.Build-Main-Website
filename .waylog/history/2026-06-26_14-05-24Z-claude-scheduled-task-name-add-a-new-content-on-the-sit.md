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

I'll explore the content structure to understand existing pages and find gaps. Let me look at the key content directories in parallel.

---


**Claude**

Let me examine the structure of existing WCAG and reference pages to understand the format and pick the highest-value gap.

---


**Claude**

Let me read the rest of this page's body structure and the related components.

---


**Claude**

Now let me check the WCAG index page and the RelatedContent component to understand registration and internal linking.

---


**Claude**

Let me check the WCAG index page and internal-linking registry to see how pages are registered.

---


**Claude**

I have enough understanding. My decision: **WCAG 2.4.7 Focus Visible (Level AA)** is the highest-value gap — it's the single most important criterion for keyboard users, completes the 2.4 family (2.4.1–2.4.4 exist but the keystone 2.4.7 is missing), sits in the highest-priority topics (Focus Management, Keyboard Accessibility), and pairs with the existing keyboard-accessibility guide and 2.4.3 Focus Order page.

Let me read the full reference page to replicate its structure precisely, especially code blocks.

---


**Claude**

I have the full template. Let me check the icon imports in the WCAG index and the 2.4.3 page for cross-linking.

---


**Claude**

I now have everything I need. Let me create the WCAG 2.4.7 Focus Visible page, following the established template exactly.

---


**Claude**

Now let me register the page in the WCAG index. Let me add it after the 3.3.1 entry.

---


**Claude**

Now let me check the internal-linking registry so other pages can link back to this one.

---


**Claude**

The registry is missing both 3.3.1 and my new 2.4.7. Let me add both before the hub entry.

---


**Claude**

Now let me add this page to the sitemap. Let me check how the sitemap handles WCAG pages.

---


**Claude**

I'll add `2-4-7` to the sitemap and give it a priority boost as a high-value AA criterion.

---


**Claude**

Now let me add a cross-link from the related 2.4.3 Focus Order page back to the new 2.4.7 page for internal linking. Let me check its related-criteria section.

---


**Claude**

The 2.4.3 page uses a client component; the RelatedContent registry already surfaces my new page automatically via keyword matching, so cross-linking is handled. Now let me verify the new page renders correctly in the preview.

---


**Claude**

The page may still be compiling. Let me check its loaded state.

---


**Claude**

The page returns HTTP 200 and renders correctly. Let me confirm key content blocks and no error markers.

---


**Claude**

All content present, structured data emitted, zero errors. Let me confirm the WCAG index page (which I edited) still renders and shows the new card.

---


**Claude**

The index page renders the new Focus Visible card. Let me take a screenshot of the new page as proof, then commit.

---


**Claude**

The screenshot shows a blank preview-browser context (its navigation was blocked by CSP earlier), but the `curl` verification is authoritative: the page returns HTTP 200 with the full H1, official-text, code blocks, FAQ structured data, and zero error markers — server-rendered correctly. The dev browser context simply didn't follow the navigation; the page itself is sound.

Now let me commit and push all changes to main.

---


**Claude**

Committed and pushed to `main` (`86ebde6..8bc9c6d`). Deployment will pick it up.

## Summary

**Created:** [WCAG 2.4.7 Focus Visible](app/wcag/2-4-7/page.tsx) — a comprehensive ~2,900-word Level AA success-criterion guide.

### Why this was the highest-value improvement
The site had the full 2.4 *Navigable* family up to 2.4.4, but was missing **2.4.7 Focus Visible** — the single most important criterion for keyboard users and one of the highest-search-volume WCAG topics. It sits squarely in the site's highest-priority list (Focus Management, Keyboard Accessibility) and pairs naturally with the existing keyboard-accessibility guide and 2.4.3 Focus Order page. The `outline: none` anti-pattern it addresses is among the most common real-world a11y failures, so the page solves a concrete, frequently-searched problem.

### What the page delivers
- Single H1, proper H2→H3 hierarchy, semantic landmarks, breadcrumb nav
- Official criterion text, "what it requires," the `outline: none` trap, `:focus` vs `:focus-visible`, four copy-ready code examples (modern CSS, box-shadow ring, Tailwind, forced-colors), 8 common mistakes, 5 testing steps, related criteria, and 6 FAQs
- `Article`, `Breadcrumb`, and `FAQPage` JSON-LD structured data
- Accessible patterns demonstrated throughout (the examples themselves model conformance)

### Targeted keywords
Primary: **WCAG 2.4.7**, **Focus Visible**, **keyboard focus indicator**. Secondary: focus-visible, focus ring, `outline: none` accessibility, visible focus, focus styles CSS, focus management, focus indicator contrast, tab key focus.

### Internal links added
- New page links out to: `/wcag/2-1-1`, `/wcag/2-4-3`, `/wcag/1-4-3`, `/wcag`, `/checklists/wcag-2-2`, `/guides/keyboard-accessibility`, `/tools/url-accessibility-auditor`
- Registered in: WCAG index ([app/wcag/page.tsx](app/wcag/page.tsx)), sitemap with priority boost ([app/sitemap.ts](app/sitemap.ts)), and the internal-linking registry ([lib/internal-linking.ts](lib/internal-linking.ts)) — which auto-surfaces it in `RelatedContent` across the site. I also added a **missing 3.3.1 registry entry** while there.

### Verification
Dev server returns HTTP 200; all content blocks, FAQ structured data, and the index card confirmed present with zero error markers.

### Future content opportunities
- **WCAG 4.1.3 Status Messages** (AA) — referenced in the 3.3.1 FAQ but not yet built; completes the forms/live-region family
- **WCAG 1.4.11 Non-text Contrast** (AA) — pairs with the existing contrast-checker tool
- **WCAG 2.4.11 Focus Not Obscured** (new in 2.2) — natural follow-on to this Focus Visible page
- **WCAG 1.4.13 Content on Hover or Focus** and **2.5.7 Dragging Movements** (2.2 gaps)

### Manual review recommendation
The preview browser's screenshot came back blank because its navigation was blocked by CSP during my eval calls — the page itself is verified sound via direct HTTP requests. A quick visual glance at `/wcag/2-4-7` in a real browser post-deploy would be a nice final confirmation, but nothing indicates a problem.

---
