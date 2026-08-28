import { NextRequest, NextResponse } from "next/server"
import {
  analyseStatement,
  scoreChecks,
  REGIMES,
  type StatementRegime,
  type StatementCheck,
  type StatementScore,
} from "@/lib/accessibility-statement-rules"
import {
  fetchWithTimeout,
  isBlockedHostname,
  normalizeInputUrl,
} from "@/lib/url-safety"

export const runtime = "nodejs"
export const maxDuration = 60

const FETCH_TIMEOUT_MS = 12_000
const MAX_HTML_BYTES = 2_000_000
const MAX_CANDIDATES = 8
const UA = "Mozilla/5.0 (compatible; accessibility.build statement checker; +https://accessibility.build/tools/accessibility-statement-checker)"

/**
 * Paths worth trying when a site does not link its statement from the homepage.
 * This list alone is not enough, which is the whole point of followLinks below:
 * plenty of real statements live at paths no fixed list would guess.
 */
const COMMON_PATHS = [
  "/accessibility",
  "/accessibility-statement",
  "/accessibility-policy",
  "/pages/accessibility",
  "/pages/accessibility-statement",
  "/help/accessibility",
  "/about/accessibility",
  "/legal/accessibility",
  "/en/accessibility",
  "/accessibility.html",
]

const LINK_TEXT_RE = /accessib|toegankelijk|barrierefrei|accessibilit|tillg[aä]nglig|saavutettav|dost[eę]pno/i

interface Candidate {
  url: string
  source: "provided" | "footer-link" | "common-path"
}

function stripToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&#x27;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Collect links whose href OR visible text looks like an accessibility page.
 *
 * Matching on the link TEXT as well as the href is the part that matters. A
 * statement linked as <a href="/site-info/1234">Accessibility</a> is invisible
 * to any check that only pattern-matches the URL, and that shape is common on
 * CMS-driven sites.
 */
function followLinks(html: string, baseUrl: string): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  const anchorRe = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi

  for (const m of html.matchAll(anchorRe)) {
    const href = m[1]
    const text = stripToText(m[2])
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript):/i.test(href)) continue
    if (!LINK_TEXT_RE.test(href) && !LINK_TEXT_RE.test(text)) continue

    try {
      const resolved = new URL(href, baseUrl)
      if (resolved.protocol !== "http:" && resolved.protocol !== "https:") continue
      resolved.hash = ""
      const key = resolved.toString()
      if (seen.has(key)) continue
      seen.add(key)
      out.push(key)
    } catch {
      // Unparseable href, skip it.
    }
  }
  return out
}

async function fetchPage(url: string): Promise<{ ok: boolean; status: number; html: string; finalUrl: string }> {
  try {
    const res = await fetchWithTimeout(url, FETCH_TIMEOUT_MS, {
      redirect: "follow",
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
    })
    const type = res.headers.get("content-type") || ""
    if (!res.ok || !/text\/html|application\/xhtml/i.test(type)) {
      return { ok: false, status: res.status, html: "", finalUrl: res.url || url }
    }
    const buf = await res.arrayBuffer()
    const html = new TextDecoder("utf-8").decode(buf.slice(0, MAX_HTML_BYTES))
    return { ok: true, status: res.status, html, finalUrl: res.url || url }
  } catch {
    return { ok: false, status: 0, html: "", finalUrl: url }
  }
}

/**
 * How strongly a page reads as an actual accessibility statement, rather than a
 * help article that happens to mention the word.
 */
