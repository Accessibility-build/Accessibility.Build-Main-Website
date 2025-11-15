import { createMetadata } from "@/lib/metadata"
import WCAG131ClientPage from "./client-page"

export const metadata = createMetadata({
  title: "WCAG 1.3.1 Info and Relationships - Complete Guide with Live Examples",
  description:
    "Complete guide to WCAG 1.3.1 Info and Relationships. Interactive examples of semantic HTML, proper heading structure, and accessible markup.",
  keywords: ["WCAG 1.3.1", "info and relationships", "semantic HTML", "heading structure", "accessibility", "ARIA", "screen readers"]
})

export default function WCAG131Page() {
  return <WCAG131ClientPage />
} 