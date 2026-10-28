# Build plan: eight new tools (28 October 2026)

Scope: items 1, 2, 3, 4, 6 and 7 of `docs/tool-opportunities-2026-10-28.md`. Item 7 is three tools.
The VPAT/ACR generator (item 5) is out of scope for this build.

| # | Tool | Route | Runs | Main WCAG criteria |
|---|---|---|---|---|
| 1 | Readability Checker | `/tools/readability-checker` | Browser; URL mode fetches HTML on the server | 3.1.5 (AAA), plain language |
| 2 | Text Over Image Contrast Checker | `/tools/text-over-image-contrast-checker` | Browser only | 1.4.3, 1.4.6, 1.4.11 |
| 3 | Website Vision Simulator | `/tools/website-vision-simulator` | Server renders, browser filters | 1.4.1, 1.4.3, 1.4.11 |
| 4 | Screen Reader Simulator | `/tools/screen-reader-simulator` | Server (Chrome accessibility tree) | 1.3.1, 2.4.4, 2.4.6, 4.1.2 |
| 6 | Word and PowerPoint Accessibility Checker | `/tools/word-powerpoint-accessibility-checker` | Browser only, file never uploaded | 1.1.1, 1.3.1, 2.4.2, 2.4.4, 3.1.1 |
| 7a | Alt Text Checker | `/tools/alt-text-checker` | Server; optional AI review | 1.1.1, 2.4.4 |
| 7b | Keyboard Focus Order Checker | `/tools/focus-order-checker` | Server (real Tab presses) | 2.1.1, 2.1.2, 2.4.3, 2.4.7, 2.4.11, 2.5.8 |
| 7c | Accessibility Maturity Assessment | `/tools/accessibility-maturity-assessment` | Browser only | W3C Accessibility Maturity Model |

## Shared foundation (built first)

- `lib/public-url.ts` (server only). `parsePublicUrl(raw)` accepts `example.com` or a full URL and
  throws `PublicUrlError` with a visitor-facing sentence. `assertPublicUrl(url)` resolves DNS with
  the OS resolver and refuses private, loopback, link-local, CGNAT, multicast and IPv4-in-IPv6
  addresses. `createHostGuard()` caches a per-host verdict for browser request interception.
  `fetchPublicHtml(url, { userAgent })` fetches without a browser and re-checks every redirect.
- `lib/render/browser.ts` (server only). `withRenderedPage(url, options, work)` launches Chromium
  (chromium-min on Vercel, puppeteer plus the installed Chrome locally), intercepts every request
  through the host guard, bypasses service workers, waits for load plus network idle, refuses
  HTTP 4xx/5xx and bot-check interstitials (they return 200 and would read as a clean page), and
  always closes the browser. Also `scrollThrough(page)` for lazy content and
  `captureScreenshot(page, { maxHeight, quality })` returning a JPEG data URL.
- `lib/render/route.ts` (server only). `urlToolRateLimit(max)`, `toolErrorResponse(error)` and
  `recordUrlToolRun(request, {...})`, which sends one `url_tool_run` PostHog event per run with the
  tool, domain, outcome and duration, so we can see which sites people check.
- `lib/render/client.ts`. `postTool(endpoint, body, signal)` for the browser; returns the error
  sentence to show, including the rate limiter's message.
- `components/tools/url-check-form.tsx`. The labelled address field and submit button shared by
  the URL tools.
- `SiteScanHandoff` gained `defaultValue`, so a URL tool can hand its address to the free scan.
- `fflate` added for reading .docx and .pptx in the browser.
- `alt_text_checker` added to the `tool_type` enum (`drizzle/0017_alt_text_checker_tool.sql`),
  `TOOL_CREDITS` (2) and the trial caps (2 per IP per day). The migration has to be applied to
  the live database before deploy, with the owner's approval.

## Access and cost

- Browser-only tools: no limits, nothing sent anywhere.
- Server-rendered tools: free, no account, 15 runs per IP per hour per tool (in memory, so it
  slows abuse rather than enforcing a quota). Each run is one Chromium launch, 60 s budget,
  1024 MB in `vercel.json`.
- Alt text AI review: opt-in checkbox. Anonymous visitors get 2 a day through `trial_usage`;
  signed-in users pay 2 credits; unlimited-access users are not charged. The rule checks always
  run free, so a refused AI review still returns results.

