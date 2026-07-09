import type { Metadata } from "next"

const title = "Accessible Search Pattern"
const description =
  "Build accessible search with the ARIA combobox pattern: keyboard controls, live result announcements, and loading and empty states done right."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/learn/search" },
  openGraph: {
    title,
    description,
    url: "/learn/search",
  },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
