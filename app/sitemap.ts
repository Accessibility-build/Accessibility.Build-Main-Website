import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/mdx"

// Enhanced priority calculation based on strategic importance
interface SitemapEntry {
  route: string
  priority: number
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  lastModified: Date
  keywords?: string[]
  category?: "tool" | "content" | "service" | "resource" | "company" | "legal"
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://accessibility.build"
  const currentDate = new Date()

  // Get all blog posts
  const posts = await getAllPosts()

  // Enhanced static routes with strategic categorization
  const staticRoutes: SitemapEntry[] = [
    // Homepage - Maximum priority
    {
      route: "",
      priority: 1.0,
      changeFrequency: "weekly",
      lastModified: currentDate,
      keywords: ["accessibility", "wcag", "tools", "compliance"],
      category: "company"
    },
    
    // Tools Hub - Critical for user acquisition
    {
      route: "/tools",
      priority: 0.98,
      changeFrequency: "weekly",
      lastModified: currentDate,
      keywords: ["accessibility tools", "testing tools", "wcag tools"],
      category: "tool"
    },
    
    // Top-tier Free Tools - Maximum discovery value
    {
      route: "/tools/heading-analyzer",
      priority: 0.97,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["heading structure", "seo", "wcag", "free tool"],
      category: "tool"
    },
    {
      route: "/tools/contrast-checker",
      priority: 0.96,
      changeFrequency: "monthly", 
      lastModified: currentDate,
      keywords: ["color contrast", "wcag compliance", "accessibility testing"],
      category: "tool"
    },
    {
      route: "/tools/color-palette-generator",
      priority: 0.95,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["accessible colors", "color palette", "design tools"],
      category: "tool"
    },

    // Premium Tools - High priority for conversion
    {
      route: "/tools/mobile-accessibility-checker",
      priority: 0.94,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["mobile accessibility", "touch targets", "mobile wcag"],
      category: "tool"
    },
    {
      route: "/tools/accessibility-code-generator",
      priority: 0.93,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["accessible code", "ai code generator", "react accessibility"],
      category: "tool"
    },
    {
      route: "/tools/alt-text-generator",
      priority: 0.92,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["alt text", "ai alt text", "image accessibility"],
      category: "tool"
    },
    {
      route: "/tools/url-accessibility-auditor",
      priority: 0.91,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["accessibility audit", "website testing", "wcag audit"],
      category: "tool"
    },
    {
      route: "/tools/accessibility-audit-helper",
      priority: 0.90,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["audit helper", "accessibility analysis", "expert consultation"],
      category: "tool"
    },
    {
      route: "/tools/password-generator",
      priority: 0.85,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["password generator", "secure passwords", "utility tool"],
      category: "tool"
    },
    {
      route: "/tools/json-formatter",
      priority: 0.84,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["json formatter", "json validator", "developer tool"],
      category: "tool"
    },

    // Content Hub - Critical for SEO and education
    {
      route: "/blog",
      priority: 0.95,
      changeFrequency: "daily",
      lastModified: currentDate,
      keywords: ["accessibility articles", "wcag guides", "best practices"],
      category: "content"
    },

    // High-value Blog Posts - Current and SEO-optimized content
    {
      route: "/blog/accessibility-audit-checklist",
      priority: 0.94,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["accessibility audit checklist", "wcag 2.2 compliance", "accessibility testing"],
      category: "content"
    },
    {
      route: "/blog/web-accessibility-for-beginners",
      priority: 0.93,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["web accessibility for beginners", "accessibility basics", "wcag for beginners"],
      category: "content"
    },
    {
      route: "/blog/accessible-images-alt-text",
      priority: 0.92,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["alt text", "image accessibility", "accessible images", "alt text best practices"],
      category: "content"
    },
    {
      route: "/blog/aria-labels-guide",
      priority: 0.91,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["aria labels", "aria-label", "aria-labelledby", "aria-describedby"],
      category: "content"
    },
    {
      route: "/blog/screen-reader-testing",
      priority: 0.90,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["screen reader testing", "nvda testing", "jaws testing", "voiceover testing"],
      category: "content"
    },
    {
      route: "/blog/website-accessibility-compliance",
      priority: 0.89,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["website accessibility compliance", "ada compliance", "wcag compliance"],
      category: "content"
    },
    {
      route: "/blog/mobile-accessibility-testing",
      priority: 0.88,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["mobile accessibility testing", "talkback testing", "mobile app accessibility"],
      category: "content"
    },
    {
      route: "/blog/accessibility-testing-tools",
      priority: 0.87,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["accessibility testing tools", "axe devtools", "wave accessibility"],
      category: "content"
    },
    {
      route: "/blog/ada-compliance-guide",
      priority: 0.86,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["ada compliance", "ada lawsuit protection", "digital accessibility laws"],
      category: "content"
    },
    {
      route: "/blog/inclusive-design-principles",
      priority: 0.85,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["inclusive design", "universal design", "accessible design principles"],
      category: "content"
    },
    {
      route: "/blog/wcag-3-what-to-expect",
      priority: 0.84,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["wcag 3.0", "wcag 3 updates", "future accessibility standards"],
      category: "content"
    },
    {
      route: "/blog/accessibility-for-ecommerce",
      priority: 0.83,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["ecommerce accessibility", "accessible online shopping", "retail accessibility"],
      category: "content"
    },

    // Services - Business critical pages
    {
      route: "/services",
      priority: 0.93,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["accessibility services", "consulting", "professional services"],
      category: "service"
    },
    {
      route: "/services/accessibility-audits",
      priority: 0.88,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["accessibility audit", "professional audit", "wcag audit"],
      category: "service"
    },
    {
      route: "/services/accessibility-training",
      priority: 0.86,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["accessibility training", "team training", "wcag training"],
      category: "service"
    },
    {
      route: "/services/compliance-documentation",
      priority: 0.84,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["compliance documentation", "accessibility compliance", "legal compliance"],
      category: "service"
    },
    {
      route: "/services/remediation-support",
      priority: 0.82,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["accessibility remediation", "code fixes", "accessibility support"],
      category: "service"
    },
    {
      route: "/services/design-reviews",
      priority: 0.80,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["design review", "accessible design", "ux accessibility"],
      category: "service"
    },
    {
      route: "/services/user-testing",
      priority: 0.78,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["user testing", "accessibility testing", "usability testing"],
      category: "service"
    },

    // Resources and Checklists - High educational value
    {
      route: "/checklists/wcag-2-2",
      priority: 0.96,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["wcag 2.2 checklist", "accessibility checklist", "compliance checklist"],
      category: "resource"
    },
    {
      route: "/checklists",
      priority: 0.87,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["accessibility checklists", "testing checklists", "compliance tools"],
      category: "resource"
    },
    {
      route: "/checklists/interactive",
      priority: 0.85,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["interactive checklist", "wcag interactive", "accessibility testing"],
      category: "resource"
    },
    {
      route: "/resources",
      priority: 0.85,
      changeFrequency: "weekly",
      lastModified: currentDate,
      keywords: ["accessibility resources", "guides", "tools", "best practices"],
      category: "resource"
    },

    // FAQ - High search value
    {
      route: "/faq",
      priority: 0.91,
      changeFrequency: "weekly",
      lastModified: currentDate,
      keywords: ["accessibility faq", "wcag questions", "accessibility help"],
      category: "resource"
    },

    // User Dashboard and Authentication
    {
      route: "/dashboard",
      priority: 0.70,
      changeFrequency: "daily",
      lastModified: currentDate,
      keywords: ["user dashboard", "accessibility tools dashboard"],
      category: "company"
    },
    {
      route: "/sign-in",
      priority: 0.60,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["sign in", "login", "user account"],
      category: "company"
    },
    {
      route: "/sign-up",
      priority: 0.65,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["sign up", "register", "create account"],
      category: "company"
    },
    {
      route: "/welcome",
      priority: 0.55,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["welcome", "getting started"],
      category: "company"
    },

    // Company Pages - Important for trust and conversion
    {
      route: "/about",
      priority: 0.80,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["about us", "accessibility experts", "company"],
      category: "company"
    },
    {
      route: "/contact",
      priority: 0.78,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["contact", "support", "consultation"],
      category: "company"
    },

    // Legal Pages - Required but lower priority
    {
      route: "/privacy",
      priority: 0.35,
      changeFrequency: "yearly",
      lastModified: currentDate,
      keywords: ["privacy policy"],
      category: "legal"
    },
    {
      route: "/terms",
      priority: 0.35,
      changeFrequency: "yearly",
      lastModified: currentDate,
      keywords: ["terms of service"],
      category: "legal"
    },
    {
      route: "/accessibility",
      priority: 0.65,
      changeFrequency: "yearly",
      lastModified: currentDate,
      keywords: ["accessibility statement"],
      category: "legal"
    },

    // Administrative and SEO pages
    {
      route: "/admin/seo-dashboard",
      priority: 0.20,
      changeFrequency: "daily",
      lastModified: currentDate,
      keywords: ["seo dashboard", "admin"],
      category: "company"
    },
    {
      route: "/admin/error-report",
      priority: 0.15,
      changeFrequency: "daily",
      lastModified: currentDate,
      keywords: ["error report", "admin"],
      category: "company"
    },

    // Utility Pages
    {
      route: "/sitemap-page",
      priority: 0.30,
      changeFrequency: "monthly",
      lastModified: currentDate,
      keywords: ["sitemap"],
      category: "company"
    }
  ]

