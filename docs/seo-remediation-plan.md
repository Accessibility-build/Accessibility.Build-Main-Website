# SEO Remediation & Growth Plan

Source: full-codebase SEO audit, July 9, 2026. Every finding from that audit maps to a task below.
Phases are ordered by impact-per-effort. Phases 0–4 are fixes to existing code; Phases 5–6 are new content; Phase 7 is verification and monitoring.

Conventions: each task has a checkbox, the files it touches, and a done-when criterion.

---

## Phase 0 — Critical technical fixes (1 session)

### 0.1 Remove the root-layout canonical (the single biggest win)
- [x] In `app/layout.tsx` (~line 136), delete `alternates: { canonical: "https://accessibility.build" }` and the `alternates.languages['en-US']` entry. Keep `metadataBase`.
- [x] Sweep all pages that do NOT define their own `alternates.canonical` (~69) and add a correct self-referencing canonical, ideally via a shared helper (see 0.5).
- Done when: no page inherits the homepage canonical; spot-check rendered `<link rel="canonical">` on a blog post, a services page, an older WCAG page, /about, /contact.

### 0.2 Fix `app/sitemap.ts`
- [x] Remove the 3 dead MDX slugs (`complete-wcag-2-2-compliance-guide-2025`, `creating-accessible-forms`, `understanding-wcag-2-2`) — no route renders them (Phase 4 decides their final fate; until then they must not be advertised). Remove the `lib/mdx.getAllPosts()` sitemap source.
- [x] Add missing routes: `/pricing`, `/docs`, `/help`, `/status`, `/cookies`, `/refund`, `/learn` + 5 children (`carousels`, `modals`, `pagination`, `search`, `table`), `/wcag-3` + 4 children (`comparison`, `concepts`, `guidelines`, `preparation`), 6 tools (`accessibility-report-generator`, `accessibility-statement-generator`, `ada-compliance-risks`, `base64-converter`, `image-color-picker`, `url-encoder-decoder`), 4 guides (`ai-accessibility-audit`, `doj-title-ii-deadline-extension`, `how-to-audit-website-accessibility`, `section-504-web-accessibility-deadline`), `/checklists/wcag-2-2/aaa`, `/checklists/wcag-2-2/excel`.
- [x] Do NOT add: `/hell`, `/welcome`, `/reports`, `/accessible-table` (these get noindexed or removed in Phase 1).
- [x] Replace `new Date()` lastmod on static routes with real dates: keep a `lastUpdated` constant per route group (or per entry), updated when content actually changes.
- [x] Delete stale generator scripts `scripts/generate-sitemap.mjs` and `scripts/generate-sitemap.ts`, and remove the `generate-sitemap` npm script from `package.json` (they would write a conflicting, outdated `public/sitemap.xml`).
- Done when: `curl localhost:3000/sitemap.xml` contains every public indexable route exactly once, zero 404 URLs, real lastmod dates.

### 0.3 Fix title doubling and title quality (56+ pages)
- [x] Remove hardcoded `| Accessibility.build` / `- Accessibility.build` from every page `title` string; the root template `%s | Accessibility.build` supplies the suffix. Affects ~56 pages (tools, static blog posts, terms, privacy, faq, sitemap-page, admin, contact, etc.).
- [x] Normalize brand to `Accessibility.build` everywhere (`AccessibilityBuild` in `app/wcag/1-4-2`, `1-4-3`, `2-1-1`, `2-1-2`, `2-1-4`, `2-2-1`, `2-2-2`; `Accessibility Build` in `app/wcag/2-3-1`, `app/desktop`).
- [x] Fix `app/tools/url-encoder-decoder/page.tsx` — remove "by Alaikas" third-party branding.
- [x] Shorten titles so title-plus-suffix ≤ ~60 chars; worst offenders (~98 chars): `app/tools/overlay-detector/page.tsx`, `app/tools/accessibility-audit-helper/page.tsx`; ~25 more over 60.
- [x] Update stale years: blog titles saying "2024" (`accessibility-testing-tools`, `ada-compliance-guide`, `accessibility-audit-checklist`, `website-accessibility-compliance`) and `tools/ada-compliance-risks` ("2025") → 2026 or evergreen (prefer evergreen).
- Done when: grep for `Accessibility.build \|` inside title strings returns nothing; no rendered title contains the brand twice.

