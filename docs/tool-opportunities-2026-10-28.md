# Tool and content opportunities, 28 October 2026

What accessibility searchers want that accessibility.build does not offer yet, ranked. Builds on
`docs/content-ideas-2026-10.md` and the September market-size verdict (search demand for audits
themselves is small; interactive tools earn about 15 times the click-through of articles).

## How this was measured

- **Search Console:** top 1,000 queries, last 16 months, exported 13 October 2026
  (62,234 impressions, 814 clicks across those queries).
- **Autocomplete:** Google and Bing suggestions for each candidate tool type. A full list (10 of
  10) means many distinct searches exist around the phrase. It is a demand signal, not a volume.
- **Competitor sweep:** the free tools of WebAIM, W3C WAI, Deque, TPGi, Siteimprove, BOIA,
  accessibilitychecker.org, accessibleweb, Stark, Silktide, thefrontkit and others, plus Chrome Web
  Store user counts.
- **Not available:** no keyword-volume API is configured (DataForSEO, Ahrefs, Semrush), and Google
  Trends returns 429 from this machine. Treat rankings as relative, not as search volumes.

## A. Quick wins: tools you already have that rank badly for their own name

These have proven demand (you already get impressions) but sit on page 3 to 7. Improving them is
cheaper than building anything new.

| Query cluster | Impressions | Position | Page that should win |
|---|---|---|---|
| accessibility statement generator | 1,480 | 64.5 | /tools/accessibility-statement-generator |
| WCAG checklist, AA and AAA checklist | 2,344 | 42 to 64 | /checklists/wcag-2-2 (the Excel variant ranks 3.7) |
| contrast checker variants (wcag, colour, ada, hex) | about 4,500 | 35 to 60 | /tools/contrast-checker |
| accessibility report generator | 1,010 | 27.1 | /tools/accessibility-report-generator |
| alt text generator, AI alt text generator | 749 | 15 to 30 | /tools/alt-text-generator |
| wcag json export | 383 | 37.6 | no page: add a WCAG data download (CSV, Excel, JSON) |
| digital accessibility laws by country | 285 | 59.1 | /research/accessibility-laws |
| web accessibility lawsuits (and variants) | about 1,300 | 13 to 15 | /research/accessibility-lawsuits, nearly page 1 |

The WCAG data page is the one new page in this list. W3C now publishes an official `wcag.json`
(w3.org/WAI/WCAG22/wcag.json, monthly), so the value is a friendly download in CSV and Excel,
built from `lib/wcag-data.ts`, with levels, principles and links to the criterion pages, crediting
and linking the W3C file.

## B. New tools, ranked

Ranked by demand, how weak the existing free versions are, fit with the site, and effort. "URL
input" matters: those tools capture a domain, which feeds the prospects pipeline.

1. **Readability and plain-language checker** (paste text or a URL; WCAG 3.1.5 and plain-language
   framing). Strongest autocomplete demand of anything checked: 29 Google and 31 Bing suggestions
   across "readability checker", "reading level checker", "grade level checker". Hemingway has no
   URL input and no WCAG framing; Readable is a trial. The scoring already exists as a panel in the
   typography studio. Effort: low. Quick win.
2. **Text-over-image contrast checker** (upload a screenshot, mark the text area, report the worst
   ratio across it). 26 Google and 25 Bing suggestions. Existing tools (tabnav, poper.ai) make you
   pick two colours by hand and report one ratio, while WCAG requires the text to pass at every
   point. Fits the designer audience that drives most of the site's traffic. Effort: low to medium.
3. **Website vision simulator** (render a URL as seen with each colour vision deficiency, blur and
   low contrast). 20 and 12 suggestions; Colorblindly alone has 100,000 Chrome users. The best known
   web version (Toptal) calls itself "still in development" and has not been updated since 2022;
   image-only simulators are commodity. Reuses the screenshot pipeline and the palette studio's
   simulation code. URL input. Effort: low to medium.
4. **Screen reader preview for a URL** (reading-order transcript from the computed accessibility
   tree: headings, landmarks, links, form labels, with speech playback). 22 and 17 suggestions.
   Extends the accessible name previewer to whole pages. Must say plainly it is not NVDA or JAWS.
   URL input. Effort: medium.
