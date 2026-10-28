import { contrastRatioWCAG } from "@/lib/color/oklch"
import type { OfficePackage } from "./package"
import {
  altTextMessage,
  altTextProblem,
  isUsableLanguage,
  linkTextMessage,
  linkTextProblem,
  titleProblem,
} from "./rules"
import { altQualitySummary, countSeverities, makeCheck, type CheckDefinition, type CheckResult, type Finding, type OfficeReport } from "./types"
import {
  GRAPHIC_URI,
  altTextOf,
  ancestor,
  attr,
  child,
  children,
  descendants,
  excerpt,
  flattenAlternateContent,
  inNs,
  isEl,
  isMarkedDecorative,
  isOn,
  path,
  plural,
  resolvePartName,
} from "./xml"

// Word checks. Reads word/document.xml with its styles, settings, headers and
// footers, and the core properties, and returns one result per check with
// every finding located by page (when Word recorded page breaks) or
// paragraph, plus a short excerpt of the text so it can be found with Ctrl+F.

const CHECKS = {
  title: {
    id: "docx-title",
    title: "Document title",
    criterion: "2.4.2",
    fix: "Select File > Info. Under Properties on the right, select Title, type a title that describes the document, then save. On a Mac, select File > Properties > Summary.",
  },
  language: {
    id: "docx-language",
    title: "Document language",
    criterion: "3.1.1",
    fix: "Press Ctrl+A (Cmd+A on a Mac) to select all the text, then select Review > Language > Set Proofing Language. Choose the language, select Set As Default so new text uses it too, and select OK.",
  },
  headings: {
    id: "docx-headings",
    title: "Headings",
    criterion: "1.3.1",
    fix: "Select a heading's text and choose Heading 1, Heading 2 and so on from the Styles gallery on the Home tab. View > Navigation Pane then lists the headings, which is what screen reader users move between.",
  },
  headingOrder: {
    id: "docx-heading-order",
    title: "Heading levels in order",
    criterion: "1.3.1",
    fix: "Change the heading's style so the levels go down one step at a time: a Heading 3 belongs under a Heading 2, not straight under a Heading 1. If you want a smaller look, change the style's font rather than skipping a level (right-click the style in the Styles gallery and select Modify).",
  },
  fakeHeadings: {
    id: "docx-fake-headings",
    title: "Text formatted to look like a heading",
    criterion: "1.3.1",
    fix: "If the paragraph is a heading, click in it and choose a Heading style from Home > Styles instead of making it bold or bigger. To keep its look, right-click the Heading style and select Update Heading to Match Selection.",
  },
  altText: {
    id: "docx-alt-text",
    title: "Alt text on pictures, charts and SmartArt",
    criterion: "1.1.1",
    fix: "Right-click the object and select View Alt Text (Edit Alt Text in some versions). Describe what it shows or means in a sentence or two, or tick Mark as decorative if it adds nothing.",
  },
  altQuality: {
    id: "docx-alt-quality",
    title: "Alt text quality",
    criterion: "1.1.1",
    fix: "Right-click the object, select View Alt Text and rewrite the description: say what the picture means in this document, without starting with \"image of\", and delete any automatically generated note.",
  },
  tableHeaders: {
    id: "docx-table-headers",
    title: "Table header rows",
    criterion: "1.3.1",
    fix: "Click in the first row of the table, then select the Table Layout tab (Layout in some versions) > Repeat Header Rows. Or right-click the row, select Table Properties > Row and tick Repeat as header row at the top of each page.",
  },
  tableStructure: {
    id: "docx-table-structure",
    title: "Merged cells and nested tables",
    criterion: "1.3.1",
    fix: "Select a merged cell and choose Table Layout > Split Cells, or restructure the content so each cell holds one piece of data. Move a table that sits inside another table's cell out into its own table.",
  },
  links: {
    id: "docx-link-text",
    title: "Link text",
    criterion: "2.4.4",
    fix: "Right-click the link and select Edit Hyperlink. Change Text to display to words that say where the link goes, such as \"2026 pricing guide\" rather than \"click here\" or the web address.",
  },
  emptyParagraphs: {
    id: "docx-empty-paragraphs",
    title: "Blank paragraphs used for spacing",
    criterion: "1.3.1",
    fix: "Delete the blank paragraphs (Home > Show/Hide shows them as pilcrow marks). To add space, set Spacing Before or After on the Layout tab, and use Insert > Page Break (Ctrl+Enter) to start a new page.",
  },
  manualLists: {
    id: "docx-manual-lists",
    title: "Typed bullets and numbers",
    criterion: "1.3.1",
    fix: "Select the paragraphs, delete the typed characters, then select Home > Bullets or Home > Numbering. Screen readers then announce a list and how many items it has.",
  },
  floating: {
    id: "docx-floating",
    title: "Text boxes and floating objects",
    criterion: "1.3.2",
    fix: "Move text out of text boxes into the main text and format it with a style instead. For a picture or chart, right-click it, select Wrap Text > In Line with Text, and place it where it belongs in the reading order.",
  },
  contrast: {
    id: "docx-contrast",
    title: "Text colour contrast",
    criterion: "1.4.3",
    fix: "Select the text, then choose a darker colour, or Automatic, from Home > Font Color. Normal text needs a contrast ratio of at least 4.5:1 against its background, and large text (18 pt, or 14 pt bold) at least 3:1.",
  },
} satisfies Record<string, CheckDefinition>

export const WORD_CHECK_IDS = Object.values(CHECKS).map((c) => c.id)

// ---------------------------------------------------------------------------
// Styles

interface Style {
  id: string
  type: string
  name: string
  basedOn: string | null
  pPr: Element | null
  rPr: Element | null
  /** Table styles only: does the style fill any cells? Then cell backgrounds are unknown. */
  shades: boolean
}

interface StyleBook {
  styles: Map<string, Style>
  defaultParagraph: string | null
  docRPr: Element | null
  docPPr: Element | null
  chain(id: string | null): Style[]
}

