import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { prospects } from '@/lib/db/schema'
import { serializeProspect } from '@/lib/prospects'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminProspectDetailClient } from '@/components/admin/admin-prospect-detail-client'
import { isEmailServiceEnabled, getEmailFromAddress } from '@/lib/email/resend'

function readEmailConfig(replyTo: string | null) {
  const configured = isEmailServiceEnabled()
  let fromAddress: string | null = null
  try {
    fromAddress = getEmailFromAddress()
  } catch {
    fromAddress = null
  }
  return { configured, fromAddress, replyTo }
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const metadata = {
  title: 'Prospect | Admin Dashboard',
  description: 'Read the verified finding, then send or copy the outreach email',
  robots: { index: false, follow: false },
}

export default async function AdminProspectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const admin = await requireAdmin('/admin/prospects')
  const replyTo = admin?.emailAddresses?.[0]?.emailAddress ?? null

  const { id } = await params

  if (!UUID_PATTERN.test(id)) {
    notFound()
  }

  const [record] = await db.select().from(prospects).where(eq(prospects.id, id)).limit(1)

  if (!record) {
    notFound()
  }

  return (
    <AdminLayout>
      <AdminProspectDetailClient
        prospect={serializeProspect(record)}
        emailConfig={readEmailConfig(replyTo)}
      />
    </AdminLayout>
  )
}
