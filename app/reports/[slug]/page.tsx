import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { publishedReports, type ReportIssue } from '@/lib/db/schema'
import { SITE_URL } from '@/lib/reports'
import { CopyLinkButton } from '../CopyLinkButton'

export const dynamic = 'force-dynamic'

async function getReport(slug: string) {
  const [row] = await db
    .select({
      title: publishedReports.title,
      description: publishedReports.description,
      issues: publishedReports.issues,
      createdAt: publishedReports.createdAt,
    })
    .from(publishedReports)
    .where(eq(publishedReports.slug, slug))
    .limit(1)
  return row ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const report = await getReport(slug)
  if (!report) return { title: 'Report not found — Accessibility.build' }

  const image = `${SITE_URL}/api/reports/${slug}/image`
  const count = report.issues.length
  const description =
    report.description ||
    `${count} accessibility ${count === 1 ? 'issue' : 'issues'} found — shared from the Accessibility.build desktop app.`
  return {
    title: `${report.title} — Accessibility.build`,
    description,
    // User-uploaded screenshots — don't index, but allow rich link previews.
    robots: { index: false, follow: false },
    openGraph: {
      title: report.title,
      description,
      images: [{ url: image, width: 1400, alt: report.title }],
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title: report.title, description, images: [image] },
  }
}

const SEVERITY_COLOR: Record<string, string> = {
  blocker: '#DC2626',
  major: '#F59E0B',
  minor: '#64748B',
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const report = await getReport(slug)
  if (!report) notFound()

  // best-effort view counter
  await db
    .update(publishedReports)
    .set({ viewCount: sql`${publishedReports.viewCount} + 1` })
    .where(eq(publishedReports.slug, slug))
    .catch(() => {})

  const issues = report.issues as ReportIssue[]
  const sevCount = (sev: string) => issues.filter((i) => i.severity === sev).length
  const summary = [
    { sev: 'blocker', n: sevCount('blocker'), color: '#DC2626' },
    { sev: 'major', n: sevCount('major'), color: '#F59E0B' },
    { sev: 'minor', n: sevCount('minor'), color: '#64748B' },
  ].filter((s) => s.n > 0)

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{report.title}</h1>
          {report.description && (
            <p className="mt-1 max-w-xl text-sm text-foreground/80">{report.description}</p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            {issues.length} {issues.length === 1 ? 'issue' : 'issues'} ·{' '}
            {new Date(report.createdAt).toLocaleDateString()} · shared from the{' '}
            <Link href="/desktop" className="font-medium text-primary hover:underline">
              Accessibility.build app
            </Link>
          </p>
          {summary.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {summary.map((s) => (
                <span
                  key={s.sev}
                  className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: s.color }}
                >
                  {s.n} {s.sev}
                </span>
              ))}
            </div>
          )}
        </div>
        <CopyLinkButton url={`${SITE_URL}/reports/${slug}`} />
      </header>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/reports/${slug}/image`}
        alt={report.title}
        className="w-full rounded-xl border shadow-sm"
      />

      {issues.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Findings
          </h2>
          <ol className="space-y-3">
            {issues.map((issue) => (
              <li key={issue.n} className="flex gap-3 rounded-lg border bg-card p-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: SEVERITY_COLOR[issue.severity] ?? SEVERITY_COLOR.major }}
                >
                  {issue.n}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {issue.sc ? `WCAG ${issue.sc} · ` : ''}
                    {issue.label}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {issue.severity}
                    </span>
                  </p>
                  {issue.note && <p className="mt-0.5 text-sm text-muted-foreground">{issue.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mt-12 rounded-xl border bg-card p-6 text-center">
        <h2 className="text-lg font-semibold">Run your own accessibility checks</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick colors, capture and annotate issues, and simulate color blindness — free on macOS.
        </p>
        <Link
          href="/desktop"
          className="mt-4 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Get the desktop app
        </Link>
      </section>
    </main>
  )
}
