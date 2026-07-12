import type { Metadata } from "next"
import ROICalculatorClient from "./ROICalculatorClient"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Shield, TrendingUp, DollarSign, Share2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Accessibility ROI Calculator | Business Case",
  description:
    "Model accessibility investment scenarios with editable incident-cost, audience, revenue-recovery, remediation, and maintenance assumptions.",
  keywords: [
    "accessibility roi calculator",
    "accessibility business case",
    "roi of accessibility",
    "accessibility investment calculator",
    "ada lawsuit cost calculator",
    "accessibility cost benefit analysis",
    "wcag compliance roi",
    "accessibility budget justification",
  ],
  openGraph: {
    title: "Accessibility ROI Calculator | Free Business Case Tool",
    description:
      "Model accessibility investment costs and benefits with transparent, editable assumptions.",
    type: "website",
    url: "https://accessibility.build/tools/accessibility-roi-calculator",
  },
  alternates: {
    canonical: "/tools/accessibility-roi-calculator",
  },
  robots: {
    index: true,
    follow: true,
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "ROI Calculator", url: "https://accessibility.build/tools/accessibility-roi-calculator" },
]

export default function AccessibilityROICalculatorPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="Accessibility ROI Calculator"
        description="Model accessibility investment costs and benefits with transparent, editable scenario assumptions."
        url="https://accessibility.build/tools/accessibility-roi-calculator"
        applicationCategory="BusinessApplication"
        operatingSystem="Any"
        offers={{ price: "0", priceCurrency: "USD" }}
      />

      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <ROICalculatorClient />

      {/* Feature Cards */}
      <div className="container-wide py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-slate-900 dark:text-white">Why Calculate </span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Accessibility ROI?
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Compare conservative and optimistic scenarios while keeping every assumption visible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg w-fit mb-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Business Case Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                Generate compelling ROI projections that translate accessibility improvements into financial terms executives and budget holders understand.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg w-fit mb-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Incident Cost Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                Explore a user-defined annual incident-cost scenario without presenting it as a lawsuit probability.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg w-fit mb-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Revenue Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                Test an editable audience share and recovery rate instead of assuming every disabled visitor is lost revenue.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg w-fit mb-3">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Shareable Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                Copy a shareable link or download a PDF report to present your accessibility business case to stakeholders and decision-makers.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container-wide py-16 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-slate-900 dark:text-white">Accessibility ROI </span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              FAQ
            </span>
          </h2>

          <div className="space-y-8">
            <div className="faq-item" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4" itemProp="name">
                What is accessibility ROI?
              </h3>
              <div className="text-slate-600 dark:text-slate-300" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  Accessibility ROI compares a defined investment with measurable or modeled benefits. Useful inputs can include reduced
                  support effort, improved task completion, avoided rework, a revenue-opportunity scenario, and program maintenance. Results
                  should be presented as scenarios until your organization replaces defaults with its own evidence.
                </div>
              </div>
            </div>

            <div className="faq-item" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4" itemProp="name">
                How much do accessibility lawsuits cost?
              </h3>
              <div className="text-slate-600 dark:text-slate-300" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  Costs vary widely by claim, jurisdiction, defense strategy, remediation scope, and settlement terms. The calculator uses
                  $75,000 only as an editable starting scenario and does not label it an average. Replace it with an internally reviewed
                  amount before using the result in a business case.
                </div>
              </div>
            </div>

            <div className="faq-item" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4" itemProp="name">
                How is the ROI calculated?
              </h3>
              <div className="text-slate-600 dark:text-slate-300" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  The model combines an incident-cost scenario, a revenue-opportunity scenario, one-time remediation, and annual maintenance.
                  The ROI formula is ((modeled annual benefit - remediation cost) / remediation cost) x 100. Audience share, recovery rate,
                  incident cost, and maintenance rate are editable and included in shared links.
                </div>
              </div>
            </div>

            <div className="faq-item" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4" itemProp="name">
                What industries face the highest accessibility lawsuit risk?
              </h3>
              <div className="text-slate-600 dark:text-slate-300" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  Filing patterns depend on the source and scope. UsableNet&apos;s July 2026 midyear research reported that e-commerce
                  represented 79% of the digital accessibility lawsuits it tracked. The calculator uses industry coefficients only as
                  editable scenario defaults, not as organization-specific probabilities.
                </div>
              </div>
            </div>

            <div className="faq-item" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4" itemProp="name">
                Is this calculator free to use?
              </h3>
              <div className="text-slate-600 dark:text-slate-300" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  Yes, the Accessibility ROI Calculator is completely free with no sign-up required. All calculations run entirely
                  in your browser, so your data never leaves your device. You can share results via URL or download a PDF report
                  at no cost. This tool is part of our mission to make accessibility business cases accessible to everyone.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Content */}
      <div className="container-wide py-16">
        <RelatedContent
          content="accessibility ROI calculator business case investment compliance WCAG lawsuit risk revenue disability"
          title="Related Accessibility Tools & Resources"
          maxItems={6}
          showDescriptions={true}
        />
      </div>
    </>
  )
}
