import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAG131ClientPage from "./client-page"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata = createMetadata({
  title: "WCAG 1.3.1 Info and Relationships - Complete Guide",
  path: "/wcag/1-3-1",
  description:
    "Complete guide to WCAG 1.3.1 Info and Relationships. Interactive examples of semantic HTML, proper heading structure, and accessible markup.",
  keywords: ["WCAG 1.3.1", "info and relationships", "semantic HTML", "heading structure", "accessibility", "ARIA", "screen readers"],
  type: "article",
  image: "/api/og?title=WCAG%201.3.1%20Info%20and%20Relationships&section=WCAG",
})

export default function WCAG131Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.3.1: Info and Relationships"
        description="Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text."
        criteria="1.3.1"
        level="A"
        principle="Perceivable"
        guideline="1.3 Adaptable"
        url="https://accessibility.build/wcag/1-3-1"
        category="Adaptable"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.3.1 Info and Relationships", url: "https://accessibility.build/wcag/1-3-1" },
        ]}
      />
      <WCAG131ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="1.3.1" />
      </div>
    </>
  )
}
