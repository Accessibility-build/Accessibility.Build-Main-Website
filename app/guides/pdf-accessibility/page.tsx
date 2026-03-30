import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Shield,
  Eye,
  Type,
  Image,
  List,
  Table,
  Languages,
  Bookmark,
} from "lucide-react"
import { ArticleStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "How to Make PDFs Accessible: Complete WCAG & PDF/UA Guide | Accessibility.build",
  description:
    "Learn how to create accessible PDFs that comply with WCAG 2.2 and PDF/UA standards. Covers tagged PDFs, headings, alt text, reading order, bookmarks, forms, and remediation techniques.",
  keywords: [
    "accessible pdf",
    "pdf accessibility",
    "pdf wcag compliance",
    "tagged pdf",
    "pdf remediation",
    "pdf/ua",
    "pdf screen reader",
    "how to make pdf accessible",
    "pdf accessibility checker",
    "accessible document",
    "pdf alt text",
    "pdf heading structure",
    "section 508 pdf",
    "ada pdf compliance",
  ],
  openGraph: {
    title: "How to Make PDFs Accessible — WCAG & PDF/UA Guide",
    description:
      "Complete guide to creating accessible PDFs. Learn about tags, headings, alt text, and how to test with our free PDF accessibility checker.",
    type: "article",
    url: "https://accessibility.build/guides/pdf-accessibility",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Make PDFs Accessible",
    description: "Complete WCAG & PDF/UA guide for creating accessible PDF documents.",
  },
  alternates: {
    canonical: "https://accessibility.build/guides/pdf-accessibility",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  { name: "PDF Accessibility", url: "https://accessibility.build/guides/pdf-accessibility" },
]

const faqItems = [
  {
    question: "What is a tagged PDF?",
    answer:
      "A tagged PDF contains structural markup that describes the document's logical structure — headings, paragraphs, lists, tables, and images. Screen readers use these tags to navigate the document and read content in the correct order. Without tags, a PDF is largely inaccessible.",
  },
  {
    question: "What is the difference between WCAG and PDF/UA?",
    answer:
      "WCAG (Web Content Accessibility Guidelines) provides general accessibility requirements that apply to all digital content including PDFs. PDF/UA (ISO 14289) is a standard specifically for accessible PDF documents, defining technical requirements for tags, fonts, alt text, and structure. Meeting PDF/UA generally satisfies the PDF-related WCAG criteria.",
  },
  {
    question: "Can I make a scanned PDF accessible?",
    answer:
      "Yes, but it requires OCR (Optical Character Recognition) processing first to convert the scanned images into actual text. After OCR, you still need to add structural tags, headings, alt text, and reading order. Adobe Acrobat Pro and ABBYY FineReader are common tools for this.",
  },
  {
    question: "How do I test PDF accessibility?",
    answer:
      "Use our free PDF Accessibility Checker tool to run 14 automated checks. For thorough testing, also use the PAC (PDF Accessibility Checker) desktop tool, Adobe Acrobat Pro's built-in checker, and test with an actual screen reader like NVDA or JAWS.",
  },
  {
    question: "Which authoring tools create accessible PDFs?",
    answer:
      "Microsoft Word (with proper heading styles), Adobe InDesign (with export tags mapping), Google Docs (limited), and LibreOffice Writer all support exporting tagged PDFs. The key is using proper styles and structure in the source document before exporting.",
  },
  {
    question: "Is PDF accessibility legally required?",
    answer:
      "Yes, in many jurisdictions. The ADA (Americans with Disabilities Act), Section 508 (US federal agencies), the European Accessibility Act (EAA), and EN 301 549 all require accessible documents. PDF accessibility has been specifically cited in ADA lawsuits.",
  },
]

const accessibilityElements = [
  { icon: Type, label: "Tagged Structure", description: "Headings, paragraphs, lists marked with proper tags" },
  { icon: Image, label: "Alt Text", description: "Every meaningful image has a text description" },
  { icon: Languages, label: "Document Language", description: "Primary language declared for screen readers" },
  { icon: Bookmark, label: "Bookmarks", description: "Navigation bookmarks for documents over 5 pages" },
  { icon: List, label: "Reading Order", description: "Content flows in a logical, meaningful sequence" },
  { icon: Table, label: "Table Headers", description: "Data tables have proper header cell markup" },
]

export default function PdfAccessibilityGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ArticleStructuredData
        headline="How to Make PDFs Accessible: Complete WCAG & PDF/UA Guide"
        description="Learn how to create accessible PDFs that comply with WCAG 2.2 and PDF/UA standards."
        url="https://accessibility.build/guides/pdf-accessibility"
        datePublished="2025-03-30"
        dateModified="2026-03-30"
        author={{ name: "Accessibility.build Team", url: "https://accessibility.build/about" }}
        publisher={{ name: "Accessibility.build", logo: "https://accessibility.build/images/logo.png" }}
        image="https://accessibility.build/images/guides/pdf-accessibility-og.png"
        wordCount={2800}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-red-50/50 via-background to-orange-50/50 dark:from-red-950/10 dark:via-background dark:to-orange-950/10">
        <article className="container mx-auto max-w-4xl py-12 px-4 sm:px-6">
          {/* Hero */}
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200/50 dark:border-red-800/50 mb-6">
              <BookOpen className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">Expert Guide &bull; Updated March 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              How to Make PDFs{" "}
              <span className="text-red-600 dark:text-red-400">Accessible</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete guide to creating WCAG 2.2 and PDF/UA compliant PDF documents. From authoring to testing to remediation.
            </p>
          </header>

          {/* What Makes a PDF Accessible */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-4">What Makes a PDF Accessible?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              An accessible PDF is one that can be read and navigated by people using assistive technology like screen readers. It requires proper structural markup, descriptive alt text, logical reading order, and metadata that helps software understand the document.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {accessibilityElements.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                  <item.icon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tagged vs Untagged */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Tagged vs Untagged PDFs</h2>
            <p className="text-muted-foreground mb-8">
              The single most important factor in PDF accessibility is whether the document is <strong className="text-foreground">tagged</strong>. Tags are the PDF equivalent of HTML elements — they define the structure and meaning of content.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-green-200 dark:border-green-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    Tagged PDF
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Screen readers can navigate by headings, read tables cell-by-cell, and announce image descriptions.</p>
                  <p>Content reflows properly on mobile devices and when zoomed.</p>
                  <p>Copy-paste preserves logical reading order.</p>
                  <p>Search engines can index the document structure.</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-200 dark:border-red-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    Untagged PDF
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Screen readers read content in visual order, which may be meaningless (columns read across instead of down).</p>
                  <p>No heading navigation — users must listen to the entire document linearly.</p>
                  <p>Tables are unstructured — cells read as a flat stream of text.</p>
                  <p>Images are invisible to assistive technology.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Creating Accessible PDFs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Creating Accessible PDFs</h2>
            <p className="text-muted-foreground mb-8">
              The best approach is to build accessibility into your source document before exporting. Here is how to do it in common authoring tools:
            </p>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Microsoft Word</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Use built-in Heading styles (Heading 1, Heading 2, etc.) instead of manually formatting text as bold/large.</p>
                  <p>Add alt text to images via right-click &gt; Edit Alt Text. Mark decorative images as decorative.</p>
                  <p>Use the built-in table tool with a header row. Run the Accessibility Checker (Review tab) before exporting.</p>
                  <p>Export via File &gt; Save As &gt; PDF, and check &ldquo;Document structure tags for accessibility.&rdquo;</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Adobe InDesign</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Map paragraph styles to PDF tags via Edit &gt; Tags &gt; Map Styles to Tags.</p>
                  <p>Set alt text on images via Object &gt; Object Export Options &gt; Alt Text.</p>
                  <p>Define reading order in the Articles panel (Window &gt; Articles).</p>
                  <p>Export with &ldquo;Create Tagged PDF&rdquo; checked in the Export dialog.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Google Docs</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Use heading styles from the toolbar dropdown. Add alt text to images via right-click &gt; Alt text.</p>
                  <p>Google Docs generates basic tags on PDF export, but the output often needs remediation for full compliance.</p>
                  <p>For critical documents, consider exporting to .docx first, then using Word for final PDF export.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Testing */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Testing PDF Accessibility</h2>
            <p className="text-muted-foreground mb-6">
              After creating your PDF, validate it using automated tools and manual testing:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <p className="font-medium">Run our PDF Accessibility Checker</p>
                  <p className="text-sm text-muted-foreground">Upload your PDF for 14 automated checks covering structure, metadata, text, images, and navigation.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 font-bold text-sm flex-shrink-0">2</div>
                <div>
                  <p className="font-medium">Use the PAC (PDF Accessibility Checker) desktop tool</p>
                  <p className="text-sm text-muted-foreground">PAC validates against PDF/UA (ISO 14289) and WCAG 2.2 with detailed reporting. Free to download.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 font-bold text-sm flex-shrink-0">3</div>
                <div>
                  <p className="font-medium">Test with a screen reader</p>
                  <p className="text-sm text-muted-foreground">Open the PDF in NVDA (free) or JAWS and navigate by headings, read tables, and verify alt text is announced correctly.</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-200/50 dark:border-red-800/50 text-center">
              <h3 className="text-xl font-bold mb-2">Check Your PDF Now</h3>
              <p className="text-muted-foreground mb-4">Upload a PDF and get instant accessibility analysis with AI-powered fix suggestions.</p>
              <Link href="/tools/pdf-accessibility-checker">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                  <FileText className="mr-2 h-5 w-5" />
                  Open PDF Checker
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Remediating Existing PDFs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Remediating Existing PDFs</h2>
            <p className="text-muted-foreground mb-6">
              If you have existing PDFs that are not accessible, here are your options for remediation:
            </p>

            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Adobe Acrobat Pro</h3>
                  <p className="text-sm text-muted-foreground">The most comprehensive tool. Use the Accessibility panel to add tags, set reading order, add alt text, fix headings, and repair table structure. Run the built-in accessibility checker for guidance.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Re-export from Source</h3>
                  <p className="text-sm text-muted-foreground">If you have the original Word/InDesign file, fix the accessibility issues in the source document and re-export. This is often faster and produces better results than remediating the PDF directly.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Third-Party Remediation Tools</h3>
                  <p className="text-sm text-muted-foreground">Tools like CommonLook PDF Validator, axesPDF, and PDFix provide specialized PDF remediation features. For large-scale remediation, consider professional accessibility remediation services.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* PDF/UA Standard */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-4">The PDF/UA Standard</h2>
            <p className="text-muted-foreground mb-4">
              PDF/UA (Universal Accessibility), formally ISO 14289, defines the technical requirements for accessible PDF documents. Key requirements include:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "All content must be tagged",
                "Tags must reflect logical reading order",
                "Images must have alt text (/Alt entry)",
                "Document language must be specified",
                "Fonts must be embedded",
                "Unicode mapping (ToUnicode) required",
                "Bookmarks for documents with 20+ pages",
                "Form fields must have accessible names",
              ].map((req, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{req}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <details key={i} className="group border rounded-lg p-4 bg-card">
                  <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
                    {item.question}
                    <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">&#9662;</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Related Content */}
          <section>
            <RelatedContent
              content="pdf accessibility document audit report checker wcag compliance"
              title="Related Tools & Resources"
              maxItems={3}
              showDescriptions={true}
            />
          </section>
        </article>
      </div>
    </>
  )
}
