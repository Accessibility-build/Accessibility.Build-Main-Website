"use client"

import { type StructuredDataProps } from "@/types/seo"

function serializeSchema(schema: Record<string, any>) {
  return JSON.stringify(schema).replace(/</g, "\\u003c")
}

interface ToolStructuredDataProps {
  name: string
  description: string
  url: string
  applicationCategory: string
  operatingSystem: string
  offers?: {
    price: string
    priceCurrency: string
  }
  /**
   * Only pass this when the rating is backed by real reviews AND those reviews
   * are visible on the page. Google requires review markup to reflect content
   * users can actually see, and invented ratings risk a manual action for
   * spammy structured markup. Ratings about our own products or services are
   * self-serving and are not eligible for review snippets at all.
   */
  aggregateRating?: {
    ratingValue: string
    reviewCount: string
  }
  steps?: Array<{
    name: string
    text: string
    url?: string
  }>
  /**
   * What this specific tool actually does. Pass real capabilities — a shared
   * default would have every tool claiming the same feature set (the palette
   * generator advertising "Screen Reader Testing", for example).
   */
  featureList?: string[]
  /** Only pass a version you actually ship and can keep accurate. */
  softwareVersion?: string
}

interface FAQStructuredDataProps {
  faqs: Array<{
    question: string
    answer: string
  }>
}

interface BreadcrumbStructuredDataProps {
  breadcrumbs: Array<{
    name: string
    url: string
  }>
}

interface ArticleStructuredDataProps {
  headline: string
  description: string
  author: {
    name: string
    url?: string
    image?: string
    description?: string
  }
  publisher: {
    name: string
    logo: string
  }
  datePublished: string
  dateModified: string
  image: string
  url: string
  wordCount?: number
  keywords?: string[]
  /** Defaults to "Article"; pass "BlogPosting" for blog posts. */
  articleType?: string
  /** Defaults to "Person"; pass "Organization" for team/brand bylines. */
  authorType?: 'Person' | 'Organization'
}

interface HowToStructuredDataProps {
  name: string
  description: string
  image?: string
  totalTime?: string
  estimatedCost?: string
  supply?: string[]
  tool?: string[]
  steps: Array<{
    name: string
    text: string
    image?: string
    url?: string
  }>
}

interface ServiceStructuredDataProps {
  name: string
  description: string
  serviceType: string
  url: string
  provider?: {
    name: string
    url: string
    id?: string
    logo?: string
  }
  areaServed?: string[]
  offers?: Array<{
    name: string
    description?: string
    price: string | number
    priceCurrency: string
    availability: string
  }>
  /**
   * Only pass this when the rating is backed by real reviews AND those reviews
   * are visible on the page. Google requires review markup to reflect content
   * users can actually see, and invented ratings risk a manual action for
   * spammy structured markup. Ratings about our own products or services are
   * self-serving and are not eligible for review snippets at all.
   */
  aggregateRating?: {
    ratingValue: string
    reviewCount: string
  }
  termsOfService?: string
  serviceOutput?: string
}

interface CourseStructuredDataProps {
  name: string
  description: string
  provider: {
    name: string
    url: string
  }
  instructor?: {
    name: string
    description: string
  }
  courseMode: string[]
  educationalLevel: string
  teaches: string[]
  timeRequired: string
  totalHistoricalEnrollment?: number
  offers?: {
    price: string | number
    priceCurrency: string
    category: string
  }
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let schema: Record<string, any> = {}

  switch (type) {
    case "organization":
      schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: data.name,
        url: data.url,
        logo: data.logo,
        description: data.description,
        sameAs: data.sameAs || [],
      }
      break
    case "website":
      schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: data.name,
        url: data.url,
        description: data.description,
        ...(data.searchUrl && {
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: data.searchUrl,
            },
            "query-input": "required name=search_term_string",
          },
        }),
      }
      break
    case "article":
      schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.headline,
        image: data.image,
        author: {
          "@type": "Person",
          name: data.author.name,
          url: data.author.url,
        },
        publisher: {
          "@type": "Organization",
          name: data.publisher.name,
          logo: {
            "@type": "ImageObject",
            url: data.publisher.logo,
          },
        },
        datePublished: data.datePublished,
        dateModified: data.dateModified || data.datePublished,
        description: data.description,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": data.url,
        },
      }
      break
    case "breadcrumb":
      schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: data.itemListElement.map((item: any, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }
      break
    case "faq":
      schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.questions.map((q: any) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
          },
        })),
      }
      break
    case "product":
      schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: data.name,
        image: data.image,
        description: data.description,
        ...(data.brand && {
          brand: {
            "@type": "Brand",
            name: data.brand,
          },
        }),
        ...(data.offers && {
          offers: {
            "@type": "Offer",
            price: data.offers.price,
            priceCurrency: data.offers.currency,
            availability: data.offers.availability,
            url: data.url,
          },
        }),
        ...(data.aggregateRating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: data.aggregateRating.value,
            reviewCount: data.aggregateRating.count,
          },
        }),
      }
      break
    case "person":
      schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: data.name,
        url: data.url,
        image: data.image,
        jobTitle: data.jobTitle,
        worksFor: data.worksFor
          ? {
              "@type": "Organization",
              name: data.worksFor,
            }
          : undefined,
        description: data.description,
        sameAs: data.sameAs || [],
      }
      break
    default:
      schema = {}
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeSchema(schema),
      }}
    />
  )
}

