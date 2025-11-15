import Link from "next/link"
import type { Metadata } from "next"
import { ServiceHero } from "@/components/services/service-hero"
import { ProcessSteps } from "@/components/services/process-steps"
import { FAQSection } from "@/components/services/faq-section"
import { Button } from "@/components/ui/button"
import { Check, Palette, Eye, Layout, Layers, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Accessible Design Reviews | Accessibility.build",
  description:
    "Expert evaluation of your designs to ensure accessibility from the start, preventing costly remediation later.",
}

const reviewProcess = [
  {
    title: "Design Collection",
    description: "We gather your designs, wireframes, or prototypes for review.",
    icon: Layout,
  },
  {
    title: "Accessibility Evaluation",
    description: "We analyze designs against WCAG criteria and accessibility best practices.",
    icon: Eye,
  },
  {
    title: "Pattern Analysis",
    description: "We identify recurring patterns and systemic accessibility considerations.",
    icon: Layers,
  },
  {
    title: "Detailed Reporting",
    description: "We provide comprehensive feedback with specific recommendations.",
    icon: FileText,
  },
  {
    title: "Collaborative Review",
    description: "We discuss findings with your team and answer questions about implementation.",
    icon: Palette,
  },
]

const faqs = [
  {
    question: "At what stage should we request a design review?",
    answer:
      "The earlier, the better! We recommend getting reviews during the wireframing or early design phase when changes are easier and less costly to implement. However, we can review designs at any stage, including finished designs before development begins.",
  },
  {
    question: "What design formats do you accept for review?",
    answer:
      "We can work with most common design formats, including Figma, Sketch, Adobe XD, InVision, or even PDFs and images. We prefer formats that allow us to inspect elements and measurements, but we can adapt to your workflow.",
  },
  {
    question: "How long does a design review take?",
    answer:
      "A single design review typically takes 3-5 business days, depending on complexity. Design system reviews usually take 1-2 weeks. We can accommodate rush requests when possible, though additional fees may apply.",
  },
  {
    question: "Will you provide specific solutions or just identify problems?",
    answer:
      "We provide both. For each accessibility issue identified, we include specific recommendations for how to address it while maintaining your design intent. We often include examples or alternative approaches when appropriate.",
  },
  {
    question: "Do you review mobile app designs?",
    answer:
      "Yes, we review designs for all platforms, including mobile apps (iOS and Android), web applications, desktop software, and kiosks. We apply both WCAG principles and platform-specific accessibility guidelines.",
  },
  {
    question: "How do design reviews differ from accessibility audits?",
    answer:
      "Design reviews focus on pre-implementation designs and patterns, helping you prevent accessibility issues before development. Audits evaluate existing, implemented products to identify issues that need remediation. Design reviews are preventative, while audits are evaluative.",
  },
]

export default function DesignReviewsPage() {
  return (
    <div className="container-wide py-12">
      <ServiceHero
        title="Accessible Design Reviews"
        description="Expert evaluation of your designs to ensure accessibility from the start, preventing costly remediation later."
        cta="Request Review"
        ctaLink="/contact?service=design-review"
        icon={Palette}
        gradientFrom="rgba(59, 130, 246, 0.8)"
        gradientTo="rgba(79, 70, 229, 0.8)"
      />

      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Who Needs Design Reviews?</h2>
            <div className="space-y-4">
              <p className="text-lg">
                Our accessible design review services are ideal for organizations that want to ensure accessibility from
                the earliest stages of product development. They're particularly valuable for:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Design teams</strong> creating new products or features
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Organizations developing design systems</strong> that need to be accessible
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Product teams</strong> wanting to prevent accessibility issues before development
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Companies rebranding or redesigning</strong> existing products
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Organizations with accessibility requirements</strong> needing expert guidance
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-muted/30 p-8 rounded-2xl border border-border">
            <h3 className="text-2xl font-bold mb-4">Benefits of Design Reviews</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Prevent Issues Early</h4>
                  <p className="text-muted-foreground">
                    Identify and address accessibility issues before development, saving time and resources.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Maintain Design Intent</h4>
                  <p className="text-muted-foreground">
                    Get recommendations that preserve your visual design while ensuring accessibility.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <Layout className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Build Accessible Patterns</h4>
                  <p className="text-muted-foreground">
                    Develop reusable, accessible design patterns for consistent implementation.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Enhance Design Knowledge</h4>
                  <p className="text-muted-foreground">
                    Learn accessibility principles that improve your team's design capabilities.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30 rounded-3xl px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Design Review Process</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We follow a structured process to thoroughly evaluate designs and provide actionable recommendations.
          </p>
        </div>
        <ProcessSteps steps={reviewProcess} />
      </section>

      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Pricing Approach</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            We believe in transparent, value-based pricing that reflects the complexity and scope of your design review
            needs.
          </p>
          <div className="bg-muted/30 p-8 md:p-10 rounded-2xl border border-border max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Flexible Options to Meet Your Needs</h3>
            <p className="mb-4">
              Our pricing is structured to provide maximum value while accommodating different design review
              requirements and budgets:
            </p>
            <ul className="space-y-3 text-left mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <span>
                  <strong>Hourly rates</strong> ranging from $60 to $100 per hour based on design complexity and
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
                  <strong>Customized review packages</strong> that can be tailored to your specific design needs and
                  project stage
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
          <h2 className="text-3xl font-bold mb-4">Ready to Make Accessibility Part of Your Design Process?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Contact us today to discuss your design review needs and ensure accessibility from the start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact?service=design-review">Request Review</Link>
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
