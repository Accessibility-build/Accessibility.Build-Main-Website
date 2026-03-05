import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { CheckoutButton } from "@/components/billing/checkout-button"
import type { CheckoutCatalogKey, CheckoutCurrency } from "@/lib/billing/types"

interface PricingTier {
  name: string
  description: string
  features: string[]
  cta: string
  link: string
  catalogKey?: CheckoutCatalogKey
  popular?: boolean
  credits?: number
  amountCents?: number
  currency?: string
  priceLabel?: string
  valueLabel?: string | null
  taxNote?: string
  checkoutCurrency?: CheckoutCurrency
}

interface PricingTableProps {
  tiers: PricingTier[]
}

function formatPrice(tier: PricingTier) {
  if (tier.priceLabel) {
    return tier.priceLabel
  }

  if (typeof tier.amountCents !== "number" || !tier.currency) {
    return ""
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: tier.currency || "USD",
    minimumFractionDigits: 2,
  }).format((tier.amountCents || 0) / 100)
}

export function PricingTable({ tiers }: PricingTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {tiers.map((tier, index) => (
        <div
          key={index}
          className={cn(
            "rounded-2xl border p-8 flex flex-col h-full",
            tier.popular ? "border-primary/50 bg-primary/5 shadow-lg relative" : "border-border bg-background",
          )}
        >
          {tier.popular && (
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
              Popular
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
            <div className="flex items-baseline mb-1">
              <span className="text-3xl font-bold">{formatPrice(tier)}</span>
            </div>
            {typeof tier.credits === "number" && tier.credits > 0 && (
              <p className="text-sm text-muted-foreground">{tier.credits.toLocaleString()} credits</p>
            )}
            {tier.valueLabel && (
              <p className="text-xs text-green-700 dark:text-green-400 mt-2">{tier.valueLabel}</p>
            )}
            <p className="text-muted-foreground mt-3">{tier.description}</p>
            {tier.taxNote && <p className="text-xs text-muted-foreground mt-2">{tier.taxNote}</p>}
          </div>

          <ul className="space-y-3 mb-8 flex-grow">
            {tier.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {tier.catalogKey ? (
            <CheckoutButton
              catalogKey={tier.catalogKey}
              currency={tier.checkoutCurrency}
              variant={tier.popular ? "default" : "outline"}
              className="rounded-full w-full mt-auto"
            >
              {tier.cta}
            </CheckoutButton>
          ) : (
            <Button asChild variant={tier.popular ? "default" : "outline"} className="rounded-full w-full mt-auto">
              <Link href={tier.link}>{tier.cta}</Link>
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
