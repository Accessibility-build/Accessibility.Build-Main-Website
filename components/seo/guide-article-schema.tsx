import { ArticleStructuredData } from "@/components/seo/structured-data"
import { company } from "@/lib/company"
import { getRouteDate } from "@/lib/site-routes"

interface GuideArticleSchemaProps {
  /** Route path, e.g. "/guides/accessible-forms". */
  route: string
  title: string
  description: string
  /** First publication date, YYYY-MM-DD. Taken from the page's first commit. */
  datePublished: string
  /** Badge label used on the generated social image. */
  section?: string
  /** Defaults to the founder; use an Organization for team-authored material. */
  author?: {
    name: string
    url?: string
    type?: "Person" | "Organization"
  }
}

/**
 * TechArticle schema for guides and long-form resources. The author defaults
 * to the founder entity from app/layout.tsx and can be overridden with an
 * Organization for team-authored work. Dates come from lib/site-routes.ts (the
 * same source used by the sitemap and visible byline), and the image comes from
 * the site's own /api/og generator.
 */
export function GuideArticleSchema({
  route,
  title,
  description,
  datePublished,
  section = "Guide",
  author,
}: GuideArticleSchemaProps) {
  const routeDate = getRouteDate(route)
  const dateModified = routeDate && routeDate > datePublished ? routeDate : datePublished
  const articleAuthor = author ?? {
    name: company.legalOperator,
    url: `${company.website}/authors/khushwant-parihar`,
    type: "Person" as const,
  }

  return (
    <ArticleStructuredData
      articleType="TechArticle"
      headline={title}
      description={description}
      author={{ name: articleAuthor.name, url: articleAuthor.url }}
      authorType={articleAuthor.type}
      publisher={{ name: company.brandName, logo: `${company.website}/android-chrome-512x512.png` }}
      datePublished={datePublished}
      dateModified={dateModified}
      image={`${company.website}/api/og?title=${encodeURIComponent(title)}&section=${encodeURIComponent(section)}`}
      url={`${company.website}${route}`}
    />
  )
}
