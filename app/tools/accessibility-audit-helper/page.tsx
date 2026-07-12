import type { Metadata } from "next"
import AccessibilityAuditHelper from "@/components/tools/accessibility-audit-helper"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "AI Accessibility Audit Helper | Issue Analysis",
  description:
    "Describe an accessibility issue, add code and stack context, and receive AI-assisted WCAG references, implementation ideas, and testing considerations.",
  keywords: [
    "accessibility audit",
    "WCAG compliance",
    "accessibility issues",
    "code recommendations",
    "accessibility issue analysis",
    "AI accessibility",
    "accessibility analysis",
    "accessibility consulting",
    "accessibility fixes",
    "accessibility testing",
    "inclusive design",
    "web accessibility"
  ],
  openGraph: {
    title: "AI Accessibility Audit Helper | Issue Analysis",
    description: "Analyze accessibility issues with AI-assisted WCAG references, implementation ideas, and testing considerations.",
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
    title: "AI Accessibility Audit Helper | Issue Analysis",
    description: "Analyze accessibility issues with AI-assisted WCAG references, implementation ideas, and testing considerations.",
    images: ["https://accessibility.build/images/tools/audit-helper-twitter.png"]
  },
  alternates: {
    canonical: "/tools/accessibility-audit-helper"
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
        description="AI-assisted accessibility issue analysis with WCAG references, implementation ideas, and testing considerations."
        url="https://accessibility.build/tools/accessibility-audit-helper"
        applicationCategory="DeveloperApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD"
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
