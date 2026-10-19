# Content and feature ideas, October 2026

Researched 19 October 2026. Seventeen ranked ideas, each checked against what the
site already has and against primary or near-primary sources looked up today. A
"verify at build" line on each idea names the facts that still rest on secondary
sources, so the build session knows exactly what to confirm before publishing.

## How the list was made

1. Inventory of the live site: 59 guides, 27 tools, 14 research pages, 9 compliance
   pages, 5 industry pages, 2 checklists, 3 case studies, 2 reference pages, 87 WCAG
   criterion pages, 5 WCAG 3 pages and 43 Sanity blog posts. Every idea below was
   grepped against `app/`, `lib/data/` and `components/` and the Sanity post list.
2. Re-read of the three earlier plans (August content-gap run, September AI-presence
   plan, September market-size verdict) so nothing already built or already rejected
   is proposed again.
3. Thirty web lookups on 19 October 2026 covering EN 301 549 v4.1.1, EAA enforcement,
   NFB v. DOJ, Apple's labels, the EU AI Act, PDF/UA-2, ARIA 1.3, the Section 508
   refresh, India, Canada, Australia, Colorado, the WAD review, customizable select,
   the W3C Maturity Model, 2026 lawsuit trends, caption tooling, procurement clause
   templates, target-size tools and EAA checklist competition.

## Ranking rules (measured on this site, not assumed)

- Tools, checklists, generators and templates convert about six times better than
  prose (13.5% CTR vs 0.9% at the same rank; Excel and template queries are 57% of
  clicks). Interactive pages survive AI Overviews; static guides do not.
- Comparison pages and dated statistics earn AI citations; generic guides do not.
  Every table row needs a number, a date, a price or a test result.
- SEO is credibility and funnel, not a lead channel. An idea must serve one of three
  jobs: credibility when a prospect Googles the site, AI-citation authority, or feeding
  the outbound prospect pipeline with domains.
- Standing stop list: no new component guides, no "wcag checker" head terms, no
  llms.txt work, no rewriting pages "for AI".

Tiers below are in build order. Within a tier, items are ordered by value.

---

## Tier A. Interactive tools and downloadable checklists

### 1. EAA readiness checklist with Excel download

- **Slug:** `/checklists/eaa`
- **Format:** interactive checklist (same component pattern as
  `components/checklists/interactive-en301549-checklist.tsx`, localStorage state,
  xlsx export) backed by `lib/data/eaa-checklist.json`.
- **Why now:** "wcag 2.2 checklist excel" gets 21.6% CTR at position 1.2 and
  `/checklists` has exactly two checklists. Today's competitor sweep found no EAA
  checklist offered as a spreadsheet anywhere: Testfort is a PDF, Futurice, Cliplister,
  Strix and 3Play Media are gated behind email forms, and all of them are written to
  the June 2025 deadline that has passed. The slot is empty.
- **What exists:** `/compliance/eaa`, `/compliance/eaa-ireland`, `/tools/eaa-scope-checker`
  (scope only), `/checklists/en-301-549` (v3.2.1 clauses). Nothing operational.
- **Outline:** one row per obligation, sourced to the article or annex: Annex I
  Section I (general requirements for all services), Section II to VII (sector
  requirements: e-commerce, banking, e-books, transport, telecoms, AV media,
  emergency 112), Article 13 service-provider duties (the accessibility information
  that must be published, the Annex V conformity statement), Article 14 and Annex VI
  disproportionate-burden documentation, Article 32 transition (service contracts to
  28 June 2030, self-service terminals up to 20 years), the microenterprise exemption,
  national-authority contact and complaint route, and a "post-OJ" block for EN 301 549
  v4.1.1 Annex ZB once cited. Columns: obligation, source, who it applies to,
  evidence to keep, status, notes. Add it to the `/checklists` hub, `lib/site-routes.ts`,
  `lib/internal-linking.ts`, and link from the three EAA pages and the scope checker.
- **Verify at build:** read Annex I and Article 13/14/32 text from EUR-Lex in the
  browser pane (curl is blocked). Confirm Annex V/VI numbering against the consolidated
  text.
