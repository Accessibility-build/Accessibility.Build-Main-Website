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

I'll start by analyzing the repository structure to understand existing content and identify the highest-value opportunity.

---


**Claude**

The previous run created `/wcag/2-5-8` and `/wcag/4-1-2`. Let me examine the existing WCAG structure and one of these new pages as a template to understand conventions.

---


**Claude**

The site has solid WCAG coverage for chapters 1 and 2, but **no chapter 3 (Understandable) content at all** — meaning none of the forms/error-handling criteria, which are explicitly listed as highest priority (Accessible Forms, Error Prevention). Let me examine the existing page structure and the hub to match conventions exactly.

---


**Claude**

Excellent template. Now let me see how the hub page lists criteria and how the sitemap registers them.

---


**Claude**

This is the decisive insight: **missing form labels (WCAG 3.3.2) is consistently a top-5 failure in the WebAIM Million**, yet the site has *zero* chapter 3 (Understandable) content and no forms-criterion page. Combined with "Accessible Forms" being the #1 listed content priority, **WCAG 3.3.2 Labels or Instructions** is the highest-value addition. Let me confirm the hub page structure and check it isn't already present.

---


**Claude**

I have everything I need. Let me create the comprehensive WCAG 3.3.2 page.

---


**Claude**

Now let me register the page in the three places: the hub, the sitemap, and the internal-linking database.

---


**Claude**

Now add the internal-linking entry:

---


**Claude**

Now let me verify the build compiles. Let me typecheck the new page and changed files.

---


**Claude**

No type errors. Let me verify the page renders in the browser preview.

---


**Claude**

A dev server is already running on port 3000. Let me verify the page renders by hitting it directly.

---


**Claude**

The server on :3000 is a stale production build (`next start`) that predates these routes — even old routes 404 there. I'll spin up a fresh dev server on an auto-assigned port to verify.

---


**Claude**

The route compiles and serves 200. Let me confirm content and check for console errors via snapshot.

---


**Claude**

The snapshot browser is on a default page. Let me verify rendered content directly and check the dev server logs for errors.

---


**Claude**

All sections render, single H1, structured data present. Let me confirm the hub page lists the new criterion and check for any compile errors.

---


**Claude**

No server errors. Let me confirm the Article structured data is emitted (the grep pattern may have missed spacing).

---


**Claude**

Everything verified — `Article`, `BreadcrumbList`, and `FAQPage` schema all emit. Let me navigate the preview browser to the page and capture a screenshot as proof.

---


**Claude**

The preview harness shows its "Awaiting server…" placeholder — a tooling connection artifact, not a page issue. The authoritative verification is already complete via direct HTTP: the route returns **200**, renders the correct single H1, all sections, and valid `Article` + `BreadcrumbList` + `FAQPage` JSON-LD, with **zero server errors**. Let me stop the dev server I spun up.

---


**Claude**

## Summary

I analyzed the full repository and identified the single highest-value content gap: the site had **comprehensive WCAG coverage for Principles 1, 2, and 4 — but zero pages for Principle 3 (Understandable)**, meaning none of the forms or input-assistance criteria existed. Since "Accessible Forms" is the #1 listed content priority and **missing form labels is consistently a top-5 failure in the WebAIM Million**, the clear winner was:

### Created: [WCAG 3.3.2 Labels or Instructions](app/wcag/3-3-2/page.tsx)
A ~2,700-word, fully semantic guide following the site's established WCAG-page template, covering:
- Why labels/instructions matter (real AT impact)
- What the criterion requires (label + instructions + positioning)
- The **four label-association methods** (implicit/explicit `<label>`, `aria-labelledby`, `aria-label`)
- A dedicated section on **why a placeholder is not a label** (the most common failure)
- Five copy-ready code examples (HTML association, `aria-describedby` hints, `fieldset`/`legend` groups, a reusable accessible React field, icon-only fallback)
- Common mistakes, a 5-step testing workflow, related criteria, and 6 FAQs

