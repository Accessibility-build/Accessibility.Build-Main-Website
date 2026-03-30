import type { Metadata } from "next"
import PDFAccessibilityChecker from "@/components/tools/pdf-accessibility-checker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { FileText, Upload, Shield, Zap, Sparkles, CheckCircle, Star, BookOpen, ArrowRight } from "lucide-react"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "Free PDF Accessibility Checker | WCAG & PDF/UA Compliance | Accessibility.build",
  description:
    "Upload any PDF and instantly check for accessibility issues. Analyze document structure, alt text, reading order, bookmarks, and language against WCAG 2.2 and PDF/UA standards. AI-powered fix suggestions included.",
  keywords: [
    "pdf accessibility checker",
    "pdf accessibility",
    "pdf wcag compliance",
    "pdf/ua validator",
    "accessible pdf checker online",
    "pdf accessibility audit",
    "pdf screen reader",
    "tagged pdf checker",
    "pdf accessibility testing",
    "section 508 pdf",
    "pdf document accessibility",
    "check pdf accessibility online free",
  ],
  openGraph: {
    title: "Free PDF Accessibility Checker - WCAG & PDF/UA Compliance",
    description:
      "Upload a PDF and get instant accessibility analysis with AI-powered fix suggestions. Check structure, alt text, bookmarks, and WCAG compliance.",
    type: "website",
    url: "https://accessibility.build/tools/pdf-accessibility-checker",
    images: [
      {
        url: "https://accessibility.build/images/tools/pdf-checker-og.png",
        width: 1200,
        height: 630,
        alt: "PDF Accessibility Checker Tool - Upload and analyze PDFs for WCAG compliance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Accessibility Checker",
    description:
      "Upload a PDF and check for accessibility issues. WCAG 2.2 and PDF/UA compliance with AI-powered fix suggestions.",
  },
  alternates: {
    canonical: "https://accessibility.build/tools/pdf-accessibility-checker",
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
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "PDF Accessibility Checker", url: "https://accessibility.build/tools/pdf-accessibility-checker" },
]

const faqItems = [
  {
    question: "What does the PDF Accessibility Checker test?",
    answer:
      "Our tool checks 12 accessibility criteria including: tagged PDF structure, document title, language setting, heading hierarchy, image alt text, bookmarks/navigation, font embedding, Unicode mapping, form field labels, table structure, and readable text content.",
  },
  {
    question: "What is a tagged PDF?",
    answer:
      "A tagged PDF contains structural markup (tags) that describe the document's logical structure — headings, paragraphs, lists, tables, and images. Screen readers use these tags to navigate and read the document. An untagged PDF is largely inaccessible.",
  },
  {
    question: "What is PDF/UA?",
    answer:
      "PDF/UA (Universal Accessibility) is the ISO 14289 standard for accessible PDF documents. It defines requirements for tagged structure, alt text, reading order, and metadata. Meeting PDF/UA is considered best practice for PDF accessibility.",
  },
  {
    question: "How do I make a PDF accessible?",
    answer:
      "Start by creating the source document with proper heading structure and alt text. Use the built-in accessibility features of your authoring tool (Word, InDesign, etc.) to add tags, set the language, and add bookmarks. Run the accessibility checker before exporting. Then validate the exported PDF.",
  },
  {
    question: "Does this tool check scanned PDFs?",
    answer:
      "Yes. If a PDF contains only scanned images with no extractable text, our tool will flag it as inaccessible. Scanned PDFs need OCR (Optical Character Recognition) processing to make the text readable by screen readers.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Each PDF analysis costs 2 credits. New accounts receive free credits to get started. The analysis includes both automated rule-based checks and AI-powered plain-language explanations with fix suggestions.",
  },
]

export default function PDFAccessibilityCheckerPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="PDF Accessibility Checker"
        description="Free online PDF accessibility checker. Upload a PDF and instantly check for WCAG and PDF/UA compliance issues including document structure, alt text, reading order, and bookmarks."
        url="https://accessibility.build/tools/pdf-accessibility-checker"
        applicationCategory="AccessibilityApplication"
        operatingSystem="Web Browser"
        offers={{ price: "0", priceCurrency: "USD" }}
        aggregateRating={{ ratingValue: "4.8", reviewCount: "920" }}
        accessibilityFeatures={[
          "highContrastDisplay",
          "keyboardNavigation",
          "screenReaderSupport",
          "largePrint",
          "reducedAnimation",
        ]}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />

      {/* HowTo Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Check PDF Accessibility",
            "description": "Upload a PDF file to check for WCAG and PDF/UA accessibility issues with AI-powered fix suggestions.",
            "step": [
              { "@type": "HowToStep", "name": "Upload Your PDF", "text": "Drag and drop or browse to upload any PDF file up to 10MB in size.", "position": 1 },
              { "@type": "HowToStep", "name": "Automated Analysis", "text": "Our tool analyzes the PDF using pdf-lib and pdfjs-dist, checking 14 accessibility criteria including tags, headings, alt text, bookmarks, fonts, and forms.", "position": 2 },
              { "@type": "HowToStep", "name": "AI-Powered Report", "text": "Get a detailed accessibility score with AI-generated plain-language explanations and prioritized fix suggestions powered by GPT-4o.", "position": 3 }
            ],
            "tool": { "@type": "HowToTool", "name": "Accessibility.build PDF Checker" },
            "totalTime": "PT15S"
          }),
        }}
      />

      <div className="min-h-screen pt-12 bg-gradient-to-br from-red-50/50 via-background to-rose-50/50 dark:from-red-950/10 dark:via-background dark:to-rose-950/10">
        <div className="container-wide pb-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-200/50 dark:border-red-800/50 mb-6">
                <Sparkles className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">AI-Powered &bull; 14 WCAG Checks &bull; PDF/UA</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-rose-800 dark:from-white dark:via-red-200 dark:to-rose-200 bg-clip-text text-transparent mb-6">
                PDF Accessibility{" "}
                <span className="text-red-600 dark:text-red-400">Checker</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Upload any PDF and instantly check for accessibility issues. AI-powered analysis with
                <span className="font-semibold text-foreground"> WCAG and PDF/UA compliance checks</span>
              </p>

              {/* Key Benefits Bar */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>PDF/UA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span>AI Fix Suggestions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>14 Accessibility Checks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-orange-600" />
                  <span>Drag & Drop Upload</span>
                </div>
              </div>

              {/* Credit Info */}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-muted/50 border border-border">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium">2 Credits per Analysis</span>
                <Badge variant="secondary" className="ml-2">New users get 100 free credits</Badge>
              </div>
            </div>

            {/* Main Tool */}
            <PDFAccessibilityChecker />

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950">
                      <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Document Structure Analysis</CardTitle>
                      <CardDescription>Tags, Headings & Forms</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Checks for tagged PDF, heading hierarchy (H1-H6), paragraph structure, table headers, and form field labels. Verifies MarkInfo and StructTreeRoot in the PDF catalog.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                      <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Content & Font Checks</CardTitle>
                      <CardDescription>Text, Fonts & Images</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Validates extractable text content, font embedding, Unicode character mapping (ToUnicode), and image alt text. Catches scanned-image PDFs without OCR.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                      <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">AI-Powered Remediation</CardTitle>
                      <CardDescription>GPT-4o Fix Suggestions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    GPT-4o analyzes your results and provides plain-language explanations of each issue, prioritized fix suggestions, and a step-by-step remediation plan.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* How It Works */}
            <div className="mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Upload a PDF and get a detailed accessibility report in seconds
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: "Upload PDF",
                    description: "Drag and drop or browse to upload any PDF file up to 10MB in size.",
                    icon: "\uD83D\uDCE4"
                  },
                  {
                    step: "2",
                    title: "14-Point Analysis",
                    description: "Our tool checks 14 accessibility criteria including tags, headings, alt text, bookmarks, fonts, and forms.",
                    icon: "\uD83D\uDD0D"
                  },
                  {
                    step: "3",
                    title: "AI Report",
                    description: "Get a detailed score with AI-generated explanations and prioritized fix suggestions.",
                    icon: "\u2728"
                  }
                ].map((item, index) => (
                  <div key={index} className="relative">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white text-2xl font-bold mb-4">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                    {index < 2 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-red-500/20 to-rose-500/20 transform -translate-x-8"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Best Practices */}
            <div className="mt-20">
              <Card className="bg-gradient-to-r from-red-50/50 to-rose-50/50 dark:from-red-950/20 dark:to-rose-950/20 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Star className="h-6 w-6 text-yellow-500" />
                    How To Create Accessible PDFs
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Follow these guidelines to ensure your PDFs are accessible from the start
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      "Use heading styles in your source document",
                      "Add alt text to all images before exporting",
                      "Set the document title and language",
                      "Use lists and tables properly (not fake formatting)",
                      "Export as tagged PDF",
                      "Test with a screen reader after export"
                    ].map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA to Guide */}
            <div className="mt-12 text-center">
              <Link
                href="/guides/pdf-accessibility"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white font-medium hover:from-red-700 hover:to-rose-700 transition-all"
              >
                <BookOpen className="h-5 w-5" />
                Read our complete guide to PDF accessibility
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* FAQ Section */}
            <div className="mt-20">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqItems.map((item, i) => (
                  <details
                    key={i}
                    className="group border rounded-lg p-4 bg-card"
                  >
                    <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
                      {item.question}
                      <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">
                        &#9662;
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            {/* Related Content */}
            <div className="mt-20">
              <RelatedContent
                content="pdf accessibility audit report compliance"
                title="Related Tools & Resources"
                maxItems={3}
                showDescriptions={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
