import AccessibilityCodeGenerator from "@/components/tools/accessibility-code-generator"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata = {
  title: "AI Accessibility Code Generator | WCAG Compliant Components | Accessibility.build",
  description: "Generate accessible HTML, React, and Vue components with AI. Create WCAG 2.2 compliant code with ARIA labels, keyboard navigation, and screen reader support.",
  keywords: [
    "accessibility code generator",
    "WCAG compliant components",
    "accessible HTML",
    "React accessibility",
    "Vue accessibility",
    "ARIA labels",
    "AI code generation",
    "accessible components"
  ],
  openGraph: {
    title: "AI Accessibility Code Generator - WCAG Compliant Components",
    description: "Generate production-ready accessible components with AI. Get WCAG 2.2 compliant HTML, React, and Vue code with proper ARIA implementation.",
    type: "website",
    url: "https://accessibility.build/tools/accessibility-code-generator",
    images: [
      {
        url: "https://accessibility.build/images/tools/code-generator-og.png",
        width: 1200,
        height: 630,
        alt: "AI Accessibility Code Generator Tool"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Accessibility Code Generator - WCAG Components",
    description: "Generate accessible components with AI. WCAG 2.2 compliant HTML, React & Vue code.",
    images: ["https://accessibility.build/images/tools/code-generator-og.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/tools/accessibility-code-generator"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Accessibility Code Generator", url: "https://accessibility.build/tools/accessibility-code-generator" }
]

export default function AccessibilityCodeGeneratorPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="AI Accessibility Code Generator"
        description="Generate accessible HTML, React, and Vue components with AI. Create WCAG 2.2 compliant code with ARIA labels."
        url="https://accessibility.build/tools/accessibility-code-generator"
        applicationCategory="DeveloperApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        aggregateRating={{
          ratingValue: "4.9",
          reviewCount: "420"
        }}
        accessibilityFeatures={[
          "screenReaderSupport",
          "keyboardNavigation",
          "highContrastDisplay",
          "codeGeneration"
        ]}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container-wide py-16">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI Accessibility Code Generator
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Generate production-ready accessible components with comprehensive AI analysis. Get detailed
              WCAG 2.2 compliant code with in-depth explanations, multiple examples, and step-by-step implementation guides.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>WCAG 2.2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Multiple Frameworks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>AI-Powered</span>
              </div>
            </div>
          </div>

          <AccessibilityCodeGenerator />

          <div className="mt-16">
            <RelatedContent
              content="accessibility code components ARIA React Vue HTML WCAG"
              title="Related Tools & Resources"
              maxItems={3}
              showDescriptions={true}
            />
          </div>
        </div>
      </div>
    </>
  )
} 