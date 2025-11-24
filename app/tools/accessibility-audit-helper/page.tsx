import type { Metadata } from "next"
import AccessibilityAuditHelper from "@/components/tools/accessibility-audit-helper"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "AI Accessibility Audit Helper | Expert Issue Analysis & Code Recommendations | Accessibility.build",
  description:
    "Get expert accessibility analysis with AI. Describe issues, add code snippets, specify your tech stack and receive detailed WCAG compliance recommendations, code fixes, and implementation guidance.",
  keywords: [
    "accessibility audit",
    "WCAG compliance",
    "accessibility issues",
    "code recommendations",
    "accessibility expert",
    "AI accessibility",
    "accessibility analysis",
    "accessibility consulting",
    "accessibility fixes",
    "accessibility testing",
    "inclusive design",
    "web accessibility"
  ],
  openGraph: {
    title: "AI Accessibility Audit Helper | Expert Issue Analysis",
    description: "Get expert accessibility analysis with AI. Comprehensive issue analysis, WCAG compliance recommendations, and code fixes.",
    type: "website",
    url: "https://accessibility.build/tools/accessibility-audit-helper",
    images: [
      {
        url: "https://accessibility.build/images/tools/audit-helper-og.png",
        width: 1200,
        height: 630,
        alt: "AI Accessibility Audit Helper Interface"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Accessibility Audit Helper | Expert Issue Analysis",
    description: "Get expert accessibility analysis with AI. Comprehensive issue analysis, WCAG compliance recommendations, and code fixes.",
    images: ["https://accessibility.build/images/tools/audit-helper-twitter.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/tools/accessibility-audit-helper"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Accessibility Audit Helper", url: "https://accessibility.build/tools/accessibility-audit-helper" }
]

export default function AccessibilityAuditHelperPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="AI Accessibility Audit Helper"
        description="Expert accessibility analysis with AI. Get detailed WCAG compliance recommendations and code fixes."
        url="https://accessibility.build/tools/accessibility-audit-helper"
        applicationCategory="DeveloperApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        aggregateRating={{
          ratingValue: "4.9",
          reviewCount: "520"
        }}
        accessibilityFeatures={[
          "screenReaderSupport",
          "keyboardNavigation",
          "highContrastDisplay"
        ]}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <AccessibilityAuditHelper />

        <div className="container-wide py-12">
          <RelatedContent
            content="accessibility audit WCAG compliance code remediation testing"
            title="Related Tools & Resources"
            maxItems={3}
            showDescriptions={true}
          />
        </div>
      </div>
    </>
  )
} 