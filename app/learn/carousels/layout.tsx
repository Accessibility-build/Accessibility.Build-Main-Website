import type { Metadata } from "next"

const title = "Accessible Carousel Pattern"
const description =
  "Build accessible carousels with proper controls and indicators, keyboard navigation, reduced-motion support, and fixes for common mistakes."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/learn/carousels" },
  openGraph: {
    title,
    description,
    url: "/learn/carousels",
  },
}

export default function CarouselsLayout({ children }: { children: React.ReactNode }) {
  return children
}
