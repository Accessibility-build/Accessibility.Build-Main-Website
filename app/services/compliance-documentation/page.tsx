import Link from "next/link"
import type { Metadata } from "next"
import { ServiceHero } from "@/components/services/service-hero"
import { ProcessSteps } from "@/components/services/process-steps"
import { FAQSection } from "@/components/services/faq-section"
import { Button } from "@/components/ui/button"
import { Check, FileText, ClipboardCheck, Scale, BookOpen, FileSearch } from "lucide-react"

export const metadata: Metadata = {
  title: "Compliance Documentation | Accessibility.build",
  description: "Professional documentation services to help you meet legal and regulatory accessibility requirements.",
}

const documentationProcess = [
  {
    title: "Requirements Analysis",
    description: "We identify the specific documentation needs based on your regulatory requirements.",
    icon: FileSearch,
  },
  {
    title: "Product Evaluation",
    description: "We assess your digital products against relevant accessibility standards.",
    icon: ClipboardCheck,
  },
  {
    title: "Documentation Creation",
    description: "We develop comprehensive, accurate documentation tailored to your needs.",
    icon: FileText,
  },
  {
    title: "Legal Review",
    description: "We ensure documentation meets legal requirements and industry best practices.",
    icon: Scale,
  },
  {
    title: "Implementation Support",
    description: "We provide guidance on how to effectively use and maintain your documentation.",
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
    question: "What is a VPAT and when is it required?",
    answer:
      "A Voluntary Product Accessibility Template (VPAT) is a document that explains how information and communication technology products (like software, hardware, electronic content, and support documentation) conform to the Section 508 Standards for IT accessibility. VPATs are typically required for selling to U.S. federal government agencies and are increasingly requested in education, healthcare, and enterprise procurement processes.",
  },
  {
    question: "How often should accessibility documentation be updated?",
    answer:
      "Accessibility documentation should be reviewed and updated whenever significant changes are made to your digital product, when new features are added, or at least annually. For rapidly evolving products, more frequent updates may be necessary. Outdated documentation can create legal risk if it no longer accurately reflects your product's accessibility status.",
  },
  {
    question: "Can you help with documentation for legal defense?",
    answer:
      "Yes, we can help create documentation that demonstrates your good-faith efforts toward accessibility, which can be valuable in legal situations. This includes documenting your accessibility policy, ongoing efforts, remediation plans, and user feedback mechanisms. While no documentation can guarantee legal protection, thorough documentation of your accessibility efforts can be an important part of a legal defense strategy.",
  },
  {
    question: "Do you provide documentation for mobile apps?",
    answer:
      "Yes, we provide accessibility documentation for all digital products, including mobile applications for iOS and Android. Mobile app documentation addresses platform-specific accessibility features and guidelines in addition to general WCAG principles.",
  },
  {
    question: "Can you help with international accessibility compliance documentation?",
    answer:
      "Yes, we can create documentation that addresses international accessibility requirements, including the European Accessibility Act, Canada's Accessible Canada Act, Australia's Disability Discrimination Act, and other global regulations. We tailor documentation to the specific jurisdictions relevant to your organization.",
  },
]

export default function ComplianceDocumentationPage() {
  return (
    <div className="container-wide py-12">
      <ServiceHero
        title="Compliance Documentation"
        description="Professional documentation services to help you meet legal and regulatory accessibility requirements."
        cta="Get Documentation"
        ctaLink="/contact?service=documentation"
        icon={Scale}
        gradientFrom="rgba(6, 182, 212, 0.8)"
        gradientTo="rgba(13, 148, 136, 0.8)"
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
                  <h4 className="font-semibold">Legal Compliance</h4>
                  <p className="text-muted-foreground">
                    Meet regulatory requirements with accurate, comprehensive documentation.
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
            We follow a structured process to create accurate, comprehensive accessibility documentation.
          </p>
        </div>
        <ProcessSteps steps={documentationProcess} />
      </section>

      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Pricing Approach</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            We believe in transparent, value-based pricing that reflects the complexity and scope of your documentation
            needs.
          </p>
          <div className="bg-muted/30 p-8 md:p-10 rounded-2xl border border-border max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Flexible Options to Meet Your Needs</h3>
            <p className="mb-4">
              Our pricing is structured to provide maximum value while accommodating different documentation
              requirements and budgets:
            </p>
            <ul className="space-y-3 text-left mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <span>
                  <strong>Hourly rates</strong> ranging from $60 to $100 per hour based on documentation complexity and
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
                  <strong>Customized packages</strong> that can be tailored to your specific documentation needs and
                  constraints
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
          <h2 className="text-3xl font-bold mb-4">Ready to Document Your Accessibility Compliance?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Contact us today to discuss your documentation needs and ensure you meet all regulatory requirements.
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
