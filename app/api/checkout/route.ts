import { NextRequest, NextResponse } from "next/server"
import { getClerkApiIdentity } from "@/lib/clerk-auth"
import { getOrCreateUserByClerkId } from "@/lib/credits"
import { createDodoCheckout } from "@/lib/billing/dodo-service"
import { isDodoConfigured } from "@/lib/billing/dodo"
import { logBillingFunnelEvent } from "@/lib/billing/events"
import { isBillingEnabled } from "@/lib/billing/provider"
import { getSellable } from "@/lib/billing/sellables"
import { getCourseAccess } from "@/lib/courses/access"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Start a Dodo checkout for a course licence or template: { item: "course:<slug>:<licence>" | "template:<slug>:<licence>", returnTo }. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const key = typeof body.item === "string" ? body.item : ""
  const item = getSellable(key)
  if (!item || item.kind === "credits") return NextResponse.json({ error: "Unknown product" }, { status: 400 })
  if (!isBillingEnabled() || !isDodoConfigured()) {
    return NextResponse.json({ error: "Card checkout is not available right now. Please buy by invoice through the contact page." }, { status: 503 })
  }
  const identity = await getClerkApiIdentity()
  if (!identity) {
    const back = typeof body.returnTo === "string" && body.returnTo.startsWith("/") && !body.returnTo.startsWith("//") ? body.returnTo : item.cancelPath
    return NextResponse.json({ error: "Sign in required", signInUrl: `/sign-in?redirect_url=${encodeURIComponent(back)}` }, { status: 401 })
  }
  // Someone with course access does not need to buy an individual licence again.
  if (item.kind === "course" && item.course?.licence === "individual") {
    const access = await getCourseAccess(item.course.slug)
    if (access.hasAccess) return NextResponse.json({ error: "You already have access to this course.", redirect: item.successPath }, { status: 409 })
  }
  try {
    const user = await getOrCreateUserByClerkId({ userId: identity.userId, email: identity.email, firstName: identity.firstName, lastName: identity.lastName, profileImageUrl: identity.profileImageUrl })
    const result = await createDodoCheckout({
      userId: user.id,
      email: user.email || identity.email,
      fullName: [user.firstName, user.lastName].filter(Boolean).join(" ").trim(),
      key: item.key,
    })
    await logBillingFunnelEvent({ eventType: "checkout_session_created", eventSource: "api:/api/checkout", userId: user.id, orderId: result.orderId, paymentProvider: "dodo", catalogKey: item.key.slice(0, 64), status: "dodo_session" })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed"
    console.error("[api/checkout] failed", message)
    await logBillingFunnelEvent({ eventType: "checkout_session_failed", eventSource: "api:/api/checkout", userId: identity.userId, paymentProvider: "dodo", catalogKey: item.key.slice(0, 64), status: "failed", errorMessage: message })
    return NextResponse.json({ error: "Could not start checkout. Please try again, or buy by invoice through the contact page." }, { status: 500 })
  }
}
