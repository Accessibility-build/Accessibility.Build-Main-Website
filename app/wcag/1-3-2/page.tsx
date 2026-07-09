import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAG132ClientPage from "./client-page"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata = createMetadata({
  title: "WCAG 1.3.2 Meaningful Sequence - Complete Guide",
  path: "/wcag/1-3-2",
  description:
    "Complete guide to WCAG 1.3.2 Meaningful Sequence. Interactive examples of logical reading order, CSS layout impacts, and screen reader navigation.",
  keywords: ["WCAG 1.3.2", "meaningful sequence", "reading order", "logical sequence", "screen reader", "CSS layout", "accessibility"],
  type: "article",
  image: "/api/og?title=WCAG%201.3.2%20Meaningful%20Sequence&section=WCAG",
})

export default function WCAG132Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.3.2: Meaningful Sequence"
        description="When the sequence in which content is presented affects its meaning, a correct reading sequence can be programmatically determined."
        criteria="1.3.2"
        level="A"
        principle="Perceivable"
        guideline="1.3 Adaptable"
        url="https://accessibility.build/wcag/1-3-2"
        category="Adaptable"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.3.2 Meaningful Sequence", url: "https://accessibility.build/wcag/1-3-2" },
        ]}
      />
      <WCAG132ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="1.3.2" />
      </div>
    </>
  )
}
