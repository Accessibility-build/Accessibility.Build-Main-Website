import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getDashboardStats } from '@/lib/admin-utils'

export async function GET() {
  try {
    // Verify admin access
    await requireAdmin()

    // Get dashboard statistics
    const stats = await getDashboardStats()

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Admin dashboard error:', error)
    
    if (error instanceof Error && error.message.includes('redirect')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
} 