import type { Metadata } from "next"
import { ArrowRight, Coins, Crown, HelpCircle, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"
import { PricingTable } from "@/components/services/pricing-table"
import { PricingAutoCheckout } from "@/components/billing/pricing-auto-checkout"
import { getCatalogPresentationPacks } from "@/lib/billing/catalog"
import { getUsdToInrQuote } from "@/lib/billing/fx"
import {
  getBillingCurrencyPolicyFromHeaders,
  sanitizeCheckoutCurrencyForPolicy,
} from "@/lib/billing/region"
import type { CheckoutCatalogKey } from "@/lib/billing/types"

export const metadata: Metadata = {
  title: "Credit Packages | Accessibility.build - One-Time Credit Packs",
  description:
    "Simple one-time credit packs for accessibility testing. No recurring subscriptions and no hidden fees.",
  keywords: [
    "accessibility testing pricing",
    "WCAG compliance pricing",
    "one-time credit packs",
    "accessibility credits",
    "razorpay checkout accessibility tools",
  ],
  openGraph: {
    title: "Credit Packages - Accessibility.build",
    description: "One-time credit packs with hosted Razorpay checkout and in-app billing management.",
    type: "website",
    url: "https://accessibility.build/pricing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Credit Packages - Accessibility.build",
    description: "One-time credit packs with no recurring subscriptions.",
  },
  alternates: {
    canonical: "https://accessibility.build/pricing",
  },
}

function formatCurrency(amountCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
  }).format((amountCents || 0) / 100)
}

