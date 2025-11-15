import { createMetadata } from "@/lib/metadata"
import WCAG123ClientPage from "./client-page"

export const metadata = createMetadata({
  title: "WCAG 1.2.3 Audio Description or Media Alternative - Complete Guide",
  description:
    "Complete guide to WCAG 1.2.3 Audio Description or Media Alternative. Interactive examples of audio descriptions, testing methods, and implementation code.",
  keywords: ["WCAG 1.2.3", "audio description", "media alternative", "video accessibility", "visual content", "blind users"]
})

export default function WCAG123Page() {
  return <WCAG123ClientPage />
} 