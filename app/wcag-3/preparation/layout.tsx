import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "How to Prepare for WCAG 3.0: Practical Steps for Teams and Organizations",
  description:
    "Actionable steps teams can take today to prepare for WCAG 3.0. Covers 5 action areas, team role guidance, and a practical checklist for developers, designers, QA, product managers, and compliance teams.",
  keywords: [
    "prepare for WCAG 3.0",
    "WCAG 3.0 preparation",
    "WCAG 3 transition plan",
    "WCAG 3.0 action plan",
    "how to prepare WCAG 3",
    "WCAG 3 readiness",
  ],
})

export default function PreparationLayout({ children }: { children: React.ReactNode }) {
  return children
}
