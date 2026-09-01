import type { Metadata } from "next"

const title = "Accessible Component Patterns"
const description =
  "Interactive tutorials for building accessible UI components: data tables, pagination, modal dialogs, carousels, and search with live demos and code."

export const metadata: Metadata = {
  // A plain-string title here would clear the root title template for child
  // segments (/learn/modals etc.), so re-declare the template alongside the
  // default. The site convention is no brand suffix, so the template is "%s".
  title: {
    default: title,
    template: "%s",
  },
  description,
  alternates: { canonical: "/learn" },
  openGraph: {
    title,
    description,
    url: "/learn",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(title)}&section=Learn`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children
}
