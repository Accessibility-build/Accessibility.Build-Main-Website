'use client'

import { useSearchParams } from 'next/navigation'

type BillingStatusBannerProps = {
  orderStatuses?: Record<string, string>
}

export function BillingStatusBanner({ orderStatuses = {} }: BillingStatusBannerProps) {
  const searchParams = useSearchParams()
  const checkoutState = searchParams.get('checkout')
  const orderId = searchParams.get('order')

  if (checkoutState === 'success') {
    const orderStatus = orderId ? orderStatuses[orderId] : undefined

    if (orderStatus === 'pending') {
      return (
        <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
          Checkout completed. Payment is still processing for order {orderId || 'n/a'}.
          Credits will be granted automatically once payment clears.
        </div>
      )
    }

    if (orderStatus === 'paid') {
      return (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
          Checkout completed and credits were delivered. Order reference: {orderId || 'n/a'}.
        </div>
      )
    }

    if (orderStatus === 'failed' || orderStatus === 'action_required') {
      return (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          Checkout completed but payment was not finalized for order {orderId || 'n/a'}.
          Review the order status below or contact support.
        </div>
      )
    }

    return (
      <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
        Checkout completed. Credits are being finalized. Order reference: {orderId || 'n/a'}.
      </div>
    )
  }

  if (checkoutState === 'cancelled') {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
        Checkout was cancelled. No charge was made. You can retry your purchase anytime.
      </div>
    )
  }

  return null
}
