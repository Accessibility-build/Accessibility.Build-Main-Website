/**
 * Basic PDF accessibility checks that run entirely in the browser with pdf.js.
 *
 * Public bodies post hundreds of agendas, minutes and forms, often with
 * personal data in them, so the file never leaves the visitor's machine: pdf.js
 * parses it from an ArrayBuffer and the worker is served from our own origin.
 *
 * These are machine checks of document structure, the things a person cannot
 * see by looking at the page (tags, language, title, alternative text present,
 * field names). Passing them does not make a PDF accessible: reading order,
 * the quality of alt text and table structure still need a human.
 */

export type CheckOutcome = "pass" | "fail" | "warn" | "na"

export interface PdfCheck {
  id: string
  label: string
  outcome: CheckOutcome
  /** What we found, in one or two sentences. */
  detail: string
  /** How to fix it, when it is not a pass. */
  fix?: string
  wcag: string[]
}

export interface PdfReport {
  fileName: string
  fileSize: number
  pages: number
  /** Set when the file could not be read at all. */
  error?: string
  checks: PdfCheck[]
  verdict: "fail" | "warn" | "pass" | "error"
  /** Only the first MAX_PAGES pages are scanned for text, structure and fields. */
  pagesScanned: number
}

const MAX_PAGES = 300
const HEADING = /^H[1-6]?$/

/* The pdf.js types are loose here on purpose: the struct tree and annotation
   shapes are not part of the public type definitions. */
interface StructNode {
  role?: string
  alt?: string
  type?: string
  children?: StructNode[]
}

interface Counts {
  figures: number
  figuresNoAlt: number
  headings: number
  tables: number
  tablesNoHeader: number
  structElements: number
}

function walk(node: StructNode, counts: Counts) {
  if (node.type === "content" || node.type === "object" || node.type === "annotation") return
  const role = node.role ?? ""
  if (role && role !== "Root") counts.structElements++
  if (role === "Figure") {
    counts.figures++
    if (!node.alt || !node.alt.trim()) counts.figuresNoAlt++
  }
  if (HEADING.test(role)) counts.headings++
  if (role === "Table") {
    counts.tables++
    if (!hasRole(node, "TH")) counts.tablesNoHeader++
  }
  for (const child of node.children ?? []) walk(child, counts)
}

function hasRole(node: StructNode, role: string): boolean {
  if (node.role === role) return true
  return (node.children ?? []).some((c) => hasRole(c, role))
}

function looksLikeFileName(title: string): boolean {
  return /\.(docx?|pdf|pptx?|xlsx?|indd|rtf)$/i.test(title) || /^microsoft (word|powerpoint|excel) - /i.test(title) || /^untitled/i.test(title)
}

function plural(n: number, one: string, many = `${one}s`) {
  return `${n.toLocaleString("en-US")} ${n === 1 ? one : many}`
}

function pageList(pages: number[]): string {
  const shown = pages.slice(0, 8).join(", ")
  return pages.length > 8 ? `${shown} and ${pages.length - 8} more` : shown
}

type PdfJs = typeof import("pdfjs-dist/legacy/build/pdf.mjs")
let pdfjsPromise: Promise<{ pdfjs: PdfJs; worker: InstanceType<PdfJs["PDFWorker"]> }> | null = null

/** One pdf.js module and one worker for the whole session, shared by every file in a batch. */
function loadPdfJs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
      // Served from our origin by public/vendor; see scripts/copy-pdf-worker.mjs.
      pdfjs.GlobalWorkerOptions.workerSrc = `/vendor/pdfjs/pdf.worker.min.mjs?v=${pdfjs.version}`
      return { pdfjs, worker: new pdfjs.PDFWorker() }
    })
  }
  return pdfjsPromise
}

