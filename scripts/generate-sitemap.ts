import fs from "fs"
import path from "path"
import { getAllPosts } from "../lib/mdx"

async function generateSitemap() {
  const baseUrl = "https://accessibility.build"
  const publicDir = path.join(process.cwd(), "public")
  const sitemapPath = path.join(publicDir, "sitemap.xml")

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  // Static routes with priorities and change frequencies
  const staticRoutes = [
    { route: "", priority: 1.0, changeFreq: "weekly" },
    { route: "/blog", priority: 0.9, changeFreq: "daily" },
    { route: "/tools", priority: 0.9, changeFreq: "weekly" },
    { route: "/tools/contrast-checker", priority: 0.8, changeFreq: "monthly" },
    { route: "/tools/alt-text-generator", priority: 0.8, changeFreq: "monthly" },
    { route: "/checklists", priority: 0.8, changeFreq: "monthly" },
    { route: "/checklists/wcag-2-2", priority: 0.8, changeFreq: "monthly" },
    { route: "/resources", priority: 0.8, changeFreq: "monthly" },
    { route: "/about", priority: 0.7, changeFreq: "monthly" },
    { route: "/contact", priority: 0.7, changeFreq: "monthly" },
    { route: "/services", priority: 0.7, changeFreq: "monthly" },
    { route: "/services/accessibility-audits", priority: 0.7, changeFreq: "monthly" },
    { route: "/services/compliance-documentation", priority: 0.7, changeFreq: "monthly" },
    { route: "/services/accessibility-training", priority: 0.7, changeFreq: "monthly" },
    { route: "/services/remediation-support", priority: 0.7, changeFreq: "monthly" },
    { route: "/services/design-reviews", priority: 0.7, changeFreq: "monthly" },
    { route: "/services/user-testing", priority: 0.7, changeFreq: "monthly" },
    { route: "/blog/keyboard-navigation", priority: 0.7, changeFreq: "monthly" },
    { route: "/blog/color-contrast", priority: 0.7, changeFreq: "monthly" },
    { route: "/privacy", priority: 0.5, changeFreq: "yearly" },
    { route: "/terms", priority: 0.5, changeFreq: "yearly" },
    { route: "/accessibility", priority: 0.6, changeFreq: "yearly" },
    { route: "/sitemap-page", priority: 0.5, changeFreq: "monthly" },
  ]

  // Get all blog posts
  const posts = await getAllPosts()

  // Start XML content
  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  // Add static routes
  staticRoutes.forEach(({ route, priority, changeFreq }) => {
    xmlContent += `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`
  })

  // Add blog posts
  posts.filter(post => post !== null).forEach((post) => {
    const postDate = new Date(post.frontmatter.date).toISOString()
    xmlContent += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`
  })

  // Close XML
  xmlContent += `</urlset>`

  // Write to file
  fs.writeFileSync(sitemapPath, xmlContent)

  console.log(`Sitemap generated at ${sitemapPath}`)
}

generateSitemap().catch(console.error)
