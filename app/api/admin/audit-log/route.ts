import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getRecentAdminActions } from '@/lib/admin-utils'

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin()

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50

    // Validate limit parameter
    if (limit < 1 || limit > 200) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 200' },
        { status: 400 }
      )
    }

    // Get recent admin actions
    const actions = await getRecentAdminActions(limit)

    return NextResponse.json({
      actions,
      total: actions.length,
      limit
    })

  } catch (error) {
    console.error('Admin audit log error:', error)
    
    if (error instanceof Error && error.message.includes('redirect')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch audit log' },
      { status: 500 }
    )
  }
} 