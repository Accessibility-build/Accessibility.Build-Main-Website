import type { Metadata } from "next"
import AccessibilityReportGenerator from "@/components/tools/accessibility-report-generator"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Upload, FileSpreadsheet, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Accessibility Report Generator | Professional PDF & Excel Reports | Free Tool",
  description:
    "Generate professional accessibility audit reports in PDF, Excel, HTML, or Markdown format. Import violation data or create reports manually with our free report generator.",
  keywords: [
    "accessibility report generator",
    "accessibility audit report",
    "WCAG report generator",
    "accessibility report PDF",
    "accessibility report Excel",
    "generate accessibility report",
    "accessibility compliance report",
    "WCAG 2.2 report",
    "accessibility audit template",
    "vpat report generator",
    "accessibility testing report",
    "free accessibility report tool"
  ],
  openGraph: {
    title: "Accessibility Report Generator - Professional PDF & Excel Reports",
    description: "Generate professional accessibility audit reports in PDF, Excel, HTML, or Markdown format. Free tool for creating compliance reports.",
    type: "website",
    url: "https://accessibility.build/tools/accessibility-report-generator",
    images: [
      {
        url: "https://accessibility.build/images/tools/report-generator-og.png",
        width: 1200,
        height: 630,
        alt: "Accessibility Report Generator Tool"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Report Generator - Professional Reports",
    description: "Generate professional accessibility audit reports in multiple formats. Free tool.",
    images: ["https://accessibility.build/images/tools/report-generator-og.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/tools/accessibility-report-generator"
  },
  robots: {
    index: true,
    follow: true
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Accessibility Report Generator", url: "https://accessibility.build/tools/accessibility-report-generator" }
]

export default function AccessibilityReportGeneratorPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="Accessibility Report Generator"
        description="Generate professional accessibility audit reports in PDF, Excel, HTML, or Markdown format. Import violation data or create reports manually."
        url="https://accessibility.build/tools/accessibility-report-generator"
        applicationCategory="AccessibilityApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        aggregateRating={{
          ratingValue: "4.7",
          reviewCount: "280"
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
          question: "What formats can I export accessibility reports in?",
          answer: "You can export reports in PDF (professional layout), Excel (detailed data with multiple sheets), HTML (web-friendly), or Markdown format. All formats include summary statistics, violation details, and recommendations."
        },
        {
          question: "Can I import violation data from other tools?",
          answer: "Yes, you can import violation data from JSON files. The tool accepts standard accessibility audit formats including data from axe-core, WAVE, and other testing tools."
        },
        {
          question: "What information is included in the report?",
          answer: "Reports include organization details, summary statistics (critical, serious, moderate, minor violations), detailed violation listings with WCAG criteria, recommendations, and next steps. You can customize all sections."
        },
        {
          question: "Is the report generator free?",
          answer: "Yes, the Accessibility Report Generator is completely free to use. No registration or payment required."
        }
      ]} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container-wide py-16">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Accessibility Report Generator
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create professional accessibility audit reports in minutes. 
              Generate PDF, Excel, HTML, or Markdown reports with customizable content and branding.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Multiple Export Formats</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>Data Import Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>Professional Templates</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <Upload className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Import or Manual Entry</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Import violation data from JSON files or manually enter violations with full control
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <FileSpreadsheet className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">Multiple Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Export to PDF (professional layout), Excel (detailed data), HTML, or Markdown
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <FileText className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Customizable Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Add recommendations, next steps, and customize all report sections to your needs
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Main Generator */}
          <AccessibilityReportGenerator />

          {/* Related Content */}
          <div className="mt-16">
            <RelatedContent
              content="accessibility report audit compliance PDF Excel"
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