  // Map static routes to sitemap format
  const staticSitemapEntries = staticRoutes.map(({ route, priority, changeFrequency, lastModified }) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency,
    priority,
  }))

  // Enhanced blog posts mapping with content analysis
  const blogSitemapEntries = posts
    .filter((post): post is NonNullable<typeof post> => Boolean(post?.slug && post?.frontmatter?.date))
    .map((post) => {
      const postDate = new Date(post.frontmatter.date)
      
      // Calculate base priority from post age
      const ageInDays = (currentDate.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24)
      let priority = 0.75
      
      // Age-based priority adjustment
      if (ageInDays < 7) {
        priority = 0.90 // Very recent posts
      } else if (ageInDays < 30) {
        priority = 0.85 // Recent posts
      } else if (ageInDays < 90) {
        priority = 0.80 // Recent posts
      } else if (ageInDays < 365) {
        priority = 0.75 // Moderately recent
      } else {
        priority = 0.70 // Older posts
      }

      // Content-based priority boosts
      const title = post.frontmatter.title?.toLowerCase() || ""
      const description = post.frontmatter.description?.toLowerCase() || ""
      const content = (title + " " + description).toLowerCase()

      // High-value keyword boosts
      const highValueKeywords = ["wcag 2.2", "accessibility", "compliance", "testing", "audit"]
      const mediumValueKeywords = ["forms", "color", "contrast", "navigation", "aria"]
      
      let keywordBoost = 0
      highValueKeywords.forEach(keyword => {
        if (content.includes(keyword)) keywordBoost += 0.05
      })
      mediumValueKeywords.forEach(keyword => {
        if (content.includes(keyword)) keywordBoost += 0.02
      })

      // Apply keyword boost but cap at 0.95 for blog posts
      priority = Math.min(0.95, priority + keywordBoost)

      return {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: postDate,
        changeFrequency: "monthly" as const,
        priority: Math.round(priority * 100) / 100, // Round to 2 decimal places
      }
    })
    .sort((a, b) => b.priority - a.priority) // Sort by priority descending

  // Combine all sitemap entries, sorted by priority
  const allEntries = [...staticSitemapEntries, ...blogSitemapEntries]
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))

  return allEntries
}
