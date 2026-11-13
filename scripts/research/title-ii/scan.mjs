/**
 * scan.mjs: measure automated accessibility indicators on each entity's official website.
 *
 *   node scripts/research/title-ii/scan.mjs [--ids=path] [--out=raw/scan.jsonl] [--concurrency=4] [--limit=N] [--retry-failed] [--headful] [--urls=urls.csv]
 *
 * Input:  research-data/title-ii/urls.csv (entities with a resolved URL); --ids restricts the run to
 *         the entity_ids listed one per line (or the first CSV column) in that file.
 * Output: one JSON line per entity in research-data/title-ii/<out> (default raw/scan.jsonl).
 *         Resumable: entity_ids already in the output are skipped. With --retry-failed, entities
 *         whose home page was not measurable are scanned again and a new line is appended (the
 *         aggregation step keeps the latest line per entity and attempt history).
 *
 * Per entity, at most 5 page loads, one at a time:
 *   1. home page: render-validity gate, axe-core (WCAG 2.0/2.1 A and AA tags only), overlay
 *      detection (network + DOM + globals), statement/service/contact link harvest, PDF links, CMS
 *   2. up to 2 accessibility-statement candidates (links found by text or href, else /accessibility
 *      and /ada): text only, scored as a statement, WCAG version, ADA/Title II, contact, date
 *   3. up to 2 key pages found on the home page: a resident-service page (pay, permit, apply...)
 *      and the contact page: render gate + axe + PDF links + overlay, off-domain recorded
 *
 * Etiquette: public pages only, plain desktop Chrome UA (owner decision), no stealth, no CAPTCHA
 * solving, no form submission. Bot walls are recorded as not measurable, never worked around.
 * robots.txt "User-agent: *" Disallow rules are honoured for every URL fetched.
 * 4 workers by default, 1.2 s between an entity's pages, >= 3 s between page loads on one domain
 * and >= 4 s (--net-gap) between page loads on one network (IPv4 /16), across all workers.
 */
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import puppeteer from "puppeteer";
import { DATA, readCsv, readJsonl, sleep, netGate } from "./common.mjs";

const require_ = createRequire(import.meta.url);
const AXE_PATH = require_.resolve("axe-core/axe.min.js");
const AXE_SRC = await fs.readFile(AXE_PATH, "utf8");
const AXE_PKG = JSON.parse(await fs.readFile(path.join(path.dirname(AXE_PATH), "package.json"), "utf8")).version;
// Shadow AMD/CommonJS globals so pages that ship RequireJS still get window.axe.
const AXE_INJECT = `(function(){var define=undefined,module=undefined,exports=undefined;${AXE_SRC}\n;window.axe=window.axe||axe;})();`;

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
const NAV_TIMEOUT = 40000;
const SUB_NAV_TIMEOUT = 25000;
const SETTLE_MS = 2500;
const PAGE_GAP_MS = 1200;
const DOMAIN_GAP_MS = 3000;
// Minimum gap between page loads on one network (IPv4 /16 or IPv6 /48) across all workers.
const NET_GAP_MS = Number(process.argv.find((a) => a.startsWith("--net-gap="))?.slice(10) ?? 4000);
const SCANNER_VERSION = "title-ii-scan/1.0";

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) ?? `--${k}=${d ?? ""}`).split("=").slice(1).join("=");
const flag = (k) => process.argv.includes(`--${k}`);
const OUT = path.join(DATA, arg("out", "raw/scan.jsonl"));
const CONCURRENCY = Number(arg("concurrency", 4));
const LIMIT = Number(arg("limit", 0));

// ------------------------------------------------------------------ detection rules
// Bot-wall rules: lib/render/browser.ts detectBotWall() plus the analyse.mjs title regex.
const BOTWALL_TITLE = /just a moment|attention required|access denied|pardon our interruption|are you a robot|security check|captcha|forbidden|blocked|incapsula|request rejected|web page blocked|site can.t be reached|error 1020|ddos protection|checking your browser|one more step/i;
const BOTWALL_HOST = /perfdrive\.com|validate\.perfdrive|\/cdn-cgi\/challenge-platform\/h\/[a-z]\/orchestrate|hcaptcha\.com|captcha-delivery\.com/i;
const BOTWALL_TEXT = /verify you are (a )?human|checking your browser|enable javascript and cookies to continue|captcha|press (and|&) hold|try deleting your cookies|request unsuccessful|incapsula incident|the requested url was rejected|your support id is|access to this page has been denied|performing security verification|ray id/i;

