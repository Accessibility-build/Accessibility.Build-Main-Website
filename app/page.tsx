import type { Metadata } from "next"
import HomeClientPage from "./client-page"
import { company } from "@/lib/company"

export const revalidate = 300

export const metadata: Metadata = {
  title: { absolute: "Accessibility.build | Founder-Led Accessibility Audits & WCAG Tools" },
  description:
    "Founder-led accessibility audits, remediation, training, and practical WCAG tools from Khushwant Parihar. Inspect fixed-scope services, methodology, selected work, and sample evidence.",
  authors: [{ name: company.legalOperator, url: `${company.website}/authors/khushwant-parihar` }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Accessibility.build",
    title: "Accessibility.build | Founder-Led Accessibility Audits & WCAG Tools",
    description:
      "Founder-led accessibility audits, remediation, training, and practical WCAG tools with named accountability and sample evidence.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Accessibility.build - Founder-led accessibility consulting and WCAG tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility.build | Founder-Led Accessibility Audits & WCAG Tools",
    description:
      "Founder-led accessibility audits, remediation, training, and practical WCAG tools with named accountability and sample evidence.",
    images: ["/og-image.png"],
  },
}

export default function HomePage() {
  return <HomeClientPage />
}
