import type { Metadata } from "next"
import WCAGExcelDownload from "./excel-download"
import { getWCAGStats } from "@/lib/wcag-data"
import { BreadcrumbStructuredData, AccessibilityToolStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"

export const metadata: Metadata = {
  title: "WCAG 2.2 Checklist Excel Template | All 86 Criteria",
  description:
    "Download free WCAG 2.2 checklist Excel template with all 86 success criteria. Includes progress tracking, audit summary, and professional formatting for accessibility audits.",
  keywords: [
    "wcag 2.2 checklist excel",
    "WCAG checklist download",
    "accessibility checklist excel",
    "WCAG 2.2 excel template",
    "WCAG audit template",
    "accessibility audit spreadsheet",
    "WCAG compliance checklist",
    "free WCAG checklist",
    "WCAG 2.2 spreadsheet"
  ],
  openGraph: {
    title: "WCAG 2.2 Checklist Excel Template - Free Download",
    description: "Download free WCAG 2.2 checklist Excel template with all 86 success criteria. Professional formatting for accessibility audits.",
    type: "website",
    url: "https://accessibility.build/checklists/wcag-2-2/excel",
    images: [
      {
        url: "https://accessibility.build/images/checklists/wcag-excel-og.png",
        width: 1200,
        height: 630,
        alt: "WCAG 2.2 Checklist Excel Template Download"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.2 Checklist Excel Template - Free Download",
    description: "Download free WCAG 2.2 checklist Excel template with all 86 success criteria.",
    images: ["https://accessibility.build/images/checklists/wcag-excel-og.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/checklists/wcag-2-2/excel"
  },
  robots: {
    index: true,
    follow: true
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Checklists", url: "https://accessibility.build/checklists" },
  { name: "WCAG 2.2 Checklist", url: "https://accessibility.build/checklists/wcag-2-2" },
  { name: "Excel Download", url: "https://accessibility.build/checklists/wcag-2-2/excel" }
]

export default function WCAGExcelPage() {
  const stats = getWCAGStats()

  // Rendered on the page AND emitted as FAQPage schema by <FaqSection>, from this
  // one array. Counts come from the criteria data: the previous hardcoded split
  // (30 / 20 / 28) totalled 78 and was left over from an earlier WCAG version.
  const faqs = [
    {
      question: "What is included in the WCAG 2.2 Excel checklist template?",
      answer: `The template includes all ${stats.total} WCAG 2.2 success criteria organized by principle and level, with columns for status tracking, completion dates, notes, and priority. It also includes an Audit Summary sheet and a Progress Tracking sheet.`,
    },
    {
      question: "Is the WCAG 2.2 Excel checklist free?",
      answer:
        "Yes, the WCAG 2.2 checklist Excel template is completely free to download and use for personal or commercial accessibility audits, with no account required.",
    },
    {
      question: "Can I customize the Excel checklist?",
      answer:
        "Yes, the template is fully editable. You can add custom columns for assignees, severity, or target dates, modify existing fields, add your branding, and adjust the formatting to match your audit workflow.",
    },
    {
      question: "Does the checklist include Level A, AA, and AAA criteria?",
      answer: `Yes, the Excel template includes all WCAG 2.2 success criteria across all three conformance levels: Level A (${stats.byLevel.A} criteria), Level AA (${stats.byLevel.AA} criteria), and Level AAA (${stats.byLevel.AAA} criteria), for ${stats.total} in total. Most legal and procurement requirements reference Level AA, so filtering to A and AA gives you the ${stats.byLevel.A + stats.byLevel.AA} criteria that usually matter for compliance.`,
    },
  ]

  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <AccessibilityToolStructuredData
        name="WCAG 2.2 Checklist Excel Template"
        description="Download free WCAG 2.2 checklist Excel template with all 86 success criteria, progress tracking, and professional formatting for accessibility audits"
        url="https://accessibility.build/checklists/wcag-2-2/excel"
        applicationCategory="AccessibilityApplication"
        operatingSystem="Any"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        accessibilityFeatures={[
          "keyboardNavigation",
          "screenReaderSupport"
        ]}
      />

      <WCAGExcelDownload />

      <div className="container-wide pb-16">
        <div className="max-w-3xl mx-auto">
          <FaqSection faqs={faqs} title="WCAG 2.2 Excel Template FAQ" />
        </div>
      </div>
    </>
  )
}
