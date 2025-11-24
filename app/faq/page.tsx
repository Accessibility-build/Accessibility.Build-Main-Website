import { type Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Code2,
  Zap,
  Users,
  FileText,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Star
} from "lucide-react"
import Link from "next/link"
import { FAQStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { generateFAQSchema } from "@/lib/featured-snippets"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Accessibility.build - WCAG & Accessibility Tools",
  description:
    "Get answers to common questions about web accessibility, WCAG compliance, accessibility testing tools, and building inclusive digital experiences. Expert guidance for developers and designers.",
  keywords: [
    "accessibility FAQ",
    "WCAG compliance questions",
    "web accessibility help",
    "accessibility testing questions",
    "inclusive design FAQ",
    "accessibility tools support",
    "WCAG 2.2 questions",
    "accessibility best practices",
    "screen reader compatibility",
    "accessibility audit FAQ"
  ],
  openGraph: {
    title: "Accessibility FAQ | Expert Answers to Common Questions",
    description: "Find answers to frequently asked questions about web accessibility, WCAG compliance, and accessibility testing tools.",
    type: "website",
    images: [
      {
        url: "https://accessibility.build/images/faq-og.png",
        width: 1200,
        height: 630,
        alt: "Accessibility.build FAQ - Expert answers to accessibility questions"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility FAQ - Expert Answers & Guidance",
    description: "Common questions about WCAG compliance, accessibility testing, and inclusive design answered by experts.",
    images: ["https://accessibility.build/images/faq-og.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/faq"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "FAQ", url: "https://accessibility.build/faq" }
]

// Comprehensive FAQ data for structured markup
const faqData = [
  {
    question: "What is web accessibility and why is it important for my business?",
    answer: "Web accessibility ensures that websites are usable by everyone, including people with disabilities. For businesses, it's essential for legal compliance (ADA, Equality Act), expanding market reach to 15% of the population, improving SEO rankings, and demonstrating social responsibility. Accessible sites also typically provide a better user experience for all visitors."
  },
  {
    question: "What are WCAG guidelines and which version should I follow in 2024?",
    answer: "WCAG (Web Content Accessibility Guidelines) are the international standards. WCAG 2.2 is the current recommendation as of late 2023. Most businesses should aim for WCAG 2.2 Level AA compliance, as it is the standard referenced by most legal frameworks and provides a robust level of accessibility without the strict constraints of Level AAA."
  },
  {
    question: "What are the most common web accessibility issues developers should fix?",
    answer: "The most frequent violations include low contrast text, missing alt text for images, empty links/buttons, missing form labels, and poor keyboard navigation. Fixing these five issues can resolve a significant portion of accessibility barriers. Our automated tools can help identify these instantly."
  },
  {
    question: "How do I implement WCAG 2.2 in my development workflow?",
    answer: "Start with semantic HTML5 (using <nav>, <main>, <button> correctly). Ensure all interactive elements are keyboard accessible with visible focus states. Use ARIA labels only when native HTML isn't sufficient. Integrate automated accessibility testing into your CI/CD pipeline and perform manual keyboard testing before every release."
  },
  {
    question: "What is the difference between WCAG Level A, AA, and AAA?",
    answer: "Level A is the minimum baseline (essential for some users to access content). Level AA is the global standard for legal compliance and general usability. Level AAA is the highest standard, ideal for specialized content but often not feasible for entire complex web applications. We recommend targeting Level AA."
  },
  {
    question: "How can I test my website for accessibility compliance?",
    answer: "Use a hybrid approach: 1) Automated scanning (like our URL Auditor) to catch ~40% of issues. 2) Manual keyboard testing (Tab through every page). 3) Screen reader testing (NVDA, VoiceOver). 4) Color contrast analysis. 5) User testing with people with disabilities for the most accurate feedback."
  },
  {
    question: "Are your accessibility tools free to use?",
    answer: "We offer a robust suite of free tools including the Contrast Checker, Heading Analyzer, and Color Palette Generator. We also offer premium AI-powered features for deep auditing, alt text generation, and remediation suggestions for professional teams."
  },
  {
    question: "How accurate are AI-powered accessibility tools?",
    answer: "AI tools are excellent for detecting programmatic errors and suggesting fixes (like alt text), but they cannot fully judge context or usability. Our tools use AI to speed up the process, but we always recommend human verification. Think of AI as a powerful assistant, not a replacement for human judgment."
  },
  {
    question: "What should I include in alt text for images?",
    answer: "Context is key. For informative images, describe the content and meaning. For functional images (icons in buttons), describe the action (e.g., 'Search', not 'Magnifying glass'). For decorative images, use an empty alt attribute (alt='') so screen readers ignore them."
  },
  {
    question: "How do I make my website keyboard accessible?",
    answer: "Ensure a logical tab order that follows the visual layout. Never trap the keyboard focus. Provide a clear, high-contrast visual focus indicator (outline) for all interactive elements. Ensure all custom widgets (modals, dropdowns) can be opened, navigated, and closed using only the keyboard."
  },
  {
    question: "What color contrast ratio do I need for compliance?",
    answer: "For WCAG 2.1/2.2 AA: Normal text needs 4.5:1. Large text (18pt+ or 14pt+ bold) needs 3:1. UI components and graphical objects also need 3:1. Use our Contrast Checker to verify your design tokens before implementation."
  },
  {
    question: "Do I need to make my mobile app accessible too?",
    answer: "Yes. Mobile accessibility is critical. Follow platform specifics (iOS/Android accessibility APIs) and WCAG principles. Ensure touch targets are large enough (44x44px minimum), support dynamic type (text resizing), and work with mobile screen readers (VoiceOver/TalkBack)."
  }
]

const categories = [
  {
    title: "Business & Legal",
    icon: Shield,
    color: "blue",
    questions: [0, 1, 4, 6]
  },
  {
    title: "Development & Technical",
    icon: Code2,
    color: "green",
    questions: [2, 3, 9, 11]
  },
  {
    title: "Testing & Tools",
    icon: Zap,
    color: "purple",
    questions: [5, 7, 8, 10]
  }
]

export default function FAQPage() {
  return (
    <>
      {/* Enhanced Structured Data */}
      <FAQStructuredData faqs={faqData} />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="container-wide py-12">
        {/* Enhanced Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-lg animate-pulse"></div>
              <div className="relative bg-blue-600 p-4 rounded-full">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Frequently Asked
            </span>
            <br />
            <span className="text-slate-900 dark:text-white">Questions</span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Find expert answers to common questions about web accessibility, WCAG compliance,
            and building inclusive digital experiences. Get the guidance you need to create accessible websites.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Expert Answers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">WCAG Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Community Verified</span>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            <span className="text-slate-900 dark:text-white">Browse by </span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Category
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card key={index} className={`border-2 border-${category.color}-100 dark:border-${category.color}-900/20 hover:border-${category.color}-200 dark:hover:border-${category.color}-800/40 transition-all duration-200`}>
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 bg-${category.color}-600 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className={`text-${category.color}-700 dark:text-${category.color}-300`}>
                      {category.title}
                    </CardTitle>
                    <CardDescription>
                      {category.questions.length} questions answered
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Main FAQ Section - Enhanced for Featured Snippets */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            <span className="text-slate-900 dark:text-white">All Questions & </span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Answers
            </span>
          </h2>

          {/* Featured Snippets Optimized Content */}
          <div className="featured-snippets-content mb-12">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <h3
                      className="text-lg font-semibold text-slate-900 dark:text-white pr-4"
                      itemProp="name"
                      itemScope
                      itemType="https://schema.org/Question"
                    >
                      {faq.question}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div
                      className="text-slate-600 dark:text-slate-300 leading-relaxed"
                      itemProp="acceptedAnswer"
                      itemScope
                      itemType="https://schema.org/Answer"
                    >
                      <div itemProp="text">
                        {faq.answer}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Enhanced FAQ Schema Markup for Featured Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateFAQSchema(faqData.map(faq => ({
              question: faq.question,
              answer: faq.answer,
              type: 'paragraph' as const,
              keywords: [],
              priority: 8
            })))
          }}
        />

        {/* Smart Related Content Section */}
        <div className="mt-20">
          <RelatedContent
            content="accessibility FAQ wcag compliance questions web accessibility testing tools inclusive design"
            title="Related Resources & Tools"
            maxItems={6}
            showDescriptions={true}
          />
        </div>

        {/* Quick Access Tools Section */}
        <div className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            <span className="text-slate-900 dark:text-white">Ready to Test Your </span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Accessibility?
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 border-blue-100 dark:border-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800/40 transition-all duration-200">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-blue-700 dark:text-blue-300">
                  URL Accessibility Auditor
                </CardTitle>
                <CardDescription>
                  Comprehensive accessibility testing with AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild className="w-full">
                  <Link href="/tools/url-accessibility-auditor">
                    Start Audit <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 dark:border-green-900/20 hover:border-green-200 dark:hover:border-green-800/40 transition-all duration-200">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code2 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-green-700 dark:text-green-300">
                  WCAG 2.2 Checklist
                </CardTitle>
                <CardDescription>
                  Interactive checklist with all 78 success criteria
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/checklists/wcag-2-2">
                    View Checklist <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 dark:border-purple-900/20 hover:border-purple-200 dark:hover:border-purple-800/40 transition-all duration-200">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-purple-700 dark:text-purple-300">
                  Accessibility Resources
                </CardTitle>
                <CardDescription>
                  Guides, tools, and best practices library
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/resources">
                    Browse Resources <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <Card className="border-2 border-slate-200 dark:border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                <span className="text-slate-900 dark:text-white">Need More </span>
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Help?
                </span>
              </CardTitle>
              <CardDescription className="text-lg">
                Can't find the answer you're looking for? Our team is here to help with your accessibility questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-slate-600 dark:text-slate-300">
                Get personalized support for complex accessibility challenges, WCAG compliance requirements,
                or custom tool development needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/contact">
                    Contact Support <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/blog">
                    Read Our Blog <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