function readStyles(doc: Document | null): StyleBook {
  const styles = new Map<string, Style>()
  let defaultParagraph: string | null = null
  const root = doc?.documentElement ?? null
  for (const el of children(root, "w", "style")) {
    const id = attr(el, "w", "styleId")
    if (!id) continue
    const type = attr(el, "w", "type") ?? "paragraph"
    const fills = descendants(el, "w", "shd").some((s) => {
      const fill = (attr(s, "w", "fill") ?? "").toLowerCase()
      return !!fill && fill !== "auto" && fill !== "ffffff"
    })
    styles.set(id, {
      id,
      type,
      name: (attr(child(el, "w", "name"), "w", "val") ?? id).toLowerCase(),
      basedOn: attr(child(el, "w", "basedOn"), "w", "val"),
      pPr: child(el, "w", "pPr"),
      rPr: child(el, "w", "rPr"),
      shades: fills,
    })
    if (type === "paragraph" && ["1", "true", "on"].includes(attr(el, "w", "default") ?? "")) defaultParagraph = id
  }
  const defaults = child(root, "w", "docDefaults")
  const memo = new Map<string, Style[]>()
  return {
    styles,
    defaultParagraph,
    docRPr: path(defaults, ["w", "rPrDefault"], ["w", "rPr"]),
    docPPr: path(defaults, ["w", "pPrDefault"], ["w", "pPr"]),
    chain(id) {
      if (!id) return []
      const hit = memo.get(id)
      if (hit) return hit
      const out: Style[] = []
      const seen = new Set<string>()
      let cur = styles.get(id)
      while (cur && !seen.has(cur.id) && out.length < 30) {
        out.push(cur)
        seen.add(cur.id)
        cur = cur.basedOn ? styles.get(cur.basedOn) : undefined
      }
      memo.set(id, out)
      return out
    },
  }
}

// ---------------------------------------------------------------------------
// Paragraphs and runs

interface Para {
  el: Element
  /** 1-based position among the document's own paragraphs (not text box content). */
  ordinal: number
  page: number
  text: string
  runs: Element[]
  styleId: string | null
  level: number | null
  numbered: boolean
  inTable: boolean
  inTextBox: boolean
}

/** Runs that belong to this paragraph, skipping deleted text and text box content. */
function paragraphRuns(p: Element): Element[] {
  const out: Element[] = []
  const stack = children(p).reverse()
  while (stack.length) {
    const el = stack.pop() as Element
    if (isEl(el, "w", "r")) {
      out.push(el)
      continue
    }
    if (inNs(el, "w") && ["pPr", "del", "moveFrom", "txbxContent", "p", "tbl"].includes(el.localName)) continue
    stack.push(...children(el).reverse())
  }
  return out
}

function runText(r: Element): string {
  let s = ""
  for (const c of children(r)) {
    if (!inNs(c, "w")) continue
    switch (c.localName) {
      case "t":
        s += c.textContent ?? ""
        break
      case "tab":
      case "ptab":
        s += "\t"
        break
      case "br":
      case "cr":
        s += "\n"
        break
      case "noBreakHyphen":
        s += "-"
        break
      case "sym": {
        const code = parseInt(attr(c, "w", "char") ?? "", 16)
        if (Number.isFinite(code)) s += String.fromCharCode(code)
        break
      }
    }
  }
  return s
}

function hasObject(el: Element): boolean {
  return (
    descendants(el, "w", "drawing").length > 0 ||
    descendants(el, "w", "pict").length > 0 ||
    descendants(el, "w", "object").length > 0
  )
}

// ---------------------------------------------------------------------------
// Drawings

type ObjectKind = "picture" | "chart" | "SmartArt" | "group" | "canvas" | "shape" | "text box" | "embedded object"

interface WordObject {
  kind: ObjectKind
  name: string
  alt: string
  decorative: boolean
  floating: boolean
  /** Picture-like objects inside a group, judged separately when the group has no alt text. */
  members: { name: string; alt: string; decorative: boolean }[]
  where: string
  part: "body" | "header" | "footer"
}

const HIGHLIGHT: Record<string, string> = {
  black: "000000",
  blue: "0000FF",
  cyan: "00FFFF",
  green: "00FF00",
  magenta: "FF00FF",
  red: "FF0000",
  yellow: "FFFF00",
  white: "FFFFFF",
  darkBlue: "000080",
  darkCyan: "008080",
  darkGreen: "008000",
  darkMagenta: "800080",
  darkRed: "800000",
  darkYellow: "808000",
  darkGray: "808080",
  lightGray: "C0C0C0",
}

const HEX6 = /^[0-9a-f]{6}$/i

/** Bullet and dash characters people type at the start of a line, plus Symbol font bullets. */
const TYPED_BULLET = /^([\u2022\u25e6\u25aa\u25ab\u25cf\u25cb\u25a0\u25a1\u2023\u2043\u2219\u00b7\u27a2\u27a4\u2192\u2713\u2714\u2756\u25ba\u25b6\u2605\u2013\u2014*>-]|[\uf000-\uf0ff])[\s\u00a0]/
const TYPED_DIGIT = /^\(?\d{1,2}[.)][\s\u00a0]+\S/
const TYPED_LETTER = /^\(?([a-z]|i{1,3}|iv|vi{0,3}|ix|x)[.)][\s\u00a0]+\S/i

const ROMAN: Record<string, number> = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10 }

/** a, b, c or i, ii, iii: each marker one more than the last. */
function isSequence(markers: string[]): boolean {
  const asLetters = markers.every((m, i) => m.length === 1 && (i === 0 || m.charCodeAt(0) === markers[i - 1].charCodeAt(0) + 1))
  const asRoman = markers.every((m, i) => !!ROMAN[m] && (i === 0 || ROMAN[m] === ROMAN[markers[i - 1]] + 1))
  return asLetters || asRoman
}

const NOT_HEADING_STYLES = /^(title|subtitle|toc \d|caption|header|footer|table of figures|footnote text|endnote text|list paragraph)$/

