import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { CreditCard, Download, Calendar, AlertCircle, CheckCircle, Clock, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Billing & Subscription | Accessibility.build",
  description: "Manage your subscription, view billing history, and update payment methods for your Accessibility.build account.",
  robots: {
    index: false,
    follow: false
  }
}

// Mock data - replace with actual database queries
const mockSubscription = {
  plan: "Pro",
  status: "active",
  currentPeriodStart: "2024-01-01",
  currentPeriodEnd: "2024-02-01",
  amount: 29,
  currency: "USD",
  interval: "month",
  cancelAtPeriodEnd: false
}

const mockInvoices = [
  {
    id: "inv_001",
    date: "2024-01-01",
    amount: 29,
    currency: "USD",
    status: "paid",
    description: "Pro Plan - Monthly",
    downloadUrl: "#"
  },
  {
    id: "inv_002", 
    date: "2023-12-01",
    amount: 29,
    currency: "USD",
    status: "paid",
    description: "Pro Plan - Monthly",
    downloadUrl: "#"
  },
  {
    id: "inv_003",
    date: "2023-11-01", 
    amount: 29,
    currency: "USD",
    status: "paid",
    description: "Pro Plan - Monthly",
    downloadUrl: "#"
  }
]

const mockPaymentMethod = {
  type: "card",
  brand: "visa",
  last4: "4242",
  expMonth: 12,
  expYear: 2025
}

export default async function BillingPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect("/sign-in")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'past_due':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'canceled':
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'past_due':
        return 'destructive'
      case 'canceled':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="container-wide py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your subscription, view billing history, and update payment methods.
          </p>
        </div>

        {/* Current Subscription */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Current Subscription
              <div className="flex items-center gap-2">
                {getStatusIcon(mockSubscription.status)}
                <Badge variant={getStatusColor(mockSubscription.status) as any}>
                  {mockSubscription.status.charAt(0).toUpperCase() + mockSubscription.status.slice(1)}
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              Your current plan and billing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">{mockSubscription.plan} Plan</h3>
                <p className="text-2xl font-bold mb-1">
                  ${mockSubscription.amount}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{mockSubscription.interval}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Billed {mockSubscription.interval}ly
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Billing Period</h3>
                <p className="text-sm">
                  {formatDate(mockSubscription.currentPeriodStart)} - {formatDate(mockSubscription.currentPeriodEnd)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Next billing date: {formatDate(mockSubscription.currentPeriodEnd)}
                </p>
              </div>
            </div>

            {mockSubscription.cancelAtPeriodEnd && (
              <Alert className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your subscription will be canceled at the end of the current billing period ({formatDate(mockSubscription.currentPeriodEnd)}).
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 mt-6">
              <Button variant="outline" asChild>
                <Link href="/pricing">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Link>
              </Button>
              <Button variant="outline">
                Update Payment Method
              </Button>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="payment" className="space-y-6">
          <TabsList>
            <TabsTrigger value="payment">Payment Method</TabsTrigger>
            <TabsTrigger value="history">Billing History</TabsTrigger>
            <TabsTrigger value="usage">Usage & Credits</TabsTrigger>
          </TabsList>

          {/* Payment Method */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Manage your default payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {mockPaymentMethod.brand.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        •••• •••• •••• {mockPaymentMethod.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {mockPaymentMethod.expMonth}/{mockPaymentMethod.expYear}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Default</Badge>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button variant="outline">
                    Update Card
                  </Button>
                  <Button variant="outline">
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing History */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View and download your past invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center h-10 w-10 bg-green-100 dark:bg-green-900/20 rounded-full">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">{invoice.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(invoice.date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">
                            ${invoice.amount} {invoice.currency.toUpperCase()}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage & Credits */}
          <TabsContent value="usage">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Credit Usage</CardTitle>
                  <CardDescription>
                    Your current month's credit consumption
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Credits Used</span>
                        <span className="text-sm text-muted-foreground">450 / 1,000</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Usage Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Alt Text Generation</span>
                          <span>320 credits</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Accessibility Audits</span>
                          <span>130 credits</span>
                        </div>
                        <div className="flex justify-between">
                          <span>API Calls</span>
                          <span>0 credits</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan Features</CardTitle>
                  <CardDescription>
                    What's included in your current plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">1,000 credits per month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">All accessibility tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Priority email support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">API access (basic)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Custom branding</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-6" asChild>
                    <Link href="/pricing">
                      View All Plans
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
