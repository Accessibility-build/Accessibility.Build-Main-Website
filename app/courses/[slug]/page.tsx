import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CpaccSalesPage, cpaccSalesMetadata } from "@/components/courses/sales/cpacc-sales-page"
import { WasSalesPage, wasSalesMetadata } from "@/components/courses/sales/was-sales-page"

// Public sales page for each course. The buyers' area is /courses/<slug>/learn.
const SALES: Record<string, { Page: () => React.JSX.Element; metadata: Metadata }> = {
  "cpacc-crash-course": { Page: CpaccSalesPage, metadata: cpaccSalesMetadata },
  "was-crash-course": { Page: WasSalesPage, metadata: wasSalesMetadata },
}

export function generateStaticParams() {
  return Object.keys(SALES).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return SALES[slug]?.metadata ?? {}
}

export default async function CourseSalesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = SALES[slug]
  if (!entry) notFound()
  return <entry.Page />
}
