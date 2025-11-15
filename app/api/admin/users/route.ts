import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getAllUsers } from '@/lib/admin-utils'

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin()

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    
    const filters = {
      search: searchParams.get('search') || undefined,
      isActive: searchParams.get('isActive') === 'true' ? true : 
                searchParams.get('isActive') === 'false' ? false : undefined,
      minCredits: searchParams.get('minCredits') ? parseInt(searchParams.get('minCredits')!) : undefined,
      maxCredits: searchParams.get('maxCredits') ? parseInt(searchParams.get('maxCredits')!) : undefined,
      sortBy: (searchParams.get('sortBy') as 'name' | 'email' | 'credits' | 'created') || 'created',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    }

    // Get users with filtering
    const result = await getAllUsers(filters)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Admin users error:', error)
    
    if (error instanceof Error && error.message.includes('redirect')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
} 