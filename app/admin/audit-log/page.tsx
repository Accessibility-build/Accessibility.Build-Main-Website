import { requireAdmin } from '@/lib/admin-auth'
import { getRecentAdminActions } from '@/lib/admin-utils'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminAuditLogClient } from '@/components/admin/admin-audit-log-client'

export const metadata = {
  title: 'Audit Log | Admin Dashboard',
  description: 'Track all admin actions and changes',
}

export default async function AdminAuditLogPage() {
  // Verify admin access
  await requireAdmin()

  // Get recent admin actions
  const auditLog = await getRecentAdminActions(200)

  return (
    <AdminLayout>
      <AdminAuditLogClient initialActions={auditLog} />
    </AdminLayout>
  )
} 