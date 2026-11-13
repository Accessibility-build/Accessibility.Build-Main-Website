import { NextRequest, NextResponse } from "next/server"
import { getDodoClient } from "@/lib/billing/dodo"
import { processDodoWebhook, type DodoWebhookEvent } from "@/lib/billing/dodo-service"
import { logBillingFunnelEvent } from "@/lib/billing/events"
import { isBillingEnabled } from "@/lib/billing/provider"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Dodo Payments webhooks (Standard Webhooks signatures). Register this URL in the Dodo dashboard:
// Developer > Webhooks > Add endpoint > https://accessibility.build/api/webhooks/dodo
export async function POST(request: NextRequest) {
  const raw = await request.text()
  const headers = {
    "webhook-id": request.headers.get("webhook-id") ?? "",
    "webhook-signature": request.headers.get("webhook-signature") ?? "",
    "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
  }
  if (!process.env.DODO_PAYMENTS_WEBHOOK_KEY) {
    return NextResponse.json({ error: "Webhook key not configured" }, { status: 500 })
  }
  let event: DodoWebhookEvent
  try {
    event = getDodoClient().webhooks.unwrap(raw, { headers }) as unknown as DodoWebhookEvent
  } catch {
    await logBillingFunnelEvent({ eventType: "webhook_error", eventSource: "api:/api/webhooks/dodo", paymentProvider: "dodo", status: "signature_invalid", errorCode: "invalid_signature" })
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }
  if (!isBillingEnabled()) {
    // Acknowledge so Dodo does not retry, but do nothing while billing is switched off.
    return NextResponse.json({ received: true, skipped: true })
  }
  try {
    const result = await processDodoWebhook(headers["webhook-id"], event)
    return NextResponse.json({ received: true, ...result })
  } catch (err) {
    // Non-2xx makes Dodo retry (up to 8 attempts over about a day).
    return NextResponse.json({ error: err instanceof Error ? err.message : "Processing failed" }, { status: 500 })
  }
}
