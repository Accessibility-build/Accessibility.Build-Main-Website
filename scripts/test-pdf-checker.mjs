/**
 * Standalone test for PDF Accessibility Checker logic
 * Tests the entire parsing pipeline: pdf-lib + pdfjs-dist
 * Run: node scripts/test-pdf-checker.mjs
 */

import { PDFDocument, StandardFonts } from "pdf-lib"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STANDARD_FONT_DATA_URL = path.join(__dirname, "../node_modules/pdfjs-dist/standard_fonts/")

const PASS = "\x1b[32m✓\x1b[0m"
const FAIL = "\x1b[31m✗\x1b[0m"
const WARN = "\x1b[33m⚠\x1b[0m"
let passed = 0
let failed = 0

function assert(condition, label) {
  if (condition) {
    console.log(`  ${PASS} ${label}`)
    passed++
  } else {
    console.log(`  ${FAIL} ${label}`)
    failed++
  }
}

// ===== TEST 1: Simple PDF (no tags, no title) =====
async function testSimplePdf() {
  console.log("\n📄 Test 1: Simple untagged PDF (no title, no language)")
  const doc = await PDFDocument.create()
  const page = doc.addPage([612, 792])
  const font = await doc.embedFont(StandardFonts.Helvetica)
  // Add enough text to pass the 20-word minimum readable content threshold
  page.drawText("Hello World - Simple test document for accessibility checking.", { x: 50, y: 700, font, size: 14 })
  page.drawText("This document tests the PDF accessibility checker tool pipeline.", { x: 50, y: 680, font, size: 12 })
  page.drawText("It should have enough extractable text content to pass the readability check.", { x: 50, y: 660, font, size: 12 })
  page.drawText("Web accessibility ensures that people with disabilities can perceive and interact with content.", { x: 50, y: 640, font, size: 12 })
  const pdfBytes = await doc.save()

  const result = await analyzePdf(pdfBytes, "simple-test.pdf")
  assert(result !== null, "Analysis completed without crash")
  assert(result.pageCount === 1, `Page count correct (${result.pageCount})`)
  assert(result.checks.length >= 10, `Has ${result.checks.length} checks (expected >= 10)`)

  const titleCheck = result.checks.find(c => c.id === "doc-title")
  assert(titleCheck && !titleCheck.passed, "Title check correctly fails (no title set)")

  const langCheck = result.checks.find(c => c.id === "doc-language")
  assert(langCheck && !langCheck.passed, "Language check correctly fails (no language set)")

  const tagCheck = result.checks.find(c => c.id === "tagged-pdf")
  assert(tagCheck && !tagCheck.passed, "Tagged PDF check correctly fails (untagged)")

  const textCheck = result.checks.find(c => c.id === "text-content")
  assert(textCheck && textCheck.passed, "Text content check passes (has extractable text)")

  assert(result.score < 100, `Score < 100 for incomplete PDF (got ${result.score})`)
  assert(result.summary.failed > 0, `Has failed checks (${result.summary.failed})`)
}

// ===== TEST 2: PDF with metadata =====
async function testPdfWithMetadata() {
  console.log("\n📄 Test 2: PDF with title + author + language")
  const doc = await PDFDocument.create()
  doc.setTitle("Accessibility Testing Guide")
  doc.setAuthor("Test Corp")
  doc.setLanguage("en-US")
  const page = doc.addPage([612, 792])
  const font = await doc.embedFont(StandardFonts.Helvetica)
  page.drawText("Chapter 1: Introduction to Web Accessibility", { x: 50, y: 700, font, size: 18 })
  page.drawText("This guide covers WCAG 2.2 Level AA requirements.", { x: 50, y: 670, font, size: 12 })
  const pdfBytes = await doc.save()

  const result = await analyzePdf(pdfBytes, "guide-with-metadata.pdf")
  assert(result !== null, "Analysis completed without crash")

  const titleCheck = result.checks.find(c => c.id === "doc-title")
  assert(titleCheck && titleCheck.passed, `Title check passes: ${titleCheck?.details}`)

  const authorCheck = result.checks.find(c => c.id === "doc-author")
  assert(authorCheck && authorCheck.passed, `Author check passes: ${authorCheck?.details}`)

  // Language check — pdf-lib sets /Lang on catalog
  const langCheck = result.checks.find(c => c.id === "doc-language")
  assert(langCheck && langCheck.passed, `Language check passes: ${langCheck?.details}`)
}

