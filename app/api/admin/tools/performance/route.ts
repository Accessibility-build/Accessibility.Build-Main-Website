import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getToolPerformanceMetrics } from '@/lib/admin-utils'

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin()

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 30

    // Validate days parameter
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
    
    if (error instanceof Error && error.message.includes('redirect')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch tool performance metrics' },
      { status: 500 }
    )
  }
} 