## Tool specs

### 1. Readability Checker

- Two inputs: paste text, or a URL. URL mode: `POST /api/tools/readability-checker` returns the
  HTML (via `fetchPublicHtml`); the browser parses it with `DOMParser` and reads `main`, then
  `article`, then `body`, dropping nav, header, footer, aside, script, style and hidden content.
  Under 50 words extracted means a script-rendered page: say so and suggest pasting the text.
- Scores: Flesch Reading Ease, Flesch-Kincaid Grade, Gunning Fog, SMOG, Coleman-Liau, ARI, plus
  an average grade and an estimated reading age. Reuse `countSyllables` and `analyzeText` from
  `lib/typography/metrics.ts` and the formulas in `lib/typography/readability.ts`; add the other
  formulas in a new pure module.
- Plain-language findings, each with a count and the passage highlighted: very long sentences
  (over 25 words), hard and very hard sentences, passive voice (heuristic), complex words with a
  plainer alternative (our own word list), unexplained abbreviations (WCAG 3.1.4), long
  paragraphs, and adverbs only as a light hint.
- WCAG 3.1.5 framing: text above roughly lower secondary level (grade 9) needs supplemental
  content or a simpler version. Say it is AAA and advisory, and that scores are estimates.
- Highlights must not rely on colour alone: underline style plus a text label, and a findings
  list that links to each passage.

### 2. Text Over Image Contrast Checker

- Upload, drop or paste an image (screenshot or design export). The visitor marks the text area by
  dragging, or with number inputs and arrow keys (keyboard equivalent is required).
- Text colour: auto-detected (two-cluster split inside the area, the minority cluster is the text),
  or set by hex input, or by picking a pixel.
- Analysis: classify pixels as text or background; drop background pixels within 2 px of text
  (anti-aliased edges are blends, not background); compute the WCAG ratio of the text colour
  against every remaining background pixel using a 256-entry luminance lookup table. Report the
  worst ratio, the 5th percentile, the share of the area that passes, and APCA Lc for the worst
  point (`lib/color/apca.ts`).
- Thresholds: normal text 4.5:1, large text 3:1, non-text 3:1, with AAA 7:1 and 4.5:1 shown too.
- Heatmap overlay marking failing background pixels, with a toggle and a text summary.
- Fix suggestions: the smallest black or white scrim opacity that makes the worst point pass,
  with CSS (`linear-gradient(rgba(...), rgba(...)), url(...)`), and a text-shadow note.
- Use `lib/color/oklch.ts` (`relativeLuminance`, `contrastRatioWCAG`, `compositeOver`). Do not reuse
  the contrast checker's inline approximate APCA.

### 3. Website Vision Simulator

- `POST /api/tools/website-vision-simulator` renders the URL at 1280 wide with `scrollThrough`,
  returns `captureScreenshot` (up to 4000 px tall) plus the title.
- Image upload mode as well (browser only).
- Filters applied in the browser to the one screenshot: protanopia, deuteranopia, tritanopia
  (Machado 2009 via `cvdSvgMatrixValues`, with a severity slider for the anomalous forms by
  interpolating the matrix with identity), achromatopsia, blurred vision (three levels), and
  low contrast sensitivity. Side-by-side or single view, keyboard-operable comparison.
- Copy is careful: simulations approximate, real vision varies, and the tool is for finding
  colour-only meaning (1.4.1) and weak contrast, not for knowing what someone sees.

### 4. Screen Reader Simulator

- `POST /api/tools/screen-reader-simulator` renders the URL (media blocked) and reads Chrome's
  computed tree with CDP `Accessibility.getFullAXTree`. Builds, server side:
  - a reading-order transcript in browse-mode style: "heading level 2, Pricing", "link, Contact
    us", "button, Menu, collapsed", "edit, Email, required", landmark start and end, list item
    counts, "image, Logo", "unlabelled image", plain text lines;
  - summaries: headings outline, landmarks, links, form fields, images, and buttons, with
    problems flagged (no name, duplicate ambiguous link text such as "Read more", URL as name,
    skipped heading levels, missing main landmark, no h1).
- Caps: about 1,500 transcript lines and a note when truncated.
- Browser: transcript with filters (all, headings, links, landmarks, forms), Tab-like stepping,
  and optional speech with `speechSynthesis` (play, pause, stop, rate, current line highlighted).
  Speech must never start on its own, and the page must work without it.
