import { requireAdmin } from '@/lib/admin-auth'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminBillingFunnelClient } from '@/components/admin/admin-billing-funnel-client'
import { AdminBillingOperationsClient } from '@/components/admin/admin-billing-operations-client'

export const metadata = {
  title: 'Billing Funnel | Admin Dashboard',
  description: 'Razorpay checkout and billing center funnel telemetry',
}

export default async function AdminBillingPage() {
  await requireAdmin()

  return (
    <AdminLayout>
      <div className="space-y-8">
        <AdminBillingOperationsClient />
        <AdminBillingFunnelClient />
      </div>
    </AdminLayout>
  )
}
