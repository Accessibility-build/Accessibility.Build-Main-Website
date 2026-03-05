import { NextRequest, NextResponse } from 'next/server'
import { AdminAccessError, requireAdminApi } from '@/lib/admin-auth'
import {
  BillingFunnelRange,
  getBillingFunnelEventsFeed,
  getBillingFunnelKpis,
} from '@/lib/admin-utils'
import {
  BILLING_FUNNEL_EVENT_TYPES,
  type BillingProvider,
  type BillingFunnelEventType,
} from '@/lib/billing/types'

const VALID_RANGES: BillingFunnelRange[] = ['24h', '7d', '30d']

function parseRange(value: string | null): BillingFunnelRange {
  if (!value) {
    return '7d'
  }

  return VALID_RANGES.includes(value as BillingFunnelRange) ? (value as BillingFunnelRange) : '7d'
}

function parseLimit(value: string | null) {
  if (!value) {
    return 50
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return 50
  }

  return Math.min(Math.max(Math.floor(parsed), 1), 200)
}

function parseEventType(value: string | null): BillingFunnelEventType | undefined {
  if (!value) {
    return undefined
  }

  return BILLING_FUNNEL_EVENT_TYPES.includes(value as BillingFunnelEventType)
    ? (value as BillingFunnelEventType)
    : undefined
}

function parseProvider(value: string | null): BillingProvider | undefined {
  if (!value) {
    return undefined
  }

  if (value === 'stripe' || value === 'razorpay') {
    return value
  }

  return undefined
}

export async function GET(request: NextRequest) {
  try {
    await requireAdminApi()

    const { searchParams } = new URL(request.url)
    const range = parseRange(searchParams.get('range'))
    const eventType = parseEventType(searchParams.get('eventType'))
    const paymentProvider = parseProvider(searchParams.get('provider'))
    const limit = parseLimit(searchParams.get('limit'))

    const [kpis, events] = await Promise.all([
      getBillingFunnelKpis(range, paymentProvider),
      getBillingFunnelEventsFeed({ range, eventType, paymentProvider, limit }),
    ])

    return NextResponse.json({ kpis, events })
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('Admin billing funnel API error:', error)
    return NextResponse.json({ error: 'Failed to fetch billing funnel data' }, { status: 500 })
  }
}
