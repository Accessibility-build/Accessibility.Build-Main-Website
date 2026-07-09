import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAG141ClientPage from "./client-page"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata = createMetadata({
  title: "WCAG 1.4.1 Use of Color - Complete Guide",
  path: "/wcag/1-4-1",
  description:
    "Complete guide to WCAG 1.4.1 Use of Color. Interactive examples of color accessibility, color blindness simulation, and alternative visual cues.",
  keywords: ["WCAG 1.4.1", "use of color", "color accessibility", "color blind", "color blindness", "visual cues", "contrast"],
  type: "article",
  image: "/api/og?title=WCAG%201.4.1%20Use%20of%20Color&section=WCAG",
})

export default function WCAG141Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.4.1: Use of Color"
        description="Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element."
        criteria="1.4.1"
        level="A"
        principle="Perceivable"
        guideline="1.4 Distinguishable"
        url="https://accessibility.build/wcag/1-4-1"
        category="Distinguishable"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.4.1 Use of Color", url: "https://accessibility.build/wcag/1-4-1" },
        ]}
      />
      <WCAG141ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="1.4.1" />
      </div>
    </>
  )
}
