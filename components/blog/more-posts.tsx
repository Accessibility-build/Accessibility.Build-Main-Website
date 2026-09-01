import Link from "next/link"
import { getBlogPosts, getBlogPostsByCategory } from "@/lib/sanity"

interface MorePostsProps {
  /** Slug of the post being read, so it is never recommended to itself. */
  currentSlug: string
  /** Slug of the post's primary category, used to pick same-topic posts first. */
  categorySlug?: string
  /** Human label for the category, for the section intro. */
  categoryTitle?: string
}

interface PostSummary {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt: string
  estimatedReadingTime?: number
}

/**
 * "More from the blog": three same-category posts (falling back to the most
 * recent posts) rendered as plain server-side links. Before this, each post
 * had exactly two inbound links on the whole site (the index and the feed),
 * so posts could not pass authority to one another and older posts were
 * effectively orphaned once they left the index's first screen.
 */
export async function MorePosts({ currentSlug, categorySlug, categoryTitle }: MorePostsProps) {
  let posts: PostSummary[] = []
  try {
    if (categorySlug) {
      posts = ((await getBlogPostsByCategory(categorySlug)) as PostSummary[]) || []
    }
    if (posts.filter((p) => p.slug?.current !== currentSlug).length < 3) {
      const latest = ((await getBlogPosts()) as PostSummary[]) || []
      const seen = new Set(posts.map((p) => p._id))
      posts = [...posts, ...latest.filter((p) => !seen.has(p._id))]
    }
  } catch (error) {
    console.error("MorePosts: could not load posts", error)
    return null
  }

  const picks = posts.filter((p) => p?.slug?.current && p.slug.current !== currentSlug).slice(0, 3)
  if (picks.length === 0) return null

  return (
    <section
      aria-labelledby="more-posts-heading"
      className="border-t border-slate-200 bg-white py-14 font-sans dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <h2 id="more-posts-heading" className="text-2xl font-semibold text-slate-900 dark:text-white">
          More from the blog
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {categoryTitle ? `Other posts filed under ${categoryTitle}.` : "Recent posts."}
        </p>
        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {picks.map((post) => {
            const date = new Date(post.publishedAt)
            const dateLabel = Number.isNaN(date.getTime())
              ? null
              : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })
            return (
              <li key={post._id} className="flex flex-col rounded-lg border border-slate-200 p-5 dark:border-slate-800">
                <h3 className="text-base font-semibold leading-snug text-slate-900 dark:text-white">
                  <Link href={`/blog/${post.slug.current}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                {post.excerpt ? (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{post.excerpt}</p>
                ) : null}
                <p className="mt-auto pt-4 text-xs text-slate-500 dark:text-slate-500">
                  {dateLabel}
                  {post.estimatedReadingTime ? ` · ${post.estimatedReadingTime} min read` : ""}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
