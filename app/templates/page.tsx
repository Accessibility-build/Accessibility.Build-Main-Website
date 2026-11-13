import type { Metadata } from "next"
import Link from "next/link"
import { FileSpreadsheet, FileText } from "lucide-react"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { clampDescription } from "@/lib/metadata"
import { formatUsd, lowestPrice, products } from "@/lib/products"

const pageTitle = "Accessibility Templates: Audit Workbook and Title II Kit"
const pageDescription =
  "Downloadable accessibility templates: a WCAG 2.2 audit workbook for Excel and Google Sheets, and an ADA Title II compliance kit for state and local governments."
const ogTitle = encodeURIComponent("Accessibility Templates")

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: ["accessibility templates", "wcag audit template", "ada title ii templates", "accessibility policy template"],
  alternates: { canonical: "/templates" },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/templates",
    type: "website",
    images: [{ url: `/api/og?title=${ogTitle}&section=Templates`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [{ url: `/api/og?title=${ogTitle}&section=Templates`, width: 1200, height: 630 }],
  },
}

const cards = [
  { product: products.wcagWorkbook, icon: FileSpreadsheet, audience: "For auditors, developers and QA teams" },
  { product: products.titleIiKit, icon: FileText, audience: "For state and local governments, and their consultants" },
]

export default function TemplatesPage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Templates", url: "https://accessibility.build/templates" },
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <p className="text-blue-700 dark:text-blue-400 font-semibold text-sm tracking-wider uppercase mb-3">Templates</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Accessibility templates</h1>
        <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mb-12">
          Ready-to-use files written from primary sources. Buy once, download straight away, and use them as your licence allows.
        </p>
        <ul className="grid gap-6 md:grid-cols-2" role="list">
          {cards.map(({ product, icon: Icon, audience }) => (
            <li key={product.slug} className="relative flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm focus-within:ring-2 focus-within:ring-blue-600">
              <Icon className="h-8 w-8 text-blue-700 dark:text-blue-400 mb-4" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                <Link href={product.route} className="after:absolute after:inset-0 focus-visible:outline-none hover:text-blue-700 dark:hover:text-blue-400">
                  {product.name}
                </Link>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{audience}</p>
              <p className="text-slate-700 dark:text-slate-300 flex-1">{product.tagline}</p>
              <p className="mt-4 font-semibold text-slate-900 dark:text-white">From {formatUsd(lowestPrice(product))}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-slate-700 dark:text-slate-300">
          Prefer to have it done for you? See our{" "}
          <Link href="/services/accessibility-audits" className="underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-400">
            fixed-price accessibility audits
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
