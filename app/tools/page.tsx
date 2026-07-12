import type { Metadata } from "next"
import ToolsClientPage from "./ToolsClientPage"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { toolCatalog } from "@/lib/tool-catalog"

export const metadata: Metadata = {
  title: "Accessibility Tools | WCAG 2.2 & 3.0 Compliance",
  description: "Practical accessibility testing, content, design, planning, and developer tools for building more inclusive digital products.",
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
    title: "Accessibility Tools | WCAG 2.2 & 3.0 Compliance",
    description: "Practical accessibility testing, content, design, planning, and developer tools for building more inclusive digital products.",
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
    title: "Accessibility Tools | WCAG 2.2 & 3.0 Compliance",
    description: "Practical accessibility testing, content, design, planning, and developer tools for building more inclusive digital products.",
    images: ["/og-image.png"]
  },
  alternates: {
    canonical: "/tools"
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
    "description": "Practical accessibility testing, content, design, planning, and developer tools for building more inclusive digital products.",
    "url": "https://accessibility.build/tools",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": toolCatalog.length,
      "itemListElement": toolCatalog.map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://accessibility.build/tools/${tool.slug}`,
        "name": tool.title
      }))
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