// Overlay vendors: union of qualify.mjs OVERLAY_RE, the 10 vendors in
// app/api/tools/overlay-detector/route.ts and the extras in scripts/prospecting/dom-overlay-probe.mjs.
const OVERLAY_VENDORS = [
  { name: "accessiBe", net: /acsbapp|accessibe|acsbap\.com|acsb\.js/i, dom: ["acsb-trigger", "acsb-widget", "accessibe", "acsb"], globals: ["acsbJS", "AccessiBe"] },
  { name: "UserWay", net: /userway/i, dom: ["userway", "userwayAccessibilityWidget"], globals: ["UserWay", "_userway_config"] },
  { name: "AudioEye", net: /audioeye/i, dom: ["audioeye", "ae-compliance"], globals: ["AudioEye", "ae_compliance", "$ae"] },
  { name: "EqualWeb", net: /equalweb|nagich/i, dom: ["equalweb", "nagich", "INDmenu"], globals: ["__equalweb", "nagich", "interdeal"] },
  { name: "MaxAccess", net: /maxaccess\.io/i, dom: ["maxaccess"], globals: ["MaxAccess"] },
  { name: "TruAbilities", net: /truabilities/i, dom: ["truabilities"], globals: ["TruAbilities"] },
  { name: "Facil'iti", net: /facil-iti|faciliti\.com/i, dom: ["facil-iti", "facil_iti"], globals: ["faciliti"] },
  { name: "Recite Me", net: /reciteme/i, dom: ["recite-me", "reciteme"], globals: ["reciteMe", "ReciteMe", "_reciteLoaded"] },
  { name: "User1st", net: /user1st/i, dom: ["user1st"], globals: ["User1st"] },
  { name: "ADA Compliance", net: /adacompliance(forwebsites)?\.(org|com)/i, dom: ["adacomplia"], globals: ["adaCompliance"] },
  { name: "Accessibly", net: /accessibly(app)?\.(com|app)|cdn\.accessibly/i, dom: ["accessibly"], globals: ["accessibly", "__accessibly"] },
  { name: "AccessEase", net: /accessease/i, dom: ["accessease"], globals: ["accessEase", "AccessEase"] },
  { name: "CookieYes accessibility", net: /cya11y/i, dom: ["cya11y"], globals: ["cyA11y"] },
  { name: "Adally", net: /adally/i, dom: ["adally"], globals: ["adally"] },
  { name: "Allyable", net: /allyable/i, dom: ["allyable"], globals: ["allyable"] },
  { name: "WP Accessibility Helper", net: /accessibility-helper/i, dom: ["wahout", "wah-"], globals: [] },
];

const SERVICE_TEXT = /\b(pay(ments?)?|pay (a|my|your) (bill|ticket|taxes)|online payments?|utility (bill|billing|payments?)|permits?|licen[cs](e|es|ing)|apply|applications?|register|registration|report (a |an )?(problem|concern|issue|pothole)|request (a )?service|service requests?|311)\b/i;
const CONTACT_TEXT = /^\s*(contact( us)?|contact the (city|county|town|village|state)|get in touch)\s*$/i;
const A11Y_TEXT = /accessib|\bada\b|section 508|disability access/i;
const STATEMENT_PATHS = ["/accessibility", "/ada"];

// ------------------------------------------------------------------ helpers
/** Resolve p, or `fallback` after ms. */
const within = (p, ms, fallback) => Promise.race([p, new Promise((r) => setTimeout(() => r(fallback), ms))]);
function regDomain(host) {
  const h = host.toLowerCase().replace(/^www\d?\./, "");
  const p = h.split(".");
  if (p.at(-1) === "us" && p.length >= 4) return p.slice(-4).join(".");
  if (p.at(-1) === "us" && p.length === 3) return p.join(".");
  return p.slice(-2).join(".");
}

// Per-domain politeness shared by all workers.
const lastHit = new Map();
async function domainGate(url) {
  let d;
  try { d = regDomain(new URL(url).hostname); } catch { return; }
  for (;;) {
    const wait = (lastHit.get(d) ?? 0) + DOMAIN_GAP_MS - Date.now();
    if (wait <= 0) break;
    await sleep(wait);
  }
  lastHit.set(d, Date.now());
}

