# AI presence content plan (September 2026)

What to add to accessibility.build so that AI answer engines (ChatGPT, Perplexity,
Google AI Overviews and AI Mode, Claude, Gemini) and AI agents retrieve, cite and
use it. Built from the 2026 evidence base below and checked against what the site
already has (163 routes: 60 guides, 21 tools, 10 research datasets, 6 checklists,
3 case studies, a 51-term glossary, an FAQ and a methodology page).

The governing finding from the 1 September citability audit still holds: the
plumbing (robots, schema, canonicals, llms.txt) is done and the site is absent
from AI answers because it is absent from the retrieval pool and has no
third-party corroboration. This plan is therefore about content that earns
retrieval and citations, not about more on-page optimisation.

## What the 2026 evidence says

1. **Citation rate by content type.** Across 25,337 citations from five engines
   (DeltaV Digital, July 2026), comparison pages had the highest citation rate
   per retrieval (1.87, 45% above average) but only 4.1% of citations because
   few exist. Listicles took 19.6% of citations and 61% in B2B technology
   services. How-to guides took 4.5%. In B2B technology services the brand's own
   domain earned 0% of citations; LinkedIn was the most-cited domain.
2. **Which page properties move citation likelihood.** The 2026 critical survey
   of GEO (arXiv 2607.14035) finds experimental support for quotations (about
   +41% position-adjusted share), statistics (about +31%), references, explicit
   prices and recent dates; relevance and position in the retrieved context are
   the primary determinants; formatting changes alone have weak effects; keyword
   stuffing is harmful; and GEO rewrites of body copy reduced organic top-10
   presence by 16% in one arena, so rewriting existing pages for AI is a risk.
3. **Retrieval works passage by passage.** Engines fan a question out into 8 to
   20 sub-queries and retrieve a passage for each. A page is cited when one of
   its passages answers one sub-query on its own. 53% of domains cited by Google
   AI Overviews are not in the organic top 10; ChatGPT citations match Bing's
   top 10 87% of the time and Google's only 56%.
4. **Earned beats owned.** Reddit is the most-cited domain across engines
   (about 40% share in aggregate studies), YouTube leads Perplexity, Wikipedia
   holds up to 48% of ChatGPT's top-10 source share, and only 12% of AI-cited
   URLs overlap Google's top 10. Brand search volume is the strongest known
   predictor of citation (r = 0.334, stronger than backlinks). Wikidata and
   Wikipedia presence is associated with 2.8x citation likelihood. Only 11% of
   domains are cited by both ChatGPT and Perplexity.
5. **Freshness.** Perplexity cites content updated within 30 days at 82% versus
   37% for older content (vendor data, treat as indicative); recent dates had a
   measurable effect in the 252,000-trial factorial study.
6. **Original data forces citation.** Cited pages carry five or more original
   insights; absorbed pages carry zero or one. A number nobody else has cannot
   be synthesised away.
7. **Agents.** Agentic traffic passed 50% of all internet traffic in June 2026
   (Cloudflare). Anthropic's browser-use tool went GA on 19 August 2026 and reads
   pages through the accessibility tree; OpenAI's CUA and Google's Mariner use
   tree-plus-screenshot grounding. Agents prefer structured text over rendered
   JavaScript. MCP registries (official registry 8,400+ servers; mcp.so 20,000+)
   are where agents discover tools.
8. **llms.txt does nothing.** Ahrefs' May 2026 log study of 137,000 domains:
   97% of llms.txt files were never requested; Google does not read it. The
   site's file can stay; no further work.

## The list

Priority is evidence strength multiplied by fit with what the site can produce
that competitors cannot. "Exists" notes what is already on the site.

### Tier 1: original numbers and the agent angle

1. **Web accessibility statistics hub** (`/research/web-accessibility-statistics`).
   One page, 40 to 60 numbers, each a self-contained dated passage with its source
   and a one-line interpretation, grouped by theme (prevalence, lawsuits, cost,
   standards adoption, assistive technology use). Updated monthly with a visible
   changelog. Exists: ten dataset pages, no hub; the numbers are scattered.
   Evidence: statistics, dates, references, passage-level retrieval.
