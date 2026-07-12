import type { Metadata } from "next"
import UrlAccessibilityAuditor from "@/components/tools/url-accessibility-auditor"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "URL Accessibility Auditor | axe-core + AI",
  description:
    "Run an automated axe-core scan against a public URL, organize findings by impact and WCAG mapping, and review AI-assisted remediation ideas.",
  keywords: [
    "url accessibility audit",
    "website accessibility testing",
    "axe-core accessibility",
    "WCAG compliance checker",
    "accessibility violations",
    "AI accessibility analysis",
    "accessibility report",
    "accessibility scanner",
    "web accessibility audit",
    "accessibility testing tool",
    "WCAG 2.1 compliance",
    "accessibility score",
    "automated accessibility testing"
  ],
  openGraph: {
    title: "URL Accessibility Auditor | Comprehensive Testing with AI Analysis",
    description: "Run an axe-core scan against a public URL and review prioritized findings with AI-assisted remediation ideas.",
    type: "website",
    url: "https://accessibility.build/tools/url-accessibility-auditor",
    images: [
      {
        url: "https://accessibility.build/images/tools/url-auditor-og.png",
        width: 1200,
        height: 630,
        alt: "URL Accessibility Auditor Interface"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Accessibility Auditor | Comprehensive Testing with AI Analysis",
    description: "Run an axe-core scan against a public URL and review prioritized findings with AI-assisted remediation ideas.",
    images: ["https://accessibility.build/images/tools/url-auditor-twitter.png"]
  },
  alternates: {
    canonical: "/tools/url-accessibility-auditor"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "URL Accessibility Auditor", url: "https://accessibility.build/tools/url-accessibility-auditor" }
]

export default function UrlAccessibilityAuditorPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="URL Accessibility Auditor"
        description="Automated axe-core URL scanning with prioritized findings, WCAG mappings, and AI-assisted remediation ideas."
        url="https://accessibility.build/tools/url-accessibility-auditor"
        applicationCategory="DeveloperApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        accessibilityFeatures={[
          "screenReaderSupport",
          "keyboardNavigation",
          "highContrastDisplay",
          "automatedTesting"
        ]}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <UrlAccessibilityAuditor />

        <div className="container-wide py-12">
          <RelatedContent
            content="accessibility audit axe-core WCAG compliance testing automated analysis"
            title="Related Tools & Resources"
            maxItems={3}
            showDescriptions={true}
          />
        </div>
      </div>
    </>
  )
}
