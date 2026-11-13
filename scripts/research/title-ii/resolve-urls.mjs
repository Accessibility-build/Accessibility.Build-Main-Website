/**
 * resolve-urls.mjs: match every frame entity to its official website.
 *
 *   node scripts/research/title-ii/resolve-urls.mjs [--refresh-wikidata] [--revalidate]
 *
 * Order of sources (README.md has the full rules):
 *   1. CISA dotgov registry (source/dotgov-current-full.csv): candidates in the same state and of a
 *      compatible domain type, scored on organisation name and domain label.
 *   2. Wikidata P856 (official website), joined on GNIS feature id P590 = the Census ANSI code in
 *      the PL file (PLACENS / COUSUBNS / COUNTYNS / STATENS), plus P882 (FIPS 6-4) for counties.
 *   3. Manual overrides (manual-urls.csv in research-data/title-ii/, columns entity_id,url,source,
 *      note), for entities the first two cannot settle. Official sources only.
 *
 * Every chosen URL is fetched (GET, redirects followed, plain browser UA, 20 s timeout) and the
 * final URL, status and title recorded; the page is checked for the entity's name. Checks are
 * cached in research-data/title-ii/url-checks.jsonl so a re-run only fetches new URLs.
 *
 * Writes research-data/title-ii/urls.csv and research-data/title-ii/manual-review.csv.
 */
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { DATA, SRC, readCsv, writeCsv, readJsonl, sleep, netGate } from "./common.mjs";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36";
const args = new Set(process.argv.slice(2));

const frame = await readCsv(path.join(DATA, "frame.csv"));
const dotgov = await readCsv(path.join(SRC, "dotgov-current-full.csv"));

// ---------------------------------------------------------------- names
const STATE_FULL = {};
for (const f of frame) if (f.type === "state") STATE_FULL[f.state] = f.name;

/** The entity's core name: "Birmingham city" -> "Birmingham", "Macon-Bibb County" -> "Macon-Bibb". */
export function baseName(f) {
  let n = f.name;
  n = n.replace(/\s+(city and borough|consolidated government|unified government|metro government|metropolitan government|urban county|charter township|township|town|village|borough|city|municipality|County|Parish|Borough|Municipality)$/i, "");
  n = n.replace(/\s+\(balance\)$/, "");
  if (f.name === "Louisville/Jefferson County metro government") n = "Louisville";
  if (f.name === "Lexington-Fayette urban county") n = "Lexington";
  if (f.name === "Methuen Town city") n = "Methuen";
  return n.trim();
}
const squash = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\bsaint\b/g, "st").replace(/[^a-z0-9]/g, "");
const nameVariants = (b) => {
  const v = new Set([squash(b)]);
  if (/^St\.? /i.test(b)) v.add(squash(b.replace(/^St\.? /i, "Saint ")));
  if (/^Saint /i.test(b)) v.add(squash(b.replace(/^Saint /i, "St ")));
  if (/^Mount /i.test(b)) v.add(squash(b.replace(/^Mount /i, "Mt ")));
  if (/^Fort /i.test(b)) v.add(squash(b.replace(/^Fort /i, "Ft ")));
  if (b.includes("-")) v.add(squash(b.split("-")[0]));
  if (b.includes("/")) v.add(squash(b.split("/")[0]));
  return [...v].filter((x) => x.length >= 3);
};

const DEPT = /police|sheriff|fire|library|water|sewer|utilit|court|clerk|election|vote|voter|park|airport|transit|health|attorney|assessor|treasurer|tax|911|emergency|housing|tourism|visit|museum|jail|detention|recorder|probate|auditor|prosecutor|district|school|college|port|parking|animal|recycl|trash|solid ?waste|energy|electric|power|golf|zoo|arts|cultural|convention|development|redevelop|workforce|job|careers|employ|census|covid|vaccin|alert|ready|prepare|311|pay|permit|gis|map|data|open|budget|transparen|ethic|inspector|audit|legislat|senate|house|assembly|judicial|judiciary|lottery|gaming|dmv|motor|revenue|labor|edu|univ|veteran|military|guard|correction|parole|probation|purchas|procure|bid|retire|pension|benefit|insurance|medicaid|child|family|aging|senior|youth|human ?serv|social|mental|behavioral|public ?works|street|road|highway|traffic|bridge|toll|harbor|marina|beach|lake|river|cemetery|hospital|medical|ems|ambulance|coroner|medical ?examiner|crime|safety|justice|legal|law|defender|authority|agency|department|dept|division|bureau|program|project|initiative|foundation|fund/i;
// Governing-body names that ARE the general government (county commission, fiscal court, etc.).
const GOVERNING = /board of (county )?(commissioners|supervisors)|fiscal court|county commission|commissioners court|board of chosen freeholders|county council|city council|town council|village board|town board|office of the (mayor|county executive|governor)|county executive|county administrat|city manager|town manager|county judge/gi;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Organisation names: strip the government-type words to get the core.
const orgCore = (o) =>
  squash(
    o.split(/\s+\/\s+|\s+-\s+|,\s+/)[0]
      .replace(GOVERNING, " ")
      .replace(/\b(the|city|town|township|charter|village|borough|county|parish|municipality|municipal|government|consolidated|unified|metropolitan|metro|urban|of|and|state|commonwealth|incorporated|inc|corporation|administrative|office|offices)\b/gi, " ")
  );

