'use client'

import { useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type BillingFunnelRange = '24h' | '7d' | '30d'
type BillingProviderFilter = 'all' | 'razorpay' | 'stripe'

type BillingFunnelKpis = {
  range: BillingFunnelRange
  checkoutClicks: number
  checkoutAuthRequired: number
  checkoutSessionsCreated: number
  checkoutSessionsFailed: number
  checkoutFallbackPaymentLinks: number
  checkoutFallbackRate: number
  webhookPaid: number
  webhookPending: number
  webhookFailed: number
  webhookRefund: number
  webhookDuplicate: number
  webhookErrors: number
  manageClicks: number
  manageAuthRequired: number
  manageSessionsCreated: number
  manageSessionsFailed: number
  checkoutConversionRate: number
  manageSuccessRate: number
  providerEventCounts: {
    razorpay: number
    stripe: number
    unknown: number
  }
  paidOrdersByProvider: {
    razorpay: number
    stripe: number
  }
  paidOrdersByCurrency: {
    usd: number
    inr: number
  }
  fxDiagnostics: {
    trackedOrders: number
    avgUsdToInrRate: number | null
    latestUsdToInrRate: number | null
  }
  pendingOrdersOlderThan30Minutes: number
  actionRequiredOrders: number
}

type BillingFunnelEvent = {
  id: string
  eventType: string
  eventSource: string
  userId: string | null
  orderId: string | null
  paymentProvider: 'stripe' | 'razorpay' | null
  catalogKey: string | null
  currency: string | null
  providerOrderId: string | null
  providerPaymentId: string | null
  stripeCheckoutSessionId: string | null
  status: string | null
  errorCode: string | null
  errorMessage: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

type BillingFunnelResponse = {
  kpis: BillingFunnelKpis
  events: BillingFunnelEvent[]
}

const RANGE_LABELS: Record<BillingFunnelRange, string> = {
  '24h': '24 Hours',
  '7d': '7 Days',
  '30d': '30 Days',
}

const EVENT_FILTER_OPTIONS = [
  { label: 'All Events', value: 'all' },
  { label: 'Checkout Clicks', value: 'checkout_click' },
  { label: 'Checkout Created', value: 'checkout_session_created' },
  { label: 'Checkout Failed', value: 'checkout_session_failed' },
  { label: 'Checkout Fallback', value: 'checkout_fallback_payment_link' },
  { label: 'Manage Clicks', value: 'manage_click' },
  { label: 'Manage Created', value: 'manage_session_created' },
  { label: 'Manage Failed', value: 'manage_session_failed' },
  { label: 'Webhook Paid', value: 'webhook_paid' },
  { label: 'Webhook Failed', value: 'webhook_failed' },
  { label: 'Webhook Refund', value: 'webhook_refund' },
  { label: 'Webhook Errors', value: 'webhook_error' },
]

const EMPTY_KPIS: BillingFunnelKpis = {
  range: '7d',
  checkoutClicks: 0,
  checkoutAuthRequired: 0,
  checkoutSessionsCreated: 0,
  checkoutSessionsFailed: 0,
  checkoutFallbackPaymentLinks: 0,
  checkoutFallbackRate: 0,
  webhookPaid: 0,
  webhookPending: 0,
  webhookFailed: 0,
  webhookRefund: 0,
  webhookDuplicate: 0,
  webhookErrors: 0,
  manageClicks: 0,
  manageAuthRequired: 0,
  manageSessionsCreated: 0,
  manageSessionsFailed: 0,
  checkoutConversionRate: 0,
  manageSuccessRate: 0,
  providerEventCounts: {
    razorpay: 0,
    stripe: 0,
    unknown: 0,
  },
  paidOrdersByProvider: {
    razorpay: 0,
    stripe: 0,
  },
  paidOrdersByCurrency: {
    usd: 0,
    inr: 0,
  },
  fxDiagnostics: {
    trackedOrders: 0,
    avgUsdToInrRate: null,
    latestUsdToInrRate: null,
  },
  pendingOrdersOlderThan30Minutes: 0,
  actionRequiredOrders: 0,
}

function prettyEventType(value: string) {
  return value
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

export function AdminBillingFunnelClient() {
  const [range, setRange] = useState<BillingFunnelRange>('7d')
  const [eventType, setEventType] = useState('all')
  const [provider, setProvider] = useState<BillingProviderFilter>('all')
  const [refreshNonce, setRefreshNonce] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [kpis, setKpis] = useState<BillingFunnelKpis>(EMPTY_KPIS)
  const [events, setEvents] = useState<BillingFunnelEvent[]>([])

  const query = useMemo(() => {
    const params = new URLSearchParams()
    params.set('range', range)
    params.set('limit', '100')
    if (eventType !== 'all') {
      params.set('eventType', eventType)
    }
    if (provider !== 'all') {
      params.set('provider', provider)
    }
    params.set('_r', String(refreshNonce))

    return params.toString()
  }, [range, eventType, provider, refreshNonce])

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/admin/billing/funnel?${query}`, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store',
        })

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          throw new Error(payload.error || 'Failed to load billing funnel metrics')
        }

        const payload = (await response.json()) as BillingFunnelResponse
        setKpis(payload.kpis || EMPTY_KPIS)
        setEvents(payload.events || [])
      } catch (loadError) {
        if ((loadError as Error).name === 'AbortError') {
          return
        }

        setError(loadError instanceof Error ? loadError.message : 'Failed to load billing funnel data')
      } finally {
        setIsLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [query])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Billing Funnel</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Monitor checkout, billing-center sessions, webhook outcomes, and FX diagnostics.
          </p>
        </div>
        <Button variant="outline" onClick={() => setRefreshNonce((value) => value + 1)} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Choose range, provider, and event type for the feed.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row gap-3">
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(RANGE_LABELS) as BillingFunnelRange[]).map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={range === option ? 'default' : 'outline'}
                onClick={() => setRange(option)}
              >
                {RANGE_LABELS[option]}
              </Button>
            ))}
          </div>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm lg:ml-auto"
            value={provider}
            onChange={(event) => setProvider(event.target.value as BillingProviderFilter)}
          >
            <option value="all">All Providers</option>
            <option value="razorpay">Razorpay</option>
            <option value="stripe">Stripe</option>
          </select>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={eventType}
            onChange={(event) => setEventType(event.target.value)}
          >
            {EVENT_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200">
          <CardContent className="pt-6 text-sm text-red-700 dark:text-red-300">{error}</CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Checkout Clicks</CardDescription>
            <CardTitle className="text-2xl">{kpis.checkoutClicks}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Auth required: {kpis.checkoutAuthRequired}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Checkout Sessions</CardDescription>
            <CardTitle className="text-2xl">{kpis.checkoutSessionsCreated}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Failed: {kpis.checkoutSessionsFailed}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Checkout Conversion</CardDescription>
            <CardTitle className="text-2xl">{kpis.checkoutConversionRate}%</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Paid webhooks: {kpis.webhookPaid}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Fallback Link Rate</CardDescription>
            <CardTitle className="text-2xl">{kpis.checkoutFallbackRate}%</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Link fallbacks: {kpis.checkoutFallbackPaymentLinks}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Billing Center Success</CardDescription>
            <CardTitle className="text-2xl">{kpis.manageSuccessRate}%</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Created: {kpis.manageSessionsCreated} / Clicks: {kpis.manageClicks}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Webhook Failed</CardDescription>
            <CardTitle className="text-2xl">{kpis.webhookFailed}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Pending: {kpis.webhookPending} / Duplicate: {kpis.webhookDuplicate}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Webhook Errors</CardDescription>
            <CardTitle className="text-2xl">{kpis.webhookErrors}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Refund events: {kpis.webhookRefund}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Stale Pending Orders</CardDescription>
            <CardTitle className="text-2xl">{kpis.pendingOrdersOlderThan30Minutes}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Action required: {kpis.actionRequiredOrders}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Event Provider Split</CardDescription>
            <CardTitle className="text-2xl">{kpis.providerEventCounts.razorpay + kpis.providerEventCounts.stripe}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <div>Razorpay: {kpis.providerEventCounts.razorpay}</div>
            <div>Stripe: {kpis.providerEventCounts.stripe}</div>
            <div>Unknown: {kpis.providerEventCounts.unknown}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paid Orders Split</CardDescription>
            <CardTitle className="text-2xl">{kpis.paidOrdersByProvider.razorpay + kpis.paidOrdersByProvider.stripe}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <div>Razorpay paid: {kpis.paidOrdersByProvider.razorpay}</div>
            <div>Stripe paid: {kpis.paidOrdersByProvider.stripe}</div>
            <div>USD: {kpis.paidOrdersByCurrency.usd} / INR: {kpis.paidOrdersByCurrency.inr}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>FX Diagnostics</CardDescription>
            <CardTitle className="text-2xl">
              {kpis.fxDiagnostics.latestUsdToInrRate ? kpis.fxDiagnostics.latestUsdToInrRate.toFixed(4) : 'n/a'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <div>Tracked INR orders: {kpis.fxDiagnostics.trackedOrders}</div>
            <div>
              Avg USD→INR: {kpis.fxDiagnostics.avgUsdToInrRate ? kpis.fxDiagnostics.avgUsdToInrRate.toFixed(4) : 'n/a'}
            </div>
            <div>Latest USD→INR rate in paid orders</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Billing Events</CardTitle>
          <CardDescription>Newest telemetry events first.</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6">No billing events for selected filters.</div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="border rounded-md p-3 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{prettyEventType(event.eventType)}</Badge>
                    {event.paymentProvider && <Badge variant="secondary">{event.paymentProvider}</Badge>}
                    {event.currency && <Badge variant="secondary">{event.currency}</Badge>}
                    {event.status && <Badge variant="secondary">{event.status}</Badge>}
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-1">
                    <span>Source: {event.eventSource}</span>
                    <span>User: {event.userId || 'anonymous'}</span>
                    <span>Order: {event.orderId || 'n/a'}</span>
                    <span>Catalog: {event.catalogKey || 'n/a'}</span>
                    <span>Provider Order: {event.providerOrderId || 'n/a'}</span>
                    <span>Provider Payment: {event.providerPaymentId || 'n/a'}</span>
                    <span>Stripe Session: {event.stripeCheckoutSessionId || 'n/a'}</span>
                  </div>
                  {(event.errorCode || event.errorMessage) && (
                    <div className="text-xs text-red-700 dark:text-red-300">
                      {event.errorCode || 'error'}{event.errorMessage ? ` - ${event.errorMessage}` : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
