import { createMetadata } from "@/lib/metadata"
import WCAG121ClientPage from "./client-page"

export const metadata = createMetadata({
  title: "WCAG 1.2.1 Audio-only and Video-only (Prerecorded) - Complete Guide",
  description:
    "Complete guide to WCAG 1.2.1 Audio-only and Video-only (Prerecorded). Live examples, transcript demos, testing methods, and implementation code.",
  keywords: ["WCAG 1.2.1", "audio-only", "video-only", "prerecorded", "transcripts", "audio description", "screen reader"]
})

export default function WCAG121Page() {
  return <WCAG121ClientPage />
} 