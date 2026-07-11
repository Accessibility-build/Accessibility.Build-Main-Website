import type { Metadata } from "next"

// Base metadata that can be extended for specific pages
// Note: metadataBase is set once in app/layout.tsx — do not redeclare it here or in pages.
export const baseMetadata: Metadata = {
  title: {
    default: "Accessibility.build | Modern Accessibility Resources",
    template: "%s | Accessibility.build",
  },
  description:
    "A modern platform offering comprehensive accessibility resources, interactive tools, and in-depth education to help you design and develop inclusive digital experiences.",
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
  authors: [{ name: "Accessibility.build Team" }],
  creator: "Accessibility.build",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://accessibility.build",
    title: "Accessibility.build | Modern Accessibility Resources",
    description:
      "A modern platform offering comprehensive accessibility resources, interactive tools, and in-depth education to help you design and develop inclusive digital experiences.",
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
    title: "Accessibility.build | Modern Accessibility Resources",
    description:
      "A modern platform offering comprehensive accessibility resources, interactive tools, and in-depth education to help you design and develop inclusive digital experiences.",
    images: ["https://accessibility.build/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

// Helper function to create metadata for specific pages
export function createMetadata(options: {
  title?: string
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
    description: description,
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
