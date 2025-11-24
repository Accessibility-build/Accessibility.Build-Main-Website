import type { Metadata } from "next"
import HeadingAnalyzer from "@/components/tools/heading-analyzer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Hash,
  Search,
  Eye,
  CheckCircle,
  AlertTriangle,
  Zap,
  ArrowUp,
  Users,
  Target
} from "lucide-react"
import { ToolStructuredData, BreadcrumbStructuredData, HowToStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "Heading Structure Analyzer | SEO & Accessibility | Free Tool | Accessibility.build",
  description:
    "Free heading structure analyzer for SEO and accessibility. Check H1-H6 hierarchy, improve screen reader navigation, and boost search rankings with proper heading structure. WCAG 2.2 compliant analysis.",
  keywords: [
    "heading structure analyzer",
    "H1 H2 H3 hierarchy",
    "SEO headings checker",
    "accessibility heading analysis",
    "screen reader navigation",
    "WCAG heading compliance",
    "semantic HTML checker",
    "heading SEO optimization",
    "document outline analyzer",
    "free heading tool"
  ],
  openGraph: {
    title: "Free Heading Structure Analyzer | SEO & Accessibility Testing",
    description: "Analyze H1-H6 heading hierarchy for SEO and accessibility. Free tool for WCAG compliance and better search rankings.",
    type: "website",
    images: [
      {
        url: "https://accessibility.build/images/tools/heading-analyzer-og.png",
        width: 1200,
        height: 630,
        alt: "Heading Structure Analyzer Tool for SEO and Accessibility"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Heading Structure Analyzer - SEO & Accessibility",
    description: "Check H1-H6 hierarchy for WCAG compliance and SEO optimization. Free online tool.",
    images: ["https://accessibility.build/images/tools/heading-analyzer-og.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/tools/heading-analyzer"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Heading Structure Analyzer", url: "https://accessibility.build/tools/heading-analyzer" }
]

const howToSteps = [
  {
    name: "Enter Website URL",
    text: "Paste the URL of the webpage you want to analyze for heading structure",
    url: "https://accessibility.build/tools/heading-analyzer#step-1"
  },
  {
    name: "Start Analysis",
    text: "Click the 'Analyze Headings' button to scan the page for H1-H6 elements",
    url: "https://accessibility.build/tools/heading-analyzer#step-2"
  },
  {
    name: "Review Results",
    text: "Examine the heading hierarchy, identify missing levels, and check for accessibility issues",
    url: "https://accessibility.build/tools/heading-analyzer#step-3"
  },
  {
    name: "Implement Fixes",
    text: "Apply the suggested improvements to optimize your heading structure for SEO and accessibility",
    url: "https://accessibility.build/tools/heading-analyzer#step-4"
  }
]

export default function Page() {
  return (
    <>
      {/* Enhanced Structured Data */}
      <ToolStructuredData
        name="Heading Structure Analyzer"
        description="Free tool to analyze H1-H6 heading hierarchy for SEO optimization and WCAG accessibility compliance"
        url="https://accessibility.build/tools/heading-analyzer"
        applicationCategory="WebApplication"
        operatingSystem="Any"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        aggregateRating={{
          ratingValue: "4.9",
          reviewCount: "1247"
        }}
        steps={howToSteps}
      />

      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <HowToStructuredData
        name="How to Analyze Heading Structure for SEO and Accessibility"
        description="Complete guide to analyzing and optimizing H1-H6 heading structure for better search rankings and accessibility compliance"
        image="https://accessibility.build/images/guides/heading-analysis-guide.png"
        totalTime="PT5M"
        estimatedCost="0"
        tool={["Heading Structure Analyzer", "Web Browser"]}
        steps={howToSteps}
      />

      <div className="container-wide py-12">
        {/* Enhanced Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-lg animate-pulse"></div>
              <div className="relative bg-blue-600 p-4 rounded-full">
                <Hash className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Heading Structure
            </span>
            <br />
            <span className="text-slate-900 dark:text-white">Analyzer</span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Analyze your website's H1-H6 heading hierarchy for perfect SEO optimization and WCAG accessibility compliance.
            Improve search rankings and screen reader navigation with proper semantic structure.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              100% Free
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 px-4 py-2">
              <Eye className="h-4 w-4 mr-2" />
              WCAG 2.2 Compliant
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Instant Results
            </Badge>
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 px-4 py-2">
              <Search className="h-4 w-4 mr-2" />
              SEO Optimized
            </Badge>
          </div>
        </div>

        {/* Main Tool Component */}
        <HeadingAnalyzer />

        {/* Enhanced Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-slate-900 dark:text-white">Why Use Our </span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Heading Analyzer?
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-100 dark:border-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800/40 transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-blue-700 dark:text-blue-300">SEO Optimization</CardTitle>
                <CardDescription>
                  Ensure proper H1-H6 hierarchy for better search engine rankings and content structure understanding.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-green-100 dark:border-green-900/20 hover:border-green-200 dark:hover:border-green-800/40 transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-green-700 dark:text-green-300">Accessibility Compliance</CardTitle>
                <CardDescription>
                  Meet WCAG 2.2 guidelines for screen reader navigation and assistive technology compatibility.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-purple-100 dark:border-purple-900/20 hover:border-purple-200 dark:hover:border-purple-800/40 transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-purple-700 dark:text-purple-300">Detailed Analysis</CardTitle>
                <CardDescription>
                  Get comprehensive reports with specific recommendations for improving your heading structure.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-orange-100 dark:border-orange-900/20 hover:border-orange-200 dark:hover:border-orange-800/40 transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-orange-700 dark:text-orange-300">User Experience</CardTitle>
                <CardDescription>
                  Improve content readability and navigation for all users, including those using assistive technologies.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-slate-700 dark:text-slate-300">Fast & Free</CardTitle>
                <CardDescription>
                  Get instant results with our lightning-fast analysis tool. No registration or payment required.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-blue-100 dark:border-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800/40 transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <ArrowUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-blue-700 dark:text-blue-300">Actionable Insights</CardTitle>
                <CardDescription>
                  Receive clear, implementable recommendations to fix heading structure issues and boost performance.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* FAQ Section for SEO */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-slate-900 dark:text-white">Frequently Asked </span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What is heading structure analysis?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Heading structure analysis examines the H1-H6 hierarchy on your webpage to ensure proper semantic organization,
                  SEO optimization, and accessibility compliance. It identifies missing heading levels, improper nesting, and opportunities for improvement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why is proper heading structure important for SEO?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Search engines use heading structure to understand content hierarchy and context. Proper H1-H6 organization helps search engines
                  index your content more effectively, potentially improving rankings and featured snippet opportunities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does heading structure affect accessibility?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Screen readers and assistive technologies rely on proper heading structure to navigate content efficiently.
                  Users can jump between headings to quickly find relevant sections, making your content more accessible to people with disabilities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16">
          <RelatedContent
            content="heading structure SEO accessibility semantic HTML"
            title="Related Tools & Resources"
            maxItems={3}
            showDescriptions={true}
          />
        </div>
      </div>
    </>
  )
}