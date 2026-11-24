import Link from "next/link"
import type { ReactNode } from "react"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { PageByline } from "@/components/seo/page-byline"
import { FaqSection, type FaqItem } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { Badge } from "@/components/ui/badge"
import { createMetadata } from "@/lib/metadata"
import { getRouteDate } from "@/lib/site-routes"

/**
 * Shared frame for long-form guides: breadcrumb (visible + schema), hero with byline,
 * an "on this page" list, a prose body, a FAQ rendered and emitted as schema from one
 * array, and related links. Each guide supplies only its content.
 */

export interface GuideSection {
  id: string
  title: string
}

export function guideMetadata(opts: {
  route: string
  title: string
  description: string
  keywords: string[]
  datePublished: string
}) {
  return createMetadata({
    title: opts.title,
    description: opts.description,
    path: opts.route,
    keywords: opts.keywords,
    type: "article",
    publishedTime: opts.datePublished,
    modifiedTime: getRouteDate(opts.route) ?? opts.datePublished,
  })
}

interface GuideShellProps {
  route: string
  /** Short label for the breadcrumb trail. */
  crumb: string
  /** Section of the site the guide belongs to. Defaults to Guides. */
  parent?: { name: string; href: string }
  badge: string
  title: string
  h1: string
  intro: ReactNode
  description: string
  datePublished: string
  sections: GuideSection[]
  faqs: FaqItem[]
  relatedContent: string
  children: ReactNode
}

export function GuideShell({
  route,
  crumb,
  parent = { name: "Guides", href: "/guides" },
  badge,
  title,
  h1,
  intro,
  description,
  datePublished,
  sections,
  faqs,
  relatedContent,
  children,
}: GuideShellProps) {
  const base = "https://accessibility.build"
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: base },
          { name: parent.name, url: `${base}${parent.href}` },
          { name: crumb, url: `${base}${route}` },
        ]}
      />
      <GuideArticleSchema route={route} title={title} description={description} datePublished={datePublished} />

      <div className="min-h-screen bg-white pt-12 dark:bg-slate-950">
        <div className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <Link href="/" className="underline-offset-4 hover:text-blue-700 hover:underline dark:hover:text-blue-300">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={parent.href} className="underline-offset-4 hover:text-blue-700 hover:underline dark:hover:text-blue-300">
                    {parent.name}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <span aria-current="page" className="font-medium text-slate-900 dark:text-white">
                    {crumb}
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article>
          <header className="px-4 pb-8 pt-12 sm:px-6">
            <div className="mx-auto max-w-3xl">
              <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm">
                {badge}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                {h1}
              </h1>
              <div className="mt-5 text-lg leading-relaxed text-slate-700 dark:text-slate-300 [&_a]:font-medium [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-4 dark:[&_a]:text-blue-300">
                {intro}
              </div>
              <PageByline route={route} variant="hero" />
            </div>
          </header>

          {sections.length > 0 ? (
            <nav aria-labelledby="on-this-page" className="px-4 sm:px-6">
              <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 p-5 dark:border-slate-700">
                <h2 id="on-this-page" className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  On this page
                </h2>
                <ol className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="text-blue-700 underline underline-offset-4 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>
          ) : null}

          <div className="px-4 py-10 sm:px-6">
            <div className="prose prose-slate mx-auto max-w-3xl dark:prose-invert prose-headings:scroll-mt-28 prose-a:text-blue-700 prose-a:underline-offset-4 dark:prose-a:text-blue-300 prose-table:text-sm prose-th:text-left">
              {children}
            </div>
          </div>

          <div className="px-4 pb-10 sm:px-6">
            <div className="mx-auto max-w-3xl">
              <FaqSection faqs={faqs} />
            </div>
          </div>
        </article>

        <div className="px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <RelatedContent content={relatedContent} title="Related guides and tools" maxItems={6} />
          </div>
        </div>
      </div>
    </>
  )
}

/** A table that scrolls on its own at narrow widths instead of widening the page. */
export function GuideTable({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div role="region" aria-label={caption} tabIndex={0} className="not-prose my-6 overflow-x-auto rounded-lg border border-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm text-slate-700 dark:text-slate-300 [&_td]:border-t [&_td]:border-slate-200 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top dark:[&_td]:border-slate-700 [&_th]:bg-slate-50 [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold [&_th]:text-slate-900 dark:[&_th]:bg-slate-900 dark:[&_th]:text-white">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  )
}

/** Fenced code block that keeps prose styling out of the way. */
export function GuideCode({ children, label }: { children: string; label: string }) {
  return (
    <pre aria-label={label} tabIndex={0} className="not-prose my-5 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm leading-relaxed text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400">
      <code>{children}</code>
    </pre>
  )
}
