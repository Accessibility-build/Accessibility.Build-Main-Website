import { NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'
import { AdminAccessError, requireAdminApi } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { prospects } from '@/lib/db/schema'

// Read-only listing for the prospects admin screen. This feature displays and
// copies outreach text; it never sends anything.
export async function GET() {
  try {
    await requireAdminApi()

    const rows = await db
      .select()
      .from(prospects)
      .orderBy(desc(prospects.score), desc(prospects.createdAt))

    return NextResponse.json({ prospects: rows, total: rows.length })
  } catch (error) {
    console.error('Admin prospects list error:', error)

    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json({ error: 'Failed to fetch prospects' }, { status: 500 })
  }
}
