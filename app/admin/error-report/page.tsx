import { requireAdmin } from '@/lib/admin-auth'
import { AdminLayout } from '@/components/admin/admin-layout'
import { ErrorReportClient } from '@/components/admin/error-report-client'

export const metadata = {
  title: 'Error Report | Admin Dashboard',
  description: 'Comprehensive analysis of application errors and issues',
}

export default async function ErrorReportPage() {
  // Verify admin access
  await requireAdmin()

  return (
    <AdminLayout>
      <ErrorReportClient />
    </AdminLayout>
  )
}
