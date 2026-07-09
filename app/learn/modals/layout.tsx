import type { Metadata } from "next"

const title = "Accessible Modal Dialog Pattern"
const description =
  "Build accessible modal dialogs with focus trapping, keyboard controls, backdrop and scroll handling, and proper screen reader announcements."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/learn/modals" },
  openGraph: {
    title,
    description,
    url: "/learn/modals",
  },
}

export default function ModalsLayout({ children }: { children: React.ReactNode }) {
  return children
}
