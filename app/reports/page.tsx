import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { publishedReports } from '@/lib/db/schema'
import { SITE_URL } from '@/lib/reports'
import { CopyLinkButton } from './CopyLinkButton'
import { DeleteReportButton } from './DeleteReportButton'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'My shared reports — Accessibility.build',
  robots: { index: false },
}

export default async function MyReportsPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in?redirect_url=/reports')

  const reports = await db
    .select({
      slug: publishedReports.slug,
      title: publishedReports.title,
      issues: publishedReports.issues,
      viewCount: publishedReports.viewCount,
      createdAt: publishedReports.createdAt,
    })
    .from(publishedReports)
    .where(eq(publishedReports.userId, user.id))
    .orderBy(desc(publishedReports.createdAt))

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight">My shared reports</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Reports you&apos;ve published from the desktop app. Anyone with a link can view a report;
        delete one to revoke its link immediately.
      </p>

      {reports.length === 0 ? (
        <div className="mt-10 rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
          No shared reports yet. In the desktop app&apos;s annotation editor, tag your issues and
          press <strong>Share</strong> to publish one here.
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {reports.map((r) => {
            const url = `${SITE_URL}/reports/${r.slug}`
            return (
              <li key={r.slug} className="flex items-center gap-4 rounded-xl border bg-card p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/reports/${r.slug}/image`}
                  alt=""
                  className="h-14 w-20 shrink-0 rounded border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Link href={`/reports/${r.slug}`} className="block truncate text-sm font-medium hover:underline">
                    {r.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {r.issues.length} {r.issues.length === 1 ? 'issue' : 'issues'} ·{' '}
                    {r.viewCount} {r.viewCount === 1 ? 'view' : 'views'} ·{' '}
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <CopyLinkButton url={url} className="text-xs text-muted-foreground hover:text-foreground" />
                  <DeleteReportButton slug={r.slug} />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
