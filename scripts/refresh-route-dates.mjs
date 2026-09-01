#!/usr/bin/env node
// Compares each route's hand-maintained lastModified in lib/site-routes.ts with
// the date of the last commit that touched the route's page file, and
// optionally rewrites the stale ones.
//
//   node scripts/refresh-route-dates.mjs          # report only
//   node scripts/refresh-route-dates.mjs --apply  # rewrite lib/site-routes.ts
//
// Why not derive dates from git at build time: Vercel builds from a shallow
// clone, so `git log` there would stamp every old page with the clone boundary
// date, which is exactly the "always fresh" lastmod that search engines learn
// to ignore. Run this locally when content changes, and commit the result.
//
// Commits that touched many pages mechanically (title trims, schema fixes,
// lint) are ignored so a site-wide cleanup does not masquerade as a content
// update on 250 pages. Add a hash here when you make another such commit.
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const MECHANICAL_COMMITS = new Set([
  "59edd48", // Fix Bing SEO findings: over-long titles and two missing h1s
  "1473264", "1d8e5a3", "0740826", // 2026-07-30 SEO fix pass
  "fb42e65", // FAQ schema, WCAG counts, www canonicalisation
  "25c57ba", // Remove drifted duplicate Organization/WebSite JSON-LD emitters
  "ae8a64f", // robots CSS/JS allow
  "3078f56", // www redirect note
  "59ba16c", // Complete site-wide SEO overhaul (touched ~260 pages)
  "ea6230e", // Establish founder-led trust and legal identity (site-wide bands)
  "dc88091", // Build authority proof and procurement experience (site-wide)
  "7088a13", // Blog ISR revalidation tweak
  "101dfad", // Refresh tools suite chrome (tool-suite bar on every tool)
  "000ff2b", // Re-template old WCAG pages (structure, not content)
])

const apply = process.argv.includes("--apply")
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const routesFile = path.join(root, "lib/site-routes.ts")
let src = fs.readFileSync(routesFile, "utf8")

function pageFile(route) {
  const dir = path.join(root, "app", route === "" ? "" : route.slice(1))
  for (const name of ["page.tsx", "page.ts", "page.mdx"]) {
    const p = path.join(dir, name)
    if (fs.existsSync(p)) return p
  }
  return null
}

function lastSubstantiveCommit(file) {
  const out = execSync(`git log --format='%h|%cs|%s' -- "${file}"`, { cwd: root, encoding: "utf8" }).trim()
  if (!out) return null
  for (const line of out.split("\n")) {
    const [hash, date, ...rest] = line.split("|")
    if (![...MECHANICAL_COMMITS].some((m) => hash.startsWith(m))) return { hash, date, subject: rest.join("|") }
  }
  return null
}

const entryRe = /\{ route: "([^"]*)", label: "[^"]*", group: "[^"]*", lastModified: "(\d{4}-\d{2}-\d{2})"/g
const rows = []
let updated = 0
src = src.replace(entryRe, (whole, route, current) => {
  const file = pageFile(route)
  if (!file) return whole
  const last = lastSubstantiveCommit(file)
  if (!last) return whole
  if (last.date > current) {
    rows.push([route || "/", current, last.date, last.hash, last.subject.slice(0, 60)])
    if (apply) {
      updated++
      return whole.replace(`lastModified: "${current}"`, `lastModified: "${last.date}"`)
    }
  }
  return whole
})

rows.sort((a, b) => (a[2] < b[2] ? 1 : -1))
for (const r of rows) console.log(r.join("  "))
console.log(`\n${rows.length} route(s) behind git${apply ? `, ${updated} updated` : " (run with --apply to update)"}`)
if (apply) fs.writeFileSync(routesFile, src)
