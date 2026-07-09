import type { Metadata } from "next"

const title = "Accessible Component Patterns"
const description =
  "Interactive tutorials for building accessible UI components: data tables, pagination, modal dialogs, carousels, and search with live demos and code."

export const metadata: Metadata = {
  // A plain-string title here would clear the root title template for child
  // segments (/learn/modals etc.), so re-declare the template alongside the default.
  title: {
    default: title,
    template: "%s | Accessibility.build",
  },
  description,
  alternates: { canonical: "/learn" },
  openGraph: {
    title,
    description,
    url: "/learn",
  },
}

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children
}