// robots.txt, "User-agent: *" group only, longest-match Allow/Disallow.
const robotsCache = new Map();
async function robotsRules(origin, ua) {
  if (robotsCache.has(origin)) return robotsCache.get(origin);
  let rules = { fetched: false, allow: [], disallow: [] };
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 10000);
    const res = await fetch(origin + "/robots.txt", { signal: ctl.signal, headers: { "User-Agent": ua } });
    clearTimeout(t);
    if (res.ok && /text\/plain/i.test(res.headers.get("content-type") || "text/plain")) {
      const text = (await res.text()).slice(0, 200000);
      rules.fetched = true;
      let inStar = false;
      let sawRule = false;
      for (const raw of text.split(/\r?\n/)) {
        const line = raw.replace(/#.*/, "").trim();
        const m = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
        if (!m) continue;
        const [, k, v] = m;
        const key = k.toLowerCase();
        if (key === "user-agent") {
          if (sawRule) { inStar = false; sawRule = false; }
          if (v.trim() === "*") inStar = true;
        } else if (key === "allow" || key === "disallow") {
          sawRule = true;
          if (inStar && v.trim()) rules[key].push(v.trim());
        }
      }
    } else rules.status = res.status;
  } catch (e) {
    rules.error = String(e.name || e.message).slice(0, 60);
  }
  robotsCache.set(origin, rules);
  return rules;
}
const ruleMatch = (rule, p) => {
  const re = new RegExp("^" + rule.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
  return re.test(p);
};
async function robotsAllowed(url, ua) {
  const u = new URL(url);
  const r = await robotsRules(u.origin, ua);
  const p = u.pathname + u.search;
  const best = (list) => Math.max(-1, ...list.filter((x) => ruleMatch(x, p)).map((x) => x.length));
  return best(r.disallow) <= best(r.allow);
}

// ------------------------------------------------------------------ page work
/** Navigate, classify render validity. Returns { page info } without running axe. */
async function load(page, url, { retry = false, timeout = NAV_TIMEOUT, referer } = {}) {
  const out = { requestedUrl: url, startedAt: new Date().toISOString() };
  const t0 = Date.now();
  let resp = null;
  let navError = "";
  try {
    resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout, ...(referer ? { referer } : {}) });
  } catch (e) {
    navError = String(e.message).split("\n")[0];
  }
  // Home page only: one retry on a fast 404/429/5xx; some bot protection answers the first request only.
  if (retry && resp && [404, 429, 500, 502, 503, 504].includes(resp.status()) && Date.now() - t0 < 10000) {
    out.retried = resp.status();
    await sleep(5000);
    try { resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout }); navError = ""; } catch (e) { navError = String(e.message).split("\n")[0]; }
  }
  await page.waitForNetworkIdle({ idleTime: 500, timeout: 6000 }).catch(() => {});
  await sleep(SETTLE_MS);
  out.loadMs = Date.now() - t0;
  out.httpStatus = resp ? resp.status() : null;
  // CDP evaluate can hang on a page stuck mid-navigation (seen in the pilot: 150 s), so cap it.
  const href = await within(page.evaluate(() => location.href), 8000, page.url()).catch(() => page.url());
  out.finalUrl = href;
  if (href.startsWith("chrome-error:") || page.url().startsWith("chrome-error:")) {
    out.outcome = /TIMED_OUT|Timeout/i.test(navError) ? "timeout" : "chrome-error";
    out.error = (navError.match(/net::ERR_[A-Z_]+/) ?? [navError.slice(0, 120)])[0];
    return out;
  }
  if (navError && !resp) {
    const ready = await within(page.evaluate(() => document.readyState), 8000, null).catch(() => null);
    if (ready !== "interactive" && ready !== "complete") {
      out.outcome = /Timeout|TIMED_OUT/i.test(navError) ? "timeout" : "nav-error";
      out.error = navError.slice(0, 160);
      return out;
    }
    out.navWarning = navError.slice(0, 160);
  }
  const g = await within(page
    .evaluate(() => {
      const text = (document.body?.innerText || "").trim();
      return {
        title: (document.title || "").trim().slice(0, 200),
        links: document.querySelectorAll("a[href]").length,
        textLen: text.length,
        text3k: text.slice(0, 3000).toLowerCase(),
        hasStructure: !!document.querySelector("h1, main, [role=main], nav, [role=navigation]"),
        lang: document.documentElement.getAttribute("lang"),
      };
    })
    .catch((e) => ({ evalError: String(e.message).slice(0, 120) })), 15000, { evalError: "evaluate timeout 15s" });
  Object.assign(out, { title: g.title, linkCount: g.links, textLength: g.textLen, hasStructure: g.hasStructure, lang: g.lang });
  if (g.evalError) { out.outcome = "nav-error"; out.error = g.evalError; return out; }
  // Bot wall first: interstitials often answer 200 or 403.
  if (BOTWALL_TITLE.test(g.title) || (g.links < 5 && BOTWALL_TEXT.test(g.text3k)) || BOTWALL_HOST.test(href)) {
    out.outcome = "botwall";
    out.botwallReason = BOTWALL_TITLE.test(g.title) ? `title: ${g.title}` : BOTWALL_HOST.test(href) ? `challenge host: ${new URL(href).hostname}` : "verification text";
    return out;
  }
  // detectBotWall() also treats an empty page as a wall. Here it is kept apart: it is not
  // measurable either way, but an empty page can also be a JavaScript app or a broken page.
  if (g.links < 2 && !g.hasStructure && g.textLen < 60) {
    out.outcome = "render-invalid";
    out.gateFailures = ["empty page"];
    return out;
  }
  if (out.httpStatus !== null && out.httpStatus >= 400) {
    out.outcome = "http-error";
    return out;
  }
  // Render-validity gate (design section 3, item 12). The design also gated on h1/main/nav; the
  // pilot showed real, older pages without any of them, and excluding them would bias the sample
  // toward better-built sites, so their absence is recorded (noLandmarks) but does not gate.
  const gate = [];
  if (g.links < 10) gate.push("links<10");
  if (g.textLen < 500) gate.push("text<500");
  out.noLandmarks = !g.hasStructure;
  out.gateFailures = gate;
  out.outcome = gate.length ? "render-invalid" : "ok";
  return out;
}

