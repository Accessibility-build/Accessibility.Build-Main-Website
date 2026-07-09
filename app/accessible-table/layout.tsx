import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Accessible Table Demo",
  robots: { index: false, follow: false },
}

export default function AccessibleTableLayout({ children }: { children: React.ReactNode }) {
  return children
}
