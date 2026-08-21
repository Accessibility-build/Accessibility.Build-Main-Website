import { desc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { prospects } from '@/lib/db/schema'
import { serializeProspect } from '@/lib/prospects'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminProspectsClient } from '@/components/admin/admin-prospects-client'
import type { ProspectRecord } from '@/components/admin/prospect-ui'

export const metadata = {
  title: 'Prospects | Admin Dashboard',
  description: 'Researched outreach leads with a verified accessibility finding and a written email',
  robots: { index: false, follow: false },
}

export default async function AdminProspectsPage() {
  await requireAdmin('/admin/prospects')

  let rows: ProspectRecord[] = []
  let loadError: string | null = null

  try {
    const records = await db
      .select()
      .from(prospects)
      .orderBy(desc(prospects.score), desc(prospects.createdAt))

    rows = records.map(serializeProspect)
  } catch (error) {
    console.error('Admin prospects page error:', error)
    loadError = 'The database could not be reached. Check DATABASE_URL and that drizzle/0012_prospects.sql has been applied.'
  }

  return (
    <AdminLayout>
      <AdminProspectsClient prospects={rows} loadError={loadError} />
    </AdminLayout>
  )
}
