import type { Metadata } from "next"

// Base metadata that can be extended for specific pages
export const baseMetadata: Metadata = {
  metadataBase: new URL("https://accessibility.build"),
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
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
}

// Helper function to create metadata for specific pages
export function createMetadata(options: {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  authors?: { name: string; url?: string }[]
}): Metadata {
  const { title, description, keywords, image, type = "website", publishedTime, modifiedTime, authors } = options

  return {
    title: title,
    description: description,
    keywords: keywords ? [...(baseMetadata.keywords as string[]), ...keywords] : baseMetadata.keywords,
    openGraph: {
      ...(baseMetadata.openGraph as any),
      title: title || (baseMetadata.openGraph as any).title,
      description: description || (baseMetadata.openGraph as any).description,
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
