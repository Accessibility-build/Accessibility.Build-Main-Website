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
}

/**
 * TechArticle schema for guides, with the author, publisher, dates, and image
 * all derived from shared sources: the founder entity from app/layout.tsx, the
 * modified date from lib/site-routes.ts (the same value the sitemap and the
 * visible byline use), and the site's own /api/og image generator.
 */
export function GuideArticleSchema({ route, title, description, datePublished, section = "Guide" }: GuideArticleSchemaProps) {
  const routeDate = getRouteDate(route)
  const dateModified = routeDate && routeDate > datePublished ? routeDate : datePublished
  return (
    <ArticleStructuredData
      articleType="TechArticle"
      headline={title}
      description={description}
      author={{ name: company.legalOperator, url: `${company.website}/authors/khushwant-parihar` }}
      publisher={{ name: company.brandName, logo: `${company.website}/android-chrome-512x512.png` }}
      datePublished={datePublished}
      dateModified={dateModified}
      image={`${company.website}/api/og?title=${encodeURIComponent(title)}&section=${encodeURIComponent(section)}`}
      url={`${company.website}${route}`}
    />
  )
}