- **Effort:** 1 day. **Metric:** clicks on `/checklists/*`, xlsx downloads.
- **Shipped (19 October 2026):** `/checklists/eaa`, backed by `lib/data/eaa-checklist.json`
  (82 obligations in 15 sections, fields id, section, obligation, source, appliesTo,
  evidence, notes) and `components/checklists/interactive-eaa-checklist.tsx` (sector
  presets, four-state status, per-row notes, localStorage via useSyncExternalStore,
  xlsx export with a summary sheet). Wired into the `/checklists` hub, site routes,
  internal linking, and linked from `/compliance/eaa`, `/compliance/eaa-ireland` and
  `/tools/eaa-scope-checker`. Two corrections to the outline above, made from the
  EUR-Lex text: in Annex I, Section I is the general requirements for *products* and
  Section III is the general requirements for *services*, with the sector rules in
  Section IV points (a) to (g) and 112 in Section V; and Annex V is "information on
  services meeting accessibility requirements", not a conformity statement (the EU
  declaration of conformity in Article 16 and Annex IV exists for products only).
  The dataset also carries a compact products block (Articles 7 to 12, Annex I
  Sections I and II, Annex IV) so manufacturers and importers get a scope too. The
  post-OJ block is a single "harmonised standards" section that records the citation
  status as of 19 October 2026; refresh it when v4.1.1 is cited.

### 2. Three more checklists in the same format: forms, PDF, mobile apps

- **Slugs:** `/checklists/accessible-forms`, `/checklists/pdf-accessibility`,
  `/checklists/mobile-app-accessibility`
- **Why:** the format is the single most proven thing on the site, and these three
  were named in the August run (Tier 2 item 10) and never built. Each ties to an
  existing guide or tool: `/guides/accessible-forms` and `/guides/accessible-form-validation`,
  `/guides/pdf-accessibility` and `/tools/pdf-accessibility-checker` and
  `/services/pdf-remediation`, `/guides/mobile-accessibility` and
  `/tools/mobile-accessibility-checker`.
- **Sources per checklist:** forms: WCAG 1.3.1, 1.3.5, 2.4.6, 3.3.1 to 3.3.4 plus the
  WCAG 2.2 additions 3.3.7 Redundant Entry and 3.3.8 Accessible Authentication; PDF:
  PDF/UA-1 (ISO 14289-1) via the Matterhorn Protocol checkpoints plus the WCAG 2.2
  criteria that apply to documents, with a PDF/UA-2 column (see idea 13); mobile:
  WCAG2ICT (the W3C Note mapping WCAG to non-web ICT), EN 301 549 clause 11 (software),
  and platform guidance (Apple Human Interface Guidelines accessibility section, Android
  accessibility developer guide).
