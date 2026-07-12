import { Check, ArrowRight, FileText, Users, Code, Palette, TestTube, ClipboardCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IconShell } from "@/components/ui/icon-shell"
import { ServiceStructuredData } from "@/components/seo/structured-data"
import { serviceStartingPrices } from "@/lib/service-pricing"

const pageDescription =
  "Fixed-price accessibility audits, remediation, design reviews, training, disabled user testing, and compliance documentation with published scope and delivery."

export const metadata = {
  title: "Accessibility Services",
  description: pageDescription,
  keywords: [
    "accessibility services pricing",
    "WCAG consulting",
    "accessibility audit services",
    "accessibility remediation",
    "VPAT services",
  ],
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    title: "Accessibility Services",
    description: pageDescription,
    url: "/services",
    images: [
      {
        url: "/api/og?title=Accessibility%20Services&section=Services",
        width: 1200,
        height: 630,
        alt: "Accessibility Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Services",
    description: pageDescription,
    images: ["/api/og?title=Accessibility%20Services&section=Services"],
  },
}

const services = [
  {
    title: "Accessibility Audits",
    description: "Comprehensive evaluation of your website or application",
    startingPrice: serviceStartingPrices.audits,
    delivery: "7-10 business days",
    icon: FileText,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    features: [
      "WCAG 2.2 compliance assessment",
      "Detailed issue reporting",
      "Prioritized remediation plan",
      "Executive summary for stakeholders",
    ],
    cta: "Discuss Scope",
    link: "/contact?service=audit",
    detailLink: "/services/accessibility-audits",
  },
  {
    title: "Accessibility Training",
    description: "Empower your team with accessibility knowledge",
    startingPrice: serviceStartingPrices.training,
    delivery: "90-minute session",
    icon: Users,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    features: [
      "Customized workshops",
      "Role-specific training (design, development, content)",
      "Hands-on exercises",
      "Ongoing support and resources",
    ],
    cta: "Discuss Training",
    link: "/contact?service=training",
    detailLink: "/services/accessibility-training",
  },
  {
    title: "Remediation Support",
    description: "Expert help to fix accessibility issues",
    startingPrice: serviceStartingPrices.remediation,
    delivery: "1-2 weeks",
    icon: Code,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    features: ["Code-level fixes", "Design pattern recommendations", "Content remediation", "Validation testing"],
    cta: "Discuss Remediation",
    link: "/contact?service=remediation",
    detailLink: "/services/remediation-support",
  },
  {
    title: "Accessible Design Reviews",
    description: "Ensure accessibility from the start",
    startingPrice: serviceStartingPrices.designReviews,
    delivery: "3-5 business days",
    icon: Palette,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    features: [
      "Design system evaluation",
      "Wireframe and mockup reviews",
      "Color contrast analysis",
      "Interaction pattern recommendations",
    ],
    cta: "Discuss a Review",
    link: "/contact?service=design-review",
    detailLink: "/services/design-reviews",
  },
  {
    title: "User Testing",
    description: "Real-world validation with diverse users",
    startingPrice: serviceStartingPrices.userTesting,
    delivery: "2-3 weeks",
    icon: TestTube,
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    borderColor: "border-rose-200 dark:border-rose-800",
    features: [
      "Testing with assistive technology users",
      "Diverse participant recruitment",
      "Detailed findings report",
      "Actionable recommendations",
    ],
    cta: "Discuss Testing",
    link: "/contact?service=user-testing",
    detailLink: "/services/user-testing",
  },
  {
    title: "Compliance Documentation",
    description: "Support for legal and regulatory requirements",
    startingPrice: serviceStartingPrices.documentation,
    delivery: "5 business days",
    icon: ClipboardCheck,
    color: "from-cyan-500 to-sky-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    borderColor: "border-cyan-200 dark:border-cyan-800",
    features: ["Accessibility statements", "VPAT creation", "Conformance documentation", "Remediation roadmaps"],
    cta: "Discuss Documentation",
    link: "/contact?service=documentation",
    detailLink: "/services/compliance-documentation",
  },
]

export default function ServicesPage() {
  return (
    <div className="container-wide py-12 px-4 sm:px-6">
      <ServiceStructuredData
        name="Accessibility Services"
        description={pageDescription}
        serviceType="Digital Accessibility Consulting"
        url="https://accessibility.build/services"
        areaServed={["Worldwide"]}
        serviceOutput="Scoped accessibility audit, remediation, design review, training, user research, or compliance documentation engagement"
      />
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="mb-3 text-sm font-semibold uppercase text-primary">Founder-led professional services</p>
        <h1 className="text-4xl font-bold mb-4">Accessibility services with defined scope</h1>
        <p className="text-xl text-muted-foreground">
          Fixed-scope services with published prices, delivery windows, and concrete deliverables for every engagement.
        </p>
      </div>

      <section className="mb-16 grid gap-6 border-y py-8 md:grid-cols-4" aria-label="Service evidence">
        {[
          { label: "Named practitioner", value: "Khushwant Parihar", href: "/authors/khushwant-parihar" },
          { label: "Delivery process", value: "Published methodology", href: "/methodology" },
          { label: "Report quality", value: "Inspect a sample", href: "/sample-audit-report" },
          { label: "Buyer review", value: "Procurement centre", href: "/procurement" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="border-t pt-4 md:border-t-0 md:border-l md:pl-5 first:md:border-l-0 first:md:pl-0">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-1 font-semibold text-primary">{item.value}</p>
          </Link>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {services.map((service, index) => {
          const IconComponent = service.icon
          return (
            <div
              key={index}
              className={cn(
                "group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-shadow duration-200 hover:shadow-md",
                service.borderColor,
              )}
            >
              <div className={cn("h-24 relative", service.bgColor)}>
                <div className="absolute inset-0 opacity-20 bg-grid-pattern-light dark:bg-grid-pattern-dark" />
                <div className="absolute -bottom-10 right-8">
                  <IconShell
                    icon={IconComponent}
                    size="xl"
                    tone="hero"
                    className={cn("rounded-full", `bg-gradient-to-br ${service.color}`)}
                  />
                </div>
              </div>

              <div className="p-6 pt-12 relative">
                <h2 className="mb-2 text-2xl font-bold">{service.title}</h2>
                <p className="text-muted-foreground">{service.description}</p>
                <div className="my-5 grid grid-cols-2 gap-4 border-y py-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Packages from</p>
                    <p className="mt-1 text-xl font-bold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(service.startingPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Initial delivery</p>
                    <p className="mt-1 font-semibold">{service.delivery}</p>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="rounded-full flex-1">
                    <Link href={service.detailLink} className="flex items-center justify-center">
                      View Packages
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="rounded-full flex-1">
                    <Link
                      href={service.link}
                      className="flex items-center justify-center"
                      aria-label={`${service.cta} for ${service.title}`}
                    >
                      {service.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mx-auto max-w-4xl rounded-lg border border-primary/20 bg-primary/5 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Need More Than a Standard Package?</h2>
          <p className="text-muted-foreground">
            Send us the pages, flows, participants, or deliverables you need. We will price additional scope from the
            published units on each service page and confirm the project total before kickoff.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="default" className="rounded-full">
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/about">Learn About Our Approach</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
