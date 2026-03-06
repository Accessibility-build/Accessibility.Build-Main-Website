import type { Metadata } from "next"
import ROICalculatorClient from "./ROICalculatorClient"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Shield, TrendingUp, DollarSign, Share2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Accessibility ROI Calculator | Free Business Case Tool | Accessibility.build",
  description:
    "Calculate the return on investment for web accessibility improvements. Estimate lawsuit risk savings, revenue from underserved users, and remediation costs. Free, no sign-up required.",
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
      "Calculate the return on investment for web accessibility. Estimate costs, savings, and build your business case.",
    type: "website",
    url: "https://accessibility.build/tools/accessibility-roi-calculator",
  },
  alternates: {
    canonical: "https://accessibility.build/tools/accessibility-roi-calculator",
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
        description="Calculate the return on investment for web accessibility improvements. Estimate lawsuit risk savings, revenue from underserved users, and remediation costs. Free, no sign-up required."
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
            Build a data-driven business case for accessibility investments with concrete numbers your stakeholders will understand.
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
              <CardTitle className="text-lg">Lawsuit Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                Estimate your annual exposure to ADA and accessibility lawsuits based on your industry, company size, and current compliance level.
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
                Discover how much revenue you may be leaving on the table by not serving the 15% of the global population living with disabilities.
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
                  Accessibility ROI (Return on Investment) measures the financial benefit of making your digital products accessible
                  to people with disabilities. It includes reduced legal risk from ADA lawsuits, increased revenue from the 1.3 billion
                  people worldwide living with disabilities, improved SEO performance, and enhanced brand reputation. Studies consistently
                  show that accessibility investments deliver positive returns within 12 to 24 months.
                </div>
              </div>
            </div>

            <div className="faq-item" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4" itemProp="name">
                How much do accessibility lawsuits cost?
              </h3>
              <div className="text-slate-600 dark:text-slate-300" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  The average ADA accessibility lawsuit settlement ranges from $5,000 to $100,000 or more, with legal defense
                  costs adding another $10,000 to $50,000 even if you win. In 2025, over 5,000 digital accessibility lawsuits were
                  filed in the United States alone. E-commerce, financial services, and healthcare are the most frequently targeted
                  industries. Our calculator uses an average combined cost of $75,000 per incident based on industry data from
                  UsableNet and Seyfarth Shaw reports.
                </div>
              </div>
            </div>

            <div className="faq-item" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4" itemProp="name">
                How is the ROI calculated?
              </h3>
              <div className="text-slate-600 dark:text-slate-300" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  Our calculator uses a multi-factor model that considers: (1) Lawsuit risk reduction based on your industry risk
                  profile and current compliance level, (2) Revenue recovery from the estimated 15% of website visitors with disabilities
                  who may be unable to convert, and (3) One-time remediation costs plus ongoing maintenance. The ROI formula is:
                  ((Annual Benefit - Remediation Cost) / Remediation Cost) x 100. All calculations use publicly available data from
                  WHO, UsableNet, and industry benchmarks.
                </div>
              </div>
            </div>

            <div className="faq-item" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4" itemProp="name">
                What industries face the highest accessibility lawsuit risk?
              </h3>
              <div className="text-slate-600 dark:text-slate-300" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  E-commerce and retail face the highest risk, accounting for roughly 77% of all digital accessibility lawsuits.
                  Financial services, healthcare, and media/entertainment follow closely behind. Government and education sectors,
                  while having lower lawsuit rates, face strict regulatory requirements under Section 508 and Title II of the ADA.
                  Our calculator assigns industry-specific risk factors based on historical lawsuit data and regulatory requirements.
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
