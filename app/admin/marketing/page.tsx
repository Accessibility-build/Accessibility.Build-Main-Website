import { requireAdmin } from '@/lib/admin-auth'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminMarketingClient } from '@/components/admin/admin-marketing-client'

export const metadata = {
  title: 'Marketing Email | Admin Dashboard',
  description: 'Send marketing campaigns to active users and newsletter subscribers',
}

export default async function AdminMarketingPage() {
  await requireAdmin()

  return (
    <AdminLayout>
      <AdminMarketingClient />
    </AdminLayout>
  )
}
