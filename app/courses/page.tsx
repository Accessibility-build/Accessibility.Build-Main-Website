import type { Metadata } from "next"
import Link from "next/link"
import { GraduationCap } from "lucide-react"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { InDevelopmentBadge } from "@/components/courses/in-development-badge"
import { clampDescription } from "@/lib/metadata"
import { courseProductList, formatUsd, lowestPrice } from "@/lib/products"

const pageTitle = "Accessibility Courses"
const pageDescription = "Online accessibility courses from Accessibility.build: independent crash courses and practice exams for the IAAP CPACC and WAS certifications."
const og = `/api/og?title=${encodeURIComponent(pageTitle)}&section=Courses`

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  alternates: { canonical: "/courses" },
  openGraph: { title: pageTitle, description: pageDescription, url: "/courses", type: "website", images: [{ url: og, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription, images: [{ url: og, width: 1200, height: 630 }] },
}

export default function CoursesPage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Courses", url: "https://accessibility.build/courses" },
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <p className="text-blue-700 dark:text-blue-400 font-semibold text-sm tracking-wider uppercase mb-3">Courses</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Accessibility courses</h1>
        <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mb-12">
          Study online at your own pace, on any device. Your progress is saved to your account.
        </p>
        <ul className="grid gap-6 md:grid-cols-2" role="list">
          {courseProductList.map((p) => (
            <li key={p.slug} className="relative flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm focus-within:ring-2 focus-within:ring-blue-600">
              <div className="mb-4 flex items-start justify-between gap-3">
                <GraduationCap className="h-8 w-8 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                {p.inDevelopment ? <InDevelopmentBadge /> : null}
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                <Link href={p.route} className="after:absolute after:inset-0 focus-visible:outline-none hover:text-blue-700 dark:hover:text-blue-400">
                  {p.name}
                </Link>
              </h2>
              {p.audience ? <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{p.audience}</p> : null}
              <p className="text-slate-700 dark:text-slate-300 flex-1">{p.tagline}</p>
              <p className="mt-4 font-semibold text-slate-900 dark:text-white">From {formatUsd(lowestPrice(p))}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-slate-600 dark:text-slate-400">
          Independent courses. Not affiliated with, approved by or endorsed by IAAP. CPACC and WAS are certifications of the International Association of Accessibility Professionals. Courses tagged in development are still being finished, so their content may change.
        </p>
      </div>
    </div>
  )
}
