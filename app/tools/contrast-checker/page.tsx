import type { Metadata } from "next"
import ContrastCheckerClientPage from "./ContrastCheckerClientPage"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { clampDescription } from "@/lib/metadata"
import { SiteScanHandoff } from "@/components/tools/site-scan-handoff"

export const metadata: Metadata = {
  // Search Console, Sept 2026: this page drew informational contrast queries
  // while the tool queries it should own ("wcag colour contrast checker",
  // "contrast checker wcag", "hex contrast checker") sat at positions 17 to 37.
  // The title and H1 now name the tool the way those searches do.
  title: "WCAG Color Contrast Checker: Hex Codes, AA & AAA",
  description:
    clampDescription("Free WCAG color contrast checker. Enter two hex codes to get the contrast ratio and AA and AAA pass or fail for normal and large text, with fix suggestions."),
  keywords: [
    "wcag contrast checker",
    "wcag color contrast checker",
    "wcag colour contrast checker",
    "hex contrast checker",
    "color contrast checker",
    "WCAG contrast ratio",
    "WCAG 2.2 compliance",
    "APCA contrast estimate",
    "accessibility testing",
    "color accessibility",
    "contrast ratio calculator", 
    "accessibility tools",
    "visual accessibility",
    "colorblind accessibility",
    "inclusive design",
    "contrast validation",
    "4.5:1 contrast ratio",
    "AA accessibility",
    "AAA accessibility",
    "APCA contrast",
    "advanced perceptual contrast"
  ],
  openGraph: {
    title: "WCAG Color Contrast Checker: Hex Codes, AA & AAA",
    description: "Enter two hex codes to get the WCAG 2.2 contrast ratio and AA and AAA pass or fail, with live previews and fix suggestions.",
    type: "website",
    url: "https://accessibility.build/tools/contrast-checker",
    images: [
      {
        url: "https://accessibility.build/images/tools/contrast-checker-og.png",
        width: 1200,
        height: 630,
        alt: "Color Contrast Checker tool interface showing WCAG compliance testing"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG Color Contrast Checker: Hex Codes, AA & AAA",
    description: "Enter two hex codes to get the WCAG 2.2 contrast ratio and AA and AAA pass or fail, with live previews and fix suggestions.",
    images: ["https://accessibility.build/images/tools/contrast-checker-twitter.png"]
  },
  alternates: {
    canonical: "/tools/contrast-checker"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "WCAG Color Contrast Checker", url: "https://accessibility.build/tools/contrast-checker" }
]

export default function ContrastCheckerPage() {
  return (
    <>
      {/* Enhanced Schema Markup */}
      <AccessibilityToolStructuredData
        name="WCAG Color Contrast Checker"
        description="WCAG color contrast checker that takes two hex codes and reports the contrast ratio with AA and AAA results, live previews, accessible suggestions, and an experimental APCA estimate"
        url="https://accessibility.build/tools/contrast-checker"
        applicationCategory="AccessibilityApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        featureList={[
          "WCAG 2.2 contrast ratio calculation from hex codes",
          "Level AA and AAA pass/fail results",
          "Normal and large text thresholds",
          "Live foreground and background preview",
          "Accessible colour suggestions",
          "Experimental APCA contrast estimate",
        ]}
        accessibilityFeatures={[
          "keyboardNavigation",
          "screenReaderSupport",
          "highContrastDisplay",
          "colorBlindFriendly"
        ]}
      />

      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      {/* Main Tool */}
      <ContrastCheckerClientPage />

      <div className="container-wide pt-4">
        <SiteScanHandoff
          source="contrast_checker"
          heading="Checked one pair. How many are failing on your site?"
          body="WebAIM's annual analysis of a million home pages finds low contrast text on more of them than any other failure, and it rarely shows up as a single bad pair. Paste a page and the scanner tests the text and background combinations on it, along with the other WCAG rules axe-core can check."
        />
      </div>

      {/* Enhanced Related Content */}
      <div className="container-wide py-16">
        <RelatedContent 
          content="color contrast WCAG compliance accessibility testing visual accessibility colorblind design inclusive"
          title="Related Accessibility Tools & Resources"
          maxItems={6}
          showDescriptions={true}
        />
      </div>

      {/* SEO-Enhanced FAQ Section */}
      <div className="container-wide py-16 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-slate-900 dark:text-white">Color Contrast </span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              FAQ
            </span>
          </h2>
          
          <div className="space-y-8">
            <div className="faq-item" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4" itemProp="name">
                What is the minimum contrast ratio for WCAG compliance?
              </h3>
              <div className="text-slate-600 dark:text-slate-300" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  WCAG 2.2 Level AA requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (18pt+ or 14pt+ bold). 
                  Level AAA requires 7:1 for normal text and 4.5:1 for large text. Our contrast checker tests both levels automatically.
                </div>
              </div>
            </div>

            <div className="faq-item" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4" itemProp="name">
                Can I check contrast from hex codes?
              </h3>
              <div className="text-slate-600 dark:text-slate-300" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  Yes. Type or paste a hex code such as #1D4ED8 for the text colour and another for the background.
                  This WCAG colour contrast checker converts both to relative luminance, reports the ratio to two
                  decimal places, and marks AA and AAA as pass or fail for normal or large text. Three-digit
                  shorthand like #FFF works too.
                </div>
              </div>
            </div>

            <div className="faq-item" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4" itemProp="name">
                How do I use the color contrast checker?
              </h3>
              <div className="text-slate-600 dark:text-slate-300" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  Simply input your foreground and background colors using the color pickers or hex codes. 
                  The tool instantly calculates the contrast ratio and shows whether it meets WCAG AA or AAA standards. 
                  You can adjust colors in real-time to achieve compliance.
                </div>
              </div>
            </div>

            <div className="faq-item" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4" itemProp="name">
                Why is color contrast important for accessibility?
              </h3>
              <div className="text-slate-600 dark:text-slate-300" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <div itemProp="text">
                  Adequate color contrast ensures text and UI elements are readable for users with visual impairments, 
                  including those with low vision or color blindness. It also improves readability in different lighting 
                  conditions and on various devices, benefiting all users.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
