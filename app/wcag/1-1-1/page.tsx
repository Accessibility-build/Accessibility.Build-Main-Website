import { createMetadata } from "@/lib/metadata"
import WCAG111ClientPage from "./client-page"

export const metadata = createMetadata({
  title: "WCAG 1.1.1 Non-text Content - Complete Guide with Live Examples",
  description:
    "Comprehensive guide to WCAG 1.1.1 Non-text Content success criterion. Interactive examples, screen reader demos, testing methods, and implementation code.",
  keywords: ["WCAG 1.1.1", "non-text content", "alt text", "accessibility", "text alternatives", "images", "screen reader"]
})

export default function WCAG111Page() {
  return <WCAG111ClientPage />
} 