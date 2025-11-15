import { createMetadata } from "@/lib/metadata"
import WCAG122ClientPage from "./client-page"

export const metadata = createMetadata({
  title: "WCAG 1.2.2 Captions (Prerecorded) - Complete Guide with Live Examples",
  description:
    "Complete guide to WCAG 1.2.2 Captions (Prerecorded). Interactive caption examples, testing methods, and implementation code for video accessibility.",
  keywords: ["WCAG 1.2.2", "captions", "prerecorded", "video accessibility", "subtitles", "deaf", "hard of hearing"]
})

export default function WCAG122Page() {
  return <WCAG122ClientPage />
} 