type PricingPageProps = {
  searchParams?: Promise<{ currency?: string }>
}

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const regionPolicy = await getBillingCurrencyPolicyFromHeaders()
  const selectedCurrency = sanitizeCheckoutCurrencyForPolicy(
    resolvedSearchParams?.currency,
    regionPolicy
  )
  const supportsInr = regionPolicy.allowInr
  const fxQuote = await getUsdToInrQuote()
  const catalog = getCatalogPresentationPacks({
    includeEnterprise: true,
    currency: selectedCurrency,
    usdToInrRate: fxQuote.usdToInr,
  })

  const individualPlans = [
    {
      name: "Free Starter",
      description: "Start with free credits and no payment required",
      features: [
        "100 free credits on signup",
        "Color contrast checker (unlimited use)",
        "Basic accessibility tools",
        "Community support",
      ],
      cta: "Get Started Free",
      link: "/sign-up",
      priceLabel: selectedCurrency === "INR" ? "₹0" : "$0",
      popular: false,
    },
    ...catalog
      .filter((pack) => !pack.isTeamPlan && pack.key !== "enterprise_contact")
      .map((pack) => ({
        name: pack.name,
        description: pack.description,
        features: pack.features,
        cta: pack.ctaLabel,
        link: "/pricing",
        catalogKey: pack.key as CheckoutCatalogKey,
        popular: pack.isPopular,
        credits: pack.credits,
        amountCents: pack.amountCents,
        currency: pack.currency,
        valueLabel: pack.valueLabel,
        taxNote: pack.taxNote,
        checkoutCurrency: selectedCurrency,
      })),
  ]

  const teamPlans = catalog
    .filter((pack) => pack.isTeamPlan)
    .map((pack) => {
      const isEnterprise = pack.key === "enterprise_contact"

      return {
        name: pack.name,
        description: pack.description,
        features: pack.features,
        cta: isEnterprise ? "Contact Sales" : pack.ctaLabel,
        link: isEnterprise ? "/contact?plan=enterprise" : "/pricing",
        catalogKey: isEnterprise ? undefined : (pack.key as CheckoutCatalogKey),
        popular: pack.isPopular,
        credits: pack.credits > 0 ? pack.credits : undefined,
        amountCents: isEnterprise ? undefined : pack.amountCents,
        currency: isEnterprise ? undefined : pack.currency,
        priceLabel: isEnterprise ? "Custom" : undefined,
        valueLabel: isEnterprise ? null : pack.valueLabel,
        taxNote: isEnterprise ? undefined : pack.taxNote,
        checkoutCurrency: selectedCurrency,
      }
    })

  const checkoutPacks = catalog.filter((pack) => pack.checkoutEnabled)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container-wide py-16 relative">
          <PricingAutoCheckout />

          {/* Hero */}
          <div className="text-center mb-16">
            <div className="flex flex-col items-center mb-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Crown className="h-4 w-4" />
                One-Time Credit Packs
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
                Simple, Transparent Pricing
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              One-time credit packs with hosted Razorpay checkout. No recurring subscriptions, no hidden fees, and credits never expire.
            </p>

            {supportsInr && (
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-full">
                  <Button asChild variant={selectedCurrency === "USD" ? "default" : "ghost"} size="sm" className="rounded-full px-5">
                    <Link href="/pricing?currency=USD">USD ($)</Link>
                  </Button>
                  <Button asChild variant={selectedCurrency === "INR" ? "default" : "ghost"} size="sm" className="rounded-full px-5">
                    <Link href="/pricing?currency=INR">INR (&#8377;)</Link>
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl px-6 py-4 shadow-sm">
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-xl flex-shrink-0">
                  <Shield className="h-5 w-5 text-green-700 dark:text-green-300" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-green-700 dark:text-green-300 block">One-Time Purchases Only</span>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-0.5">
                    {supportsInr
                      ? "Buy credits in USD or INR. Manage history, receipts, and support in the Billing Center."
                      : "Buy credits in USD. Manage history, receipts, and support in the Billing Center."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Tabs */}
          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 h-12 p-1.5 bg-muted/80 rounded-full">
              <TabsTrigger value="individual" className="flex items-center gap-2 rounded-full data-[state=active]:shadow-md">
                <Users className="h-4 w-4" />
                Individual Packs
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-2 rounded-full data-[state=active]:shadow-md">
                <Shield className="h-4 w-4" />
                Team & Enterprise
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual">
              <h2 className="sr-only">Individual Pricing Plans</h2>
              <PricingTable tiers={individualPlans} />
            </TabsContent>

            <TabsContent value="teams">
              <h2 className="sr-only">Team and Enterprise Pricing Plans</h2>
              <PricingTable tiers={teamPlans} />
            </TabsContent>
          </Tabs>

          {/* Credit Value Snapshot */}
          <div className="mt-20">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Credit Value Snapshot</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">Compare value across our credit pack tiers</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {checkoutPacks.map((pack) => (
                <Card key={pack.key} className="border hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-xl">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-lg">{pack.name}</p>
                      {pack.valueLabel && (
                        <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                          {pack.valueLabel}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{formatCurrency(pack.amountCents, pack.currency)}</span>
                      <span className="text-sm text-muted-foreground">for {pack.credits.toLocaleString()} credits</span>
                    </div>
                    {pack.pricePerCreditCents !== null && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                        <span className="font-medium text-foreground">{pack.pricePerCreditCents.toFixed(2)}c</span>
                        <span>per credit</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">{pack.taxNote}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              </div>
              <p className="text-muted-foreground">Everything you need to know about our credit system</p>
            </div>
            <Card className="rounded-2xl">
              <CardContent className="p-6 md:p-8">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="what-are-credits">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      What are credits and how do they work?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Credits are used for premium accessibility workflows such as AI-assisted analysis. Free tools like the
                      contrast checker stay available without credits.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="credits-expire">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      Do credits expire?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      No. Purchased credits do not expire, so you can use them at your own pace.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="refunds">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      Do you offer refunds?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Yes. Refund requests follow our published refund policy, and approved refunds are processed through
                      Razorpay to the original payment method.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="try-before-buy">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      Can I try before I buy?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Yes. New accounts start with 100 free credits so you can evaluate the platform before purchasing.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="payment-methods">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      Which payment methods are supported?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Razorpay checkout supports cards and region-available payment methods. Payment history, receipts,
                      and billing support actions are available in your Billing Center.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="enterprise" className="border-b-0">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      Do you offer enterprise procurement support?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Yes. Enterprise plans remain sales-led for custom procurement, invoicing, and contract requirements.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="mt-20">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-10 md:p-12 border border-primary/20 shadow-sm">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <ArrowRight className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                  Start with 100 free credits, then purchase the one-time pack that matches your current workload.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="rounded-full px-8">
                    <Link href="/sign-up">
                      Get 100 Free Credits
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="rounded-full px-8">
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
