import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ServiceHeroProps {
  title: string
  description: string
  cta: string
  ctaLink: string
  icon: LucideIcon
  gradientFrom: string
  gradientTo: string
  startingPrice: number
  delivery: string
}

export function ServiceHero({
  title,
  description,
  cta,
  ctaLink,
  icon: Icon,
  gradientFrom,
  gradientTo,
  startingPrice,
  delivery,
}: ServiceHeroProps) {
  return (
    <section className="relative mb-16 overflow-hidden rounded-lg border border-border/50 bg-muted/30">
      <div className="absolute inset-0 z-0 opacity-10 bg-grid-pattern-light dark:bg-grid-pattern-dark"></div>
      <div
        className="absolute top-0 left-0 right-0 h-32"
        style={{
          background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
          opacity: 0.2,
        }}
      ></div>

      <div className="relative z-10 px-6 py-16 md:py-24 md:px-12">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <Link
            href="/services"
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to All Services
          </Link>

          <div
            className="p-4 rounded-full mb-6 shadow-lg text-white"
            style={{
              background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
            }}
          >
            <Icon className="h-8 w-8" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">{description}</p>

          <dl className="mb-8 grid w-full max-w-lg grid-cols-2 border-y text-left">
            <div className="border-r px-4 py-4">
              <dt className="text-sm text-muted-foreground">Packages from</dt>
              <dd className="mt-1 text-2xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(startingPrice)}
              </dd>
            </div>
            <div className="px-4 py-4">
              <dt className="text-sm text-muted-foreground">Initial delivery</dt>
              <dd className="mt-1 font-semibold">{delivery}</dd>
            </div>
          </dl>

          <Button asChild size="lg" className="rounded-full">
            <Link href={ctaLink}>
              {cta}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
