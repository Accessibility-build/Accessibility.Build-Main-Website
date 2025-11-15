"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Search, ArrowRight } from "lucide-react"
import { useState } from "react"

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  author: {
    name: string
    image?: string
  }
  mainImage?: string
  estimatedReadingTime: number
  categories: Array<{
    title: string
    slug: { current: string }
  }>
}

interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
}

interface BlogClientPageProps {
  posts?: BlogPost[]
  categories?: Category[]
}

export default function BlogClientPage({ posts = [], categories = [] }: BlogClientPageProps) {
  // Use Sanity data, fallback to empty array if no posts
  const blogPosts = posts

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Accessibility Blog
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Learn about web accessibility through our collection of articles, guides, and tutorials.
          </p>
          <BlogSearch />
        </div>
      </section>

      {/* Main Content - Two Column Layout */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content - Left Column (2/3 width) */}
            <div className="lg:col-span-2">
              <BlogListing posts={blogPosts} />
            </div>

            {/* Sidebar - Right Column (1/3 width) */}
            <div className="lg:col-span-1">
              <BlogSidebar posts={blogPosts} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function BlogSearch() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Search articles..."
          className="pl-12 pr-4 py-3 text-base bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-full shadow-sm focus:shadow-md transition-shadow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  )
}

function BlogListing({ posts }: { posts: BlogPost[] }) {
  // For now, show first 3 posts as featured, rest as regular
  const featuredPosts = posts.slice(0, 3)
  const regularPosts = posts.slice(3)

  return (
    <div className="space-y-16">
      {/* Featured Articles */}
      {featuredPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Featured Articles</h2>
          <div className="space-y-8">
            {featuredPosts.map((post) => (
              <FeaturedPostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* All Articles */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">All Articles</h2>
        <div className="space-y-6">
          {regularPosts.map((post) => (
            <RegularPostCard key={post._id} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}

function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800">
      <div className="p-8">
        <CardHeader className="p-0 mb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories?.map((category, index) => (
              <Badge key={index} variant="secondary" className="text-xs font-medium">
                {category.title}
              </Badge>
            ))}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
            <Link href={`/blog/${post.slug.current}`}>
              {post.title}
            </Link>
          </h3>
        </CardHeader>

        <CardContent className="p-0">
          <p className="text-slate-600 dark:text-slate-300 mb-6 text-base leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <AuthorInfo author={post.author.name} role="Accessibility Expert" />
            <PostMeta date={post.publishedAt} readingTime={`${post.estimatedReadingTime} min read`} />
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

function RegularPostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="group border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-800 p-6">
      <div className="flex items-start gap-6">
        {/* Content */}
        <div className="flex-1">
          <CardHeader className="p-0 mb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories?.map((category, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {category.title}
                </Badge>
              ))}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
              <Link href={`/blog/${post.slug.current}`}>
                {post.title}
              </Link>
            </h3>
          </CardHeader>

          <CardContent className="p-0">
            <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <AuthorInfo author={post.author.name} role="Accessibility Expert" size="sm" />
              <PostMeta date={post.publishedAt} readingTime={`${post.estimatedReadingTime} min read`} size="sm" />
            </div>
          </CardContent>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 pt-2">
          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </Card>
  )
}

function AuthorInfo({ author, role, size = "base" }: { author: string; role: string; size?: "sm" | "base" }) {
  const avatarSize = size === "sm" ? "h-8 w-8" : "h-10 w-10"
  const textSize = size === "sm" ? "text-sm" : "text-base"
  const roleSize = size === "sm" ? "text-xs" : "text-sm"

  return (
    <div className="flex items-center gap-3">
      <div className={`${avatarSize} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium`}>
        {author.split(" ").map((name) => name[0]).join("")}
      </div>
      <div>
        <div className={`font-medium text-slate-900 dark:text-white ${textSize}`}>{author}</div>
        <div className={`text-slate-500 dark:text-slate-400 ${roleSize}`}>{role}</div>
      </div>
    </div>
  )
}

function PostMeta({ date, readingTime, size = "base" }: { date: string; readingTime: string; size?: "sm" | "base" }) {
  const textSize = size === "sm" ? "text-xs" : "text-sm"
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4"

  return (
    <div className={`flex items-center gap-4 text-slate-500 dark:text-slate-400 ${textSize}`}>
      <div className="flex items-center gap-1">
        <Calendar className={iconSize} />
        <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
      </div>
      <div className="flex items-center gap-1">
        <Clock className={iconSize} />
        <span>{readingTime}</span>
      </div>
    </div>
  )
}

function BlogSidebar({ posts }: { posts: BlogPost[] }) {
  const allCategories = Array.from(new Set(posts.flatMap((post) => post.categories?.map(cat => cat.title) || [])))
  const recentPosts = posts.slice(0, 5)

  return (
    <div className="sticky top-8 space-y-8">
      {/* Categories */}
      <Card className="border-0 shadow-sm bg-white dark:bg-slate-800 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category, index) => (
            <Badge key={index} variant="outline" className="hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20 transition-colors cursor-pointer">
              {category}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Recent Posts */}
      <Card className="border-0 shadow-sm bg-white dark:bg-slate-800 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Posts</h3>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <div key={post._id} className="group">
              <Link href={`/blog/${post.slug.current}`} className="block">
                <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm leading-tight mb-1">
                  {post.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {post.estimatedReadingTime} min read
                </p>
              </Link>
            </div>
          ))}
        </div>
      </Card>

      {/* Newsletter Signup */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6">
        <NewsletterSignup 
          source="blog"
          compact={true}
          placeholder="Enter your email"
          buttonText="Subscribe"
          className=""
        />
      </Card>
    </div>
  )
}
