# Title II readiness study: pipeline

Automated accessibility indicators on the official websites of every US state, county and
city/town government with a 2020 decennial Census population of 50,000 or more (the group whose
ADA Title II web deadline is 26 April 2027 under 28 CFR 35.200(b)(1) as amended by 91 FR 20902).

This folder holds the committed code. **All per-entity data lives in `research-data/title-ii/`,
which is gitignored.** Owner decision: only aggregates are published; per-entity rows are shared
on request only. Never copy per-entity rows into `lib/data/` (it is publicly served). This
pipeline is separate from client prospecting: it never reads or writes the prospects database or
any file under `scripts/prospecting/` or `data/`.

## Steps

| Step | Command | Output (in `research-data/title-ii/`) |
|---|---|---|
| 1. Sources | `node scripts/research/title-ii/fetch-sources.mjs` | `source/pl/*geo2020.subset.pl`, `source/dotgov-current-full.csv` |
| 1b. (optional) | `node scripts/research/title-ii/fetch-sources.mjs --only=popest` | `source/sub-est2025.csv` (reconciliation only) |
| 2. Frame | `node scripts/research/title-ii/frame.mjs` | `frame.csv`, `excluded.csv` |
| 2b. Reconcile | `node scripts/research/title-ii/reconcile.mjs` | `reconcile.csv` |
| 3. URLs | `node scripts/research/title-ii/resolve-urls.mjs` | `urls.csv`, `manual-review.csv`, `url-checks.jsonl`, `url-checks-chrome.jsonl`, `source/wikidata-p856.json` |
| 4. Pilot draw | `node scripts/research/title-ii/pilot-sample.mjs` | `pilot-ids.txt` |
| 5. Scan | `node scripts/research/title-ii/scan.mjs --ids=pilot-ids.txt --out=raw/pilot.jsonl` | `raw/pilot.jsonl` |
| 5 (full) | `node scripts/research/title-ii/scan.mjs` | `raw/scan.jsonl` |
| 6. Run report | `node scripts/research/title-ii/summarise.mjs --in=raw/pilot.jsonl` | console |

Requirements: Node 22, the repo's `node_modules` (puppeteer, axe-core), Google Chrome at
`/Applications/Google Chrome.app` (or `CHROME_PATH`), `unzip`.

### Resuming

- `fetch-sources.mjs` skips state files already reduced to `*.subset.pl`.
- `resolve-urls.mjs` caches every URL check in `url-checks.jsonl` / `url-checks-chrome.jsonl` and
  Wikidata in `source/wikidata-p856.json`. Re-running only fetches URLs not yet checked.
  `--revalidate` re-fetches everything; `--refresh-wikidata` re-queries Wikidata; `--no-chrome`
  skips the Chrome second look.
- `scan.mjs` appends one JSON line per entity and skips entity_ids already in the output file, so
  an interrupted run is resumed by running the same command again. `--retry-failed` re-scans
  entities whose home page was not measurable and appends a new line (keep the latest line per
  entity; earlier lines are the attempt history). Options: `--concurrency=4`, `--limit=N`,
  `--ids=<file>`, `--out=<path under research-data/title-ii>`, `--urls=<csv>`.

## 1. Sampling frame rules (`frame.mjs`)

**Population.** POP100 from the geographic header of the 2020 Census P.L. 94-171 redistricting
files (one per state plus DC, www2.census.gov). That is the 2020 decennial count, which is what
28 CFR 35.104 ("Total population") uses. The Census API now refuses keyless calls, so the files
are used instead; POP100 equals P1_001N. The Vintage estimates (including ESTIMATESBASE2020)
are **not** used: they include post-census boundary changes and corrections, so they are not the
figure "calculated in the most recent decennial Census".

**Threshold.** POP100 >= 50,000.

**Included (main census):**

| Census record | Rule | Type in frame |
|---|---|---|
| State (SUMLEV 040) | all 50 states and DC; Puerto Rico and other territories out of scope | `state` |
| County (050) | FUNCSTAT A | `county` |
| County (050), Louisiana, FUNCSTAT B | East Baton Rouge and Lafayette parishes: the parish and its city are both FUNCSTAT B (partially consolidated) and run by one consolidated government. Counted once, as the parish | `consolidated` |
| Incorporated place (160) | FUNCSTAT A | `city`, `town`, `village` (from the LSAD code), or `consolidated` when the place is the city of a consolidated city-county (table below) |
| Consolidated city (170) | FUNCSTAT A: Indianapolis, Louisville/Jefferson County, Nashville-Davidson, Athens-Clarke, Augusta-Richmond, Milford CT. The government's population is the consolidated-city total, not the "(balance)" place | `consolidated`, or `city` for Milford (a city-town consolidation) |
| County subdivision (060) | FUNCSTAT A, outside IL, IN, OH: the general-purpose towns and townships of NY, NJ, PA, MI, CT, MA | `town` or `township` |

