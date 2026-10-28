import "server-only"
import fs from "node:fs"
import path from "node:path"

// Keyword search over lib/assistant/site-index.json (built by scripts/assistant/build-index.mjs).
//
// BM25 with field weights: a match in the page title counts three times, in the section
// heading twice, in the body once. WCAG numbers survive tokenising ("1.4.3", and the
// "/wcag/1-4-3" path form maps to the same token), so "what is 1.4.3" finds the criterion page.
// The index is read once per server instance and kept in memory.

interface IndexPage {
  path: string
  title: string
  description: string
}

interface IndexChunk {
  page: number
  heading: string
  text: string
}

interface SiteIndex {
  generatedAt: string
  pages: IndexPage[]
  chunks: IndexChunk[]
}

export interface SearchHit {
  path: string
  title: string
  heading: string
  text: string
  score: number
}

const STOPWORDS = new Set(
  (
    "a an and are as at be but by can could do does did for from has have how i if in into is it its " +
    "me my of on or our so than that the their them then there these they this to us was we were what " +
    "when where which while who why will with would you your yours about any all also just more most " +
    "should shall may might must not no yes please tell explain need want know give show get make use"
  ).split(" "),
)

const TITLE_WEIGHT = 3
const HEADING_WEIGHT = 2
const K1 = 1.2
const B = 0.75

function stem(token: string): string {
  if (token.length <= 4 || /\d/.test(token)) return token
  if (token.endsWith("ies")) return `${token.slice(0, -3)}y`
  if (/(ss|us|is)$/.test(token)) return token
  if (/(ches|shes|xes|sses)$/.test(token)) return token.slice(0, -2)
  if (token.endsWith("s")) return token.slice(0, -1)
  return token
}

export function tokenize(text: string): string[] {
  const normalised = text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    // "/wcag/1-4-3" and "1-4-3" mean success criterion 1.4.3.
    .replace(/\b(\d)-(\d{1,2})-(\d{1,2})\b/g, "$1.$2.$3")
  const tokens: string[] = []
  for (const raw of normalised.match(/[a-z0-9]+(?:[.\-_][a-z0-9]+)*/g) ?? []) {
    const isNumber = /^\d+(\.\d+)*$/.test(raw)
    if (isNumber) {
      tokens.push(raw)
      continue
    }
    if (/[-_.]/.test(raw)) {
      // Keep "aria-label" whole and also as "aria" + "label".
      tokens.push(raw)
      for (const part of raw.split(/[-_.]/)) {
        if (part.length > 1 && !STOPWORDS.has(part)) tokens.push(stem(part))
      }
      continue
    }
    if (raw.length < 2 || STOPWORDS.has(raw)) continue
    tokens.push(stem(raw))
  }
  return tokens
}

interface Prepared {
  index: SiteIndex
  termFreqs: Map<string, number>[]
  lengths: number[]
  avgLength: number
  docFreq: Map<string, number>
}

let prepared: Prepared | null = null

function addWeighted(target: Map<string, number>, tokens: string[], weight: number): number {
  for (const token of tokens) target.set(token, (target.get(token) ?? 0) + weight)
  return tokens.length * weight
}

function load(): Prepared {
  if (prepared) return prepared
  const file = path.join(process.cwd(), "lib/assistant/site-index.json")
  const index = JSON.parse(fs.readFileSync(file, "utf8")) as SiteIndex
  const pageTitleTokens = index.pages.map((page) => tokenize(`${page.title} ${page.path}`))

  const termFreqs: Map<string, number>[] = []
  const lengths: number[] = []
  const docFreq = new Map<string, number>()
  for (const chunk of index.chunks) {
    const tf = new Map<string, number>()
    let length = addWeighted(tf, pageTitleTokens[chunk.page] ?? [], TITLE_WEIGHT)
    length += addWeighted(tf, tokenize(chunk.heading), HEADING_WEIGHT)
    length += addWeighted(tf, tokenize(chunk.text), 1)
    termFreqs.push(tf)
    lengths.push(length)
    for (const term of tf.keys()) docFreq.set(term, (docFreq.get(term) ?? 0) + 1)
  }
  const avgLength = lengths.reduce((sum, n) => sum + n, 0) / Math.max(lengths.length, 1)
  prepared = { index, termFreqs, lengths, avgLength, docFreq }
  return prepared
}

