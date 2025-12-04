import type { Metadata } from "next"
import AccessibilityStatementGenerator from "@/components/tools/accessibility-statement-generator"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Code, FileCode, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Accessibility Statement Generator | Free WCAG Compliant Statement Creator",
  description:
    "Generate professional accessibility statements that meet WCAG 2.2 standards. Create HTML, Markdown, PDF, or plain text statements with our free generator tool.",
  keywords: [
    "accessibility statement generator",
    "WCAG accessibility statement",
    "accessibility statement template",
    "ADA accessibility statement",
    "website accessibility statement",
    "generate accessibility statement",
    "accessibility compliance statement",
    "WCAG 2.2 statement",
    "Section 508 statement",
    "accessibility policy generator",
    "free accessibility statement",
    "accessibility declaration"
  ],
  openGraph: {
    title: "Accessibility Statement Generator - Free WCAG Compliant Tool",
    description: "Generate professional accessibility statements that meet WCAG 2.2 standards. Export to HTML, Markdown, PDF, or plain text.",
    type: "website",
    url: "https://accessibility.build/tools/accessibility-statement-generator",
    images: [
      {
        url: "https://accessibility.build/images/tools/statement-generator-og.png",
        width: 1200,
        height: 630,
        alt: "Accessibility Statement Generator Tool"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Statement Generator - Free Tool",
    description: "Generate professional WCAG 2.2 compliant accessibility statements. Export to multiple formats.",
    images: ["https://accessibility.build/images/tools/statement-generator-og.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/tools/accessibility-statement-generator"
  },
  robots: {
    index: true,
    follow: true
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Accessibility Statement Generator", url: "https://accessibility.build/tools/accessibility-statement-generator" }
]

export default function AccessibilityStatementGeneratorPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="Accessibility Statement Generator"
        description="Generate professional accessibility statements that meet WCAG 2.2 standards. Create HTML, Markdown, PDF, or plain text statements."
        url="https://accessibility.build/tools/accessibility-statement-generator"
        applicationCategory="AccessibilityApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        aggregateRating={{
          ratingValue: "4.8",
          reviewCount: "320"
        }}
        accessibilityFeatures={[
          "keyboardNavigation",
          "screenReaderSupport",
          "highContrastDisplay"
        ]}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <FAQStructuredData faqs={[
        {
          question: "What is an accessibility statement?",
          answer: "An accessibility statement is a public declaration of your website's commitment to digital accessibility. It explains your conformance level, testing methods, known limitations, and how users can report accessibility issues."
        },
        {
          question: "Do I need an accessibility statement?",
          answer: "Yes, an accessibility statement is required for WCAG 2.2 Level AA conformance and is recommended for legal compliance (ADA, Section 508). It demonstrates your commitment to accessibility and provides transparency to users."
        },
        {
          question: "What formats can I export?",
          answer: "You can export your accessibility statement in HTML (ready to embed), Markdown, plain text, or PDF format. All formats are WCAG 2.2 compliant and professionally formatted."
        },
        {
          question: "Is this tool free?",
          answer: "Yes, the Accessibility Statement Generator is completely free to use. No registration or payment required."
        }
      ]} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container-wide py-16">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Accessibility Statement Generator
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create professional, WCAG 2.2 compliant accessibility statements in minutes. 
              Generate HTML, Markdown, PDF, or plain text statements with our step-by-step wizard.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>WCAG 2.2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>Multiple Export Formats</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>Free to Use</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <FileText className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Step-by-Step Wizard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Guided 4-step process to collect all necessary information for your accessibility statement
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Download className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">Multiple Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Export to HTML (ready to embed), Markdown, PDF, or plain text format
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Code className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Template Options</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Choose from basic, comprehensive, legal-focused, or developer-friendly templates
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Main Generator */}
          <AccessibilityStatementGenerator />

          {/* Related Content */}
          <div className="mt-16">
            <RelatedContent
              content="accessibility statement WCAG compliance ADA legal requirements"
              title="Related Tools & Resources"
              maxItems={4}
              showDescriptions={true}
            />
          </div>
        </div>
      </div>
    </>
  )
}