**Flagged group (appendix, `group=limited_township`, `limited_function_township=1`):** county
subdivisions with FUNCSTAT A in Illinois, Indiana and Ohio (88). Owner decision: kept separate
from the main census.

**Consolidated city-counties, counted once through the city.** The PL place rows carry no county
code, so the pairs are an explicit table in `frame.mjs`, and the script stops if any 50k+
FUNCSTAT C county is not in the table or a named city is missing: Anchorage, San Francisco,
Broomfield, Denver, Jacksonville (Duval), Macon-Bibb, Athens-Clarke, Columbus GA (Muscogee),
Augusta-Richmond, Indianapolis (Marion), Kansas City KS (Wyandotte), Lexington-Fayette,
Louisville/Jefferson, New Orleans (Orleans Parish), New York city (five counties), Philadelphia,
Nashville-Davidson.

**Excluded (every 50k+ record is listed in `excluded.csv` with its reason):**

- Counties FUNCSTAT C (consolidated, counted through the city), F (independent cities shown as
  county-equivalents, e.g. Baltimore, St. Louis, Carson City, the Virginia cities: counted as
  places), N (no county government: Connecticut, most of Massachusetts, Rhode Island), and the DC
  county-equivalent.
- Places FUNCSTAT S (census designated places, no government, e.g. Urban Honolulu: Honolulu is
  counted as its county), F ("balance" rows of consolidated cities), N (Washington city DC;
  Louisville city, a former city inside the metro government), and the two Louisiana FUNCSTAT B
  cities (counted through the parish).
- SUMLEV 172 rows (a place tabulated again inside a consolidated city).
- County subdivisions FUNCSTAT F (coextensive with an incorporated place, counted as the place),
  C (consolidated with a city: the Connecticut city-towns and Cicero township IL), G
  (subordinate: the five NYC boroughs, five Iowa townships), N, S, and four Illinois townships
  with FUNCSTAT B (Berwyn, Oak Park, Champaign City, Bloomington City: limited-function and
  coterminous with a city; not in the 88, open owner decision).
- Special districts, school districts, tribal governments and territories (out of scope).

**Entity id.** `<prefix>-<GEOID>`: `st-` state, `co-` county, `pl-` place, `cc-` consolidated
city, `cs-` county subdivision. `ansi_ns` is the Census ANSI/GNIS feature id (used for Wikidata).

**Known limits.** Places incorporated after the 2020 Census have no decennial population as a
place (Mableton GA, 2023; St. George LA). They are not in the frame; see the pilot report.

### Reconciliation with the design estimate (`reconcile.mjs`)

The design counted 1,838 main entities from Vintage 2025 ESTIMATESBASE2020 with places taken from
SUMLEV 162 FUNCSTAT A/B. `frame.csv` has 1,841. The difference, entity by entity, is in
`reconcile.csv`: +6 consolidated cities the 162 rule misses (their 162 rows are "(balance)"),
-3 places that are 50k+ only on the estimates base (Winter Haven FL is 49,219 in the 2020 count;
Mableton GA and St. George LA did not exist as places in 2020), and the two Louisiana
consolidated governments counted as parishes instead of cities (no net change). Seven Connecticut
towns differ only in their county code (the Vintage 2025 file uses the new planning regions) and
Methuen MA only in its name.

## 2. Website discovery rules (`resolve-urls.mjs`)

For each entity, candidate URLs come from:

1. **dotgov** (CISA `cisagov/dotgov-data` `current-full.csv`). Same state; domain type `State or
   territory` for states, `County` for counties, `City` for places and towns, either for
   consolidated governments. The organisation name must contain the entity's core name (e.g.
   "Birmingham" for "Birmingham city"). Score: +50 when the organisation core (government-type
   words and governing-body phrases such as "Board of Supervisors" or "Fiscal Court" removed)
   equals the name; +15 when it only contains it; -45 when what is left looks like a department
   (police, library, water, courts, elections...); -10 for a sub-organisation; +30 when the
   domain label follows a usual pattern (`cityof<name>`, `<name><st>`, `<name>county`, ...),
   +12 when it merely contains the name; -25 for a department word in the domain; a county
   cannot land on a `cityof` domain and a city cannot land on a county domain. Best and, when
   close, runner-up are kept.