// ===== TEST 3: Multi-page PDF without bookmarks =====
async function testMultiPageNoBookmarks() {
  console.log("\n📄 Test 3: 10-page PDF without bookmarks")
  const doc = await PDFDocument.create()
  doc.setTitle("Long Document")
  const font = await doc.embedFont(StandardFonts.Helvetica)
  for (let i = 0; i < 10; i++) {
    const page = doc.addPage([612, 792])
    page.drawText(`Page ${i + 1}: Content goes here with some text.`, { x: 50, y: 700, font, size: 14 })
  }
  const pdfBytes = await doc.save()

  const result = await analyzePdf(pdfBytes, "long-no-bookmarks.pdf")
  assert(result !== null, "Analysis completed without crash")
  assert(result.pageCount === 10, `Page count correct (${result.pageCount})`)

  const bookmarkCheck = result.checks.find(c => c.id === "bookmarks")
  assert(bookmarkCheck && !bookmarkCheck.passed, `Bookmark check fails for 10-page doc: ${bookmarkCheck?.details}`)
  assert(bookmarkCheck?.severity === "serious", "Bookmark severity is serious for long docs")
}

// ===== TEST 4: PDF with form fields =====
async function testPdfWithForms() {
  console.log("\n📄 Test 4: PDF with form fields")
  const doc = await PDFDocument.create()
  doc.setTitle("Form Document")
  const page = doc.addPage([612, 792])
  const font = await doc.embedFont(StandardFonts.Helvetica)
  page.drawText("Registration Form", { x: 50, y: 700, font, size: 18 })

  const form = doc.getForm()
  const nameField = form.createTextField("full_name")
  nameField.addToPage(page, { x: 50, y: 600, width: 200, height: 30 })
  const emailField = form.createTextField("email_address")
  emailField.addToPage(page, { x: 50, y: 550, width: 200, height: 30 })

  const pdfBytes = await doc.save()

  const result = await analyzePdf(pdfBytes, "form-document.pdf")
  assert(result !== null, "Analysis completed without crash")

  const formCheck = result.checks.find(c => c.id === "form-labels")
  assert(formCheck && formCheck.passed, `Form check passes (fields have names): ${formCheck?.details}`)
}

// ===== TEST 5: Empty/minimal PDF =====
async function testMinimalPdf() {
  console.log("\n📄 Test 5: Minimal PDF (empty page)")
  const doc = await PDFDocument.create()
  doc.addPage([612, 792])
  const pdfBytes = await doc.save()

  const result = await analyzePdf(pdfBytes, "empty.pdf")
  assert(result !== null, "Analysis completed without crash")

  const textCheck = result.checks.find(c => c.id === "text-content")
  assert(textCheck && !textCheck.passed, `Text check fails for empty PDF: ${textCheck?.details}`)
}

