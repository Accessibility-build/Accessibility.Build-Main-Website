import type { Metadata } from "next"
import ContrastCheckerEmbed from "./ContrastCheckerEmbed"

// A chromeless version of /tools/contrast-checker for other sites to iframe;
// the embed code is offered on the tool page. On /embed/ paths the root layout
// drops the header, footer and consent banner, and next.config.mjs lets any
// origin frame the page. It is noindex and deliberately absent from
// lib/site-routes.ts, so it never competes with the tool page in search.
export const metadata: Metadata = {
  title: "Color Contrast Checker Widget",
  description:
    "Embeddable WCAG 2.2 color contrast checker: two hex codes in, the contrast ratio and AA and AAA results out.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function ContrastCheckerEmbedPage() {
  return <ContrastCheckerEmbed />
}
