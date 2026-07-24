import type { MetadataRoute } from "next"
import { getBlogPosts } from "@/lib/sanity"
import { siteRoutes } from "@/lib/site-routes"

// /sitemap.xml — static routes come from lib/site-routes.ts (the single source
// of truth, shared with the HTML sitemap page); Sanity blog posts are appended
// dynamically. Every public indexable route appears exactly once.

const baseUrl = "https://accessibility.build"

// Regenerate hourly rather than freezing at build time. Without this the
// getBlogPosts() call below is served from Next's persistent fetch cache, which
// survives across deploys on Vercel — so a post published after the last cache
// entry was written could stay out of the sitemap indefinitely, even through
// repeated rebuilds. Matches the revalidate window on app/blog/[slug]/page.tsx.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = siteRoutes.map(({ route, lastModified, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(lastModified),
    changeFrequency: changeFrequency ?? ("monthly" as const),
    priority,
  }))

  // Sanity CMS blog posts (the only dynamic blog source — see app/blog/[slug]/page.tsx)
  let sanityPosts: any[] = []
  try {
    sanityPosts = await getBlogPosts()
  } catch (error) {
    console.error("Error fetching Sanity blog posts for sitemap:", error)
  }

  const blogEntries = (sanityPosts || [])
    .filter((post: any) => Boolean(post?.slug?.current && post?.publishedAt))
    .map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug.current}`,
      lastModified: new Date(post._updatedAt || post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    }))

  // The CMS can return the same slug twice (e.g. drafts/translations); every URL must appear exactly once.
  const seen = new Set<string>()
  return [...staticEntries, ...blogEntries].filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
