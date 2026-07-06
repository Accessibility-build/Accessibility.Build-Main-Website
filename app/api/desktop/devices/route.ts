import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { db } from '@/lib/db'
import { desktopDevices } from '@/lib/db/schema'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** List the signed-in user's active desktop connections. */
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const devices = await db
    .select({
      id: desktopDevices.id,
      deviceName: desktopDevices.deviceName,
      createdAt: desktopDevices.createdAt,
      lastSeenAt: desktopDevices.lastSeenAt,
    })
    .from(desktopDevices)
    .where(and(eq(desktopDevices.userId, userId), isNull(desktopDevices.revokedAt)))
    .orderBy(desc(desktopDevices.createdAt))

  return NextResponse.json({ devices })
}

/** Revoke a device (soft delete) — instant kill switch for a lost machine. */
export async function DELETE(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { id } = await req.json().catch(() => ({ id: null }))
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'missing device id' }, { status: 400 })
  }

  await db
    .update(desktopDevices)
    .set({ revokedAt: new Date() })
    .where(and(eq(desktopDevices.id, id), eq(desktopDevices.userId, userId)))

  return NextResponse.json({ ok: true })
}
