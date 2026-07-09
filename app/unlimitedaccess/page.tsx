import type { Metadata } from 'next'
import UnlimitedAccessClient from './client-page'
import { requireAdmin } from '@/lib/admin-auth'

export const metadata: Metadata = {
  title: 'Unlimited Access',
  robots: { index: false, follow: false },
}

export default async function UnlimitedAccessPage() {
  await requireAdmin()
  return <UnlimitedAccessClient />
}