**Why it improves accessibility.build:** It opens an entirely uncovered WCAG principle with the highest-traffic, most-failed forms criterion; it's evergreen, comprehensive, and interlinks tightly with existing 1.3.1 / 4.1.2 pages — strengthening topical authority around forms accessibility.

### Accessibility & SEO compliance
- Single H1, correct H2→H3 hierarchy, semantic landmarks, descriptive links, accessible `<details>` FAQ, dark-mode support
- Full metadata, canonical, OpenGraph/Twitter, and **`Article` + `BreadcrumbList` + `FAQPage` JSON-LD** (all verified emitting)

### Registered in 3 places
- [app/wcag/page.tsx](app/wcag/page.tsx) — added the criterion card to the hub (Principle 3 now appears)
- [app/sitemap.ts](app/sitemap.ts) — added `3-3-2` with a boosted 0.9 priority (top-5 failure)
- [lib/internal-linking.ts](lib/internal-linking.ts) — added it to the smart internal-link database so other pages can surface it

### Verification
Spun up a fresh dev server (the existing :3000 server was a stale production build that 404s on all newer routes). New route returned **HTTP 200**, correct H1, all sections present, single H1, valid structured data, and **no server errors**. `tsc --noEmit` clean on all touched files.

**Targeted keywords:** labels or instructions, WCAG 3.3.2, form labels accessibility, accessible forms, label association, placeholder not a label, required field accessibility, `aria-describedby`, `fieldset`/`legend`, missing form label.

**New internal links added (outbound from the page):** /wcag/1-3-1, /wcag/4-1-2, /wcag, /checklists/wcag-2-2, /tools/url-accessibility-auditor, /guides/screen-reader-testing — plus an inbound entry in the internal-linking engine.

### Future content opportunities (Principle 3 is now seeded but thin)
- **WCAG 3.3.1 Error Identification** and **3.3.3 Error Suggestion** (referenced here, not yet built — natural next pages for "Error Prevention")
- **WCAG 3.1.1 Language of Page** (another top WebAIM Million failure, still missing)
- **WCAG 2.4.6 Headings and Labels** (referenced here, AA, not built)
- A pillar **Accessible Forms** guide tying these criteria together

### Manual review recommendations
- Changes are in the working tree, **uncommitted** (consistent with the prior run's untracked 2-5-8/4-1-2 pages). Commit/deploy when ready.
- I set `"autoPort": true` in [.claude/launch.json](.claude/launch.json) so the preview server coexists with your running :3000 server — harmless, but revert if you prefer a fixed port.
- Note your :3000 server is serving a stale production build that 404s on all recently added routes; it needs a rebuild + restart to reflect new content.

---


**User**

commit and push the changes

---


**Claude**

I'll commit and push. First, let me check what's in the working tree and `.gitignore` so I stage the right things — note the modified files contain both my 3.3.2 work and the prior run's 2-5-8/4-1-2 registrations (intertwined in the same files).

---


**Claude**

`.claude/` holds local-only config (`settings.local.json`) and isn't tracked, so I'll leave it out and stage just the content work. The three modified files contain both my 3.3.2 additions and the prior run's 2-5-8/4-1-2 registrations, so I'll commit the full WCAG content set together.

Per your global preference, the commit message won't mention Claude or add a Co-Authored-By trailer.

---


**Claude**

Committed and pushed to `main`.

**Commit [`bab8913`](https://github.com/Accessibility-build/Accessibility.Build-Main-Website/commit/bab8913):** `5e3ef39..bab8913  main -> main`

What landed:
- **3 new WCAG guides** — [2.5.8 Target Size](app/wcag/2-5-8/page.tsx), [3.3.2 Labels or Instructions](app/wcag/3-3-2/page.tsx) (today's work — opens Principle 3), and [4.1.2 Name, Role, Value](app/wcag/4-1-2/page.tsx)
- **Registrations** in the [WCAG hub](app/wcag/page.tsx), [sitemap](app/sitemap.ts), and [internal-linking engine](lib/internal-linking.ts)

Left out of the commit intentionally: `.claude/` (local-only `settings.local.json` + the preview `launch.json` autoPort tweak) — machine config that doesn't belong in the repo, and it wasn't previously tracked.

---
