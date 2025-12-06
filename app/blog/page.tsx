import type { Metadata } from "next"
import { getBlogPosts, getBlogCategories } from "@/lib/sanity"
import BlogClientPage from "./BlogClientPage"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"

// Enable static generation with revalidation every 24 hours
export const revalidate = 86400

export const metadata: Metadata = {
  title: "Blog | Accessibility.build",
  description:
    "Explore articles, guides, and tutorials that break down web accessibility concepts into practical steps. Stay informed about best practices and WCAG updates.",
  alternates: {
    canonical: "https://accessibility.build/blog",
  },
  openGraph: {
    title: "Accessibility Blog | Accessibility.build",
    description: "Explore articles, guides, and tutorials that break down web accessibility concepts into practical steps. Stay informed about best practices and WCAG updates.",
    url: "https://accessibility.build/blog",
    type: "website",
    siteName: "Accessibility.build",
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Blog | Accessibility.build",
    description: "Explore articles, guides, and tutorials that break down web accessibility concepts into practical steps.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Blog", url: "https://accessibility.build/blog" }
]

export default async function BlogPage() {
  // Fetch blog posts and categories from Sanity
  const [posts, categories] = await Promise.all([
    getBlogPosts(),
    getBlogCategories()
  ])

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Accessibility Blog",
    "description": "Explore articles, guides, and tutorials that break down web accessibility concepts into practical steps.",
    "url": "https://accessibility.build/blog",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": posts.map((post: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://accessibility.build/blog/${post.slug.current}`,
        "name": post.title
      }))
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema)
        }}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <BlogClientPage posts={posts} categories={categories} />
    </>
  )
}
