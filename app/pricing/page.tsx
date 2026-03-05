import type { Metadata } from "next"
import { ArrowRight, Crown, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    <div className="container-wide py-16">
      <PricingAutoCheckout />

      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold">Simple, Transparent Pricing</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
          One-time credit packs with hosted Razorpay checkout. No recurring subscriptions, no hidden fees, and credits never expire.
        </p>
        {supportsInr && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <Button asChild variant={selectedCurrency === "USD" ? "default" : "outline"} size="sm">
              <Link href="/pricing?currency=USD">USD</Link>
            </Button>
            <Button asChild variant={selectedCurrency === "INR" ? "default" : "outline"} size="sm">
              <Link href="/pricing?currency=INR">INR</Link>
            </Button>
          </div>
        )}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-6 py-3">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Shield className="h-5 w-5" />
              <span className="font-medium">One-Time Purchases Only</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              {supportsInr
                ? "Buy credits in USD or INR and manage your history, receipts, and support actions in the Billing Center."
                : "Buy credits in USD and manage your history, receipts, and support actions in the Billing Center."}
            </p>
          </div>
        </div>
      </div>

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
          <h2 className="sr-only">Individual Pricing Plans</h2>
          <PricingTable tiers={individualPlans} />
        </TabsContent>

        <TabsContent value="teams">
          <h2 className="sr-only">Team and Enterprise Pricing Plans</h2>
          <PricingTable tiers={teamPlans} />
        </TabsContent>
      </Tabs>

      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">Credit Value Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {checkoutPacks.map((pack) => (
            <Card key={pack.key} className="border">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{pack.name}</p>
                  {pack.valueLabel && <Badge variant="secondary">{pack.valueLabel}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {pack.credits.toLocaleString()} credits • {formatCurrency(pack.amountCents, pack.currency)}
                </p>
                {pack.pricePerCreditCents !== null && (
                  <p className="text-sm text-muted-foreground">
                    {pack.pricePerCreditCents.toFixed(2)} cents per credit
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{pack.taxNote}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What are credits and how do they work?</h3>
              <p className="text-muted-foreground">
                Credits are used for premium accessibility workflows such as AI-assisted analysis. Free tools like the
                contrast checker stay available without credits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do credits expire?</h3>
              <p className="text-muted-foreground">
                No. Purchased credits do not expire, so you can use them at your own pace.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                Yes. Refund requests follow our published refund policy, and approved refunds are processed through
                Razorpay to the original payment method.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Can I try before I buy?</h3>
              <p className="text-muted-foreground">
                Yes. New accounts start with 100 free credits so you can evaluate the platform before purchasing.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Which payment methods are supported?</h3>
              <p className="text-muted-foreground">
                Razorpay checkout supports cards and region-available payment methods. Payment history, receipts,
                and billing support actions are available in your Billing Center.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer enterprise procurement support?</h3>
              <p className="text-muted-foreground">
                Yes. Enterprise plans remain sales-led for custom procurement, invoicing, and contract requirements.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-12">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start with 100 free credits, then purchase the one-time pack that matches your current workload.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/sign-up">
                  Get 100 Free Credits
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
