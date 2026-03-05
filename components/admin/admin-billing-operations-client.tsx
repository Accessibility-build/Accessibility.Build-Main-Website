'use client'

import { useCallback, useEffect, useState } from 'react'
import { Copy, ExternalLink, Loader2, RefreshCw } from 'lucide-react'
import {
  MIN_ADMIN_BILLING_REASON_LENGTH,
  normalizeAdminBillingReason,
} from '@/lib/billing/admin-operations'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type CheckoutCurrency = 'USD' | 'INR'

type BillingOperationsOrder = {
  id: string
  userId: string
  userEmail: string
  catalogKey: string
  credits: number
  currency: CheckoutCurrency | string
  amountTotal: number
  status: string
  providerOrderId: string | null
  providerPaymentId: string | null
  providerPaymentLinkId: string | null
  failureReason: string | null
  createdAt: string
  updatedAt: string
}

type CreateLinkResult = {
  action: 'create_payment_link' | 'create_payment_link_for_order'
  orderId: string
  providerOrderId?: string
  paymentLinkUrl: string
}

type ManualPaidResult = {
  action: 'mark_order_paid_manual'
  result: {
    orderId: string
    status: string
    creditsGranted: boolean
    creditTransactionId: string
    providerOrderId: string | null
    providerPaymentId: string | null
  }
}

const CATALOG_OPTIONS = [
  { value: 'starter_50', label: 'Starter (50)' },
  { value: 'pro_200', label: 'Pro (200)' },
  { value: 'business_500', label: 'Business (500)' },
  { value: 'growth_2500', label: 'Growth (2,500)' },
  { value: 'team_5000', label: 'Team Medium (5,000)' },
  { value: 'team_15000', label: 'Team Large (15,000)' },
] as const

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format((amountMinor || 0) / 100)
}