export async function checkPdf(file: File): Promise<PdfReport> {
  const base = { fileName: file.name, fileSize: file.size, pages: 0, pagesScanned: 0, checks: [] as PdfCheck[] }
  const { pdfjs, worker } = await loadPdfJs()
  const data = new Uint8Array(await file.arrayBuffer())

  let doc: Awaited<ReturnType<PdfJs["getDocument"]>["promise"]>
  try {
    doc = await pdfjs.getDocument({
      data,
      worker,
      isEvalSupported: false,
      disableFontFace: true,
      useSystemFonts: false,
      stopAtErrors: false,
    }).promise
  } catch (err) {
    const name = (err as { name?: string })?.name
    if (name === "PasswordException") {
      return {
        ...base,
        verdict: "error",
        error:
          "This PDF needs a password to open. A document posted for the public should open without one, and a password blocks many screen readers.",
      }
    }
    return { ...base, verdict: "error", error: "This file could not be read as a PDF. It may be damaged or not a PDF." }
  }

  try {
    const pages = doc.numPages
    const scan = Math.min(pages, MAX_PAGES)
    const [meta, markInfo, viewerPrefs, outline, permissions] = await Promise.all([
      doc.getMetadata().catch(() => null),
      doc.getMarkInfo().catch(() => null),
      doc.getViewerPreferences().catch(() => null),
      doc.getOutline().catch(() => null),
      doc.getPermissions().catch(() => null),
    ])
    const info = (meta?.info ?? {}) as Record<string, unknown>
    const xmpTitle = meta?.metadata?.get?.("dc:title") as string | undefined

    const counts: Counts = { figures: 0, figuresNoAlt: 0, headings: 0, tables: 0, tablesNoHeader: 0, structElements: 0 }
    const textless: number[] = []
    let hasTree = false
    let chars = 0
    let fields = 0
    let fieldsNoName = 0

    for (let n = 1; n <= scan; n++) {
      const page = await doc.getPage(n)
      const [text, tree, annots] = await Promise.all([
        page.getTextContent().catch(() => null),
        page.getStructTree().catch(() => null) as Promise<StructNode | null>,
        page.getAnnotations({ intent: "display" }).catch(() => [] as unknown[]),
      ])
      const pageChars = (text?.items ?? []).reduce(
        (sum: number, item: unknown) => sum + (((item as { str?: string }).str ?? "").trim().length),
        0,
      )
      chars += pageChars
      if (pageChars === 0) textless.push(n)
      if (tree) {
        hasTree = true
        walk(tree, counts)
      }
      for (const a of annots as { subtype?: string; fieldType?: string; alternativeText?: string; hidden?: boolean; fieldName?: string }[]) {
        if (a.subtype !== "Widget" || a.hidden) continue
        // Push buttons with no action are often decoration; count real inputs.
        fields++
        if (!a.alternativeText || !a.alternativeText.trim()) fieldsNoName++
      }
      page.cleanup()
    }

    const checks: PdfCheck[] = []

    // 1. Real text, not a scan.
    if (chars === 0) {
      checks.push({
        id: "text",
        label: "Real, selectable text",
        outcome: "fail",
        detail: "No text was found on any page. This looks like a scanned image, which a screen reader cannot read.",
        fix: "Run text recognition (OCR), then tag the result, or better, export a new PDF from the original Word or other source file.",
        wcag: ["1.1.1", "1.4.5"],
      })
    } else if (textless.length > 0) {
      checks.push({
        id: "text",
        label: "Real, selectable text",
        outcome: "warn",
        detail: `${plural(textless.length, "page")} had no text: ${pageList(textless)}. They may be scanned images, or simply blank or picture-only pages.`,
        fix: "Check those pages. If they contain text as an image, run OCR or replace them from the source file.",
        wcag: ["1.1.1", "1.4.5"],
      })
    } else {
      checks.push({ id: "text", label: "Real, selectable text", outcome: "pass", detail: "Every page checked has real text.", wcag: ["1.1.1", "1.4.5"] })
    }

    // 2. Tagged.
    const tagged = Boolean(markInfo?.Marked) && hasTree
    checks.push(
      tagged
        ? {
            id: "tags",
            label: "Tagged PDF",
            outcome: "pass",
            detail: `The document has a tag tree (${plural(counts.structElements, "tagged element")}), so assistive technology can read its structure.`,
            wcag: ["1.3.1", "4.1.2"],
          }
        : {
            id: "tags",
            label: "Tagged PDF",
            outcome: "fail",
            detail: hasTree
              ? "There is a partial tag tree, but the document is not marked as tagged."
              : "The document has no tags, so a screen reader gets one stream of text with no headings, lists, tables or alt text.",
            fix: "Export again from the source with tags on. In Word: File, Save As, PDF, Options, tick Document structure tags for accessibility. In Acrobat Pro: Accessibility, Autotag Document, then check the result.",
            wcag: ["1.3.1", "4.1.2"],
          },
    )

    // 3. Title.
    const title = String(info.Title ?? xmpTitle ?? "").trim()
    checks.push(
      !title
        ? {
            id: "title",
            label: "Document title",
            outcome: "fail",
            detail: "No title is set, so the browser tab and screen reader show the file name instead.",
            fix: "Set a descriptive title in the source file's properties (Word: File, Info, Title) or in Acrobat: File, Properties, Description.",
            wcag: ["2.4.2"],
          }
        : looksLikeFileName(title)
          ? {
              id: "title",
              label: "Document title",
              outcome: "warn",
              detail: `The title is "${title}", which looks like a file name rather than a description.`,
              fix: "Replace it with a title that says what the document is, such as \"City Council Agenda, 3 March 2027\".",
              wcag: ["2.4.2"],
            }
          : { id: "title", label: "Document title", outcome: "pass", detail: `Title: "${title}".`, wcag: ["2.4.2"] },
    )

    // 4. Show title, not file name.
    const displayTitle = Boolean((viewerPrefs as Record<string, unknown> | null)?.DisplayDocTitle)
    checks.push(
      displayTitle
        ? { id: "display-title", label: "Title shown when opened", outcome: "pass", detail: "Readers are told to show the title rather than the file name.", wcag: ["2.4.2"] }
        : {
            id: "display-title",
            label: "Title shown when opened",
            outcome: title ? "warn" : "na",
            detail: title
              ? "The document doesn't ask readers to show its title, so many show the file name instead."
              : "Set a title first.",
            fix: title ? "In Acrobat: File, Properties, Initial View, Show: Document Title. Word does this for you when the title is set." : undefined,
            wcag: ["2.4.2"],
          },
    )

    // 5. Language.
    const lang = String(info.Language ?? "").trim()
    checks.push(
      lang
        ? { id: "lang", label: "Document language", outcome: "pass", detail: `Language: ${lang}.`, wcag: ["3.1.1"] }
        : {
            id: "lang",
            label: "Document language",
            outcome: "fail",
            detail: "No language is set, so a screen reader may read the text with the wrong pronunciation.",
            fix: "Set the language in Acrobat: File, Properties, Advanced, Language. In Word, set the proofing language before exporting.",
            wcag: ["3.1.1"],
          },
    )

    // 6 to 8 need tags.
    if (!tagged) {
      checks.push({
        id: "structure",
        label: "Headings, alt text and tables",
        outcome: "na",
        detail: "Can't be checked until the document is tagged.",
        wcag: ["1.1.1", "1.3.1"],
      })
    } else {
      checks.push(
        counts.headings > 0
          ? { id: "headings", label: "Headings", outcome: "pass", detail: `${plural(counts.headings, "heading")} tagged.`, wcag: ["1.3.1", "2.4.6"] }
          : {
              id: "headings",
              label: "Headings",
              outcome: pages >= 3 ? "warn" : "na",
              detail:
                pages >= 3
                  ? "No headings are tagged, so screen reader users can't jump between sections."
                  : "No headings, which is fine for a short document without sections.",
              fix: pages >= 3 ? "Use real heading styles (Heading 1, Heading 2) in the source file, not bold text, then export again." : undefined,
              wcag: ["1.3.1", "2.4.6"],
            },
      )

      checks.push(
        counts.figures === 0
          ? { id: "alt", label: "Alternative text on images", outcome: "na", detail: "No tagged images found.", wcag: ["1.1.1"] }
          : counts.figuresNoAlt > 0
            ? {
                id: "alt",
                label: "Alternative text on images",
                outcome: "fail",
                detail: `${plural(counts.figuresNoAlt, "image")} of ${counts.figures} ${counts.figuresNoAlt === 1 ? "has" : "have"} no alternative text.`,
                fix: "Add alt text in the source file (right-click the image, View Alt Text) and export again. Mark purely decorative images as decorative so they are skipped.",
                wcag: ["1.1.1"],
              }
            : {
                id: "alt",
                label: "Alternative text on images",
                outcome: "pass",
                detail: `${counts.figures === 1 ? "The image has" : `All ${plural(counts.figures, "image")} have`} alternative text. Check that it describes each image usefully.`,
                wcag: ["1.1.1"],
              },
      )

      if (counts.tables > 0) {
        checks.push(
          counts.tablesNoHeader > 0
            ? {
                id: "tables",
                label: "Table headers",
                outcome: "warn",
                detail: `${plural(counts.tablesNoHeader, "table")} of ${counts.tables} ${counts.tablesNoHeader === 1 ? "has" : "have"} no header cells.`,
                fix: "Mark the header row in the source (Word: Table Properties, Row, Repeat as header row) so each cell is read with its column name.",
                wcag: ["1.3.1"],
              }
            : { id: "tables", label: "Table headers", outcome: "pass", detail: counts.tables === 1 ? "The table has header cells." : `All ${plural(counts.tables, "table")} have header cells.`, wcag: ["1.3.1"] },
        )
      }
    }

    // 9. Bookmarks on long documents.
    if (pages >= 10) {
      const bookmarks = outline?.length ?? 0
      checks.push(
        bookmarks > 0
          ? { id: "bookmarks", label: "Bookmarks", outcome: "pass", detail: `${plural(bookmarks, "top-level bookmark")}.`, wcag: ["2.4.5"] }
          : {
              id: "bookmarks",
              label: "Bookmarks",
              outcome: "warn",
              detail: `This ${pages}-page document has no bookmarks to help people move around it.`,
              fix: "In Word: File, Save As, PDF, Options, Create bookmarks using Headings.",
              wcag: ["2.4.5"],
            },
      )
    }

    // 10. Form fields.
    if (fields > 0) {
      checks.push(
        fieldsNoName > 0
          ? {
              id: "fields",
              label: "Form field names",
              outcome: "fail",
              detail: `${plural(fieldsNoName, "form field")} of ${fields} ${fieldsNoName === 1 ? "has" : "have"} no name (tooltip), so a screen reader announces only "edit text".`,
              fix: "In Acrobat: Prepare Form, open each field's Properties and fill in Tooltip with the visible label.",
              wcag: ["4.1.2", "3.3.2"],
            }
          : { id: "fields", label: "Form field names", outcome: "pass", detail: fields === 1 ? "The form field has a name." : `All ${plural(fields, "form field")} have names.`, wcag: ["4.1.2", "3.3.2"] },
      )
    }
    if (info.IsXFAPresent) {
      checks.push({
        id: "xfa",
        label: "Dynamic (XFA) form",
        outcome: "warn",
        detail: "This is an XFA form, which many browsers and screen readers can't open at all.",
        fix: "Rebuild it as a standard (AcroForm) PDF form or as an accessible web form.",
        wcag: ["4.1.2"],
      })
    }

    // 11. Security that blocks assistive technology.
    if (Array.isArray(permissions) && !permissions.includes(pdfjs.PermissionFlag.COPY_FOR_ACCESSIBILITY)) {
      checks.push({
        id: "security",
        label: "Security settings",
        outcome: "warn",
        detail: "Security settings deny content access for accessibility. Some older screen readers respect this and won't read the document.",
        fix: "Remove the restriction, or allow text access for screen reader devices, in the security settings.",
        wcag: ["4.1.2"],
      })
    }

    const verdict = checks.some((c) => c.outcome === "fail") ? "fail" : checks.some((c) => c.outcome === "warn") ? "warn" : "pass"
    return { ...base, pages, pagesScanned: scan, checks, verdict }
  } finally {
    await doc.destroy().catch(() => undefined)
  }
}