- Says plainly: this is a preview from Chrome's accessibility tree, not NVDA, JAWS or VoiceOver,
  which phrase things differently and add their own behaviour.

### 6. Word and PowerPoint Accessibility Checker

- Browser only: read .docx or .pptx with `fflate` (`unzipSync`) and `DOMParser`. The file never
  leaves the device; say so. Refuse .doc, .ppt and files over 50 MB with a clear message.
- Word checks: document title (`docProps/core.xml`), document language, heading styles used and
  levels not skipped, likely fake headings (short, all bold or large, not a heading style), image
  alt text (`wp:docPr` descr, decorative flag), table header row (`w:tblHeader`), merged cells,
  link text that is a raw URL or "click here", empty paragraphs used for spacing, typed bullets
  instead of real lists, floating text boxes, explicit text colours with low contrast.
- PowerPoint checks: presentation title, every slide has a title and titles are unique, picture
  and chart alt text (`p:cNvPr` descr, decorative flag), table header row (`a:tblPr firstRow`),
  reading order (title should be first in the shape tree), language, link text, audio and
  video present (captions reminder).
- Each finding: severity, WCAG criterion, where (paragraph excerpt or slide number), and how to
  fix it in Word or PowerPoint. Summary counts and a CSV or Excel export.

### 7a. Alt Text Checker

- `POST /api/tools/alt-text-checker` with `{ url, ai }`. Renders with `scrollThrough`, collects
  every img, input type=image, area, role=img and svg: alt presence and text, src file name,
  natural and rendered size, whether it is inside a link or button and that control's other text,
  figure caption, nearby text.
- Rules (free): missing alt, image link or button with no name, file name as alt, "image of" and
  similar, placeholder words ("image", "photo", "logo" alone), over 150 characters, alt repeating
  the caption or the link's own text, the same alt on different images, "click here" or "link to",
  svg with no name and not hidden, title only. Tracking pixels and hidden images are skipped.
- AI review (opt-in): up to 8 images, prioritised (missing alt first, then large and linked
  images), each captured as a JPEG of the element and sent in one vision call with its alt and
  context. Forced tool call for structured output (as in `lib/assistant/intent.ts`). Each verdict:
  accurate, incomplete, inaccurate, should be decorative, or decorative and fine, with a reason
  and a suggested alt.
- Results: per-image cards with the thumbnail, current alt, findings and suggestion; summary
  counts; CSV export.

### 7b. Keyboard Focus Order Checker

- `POST /api/tools/focus-order-checker` with `{ url, mode: "focus" | "targets" }`.
- Focus mode: presses Tab up to 80 times. For each stop records the element, role and name,
  position, and whether focus is visible: a clip screenshot with focus, then after `blur()`, a pixel
  difference; restore focus and continue. Flags: no visible indicator (2.4.7), focus entirely
  hidden by other content (2.4.11, sampled with `elementsFromPoint`), focus on an invisible or
  off-screen element, positive tabindex (2.4.3), focus stuck on one element or a short loop
  (2.1.2), backward jumps up the page (informational). Injects CSS to stop transitions so the
  indicator is captured in its final state.
- Targets mode (2.5.8): every interactive element measured against 24 by 24 CSS pixels with the
  spacing exception (a 24 px circle on each undersized target must not intersect another target
  or its circle), and the inline and user-agent exceptions.
- Returns a full-page screenshot (up to 5000 px). The browser draws numbered markers and the path
  over it, with a matching ordered list so the result is not visual-only.

### 7c. Accessibility Maturity Assessment

- Browser only. The W3C Accessibility Maturity Model (Group Note): seven dimensions
  (Communications, Oversight and Culture, ICT Development Life Cycle, Knowledge and Skills,
  Personnel, Procurement, Support), four levels (Inactive, Launch, Integrate, Optimize), and
  proof points per dimension. Proof points are paraphrased in our own words from the Note, with
  attribution and a link; the dimension and level names are the W3C's. Date-stamp the version used.