2. **Wikidata** P856 (official website), joined on P590 (GNIS id) = the Census ANSI code in the PL
   file, plus P882 (FIPS 6-4) for counties. Preferred rank first; deprecated values ignored.
3. **Host patterns** (`source=pattern`), only for entities where no dotgov or Wikidata page loads
   with the entity's name: the usual government host shapes (`co.<name>.<st>.us`,
   `<name>county<st>.gov`, `cityof<name>.org`, `ci.<name>.<st>.us`, ...). A host is accepted only
   if it resolves in DNS, loads without leaving its own domain, its title carries the entity's name,
   the page has official wording (city of, board of commissioners, mayor...), names the government
   type and the state, and the title is not a parked, "coming soon" or events page. (A first
   version without the title, same-domain and official-wording tests accepted squatted and
   aggregator sites; those rules were added after a spot check.)
4. **Manual** overrides in `research-data/title-ii/manual-urls.csv` (`entity_id,url,source,note`)
   for what the first three cannot settle. Each is validated like any other candidate. Official
   sources only (the government's own site, a state municipal league or association directory,
   the state's county directory). The first 52 rows were entered from analyst knowledge for the
   main-census entities left unresolved, and are kept only if the page loads (or is unreachable
   in the way described below).

**www fallback.** Many .gov registrations serve the site only on `www.` (no apex record, or no
HTTPS on the apex). When `https://<domain>` does not load, `https://www.<domain>` is tried.

**Validation.** Every candidate is fetched (GET, redirects followed, plain desktop Chrome UA, 20 s
timeout); status, final URL and title are recorded and the page text is checked for the entity's
name. Candidates that a plain fetch cannot read (connection errors, 403/429 from bot protection,
5xx) get a second look in headless Chrome with the same UA. No evasion: a bot wall is recorded as
`blocked-on-fetch`, not worked around.

**Unreachable hosts.** From the network the pilot ran on (India), a share of US government
hosts resolve in DNS but drop the TCP connection (curl and Chrome time out on port 443): this is
the signature of geo-IP blocking. A strong dotgov match (organisation is the government, domain
contains the name) or a manual entry that fails this way is kept with `confidence=unverified`
and flag `unreachable-from-scan-host:<error>`, so it can be checked from a US network.
`--recheck-failed` re-fetches every candidate whose fetch and Chrome check both failed with no
HTTP status (network failures are cached like any result, so a flaky moment would otherwise
stick).

**Choice.** A usable manual entry; otherwise the usable candidate with the highest
score, ties going to dotgov, then Wikidata, then pattern. "Usable" means the page loads, or
answers 403/429 or a bot-wall page (blocked, so the name cannot be checked).

**Confidence.** Base: dotgov 3 (organisation is the government and the domain follows a usual
pattern), 2 (organisation is the government and the domain contains the name), 1 (weaker), 0 (a
department's domain); Wikidata 2; pattern 2; manual 3. +1 when the name is on the page; +1 when
dotgov and Wikidata agree after redirects. 4+ = high, 3 = medium, below 3 = low, `unverified` as
above, `none` when nothing usable exists. Rows with low or
no confidence, a dotgov/Wikidata conflict, the name not on the page, or a redirect to another
registrable domain go to `manual-review.csv`. Two entities resolving to the same host get a
`shared-host:` flag (consolidated governments sharing one site).

## 3. Scanner (`scan.mjs`)

Forked from the `scripts/prospecting/qualify.mjs` pattern (bounded workers, a browser per worker
recycled every 12 entities, resumable output, system Chrome, `domcontentloaded` + settle,
injected axe-core). **Not** based on `verify.mjs`, which has no bot-wall check.

Per entity, at most 5 page loads, one at a time, 1.2 s apart:

1. **Home page** (the validated final URL). 40 s navigation timeout, network idle (max 6 s) then
   2.5 s settle, one retry 5 s later on a fast 404/429/5xx.
2. **Accessibility statement**: up to 2 candidates from home-page links whose text or href looks
   like accessibility (`accessib`, `ADA`, `Section 508`), ranked by URL as in the repo's statement
   checker; if the home page links none, the fixed paths `/accessibility` and `/ada`. Text only.
3. **Key pages**: the first home-page link whose text names a resident service (pay, permit,
   licence, apply, register, report a problem, 311), and the contact page. 25 s timeout.
   Off-domain (vendor-hosted) pages are scanned as found and flagged `offDomain`.

**Render validity (every page gets exactly one outcome):** `ok`, `botwall` (title regex from
`lib/render/browser.ts` detectBotWall() and `scripts/prospecting/analyse.mjs`, verification text
with under 5 links, or a known challenge host such as Radware's perfdrive), `http-error`
(4xx/5xx), `timeout`, `nav-error`, `chrome-error` (Chrome's own error page), `render-invalid`
(fewer than 10 links or under 500 characters of text, or an empty page), `robots-disallowed`.
detectBotWall() counts an empty page as a wall; here it is `render-invalid` with reason
`empty page`, because it can also be a JavaScript app (both are not measurable). The design also
gated on h1/main/nav; the pilot found a real, older page with none of them, so their absence is
recorded as `noLandmarks` and does not gate (owner decision listed in the pilot report). Only `ok` pages are measured. An
entity is **measurable** only if its home page is `ok`; otherwise it is "not measurable", never a
zero.

**Indicators recorded:**

- axe-core (repo version, recorded per page as `axe.version`) with `runOnly` tags `wcag2a,
  wcag2aa, wcag21a, wcag21aa` only (WCAG 2.1 is the legal standard; no 2.2, no best practice).
  Per rule: id, impact, node count, SC tags, up to 3 selectors. `incomplete` (needs review) kept
  separately and never counted as a failure. Iframes are not tested.
- Statement status: `found` (best candidate scores 8 or more), `not-measurable` (no candidate
  scored and at least one candidate was a bot wall, timeout or error page), or `not-found`
  (candidates were read, or 404, and none scored). Cloudflare often lets the home page through
  and blocks the next page, so `not-measurable` must never be reported as "no statement".
- Statement: best candidate's score (US variant of the statement-checker score: statement
  wording, WCAG, ADA/Section 508/Title II, level AA, feedback/contact, date, length, URL path);
  `found` when the score is 8 or more (medium or high confidence). WCAG versions named (2.0, 2.1,
  2.2, or "2.x" when no minor version), level AA, ADA, Title II/28 CFR, Section 508,
  accessibility contact (mailto/tel/form near "accessib"), dates on the page.
- Overlay: union of network requests, DOM nodes, window globals and script tags, from the 10
  vendor signatures in `app/api/tools/overlay-detector/route.ts`, the `qualify.mjs` regex and the
  extras in `scripts/prospecting/dom-overlay-probe.mjs` (Accessibly, AccessEase, CookieYes
  accessibility, Recite Me same-origin). A vendor name that only appears in the HTML text is
  recorded as weak evidence and not counted. Overlays change the DOM, so axe results on those
  pages describe the page after the overlay ran.
- PDF links (count and up to 10 URLs) on every measured page; CMS markers (generator meta and
  known asset paths); service and contact links and whether they leave the entity's domain.
- Timestamps per entity and per page, load and axe timings, Chrome version, UA.

**Etiquette.** Public pages only; plain desktop Chrome UA (owner decision) with the installed
Chrome's major version; no stealth plugins, no proxies, no CAPTCHA solving, no form submission;
robots.txt `User-agent: *` Disallow rules honoured for every URL; 4 workers, at least 3 s between
page loads on one registrable domain and at least 4 s (`--net-gap=<ms>`) between page loads on one
network (IPv4 /16 or IPv6 /48 of the resolved address) across all workers. The network spacing
was added after the pilot: about 18% of main-census sites sit on one hosting provider's two
address blocks, and that provider stopped accepting connections from the pilot machine after the
first (unthrottled) URL-resolution run. `resolve-urls.mjs` now spaces its requests per network
too (1.5 s). CDP calls that can hang on a stuck navigation are capped (8 to 15 s).

**Where to run.** From a non-US network a share of sites refuse by country (one state portal's CDN
says so explicitly) or drop connections. Run the full scan from a US network, on a fresh address
that has not done URL resolution, and record the host's country in the run notes.

## 4. Pilot sample (`pilot-sample.mjs`)

Seeded (default 20261111) shuffle within strata, eligible entities only (resolved URL): 6 states,
6 counties 250k+, 6 counties 50k to 250k, 6 cities 250k+, 5 cities 100k to 250k, 6 cities 50k to
100k, 3 general-purpose towns/townships, 2 limited-function townships (40).
