import Link from "next/link"
import {
  ArrowRight,
  ShoppingCart,
  HeartPulse,
  GraduationCap,
  Landmark,
  Scale,
  FileSearch,
  ClipboardCheck,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IconShell } from "@/components/ui/icon-shell"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"

export const metadata = {
  title: "Accessibility by Industry",
  description:
    "See how accessibility law and WCAG apply to your industry. Practical compliance guides for e-commerce, healthcare, education, and government digital teams.",
  alternates: { canonical: "/industries" },
  openGraph: {
    type: "website",
    title: "Accessibility by Industry",
    description:
      "See how accessibility law and WCAG apply to your industry. Practical compliance guides for e-commerce, healthcare, education, and government digital teams.",
    url: "/industries",
    images: [
      {
        url: "/api/og?title=Accessibility%20by%20Industry&section=Industries",
        width: 1200,
        height: 630,
        alt: "Accessibility by Industry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility by Industry",
    description:
      "See how accessibility law and WCAG apply to your industry. Practical compliance guides for e-commerce, healthcare, education, and government digital teams.",
    images: ["/api/og?title=Accessibility%20by%20Industry&section=Industries"],
  },
}

const industries = [
  {
    title: "E-commerce & Retail",
    href: "/industries/ecommerce",
    icon: ShoppingCart,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    description:
      "Online stores are the most-sued sector in digital accessibility — roughly 70% of all web accessibility lawsuits target e-commerce and retail.",
    highlights: [
      "ADA Title III, California Unruh Act, and New York venue risk",
      "Product image alt text, checkout forms, and filter navigation",
      "European Accessibility Act obligations for EU sales",
    ],
  },
  {
    title: "Healthcare",
    href: "/industries/healthcare",
    icon: HeartPulse,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    description:
      "Patient portals, telehealth, and intake forms now sit under some of the strictest accessibility rules in US law, including the HHS Section 504 web rule.",
    highlights: [
      "ADA, Section 1557 of the ACA, and the Section 504 web rule",
      "The May 11, 2026 WCAG 2.1 AA deadline has already passed",
      "Forms, medical PDFs, and telehealth video are the top risks",
    ],
  },
  {
    title: "Education & EdTech",
    href: "/industries/education",
    icon: GraduationCap,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    description:
      "The DOJ's ADA Title II rule sets hard WCAG 2.1 AA deadlines for public schools and universities, while OCR complaints keep pressure on every campus.",
    highlights: [
      "Title II deadlines, Section 504, and OCR enforcement",
      "LMS content, course documents, and video captions",
      "Vendor and edtech procurement accessibility",
    ],
  },
  {
    title: "Government",
    href: "/industries/government",
    icon: Landmark,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    description:
      "Section 508 binds federal agencies, and the ADA Title II web rule now gives state and local governments enforceable WCAG deadlines of their own.",
    highlights: [
      "Section 508 for federal, Title II rule for state and local",
      "PDF backlogs, online forms, and legacy systems",
      "Procurement, VPATs, and vendor accountability",
    ],
  },
]

const crossCuttingResources = [
  {
    title: "WCAG 2.2 Checklist",
    href: "/checklists/wcag-2-2",
    icon: ClipboardCheck,
    description: "Work through every success criterion with a practical, plain-language checklist.",
  },
  {
    title: "Accessibility Audits",
    href: "/services/accessibility-audits",
    icon: FileSearch,
    description: "Professional WCAG 2.2 audits with prioritized remediation plans for any industry.",
  },
  {
    title: "Lawsuit Tracker",
    href: "/research/accessibility-lawsuits",
    icon: Scale,
    description: "Current data on digital accessibility litigation — filings, venues, and industry breakdowns.",
  },
  {
    title: "Compliance Hub",
    href: "/compliance/ada",
    icon: BookOpen,
    description: "Deep dives on the ADA, Section 508, and the European Accessibility Act.",
  },
]

export default function IndustriesPage() {
  return (
    <div className="container-wide py-12 px-4 sm:px-6">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Industries", url: "https://accessibility.build/industries" },
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span className="text-foreground font-medium">Industries</span>
          </li>
        </ol>
      </nav>

      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Accessibility by Industry</h1>
        <p className="text-xl text-muted-foreground">
          Accessibility law is not one-size-fits-all. The statutes that apply, the deadlines that bind you, and the
          WCAG failures most likely to get you sued all depend on the industry you operate in. Pick your sector for a
          practical, legally grounded compliance guide.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {industries.map((industry) => {
          const IconComponent = industry.icon
          return (
            <div
              key={industry.href}
              className={cn(
                "group relative bg-background rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300",
                industry.borderColor,
              )}
            >
              <div className={cn("h-24 relative", industry.bgColor)}>
                <div className="absolute inset-0 opacity-20 bg-grid-pattern-light dark:bg-grid-pattern-dark" />
                <div className="absolute -bottom-10 right-8">
                  <IconShell
                    icon={IconComponent}
                    size="xl"
                    tone="hero"
                    className={cn("rounded-full", `bg-gradient-to-br ${industry.color}`)}
                  />
                </div>
              </div>

              <div className="p-6 pt-12">
                <h2 className="text-2xl font-bold mb-2">
                  <Link href={industry.href} className="hover:text-primary transition-colors">
                    {industry.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground mb-4">{industry.description}</p>

                <ul className="space-y-2 mb-6">
                  {industry.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">{highlight}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="rounded-full w-full sm:w-auto">
                  <Link href={industry.href} className="flex items-center justify-center">
                    Read the {industry.title.split(" ")[0]} guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-4 text-center">Why industry context matters</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Every organization with a website answers to the Web Content Accessibility Guidelines in some form, but the
            enforcement mechanisms differ dramatically. A private online store is most likely to face a demand letter
            or an ADA Title III lawsuit — over{" "}
            <Link href="/research/accessibility-lawsuits" className="text-primary hover:underline">
              3,100 such suits were filed in federal court in 2025 alone
            </Link>
            , with e-commerce absorbing the overwhelming majority. A hospital answers to HHS enforcement under Section
            1557 and the Section 504 web rule. A public school district faces Department of Education OCR complaints
            and the DOJ&apos;s ADA Title II regulation. A federal agency must meet Section 508 in everything it builds
            and buys.
          </p>
          <p>
            The technical work overlaps heavily — accessible forms, alt text, captions, keyboard support, and tagged
            PDFs matter everywhere — but where you should start depends on which failures carry the most legal and
            human cost in your sector. These guides rank the issues accordingly, and each ends with a roadmap you can
            hand to a development team. When you are ready to validate your work, use our{" "}
            <Link href="/checklists/wcag-2-2" className="text-primary hover:underline">
              WCAG 2.2 checklist
            </Link>{" "}
            or request a{" "}
            <Link href="/services/accessibility-audits" className="text-primary hover:underline">
              professional audit
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Cross-industry resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {crossCuttingResources.map((resource) => {
            const IconComponent = resource.icon
            return (
              <Link
                key={resource.href}
                href={resource.href}
                className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300"
              >
                <IconComponent className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{resource.title}</h3>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <div className="max-w-4xl mx-auto bg-primary/5 rounded-2xl p-8 border border-primary/20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Not sure where your organization fits?</h2>
          <p className="text-muted-foreground">
            Many organizations sit under more than one regime — a university hospital, for example, can be covered by
            Title II, Section 504, and Section 1557 at once. We can map your obligations and audit against the
            strictest applicable standard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="default" className="rounded-full">
            <Link href="/contact?service=audit">Talk to an Expert</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/services">Explore Our Services</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
