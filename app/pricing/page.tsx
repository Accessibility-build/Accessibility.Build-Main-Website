import type { Metadata } from "next"
import { Check, Star, Zap, Shield, Users, Crown, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { PricingTable } from "@/components/services/pricing-table"

export const metadata: Metadata = {
  title: "Credit Packages | Accessibility.build - Pay-as-You-Go Accessibility Testing",
  description:
    "Simple, transparent credit packages for accessibility testing. No subscriptions, no hidden fees. Pay only for what you use with credits that never expire.",
  keywords: [
    "accessibility testing pricing",
    "WCAG compliance pricing",
    "accessibility audit pricing",
    "pay as you go accessibility",
    "accessibility credits",
    "no subscription accessibility tools",
    "WCAG testing cost",
    "accessibility compliance pricing"
  ],
  openGraph: {
    title: "Credit Packages - Pay-as-You-Go Accessibility Testing",
    description: "No subscriptions, no hidden fees. Pay only for what you use with credits that never expire.",
    type: "website",
    url: "https://accessibility.build/pricing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Credit Packages - Pay-as-You-Go Accessibility Testing",
    description: "No subscriptions, no hidden fees. Pay only for what you use with credits that never expire.",
  },
  alternates: {
    canonical: "https://accessibility.build/pricing"
  }
}

const individualPlans = [
  {
    name: "Starter Pack",
    price: "$0",
    description: "Perfect for getting started with accessibility testing",
    features: [
      "100 free credits on signup",
      "Color contrast checker (unlimited)",
      "Basic accessibility tools",
      "Community support",
      "WCAG 2.2 & 3.0 compliance checking",
      "Export results as PDF"
    ],
    cta: "Get Started Free",
    link: "/sign-up",
    popular: false
  },
  {
    name: "Credit Pack - Small",
    price: "$19",
    description: "500 credits - perfect for individual projects",
    features: [
      "500 credits (never expire)",
      "All accessibility tools",
      "AI-powered alt text generation",
      "Advanced reporting",
      "Priority email support",
      "API access (basic)",
      "Custom branding on reports",
      "Pay once, use anytime"
    ],
    cta: "Buy Credits",
    link: "/sign-up?credits=500",
    popular: true
  },
  {
    name: "Credit Pack - Large",
    price: "$89",
    description: "2,500 credits - great for agencies and teams",
    features: [
      "2,500 credits (never expire)",
      "Everything in Small Pack",
      "Team collaboration tools",
      "Advanced API access",
      "White-label solutions",
      "Phone & chat support",
      "Custom integrations",
      "Bulk testing capabilities",
      "Priority processing"
    ],
    cta: "Buy Credits",
    link: "/sign-up?credits=2500",
    popular: false
  }
]

const teamPlans = [
  {
    name: "Team Pack - Medium",
    price: "$299",
    description: "5,000 credits - perfect for small development teams",
    features: [
      "5,000 credits (never expire)",
      "Up to 10 team members",
      "All individual features",
      "Team dashboard",
      "Role-based permissions",
      "Shared projects",
      "Team analytics",
      "Dedicated account manager"
    ],
    cta: "Buy Team Credits",
    link: "/contact?credits=5000",
    popular: false
  },
  {
    name: "Team Pack - Large",
    price: "$799",
    description: "15,000 credits - for established development teams",
    features: [
      "15,000 credits (never expire)",
      "Up to 25 team members",
      "Everything in Medium Pack",
      "Advanced workflow automation",
      "Custom compliance templates",
      "SSO integration",
      "Advanced analytics",
      "Priority support"
    ],
    cta: "Buy Team Credits",
    link: "/contact?credits=15000",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Custom credit packages for large organizations",
    features: [
      "Custom credit packages",
      "Unlimited team members",
      "Everything in Large Pack",
      "Custom deployment options",
      "On-premise installation",
      "24/7 dedicated support",
      "Custom training programs",
      "SLA guarantees",
      "Volume discounts available"
    ],
    cta: "Contact Sales",
    link: "/contact?plan=enterprise",
    popular: false
  }
]

export default function PricingPage() {
  return (
    <div className="container-wide py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Simple, Transparent Pricing
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
          Pay only for what you use. No subscriptions, no hidden fees, no long-term commitments.
          All plans include our core accessibility testing tools and WCAG compliance features.
        </p>
        
        {/* No Subscription Promise */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-6 py-3">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Shield className="h-5 w-5" />
              <span className="font-medium">No Subscription Traps</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Worry not, we won't trap you in a subscription cycle. Just pay for what you want to use.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Tables */}
      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Individual Packs
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Team & Enterprise
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual">
          <PricingTable tiers={individualPlans} />
        </TabsContent>

        <TabsContent value="teams">
          <PricingTable tiers={teamPlans} />
        </TabsContent>
      </Tabs>

      {/* Features Comparison */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Compare All Features
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold">Features</th>
                <th className="text-center p-4 font-semibold">Free</th>
                <th className="text-center p-4 font-semibold">Pro</th>
                <th className="text-center p-4 font-semibold">Business</th>
                <th className="text-center p-4 font-semibold">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4">Credits Included</td>
                <td className="text-center p-4">100 (free)</td>
                <td className="text-center p-4">500 (never expire)</td>
                <td className="text-center p-4">2,500 (never expire)</td>
                <td className="text-center p-4">Custom packages</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Color Contrast Checker</td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-b">
                <td className="p-4">AI Alt Text Generation</td>
                <td className="text-center p-4">Limited</td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-b">
                <td className="p-4">API Access</td>
                <td className="text-center p-4">-</td>
                <td className="text-center p-4">Basic</td>
                <td className="text-center p-4">Advanced</td>
                <td className="text-center p-4">Full</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Team Collaboration</td>
                <td className="text-center p-4">-</td>
                <td className="text-center p-4">-</td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Priority Support</td>
                <td className="text-center p-4">-</td>
                <td className="text-center p-4">Email</td>
                <td className="text-center p-4">Phone & Chat</td>
                <td className="text-center p-4">24/7 Dedicated</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Custom Branding</td>
                <td className="text-center p-4">-</td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What are credits and how do they work?</h3>
              <p className="text-muted-foreground">
                Credits are used to access our AI-powered tools like alt text generation and advanced accessibility audits. 
                Basic tools like the contrast checker are always free and don't require credits.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Do credits expire?</h3>
              <p className="text-muted-foreground">
                No! Once you purchase credits, they never expire. Use them at your own pace without 
                worrying about monthly deadlines or losing unused credits.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                We offer a 30-day money-back guarantee for all credit purchases. If you're not satisfied, 
                contact us for a full refund within 30 days of purchase. For complete details, please see our{" "}
                <Link href="/refund" className="text-primary hover:underline font-medium">Cancellation & Refund Policy</Link>.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Can I try before I buy?</h3>
              <p className="text-muted-foreground">
                Absolutely! You get 100 free credits when you sign up. No credit card required. 
                This lets you test all our tools and see the value before purchasing more credits.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans. 
                All payments are processed securely through Stripe.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Do you offer volume discounts?</h3>
              <p className="text-muted-foreground">
                Yes! We offer custom pricing for large organizations and educational institutions. 
                Contact our sales team to discuss volume discounts and custom solutions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
            </div>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers and organizations who trust Accessibility.build 
              for their accessibility testing needs. Start with 100 free credits today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/sign-up">
                  Get 100 Free Credits
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
