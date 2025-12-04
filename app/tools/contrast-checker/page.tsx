import type { Metadata } from "next"
import ContrastCheckerClientPage from "./ContrastCheckerClientPage"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG Contrast Checker | Color Contrast Checker | WCAG 2.2 & 3.0 | Free Tool",
  description:
    "Professional WCAG contrast checker supporting both WCAG 2.2 and 3.0 (APCA). Test contrast ratios instantly, get real-time feedback, and ensure your design meets accessibility standards for all users including those with visual impairments.",
  keywords: [
    "wcag contrast checker",
    "color contrast checker",
    "WCAG contrast ratio",
    "WCAG 2.2 compliance",
    "WCAG 3.0 APCA",
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
    title: "Advanced Color Contrast Checker - WCAG 2.2 & 3.0 Support",
    description: "Professional contrast checker with WCAG 2.2 and 3.0 APCA support. Test accessibility compliance instantly.",
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
    title: "Advanced Color Contrast Checker - WCAG 2.2 & 3.0",
    description: "Professional contrast checker with WCAG 2.2 and 3.0 APCA support. Test accessibility compliance instantly.",
    images: ["https://accessibility.build/images/tools/contrast-checker-twitter.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/tools/contrast-checker"
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
  { name: "Color Contrast Checker", url: "https://accessibility.build/tools/contrast-checker" }
]

export default function ContrastCheckerPage() {
  return (
    <>
      {/* Enhanced Schema Markup */}
      <AccessibilityToolStructuredData
        name="Advanced Color Contrast Checker"
        description="Professional color contrast checker supporting WCAG 2.2 and 3.0 APCA for comprehensive accessibility compliance testing"
        url="https://accessibility.build/tools/contrast-checker"
        applicationCategory="AccessibilityApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        aggregateRating={{
          ratingValue: "4.8",
          reviewCount: "1250"
        }}
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
