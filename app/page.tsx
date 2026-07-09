import type { Metadata } from "next"
import HomeClientPage from "./client-page"

export const metadata: Metadata = {
  title: { absolute: "Web Accessibility Tools & WCAG Compliance | Accessibility.build" },
  description:
    "Test, learn, and ship accessible websites. Free WCAG 2.2 testing tools, success criterion guides, checklists, and expert accessibility audit services.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Accessibility.build",
    title: "Web Accessibility Tools & WCAG Compliance | Accessibility.build",
    description:
      "Test, learn, and ship accessible websites. Free WCAG 2.2 testing tools, success criterion guides, checklists, and expert accessibility audit services.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Accessibility.build - Web accessibility tools and WCAG resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Accessibility Tools & WCAG Compliance | Accessibility.build",
    description:
      "Free WCAG 2.2 testing tools, success criterion guides, checklists, and expert accessibility audit services.",
    images: ["/og-image.png"],
  },
}

export default function HomePage() {
  return <HomeClientPage />
}
