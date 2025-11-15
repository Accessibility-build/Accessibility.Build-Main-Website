import Link from "next/link"
import type { Metadata } from "next"
import { ServiceHero } from "@/components/services/service-hero"
import { ProcessSteps } from "@/components/services/process-steps"
import { FAQSection } from "@/components/services/faq-section"
import { Button } from "@/components/ui/button"
import { Check, Code, FileText, Wrench, RefreshCw, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "Remediation Support | Accessibility.build",
  description:
    "Expert assistance to fix accessibility issues in your digital products, from code-level fixes to content remediation.",
}

const remediationProcess = [
  {
    title: "Issue Assessment",
    description: "We review your audit results or conduct a quick assessment to understand the issues.",
    icon: FileText,
  },
  {
    title: "Remediation Planning",
    description: "We develop a prioritized plan to address issues efficiently and effectively.",
    icon: Code,
  },
  {
    title: "Implementation",
    description: "We implement fixes or provide detailed guidance for your team to implement.",
    icon: Wrench,
  },
  {
    title: "Validation Testing",
    description: "We verify that the implemented fixes resolve the accessibility issues.",
    icon: RefreshCw,
  },
  {
    title: "Knowledge Transfer",
    description: "We provide documentation and training to help prevent similar issues in the future.",
    icon: MessageSquare,
  },
]

const faqs = [
  {
    question: "Do I need an audit before remediation services?",
    answer:
      "While an audit provides a comprehensive list of issues to address, it's not strictly required. We can conduct a quick assessment to identify key issues if you haven't had a formal audit. However, for complex sites or applications, we recommend starting with an audit for the most thorough results.",
  },
  {
    question: "How quickly can you fix accessibility issues?",
    answer:
      "The timeline depends on the number and complexity of issues. Simple fixes can often be implemented within days, while more complex remediation might take several weeks. During our initial assessment, we'll provide a specific timeline based on your situation.",
  },
  {
    question: "Will remediation affect our site's design or functionality?",
    answer:
      "Our goal is to maintain your design intent and functionality while making it accessible. In most cases, accessibility improvements are invisible to most users. When visual changes are necessary, we work closely with you to ensure they align with your brand and user experience goals.",
  },
  {
    question: "Can you work with our development team?",
    answer:
      "Yes, we're experienced in collaborating with in-house development teams. We can provide guidance, code examples, and review implementations, or we can handle the implementation entirely, depending on your preference and team capacity.",
  },
  {
    question: "What types of issues can you remediate?",
    answer:
      "We can address all types of accessibility issues, including keyboard navigation, screen reader compatibility, color contrast, form accessibility, dynamic content, multimedia accessibility, and more. Our expertise covers HTML, CSS, JavaScript, React, Angular, Vue, and other common frameworks.",
  },
  {
    question: "How do you ensure the fixes actually work?",
    answer:
      "We conduct thorough validation testing after implementation, using both automated tools and manual testing with assistive technologies. This ensures that the remediation effectively resolves the issues and doesn't introduce new problems.",
  },
]

export default function RemediationSupportPage() {
  return (
    <div className="container-wide py-12">
      <ServiceHero
        title="Remediation Support"
        description="Expert assistance to fix accessibility issues in your digital products, from code-level fixes to content remediation."
        cta="Get Support"
        ctaLink="/contact?service=remediation"
        icon={Code}
        gradientFrom="rgba(168, 85, 247, 0.8)"
        gradientTo="rgba(124, 58, 237, 0.8)"
      />

      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Who Needs Remediation Support?</h2>
            <div className="space-y-4">
              <p className="text-lg">
                Our remediation support services are designed for organizations that have identified accessibility
                issues and need expert help to fix them. They're particularly valuable for:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Organizations with audit results</strong> that need help implementing fixes
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Development teams</strong> lacking accessibility expertise or bandwidth
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Organizations facing legal requirements</strong> to quickly address accessibility issues
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Companies with legacy systems</strong> that need accessibility improvements
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Teams seeking knowledge transfer</strong> to prevent future accessibility issues
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-muted/30 p-8 rounded-2xl border border-border">
            <h3 className="text-2xl font-bold mb-4">Benefits of Our Remediation Support</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Expert Implementation</h4>
                  <p className="text-muted-foreground">
                    Get fixes implemented by specialists with deep accessibility expertise.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Efficient Resolution</h4>
                  <p className="text-muted-foreground">
                    Address issues quickly without diverting your team from other priorities.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Knowledge Transfer</h4>
                  <p className="text-muted-foreground">
                    Learn best practices to prevent similar issues in future development.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Validated Solutions</h4>
                  <p className="text-muted-foreground">
                    Ensure fixes actually work through thorough testing and validation.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30 rounded-3xl px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Remediation Process</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We follow a structured process to efficiently address accessibility issues and ensure effective solutions.
          </p>
        </div>
        <ProcessSteps steps={remediationProcess} />
      </section>

      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Pricing Approach</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            We believe in transparent, value-based pricing that reflects the complexity and scope of your remediation
            needs.
          </p>
          <div className="bg-muted/30 p-8 md:p-10 rounded-2xl border border-border max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Flexible Options to Meet Your Needs</h3>
            <p className="mb-4">
              Our pricing is structured to provide maximum value while accommodating different remediation requirements
              and budgets:
            </p>
            <ul className="space-y-3 text-left mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <span>
                  <strong>Hourly rates</strong> ranging from $60 to $100 per hour based on issue complexity and
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
                  <strong>Customized remediation packages</strong> that can be tailored to your specific needs and
                  priorities
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
          <h2 className="text-3xl font-bold mb-4">Ready to Fix Accessibility Issues?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Contact us today to discuss your remediation needs and get expert support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact?service=remediation">Get Support</Link>
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
