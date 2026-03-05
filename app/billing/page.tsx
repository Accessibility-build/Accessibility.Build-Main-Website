import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import {
  CreditCard,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  BadgeDollarSign,
  Coins,
  Receipt,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container-wide py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Billing &amp; Credits</h1>
                <p className="text-muted-foreground mt-1">
                  View purchase history, receipts, and billing actions in your Billing Center.
                </p>
              </div>
            </div>
            <ManageBillingButton />
          </div>

          {/* Currency Switcher */}
          {supportsInr && (
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-full">
                <Button
                  asChild
                  variant={selectedCurrency === 'USD' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-full px-5"
                >
                  <Link href="/billing?currency=USD">USD ($)</Link>
                </Button>
                <Button
                  asChild
                  variant={selectedCurrency === 'INR' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-full px-5"
                >
                  <Link href="/billing?currency=INR">INR (&#8377;)</Link>
                </Button>
              </div>
            </div>
          )}

          <BillingStatusBanner orderStatuses={orderStatuses} />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>Current Credits</CardDescription>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Coins className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl">{user.credits}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Available for use</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-green-500 to-green-600" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>Total Spent ({selectedCurrency})</CardDescription>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl">
                  {formatCurrency(selectedCurrencyTotal, selectedCurrency)}
                </CardTitle>
                {supportsInr && alternateCurrencyTotal > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Also {formatCurrency(alternateCurrencyTotal, alternateCurrency)} in {alternateCurrency}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-purple-500 to-purple-600" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>Paid Orders</CardDescription>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Receipt className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl">{paidOrders.length}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Completed purchases</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-amber-500 to-amber-600" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>Pending / Refunded</CardDescription>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <ShoppingCart className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl">
                  {pendingOrders.length} / {refundedOrders.length}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">In progress &amp; returned</p>
              </CardContent>
            </Card>
          </div>

          {/* Buy More Credits */}
          <Card className="shadow-sm rounded-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-indigo-600" />
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BadgeDollarSign className="h-5 w-5 text-primary" />
                </div>
                Buy More Credits
              </CardTitle>
              <CardDescription>
                One-time credit purchases with secure hosted Razorpay checkout.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catalog.map((pack) => (
                  <div
                    key={pack.key}
                    className={`rounded-xl border p-5 space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${
                      pack.isPopular
                        ? 'border-primary ring-1 ring-primary/20 bg-primary/5'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-lg">{pack.name}</p>
                      {pack.isPopular && (
                        <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">
                        {formatCurrency(pack.amountCents, pack.currency)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        for {pack.credits.toLocaleString()} credits
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{pack.valueLabel || pack.taxNote}</p>
                    <CheckoutButton
                      catalogKey={pack.key as CheckoutCatalogKey}
                      currency={selectedCurrency}
                      className="w-full rounded-full"
                    >
                      {pack.ctaLabel}
                    </CheckoutButton>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card className="shadow-sm rounded-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Receipt className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                Order History
              </CardTitle>
              <CardDescription>Razorpay purchase records and fulfillment statuses for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Receipt className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium mb-1">No purchases yet</p>
                  <p className="text-sm text-muted-foreground">Buy your first credit pack to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const pack = catalogByKey[order.catalogKey]
                    const displayName = pack?.name || order.catalogKey.replace(/_/g, ' ')
                    const displayAmount = getOrderDisplayAmount(order, supportsInr)

                    return (
                      <div key={order.id} className="border rounded-xl p-5 space-y-3 hover:shadow-sm transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex-shrink-0 p-2 rounded-lg ${
                                order.status === 'paid'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                  : order.status === 'pending'
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : order.status === 'failed' || order.status === 'action_required'
                                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {order.status === 'paid' ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : order.status === 'pending' ? (
                                <Clock3 className="h-5 w-5" />
                              ) : (
                                <AlertTriangle className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold">{displayName}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.credits} credits &middot;{' '}
                                {formatCurrency(displayAmount.amountCents, displayAmount.currency)}
                              </p>
                            </div>
                          </div>
                          <Badge variant={statusBadgeVariant(order.status)}>{prettyStatus(order.status)}</Badge>
                        </div>

                        {order.failureReason && (
                          <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800">
                            {order.failureReason}
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                          <span>Order: {order.id}</span>
                          <span>Created: {new Date(order.createdAt).toLocaleString()}</span>
                        </div>

                        {order.status === 'paid' && (
                          <div className="flex items-center gap-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-2 rounded-lg">
                            <CheckCircle2 className="h-4 w-4" />
                            Credits delivered successfully.
                          </div>
                        )}

                        {order.status === 'pending' && (
                          <div className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg">
                            <Clock3 className="h-4 w-4" />
                            Payment is still processing. This can take longer for asynchronous payment methods.
                          </div>
                        )}

                        {order.status === 'action_required' && (
                          <div className="flex items-center gap-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-3 py-2 rounded-lg">
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

          {/* Footer */}
          <div className="bg-muted/50 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need receipts, payment updates, or billing profile changes? Open your{' '}
              <Link href="/billing/manage" className="text-primary underline hover:no-underline">
                Billing Center
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
