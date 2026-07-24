/**
 * Audits every JSON-LD block in the prerendered output for the structured-data
 * problems Google Search Console reports. Run after `npm run build`:
 *
 *   npm run seo:audit-jsonld
 *
 * Checks:
 *  - HowToStep/Direction/Tip missing text|image|video (invalid for rich results)
 *  - author objects missing url (flagged as "improve item appearance")
 *  - aggregateRating anywhere (we must never ship ratings that are not backed
 *    by real, page-visible reviews - see the doc comment in
 *    components/seo/structured-data.tsx)
 *
 * Exits non-zero when anything is found, so it can gate a build if wanted.
 * Note: grepping the raw HTML is not sufficient - Next escapes the payload.
 */
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const ROOT = ".next/server/app"
const files = []
;(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p)
    else if (p.endsWith(".html")) files.push(p)
  }
})(ROOT)

const stepIssues = []
const authorIssues = []
const ratingIssues = []
const typeCount = {}

function visit(node, file, path) {
  if (Array.isArray(node)) return node.forEach((n, i) => visit(n, file, `${path}[${i}]`))
  if (!node || typeof node !== "object") return

  const type = node["@type"]
  if (typeof type === "string") typeCount[type] = (typeCount[type] || 0) + 1

  // Google: HowToStep needs text (or image/video)
  if (type === "HowToStep" || type === "HowToDirection" || type === "HowToTip") {
    if (!node.text && !node.image && !node.video) {
      stepIssues.push({ file, path, type, keys: Object.keys(node).join(",") })
    }
  }

  // Google recommends author.url on Article-family types
  if (node.author) {
    const authors = Array.isArray(node.author) ? node.author : [node.author]
    authors.forEach((a) => {
      if (a && typeof a === "object" && !a.url) {
        authorIssues.push({ file, path, parentType: type, authorName: a.name, authorType: a["@type"] })
      }
    })
  }

  // Ratings must never be shipped unless real AND visible on the page.
  if (node.aggregateRating || type === "AggregateRating" || type === "Review") {
    ratingIssues.push({ file, path, type: type || "aggregateRating" })
  }

  for (const [k, v] of Object.entries(node)) {
    if (k !== "@type") visit(v, file, `${path}.${k}`)
  }
}

for (const file of files) {
  const html = readFileSync(file, "utf8")
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
  let m, idx = 0
  while ((m = re.exec(html))) {
    let raw = m[1]
    // Next.js escapes < in JSON-LD payloads
    raw = raw.replace(/\\u003c/gi, "<").replace(/\\u003e/gi, ">").replace(/\\u0026/gi, "&")
    try {
      visit(JSON.parse(raw), file, `ld[${idx}]`)
    } catch {
      /* ignore unparseable */
    }
    idx++
  }
}

console.log(`Scanned ${files.length} prerendered HTML files\n`)
console.log(`=== HowToStep/Direction/Tip missing text|image|video: ${stepIssues.length} ===`)
for (const s of stepIssues) console.log(`  ${s.file}\n    ${s.path} (${s.type}) keys=[${s.keys}]`)
console.log(`\n=== author objects missing url: ${authorIssues.length} ===`)
const byFile = {}
for (const a of authorIssues) (byFile[a.file] ||= []).push(a)
for (const [f, list] of Object.entries(byFile)) {
  console.log(`  ${f}`)
  for (const a of list) console.log(`    ${a.path} parent=${a.parentType} author=${a.authorType}/${a.authorName}`)
}

console.log(`\n=== rating/review nodes (must be real AND page-visible): ${ratingIssues.length} ===`)
for (const r of ratingIssues) console.log(`  ${r.file}\n    ${r.path} (${r.type})`)

const total = stepIssues.length + authorIssues.length + ratingIssues.length
console.log(`\n${total === 0 ? "PASS - no structured-data issues found" : `FAIL - ${total} issue(s)`}`)
process.exit(total === 0 ? 0 : 1)