5. **VPAT/ACR generator** (VPAT 2.5Rev, prefilled from a scan, every automated row marked "Not
   evaluated" until a person reviews it). 23 and 17 suggestions, buyer intent (procurement).
   GSA's OpenACR editor is a year behind the current VPAT revision; others export HTML only and none
   prefill from a scan. Ties directly to the audit service. Effort: medium.
6. **Word and PowerPoint accessibility checker** (upload .docx or .pptx: headings, alt text, table
   headers, document title and language, slide titles). 30 and 15 suggestions, many "not working"
   and "online" variants. The free option is Microsoft's built-in checker inside Office; no free
   online checker was found. Pairs with the PDF checker and DocAccessible. Effort: medium.
7. **Alt text quality auditor** (URL: compares each image's existing alt with the image using the
   vision model, flags filenames and "image of", suggests rewrites). 21 and 17 suggestions.
   Competitors only check that alt is present. Reuses the alt text generator. URL input. Effort:
   low to medium.
8. **Keyboard focus-order and focus-visibility tester** (URL: tabs through the rendered page,
   numbers each stop, flags invisible focus 2.4.7, obscured focus 2.4.11, traps and positive
   tabindex; add target size 2.5.8 as a mode). 17 and 13 suggestions. Effort: medium.
9. **W3C Accessibility Maturity Model self-assessment.** 23 and 10 suggestions. W3C provides only
   an Excel workbook; Intopia's online snapshot is a beta; vendor versions use their own models or
   gate results behind a sales form. Speaks to the people who buy audits. Same quiz pattern as the
   EAA scope checker. Effort: low.
10. **EPUB accessibility checker.** The EAA covers e-books from June 2025; Ace by DAISY is desktop
    and command line only. Small but uncontested. Effort: medium.

Lower priority: caption file (SRT/VTT) quality checker (free versions exist, but none frame it as
WCAG 1.2.2), HTML email accessibility checker, a Figma plugin ("wcag plugin figma" appears in
autocomplete and designers are the main audience, but Stark and others crowd it), and a CI/CD
accessibility workflow generator (no generator exists and AI-style queries already land at
positions 5 to 10, but autocomplete shows almost no search demand).

## C. Do not build

- Plain or APCA contrast checkers, statement generators, single-URL scanners: commodity, and the
  site already has them.
- Image-only colour blindness simulators: at least eight free ones. Only as a mode of item 3.
- Caption and audio-description generators: "caption generator" searches are mostly Instagram
  captions; audio description is offered free or freemium by several services and is costly to run.
- Dyslexia "experience" simulators: the International Dyslexia Association calls them misleading.
- A free overlay widget: contradicts the overlay detector and the site's position.
- Standalone link-text, landmark or cost calculators and an ARIA snippet checker: little demand;
  fold into existing tools.
- Photosensitive seizure (flash) testing: real demand, but thresholds need validation and the
  liability is high.
- Standalone target size checker: crowded (poper.ai, jquery.app, a Chrome extension, a UK
  government bookmarklet); include it in item 8 instead.

## D. Competitor to watch

thefrontkit.com/tools now offers a similar free suite (screen reader simulator, focus order
visualizer, ARIA validator, PDF checker, VPAT generator) and sells audits. The research agent
reported that its URL tools parse static HTML rather than rendering the page; that was not
re-verified. If true, tools built on this site's real browser rendering will be more accurate.

## Suggested order

1. The readability checker and the WCAG data download (quick, proven demand).
2. The text-over-image contrast checker (designer audience, weak competition).
3. The website vision simulator and the screen reader preview (URL input, so they also capture
   domains).
4. The VPAT/ACR generator (closest to a paid audit).
5. In parallel, the Part A fixes on the statement generator, contrast checker and checklists.

## Sources

- Search Console export: accessibility.build Performance on Search, 2026-10-13.
- W3C WCAG 2.2 JSON: https://www.w3.org/WAI/WCAG22/wcag.json
- W3C Accessibility Maturity Model: https://www.w3.org/TR/maturity-model/
- Intopia maturity snapshot: https://accessibility-snapshot.intopia.digital/
- Toptal colour filter: https://www.toptal.com/designers/colorfilter
- thefrontkit tools: https://thefrontkit.com/tools
- GSA OpenACR editor: https://acreditor.section508.gov/
- Target size tools: https://www.poper.ai/tools/tap-target-size-checker/ and
  https://www.jquery.app/tools/touch-target-size-checker/
- CI/CD guides (no generator found): https://accessibility.civicactions.com/posts/automated-accessibility-testing-leveraging-github-actions-and-pa11y-ci-with-axe
