import { createMetadata } from "@/lib/metadata"
import WCAG133ClientPage from "./client-page"

export const metadata = createMetadata({
  title: "WCAG 1.3.3 Sensory Characteristics - Complete Guide with Interactive Examples",
  description:
    "Complete guide to WCAG 1.3.3 Sensory Characteristics. Interactive examples of accessible instructions, avoiding color-only and shape-only references.",
  keywords: ["WCAG 1.3.3", "sensory characteristics", "instructions", "color blind", "accessible design", "visual cues", "audio cues"]
})

export default function WCAG133Page() {
  return <WCAG133ClientPage />
} 