// Enhanced Tool Schema with SoftwareApplication
export function ToolStructuredData({ 
  name, 
  description, 
  url, 
  applicationCategory, 
  operatingSystem,
  offers,
  steps,
  featureList,
  softwareVersion
}: ToolStructuredDataProps) {
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": applicationCategory,
    "operatingSystem": operatingSystem,
    "browserRequirements": "Requires JavaScript. Supported browsers: Chrome, Firefox, Safari, Edge",
    // Only claim a version when the caller supplies a real one. The previous
    // hardcoded "2.0" + release notes applied to every tool indiscriminately.
    ...(softwareVersion ? { "softwareVersion": softwareVersion } : {}),
    ...(offers && {
      "offers": {
        "@type": "Offer",
        "price": offers.price,
        "priceCurrency": offers.priceCurrency,
        "availability": "https://schema.org/InStock"
      }
    }),
    "publisher": {
      "@type": "Organization",
      "@id": "https://accessibility.build/#organization",
      "name": "Accessibility.build",
      "url": "https://accessibility.build",
      "logo": "https://accessibility.build/android-chrome-512x512.png"
    },
    // Per-tool capabilities only — no generic default, so a tool never
    // advertises features it does not have.
    ...(featureList && featureList.length > 0 ? { "featureList": featureList } : {})
  }

  // Add HowTo schema if steps are provided
  const howToSchema = steps ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to use ${name}`,
    "description": `Step-by-step guide to using ${name} for accessibility testing`,
    "totalTime": "PT5M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": offers?.price || "0"
    },
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.url && { "url": step.url })
    }))
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeSchema(toolSchema)
        }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeSchema(howToSchema)
          }}
        />
      )}
    </>
  )
}

// FAQ Schema
export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeSchema(faqSchema)
      }}
    />
  )
}

// Breadcrumb Schema
export function BreadcrumbStructuredData({ breadcrumbs }: BreadcrumbStructuredDataProps) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": breadcrumb.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeSchema(breadcrumbSchema)
      }}
    />
  )
}

// Article Schema for Blog Posts
export function ArticleStructuredData({
  headline,
  description,
  author,
  publisher,
  datePublished,
  dateModified,
  image,
  url,
  wordCount,
  keywords,
  articleType = "Article",
  authorType = "Person"
}: ArticleStructuredDataProps) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": articleType,
    "headline": headline,
    "description": description,
    "author": {
      "@type": authorType,
      "name": author.name,
      ...(author.url && { "url": author.url }),
      ...(author.description && { "description": author.description }),
      ...(author.image && {
        "image": {
          "@type": "ImageObject",
          "url": author.image
        }
      }),
      ...(authorType === "Person" && {
        "worksFor": {
          "@id": "https://accessibility.build/#organization"
        }
      })
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://accessibility.build/#organization",
      "name": publisher.name,
      "logo": {
        "@type": "ImageObject",
        "url": publisher.logo
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified,
    "image": {
      "@type": "ImageObject",
      "url": image,
      "width": 1200,
      "height": 630
    },
    "url": url,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "isAccessibleForFree": true,
    "inLanguage": "en-US",
    ...(wordCount && { "wordCount": wordCount }),
    ...(keywords && { "keywords": keywords.join(", ") })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeSchema(articleSchema)
      }}
    />
  )
}

// How-To Schema for Tool Guides
export function HowToStructuredData({
  name,
  description,
  image,
  totalTime,
  estimatedCost,
  supply,
  tool,
  steps
}: HowToStructuredDataProps) {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    ...(image && {
      "image": {
        "@type": "ImageObject",
        "url": image
      }
    }),
    ...(totalTime && { "totalTime": totalTime }),
    ...(estimatedCost && {
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": estimatedCost
      }
    }),
    ...(supply && {
      "supply": supply.map(item => ({
        "@type": "HowToSupply",
        "name": item
      }))
    }),
    ...(tool && {
      "tool": tool.map(item => ({
        "@type": "HowToTool",
        "name": item
      }))
    }),
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && {
        "image": {
          "@type": "ImageObject",
          "url": step.image
        }
      }),
      ...(step.url && { "url": step.url })
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeSchema(howToSchema)
      }}
    />
  )
}

// NOTE: The canonical Organization and WebSite entities are emitted site-wide
// from the JSON-LD @graph in app/layout.tsx, sourced from lib/company.ts (stable
// @ids #organization / #website / #founder, verified email, address, sameAs, and
// founder linkage). Standalone Organization/WebSite emitters used to live here
// but had drifted out of sync (a support@ email, a hyphenated LinkedIn URL, and
// an unverified Twitter handle that contradicted lib/company.ts). They were
// unused and have been removed so there is a single source of truth for the
// entity — do not reintroduce a second Organization/WebSite node here. Edit the
// graph in app/layout.tsx (and the facts in lib/company.ts) instead.

// Enhanced Service Schema for Accessibility Services
export function ServiceStructuredData({
  name,
  description,
  serviceType,
  url,
  provider,
  areaServed,
  offers,
  termsOfService,
  serviceOutput
}: ServiceStructuredDataProps) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "serviceType": serviceType,
    "url": url,
    "provider": {
      "@type": "Organization",
      "@id": provider?.id || "https://accessibility.build/#organization",
      "name": provider?.name || "Accessibility.build",
      "url": provider?.url || "https://accessibility.build",
      ...(provider?.logo && {
        "logo": {
          "@type": "ImageObject",
          "url": provider.logo
        }
      })
    },
    ...(areaServed && {
      "areaServed": areaServed.map(area => ({
        "@type": "Place",
        "name": area
      }))
    }),
    ...(offers && {
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": `${name} packages`,
        "itemListElement": offers.map((offer) => ({
          "@type": "Offer",
          "name": offer.name,
          ...(offer.description && { "description": offer.description }),
          "price": offer.price,
          "priceCurrency": offer.priceCurrency,
          "availability": offer.availability,
          "url": `${url}#service-pricing-heading`
        }))
      }
    }),
    ...(termsOfService && { "termsOfService": termsOfService }),
    ...(serviceOutput && { "serviceOutput": serviceOutput }),
    "category": "Accessibility Consulting"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeSchema(serviceSchema)
      }}
    />
  )
}

