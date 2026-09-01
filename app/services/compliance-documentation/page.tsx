import Link from "next/link"
import type { Metadata } from "next"
import { ServiceHero } from "@/components/services/service-hero"
import { ProcessSteps } from "@/components/services/process-steps"
import { FAQSection } from "@/components/services/faq-section"
import { ServicePricing } from "@/components/services/service-pricing"
import { ServiceStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { Button } from "@/components/ui/button"
import { servicePricing, toStructuredOffers } from "@/lib/service-pricing"
import { Check, FileText, ClipboardCheck, Scale, BookOpen, FileSearch } from "lucide-react"

const pageDescription =
  "Fixed-price accessibility statements, procurement documentation, and evidence-based VPAT Accessibility Conformance Reports from $450."

export const metadata: Metadata = {
  title: "Compliance Documentation | Accessibility.build",
  description: pageDescription,
  keywords: ["VPAT service cost", "Accessibility Conformance Report", "accessibility statement service", "ACR documentation"],
  alternates: { canonical: "/services/compliance-documentation" },
  openGraph: {
    type: "website",
    title: "Compliance Documentation",
    description: pageDescription,
    url: "/services/compliance-documentation",
    images: [
      {
        url: "/api/og?title=Compliance%20Documentation&section=Services",
        width: 1200,
        height: 630,
        alt: "Compliance Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compliance Documentation",
    description: pageDescription,
    images: ["/api/og?title=Compliance%20Documentation&section=Services"],
  },
}

const documentationProcess = [
  {
    title: "Requirements Analysis",
    description:
      "I confirm which documents you need, who will read them, and which regulations or procurement rules they must answer.",
    icon: FileSearch,
  },
  {
    title: "Product Evaluation",
    description:
      "I assess your digital product against the relevant accessibility standards, or work from current audit evidence you already hold.",
    icon: ClipboardCheck,
  },
  {
    title: "Documentation Creation",
    description: "I write the documentation so every conformance statement is backed by evidence rather than assumption.",
    icon: FileText,
  },
  {
    title: "Regulatory Mapping",
    description:
      "I map the findings to the regulations you name, such as Section 508, EN 301 549, or the European Accessibility Act, so the documents answer the questions your reviewers ask. This is regulatory context, not legal advice.",
    icon: Scale,
  },
  {
    title: "Implementation Support",
    description: "I hand over guidance on publishing, maintaining, and refreshing the documentation as your product changes.",
    icon: BookOpen,
  },
]

const faqs = [
  {
    question: "What is an accessibility statement and why do I need one?",
    answer:
      "An accessibility statement is a public-facing document that communicates your commitment to accessibility, the current state of your digital product's accessibility, known limitations, and how users can provide feedback. It's increasingly required by regulations like the EU Web Accessibility Directive and is considered a best practice globally. A well-crafted statement demonstrates transparency and commitment to all users.",
  },
  {
    question: "What is the difference between a VPAT and an ACR?",
    answer:
      "A VPAT is the reporting template. The completed, evidence-based document is an Accessibility Conformance Report, or ACR. Procurement teams often request an ACR when evaluating software for government, education, healthcare, and enterprise use. Our WCAG ACR package requires current audit evidence so every conformance statement can be supported.",
  },
  {
    question: "How often should accessibility documentation be updated?",
    answer:
      "Accessibility documentation should be reviewed and updated whenever significant changes are made to your digital product, when new features are added, or at least annually. For rapidly evolving products, more frequent updates may be necessary. Outdated documentation can create legal risk if it no longer accurately reflects your product's accessibility status.",
  },
  {
    question: "Can you help with documentation for legal defense?",
    answer:
      "Yes. I can help document your good-faith accessibility efforts: your accessibility policy, ongoing work, remediation plans, and user feedback mechanisms. That record can be useful to your legal team, but it is not legal advice and no documentation guarantees legal protection. Review it with your own counsel.",
  },
  {
    question: "Do you provide documentation for mobile apps?",
    answer:
      "Yes. I document mobile applications for iOS and Android as well as web products. Mobile documentation addresses platform-specific accessibility features and guidelines in addition to general WCAG principles.",
  },
  {
    question: "Can you help with international accessibility compliance documentation?",
    answer:
      "Yes. I can map documentation to the requirements you name, including the European Accessibility Act, Canada's Accessible Canada Act, and Australia's Disability Discrimination Act. The mapping is regulatory context for the jurisdictions relevant to your organization, not jurisdiction-specific legal advice.",
  },
]

export default function ComplianceDocumentationPage() {
  return (
    <div className="container-wide py-12">
      <ServiceStructuredData
        name="Compliance Documentation"
        description={pageDescription}
        serviceType="Accessibility Compliance Documentation"
        url="https://accessibility.build/services/compliance-documentation"
        areaServed={["Worldwide"]}
        offers={toStructuredOffers(servicePricing.documentation)}
        serviceOutput="Accessibility statement, procurement documentation, policy materials, or evidence-based Accessibility Conformance Report"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Services", url: "https://accessibility.build/services" },
          { name: "Compliance Documentation", url: "https://accessibility.build/services/compliance-documentation" },
        ]}
      />
      <ServiceHero
        title="Compliance Documentation"
        description="Evidence-based accessibility statements, procurement documentation, and Accessibility Conformance Reports, mapped to the regulations you name."
        cta="Get Documentation"
        ctaLink="/contact?service=documentation"
        icon={Scale}
        gradientFrom="rgba(6, 182, 212, 0.8)"
        gradientTo="rgba(13, 148, 136, 0.8)"
        startingPrice={servicePricing.documentation.tiers[0].price}
        delivery={servicePricing.documentation.tiers[0].timeline}
      />

      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Who Needs Accessibility Documentation?</h2>
            <div className="space-y-4">
              <p className="text-lg">
                Our accessibility documentation services are essential for organizations that need to demonstrate
                compliance with accessibility regulations and standards. They're particularly valuable for:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Government contractors</strong> needing to demonstrate Section 508 compliance
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Public sector organizations</strong> subject to accessibility regulations
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Educational institutions</strong> requiring accessibility documentation for procurement
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Companies facing legal challenges</strong> related to accessibility
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Organizations with accessibility policies</strong> needing formal documentation
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-muted/30 p-8 rounded-2xl border border-border">
            <h3 className="text-2xl font-bold mb-4">Benefits of Our Documentation Services</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Regulatory Context</h4>
                  <p className="text-muted-foreground">
                    Documentation that maps evidence to the regulations you name, so reviewers can see where you stand.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Procurement Readiness</h4>
                  <p className="text-muted-foreground">
                    Be prepared for accessibility requirements in procurement processes.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <Scale className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Risk Mitigation</h4>
                  <p className="text-muted-foreground">
                    Reduce legal risk with documentation of good-faith accessibility efforts.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Transparency</h4>
                  <p className="text-muted-foreground">
                    Demonstrate your commitment to accessibility to all stakeholders.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30 rounded-3xl px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Documentation Process</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Every document follows the same process, so each conformance statement can be traced back to evidence.
          </p>
        </div>
        <ProcessSteps steps={documentationProcess} />
      </section>

      <ServicePricing pricing={servicePricing.documentation} />

      <FAQSection faqs={faqs} />

      <section className="py-16">
        <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Document Your Accessibility Compliance?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Tell me which documents you need and which regulations they must answer, and I will confirm scope and a
            fixed price before work begins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact?service=documentation">Get Documentation</Link>
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