- **Verify at build:** Matterhorn Protocol current version and whether it covers
  PDF/UA-2 (today's search found no "Matterhorn 2"; treat it as UA-1 only until the PDF
  Association's page says otherwise). WCAG2ICT latest Note date.
- **Effort:** 1 day each. **Metric:** as idea 1.

### 3. W3C Accessibility Maturity Model self-assessment tool

- **Slug:** `/tools/accessibility-maturity-assessment`
- **Format:** client component; the user rates proof points per dimension, the tool
  derives a level per dimension, shows a radar or bar summary (text alternatives
  required), exports PDF and xlsx, saves to localStorage. No email gate.
- **Why:** the W3C published the Accessibility Maturity Model as a Group Note on
  4 November 2025 (Accessible Platform Architectures WG) under the permissive W3C
  Document Licence. Seven dimensions: Communications, Oversight and Culture, ICT
  Development Life Cycle, Knowledge and Skills, Personnel, Procurement, Support. Four
  cumulative levels: Inactive, Launch, Integrate, Optimize. Evidence is "proof points",
  and the Note explicitly has no numeric scoring. The W3C's own assessment aid is an
  experimental spreadsheet labelled work in progress. Competition: Intopia's snapshot
  (beta, 1 to 5 scale, its own seven areas), Level Access's 20-question quick check
  (its proprietary DAMM, not the W3C model), Hassell's scorecard (ISO 30071-1). Nothing
  free, ungated and faithful to the W3C proof points exists. The site currently
  mentions "maturity" in two files and the W3C model in none.
- **Prospecting angle:** an organisation that lands on Inactive or Launch in
  Procurement or ICT Development Life Cycle has just written its own audit brief. The
  result page should hand off to the free scan and services with the same
  "at result time, never bare" rule the funnel uses.
- **Verify at build:** copy proof points from the Note itself
  (`https://www.w3.org/TR/maturity-model/`), not from vendor summaries; the task force
  minutes of August and September 2026 discuss a 1.1 First Public Working Draft, so
  date-stamp the tool to the 4 Nov 2025 Note and plan a refresh.
- **Effort:** 2 days. **Metric:** completions, exports, handoffs to scan.

### 4. Accessibility compliance deadline calendar with .ics, CSV and JSON

- **Slug:** `/research/accessibility-compliance-deadlines` plus
  `/api/research/compliance-deadlines` (existing dataset route pattern) and an `.ics`
  download.
- **Why:** "when is the deadline for X" is exactly the dated, passage-sized fact AI
  engines cite, and no page on the site or elsewhere lists every live obligation in
  one dated table. The laws tracker is organised by law; this is organised by date and
  carries a status per row. It also gives the monthly research refresh a natural
  headline ("next deadline in N days").
- **Rows verified in this session or in the 14 Oct 2026 sweep** (one row each, with
  source and status):
  - 30 Oct 2026: Hawaii Act 257 proposed-rule comments close (HCRC, WCAG 2.1 AA,
    24 or 36 months after the final rule).
  - ~30 Nov or 16 Dec 2026: EN 301 549 v4.1.1 Official Journal citation expected
    (Deque says around 30 Nov; NDA Ireland says 16 Dec). Status: expected.
  - ~4 Dec 2026: Carrefour France six-month compliance deadline from the Caen order
    of 4 June 2026. Status: court order.
  - 26 Apr 2027 and 26 Apr 2028: ADA Title II web rule (DOJ interim final rule of
    20 Apr 2026). Status: in force, challenged in NFB v. DOJ (D. Md. 1:26-cv-02007,
    summary-judgment motion filed 28 Sep 2026).
  - 11 May 2027: HHS Section 504 first web deadline.
  - 28 Jun 2027: EAA Article 4(8), real-time text for 112 emergency communications.
  - 2 Dec 2027: EU AI Act Article 16(l) accessibility duty for Annex III high-risk
    systems; 2 Aug 2028 for Annex I (dates set by Regulation (EU) 2026/1744,
    OJ 24 Jul 2026).
  - 5 Dec 2027: Canada, federal public sector web pages, accessibility statements and
    training; 5 Dec 2028: large and medium businesses web, apps, documents, purchased
    products; Dec 2033: First Nations band councils (Accessible Canada Regulations
    amendments, Canada Gazette Part II, Dec 2025).
  - 12 Jul 2027: Merrell v. Ralph Lauren jury trial (watch item, not a deadline).
  - 28 Jun 2030: EAA Article 32 end of the service-contract transition.
  - India: 1 year (turnover ≥ ₹500 crore), 18 months (others), 2 years (full
    compliance) after the final RPwD amendment rules are notified. Status: draft,
    final notification not found as of 19 Oct 2026.
- **Verify at build:** every date against the primary document already cited in
  `lib/data/accessibility-laws.ts`; the Canada SOR number (path suggests
  SOR/2025-255) against the Gazette; add past dates (28 Jun 2025 EAA, 1 Jul 2025
  Colorado, 5 Aug 2026 UK Services Code, 17 Aug 2026 FCC caption settings) as
  "in force" rows.
- **Effort:** 1 day. **Metric:** AI citations for deadline queries, .ics downloads.

### 5. Target size (WCAG 2.5.8) checker for a URL

- **Slug:** `/tools/target-size-checker`
- **Why:** 2.5.8 becomes a European legal requirement when EN 301 549 v4.1.1 is cited
  (it adopts WCAG 2.2 AA), and the page `/wcag/2-5-8` already ranks on a soft SERP.
  Today's sweep found only bookmarklets (UK Department for Education, Adrian Roselli,
  last updated 2023) and a static width/height calculator. None computes the spacing
  exception (a 24 px circle centred on each undersized target must not intersect
  another target) or exports a list. That computation is the whole difficulty of
  testing 2.5.8 by hand.
- **Build on:** the Puppeteer runner behind `/tools/url-accessibility-auditor`.
  Report: each interactive element, bounding box, pass/fail/exception (inline, user
  agent control, essential, equivalent target), CSV export, screenshot overlay.
- **Verify at build:** the exception wording from the 2.5.8 Understanding document;
  Roselli's examples page as a test fixture.
- **Effort:** 2 days. **Metric:** runs, handoffs to the free scan.

---

## Tier B. Jurisdiction pages the site has no coverage of

The compliance hub has ADA, California, New York, Section 508, EAA, EAA Ireland,
EN 301 549 and UK. Nothing for India, Canada or Australia. These are credibility
pages for prospects who Google the site, and India is the home market.

### 6. `/compliance/india`

- **Why now:** India is moving from guidelines to mandatory ICT accessibility rules
  and no credentialed page explains it. The site processes Indian payments through
  Razorpay and the founder is CPACC-certified; this is the one jurisdiction page
  where the site has a native advantage.
