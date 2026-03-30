import type { Metadata } from "next"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  AlertTriangle,
  ShieldX,
  Brain,
  MonitorX,
  Users,
  Search,
  GraduationCap,
  Settings,
  UserCheck,
  Palette,
  Gavel,
  ArrowRight,
} from "lucide-react"

export const metadata: Metadata = {
  title:
    "Accessibility Overlays: What They Are, Why They Fail & What To Do Instead | Accessibility.build",
  description:
    "Learn why accessibility overlays like accessiBe, UserWay, and AudioEye don't work. Understand the legal risks, technical limitations, and better alternatives for WCAG compliance.",
  keywords: [
    "accessibility overlay",
    "accessibe alternative",
    "userway alternative",
    "overlay widget",
    "do accessibility overlays work",
    "overlay compliance",
    "accessibility widget problems",
    "wcag overlay",
    "ada overlay",
    "accessibility overlay lawsuit",
  ],
  alternates: {
    canonical: "https://accessibility.build/guides/accessibility-overlays",
  },
  openGraph: {
    title:
      "Accessibility Overlays: What They Are, Why They Fail & What To Do Instead",
    description:
      "Learn why accessibility overlays like accessiBe, UserWay, and AudioEye don't work. Understand the legal risks, technical limitations, and better alternatives for WCAG compliance.",
    url: "https://accessibility.build/guides/accessibility-overlays",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "Accessibility Overlays: What They Are, Why They Fail & What To Do Instead",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Accessibility Overlays: What They Are, Why They Fail & What To Do Instead",
    description:
      "Learn why accessibility overlays like accessiBe, UserWay, and AudioEye don't work. Understand the legal risks, technical limitations, and better alternatives for WCAG compliance.",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Accessibility Overlays",
    url: "https://accessibility.build/guides/accessibility-overlays",
  },
]

const faqItems = [
  {
    question: "Are all accessibility overlays bad?",
    answer:
      "Most accessibility professionals agree that overlay widgets that claim to automatically fix accessibility issues are ineffective and can cause harm. They cannot replace proper remediation. Some vendors offer useful supplementary tools such as monitoring dashboards, but the auto-fix widget approach has been widely criticized by disability advocacy organizations, including the National Federation of the Blind.",
  },
  {
    question: "Can I get sued for using an overlay?",
    answer:
      "Yes. Websites using accessibility overlays have been named in hundreds of ADA lawsuits. Courts have consistently ruled that the presence of an overlay does not constitute compliance with the ADA or WCAG standards. In some cases, the overlay itself introduced additional barriers that strengthened the plaintiff's case.",
  },
  {
    question: "How do I remove an overlay from my site?",
    answer:
      "Removing an overlay typically involves deleting the vendor's JavaScript snippet from your site's HTML or tag manager configuration. Check your theme files, CMS plugins, or Google Tag Manager for the overlay script. After removal, conduct a thorough accessibility audit to identify and fix the underlying issues the overlay was masking.",
  },
  {
    question: "What is the Overlay Fact Sheet?",
    answer:
      "The Overlay Fact Sheet (overlayfactsheet.com) is a joint statement signed by hundreds of accessibility practitioners, disability advocates, and organizations. It documents the technical limitations of overlays, the harm they cause to disabled users, and why they should not be used as a substitute for genuine accessibility remediation.",
  },
  {
    question: "Do overlays help with Section 508 compliance?",
    answer:
      "No. Section 508 requires federal agencies and their contractors to meet specific technical standards based on WCAG 2.0 Level AA. Overlays cannot satisfy these requirements because they do not modify the underlying source code or fix structural accessibility issues. Federal agencies have been specifically advised against relying on overlay solutions.",
  },
  {
    question: "How much does real accessibility remediation cost?",
    answer:
      "Costs vary widely depending on site complexity. A basic audit for a small site might cost $3,000 to $10,000, while enterprise-level remediation can range from $25,000 to $100,000 or more. However, building accessibility into your development process from the start is far more cost-effective than retroactive fixes. Training your team in accessible development practices is one of the best long-term investments.",
  },
]

