import Link from "next/link";
import {
  ArrowDownToLine,
  ChevronRight,
  Database,
  ExternalLink,
  Microscope,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ReportMetric {
  label: string;
  value: string;
  icon: LucideIcon;
}

interface ReportHeroProps {
  /** Final breadcrumb crumb, rendered as plain text. */
  breadcrumbLabel: string;
  title: string;
  lede: string;
  badges: string[];
  /** The one sentence a reader should leave with. */
  headline: string;
  sourceName: string;
  sourceUrl: string;
  /** Qualifier printed under the headline, e.g. a correlation caveat. */
  sourceNote?: string;
  metrics: ReportMetric[];
  downloadLabel?: string;
}

/**
 * Shared hero for the /research report pages: breadcrumb, badges, H1, calls to
 * action, the headline finding, and the at-a-glance metric strip. Server
 * component, so pages keep their metrics in the server render for SEO.
 */
export function ReportHero({
  breadcrumbLabel,
  title,
  lede,
  badges,
  headline,
  sourceName,
  sourceUrl,
  sourceNote,
  metrics,
  downloadLabel = "Download data",
}: ReportHeroProps) {
  const columns =
    metrics.length >= 4
      ? "sm:grid-cols-4"
      : metrics.length === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2";

  return (
    <header className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <nav
          className="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-slate-500 dark:text-slate-400"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="shrink-0 hover:text-slate-900 dark:hover:text-white"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          <Link
            href="/research"
            className="shrink-0 hover:text-slate-900 dark:hover:text-white"
          >
            Research
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate font-medium text-slate-800 dark:text-slate-200">
            {breadcrumbLabel}
          </span>
        </nav>

        <div className="mt-6 flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <Badge key={badge} variant={index === 0 ? "secondary" : "outline"}>
              {badge}
            </Badge>
          ))}
        </div>

        <div className="mt-6 max-w-4xl">
          <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
            {lede}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="bg-teal-700 text-white hover:bg-teal-800">
            <a href="#download-report">
              <ArrowDownToLine aria-hidden="true" />
              {downloadLabel}
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="#methodology">
              <Microscope aria-hidden="true" />
              Methodology
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              <Database aria-hidden="true" />
              Primary dataset
              <ExternalLink aria-hidden="true" />
            </a>
          </Button>
        </div>

        <div className="mt-9 rounded-lg border border-teal-200 bg-teal-50 p-5 dark:border-teal-900 dark:bg-teal-950/35">
          <p className="text-xs font-semibold uppercase text-teal-800 dark:text-teal-300">
            Headline finding
          </p>
          <p className="mt-2 max-w-4xl text-lg font-semibold leading-7 text-slate-950 dark:text-white">
            {headline}
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Source:{" "}
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal-800 underline-offset-4 hover:underline dark:text-teal-300"
            >
              {sourceName}
            </a>
            {sourceNote ? `. ${sourceNote}` : "."}
          </p>
        </div>

        <dl
          className={`mt-8 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-700 ${columns}`}
        >
          {metrics.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white px-5 py-4 dark:bg-slate-900">
              <dt className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-1.5 font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}

/** Sticky in-page section navigation used across the report pages. */
export function ReportSectionNav({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <nav
      className="sticky top-[84px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
      aria-label="Report sections"
    >
      <div className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex min-w-max items-center gap-1 py-2">
          {links.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="inline-flex min-h-10 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
