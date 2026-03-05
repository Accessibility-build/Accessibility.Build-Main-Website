import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { CreditCard, CheckCircle2, Clock3, AlertTriangle, BadgeDollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ManageBillingButton } from '@/components/billing/manage-billing-button'
import { CheckoutButton } from '@/components/billing/checkout-button'
import { BillingStatusBanner } from '@/components/billing/billing-status-banner'
import { getUser } from '@/lib/credits'
import { getCatalogPresentationPacks } from '@/lib/billing/catalog'
import { getBillingOrdersForUser } from '@/lib/billing/service'
import { getUsdToInrQuote } from '@/lib/billing/fx'
import {
  getBillingCurrencyPolicyFromHeaders,
  sanitizeCheckoutCurrencyForPolicy,
} from '@/lib/billing/region'
import type { CheckoutCatalogKey, CheckoutCurrency } from '@/lib/billing/types'

export const metadata: Metadata = {
  title: 'Billing & Credits | Accessibility.build',
  description: 'Manage credit purchases, receipts, and billing actions for your Accessibility.build account.',
  robots: {
    index: false,
    follow: false,
  },
}

function formatCurrency(amountCents: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format((amountCents || 0) / 100)
}

function getOrderDisplayAmount(
  order: {
    currency: string
    amountTotal: number
    amountTotalUsdCents: number | null
    baseAmountUsdCents: number | null
  },
  allowInr: boolean
): { amountCents: number; currency: CheckoutCurrency } {
  if (allowInr || order.currency !== 'INR') {
    return {
      amountCents: order.amountTotal,
      currency: order.currency === 'INR' ? 'INR' : 'USD',
    }
  }

  const usdFallback =
    (typeof order.amountTotalUsdCents === 'number' && Number.isFinite(order.amountTotalUsdCents)
      ? order.amountTotalUsdCents
      : null) ??
    (typeof order.baseAmountUsdCents === 'number' && Number.isFinite(order.baseAmountUsdCents)
      ? order.baseAmountUsdCents
      : null)

  return {
    amountCents: usdFallback ?? order.amountTotal,
    currency: 'USD' as const,
  }
}

function statusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'paid':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'failed':
      return 'destructive'
    case 'action_required':
      return 'destructive'
    default:
      return 'outline'
  }
}

