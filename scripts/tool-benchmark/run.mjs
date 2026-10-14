// Runner for /research/accessibility-testing-tools-benchmark.
//
// The tools are deliberately NOT project dependencies. Run from a scratch directory:
//   npm init -y
//   npm install --engine-strict=false axe-core@4.14.0 @axe-core/puppeteer@4.13.0 puppeteer \
//     lighthouse@13.5.0 pa11y@10.0.0 accessibility-checker@4.0.34
//   cp <repo>/scripts/tool-benchmark/{run.mjs,.achecker.yml} .
//   (cd <repo>/public/benchmarks && python3 -m http.server 8765) &
//   node run.mjs http://localhost:8765/tool-benchmark-fixture-2026-09.html
// Writes out-{axe,lighthouse,htmlcs,ibm,env}.json. Map each finding to the fixture's F01-F30
// comments by element: right element and right reason = found; review/incomplete/potential
// only = review; right element, wrong reason = wrong. Last run: 2026-10-14, Chrome 155.
import fs from "node:fs"
import { createRequire } from "node:module"
import puppeteer from "puppeteer"
import { AxePuppeteer } from "@axe-core/puppeteer"
import lighthouse from "lighthouse"
import pa11y from "pa11y"

const require = createRequire(import.meta.url)
const url = process.argv[2]
const out = (name, data) => fs.writeFileSync(`out-${name}.json`, JSON.stringify(data, null, 2))

const browser = await puppeteer.launch({ headless: true, args: ["--remote-debugging-port=9333"] })
const chromeVersion = await browser.version()

// 1. axe-core 4.14.0 via @axe-core/puppeteer, WCAG 2.2 AA tags plus best-practice for the noise count
{
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: "load" })
  const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8")
  const res = await new AxePuppeteer(page, axeSource).analyze()
  out("axe", {
    version: res.testEngine.version,
    violations: res.violations.map((v) => ({ id: v.id, tags: v.tags, nodes: v.nodes.map((n) => n.html) })),
    incomplete: res.incomplete.map((v) => ({ id: v.id, tags: v.tags, nodes: v.nodes.map((n) => n.html) })),
  })
  await page.close()
}

// 2. Lighthouse 13.5.0, accessibility category only
{
  const r = await lighthouse(url, { port: 9333, onlyCategories: ["accessibility"], output: "json", logLevel: "error" })
  const lhr = r.lhr
  const failed = Object.values(lhr.audits)
    .filter((a) => a.score === 0 && a.scoreDisplayMode === "binary")
    .map((a) => ({ id: a.id, nodes: (a.details?.items ?? []).map((i) => i.node?.snippet) }))
  out("lighthouse", { version: lhr.lighthouseVersion, axe: lhr.environment?.credits?.["axe-core"], score: Math.round(lhr.categories.accessibility.score * 100), failed })
}

// 3. HTML_CodeSniffer via Pa11y 10.0.0, WCAG2AA
{
  const r = await pa11y(url, { standard: "WCAG2AA", runners: ["htmlcs"], includeWarnings: false, includeNotices: false, browser })
  out("htmlcs", { issues: r.issues.map((i) => ({ code: i.code, type: i.type, context: i.context, message: i.message })) })
}

await browser.close()

// 4. IBM Equal Access, accessibility-checker 4.0.34, WCAG_2_2 policy
{
  const aChecker = require("accessibility-checker")
  const res = await aChecker.getCompliance(url, "benchmark")
  const results = res.report.results ?? []
  const pick = (lvl) => results.filter((x) => x.level === lvl).map((x) => ({ ruleId: x.ruleId, snippet: x.snippet, message: x.message }))
  out("ibm", { violations: pick("violation"), potential: pick("potentialviolation") })
  await aChecker.close()
}

fs.writeFileSync("out-env.json", JSON.stringify({ chromeVersion, date: new Date().toISOString() }, null, 2))
console.log("done", chromeVersion)