export function checkWordDocument(pkg: OfficePackage, fileName: string): OfficeReport {
  const doc = pkg.xml(pkg.mainPart)
  const body = path(doc?.documentElement, ["w", "body"])
  if (!doc || !body) {
    return { kind: "docx", fileName, facts: [], checks: [], counts: { error: 0, warning: 0, tip: 0 } }
  }
  flattenAlternateContent(doc)

  const partFor = (type: string, fallback: string) => {
    const rel = [...pkg.rels(pkg.mainPart).values()].find((r) => r.type.endsWith(`/${type}`) && !r.external)
    return rel ? resolvePartName(pkg.mainPart, rel.target) : fallback
  }
  const book = readStyles(pkg.xml(partFor("styles", "word/styles.xml")))
  const settings = pkg.xml(partFor("settings", "word/settings.xml"))

  const paraStyle = (p: Element) => attr(path(p, ["w", "pPr"], ["w", "pStyle"]), "w", "val") ?? book.defaultParagraph

  /** A paragraph property: direct formatting first, then the style chain, then document defaults. */
  const paraProp = (p: Element, local: string): Element | null => {
    const direct = child(child(p, "w", "pPr"), "w", local)
    if (direct) return direct
    for (const s of book.chain(paraStyle(p))) {
      const e = child(s.pPr, "w", local)
      if (e) return e
    }
    return child(book.docPPr, "w", local)
  }

  /** A run property: direct, character style, paragraph style, document defaults. */
  const runProp = (r: Element, styleId: string | null, local: string): Element | null => {
    const rPr = child(r, "w", "rPr")
    const direct = child(rPr, "w", local)
    if (direct) return direct
    for (const s of book.chain(attr(child(rPr, "w", "rStyle"), "w", "val"))) {
      const e = child(s.rPr, "w", local)
      if (e) return e
    }
    for (const s of book.chain(styleId)) {
      const e = child(s.rPr, "w", local)
      if (e) return e
    }
    return child(book.docRPr, "w", local)
  }

  const headingLevel = (p: Element): number | null => {
    const direct = attr(path(p, ["w", "pPr"], ["w", "outlineLvl"]), "w", "val")
    if (direct !== null) {
      const n = Number(direct)
      return n >= 0 && n < 9 ? n + 1 : null
    }
    for (const s of book.chain(paraStyle(p))) {
      const lvl = attr(path(s.pPr ?? undefined, ["w", "outlineLvl"]), "w", "val")
      if (lvl !== null) {
        const n = Number(lvl)
        return n >= 0 && n < 9 ? n + 1 : null
      }
      const m = /^heading ([1-9])$/.exec(s.name)
      if (m) return Number(m[1])
    }
    return null
  }

  const isNumbered = (p: Element): boolean => {
    const numPr = paraProp(p, "numPr")
    const id = attr(child(numPr, "w", "numId"), "w", "val")
    return !!numPr && id !== null && id !== "0"
  }

  // Paragraph records, in document order. Page numbers come from the
  // w:lastRenderedPageBreak marks Word leaves where pages broke the last
  // time it laid the document out; files from other tools have none.
  const pagesKnown = descendants(body, "w", "lastRenderedPageBreak").length > 0
  const paras: Para[] = []
  const byEl = new Map<Element, Para>()
  /** For each paragraph, the nearest paragraph with text before it, to locate empty ones. */
  const before = new Map<Para, Para>()
  let lastWithText: Para | null = null
  let breaks = 0
  let ordinal = 0
  for (const el of descendants(body, "w", "p")) {
    const runs = paragraphRuns(el)
    const text = runs.map(runText).join("")
    const inTextBox = !!ancestor(el, "w", "txbxContent")
    let page = 1 + breaks
    let own = ordinal + 1
    if (inTextBox) {
      // Text box content is located by the paragraph that holds the text box.
      const outer = byEl.get(ancestor(ancestor(el, "w", "txbxContent") as Element, "w", "p") as Element)
      page = outer?.page ?? page
      own = outer?.ordinal ?? ordinal
    } else {
      ordinal++
      let seenText = false
      for (const r of runs) {
        for (const c of children(r)) {
          if (isEl(c, "w", "lastRenderedPageBreak")) {
            breaks++
            if (!seenText) page++
          } else if (isEl(c, "w", "t") && (c.textContent ?? "").trim()) {
            seenText = true
          }
        }
      }
    }
    const styleId = paraStyle(el)
    const rec: Para = {
      el,
      ordinal: own,
      page,
      text,
      runs,
      styleId,
      level: inTextBox ? null : headingLevel(el),
      numbered: isNumbered(el),
      inTable: !!ancestor(el, "w", "tc"),
      inTextBox,
    }
    paras.push(rec)
    byEl.set(el, rec)
    if (lastWithText) before.set(rec, lastWithText)
    if (!inTextBox && text.trim()) lastWithText = rec
  }
  const ownParas = paras.filter((p) => !p.inTextBox)

  const where = (p: Para | null | undefined, extra = ""): string => {
    if (!p) return extra || "In the document"
    const prefix = pagesKnown ? `Page ${p.page}` : `Paragraph ${p.ordinal}`
    const box = p.inTextBox ? " (in a text box)" : p.inTable ? " (in a table)" : ""
    const prev = before.get(p)
    const text = p.text.trim() ? `"${excerpt(p.text)}"` : prev ? `after "${excerpt(prev.text)}"` : "before any text"
    return `${prefix}${box}: ${extra ? `${extra} ` : ""}${text}`
  }

  /** The paragraph an element sits in. */
  const paraOf = (el: Element): Para | null => {
    const p = isEl(el, "w", "p") ? el : ancestor(el, "w", "p")
    return p ? byEl.get(p) ?? null : null
  }

  const checks: CheckResult[] = []
  const words = ownParas.reduce((n, p) => n + (p.text.match(/\S+/g)?.length ?? 0), 0)

  // ---- Title
  {
    const core = pkg.xml("docProps/core.xml")
    const title = core ? (descendants(core, "dc", "title")[0]?.textContent ?? "").trim() : ""
    const findings: Finding[] = []
    if (!title) {
      findings.push({
        severity: "error",
        message: "The document has no title in its properties. Screen readers, browsers and PDF exports show the file name instead.",
        location: "File > Info > Properties",
      })
    } else {
      const problem = titleProblem(title, fileName)
      if (problem) findings.push({ severity: "warning", message: problem, location: "File > Info > Properties" })
    }
    checks.push(makeCheck(CHECKS.title, findings, title ? `Title: "${excerpt(title, 80)}"` : "No title is set."))
  }

  // ---- Language
  {
    const docLang = attr(child(book.docRPr, "w", "lang"), "w", "val")
    const normal = book.defaultParagraph ? book.styles.get(book.defaultParagraph) : undefined
    const normalLang = attr(child(normal?.rPr ?? null, "w", "lang"), "w", "val")
    const defaultLang = isUsableLanguage(normalLang) ? normalLang : isUsableLanguage(docLang) ? docLang : null
    const used = new Map<string, number>()
    let textRuns = 0
    let unmarked = 0
    for (const p of paras) {
      for (const r of p.runs) {
        if (!runText(r).trim()) continue
        textRuns++
        const lang = attr(runProp(r, p.styleId, "lang"), "w", "val")
        if (isUsableLanguage(lang)) used.set(lang, (used.get(lang) ?? 0) + 1)
        else unmarked++
      }
    }
    const findings: Finding[] = []
    let summary: string
    if (defaultLang) {
      const others = [...used.entries()].filter(([l]) => l.toLowerCase() !== defaultLang.toLowerCase())
      summary = `Default language: ${defaultLang}.${others.length ? ` Some text is marked ${others.map(([l, n]) => `${l} (${plural(n, "run")})`).join(", ")}.` : ""}`
    } else if (textRuns > 0 && unmarked === 0) {
      summary = `No default language, but every run of text is marked: ${[...used.keys()].join(", ")}.`
      findings.push({
        severity: "tip",
        message: "Each piece of text has a language, but the document has no default. Text added later may have none.",
        location: "Review > Language",
      })
    } else {
      summary = "No document language is set."
      const themeLang = attr(child(settings?.documentElement ?? null, "w", "themeFontLang"), "w", "val")
      findings.push({
        severity: "error",
        message: `The document does not say what language it is in, so screen readers may read it with the wrong pronunciation rules${isUsableLanguage(themeLang) ? ` (the theme fonts are set for ${themeLang}, but that is not the text's language)` : ""}.`,
        location: "Review > Language",
      })
    }
    checks.push(makeCheck(CHECKS.language, findings, summary, textRuns > 0 || !!defaultLang))
  }

  // ---- Headings
  const headings = ownParas.filter((p) => p.level !== null)
  const app = pkg.xml("docProps/app.xml")
  const appPages = Number(app ? descendants(app, "ep", "Pages")[0]?.textContent : NaN)
  const lastPage = ownParas.reduce((n, p) => Math.max(n, p.page), 1)
  const pages = Number.isFinite(appPages) && appPages > 0 ? appPages : pagesKnown ? lastPage : Math.max(1, Math.ceil(words / 500))

  // Body text size, to tell large text that stands out from text that is just large.
  const sizeWeights = new Map<number, number>()
  const sizeOf = (r: Element, p: Para) => Number(attr(runProp(r, p.styleId, "sz"), "w", "val") ?? 20)
  for (const p of ownParas) {
    if (p.level !== null) continue
    for (const r of p.runs) {
      const len = runText(r).trim().length
      if (len) sizeWeights.set(sizeOf(r, p), (sizeWeights.get(sizeOf(r, p)) ?? 0) + len)
    }
  }
  const bodySize = [...sizeWeights.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 22

  const fake: Para[] = []
  for (const p of ownParas) {
    if (p.level !== null || p.inTable || p.numbered) continue
    const text = p.text.replace(/\s+/g, " ").trim()
    if (text.length < 3 || text.length > 120 || !/\p{L}/u.test(text)) continue
    if (text.split(" ").length > 14 || /[.;,]$/.test(text)) continue
    if (TYPED_BULLET.test(text) || TYPED_DIGIT.test(text)) continue
    const styleName = p.styleId ? book.styles.get(p.styleId)?.name ?? "" : ""
    if (NOT_HEADING_STYLES.test(styleName)) continue
    const textRuns = p.runs.filter((r) => runText(r).trim())
    if (!textRuns.length) continue
    const allBold = textRuns.every((r) => isOn(runProp(r, p.styleId, "b")))
    const allLarge = textRuns.every((r) => sizeOf(r, p) >= 28 && sizeOf(r, p) > bodySize)
    if (allBold || allLarge) fake.push(p)
  }

  {
    const findings: Finding[] = []
    let summary: string
    let applicable = true
    if (headings.length === 0) {
      const hint = fake.length ? ` ${plural(fake.length, "paragraph looks", "paragraphs look")} like headings but use no heading style.` : ""
      if (pages >= 3) {
        findings.push({
          severity: "error",
          message: `This ${pages}-page document has no headings, so screen reader users cannot move through it by section and the Navigation Pane is empty.${hint}`,
          location: "Whole document",
        })
      } else if (pages === 2) {
        findings.push({
          severity: "warning",
          message: `This two-page document has no headings. Headings let screen reader users skim and jump between sections.${hint}`,
          location: "Whole document",
        })
      } else {
        applicable = fake.length > 0
        if (fake.length) {
          findings.push({ severity: "tip", message: `The document has no headings.${hint}`, location: "Whole document" })
        }
      }
      summary = applicable ? "No headings found." : "A one-page document with no headings. Headings are optional this short."
    } else {
      const byLevel = new Map<number, number>()
      for (const h of headings) byLevel.set(h.level as number, (byLevel.get(h.level as number) ?? 0) + 1)
      summary = `${plural(headings.length, "heading")}: ${[...byLevel.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([l, n]) => `${n} at level ${l}`)
        .join(", ")}.`
      for (const h of headings) {
        if (!h.text.trim() && !hasObject(h.el)) {
          findings.push({
            severity: "warning",
            message: `An empty paragraph has the Heading ${h.level} style. Screen readers announce it as a blank heading.`,
            location: where(h),
          })
        }
      }
    }
    checks.push(makeCheck(CHECKS.headings, findings, summary, applicable))
  }

  // ---- Heading order
  {
    const findings: Finding[] = []
    const real = headings.filter((h) => h.text.trim())
    const titled = ownParas.some((p) => p.styleId && book.styles.get(p.styleId)?.name === "title" && p.text.trim())
    if (real.length && (real[0].level as number) > 1 && !titled) {
      findings.push({
        severity: "tip",
        message: `The first heading is a Heading ${real[0].level}. Most documents start with a Heading 1 (or the Title style) for the document's own title.`,
        location: where(real[0]),
      })
    }
    for (let i = 1; i < real.length; i++) {
      const prev = real[i - 1].level as number
      const cur = real[i].level as number
      if (cur > prev + 1) {
        findings.push({
          severity: "warning",
          message: `A Heading ${cur} follows a Heading ${prev}, skipping level ${prev + 1}${cur > prev + 2 ? ` to ${cur - 1}` : ""}. Screen reader users may think they missed a section.`,
          location: where(real[i]),
        })
      }
    }
    checks.push(
      makeCheck(
        CHECKS.headingOrder,
        findings,
        real.length === 0 ? "No headings to check." : findings.some((f) => f.severity === "warning") ? "Some heading levels are skipped." : "Heading levels go down one step at a time.",
        real.length > 0,
      ),
    )
  }

  // ---- Fake headings
  checks.push(
    makeCheck(
      CHECKS.fakeHeadings,
      fake.map((p) => ({
        severity: "warning" as const,
        message: "This short paragraph is bold or large like a heading, but it has no heading style, so screen readers treat it as ordinary text.",
        location: where(p),
      })),
      fake.length ? `${plural(fake.length, "paragraph")} look${fake.length === 1 ? "s" : ""} like a heading without being one.` : "No short bold or large paragraphs without a heading style.",
    ),
  )

  // ---- Objects: pictures, charts, SmartArt, groups, text boxes
  const objects: WordObject[] = []
  const collectObjects = (root: Element, part: WordObject["part"]) => {
    for (const drawing of descendants(root, "w", "drawing")) {
      const container = child(drawing, "wp", "inline") ?? child(drawing, "wp", "anchor")
      if (!container) continue
      const docPr = child(container, "wp", "docPr")
      if (["1", "true"].includes(docPr?.getAttribute("hidden") ?? "")) continue
      const graphicData = path(container, ["a", "graphic"], ["a", "graphicData"])
      const uri = graphicData?.getAttribute("uri") ?? ""
      let kind: ObjectKind = "picture"
      const members: WordObject["members"] = []
      if (uri.endsWith(GRAPHIC_URI.chart) || uri.endsWith(GRAPHIC_URI.chartex)) kind = "chart"
      else if (uri.endsWith(GRAPHIC_URI.diagram)) kind = "SmartArt"
      else if (uri.endsWith(GRAPHIC_URI.wordGroup) || uri.endsWith(GRAPHIC_URI.wordCanvas)) {
        kind = uri.endsWith(GRAPHIC_URI.wordGroup) ? "group" : "canvas"
        for (const pic of descendants(graphicData as Element, "pic", "pic")) {
          const props = path(pic, ["pic", "nvPicPr"], ["pic", "cNvPr"])
          members.push({ name: props?.getAttribute("name") ?? "Picture", alt: altTextOf(props), decorative: isMarkedDecorative(props) })
        }
      } else if (uri.endsWith(GRAPHIC_URI.wordShape)) {
        kind = descendants(graphicData as Element, "wps", "txbx").length ? "text box" : "shape"
      } else if (!uri.endsWith(GRAPHIC_URI.picture)) {
        kind = "embedded object"
      }
      let alt = altTextOf(docPr)
      if (!alt && kind === "picture") alt = altTextOf(descendants(container, "pic", "cNvPr")[0] ?? null)
      objects.push({
        kind,
        name: docPr?.getAttribute("name") ?? kind,
        alt,
        decorative: isMarkedDecorative(docPr),
        floating: isEl(container, "wp", "anchor"),
        members,
        where: part === "body" ? where(paraOf(drawing)) : part === "header" ? "Header" : "Footer",
        part,
      })
    }
    // VML: old documents, and objects with no DrawingML version.
    for (const vml of [...descendants(root, "w", "pict"), ...descendants(root, "w", "object")]) {
      const isObject = isEl(vml, "w", "object")
      if (descendants(vml, "v", "textpath").length) continue // WordArt and watermarks
      const shape = descendants(vml, "v", "shape")[0] ?? descendants(vml, "v", "rect")[0] ?? null
      const style = shape?.getAttribute("style") ?? ""
      const hasImage = descendants(vml, "v", "imagedata").length > 0
      const hasTextBox = descendants(vml, "v", "textbox").length > 0
      if (!isObject && !hasImage && !hasTextBox) continue
      objects.push({
        kind: isObject ? "embedded object" : hasTextBox ? "text box" : "picture",
        name: shape?.getAttribute("id") ?? (isObject ? "Object" : "Picture"),
        alt: (shape?.getAttribute("alt") ?? "").trim(),
        decorative: false,
        floating: /position:\s*absolute/i.test(style),
        members: [],
        where: part === "body" ? where(paraOf(vml)) : part === "header" ? "Header" : "Footer",
        part,
      })
    }
  }
  collectObjects(body, "body")
  for (const name of pkg.names().sort()) {
    const m = /^word\/(header|footer)\d*\.xml$/.exec(name)
    if (!m) continue
    const part = pkg.xml(name)
    if (!part) continue
    flattenAlternateContent(part)
    collectObjects(part.documentElement, m[1] as "header" | "footer")
  }

  {
    const findings: Finding[] = []
    const needAlt = objects.filter((o) => ["picture", "chart", "SmartArt", "embedded object", "group", "canvas"].includes(o.kind))
    let described = 0
    let decorative = 0
    for (const o of needAlt) {
      if (o.decorative) {
        decorative++
        continue
      }
      if (o.alt) {
        described++
        continue
      }
      const label = `${o.kind === "SmartArt" ? "SmartArt graphic" : o.kind[0].toUpperCase() + o.kind.slice(1)} "${o.name}"`
      if (o.kind === "group" || o.kind === "canvas") {
        findings.push({
          severity: "warning",
          message: `${label} has no alt text. Describe the group as a whole, or mark it decorative if it adds nothing.`,
          location: o.where,
        })
        for (const m of o.members) {
          if (!m.alt && !m.decorative) {
            findings.push({
              severity: "error",
              message: `Picture "${m.name}" inside ${o.kind} "${o.name}" has no alt text and is not marked as decorative.`,
              location: o.where,
            })
          }
        }
        continue
      }
      findings.push({
        severity: "error",
        message:
          o.kind === "chart"
            ? `${label} has no alt text. Say what the chart shows and its key figures, in the alt text or in the text next to it.`
            : o.kind === "embedded object"
              ? `${label} has no alt text. Screen readers cannot describe it.`
              : `${label} has no alt text and is not marked as decorative.`,
        location: o.where,
      })
    }
    const total = needAlt.length
    checks.push(
      makeCheck(
        CHECKS.altText,
        findings,
        total
          ? `${plural(total, "picture, chart or graphic", "pictures, charts and graphics")}: ${described} with alt text, ${decorative} marked decorative, ${total - described - decorative} missing.`
          : "No pictures, charts or SmartArt in the document.",
        total > 0,
      ),
    )

    const quality: Finding[] = []
    const withAlt = [
      ...needAlt.filter((o) => o.alt && !o.decorative).map((o) => ({ name: o.name, alt: o.alt, where: o.where })),
      ...needAlt.flatMap((o) => (o.alt || o.decorative ? [] : o.members.filter((m) => m.alt).map((m) => ({ name: m.name, alt: m.alt, where: o.where })))),
    ]
    for (const o of withAlt) {
      const problem = altTextProblem(o.alt)
      if (problem) {
        quality.push({ severity: problem === "auto" ? "warning" : "tip", message: altTextMessage(problem, o.alt), location: `${o.where} (${o.name})` })
      }
    }
    checks.push(
      makeCheck(
        CHECKS.altQuality,
        quality,
        withAlt.length ? altQualitySummary(withAlt.length, quality.length) : "No alt text to review.",
        withAlt.length > 0,
      ),
    )
  }

  // ---- Floating objects and text boxes
  {
    const findings: Finding[] = []
    const bodyObjects = objects.filter((o) => o.part === "body")
    for (const o of bodyObjects) {
      if (o.kind === "text box") {
        findings.push({
          severity: "warning",
          message: `Text box "${o.name}": screen readers may read text in a text box out of order, or not at all, and it is often lost when the document is saved as a PDF.`,
          location: o.where,
        })
      } else if (o.floating && !o.decorative && o.kind !== "shape") {
        findings.push({
          severity: "warning",
          message: `${o.kind === "SmartArt" ? "SmartArt graphic" : o.kind[0].toUpperCase() + o.kind.slice(1)} "${o.name}" floats over the text instead of sitting in line with it, so its place in the reading order is unpredictable.`,
          location: o.where,
        })
      }
    }
    const boxes = bodyObjects.filter((o) => o.kind === "text box").length
    const floats = findings.length - boxes
    checks.push(
      makeCheck(
        CHECKS.floating,
        findings,
        bodyObjects.length
          ? findings.length
            ? `${[boxes ? plural(boxes, "text box", "text boxes") : "", floats ? plural(floats, "floating object") : ""].filter(Boolean).join(" and ")}.`
            : "Every picture and object sits in line with the text."
          : "No pictures, shapes or text boxes in the body of the document.",
        bodyObjects.length > 0,
      ),
    )
  }

  // ---- Tables
  const tables = descendants(body, "w", "tbl")
  const topTables = tables.filter((t) => !ancestor(t, "w", "tbl"))
  const tableLabel = (t: Element) => {
    const top = ancestor(t, "w", "tbl") ? null : t
    const n = top ? topTables.indexOf(top) + 1 : 0
    const firstRow = child(t, "w", "tr")
    const cells = children(firstRow, "w", "tc").map((tc) => descendants(tc, "w", "p").map((p) => byEl.get(p)?.text ?? "").join(" ").trim())
    const firstPara = descendants(t, "w", "p")[0]
    const rec = firstPara ? byEl.get(firstPara) : undefined
    const pre = rec ? (pagesKnown ? `Page ${rec.page}, ` : "") : ""
    const label = n ? `Table ${n}` : "A table"
    return `${pre}${label}${cells.some(Boolean) ? `, first row "${excerpt(cells.filter(Boolean).join(" | "), 50)}"` : ""}`
  }
  {
    const findings: Finding[] = []
    let headed = 0
    for (const t of topTables) {
      const rows = children(t, "w", "tr")
      const firstRow = rows[0]
      const marked = isOn(path(firstRow, ["w", "trPr"], ["w", "tblHeader"]))
      const cols = rows.reduce((n, r) => Math.max(n, children(r, "w", "tc").length), children(child(t, "w", "tblGrid"), "w", "gridCol").length)
      if (marked) {
        headed++
        continue
      }
      const look = path(t, ["w", "tblPr"], ["w", "tblLook"])
      const lookVal = parseInt(attr(look, "w", "val") ?? "0", 16)
      const styledAsHeader = attr(look, "w", "firstRow") === "1" || attr(look, "w", "firstRow") === "true" || (lookVal & 0x20) !== 0
      if (rows.length < 2 || cols < 2) {
        findings.push({
          severity: "tip",
          message: `This table has ${rows.length < 2 ? "one row" : "one column"}, so it may be there for layout. If it holds data, mark a header row; if it is for layout, check that it reads in a sensible order.`,
          location: tableLabel(t),
        })
      } else {
        findings.push({
          severity: "error",
          message: styledAsHeader
            ? "Header Row is ticked on the Table Design tab, but that only changes the formatting (Word ticks it on every new table). The first row is not marked as a header row, so screen readers and PDF exports treat it as data."
            : "The table has no header row, so screen readers cannot say which column a cell belongs to.",
          location: tableLabel(t),
        })
      }
    }
    checks.push(
      makeCheck(
        CHECKS.tableHeaders,
        findings,
        topTables.length ? `${plural(topTables.length, "table")}, ${headed} with a marked header row.` : "No tables in the document.",
        topTables.length > 0,
      ),
    )
  }
  {
    const findings: Finding[] = []
    for (const t of tables) {
      if (ancestor(t, "w", "tbl")) {
        findings.push({
          severity: "warning",
          message: "This table sits inside a cell of another table. Screen readers struggle to convey nested tables; split them apart.",
          location: tableLabel(ancestor(t, "w", "tbl") as Element).replace(/^(Page \d+, )?/, "$1inside "),
        })
      }
      let merged = 0
      for (const row of children(t, "w", "tr")) {
        for (const tc of children(row, "w", "tc")) {
          const tcPr = child(tc, "w", "tcPr")
          const span = Number(attr(child(tcPr, "w", "gridSpan"), "w", "val") ?? 1)
          if (span > 1 || child(tcPr, "w", "vMerge") || child(tcPr, "w", "hMerge")) merged++
        }
      }
      if (merged) {
        findings.push({
          severity: "warning",
          message: `The table has ${plural(merged, "merged cell")}. Merged cells make it hard for screen reader users to tell which row and column a cell belongs to.`,
          location: tableLabel(t),
        })
      }
    }
    checks.push(
      makeCheck(
        CHECKS.tableStructure,
        findings,
        tables.length ? (findings.length ? "Some tables have merged cells or are nested." : "No merged cells or nested tables.") : "No tables in the document.",
        tables.length > 0,
      ),
    )
  }

  // ---- Links
  {
    const rels = pkg.rels(pkg.mainPart)
    interface Link {
      text: string
      target: string
      hasPicture: boolean
      pictureAlt: boolean
      at: Element
    }
    const links: Link[] = []
    for (const h of descendants(body, "w", "hyperlink")) {
      const rid = attr(h, "r", "id")
      const anchor = attr(h, "w", "anchor")
      const pics = descendants(h, "w", "drawing").map((d) => child(child(d, "wp", "inline") ?? child(d, "wp", "anchor"), "wp", "docPr"))
      links.push({
        text: paragraphRuns(h).map(runText).join(""),
        target: rid ? rels.get(rid)?.target ?? "" : anchor ? `#${anchor}` : "",
        hasPicture: pics.length > 0,
        pictureAlt: pics.some((d) => !!altTextOf(d)),
        at: h,
      })
    }
    for (const f of descendants(body, "w", "fldSimple")) {
      const instr = attr(f, "w", "instr") ?? ""
      if (!/^\s*HYPERLINK\b/i.test(instr)) continue
      links.push({ text: paragraphRuns(f).map(runText).join(""), target: /"([^"]*)"/.exec(instr)?.[1] ?? "", hasPicture: false, pictureAlt: false, at: f })
    }
    // Complex fields: begin, instruction, separate, displayed result, end.
    // They can nest and run across paragraphs, so keep a stack across the body.
    const stack: { instr: string; text: string; inResult: boolean; at: Element }[] = []
    for (const p of ownParas) {
      for (const r of p.runs) {
        for (const c of children(r)) {
          if (isEl(c, "w", "fldChar")) {
            const type = attr(c, "w", "fldCharType")
            if (type === "begin") stack.push({ instr: "", text: "", inResult: false, at: r })
            else if (type === "separate" && stack.length) stack[stack.length - 1].inResult = true
            else if (type === "end") {
              const f = stack.pop()
              if (f && /^\s*HYPERLINK\b/i.test(f.instr)) {
                links.push({ text: f.text, target: /"([^"]*)"/.exec(f.instr)?.[1] ?? "", hasPicture: false, pictureAlt: false, at: f.at })
              }
            }
          } else if (isEl(c, "w", "instrText") && stack.length) {
            stack[stack.length - 1].instr += c.textContent ?? ""
          } else if (isEl(c, "w", "t")) {
            for (const f of stack) if (f.inResult) f.text += c.textContent ?? ""
          }
        }
      }
    }
    const findings: Finding[] = []
    for (const l of links) {
      let problem = linkTextProblem(l.text)
      if (problem === "empty" && l.pictureAlt) problem = null
      if (!problem) continue
      findings.push({
        severity: problem === "empty" ? "error" : "warning",
        message: linkTextMessage(problem, l.text, l.hasPicture),
        location: where(paraOf(l.at)),
      })
    }
    checks.push(
      makeCheck(
        CHECKS.links,
        findings,
        links.length ? `${plural(links.length, "link")}, ${links.length - findings.length} with text that describes the destination.` : "No links in the document.",
        links.length > 0,
      ),
    )
  }

  // ---- Blank paragraphs
  {
    const findings: Finding[] = []
    const blocks: Element[] = []
    const collect = (el: Element) => {
      for (const c of children(el)) {
        if (isEl(c, "w", "p") || isEl(c, "w", "tbl")) blocks.push(c)
        else if (isEl(c, "w", "sdt")) collect(child(c, "w", "sdtContent") ?? c)
        else if (isEl(c, "w", "customXml") || isEl(c, "w", "sdtContent")) collect(c)
      }
    }
    collect(body)
    let run: Para[] = []
    const flush = () => {
      if (run.length >= 3) {
        findings.push({
          severity: "tip",
          message: `${run.length} blank paragraphs in a row. Screen readers announce each one as "blank", and the spacing breaks when fonts or page sizes change.`,
          location: where(run[0], `${run.length} blank paragraphs`),
        })
      }
      run = []
    }
    for (const b of blocks) {
      const rec = isEl(b, "w", "p") ? byEl.get(b) : undefined
      const pPr = child(b, "w", "pPr")
      const isBreak = !!rec && (!!child(pPr, "w", "sectPr") || descendants(b, "w", "br").some((br) => attr(br, "w", "type") === "page"))
      if (rec && !rec.text.trim() && !hasObject(b) && !isBreak) {
        run.push(rec)
        continue
      }
      flush()
    }
    flush()
    checks.push(
      makeCheck(
        CHECKS.emptyParagraphs,
        findings,
        findings.length ? `${plural(findings.length, "place")} with three or more blank paragraphs in a row.` : "No runs of three or more blank paragraphs.",
      ),
    )
  }

  // ---- Typed bullets and numbers
  {
    const findings: Finding[] = []
    let group: { paras: Para[]; marker: string; numbers: boolean } | null = null
    const flush = () => {
      if (!group) return
      // Lettered items count only when the letters run in order (a, b, c or
      // i, ii, iii), so author initials in a reference list are not a list.
      const letters = group.paras.map((p) => {
        const text = p.text.replace(/^[\s\u00a0]+/, "")
        return TYPED_BULLET.test(text) || TYPED_DIGIT.test(text) ? null : (TYPED_LETTER.exec(text)?.[1] ?? "").toLowerCase()
      })
      const lettered = letters.every((m) => m !== null)
      if (!lettered || (letters.length >= 2 && isSequence(letters as string[]))) {
        const n = group.paras.length
        findings.push({
          severity: "warning",
          message: group.numbers
            ? `${n === 1 ? "This paragraph starts" : `${n} paragraphs start`} with a typed number or letter instead of using Word's numbering, so screen readers do not announce a list.`
            : `${n === 1 ? "This paragraph starts" : `${n} paragraphs start`} with a typed "${group.marker}" instead of a real bulleted list, so screen readers do not announce a list.`,
          location: where(group.paras[0]),
        })
      }
      group = null
    }
    let prevOrdinal = -2
    for (const p of ownParas) {
      const text = p.text.replace(/^[\s\u00a0]+/, "")
      const bullet = TYPED_BULLET.exec(text)
      const number = !bullet && (TYPED_DIGIT.test(text) || TYPED_LETTER.test(text))
      const candidate = (bullet || number) && p.level === null && !p.numbered
      if (!candidate) {
        if (text.trim()) flush()
        continue
      }
      if (group && p.ordinal === prevOrdinal + 1) group.paras.push(p)
      else {
        flush()
        group = { paras: [p], marker: bullet ? bullet[1] : "", numbers: !bullet }
      }
      prevOrdinal = p.ordinal
    }
    flush()
    checks.push(
      makeCheck(
        CHECKS.manualLists,
        findings,
        findings.length ? `${plural(findings.length, "list")} made with typed characters.` : "No typed bullets or numbers found.",
      ),
    )
  }

  // ---- Text colour contrast
  {
    const background = settings && child(settings.documentElement, "w", "displayBackgroundShape") ? attr(child(doc.documentElement, "w", "background"), "w", "color") : null
    const pageBg = background && HEX6.test(background) ? background : "FFFFFF"
    const fillOf = (shd: Element | null): string | null => {
      const fill = attr(shd, "w", "fill")
      return fill && HEX6.test(fill) ? fill : null
    }
    interface Pair {
      fg: string
      bg: string
      ratio: number
      need: number
      count: number
      first: Para
    }
    const pairs = new Map<string, Pair>()
    let coloured = 0
    let unknown = 0
    for (const p of ownParas) {
      for (const r of p.runs) {
        const text = runText(r)
        if (!text.trim() || isOn(runProp(r, p.styleId, "vanish"))) continue
        const color = runProp(r, p.styleId, "color")
        const fg = attr(color, "w", "val")
        if (!fg || !HEX6.test(fg) || attr(color, "w", "themeColor")) continue
        coloured++
        // Background: highlight, run shading, paragraph shading, cell, table, page.
        let bg: string | null = null
        const highlight = attr(runProp(r, p.styleId, "highlight"), "w", "val")
        if (highlight && HIGHLIGHT[highlight]) bg = HIGHLIGHT[highlight]
        bg ??= fillOf(runProp(r, p.styleId, "shd"))
        bg ??= fillOf(paraProp(p.el, "shd"))
        if (!bg && p.inTable) {
          const tc = ancestor(p.el, "w", "tc")
          const tbl = ancestor(p.el, "w", "tbl")
          bg = fillOf(path(tc ?? undefined, ["w", "tcPr"], ["w", "shd"])) ?? fillOf(path(tbl ?? undefined, ["w", "tblPr"], ["w", "shd"]))
          const tblStyle = attr(path(tbl ?? undefined, ["w", "tblPr"], ["w", "tblStyle"]), "w", "val")
          if (!bg && tblStyle && book.chain(tblStyle).some((s) => s.shades)) {
            // The table style fills some cells; which ones depends on its
            // conditional formatting, so the background is not known.
            unknown++
            continue
          }
        }
        bg ??= pageBg
        const size = Number(attr(runProp(r, p.styleId, "sz"), "w", "val") ?? 20)
        const bold = isOn(runProp(r, p.styleId, "b"))
        const large = size >= 36 || (bold && size >= 28)
        const need = large ? 3 : 4.5
        const ratio = contrastRatioWCAG(`#${fg}`, `#${bg}`)
        if (ratio >= need) continue
        const key = `${fg.toUpperCase()}|${bg.toUpperCase()}|${need}`
        const hit = pairs.get(key)
        if (hit) hit.count++
        else pairs.set(key, { fg: fg.toUpperCase(), bg: bg.toUpperCase(), ratio, need, count: 1, first: p })
      }
    }
    const findings: Finding[] = [...pairs.values()]
      .sort((a, b) => a.ratio - b.ratio)
      .map((x) => ({
        severity: "error" as const,
        message: `${x.need === 3 ? "Large text" : "Text"} in #${x.fg} on #${x.bg} has a contrast ratio of ${x.ratio.toFixed(2)}:1; it needs at least ${x.need}:1.${x.count > 1 ? ` ${x.count} runs of text use this pair; the first is shown.` : ""}`,
        location: where(x.first),
      }))
    const skipped = unknown ? ` ${plural(unknown, "run")} in tables with a shaded table style could not be measured.` : ""
    checks.push(
      makeCheck(
        CHECKS.contrast,
        findings,
        coloured
          ? `${plural(coloured, "run")} of text with a fixed colour measured against ${background ? "the page colour" : "white"} or its shading.${skipped}`
          : "No text uses a fixed colour; automatic and theme colours are not measured.",
        coloured > 0,
      ),
    )
  }

  // Put the checks in reading order of importance: document-level first.
  const order = Object.values(CHECKS).map((c) => c.id)
  checks.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))

  const pictureCount = objects.filter((o) => ["picture", "chart", "SmartArt", "group", "canvas", "embedded object"].includes(o.kind)).length
  const facts = [
    { label: "Pages", value: `${pages}${Number.isFinite(appPages) && appPages > 0 ? "" : " (estimated)"}` },
    { label: "Words", value: words.toLocaleString("en-GB") },
    { label: "Headings", value: String(headings.length) },
    { label: "Pictures and charts", value: String(pictureCount) },
    { label: "Tables", value: String(topTables.length) },
  ]
  return { kind: "docx", fileName, facts, checks, counts: countSeverities(checks) }
}
