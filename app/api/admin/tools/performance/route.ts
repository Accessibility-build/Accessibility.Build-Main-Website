import { NextRequest, NextResponse } from 'next/server'
import { AdminAccessError, requireAdminApi } from '@/lib/admin-auth'
import { getToolPerformanceMetrics } from '@/lib/admin-utils'

export async function GET(request: NextRequest) {
  try {
    await requireAdminApi()

    const { searchParams } = new URL(request.url)
    const daysParam = searchParams.get('days')
    const days = daysParam ? Number.parseInt(daysParam, 10) : 30

    if (!Number.isInteger(days)) {
      return NextResponse.json(
        { error: 'Days must be a valid integer' },
        { status: 400 }
      )
    }

    if (days < 1 || days > 365) {
      return NextResponse.json(
        { error: 'Days must be between 1 and 365' },
        { status: 400 }
      )
    }

    // Get tool performance metrics
    const metrics = await getToolPerformanceMetrics(days)

    return NextResponse.json({
      metrics,
      period: {
        days,
        from: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
        to: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Admin tool performance error:', error)

    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json(
      { error: 'Failed to fetch tool performance metrics' },
      { status: 500 }
    )
  }
} 
