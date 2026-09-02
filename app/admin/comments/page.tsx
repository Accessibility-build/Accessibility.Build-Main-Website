import { desc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { caseComments, type CaseComment } from '@/lib/db/schema'
import { caseStudies } from '@/lib/case-studies'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminCommentsClient } from '@/components/admin/admin-comments-client'
import type { CaseCommentRecord, CaseOption } from '@/components/admin/admin-comments-client'

export const metadata = {
  title: 'Comments | Admin Dashboard',
  description: 'Moderation queue for reader comments left on the case studies',
  robots: { index: false, follow: false },
}

// Dates cross the server/client boundary as ISO strings so the client component
// formats them itself and nothing depends on a serialised Date.
function toIso(value: Date | null): string | null {
  return value ? value.toISOString() : null
}

function serializeComment(row: CaseComment): CaseCommentRecord {
  return {
    id: row.id,
    caseSlug: row.caseSlug,
    authorName: row.authorName,
    body: row.body,
    status: row.status,
    moderatedAt: toIso(row.moderatedAt),
    moderatedBy: row.moderatedBy,
    moderationNote: row.moderationNote,
    createdAt: toIso(row.createdAt),
  }
}

export default async function AdminCommentsPage() {
  await requireAdmin('/admin/comments')

  let rows: CaseCommentRecord[] = []
  let loadError: string | null = null

  try {
    const records = await db
      .select()
      .from(caseComments)
      .orderBy(desc(caseComments.createdAt))

    rows = records.map(serializeComment)
  } catch (error) {
    console.error('Admin comments page error:', error)
    loadError = 'The database could not be reached. Check DATABASE_URL and that drizzle/0014_case_comments.sql has been applied.'
  }

  const caseOptions: CaseOption[] = caseStudies.map((study) => ({
    slug: study.slug,
    title: study.title,
  }))

  return (
    <AdminLayout>
      <AdminCommentsClient comments={rows} caseOptions={caseOptions} loadError={loadError} />
    </AdminLayout>
  )
}
