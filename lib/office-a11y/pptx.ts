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
  attr,
  child,
  children,
  descendants,
  drawingText,
  excerpt,
  flattenAlternateContent,
  inNs,
  isEl,
  isMarkedDecorative,
  path,
  plural,
  resolvePartName,
} from "./xml"

// PowerPoint checks. Slides are read in presentation order, which comes from
// p:sldIdLst in ppt/presentation.xml and its relationships, never from the
// slide file names (slide7.xml can be the second slide). Within a slide the
// order of shapes in p:spTree is the reading order screen readers follow.

const CHECKS = {
  title: {
    id: "pptx-title",
    title: "Presentation title",
    criterion: "2.4.2",
    fix: "Select File > Info. Under Properties on the right, select Title, type a title that describes the presentation, then save. On a Mac, select File > Properties > Summary.",
  },
  slideTitles: {
    id: "pptx-slide-titles",
    title: "Every slide has a title",
    criterion: "2.4.2",
    fix: "Select Home > Layout and choose a layout with a title, then type the title. To give a slide a title without showing it, select Review > Check Accessibility, then on the Accessibility tab choose Slide Title > Add Hidden Slide Title.",
  },
  uniqueTitles: {
    id: "pptx-unique-titles",
    title: "Slide titles are unique",
    criterion: "2.4.6",
    fix: "Give each slide its own title. When a topic runs over several slides, add \"(1 of 2)\", \"(2 of 2)\" or \"(continued)\" so people can tell them apart in the slide list.",
  },
  altText: {
    id: "pptx-alt-text",
    title: "Alt text on pictures, charts, SmartArt and groups",
    criterion: "1.1.1",
    fix: "Right-click the object and select View Alt Text. Describe what it shows or means in a sentence or two, or tick Mark as decorative if it adds nothing. For a group, select the group itself, not a shape inside it.",
  },
  altQuality: {
    id: "pptx-alt-quality",
    title: "Alt text quality",
    criterion: "1.1.1",
    fix: "Right-click the object, select View Alt Text and rewrite the description: say what the picture means on this slide, without starting with \"image of\", and delete any automatically generated note.",
  },
  tableHeaders: {
    id: "pptx-table-headers",
    title: "Table header rows",
    criterion: "1.3.1",
    fix: "Select the table, then on the Table Design tab tick Header Row, and put column headings in the first row.",
  },
  tableStructure: {
    id: "pptx-table-structure",
    title: "Merged cells",
    criterion: "1.3.1",
    fix: "Select the merged cell and choose Layout > Split Cells, or restructure the table so each cell holds one piece of data.",
  },
  readingOrder: {
    id: "pptx-reading-order",
    title: "Reading order",
    criterion: "1.3.2",
    fix: "Select Review > Check Accessibility > Reading Order Pane and drag the title to the top, then the rest in the order they should be read. You can also use Home > Arrange > Selection Pane, which lists shapes in reverse, last read at the top; rename shapes there so the order is easy to check.",
  },
  language: {
    id: "pptx-language",
    title: "Slide language",
    criterion: "3.1.1",
    fix: "Select the text (click in a text box and press Ctrl+A, or select every slide in the slide list), then select Review > Language > Set Proofing Language, choose the language and select OK.",
  },
  links: {
    id: "pptx-link-text",
    title: "Link text",
    criterion: "2.4.4",
    fix: "Right-click the link and select Edit Link. Change Text to display to words that say where the link goes. For a linked picture, add alt text that names the destination.",
  },
  media: {
    id: "pptx-media",
    title: "Audio and video",
    criterion: "1.2.2",
    fix: "For video, select it, then Playback > Insert Captions and choose a caption file (.vtt). For audio, put a transcript in the speaker notes or on a slide. Describe important visual content in the narration or the slide text.",
  },
  hiddenSlides: {
    id: "pptx-hidden-slides",
    title: "Hidden slides",
    criterion: "1.3.2",
    fix: "Delete hidden slides you no longer need before sharing the file. To show one again, right-click its thumbnail and clear Hide Slide.",
  },
} satisfies Record<string, CheckDefinition>

export const POWERPOINT_CHECK_IDS = Object.values(CHECKS).map((c) => c.id)