- **Facts verified today (law-firm summaries of the Gazette text):**
  - Supreme Court, Rajive Raturi v. Union of India, judgment of 8 November 2024: the
    Court held the accessibility rules in Rule 15 of the RPwD Rules 2017 were
    recommendatory and therefore ultra vires the mandatory scheme of section 40 of the
    Rights of Persons with Disabilities Act 2016, and directed the Union to frame
    binding rules. NALSAR's Centre for Disability Studies produced the gap report.
  - Draft Rights of Persons with Disabilities (Amendment) Rules, 2026: notification
    S.O. 3962(E) of 16 July 2026, Gazette of India (Extraordinary) 20 July 2026,
    comments for 30 days (closed around 19 August 2026). It substitutes Rule 15(1)(c).
  - Standard: IS 17802 (Part 1): 2021 "Accessibility for the ICT Products and
    Services" and IS 17802 (Part 2): 2022 "Determination of conformance", Bureau of
    Indian Standards. BIS lists Part 1 as "Modified/Technically Equivalent" to
    EN 301 549, so the web baseline is WCAG 2.1 AA by inheritance. Developed under
    MeitY's KAI project led by C-DAC.
  - Scope: anyone who manufactures, designs, develops, controls or makes available
    ICT products or services for public or consumer use in India, including entities
    outside India offering into India. Covers websites, mobile apps, software,
    electronic documents, digital content, ICT-enabled public services, hardware.
  - Timelines in the draft: 1 year for establishments with turnover of ₹500 crore or
    more, 18 months for others, full compliance within 2 years of final notification.
  - Mandatory Accessibility Conformance Report: prepared or verified by qualified
    professionals, human- and machine-readable, publicly disclosed, updated after
    major changes or at least every two years.
  - Enforcement: Grievance Redressal Officers, nodal officers in ministries and
    sectoral regulators, a National Accessibility ICT Committee, fines and suspension
    or cancellation of licences for continued non-compliance.
  - Status: draft only. No final notification found as of 19 October 2026.
- **Also cover:** GIGW 3.0 (Guidelines for Indian Government Websites and Apps) for
  government properties, the RPwD Act's section 46 two-year compliance clause for
  service providers, and the IS 17802 relationship to EN 301 549 so the existing
  `/checklists/en-301-549` can be offered as an interim IS 17802 checklist.
- **Verify at build:** read S.O. 3962(E) from egazette.gov.in; the exact EN 301 549
  version IS 17802 Part 1 was adapted from (BIS catalogue, standard id MjY3NTI=);
  the three-month direction in the judgment; whether final rules have been notified
  (DEPwD site). Mark the page "draft rules" and plan the restamp.
- **Effort:** 1 day. **Metric:** Indian prospect conversations, IN impressions.

### 7. `/compliance/canada`

- **Facts verified today (Government of Canada summary page, dated 6 Jan 2026):**
  - Accessible Canada Act 2019; Accessible Canada Regulations amended for digital
    accessibility, Canada Gazette Part II, December 2025 (path indicates
    SOR/2025-255, 17 Dec 2025).
  - Standard: the most recent version of CAN/ASC-EN 301 549. Accessibility Standards
    Canada adopted CAN/ASC-EN 301 549:2024 in May 2024 as an identical adoption of
    EN 301 549:2021 (v3.2.1), so WCAG 2.1 AA today; the "most recent version" wording
    means WCAG 2.2 arrives when ASC adopts v4.1.1.
  - Deadlines: 5 Dec 2027 for federal public sector new and updated web pages,
    website accessibility statements and staff training (training also 5 Dec 2027 for
    large and medium businesses). 5 Dec 2028 for large businesses (500+) and medium
    (100 to 499) web pages, and for large businesses and the federal sector: new
    mobile apps, assessment of existing apps, new and updated digital documents,
    checking purchased web and app products, first business accessibility statement.
    Small businesses (99 or fewer) exempt. First Nations band councils not until
    December 2033.
  - Ongoing: statements updated annually, training refreshed every 3 years, records
    kept 4 years, alternative means of access where the standard cannot be met.
    Penalties for minor violations $250 to $75,000.
  - Exclusions: historical items, user-generated content, employee teamwork platforms.
- **Also cover:** Ontario's AODA (WCAG 2.0 AA since 2021), the Treasury Board
  Standard on Web Accessibility, and the broadcasting and telecom class, which the
  summary page does not address (CRTC has the role).
- **Verify at build:** SOR number and registration date in the Gazette; the exact
  medium-business definition; the AODA current status.
- **Effort:** 1 day.

### 8. `/compliance/australia`

- **Facts verified today:** Disability Discrimination Act 1992 (Cth); the Australian
  Human Rights Commission's Guidelines on Equal Access to Digital Goods and Services,
  issued under s.67(1)(k) of the DDA and s.11(1)(n) of the AHRC Act, expressly not
  legally binding, replacing the 2014 World Wide Web Access advisory note after an
  April 2024 exposure draft. Vendor summaries say they recommend WCAG 2.2 AA and were
  announced April 2025. The Attorney-General's Department ran a DDA review with a
  consultation that closed in November 2025 (ACCAN submission 13 Nov 2025 asked for
  explicit ICT provisions); outcome not published as of today.