2. **The lawsuit tracker as a dataset.** Add a downloadable CSV and JSON
   endpoint, a Dataset schema, a stated methodology, and a single dated headline
   number ("federal website filings, month to date") refreshed monthly. Exists:
   `/research/accessibility-lawsuits` and `lib/data/lawsuit-statistics.ts`,
   already the most-corrected data on the site. Evidence: original data,
   freshness, machine-readable for agents.
3. **State of accessibility statements 2026.** Run the statement checker over a
   defined sample (UK public sector, EAA-scope retailers, FTSE 250) and publish
   the results with methodology. Exists: the tool, and the GDS 7% figure it was
   built around; no study. Evidence: original data; nobody else measures the
   statement itself.
4. **"Accessibility is agent-readiness."** Measure, with Playwright accessibility
   snapshots or Claude browser use, how unnamed buttons, missing labels and
   unlabelled image maps break AI agents on N real sites, and publish the
   numbers. Pair it with the accessible-name previewer tool already validated in
   the August research ("what will a screen reader, or an agent, announce for
   this markup"). Evidence: agents read the accessibility tree; this is the one
   topic where an accessibility firm holds the expertise the AI press lacks.
5. **Tool comparison pages with test results.** "axe vs WAVE vs Lighthouse vs
   Pa11y vs IBM Equal Access" run against the same fixture, with detection
   counts, false positives, dates and prices in a table; "JAWS vs NVDA vs
   VoiceOver" on the same pages; "overlay vs remediation vs managed service"
   on cost, time and legal exposure. Exists: `axe-vs-wave`,
   `automated-vs-manual`, `wcag-2-1-vs-2-2`. Evidence: comparison pages have
   the highest citation rate of any type and are scarce.
6. **Key-facts block on the top 30 pages.** Three to six dated, sourced numbers
   at the top of each page, above the narrative. Evidence: position in context
   is the primary determinant of citation; extractors take the first passages.
7. **Distribute the original findings where engines look.** Each of items 1 to
   5 gets a post in r/accessibility or r/webdev, a Show HN for tools, and a
   LinkedIn article with the chart. Exists: the Target before-and-after
   (192 of 361 images without alt six days before the complaint) and the 114
   comments, one blind commenter, finding are ready now. Evidence: Reddit about
   40% of citations, LinkedIn top for B2B, 48% of citations from community
   platforms, own domain 0% in B2B.
8. **Bing.** Check indexation of the top 50 pages in Bing Webmaster Tools and
   keep IndexNow firing. Evidence: 87% of ChatGPT citations match Bing's top 10.

### Tier 2: comparison, reference and decision pages

9. **Standards comparison tables.** "WCAG 2.2 vs EN 301 549 vs Section 508",
   "ADA vs EAA vs UK Equality Act: who is covered, what they must do, penalties,
   deadlines", "WCAG 2.2 AA vs WCAG 3.0 Bronze". Each row a citable unit.
10. **Circuit map reference page** (`/reference/ada-website-circuit-map`). The
    CircuitPositions graphic from the case studies as a standalone, dated
    reference with one row per circuit, the controlling case, and its status
    (including vacated). Updated as rulings arrive. Evidence: definitions and
    references as selectable units; the case studies already carry the data.
11. **Accessibility audit price benchmark.** Explicit prices with dates from
    public quotes and the site's own pricing, by scope and jurisdiction.
    Exists: `/guides/accessibility-audit-cost`, cited by nobody; the audit found
    competitors cited for the same query. Evidence: explicit prices had a
    measurable effect in the factorial study.
12. **Listicles with information gain.** "Best free accessibility testing tools
    2026" (tested, with results), "The 12 most common WCAG failures and the fix
    for each" (from WebAIM Million plus the site's own scans), "Every web
    accessibility case decided on appeal" (from the case studies). Evidence:
    listicles take the largest share in B2B technology; the condition is that
    each entry adds a number or test result, not a summary.
13. **Fan-out coverage on the 87 WCAG pages.** For each head query enumerate the
    8 to 20 sub-queries an engine generates (exact pixel values, exceptions,
    platform equivalents, how to test, what fails) and give each its own
    question-headed passage with a number or example. Exists: FAQ sections;
    they answer the head question, not the fan-out.
14. **Glossary from 51 to about 250 terms.** Each entry 40 to 80 words,
    self-contained, with the criterion link and a dated example, and
    DefinedTerm schema. Evidence: definitions are among the units generators
    select and attribute.
15. **Machine-readable endpoints for every dataset.** JSON and CSV under
    `/api/research/`, Dataset schema on all ten research pages (five have it),
    stable URLs, last-updated dates in the body text as well as the schema.
16. **MCP server for the free tools**, listed on the official MCP registry and
    mcp.so, with a `/docs` page per tool showing use from Claude and ChatGPT.
    Exists: thewcag.com already runs an MCP server. Evidence: registries are
    the discovery layer for agents; a listing is a citation surface.

### Tier 3: entity, earned media and operations

17. **Wikipedia and Wikidata.** Gil v. Winn-Dixie has no article; the case study
    has the primary sources to support one that cites only court documents and
    press. Correct the $38,000 folklore on the Domino's article with the
    primary-source trace. Create Wikidata items for the company and the tools.
    Do not cite accessibility.build; the value is entity presence (2.8x).
18. **Earned mentions in the domains engines cite for this vertical.** The
    audit found Accessible.org, DigitalA11Y, AudioEye, BOIA, TestParty,
    AAArdvark, Level Access and Deque cited for the site's own target queries.
    Offer the original studies (items 1 to 4) as data contributions and
    quotes; distribute studies through PR Newswire, which gained citation share
    after September 2025.
19. **Quotations in guides.** Verbatim, attributed quotes from regulators, courts
    and standards bodies inside the guides, as the case studies already do.
    Evidence: quotations carry the largest measured effect.
20. **YouTube.** Two-minute screen-reader demonstrations per tool and per case
    study finding. Evidence: YouTube is the top-cited domain on Perplexity.
21. **Entity and author.** The founder's Person entity with sameAs, Wikidata and
    CPACC credential on guides; the team Organization on the case studies is
    already in place.
22. **Freshness routine.** A monthly pass over the stats hub, the lawsuit
    tracker and the top 20 pages, each with a dated "Updated" line in the body.
23. **Measurement.** Re-run the three audit queries monthly in ChatGPT,
    Perplexity and AI Overviews and record whether the site appears; add
    "share of model" for ten target prompts once items 1 to 5 ship.

## What not to do

- No more generic guides. The August research and the citability audit both
  found volume is not the constraint; guide 61 earns no citation.
- No rewriting of existing pages "for AI". Formatting-only changes have weak
  evidence and body rewrites cost organic visibility in the one controlled
  arena that measured it.
- No further llms.txt work, no keyword additions, no schema beyond Dataset and
  DefinedTerm where missing.
- No listicle or comparison without a number, a test result or a price in
  every row; a roundup of other people's summaries is absorbed, not cited.

## Sources

- DeltaV Digital, AI search citations study, 25,337 citations, 13 July 2026.
- arXiv 2607.14035, Optimizing Visibility in Generative Engines: A Critical
  Survey of GEO (2023 to 2026).
- 5WPR, The state of AI citations 2026 (synthesis of Profound, Goodie, Surfer,
  Semrush, Peec AI).
- Ahrefs, AI search trends 2026, and the May 2026 llms.txt log study of 137,000
  domains.
- ZeroClick Labs, content types in AI search 2026 (listicle share by engine).
- Cloudflare on agentic traffic, June 2026; Anthropic browser-use GA, 19 August
  2026; official MCP registry figures, May 2026.
- Site memory: ai-citability-audit (1 September 2026), content-opportunities
  (27 August 2026), gsc findings (13 August 2026).

## Status, 3 September 2026

Shipped: 1 (statistics hub), 2 (lawsuit tracker and every other dataset as CSV/JSON
under /api/research with Dataset schema), 3 (statements study), 4 (agent-readiness
study and the accessible-name previewer), 5 (tools benchmark with a published
fixture; the JAWS/NVDA/VoiceOver and overlay-vs-remediation comparisons were not
built: the first lacks a test we can run honestly, the second is legally sensitive),
6 (key-facts blocks on the six new or compliance pages, not thirty), 10 (case-law
reference), 11 (dated price table on the audit-cost guide), 14 (glossary to 101
terms, not 250), 15 (endpoints), plus a regime comparison table on the compliance
hub. Skipped as duplicates: the "most common failures" listicle (exists in the audit
guide) and the "best tools" listicle (exists as a blog post). Not started: 7, 8, 9,
12, 13, 16 to 23, all of which are off-site, need the user's accounts, or are
editorial passes over existing pages.