const TYPE_OK = {
  state: new Set(["State or territory"]),
  county: new Set(["County"]),
  consolidated: new Set(["County", "City"]),
};
const typeOk = (f, t) => (TYPE_OK[f.type] ?? new Set(["City"])).has(t);

function scoreDotgov(f, row) {
  const base = baseName(f);
  const variants = nameVariants(base);
  const label = row["Domain name"].toLowerCase().replace(/\.gov$/, "");
  const org = row["Organization name"];
  const core = orgCore(org);
  const orgFirst = org.split(/\s+\/\s+|\s+-\s+|,\s+/)[0];
  let s = 0;
  const why = [];
  const exactOrg = variants.includes(core);
  if (exactOrg) { s += 50; why.push("org=name"); }
  else if (variants.some((v) => core.includes(v))) { s += 15; why.push("org~name"); }
  else return null; // organisation must name the entity
  if (row["Suborganization name"]) { s -= 10; why.push("suborg"); }
  // Department test on the organisation name with the entity's own name and governing-body
  // phrases removed, so "Waterbury", "Lakewood" or "Board of Supervisors" do not read as departments.
  const orgRest = orgFirst
    .replace(new RegExp(escapeRe(base), "ig"), " ")
    .replace(new RegExp(escapeRe(STATE_FULL[f.state] ?? "~~"), "ig"), " ")
    .replace(GOVERNING, " ");
  if (DEPT.test(orgRest)) { s -= 45; why.push("dept-org"); }
  if (org.includes("/") || /\s-\s/.test(org)) { s -= 5; why.push("org-subunit"); }
  // Domain label.
  const st = f.state.toLowerCase();
  const nm = variants[0];
  const patterns =
    f.type === "state"
      ? [nm, st, `${st}gov`, `my${nm}`, `my${st}`, `${nm}gov`]
      : f.type === "county" || (f.type === "consolidated" && f.sumlev === "050")
        ? [`${nm}county`, `${nm}co`, `${nm}county${st}`, `${nm}co${st}`, `${nm}countyga`, `countyof${nm}`, `${nm}parish`, `${nm}${st}`, `co${nm}`, `${nm}countygov`]
        : [`${nm}`, `cityof${nm}`, `${nm}city`, `${nm}${st}`, `cityof${nm}${st}`, `townof${nm}`, `${nm}town`, `${nm}township`, `${nm}twp`, `villageof${nm}`, `${nm}village`, `${nm}${st}gov`, `${nm}gov`, `ci${nm}`, `${nm}city${st}`, `townof${nm}${st}`, `${nm}twp${st}`, `${nm}township${st}`, `${nm}-${st}`];
  if (patterns.includes(label.replace(/-/g, ""))) { s += 30; why.push("domain=pattern"); }
  else if (variants.some((v) => label.replace(/-/g, "").includes(v))) { s += 12; why.push("domain~name"); }
  if (DEPT.test(label.replace(new RegExp(variants.join("|"), "g"), ""))) { s -= 25; why.push("dept-domain"); }
  // County entities must not land on a city-named domain and vice versa.
  if ((f.type === "county") && /^(cityof|city)/.test(label)) s -= 30;
  if (["city", "town", "village", "township"].includes(f.type) && /county|parish/.test(label)) s -= 30;
  s -= Math.min(10, Math.max(0, label.length - 16) / 2);
  return { domain: row["Domain name"].toLowerCase(), org, score: Math.round(s), why: why.join("+"), exactOrg };
}

function dotgovFor(f) {
  const cands = [];
  for (const row of dotgov) {
    if (row.State !== f.state || !typeOk(f, row["Domain type"])) continue;
    const r = scoreDotgov(f, row);
    if (r) cands.push(r);
  }
  cands.sort((a, b) => b.score - a.score);
  return cands;
}

