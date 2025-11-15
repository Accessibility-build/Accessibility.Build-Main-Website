import type { Metadata } from "next"
import UrlAccessibilityAuditor from "@/components/tools/url-accessibility-auditor"

export const metadata: Metadata = {
  title: "URL Accessibility Auditor | axe-core + AI Analysis | Accessibility.build",
  description:
    "Comprehensive website accessibility testing powered by axe-core and AI. Get detailed WCAG compliance reports, violation analysis, and actionable recommendations for any URL.",
  keywords: [
    "url accessibility audit",
    "website accessibility testing",
    "axe-core accessibility",
    "WCAG compliance checker",
    "accessibility violations",
    "AI accessibility analysis",
    "accessibility report",
    "accessibility scanner",
    "web accessibility audit",
    "accessibility testing tool",
    "WCAG 2.1 compliance",
    "accessibility score",
    "automated accessibility testing"
  ],
  openGraph: {
    title: "URL Accessibility Auditor | Comprehensive Testing with AI Analysis",
    description: "Test any website for accessibility compliance with axe-core and get AI-powered recommendations. Detailed WCAG violation reports and priority fixes.",
    type: "website",
  },
}

export default function UrlAccessibilityAuditorPage() {
  return <UrlAccessibilityAuditor />
} 