// Course Schema for Accessibility Training
export function CourseStructuredData({
  name,
  description,
  provider,
  instructor,
  courseMode,
  educationalLevel,
  teaches,
  timeRequired,
  totalHistoricalEnrollment,
  offers
}: CourseStructuredDataProps) {
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": provider.name,
      "url": provider.url
    },
    ...(instructor && {
      "instructor": {
        "@type": "Person",
        "name": instructor.name,
        "description": instructor.description
      }
    }),
    "courseMode": courseMode,
    "educationalLevel": educationalLevel,
    "teaches": teaches,
    "timeRequired": timeRequired,
    ...(totalHistoricalEnrollment && { "totalHistoricalEnrollment": totalHistoricalEnrollment }),
    ...(offers && {
      "offers": {
        "@type": "Offer",
        "price": offers.price,
        "priceCurrency": offers.priceCurrency,
        "category": offers.category
      }
    }),
    "inLanguage": "en-US",
    "availableLanguage": ["en-US"],
    "educationalCredentialAwarded": "Certificate of Completion"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeSchema(courseSchema)
      }}
    />
  )
}

// Enhanced Tool Schema with Accessibility Features
export function AccessibilityToolStructuredData({
  name,
  description,
  url,
  applicationCategory = "AccessibilityApplication",
  operatingSystem = "Any",
  offers,
  accessibilityFeatures,
  featureList,
  softwareVersion
}: ToolStructuredDataProps & {
  accessibilityFeatures?: string[]
}) {
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": applicationCategory,
    "operatingSystem": operatingSystem,
    "browserRequirements": "Requires JavaScript. Supported browsers: Chrome, Firefox, Safari, Edge",
    ...(softwareVersion ? { "softwareVersion": softwareVersion } : {}),
    "accessibilityFeature": accessibilityFeatures || [
      "highContrastDisplay",
      "keyboardNavigation", 
      "screenReaderSupport",
      "largePrint",
      "reducedAnimation"
    ],
    "accessibilityHazard": "none",
    "accessibilitySummary": "Fully accessible tool designed for accessibility professionals and developers",
    ...(offers && {
      "offers": {
        "@type": "Offer",
        "price": offers.price,
        "priceCurrency": offers.priceCurrency,
        "availability": "https://schema.org/InStock",
        "eligibleRegion": "Worldwide"
      }
    }),
    "publisher": {
      "@type": "Organization",
      "@id": "https://accessibility.build/#organization",
      "name": "Accessibility.build",
      "url": "https://accessibility.build",
      "logo": "https://accessibility.build/android-chrome-512x512.png"
    },
    // Per-tool capabilities only — no generic default, so a tool never
    // advertises features it does not have.
    ...(featureList && featureList.length > 0 ? { "featureList": featureList } : {}),
    "applicationSubCategory": "Web Accessibility Testing Tool",
    "downloadUrl": url,
    "installUrl": url,
    "softwareHelp": {
      "@type": "CreativeWork",
      "url": `${url}#help`
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeSchema(toolSchema)
      }}
    />
  )
}

