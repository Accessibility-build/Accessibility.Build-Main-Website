import UnlimitedAccessClient from './client-page'
import { requireAdmin } from '@/lib/admin-auth'

export default async function UnlimitedAccessPage() {
  await requireAdmin()
  return <UnlimitedAccessClient />
}
