import { NextResponse } from "next/server"
import { AdminAccessError, requireAdminApi } from "@/lib/admin-auth"
import { isDodoConfigured } from "@/lib/billing/dodo"
import { ensureDodoWebhook, getDodoWebhookStatus } from "@/lib/billing/dodo-webhook-setup"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function fail(e: unknown) {
  if (e instanceof AdminAccessError) return NextResponse.json({ error: e.message }, { status: e.statusCode })
  return NextResponse.json({ error: e instanceof Error ? e.message : "Request failed" }, { status: 500 })
}

/** GET: is the webhook endpoint registered with Dodo, and is the secret set on this deployment. */
export async function GET() {
  try {
    await requireAdminApi()
    if (!isDodoConfigured()) return NextResponse.json({ error: "DODO_PAYMENTS_API_KEY is not set" }, { status: 503 })
    return NextResponse.json(await getDodoWebhookStatus(), { headers: { "Cache-Control": "no-store" } })
  } catch (e) {
    return fail(e)
  }
}

/** POST: register the endpoint if missing and return its signing secret (shown once to the admin). */
export async function POST() {
  try {
    await requireAdminApi()
    if (!isDodoConfigured()) return NextResponse.json({ error: "DODO_PAYMENTS_API_KEY is not set" }, { status: 503 })
    return NextResponse.json(await ensureDodoWebhook(), { headers: { "Cache-Control": "no-store" } })
  } catch (e) {
    return fail(e)
  }
}
