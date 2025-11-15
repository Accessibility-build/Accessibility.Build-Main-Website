import { Check, ArrowRight, Info, FileText, Users, Code, Palette, TestTube, ClipboardCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Accessibility Services | Accessibility.build",
  description:
    "Professional audits, training, and remediation services to help make your websites and apps inclusive and legally compliant. Let our experts guide your team toward accessibility success.",
}

const services = [
  {
    title: "Accessibility Audits",
    description: "Comprehensive evaluation of your website or application",
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
    cta: "Request an Audit",
    link: "/contact?service=audit",
    detailLink: "/services/accessibility-audits",
  },
  {
    title: "Accessibility Training",
    description: "Empower your team with accessibility knowledge",
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
    cta: "Book Training",
    link: "/contact?service=training",
    detailLink: "/services/accessibility-training",
  },
  {
    title: "Remediation Support",
    description: "Expert help to fix accessibility issues",
    icon: Code,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    features: ["Code-level fixes", "Design pattern recommendations", "Content remediation", "Validation testing"],
    cta: "Get Support",
    link: "/contact?service=remediation",
    detailLink: "/services/remediation-support",
  },
  {
    title: "Accessible Design Reviews",
    description: "Ensure accessibility from the start",
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
    cta: "Request Review",
    link: "/contact?service=design-review",
    detailLink: "/services/design-reviews",
  },
  {
    title: "User Testing",
    description: "Real-world validation with diverse users",
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
    cta: "Schedule Testing",
    link: "/contact?service=user-testing",
    detailLink: "/services/user-testing",
  },
  {
    title: "Compliance Documentation",
    description: "Support for legal and regulatory requirements",
    icon: ClipboardCheck,
    color: "from-cyan-500 to-sky-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    borderColor: "border-cyan-200 dark:border-cyan-800",
    features: ["Accessibility statements", "VPAT creation", "Conformance documentation", "Remediation roadmaps"],
    cta: "Get Documentation",
    link: "/contact?service=documentation",
    detailLink: "/services/compliance-documentation",
  },
]

export default function ServicesPage() {
  return (
    <div className="container-wide py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Our Accessibility Services</h1>
        <p className="text-xl text-muted-foreground">
          Professional services to help make your digital products inclusive, compliant, and accessible to all users.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {services.map((service, index) => {
          const IconComponent = service.icon
          return (
            <div
              key={index}
              className={cn(
                "group relative bg-background rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300",
                service.borderColor,
              )}
            >
              <div className={cn("h-24 relative", service.bgColor)}>
                <div className="absolute inset-0 opacity-20 bg-grid-pattern-light dark:bg-grid-pattern-dark" />
                <div className="absolute -bottom-10 right-8">
                  <div
                    className={cn(
                      "w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center",
                      service.color,
                    )}
                  >
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-6 pt-12 relative">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold">{service.title}</h2>
                  <Link
                    href={service.detailLink}
                    className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm font-medium"
                    aria-label={`Learn more about ${service.title}`}
                  >
                    <Info className="h-4 w-4" />
                    <span>Know More</span>
                  </Link>
                </div>
                <p className="text-muted-foreground mb-4">{service.description}</p>

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
                    <Link href={service.link} className="flex items-center justify-center">
                      {service.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="rounded-full flex-1">
                    <Link
                      href={service.detailLink}
                      className="flex items-center justify-center"
                      aria-label={`View details about ${service.title}`}
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="max-w-4xl mx-auto bg-primary/5 rounded-2xl p-8 border border-primary/20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Need a Custom Solution?</h2>
          <p className="text-muted-foreground">
            We offer tailored accessibility services to meet your organization's specific needs.
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
