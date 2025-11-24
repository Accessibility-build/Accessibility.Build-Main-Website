import type { Metadata } from "next"
import ToolsClientPage from "./ToolsClientPage"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"

export const metadata: Metadata = {
  title: "Professional Accessibility Tools | WCAG 2.2 & 3.0 Compliance",
  description: "Comprehensive suite of AI-powered accessibility tools including contrast checkers, alt text generators, and WCAG compliance auditors.",
  keywords: [
    "accessibility tools",
    "wcag tools",
    "accessibility testing",
    "color contrast checker",
    "alt text generator",
    "accessibility audit",
    "wcag compliance",
    "digital accessibility",
    "web accessibility tools"
  ],
  openGraph: {
    title: "Professional Accessibility Tools | Accessibility.build",
    description: "Comprehensive suite of AI-powered accessibility tools including contrast checkers, alt text generators, and WCAG compliance auditors.",
    type: "website",
    url: "https://accessibility.build/tools",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Accessibility.build Tools Suite"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Accessibility Tools | Accessibility.build",
    description: "Comprehensive suite of AI-powered accessibility tools including contrast checkers, alt text generators, and WCAG compliance auditors.",
    images: ["/og-image.png"]
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" }
]

export default function ToolsPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Accessibility Tools Suite",
    "description": "Comprehensive suite of AI-powered accessibility tools including contrast checkers, alt text generators, and WCAG compliance auditors.",
    "url": "https://accessibility.build/tools",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url": "https://accessibility.build/tools/contrast-checker",
          "name": "Color Contrast Checker"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url": "https://accessibility.build/tools/alt-text-generator",
          "name": "AI Alt Text Generator"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url": "https://accessibility.build/tools/accessibility-audit-helper",
          "name": "AI Accessibility Audit Helper"
        }
      ]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema)
        }}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ToolsClientPage />
    </>
  )
}
