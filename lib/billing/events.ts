import { db } from '@/lib/db'
import { billingFunnelEvents } from '@/lib/db/schema'
import {
  BILLING_FUNNEL_EVENT_TYPES,
  BillingFunnelEventInput,
  BillingFunnelEventType,
} from './types'

const MAX_TEXT_LENGTH = 512
const MAX_SOURCE_LENGTH = 128
const MAX_METADATA_SIZE = 20000

const BILLING_EVENT_TYPE_SET = new Set<string>(BILLING_FUNNEL_EVENT_TYPES)

function safeString(value: unknown, maxLength = MAX_TEXT_LENGTH): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  return trimmed.slice(0, maxLength)
}

function safeMetadata(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined
  }

  try {
    const serialized = JSON.stringify(value)
    if (serialized.length > MAX_METADATA_SIZE) {
      return { truncated: true, originalSize: serialized.length }
    }

    return value as Record<string, unknown>
  } catch {
    return { serializationError: true }
  }
}

export function isBillingFunnelEventType(value: unknown): value is BillingFunnelEventType {
  return typeof value === 'string' && BILLING_EVENT_TYPE_SET.has(value)
}

export function normalizeBillingFunnelEventInput(
  payload: {
    eventType?: unknown
    eventSource?: unknown
    userId?: unknown
    orderId?: unknown
    paymentProvider?: unknown
    catalogKey?: unknown
    currency?: unknown
    providerOrderId?: unknown
    providerPaymentId?: unknown
    stripeCheckoutSessionId?: unknown
    status?: unknown
    errorCode?: unknown
    errorMessage?: unknown
    metadata?: unknown
  }
): BillingFunnelEventInput | null {
  if (!isBillingFunnelEventType(payload.eventType)) {
    return null
  }

  const eventSource = safeString(payload.eventSource, MAX_SOURCE_LENGTH)
  if (!eventSource) {
    return null
  }

  return {
    eventType: payload.eventType,
    eventSource,
    userId: safeString(payload.userId, 128),
    orderId: safeString(payload.orderId, 128),
    paymentProvider: safeString(payload.paymentProvider, 32) as
      | BillingFunnelEventInput['paymentProvider']
      | undefined,
    catalogKey: safeString(payload.catalogKey, 64),
    currency: safeString(payload.currency, 8) as BillingFunnelEventInput['currency'] | undefined,
    providerOrderId: safeString(payload.providerOrderId, 128),
    providerPaymentId: safeString(payload.providerPaymentId, 128),
    stripeCheckoutSessionId: safeString(payload.stripeCheckoutSessionId, 128),
    status: safeString(payload.status, 64),
    errorCode: safeString(payload.errorCode, 64),
    errorMessage: safeString(payload.errorMessage, MAX_TEXT_LENGTH),
    metadata: safeMetadata(payload.metadata),
  }
}

export async function logBillingFunnelEvent(input: BillingFunnelEventInput): Promise<void> {
  const normalized = normalizeBillingFunnelEventInput(input)

  if (!normalized) {
    return
  }

  try {
    await db.insert(billingFunnelEvents).values({
      eventType: normalized.eventType,
      eventSource: normalized.eventSource,
      userId: normalized.userId,
      orderId: normalized.orderId,
      paymentProvider: normalized.paymentProvider,
      catalogKey: normalized.catalogKey,
      currency: normalized.currency,
      providerOrderId: normalized.providerOrderId,
      providerPaymentId: normalized.providerPaymentId,
      stripeCheckoutSessionId: normalized.stripeCheckoutSessionId,
      status: normalized.status,
      errorCode: normalized.errorCode,
      errorMessage: normalized.errorMessage,
      metadata: normalized.metadata,
    })
  } catch (error) {
    console.warn('Failed to log billing funnel event', {
      eventType: normalized.eventType,
      eventSource: normalized.eventSource,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
