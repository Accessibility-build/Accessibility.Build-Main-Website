'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { trackBillingClientEvent } from './client-events'

type ManageBillingButtonProps = {
  className?: string
  label?: string
}

export function ManageBillingButton({
  className,
  label = 'Open Billing Center',
}: ManageBillingButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const openBillingCenter = async () => {
    try {
      setIsLoading(true)
      trackBillingClientEvent({
        eventType: 'manage_click',
        sourcePath: '/billing',
        paymentProvider: 'razorpay',
        status: 'clicked',
      })

      const response = await fetch('/api/billing/manage-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnPath: '/billing',
        }),
      })

      const data = await response.json()

      if (response.status === 401) {
        trackBillingClientEvent({
          eventType: 'manage_auth_required',
          sourcePath: '/billing',
          paymentProvider: 'razorpay',
          status: 'auth_required',
        })

        window.location.href = data.signInUrl || '/sign-in?redirect_url=%2Fbilling%2Fmanage'
        return
      }

      if (!response.ok || !data.url) {
        trackBillingClientEvent({
          eventType: 'manage_session_failed',
          sourcePath: '/billing',
          paymentProvider: 'razorpay',
          status: 'failed',
          errorCode: 'manage_session_response_error',
          errorMessage: data.error || 'Failed to open billing center',
        })

        throw new Error(data.error || 'Failed to open billing center')
      }

      trackBillingClientEvent({
        eventType: 'manage_session_created',
        sourcePath: '/billing',
        paymentProvider: 'razorpay',
        status: 'redirecting',
      })

      window.location.href = data.url
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to open billing center')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button type="button" className={className} onClick={openBillingCenter} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Opening Billing...
        </>
      ) : (
        label
      )}
    </Button>
  )
}
