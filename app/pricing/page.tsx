import type { Metadata } from 'next'
import { Shield, Crown, AlertCircle, Check, Zap, Star } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { CreditSlider } from '@/components/pricing/credit-slider'
import { PRICING_TIERS } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Pricing | Accessibility.build - Pay Only for What You Use',
  description:
    'Simple, flexible pricing for accessibility testing. No subscriptions, no hidden fees. Buy exactly the credits you need with automatic volume discounts.',
  keywords: [
    'accessibility testing pricing',
    'WCAG compliance pricing',
    'accessibility audit pricing',
    'pay as you go accessibility',
    'accessibility credits',
    'flexible pricing',
    'volume discounts',
  ],
  openGraph: {
    title: 'Flexible Credit Pricing - Accessibility.build',
    description: 'Pay only for what you use. Buy any amount from 100 to 50,000 credits with automatic volume discounts.',
    type: 'website',
    url: 'https://accessibility.build/pricing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flexible Credit Pricing - Accessibility.build',
    description: 'Pay only for what you use. Automatic volume discounts up to 20% off.',
  },
  alternates: {
    canonical: 'https://accessibility.build/pricing'
  }
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>
}) {
  const params = await searchParams
  const canceled = params.canceled === 'true'

  return (
    <div className="container-wide py-16">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Simple, Flexible Pricing
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
          Buy exactly the credits you need. No fixed packages, no subscriptions, no commitments.
          Credits never expire and prices get better as you buy more.
        </p>
        
        {/* Canceled Payment Alert */}
        {canceled && (
          <Alert className="max-w-2xl mx-auto mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment Cancelled</AlertTitle>
            <AlertDescription>
              Your payment was cancelled. If you have any questions or need assistance, please contact our support team.
            </AlertDescription>
          </Alert>
        )}
        
        {/* No Subscription Promise */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-6 py-3">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Shield className="h-5 w-5" />
              <span className="font-medium">No Subscription Required</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Buy once, use forever. Credits never expire.
            </p>
          </div>
        </div>
      </div>

      {/* Credit Slider */}
      <div className="mb-16">
        <CreditSlider />
      </div>

      {/* Volume Discount Tiers */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Automatic Volume Discounts</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The more you buy, the more you save. Discounts are applied automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier, index) => (
            <Card key={index} className={tier.discount > 0 ? 'border-primary/50 bg-primary/5' : ''}>
              <CardContent className="pt-6 text-center">
                {tier.discount > 0 && (
                  <div className="mb-2">
                    <Badge className="bg-primary text-primary-foreground">
                      {tier.discount}% OFF
                    </Badge>
                  </div>
                )}
                <div className="text-lg font-bold mb-1">{tier.label}</div>
                <div className="text-sm text-muted-foreground mb-3">
                  {tier.minCredits.toLocaleString()}
                  {tier.maxCredits ? `–${tier.maxCredits.toLocaleString()}` : '+'} credits
                </div>
                <div className="text-2xl font-bold text-primary">
                  ${tier.pricePerCredit.toFixed(3)}
                </div>
                <div className="text-xs text-muted-foreground">per credit</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Everything Included</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All features available regardless of how many credits you buy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>All Tools Included</CardTitle>
              <CardDescription>
                Access every accessibility tool we offer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>AI-powered alt text generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Color contrast checker</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>WCAG 2.2 & 3.0 compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Full website audits</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Star className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Premium Features</CardTitle>
              <CardDescription>
                Advanced features for power users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Advanced reporting & PDF export</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>API access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Custom branding</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Priority processing</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Peace of Mind</CardTitle>
              <CardDescription>
                Your satisfaction is guaranteed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Credits never expire</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>30-day money-back guarantee</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Email support included</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Secure payment via Stripe</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div>
            <h3 className="font-semibold mb-2">How do credits work?</h3>
            <p className="text-sm text-muted-foreground">
              Credits are used to access our AI-powered tools. Different tools consume different amounts
              of credits based on their complexity. Your credits never expire, so use them at your own pace.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Do I get discounts automatically?</h3>
            <p className="text-sm text-muted-foreground">
              Yes! Volume discounts are applied automatically based on how many credits you purchase.
              Buy 1,000+ credits and save 5%, 5,000+ for 10% off, up to 20% off for 25,000+ credits.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Can I buy credits multiple times?</h3>
            <p className="text-sm text-muted-foreground">
              Absolutely! You can purchase credits as many times as you need. Your credit balance
              accumulates, and they never expire. Buy small amounts frequently or large amounts at once.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">What if I'm not satisfied?</h3>
            <p className="text-sm text-muted-foreground">
              We offer a 30-day money-back guarantee for all purchases. If you're not satisfied,
              contact us for a full refund. See our{' '}
              <Link href="/refund" className="text-primary hover:underline">
                refund policy
              </Link>{' '}
              for details.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Card className="max-w-3xl mx-auto border-primary/20">
          <CardContent className="p-12">
            <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Need Help Choosing?</h2>
            <p className="text-muted-foreground mb-6">
              Not sure how many credits you need? Start with 100 free credits when you sign up,
              or contact our team for a custom quote for larger projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="outline">
                <Link href="/sign-up">Get 100 Free Credits</Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