// Dataset Schema for Research Pages
interface DatasetStructuredDataProps {
  name: string
  description: string
  url: string
  datePublished: string
  dateModified: string
  creator: { name: string; url: string }
  license?: string
  temporalCoverage?: string
  keywords?: string[]
}

export function DatasetStructuredData({
  name,
  description,
  url,
  datePublished,
  dateModified,
  creator,
  license = "https://creativecommons.org/licenses/by/4.0/",
  temporalCoverage,
  keywords
}: DatasetStructuredDataProps) {
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": name,
    "description": description,
    "url": url,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "creator": {
      "@type": "Organization",
      "name": creator.name,
      "url": creator.url
    },
    "license": license,
    ...(temporalCoverage && { "temporalCoverage": temporalCoverage }),
    ...(keywords && { "keywords": keywords }),
    "publisher": {
      "@type": "Organization",
      "name": "Accessibility.build",
      "url": "https://accessibility.build"
    },
    "inLanguage": "en-US"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeSchema(datasetSchema)
      }}
    />
  )
}

// Checklist Schema for WCAG Checklists
interface ChecklistStructuredDataProps {
  name: string
  description: string
  url: string
  author: {
    name: string
    url?: string
  }
  datePublished: string
  dateModified: string
  itemListElement: Array<{
    name: string
    description: string
    position: number
  }>
}

export function ChecklistStructuredData({
  name,
  description,
  url,
  author,
  datePublished,
  dateModified,
  itemListElement
}: ChecklistStructuredDataProps) {
  const checklistSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": name,
    "description": description,
    "url": url,
    "author": {
      "@type": "Person",
      "name": author.name,
      ...(author.url && { "url": author.url })
    },
    "datePublished": datePublished,
    "dateModified": dateModified,
    "numberOfItems": itemListElement.length,
    "itemListElement": itemListElement.map(item => ({
      "@type": "ListItem",
      "position": item.position,
      "name": item.name,
      "description": item.description
    })),
    "about": {
      "@type": "Thing",
      "name": "Web Accessibility",
      "sameAs": "https://en.wikipedia.org/wiki/Web_accessibility"
    },
    "genre": "Accessibility Guidelines",
    "inLanguage": "en-US"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeSchema(checklistSchema)
      }}
    />
  )
}

// AboutPage Schema for the About page
interface AboutPageStructuredDataProps {
  name: string
  description: string
  url: string
}

export function AboutPageStructuredData({ name, description, url }: AboutPageStructuredDataProps) {
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": name,
    "description": description,
    "url": url,
    "about": {
      "@type": "Organization",
      "@id": "https://accessibility.build/#organization",
      "name": "Accessibility.build",
      "url": "https://accessibility.build"
    },
    "inLanguage": "en-US"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeSchema(aboutPageSchema)
      }}
    />
  )
}

// ContactPage Schema for the Contact page
interface ContactPageStructuredDataProps {
  name: string
  description: string
  url: string
  email: string
}

export function ContactPageStructuredData({ name, description, url, email }: ContactPageStructuredDataProps) {
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": name,
    "description": description,
    "url": url,
    "mainEntity": {
      "@type": "Organization",
      "@id": "https://accessibility.build/#organization",
      "name": "Accessibility.build",
      "url": "https://accessibility.build",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": email,
        "availableLanguage": ["English"],
        "areaServed": "Worldwide"
      }
    },
    "inLanguage": "en-US"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeSchema(contactPageSchema)
      }}
    />
  )
}
