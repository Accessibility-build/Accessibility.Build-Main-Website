import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAG133ClientPage from "./client-page"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata = createMetadata({
  title: "WCAG 1.3.3 Sensory Characteristics - Complete Guide",
  path: "/wcag/1-3-3",
  description:
    "Complete guide to WCAG 1.3.3 Sensory Characteristics. Interactive examples of accessible instructions, avoiding color-only and shape-only references.",
  keywords: ["WCAG 1.3.3", "sensory characteristics", "instructions", "color blind", "accessible design", "visual cues", "audio cues"],
  type: "article",
  image: "/api/og?title=WCAG%201.3.3%20Sensory%20Characteristics&section=WCAG",
})

export default function WCAG133Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.3.3: Sensory Characteristics"
        description="Instructions provided for understanding and operating content do not rely solely on sensory characteristics of components such as shape, color, size, visual location, orientation, or sound."
        criteria="1.3.3"
        level="A"
        principle="Perceivable"
        guideline="1.3 Adaptable"
        url="https://accessibility.build/wcag/1-3-3"
        category="Adaptable"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.3.3 Sensory Characteristics", url: "https://accessibility.build/wcag/1-3-3" },
        ]}
      />
      <WCAG133ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="1.3.3" />
      </div>
    </>
  )
}
