import { NextResponse } from 'next/server'
import { AdminAccessError, requireAdminApi } from '@/lib/admin-auth'
import { getDashboardStats } from '@/lib/admin-utils'

export async function GET() {
  try {
    await requireAdminApi()

    // Get dashboard statistics
    const stats = await getDashboardStats()

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Admin dashboard error:', error)

    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
} 
