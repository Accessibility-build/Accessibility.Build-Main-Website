import { requireAdmin } from '@/lib/admin-auth'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminMarketingClient } from '@/components/admin/admin-marketing-client'
import { AdminPageHeader } from '@/components/admin/admin-page-header'

export const metadata = {
  title: 'Marketing Email | Admin Dashboard',
  description: 'Send marketing campaigns to active users and newsletter subscribers',
  robots: { index: false, follow: false },
}

export default async function AdminMarketingPage() {
  await requireAdmin('/admin/marketing')

  return (
    <AdminLayout>
      <div className="space-y-8">
        <AdminPageHeader
          eyebrow="Communications"
          title="Marketing"
          description="Review the exact audience, prepare campaign content, send a test, and require typed confirmation before a live send."
        />
        <AdminMarketingClient />
      </div>
    </AdminLayout>
  )
}
