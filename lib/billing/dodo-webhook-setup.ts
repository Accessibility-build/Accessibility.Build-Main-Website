import "server-only"
import { getDodoClient, getDodoEnvironment } from "./dodo"
import { getPublicAppUrl } from "./stripe"

// The events app/api/webhooks/dodo handles.
export const DODO_WEBHOOK_EVENTS = [
  "payment.succeeded",
  "payment.failed",
  "payment.processing",
  "payment.cancelled",
  "refund.succeeded",
  "refund.failed",
  "dispute.opened",
  "dispute.lost",
] as const

export function getDodoWebhookUrl() {
  // Webhooks must reach the public site, even when this runs locally.
  const base = getPublicAppUrl()
  return `${/localhost|127\.0\.0\.1/.test(base) ? "https://accessibility.build" : base}/api/webhooks/dodo`
}

export async function getDodoWebhookStatus() {
  const url = getDodoWebhookUrl()
  const endpoints: Array<{ id: string; url: string; disabled: boolean; filterTypes: string[] }> = []
  for await (const w of getDodoClient().webhooks.list()) {
    endpoints.push({ id: w.id, url: w.url, disabled: Boolean(w.disabled), filterTypes: w.filter_types ?? [] })
  }
  return {
    environment: getDodoEnvironment(),
    url,
    endpoint: endpoints.find((e) => e.url === url) ?? null,
    secretConfigured: Boolean(process.env.DODO_PAYMENTS_WEBHOOK_KEY),
  }
}

/** Register the site's webhook endpoint with Dodo (once) and return its signing secret. */
export async function ensureDodoWebhook() {
  const dodo = getDodoClient()
  const status = await getDodoWebhookStatus()
  let id = status.endpoint?.id
  if (!id) {
    const created = await dodo.webhooks.create({
      url: status.url,
      description: "Accessibility.build: fulfil purchases (credits, courses, templates)",
      filter_types: [...DODO_WEBHOOK_EVENTS],
    })
    id = created.id
  }
  const { secret } = await dodo.webhooks.retrieveSecret(id)
  return { environment: status.environment, url: status.url, id, created: !status.endpoint, secret }
}
