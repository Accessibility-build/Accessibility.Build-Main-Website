import type { Metadata } from "next"
import OverlayDetector from "@/components/tools/overlay-detector"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "Free Accessibility Overlay Detector | Check If a Site Uses an Overlay Widget | Accessibility.build",
  description:
    "Detect if any website uses an accessibility overlay widget like accessiBe, UserWay, AudioEye, or EqualWeb. See the vendor, scan for real WCAG violations the overlay fails to fix, and get expert recommendations.",
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
      "Check if a website uses an accessibility overlay and see real WCAG violations the overlay fails to fix. Free, instant results.",
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
    canonical: "https://accessibility.build/tools/overlay-detector",
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

const faqItems = [
  {
    question: "What is an accessibility overlay?",
    answer:
      "An accessibility overlay is a third-party JavaScript widget added to a website that claims to automatically fix accessibility issues. Common overlay vendors include accessiBe, UserWay, AudioEye, and EqualWeb. They typically add a toolbar icon with features like text resizing and contrast changes.",
  },
  {
    question: "Do accessibility overlays actually work?",
    answer:
      "Most accessibility experts and disability advocacy organizations agree that overlays do not provide meaningful accessibility improvements. Automated tools can only detect 30-40% of WCAG issues, and overlays can fix even fewer. They often introduce new barriers for assistive technology users.",
  },
  {
    question: "Can an overlay protect me from ADA lawsuits?",
    answer:
      "No. Multiple court rulings have found that the presence of an accessibility overlay does not constitute compliance with the ADA or WCAG. In fact, some organizations have faced lawsuits specifically because their overlay created additional barriers.",
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
      "We detect accessiBe, UserWay, AudioEye, EqualWeb, MaxAccess, TruAbilities, Facil'iti, Recite Me, User1st, and ADA Compliance widgets. We continuously update our detection signatures as new vendors appear.",
  },
]

export default function OverlayDetectorPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="Accessibility Overlay Detector"
        description="Free tool to detect if a website uses an accessibility overlay widget. Identifies the vendor and runs a real WCAG accessibility audit to show issues the overlay fails to fix."
        url="https://accessibility.build/tools/overlay-detector"
        applicationCategory="AccessibilityApplication"
        operatingSystem="Web Browser"
        offers={{ price: "0", priceCurrency: "USD" }}
        aggregateRating={{ ratingValue: "4.9", reviewCount: "680" }}
        accessibilityFeatures={[
          "highContrastDisplay",
          "keyboardNavigation",
          "screenReaderSupport",
          "largePrint",
          "reducedAnimation",
        ]}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

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
        {/* Hero Section */}
        <section className="pt-12 pb-6 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Accessibility Overlay{" "}
              <span className="text-amber-600 dark:text-amber-400">Detector</span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Check if any website uses an accessibility overlay widget. Identify the vendor and see real WCAG violations the overlay fails to fix.
            </p>
          </div>
        </section>

        {/* Main Tool */}
        <OverlayDetector />

        {/* FAQ Section */}
        <section className="py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 text-center">
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
