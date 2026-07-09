import Link from "next/link"
import type { Metadata } from "next"
import { getBlogPosts } from "@/lib/sanity"
import { siteRoutes, type SiteRoute } from "@/lib/site-routes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Sitemap",
  description: "A complete list of all pages on Accessibility.build",
  alternates: { canonical: "/sitemap-page" },
}

// Groups render in this order; everything comes from lib/site-routes.ts so the
// HTML sitemap can never drift from the XML sitemap again.
const groupOrder = [
  "Core",
  "Tools",
  "WCAG",
  "Guides",
  "Checklists",
  "Learn",
  "Reference",
  "Research",
  "Compliance",
  "Industries",
  "WCAG 3.0",
  "Blog",
  "Services",
  "Legal",
]

export default async function SitemapPage() {
  let sanityPosts: any[] = []
  try {
    sanityPosts = await getBlogPosts()
  } catch {
    // The static route list still renders if the CMS is unreachable.
  }

  const grouped = new Map<string, SiteRoute[]>()
  for (const route of siteRoutes) {
    const list = grouped.get(route.group) ?? []
    list.push(route)
    grouped.set(route.group, list)
  }

  const cmsPosts = (sanityPosts || [])
    .filter((post: any) => Boolean(post?.slug?.current && post?.title))
    .map((post: any) => ({
      route: `/blog/${post.slug.current}`,
      label: post.title as string,
    }))

  return (
    <div className="container-wide py-12">
      <h1 className="text-4xl font-bold mb-4">Sitemap</h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
        Every page on Accessibility.build, organized by section.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groupOrder.map((group) => {
          const routes = grouped.get(group)
          if (!routes?.length) return null
          const extraPosts = group === "Blog" ? cmsPosts : []
          return (
            <Card key={group}>
              <CardHeader>
                <CardTitle className="text-xl">{group}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {routes.map((route) => (
                    <li key={route.route}>
                      <Link
                        href={route.route || "/"}
                        className="text-primary hover:underline"
                      >
                        {route.label}
                      </Link>
                    </li>
                  ))}
                  {extraPosts.map((post) => (
                    <li key={post.route}>
                      <Link href={post.route} className="text-primary hover:underline">
                        {post.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
