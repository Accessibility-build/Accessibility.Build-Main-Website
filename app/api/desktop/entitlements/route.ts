import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { verifyDeviceToken } from '@/lib/desktop-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * The desktop app polls this with its Keychain token to learn who it is and
 * what it can do. Entitlements are derived from the shared credit balance —
 * the same one users top up on the web. Never authoritative for spending;
 * the server debits credits when a paid action actually runs.
 */
export async function GET(req: NextRequest) {
  const ctx = await verifyDeviceToken(req.headers.get('authorization'))
  if (!ctx) {
    return NextResponse.json({ signedIn: false }, { status: 401 })
  }

  const [user] = await db
    .select({ email: users.email, credits: users.credits })
    .from(users)
    .where(eq(users.id, ctx.userId))
    .limit(1)

  const credits = user?.credits ?? 0
  const paid = credits > 0
  return NextResponse.json({
    signedIn: true,
    email: user?.email ?? '',
    credits,
    plan: paid ? 'credits' : 'free',
    features: {
      urlScans: paid,
      aiAltText: paid,
      cloudReports: paid,
    },
  })
}
