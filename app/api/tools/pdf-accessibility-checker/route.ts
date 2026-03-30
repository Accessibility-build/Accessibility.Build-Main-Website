import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { PDFDocument } from "pdf-lib"
// pdfjs-dist loaded dynamically inside the handler to work with serverExternalPackages

export const runtime = "nodejs"
export const maxDuration = 60

interface PDFCheck {
  id: string
  category: "structure" | "text" | "navigation" | "metadata" | "images"
  name: string
  description: string
  wcagCriteria: string
  severity: "critical" | "serious" | "moderate" | "minor"
  passed: boolean
  details: string
}

interface PDFAnalysisResult {
  fileName: string
  fileSize: number
  pageCount: number
  checks: PDFCheck[]
  score: number
  summary: {
    total: number
    passed: number
    failed: number
    critical: number
    serious: number
    moderate: number
    minor: number
  }
  aiAnalysis?: {
    overview: string
    topIssues: Array<{ issue: string; fix: string; priority: string }>
    recommendation: string
  }
}

// Helper to safely traverse PDF dictionary objects from pdf-lib's internal context
function getFromDict(dict: any, key: string): any {
  try {
    if (!dict) return undefined
    // pdf-lib PDFDict
    if (typeof dict.get === "function") {
      return dict.get(dict.context?.obj?.(key) ?? key)
    }
    if (typeof dict.lookup === "function") {
      return dict.lookup(key)
    }
    return undefined
  } catch {
    return undefined
  }
}