function statementScore(text: string, url: string): number {
  const t = text.toLowerCase()
  let score = 0
  if (/accessibility statement/.test(t)) score += 4
  if (/(fully|partially|not) compliant|non-compliant/.test(t)) score += 3
  if (/wcag|en\s*301\s*549/.test(t)) score += 2
  if (/(enforcement|ombudsman|equality advisory|ehrc|ecni)/.test(t)) score += 2
  if (/(feedback|report .{0,20}problem|contact us)/.test(t)) score += 1
  if (/(prepared on|last reviewed|last updated)/.test(t)) score += 1
  if (t.length > 1200) score += 1

  // The URL matters as much as the prose. Without this, an article ABOUT
  // accessibility law outscores the site's actual statement, because it uses
  // all the same vocabulary at greater length.
  let path = ""
  try {
    path = new URL(url).pathname.toLowerCase()
  } catch {
    path = ""
  }
  if (/accessib/.test(path)) score += 5
  if (/(statement|policy)/.test(path) && /accessib/.test(path)) score += 2
  // Editorial sections are documentation about accessibility, not a statement.
  if (/^\/(blog|research|guides|news|articles|insights|resources|learn)\//.test(path)) score -= 8

  return score
}

export interface StatementCheckerResponse {
  input: string
  regime: StatementRegime
  regimeLabel: string
  statementUrl: string | null
  discoveredVia: Candidate["source"] | null
  /** How strongly the page found reads as a formal statement rather than a hub page. */
  confidence: "high" | "medium" | "low" | null
  checkedPages: { url: string; status: number; score: number }[]
  wordCount: number
  checks: StatementCheck[]
  score: StatementScore | null
  message: string
}

export async function POST(request: NextRequest) {
  let body: { url?: string; regime?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Send a JSON body with a url." }, { status: 400 })
  }

  const parsed = normalizeInputUrl(body.url || "")
  if (!parsed) {
    return NextResponse.json({ error: "Enter a valid http or https URL." }, { status: 400 })
  }
  if (isBlockedHostname(parsed.hostname)) {
    return NextResponse.json(
      { error: "Local, private, and loopback hosts are not allowed." },
      { status: 400 }
    )
  }

  const regime: StatementRegime =
    body.regime === "eu-wad" || body.regime === "eaa" || body.regime === "uk-psbar"
      ? body.regime
      : "uk-psbar"

  const origin = parsed.origin
  const checkedPages: StatementCheckerResponse["checkedPages"] = []

  // 1. Whatever the user gave us.
  const first = await fetchPage(parsed.toString())
  if (!first.ok) {
    return NextResponse.json(
      {
        error: `Could not load ${parsed.toString()} (HTTP ${first.status || "no response"}). The site may block automated requests.`,
      },
      { status: 502 }
    )
  }

  const candidates: Candidate[] = [{ url: first.finalUrl, source: "provided" }]

  // 2. Links that look like an accessibility page, by href or by link text.
  for (const link of followLinks(first.html, first.finalUrl)) {
    if (candidates.length >= MAX_CANDIDATES) break
    if (!candidates.some((c) => c.url === link)) {
      try {
        if (!isBlockedHostname(new URL(link).hostname)) {
          candidates.push({ url: link, source: "footer-link" })
        }
      } catch {
        // ignore
      }
    }
  }

  // 3. Conventional paths, as a fallback only.
  for (const path of COMMON_PATHS) {
    if (candidates.length >= MAX_CANDIDATES) break
    const url = origin + path
    if (!candidates.some((c) => c.url === url)) candidates.push({ url, source: "common-path" })
  }

  let best: { url: string; text: string; html: string; score: number; source: Candidate["source"] } | null = null

  for (const candidate of candidates) {
    const page = candidate.url === first.finalUrl ? first : await fetchPage(candidate.url)
    if (!page.ok) {
      checkedPages.push({ url: candidate.url, status: page.status, score: 0 })
      continue
    }
    const text = stripToText(page.html)
    const s = statementScore(text, page.finalUrl)
    checkedPages.push({ url: page.finalUrl, status: page.status, score: s })
    if (!best || s > best.score) {
      best = { url: page.finalUrl, text, html: page.html, score: s, source: candidate.source }
    }
  }

  // A page needs to look meaningfully like a statement before we grade it.
  if (!best || best.score < 4) {
    return NextResponse.json({
      input: parsed.toString(),
      regime,
      regimeLabel: REGIMES[regime].label,
      statementUrl: null,
      discoveredVia: null,
      confidence: null,
      checkedPages,
      wordCount: 0,
      checks: [],
      score: null,
      message:
        "No accessibility statement was found. Pages linked from the site and the usual paths were checked. Under the regulations, publishing a statement is itself mandatory, so this is a finding rather than an inconclusive result.",
    } satisfies StatementCheckerResponse)
  }

  const checks = analyseStatement({ text: best.text, html: best.html, regime })
  const score = scoreChecks(checks)

  // Say how sure we are that this page is the statement. A short accessibility
  // hub page can clear the discovery threshold, and grading one as a statement
  // would report a failure the organisation does not actually have.
  const confidence: "high" | "medium" | "low" =
    best.score >= 12 ? "high" : best.score >= 8 ? "medium" : "low"

  return NextResponse.json({
    input: parsed.toString(),
    regime,
    regimeLabel: REGIMES[regime].label,
    statementUrl: best.url,
    discoveredVia: best.source,
    confidence,
    checkedPages,
    wordCount: best.text.split(/\s+/).filter(Boolean).length,
    checks,
    score,
    message:
      confidence === "low"
        ? "The page found reads more like an accessibility hub or help page than a formal statement, so treat this result as a prompt to check manually rather than a verdict."
        : score.verdict === "compliant"
        ? "Every mandatory element was found. Check the wording against your own testing before relying on it."
        : score.verdict === "missing-information"
          ? "A statement is published but mandatory information is missing. This is the most common failure pattern in public sector monitoring."
          : "A statement was found but most mandatory elements are missing.",
  } satisfies StatementCheckerResponse)
}
