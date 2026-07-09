import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAG111ClientPage from "./client-page"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata = createMetadata({
  title: "WCAG 1.1.1 Non-text Content - Complete Guide",
  path: "/wcag/1-1-1",
  description:
    "Comprehensive guide to WCAG 1.1.1 Non-text Content success criterion. Interactive examples, screen reader demos, testing methods, and implementation code.",
  keywords: ["WCAG 1.1.1", "non-text content", "alt text", "accessibility", "text alternatives", "images", "screen reader"],
  type: "article",
  image: "/api/og?title=WCAG%201.1.1%20Non-text%20Content&section=WCAG",
})

export default function WCAG111Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.1.1: Non-text Content"
        description="All non-text content that is presented to the user has a text alternative that serves the equivalent purpose."
        criteria="1.1.1"
        level="A"
        principle="Perceivable"
        guideline="1.1 Text Alternatives"
        url="https://accessibility.build/wcag/1-1-1"
        category="Text Alternatives"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.1.1 Non-text Content", url: "https://accessibility.build/wcag/1-1-1" },
        ]}
      />
      <WCAG111ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="1.1.1" />
      </div>
    </>
  )
}
