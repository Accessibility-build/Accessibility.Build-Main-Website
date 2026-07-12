import { requireAdmin } from '@/lib/admin-auth'
import { AdminLayout } from '@/components/admin/admin-layout'
import { ErrorReportClient } from '@/components/admin/error-report-client'

export const metadata = {
  title: 'Runtime Diagnostics | Admin Dashboard',
  description: 'Inspect the current browser session error buffer',
  robots: { index: false, follow: false },
}

export default async function ErrorReportPage() {
  // Verify admin access
  await requireAdmin('/admin/error-report')

  return (
    <AdminLayout>
      <ErrorReportClient />
    </AdminLayout>
  )
}
