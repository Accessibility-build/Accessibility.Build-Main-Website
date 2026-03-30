import type { Metadata } from "next"
import PDFAccessibilityChecker from "@/components/tools/pdf-accessibility-checker"
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

      <div className="min-h-screen bg-gradient-to-br from-red-50/50 via-background to-rose-50/50 dark:from-red-950/10 dark:via-background dark:to-rose-950/10">
        {/* Hero Section */}
        <section className="pt-12 pb-6 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              PDF Accessibility{" "}
              <span className="text-red-600 dark:text-red-400">Checker</span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload any PDF and instantly check for accessibility issues. AI-powered analysis with WCAG and PDF/UA compliance checks.
            </p>
          </div>
        </section>

        {/* Main Tool */}
        <PDFAccessibilityChecker />

        {/* FAQ Section */}
        <section className="py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
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
        </section>

        {/* Related Content */}
        <section className="pb-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <RelatedContent
              content="pdf accessibility audit report compliance"
              title="Related Tools & Resources"
              maxItems={3}
              showDescriptions={true}
            />
          </div>
        </section>
      </div>
    </>
  )
}
