import type { Metadata } from "next"
import { company } from "@/lib/company"

/**
 * Longest meta description that survives intact in a search snippet. Google and
 * Bing truncate at roughly 155 to 160 characters and frequently rewrite anything
 * longer, so the meta tag gets the clamped text while Open Graph keeps the full
 * version (social cards have no such limit).
 */
export const META_DESCRIPTION_MAX = 155

/**
 * Trim a description to META_DESCRIPTION_MAX characters. Prefers the last
 * sentence boundary that fits, so the snippet reads as a complete thought;
 * falls back to a word boundary with an ellipsis when no sentence fits.
 */
export function clampDescription(text: string, max: number = META_DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  const window = clean.slice(0, max)
  const sentenceEnd = Math.max(window.lastIndexOf(". "), window.lastIndexOf("! "), window.lastIndexOf("? "))
  if (sentenceEnd >= 80) return window.slice(0, sentenceEnd + 1)
  if (window.endsWith(".") || window.endsWith("!") || window.endsWith("?")) return window
  const wordEnd = window.lastIndexOf(" ")
  return `${window.slice(0, wordEnd > 60 ? wordEnd : max - 1).replace(/[,;:\s]+$/, "")}…`
}

// Base metadata that can be extended for specific pages
// Note: metadataBase is set once in app/layout.tsx — do not redeclare it here or in pages.
export const baseMetadata: Metadata = {
  title: {
    default: "Accessibility.build | Founder-Led WCAG Audits & Tools",
    // No brand suffix: the root layout dropped "%s | Accessibility.build" in
    // August 2026 because it pushed most titles past the 60-character mark.
    template: "%s",
  },
  description:
    "Founder-led accessibility services, practical WCAG 2.2 tools, implementation guides, research, and resources for more inclusive digital products.",
  keywords: [
    "accessibility",
    "a11y",
    "WCAG",
    "web accessibility",
    "inclusive design",
    "accessible forms",
    "keyboard navigation",
    "color contrast",
    "digital accessibility",
    "ADA compliance",
    "screen reader testing",
  ],
  authors: [{ name: company.legalOperator, url: company.founderWebsite }],
  creator: company.legalOperator,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://accessibility.build",
    title: "Accessibility.build | Founder-Led WCAG Audits & Tools",
    description:
      "Founder-led accessibility services, practical WCAG 2.2 tools, implementation guides, research, and resources for more inclusive digital products.",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "Accessibility.build",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility.build | Founder-Led WCAG Audits & Tools",
    description:
      "Founder-led accessibility services, practical WCAG 2.2 tools, implementation guides, research, and resources for more inclusive digital products.",
    images: ["https://accessibility.build/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
}

// Helper function to create metadata for specific pages
export function createMetadata(options: {
  title?: string
  /** Full description. The meta tag receives a clamped copy; Open Graph and Twitter keep the full text. */
  description?: string
  /** Route path starting with "/" (e.g. "/wcag/1-1-1"). Emits the page's self-referencing canonical URL. */
  path?: string
  keywords?: string[]
  image?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  authors?: { name: string; url?: string }[]
  noIndex?: boolean
}): Metadata {
  const { title, description, path, keywords, image, type = "website", publishedTime, modifiedTime, authors, noIndex } = options

  return {
    title: title,
    description: description ? clampDescription(description) : undefined,
    ...(path && { alternates: { canonical: path } }),
    ...(noIndex && { robots: { index: false, follow: false } }),
    keywords: keywords ? [...(baseMetadata.keywords as string[]), ...keywords] : baseMetadata.keywords,
    openGraph: {
      ...(baseMetadata.openGraph as any),
      title: title || (baseMetadata.openGraph as any).title,
      description: description || (baseMetadata.openGraph as any).description,
      ...(path && { url: path }),
      type,
      ...(image && {
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      ...(baseMetadata.twitter as any),
      title: title || (baseMetadata.twitter as any).title,
      description: description || (baseMetadata.twitter as any).description,
      ...(image && { images: [image] }),
    },
    ...(authors && { authors }),
  }
}