export default function AccessibilityOverlaysGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <ArticleStructuredData
        headline="Accessibility Overlays: What They Are, Why They Fail, and What To Do Instead"
        description="Learn why accessibility overlays like accessiBe, UserWay, and AudioEye don't work. Understand the legal risks, technical limitations, and better alternatives for WCAG compliance."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2025-03-30"
        dateModified="2025-03-30"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/guides/accessibility-overlays"
        wordCount={2500}
        keywords={[
          "accessibility overlay",
          "accessibe alternative",
          "userway alternative",
          "overlay widget",
          "wcag overlay",
          "ada overlay",
          "accessibility overlay lawsuit",
          "overlay compliance",
        ]}
      />

      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-background to-red-50/50 dark:from-amber-950/10 dark:via-background dark:to-red-950/10">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Accessibility Overlays
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <article>
          <section className="pt-12 pb-8 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <Badge
                variant="secondary"
                className="mb-4 text-sm px-3 py-1"
              >
                Expert Guide &bull; Updated March 2025
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Accessibility Overlays: What They Are, Why They Fail, and What
                To Do Instead
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Accessibility overlay widgets promise one-click WCAG compliance,
                but the reality is far more complicated. This guide explains
                what overlays are, why they fail, the legal risks they carry,
                and what you should do instead.
              </p>
            </div>
          </section>

          {/* What Are Accessibility Overlays? */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                What Are Accessibility Overlays?
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Accessibility overlays are third-party JavaScript widgets that
                  get injected into a website with the promise of automatically
                  detecting and fixing accessibility issues. They typically
                  appear as a small toolbar icon (often a wheelchair symbol or
                  person icon) in the corner of a webpage, offering features
                  like text resizing, contrast adjustments, and cursor
                  enlargement.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Common overlay vendors include{" "}
                  <strong>accessiBe</strong>,{" "}
                  <strong>UserWay</strong>,{" "}
                  <strong>AudioEye</strong>,{" "}
                  <strong>EqualWeb</strong>, and{" "}
                  <strong>Recite Me</strong>. These products are typically sold
                  as SaaS subscriptions and marketed as a quick, low-cost
                  solution to meet ADA, WCAG, and other accessibility
                  requirements.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Overlay vendors claim their AI-powered technology can
                  automatically scan, detect, and remediate accessibility
                  barriers without requiring changes to the underlying source
                  code. In reality, these claims do not hold up under scrutiny.
                  Overlays attempt to patch the front end at runtime using
                  JavaScript, but they cannot address the structural, semantic,
                  and content-level issues that make a website inaccessible.
                </p>
              </div>
            </div>
          </section>

          {/* Why Overlays Cannot Fix Accessibility */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why Overlays Cannot Fix Accessibility
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                There are fundamental technical and practical reasons why
                overlay widgets cannot deliver on their promises. Here are the
                four most critical limitations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 p-2">
                      <Search className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <CardTitle className="text-lg">
                      Limited Detection Capability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Automated tools can only catch approximately 30-40% of
                      WCAG issues. The majority of accessibility barriers
                      require human judgment to identify, including problems
                      with reading order, meaningful alternative text, and
                      logical content structure.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-2">
                      <Brain className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-lg">
                      No Content Understanding
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Overlays cannot understand the context or meaning of your
                      content. They cannot write accurate alt text for images,
                      determine if link text is descriptive, or ensure that form
                      labels make sense in context. These tasks require human
                      comprehension.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-orange-100 dark:bg-orange-900/30 p-2">
                      <MonitorX className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <CardTitle className="text-lg">
                      Introduces New Barriers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Overlays frequently introduce new accessibility problems
                      including focus traps, screen reader conflicts, keyboard
                      navigation issues, and performance degradation. The widget
                      itself can become an obstacle for the very users it claims
                      to help.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                      <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">
                      One-Size-Fits-All Fails
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Disabled users have diverse needs. A blind screen reader
                      user, a person with low vision, someone with motor
                      disabilities, and a person with cognitive differences all
                      interact with the web differently. A single widget cannot
                      address this spectrum of needs.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Legal Risks */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Gavel className="h-7 w-7 text-red-600 dark:text-red-400" />
                Legal Risks of Using Overlays
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Using an accessibility overlay does not protect your
                  organization from legal liability. In fact, the presence of
                  an overlay may increase your legal risk. Courts have
                  repeatedly ruled that overlays do not constitute ADA
                  compliance.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  In landmark cases such as <strong>Robles v. Domino's
                  Pizza</strong>, courts established that websites must be
                  accessible under the ADA. Subsequent cases, including
                  suits involving overlay-equipped websites, have confirmed
                  that the mere presence of a widget is not a valid defense.
                  In <strong>Murphy v. Eyebobs</strong>, the court found
                  accessibility barriers persisted despite the defendant's use
                  of an overlay product.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  According to data tracked by accessibility law firms,
                  hundreds of ADA digital accessibility lawsuits have been
                  filed against websites actively using overlay products. In
                  many of these cases, the overlay itself created additional
                  barriers that strengthened the plaintiff's claims.
                </p>
                <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed">
                      <strong>Important:</strong> Overlay vendor contracts
                      often disclaim liability for accessibility lawsuits. If
                      you are sued, the overlay vendor is unlikely to cover
                      your legal costs or settlement. Your organization bears
                      full legal responsibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What To Do Instead */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                What To Do Instead
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Genuine accessibility requires integrating inclusive design and
                development practices into your workflow. Here are five
                effective alternatives to overlay widgets.
              </p>
              <ol className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Conduct Proper Accessibility Audits
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mt-1">
                      Hire qualified accessibility professionals to perform a
                      comprehensive audit combining automated scanning with
                      manual expert testing. A thorough audit identifies the
                      full range of barriers, not just the subset that tools
                      can detect.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Train Your Development Team on WCAG 2.2
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mt-1">
                      Invest in training your designers, developers, and
                      content creators on WCAG 2.2 guidelines. Teams that
                      understand accessibility build it in from the start,
                      which is far cheaper and more effective than trying to
                      bolt it on after the fact.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Integrate Automated Testing into CI/CD
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mt-1">
                      Use tools like axe-core, Pa11y, or Lighthouse in your
                      continuous integration pipeline to catch regressions
                      early. Automated tests work best as a safety net alongside
                      manual testing, not as a replacement for it.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-lg">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Test with Real Assistive Technology Users
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mt-1">
                      Include people with disabilities in your usability
                      testing. Screen reader users, keyboard-only users, and
                      people with cognitive disabilities provide insights that
                      no automated tool or overlay can replicate.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-lg">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Build Accessibility into Your Design System
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mt-1">
                      Create reusable, accessible components in your design
                      system. When buttons, forms, modals, and navigation
                      components are accessible by default, every page built
                      with them inherits those qualities automatically.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900/40 p-3">
                    <ShieldX className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check If Your Site Uses an Overlay
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Use our free Overlay Detector tool to scan any website for
                  overlay widgets. See which vendor is installed and discover
                  real WCAG violations the overlay fails to fix.
                </p>
                <Button asChild size="lg" className="gap-2">
                  <Link href="/tools/overlay-detector">
                    Scan Your Site Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqItems.map((item, i) => (
                  <details
                    key={i}
                    className="group border rounded-lg p-4 bg-card"
                  >
                    <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
                      {item.question}
                      <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">
                        &#9662;
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Related Content */}
          <section className="pb-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <RelatedContent
                content="accessibility overlay audit compliance alternative"
                title="Related Tools & Resources"
                maxItems={6}
                showDescriptions={true}
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
