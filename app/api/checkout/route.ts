import { NextRequest, NextResponse } from "next/server"
import { createDodoCheckout } from "@/lib/billing/dodo-service"
import { isDodoConfigured } from "@/lib/billing/dodo"
import { logBillingFunnelEvent } from "@/lib/billing/events"
import { isBillingEnabled } from "@/lib/billing/provider"
import { getSellable } from "@/lib/billing/sellables"
import { getCourseAccess, getCourseViewer } from "@/lib/courses/access"
import { createGuestCheckoutToken, guestCheckoutCookieName, GUEST_CHECKOUT_COOKIE_MAX_AGE } from "@/lib/billing/guest-checkout"
import { createRateLimit } from "@/lib/rate-limit"
import { getCourse } from "@/lib/courses/config"
import { getRenewalOverview, renewalEligibility } from "@/lib/courses/exam"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const checkoutRateLimit = createRateLimit({ max: 12, windowMs: 15 * 60 * 1000, message: "Too many checkout attempts. Please try again in a few minutes." })

/** Start a signed-in or guest Dodo checkout for a course licence or template. */
export async function POST(req: NextRequest) {
  const limited = await checkoutRateLimit(req)
  if (limited) return limited
  const body = await req.json().catch(() => ({}))
  const key = typeof body?.item === "string" ? body.item : ""
  const item = getSellable(key)
  if (!item || item.kind === "credits") return NextResponse.json({ error: "Unknown product" }, { status: 400 })
  if (!isBillingEnabled() || !isDodoConfigured()) {
    return NextResponse.json({ error: "Card checkout is not available right now. Please buy by invoice through the contact page." }, { status: 503 })
  }
  const viewer = await getCourseViewer()
  // Renewals belong to a signed-in learner whose certificate is inside its renewal window.
  if (item.kind === "renewal" && item.renewal) {
    if (!viewer) return NextResponse.json({ error: "Sign in to renew your certificate." }, { status: 401 })
    const course = getCourse(item.renewal.slug)!
    const access = await getCourseAccess(course.slug)
    if (!access.hasAccess) return NextResponse.json({ error: "No access to this course." }, { status: 403 })
    const eligible = await renewalEligibility(viewer.userId, course)
    if (!eligible.ok) return NextResponse.json({ error: eligible.reason }, { status: 409 })
    const overview = await getRenewalOverview(viewer.userId, course)
    if (overview.attemptsLeft > 0) return NextResponse.json({ error: "You already have renewal attempts to use.", redirect: item.successPath }, { status: 409 })
  }
  // Someone with course access does not need to buy an individual licence again.
  if (viewer && item.kind === "course" && item.course?.licence === "individual") {
    const access = await getCourseAccess(item.course.slug)
    if (access.hasAccess) return NextResponse.json({ error: "You already have access to this course.", redirect: item.successPath }, { status: 409 })
  }
  try {
    const guest = viewer ? null : createGuestCheckoutToken()
    const result = await createDodoCheckout({
      userId: viewer?.userId ?? null,
      email: viewer?.email || undefined,
      fullName: viewer?.firstName,
      key: item.key,
      guestTokenHash: guest?.hash,
    })
    await logBillingFunnelEvent({ eventType: "checkout_session_created", eventSource: "api:/api/checkout", userId: viewer?.userId, orderId: result.orderId, paymentProvider: "dodo", catalogKey: item.key.slice(0, 64), status: "dodo_session" })
    const response = NextResponse.json(result, { headers: { "Cache-Control": "no-store" } })
    if (guest) response.cookies.set(guestCheckoutCookieName(result.orderId), guest.token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: GUEST_CHECKOUT_COOKIE_MAX_AGE,
    })
    return response
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed"
    console.error("[api/checkout] failed", message)
    await logBillingFunnelEvent({ eventType: "checkout_session_failed", eventSource: "api:/api/checkout", userId: viewer?.userId, paymentProvider: "dodo", catalogKey: item.key.slice(0, 64), status: "failed", errorMessage: message })
    return NextResponse.json({ error: "Could not start checkout. Please try again, or buy by invoice through the contact page." }, { status: 500 })
  }
}
