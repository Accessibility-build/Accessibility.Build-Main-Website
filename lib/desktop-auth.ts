import { createHash, randomBytes } from 'crypto'
import { and, eq, isNull } from 'drizzle-orm'
import { db } from '@/lib/db'
import { desktopDevices } from '@/lib/db/schema'

/** 256-bit opaque device token. Shown to the app once, then only its hash is kept. */
export function generateDeviceToken(): string {
  return randomBytes(32).toString('hex')
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export interface DeviceContext {
  userId: string
  deviceId: string
}

/**
 * Resolve an `Authorization: Bearer <token>` header to the owning user.
 * Returns null for missing/invalid/revoked tokens. Touches last_seen_at.
 */
export async function verifyDeviceToken(authHeader: string | null): Promise<DeviceContext | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.slice(7).trim()
  if (!token) return null

  const tokenHash = hashToken(token)
  const [row] = await db
    .select({ id: desktopDevices.id, userId: desktopDevices.userId })
    .from(desktopDevices)
    .where(and(eq(desktopDevices.tokenHash, tokenHash), isNull(desktopDevices.revokedAt)))
    .limit(1)

  if (!row) return null

  await db
    .update(desktopDevices)
    .set({ lastSeenAt: new Date() })
    .where(eq(desktopDevices.id, row.id))
    .catch(() => {})

  return { userId: row.userId, deviceId: row.id }
}
