import { NextRequest, NextResponse } from "next/server"
import { getClerkApiIdentity } from "@/lib/clerk-auth"
import { getOrderStatusForUser } from "@/lib/billing/dodo-service"
import { getOrCreateUserByClerkId } from "@/lib/credits"

export const dynamic = "force-dynamic"

/** Order status for the signed-in owner (used by the payment return page to wait for the webhook). */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const identity = await getClerkApiIdentity()
  if (!identity) return NextResponse.json({ error: "Sign in required" }, { status: 401 })
  const user = await getOrCreateUserByClerkId({ userId: identity.userId, email: identity.email })
  const status = await getOrderStatusForUser(orderId, user.id)
  if (!status) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(
    { status: status.status, kind: status.item?.kind, successPath: status.item?.successPath, name: status.item?.name },
    { headers: { "Cache-Control": "no-store" } }
  )
}