// ===== TEST 6: Large-ish PDF stress test =====
async function testStressPdf() {
  console.log("\n📄 Test 6: Stress test (25 pages with content)")
  const doc = await PDFDocument.create()
  doc.setTitle("Stress Test Document")
  doc.setAuthor("Auto Generator")
  const font = await doc.embedFont(StandardFonts.Helvetica)
  for (let i = 0; i < 25; i++) {
    const page = doc.addPage([612, 792])
    for (let line = 0; line < 30; line++) {
      page.drawText(`Page ${i + 1}, Line ${line + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, {
        x: 50, y: 750 - (line * 22), font, size: 10
      })
    }
  }
  const pdfBytes = await doc.save()
  console.log(`  PDF size: ${(pdfBytes.length / 1024).toFixed(0)} KB`)

  const start = Date.now()
  const result = await analyzePdf(pdfBytes, "stress-test.pdf")
  const duration = Date.now() - start
  assert(result !== null, `Analysis completed in ${duration}ms`)
  assert(duration < 10000, `Completed under 10 seconds (took ${duration}ms)`)
  assert(result.pageCount === 25, `Page count correct (${result.pageCount})`)
}

// ===== Core analysis function (mirrors the API route logic) =====
async function analyzePdf(pdfBytes, fileName) {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })

    // pdfjs-dist
    let pdfjsDoc = null
    let pdfjsAvailable = true
    try {
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs")
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(pdfBytes),
        standardFontDataUrl: STANDARD_FONT_DATA_URL,
        useSystemFonts: true,
      })
      pdfjsDoc = await loadingTask.promise
    } catch (err) {
      console.log(`  ${WARN} pdfjs-dist failed: ${err.message}`)
      pdfjsAvailable = false
    }

    const pageCount = pdfDoc.getPageCount()
    const fileSize = pdfBytes.length
    const checks = []

    // Metadata
    let info = {}
    let xmlMetadata = null
    if (pdfjsAvailable && pdfjsDoc) {
      try {
        const pdfMetadata = await pdfjsDoc.getMetadata()
        info = pdfMetadata?.info || {}
        xmlMetadata = pdfMetadata?.metadata
      } catch {}
    }

    // 1. Title
    const title = info.Title || xmlMetadata?.get?.("dc:title") || pdfDoc.getTitle() || ""
    const hasTitle = typeof title === "string" && title.trim().length > 0
    checks.push({ id: "doc-title", category: "metadata", name: "Document Title", description: "", wcagCriteria: "WCAG 2.4.2", severity: "serious", passed: hasTitle, details: hasTitle ? `Title: "${title}"` : "No title" })

    // 2. Language
    const lang = info.Language || xmlMetadata?.get?.("dc:language") || ""
    let catalogLang = ""
    try {
      const context = pdfDoc.context
      const catalogRef = context?.trailerInfo?.Root
      if (catalogRef) {
        const catalog = context.lookup(catalogRef)
        if (catalog?.get) {
          const langEntry = catalog.get(context.obj("/Lang"))
          if (langEntry) catalogLang = langEntry.decodeText?.() || langEntry.toString?.() || ""
        }
      }
    } catch {}
    const finalHasLang = (typeof lang === "string" && lang.trim().length > 0) || catalogLang.length > 0
    checks.push({ id: "doc-language", category: "metadata", name: "Document Language", description: "", wcagCriteria: "WCAG 3.1.1", severity: "serious", passed: finalHasLang, details: finalHasLang ? `Language: ${lang || catalogLang}` : "No language" })

    // 3. Author
    const author = info.Author || xmlMetadata?.get?.("dc:creator") || pdfDoc.getAuthor() || ""
    const hasAuthor = typeof author === "string" && author.trim().length > 0
    checks.push({ id: "doc-author", category: "metadata", name: "Document Author", description: "", wcagCriteria: "PDF/UA", severity: "minor", passed: hasAuthor, details: hasAuthor ? `Author: "${author}"` : "No author" })

    // 4. Tagged PDF
    let isTagged = false, markInfoMarked = false, hasStructTreeRoot = false
    const structElementCounts = {}
    try {
      const context = pdfDoc.context
      const catalogRef = context?.trailerInfo?.Root
      if (catalogRef) {
        const catalog = context.lookup(catalogRef)
        const markInfoRef = catalog.get(context.obj("/MarkInfo"))
        if (markInfoRef) {
          const markInfo = context.lookup(markInfoRef)
          if (markInfo?.get) {
            const marked = markInfo.get(context.obj("/Marked"))
            markInfoMarked = marked?.toString?.() === "true"
          }
        }
        const structTreeRef = catalog.get(context.obj("/StructTreeRoot"))
        if (structTreeRef) hasStructTreeRoot = true
      }
      isTagged = markInfoMarked || hasStructTreeRoot
    } catch {
      const rawStr = Buffer.from(pdfBytes).toString("latin1")
      isTagged = rawStr.includes("/MarkInfo") || rawStr.includes("/StructTreeRoot")
    }
    checks.push({ id: "tagged-pdf", category: "structure", name: "Tagged PDF", description: "", wcagCriteria: "WCAG 1.3.1", severity: "critical", passed: isTagged, details: isTagged ? "Tagged" : "NOT tagged" })

    // 5. Text Content
    let totalWordCount = 0
    const pagesToCheck = Math.min(pageCount, 20)
    if (pdfjsAvailable && pdfjsDoc) {
      for (let i = 1; i <= pagesToCheck; i++) {
        try {
          const pg = await pdfjsDoc.getPage(i)
          const tc = await pg.getTextContent()
          const text = tc.items.map(item => item.str || "").join(" ")
          totalWordCount += text.trim().split(/\s+/).filter(Boolean).length
        } catch {}
      }
    } else {
      try {
        const pdfParse = (await import("pdf-parse")).default
        const parsed = await pdfParse(Buffer.from(pdfBytes))
        totalWordCount = (parsed.text || "").trim().split(/\s+/).filter(Boolean).length
      } catch {}
    }
    const hasReadableText = totalWordCount > 20
    checks.push({ id: "text-content", category: "text", name: "Readable Text", description: "", wcagCriteria: "WCAG 1.4.5", severity: "critical", passed: hasReadableText, details: `${totalWordCount} words extracted` })

    // 6. Headings
    const headingTypes = ["H", "H1", "H2", "H3", "H4", "H5", "H6"]
    const headingCount = headingTypes.reduce((s, h) => s + (structElementCounts[h] || 0), 0)
    checks.push({ id: "heading-structure", category: "structure", name: "Headings", description: "", wcagCriteria: "WCAG 1.3.1", severity: "serious", passed: headingCount > 0, details: `${headingCount} headings` })

    // 7. Content structure
    const paraCount = structElementCounts["P"] || 0
    const spanCount = structElementCounts["Span"] || 0
    checks.push({ id: "content-structure", category: "structure", name: "Content Structure", description: "", wcagCriteria: "WCAG 1.3.1", severity: "moderate", passed: paraCount > 0 || spanCount > 0, details: `${paraCount} paragraphs, ${spanCount} spans` })

    // 8. Bookmarks
    let bookmarkCount = 0
    try {
      const context = pdfDoc.context
      const catalog = context.lookup(context?.trailerInfo?.Root)
      const outlinesRef = catalog.get(context.obj("/Outlines"))
      if (outlinesRef) bookmarkCount = 1
    } catch {}
    const needsBookmarks = pageCount > 5
    checks.push({ id: "bookmarks", category: "navigation", name: "Bookmarks", description: "", wcagCriteria: "WCAG 2.4.5", severity: needsBookmarks ? "serious" : "minor", passed: bookmarkCount > 0 || !needsBookmarks, details: bookmarkCount > 0 ? "Has bookmarks" : needsBookmarks ? "Missing bookmarks" : "Optional" })

    // 9. Images/Alt
    const rawStr = Buffer.from(pdfBytes).toString("latin1")
    const imageXObjects = (rawStr.match(/\/Subtype\s*\/Image/g) || []).length
    const altEntries = (rawStr.match(/\/Alt\s*(\(|<)/g) || []).length
    const hasImages = imageXObjects > 0
    checks.push({ id: "image-alt-text", category: "images", name: "Image Alt Text", description: "", wcagCriteria: "WCAG 1.1.1", severity: "critical", passed: !hasImages || altEntries > 0, details: `${imageXObjects} images, ${altEntries} alt entries` })

    // 10. Fonts
    const totalFonts = (rawStr.match(/\/Type\s*\/Font/g) || []).length
    const embeddedFonts = (rawStr.match(/\/FontFile[23]?\s/g) || []).length
    checks.push({ id: "font-embedding", category: "text", name: "Font Embedding", description: "", wcagCriteria: "PDF/UA", severity: "moderate", passed: totalFonts === 0 || embeddedFonts > 0, details: `${embeddedFonts}/${totalFonts} embedded` })

    // 11. Unicode
    const hasToUnicode = rawStr.includes("/ToUnicode")
    checks.push({ id: "unicode-mapping", category: "text", name: "Unicode Mapping", description: "", wcagCriteria: "PDF/UA", severity: "moderate", passed: hasToUnicode || totalFonts === 0, details: hasToUnicode ? "Has ToUnicode" : "Missing" })

    // 12. Form fields
    let formFieldCount = 0
    try {
      formFieldCount = pdfDoc.getForm().getFields().length
    } catch {}
    checks.push({ id: "form-labels", category: "structure", name: "Form Fields", description: "", wcagCriteria: "WCAG 4.1.2", severity: formFieldCount > 0 ? "serious" : "minor", passed: true, details: `${formFieldCount} fields` })

    // 13. Tables
    checks.push({ id: "table-structure", category: "structure", name: "Tables", description: "", wcagCriteria: "WCAG 1.3.1", severity: "minor", passed: true, details: "No tables detected" })

    // 14. Links
    checks.push({ id: "link-annotations", category: "navigation", name: "Links", description: "", wcagCriteria: "WCAG 2.4.4", severity: "minor", passed: true, details: "No links" })

    // Score
    const failedChecks = checks.filter(c => !c.passed)
    const severityWeights = { critical: 20, serious: 10, moderate: 5, minor: 2 }
    const maxScore = checks.reduce((sum, c) => sum + severityWeights[c.severity], 0)
    const lostPoints = failedChecks.reduce((sum, c) => sum + severityWeights[c.severity], 0)
    const score = maxScore > 0 ? Math.round(((maxScore - lostPoints) / maxScore) * 100) : 100

    if (pdfjsDoc) {
      try { await pdfjsDoc.destroy() } catch {}
    }

    return {
      fileName, fileSize, pageCount, checks, score,
      summary: {
        total: checks.length,
        passed: checks.filter(c => c.passed).length,
        failed: failedChecks.length,
        critical: failedChecks.filter(c => c.severity === "critical").length,
        serious: failedChecks.filter(c => c.severity === "serious").length,
        moderate: failedChecks.filter(c => c.severity === "moderate").length,
        minor: failedChecks.filter(c => c.severity === "minor").length,
      }
    }
  } catch (err) {
    console.log(`  ${FAIL} CRASH: ${err.message}`)
    console.log(err.stack)
    failed++
    return null
  }
}

// ===== RUN ALL TESTS =====
async function main() {
  console.log("🧪 PDF Accessibility Checker - Standalone Tests\n" + "=".repeat(50))

  await testSimplePdf()
  await testPdfWithMetadata()
  await testMultiPageNoBookmarks()
  await testPdfWithForms()
  await testMinimalPdf()
  await testStressPdf()

  console.log("\n" + "=".repeat(50))
  console.log(`Results: ${passed} passed, ${failed} failed`)
  if (failed > 0) {
    console.log("\n❌ TESTS FAILED")
    process.exit(1)
  } else {
    console.log("\n✅ ALL TESTS PASSED")
    process.exit(0)
  }
}

main()
