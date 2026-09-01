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
}

/**
 * Visible "Updated <month> · Reviewed by <founder>" line for content pages.
 *
 * The date comes from lib/site-routes.ts, the same value the XML sitemap and
 * the page's schema dateModified use, so the reader, the crawler, and the
 * structured data all see one date. A named reviewer near the H1 is what
 * quality raters and answer engines look for when judging who stands behind
 * a page; previously the founder's name appeared only in the footer.
 */
export function PageByline({ route, source, className = "" }: PageBylineProps) {
  const date = formatRouteDate(getRouteDate(route))
  return (
    <p
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600 dark:text-slate-400 ${className}`}
    >
      {date ? <span>Updated {date}</span> : null}
      {date ? <span aria-hidden="true">·</span> : null}
      <span>
        Reviewed by{" "}
        <Link
          href="/authors/khushwant-parihar"
          className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-900 dark:text-white dark:decoration-slate-600 dark:hover:decoration-white"
        >
          {company.legalOperator}
        </Link>
        , CPACC
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
