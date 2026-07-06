'use server'

import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { desktopDevices } from '@/lib/db/schema'
import { generateDeviceToken, hashToken } from '@/lib/desktop-auth'

/**
 * Mint a device token for the signed-in user and return the deep link the
 * browser should hand back to the desktop app. Reads the user from the
 * server session — never trusts a client-supplied id. The `state` nonce is
 * echoed back so the app can confirm it initiated this connection.
 */
export async function authorizeDevice(state: string, device: string): Promise<string> {
  const user = await currentUser()
  if (!user) throw new Error('Not signed in')

  const token = generateDeviceToken()
  await db.insert(desktopDevices).values({
    userId: user.id,
    tokenHash: hashToken(token),
    deviceName: (device || 'Desktop').slice(0, 80),
  })

  const params = new URLSearchParams({ token, state })
  return `accessibility-build://auth?${params.toString()}`
}