// ---------------------------------------------------------------- wikidata
async function sparql(query) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch("https://query.wikidata.org/sparql", {
      method: "POST",
      headers: { Accept: "application/sparql-results+json", "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "title-ii-research-script/0.1" },
      body: new URLSearchParams({ query }),
    });
    if (res.ok) return (await res.json()).results.bindings.map((b) => Object.fromEntries(Object.entries(b).map(([k, v]) => [k, v.value])));
    await sleep(5000 * (attempt + 1));
  }
  throw new Error("wikidata query failed");
}

async function wikidata() {
  const cache = path.join(SRC, "wikidata-p856.json");
  if (existsSync(cache) && !args.has("--refresh-wikidata")) return JSON.parse(await fs.readFile(cache, "utf8"));
  const out = { fetched: new Date().toISOString(), byGnis: {}, byFips: {} };
  const gnis = [...new Set(frame.map((f) => f.ansi_ns).filter(Boolean))];
  for (let i = 0; i < gnis.length; i += 150) {
    const vals = gnis.slice(i, i + 150).flatMap((g) => [`"${g}"`, `"${g.padStart(8, "0")}"`]).join(" ");
    const rows = await sparql(`SELECT ?item ?gnis ?site ?rank WHERE { VALUES ?gnis { ${vals} } ?item wdt:P590 ?gnis . OPTIONAL { ?item p:P856 ?st . ?st ps:P856 ?site . ?st wikibase:rank ?rank . } }`);
    for (const r of rows) {
      const k = r.gnis.replace(/^0+/, "");
      (out.byGnis[k] ??= []).push({ item: r.item, site: r.site ?? null, rank: (r.rank ?? "").replace(/.*#/, "") });
    }
    console.error(`wikidata gnis ${Math.min(i + 150, gnis.length)}/${gnis.length}`);
    await sleep(1000);
  }
  const fips = frame.filter((f) => f.sumlev === "050").map((f) => f.geoid);
  for (let i = 0; i < fips.length; i += 200) {
    const vals = fips.slice(i, i + 200).map((g) => `"${g}"`).join(" ");
    const rows = await sparql(`SELECT ?item ?fips ?site ?rank WHERE { VALUES ?fips { ${vals} } ?item wdt:P882 ?fips . OPTIONAL { ?item p:P856 ?st . ?st ps:P856 ?site . ?st wikibase:rank ?rank . } }`);
    for (const r of rows) (out.byFips[r.fips] ??= []).push({ item: r.item, site: r.site ?? null, rank: (r.rank ?? "").replace(/.*#/, "") });
    await sleep(1000);
  }
  await fs.writeFile(cache, JSON.stringify(out, null, 1));
  return out;
}

function wikiSite(wd, f) {
  const hits = [...(wd.byGnis[f.ansi_ns] ?? []), ...(f.sumlev === "050" ? wd.byFips[f.geoid] ?? [] : [])].filter((h) => h.site);
  if (!hits.length) return null;
  const rankOrder = { PreferredRank: 0, NormalRank: 1, DeprecatedRank: 9 };
  hits.sort((a, b) => (rankOrder[a.rank] ?? 5) - (rankOrder[b.rank] ?? 5));
  const best = hits.filter((h) => h.rank !== "DeprecatedRank");
  if (!best.length) return null;
  return { url: best[0].site, item: best[0].item.replace(/.*\//, ""), alternatives: [...new Set(best.slice(1).map((h) => h.site))].slice(0, 3) };
}

// ---------------------------------------------------------------- validation
const CHECKS = path.join(DATA, "url-checks.jsonl");
const checks = new Map((await readJsonl(CHECKS)).map((c) => [c.url, c]));

/** Registrable domain, good enough for US government hosts (handles ci.x.ca.us and co.x.y.us). */
export function regDomain(host) {
  const h = host.toLowerCase().replace(/^www\d?\./, "");
  const p = h.split(".");
  if (p.at(-1) === "us" && p.length >= 4) return p.slice(-4).join(".");
  if (p.at(-1) === "us" && p.length === 3) return p.join(".");
  return p.slice(-2).join(".");
}

async function check(url) {
  if (checks.has(url) && !args.has("--revalidate")) return checks.get(url);
  // Space requests per network (see common.mjs): added after the pilot, when one hosting provider
  // started refusing connections following the first, unthrottled resolution run.
  try { await netGate(new URL(url).hostname, 1500); } catch {}
  const started = Date.now();
  const rec = { url, checkedAt: new Date().toISOString() };
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 20000);
  try {
    const res = await fetch(url, { redirect: "follow", signal: ctl.signal, headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,*/*;q=0.8", "Accept-Language": "en-US,en;q=0.9" } });
    rec.status = res.status;
    rec.finalUrl = res.url;
    const reader = res.body.getReader();
    let html = "";
    while (html.length < 300000) {
      const { done, value } = await reader.read();
      if (done) break;
      html += new TextDecoder().decode(value);
    }
    reader.cancel().catch(() => {});
    rec.title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/\s+/g, " ").trim().slice(0, 200);
    rec.snippet = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 4000);
    const meta = html.match(/<meta[^>]+http-equiv=["']?refresh["']?[^>]*content=["'][^"']*url=([^"'>]+)/i);
    if (meta) rec.metaRefresh = new URL(meta[1].trim(), res.url).href;
  } catch (e) {
    rec.status = 0;
    rec.error = String(e.cause?.code || e.name || e.message).slice(0, 80);
  } finally {
    clearTimeout(timer);
  }
  rec.ms = Date.now() - started;
  checks.set(url, rec);
  await fs.appendFile(CHECKS, JSON.stringify(rec) + "\n");
  return rec;
}

const BOT_HOST = /perfdrive\.com|captcha|\/cdn-cgi\/challenge|validate\.|hcaptcha|radware/i;
const BOT = /just a moment|attention required|access denied|pardon our interruption|are you a robot|security check|captcha|request rejected|incapsula|forbidden/i;
function nameOnPage(f, c) {
  const text = squash(`${c.title ?? ""} ${c.snippet ?? ""}`);
  return nameVariants(baseName(f)).some((v) => text.includes(v)) || (f.type === "state" && text.includes(squash(f.name)));
}

// ---------------------------------------------------------------- main
const wd = await wikidata();
const manualFile = path.join(DATA, "manual-urls.csv");
const manual = existsSync(manualFile) ? new Map((await readCsv(manualFile)).map((m) => [m.entity_id, m])) : new Map();

const plan = frame.map((f) => {
  const dg = dotgovFor(f);
  const best = dg[0];
  const wiki = wikiSite(wd, f);
  return { f, dg, best, wiki };
});

// Fetch every candidate URL once (dotgov best, dotgov runner-up, wikidata, manual), 8 at a time.
const toCheck = new Set();
const norm = (u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);
for (const p of plan) {
  if (p.best) toCheck.add(norm(p.best.domain));
  if (p.dg[1] && p.dg[1].score >= p.best.score - 15) toCheck.add(norm(p.dg[1].domain));
  if (p.wiki) toCheck.add(p.wiki.url);
  const m = manual.get(p.f.entity_id);
  if (m) toCheck.add(m.url);
}
// --recheck-failed: network failures (timeouts, resets) are cached like any result, so a flaky
// moment sticks. This re-fetches candidates whose plain fetch AND Chrome check both failed with no
// HTTP status (DNS misses excluded).
if (args.has("--recheck-failed")) {
  const chromeOld = new Map((await readJsonl(path.join(DATA, "url-checks-chrome.jsonl"))).map((c) => [c.url, c]));
  let n = 0;
  for (const u of toCheck) {
    const a = checks.get(u);
    const b = chromeOld.get(u);
    if (a && a.status === 0 && a.error !== "ENOTFOUND" && (!b || b.status === 0)) { checks.delete(u); n++; }
  }
  console.error(`recheck-failed: ${n} URLs to fetch again`);
}
const queue = [...toCheck].filter((u) => !checks.has(u) || args.has("--revalidate"));
console.error(`${toCheck.size} candidate URLs, ${queue.length} to fetch`);
let n = 0;
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const u = queue.shift();
      await check(u);
      if (++n % 100 === 0) console.error(`checked ${n}`);
    }
  })
);

const good = (c) => c && c.status >= 200 && c.status < 400;

// Many .gov registrations serve the site only on www (no apex record, or no HTTPS on the apex).
// When the apex of a dotgov candidate does not load, try https://www.<domain> as well.
{
  const www = [];
  for (const p of plan) for (const d of [p.best?.domain, p.dg[1]?.domain].filter(Boolean)) {
    const w = `https://www.${d}`;
    if (!good(checks.get(norm(d))) && !toCheck.has(w)) { www.push(w); toCheck.add(w); }
  }
  const q = www.filter((u) => !checks.has(u) || args.has("--revalidate"));
  console.error(`www fallback: ${www.length} hosts, ${q.length} to fetch`);
  await Promise.all(Array.from({ length: 8 }, async () => { while (q.length) await check(q.shift()); }));
}

// Second look in real Chrome for candidates the plain fetch could not read (connection refused or
// reset, timeouts, 403/429 from bot protection that keys on the TLS fingerprint, 5xx). Same plain
// UA, no evasion. Results are cached in url-checks-chrome.jsonl and take precedence when they load.
const CHROME_CHECKS = path.join(DATA, "url-checks-chrome.jsonl");
const chromeChecks = new Map((await readJsonl(CHROME_CHECKS)).map((c) => [c.url, c]));
{
  // DNS failures (ENOTFOUND) are not retried in Chrome: the host does not exist.
  const redo = [...toCheck].filter((u) => !good(checks.get(u)) && checks.get(u)?.error !== "ENOTFOUND" && (!chromeChecks.has(u) || args.has("--revalidate") || (args.has("--recheck-failed") && chromeChecks.get(u).status === 0)));
  if (redo.length && !args.has("--no-chrome")) {
    console.error(`chrome re-check of ${redo.length} URLs the fetch could not read`);
    const puppeteer = (await import("puppeteer")).default;
    const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    const q = [...redo];
    let k = 0;
    await Promise.all(
      Array.from({ length: 6 }, async () => {
        let browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
        let since = 0;
        while (q.length) {
          const url = q.shift();
          const rec = { url, via: "chrome", checkedAt: new Date().toISOString() };
          const t0 = Date.now();
          const page = await browser.newPage();
          try {
            await page.setUserAgent(UA);
            const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
            await new Promise((r) => setTimeout(r, 2500));
            rec.status = res ? res.status() : 0;
            rec.finalUrl = await page.evaluate(() => location.href).catch(() => page.url());
            if (rec.finalUrl.startsWith("chrome-error:")) { rec.status = 0; rec.error = "chrome-error"; }
            else {
              rec.title = ((await page.title().catch(() => "")) || "").replace(/\s+/g, " ").trim().slice(0, 200);
              rec.snippet = ((await page.evaluate(() => document.body?.innerText || "").catch(() => "")) || "").replace(/\s+/g, " ").slice(0, 4000);
            }
          } catch (e) {
            rec.status = 0;
            rec.error = (String(e.message).match(/net::ERR_[A-Z_]+/) ?? [String(e.message).split("\n")[0].slice(0, 80)])[0];
          } finally {
            await page.close().catch(() => {});
          }
          rec.ms = Date.now() - t0;
          chromeChecks.set(url, rec);
          await fs.appendFile(CHROME_CHECKS, JSON.stringify(rec) + "\n");
          if (++k % 50 === 0) console.error(`chrome checked ${k}/${redo.length}`);
          if (++since >= 25) { await browser.close().catch(() => {}); browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] }); since = 0; }
        }
        await browser.close().catch(() => {});
      })
    );
  }
}
/** The URL to use for a dotgov domain: the apex if it loads, else www if that loads or is blocked. */
const dgUrl = (d) => {
  const apex = norm(d);
  const w = `https://www.${d}`;
  if (good(bestCheck(apex))) return apex;
  const cw = bestCheck(w);
  if (cw && (good(cw) || cw.status === 403 || cw.status === 429)) return w;
  return apex;
};
/** Best available check for a URL: the fetch result if it read the page, else Chrome's. */
const bestCheck = (u) => {
  const a = checks.get(u);
  const b = chromeChecks.get(u);
  if (good(a)) return a;
  if (b && (good(b) || !a)) return b;
  if (b && b.status && b.status !== 0) return b;
  return a ?? b;
};
// ---------------------------------------------------------------- pattern probe (source 3)
// For entities where neither dotgov nor Wikidata gives a page that loads with the entity's name,
// try the usual US government host patterns (co.<name>.<st>.us, <name>county<st>.gov,
// cityof<name>.org, ...). A host is accepted only if it resolves in DNS, loads, and the page names
// the entity, its government type (county, city, town...) and its state, so a same-named place in
// another state cannot match.
const dns = await import("node:dns/promises");
const TYPE_WORD = { county: /county|parish|borough/i, state: /state|commonwealth/i };
function strongMatch(f, c) {
  if (!good(c) || BOT.test(c.title ?? "")) return false;
  const text = `${c.title ?? ""} ${c.snippet ?? ""}`;
  const typeRe = TYPE_WORD[f.type] ?? (f.sumlev === "050" ? TYPE_WORD.county : /city|town|township|village|borough|municipal|government/i);
  const stateRe = new RegExp(`\\b(${STATE_FULL[f.state] ?? "~~"}|${f.state})\\b`);
  // Squatted, parked and aggregator sites reuse government names: require the page to stay on the
  // probed domain, the title to carry the name, and official wording somewhere on the page.
  let sameDomain = false;
  try { sameDomain = regDomain(new URL(c.finalUrl).hostname) === regDomain(new URL(c.url).hostname); } catch {}
  const titleHasName = nameVariants(baseName(f)).some((v) => squash(c.title ?? "").includes(v));
  const official = /official (web ?site|site)|(county|city|town|township|village|borough|parish) (of|government|hall|council|commission|manager|clerk)|board of (county )?(commissioners|supervisors)|mayor|county commission|fiscal court/i.test(text);
  const parked = /coming soon|domain (is )?for sale|buy this domain|parked|under construction|events in|things to do|real estate|news and events|hotels?/i.test(c.title ?? "");
  return sameDomain && titleHasName && official && !parked && nameOnPage(f, c) && typeRe.test(text) && stateRe.test(text);
}
function patternHosts(f) {
  const st = f.state.toLowerCase();
  const sn = squash(STATE_FULL[f.state] ?? "");
  const out = new Set();
  for (const n of nameVariants(baseName(f)).slice(0, 2)) {
    if (f.sumlev === "050") {
      const k = f.state === "LA" ? "parish" : f.state === "AK" ? "borough" : "county";
      for (const h of [`${n}${k}.gov`, `${n}${k}${st}.gov`, `${n}co${st}.gov`, `co.${n}.${st}.us`, `${n}${k}.org`, `${n}${k}${st}.org`, `${n}${k}.us`, `${n}${k}${st}.us`, `${n}${k}.com`, `${n}${k}${st}.com`, `${n}${k}.net`, `${n}${k}${st}.net`, `${n}${k}${sn}.gov`, `${n}${k}${sn}.org`, `${n}${k}online.org`, `${n}co.org`, `${n}co.com`])
        out.add(h);
    } else {
      const kinds = f.type === "township" ? ["township", "twp"] : f.type === "town" ? ["town", "townof"] : f.type === "village" ? ["village", "villageof"] : ["city", "cityof"];
      const [suf, pre] = kinds;
      for (const h of [`${pre}${n}.org`, `${pre}${n}.com`, `${pre}${n}.net`, `${pre}${n}.us`, `${pre}${n}.gov`, `${pre}${n}${st}.gov`, `${pre}${n}${st}.org`, `${pre}${n}${st}.com`, `${n}${suf}.org`, `${n}${suf}.com`, `${n}${suf}.gov`, `${n}${suf}${st}.gov`, `${n}${suf}${st}.org`, `${n}${st}.gov`, `${n}${st}.org`, `${n}${st}.com`, `${n}${st}.us`, `${n}.gov`, `${n}.org`, `ci.${n}.${st}.us`, `www.${n}.${st}.us`, `${n}-${st}.gov`])
        out.add(h);
    }
  }
  return [...out];
}
const patternHits = new Map();
{
  const weak = plan.filter(({ f, dg, best, wiki }) => {
    if (manual.has(f.entity_id)) return false;
    const urls = [best && dgUrl(best.domain), dg[1] && dgUrl(dg[1].domain), wiki?.url].filter(Boolean);
    return !urls.some((u) => { const c = bestCheck(u); return good(c) && !BOT.test(c.title ?? "") && nameOnPage(f, c); });
  });
  const probes = [];
  for (const p of weak) for (const h of patternHosts(p.f)) probes.push([p.f, h]);
  console.error(`pattern probe: ${weak.length} weak entities, ${probes.length} hosts to try`);
  const q = [...probes];
  await Promise.all(
    Array.from({ length: 16 }, async () => {
      while (q.length) {
        const [f, h] = q.shift();
        const url = `https://${h}`;
        let c = checks.get(url) ?? checks.get(`http://${h}`);
        if (!c) {
          const ok = await dns.lookup(h.replace(/^www\./, "")).then(() => true, () => dns.lookup(`www.${h}`).then(() => true, () => false));
          if (!ok) {
            // Cache the DNS miss so a re-run does not look it up again.
            const miss = { url, checkedAt: new Date().toISOString(), status: 0, error: "ENOTFOUND", via: "dns" };
            checks.set(url, miss);
            await fs.appendFile(CHECKS, JSON.stringify(miss) + "\n");
            continue;
          }
          c = await check(url);
          if (!good(c)) c = await check(`http://${h}`);
        }
        if (strongMatch(f, c)) (patternHits.get(f.entity_id) ?? patternHits.set(f.entity_id, []).get(f.entity_id)).push(c.url);
      }
    })
  );
  console.error(`pattern probe: ${patternHits.size} entities matched`);
}

const rows = [];
const review = [];
for (const { f, dg, best, wiki } of plan) {
  const m = manual.get(f.entity_id);
  const cand = [];
  if (m) cand.push({ url: m.url, source: m.source || "manual", base: 3, note: m.note || "" });
  if (best) {
    // 3: organisation is the government and the domain follows a usual pattern; 2: organisation
    // is the government and the domain contains the name; 1: weaker; 0: a department's domain.
    const dept = /dept/.test(best.why);
    const lvl = dept ? 0 : best.exactOrg && /domain=pattern/.test(best.why) ? 3 : best.exactOrg && /domain~name/.test(best.why) ? 2 : 1;
    cand.push({ url: dgUrl(best.domain), source: "dotgov", base: lvl, note: `${best.org} [${best.why}; score ${best.score}]` });
    const second = dg[1];
    if (second && second.score >= best.score - 15) cand.push({ url: dgUrl(second.domain), source: "dotgov-alt", base: Math.max(1, lvl - 1), note: `${second.org} [${second.why}; score ${second.score}]` });
  }
  if (wiki) cand.push({ url: wiki.url, source: "wikidata", base: 2, note: `${wiki.item}` });
  for (const u of (patternHits.get(f.entity_id) ?? []).slice(0, 1)) cand.push({ url: u, source: "pattern", base: 2, note: "host pattern; same-domain page whose title names the entity, with official wording, type and state" });

  for (const c of cand) {
    c.check = bestCheck(c.url);
    c.finalHost = good(c.check) ? regDomain(new URL(c.check.finalUrl).hostname) : c.url ? regDomain(new URL(c.url).hostname) : null;
    c.nameOk = good(c.check) && nameOnPage(f, c.check);
    c.blocked = !!(c.check && (c.check.status === 403 || c.check.status === 429 || (good(c.check) && (BOT.test(c.check.title ?? "") || BOT_HOST.test(c.check.finalUrl ?? "")))));
    if (c.blocked) c.nameOk = false;
  }
  const dgC = cand.find((c) => c.source === "dotgov");
  const wkC = cand.find((c) => c.source === "wikidata");
  const agree = dgC && wkC && dgC.finalHost && dgC.finalHost === wkC.finalHost;

  // Pick: a manual entry if it is usable; otherwise the usable candidate with the highest
  // score (base + name on page + dotgov/Wikidata agreement), ties to dotgov, then Wikidata.
  let pick = null;
  const usable = (c) => c && (good(c.check) || c.blocked);
  const order = { manual: 0, dotgov: 1, wikidata: 2, pattern: 3, "dotgov-alt": 4 };
  for (const c of cand) c.score = c.base + (c.nameOk ? 1 : 0) + (agree && (c.source === "dotgov" || c.source === "wikidata") ? 1 : 0);
  if (m && usable(cand[0])) pick = cand[0];
  else pick = cand.filter(usable).sort((a, b) => b.score - a.score || (order[a.source] ?? 9) - (order[b.source] ?? 9))[0] ?? null;
  // Nothing loads, but the host exists and refuses or drops the connection (no DNS failure): from
  // a non-US network this is usually geo-blocking. Keep a strong dotgov match (or a Wikidata value
  // on the same domain) as "unverified" so it can be scanned from a US host later.
  let unverified = false;
  const reachableDns0 = (c) => c?.check && c.check.error !== "ENOTFOUND" && !/NAME_NOT_RESOLVED/.test(c.check.error ?? "");
  // A manual entry is an analyst's override: if it exists in DNS but cannot be reached from here,
  // keep it (unverified) rather than fall back to a weaker automatic candidate.
  if (m && !usable(cand[0]) && reachableDns0(cand[0])) { pick = cand[0]; unverified = true; pick.score = 0; }
  if (!pick) {
    const reachableDns = (c) => c?.check && c.check.error !== "ENOTFOUND" && !/NAME_NOT_RESOLVED/.test(c.check.error ?? "");
    const strongDg = dgC && dgC.base >= 2 && reachableDns(dgC) ? dgC : null;
    const wkSame = wkC && dgC && reachableDns(wkC) && regDomain(new URL(wkC.url).hostname) === regDomain(new URL(dgC.url).hostname) ? wkC : null;
    const manualC = m && reachableDns(cand[0]) ? cand[0] : null;
    pick = manualC ?? strongDg ?? wkSame ?? null;
    if (pick) { unverified = true; pick.score = 0; }
  }

  let confidence = "none";
  const flags = [];
  if (pick) {
    const score = pick.score;
    // A conflict only matters when the other source also resolves with the name on its page.
    const other = pick.source === "dotgov" ? wkC : pick.source === "wikidata" ? dgC : null;
    if (other && !agree && good(other.check) && other.nameOk && other.base >= 1) flags.push("dotgov-wikidata-conflict");
    if (!pick.nameOk && !pick.blocked) flags.push("name-not-on-page");
    if (pick.blocked) flags.push("blocked-on-fetch");
    if (pick.check?.metaRefresh) flags.push("meta-refresh");
    const finalHost = good(pick.check) ? new URL(pick.check.finalUrl).hostname : "";
    // Redirects between government domains (ga.gov -> georgia.gov) are normal; flag only a move to
    // a non-.gov domain that does not carry the entity's name.
    if (finalHost && regDomain(finalHost) !== regDomain(new URL(pick.url).hostname) && !/\.gov$/.test(finalHost) && !nameVariants(baseName(f)).some((v) => squash(finalHost).includes(v)))
      flags.push("redirects-off-domain");
    confidence = unverified ? "unverified" : score >= 4 ? "high" : score >= 3 ? "medium" : "low";
    if (unverified) flags.push(`unreachable-from-scan-host:${pick.check?.error ?? "?"}`);
    if (flags.includes("dotgov-wikidata-conflict") && confidence === "high" && !pick.nameOk) confidence = "medium";
  } else flags.push(cand.length ? "candidates-did-not-resolve" : "no-candidate");

  const row = {
    entity_id: f.entity_id,
    name: f.name,
    type: f.type,
    state: f.state,
    group: f.group,
    pop2020: f.pop2020,
    url: pick?.url ?? "",
    // A bot-wall redirect (e.g. a challenge host) is not the site's address: leave final_url empty.
    final_url: pick && good(pick.check) && !pick.blocked ? pick.check.finalUrl : "",
    http_status: pick?.check?.status ?? "",
    page_title: pick?.check?.title ?? "",
    source: pick?.source ?? "",
    confidence,
    name_on_page: pick ? (pick.nameOk ? 1 : 0) : "",
    dotgov_wikidata_agree: agree ? 1 : 0,
    flags: flags.join(";"),
    dotgov_best: dgC ? `${dgC.url} (${dgC.note})` : "",
    wikidata: wkC ? `${wkC.url} (${wkC.note})` : "",
    match_note: pick?.note ?? "",
  };
  rows.push(row);
  if (confidence === "none" || confidence === "low" || confidence === "unverified" || flags.some((x) => ["dotgov-wikidata-conflict", "name-not-on-page", "redirects-off-domain"].includes(x)))
    review.push(row);
}

// Shared websites: two entities resolving to the same final host (consolidated governments).
const byHost = new Map();
for (const r of rows) {
  if (!r.final_url) continue;
  const h = new URL(r.final_url).hostname.replace(/^www\./, "");
  (byHost.get(h) ?? byHost.set(h, []).get(h)).push(r);
}
for (const [h, rs] of byHost) if (rs.length > 1) for (const r of rs) r.flags = [r.flags, `shared-host:${rs.map((x) => x.entity_id).filter((x) => x !== r.entity_id).join("|")}`].filter(Boolean).join(";");

await writeCsv(path.join(DATA, "urls.csv"), rows);
await writeCsv(path.join(DATA, "manual-review.csv"), review);

const tally = {};
for (const r of rows) {
  const k = `${r.group}/${r.type}`;
  tally[k] ??= { n: 0, high: 0, medium: 0, low: 0, unverified: 0, none: 0 };
  tally[k].n++;
  tally[k][r.confidence]++;
}
console.table(tally);
const resolved = rows.filter((r) => r.confidence !== "none").length;
const main = rows.filter((r) => r.group === "main");
const mainVerified = main.filter((r) => !["none", "unverified"].includes(r.confidence)).length;
const mainAny = main.filter((r) => r.confidence !== "none").length;
console.log(`main census: ${mainVerified}/${main.length} verified (${((100 * mainVerified) / main.length).toFixed(1)}%), ${mainAny} with a URL incl. unverified (${((100 * mainAny) / main.length).toFixed(1)}%)`);
console.log(`resolved ${resolved}/${rows.length} (${((100 * resolved) / rows.length).toFixed(1)}%); manual review ${review.length}`);
console.log("sources:", Object.entries(rows.reduce((a, r) => ((a[r.source || "none"] = (a[r.source || "none"] ?? 0) + 1), a), {})));
