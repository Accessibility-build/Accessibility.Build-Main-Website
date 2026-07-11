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

function toIsoDate(date: string | undefined): string {
  const parsed = date ? new Date(date) : new Date(0)
  return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString()
}

export async function GET(): Promise<Response> {
  let posts: FeedPost[] = []

  try {
    posts = (await getBlogPosts()) as FeedPost[]
  } catch (error) {
    console.error("Error generating Atom feed:", error)
  }

  const entries = (posts || [])
    .filter(hasRequiredFeedFields)
    .sort(
      (a, b) =>
        new Date(b._updatedAt || b.publishedAt).getTime() -
        new Date(a._updatedAt || a.publishedAt).getTime()
    )
    .slice(0, 50)

  const updated = toIsoDate(entries[0]?._updatedAt || entries[0]?.publishedAt)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${baseUrl}/blog</id>
  <title>Accessibility.build Blog</title>
  <subtitle>WCAG guides, accessibility testing tutorials, compliance explainers, and accessibility research from Accessibility.build.</subtitle>
  <link href="${baseUrl}/blog" rel="alternate" />
  <link href="${baseUrl}/atom.xml" rel="self" type="application/atom+xml" />
  <updated>${updated}</updated>
  <author>
    <name>Accessibility.build</name>
    <uri>${baseUrl}</uri>
  </author>
  ${entries
    .map((post) => {
      const url = `${baseUrl}/blog/${post.slug.current}`
      const categories = (post.categories || [])
        .map((category) => category?.title)
        .filter(isNonEmptyString)
        .map((category) => `<category term="${escapeXml(category)}" />`)
        .join("")

      return `<entry>
    <id>${url}</id>
    <title>${escapeXml(post.title)}</title>
    <link href="${url}" rel="alternate" />
    <published>${toIsoDate(post.publishedAt)}</published>
    <updated>${toIsoDate(post._updatedAt || post.publishedAt)}</updated>
    ${post.author?.name ? `<author><name>${escapeXml(post.author.name)}</name></author>` : ""}
    ${categories}
    <summary>${escapeXml(post.excerpt || "")}</summary>
  </entry>`
    })
    .join("\n  ")}
</feed>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
