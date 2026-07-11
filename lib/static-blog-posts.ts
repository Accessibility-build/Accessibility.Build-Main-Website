// Hardcoded entries for the static blog posts that live under app/blog/<slug>/page.tsx
// (not managed in Sanity). Used by the blog index to list and link these posts
// alongside CMS-managed ones. Titles/excerpts mirror each page's metadata export.

export interface StaticBlogPost {
  slug: string
  title: string
  excerpt: string
  /** ISO date (YYYY-MM-DD) used for sorting and display */
  date: string
  category: string
  author: string
  /** Estimated reading time in minutes */
  readingTime: number
}

export const staticBlogPosts: StaticBlogPost[] = [
  {
    slug: "accessibility-audit-checklist",
    title: "Website Accessibility Audit Checklist: Complete Guide",
    excerpt:
      "Complete accessibility audit checklist covering WCAG 2.2 compliance, automated testing, manual testing, and remediation strategies. Free downloadable checklist included.",
    date: "2024-01-15",
    category: "Audit",
    author: "Maya Rodriguez",
    readingTime: 12,
  },
  {
    slug: "accessibility-for-ecommerce",
    title: "E-commerce Accessibility: Guide for Online Stores",
    excerpt:
      "Essential e-commerce accessibility guide covering product pages, checkout process, search functionality, and WCAG compliance for online retail success.",
    date: "2025-11-15",
    category: "E-commerce",
    author: "Khushwant Parihar",
    readingTime: 9,
  },
  {
    slug: "accessibility-testing-tools",
    title: "Best Accessibility Testing Tools: Free & Paid Options",
    excerpt:
      "Comprehensive guide to accessibility testing tools including axe, WAVE, Lighthouse, and more. Compare features, pricing, and use cases for WCAG compliance testing.",
    date: "2025-11-15",
    category: "Testing",
    author: "Khushwant Parihar",
    readingTime: 10,
  },
  {
    slug: "accessible-images-alt-text",
    title: "Accessible Images and Alt Text: Developer Guide",
    excerpt:
      "Master alt text writing, image accessibility, and WCAG compliance. Learn when to use alt text, how to write effective descriptions, and handle complex images with practical examples.",
    date: "2024-01-08",
    category: "Development",
    author: "Maya Rodriguez",
    readingTime: 10,
  },
  {
    slug: "ada-compliance-guide",
    title: "ADA Compliance: Website Requirements & Legal Protection",
    excerpt:
      "Complete ADA compliance guide for websites including legal requirements, WCAG standards, implementation steps, and protection from accessibility lawsuits.",
    date: "2025-11-15",
    category: "Compliance",
    author: "Khushwant Parihar",
    readingTime: 11,
  },
  {
    slug: "aria-labels-guide",
    title: "ARIA Labels and Attributes: Complete Developer Guide",
    excerpt:
      "Master ARIA labels, attributes, and roles for web accessibility. Learn aria-label, aria-labelledby, aria-describedby, and more with practical examples.",
    date: "2025-11-15",
    category: "Development",
    author: "Khushwant Parihar",
    readingTime: 9,
  },
  {
    slug: "inclusive-design-principles",
    title: "Inclusive Design Principles for Accessible Experiences",
    excerpt:
      "Learn inclusive design principles, universal design concepts, and practical strategies for creating digital experiences that work for users with diverse abilities and needs.",
    date: "2025-11-15",
    category: "Design",
    author: "Khushwant Parihar",
    readingTime: 8,
  },
  {
    slug: "mobile-accessibility-testing",
    title: "Mobile Accessibility Testing: iOS & Android Guide",
    excerpt:
      "Learn mobile accessibility testing with TalkBack, VoiceOver, and Switch Control. Essential guide for mobile app and responsive web accessibility.",
    date: "2025-11-15",
    category: "Testing",
    author: "Khushwant Parihar",
    readingTime: 9,
  },
  {
    slug: "screen-reader-testing",
    title: "Screen Reader Testing: Complete Guide for Developers",
    excerpt:
      "Learn how to test your website with screen readers like NVDA, JAWS, and VoiceOver. Comprehensive guide with practical tips and testing strategies.",
    date: "2025-11-15",
    category: "Testing",
    author: "Khushwant Parihar",
    readingTime: 10,
  },
  {
    slug: "wcag-3-what-to-expect",
    title: "WCAG 3.0: What to Expect from the New Standard",
    excerpt:
      "Explore WCAG 3.0 updates including new outcomes-based approach, bronze/silver/gold levels, and how to prepare for the next generation of accessibility guidelines.",
    date: "2025-11-15",
    category: "WCAG",
    author: "Khushwant Parihar",
    readingTime: 8,
  },
  {
    slug: "web-accessibility-for-beginners",
    title: "Web Accessibility for Beginners: Getting Started Guide",
    excerpt:
      "Learn web accessibility fundamentals, WCAG basics, and practical implementation tips. Perfect step-by-step guide for developers, designers, and content creators new to accessibility.",
    date: "2024-01-12",
    category: "Fundamentals",
    author: "Alex Johnson",
    readingTime: 8,
  },
  {
    slug: "website-accessibility-compliance",
    title: "Website Accessibility Compliance: ADA & WCAG Guide",
    excerpt:
      "Complete guide to website accessibility compliance including ADA requirements, WCAG standards, legal obligations, and practical implementation strategies.",
    date: "2025-11-15",
    category: "Compliance",
    author: "Khushwant Parihar",
    readingTime: 10,
  },
]

/**
 * Shape expected by BlogClientPage (matches its BlogPost interface / the
 * Sanity post projection used on the blog index).
 */
export interface BlogIndexPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  author: { name: string; image?: string }
  mainImage?: string
  estimatedReadingTime: number
  categories: Array<{ title: string; slug: { current: string } }>
}

/** Static posts mapped to the card shape the blog index client component renders. */
export function getStaticBlogIndexPosts(): BlogIndexPost[] {
  return staticBlogPosts.map((post) => ({
    _id: `static-${post.slug}`,
    title: post.title,
    slug: { current: post.slug },
    excerpt: post.excerpt,
    publishedAt: post.date,
    author: { name: post.author },
    estimatedReadingTime: post.readingTime,
    categories: [
      {
        title: post.category,
        slug: { current: post.category.toLowerCase().replace(/\s+/g, "-") },
      },
    ],
  }))
}