function prettyStatus(status: string) {
  return status
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

type BillingPageProps = {
  searchParams?: Promise<{ currency?: string }>
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    redirect('/sign-in?redirect_url=%2Fbilling')
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const regionPolicy = await getBillingCurrencyPolicyFromHeaders()
  const selectedCurrency = sanitizeCheckoutCurrencyForPolicy(
    resolvedSearchParams?.currency,
    regionPolicy
  )
  const supportsInr = regionPolicy.allowInr
  const fxQuote = await getUsdToInrQuote()
  const user = await getUser()
  const orders = await getBillingOrdersForUser(user.id, 40)
  const catalog = getCatalogPresentationPacks({
    includeEnterprise: false,
    checkoutOnly: true,
    currency: selectedCurrency,
    usdToInrRate: fxQuote.usdToInr,
  })
  const catalogByKey = Object.fromEntries(catalog.map((pack) => [pack.key, pack]))
  const orderStatuses = Object.fromEntries(orders.map((order) => [order.id, order.status]))

  const paidOrders = orders.filter((order) => order.status === 'paid')
  const refundedOrders = orders.filter(
    (order) => order.status === 'refunded' || order.status === 'partially_refunded'
  )
  const pendingOrders = orders.filter((order) => order.status === 'pending')
  const totalsByCurrency = paidOrders.reduce(
    (acc, order) => {
      const displayAmount = getOrderDisplayAmount(order, supportsInr)
      acc[displayAmount.currency] += displayAmount.amountCents
      return acc
    },
    { USD: 0, INR: 0 }
  )
  const alternateCurrency: CheckoutCurrency = selectedCurrency === 'USD' ? 'INR' : 'USD'
  const selectedCurrencyTotal = totalsByCurrency[selectedCurrency]
  const alternateCurrencyTotal = supportsInr ? totalsByCurrency[alternateCurrency] : 0

  return (
    <div className="container-wide py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <CreditCard className="h-7 w-7 text-primary" />
              Billing & Credits
            </h1>
            <p className="text-muted-foreground mt-2">
              View purchase history, receipts, and billing actions in your Billing Center.
            </p>
          </div>
          <ManageBillingButton />
        </div>

        {supportsInr ? (
          <div className="flex items-center gap-2">
            <Badge variant={selectedCurrency === 'USD' ? 'default' : 'outline'}>USD View</Badge>
            <Badge variant={selectedCurrency === 'INR' ? 'default' : 'outline'}>INR View</Badge>
            <a className="text-sm underline text-primary" href="/billing?currency=USD">
              Switch to USD
            </a>
            <a className="text-sm underline text-primary" href="/billing?currency=INR">
              Switch to INR
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Badge>USD View</Badge>
          </div>
        )}

        <BillingStatusBanner orderStatuses={orderStatuses} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Current Credits</CardDescription>
              <CardTitle className="text-2xl">{user.credits}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Spent ({selectedCurrency})</CardDescription>
              <CardTitle className="text-2xl">
                {formatCurrency(selectedCurrencyTotal, selectedCurrency)}
              </CardTitle>
              {supportsInr && alternateCurrencyTotal > 0 && (
                <p className="text-xs text-muted-foreground">
                  Also {formatCurrency(alternateCurrencyTotal, alternateCurrency)} in {alternateCurrency}
                  orders
                </p>
              )}
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Paid Orders</CardDescription>
              <CardTitle className="text-2xl">{paidOrders.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending / Refunded</CardDescription>
              <CardTitle className="text-2xl">
                {pendingOrders.length} / {refundedOrders.length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeDollarSign className="h-5 w-5 text-primary" />
              Buy More Credits
            </CardTitle>
            <CardDescription>
              One-time credit purchases with secure hosted Razorpay checkout.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {catalog.map((pack) => (
                <div key={pack.key} className="rounded-md border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{pack.name}</p>
                    {pack.isPopular && <Badge variant="secondary">Popular</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {pack.credits.toLocaleString()} credits • {formatCurrency(pack.amountCents, pack.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">{pack.valueLabel || pack.taxNote}</p>
                  <CheckoutButton
                    catalogKey={pack.key as CheckoutCatalogKey}
                    currency={selectedCurrency}
                    className="w-full"
                  >
                    {pack.ctaLabel}
                  </CheckoutButton>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>Razorpay purchase records and fulfillment statuses for your account.</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6">
                No purchases yet. Buy your first credit pack to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const pack = catalogByKey[order.catalogKey]
                  const displayName = pack?.name || order.catalogKey.replace(/_/g, ' ')
                  const displayAmount = getOrderDisplayAmount(order, supportsInr)

                  return (
                    <div key={order.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="font-medium">{displayName}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.credits} credits •{' '}
                            {formatCurrency(displayAmount.amountCents, displayAmount.currency)}
                          </p>
                        </div>
                        <Badge variant={statusBadgeVariant(order.status)}>{prettyStatus(order.status)}</Badge>
                      </div>

                      {order.failureReason && (
                        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800">
                          {order.failureReason}
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground grid grid-cols-1 md:grid-cols-3 gap-2">
                        <span>Order: {order.id}</span>
                        <span>Created: {new Date(order.createdAt).toLocaleString()}</span>
                        <span>Receipt and billing details: available in Billing Center</span>
                      </div>

                      {order.status === 'paid' && (
                        <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                          <CheckCircle2 className="h-4 w-4" />
                          Credits delivered successfully.
                        </div>
                      )}

                      {order.status === 'pending' && (
                        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
                          <Clock3 className="h-4 w-4" />
                          Payment is still processing. This can take longer for asynchronous payment methods.
                        </div>
                      )}

                      {order.status === 'action_required' && (
                        <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400">
                          <AlertTriangle className="h-4 w-4" />
                          Action required. Contact support to resolve billing adjustments.
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        <div className="text-sm text-muted-foreground">
          Need receipts, payment updates, or billing profile changes? Open your Billing Center.
        </div>
      </div>
    </div>
  )
}
