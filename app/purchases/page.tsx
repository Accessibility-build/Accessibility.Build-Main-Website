import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { CreditCard, Download, CheckCircle, XCircle, Clock, AlertCircle, Coins } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'
import { payments, creditPackages, users } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { formatAmount } from '@/lib/stripe'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Purchase History | Accessibility.build',
  description: 'View your credit package purchase history and transaction details.',
  robots: {
    index: false,
    follow: false,
  },
}

// Force dynamic rendering to avoid build-time Clerk initialization issues
export const dynamic = 'force-dynamic'

export default async function PurchasesPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Fetch user's current credit balance
  const [userRecord] = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1)

  // Fetch user's payment history
  const userPayments = await db
    .select({
      payment: payments,
      package: creditPackages,
    })
    .from(payments)
    .leftJoin(creditPackages, eq(payments.packageId, creditPackages.id))
    .where(eq(payments.userId, user.id))
    .orderBy(desc(payments.createdAt))

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'failed':
        return 'destructive'
      case 'cancelled':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="container-wide py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Purchase History</h1>
          </div>
          <p className="text-muted-foreground">
            View your credit package purchases and transaction history.
          </p>
        </div>

        {/* Current Balance Card */}
        {userRecord && (
          <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                    <p className="text-3xl font-bold">
                      {userRecord.credits.toLocaleString()} credits
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link href="/pricing">Buy More Credits</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Purchase History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              {userPayments.length === 0
                ? 'No purchases yet'
                : `${userPayments.length} transaction${userPayments.length !== 1 ? 's' : ''}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userPayments.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by purchasing a credit package to use our accessibility tools.
                </p>
                <Button asChild>
                  <Link href="/pricing">View Credit Packages</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {userPayments.map(({ payment, package: pkg }) => {
                  // Extract credits from package or payment metadata (for dynamic pricing)
                  const metadata = payment.paymentData as any
                  const credits = pkg?.credits || metadata?.credits || 0
                  const packageName = pkg?.name || (credits ? `${credits.toLocaleString()} Credits` : 'Credit Purchase')
                  
                  return (
                    <div
                      key={payment.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex items-center justify-center h-10 w-10 bg-primary/10 rounded-full flex-shrink-0">
                          {getStatusIcon(payment.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">
                              {packageName}
                            </p>
                            <Badge variant={getStatusColor(payment.status) as any}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(payment.createdAt)}
                          </p>
                          {payment.orderId && (
                            <p className="text-xs text-muted-foreground mt-1 font-mono">
                              {payment.orderId.slice(0, 24)}...
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {formatAmount(payment.amount, payment.currency)}
                          </p>
                          {credits > 0 && (
                            <p className="text-sm text-muted-foreground">
                              {credits.toLocaleString()} credits
                            </p>
                          )}
                        </div>
                        {payment.status === 'completed' && payment.paymentId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="flex-shrink-0"
                            title="View in Stripe Dashboard"
                          >
                            <a
                              href={`https://dashboard.stripe.com/payments/${payment.paymentId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Questions about your purchases or credits?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">How do credits work?</h4>
                <p className="text-sm text-muted-foreground">
                  Credits are used to access our AI-powered accessibility tools. Each tool
                  consumes a certain number of credits per use. Your credits never expire, so
                  you can use them at your own pace.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Need a refund?</h4>
                <p className="text-sm text-muted-foreground">
                  We offer a 30-day money-back guarantee. If you're not satisfied with your
                  purchase, contact us for a full refund.{' '}
                  <Link href="/refund" className="text-primary hover:underline">
                    View our refund policy
                  </Link>
                  .
                </p>
              </div>
              <div className="pt-4">
                <Button asChild variant="outline">
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

