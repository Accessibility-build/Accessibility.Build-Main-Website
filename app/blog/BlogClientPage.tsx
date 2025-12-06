"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Search, ArrowRight, BookOpen, TrendingUp } from "lucide-react"
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-6">
            <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Accessibility Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Accessibility Blog
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Learn about web accessibility through our collection of articles, guides, and tutorials.
          </p>
          <BlogSearch />
        </div>
      </section>

      {/* Main Content - Two Column Layout */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
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
          className="pl-12 pr-4 py-3 text-base bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:shadow-md transition-shadow"
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
    <div className="space-y-20">
      {/* Featured Articles */}
      {featuredPosts.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Articles</h2>
          </div>
          <div className="space-y-10">
            {featuredPosts.map((post) => (
              <FeaturedPostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* All Articles */}
      <section>
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Articles</h2>
        </div>
        <div className="space-y-8">
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
    <Link href={`/blog/${post.slug.current}`}>
      <Card className="group overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 bg-white dark:bg-slate-800">
        <div className="p-6 sm:p-8">
          <CardHeader className="p-0 mb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories?.map((category, index) => (
                <Badge key={index} variant="secondary" className="text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0">
                  {category.title}
                </Badge>
              ))}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
              {post.title}
            </h3>
          </CardHeader>

          <CardContent className="p-0">
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm sm:text-base leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <AuthorInfo 
                author={post.author.name} 
                image={post.author.image}
              />
              <PostMeta date={post.publishedAt} readingTime={`${post.estimatedReadingTime} min read`} />
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}

function RegularPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug.current}`}>
      <Card className="group border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 bg-white dark:bg-slate-800 p-4 sm:p-6">
        <div className="flex items-start gap-4 sm:gap-6">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <CardHeader className="p-0 mb-3">
              <div className="flex flex-wrap gap-2 mb-2">
                {post.categories?.slice(0, 2).map((category, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-slate-200 dark:border-slate-700">
                    {category.title}
                  </Badge>
                ))}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                {post.title}
              </h3>
            </CardHeader>

            <CardContent className="p-0">
              <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <AuthorInfo 
                  author={post.author.name} 
                  image={post.author.image}
                  size="sm" 
                />
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
    </Link>
  )
}

function AuthorInfo({ author, image, size = "base" }: { author: string; image?: string; size?: "sm" | "base" }) {
  const avatarSize = size === "sm" ? "h-8 w-8" : "h-10 w-10"
  const textSize = size === "sm" ? "text-sm" : "text-base"
  
  // Generate DiceBear avatar URL
  const defaultAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(author)}&backgroundColor=b6e3f4,c0aede,d1d4f9&backgroundType=gradientLinear`

  return (
    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
      <div className={`${avatarSize} rounded-full overflow-hidden flex-shrink-0 ring-2 ring-slate-100 dark:ring-slate-700`}>
        <Image
          src={image || defaultAvatar}
          alt={author}
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <div className={`font-medium text-slate-900 dark:text-white ${textSize} truncate`}>{author}</div>
      </div>
    </div>
  )
}

function PostMeta({ date, readingTime, size = "base" }: { date: string; readingTime: string; size?: "sm" | "base" }) {
  const textSize = size === "sm" ? "text-xs" : "text-sm"
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4"

  return (
    <div className={`flex items-center gap-3 sm:gap-4 text-slate-500 dark:text-slate-400 ${textSize} flex-shrink-0`}>
      <div className="flex items-center gap-1">
        <Calendar className={iconSize} />
        <time dateTime={date} className="hidden sm:inline">
          {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </time>
        <time dateTime={date} className="sm:hidden">
          {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </time>
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
    <div className="lg:sticky lg:top-24 space-y-8">
      {/* Categories */}
      <Card className="border border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800 p-5 sm:p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:border-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer border-slate-200 dark:border-slate-700"
            >
              {category}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Recent Posts */}
      <Card className="border border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800 p-5 sm:p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-green-600 rounded-full"></div>
          Recent Posts
        </h3>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <div key={post._id} className="group">
              <Link href={`/blog/${post.slug.current}`} className="block">
                <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm leading-tight mb-1.5">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </time>
                  <span>•</span>
                  <span>{post.estimatedReadingTime} min read</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </Card>

      {/* Newsletter Signup */}
      <Card className="border border-blue-200 dark:border-blue-800 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Stay Updated</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Get the latest accessibility insights delivered to your inbox.</p>
        </div>
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
