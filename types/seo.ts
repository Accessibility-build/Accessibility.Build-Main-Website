// SEO Types for Accessibility.build

export interface StructuredDataProps {
  type: "organization" | "website" | "article" | "breadcrumb" | "faq" | "product" | "person" | "tool" | "howto"
  data: Record<string, any>
}

export interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  twitterCard?: "summary" | "summary_large_image"
  noIndex?: boolean
  noFollow?: boolean
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface AuthorInfo {
  name: string
  url?: string
  image?: string
  bio?: string
}

export interface PublisherInfo {
  name: string
  logo: string
  url?: string
}

export interface ToolMetadata {
  name: string
  description: string
  category: string
  version: string
  lastUpdated: string
  features: string[]
  pricing?: {
    type: "free" | "freemium" | "paid"
    price?: string
    currency?: string
  }
  rating?: {
    value: number
    count: number
  }
}

export interface BlogPostMetadata {
  title: string
  description: string
  author: AuthorInfo
  publishedDate: string
  modifiedDate: string
  readingTime?: string
  wordCount?: number
  tags?: string[]
  category?: string
  featured?: boolean
}

export interface PageMetadata extends SEOMetadata {
  breadcrumbs?: BreadcrumbItem[]
  faqs?: FAQItem[]
  lastModified?: string
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: number
}

export interface SiteConfiguration {
  name: string
  description: string
  url: string
  logo: string
  favicon: string
  themeColor: string
  backgroundColor: string
  language: string
  locale: string
  twitter?: string
  facebook?: string
  linkedin?: string
  github?: string
} 