### 0.4 Homepage metadata + h1
- [x] `app/page.tsx` is `"use client"` with no metadata. Either convert to a server component wrapping the client parts, or add `app/(home)/layout.tsx`-style metadata. Give it a keyword-targeted title (e.g. "Web Accessibility Testing Tools & WCAG Compliance Platform"), description, OG block, and self-canonical.
- [x] Change the h1 in `components/interactive-hero.tsx` (~line 190) from "Empowering digital inclusion for all" to keyword-bearing copy (e.g. "Web accessibility testing, WCAG guides, and compliance tools") while keeping the brand voice; keep exactly one h1.
- Done when: homepage has its own title/description/OG/canonical and a keyword-relevant single h1.

### 0.5 Metadata helper consolidation
- [x] Remove redundant `metadataBase` re-declarations in `lib/metadata.ts:5` and the 7 WCAG pages (`1-4-2`, `1-4-3`, `2-1-1`, `2-1-2`, `2-1-4`, `2-2-1`, `2-2-2`).
- [x] Standardize on one metadata helper (`lib/metadata.ts` or `lib/utils.ts` — pick one, delete/deprecate the other's metadata function) that emits title, description, canonical, OG, and Twitter from a single call. Use it in every page touched during this plan.
- Done when: one helper, no duplicate metadataBase, new/edited pages use it.

---

## Phase 1 — Indexing hygiene (1 session)

### 1.1 Noindex private/utility pages (belt and suspenders with robots.txt)
- [x] Add `robots: { index: false, follow: false }` metadata to: all 9 `app/admin/*` pages, `app/dashboard/page.tsx`, `app/profile/[[...rest]]/page.tsx`, `app/welcome/page.tsx`, `app/unlimitedaccess/page.tsx`, `app/billing` pages if not already, `app/reports/page.tsx` (the `[slug]` page already has it), `app/desktop/connect` (already has it — verify), `app/onboarding` (already has it — verify).
- [x] Decide `/hell` and `/accessible-table`: if they're test/demo pages, either delete them or noindex them (a client component can't export metadata — add a tiny `layout.tsx` with metadata, the same pattern as `app/wcag-3/preparation/layout.tsx`). If `/accessible-table` is meant as content, fold it into `/learn` (see 3.6).
- Done when: every non-public route sends `noindex` in its rendered HTML, not just a robots.txt disallow.

### 1.2 Give the `/learn` section real metadata
- [x] `app/learn/page.tsx` + 5 sub-pages (`carousels`, `modals`, `pagination`, `search`, `table`) are client components with no metadata. Add a `layout.tsx` per route (or convert to server components) exporting title/description/canonical/OG. These are indexable content pages targeting "accessible carousel", "accessible modal", etc. — real query targets.
- Done when: all 6 learn pages have unique titles, descriptions, canonicals.

### 1.3 robots.ts cleanup
- [x] Remove the dead `/api/sitemap` allow rule (~line 114) — the route doesn't exist.
- [x] Replace `/*preview*` and `/*draft*` wildcards with precise patterns (e.g. `/api/preview`, `?preview=`) so legitimate URLs containing those words aren't blocked.
- [x] Remove `crawlDelay` (ignored by Google, noise).
- Done when: robots.txt output has no dead references or over-broad wildcards.

### 1.4 Fix or remove the SearchAction
- [x] The site-wide WebSite schema in `app/layout.tsx` declares a SearchAction targeting `/search?q=...` but no `app/search/` route exists. Either build a simple search page or remove the SearchAction from the @graph.
- Done when: schema only claims capabilities the site has.

### 1.5 Misc
- [x] `lib/utils.ts` has an unused `noIndex` metadata option — wire it up or remove it (align with 0.5).
- [x] Fix "all 78 success criteria" copy (checklist page, `lib/internal-linking.ts`) → 86, matching `lib/wcag-data.ts`.
- [x] `app/wcag/1-3-1/page.tsx` (~line 243): the interactive demo renders a literal second `<h1>` in the DOM — change the demo to render inside a sandboxed snippet (code block / iframe / `role="presentation"` container with non-heading markup) so the page has exactly one h1.
- [x] Note (non-SEO but flagged): `next.config.mjs` sets `typescript.ignoreBuildErrors: true` — schedule a separate cleanup to turn it off. **DONE:** fixed the type errors in `app/api/tools/overlay-detector/route.ts` and `pdf-accessibility-checker/route.ts`, removed the flag; `npm run build` now type-checks as a build gate and passes clean.

---

## Phase 2 — Metadata & structured data completion (1–2 sessions)