export function AdminBillingOperationsClient() {
  const [orders, setOrders] = useState<BillingOperationsOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  const [createUserId, setCreateUserId] = useState('')
  const [createCatalogKey, setCreateCatalogKey] = useState<(typeof CATALOG_OPTIONS)[number]['value']>(
    'starter_50'
  )
  const [createCurrency, setCreateCurrency] = useState<CheckoutCurrency>('USD')
  const [createReason, setCreateReason] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [createResult, setCreateResult] = useState<CreateLinkResult | null>(null)

  const [existingOrderId, setExistingOrderId] = useState('')
  const [existingReason, setExistingReason] = useState('')
  const [existingLoading, setExistingLoading] = useState(false)
  const [existingError, setExistingError] = useState<string | null>(null)
  const [existingResult, setExistingResult] = useState<CreateLinkResult | null>(null)

  const [manualOrderId, setManualOrderId] = useState('')
  const [manualProviderOrderId, setManualProviderOrderId] = useState('')
  const [manualProviderPaymentId, setManualProviderPaymentId] = useState('')
  const [manualReason, setManualReason] = useState('')
  const [manualLoading, setManualLoading] = useState(false)
  const [manualError, setManualError] = useState<string | null>(null)
  const [manualResult, setManualResult] = useState<ManualPaidResult | null>(null)
  const [manualConfirmOpen, setManualConfirmOpen] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [copyError, setCopyError] = useState<string | null>(null)

  const createReasonLength = normalizeAdminBillingReason(createReason).length
  const existingReasonLength = normalizeAdminBillingReason(existingReason).length
  const manualReasonLength = normalizeAdminBillingReason(manualReason).length

  const canCreatePaymentLink =
    createUserId.trim().length > 0 && createReasonLength >= MIN_ADMIN_BILLING_REASON_LENGTH
  const canCreateExistingOrderPaymentLink =
    existingOrderId.trim().length > 0 && existingReasonLength >= MIN_ADMIN_BILLING_REASON_LENGTH
  const canManualMarkPaid =
    manualOrderId.trim().length > 0 && manualReasonLength >= MIN_ADMIN_BILLING_REASON_LENGTH

  const loadOrders = useCallback(async () => {
    try {
      setOrdersLoading(true)
      setOrdersError(null)

      const response = await fetch(
        '/api/admin/billing/operations?status=pending,failed,action_required&limit=20',
        {
          method: 'GET',
          cache: 'no-store',
        }
      )

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to load recent billing orders')
      }

      setOrders(Array.isArray(payload.orders) ? payload.orders : [])
    } catch (error) {
      setOrdersError(error instanceof Error ? error.message : 'Failed to load recent billing orders')
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const copyPaymentLink = useCallback(async (url: string) => {
    try {
      setCopyError(null)

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = url
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setCopiedUrl(url)
      window.setTimeout(() => {
        setCopiedUrl((current) => (current === url ? null : current))
      }, 2000)
    } catch {
      setCopyError('Could not copy the payment link to clipboard.')
    }
  }, [])

  const runCreatePaymentLink = async () => {
    try {
      setCreateLoading(true)
      setCreateError(null)
      setCreateResult(null)
      const normalizedReason = normalizeAdminBillingReason(createReason)
      if (!createUserId.trim()) {
        throw new Error('User ID is required')
      }
      if (normalizedReason.length < MIN_ADMIN_BILLING_REASON_LENGTH) {
        throw new Error(`Reason must be at least ${MIN_ADMIN_BILLING_REASON_LENGTH} characters`)
      }

      const response = await fetch('/api/admin/billing/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_payment_link',
          userId: createUserId.trim(),
          catalogKey: createCatalogKey,
          currency: createCurrency,
          reason: normalizedReason,
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to create admin payment link')
      }

      setCreateResult(payload as CreateLinkResult)
      setCreateReason('')
      await loadOrders()
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Failed to create admin payment link')
    } finally {
      setCreateLoading(false)
    }
  }

  const runCreatePaymentLinkForExistingOrder = async () => {
    try {
      setExistingLoading(true)
      setExistingError(null)
      setExistingResult(null)
      const normalizedReason = normalizeAdminBillingReason(existingReason)
      if (!existingOrderId.trim()) {
        throw new Error('Order ID is required')
      }
      if (normalizedReason.length < MIN_ADMIN_BILLING_REASON_LENGTH) {
        throw new Error(`Reason must be at least ${MIN_ADMIN_BILLING_REASON_LENGTH} characters`)
      }

      const response = await fetch('/api/admin/billing/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_payment_link_for_order',
          orderId: existingOrderId.trim(),
          reason: normalizedReason,
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to create payment link for existing order')
      }

      setExistingResult(payload as CreateLinkResult)
      setExistingReason('')
      await loadOrders()
    } catch (error) {
      setExistingError(
        error instanceof Error ? error.message : 'Failed to create payment link for existing order'
      )
    } finally {
      setExistingLoading(false)
    }
  }

  const runManualMarkPaid = async () => {
    try {
      setManualLoading(true)
      setManualError(null)
      setManualResult(null)
      const normalizedReason = normalizeAdminBillingReason(manualReason)
      if (!manualOrderId.trim()) {
        throw new Error('Order ID is required')
      }
      if (normalizedReason.length < MIN_ADMIN_BILLING_REASON_LENGTH) {
        throw new Error(`Reason must be at least ${MIN_ADMIN_BILLING_REASON_LENGTH} characters`)
      }

      const response = await fetch('/api/admin/billing/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'mark_order_paid_manual',
          orderId: manualOrderId.trim(),
          reason: normalizedReason,
          providerOrderId: manualProviderOrderId.trim() || undefined,
          providerPaymentId: manualProviderPaymentId.trim() || undefined,
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to manually mark order as paid')
      }

      setManualResult(payload as ManualPaidResult)
      setManualReason('')
      setManualConfirmOpen(false)
      await loadOrders()
    } catch (error) {
      setManualError(error instanceof Error ? error.message : 'Failed to manually mark order as paid')
    } finally {
      setManualLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Billing Operations</CardTitle>
          <CardDescription>
            Create Razorpay payment links for users, regenerate links for existing orders, and manually settle paid orders with required reasons.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base">Recent Open Orders</CardTitle>
            <CardDescription>Pending, failed, and action-required Razorpay orders.</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => loadOrders()} disabled={ordersLoading}>
            {ordersLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent>
          {ordersError && <div className="text-sm text-red-700 dark:text-red-300">{ordersError}</div>}
          {!ordersError && orders.length === 0 && (
            <div className="text-sm text-muted-foreground py-3">No open orders found.</div>
          )}
          {orders.length > 0 && (
            <div className="space-y-2">
              {orders.map((order) => (
                <div key={order.id} className="rounded-md border p-3 text-xs space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{order.status}</Badge>
                    <Badge variant="secondary">{order.catalogKey}</Badge>
                    <Badge variant="secondary">{order.currency}</Badge>
                    <span className="text-muted-foreground">
                      {formatCurrency(order.amountTotal, order.currency)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-muted-foreground">
                    <span>Order: {order.id}</span>
                    <span>User: {order.userEmail}</span>
                    <span>Provider Order: {order.providerOrderId || 'n/a'}</span>
                    <span>Provider Payment: {order.providerPaymentId || 'n/a'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create New Payment Link</CardTitle>
          <CardDescription>
            Creates a new billing order and Razorpay payment link for the target user.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="create-user-id">User ID</Label>
            <Input
              id="create-user-id"
              value={createUserId}
              onChange={(event) => setCreateUserId(event.target.value)}
              placeholder="user_xxx"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="create-catalog-key">Catalog Pack</Label>
              <select
                id="create-catalog-key"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={createCatalogKey}
                onChange={(event) => setCreateCatalogKey(event.target.value as typeof createCatalogKey)}
              >
                {CATALOG_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="create-currency">Currency</Label>
              <select
                id="create-currency"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={createCurrency}
                onChange={(event) => setCreateCurrency(event.target.value as CheckoutCurrency)}
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="create-reason">Reason (required)</Label>
            <Textarea
              id="create-reason"
              value={createReason}
              onChange={(event) => setCreateReason(event.target.value)}
              placeholder="Why this admin-created payment link is needed"
              rows={3}
            />
          </div>
          {createError && <div className="text-sm text-red-700 dark:text-red-300">{createError}</div>}
          <div className="text-xs text-muted-foreground">
            Minimum {MIN_ADMIN_BILLING_REASON_LENGTH} characters ({createReasonLength}/
            {MIN_ADMIN_BILLING_REASON_LENGTH})
          </div>
          {createResult && (
            <div className="rounded-md border border-green-200 bg-green-50 p-3 text-xs text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
              <div>Order: {createResult.orderId}</div>
              <div>Provider Order: {createResult.providerOrderId || 'n/a'}</div>
              <div className="break-all">
                Payment Link:{' '}
                <a
                  href={createResult.paymentLinkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {createResult.paymentLinkUrl}
                </a>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(createResult.paymentLinkUrl, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Open Link
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => copyPaymentLink(createResult.paymentLinkUrl)}
                >
                  <Copy className="mr-1 h-3 w-3" />
                  {copiedUrl === createResult.paymentLinkUrl ? 'Copied' : 'Copy Link'}
                </Button>
              </div>
            </div>
          )}
          {copyError && <div className="text-sm text-red-700 dark:text-red-300">{copyError}</div>}
          <Button type="button" onClick={runCreatePaymentLink} disabled={createLoading || !canCreatePaymentLink}>
            {createLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create Payment Link
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Regenerate Link for Existing Order</CardTitle>
          <CardDescription>
            Generates a fresh Razorpay payment link for an existing unpaid Razorpay order.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="existing-order-id">Order ID</Label>
            <Input
              id="existing-order-id"
              value={existingOrderId}
              onChange={(event) => setExistingOrderId(event.target.value)}
              placeholder="billing order uuid"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="existing-reason">Reason (required)</Label>
            <Textarea
              id="existing-reason"
              value={existingReason}
              onChange={(event) => setExistingReason(event.target.value)}
              placeholder="Why this payment link is regenerated"
              rows={3}
            />
          </div>
          {existingError && <div className="text-sm text-red-700 dark:text-red-300">{existingError}</div>}
          <div className="text-xs text-muted-foreground">
            Minimum {MIN_ADMIN_BILLING_REASON_LENGTH} characters ({existingReasonLength}/
            {MIN_ADMIN_BILLING_REASON_LENGTH})
          </div>
          {existingResult && (
            <div className="rounded-md border border-green-200 bg-green-50 p-3 text-xs text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
              <div>Order: {existingResult.orderId}</div>
              <div className="break-all">
                Payment Link:{' '}
                <a
                  href={existingResult.paymentLinkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {existingResult.paymentLinkUrl}
                </a>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(existingResult.paymentLinkUrl, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Open Link
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => copyPaymentLink(existingResult.paymentLinkUrl)}
                >
                  <Copy className="mr-1 h-3 w-3" />
                  {copiedUrl === existingResult.paymentLinkUrl ? 'Copied' : 'Copy Link'}
                </Button>
              </div>
            </div>
          )}
          {copyError && <div className="text-sm text-red-700 dark:text-red-300">{copyError}</div>}
          <Button
            type="button"
            variant="outline"
            onClick={runCreatePaymentLinkForExistingOrder}
            disabled={existingLoading || !canCreateExistingOrderPaymentLink}
          >
            {existingLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Regenerate Link
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Manual Mark as Paid</CardTitle>
          <CardDescription>
            Manually settles an order as paid, grants credits exactly once, and records your reason in order metadata and admin audit log.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="manual-order-id">Order ID</Label>
            <Input
              id="manual-order-id"
              value={manualOrderId}
              onChange={(event) => setManualOrderId(event.target.value)}
              placeholder="billing order uuid"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="manual-provider-order-id">Provider Order ID (optional)</Label>
              <Input
                id="manual-provider-order-id"
                value={manualProviderOrderId}
                onChange={(event) => setManualProviderOrderId(event.target.value)}
                placeholder="order_xxx"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="manual-provider-payment-id">Provider Payment ID (optional)</Label>
              <Input
                id="manual-provider-payment-id"
                value={manualProviderPaymentId}
                onChange={(event) => setManualProviderPaymentId(event.target.value)}
                placeholder="pay_xxx"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="manual-reason">Reason (required)</Label>
            <Textarea
              id="manual-reason"
              value={manualReason}
              onChange={(event) => setManualReason(event.target.value)}
              placeholder="Why you are manually marking this order paid"
              rows={3}
            />
          </div>
          {manualError && <div className="text-sm text-red-700 dark:text-red-300">{manualError}</div>}
          <div className="text-xs text-muted-foreground">
            Minimum {MIN_ADMIN_BILLING_REASON_LENGTH} characters ({manualReasonLength}/
            {MIN_ADMIN_BILLING_REASON_LENGTH})
          </div>
          {manualResult && (
            <div className="rounded-md border border-green-200 bg-green-50 p-3 text-xs text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
              <div>Order: {manualResult.result.orderId}</div>
              <div>Status: {manualResult.result.status}</div>
              <div>Credits Granted: {manualResult.result.creditsGranted ? 'yes' : 'no (already settled)'}</div>
              <div>Credit Tx: {manualResult.result.creditTransactionId}</div>
              <div>Provider Payment: {manualResult.result.providerPaymentId || 'n/a'}</div>
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            onClick={() => setManualConfirmOpen(true)}
            disabled={manualLoading || !canManualMarkPaid}
          >
            {manualLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Mark Order Paid Manually
          </Button>
          <AlertDialog open={manualConfirmOpen} onOpenChange={setManualConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Manual Settlement</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark the billing order as paid and grant credits once. Use only after payment is verified outside the webhook flow.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-2 rounded-md border p-3 text-sm">
                <div>
                  <span className="font-medium">Order ID:</span> {manualOrderId.trim() || 'n/a'}
                </div>
                <div>
                  <span className="font-medium">Reason:</span>{' '}
                  {normalizeAdminBillingReason(manualReason) || 'n/a'}
                </div>
                <div>
                  <span className="font-medium">Provider Order ID:</span>{' '}
                  {manualProviderOrderId.trim() || 'not provided'}
                </div>
                <div>
                  <span className="font-medium">Provider Payment ID:</span>{' '}
                  {manualProviderPaymentId.trim() || 'not provided'}
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={manualLoading}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.preventDefault()
                    runManualMarkPaid()
                  }}
                  disabled={manualLoading || !canManualMarkPaid}
                >
                  {manualLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Confirm and Mark Paid
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
