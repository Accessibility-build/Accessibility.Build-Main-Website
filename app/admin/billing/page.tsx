import { requireAdmin } from '@/lib/admin-auth'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminBillingFunnelClient } from '@/components/admin/admin-billing-funnel-client'
import { AdminBillingOperationsClient } from '@/components/admin/admin-billing-operations-client'
import { AdminPageHeader } from '@/components/admin/admin-page-header'

export const metadata = {
  title: 'Billing Funnel | Admin Dashboard',
  description: 'Razorpay checkout and billing center funnel telemetry',
  robots: { index: false, follow: false },
}

export default async function AdminBillingPage() {
  await requireAdmin('/admin/billing')

  return (
    <AdminLayout>
      <div className="space-y-8">
        <AdminPageHeader
          eyebrow="People and revenue"
          title="Billing"
          description="Review open orders, create or recover payment links, resolve exceptions, and inspect checkout and webhook telemetry."
        />
        <AdminBillingOperationsClient />
        <AdminBillingFunnelClient />
      </div>
    </AdminLayout>
  )
}
