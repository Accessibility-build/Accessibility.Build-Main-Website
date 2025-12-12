import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { client } from "@/lib/sanity"
import { urlFor } from "@/lib/sanity"
import PortableTextRenderer from "@/components/sanity/portable-text"
import { TableOfContents } from "@/components/blog/table-of-contents"
import { Logo } from "@/components/logo"
import Image from "next/image"
import type { Metadata } from "next"
import { ArticleStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { SocialShare } from "@/components/seo/social-share"
import { RelatedContent } from "@/components/seo/related-content"
import { ListenFeature } from "@/components/blog/listen-feature"

// Enable static generation with revalidation every 24 hours
export const revalidate = 86400;

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const query = `
      *[_type == "post" && defined(slug.current)] {
        "slug": slug.current
      }
    `;

    const posts = await client.fetch(query);

    return posts.map((post: { slug: string }) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
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
  `;

  const post = await client.fetch(query, { slug });
  return post;
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
      return {
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    const currentUrl = `https://accessibility.build/blog/${slug}`

    return {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      keywords: post.seo?.keywords?.join(", ") || "",
      authors: [{ name: post.author?.name || "Accessibility.build Team" }],
      alternates: {
        canonical: currentUrl,
      },
      openGraph: {
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.excerpt,
        type: "article",
        url: currentUrl,
        publishedTime: post.publishedAt,
        authors: [post.author?.name || "Accessibility.build Team"],
        images: [
          {
            url: post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : "https://accessibility.build/og-image.png",
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
        images: [post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : "https://accessibility.build/og-image.png"],
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
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error Loading Post",
      description: "There was an error loading this blog post.",
    };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
      notFound();
    }

    const currentUrl = `https://accessibility.build/blog/${slug}`;
    const breadcrumbs = [
      { name: "Home", url: "https://accessibility.build" },
      { name: "Blog", url: "https://accessibility.build/blog" },
      { name: post.title, url: currentUrl }
    ]

    const authorName = post.author?.name || "Accessibility.build Team"
    const authorImage = post.author?.image ? urlFor(post.author.image).width(80).height(80).url() : undefined
    const heroImage = post.mainImage ? urlFor(post.mainImage).width(1400).height(700).url() : null
    // Use adventurer style for youthful animated cartoon characters
    const defaultAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(authorName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`

    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 font-serif">
        {/* Schema Markup */}
        <ArticleStructuredData
          headline={post.title}
          description={post.excerpt || ""}
          author={{
            name: authorName,
            url: "https://accessibility.build/about"
          }}
          publisher={{
            name: "Accessibility.build",
            logo: "https://accessibility.build/android-chrome-512x512.png",
          }}
          datePublished={post.publishedAt}
          dateModified={post.publishedAt}
          image={
            post.mainImage
              ? urlFor(post.mainImage).width(1200).height(630).url()
              : "https://accessibility.build/og-image.png"
          }
          url={currentUrl}
          wordCount={
            post.estimatedReadingTime ? post.estimatedReadingTime * 250 : 1000
          }
          keywords={post.seo?.keywords || []}
        />

        <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

        {/* Minimal Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
              <Logo className="h-8 w-auto" />
              <span className="font-bold text-lg hidden sm:inline-block">
                Accessibility.build
              </span>
            </Link>
            
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm" className="font-sans text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  All Posts
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Article Container */}
        <main>
          {/* Hero Section */}
          <article>
            {/* Category & Meta Header */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.categories.map((category: any) => (
                    <span 
                      key={category.slug.current} 
                      className="font-sans text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400"
                    >
                      {category.title}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl sm:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-4xl">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Author & Meta Bar */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6 border-y border-slate-100 dark:border-slate-800">
                {/* Author - Left Side */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={authorImage || defaultAvatar}
                      alt={authorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-sans font-semibold text-slate-900 dark:text-white truncate">{authorName}</p>
                    <div className="flex items-center gap-2 font-sans text-sm text-slate-500 dark:text-slate-400 flex-wrap">
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <span className="hidden xs:inline">·</span>
                      <span>{post.estimatedReadingTime || 5} min read</span>
                    </div>
                  </div>
                </div>

                {/* Listen Feature - Right Side */}
                <div className="flex-shrink-0 sm:ml-auto">
                  <ListenFeature 
                    title={post.title}
                    content={post.body}
                  />
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {heroImage && (
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={heroImage}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                
                {/* Article Content */}
                <div className="lg:col-span-8 order-1">
                  <div className="max-w-3xl">
                    {/* Content */}
                    <div className="prose-container">
                      <PortableTextRenderer content={post.body} className="prose-content blog-content" />
                    </div>

                    {/* Article Footer */}
                    <footer className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
                      
                      {/* Accessibility Topics */}
                      {post.accessibility?.topics && post.accessibility.topics.length > 0 && (
                        <div className="mb-10">
                          <h3 className="font-sans text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">Topics Covered</h3>
                          <div className="flex flex-wrap gap-2">
                            {post.accessibility.topics.map((topic: any, index: number) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="font-sans text-xs capitalize"
                              >
                                {topic.replace('-', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Share Section */}
                      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 text-center">
                        <h3 className="font-sans text-lg font-semibold text-slate-900 dark:text-white mb-2">Enjoyed this article?</h3>
                        <p className="font-sans text-sm text-slate-600 dark:text-slate-400 mb-6">Share it with others who care about accessibility.</p>
                        <div className="font-sans">
                          <SocialShare
                            url={currentUrl}
                            title={post.title}
                            description={post.excerpt}
                            tags={
                              post.categories?.map((cat: any) => cat.title) ||
                              []
                            }
                            imageUrl={
                              post.mainImage
                                ? urlFor(post.mainImage).url()
                                : undefined
                            }
                            showLabel={true}
                          />
                        </div>
                      </div>
                    </footer>
                  </div>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-4 order-2">
                  <div className="lg:sticky lg:top-24 space-y-6 font-sans">
                    
                    {/* Table of Contents */}
                    <div className="hidden md:block">
                      <TableOfContents content={post.body} />
                    </div>

                    {/* Author Card */}
                    <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">Written by</h3>
                        <AuthorSidebarCard 
                          author={authorName}
                          image={authorImage}
                        />
                      </div>
                    </Card>
                  </div>
                </aside>
              </div>
            </div>
          </article>

          {/* Related Content */}
          <section className="mt-20 py-16 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 font-sans">
              <RelatedContent 
                content={`${post.title} ${post.excerpt} ${post.categories?.map((cat: any) => cat.title).join(' ')}`}
                title="Continue Reading"
                maxItems={3}
                showDescriptions={true}
              />
            </div>
          </section>
        </main>

        {/* Minimal Footer */}
        <footer className="py-8 border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between font-sans text-sm text-slate-500 dark:text-slate-400">
            <Link href="/" className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Logo className="h-6 w-6" />
              <span>accessibility.build</span>
            </Link>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>
    )
  } catch (error) {
    console.error("Error loading blog post:", error);
    notFound();
  }
}

// Sidebar Author Card Component
function AuthorSidebarCard({ 
  author, 
  image 
}: { 
  author: string; 
  image?: string; 
}) {
  // Use adventurer style for youthful animated cartoon characters
  const defaultAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(author)}&backgroundColor=b6e3f4,c0aede,d1d4f9`
  
  return (
    <div className="flex items-start gap-4">
      <div className="relative h-14 w-14 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={image || defaultAvatar}
          alt={author}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-900 dark:text-white">{author}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Accessibility expert passionate about inclusive design.
        </p>
      </div>
    </div>
  );
}
