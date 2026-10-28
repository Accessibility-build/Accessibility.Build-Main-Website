/**
 * Reads the prose out of a parsed HTML document for the Readability Checker's URL mode.
 *
 * The browser parses the fetched HTML with DOMParser, which builds an inert document: scripts
 * never run and images never load. This takes the main content (main, then a single article,
 * then body), drops navigation, banners, footers, asides, form controls, code blocks and hidden
 * content, and returns one paragraph per block element. It only reads the DOM, so it works the
 * same on a DOMParser document in the browser and a jsdom document in tests.
 */

export interface ExtractedText {
  text: string
  /** Where the text came from. */
  source: "main" | "article" | "body"
  wordCount: number
  title: string
  /** The document's lang attribute, if any. */
  language: string | null
  /** Abbreviations marked up with <abbr title>, which WCAG 3.1.4 counts as explained. */
  explainedAbbreviations: string[]
}

/** Below this, the page almost certainly builds its content with JavaScript. */
export const MIN_EXTRACTED_WORDS = 50

const DROP_SELECTOR = [
  "script", "style", "noscript", "template", "svg", "canvas", "iframe", "object", "embed", "video",
  "audio", "picture", "img", "map", "nav", "header", "footer", "aside", "button", "select", "textarea",
  "input", "option", "pre", "[hidden]", "[aria-hidden='true']", "[role='navigation']", "[role='banner']",
  "[role='contentinfo']", "[role='complementary']", "[role='dialog']", "[role='alertdialog']",
  "[role='search']", "[style*='display:none']", "[style*='display: none']",
  "[style*='visibility:hidden']", "[style*='visibility: hidden']",
].join(", ")

/** Cookie and consent banners outside landmarks, recognised by name and size. */
const BANNER_SELECTOR = "[id*='cookie' i], [class*='cookie' i], [id*='consent' i], [class*='consent' i]"

const BLOCK_TAGS = new Set([
  "address", "article", "blockquote", "br", "caption", "dd", "details", "div", "dl", "dt", "fieldset",
  "figcaption", "figure", "form", "h1", "h2", "h3", "h4", "h5", "h6", "hgroup", "hr", "legend", "li",
  "main", "ol", "p", "section", "summary", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul",
])

function countWords(text: string): number {
  return text.split(/\s+/).filter((token) => /[a-zA-Z]/.test(token)).length
}

function blocksOf(root: Element): string[] {
  const blocks: string[] = []
  let current = ""
  const flush = () => {
    const text = current.replace(/\s+/g, " ").trim()
    if (text) blocks.push(text)
    current = ""
  }
  const walk = (node: Node) => {
    if (node.nodeType === 3) {
      current += (node as Text).data
      return
    }
    if (node.nodeType !== 1) return
    const block = BLOCK_TAGS.has((node as Element).tagName.toLowerCase())
    if (block) flush()
    node.childNodes.forEach(walk)
    if (block) flush()
  }
  walk(root)
  flush()
  return blocks
}

function textOf(candidate: Element, isBody: boolean): string {
  const root = candidate.cloneNode(true) as Element
  root.querySelectorAll(DROP_SELECTOR).forEach((element) => element.remove())
  // Citation and edit markers such as [1] or [edit] are not part of the sentence.
  root.querySelectorAll("sup, span").forEach((element) => {
    if (/^\s*\[[^\]]{1,40}\]\s*$/.test(element.textContent ?? "")) element.remove()
  })
  if (isBody) {
    root.querySelectorAll(BANNER_SELECTOR).forEach((element) => {
      if (root.contains(element) && countWords(element.textContent ?? "") < 150) element.remove()
    })
  }
  return blocksOf(root).join("\n\n")
}

export function extractReadableText(doc: Document): ExtractedText {
  const explainedAbbreviations = [
    ...new Set(
      Array.from(doc.querySelectorAll("abbr[title]"))
        .filter((element) => element.getAttribute("title")?.trim())
        .map((element) => (element.textContent ?? "").trim())
        .filter(Boolean),
    ),
  ]
  const base = {
    title: (doc.title || "").trim(),
    language: doc.documentElement.getAttribute("lang"),
    explainedAbbreviations,
  }

  const articles = doc.querySelectorAll("article")
  const candidates: { source: ExtractedText["source"]; element: Element | null }[] = [
    { source: "main", element: doc.querySelector("main, [role='main']") },
    { source: "article", element: articles.length === 1 ? articles[0] : null },
    { source: "body", element: doc.body },
  ]

  let fallback: ExtractedText | null = null
  for (const { source, element } of candidates) {
    if (!element) continue
    const text = textOf(element, source === "body")
    const result = { ...base, text, source, wordCount: countWords(text) }
    // A main or article with almost nothing in it is a shell; try the next candidate.
    if (result.wordCount >= MIN_EXTRACTED_WORDS) return result
    if (!fallback || result.wordCount > fallback.wordCount) fallback = result
  }
  return fallback ?? { ...base, text: "", source: "body", wordCount: 0 }
}
