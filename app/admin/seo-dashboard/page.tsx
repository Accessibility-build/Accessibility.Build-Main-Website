import Link from "next/link"
import {
  ArrowUpRight,
  Bot,
  CircleAlert,
  Link2,
  Map as MapIcon,
  Rss,
} from "lucide-react"
import { requireAdmin } from "@/lib/admin-auth"
import { getBlogPosts } from "@/lib/sanity"
import { extractKeywords } from "@/lib/seo-utils"
import { siteRoutes } from "@/lib/site-routes"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "SEO Review | Admin Dashboard",
  description: "Deterministic content and crawl checks for Accessibility.build",
  robots: { index: false, follow: false },
}

type SeoPost = {
  _id: string
  title?: string
  slug?: { current?: string }
  excerpt?: string
  publishedAt?: string
  author?: { name?: string } | null
  mainImage?: string | null
  categories?: Array<{ title?: string }> | null
}

type PostReview = {
  post: SeoPost
  issues: string[]
}

function reviewPost(post: SeoPost): PostReview {
  const issues: string[] = []
  const title = post.title?.trim() ?? ""
  const excerpt = post.excerpt?.trim() ?? ""

  if (!title) issues.push("Missing title")
  else if (title.length < 30) issues.push("Title shorter than 30 characters")
  else if (title.length > 70) issues.push("Title longer than 70 characters")

  if (!excerpt) issues.push("Missing excerpt")
  else if (excerpt.length < 100) issues.push("Excerpt shorter than 100 characters")
  else if (excerpt.length > 180) issues.push("Excerpt longer than 180 characters")

  if (!post.slug?.current) issues.push("Missing slug")
  if (!post.publishedAt) issues.push("Missing publication date")
  if (!post.author?.name) issues.push("Missing author")
  if (!post.mainImage) issues.push("Missing main image")
  if (!post.categories?.some((category) => category.title)) issues.push("Missing category")

  return { post, issues }
}

function formatDate(value?: string) {
  if (!value) return "Not set"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString("en-IN", { dateStyle: "medium" })
}

