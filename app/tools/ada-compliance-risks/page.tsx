import type { Metadata } from "next"
import ADAComplianceRisks from "@/components/tools/ada-compliance-risks"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, TrendingUp, DollarSign, CheckCircle, Scale, BookOpen, ExternalLink, BarChart3, Gavel } from "lucide-react"

export const metadata: Metadata = {
  title: "ADA Compliance Risk Assessment 2025 | Free Legal Risk Calculator | Lawsuit Statistics",
  description:
    "Free ADA compliance risk assessment tool with 2024-2025 lawsuit data. Calculate legal exposure, financial risk ($5K-$150K settlements), and get actionable compliance roadmaps. Based on 4,890+ lawsuits.",
  keywords: [
    "ada compliance risks",
    "ADA risk assessment",
    "ADA compliance calculator",
    "accessibility legal risk",
    "ADA lawsuit risk",
    "compliance risk assessment",
    "ADA financial risk",
    "ADA lawsuit statistics 2024",
    "ADA lawsuit statistics 2025",
    "website accessibility lawsuit",
    "ADA Title III compliance",
    "WCAG compliance risk",
    "ADA settlement calculator",
    "accessibility compliance cost"
  ],
  openGraph: {
    title: "ADA Compliance Risk Assessment 2025 - Free Legal Risk Calculator",
    description: "Free ADA compliance risk calculator with 2024-2025 lawsuit data. Based on 4,890+ lawsuits. Calculate legal exposure and financial risk.",
    type: "website",
    url: "https://accessibility.build/tools/ada-compliance-risks",
    images: [
      {
        url: "https://accessibility.build/images/tools/ada-risk-og.png",
        width: 1200,
        height: 630,
        alt: "ADA Compliance Risk Assessment Tool - 2025 Lawsuit Statistics"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ADA Compliance Risk Assessment 2025 - Free Calculator",
    description: "Free ADA risk calculator with 2024-2025 lawsuit data. 4,890+ lawsuits analyzed. Calculate your legal exposure.",
    images: ["https://accessibility.build/images/tools/ada-risk-og.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/tools/ada-compliance-risks"
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
        description="Assess your ADA compliance risks with our free risk assessment tool. Calculate legal exposure, financial risk, and get actionable recommendations."
        url="https://accessibility.build/tools/ada-compliance-risks"
        applicationCategory="AccessibilityApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        aggregateRating={{
          ratingValue: "4.6",
          reviewCount: "195"
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
          answer: "ADA compliance risk refers to the likelihood of facing legal action, financial penalties, or regulatory issues due to non-compliance with the Americans with Disabilities Act (ADA) accessibility requirements for websites."
        },
        {
          question: "How is the risk score calculated?",
          answer: "The risk score considers factors including industry type, website traffic, geographic location, current WCAG compliance level, known violations, and existing compliance measures. Higher scores indicate greater legal exposure."
        },
        {
          question: "What industries have the highest ADA compliance risk?",
          answer: "Government, healthcare, finance, and education sectors typically have higher compliance risk due to regulatory requirements and public accessibility expectations."
        },
        {
          question: "How can I reduce my ADA compliance risk?",
          answer: "Reduce risk by achieving WCAG 2.2 Level AA compliance, publishing an accessibility statement, implementing a compliance program, conducting regular audits, and addressing violations promptly."
        }
      ]} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container-wide py-16">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <Badge className="mb-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              2025 Data: 37% Lawsuit Surge
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ADA Compliance Risk Assessment
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Assess your organization&apos;s ADA compliance risks with our research-backed assessment tool. 
              Get legal exposure scores, financial risk estimates, and a prioritized compliance roadmap.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Research-Backed Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>2024-2025 Lawsuit Data</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>Industry-Specific Insights</span>
              </div>
            </div>
          </div>

          {/* Methodology & Sources Section */}
          <Card className="mb-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                Assessment Methodology & Data Sources
              </CardTitle>
              <CardDescription>
                Our risk assessment is based on authoritative legal data and established accessibility standards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">4,890+</div>
                  <div className="text-xs text-muted-foreground">Lawsuits in 2024</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-red-600">+37%</div>
                  <div className="text-xs text-muted-foreground">2025 Mid-Year Surge</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">$20K</div>
                  <div className="text-xs text-muted-foreground">Typical Settlement</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">77%</div>
                  <div className="text-xs text-muted-foreground">Target &lt;$25M Revenue</div>
                </div>
              </div>

              {/* Sources Grid */}
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Primary Data Sources
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <a href="https://blog.usablenet.com" target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow group">
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
                    <div>
                      <div className="text-sm font-medium group-hover:text-blue-600">UsableNet Reports</div>
                      <div className="text-xs text-muted-foreground">2025 Mid-Year ADA Data</div>
                    </div>
                  </a>
                  <a href="https://www.adatitleiii.com" target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow group">
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
                    <div>
                      <div className="text-sm font-medium group-hover:text-blue-600">ADA Title III</div>
                      <div className="text-xs text-muted-foreground">Legal Analysis & Insights</div>
                    </div>
                  </a>
                  <a href="https://www.w3.org/WAI/WCAG22/quickref/" target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow group">
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
                    <div>
                      <div className="text-sm font-medium group-hover:text-blue-600">WCAG 2.2 (W3C)</div>
                      <div className="text-xs text-muted-foreground">Accessibility Standard</div>
                    </div>
                  </a>
                  <a href="https://www.ada.gov" target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow group">
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
                    <div>
                      <div className="text-sm font-medium group-hover:text-blue-600">DOJ ADA.gov</div>
                      <div className="text-xs text-muted-foreground">Official ADA Guidance</div>
                    </div>
                  </a>
                  <a href="https://www.section508.gov" target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow group">
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
                    <div>
                      <div className="text-sm font-medium group-hover:text-blue-600">Section 508</div>
                      <div className="text-xs text-muted-foreground">Federal Standards</div>
                    </div>
                  </a>
                  <a href="https://www.accessibility.works" target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow group">
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
                    <div>
                      <div className="text-sm font-medium group-hover:text-blue-600">Accessibility.Works</div>
                      <div className="text-xs text-muted-foreground">Lawsuit Statistics</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Methodology Explanation */}
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <strong className="text-blue-800 dark:text-blue-300">How We Calculate Risk:</strong>
                    <span className="text-blue-700 dark:text-blue-400"> Our assessment uses weighted factors: 
                    Violation Severity (30%), Industry Risk Profile (25%), Compliance Status (20%), 
                    Traffic Exposure (15%), and Legal Jurisdiction (10%). Financial estimates are derived 
                    from settlement data analysis across 4,890+ cases in 2024.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Legal Exposure Score</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Calculate your risk score (0-100) based on industry litigation rates, violations, and compliance measures
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <DollarSign className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">Financial Risk Estimate</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get estimated settlement and defense cost ranges based on your industry and risk profile
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Compliance Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Receive a phased compliance plan with prioritized actions based on your specific risk factors
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Legal Context Banner */}
          <Card className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-900/20">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Gavel className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>2024 DOJ Final Rule:</strong> The Department of Justice issued its final rule requiring 
                  state and local government web content to conform to WCAG 2.1 Level AA. While directly applicable 
                  to government entities, this signals increased enforcement expectations across all sectors. 
                  Private sector cases continue to reference WCAG as the de facto standard.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Tool */}
          <ADAComplianceRisks />

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

