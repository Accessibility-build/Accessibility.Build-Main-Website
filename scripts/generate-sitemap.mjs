import fs from 'fs'
import path from 'path'

const baseUrl = 'https://accessibility.build'
const publicDir = path.join(process.cwd(), 'public')
const sitemapPath = path.join(publicDir, 'sitemap.xml')

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

const blogDir = path.join(process.cwd(), 'content', 'blog')
let posts = []
if (fs.existsSync(blogDir)) {
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'))
  for (const file of files) {
    const content = fs.readFileSync(path.join(blogDir, file), 'utf8')
    const match = content.match(/date:\s*"?(\d{4}-\d{2}-\d{2})"?/) || []
    const date = match[1] || new Date().toISOString().slice(0,10)
    posts.push({ slug: file.replace(/\.mdx$/, ''), date })
  }
}

const staticRoutes = [
  { route: '', priority: 1.0, changeFreq: 'weekly' },
  { route: '/blog', priority: 0.9, changeFreq: 'daily' },
  { route: '/tools', priority: 0.9, changeFreq: 'weekly' },
  { route: '/tools/contrast-checker', priority: 0.8, changeFreq: 'monthly' },
  { route: '/tools/alt-text-generator', priority: 0.8, changeFreq: 'monthly' },
  { route: '/checklists', priority: 0.8, changeFreq: 'monthly' },
  { route: '/checklists/wcag-2-2', priority: 0.8, changeFreq: 'monthly' },
  { route: '/resources', priority: 0.8, changeFreq: 'monthly' },
  { route: '/about', priority: 0.7, changeFreq: 'monthly' },
  { route: '/contact', priority: 0.7, changeFreq: 'monthly' },
  { route: '/services', priority: 0.7, changeFreq: 'monthly' },
  { route: '/services/accessibility-audits', priority: 0.7, changeFreq: 'monthly' },
  { route: '/services/compliance-documentation', priority: 0.7, changeFreq: 'monthly' },
  { route: '/services/accessibility-training', priority: 0.7, changeFreq: 'monthly' },
  { route: '/services/remediation-support', priority: 0.7, changeFreq: 'monthly' },
  { route: '/services/design-reviews', priority: 0.7, changeFreq: 'monthly' },
  { route: '/services/user-testing', priority: 0.7, changeFreq: 'monthly' },
  { route: '/blog/keyboard-navigation', priority: 0.7, changeFreq: 'monthly' },
  { route: '/blog/color-contrast', priority: 0.7, changeFreq: 'monthly' },
  { route: '/privacy', priority: 0.5, changeFreq: 'yearly' },
  { route: '/terms', priority: 0.5, changeFreq: 'yearly' },
  { route: '/accessibility', priority: 0.6, changeFreq: 'yearly' },
  { route: '/sitemap-page', priority: 0.5, changeFreq: 'monthly' },
]

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
for (const { route, priority, changeFreq } of staticRoutes) {
  xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>${changeFreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`
}
for (const { slug, date } of posts) {
  xml += `  <url>\n    <loc>${baseUrl}/blog/${slug}</loc>\n    <lastmod>${new Date(date).toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`
}
xml += `</urlset>`
fs.writeFileSync(sitemapPath, xml)
console.log(`Sitemap generated at ${sitemapPath}`)
