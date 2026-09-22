import Link from "next/link"
import { company } from "@/lib/company"
import { formatRouteDate, getRouteDate } from "@/lib/site-routes"
import { cn } from "@/lib/utils"

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
  /**
   * "inline" (default) is the single-line byline used in dense headers.
   * "hero" is the article byline for page heroes: reviewer line and date
   * line, placed after the lead paragraph.
   */
  variant?: "inline" | "hero"
  /** Horizontal alignment for the hero variant. Match the hero's text alignment. */
  align?: "start" | "center"
  /** Hero variant only: "inverse" for bylines sitting on a dark or saturated hero background. */
  tone?: "default" | "inverse"
}

/**
 * Visible "Updated <month> · Reviewed by <reviewer>" line for content pages.
 *
 * The date comes from lib/site-routes.ts, the same value the XML sitemap and
 * the page's schema dateModified use, so the reader, the crawler, and the
 * structured data all see one date. The reviewer defaults to the founder, but
 * collections and team-authored resources can provide an explicit override.
 */
export function PageByline({
  route,
  source,
  className = "",
  reviewer,
  variant = "inline",
  align = "start",
  tone = "default",
}: PageBylineProps) {
  const rawDate = getRouteDate(route)
  const date = formatRouteDate(rawDate)
  const reviewerName = reviewer?.name ?? company.legalOperator
  const reviewerHref = reviewer?.href ?? "/authors/khushwant-parihar"
  const reviewerCredential = reviewer?.credential ?? "CPACC"

  if (variant === "hero") {
    const inverse = tone === "inverse"
    const mutedText = inverse ? "text-white/85" : "text-slate-600 dark:text-slate-400"
    const strongLink = inverse
      ? "font-semibold text-white underline decoration-white/50 underline-offset-2 hover:decoration-white"
      : "font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-900 dark:text-white dark:decoration-slate-600 dark:hover:decoration-white"
    const plainLink = inverse
      ? "underline decoration-white/50 underline-offset-2 hover:decoration-white"
      : "underline decoration-slate-300 underline-offset-2 hover:decoration-slate-900 dark:decoration-slate-600 dark:hover:decoration-white"

    return (
      <div
        className={cn(
          "mt-8 flex text-sm",
          align === "center" ? "justify-center" : "justify-start",
          className
        )}
      >
        <div className={cn("leading-snug", align === "center" ? "text-center" : "text-left")}>
          <p className={mutedText}>
            Reviewed by{" "}
            {reviewerHref ? (
              <Link href={reviewerHref} className={strongLink}>
                {reviewerName}
              </Link>
            ) : (
              <span className={cn("font-semibold", inverse ? "text-white" : "text-slate-900 dark:text-white")}>
                {reviewerName}
              </span>
            )}
            {reviewerCredential ? `, ${reviewerCredential}` : null}
          </p>
          {date || source ? (
            <p className={cn("mt-0.5 flex flex-wrap items-center gap-x-2", align === "center" && "justify-center", mutedText)}>
              {date ? (
                <span>
                  Updated <time dateTime={rawDate ?? undefined}>{date}</time>
                </span>
              ) : null}
              {date && source ? <span aria-hidden="true">·</span> : null}
              {source ? (
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={plainLink}
                >
                  {source.label}
                </a>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>
    )
  }

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