type ShapeKind = "title" | "text" | "picture" | "chart" | "SmartArt" | "table" | "group" | "video" | "audio" | "object" | "connector" | "other"

interface Shape {
  el: Element
  kind: ShapeKind
  name: string
  alt: string
  decorative: boolean
  hidden: boolean
  placeholder: string | null
  text: string
  /** Covered by alt text (or a decorative flag) on a group that contains it. */
  coveredByGroup: boolean
  linkRid: string | null
}

const NV: Record<string, string> = {
  sp: "nvSpPr",
  pic: "nvPicPr",
  graphicFrame: "nvGraphicFramePr",
  grpSp: "nvGrpSpPr",
  cxnSp: "nvCxnSpPr",
}

const SHAPE_ELEMENTS = new Set(["sp", "pic", "graphicFrame", "grpSp", "cxnSp"])

/** Names PowerPoint and Google Slides give shapes automatically. */
const DEFAULT_NAME = /^(?:[A-Za-z][A-Za-z :-]*\s\d+|Google Shape;\d+;\S*|\d+)$/

function readShape(el: Element, coveredByGroup: boolean): Shape {
  const local = el.localName
  const nv = child(el, "p", NV[local] ?? "")
  const cNvPr = child(nv, "p", "cNvPr")
  const nvPr = child(nv, "p", "nvPr")
  const ph = child(nvPr, "p", "ph")
  const phType = ph ? ph.getAttribute("type") ?? "body" : null
  let kind: ShapeKind = "other"
  let text = ""
  if (local === "sp") {
    const body = child(el, "p", "txBody")
    text = body ? drawingText(body) : ""
    kind = phType === "title" || phType === "ctrTitle" ? "title" : "text"
  } else if (local === "pic") {
    if (child(nvPr, "a", "videoFile") || child(nvPr, "a", "quickTimeFile")) kind = "video"
    else if (child(nvPr, "a", "audioFile") || child(nvPr, "a", "wavAudioFile") || child(nvPr, "a", "audioCd")) kind = "audio"
    else if (descendants(nvPr as Element, "p14", "media").length) kind = "video"
    else kind = "picture"
  } else if (local === "graphicFrame") {
    const uri = path(el, ["a", "graphic"], ["a", "graphicData"])?.getAttribute("uri") ?? ""
    if (uri.endsWith(GRAPHIC_URI.table)) kind = "table"
    else if (uri.endsWith(GRAPHIC_URI.chart) || uri.endsWith(GRAPHIC_URI.chartex)) kind = "chart"
    else if (uri.endsWith(GRAPHIC_URI.diagram)) kind = "SmartArt"
    else kind = "object"
  } else if (local === "grpSp") {
    kind = "group"
  } else if (local === "cxnSp") {
    kind = "connector"
  }
  return {
    el,
    kind,
    name: cNvPr?.getAttribute("name") ?? "",
    alt: altTextOf(cNvPr),
    decorative: isMarkedDecorative(cNvPr),
    hidden: ["1", "true"].includes(cNvPr?.getAttribute("hidden") ?? ""),
    placeholder: phType,
    text,
    coveredByGroup,
    linkRid: attr(child(cNvPr, "a", "hlinkClick"), "r", "id"),
  }
}

/** Every shape on the slide, groups included, in tree order. */
function allShapes(spTree: Element): Shape[] {
  const out: Shape[] = []
  const walk = (parent: Element, covered: boolean) => {
    for (const el of children(parent)) {
      if (!inNs(el, "p") || !SHAPE_ELEMENTS.has(el.localName)) continue
      const shape = readShape(el, covered)
      out.push(shape)
      if (shape.kind === "group") walk(el, covered || !!shape.alt || shape.decorative)
    }
  }
  walk(spTree, false)
  return out
}

function label(kind: ShapeKind): string {
  switch (kind) {
    case "SmartArt":
      return "SmartArt graphic"
    case "object":
      return "Embedded object"
    default:
      return kind[0].toUpperCase() + kind.slice(1)
  }
}

/** The kind as a noun inside a sentence: "picture", "SmartArt graphic". */
function noun(kind: ShapeKind): string {
  const l = label(kind)
  return kind === "SmartArt" ? l : l.toLowerCase()
}

