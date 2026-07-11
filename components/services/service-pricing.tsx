import Link from "next/link"
import { ArrowRight, CalendarDays, Check, CircleDollarSign, Info, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ServicePricingConfig } from "@/lib/service-pricing"

interface ServicePricingProps {
  pricing: ServicePricingConfig
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price)
}

export function ServicePricing({ pricing }: ServicePricingProps) {
  return (
    <section className="py-16" aria-labelledby="service-pricing-heading">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase text-primary">Fixed project pricing</p>
        <h2 id="service-pricing-heading" className="mb-4 text-3xl font-bold">
          Packages, scope, and deliverables
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground">{pricing.intro}</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {pricing.tiers.map((tier) => (
          <article
            key={tier.slug}
            className={cn(
              "relative flex h-full flex-col rounded-lg border bg-background p-6 shadow-sm",
              tier.popular && "border-primary shadow-md ring-1 ring-primary/20",
            )}
          >
            {tier.popular && (
              <p className="mb-4 w-fit rounded bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                Most selected
              </p>
            )}

            <h3 className="text-xl font-bold">{tier.name}</h3>
            <p className="mt-2 min-h-12 text-sm text-muted-foreground">{tier.description}</p>

            <div className="mt-5 border-y py-5">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold tracking-normal">{formatPrice(tier.price)}</span>
                <span className="pb-1 text-sm text-muted-foreground">USD</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">One-time project price</p>
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="font-semibold">Best for</dt>
                <dd className="mt-1 text-muted-foreground">{tier.bestFor}</dd>
              </div>
              <div className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 h-4 w-4 flex-none text-primary" aria-hidden="true" />
                <div>
                  <dt className="font-semibold">Delivery</dt>
                  <dd className="mt-1 text-muted-foreground">{tier.timeline}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-6">
              <h4 className="text-sm font-semibold">Included scope</h4>
              <ul className="mt-3 space-y-2 text-sm">
                {tier.scope.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CircleDollarSign className="mt-0.5 h-4 w-4 flex-none text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex-1">
              <h4 className="text-sm font-semibold">You receive</h4>
              <ul className="mt-3 space-y-2 text-sm">
                {tier.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button asChild className="mt-7 w-full">
              <Link href={`/contact?service=${pricing.contactService}&package=${tier.slug}`}>
                Select {tier.name}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-lg border bg-muted/30 p-4 text-sm">
        <Info className="mt-0.5 h-5 w-5 flex-none text-primary" aria-hidden="true" />
        <p>
          <strong>How scope is counted:</strong> {pricing.scopeNote}
        </p>
      </div>

      <div className="mt-12">
        <div className="mb-5">
          <h3 className="text-2xl font-bold">Common add-ons</h3>
          <p className="mt-2 text-muted-foreground">Use these published unit prices when the standard package needs a little more scope.</p>
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <caption className="sr-only">Optional additions and prices for {pricing.service}</caption>
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Add-on</th>
                <th scope="col" className="px-5 py-3 font-semibold">Price</th>
                <th scope="col" className="px-5 py-3 font-semibold">What it adds</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pricing.addOns.map((addOn) => (
                <tr key={addOn.name}>
                  <th scope="row" className="px-5 py-4 font-medium">{addOn.name}</th>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-primary">{addOn.price}</td>
                  <td className="px-5 py-4 text-muted-foreground">{addOn.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 border-y py-8">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <ShieldCheck className="h-7 w-7 text-primary" aria-hidden="true" />
            <h3 className="mt-3 text-2xl font-bold">Commercial terms</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Clear terms keep the work predictable for both teams.
            </p>
          </div>
          <div>
            <ul className="space-y-3 text-sm">
              <li><strong>Payment:</strong> projects under $1,000 are paid at booking; larger projects are 50% at booking and 50% at delivery.</li>
              <li><strong>Currency:</strong> all published prices are in USD and exclude applicable taxes.</li>
              <li><strong>Scope:</strong> the selected package, add-ons, environments, and deliverables are confirmed in writing before kickoff.</li>
              {pricing.assumptions.map((assumption) => (
                <li key={assumption}>{assumption}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