- One dimension per step (the EAA scope checker's step pattern), each proof point rated on the four
  levels plus "not sure", with optional notes. Progress saved in localStorage (the
  `useSyncExternalStore` pattern in `components/checklists/wcag-criteria-checklist.tsx`).
- Results: per-dimension level (shown as our summary, since the Note defines no numeric score),
  a bar chart with a table equivalent, the weakest dimensions with next steps, PDF (jsPDF, lazy
  import) and Excel (xlsx) export, and a link to the services for organisations that land on
  Inactive or Launch.

## Conventions for every tool

- Page: copy `app/tools/accessible-name-previewer/page.tsx`. Hand-written `metadata` with
  `clampDescription`, canonical, OG image `/api/og?title=...&section=Free tool`;
  `BreadcrumbStructuredData`, `ToolStructuredData`, `HowToStructuredData`; header block, eyebrow
  ("Free tool · Runs in your browser" or "Free tool · No sign-up"), one `h1`; prose sections that
  explain the criteria and the tool's limits honestly; `FaqSection` (never inline FAQ schema);
  `RelatedContent`. Title 60 characters or fewer, no brand suffix.
- Client component in `components/tools/<slug>.tsx` (helpers in `components/tools/<slug>/` if
  large), `"use client"`, default export. Pure logic in `lib/<area>/`, testable without a browser.
- URL tools: `UrlCheckForm`, `postTool`, a polite status region announcing progress and results,
  focus moved to the results heading when they arrive, and a `SiteScanHandoff` with
  `defaultValue` after the results.
- Route: `runtime = "nodejs"`, `maxDuration = 60`, rate limit first, `parsePublicUrl`,
  `withRenderedPage`, `recordUrlToolRun` on success and failure, `toolErrorResponse` for errors.
- WCAG 2.2 AA in everything: semantic HTML, labelled controls, visible focus, keyboard equivalents
  for every pointer action, no colour-only meaning, text alternatives for every chart or image
  result, works at 320 px wide and 200% zoom, light and dark themes, reduced motion respected.
- `cn()` for conditional classes. Never edit `components/ui/`. No em dashes or en dashes in copy.

## SEO pages around the tools

Checked against the site's existing content, the Search Console export (13 October 2026) and
Google and Bing autocomplete on 28 October 2026. A topic gets a new page only where nothing on the
site covers it; otherwise the tool is linked from the page that does.

| Page | Supports | Why |
|---|---|---|
| `/guides/how-to-write-alt-text` | Alt Text Checker, Alt Text Generator | Full autocomplete lists for "how to write alt text" and "alt text examples"; no guide existed |
| `/guides/accessible-word-documents` | Word and PowerPoint checker | "how to make a word document accessible", "word accessibility checklist"; no guide existed |
| `/guides/accessible-powerpoint-presentations` | Word and PowerPoint checker | "powerpoint accessibility", "reading order", "checklist"; no guide existed |
| `/guides/color-blind-friendly-design` | Website Vision Simulator, palette tools | "is my website color blind friendly"; colour blindness was mentioned once across the colour guides |
| `/guides/text-over-images` | Text Over Image Contrast Checker | "text on background image accessibility"; not covered anywhere |
| `/guides/accessibility-maturity-model` | Maturity Assessment | "accessibility maturity model w3c", "amm", "damm"; the site never explained the model |
| `/tools/target-size-checker` | Focus order checker's target mode, opened on a phone viewport | "touch target size checker" already had impressions at position 11 |

Not given new pages, because existing pages already own the topic: readability and plain language
(`/guides/cognitive-accessibility`, `/wcag/3-1-5`), screen reader testing (five guides), and focus
indicators (`/guides/focus-management`, `/guides/keyboard-accessibility`).

Every new tool page also gets its own Twitter card metadata; before this they inherited the
site-wide generic card.

## Registration and release (after the tools are built)

- `lib/tool-catalog.ts` and icons in `components/tools/tool-icon.tsx`, `lib/site-routes.ts`,
  `lib/internal-linking.ts`, `vercel.json` (1024 MB for the four Chromium routes), Curb's search
  index (`npm run build && npm run assistant:index`), and links from related guides and WCAG pages.
- Verify on a production build (`next start`): each tool end to end in Puppeteer against real
  sites, axe on every page, keyboard only, 375 px wide, dark mode, and the SSRF guard (private
  address, redirect to a private address, private subresource).
- Apply migration 0017 to the live database (with approval), then commit on a branch, merge into
  main and push.
