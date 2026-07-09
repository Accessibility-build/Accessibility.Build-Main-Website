import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Accessibility Hell — Demo",
  robots: { index: false, follow: false },
}

export default function HellLayout({ children }: { children: React.ReactNode }) {
  return children
}
