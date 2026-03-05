import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  FileText,
  History,
  UserCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUser } from '@/lib/credits'
import { getBillingOrdersForUser } from '@/lib/billing/service'
import { getBillingCurrencyPolicyFromHeaders } from '@/lib/billing/region'

export const metadata: Metadata = {
  title: 'Billing Center | Accessibility.build',
  description: 'Manage billing profile, receipts, and Razorpay payment history.',
  robots: {
    index: false,
    follow: false,
  },
}

type StatusFilter = 'all' | 'paid' | 'pending' | 'failed' | 'refunded' | 'action_required'
type CurrencyFilter = 'all' | 'USD' | 'INR'

type BillingManagePageProps = {
  searchParams?: Promise<{ status?: string; currency?: string }>
}

function formatCurrency(amountCents: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format((amountCents || 0) / 100)
}

function prettyStatus(status: string) {
  return status
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function sanitizeStatus(value: string | undefined): StatusFilter {
  switch (value) {
    case 'paid':
    case 'pending':
    case 'failed':
    case 'refunded':
    case 'action_required':
      return value
    default:
      return 'all'
  }
}

function sanitizeCurrency(value: string | undefined, allowInr: boolean): CurrencyFilter {
  if (value === 'USD') {
    return value
  }

  if (allowInr && value === 'INR') {
    return value
  }

  return 'all'
}

function buildFilterHref(status: StatusFilter, currency: CurrencyFilter) {
  const params = new URLSearchParams()
  if (status !== 'all') {
    params.set('status', status)
  }
  if (currency !== 'all') {
    params.set('currency', currency)
  }

  return params.size > 0 ? `/billing/manage?${params.toString()}` : '/billing/manage'
}

function matchesStatus(orderStatus: string, filter: StatusFilter) {
  if (filter === 'all') {
    return true
  }

  if (filter === 'refunded') {
    return orderStatus === 'refunded' || orderStatus === 'partially_refunded'
  }

  return orderStatus === filter
}

function canDownloadReceipt(orderStatus: string) {
  return (
    orderStatus === 'paid' ||
    orderStatus === 'refunded' ||
    orderStatus === 'partially_refunded' ||
    orderStatus === 'action_required'
  )
}

function getOrderDisplayAmount(
  order: {
    currency: string
    amountTotal: number
    amountTotalUsdCents: number | null
    baseAmountUsdCents: number | null
  },
  allowInr: boolean
): { amountCents: number; currency: 'USD' | 'INR' } {
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

export default async function BillingManagePage({ searchParams }: BillingManagePageProps) {
  const clerkUser = await currentUser()
  if (!clerkUser) {
    redirect('/sign-in?redirect_url=%2Fbilling%2Fmanage')
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const regionPolicy = await getBillingCurrencyPolicyFromHeaders()
  const allowInr = regionPolicy.allowInr
  const statusFilter = sanitizeStatus(resolvedSearchParams?.status)
  const currencyFilter = sanitizeCurrency(resolvedSearchParams?.currency, allowInr)

  const user = await getUser()
  const orders = await getBillingOrdersForUser(user.id, 100)
  const filteredOrders = orders.filter((order) => {
    if (!matchesStatus(order.status, statusFilter)) {
      return false
    }

    if (currencyFilter === 'all') {
      return true
    }

    if (!allowInr && currencyFilter === 'USD') {
      return true
    }

    return order.currency === currencyFilter
  })
  const actionRequiredOrders = orders.filter((order) => order.status === 'action_required')

  const statusFilters: Array<{ value: StatusFilter; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'action_required', label: 'Action Required' },
  ]
  const currencyFilters: Array<{ value: CurrencyFilter; label: string }> = allowInr
    ? [
        { value: 'all', label: 'All Currencies' },
        { value: 'USD', label: 'USD' },
        { value: 'INR', label: 'INR' },
      ]
    : [
        { value: 'all', label: 'All Currencies' },
        { value: 'USD', label: 'USD' },
      ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container-wide py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Billing Center</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your billing profile, Razorpay transactions, support actions, and receipts.
                </p>
              </div>
            </div>
          </div>

          {/* Action Required Banner */}
          {actionRequiredOrders.length > 0 && (
            <Card className="border-red-200 dark:border-red-800 rounded-xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-600" />
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-red-700 dark:text-red-300">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  Action Required
                </CardTitle>
                <CardDescription>
                  Some refunded orders need manual review. Contact support with the listed order IDs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {actionRequiredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg border border-red-200 dark:border-red-800"
                  >
                    <span className="font-medium">{order.id}</span>
                    <span className="mx-2">&mdash;</span>
                    {order.failureReason || 'Billing adjustment review pending'}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Profile & Receipts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Billing Profile */}
            <Card className="shadow-sm rounded-xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600" />
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <UserCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Billing Profile
                </CardTitle>
                <CardDescription>Profile data used for checkout and receipts.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="text-sm font-medium">
                      {[user.firstName, user.lastName].filter(Boolean).join(' ') || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-muted-foreground">Razorpay Customer</span>
                    <span className="text-sm font-medium font-mono">
                      {user.razorpayCustomerId || 'Created on demand'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Need profile updates? Contact{' '}
                  <Link className="underline text-primary hover:no-underline" href="mailto:support@accessibility.build">
                    support@accessibility.build
                  </Link>
                </p>
              </CardContent>
            </Card>

            {/* Receipts and Refunds */}
            <Card className="shadow-sm rounded-xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-green-500 to-green-600" />
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  Receipts &amp; Refunds
                </CardTitle>
                <CardDescription>Receipt references and refund support flow.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <Download className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Download receipts directly from completed orders in the timeline below.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Refunds are initiated by support and processed through Razorpay.
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  For refund requests, email{' '}
                  <Link className="underline text-primary hover:no-underline" href="mailto:refunds@accessibility.build">
                    refunds@accessibility.build
                  </Link>{' '}
                  with your order ID.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Timeline */}
          <Card className="shadow-sm rounded-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <History className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                Transaction Timeline
              </CardTitle>
              <CardDescription>Most recent Razorpay billing activity first.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Filter by Status</p>
                  <div className="flex flex-wrap gap-2">
                    {statusFilters.map((filter) => (
                      <Button
                        key={filter.value}
                        asChild
                        size="sm"
                        variant={statusFilter === filter.value ? 'default' : 'outline'}
                        className="rounded-full"
                      >
                        <Link href={buildFilterHref(filter.value, currencyFilter)}>{filter.label}</Link>
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Filter by Currency</p>
                  <div className="flex flex-wrap gap-2">
                    {currencyFilters.map((filter) => (
                      <Button
                        key={filter.value}
                        asChild
                        size="sm"
                        variant={currencyFilter === filter.value ? 'default' : 'outline'}
                        className="rounded-full"
                      >
                        <Link href={buildFilterHref(statusFilter, filter.value)}>{filter.label}</Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline Items */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <History className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium mb-1">No transactions found</p>
                  <p className="text-sm text-muted-foreground">
                    No billing transactions match the selected filters.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => {
                    const displayAmount = getOrderDisplayAmount(order, allowInr)

                    return (
                      <div key={order.id} className="rounded-xl border p-5 space-y-3 hover:shadow-sm transition-shadow">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex-shrink-0 p-2 rounded-lg ${
                                order.status === 'paid'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                  : order.status === 'pending'
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : order.status === 'failed' || order.status === 'action_required'
                                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                      : 'bg-muted text-muted-foreground'
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
                              <p className="font-semibold capitalize">
                                {order.catalogKey.replace(/_/g, ' ')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.credits.toLocaleString()} credits &middot;{' '}
                                {formatCurrency(displayAmount.amountCents, displayAmount.currency)}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">{displayAmount.currency}</Badge>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={
                              order.status === 'paid'
                                ? 'default'
                                : order.status === 'failed' || order.status === 'action_required'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            {prettyStatus(order.status)}
                          </Badge>
                        </div>

                        <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                          <span>Order ID: {order.id}</span>
                          <span>Created: {new Date(order.createdAt).toLocaleString()}</span>
                        </div>

                        {order.status === 'action_required' && (
                          <div className="text-xs rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                            This order requires manual support action. Email{' '}
                            <Link className="underline" href="mailto:support@accessibility.build">
                              support@accessibility.build
                            </Link>{' '}
                            and include order ID <strong>{order.id}</strong>.
                          </div>
                        )}

                        {canDownloadReceipt(order.status) && (
                          <div>
                            <Button asChild size="sm" variant="outline" className="rounded-full">
                              <Link href={`/api/billing/receipt/${order.id}`} target="_blank">
                                <Download className="mr-2 h-4 w-4" />
                                Download Receipt
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
