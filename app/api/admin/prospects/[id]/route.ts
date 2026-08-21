import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { AdminAccessError, requireAdminApi } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { PROSPECT_STATUSES, prospects, type ProspectStatus } from '@/lib/db/schema'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const MAX_NOTES_LENGTH = 5000

function isProspectStatus(value: unknown): value is ProspectStatus {
  return typeof value === 'string' && (PROSPECT_STATUSES as readonly string[]).includes(value)
}

/**
 * Update the two fields the operator owns: pipeline status and personal notes.
 * Research fields are owned by scripts/seed-prospects.mjs and are not editable
 * here, so a re-seed and a manual edit can never fight each other.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminApi()

    const { id } = await params

    if (!UUID_PATTERN.test(id)) {
      return NextResponse.json({ error: 'Invalid prospect id' }, { status: 400 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Request body must be JSON' }, { status: 400 })
    }

    const { status, notes } = (body ?? {}) as { status?: unknown; notes?: unknown }
    const updates: { status?: ProspectStatus; notes?: string | null; updatedAt: Date } = {
      updatedAt: new Date(),
    }

    if (status !== undefined) {
      if (!isProspectStatus(status)) {
        return NextResponse.json(
          { error: `status must be one of: ${PROSPECT_STATUSES.join(', ')}` },
          { status: 400 },
        )
      }
      updates.status = status
    }

    if (notes !== undefined) {
      if (notes !== null && typeof notes !== 'string') {
        return NextResponse.json({ error: 'notes must be a string or null' }, { status: 400 })
      }
      const trimmed = typeof notes === 'string' ? notes.trim() : ''
      if (trimmed.length > MAX_NOTES_LENGTH) {
        return NextResponse.json(
          { error: `notes must be ${MAX_NOTES_LENGTH} characters or fewer` },
          { status: 400 },
        )
      }
      updates.notes = trimmed.length > 0 ? trimmed : null
    }

    if (updates.status === undefined && updates.notes === undefined) {
      return NextResponse.json({ error: 'Nothing to update: send status or notes' }, { status: 400 })
    }

    const [updated] = await db
      .update(prospects)
      .set(updates)
      .where(eq(prospects.id, id))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, prospect: updated })
  } catch (error) {
    console.error('Admin prospect update error:', error)

    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json({ error: 'Failed to update prospect' }, { status: 500 })
  }
}
