import type { Metadata } from "next"
import AccessibilityAuditHelper from "@/components/tools/accessibility-audit-helper"

export const metadata: Metadata = {
  title: "AI Accessibility Audit Helper | Expert Issue Analysis & Code Recommendations | Accessibility.build",
  description:
    "Get expert accessibility analysis with AI. Describe issues, add code snippets, specify your tech stack and receive detailed WCAG compliance recommendations, code fixes, and implementation guidance.",
  keywords: [
    "accessibility audit",
    "WCAG compliance",
    "accessibility issues",
    "code recommendations", 
    "accessibility expert",
    "AI accessibility",
    "accessibility analysis",
    "accessibility consulting",
    "accessibility fixes",
    "accessibility testing",
    "inclusive design",
    "web accessibility"
  ],
  openGraph: {
    title: "AI Accessibility Audit Helper | Expert Issue Analysis",
    description: "Get expert accessibility analysis with AI. Comprehensive issue analysis, WCAG compliance recommendations, and code fixes.",
    type: "website",
  },
}

export default function AccessibilityAuditHelperPage() {
  return <AccessibilityAuditHelper />
} 