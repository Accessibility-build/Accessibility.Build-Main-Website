import Link from "next/link"
import type { Metadata } from "next"
import { ServiceHero } from "@/components/services/service-hero"
import { ProcessSteps } from "@/components/services/process-steps"
import { FAQSection } from "@/components/services/faq-section"
import { Button } from "@/components/ui/button"
import { Check, FileText, BarChart, ListChecks, Clock, Users, Eye } from "lucide-react"

export const metadata: Metadata = {
  title: "Accessibility Audits | Accessibility.build",
  description:
    "Comprehensive accessibility audits to identify barriers and ensure WCAG compliance for your digital products.",
}

const auditProcess = [
  {
    title: "Initial Consultation",
    description: "We discuss your goals, scope, and specific requirements to tailor the audit to your needs.",
    icon: Users,
  },
  {
    title: "Automated Testing",
    description: "We run automated tools to identify common accessibility issues across your digital product.",
    icon: BarChart,
  },
  {
    title: "Manual Expert Review",
    description:
      "Our accessibility experts conduct a thorough manual review to identify issues that automated tools miss.",
    icon: ListChecks,
  },
  {
    title: "Assistive Technology Testing",
    description: "We test your product with screen readers and other assistive technologies to ensure compatibility.",
    icon: FileText,
  },
  {
    title: "Comprehensive Report",
    description:
      "We deliver a detailed report with all findings, prioritized recommendations, and remediation guidance.",
    icon: Clock,
  },
]

const faqs = [
  {
    question: "How long does an accessibility audit take?",
    answer:
      "The timeline varies based on the size and complexity of your digital product. A basic audit typically takes 1-2 weeks, while comprehensive and enterprise audits may take 3-6 weeks. We'll provide a specific timeline during the initial consultation.",
  },
  {
    question: "What accessibility standards do you test against?",
    answer:
      "We primarily test against WCAG 2.2 at the AA level, which is the most widely recognized standard and is referenced in most accessibility regulations worldwide. We can also test against AAA level or specific country regulations upon request.",
  },
  {
    question: "Will the audit disrupt our website or application?",
    answer:
      "No, our audit process is completely non-invasive. We only observe and test your digital product without making any changes to it. There will be no downtime or disruption to your users.",
  },
  {
    question: "What deliverables will we receive?",
    answer:
      "You'll receive a comprehensive report detailing all identified issues, categorized by severity and WCAG criteria. The report includes screenshots, code examples, and specific recommendations for remediation. For comprehensive and enterprise audits, you'll also receive an executive summary and remediation roadmap.",
  },
  {
    question: "Do you provide remediation services after the audit?",
    answer:
      "Yes, we offer remediation support services to help you fix the issues identified in the audit. This can range from guidance for your development team to hands-on implementation assistance. These services are separate from the audit but can be bundled for a complete solution.",
  },
  {
    question: "How often should we conduct accessibility audits?",
    answer:
      "We recommend conducting a full audit annually and smaller spot-checks after major updates or releases. This ensures ongoing compliance, especially as your digital product evolves and accessibility standards are updated.",
  },
]

export default function AccessibilityAuditsPage() {
  return (
    <div className="container-wide py-12">
      <ServiceHero
        title="Accessibility Audits"
        description="Comprehensive evaluation of your digital products against WCAG standards to identify barriers and ensure compliance."
        cta="Request an Audit"
        ctaLink="/contact?service=audit"
        icon={Eye}
        gradientFrom="rgba(59, 130, 246, 0.8)"
        gradientTo="rgba(79, 70, 229, 0.8)"
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
                    Make your digital products accessible to the 15% of the global population with disabilities.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Legal Compliance</h4>
                  <p className="text-muted-foreground">
                    Reduce legal risks by ensuring compliance with accessibility regulations like ADA and Section 508.
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
            Our comprehensive accessibility audit process ensures thorough evaluation of your digital products against
            WCAG standards.
          </p>
        </div>
        <ProcessSteps steps={auditProcess} />
      </section>

      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Pricing Approach</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            We believe in transparent, value-based pricing that reflects the complexity and scope of your project.
          </p>
          <div className="bg-muted/30 p-8 md:p-10 rounded-2xl border border-border max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Flexible Options to Meet Your Needs</h3>
            <p className="mb-4">
              Our pricing is structured to provide maximum value while accommodating different project requirements and
              budgets:
            </p>
            <ul className="space-y-3 text-left mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <span>
                  <strong>Hourly rates</strong> ranging from $60 to $100 per hour based on project complexity and
                  specialist requirements
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <span>
                  <strong>Project-based pricing</strong> with clear deliverables and timelines for more predictable
                  budgeting
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <span>
                  <strong>Customized packages</strong> that can be tailored to your specific needs and constraints
                </span>
              </li>
            </ul>
            <p className="text-muted-foreground italic">
              We provide detailed quotes after understanding your specific requirements during the initial consultation.
            </p>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} />

      <section className="py-16">
        <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make Your Digital Products Accessible?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Contact us today to discuss your accessibility audit needs and get a customized quote.
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
