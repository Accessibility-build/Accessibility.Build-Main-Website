import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { client } from "@/lib/sanity"
import { urlFor } from "@/lib/sanity"
import PortableTextRenderer from "@/components/sanity/portable-text"
import { ArticleToc } from "@/components/blog/article-toc"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { BackToTop } from "@/components/blog/back-to-top"
import { Logo } from "@/components/logo"
import Image from "next/image"
import type { Metadata } from "next"
import { ArticleStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { SocialShare } from "@/components/seo/social-share"
import { RelatedContent } from "@/components/seo/related-content"
import { ListenFeature } from "@/components/blog/listen-feature"

type BlogCategory = {
  title?: string
  slug?: { current?: string }
}

// Revalidate individual posts hourly so edits in Sanity reflect promptly.
export const revalidate = 3600;

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
      _updatedAt,
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
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
      "wordCount": round(length(pt::text(body)) / 5)
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
    // Per-post social image: the post's own image when set, otherwise a
    // dynamically generated card titled with the post (not the generic site image).
    const ogImage = post.mainImage
      ? urlFor(post.mainImage).width(1200).height(630).url()
      : `https://accessibility.build/api/og?title=${encodeURIComponent(post.title)}&section=Blog`
    const categories = ((post.categories || []) as BlogCategory[])
      .map((category) => category?.title)
      .filter(Boolean)
    const keywords = Array.isArray(post.seo?.keywords)
      ? post.seo.keywords.filter(Boolean)
      : undefined

    return {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      ...(keywords?.length && { keywords }),
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
        modifiedTime: post._updatedAt || post.publishedAt,
        authors: [post.author?.name || "Accessibility.build Team"],
        ...(categories[0] && { section: categories[0] }),
        ...(categories.length && { tags: categories }),
        images: [
          {
            url: ogImage,
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
        images: [ogImage],
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

    const hasNamedAuthor = Boolean(post.author?.name)
    const authorName = post.author?.name || "Accessibility.build Team"
    const authorImage = post.author?.image ? urlFor(post.author.image).width(80).height(80).url() : undefined
    // Plain-text author bio from the Sanity Portable Text field, if present.
    const authorBio: string | undefined = Array.isArray(post.author?.bio)
      ? post.author.bio
          .map((b: any) => (b.children || []).map((c: any) => c.text).join(""))
          .join(" ")
          .trim() || undefined
      : undefined
    const heroImage = post.mainImage ? urlFor(post.mainImage).width(1400).height(700).url() : null
    const primaryCategory: string | undefined = post.categories?.[0]?.title
    // Brand monogram (initials) used when an author has no photo — replaces the
    // old cartoon avatar with something on-brand and professional.
    const authorInitials =
      authorName
        .split(/\s+/)
        .filter((w: string) => !['the', 'a', 'an', 'of', 'and', '&'].includes(w.toLowerCase()))
        .slice(0, 2)
        .map((w: string) => w[0])
        .join('')
        .toUpperCase() || 'A'

    const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    return (
      <div className="min-h-screen bg-white font-serif dark:bg-slate-950">
        <ReadingProgress />

        {/* Schema Markup */}
        <ArticleStructuredData
          articleType="BlogPosting"
          authorType={hasNamedAuthor ? "Person" : "Organization"}
          headline={post.title}
          description={post.excerpt || ""}
          author={{
            name: authorName,
            ...(hasNamedAuthor
              ? {
                  ...(authorImage && { image: authorImage }),
                  ...(authorBio && { description: authorBio }),
                }
              : { url: "https://accessibility.build/about" })
          }}
          publisher={{
            name: "Accessibility.build",
            logo: "https://accessibility.build/android-chrome-512x512.png",
          }}
          datePublished={post.publishedAt}
          dateModified={post._updatedAt || post.publishedAt}
          image={
            post.mainImage
              ? urlFor(post.mainImage).width(1200).height(630).url()
              : `https://accessibility.build/api/og?title=${encodeURIComponent(post.title)}&section=Blog`
          }
          url={currentUrl}
          wordCount={post.wordCount || undefined}
          keywords={post.seo?.keywords || []}
        />

        <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

        {/* The global site header/footer are supplied by the layout. */}
        <div>
          {/* A compact "back to blog" affordance above the article */}
          <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-6">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="-ml-2 font-sans text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All posts
              </Link>
            </Button>
          </div>
          <div className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-6">
            <div className="xl:grid xl:grid-cols-[15rem_minmax(0,1fr)] xl:gap-12">
              {/* Left gutter: scroll-spy table of contents (wide screens) */}
              <aside className="hidden xl:block">
                <div className="sticky top-24">
                  <ArticleToc />
                </div>
              </aside>

              {/* Reading column at optimal measure */}
              <div className="mx-auto w-full max-w-[44rem] xl:mx-0">
                <article>
                  {/* Article header */}
                  <header className="mb-10">
                    {primaryCategory && (
                      <Link
                        href="/blog"
                        className="font-sans text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400"
                      >
                        {primaryCategory}
                      </Link>
                    )}
                    <h1 className="mt-4 font-sans text-3xl font-bold leading-[1.12] tracking-tight text-slate-900 dark:text-white sm:text-[2.6rem]">
                      {post.title}
                    </h1>
                    {post.excerpt && (
                      <p className="mt-5 font-sans text-lg leading-relaxed text-slate-500 dark:text-slate-400 sm:text-xl">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Byline + meta */}
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-4 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 dark:ring-slate-700">
                          {authorImage ? (
                            <Image src={authorImage} alt={authorName} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 font-sans text-sm font-semibold text-white">
                              {authorInitials}
                            </div>
                          )}
                        </div>
                        <div className="font-sans">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">{authorName}</div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <time dateTime={post.publishedAt}>{formattedDate}</time>
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {post.estimatedReadingTime || 5} min read
                            </span>
                          </div>
                        </div>
                      </div>
                      <ListenFeature title={post.title} content={post.body} />
                    </div>
                  </header>

                  {/* Featured image (only when the post actually has one) */}
                  {heroImage && (
                    <figure className="mb-12">
                      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-lg">
                        <Image
                          src={heroImage}
                          alt={post.mainImage?.alt || post.title}
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, 704px"
                          className="object-cover"
                        />
                      </div>
                    </figure>
                  )}

                  {/* Body */}
                  <div id="article-body">
                    <PortableTextRenderer content={post.body} className="prose-content blog-content" />
                  </div>

                  {/* End matter */}
                  <footer className="mt-14 border-t border-slate-200 pt-10 font-sans dark:border-slate-800">
                    {post.accessibility?.topics && post.accessibility.topics.length > 0 && (
                      <div className="mb-10">
                        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Topics covered
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {post.accessibility.topics.map((topic: any, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs capitalize">
                              {topic.replace('-', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Author card */}
                    <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-6 dark:border-slate-800 dark:bg-slate-900/40">
                      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 dark:ring-slate-700">
                        {authorImage ? (
                          <Image src={authorImage} alt={authorName} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 font-semibold text-white">
                            {authorInitials}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Written by
                        </div>
                        <div className="mt-0.5 font-semibold text-slate-900 dark:text-white">{authorName}</div>
                        <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                          {authorBio ||
                            'Practical guides, tools, and research on web accessibility and WCAG compliance.'}
                        </p>
                      </div>
                    </div>

                    {/* Share */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Found this useful? Share it.
                      </span>
                      <SocialShare
                        url={currentUrl}
                        title={post.title}
                        description={post.excerpt}
                        tags={post.categories?.map((cat: any) => cat.title) || []}
                        imageUrl={post.mainImage ? urlFor(post.mainImage).url() : undefined}
                        showLabel={false}
                      />
                    </div>
                  </footer>
                </article>
              </div>
            </div>
          </div>

          {/* Related posts */}
          <section className="border-t border-slate-200 bg-slate-50/70 py-16 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="mx-auto max-w-6xl px-5 font-sans sm:px-6">
              <RelatedContent
                content={`${post.title} ${post.excerpt} ${post.categories?.map((cat: any) => cat.title).join(' ')}`}
                title="Continue reading"
                maxItems={3}
                showDescriptions={true}
              />
            </div>
          </section>
        </div>

        {/* The global site header and footer are supplied by the layout. */}

        <BackToTop />
      </div>
    )
  } catch (error) {
    console.error("Error loading blog post:", error);
    notFound();
  }
}
