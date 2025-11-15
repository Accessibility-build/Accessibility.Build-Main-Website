import type { Metadata } from "next"
import { getBlogPosts, getBlogCategories } from "@/lib/sanity"
import BlogClientPage from "./BlogClientPage"

// Enable static generation with revalidation every 24 hours
export const revalidate = 86400

export const metadata: Metadata = {
  title: "Blog | Accessibility.build",
  description:
    "Explore articles, guides, and tutorials that break down web accessibility concepts into practical steps. Stay informed about best practices and WCAG updates.",
}

export default async function BlogPage() {
  // Fetch blog posts and categories from Sanity
  const [posts, categories] = await Promise.all([
    getBlogPosts(),
    getBlogCategories()
  ])

  return <BlogClientPage posts={posts} categories={categories} />
}
