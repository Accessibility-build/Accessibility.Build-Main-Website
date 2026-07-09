import type { Metadata } from "next"

const title = "Accessible Pagination Pattern"
const description =
  "Make numbered pages, infinite scroll, load-more buttons, and cursor pagination accessible with keyboard support, focus management, and announcements."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/learn/pagination" },
  openGraph: {
    title,
    description,
    url: "/learn/pagination",
  },
}

export default function PaginationLayout({ children }: { children: React.ReactNode }) {
  return children
}