async function runAxe(page) {
  const t0 = Date.now();
  try {
    await page.evaluate(AXE_INJECT);
    const res = await Promise.race([
      page.evaluate(async (tags) => {
        const r = await window.axe.run(document, { runOnly: { type: "tag", values: tags }, resultTypes: ["violations", "incomplete"], iframes: false });
        const slim = (v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, tags: v.tags.filter((t) => /^wcag\d|^wcag2/.test(t)), targets: v.nodes.slice(0, 3).map((n) => String(n.target?.[0] ?? "").slice(0, 120)) });
        return { version: window.axe.version, violations: r.violations.map(slim), incomplete: r.incomplete.map((v) => ({ id: v.id, nodes: v.nodes.length })) };
      }, AXE_TAGS),
      sleep(60000).then(() => { throw new Error("axe timeout 60s"); }),
    ]);
    res.ms = Date.now() - t0;
    res.violationRules = res.violations.length;
    res.violationNodes = res.violations.reduce((n, v) => n + v.nodes, 0);
    return res;
  } catch (e) {
    return { error: String(e.message).split("\n")[0].slice(0, 160), ms: Date.now() - t0 };
  }
}

async function domFacts(page, vendors) {
  return page
    .evaluate((vendors) => {
      const abs = (a) => { try { return new URL(a.getAttribute("href"), location.href).href; } catch { return null; } };
      const anchors = [...document.querySelectorAll("a[href]")];
      const links = anchors
        .map((a) => ({ href: abs(a), text: (a.innerText || a.textContent || a.getAttribute("aria-label") || a.getAttribute("title") || "").replace(/\s+/g, " ").trim().slice(0, 100) }))
        .filter((l) => l.href && /^https?:/i.test(l.href));
      const pdfs = [...new Set(links.filter((l) => /\.pdf($|[?#])/i.test(l.href)).map((l) => l.href.split("#")[0]))];
      // Overlay evidence from the DOM and window globals.
      const overlay = [];
      const html = document.documentElement.outerHTML.slice(0, 2_000_000).toLowerCase();
      const scripts = [...document.querySelectorAll("script[src]")].map((s) => s.src.toLowerCase());
      for (const v of vendors) {
        const ev = [];
        for (const d of v.dom) {
          const lo = d.toLowerCase();
          if (document.getElementById(d) || document.querySelector(`[id*="${lo}" i], [class*="${lo}" i], [data-${lo.replace(/[^a-z0-9-]/g, "")}]`)) { ev.push(`dom:${d}`); break; }
        }
        for (const gname of v.globals) if (typeof window[gname] !== "undefined") { ev.push(`global:${gname}`); break; }
        if (scripts.some((s) => new RegExp(v.net, "i").test(s))) ev.push("script");
        else if (new RegExp(v.net, "i").test(html)) ev.push("inline");
        if (v.name === "CookieYes accessibility" && document.querySelector("[data-cya11y-org-font-size]")) ev.push("dom:data-cya11y");
        if (ev.length) overlay.push({ vendor: v.name, evidence: ev });
      }
      const gen = document.querySelector('meta[name="generator" i]')?.getAttribute("content") || "";
      const cms = [];
      if (/civicplus|civicengage/.test(html) || /\/archive\.aspx|\/documentcenter\//.test(html)) cms.push("CivicPlus");
      if (/granicus|govdelivery/.test(html)) cms.push("Granicus (any product)");
      if (/opencities/.test(html)) cms.push("OpenCities");
      if (/visioninternet|vision cms|\/vertical\/sites\//.test(html)) cms.push("Vision");
      if (/revize/.test(html)) cms.push("Revize");
      if (/drupal/.test(gen.toLowerCase()) || /drupal-settings-json|\/sites\/default\/files\//.test(html)) cms.push("Drupal");
      if (/wordpress/.test(gen.toLowerCase()) || /\/wp-content\//.test(html)) cms.push("WordPress");
      if (/sitecore/.test(html)) cms.push("Sitecore");
      if (/\/_layouts\/|sharepoint/.test(html)) cms.push("SharePoint");
      if (/municode|\bcivicclerk\b/.test(html)) cms.push("Municode/CivicClerk (linked)");
      if (/govstack|granicus-govaccess|govaccess/.test(html)) cms.push("govAccess");
      return { links, pdfs, overlay, generator: gen.slice(0, 120), cms };
    }, vendors.map((v) => ({ ...v, net: v.net.source })))
    .catch((e) => ({ error: String(e.message).slice(0, 120), links: [], pdfs: [], overlay: [], cms: [] }));
}

/** Rank a home-page accessibility link as a statement candidate, from its URL and link text. */
function linkRank(url, text) {
  let s = statementScore("", url);
  const t = (text || "").trim().toLowerCase();
  if (/^(web ?site |digital |online )?accessibility( statement| policy| notice)?$/.test(t)) s += 6;
  else if (/accessibility (statement|policy|notice)|^ada$|ada (notice|compliance|statement|information)|section 508/.test(t)) s += 4;
  if (/report|request|complaint form|grievance|sidewalk|parking|transit|paratransit|ramp|road|traffic|voting|polling|ballot/.test(t + " " + url.toLowerCase())) s -= 3;
  return s;
}

function statementScore(text, url) {
  const t = text.toLowerCase();
  let s = 0;
  if (/accessibility (statement|policy|notice|commitment)|statement (on|of) (web(site)? |digital )?accessibility|web(site)? accessibility/.test(t)) s += 4;
  if (/wcag|web content accessibility guidelines/.test(t)) s += 2;
  if (/americans with disabilities act|\bada\b|section 508|title ii\b|rehabilitation act/.test(t)) s += 2;
  if (/level aa|\baa\b|conform/.test(t)) s += 1;
  if (/(feedback|report .{0,40}(problem|barrier|issue|difficult)|contact|coordinator)/.test(t)) s += 1;
  if (/(last (reviewed|updated|revised)|updated on|effective date|date of)/.test(t)) s += 1;
  if (t.length > 1200) s += 1;
  let p = "";
  try { p = new URL(url).pathname.toLowerCase(); } catch {}
  if (/accessib|\/ada\b|\/ada[-_/.]|508/.test(p)) s += 5;
  if (/(statement|policy)/.test(p) && /accessib/.test(p)) s += 2;
  if (/^\/(blog|news|articles|press|media|stories|calendar|events|agendas?|minutes)\//.test(p)) s -= 8;
  return s;
}

async function statementFacts(page) {
  return page
    .evaluate(() => {
      const text = (document.body?.innerText || "").replace(/\s+/g, " ").trim();
      const lo = text.toLowerCase();
      const versions = [...new Set([...lo.matchAll(/wcag\)?\s*(?:version\s*)?(2\.[0-2]|2(?![.\d])|3\.0)/g)].map((m) => (m[1] === "2" ? "2.x" : m[1])))];
      const wcagNamed = /wcag|web content accessibility guidelines/.test(lo);
      const wcgVersionsLong = [...new Set([...lo.matchAll(/web content accessibility guidelines\s*(?:\(wcag\)\s*)?(?:version\s*)?(2\.[0-2])/g)].map((m) => m[1]))];
      const levelAA = /level\s*aa\b|\baa\s*(level|standard|conformance|success criteria)|wcag\s*2\.[0-2]\s*(level\s*)?aa\b|\b2\.[0-2]\s*aa\b/.test(lo);
      const ada = /americans with disabilities act|\bada\b/.test(lo);
      const titleII = /title ii\b|28 cfr|part 35\b/.test(lo);
      const s508 = /section 508/.test(lo);
      const mailtos = [...document.querySelectorAll('a[href^="mailto:"]')].length;
      const tels = [...document.querySelectorAll('a[href^="tel:"]')].length;
      const forms = document.querySelectorAll("form textarea, form input[type=email]").length;
      const contactNear = /accessib.{0,300}(e-?mail|phone|call|contact|form|@)|(e-?mail|phone|call|contact).{0,300}accessib/.test(lo);
      const dates = [...lo.matchAll(/(?:last (?:reviewed|updated|revised|modified)|updated(?: on)?|effective(?: date)?|posted|date)[:\s]*([a-z]+\.? \d{1,2},? \d{4}|\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}|[a-z]+ \d{4})/g)].map((m) => m[1]).slice(0, 3);
      return {
        textLength: text.length,
        text: text.slice(0, 20000),
        wcagNamed,
        wcagVersions: [...new Set([...versions, ...wcgVersionsLong])],
        levelAA,
        ada,
        titleII,
        section508: s508,
        mailtos,
        tels,
        forms,
        contactNear,
        dates,
      };
    })
    .catch((e) => ({ error: String(e.message).slice(0, 120) }));
}

// ------------------------------------------------------------------ entity
async function scanEntity(browser, ent, ua) {
  const rec = {
    entity_id: ent.entity_id,
    url: ent.final_url || ent.url,
    scanner: SCANNER_VERSION,
    mode: flag("headful") ? "headful" : "headless",
    axeVersionPackage: AXE_PKG,
    axeTags: AXE_TAGS,
    userAgent: ua,
    startedAt: new Date().toISOString(),
    pages: [],
  };
  const t0 = Date.now();
  const page = await browser.newPage();
  await page.setUserAgent(ua);
  await page.setViewport({ width: 1280, height: 900 });
  await page.setBypassServiceWorker(true);
  page.setDefaultTimeout(20000);
  const net = new Set();
  page.on("request", (r) => {
    const u = r.url();
    for (const v of OVERLAY_VENDORS) if (v.net.test(u)) net.add(v.name);
  });
  page.on("dialog", (d) => d.dismiss().catch(() => {}));

  const visit = async (url, role, { axe = true, statement = false } = {}) => {
    const p = { role, url };
    if (!(await robotsAllowed(url, ua).catch(() => true))) {
      p.outcome = "robots-disallowed";
      rec.pages.push(p);
      return p;
    }
    await domainGate(url);
    try { p.net = await netGate(new URL(url).hostname, NET_GAP_MS); } catch {}
    net.clear();
    // Secondary pages send the home page as Referer, as following a link would.
    Object.assign(p, await load(page, url, role === "home" ? { retry: true, timeout: NAV_TIMEOUT } : { timeout: SUB_NAV_TIMEOUT, referer: rec.pages[0]?.finalUrl }));
    if (p.outcome === "ok" || (statement && p.outcome === "render-invalid")) {
      if (axe && p.outcome === "ok") p.axe = await runAxe(page);
      const dom = await domFacts(page, OVERLAY_VENDORS);
      p.pdfLinks = dom.pdfs.length;
      p.pdfSample = dom.pdfs.slice(0, 10);
      p.overlay = mergeOverlay(dom.overlay, [...net]);
      p.cms = dom.cms;
      p.generator = dom.generator;
      p._links = dom.links;
      if (statement) {
        const sf = await statementFacts(page);
        p.statementScore = statementScore(sf.text ?? "", p.finalUrl);
        delete sf.text;
        p.statement = sf;
      }
    }
    const fh = safeHost(p.finalUrl);
    p.offDomain = !!(fh && fh !== safeHost(rec.url));
    rec.pages.push(p);
    return p;
  };

  try {
    const home = await visit(rec.url, "home");
    rec.homeOutcome = home.outcome;
    rec.measurable = home.outcome === "ok";
    if (home.outcome === "ok" || home.outcome === "render-invalid") {
      const links = home._links ?? [];
      const homeHost = safeHost(home.finalUrl);
      // Accessibility links on the home page (text or href), ranked like the statement checker.
      const a11y = dedupe(links.filter((l) => A11Y_TEXT.test(l.text) || /accessib|\/ada([-_/.]|$)|section-?508/i.test(l.href)).filter((l) => !/\.pdf($|[?#])/i.test(l.href)).map((l) => l.href.split("#")[0]));
      rec.a11yLinks = a11y.slice(0, 8);
      const textOf = (u) => links.filter((l) => l.href.split("#")[0] === u).map((l) => l.text).join(" ");
      const ranked = a11y.map((u) => ({ u, s: linkRank(u, textOf(u)) })).sort((a, b) => b.s - a.s).map((x) => x.u);
      // Two candidate loads: the best-ranked link, then the second link only if it also looks like a
      // statement link (rank >= 6), otherwise /accessibility. No links at all: /accessibility, /ada.
      const rankOf = new Map(a11y.map((u) => [u, linkRank(u, textOf(u))]));
      let stmtTargets = ranked.slice(0, 1);
      if (ranked[1] && rankOf.get(ranked[1]) >= 6) stmtTargets.push(ranked[1]);
      rec.statementSearch = stmtTargets.length ? "home-links" : "fixed-paths";
      for (const p of STATEMENT_PATHS) {
        if (stmtTargets.length >= 2) break;
        const u = new URL(p, home.finalUrl).href;
        if (!stmtTargets.some((t) => t.replace(/\/+$/, "").toLowerCase() === u.replace(/\/+$/, "").toLowerCase())) stmtTargets.push(u);
      }
      // Resident-service and contact pages.
      const service = links.find((l) => SERVICE_TEXT.test(l.text) && l.text.length <= 60 && !/\.pdf($|[?#])|^mailto:|^tel:/i.test(l.href) && l.href.split("#")[0] !== home.finalUrl.split("#")[0]);
      const contact = links.find((l) => (CONTACT_TEXT.test(l.text) || /\/contact(-us)?\/?$/i.test(new URL(l.href).pathname)) && !/^mailto:/i.test(l.href) && l.href.split("#")[0].replace(/\/+$/, "") !== home.finalUrl.split("#")[0].replace(/\/+$/, ""));
      rec.serviceLink = service ? { href: service.href, text: service.text, offDomain: safeHost(service.href) !== homeHost } : null;
      rec.contactLink = contact ? { href: contact.href, text: contact.text, offDomain: safeHost(contact.href) !== homeHost } : null;
      // Home page feedback route: accessibility-specific mailto/tel.
      rec.homeA11yMailto = links.some((l) => /^mailto:/i.test(l.href) && /accessib|ada/i.test(l.href + l.text));

      for (const u of stmtTargets) {
        await sleep(PAGE_GAP_MS);
        await visit(u, "statement-candidate", { axe: false, statement: true });
      }
      if (service) { await sleep(PAGE_GAP_MS); await visit(service.href, "service"); }
      if (contact && contact.href.split("#")[0] !== service?.href.split("#")[0]) { await sleep(PAGE_GAP_MS); await visit(contact.href, "contact"); }

      const stmtPages = rec.pages.filter((p) => p.role === "statement-candidate");
      const cands = stmtPages.filter((p) => p.statementScore !== undefined && p.outcome !== "http-error");
      const best = cands.sort((a, b) => b.statementScore - a.statementScore)[0];
      // "not-measurable" when no candidate scored as a statement and at least one candidate could
      // not be read (bot wall, timeout, error page). Never report those as "no statement".
      const unreadable = stmtPages.some((p) => !["ok", "render-invalid", "http-error", "robots-disallowed"].includes(p.outcome));
      const found = !!best && best.statementScore >= 8;
      rec.statement = {
        status: found ? "found" : unreadable ? "not-measurable" : "not-found",
        found,
        candidates: stmtPages.length,
        ...(best
          ? { url: best.finalUrl, score: best.statementScore, confidence: best.statementScore >= 12 ? "high" : best.statementScore >= 8 ? "medium" : "low", ...best.statement }
          : { confidence: "none" }),
      };
      const svc = rec.pages.find((p) => p.role === "service");
      if (rec.serviceLink) rec.serviceLink.outcome = svc?.outcome ?? "not-visited";
      const con = rec.pages.find((p) => p.role === "contact");
      if (rec.contactLink) rec.contactLink.outcome = con?.outcome ?? "not-visited";
      rec.secondaryBlocked = rec.pages.some((p) => p.role !== "home" && p.outcome === "botwall");
    }
  } catch (e) {
    rec.error = String(e.message).split("\n")[0].slice(0, 200);
    rec.homeOutcome ??= "scanner-error";
  } finally {
    await page.close().catch(() => {});
  }
  for (const p of rec.pages) delete p._links;
  rec.overlayVendors = [...new Set(rec.pages.flatMap((p) => (p.overlay ?? []).filter((o) => o.strong).map((o) => o.vendor)))];
  rec.pageLoads = rec.pages.filter((p) => p.outcome !== "robots-disallowed").length;
  rec.finishedAt = new Date().toISOString();
  rec.ms = Date.now() - t0;
  return rec;
}

function mergeOverlay(domHits, netHits) {
  const m = new Map(domHits.map((o) => [o.vendor, new Set(o.evidence)]));
  for (const n of netHits) (m.get(n) ?? m.set(n, new Set()).get(n)).add("network");
  // "inline" alone (the vendor name somewhere in the HTML, e.g. a statement saying it does not use
  // overlays) is weak evidence and does not count as a detected overlay.
  return [...m].map(([vendor, ev]) => ({ vendor, evidence: [...ev], strong: [...ev].some((e) => e !== "inline") }));
}
const safeHost = (u) => { try { return regDomain(new URL(u).hostname); } catch { return null; } };
const dedupe = (a) => [...new Set(a)];

// ------------------------------------------------------------------ runner
const urls = (await readCsv(path.join(DATA, arg("urls", "urls.csv")))).filter((r) => r.url);
let todo = urls;
const idsFile = arg("ids");
if (idsFile) {
  const p = path.isAbsolute(idsFile) ? idsFile : path.join(DATA, idsFile);
  const want = new Set((await fs.readFile(p, "utf8")).split(/\r?\n/).map((l) => l.split(",")[0].trim()).filter((x) => x && x !== "entity_id"));
  todo = urls.filter((r) => want.has(r.entity_id));
}
await fs.mkdir(path.dirname(OUT), { recursive: true });
const done = await readJsonl(OUT);
const latest = new Map(done.map((d) => [d.entity_id, d]));
todo = todo.filter((r) => {
  const d = latest.get(r.entity_id);
  if (!d) return true;
  return flag("retry-failed") && !d.measurable;
});
if (LIMIT) todo = todo.slice(0, LIMIT);
console.error(`${latest.size} already in ${path.relative(DATA, OUT)}, ${todo.length} to scan, concurrency ${CONCURRENCY}, axe ${AXE_PKG}`);

const launch = () =>
  puppeteer.launch({
    // --headful: the design's retry pass for bot walls and timeouts (a visible Chrome window, same
    // UA, no stealth). Windows open off-screen.
    headless: !flag("headful"),
    executablePath: CHROME,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--force-color-profile=srgb", "--hide-scrollbars", ...(flag("headful") ? ["--window-position=-3000,0", "--window-size=1280,900"] : [])],
  });

const queue = [...todo];
let n = 0;
async function worker(id) {
  let browser = await launch();
  const version = (await browser.version()).replace(/^.*\//, "");
  const ua = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version.split(".")[0]}.0.0.0 Safari/537.36`;
  let since = 0;
  while (queue.length) {
    const ent = queue.shift();
    let r;
    try {
      r = await Promise.race([scanEntity(browser, ent, ua), sleep(300000).then(() => { throw new Error("entity timeout 300s"); })]);
    } catch (e) {
      r = { entity_id: ent.entity_id, url: ent.final_url || ent.url, homeOutcome: "scanner-error", measurable: false, error: String(e.message).slice(0, 200), finishedAt: new Date().toISOString() };
      try { await browser.close(); } catch {}
      browser = await launch();
      since = 0;
    }
    r.chromeVersion = version;
    await fs.appendFile(OUT, JSON.stringify(r) + "\n");
    n++;
    console.error(`[${n}/${todo.length}] w${id} ${ent.entity_id} ${ent.name} :: ${r.homeOutcome}${r.statement?.found ? " stmt" : ""}${r.overlayVendors?.length ? " overlay" : ""} ${((r.ms ?? 0) / 1000).toFixed(1)}s loads=${r.pageLoads ?? "?"}`);
    if (++since >= 12) {
      try { await browser.close(); } catch {}
      browser = await launch();
      since = 0;
    }
    await sleep(PAGE_GAP_MS);
  }
  try { await browser.close(); } catch {}
}
const started = Date.now();
await Promise.all(Array.from({ length: Math.max(1, Math.min(CONCURRENCY, todo.length)) }, (_, i) => worker(i + 1)));
console.error(`finished ${n} entities in ${((Date.now() - started) / 1000).toFixed(0)} s`);