/** BM25 scores for the chunks that match the query, best first; `only` restricts it to some chunks. */
function rank(query: string, only?: (chunk: IndexChunk) => boolean): { i: number; score: number }[] {
  const terms = [...new Set(tokenize(query))]
  if (!terms.length) return []
  const { index, termFreqs, lengths, avgLength, docFreq } = load()
  const total = index.chunks.length

  const idf = new Map<string, number>()
  for (const term of terms) {
    const df = docFreq.get(term) ?? 0
    if (df) idf.set(term, Math.log(1 + (total - df + 0.5) / (df + 0.5)))
  }
  if (!idf.size) return []

  const scored: { i: number; score: number }[] = []
  for (let i = 0; i < total; i++) {
    if (only && !only(index.chunks[i])) continue
    const tf = termFreqs[i]
    let score = 0
    for (const [term, weight] of idf) {
      const f = tf.get(term)
      if (!f) continue
      score += (weight * f * (K1 + 1)) / (f + K1 * (1 - B + (B * lengths[i]) / avgLength))
    }
    if (score > 0) scored.push({ i, score })
  }
  return scored.sort((a, b) => b.score - a.score)
}

function toHit(i: number, score: number): SearchHit {
  const { index } = load()
  const chunk = index.chunks[i]
  const page = index.pages[chunk.page]
  return { path: page.path, title: page.title, heading: chunk.heading, text: chunk.text, score }
}

/**
 * Best-matching sections for a query, at most `perPage` from any one page so a single long
 * page cannot fill every slot. Scores are relative; anything under `minRelative` of the top
 * score is dropped as noise.
 */
export function searchSite(
  query: string,
  { limit = 6, perPage = 2, minRelative = 0.35 }: { limit?: number; perPage?: number; minRelative?: number } = {},
): SearchHit[] {
  const scored = rank(query)
  if (!scored.length) return []
  const { index } = load()
  const floor = scored[0].score * minRelative
  const perPageCount = new Map<number, number>()
  const hits: SearchHit[] = []
  for (const { i, score } of scored) {
    if (score < floor || hits.length >= limit) break
    const page = index.chunks[i].page
    const used = perPageCount.get(page) ?? 0
    if (used >= perPage) continue
    perPageCount.set(page, used + 1)
    hits.push(toHit(i, score))
  }
  return hits
}

/**
 * The sections of one page that best match the question. The widget only sends the first part
 * of a page's visible text, and a long guide runs to five or six times that, so a question about
 * a later section of the page the visitor is reading needs that section found in the index.
 */
export function searchPage(path: string, query: string, { limit = 4, minRelative = 0.25 }: { limit?: number; minRelative?: number } = {}): SearchHit[] {
  const { index } = load()
  const pageNumber = index.pages.findIndex((page) => page.path === path)
  if (pageNumber === -1) return []
  const scored = rank(query, (chunk) => chunk.page === pageNumber)
  if (!scored.length) return []
  const floor = scored[0].score * minRelative
  return scored.filter(({ score }) => score >= floor).slice(0, limit).map(({ i, score }) => toHit(i, score))
}

/** Title and description of an indexed page, for labelling the page a visitor is on. */
export function findPage(pathname: string): { title: string; description: string } | null {
  const { index } = load()
  const page = index.pages.find((p) => p.path === pathname)
  return page ? { title: page.title, description: page.description } : null
}

export function indexGeneratedAt(): string {
  return load().index.generatedAt
}
