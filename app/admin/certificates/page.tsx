import { requireAdmin } from "@/lib/admin-auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminCertificatesClient } from "@/components/admin/admin-certificates-client"

export const metadata = {
  title: "Certificates | Admin Dashboard",
  robots: { index: false, follow: false },
}

export default async function AdminCertificatesPage() {
  await requireAdmin("/admin/certificates")
  return (
    <AdminLayout>
      <AdminCertificatesClient />
    </AdminLayout>
  )
}
