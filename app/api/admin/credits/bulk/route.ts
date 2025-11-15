import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { bulkAssignCredits } from '@/lib/admin-utils'

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await requireAdmin()
    
    // Parse request body
    const { userIds, amount, reason } = await request.json()
    
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'userIds must be a non-empty array' },
        { status: 400 }
      )
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      )
    }

    if (!reason || typeof reason !== 'string') {
      return NextResponse.json(
        { error: 'Reason is required' },
        { status: 400 }
      )
    }

    // Limit bulk operations to prevent abuse
    if (userIds.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 users can be processed at once' },
        { status: 400 }
      )
    }

    // Bulk assign credits
    const result = await bulkAssignCredits(userIds, amount, admin.id, reason)

    return NextResponse.json({ 
      success: true, 
      message: `Credits assigned to ${result.success} users successfully`,
      result: {
        totalUsers: userIds.length,
        successful: result.success,
        failed: result.failed,
        amount,
        reason
      }
    })

  } catch (error) {
    console.error('Admin bulk credit assignment error:', error)
    
    if (error instanceof Error && error.message.includes('redirect')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to assign bulk credits' },
      { status: 500 }
    )
  }
} 