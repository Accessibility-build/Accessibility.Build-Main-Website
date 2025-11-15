import { requireAdmin } from '@/lib/admin-auth'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminUsersClient } from '@/components/admin/admin-users-client'

export const metadata = {
  title: 'User Management | Admin Dashboard',
  description: 'Manage users, view their activity, and assign credits',
}

export default async function AdminUsersPage() {
  // Verify admin access
  await requireAdmin()

  return (
    <AdminLayout>
      <AdminUsersClient />
    </AdminLayout>
  )
} 