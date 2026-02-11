import { NextRequest, NextResponse } from 'next/server'
import { AdminAccessError, requireAdminApi } from '@/lib/admin-auth'
import { getRecentAdminActions } from '@/lib/admin-utils'

export async function GET(request: NextRequest) {
  try {
    await requireAdminApi()

    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? Number.parseInt(limitParam, 10) : 50

    if (!Number.isInteger(limit)) {
      return NextResponse.json(
        { error: 'Limit must be a valid integer' },
        { status: 400 }
      )
    }

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

    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json(
      { error: 'Failed to fetch audit log' },
      { status: 500 }
    )
  }
} 
