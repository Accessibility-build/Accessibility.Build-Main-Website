import type { Metadata } from "next"
import { HelpCenterClient } from "@/components/help/help-center-client"

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Find working Accessibility.build guides for accounts, billing, tools, WCAG testing, reports, privacy, and professional accessibility services.",
  alternates: { canonical: "/help" },
}

export default function HelpPage() {
  return <HelpCenterClient />
}
