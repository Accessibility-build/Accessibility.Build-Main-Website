import Link from "next/link"
import type { Metadata } from "next"
import { ServiceHero } from "@/components/services/service-hero"
import { ProcessSteps } from "@/components/services/process-steps"
import { FAQSection } from "@/components/services/faq-section"
import { ServicePricing } from "@/components/services/service-pricing"
import { ServiceStructuredData, BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { Button } from "@/components/ui/button"
import { servicePricing, toStructuredOffers } from "@/lib/service-pricing"
import { Check, Users, Target, FileText, Video, PieChart } from "lucide-react"

const pageDescription =
  "Fixed-price accessibility user testing from $2,400, including disabled participant recruitment, honoraria, moderated sessions, analysis, and reporting."

export const metadata: Metadata = {
  title: "Accessibility User Testing",
  description: pageDescription,
  keywords: ["accessibility user testing", "disabled user research", "assistive technology user testing", "inclusive usability testing"],
  alternates: { canonical: "/services/user-testing" },
  openGraph: {
    type: "website",
    title: "Accessibility User Testing",
    description: pageDescription,
    url: "/services/user-testing",
    images: [
      {
        url: "/api/og?title=Accessibility%20User%20Testing&section=Services",
        width: 1200,
        height: 630,
        alt: "Accessibility User Testing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility User Testing",
    description: pageDescription,
    images: ["/api/og?title=Accessibility%20User%20Testing&section=Services"],
  },
}

const testingProcess = [
  {
    title: "Test Planning",
    description: "We define objectives, scenarios, and tasks based on your product and goals.",
    icon: Target,
  },
  {
    title: "Participant Recruitment",
    description: "We recruit diverse participants with relevant disabilities and assistive technology experience.",
    icon: Users,
  },
  {
    title: "Testing Sessions",
    description: "We conduct moderated sessions observing participants using your product.",
    icon: Video,
  },
  {
    title: "Data Analysis",
    description: "We analyze findings to identify patterns, barriers, and opportunities.",
    icon: PieChart,
  },
  {
    title: "Comprehensive Reporting",
    description: "We deliver detailed reports with findings and actionable recommendations.",
    icon: FileText,
  },
]

const faqs = [
  {
    question: "Who participates in your user testing?",
    answer:
      "We recruit participants with various disabilities who use different assistive technologies, including screen reader users, keyboard-only users, magnification users, voice recognition users, and people with cognitive disabilities. We match participant profiles to your specific product and testing objectives.",
  },
  {
    question: "When should we conduct accessibility user testing?",
    answer:
      "Ideally, testing should occur at multiple stages: early with prototypes to catch fundamental issues, during development to validate specific features, and before launch for final validation. However, testing at any stage provides valuable insights, even with existing products.",
  },
  {
    question: "How is accessibility testing different from regular user testing?",
    answer:
      "Accessibility testing specifically focuses on the experience of people with disabilities using assistive technologies. It evaluates both technical compliance and real-world usability for these users, identifying barriers that standard testing might miss.",
  },
  {
    question: "Do you test remotely or in-person?",
    answer:
      "The published packages cover moderated remote testing, which supports broader participant recruitment and lets people use their own assistive technology setup. In-person studies are scoped separately because venue, travel, equipment, and participant location materially change the project cost.",
  },
  {
    question: "What deliverables will we receive?",
    answer:
      "Every package includes a research plan, moderated sessions, barrier analysis, actionable recommendations, and a stakeholder readout. Product and Extended studies add deeper task analysis and prioritization. A consent-based, captioned highlight reel is available for a fixed $500.",
  },
  {
    question: "How do you measure success in accessibility testing?",
    answer:
      "We measure success through task completion rates, time-on-task metrics, error rates, and participant satisfaction scores. We also collect qualitative feedback about the experience and identify specific barriers that prevent successful interaction.",
  },
]

export default function UserTestingPage() {
  return (
    <div className="container-wide py-12">
      <ServiceStructuredData
        name="Accessibility User Testing"
        description={pageDescription}
        serviceType="Accessibility User Testing"
        url="https://accessibility.build/services/user-testing"
        areaServed={["Worldwide"]}
        offers={toStructuredOffers(servicePricing.userTesting)}
        serviceOutput="Moderated research with disabled participants, task analysis, findings report, and stakeholder readout"
      />
      <FAQStructuredData faqs={faqs} />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Services", url: "https://accessibility.build/services" },
          { name: "Accessibility User Testing", url: "https://accessibility.build/services/user-testing" },
        ]}
      />
      <ServiceHero
        title="Accessibility User Testing"
        description="Real-world validation of your digital products with diverse users, including people with disabilities and assistive technology users."
        cta="Schedule Testing"
        ctaLink="/contact?service=user-testing"
        icon={Users}
        gradientFrom="rgba(245, 158, 11, 0.8)"
        gradientTo="rgba(234, 88, 12, 0.8)"
        startingPrice={servicePricing.userTesting.tiers[0].price}
        delivery={servicePricing.userTesting.tiers[0].timeline}
      />

      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Who Needs Accessibility User Testing?</h2>
            <div className="space-y-4">
              <p className="text-lg">
                Our accessibility user testing services are valuable for organizations that want to validate their
                digital products with real users who have disabilities. They're particularly beneficial for:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Organizations launching new products</strong> who want to ensure accessibility
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Companies that have implemented fixes</strong> and want to validate their effectiveness
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Product teams seeking user insights</strong> beyond technical compliance
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Organizations with accessibility requirements</strong> needing validation
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Businesses wanting to improve user experience</strong> for all customers
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-muted/30 p-8 rounded-2xl border border-border">
            <h3 className="text-2xl font-bold mb-4">Benefits of User Testing</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Real-World Validation</h4>
                  <p className="text-muted-foreground">
                    Confirm that your product works with actual assistive technologies and users.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Beyond Technical Compliance</h4>
                  <p className="text-muted-foreground">
                    Identify usability issues that automated testing and audits might miss.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Prioritized Improvements</h4>
                  <p className="text-muted-foreground">Understand which issues most significantly impact real users.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Stakeholder Awareness</h4>
                  <p className="text-muted-foreground">
                    Build empathy and understanding through real user experiences.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30 rounded-3xl px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Testing Process</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We follow a structured process to ensure thorough testing and actionable insights.
          </p>
        </div>
        <ProcessSteps steps={testingProcess} />
      </section>

      <ServicePricing pricing={servicePricing.userTesting} />

      <FAQSection faqs={faqs} />

      <section className="py-16">
        <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Validate Your Accessibility?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Contact us today to discuss your testing needs and schedule sessions with diverse users.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact?service=user-testing">Schedule Testing</Link>
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
