import type { Metadata } from "next"
import ScopeChecker from "@/components/tools/scope-checker"
import { BreadcrumbStructuredData, ToolStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "Scope Checker for Accessibility | Crawl URLs, Documents & Titles | Accessibility.build",
  description:
    "Use our scope checker for accessibility to crawl a website, collect internal URLs and document links, capture page titles, and map extra links in a strict 2-minute run.",
  keywords: [
    "scope checker for accessibility",
    "scope checker",
    "website url crawler",
    "document url finder",
    "website page titles",
    "sitemap and crawler tool",
    "internal link discovery",
    "technical seo crawler",
    "accessibility site inventory",
  ],
  openGraph: {
    title: "Scope Checker for Accessibility | URL + Document Discovery",
    description:
      "Find scoped URLs, documents, and external extras with our scope checker for accessibility, including accurate page title extraction.",
    type: "website",
    url: "https://accessibility.build/tools/scope-checker",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "Scope Checker for Accessibility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scope Checker for Accessibility | URL + Document Discovery",
    description:
      "Scope checker for accessibility with chunked crawl output, document discovery, and page title capture in 2 minutes.",
    images: ["https://accessibility.build/og-image.png"],
  },
  alternates: {
    canonical: "https://accessibility.build/tools/scope-checker",
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Scope Checker", url: "https://accessibility.build/tools/scope-checker" },
]

export default function ScopeCheckerPage() {
  return (
    <>
      <ToolStructuredData
        name="Scope Checker for Accessibility"
        description="Scope checker for accessibility that crawls internal URLs, document links, extra links, and page titles."
        url="https://accessibility.build/tools/scope-checker"
        applicationCategory="DeveloperApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD",
        }}
        aggregateRating={{
          ratingValue: "4.8",
          reviewCount: "210",
        }}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container-wide py-12">
          <ScopeChecker />

          <div className="mt-16">
            <RelatedContent
              content="website crawling sitemap internal links technical seo scope discovery accessibility auditing"
              title="Related Tools & Resources"
              maxItems={3}
              showDescriptions={true}
            />
          </div>
        </div>
      </div>
    </>
  )
}