interface Slide {
  number: number
  hidden: boolean
  title: string
  hasTitleShape: boolean
  shapes: Shape[]
  topLevel: Shape[]
  doc: Document
  part: string
}

export function checkPresentation(pkg: OfficePackage, fileName: string): OfficeReport {
  const pres = pkg.xml(pkg.mainPart)
  const root = pres?.documentElement ?? null
  const presRels = pkg.rels(pkg.mainPart)

  const slides: Slide[] = []
  for (const sldId of children(path(root, ["p", "sldIdLst"]), "p", "sldId")) {
    const rel = presRels.get(attr(sldId, "r", "id") ?? "")
    if (!rel || rel.external) continue
    const part = resolvePartName(pkg.mainPart, rel.target)
    const doc = pkg.xml(part)
    if (!doc) continue
    flattenAlternateContent(doc)
    const sld = doc.documentElement
    const spTree = path(sld, ["p", "cSld"], ["p", "spTree"])
    if (!spTree) continue
    const shapes = allShapes(spTree)
    const topLevel = shapes.filter((s) => s.el.parentNode === spTree)
    const titleShape = shapes.find((s) => s.kind === "title")
    slides.push({
      number: slides.length + 1,
      hidden: ["0", "false"].includes(sld.getAttribute("show") ?? ""),
      title: (titleShape?.text ?? "").replace(/\s+/g, " ").trim(),
      hasTitleShape: !!titleShape,
      shapes,
      topLevel,
      doc,
      part,
    })
  }

  const slideLabel = (s: Slide) => `Slide ${s.number}${s.title ? ` ("${excerpt(s.title, 50)}")` : " (no title)"}${s.hidden ? ", hidden" : ""}`
  const shapeLabel = (s: Slide, sh: Shape) => `${slideLabel(s)}, ${noun(sh.kind)} "${sh.name || "unnamed"}"`

  const checks: CheckResult[] = []

  // ---- Presentation title
  {
    const core = pkg.xml("docProps/core.xml")
    const title = core ? (descendants(core, "dc", "title")[0]?.textContent ?? "").trim() : ""
    const findings: Finding[] = []
    if (!title) {
      findings.push({
        severity: "error",
        message: "The presentation has no title in its properties. Screen readers, browsers and PDF exports show the file name instead.",
        location: "File > Info > Properties",
      })
    } else {
      const problem = titleProblem(title, fileName)
      if (problem) findings.push({ severity: "warning", message: problem, location: "File > Info > Properties" })
    }
    checks.push(makeCheck(CHECKS.title, findings, title ? `Title: "${excerpt(title, 80)}"` : "No title is set."))
  }

  // ---- Slide titles
  {
    const findings: Finding[] = []
    for (const s of slides) {
      if (s.title) continue
      findings.push({
        severity: "error",
        message: s.hasTitleShape
          ? "The slide's title placeholder is empty. Screen reader users moving between slides hear no title for it."
          : "The slide has no title. Screen reader users moving between slides, and anyone using the slide list, cannot tell what it is about.",
        location: slideLabel(s),
      })
    }
    checks.push(
      makeCheck(
        CHECKS.slideTitles,
        findings,
        slides.length
          ? `${slides.length - findings.length} of ${slides.length} ${slides.length === 1 ? "slide has" : "slides have"} a title.`
          : "The presentation has no slides.",
        slides.length > 0,
      ),
    )
  }

  // ---- Unique titles
  {
    const groups = new Map<string, Slide[]>()
    for (const s of slides) {
      if (!s.title) continue
      const key = s.title.toLowerCase().replace(/[\s.,:;!?]+$/g, "").replace(/\s+/g, " ")
      groups.set(key, [...(groups.get(key) ?? []), s])
    }
    const findings: Finding[] = []
    for (const group of groups.values()) {
      if (group.length < 2) continue
      findings.push({
        severity: "warning",
        message: `${group.length} slides share the title "${excerpt(group[0].title, 60)}", so they sound the same in the slide list.`,
        location: `Slides ${group.map((s) => s.number).join(", ")}`,
      })
    }
    const titled = slides.filter((s) => s.title).length
    checks.push(
      makeCheck(
        CHECKS.uniqueTitles,
        findings,
        titled < 2 ? "Fewer than two titled slides to compare." : findings.length ? `${plural(findings.length, "title")} used on more than one slide.` : "Every slide title is different.",
        titled >= 2,
      ),
    )
  }

  // ---- Alt text
  const needsAlt = (sh: Shape) => ["picture", "chart", "SmartArt", "group", "object", "video", "audio"].includes(sh.kind)
  {
    const findings: Finding[] = []
    let total = 0
    let described = 0
    let decorative = 0
    for (const s of slides) {
      for (const sh of s.shapes) {
        if (!needsAlt(sh) || sh.hidden || sh.coveredByGroup) continue
        total++
        if (sh.decorative) {
          decorative++
          continue
        }
        if (sh.alt) {
          described++
          continue
        }
        findings.push({
          severity: sh.kind === "group" ? "warning" : "error",
          message:
            sh.kind === "group"
              ? "This group has no alt text. Describe the group as a whole, or mark it decorative; pictures inside it are checked on their own."
              : sh.kind === "chart"
                ? "This chart has no alt text. Say what the chart shows and its key figures, in the alt text or on the slide."
                : `This ${noun(sh.kind)} has no alt text and is not marked as decorative.`,
          location: shapeLabel(s, sh),
        })
      }
    }
    checks.push(
      makeCheck(
        CHECKS.altText,
        findings,
        total ? `${plural(total, "object")}: ${described} with alt text, ${decorative} marked decorative, ${total - described - decorative} missing.` : "No pictures, charts, SmartArt or groups on the slides.",
        total > 0,
      ),
    )

    const quality: Finding[] = []
    let reviewed = 0
    for (const s of slides) {
      for (const sh of s.shapes) {
        if (!needsAlt(sh) || !sh.alt || sh.decorative) continue
        reviewed++
        const problem = altTextProblem(sh.alt)
        if (problem) quality.push({ severity: problem === "auto" ? "warning" : "tip", message: altTextMessage(problem, sh.alt), location: shapeLabel(s, sh) })
      }
    }
    checks.push(
      makeCheck(
        CHECKS.altQuality,
        quality,
        reviewed ? altQualitySummary(reviewed, quality.length) : "No alt text to review.",
        reviewed > 0,
      ),
    )
  }

  // ---- Tables
  {
    const headerFindings: Finding[] = []
    const structureFindings: Finding[] = []
    let tables = 0
    for (const s of slides) {
      for (const sh of s.shapes) {
        if (sh.kind !== "table") continue
        tables++
        const tbl = descendants(sh.el, "a", "tbl")[0]
        if (!tbl) continue
        const rows = children(tbl, "a", "tr")
        const cols = children(child(tbl, "a", "tblGrid"), "a", "gridCol").length
        const firstRow = ["1", "true"].includes(child(tbl, "a", "tblPr")?.getAttribute("firstRow") ?? "")
        const head = rows[0] ? children(rows[0], "a", "tc").map((tc) => drawingText(tc).trim()).filter(Boolean).join(" | ") : ""
        const where = `${slideLabel(s)}, table "${sh.name || "unnamed"}"${head ? `, first row "${excerpt(head, 50)}"` : ""}`
        if (!firstRow) {
          headerFindings.push(
            rows.length < 2 || cols < 2
              ? {
                  severity: "tip",
                  message: `This table has ${rows.length < 2 ? "one row" : "one column"}, so it may be there for layout. If it holds data, tick Header Row.`,
                  location: where,
                }
              : {
                  severity: "error",
                  message: "The table has no header row, so screen readers cannot say which column a cell belongs to.",
                  location: where,
                },
          )
        }
        let merged = 0
        for (const tc of descendants(tbl, "a", "tc")) {
          const spans = Number(tc.getAttribute("gridSpan") ?? 1) > 1 || Number(tc.getAttribute("rowSpan") ?? 1) > 1
          if (spans || ["1", "true"].includes(tc.getAttribute("hMerge") ?? "") || ["1", "true"].includes(tc.getAttribute("vMerge") ?? "")) merged++
        }
        if (merged) {
          structureFindings.push({
            severity: "warning",
            message: `The table has ${plural(merged, "merged cell")}. Merged cells make it hard for screen reader users to tell which row and column a cell belongs to.`,
            location: where,
          })
        }
      }
    }
    checks.push(
      makeCheck(
        CHECKS.tableHeaders,
        headerFindings,
        tables ? `${plural(tables, "table")}, ${tables - headerFindings.length} with a header row.` : "No tables on the slides.",
        tables > 0,
      ),
    )
    checks.push(
      makeCheck(
        CHECKS.tableStructure,
        structureFindings,
        tables ? (structureFindings.length ? "Some tables have merged cells." : "No merged cells.") : "No tables on the slides.",
        tables > 0,
      ),
    )
  }

  // ---- Reading order
  {
    const findings: Finding[] = []
    for (const s of slides) {
      const order = s.topLevel.filter((sh) => !sh.decorative && !sh.hidden && sh.kind !== "connector")
      const titleIndex = order.findIndex((sh) => sh.kind === "title")
      if (titleIndex > 0) {
        const first = order[0]
        findings.push({
          severity: "warning",
          message: `The title is number ${titleIndex + 1} in the reading order. Screen readers read ${noun(first.kind)} "${first.name || "unnamed"}"${titleIndex > 1 ? ` and ${plural(titleIndex - 1, "other shape")}` : ""} before it.`,
          location: slideLabel(s),
        })
      }
      const unnamed = order.filter((sh) => !sh.placeholder && sh.kind !== "title" && (!sh.name.trim() || DEFAULT_NAME.test(sh.name.trim())))
      if (unnamed.length >= 6) {
        findings.push({
          severity: "warning",
          message: `${unnamed.length} shapes have default names such as "${unnamed[0].name || "unnamed"}". With this many shapes, check the reading order; meaningful names make it much easier to check.`,
          location: slideLabel(s),
        })
      }
    }
    checks.push(
      makeCheck(
        CHECKS.readingOrder,
        findings,
        slides.length
          ? findings.length
            ? "Some slides need their reading order checked."
            : "On every slide with a title, the title is read first. Check the order of the rest in the Reading Order pane."
          : "The presentation has no slides.",
        slides.length > 0,
      ),
    )
  }

  // ---- Language
  {
    const defaults: string[] = []
    // Text with no lang of its own falls back to the presentation's default
    // text style, then the slide masters' text styles.
    const collectDefaults = (el: Element | null) => {
      if (!el) return
      for (const def of descendants(el, "a", "defRPr")) {
        const lang = def.getAttribute("lang")
        if (isUsableLanguage(lang)) defaults.push(lang)
      }
    }
    collectDefaults(child(root, "p", "defaultTextStyle"))
    for (const name of pkg.names()) {
      if (/^ppt\/slideMasters\/slideMaster\d+\.xml$/.test(name)) {
        collectDefaults(child(pkg.xml(name)?.documentElement, "p", "txStyles"))
      }
    }
    const used = new Map<string, number>()
    const findings: Finding[] = []
    let textRuns = 0
    for (const s of slides) {
      let unmarked = 0
      for (const r of [...descendants(s.doc, "a", "r"), ...descendants(s.doc, "a", "fld")]) {
        const t = (child(r, "a", "t")?.textContent ?? "").trim()
        if (!t) continue
        textRuns++
        const lang = child(r, "a", "rPr")?.getAttribute("lang")
        if (isUsableLanguage(lang)) used.set(lang, (used.get(lang) ?? 0) + 1)
        else unmarked++
      }
      if (unmarked && !defaults.length) {
        findings.push({
          severity: "error",
          message: `${plural(unmarked, "run")} of text on this slide have no language, and the presentation has no default, so screen readers may use the wrong pronunciation rules.`,
          location: slideLabel(s),
        })
      }
    }
    const top = [...used.entries()].sort((a, b) => b[1] - a[1])
    const fallback = defaults.length ? ` Default: ${defaults[0]}.` : " No default language is set."
    checks.push(
      makeCheck(
        CHECKS.language,
        findings,
        textRuns
          ? `${top.length ? `Text is marked ${top.slice(0, 4).map(([l, n]) => `${l} (${plural(n, "run")})`).join(", ")}.` : "No text is marked with a language."}${fallback} Check that this matches the language the slides are written in.`
          : "No text on the slides.",
        textRuns > 0,
      ),
    )
  }

  // ---- Links
  {
    const findings: Finding[] = []
    let links = 0
    for (const s of slides) {
      const rels = pkg.rels(s.part)
      for (const p of descendants(s.doc, "a", "p")) {
        let current: { rid: string; text: string } | null = null
        const done = (l: { rid: string; text: string } | null) => {
          if (!l) return
          links++
          const problem = linkTextProblem(l.text)
          if (problem) {
            const owner = [...s.shapes].reverse().find((sh) => sh.el.contains(p))
            findings.push({
              severity: problem === "empty" ? "error" : "warning",
              message: linkTextMessage(problem, l.text || rels.get(l.rid)?.target || ""),
              location: owner ? shapeLabel(s, owner) : slideLabel(s),
            })
          }
        }
        for (const r of children(p)) {
          const isRun = isEl(r, "a", "r")
          const rid = isRun ? attr(child(child(r, "a", "rPr"), "a", "hlinkClick"), "r", "id") : null
          const text = isRun ? child(r, "a", "t")?.textContent ?? "" : ""
          if (rid && current && current.rid === rid) current.text += text
          else {
            done(current)
            current = rid ? { rid, text } : null
          }
        }
        done(current)
      }
      for (const sh of s.shapes) {
        if (!sh.linkRid || sh.kind === "text" || sh.kind === "title") continue
        links++
        if (!sh.alt && !sh.text.trim()) {
          findings.push({ severity: "error", message: linkTextMessage("empty", "", true), location: shapeLabel(s, sh) })
        }
      }
    }
    checks.push(
      makeCheck(
        CHECKS.links,
        findings,
        links ? `${plural(links, "link")}, ${links - findings.length} with text that describes the destination.` : "No links on the slides.",
        links > 0,
      ),
    )
  }

  // ---- Audio and video
  {
    const findings: Finding[] = []
    for (const s of slides) {
      for (const sh of s.shapes) {
        if (sh.kind !== "video" && sh.kind !== "audio") continue
        findings.push({
          severity: "warning",
          message:
            sh.kind === "video"
              ? "This slide has a video. This tool cannot see whether captions were added: check it has captions, and that what is shown but not said is described."
              : "This slide has audio. Provide a transcript, for example in the speaker notes, for people who cannot hear it.",
          location: shapeLabel(s, sh),
          criterion: sh.kind === "video" ? "1.2.2" : "1.2.1",
        })
      }
    }
    checks.push(makeCheck(CHECKS.media, findings, findings.length ? `${plural(findings.length, "audio or video clip", "audio and video clips")} to check.` : "No audio or video in the presentation.", findings.length > 0))
  }

  // ---- Hidden slides
  {
    const hidden = slides.filter((s) => s.hidden)
    checks.push(
      makeCheck(
        CHECKS.hiddenSlides,
        hidden.map((s) => ({
          severity: "tip" as const,
          message: "This slide is hidden. It is skipped in a slide show, but it is still in the file, so anyone reading the file with a screen reader, or an export that includes hidden slides, still reaches it.",
          location: slideLabel(s),
        })),
        hidden.length ? `${plural(hidden.length, "hidden slide")}.` : "No hidden slides.",
        hidden.length > 0,
      ),
    )
  }

  const order = Object.values(CHECKS).map((c) => c.id)
  checks.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))

  const count = (kinds: ShapeKind[]) => slides.reduce((n, s) => n + s.shapes.filter((sh) => kinds.includes(sh.kind)).length, 0)
  const facts = [
    { label: "Slides", value: String(slides.length) },
    { label: "Hidden slides", value: String(slides.filter((s) => s.hidden).length) },
    { label: "Pictures and charts", value: String(count(["picture", "chart", "SmartArt"])) },
    { label: "Tables", value: String(count(["table"])) },
    { label: "Audio and video", value: String(count(["audio", "video"])) },
  ]
  return { kind: "pptx", fileName, facts, checks, counts: countSeverities(checks) }
}
