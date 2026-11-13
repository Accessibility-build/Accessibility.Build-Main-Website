import { requireAdmin } from "@/lib/admin-auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminCoursesClient } from "@/components/admin/admin-courses-client"

export const metadata = {
  title: "Course licences | Admin Dashboard",
  robots: { index: false, follow: false },
}

export default async function AdminCoursesPage() {
  await requireAdmin("/admin/courses")
  return (
    <AdminLayout>
      <AdminCoursesClient />
    </AdminLayout>
  )
}
