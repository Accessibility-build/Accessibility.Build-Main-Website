import { requireAdmin } from '@/lib/admin-auth'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminCreditsClient } from '@/components/admin/admin-credits-client'

export const metadata = {
  title: 'Credit Management | Admin Dashboard',
  description: 'Manage credits, view statistics, and perform bulk operations',
}

export default async function AdminCreditsPage() {
  // Verify admin access
  await requireAdmin()

  return (
    <AdminLayout>
      <AdminCreditsClient />
    </AdminLayout>
  )
} 