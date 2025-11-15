import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ChevronRight, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { client } from "@/lib/sanity"
import { urlFor } from "@/lib/sanity"
import PortableTextRenderer from "@/components/sanity/portable-text"
import { TableOfContents } from "@/components/blog/table-of-contents"
import { BlogHeader } from "@/components/blog/blog-header"
import Image from "next/image"
import type { Metadata } from "next"
import { ArticleStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { SocialShare } from "@/components/seo/social-share"
import { RelatedContent } from "@/components/seo/related-content"
import { ListenFeature } from "@/components/blog/listen-feature"

// Enable static generation with revalidation every 24 hours
export const revalidate = 86400

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const query = `
      *[_type == "post" && defined(slug.current)] {
        "slug": slug.current
      }
    `
    
    const posts = await client.fetch(query)
    
    return posts.map((post: { slug: string }) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

// Get post data from Sanity
async function getPost(slug: string) {
  const query = `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      body,
      publishedAt,
      mainImage,
      author->{
        name,
        image,
        bio
      },
      categories[]->{
        title,
        slug
      },
      seo,
      accessibility,
      estimatedReadingTime
    }
  `
  
  const post = await client.fetch(query, { slug })
  return post
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) {
      return {
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
      }
    }

    return {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      keywords: post.seo?.keywords?.join(", ") || "",
      authors: [{ name: post.author?.name || "Accessibility.build Team" }],
      openGraph: {
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.excerpt,
        type: "article",
        publishedTime: post.publishedAt,
        authors: [post.author?.name || "Accessibility.build Team"],
        images: [
          {
            url: post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : "/og-image.png",
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.excerpt,
        images: [post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : "/og-image.png"],
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Error Loading Post",
      description: "There was an error loading this blog post.",
    }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) {
      notFound()
    }

    const currentUrl = `https://accessibility.build/blog/${slug}`
    const breadcrumbs = [
      { name: "Home", url: "https://accessibility.build" },
      { name: "Blog", url: "https://accessibility.build/blog" },
      { name: post.title, url: currentUrl }
    ]

    return (
      <>
        {/* Schema Markup */}
        <ArticleStructuredData
          headline={post.title}
          description={post.excerpt || ""}
          author={{
            name: post.author?.name || "Accessibility.build Team",
            url: "https://accessibility.build/about"
          }}
          publisher={{
            name: "Accessibility.build",
            logo: "https://accessibility.build/android-chrome-512x512.png"
          }}
          datePublished={post.publishedAt}
          dateModified={post.publishedAt}
          image={post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : "https://accessibility.build/og-image.png"}
          url={currentUrl}
          wordCount={post.estimatedReadingTime ? post.estimatedReadingTime * 250 : 1000}
          keywords={post.seo?.keywords || []}
        />
        
        <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

        {/* Blog Header with Reading Progress */}
        <BlogHeader
          currentUrl={currentUrl}
          title={post.title}
          description={post.excerpt}
          tags={post.categories?.map((cat: any) => cat.title) || []}
          imageUrl={post.mainImage ? urlFor(post.mainImage).url() : undefined}
          showProgress={true}
        />

        {/* Main Layout */}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
              
          {/* Hero Section */}
          <section className="pt-8 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-4xl mx-auto lg:mx-0">
                
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-6" aria-label="Breadcrumb">
                  <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Home</Link>
                  <ChevronRight className="mx-2 h-4 w-4" />
                  <Link href="/blog" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Blog</Link>
                  <ChevronRight className="mx-2 h-4 w-4" />
                  <span className="text-slate-900 dark:text-white font-medium">Article</span>
                </nav>

                {/* Categories and WCAG Badge */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories?.map((category: any) => (
                    <Badge 
                      key={category.slug.current} 
                      variant="secondary" 
                      className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {category.title}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-xs font-medium border-green-300 text-green-700 dark:border-green-700 dark:text-green-400">
                    WCAG AA
                  </Badge>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
                  {post.title}
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-3xl">
                  {post.excerpt}
                </p>

                {/* Clean Date and Reading Time + Listen Feature */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.estimatedReadingTime} min read</span>
                    </div>
                  </div>

                  {/* Listen Feature */}
                  <ListenFeature 
                    title={post.title}
                    content={post.body}
                  />
                </div>

                {/* Share and Actions */}
                <div className="flex items-center gap-4 mb-8">
                  <SocialShare
                    url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug.current}`}
                    title={post.title}
                    description={post.excerpt}
                    tags={post.categories?.map((cat: any) => cat.title) || []}
                    showLabel={false}
                  />
                </div>

              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="pb-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-4 gap-8">
                
                {/* Main Article Content */}
                <div className="lg:col-span-3">
                  <article className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-8 sm:p-12 lg:p-16">
                      
                      {/* Content */}
                      <div className="prose-container max-w-none">
                        <PortableTextRenderer content={post.body} className="prose-content" />
                      </div>

                      {/* Article Footer */}
                      <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
                        
                        {/* Accessibility Topics */}
                        {post.accessibility?.topics && post.accessibility.topics.length > 0 && (
                          <div className="mb-8">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Accessibility Topics Covered</h3>
                            <div className="flex flex-wrap gap-2">
                              {post.accessibility.topics.map((topic: any, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs capitalize">
                                  {topic.replace('-', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}



                        {/* Share Section */}
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Share this article</h3>
                          <SocialShare
                            url={currentUrl}
                            title={post.title}
                            description={post.excerpt}
                            tags={post.categories?.map((cat: any) => cat.title) || []}
                            imageUrl={post.mainImage ? urlFor(post.mainImage).url() : undefined}
                            showLabel={true}
                          />
                        </div>
                      </footer>
                    </div>
                  </article>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-6">
                    
                    {/* Table of Contents */}
                    <TableOfContents content={post.body} />

                    {/* Enhanced Author Card */}
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="p-6">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">About the Author</h3>
                        <AuthorSidebarCard 
                          author={post.author?.name || "Accessibility.build Team"}
                          image={post.author?.image ? urlFor(post.author.image).width(64).height(64).url() : undefined}
                        />
                      </div>
                    </Card>

                    {/* Newsletter Signup */}
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 p-6">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">Stay Updated</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                        Get the latest accessibility insights delivered to your inbox.
                      </p>
                      <Button size="sm" className="w-full">Subscribe</Button>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Content */}
          <section className="bg-slate-100 dark:bg-slate-900 py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <RelatedContent 
                content={`${post.title} ${post.excerpt} ${post.categories?.map((cat: any) => cat.title).join(' ')}`}
                title="Continue Reading"
                maxItems={3}
                showDescriptions={true}
              />
            </div>
          </section>
        </div>
      </>
    )
  } catch (error) {
    console.error("Error loading blog post:", error)
    notFound()
  }
}

function AuthorInfo({ author, image }: { author: string; image?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600">
        {image ? (
          <Image
            src={image}
            alt={author}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-white font-bold">
            {author.split(" ").map((name: string) => name[0]).join("")}
          </div>
        )}
      </div>
      <div>
        <div className="font-semibold text-slate-900 dark:text-white">{author}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">Accessibility Expert</div>
      </div>
    </div>
  )
}

function AuthorCard({ author, image }: { author: string; image?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600">
        {image ? (
          <Image
            src={image}
            alt={author}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-white font-bold text-sm">
            {author.split(" ").map((name: string) => name[0]).join("")}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{author}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Accessibility Expert</div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Passionate about creating inclusive digital experiences for everyone.
        </p>
      </div>
    </div>
  )
}

// Enhanced Author Sticker Component
function AuthorSticker({ 
  author, 
  image, 
  publishedAt, 
  readingTime 
}: { 
  author: string; 
  image?: string; 
  publishedAt: string; 
  readingTime?: number; 
}) {
  return (
    <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-900 rounded-full px-4 py-2 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-200">
      {/* Author Avatar */}
      <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
        {image ? (
          <Image
            src={image}
            alt={author}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
            {author.split(" ").map((name: string) => name[0]).join("")}
          </div>
        )}
        {/* Online indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
      </div>
      
      {/* Author Info */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-white text-sm">{author}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Accessibility Expert</span>
        </div>
        
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </time>
          </div>
          {readingTime && (
            <>
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{readingTime} min read</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Enhanced Author Bio Card Component
function AuthorBioCard({ 
  author, 
  image, 
  bio 
}: { 
  author: string; 
  image?: string; 
  bio: any; 
}) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-start gap-4">
        {/* Enhanced Avatar */}
        <div className="relative">
          <div className="relative h-20 w-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
            {image ? (
              <Image
                src={image}
                alt={author}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
                {author.split(" ").map((name: string) => name[0]).join("")}
              </div>
            )}
          </div>
          {/* Verified badge */}
          <div className="absolute -top-1 -right-1 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* Author Details */}
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-lg">{author}</h4>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-3">Accessibility Expert & Consultant</p>
          <div className="prose prose-sm prose-slate dark:prose-invert">
            <PortableTextRenderer content={bio} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Sidebar Author Card Component
function AuthorSidebarCard({ 
  author, 
  image 
}: { 
  author: string; 
  image?: string; 
}) {
  return (
    <div className="text-center">
      {/* Avatar */}
      <div className="relative mx-auto mb-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden mx-auto shadow-lg">
          {image ? (
            <Image
              src={image}
              alt={author}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
              {author.split(" ").map((name: string) => name[0]).join("")}
            </div>
          )}
        </div>
        {/* Status indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
      </div>
      
      {/* Author Info */}
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{author}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Accessibility Expert</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Passionate about creating inclusive digital experiences for everyone.
        </p>
      </div>
      

    </div>
  )
}

