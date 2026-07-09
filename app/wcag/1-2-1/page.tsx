import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAG121ClientPage from "./client-page"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata = createMetadata({
  title: "WCAG 1.2.1 Audio-only and Video-only (Prerecorded)",
  path: "/wcag/1-2-1",
  description:
    "Complete guide to WCAG 1.2.1 Audio-only and Video-only (Prerecorded). Live examples, transcript demos, testing methods, and implementation code.",
  keywords: ["WCAG 1.2.1", "audio-only", "video-only", "prerecorded", "transcripts", "audio description", "screen reader"],
  type: "article",
  image: "/api/og?title=WCAG%201.2.1%20Audio-only%20and%20Video-only%20(Prerecorded)&section=WCAG",
})

export default function WCAG121Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.2.1: Audio-only and Video-only (Prerecorded)"
        description="An alternative for time-based media or an audio track is provided for prerecorded audio-only and prerecorded video-only content."
        criteria="1.2.1"
        level="A"
        principle="Perceivable"
        guideline="1.2 Time-based Media"
        url="https://accessibility.build/wcag/1-2-1"
        category="Time-based Media"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.2.1 Audio-only and Video-only (Prerecorded)", url: "https://accessibility.build/wcag/1-2-1" },
        ]}
      />
      <WCAG121ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="1.2.1" />
      </div>
    </>
  )
}
