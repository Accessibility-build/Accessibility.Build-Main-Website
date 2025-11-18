'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Loader2, XCircle, ArrowRight, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface SessionData {
  id: string
  status: string
  paymentStatus: string
  amountTotal: number
  currency: string
  customerEmail: string
  metadata: {
    credits: string
    packageId: string
    userId: string
  }
  created: number
}

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided')
      setLoading(false)
      return
    }

    const verifySession = async () => {
      try {
        const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify session')
        }

        setSessionData(data)
      } catch (err) {
        console.error('Session verification error:', err)
        setError(err instanceof Error ? err.message : 'Failed to verify payment')
      } finally {
        setLoading(false)
      }
    }

    verifySession()
  }, [sessionId])

  if (loading) {
    return (
      <div className="container-wide py-24">
        <div className="max-w-2xl mx-auto text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Verifying your payment...</h1>
          <p className="text-muted-foreground">Please wait while we confirm your purchase.</p>
        </div>
      </div>
    )
  }

  if (error || !sessionData) {
    return (
      <div className="container-wide py-24">
        <Card className="max-w-2xl mx-auto border-destructive">
          <CardHeader>
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-destructive" />
              <CardTitle className="text-2xl">Payment Verification Failed</CardTitle>
            </div>
            <CardDescription>
              We couldn't verify your payment at this time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              {error || 'Unknown error occurred'}
            </p>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link href="/pricing">Return to Pricing</Link>
              </Button>
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const credits = parseInt(sessionData.metadata.credits || '0')
  const amount = sessionData.amountTotal / 100
  const isPaid = sessionData.paymentStatus === 'paid'

  return (
    <div className="container-wide py-24">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Payment Successful!
          </h1>
          <p className="text-xl text-muted-foreground">
            Thank you for your purchase
          </p>
        </div>

        {/* Purchase Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Purchase Details
            </CardTitle>
            <CardDescription>
              Session ID: {sessionData.id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Credits Added</p>
                <p className="text-2xl font-bold text-primary">
                  {credits.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                <p className="text-2xl font-bold">
                  ${amount.toFixed(2)} {sessionData.currency.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge variant={isPaid ? 'default' : 'secondary'}>
                  {sessionData.paymentStatus.charAt(0).toUpperCase() + sessionData.paymentStatus.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Receipt</span>
                <span className="font-medium">{sessionData.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purchase Date</span>
                <span className="font-medium">
                  {new Date(sessionData.created * 1000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Your credits are now available to use across all our accessibility tools.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">1</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Start Testing</p>
                  <p className="text-sm text-muted-foreground">
                    Use our AI-powered tools to generate alt text, check color contrast, and audit your websites.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">2</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Track Your Usage</p>
                  <p className="text-sm text-muted-foreground">
                    View your credit balance and purchase history in your dashboard.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">3</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Get Support</p>
                  <p className="text-sm text-muted-foreground">
                    Need help? Our support team is ready to assist you.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/purchases">View Purchase History</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            A receipt has been sent to {sessionData.customerEmail}.
            If you have any questions, please{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

