import Link from "next/link"
import type { Metadata } from "next"
import { ServiceHero } from "@/components/services/service-hero"
import { ProcessSteps } from "@/components/services/process-steps"
import { FAQSection } from "@/components/services/faq-section"
import { Button } from "@/components/ui/button"
import { Check, BookOpen, Users, Code, Pencil, Monitor, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "Accessibility Training | Accessibility.build",
  description:
    "Empower your team with the knowledge and skills to create accessible digital products through our specialized accessibility training programs.",
}

const trainingProcess = [
  {
    title: "Needs Assessment",
    description: "We evaluate your team's current knowledge and identify specific training needs.",
    icon: Users,
  },
  {
    title: "Customized Curriculum",
    description: "We develop a tailored training program based on your team's roles and requirements.",
    icon: BookOpen,
  },
  {
    title: "Interactive Workshops",
    description: "We deliver engaging, hands-on training sessions with practical exercises.",
    icon: Monitor,
  },
  {
    title: "Practical Application",
    description: "Participants apply their new knowledge to real-world projects with guidance.",
    icon: Pencil,
  },
  {
    title: "Ongoing Support",
    description: "We provide resources and follow-up sessions to reinforce learning and answer questions.",
    icon: MessageSquare,
  },
]

const faqs = [
  {
    question: "Who should attend accessibility training?",
    answer:
      "Our training is valuable for anyone involved in creating digital products, including designers, developers, content creators, product managers, QA testers, and leadership. We tailor the content to be relevant for each role and experience level.",
  },
  {
    question: "Do participants need prior accessibility knowledge?",
    answer:
      "No prior knowledge is required. Our training programs are designed to accommodate all levels of experience, from beginners to those with some accessibility background who want to deepen their knowledge.",
  },
  {
    question: "Can training be conducted remotely?",
    answer:
      "Yes, we offer both in-person and remote training options. Our virtual workshops are interactive and engaging, with hands-on exercises and opportunities for questions and discussion.",
  },
  {
    question: "How many people can participate in a training session?",
    answer:
      "For optimal learning, we recommend limiting workshops to 12-15 participants. For larger organizations, we can arrange multiple sessions or create a custom training program.",
  },
  {
    question: "Will we receive training materials?",
    answer:
      "Yes, all participants receive comprehensive digital training materials, including slides, checklists, reference guides, and exercise files. These resources serve as valuable references after the training.",
  },
  {
    question: "Do you offer ongoing support after training?",
    answer:
      "Yes, depending on the training package, we provide email support for 30-90 days after the workshop. We also offer follow-up sessions and additional resources to reinforce learning.",
  },
]

export default function AccessibilityTrainingPage() {
  return (
    <div className="container-wide py-12">
      <ServiceHero
        title="Accessibility Training"
        description="Empower your team with the knowledge and skills to create accessible digital products through our specialized training programs."
        cta="Book Training"
        ctaLink="/contact?service=training"
        icon={Users}
        gradientFrom="rgba(34, 197, 94, 0.8)"
        gradientTo="rgba(16, 185, 129, 0.8)"
      />

      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Who Benefits from Accessibility Training?</h2>
            <div className="space-y-4">
              <p className="text-lg">
                Our accessibility training programs are designed for teams and individuals involved in creating digital
                products. They're particularly valuable for:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Design teams</strong> learning to create accessible user interfaces and experiences
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Development teams</strong> implementing accessible code and functionality
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Content creators</strong> writing accessible content and creating alt text
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Product managers</strong> overseeing accessible product development
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>QA and testing teams</strong> learning to identify accessibility issues
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-muted/30 p-8 rounded-2xl border border-border">
            <h3 className="text-2xl font-bold mb-4">Benefits of Our Training Programs</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Practical Knowledge</h4>
                  <p className="text-muted-foreground">
                    Gain hands-on skills that can be immediately applied to real-world projects.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Role-Specific Content</h4>
                  <p className="text-muted-foreground">
                    Training tailored to different roles ensures relevant learning for everyone.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Team Alignment</h4>
                  <p className="text-muted-foreground">
                    Create a shared understanding of accessibility across your organization.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <Monitor className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Ongoing Support</h4>
                  <p className="text-muted-foreground">
                    Access to resources and support to reinforce learning after training.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30 rounded-3xl px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Training Process</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We deliver effective, engaging training through a structured process that ensures practical learning and
            retention.
          </p>
        </div>
        <ProcessSteps steps={trainingProcess} />
      </section>

      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Pricing Approach</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            We believe in transparent, value-based pricing that reflects the complexity and scope of your training
            needs.
          </p>
          <div className="bg-muted/30 p-8 md:p-10 rounded-2xl border border-border max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Flexible Options to Meet Your Needs</h3>
            <p className="mb-4">
              Our pricing is structured to provide maximum value while accommodating different training requirements and
              budgets:
            </p>
            <ul className="space-y-3 text-left mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <span>
                  <strong>Hourly rates</strong> ranging from $60 to $100 per hour based on training complexity and
                  specialist requirements
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <span>
                  <strong>Workshop-based pricing</strong> with clear deliverables and outcomes for more predictable
                  budgeting
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <span>
                  <strong>Customized training packages</strong> that can be tailored to your team's specific needs and
                  learning objectives
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
          <h2 className="text-3xl font-bold mb-4">Ready to Empower Your Team?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Contact us today to discuss your training needs and schedule a workshop for your team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact?service=training">Book Training</Link>
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
