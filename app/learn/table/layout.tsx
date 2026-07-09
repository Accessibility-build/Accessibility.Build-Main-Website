import type { Metadata } from "next"

const title = "Accessible Data Table Pattern"
const description =
  "Build accessible data tables: semantic markup, sortable columns with aria-sort, responsive layouts, row selection, and inline editing."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/learn/table" },
  openGraph: {
    title,
    description,
    url: "/learn/table",
  },
}

export default function TableLayout({ children }: { children: React.ReactNode }) {
  return children
}
