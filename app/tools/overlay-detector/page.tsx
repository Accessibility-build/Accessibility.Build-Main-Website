import type { Metadata } from "next"
import OverlayDetector from "@/components/tools/overlay-detector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Shield, Search, Eye, CheckCircle, AlertTriangle, Star, Globe, ArrowRight } from "lucide-react"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { FaqSection } from "@/components/seo/faq-section"
import { clampDescription } from "@/lib/metadata"

export const metadata: Metadata = {
  title: "Accessibility Overlay Detector | Scan Any Site",
  description:
    clampDescription("Detect if any website uses an accessibility overlay widget like accessiBe, UserWay, AudioEye, or EqualWeb. See the vendor, scan for real WCAG violations the overlay fails to fix, and get expert recommendations."),
  keywords: [
    "accessibility overlay detector",
    "accessibe detector",
    "userway detector",
    "audioeye detector",
    "overlay widget checker",
    "accessibility widget scanner",
    "does this site use an overlay",
    "accessibility overlay checker",
    "wcag overlay",
    "accessibility widget detection",
    "overlay compliance",
    "accessibility overlay alternatives",
  ],
  openGraph: {
    title: "Free Accessibility Overlay Detector - Scan Any Website",
    description:
      "Check a public page for known accessibility-overlay signatures and compare them with automated accessibility findings.",
    type: "website",
    url: "https://accessibility.build/tools/overlay-detector",
    images: [
      {
        url: "https://accessibility.build/images/tools/overlay-detector-og.png",
        width: 1200,
        height: 630,
        alt: "Accessibility Overlay Detector Tool - Scan websites for overlay widgets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Accessibility Overlay Detector",
    description:
      "Check if a website uses an accessibility overlay. See real WCAG violations the overlay fails to fix.",
  },
  alternates: {
    canonical: "/tools/overlay-detector",
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
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Overlay Detector", url: "https://accessibility.build/tools/overlay-detector" },
]

// Keep in step with OVERLAY_VENDORS in app/api/tools/overlay-detector/route.ts.
const VENDOR_COUNT = 10

const evidence = [
  {
    heading: "Overlays added barriers on state government websites",
    asOf: "Published 28 October 2026",
    body: "A guest article on Lainey Feingold's site by Alison Walden and Matt Vitale of Publicis Sapient reports their study of US state government websites. Only seven states were using overlays, from five different companies. When the authors tested the overlay features, several made things worse: a low-vision mode sometimes reduced contrast, enlarged text covered other controls, a \"simplify page\" mode kept link text but stopped the links working, one overlay could not be operated by keyboard, and one \"blind\" profile started reading aloud over the user's own screen reader. When they rechecked in October 2026, five of the seven states were still using overlays.",
  },
  {
    heading: "Sites with widgets are still being sued",
    asOf: "October 2026 figures",
    body: "UsableNet's lawsuit tracker counted 431 new ADA web accessibility lawsuits filed in October 2026, across federal courts and New York and California state courts. It reports that 107 defendants were sued despite using a third-party accessibility widget on their site at the time.",
  },
  {
    heading: "The FTC ordered an overlay vendor to pay $1 million",
    asOf: "Final order 22 April 2025",
    body: "The US Federal Trade Commission approved a final order requiring accessiBe to pay $1 million. The order bars accessiBe from claiming its automated products can make any website WCAG-compliant, or keep it compliant, without evidence to support the claim, and from presenting reviews or endorsers as independent when they are not.",
  },
]

const sources = [
  {
    label: "Why Accessibility Overlays Don't Work: Findings from U.S. State Government Websites (Law Office of Lainey Feingold, guest article, 28 October 2026)",
    href: "https://www.lflegal.com/2026/10/guest-article-overlays/",
  },
  {
    label: "UsableNet ADA website compliance lawsuit tracker (October 2026 figures)",
    href: "https://info.usablenet.com/ada-website-compliance-lawsuit-tracker",
  },
  {
    label: "FTC approves final order requiring accessiBe to pay $1 million (FTC press release, April 2025)",
    href: "https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-approves-final-order-requiring-accessibe-pay-1-million",
  },
]

const faqs = [
  {
    question: "What is an accessibility overlay?",
    answer:
      "An accessibility overlay is a third-party JavaScript widget added to a website that claims to automatically fix accessibility issues. Common overlay vendors include accessiBe, UserWay, AudioEye, and EqualWeb. They typically add a toolbar icon with features like text resizing and contrast changes.",
  },
  {
    question: "Do accessibility overlays actually work?",
    answer:
      "Not as a fix for an inaccessible site. Many WCAG success criteria need human judgement, so no automated script can find or repair every issue. When researchers tested overlays on US state government websites, the overlay features added new barriers, such as worse contrast, broken links and controls that could not be used by keyboard. The evidence section above lists the sources.",
  },
  {
    question: "Can an overlay protect me from ADA lawsuits?",
    answer:
      "An overlay does not by itself establish ADA or WCAG conformance, and having one does not stop a lawsuit: UsableNet reports that in October 2026, 107 defendants were sued despite using a third-party accessibility widget on their site. Legal outcomes depend on jurisdiction and facts, while technical conformance requires evidence that users can complete real tasks. This is not legal advice; seek qualified advice for a specific claim.",
  },
  {
    question: "Has any regulator acted against overlay marketing?",
    answer:
      "Yes. On 22 April 2025 the US Federal Trade Commission approved a final order requiring accessiBe to pay $1 million. The order bars accessiBe from claiming its automated products can make any website WCAG-compliant, or keep it compliant, without supporting evidence.",
  },
  {
    question: "How does this detector work?",
    answer:
      "Our tool loads the target URL in a browser, scans for known overlay vendor scripts, DOM patterns, and global JavaScript variables. It then runs a comprehensive WCAG 2.2 AA audit using axe-core to show real accessibility issues that persist despite the overlay.",
  },
  {
    question: "What should I use instead of an overlay?",
    answer:
      "Build accessibility into your website from the start. Conduct manual audits, train your development team on WCAG 2.2, integrate automated testing into your CI/CD pipeline, and test with real assistive technology users.",
  },
  {
    question: "Which overlay vendors can you detect?",
    answer:
      `We detect ${VENDOR_COUNT} vendors: accessiBe, UserWay, AudioEye, EqualWeb, MaxAccess, TruAbilities, Facil'iti, Recite Me, User1st, and ADA Compliance. Detection relies on known script, DOM and global-variable signatures, so an overlay from another vendor, or one served from the site's own domain, may not be detected.`,
  },
]

export default function OverlayDetectorPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="Accessibility Overlay Detector"
        description="Free tool to detect if a website uses an accessibility overlay widget. Identifies the vendor and runs a real WCAG accessibility audit to show issues the overlay fails to fix."
        url="https://accessibility.build/tools/overlay-detector"
        applicationCategory="DeveloperApplication"
        operatingSystem="Web Browser"
        offers={{ price: "0", priceCurrency: "USD" }}
        accessibilityFeatures={[
          "highContrastDisplay",
          "keyboardNavigation",
          "screenReaderSupport",
          "largePrint",
          "reducedAnimation",
        ]}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />


      <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-background to-red-50/50 dark:from-amber-950/10 dark:via-background dark:to-red-950/10">
        {/* Hero Section */}
        <section className="pt-12 pb-6 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-200/50 dark:border-amber-800/50 mb-6">
              <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Free Tool &bull; {VENDOR_COUNT} Vendors &bull; No Sign-up Required</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Accessibility Overlay{" "}
              <span className="text-amber-600 dark:text-amber-400">Detector</span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Check if any website uses an accessibility overlay widget. Identify the vendor and see real WCAG violations the overlay fails to fix.
            </p>

            {/* Key Benefits Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mt-6 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-600" />
                <span>{VENDOR_COUNT} Vendors Detected</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-red-600" />
                <span>Real WCAG 2.2 Scan</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-orange-600" />
                <span>Loads the Live Page</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-600" />
                <span>Zero Cost</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Tool */}
        <OverlayDetector />

        {/* Features Grid */}
        <section className="py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950">
                      <Search className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Multi-Vendor Detection</CardTitle>
                      <CardDescription>{VENDOR_COUNT} Overlay Vendors</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Detects {VENDOR_COUNT} overlay vendors including accessiBe, UserWay, AudioEye, EqualWeb, Recite Me, and more. Identifies scripts, DOM patterns, and global variables.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950">
                      <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Real Accessibility Audit</CardTitle>
                      <CardDescription>WCAG 2.2 AA via axe-core</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Runs a comprehensive WCAG 2.2 AA scan using axe-core while the overlay is active. Shows violations the overlay claims to fix but doesn't.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Actionable Recommendations</CardTitle>
                      <CardDescription>Clear Next Steps</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get clear guidance on what to do next. Understand why overlays fail and learn about effective alternatives for real accessibility compliance.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Detect overlays and uncover real accessibility issues in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Enter URL",
                  description: "Type or paste the URL of any website you want to check for accessibility overlays.",
                },
                {
                  step: "2",
                  title: "Detect & Scan",
                  description: "Our tool loads the page in a real browser, detects overlay vendor scripts and widgets, then runs a full WCAG 2.2 AA audit using axe-core.",
                },
                {
                  step: "3",
                  title: "Review Results",
                  description: "See which overlay vendor was detected, view real accessibility violations the overlay fails to fix, and get recommendations for proper remediation.",
                },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white text-2xl font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-amber-500/20 to-red-500/20 transform -translate-x-8"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Best Practices Card */}
        <section className="py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-gradient-to-r from-amber-50/50 to-red-50/50 dark:from-amber-950/20 dark:to-red-950/20 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Star className="h-6 w-6 text-yellow-500" />
                  What To Do If You Find An Overlay
                </CardTitle>
                <CardDescription className="text-lg">
                  Follow these steps to move toward real, lasting accessibility compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "Remove the overlay script from your website",
                    "Conduct a proper WCAG 2.2 audit of your site",
                    "Fix accessibility issues directly in your source code",
                    "Train your development team on accessible coding practices",
                    "Test with real assistive technology users",
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Evidence */}
        <section className="py-12 px-4 sm:px-6" aria-labelledby="evidence-heading">
          <div className="container mx-auto max-w-4xl">
            <h2 id="evidence-heading" className="text-2xl md:text-3xl font-bold mb-3">
              What the evidence says about overlays
            </h2>
            <p className="text-muted-foreground mb-6">
              Three recent findings, each dated and linked to its source below.
            </p>
            <ul className="space-y-4">
              {evidence.map((item) => (
                <li key={item.heading} className="rounded-lg border bg-card p-5">
                  <h3 className="text-lg font-semibold">{item.heading}</h3>
                  <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">{item.asOf}</p>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ul>
            <h3 className="mt-8 text-lg font-semibold">Sources</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {sources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA to Guide */}
        <section className="pb-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <Link
              href="/guides/accessibility-overlays"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-red-500 text-white font-medium hover:from-amber-600 hover:to-red-600 transition-all"
            >
              <Globe className="h-5 w-5" />
              Learn more about why overlays fail and what to do instead
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <div className="py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <FaqSection faqs={faqs} />
          </div>
        </div>

        {/* Related Content */}
        <section className="pb-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <RelatedContent
              content="accessibility overlay audit compliance"
              title="Related Tools & Resources"
              maxItems={3}
              showDescriptions={true}
            />
          </div>
        </section>
      </div>
    </>
  )
}