### 2.1 Open Graph / Twitter blocks for all indexable pages (~74 missing)
- [x] Add per-page `openGraph` + `twitter` metadata to: all 13 static blog posts, all 7 `app/services/*`, 4 `app/wcag-3/*`, older WCAG pages (`1-1-1` through `1-4-1` era), hub pages (`guides`, `research`, `checklists`, `resources`, `tools` if missing), `about`, `contact`, `terms`, `privacy`, `faq`, `pricing`, `learn/*`. Use the consolidated helper from 0.5 so this is one-line per page.
- Done when: every indexable page renders og:title/og:description/og:url matching its own content, not the homepage's.

### 2.2 Dynamic OG images
- [x] Add a root `app/opengraph-image.tsx` (branded default, replaces static-only `public/og-image.png` usage).
- [x] Add templated OG images for the big content sections using `next/og` ImageResponse: `app/wcag/[criterion]` pages (criterion number + name + level badge), `app/guides/*`, `app/blog/[slug]` (post title), `app/tools/*` (tool name). A single shared OG template component parameterized by title/eyebrow/badge is enough.
- Done when: sharing a WCAG page, guide, tool, or blog post shows a page-specific card.

### 2.3 JSON-LD gaps
- [x] Add `Article` + `BreadcrumbList` schema to the 13 static blog posts (until Phase 4 migrates them — if Phase 4 lands first, this is covered there).
- [x] Add `TechArticle` + `BreadcrumbList` + FAQ schema to the 15 older WCAG pages with none (`1-1-1`, `1-2-1`–`1-2-3`, `1-3-1`–`1-3-3`, `1-4-1`, `1-4-2`, `1-4-3`, `2-1-1`, `2-1-2`, `2-1-4`, `2-2-1`, `2-2-2`) — reuse `components/wcag/seo-enhancements.tsx` already used by the newer half. (Superseded if 5.1's re-templating lands first.)
- [x] Add `Service` schema to all 7 `app/services/*` pages.
- [x] Add `AboutPage`/`ContactPage` (or plain WebPage) schema + breadcrumbs to `about`, `contact`.
- [x] Add breadcrumb + appropriate schema to `learn/*` pages.
- Done when: every indexable content page has at least breadcrumb JSON-LD; articles/guides/tools/services have their type-specific schema.

### 2.4 Image alt quality
- [x] `components/sanity/portable-text.tsx:14` — falls back to `alt='Blog image'`; make alt required in the Sanity image schema (`sanity-studio/schemaTypes/`) and fall back to `""` (decorative) rather than a generic label. Blog hero currently reuses `alt={post.title}` — acceptable, but prefer a dedicated alt field.
- Done when: Sanity enforces alt on new images; no "Blog image" fallback.

---

## Phase 3 — Internal linking overhaul (1–2 sessions)

### 3.1 Put `/wcag` in the main navigation
- [x] Add the WCAG hub to `components/header.tsx` (it currently links checklist, guides, learn, research, tools, wcag-3 — but not the single most important hub) and to `components/footer.tsx`.
- Done when: `/wcag` is reachable from every page's header and footer.

### 3.2 Drive the WCAG hub from `lib/wcag-data.ts`
- [x] Replace the hardcoded ~38-entry array in `app/wcag/page.tsx` with the full 86-criterion list from `lib/wcag-data.ts`. Built criteria link to their pages; unbuilt ones render as unlinked entries (name + summary) so the hub is complete and gains long-tail relevance now, and links light up automatically as Phase 5 ships pages.
- Done when: hub lists all 86 criteria grouped by principle/level, links generated from data.

### 3.3 Cross-link the older WCAG pages + prev/next everywhere
- [x] Add a shared `RelatedCriteria` component (data-driven from `lib/wcag-data.ts`) and render it on the 19 older SC pages that currently have zero sibling links (`1-1-1`–`2-4-3` era).
- [x] Add prev/next criterion navigation to ALL SC pages (ordered by criterion number, from wcag-data).
- Done when: every SC page links to ≥3 related criteria and has prev/next.

### 3.4 Un-gate the interactive checklist links
- [x] `components/checklists/interactive-wcag-checklist.tsx` line 65: `availableGuides` hardcodes 19 criteria. Derive it from the actual built-pages list (single source of truth module, e.g. `lib/wcag-pages.ts` exporting the built slugs) so all 37+ guides are linked and future pages appear automatically.
- Done when: checklist links to every existing SC page.

### 3.5 Expand the related-content database
- [x] `lib/internal-linking.ts` covers 36 URLs. Expand to cover: all 37+ WCAG pages, all 14 guides, all learn pages, research pages, checklists, all on-topic tools, and blog posts (pull Sanity slugs at build time or maintain per-category lists). Better: generate most entries from existing data modules instead of hand-maintaining.
- Done when: related-content component can recommend from the full content graph.

### 3.6 Fix hub and section gaps
- [x] `app/guides/page.tsx`: add the 2 missing guides (`accessibility-overlays`, `pdf-accessibility`).
- [x] Rebuild `app/sitemap-page/page.tsx` (HTML sitemap): generate from the same route data as `app/sitemap.ts` — currently ~20 stale links, 4 of 23 tools, zero WCAG pages, dead MDX links, and a wrong checklists path.
- [x] Lawsuit tracker (`app/research/accessibility-lawsuits/`): it's the flagship linkable asset but links to only 2 internal URLs. Add contextual links to relevant guides (ADA compliance, overlays), WCAG hub, services, and the laws page.
- [x] Decide `/accessible-table`: fold into `/learn/table` or redirect; don't leave a duplicate orphan.
- Done when: no indexable page is orphaned; hubs list all their children.

---

## Phase 4 — Blog consolidation (1–2 sessions)

Three parallel systems today: Sanity (`app/blog/[slug]`, done well), 12 hardcoded posts under `app/blog/*/` (orphaned — linked only from sitemap), 3 dead MDX files in `content/blog/`.

- [x] ~~Pick Sanity as the single system~~ **Adjusted:** Sanity remains the CMS for new posts; the 12 static posts stay as code routes but are fully integrated (listed on the blog index alongside Sanity posts, Article + Breadcrumb schema, OG images) — achieving the SEO goals without a content migration. A true CMS migration remains optional (needs Sanity write credentials + editorial pass). (it has the best template: Article schema, canonical, OG, TOC, related content).
- [x] ~~Migrate the 12 hardcoded posts into Sanity~~ **Adjusted (see above):** posts de-orphaned in place via lib/static-blog-posts.ts + blog index merge; same URLs, no redirects needed. Migrate the 12 hardcoded posts into Sanity at the SAME slugs (`/blog/accessibility-audit-checklist`, `ada-compliance-guide`, etc.), then delete the static `app/blog/*/page.tsx` directories. Same-slug migration = no redirects needed; verify each URL 200s from the `[slug]` route afterward.
- [x] Triage the 3 MDX files: content worth keeping → migrate into Sanity (new or existing posts); otherwise delete. Then delete `content/blog/` and strip the MDX code path + hardcoded mock posts from `lib/mdx.ts` (and its sitemap import, already removed in 0.2).
- [x] Ensure the blog index (`app/blog/page.tsx` / `BlogClientPage`) then lists all posts — automatic once everything is in Sanity.
- [x] While migrating, refresh stale "2024" content/titles and add each post to the related-content system (3.5).
- Done when: one blog system; all posts listed on the index, present in the sitemap, carrying Article schema; zero orphaned post routes; `lib/mdx.ts` gone.

---

## Phase 5 — WCAG content buildout: 49 missing pages (the long game, batched)

Data for all 86 criteria already exists in `lib/wcag-data.ts`. Use the NEWER page template (single server `page.tsx`, ~780 lines, FAQ + breadcrumb + TechArticle schema, related criteria) as the standard.

### 5.0 Template groundwork (do first)
- [x] Extract the newer template's repeated structure into shared components so each new page is content + config, not 780 duplicated lines.
- [x] Create `lib/wcag-pages.ts` (built-slugs source of truth) consumed by the hub (3.2), checklist (3.4), sitemap, and related-criteria links.
- [~] Plan to re-template the 19 older pages onto the new standard as a final batch (kills the client-page pattern, fixes their missing schema/links at the root — supersedes the patches in 2.3/3.3 for those pages). **PARTIAL:** `1-1-1` (with an extracted `interactive-demo.tsx` client component) and `2-3-1` (static, no flashing demo) re-templated onto the modern server layout; 17 remain on the old thin-wrapper + `client-page.tsx` pattern. Those 17 already carry full schema/OG/canonical/CriterionLinks, so this is a cosmetic/maintainability cleanup with no SEO impact — deferred because it needs parallel agents (rate-limited). Also fixed broken `/images/wcag-*.png` OG images (nonexistent files) on `2-3-1`, `2-4-1`, `2-4-2`, `2-4-3` → now use `/api/og`.

### 5.1 Batch 1 — 6 missing Level A (highest priority)
- [x] 2.5.1 Pointer Gestures, 2.5.2 Pointer Cancellation, 2.5.3 Label in Name, 2.5.4 Motion Actuation, 3.2.1 On Focus, 3.2.2 On Input.

### 5.2 Batch 2 — 11 missing Level AA
- [x] 1.4.4 Resize Text and 1.4.5 Images of Text first (highest search volume), then 1.2.4, 1.2.5, 1.3.4, 1.3.5, 2.4.5, 3.1.2, 3.2.3, 3.2.4, 3.3.4.

### 5.3 Batch 3 — 31 Level AAA (batched 8–10 per session)
- [x] All 31 AAA criteria; the existing `/checklists/wcag-2-2/aaa` page finally gets guides to link to.

### 5.4 Per-batch checklist (applies to every new page)
- [x] Metadata via shared helper (title ≤60 chars, no brand doubling, canonical, OG/Twitter).
- [x] TechArticle + BreadcrumbList + FAQPage schema; OG image via 2.2 template.
- [x] Related-criteria links + prev/next; added to `lib/wcag-pages.ts` (hub, checklist, sitemap update automatically); added to `lib/internal-linking.ts` if still hand-maintained.
- Done when: 86/86 criteria live, one consistent template, all cross-linked.

---

## Phase 6 — Strategic new content (parallel to Phase 5, one cluster per session)

### 6.1 Glossary
- [x] `/glossary` hub + per-term pages (or anchored sections) for ~40–60 accessibility terms (ARIA, screen reader, focus order, overlay, POUR, assistive technology…). DefinedTerm schema. Classic long-tail cluster every competitor has.

### 6.2 Jurisdiction / legislation pages (lawsuit tracker already holds the data)
- [x] `/compliance/eaa` — European Accessibility Act (top 2025–2026 query).
- [x] `/compliance/section-508`, `/compliance/en-301-549`, `/compliance/ada` (hub), state pages: California (Unruh), New York, Florida.
- [x] Cross-link tightly with the lawsuit tracker and laws research page.

### 6.3 WCAG version hub pages
- [x] `/wcag/2-1-vs-2-2` (perennial high volume), `/wcag/2-2-aa-requirements` style landing page; link from the WCAG hub and checklists.

### 6.4 Comparison pages
- [x] Overlay vendor comparisons / "accessiBe alternatives" style pages, "automated vs manual audit", "axe vs WAVE" — anchored by the existing overlay-detector tool and overlays guide. High commercial intent.

### 6.5 Topical focus cleanup
- [x] Decide the 4 off-topic tools (`json-formatter`, `password-generator`, `base64-converter`, `url-encoder-decoder`): either remove/redirect them, or keep them live but noindex + drop from sitemap so they stop diluting topical authority. (Recommendation: noindex + remove from sitemap; deletion optional later.)

### 6.6 Industry pages (lowest priority in this phase)
- [x] E-commerce, healthcare, education, government accessibility landing pages, linking to relevant tools/guides.

---

## Phase 7 — Verification & monitoring (after each phase, plus final pass)

- [x] After every phase: `npm run build` clean; validate `curl /sitemap.xml` and `/robots.txt`; spot-check rendered `<head>` (title, canonical, OG) on a sample of touched pages; validate JSON-LD with a schema validator on one page per template.
- [ ] Final pass: crawl the local site (or use the existing a11y-smoke pattern) to confirm zero orphan indexable pages, no duplicate titles, every indexable page in the sitemap and vice versa.
- [ ] Post-deploy: resubmit sitemap in Google Search Console; monitor Coverage report for the canonical-fix recovery; track the previously-homepage-canonicalized pages returning to the index.
- [ ] Set a quarterly reminder: refresh lastmod dates honestly, update year-stamped content, re-run the orphan/duplicate crawl.

---

## Suggested sequencing

| Order | Phase | Scope |
|-------|-------|-------|
| 1 | Phase 0 | Canonical, sitemap, titles, homepage |
| 2 | Phase 1 | Noindex, learn metadata, robots, misc |
| 3 | Phase 2 | OG + schema completion |
| 4 | Phase 3 | Internal linking |
| 5 | Phase 4 | Blog consolidation |
| 6+ | Phases 5 & 6 interleaved | One WCAG batch or one content cluster per session |
| Always | Phase 7 | Verify after each phase |

Phases 0–1 are where ranking recovery starts (canonical + indexing fixes); everything after compounds on top.
