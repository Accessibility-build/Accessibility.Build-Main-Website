import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { AlertTriangle, CreditCard, Download, FileText, UserCircle } from 'lucide-react'
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
    <div className="container-wide py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CreditCard className="h-7 w-7 text-primary" />
            Billing Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your billing profile, Razorpay transactions, support actions, and receipts.
          </p>
        </div>

        {actionRequiredOrders.length > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertTriangle className="h-5 w-5" />
                Action Required
              </CardTitle>
              <CardDescription>
                Some refunded orders need manual review. Contact support with the listed order IDs.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {actionRequiredOrders.map((order) => (
                <p key={order.id}>
                  {order.id} - {order.failureReason || 'Billing adjustment review pending'}
                </p>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                Billing Profile
              </CardTitle>
              <CardDescription>Profile data used for checkout and receipts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span>{' '}
                {[user.firstName, user.lastName].filter(Boolean).join(' ') || 'Not set'}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Razorpay Customer ID:</span>{' '}
                {user.razorpayCustomerId || 'Created on demand'}
              </p>
              <p className="text-muted-foreground">
                Need profile updates? Contact support at{' '}
                <Link className="underline" href="mailto:support@accessibility.build">
                  support@accessibility.build
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Receipts and Refunds
              </CardTitle>
              <CardDescription>Receipt references and refund support flow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Download receipts directly from completed orders in the timeline below.</p>
              <p>Refunds are initiated by support and processed through Razorpay.</p>
              <p>
                For refund requests, email{' '}
                <Link className="underline" href="mailto:refunds@accessibility.build">
                  refunds@accessibility.build
                </Link>{' '}
                with your order ID.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Timeline</CardTitle>
            <CardDescription>Most recent Razorpay billing activity first.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    asChild
                    size="sm"
                    variant={statusFilter === filter.value ? 'default' : 'outline'}
                  >
                    <Link href={buildFilterHref(filter.value, currencyFilter)}>{filter.label}</Link>
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {currencyFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    asChild
                    size="sm"
                    variant={currencyFilter === filter.value ? 'default' : 'outline'}
                  >
                    <Link href={buildFilterHref(statusFilter, filter.value)}>{filter.label}</Link>
                  </Button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6">
                No billing transactions found for the selected filters.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const displayAmount = getOrderDisplayAmount(order, allowInr)

                  return (
                    <div key={order.id} className="rounded-md border p-4 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm space-y-1">
                          <p className="font-medium">{order.catalogKey.replace(/_/g, ' ')}</p>
                          <p className="text-muted-foreground">
                            {order.credits.toLocaleString()} credits -{' '}
                            {formatCurrency(displayAmount.amountCents, displayAmount.currency)}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">{order.paymentProvider.toUpperCase()}</Badge>
                            <Badge variant="outline">{displayAmount.currency}</Badge>
                          </div>
                        </div>
                        <Badge variant={order.status === 'paid' ? 'default' : order.status === 'failed' ? 'destructive' : 'secondary'}>
                          {prettyStatus(order.status)}
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground grid grid-cols-1 md:grid-cols-3 gap-2">
                        <span>Order ID: {order.id}</span>
                        <span>Provider Order: {order.providerOrderId || 'pending'}</span>
                        <span>Provider Payment: {order.providerPaymentId || 'pending'}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(order.createdAt).toLocaleString()}
                      </div>

                      {order.status === 'action_required' && (
                        <div className="text-xs rounded-md border border-red-200 bg-red-50 text-red-700 p-3 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                          This order requires manual support action. Email{' '}
                          <Link className="underline" href="mailto:support@accessibility.build">
                            support@accessibility.build
                          </Link>{' '}
                          and include order ID <strong>{order.id}</strong>.
                        </div>
                      )}

                      {canDownloadReceipt(order.status) && (
                        <div>
                          <Button asChild size="sm" variant="outline">
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
  )
}
