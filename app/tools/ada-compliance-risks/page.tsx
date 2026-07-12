import type { Metadata } from "next"
import ADAComplianceRisks from "@/components/tools/ada-compliance-risks"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "ADA Compliance Risk Assessment & Calculator",
  description:
    "Explore accessibility risk factors with a transparent planning model, dated lawsuit research, editable assumptions, and a prioritized remediation roadmap.",
  keywords: [
    "ada compliance risks",
    "ADA risk assessment",
    "ADA compliance calculator",
    "accessibility legal risk",
    "ADA lawsuit risk",
    "compliance risk assessment",
    "ADA financial risk",
    "ADA lawsuit statistics 2026",
    "website accessibility lawsuit",
    "ADA Title III compliance",
    "WCAG compliance risk",
    "ADA settlement calculator",
    "accessibility compliance cost"
  ],
  openGraph: {
    title: "ADA Compliance Risk Assessment - Free Legal Risk Calculator",
    description: "Explore accessibility risk factors with a transparent planning model, dated lawsuit research, and a prioritized remediation roadmap.",
    type: "website",
    url: "https://accessibility.build/tools/ada-compliance-risks",
    images: [
      {
        url: "https://accessibility.build/images/tools/ada-risk-og.png",
        width: 1200,
        height: 630,
        alt: "ADA Compliance Risk Assessment Tool - Lawsuit Statistics"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ADA Compliance Risk Assessment - Free Calculator",
    description: "Explore accessibility risk factors with a transparent planning model and current, dated lawsuit research.",
    images: ["https://accessibility.build/images/tools/ada-risk-og.png"]
  },
  alternates: {
    canonical: "/tools/ada-compliance-risks"
  },
  robots: {
    index: true,
    follow: true
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "ADA Compliance Risks", url: "https://accessibility.build/tools/ada-compliance-risks" }
]

export default function ADAComplianceRisksPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="ADA Compliance Risk Assessment"
        description="Planning tool for comparing accessibility risk factors, documenting assumptions, and creating a prioritized remediation roadmap."
        url="https://accessibility.build/tools/ada-compliance-risks"
        applicationCategory="AccessibilityApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD"
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
          question: "What is ADA compliance risk?",
          answer: "Accessibility legal risk depends on jurisdiction, business model, user barriers, and applicable law. This tool organizes planning factors but cannot determine legal compliance or predict a claim."
        },
        {
          question: "How is the risk score calculated?",
          answer: "The planning score applies documented weights to industry, traffic, geography, known barriers, and program maturity. It is a scenario-comparison aid, not a prediction of whether a claim will be filed or succeed."
        },
        {
          question: "What industries have the highest ADA compliance risk?",
          answer: "Digital-accessibility filings have been concentrated in e-commerce and food-service businesses, but exposure varies substantially by jurisdiction, business model, user journeys, and current barriers."
        },
        {
          question: "How can I reduce my ADA compliance risk?",
          answer: "Reduce risk by removing user barriers, testing important journeys with disabled users and assistive technologies, maintaining an accessibility program, documenting remediation, and obtaining legal advice for your jurisdiction."
        }
      ]} />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container-wide py-10 sm:py-12">
          <header className="max-w-3xl">
            <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">Planning model | Data reviewed July 2026</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-950 dark:text-white">ADA compliance risk assessment</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Compare accessibility risk factors, document assumptions, and build a prioritized remediation roadmap.
            </p>
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p>This model is informational and cannot predict litigation or replace advice from a qualified attorney.</p>
            </div>
          </header>

          <div className="mt-8">
          <ADAComplianceRisks />
          </div>

          {/* Related Content */}
          <div className="mt-16">
            <RelatedContent
              content="ADA compliance legal risk accessibility lawsuit WCAG"
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
