import { NextRequest, NextResponse } from 'next/server'
import { AdminAccessError, requireAdminApi } from '@/lib/admin-auth'
import { getAllUsers } from '@/lib/admin-utils'

export async function GET(request: NextRequest) {
  try {
    await requireAdminApi()

    const { searchParams } = new URL(request.url)
    const parseOptionalInt = (value: string | null, label: string) => {
      if (value === null) return undefined
      const parsed = Number.parseInt(value, 10)
      if (!Number.isInteger(parsed)) {
        throw new Error(`${label} must be a valid integer`)
      }
      return parsed
    }

    const minCredits = parseOptionalInt(searchParams.get('minCredits'), 'minCredits')
    const maxCredits = parseOptionalInt(searchParams.get('maxCredits'), 'maxCredits')
    const limit = parseOptionalInt(searchParams.get('limit'), 'limit') ?? 50
    const offset = parseOptionalInt(searchParams.get('offset'), 'offset') ?? 0
    const sortByParam = searchParams.get('sortBy')
    const sortOrderParam = searchParams.get('sortOrder')
    const sortBy = sortByParam && ['name', 'email', 'credits', 'created', 'lastLogin'].includes(sortByParam)
      ? sortByParam as 'name' | 'email' | 'credits' | 'created' | 'lastLogin'
      : 'created'
    const sortOrder: 'asc' | 'desc' = sortOrderParam === 'asc' ? 'asc' : 'desc'

    if (limit < 1 || limit > 200) {
      return NextResponse.json({ error: 'limit must be between 1 and 200' }, { status: 400 })
    }

    if (offset < 0) {
      return NextResponse.json({ error: 'offset must be 0 or greater' }, { status: 400 })
    }

    if (minCredits !== undefined && minCredits < 0) {
      return NextResponse.json({ error: 'minCredits must be 0 or greater' }, { status: 400 })
    }

    if (maxCredits !== undefined && maxCredits < 0) {
      return NextResponse.json({ error: 'maxCredits must be 0 or greater' }, { status: 400 })
    }

    const filters = {
      search: searchParams.get('search') || undefined,
      isActive: searchParams.get('isActive') === 'true' ? true : 
                searchParams.get('isActive') === 'false' ? false : undefined,
      minCredits,
      maxCredits,
      sortBy,
      sortOrder,
      limit,
      offset
    }

    const result = await getAllUsers(filters)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Admin users error:', error)

    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    if (error instanceof Error && error.message.includes('must be a valid integer')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
} 
