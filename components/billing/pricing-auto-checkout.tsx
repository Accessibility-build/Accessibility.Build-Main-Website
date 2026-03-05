'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { CheckoutCatalogKey, CheckoutCurrency } from '@/lib/billing/types'
import { trackBillingClientEvent } from './client-events'

const CHECKOUT_CATALOG_KEYS = new Set<CheckoutCatalogKey>([
  'starter_50',
  'pro_200',
  'business_500',
  'growth_2500',
  'team_5000',
  'team_15000',
])

function sanitizeCheckoutCurrency(value: string | null): CheckoutCurrency {
  return value === 'INR' ? 'INR' : 'USD'
}

export function PricingAutoCheckout() {
  const { isSignedIn, isLoaded } = useUser()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const hasStarted = useRef(false)

  useEffect(() => {
    const checkoutCatalogKey = searchParams.get('checkoutCatalogKey')
    const checkoutCurrency = sanitizeCheckoutCurrency(searchParams.get('checkoutCurrency'))

    if (!checkoutCatalogKey || hasStarted.current || !isLoaded || !isSignedIn) {
      return
    }

    if (!CHECKOUT_CATALOG_KEYS.has(checkoutCatalogKey as CheckoutCatalogKey)) {
      return
    }

    hasStarted.current = true

    const run = async () => {
      try {
        trackBillingClientEvent({
          eventType: 'checkout_click',
          sourcePath: pathname || '/pricing',
          paymentProvider: 'razorpay',
          catalogKey: checkoutCatalogKey,
          currency: checkoutCurrency,
          status: 'resume_after_sign_in',
        })

        const response = await fetch('/api/billing/checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            catalogKey: checkoutCatalogKey,
            currency: checkoutCurrency,
            returnPath: pathname || '/pricing',
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          trackBillingClientEvent({
            eventType: 'checkout_session_failed',
            sourcePath: pathname || '/pricing',
            paymentProvider: 'razorpay',
            catalogKey: checkoutCatalogKey,
            currency: checkoutCurrency,
            status: 'failed',
            errorCode: 'auto_checkout_failed',
            errorMessage: data.error || 'Unable to continue purchase',
          })

          throw new Error(data.error || 'Unable to continue purchase')
        }

        trackBillingClientEvent({
          eventType: 'checkout_session_created',
          sourcePath: pathname || '/pricing',
          paymentProvider: 'razorpay',
          catalogKey: checkoutCatalogKey,
          currency: checkoutCurrency,
          orderId: data.orderId,
          status: data.mode || 'created',
        })

        if (data.mode === 'payment_link' && data.url) {
          window.location.href = data.url
          return
        }

        if (data.mode === 'razorpay_order') {
          if (data.fallbackPaymentLinkUrl) {
            trackBillingClientEvent({
              eventType: 'checkout_fallback_payment_link',
              sourcePath: pathname || '/pricing',
              paymentProvider: 'razorpay',
              catalogKey: checkoutCatalogKey,
              currency: checkoutCurrency,
              orderId: data.orderId,
              status: 'auto_redirect',
            })
            window.location.href = data.fallbackPaymentLinkUrl
            return
          }

          const paymentLinkResponse = await fetch('/api/billing/payment-link', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId: data.orderId }),
          })
          const paymentLinkData = await paymentLinkResponse.json().catch(() => ({}))

          if (paymentLinkResponse.ok && paymentLinkData.url) {
            trackBillingClientEvent({
              eventType: 'checkout_fallback_payment_link',
              sourcePath: pathname || '/pricing',
              paymentProvider: 'razorpay',
              catalogKey: checkoutCatalogKey,
              currency: checkoutCurrency,
              orderId: data.orderId,
              status: 'generated_auto_redirect',
            })
            window.location.href = paymentLinkData.url
            return
          }
        }

        throw new Error('Unable to continue checkout after sign-in')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to continue purchase')

        const params = new URLSearchParams(searchParams.toString())
        params.delete('checkoutCatalogKey')
        params.delete('checkoutCurrency')

        router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
        hasStarted.current = false
      }
    }

    run()
  }, [isLoaded, isSignedIn, pathname, router, searchParams])

  return null
}
