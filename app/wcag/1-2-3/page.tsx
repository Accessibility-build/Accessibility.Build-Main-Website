import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAG123ClientPage from "./client-page"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata = createMetadata({
  title: "WCAG 1.2.3 Audio Description or Media Alternative",
  path: "/wcag/1-2-3",
  description:
    "Complete guide to WCAG 1.2.3 Audio Description or Media Alternative. Interactive examples of audio descriptions, testing methods, and implementation code.",
  keywords: ["WCAG 1.2.3", "audio description", "media alternative", "video accessibility", "visual content", "blind users"],
  type: "article",
  image: "/api/og?title=WCAG%201.2.3%20Audio%20Description%20or%20Media%20Alternative%20(Prerecorded)&section=WCAG",
})

export default function WCAG123Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.2.3: Audio Description or Media Alternative (Prerecorded)"
        description="An alternative for time-based media or audio description of the prerecorded video content is provided for synchronized media."
        criteria="1.2.3"
        level="A"
        principle="Perceivable"
        guideline="1.2 Time-based Media"
        url="https://accessibility.build/wcag/1-2-3"
        category="Time-based Media"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.2.3 Audio Description or Media Alternative (Prerecorded)", url: "https://accessibility.build/wcag/1-2-3" },
        ]}
      />
      <WCAG123ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="1.2.3" />
      </div>
    </>
  )
}
