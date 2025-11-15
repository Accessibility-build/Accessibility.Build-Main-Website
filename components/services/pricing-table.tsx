import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PricingTier {
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  link: string
  popular?: boolean
}

interface PricingTableProps {
  tiers: PricingTier[]
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
            <div className="flex items-baseline mb-2">
              <span className="text-3xl font-bold">{tier.price}</span>
            </div>
            <p className="text-muted-foreground">{tier.description}</p>
          </div>

          <ul className="space-y-3 mb-8 flex-grow">
            {tier.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button asChild variant={tier.popular ? "default" : "outline"} className="rounded-full w-full mt-auto">
            <Link href={tier.link}>{tier.cta}</Link>
          </Button>
        </div>
      ))}
    </div>
  )
}
