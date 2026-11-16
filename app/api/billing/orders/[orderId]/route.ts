import { NextRequest, NextResponse } from "next/server"
import { getOrderStatusForViewer } from "@/lib/billing/dodo-service"
import { getCourseViewer } from "@/lib/courses/access"
import { guestCheckoutCookieName } from "@/lib/billing/guest-checkout"

export const dynamic = "force-dynamic"

/** A signed-in owner or the checkout browser can wait for confirmation. No buyer details are returned. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const viewer = await getCourseViewer()
  const token = req.cookies.get(guestCheckoutCookieName(orderId))?.value
  const status = await getOrderStatusForViewer(orderId, viewer?.userId, token)
  if (!status) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(
    { status: status.status, kind: status.item?.kind, successPath: status.item?.successPath, name: status.item?.name, requiresSignIn: status.requiresSignIn },
    { headers: { "Cache-Control": "no-store" } }
  )
}
