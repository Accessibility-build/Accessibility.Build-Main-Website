'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { CheckoutCatalogKey, CheckoutCurrency } from '@/lib/billing/types'
import { trackBillingClientEvent } from './client-events'

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void }
  }
}

type CheckoutButtonProps = {
  catalogKey: CheckoutCatalogKey
  children: ReactNode
  className?: string
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  currency?: CheckoutCurrency
}

const RAZORPAY_CHECKOUT_SCRIPT_ID = 'razorpay-checkout-script'

function sanitizeCheckoutCurrency(value: CheckoutCurrency | undefined): CheckoutCurrency {
  return value === 'INR' ? 'INR' : 'USD'
}

async function ensureRazorpayCheckoutScriptLoaded() {
  if (typeof window === 'undefined') {
    return false
  }

  if (window.Razorpay) {
    return true
  }

  const existingScript = document.getElementById(RAZORPAY_CHECKOUT_SCRIPT_ID) as
    | HTMLScriptElement
    | null
  if (existingScript) {
    return new Promise<boolean>((resolve) => {
      existingScript.addEventListener('load', () => resolve(true), { once: true })
      existingScript.addEventListener('error', () => resolve(false), { once: true })
    })
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement('script')
    script.id = RAZORPAY_CHECKOUT_SCRIPT_ID
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function CheckoutButton({
  catalogKey,
  children,
  className,
  variant = 'default',
  size = 'default',
  currency,
}: CheckoutButtonProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  const startCheckout = async () => {
    const selectedCurrency = sanitizeCheckoutCurrency(currency)

    const fallbackToPaymentLink = async (orderId: string, directUrl?: string) => {
      if (directUrl) {
        trackBillingClientEvent({
          eventType: 'checkout_fallback_payment_link',
          sourcePath: pathname || '/pricing',
          paymentProvider: 'razorpay',
          catalogKey,
          orderId,
          currency: selectedCurrency,
          status: 'redirecting_direct',
        })
        window.location.href = directUrl
        return
      }

      const fallbackResponse = await fetch('/api/billing/payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      })
      const fallbackData = await fallbackResponse.json().catch(() => ({}))
      if (!fallbackResponse.ok || !fallbackData.url) {
        throw new Error(fallbackData.error || 'Failed to create fallback payment link')
      }

      trackBillingClientEvent({
        eventType: 'checkout_fallback_payment_link',
        sourcePath: pathname || '/pricing',
        paymentProvider: 'razorpay',
        catalogKey,
        orderId,
        currency: selectedCurrency,
        status: 'redirecting_generated',
      })
      window.location.href = fallbackData.url
    }

    try {
      setIsLoading(true)
      trackBillingClientEvent({
        eventType: 'checkout_click',
        sourcePath: pathname || '/pricing',
        paymentProvider: 'razorpay',
        catalogKey,
        currency: selectedCurrency,
        status: 'clicked',
      })

      const response = await fetch('/api/billing/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          catalogKey,
          currency: selectedCurrency,
          returnPath: pathname || '/pricing',
        }),
      })

      const data = await response.json()

      if (response.status === 401) {
        trackBillingClientEvent({
          eventType: 'checkout_auth_required',
          sourcePath: pathname || '/pricing',
          paymentProvider: 'razorpay',
          catalogKey,
          currency: selectedCurrency,
          status: 'auth_required',
        })

        if (data.signInUrl) {
          window.location.href = data.signInUrl
          return
        }

        window.location.href = '/sign-in'
        return
      }

      if (!response.ok) {
        trackBillingClientEvent({
          eventType: 'checkout_session_failed',
          sourcePath: pathname || '/pricing',
          paymentProvider: 'razorpay',
          catalogKey,
          currency: selectedCurrency,
          status: 'failed',
          errorCode: 'checkout_session_response_error',
          errorMessage: data.error || 'Failed to create checkout session',
        })

        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.mode === 'payment_link' && data.url) {
        trackBillingClientEvent({
          eventType: 'checkout_session_created',
          sourcePath: pathname || '/pricing',
          paymentProvider: 'razorpay',
          catalogKey,
          currency: selectedCurrency,
          orderId: data.orderId,
          status: 'payment_link',
        })
        window.location.href = data.url
        return
      }

      if (data.mode !== 'razorpay_order' || !data.razorpayOrderId || !data.keyId) {
        throw new Error('Invalid checkout response from server')
      }

      trackBillingClientEvent({
        eventType: 'checkout_session_created',
        sourcePath: pathname || '/pricing',
        paymentProvider: 'razorpay',
        catalogKey,
        currency: data.currency || selectedCurrency,
        orderId: data.orderId,
        providerOrderId: data.razorpayOrderId,
        status: 'razorpay_order',
      })

      const scriptLoaded = await ensureRazorpayCheckoutScriptLoaded()
      if (!scriptLoaded || !window.Razorpay) {
        await fallbackToPaymentLink(data.orderId, data.fallbackPaymentLinkUrl)
        return
      }

      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.amountMinor,
        currency: data.currency,
        name: data.name,
        description: data.description,
        order_id: data.razorpayOrderId,
        prefill: data.prefill,
        notes: data.notes,
        handler: (paymentResult: Record<string, unknown>) => {
          trackBillingClientEvent({
            eventType: 'checkout_session_created',
            sourcePath: pathname || '/pricing',
            paymentProvider: 'razorpay',
            catalogKey,
            currency: (data.currency as CheckoutCurrency) || selectedCurrency,
            orderId: data.orderId,
            providerOrderId: getString(paymentResult.razorpay_order_id) || data.razorpayOrderId,
            providerPaymentId: getString(paymentResult.razorpay_payment_id),
            status: 'payment_authorized',
          })

          window.location.href = `/billing?checkout=success&order=${encodeURIComponent(data.orderId)}`
        },
        modal: {
          ondismiss: async () => {
            if (data.fallbackPaymentLinkUrl || data.orderId) {
              try {
                await fallbackToPaymentLink(data.orderId, data.fallbackPaymentLinkUrl)
              } catch {
                window.location.href = `/billing?checkout=cancelled&order=${encodeURIComponent(data.orderId)}`
              }
            }
          },
        },
      })

      checkout.open()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to start checkout')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={startCheckout}
      disabled={isLoading}
      className={className}
      variant={variant}
      size={size}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Starting Checkout...
        </>
      ) : (
        children
      )}
    </Button>
  )
}

function getString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : undefined
}
