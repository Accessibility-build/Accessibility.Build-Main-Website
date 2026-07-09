import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAG122ClientPage from "./client-page"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata = createMetadata({
  title: "WCAG 1.2.2 Captions (Prerecorded) - Complete Guide",
  path: "/wcag/1-2-2",
  description:
    "Complete guide to WCAG 1.2.2 Captions (Prerecorded). Interactive caption examples, testing methods, and implementation code for video accessibility.",
  keywords: ["WCAG 1.2.2", "captions", "prerecorded", "video accessibility", "subtitles", "deaf", "hard of hearing"],
  type: "article",
  image: "/api/og?title=WCAG%201.2.2%20Captions%20(Prerecorded)&section=WCAG",
})

export default function WCAG122Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.2.2: Captions (Prerecorded)"
        description="Captions are provided for all prerecorded audio content in synchronized media, except when the media is a media alternative for text and is clearly labeled as such."
        criteria="1.2.2"
        level="A"
        principle="Perceivable"
        guideline="1.2 Time-based Media"
        url="https://accessibility.build/wcag/1-2-2"
        category="Time-based Media"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.2.2 Captions (Prerecorded)", url: "https://accessibility.build/wcag/1-2-2" },
        ]}
      />
      <WCAG122ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="1.2.2" />
      </div>
    </>
  )
}
