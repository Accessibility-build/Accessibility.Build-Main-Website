import Link from "next/link"
import { company } from "@/lib/company"
import { formatRouteDate, getRouteDate } from "@/lib/site-routes"

interface PageBylineProps {
  /** Route path, e.g. "/guides/accessible-forms". Drives the Updated date. */
  route: string
  /** Optional link to the primary source this page explains (e.g. the W3C Understanding document). */
  source?: { label: string; href: string }
  /** Extra classes for the wrapping paragraph. */
  className?: string
  /** Override the default founder reviewer for team-authored collections. */
  reviewer?: {
    name: string
    href?: string
    credential?: string
  }
}

/**
 * Visible "Updated <month> · Reviewed by <reviewer>" line for content pages.
 *
 * The date comes from lib/site-routes.ts, the same value the XML sitemap and
 * the page's schema dateModified use, so the reader, the crawler, and the
 * structured data all see one date. The reviewer defaults to the founder, but
 * collections and team-authored resources can provide an explicit override.
 */
export function PageByline({ route, source, className = "", reviewer }: PageBylineProps) {
  const date = formatRouteDate(getRouteDate(route))
  const reviewerName = reviewer?.name ?? company.legalOperator
  const reviewerHref = reviewer?.href ?? "/authors/khushwant-parihar"
  const reviewerCredential = reviewer?.credential ?? "CPACC"

  return (
    <p
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600 dark:text-slate-400 ${className}`}
    >
      {date ? <span>Updated {date}</span> : null}
      {date ? <span aria-hidden="true">·</span> : null}
      <span>
        Reviewed by{" "}
        {reviewerHref ? (
          <Link
            href={reviewerHref}
            className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-900 dark:text-white dark:decoration-slate-600 dark:hover:decoration-white"
          >
            {reviewerName}
          </Link>
        ) : (
          <span className="font-medium text-slate-900 dark:text-white">{reviewerName}</span>
        )}
        {reviewerCredential ? `, ${reviewerCredential}` : null}
      </span>
      {source ? (
        <>
          <span aria-hidden="true">·</span>
          <a
            href={source.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-slate-300 underline-offset-2 hover:decoration-slate-900 dark:decoration-slate-600 dark:hover:decoration-white"
          >
            {source.label}
          </a>
        </>
      ) : null}
    </p>
  )
}