export default async function SEODashboardPage() {
  await requireAdmin('/admin/seo-dashboard')

  let posts: SeoPost[] = []
  let cmsError = false

  try {
    posts = (await getBlogPosts()) as SeoPost[]
  } catch {
    cmsError = true
  }

  const postReviews = posts.map(reviewPost)
  const postsWithIssues = postReviews.filter((review) => review.issues.length > 0)
  const totalContentIssues = postReviews.reduce((total, review) => total + review.issues.length, 0)
  const duplicateRoutes = siteRoutes.length - new Set(siteRoutes.map((route) => route.route)).size
  const today = new Date()
  const staleCutoff = new Date(today)
  staleCutoff.setFullYear(staleCutoff.getFullYear() - 1)
  const staleRoutes = siteRoutes.filter((route) => new Date(route.lastModified) < staleCutoff)
  const futureDatedRoutes = siteRoutes.filter((route) => new Date(route.lastModified) > today)

  const keywordCounts = new Map<string, number>()
  for (const post of posts) {
    const categories = post.categories?.flatMap((category) => category.title ? [category.title] : []) ?? []
    const keywords = extractKeywords(`${post.title ?? ""} ${post.excerpt ?? ""}`, categories)
    for (const keyword of keywords) keywordCounts.set(keyword.toLowerCase(), (keywordCounts.get(keyword.toLowerCase()) ?? 0) + 1)
  }
  const topKeywords = [...keywordCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 12)
  const maxKeywordCount = topKeywords[0]?.[1] ?? 1

  const routeGroups = [...new Set(siteRoutes.map((route) => route.group))]
    .map((group) => ({ group, count: siteRoutes.filter((route) => route.group === group).length }))
    .sort((a, b) => b.count - a.count || a.group.localeCompare(b.group))

  const technicalChecks = [
    {
      icon: MapIcon,
      name: "Sitemap source registry",
      status: duplicateRoutes === 0 ? "Ready" : "Review",
      detail: `${siteRoutes.length.toLocaleString()} static public routes; ${duplicateRoutes} duplicate route${duplicateRoutes === 1 ? "" : "s"}. CMS posts are appended separately.`,
      href: "/sitemap.xml",
    },
    {
      icon: Bot,
      name: "Crawler directives",
      status: "Configured",
      detail: "robots.txt and llms.txt are exposed as public route handlers.",
      href: "/robots.txt",
    },
    {
      icon: Rss,
      name: "Content feeds",
      status: "Configured",
      detail: "RSS and Atom endpoints are available for published content discovery.",
      href: "/feed.xml",
    },
    {
      icon: Link2,
      name: "Route dates",
      status: staleRoutes.length === 0 && futureDatedRoutes.length === 0 ? "Ready" : "Review",
      detail: `${staleRoutes.length} route${staleRoutes.length === 1 ? "" : "s"} older than one year; ${futureDatedRoutes.length} future-dated route${futureDatedRoutes.length === 1 ? "" : "s"}.`,
      href: "/sitemap-page",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        <AdminPageHeader
          eyebrow="Search operations"
          title="SEO review"
          description="Deterministic checks from the live Sanity article index and the public route registry. This page does not estimate rankings, traffic, Core Web Vitals, or image-alt coverage it has not measured."
          actions={
            <Button asChild variant="outline" size="sm">
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">Open sitemap <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></a>
            </Button>
          }
        />

        {cmsError ? (
          <div className="flex gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100" role="alert">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div><p className="font-semibold">Sanity content could not be loaded</p><p className="mt-1">Route checks remain available, but content and keyword results are incomplete.</p></div>
          </div>
        ) : null}

        <dl className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 xl:grid-cols-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b p-5 sm:border-r xl:border-b-0"><dt className="text-sm text-slate-500">Public route records</dt><dd className="mt-2 text-2xl font-semibold">{siteRoutes.length.toLocaleString()}</dd></div>
          <div className="border-b p-5 xl:border-b-0 xl:border-r"><dt className="text-sm text-slate-500">Published CMS posts</dt><dd className="mt-2 text-2xl font-semibold">{cmsError ? "Unavailable" : posts.length.toLocaleString()}</dd></div>
          <div className="border-b p-5 sm:border-r xl:border-b-0"><dt className="text-sm text-slate-500">Posts needing review</dt><dd className="mt-2 text-2xl font-semibold">{cmsError ? "Unavailable" : postsWithIssues.length.toLocaleString()}</dd></div>
          <div className="p-5"><dt className="text-sm text-slate-500">Detected content checks</dt><dd className="mt-2 text-2xl font-semibold">{cmsError ? "Unavailable" : totalContentIssues.toLocaleString()}</dd></div>
        </dl>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-2 bg-slate-200 p-1 sm:grid-cols-4 dark:bg-slate-800" aria-label="SEO review views">
            <TabsTrigger value="content" className="min-h-12 whitespace-normal">Content</TabsTrigger>
            <TabsTrigger value="keywords" className="min-h-12 whitespace-normal">Keywords</TabsTrigger>
            <TabsTrigger value="routes" className="min-h-12 whitespace-normal">Routes</TabsTrigger>
            <TabsTrigger value="technical" className="min-h-12 whitespace-normal">Technical</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <section className="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" aria-labelledby="content-review-heading">
              <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <h2 id="content-review-heading" className="text-xl font-semibold">Published content checks</h2>
                <p className="mt-1 text-sm text-slate-500">Title, excerpt, slug, publication date, author, image, and category presence.</p>
              </div>
              {postReviews.length > 0 ? (
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {postReviews.map(({ post, issues }) => (
                    <li key={post._id} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="break-words font-semibold [overflow-wrap:anywhere]">{post.title || "Untitled post"}</h3>
                          <Badge variant={issues.length === 0 ? "secondary" : "destructive"}>{issues.length === 0 ? "Checks passed" : `${issues.length} to review`}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Published {formatDate(post.publishedAt)} · /blog/{post.slug?.current || "missing-slug"}</p>
                        {issues.length > 0 ? <p className="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-200">{issues.join("; ")}</p> : null}
                      </div>
                      {post.slug?.current ? (
                        <Button asChild variant="outline" size="sm"><Link href={`/blog/${post.slug.current}`} target="_blank">View article <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : <p className="p-8 text-center text-sm text-slate-500">{cmsError ? "Content checks are unavailable." : "No published posts were returned."}</p>}
            </section>
          </TabsContent>

          <TabsContent value="keywords" className="mt-6">
            <section className="rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" aria-labelledby="keyword-heading">
              <h2 id="keyword-heading" className="text-xl font-semibold">Frequent content terms</h2>
              <p className="mt-1 text-sm text-slate-500">Deterministic frequency across article titles, excerpts, and category names. This is not search-volume or ranking data.</p>
              {topKeywords.length > 0 ? (
                <ol className="mt-6 space-y-4">
                  {topKeywords.map(([keyword, count]) => (
                    <li key={keyword} className="grid gap-2 sm:grid-cols-[12rem_1fr_5rem] sm:items-center">
                      <span className="font-medium">{keyword}</span>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" role="progressbar" aria-label={`${keyword} appears in ${count} article keyword sets`} aria-valuenow={count} aria-valuemin={0} aria-valuemax={maxKeywordCount}>
                        <div className="h-full bg-teal-600 dark:bg-teal-300" style={{ width: `${Math.max(5, (count / maxKeywordCount) * 100)}%` }} />
                      </div>
                      <span className="text-sm tabular-nums text-slate-500 sm:text-right">{count} article{count === 1 ? "" : "s"}</span>
                    </li>
                  ))}
                </ol>
              ) : <p className="mt-6 text-sm text-slate-500">No keyword data is available.</p>}
            </section>
          </TabsContent>

          <TabsContent value="routes" className="mt-6">
            <section className="rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" aria-labelledby="route-groups-heading">
              <h2 id="route-groups-heading" className="text-xl font-semibold">Public route groups</h2>
              <p className="mt-1 text-sm text-slate-500">Routes registered as public and indexable before CMS posts are appended.</p>
              <dl className="mt-6 grid gap-x-8 sm:grid-cols-2 xl:grid-cols-3">
                {routeGroups.map(({ group, count }) => (
                  <div key={group} className="flex items-center justify-between gap-4 border-t border-slate-200 py-4 dark:border-slate-800">
                    <dt className="font-medium">{group}</dt><dd className="tabular-nums text-slate-500">{count}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </TabsContent>

          <TabsContent value="technical" className="mt-6">
            <section className="rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" aria-labelledby="technical-heading">
              <h2 id="technical-heading" className="text-xl font-semibold">Technical source checks</h2>
              <p className="mt-1 text-sm text-slate-500">Configuration and registry facts only; no invented performance or ranking score.</p>
              <ul className="mt-6 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {technicalChecks.map(({ icon: Icon, name, status, detail, href }) => (
                  <li key={name} className="grid gap-4 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-start">
                    <Icon className="mt-0.5 h-5 w-5 text-slate-500" aria-hidden="true" />
                    <div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{name}</h3><Badge variant={status === "Review" ? "destructive" : "secondary"}>{status}</Badge></div><p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p></div>
                    <Button asChild variant="ghost" size="sm"><Link href={href} target="_blank" aria-label={`Open ${name}`}>Open <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
                  </li>
                ))}
              </ul>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