- **Why it earns a place:** Australian visitors click at 3.61% on this site, seven
  times the US rate, and Maguire v. Sydney Organising Committee (2000) is the
  original web accessibility ruling, a natural fourth case study later.
- **Verify at build:** the WCAG 2.2 AA wording on the AHRC's own page (not confirmed
  from the AHRC HTML today), the guideline publication date, the DTA Digital
  Experience Policy date and scope, review status.
- **Effort:** 1 day.

---

## Tier C. Timely standards pieces (first-mover, dated)

### 9. EN 301 549 v4.1.1 clause-by-clause guide and v4 rebuild of the checklist

- **Slugs:** `/compliance/en-301-549-v4` (or a long section on
  `/compliance/en-301-549`) and a v4 dataset for `/checklists/en-301-549`.
- **Why now:** ETSI published v4.1.1 on 2 September 2026 (the three ESOs adopted it
  24 August 2026). Citation in the Official Journal is expected around 30 November
  (Deque) or 16 December 2026 (NDA Ireland). The site has a news post
  (`/blog/en-301-549-v4-1-1-wcag-2-2-eaa`) and a v4 section, but the checklist still
  carries v3.2.1 clauses and the evergreen clause-level explainer does not exist.
  Publishing before the OJ wave is the whole point.
- **Changes to document (Deque's summary, confirm against the ETSI PDF):** WCAG 2.2
  AA replaces 2.1 (six new criteria: 2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8);
  user-preferences requirements significantly reworked; clause 6 broadened from
  two-way voice to a "Total Conversation" model with substantially revised real-time
  text requirements (interoperability, concurrent voice, video and text; ties to the
  EAA 112 date of 28 June 2027); updated caller identification, alerting and call
  controls; new EAA mapping annex (Annex ZB) and conformance tables.
- **Legal trap to state on the page:** v3.2.1 is cited in the OJ only under the Web
  Accessibility Directive (Implementing Decision 2018/2048 as amended by 2021/1339).
  No edition is yet cited under the EAA, so there is no EAA presumption of conformity
  via any version until v4.1.1 is cited. Never write otherwise.
- **Pages to update on citation day:** `/compliance/en-301-549`,
  `/checklists/en-301-549`, `/compliance/eaa`, `/compliance/eaa-ireland`,
  `/guides/accessibility-overlays-eu-uk-law`, the `eu-eaa` row in
  `lib/data/accessibility-laws.ts`, the new `/compliance/canada` page (idea 7).
- **Verify at build:** download the ETSI v4.1.1 PDF and regenerate the checklist
  dataset from it the way the v3.2.1 dataset was built from
  `en_301549v030201p.pdf` (325 rows, reconciled against Annex C). Record the method in
  `scripts/` this time, not a scratchpad.
- **Effort:** 2 to 3 days. **Metric:** rank for "EN 301 549 v4", checklist downloads.

### 10. EU AI Act Article 16(l): the accessibility duty on high-risk AI

- **Slug:** `/guides/eu-ai-act-accessibility-requirements`
- **Why:** zero coverage on the site (grep "AI Act" = 0 files) and today's search
  found no accessibility-angle coverage anywhere; the AI Act commentary is all about
  risk tiers. Article 16(l) requires providers to "ensure that the high-risk AI system
  complies with accessibility requirements in accordance with Directives (EU) 2016/2102
  and (EU) 2019/882", that is, the Web Accessibility Directive and the EAA. After the
  Digital Omnibus (Regulation (EU) 2026/1744, OJ 24 July 2026, in force 27 July 2026)
  Article 16 applies from 2 December 2027 for Annex III systems and 2 August 2028 for
  Annex I systems.
- **Outline:** who is a "provider"; which Annex III systems touch the public
  (employment screening, credit scoring, education, essential services); what
  "in accordance with" the two directives means in practice (EN 301 549 v4.1.1 as the
  measuring stick once cited); the conformity-assessment paperwork where accessibility
  evidence lives (Article 17 quality management, Article 18 documentation, Article 47
  declaration); the chatbot overlap with Article 50 transparency and the existing
  `/guides/accessible-ai-chat`; a short "what to do in 2027" list. Key-facts block at
  the top with the two dates and the verbatim quote.
- **Verify at build:** quote Article 16(l) and Article 113(c) from EUR-Lex (consolidated
  text); confirm the Omnibus regulation number and OJ date on EUR-Lex.
- **Effort:** half a day. **Metric:** AI citations; cross-links from the EAA pages.

### 11. Disproportionate burden: a worked Annex VI assessment with a template

- **Slug:** `/guides/eaa-disproportionate-burden-assessment` with a DOCX and xlsx
  template download.
- **Why:** the site mentions the concept on two compliance pages and the statement
  guide, all definitional. The August research found only definitional coverage
  anywhere. Templates are the click format, and the clause is the one businesses reach
  for first and misuse most.
- **Outline:** Article 14 text; Annex VI criteria (ratio of net costs of compliance
  to overall costs, ratio to turnover, the benefit estimate for persons with
  disabilities); the documentation duty and the reassessment rule (at least every
  five years, on modification, or when an authority asks); why "undocumented reliance
  is non-compliance"; the microenterprise carve-out; the UK PSBAR and WAD equivalents
  for public bodies; a fully worked example with real-looking numbers for a mid-size
  retailer; the template with every field tied to a criterion.
- **Verify at build:** Article 14 paragraph numbers and Annex VI wording from
  EUR-Lex; the Irish SI 636/2023 and UK PSBAR regulation 7 wording.
- **Effort:** 1 day. **Metric:** template downloads, links from `/checklists/eaa`.

### 12. PDF/UA-2 vs PDF/UA-1 (and Well-Tagged PDF): what changed and what to buy

- **Slug:** `/guides/pdf-ua-2-vs-pdf-ua-1`
- **Why:** ISO 14289-2 (PDF/UA-2) exists and the market is confused; the site's own
  `/services/pdf-remediation` still says "PDF/UA (ISO 14289-1)". This guide ties the
  content side to the DocAccessible product work and the per-page remediation
  service, and it is the one PDF topic where competitors are thin.
- **Outline:** PDF 2.0 tagging (namespaces, new structure types, the rule that
  heading levels may be skipped under conditions, which UA-1 forbade); what the
  Well-Tagged PDF specification adds (PDF Association, pairs PDF/UA-2 with WCAG
  conformance); the Matterhorn Protocol status (UA-1 only until the PDF Association
  says otherwise); validator support (veraPDF, PAC); authoring-tool reality (what
  Acrobat, Word, InDesign and LibreOffice actually emit today); what to ask a
  remediation vendor; when UA-1 remains the right target (procurement that names it).
- **Verify at build:** veraPDF's PDF/UA-2 and WTPDF support from `docs.verapdf.org`
  (their software page does not say); WTPDF version and date from `pdfa.org/wtpdf`
  (returned 403 to automated fetch; use the browser pane); ISO 14289-2 publication
  year.
- **Effort:** 1 day. **Metric:** links from the PDF tool, guide and service pages;
  remediation enquiries.

---

## Tier D. Original research (link magnet, AI citations, prospect list)

### 13. State of UK and Irish Web Accessibility 2026

- **Slug:** `/research/state-of-uk-ireland-web-accessibility-2026`
- **Why:** the August flagship item, still unbuilt. Nobody publishes a scan of the
  FTSE 250 and the top Irish retailers. Two existing studies already used FTSE
  samples (`/research/ai-agent-readiness`, `/research/accessibility-statements-2026`),
  so the sampling and bot-blocking lessons exist. Output is a link magnet and, as a
  by-product, the next quarter's prospect list for the outbound pipeline.
- **Method (reuse):** Wikidata SPARQL for the sample (FTSE 100 query documented in
  memory; extend to FTSE 250 and an Irish retail list), `qualify.mjs` for axe counts,
  the overlay detector for widget prevalence (DOM-check, not network-only, per the
  AccessEase lesson), the statement checker API for statement presence and quality,
  the ARIA snapshot method for unnamed controls. Re-verify homepage counts on a second
  load before publishing (contrast and link-name drift between loads).
- **Report shape:** key-facts block, ten charts with text equivalents, methodology,
  limitations (28 of 127 FTSE sites bot-blocked last time), CSV and JSON via the
  dataset route, licence CC BY for our own data.
- **Effort:** 3 days including the scan run. **Metric:** backlinks, Reddit and
  LinkedIn distribution, prospects captured.

### 14. EAA enforcement tracker: verified actions only

- **Slug:** `/research/eaa-enforcement`
- **Why:** every vendor blog repeats enforcement claims nobody can source. The 14 Oct
  sweep's standing fact is "still no confirmed EAA fine anywhere". A tracker that
  publishes only what has a court record or regulator release, and lists the vendor
  claims separately as unverified, is the only honest page on the topic and the kind
  of dated original data AI engines cite.
- **Rows that are verifiable today:** Caen Judicial Court, 4 June 2026, Carrefour
  France ordered to make shop and app accessible within six months with a daily
  penalty (deadline about 4 December 2026); the Auchan ruling of 5 May 2026 went to the
  defendant on which French statute applied, not on the merits, and is under appeal;
  the Netherlands ACM programme. Claimed but unverified: a German BFSG penalty in
  Q1 2026 (sources even disagree whether the authority is BAFA or BAuA), Norwegian
  daily penalties on a health portal (Norway is EEA; check Tilsynet for universell
  utforming), Swedish and Dutch "programmes".
- **Second table:** the market-surveillance authority per member state, from each
  national transposition law. Deque's country table is the only aggregate and is
  inconsistent between its own page versions; use it as a lead list, not a source.
- **Verify at build:** court references for Caen and Auchan (French court press or
  the associations apiDV and Droit Pluriel); ACM's own publication; each authority
  from the national act.
- **Effort:** 2 days first build, then part of the monthly research sweep.
  **Metric:** citations for "EAA fines", links from the EAA pages.

---

## Tier E. Site features and templates

### 15. Research changelog and "what changed this month" feed

- **Slug:** `/research/changelog` plus an RSS/Atom entry.
- **Why:** the 14 research pages are refreshed monthly but the refreshes are only
  visible as badge dates. A dated changelog is cheap, is the freshness signal the
  AI-presence plan asked for (item 22), gives every Reddit and LinkedIn post a URL to
  point at (item 7, never started), and finally gives `recentUpdate` in
  `lib/data/accessibility-laws.ts` somewhere to render (today it reaches users only
  through the API).
- **Build:** a single `lib/data/research-changelog.json` appended on each sweep,
  rendered newest-first with page, what changed, source, date; the deadlines calendar
  (idea 4) and the EAA tracker (idea 14) write to it too.
- **Effort:** half a day.

### 16. Accessibility procurement clause library with DOCX download

- **Slug:** `/guides/accessibility-procurement-clauses` (the existing `/procurement`
  page is the site's own vendor dossier, a different thing).
- **Why:** templates are the click format, the buyer is a budget holder, and today's
  sweep found only US public-sector clause sets, all pegged to WCAG 2.1 AA and none
  aware of the EAA, the UK or Canada: Idaho ITS "Digital Accessibility Agreement
  Language" (v1, March 2026: remedies include withholding payment, termination without
  penalty, remediation at vendor cost, non-renewal), Massachusetts (defines ACR,
  Accessibility Violation and Written Validation), Minnesota State's services
  template, Benetech's two templates (one with a passed April 2026 date), Siteimprove's
  guidance (replace "comply with applicable laws" with specific terms).
- **Outline:** a clause set with a jurisdiction switch: US (Section 508 and Title II,
  WCAG 2.0 AA floor for 508, 2.1 AA for Title II), EU (Directive 2014/24/EU Article
  42(1), which requires technical specifications to take account of accessibility for
  persons with disabilities or design for all, and to reference mandatory Union
  accessibility requirements where they exist; EN 301 549 as the specification; EAA
  for consumer-facing services), UK (PSBAR for public bodies, Equality Act
  reasonable adjustments, the Procurement Act 2023), Canada (ACR duty to check
  purchased web and app products by 5 Dec 2028). Clauses: conformance warranty naming
  the standard and version, ACR delivery and refresh on major releases, acceptance
  testing, buyer's right to test, remediation window at vendor cost, flow-down to
  subcontractors, remedies. Each clause with a plain-English "why" and a counsel
  review note.
- **Verify at build:** Article 42(1) wording from EUR-Lex in the browser pane; the
  Procurement Act 2023 accessibility provisions; the Idaho and Massachusetts PDFs.
- **Effort:** 1 day.

### 17. Apple Accessibility Nutrition Labels readiness checklist (hold until Apple sets the date)

- **Slug:** `/checklists/apple-accessibility-nutrition-labels`
- **Why and why not yet:** Apple's App Store Connect Help says providing the labels
  is voluntary to start with a mandatory requirement planned later. When Apple
  announces the date every iOS team will search for the criteria. The site has no
  mention of the labels. Build the checklist against Apple's published per-label
  evaluation criteria and tie it to `/tools/mobile-accessibility-checker`, but hold
  publication until the mandatory date is announced, or publish a short version now
  and expand then.
- **Verify at build:** the full label list and each label's criteria from the Apple
  overview page ("Types of Accessibility Features"); today's search confirmed
  VoiceOver, Voice Control, Larger Text, Sufficient Contrast, Reduced Motion and
  captions but not the complete list.
- **Effort:** half a day.

---

## Considered and parked, with the reason

- **Caption file (SRT/VTT) checker.** Validated in August, downgraded today: free
  browser-based checkers now exist (ScreenApp, Vexascribe, SozAI) covering reading
  speed, line length, overlaps and duration. Only worth building as a conformance
  report (DCMP Captioning Key maximum rates: 130 wpm lower-level, 140 middle, 160
  upper educational media; FCC 2014 caption-quality order; BBC Subtitle Guidelines;
  WCAG 1.2.2 and 1.2.4), and even then it is a nice-to-have.
- **Label in Name (2.5.3) checker.** Fold into `/tools/accessible-name-previewer` as
  a mode (compare visible text with the computed name) rather than a new tool.
- **Link text audit tool.** Fold into the free scan's findings; a standalone tool
  duplicates WAVE's redundant-link flag.
- **Per-disability guides, CI/CD axe and Playwright guide, zero-JS popover and
  invoker stack guide, WordPress accessibility.** All still valid topics, all against
  the September verdict (no new generic guides; informational CTR 0.5%). Revisit only
  if the verdict changes. Note for the popover stack: customizable select is Chrome
  and Edge 134+, WebKit says Safari 27; invoker commands are Chrome 135, Firefox 144,
  Safari 26.2.
- **New WCAG 3 page.** No. Refresh the five `/wcag-3` pages when the next Working
  Draft lands (about every six months; last 10 Sep 2026).
- **Section 508 refresh explainer.** The Access Board issued a Request for
  Information in 2025 and the standard is still WCAG 2.0 AA; no proposed rule found.
  Blog post when an NPRM appears.
- **ARIA 1.3.** Still a Working Draft (First Public Working Draft 23 Jan 2024); no
  Candidate Recommendation found. Nothing to write yet.
- **Colorado HB21-1110.** Grace period ended 1 July 2025; already in the laws data.
- **Web Accessibility Directive review.** The Funka, PwC, OpenEvidence and Intellera
  study and consultation exist but no 2026 Commission report was found.

## Watch list (write the post when the event lands)

- NFB v. DOJ ruling on the Title II and 504 extensions (D. Md., MSJ filed 28 Sep 2026).
- EN 301 549 v4.1.1 Official Journal citation (expected 30 Nov to 16 Dec 2026):
  triggers idea 9's citation-day updates.
- Carrefour's Caen deadline (about 4 Dec 2026) and the Auchan appeal.
- Hawaii HCRC final rule after the 30 Oct 2026 comment close.
- India: final notification of the RPwD (Amendment) Rules 2026.
- Apple: the mandatory date for Accessibility Nutrition Labels.
- Accessibility Standards Canada adopting EN 301 549 v4.1.1 (moves Canada to WCAG 2.2).
- W3C Accessibility Maturity Model 1.1 First Public Working Draft.
- WebAIM Million 2027 (late March), Seyfarth 2026 annual count (early 2027).

## Sources consulted on 19 October 2026

Primary or official: W3C Accessibility Maturity Model Note (4 Nov 2025) and its
publication history; W3C WAI-ARIA 1.3 publication history; Government of Canada
"Summary of the changes to the Accessible Canada Regulations about Digital
Accessibility" (6 Jan 2026); Justice Laws consolidation of SOR/2021-241; Australian
Human Rights Commission guidelines page; Apple App Store Connect Help (Overview of
Accessibility Nutrition Labels); DCMP Captioning Key presentation-rate page; BIS
catalogue entry for IS 17802; artificialintelligenceact.eu Article 16 text; NDA
Ireland on EN 301 549 publication; US Access Board and section508.gov pages.

Secondary, used for leads and cross-checked where possible: Deque (EN 301 549
v4.1.1, Canada, Australia), Digital Workplace Tech (EN 301 549), Lexplosion,
IndiaLaw and Mondaq (RPwD draft rules), Idaho ITS, Mass.gov, Minnesota State,
Benetech and Siteimprove (procurement clauses), Intopia, Level Access and Hassell
(maturity tools), ScreenApp, Vexascribe and SozAI (caption checkers), UK Department
for Education and Adrian Roselli (target-size bookmarklets), Testfort, Futurice,
Cliplister, 3Play Media and Strix (EAA checklists), Seyfarth, UsableNet and EcomBack
(lawsuit counts), Cloud Security Alliance and CASRAI (Digital Omnibus dates),
Fieldfisher and Deque (EAA authorities), Route Fifty, ADA Title III blog and the
Clearinghouse (NFB v. DOJ), Quadient and the PDF Association (PDF/UA-2).

Site memory relied on: content-opportunities-2026-08, ai-presence-content-plan,
seo-market-size-verdict, content-build-2026-09-03, research-pages-refresh
(14 Oct 2026 sweep), wcag-3-draft-tracking, commercial-pages-structure.
