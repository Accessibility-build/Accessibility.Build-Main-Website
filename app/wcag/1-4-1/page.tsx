import { createMetadata } from "@/lib/metadata"
import WCAG141ClientPage from "./client-page"

export const metadata = createMetadata({
  title: "WCAG 1.4.1 Use of Color - Complete Guide with Interactive Examples",
  description:
    "Complete guide to WCAG 1.4.1 Use of Color. Interactive examples of color accessibility, color blindness simulation, and alternative visual cues.",
  keywords: ["WCAG 1.4.1", "use of color", "color accessibility", "color blind", "color blindness", "visual cues", "contrast"]
})

export default function WCAG141Page() {
  return <WCAG141ClientPage />
} 