// Count structure tree elements recursively
function countStructureElements(
  node: any,
  context: any,
  counts: Record<string, number>,
  depth = 0
): void {
  if (!node || depth > 50) return
  try {
    const resolved = context && typeof node === "object" && "objectNumber" in node
      ? context.lookup(node)
      : node

    if (!resolved || typeof resolved !== "object") return

    // Get the structure type (S entry)
    let sType: string | undefined
    if (typeof resolved.get === "function") {
      const sEntry = resolved.get(context?.obj?.("/S") ?? "/S") ?? resolved.get("S")
      if (sEntry) {
        const sVal = typeof sEntry === "object" && "decodedValue" in sEntry
          ? sEntry.decodedValue?.()
          : sEntry?.toString?.()
        if (sVal) {
          const typeName = sVal.replace(/^\//, "")
          counts[typeName] = (counts[typeName] || 0) + 1
        }
      }
    }

    // Traverse children (K entry)
    let kids: any
    if (typeof resolved.get === "function") {
      kids = resolved.get(context?.obj?.("/K") ?? "/K") ?? resolved.get("K")
    }
    if (kids) {
      const resolvedKids = context && typeof kids === "object" && "objectNumber" in kids
        ? context.lookup(kids)
        : kids
      if (resolvedKids && typeof resolvedKids === "object" && typeof resolvedKids.size === "function") {
        // It's a PDFArray
        const size = resolvedKids.size()
        for (let i = 0; i < Math.min(size, 500); i++) {
          const child = resolvedKids.get(i)
          countStructureElements(child, context, counts, depth + 1)
        }
      } else if (resolvedKids && typeof resolvedKids === "object") {
        // Single child dict
        countStructureElements(resolvedKids, context, counts, depth + 1)
      }
    }
  } catch {
    // Skip malformed nodes
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to use the PDF Accessibility Checker" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { fileData, fileName, fileSize } = body as {
      fileData: string
      fileName: string
      fileSize: number
    }

    if (!fileData || !fileName) {
      return NextResponse.json(
        { error: "Please upload a PDF file" },
        { status: 400 }
      )
    }

    if (fileSize > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "PDF file size must be under 10MB" },
        { status: 400 }
      )
    }

    // Decode base64 PDF
    const base64Data = fileData.replace(/^data:application\/pdf;base64,/, "")
    const pdfBytes = Buffer.from(base64Data, "base64")

    // --- Parse with pdf-lib for structural analysis ---
    let pdfDoc: PDFDocument
    try {
      pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
    } catch {
      return NextResponse.json(
        { error: "Could not parse the PDF file. It may be corrupted or password-protected." },
        { status: 422 }
      )
    }

    // --- Parse with pdfjs-dist for text extraction and metadata ---
    // Dynamic import ensures serverExternalPackages handles it correctly
    let pdfjsDoc: any
    let pdfjsAvailable = true
    try {
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs")
      // Resolve standard font data path for proper text extraction
      const path = await import("path")
      const standardFontDataUrl = path.join(process.cwd(), "node_modules/pdfjs-dist/standard_fonts/")
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(pdfBytes),
        standardFontDataUrl,
        useSystemFonts: true,
      })
      pdfjsDoc = await loadingTask.promise
    } catch (pdfjsErr) {
      console.error("[PDF Checker] pdfjs-dist failed, falling back to pdf-lib only:", pdfjsErr)
      pdfjsAvailable = false
    }

    const pageCount = pdfDoc.getPageCount()
    const checks: PDFCheck[] = []

    // ===== METADATA CHECKS =====
    let info: Record<string, any> = {}
    let xmlMetadata: any = null
    if (pdfjsAvailable && pdfjsDoc) {
      try {
        const pdfMetadata = await pdfjsDoc.getMetadata()
        info = (pdfMetadata?.info || {}) as Record<string, any>
        xmlMetadata = pdfMetadata?.metadata
      } catch {
        // Fall back to pdf-lib metadata below
      }
    }

    // 1. Document Title
    const title = info.Title || xmlMetadata?.get("dc:title") || pdfDoc.getTitle() || ""
    const hasTitle = typeof title === "string" && title.trim().length > 0
    checks.push({
      id: "doc-title",
      category: "metadata",
      name: "Document Title",
      description: "PDF must have a descriptive title set in document properties",
      wcagCriteria: "WCAG 2.4.2 (Page Titled)",
      severity: "serious",
      passed: hasTitle,
      details: hasTitle
        ? `Title: "${title}"`
        : "No document title found. Screen readers announce the filename instead, which is often meaningless.",
    })

    // 2. Document Language
    const lang = info.Language || xmlMetadata?.get("dc:language") || ""
    const hasLanguage = typeof lang === "string" && lang.trim().length > 0
    // Also check the catalog for /Lang entry via pdf-lib
    let catalogLang = ""
    try {
      const catalog = (pdfDoc as any).context?.trailerInfo?.Root
      if (catalog) {
        const resolved = (pdfDoc as any).context.lookup(catalog)
        if (resolved && typeof resolved.get === "function") {
          const langEntry = resolved.get((pdfDoc as any).context.obj("/Lang"))
          if (langEntry) {
            catalogLang = langEntry.decodeText?.() || langEntry.toString?.() || ""
          }
        }
      }
    } catch { /* skip */ }
    const finalHasLang = hasLanguage || catalogLang.length > 0
    checks.push({
      id: "doc-language",
      category: "metadata",
      name: "Document Language",
      description: "PDF must specify the primary language for screen readers",
      wcagCriteria: "WCAG 3.1.1 (Language of Page)",
      severity: "serious",
      passed: finalHasLang,
      details: finalHasLang
        ? `Language: ${lang || catalogLang}`
        : "No language specified. Screen readers may mispronounce content or use the wrong voice.",
    })

    // 3. Document Author
    const author = info.Author || xmlMetadata?.get("dc:creator") || pdfDoc.getAuthor() || ""
    const hasAuthor = typeof author === "string" && author.trim().length > 0
    checks.push({
      id: "doc-author",
      category: "metadata",
      name: "Document Author",
      description: "PDF should have author metadata for document identification",
      wcagCriteria: "PDF/UA - Metadata",
      severity: "minor",
      passed: hasAuthor,
      details: hasAuthor ? `Author: "${author}"` : "No author metadata found.",
    })

    // ===== STRUCTURE CHECKS (via pdf-lib catalog traversal) =====

    // 4. Tagged PDF — Check for MarkInfo and StructTreeRoot in the catalog
    let isTagged = false
    let markInfoMarked = false
    let hasStructTreeRoot = false
    let structElementCounts: Record<string, number> = {}
    try {
      const context = (pdfDoc as any).context
      const catalogRef = context?.trailerInfo?.Root
      if (catalogRef) {
        const catalog = context.lookup(catalogRef)

        // Check /MarkInfo -> /Marked = true
        const markInfoRef = catalog.get(context.obj("/MarkInfo"))
        if (markInfoRef) {
          const markInfo = context.lookup(markInfoRef)
          if (markInfo && typeof markInfo.get === "function") {
            const marked = markInfo.get(context.obj("/Marked"))
            markInfoMarked = marked?.toString?.() === "true"
          }
        }

        // Check /StructTreeRoot exists
        const structTreeRef = catalog.get(context.obj("/StructTreeRoot"))
        if (structTreeRef) {
          hasStructTreeRoot = true
          // Traverse the structure tree to count element types
          const structTree = context.lookup(structTreeRef)
          countStructureElements(structTree, context, structElementCounts)
        }
      }
      isTagged = markInfoMarked || hasStructTreeRoot
    } catch {
      // Fallback to binary scan
      const rawStr = pdfBytes.toString("latin1")
      isTagged = rawStr.includes("/MarkInfo") || rawStr.includes("/StructTreeRoot")
    }

    checks.push({
      id: "tagged-pdf",
      category: "structure",
      name: "Tagged PDF (Document Structure)",
      description: "PDF must be tagged with structural elements for screen reader navigation",
      wcagCriteria: "WCAG 1.3.1 (Info and Relationships) / PDF/UA",
      severity: "critical",
      passed: isTagged,
      details: isTagged
        ? `Document is tagged.${markInfoMarked ? " MarkInfo/Marked is true." : ""}${
            hasStructTreeRoot ? " StructTreeRoot present." : ""
          }${
            Object.keys(structElementCounts).length > 0
              ? ` Structure elements found: ${Object.entries(structElementCounts)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([k, v]) => `${k}(${v})`)
                  .join(", ")}`
              : ""
          }`
        : "Document is NOT tagged. Untagged PDFs are largely inaccessible to screen readers. Content cannot be navigated, reordered, or properly read aloud.",
    })

    // 5. Text Content — Extract with pdfjs-dist (accurate text layer) or fallback to pdf-parse
    let totalWordCount = 0
    let totalTextLength = 0
    const pagesToCheck = Math.min(pageCount, 20) // Check up to 20 pages for performance
    if (pdfjsAvailable && pdfjsDoc) {
      for (let i = 1; i <= pagesToCheck; i++) {
        try {
          const page = await pdfjsDoc.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items
            .map((item: any) => ("str" in item ? item.str : ""))
            .join(" ")
          totalTextLength += pageText.length
          totalWordCount += pageText.trim().split(/\s+/).filter(Boolean).length
        } catch {
          // Skip pages that fail to parse
        }
      }
    } else {
      // Fallback: use pdf-parse for text extraction
      try {
        const pdfParse = (await import("pdf-parse")).default
        const parsed = await pdfParse(pdfBytes)
        const text = parsed.text || ""
        totalTextLength = text.length
        totalWordCount = text.trim().split(/\s+/).filter(Boolean).length
      } catch {
        // Text extraction failed entirely
      }
    }
    const hasReadableText = totalWordCount > 20
    const estimatedTotalWords = pageCount > pagesToCheck
      ? Math.round((totalWordCount / pagesToCheck) * pageCount)
      : totalWordCount
    checks.push({
      id: "text-content",
      category: "text",
      name: "Readable Text Content",
      description: "PDF must contain actual text, not just scanned images",
      wcagCriteria: "WCAG 1.4.5 (Images of Text)",
      severity: "critical",
      passed: hasReadableText,
      details: hasReadableText
        ? `Found ~${estimatedTotalWords.toLocaleString()} extractable words across ${pageCount} pages.`
        : "Very little or no extractable text found. This PDF may be a scanned image without OCR processing.",
    })

    // 6. Heading Structure — Check from structure tree counts
    const headingTypes = ["H", "H1", "H2", "H3", "H4", "H5", "H6"]
    const headingCount = headingTypes.reduce((sum, h) => sum + (structElementCounts[h] || 0), 0)
    const hasHeadings = headingCount > 0
    const headingDetails = headingTypes
      .filter((h) => structElementCounts[h])
      .map((h) => `${h}: ${structElementCounts[h]}`)
    checks.push({
      id: "heading-structure",
      category: "structure",
      name: "Heading Structure",
      description: "PDF should use properly tagged headings (H1-H6) for document navigation",
      wcagCriteria: "WCAG 1.3.1 (Info and Relationships) / WCAG 2.4.6 (Headings and Labels)",
      severity: "serious",
      passed: hasHeadings,
      details: hasHeadings
        ? `${headingCount} heading elements found: ${headingDetails.join(", ")}.`
        : isTagged
          ? "Document is tagged but no heading elements (H1-H6) were found. Screen reader users cannot navigate by headings."
          : "No heading structure detected. Document is not tagged.",
    })

    // 7. Paragraph and content structure
    const paraCount = structElementCounts["P"] || 0
    const spanCount = structElementCounts["Span"] || 0
    const listCount = (structElementCounts["L"] || 0) + (structElementCounts["LI"] || 0)
    const hasContentStructure = paraCount > 0 || spanCount > 0
    checks.push({
      id: "content-structure",
      category: "structure",
      name: "Content Structure (Paragraphs, Lists)",
      description: "Text content should be wrapped in proper structural elements like P (paragraph) and L (list)",
      wcagCriteria: "WCAG 1.3.1 (Info and Relationships)",
      severity: "moderate",
      passed: hasContentStructure,
      details: hasContentStructure
        ? `Content structure: ${paraCount} paragraphs, ${spanCount} spans${listCount > 0 ? `, ${listCount} list items` : ""}.`
        : isTagged
          ? "Tagged but no paragraph (P) or span elements found. Content may not be properly structured."
          : "No content structure detected.",
    })

    // 8. Bookmarks / Outlines — Check via pdf-lib catalog
    let bookmarkCount = 0
    try {
      const context = (pdfDoc as any).context
      const catalogRef = context?.trailerInfo?.Root
      if (catalogRef) {
        const catalog = context.lookup(catalogRef)
        const outlinesRef = catalog.get(context.obj("/Outlines"))
        if (outlinesRef) {
          const outlines = context.lookup(outlinesRef)
          if (outlines && typeof outlines.get === "function") {
            const countEntry = outlines.get(context.obj("/Count"))
            bookmarkCount = Math.abs(parseInt(countEntry?.toString() || "0", 10)) || 0
          }
          if (bookmarkCount === 0) bookmarkCount = 1 // Outlines exists but Count unknown
        }
      }
    } catch { /* skip */ }
    const hasBookmarks = bookmarkCount > 0
    const needsBookmarks = pageCount > 5
    checks.push({
      id: "bookmarks",
      category: "navigation",
      name: "Bookmarks / Table of Contents",
      description: pageCount > 5
        ? "Documents with more than 5 pages should include bookmarks for navigation"
        : "Bookmarks provide navigation landmarks for longer documents",
      wcagCriteria: "WCAG 2.4.5 (Multiple Ways) / PDF/UA",
      severity: needsBookmarks ? "serious" : "minor",
      passed: hasBookmarks || !needsBookmarks,
      details: hasBookmarks
        ? `${bookmarkCount > 1 ? `${bookmarkCount} bookmarks` : "Bookmarks"} detected.`
        : needsBookmarks
          ? `${pageCount}-page document has no bookmarks. Users cannot jump between sections.`
          : "Document is short enough that bookmarks are optional.",
    })

    // 9. Image Alt Text — Check from structure tree (Figure elements with /Alt)
    const figureCount = structElementCounts["Figure"] || 0
    // Count /Alt entries in the raw PDF for figures
    const rawStr = pdfBytes.toString("latin1")
    const altEntries = (rawStr.match(/\/Alt\s*(\(|<)/g) || []).length
    const imageXObjects = (rawStr.match(/\/Subtype\s*\/Image/g) || []).length
    const hasImages = figureCount > 0 || imageXObjects > 0
    const totalImages = Math.max(figureCount, imageXObjects)
    const hasAltText = !hasImages || altEntries > 0
    checks.push({
      id: "image-alt-text",
      category: "images",
      name: "Image Alternative Text",
      description: "All meaningful images must have alt text descriptions",
      wcagCriteria: "WCAG 1.1.1 (Non-text Content)",
      severity: "critical",
      passed: hasAltText,
      details: hasImages
        ? hasAltText
          ? `Found ${totalImages} images and ${altEntries} alt text entries.${
              altEntries < totalImages ? ` Warning: ${totalImages - altEntries} images may be missing alt text.` : ""
            }`
          : `Found ${totalImages} images but no alt text (/Alt) entries detected. Screen reader users will miss all image content.`
        : "No images (Figure elements or Image XObjects) detected in document.",
    })

    // 10. Font Embedding — Check via pdf-lib pages
    let totalFonts = 0
    let embeddedFonts = 0
    let hasToUnicode = false
    try {
      const rawCheck = pdfBytes.toString("latin1")
      totalFonts = (rawCheck.match(/\/Type\s*\/Font/g) || []).length
      embeddedFonts = (rawCheck.match(/\/FontFile[23]?\s/g) || []).length
      hasToUnicode = rawCheck.includes("/ToUnicode")
    } catch { /* skip */ }
    checks.push({
      id: "font-embedding",
      category: "text",
      name: "Font Embedding",
      description: "Fonts should be embedded to ensure consistent rendering and reliable text extraction",
      wcagCriteria: "PDF/UA - Font Requirements",
      severity: "moderate",
      passed: totalFonts === 0 || embeddedFonts > 0,
      details: embeddedFonts > 0
        ? `${embeddedFonts} embedded font program(s) found out of ${totalFonts} font(s).`
        : totalFonts > 0
          ? `${totalFonts} font(s) referenced but no embedded font programs detected. Text may render incorrectly on systems without these fonts.`
          : "No fonts found in document.",
    })

    // 11. Unicode Character Mapping
    checks.push({
      id: "unicode-mapping",
      category: "text",
      name: "Unicode Character Mapping",
      description: "Fonts must have ToUnicode mapping so screen readers can extract actual characters",
      wcagCriteria: "PDF/UA - Character Encoding",
      severity: "moderate",
      passed: hasToUnicode || totalFonts === 0,
      details: hasToUnicode
        ? "ToUnicode CMap found — text can be reliably extracted."
        : totalFonts > 0
          ? "No ToUnicode mapping detected. Screen readers and copy-paste may produce garbled text."
          : "No fonts to check.",
    })

    // 12. Form Fields — Check via pdf-lib
    const form = pdfDoc.getForm()
    const formFields = form.getFields()
    const hasFormFields = formFields.length > 0
    let labeledFields = 0
    let unlabeledFields = 0
    if (hasFormFields) {
      for (const field of formFields) {
        const name = field.getName()
        // Fields with meaningful names (not auto-generated) count as labeled
        if (name && !/^field\d+$/i.test(name) && name.length > 1) {
          labeledFields++
        } else {
          unlabeledFields++
        }
      }
    }
    checks.push({
      id: "form-labels",
      category: "structure",
      name: "Form Field Labels",
      description: "Interactive form fields must have accessible names/labels",
      wcagCriteria: "WCAG 1.3.1 / 4.1.2 (Name, Role, Value)",
      severity: hasFormFields ? "serious" : "minor",
      passed: !hasFormFields || labeledFields > 0,
      details: hasFormFields
        ? `${formFields.length} form fields: ${labeledFields} with names, ${unlabeledFields} potentially unlabeled.`
        : "No interactive form fields detected.",
    })

    // 13. Table Structure — From structure tree
    const tableCount = structElementCounts["Table"] || 0
    const trCount = structElementCounts["TR"] || 0
    const thCount = structElementCounts["TH"] || 0
    const tdCount = structElementCounts["TD"] || 0
    const hasTables = tableCount > 0 || trCount > 0
    const hasTableHeaders = thCount > 0
    checks.push({
      id: "table-structure",
      category: "structure",
      name: "Table Structure",
      description: "Data tables must have properly tagged header cells (TH) for screen reader navigation",
      wcagCriteria: "WCAG 1.3.1 (Info and Relationships)",
      severity: hasTables ? "serious" : "minor",
      passed: !hasTables || hasTableHeaders,
      details: hasTables
        ? hasTableHeaders
          ? `${tableCount} table(s) with ${thCount} header cell(s) and ${tdCount} data cell(s).`
          : `${tableCount} table(s) with ${trCount} rows but NO header cells (TH). Screen readers cannot announce column/row headers.`
        : "No table structures detected in the tag tree.",
    })

    // 14. Link annotations
    let linkCount = 0
    try {
      for (let i = 0; i < Math.min(pageCount, 20); i++) {
        const page = pdfDoc.getPage(i)
        const annots = page.node.get((pdfDoc as any).context.obj("/Annots"))
        if (annots) {
          const resolved = (pdfDoc as any).context.lookup(annots)
          if (resolved && typeof resolved.size === "function") {
            for (let j = 0; j < resolved.size(); j++) {
              const annot = (pdfDoc as any).context.lookup(resolved.get(j))
              if (annot && typeof annot.get === "function") {
                const subtype = annot.get((pdfDoc as any).context.obj("/Subtype"))
                if (subtype?.toString?.() === "/Link") linkCount++
              }
            }
          }
        }
      }
    } catch { /* skip */ }
    const linkTagCount = structElementCounts["Link"] || 0
    const hasLinks = linkCount > 0
    checks.push({
      id: "link-annotations",
      category: "navigation",
      name: "Link Accessibility",
      description: "Links must be properly tagged so screen readers can identify and navigate them",
      wcagCriteria: "WCAG 2.4.4 (Link Purpose) / WCAG 1.3.1",
      severity: hasLinks ? "moderate" : "minor",
      passed: !hasLinks || linkTagCount > 0,
      details: hasLinks
        ? linkTagCount > 0
          ? `${linkCount} link annotations found, ${linkTagCount} tagged Link elements in structure tree.`
          : `${linkCount} link annotations found but NO tagged Link elements in the structure tree. Screen readers may not identify these as links.`
        : "No link annotations detected.",
    })

    // ===== SCORING =====
    const failed = checks.filter((c) => !c.passed)
    const summary = {
      total: checks.length,
      passed: checks.filter((c) => c.passed).length,
      failed: failed.length,
      critical: failed.filter((c) => c.severity === "critical").length,
      serious: failed.filter((c) => c.severity === "serious").length,
      moderate: failed.filter((c) => c.severity === "moderate").length,
      minor: failed.filter((c) => c.severity === "minor").length,
    }

    const severityWeights = { critical: 20, serious: 10, moderate: 5, minor: 2 }
    const maxScore = checks.reduce((sum, c) => sum + severityWeights[c.severity], 0)
    const lostPoints = failed.reduce((sum, c) => sum + severityWeights[c.severity], 0)
    const score = maxScore > 0 ? Math.round(((maxScore - lostPoints) / maxScore) * 100) : 100

    // ===== AI ENHANCEMENT =====
    let aiAnalysis: PDFAnalysisResult["aiAnalysis"] = undefined
    if (failed.length > 0) {
      try {
        const failedSummary = failed
          .map((c) => `- ${c.name} (${c.severity}): ${c.details}`)
          .join("\n")

        const { text: aiText } = await generateText({
          model: openai("gpt-4o-mini"),
          system:
            "You are a PDF accessibility expert. Analyze these PDF accessibility issues and provide clear, actionable remediation guidance. Respond in valid JSON with exactly these keys: overview (2-3 sentences about the document's accessibility state), topIssues (array of up to 3 objects with keys: issue, fix, priority), recommendation (1-2 sentence overall recommendation). Do NOT use markdown code fences.",
          prompt: `PDF file "${fileName}" (${pageCount} pages, ${(fileSize / 1024).toFixed(0)}KB) failed these accessibility checks:\n\n${failedSummary}\n\nScore: ${score}/100. The document ${isTagged ? "IS tagged" : "is NOT tagged"}. It contains ~${estimatedTotalWords} words of extractable text. Provide practical remediation guidance.`,
          maxOutputTokens: 800,
        })

        try {
          const cleaned = aiText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
          aiAnalysis = JSON.parse(cleaned)
        } catch {
          aiAnalysis = {
            overview: aiText.slice(0, 300),
            topIssues: [],
            recommendation: "Address critical issues first: ensure the PDF is tagged, has a title, and images have alt text.",
          }
        }
      } catch {
        // AI enhancement is optional
      }
    }

    // Cleanup pdfjs
    if (pdfjsDoc) {
      try { await pdfjsDoc.destroy() } catch { /* ignore */ }
    }

    const result: PDFAnalysisResult = {
      fileName,
      fileSize,
      pageCount,
      checks,
      score,
      summary,
      aiAnalysis,
    }

    return NextResponse.json(result, {
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" },
    })
  } catch (error) {
    console.error("[PDF Checker] Analysis failed:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        error: `Analysis failed: ${message}`,
        details: message,
      },
      { status: 500 }
    )
  }
}
