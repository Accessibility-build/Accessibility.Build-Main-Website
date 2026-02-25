import Link from "next/link"
import { ArrowRight, AlertCircle, Brain, Heart, Lightbulb, Mail, Shield, Target, Users, Zap } from "lucide-react"
import { createMetadata } from "@/lib/metadata"
import { Button } from "@/components/ui/button"
import { publicMetrics } from "@/lib/public-metrics"

export const metadata = createMetadata({
  title: "About Accessibility.build | Making the Web Accessible",
  description: "Learn about our mission to make web accessibility tools and education accessible to everyone.",
  keywords: ["accessibility", "web accessibility", "a11y", "WCAG", "inclusive design"],
})

const focusAreas = [
  {
    title: "AI-Powered Tools",
    description: "Smart accessibility testing, code generation, and analysis tools that enhance developer productivity.",
    icon: Zap,
    accent: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/40",
  },
  {
    title: "Human-Centered Education",
    description: "Comprehensive guides and resources that focus on understanding real user needs and experiences.",
    icon: Users,
    accent: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-950/40",
  },
  {
    title: "Inclusive Community",
    description: "Supporting developers in building truly inclusive digital experiences for everyone.",
    icon: Heart,
    accent: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/40",
  },
]

const impactStats = [
  {
    value: publicMetrics.standardsAlignment.value,
    label: publicMetrics.standardsAlignment.label,
  },
  {
    value: publicMetrics.methodology.value,
    label: publicMetrics.methodology.label,
  },
  {
    value: publicMetrics.servicesDelivery.value,
    label: publicMetrics.servicesDelivery.label,
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/40 to-background">
        <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(circle_at_top,_hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="container-wide relative py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Brain className="h-4 w-4" />
              AI-Powered Accessibility Platform
            </span>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
              Making the Web Accessible
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              We build intelligent tools and resources to help developers create accessible web experiences for everyone.
            </p>
          </div>
        </div>
      </section>

      <section className="container-wide py-14 md:py-20">
        <div className="rounded-3xl border bg-card p-8 shadow-sm md:p-12">
          <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">Our Core Philosophy</h2>
          <blockquote className="border-l-4 border-primary pl-5 text-xl font-semibold leading-relaxed md:text-2xl">
            AI cannot fix accessibility issues, but AI can help us make the world more accessible.
          </blockquote>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border bg-muted/30 p-6">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                The Reality
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                True accessibility requires human understanding, empathy, and intentional design decisions. AI is a
                powerful tool, but it cannot replace human judgment in creating inclusive experiences.
              </p>
            </div>

            <div className="rounded-2xl border bg-muted/30 p-6">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Our Approach
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                We use AI to empower developers with insights, recommendations, and efficient workflows, enhancing
                human capability rather than replacing human responsibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide pb-14 md:pb-20">
        <div className="mb-10 max-w-3xl">
          <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">What We Do</h2>
          <p className="text-lg text-muted-foreground">
            We combine cutting-edge AI technology with human-centered design principles.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {focusAreas.map((item) => {
            const Icon = item.icon

            return (
              <article key={item.title} className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${item.bg}`}>
                  <Icon className={`h-6 w-6 ${item.accent}`} />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{item.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="container-wide py-14 md:py-20">
          <div className="mb-8 max-w-3xl">
            <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Our Impact</h2>
            <p className="text-lg text-muted-foreground">Empowering developers to create accessible experiences.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {impactStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border bg-background p-6 text-center shadow-sm">
                <p className="mb-2 text-4xl font-bold tracking-tight text-primary md:text-5xl">{stat.value}</p>
                <p className="text-sm font-medium text-muted-foreground sm:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide py-14 md:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border bg-card p-7 shadow-sm">
            <h2 className="mb-4 flex items-center gap-3 text-2xl font-semibold md:text-3xl">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </span>
              Mission
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              To make web accessibility tools and knowledge accessible to everyone, using AI to enhance human
              capability rather than replace human responsibility.
            </p>
          </article>

          <article className="rounded-2xl border bg-card p-7 shadow-sm">
            <h2 className="mb-4 flex items-center gap-3 text-2xl font-semibold md:text-3xl">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </span>
              Vision
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              A web where accessibility is the default, not an afterthought, achieved through the thoughtful
              combination of AI assistance and human empathy.
            </p>
          </article>
        </div>
      </section>

      <section className="border-t bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide py-14 md:py-20">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-10 lg:p-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent_48%)]" />

            <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-slate-50">
                  Ready to Build Accessibility Into Every Release?
                </h2>
                <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                  Use practical AI support and expert guidance to make accessibility a consistent part of your
                  product workflow.
                </p>
              </div>

              <div className="grid gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-12 w-full justify-between rounded-xl bg-slate-900 px-5 text-left text-base font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  <Link href="/tools">
                    <span>Explore Accessibility Tools</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 w-full justify-between rounded-xl border-slate-300 bg-white px-5 text-left text-base font-semibold text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-transparent dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  <Link href="/contact">
                    <span>Contact Our Team</span>
                    <Mail className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
