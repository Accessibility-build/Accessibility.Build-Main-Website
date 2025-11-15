import { createMetadata } from "@/lib/metadata"
import WCAG132ClientPage from "./client-page"

export const metadata = createMetadata({
  title: "WCAG 1.3.2 Meaningful Sequence - Complete Guide with Interactive Examples",
  description:
    "Complete guide to WCAG 1.3.2 Meaningful Sequence. Interactive examples of logical reading order, CSS layout impacts, and screen reader navigation.",
  keywords: ["WCAG 1.3.2", "meaningful sequence", "reading order", "logical sequence", "screen reader", "CSS layout", "accessibility"]
})

export default function WCAG132Page() {
  return <WCAG132ClientPage />
} 