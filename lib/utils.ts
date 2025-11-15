import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Metadata } from "next"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function createMetadata({
  title,
  description,
  keywords = [],
  image,
  type = "website",
  noIndex = false,
}: {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  type?: "website" | "article"
  noIndex?: boolean
}): Metadata {
  const metadata: Metadata = {
    title: title,
    description: description,
    openGraph: {
      type,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      images: image ? [image] : undefined,
    },
  }

  // Add keywords if provided
  if (keywords.length > 0) {
    metadata.keywords = keywords
  }

  // Add noindex directive if specified
  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    }
  }

  return metadata
}
