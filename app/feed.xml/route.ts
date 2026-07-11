import { getBlogPosts } from "@/lib/sanity"

export const revalidate = 3600

const baseUrl = "https://accessibility.build"

type FeedPost = {
  _updatedAt?: string
  title?: string
  slug?: { current?: string }
  excerpt?: string
  publishedAt?: string
  author?: { name?: string }
  categories?: Array<{ title?: string }>
}

type FeedPostWithSlug = FeedPost & {
  slug: { current: string }
  publishedAt: string
}

function hasRequiredFeedFields(post: FeedPost): post is FeedPostWithSlug {
  return Boolean(post?.slug?.current && post?.publishedAt)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0
}

function escapeXml(value: unknown): string {
  return String(value ?? "").replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case "&":
        return "&amp;"
      case "'":
        return "&apos;"
      case '"':
        return "&quot;"
      default:
        return char
    }
  })
}

function toRfc822(date: string | undefined): string {
  const parsed = date ? new Date(date) : new Date(0)
  return Number.isNaN(parsed.getTime()) ? new Date(0).toUTCString() : parsed.toUTCString()
}

export async function GET(): Promise<Response> {
  let posts: FeedPost[] = []

  try {
    posts = (await getBlogPosts()) as FeedPost[]
  } catch (error) {
    console.error("Error generating RSS feed:", error)
  }

  const items = (posts || [])
    .filter(hasRequiredFeedFields)
    .sort(
      (a, b) =>
        new Date(b._updatedAt || b.publishedAt).getTime() -
        new Date(a._updatedAt || a.publishedAt).getTime()
    )
    .slice(0, 50)

  const latestDate = items[0]?._updatedAt || items[0]?.publishedAt

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Accessibility.build Blog</title>
    <link>${baseUrl}/blog</link>
    <description>WCAG guides, accessibility testing tutorials, compliance explainers, and accessibility research from Accessibility.build.</description>
    <language>en-US</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${latestDate ? `<lastBuildDate>${toRfc822(latestDate)}</lastBuildDate>` : ""}
    ${items
      .map((post) => {
        const url = `${baseUrl}/blog/${post.slug.current}`
        const categories = (post.categories || [])
          .map((category) => category?.title)
          .filter(isNonEmptyString)
          .map((category) => `<category>${escapeXml(category)}</category>`)
          .join("")

        return `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.excerpt || "")}</description>
      <pubDate>${toRfc822(post.publishedAt)}</pubDate>
      ${post.author?.name ? `<author>contact@accessibility.build (${escapeXml(post.author.name)})</author>` : ""}
      ${categories}
    </item>`
      })
      .join("\n    ")}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
