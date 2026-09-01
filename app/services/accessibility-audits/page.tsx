import Link from "next/link"
import type { Metadata } from "next"
import { ServiceHero } from "@/components/services/service-hero"
import { ProcessSteps } from "@/components/services/process-steps"
import { FAQSection } from "@/components/services/faq-section"
import { ServicePricing } from "@/components/services/service-pricing"
import { ServiceStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { Button } from "@/components/ui/button"
import { servicePricing, toStructuredOffers } from "@/lib/service-pricing"
import { Check, FileText, BarChart, ListChecks, Clock, Users, Eye } from "lucide-react"

const pageDescription =
  "Fixed-price WCAG 2.2 AA accessibility audits from $950, with manual testing, assistive technology checks, reports, and verification retests."

export const metadata: Metadata = {
  title: "Accessibility Audits | Accessibility.build",
  description: pageDescription,
  keywords: ["accessibility audit services", "WCAG audit cost", "manual accessibility audit", "WCAG 2.2 AA audit"],
  alternates: { canonical: "/services/accessibility-audits" },
  openGraph: {
    type: "website",
    title: "Accessibility Audits",
    description: pageDescription,
    url: "/services/accessibility-audits",
    images: [
      {
        url: "/api/og?title=Accessibility%20Audits&section=Services",
        width: 1200,
        height: 630,
        alt: "Accessibility Audits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Audits",
    description: pageDescription,
    images: ["/api/og?title=Accessibility%20Audits&section=Services"],
  },
}

const auditProcess = [
  {
    title: "Initial Consultation",
    description:
      "I discuss your goals, scope, and specific requirements with you and fix the page and flow sample before work begins.",
    icon: Users,
  },
  {
    title: "Automated Testing",
    description:
      "I run automated tools to surface candidate issues across your digital product. They guide the manual pass; they do not replace it.",
    icon: BarChart,
  },
  {
    title: "Manual Review",
    description: "I conduct a thorough manual review by hand to find the issues that automated tools miss.",
    icon: ListChecks,
  },
  {
    title: "Assistive Technology Testing",
    description:
      "I test your product with screen readers, keyboard-only navigation, and other assistive technologies, and record what actually happens.",
    icon: FileText,
  },
  {
    title: "Comprehensive Report",
    description:
      "You receive a detailed report with every finding, reproduction steps, prioritized recommendations, and remediation guidance.",
    icon: Clock,
  },
]

const faqs = [
  {
    question: "How long does an accessibility audit take?",
    answer:
      "The Essential Audit is delivered in 7-10 business days, the Product Audit in 2-3 weeks, and the Complex Product Audit in 4-5 weeks. Timelines begin after access, test accounts, and the representative sample are confirmed.",
  },
  {
    question: "What accessibility standards do you test against?",
    answer:
      "I test against WCAG 2.2 at the AA level, the most widely recognized standard and the one referenced in most accessibility regulations worldwide. AAA criteria or specific country regulations can be added to the scope on request. Regulatory mapping is provided as context, not legal advice.",
  },
  {
    question: "Will the audit disrupt our website or application?",
    answer:
      "No. The audit is non-invasive: I only observe and test your digital product without making any changes to it. There is no downtime or disruption to your users.",
  },
  {
    question: "What deliverables will we receive?",
    answer:
      "You'll receive a comprehensive report detailing all identified issues, categorized by severity and WCAG criteria. The report includes screenshots, code examples, and specific recommendations for remediation. The Product Audit adds an executive brief and a prioritized remediation backlog; the Complex Product Audit adds a leadership summary, a procurement-ready evidence package, and a remediation planning workshop. The Essential Audit includes a severity-ranked issue register and a findings walkthrough.",
  },
  {
    question: "Do you provide remediation services after the audit?",
    answer:
      "Yes. Remediation support is a separate service that ranges from guidance for your development team to hands-on implementation. It can be scoped alongside the audit so the findings flow straight into fixes.",
  },
  {
    question: "How often should we conduct accessibility audits?",
    answer:
      "I recommend a full audit annually and smaller spot-checks after major updates or releases. That keeps your evidence toward WCAG 2.2 AA current as your digital product evolves and the standard is updated.",
  },
]

export default function AccessibilityAuditsPage() {
  return (
    <div className="container-wide py-12">
      <ServiceStructuredData
        name="Accessibility Audits"
        description={pageDescription}
        serviceType="Accessibility Audit"
        url="https://accessibility.build/services/accessibility-audits"
        areaServed={["Worldwide"]}
        offers={toStructuredOffers(servicePricing.audits)}
        serviceOutput="WCAG 2.2 AA audit report, evidence-backed issue register, and prioritized remediation plan"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Services", url: "https://accessibility.build/services" },
          { name: "Accessibility Audits", url: "https://accessibility.build/services/accessibility-audits" },
        ]}
      />
      <ServiceHero
        title="Accessibility Audits"
        description="Manual evaluation of your digital products against WCAG 2.2 AA, producing documented findings you can act on and evidence toward conformance."
        cta="Request an Audit"
        ctaLink="/contact?service=audit"
        icon={Eye}
        gradientFrom="rgba(59, 130, 246, 0.8)"
        gradientTo="rgba(79, 70, 229, 0.8)"
        startingPrice={servicePricing.audits.tiers[0].price}
        delivery={servicePricing.audits.tiers[0].timeline}
      />

      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Who Needs Accessibility Audits?</h2>
            <div className="space-y-4">
              <p className="text-lg">
                Accessibility audits are essential for organizations that want to ensure their digital products are
                usable by everyone, including people with disabilities. They're particularly valuable for:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Businesses and organizations</strong> seeking to reach a wider audience and avoid legal
                    risks related to accessibility
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Government agencies</strong> required to comply with accessibility regulations like Section
                    508
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Educational institutions</strong> ensuring equal access to learning materials and platforms
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Healthcare providers</strong> making critical health information and services accessible to
                    all
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>E-commerce businesses</strong> ensuring all customers can browse and purchase products
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-muted/30 p-8 rounded-2xl border border-border">
            <h3 className="text-2xl font-bold mb-4">Benefits of Our Accessibility Audits</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Expanded Audience Reach</h4>
                  <p className="text-muted-foreground">
                    Make your digital products usable by the estimated 16 percent of the global population, about 1.3
                    billion people, who live with a significant disability (
                    <a
                      href="https://www.who.int/news-room/fact-sheets/detail/disability-and-health"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      WHO fact sheet
                    </a>
                    ).
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Regulatory Context</h4>
                  <p className="text-muted-foreground">
                    Findings are mapped to WCAG 2.2 AA, the standard referenced by regulations such as the ADA and
                    Section 508, giving you documented evidence toward conformance. This is regulatory context, not
                    legal advice.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Improved User Experience</h4>
                  <p className="text-muted-foreground">
                    Accessibility improvements benefit all users, not just those with disabilities.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <ListChecks className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Enhanced SEO</h4>
                  <p className="text-muted-foreground">
                    Many accessibility improvements also boost search engine optimization.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30 rounded-3xl px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Audit Process</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Every audit follows the same steps against WCAG 2.2, so you know in advance what is tested, how, and how
            the findings are documented.
          </p>
        </div>
        <ProcessSteps steps={auditProcess} />
      </section>

      <ServicePricing pricing={servicePricing.audits} />

      <FAQSection faqs={faqs} />

      <section className="py-16">
        <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make Your Digital Products Accessible?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose a published package or send us your scope for a fixed project total before work begins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact?service=audit">Request an Audit</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/services">Explore Other Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
