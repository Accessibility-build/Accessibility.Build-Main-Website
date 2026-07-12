import Link from "next/link"
import {
  Accessibility,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  ExternalLink,
  Keyboard,
  Mail,
  MonitorSmartphone,
  ScanSearch,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createMetadata } from "@/lib/metadata"
import { businessLocation, company } from "@/lib/company"

const statementLastReviewed = "July 13, 2026"

export const metadata = createMetadata({
  title: "Accessibility Statement and Feedback",
  path: "/accessibility",
  description:
    "Accessibility.build's WCAG 2.2 AA target, current assessment status, scope, testing approach, compatibility information, and accessible feedback process.",
  keywords: [
    "Accessibility.build accessibility statement",
    "Accessibility.build accessibility feedback",
    "WCAG 2.2 AA statement",
  ],
  authors: [{ name: company.legalOperator, url: company.founderWebsite }],
})

const summary = [
  ["Technical target", "WCAG 2.2 Level AA"],
  ["Formal conformance claim", "Not currently declared"],
  ["Assessment basis", "Internal manual and automated review"],
  ["Feedback acknowledgement", "Within two business days"],
]

const pageLinks = [
  ["Commitment", "#commitment"],
  ["Scope", "#scope"],
  ["How we test", "#testing"],
  ["Compatibility", "#compatibility"],
  ["Feedback and help", "#feedback"],
  ["Assessment record", "#assessment"],
]

const practices = [
  {
    icon: Keyboard,
    title: "Keyboard and focus",
    text: "Core journeys are reviewed for keyboard operation, logical focus order, visible focus, and escape from interactive components.",
  },
  {
    icon: MonitorSmartphone,
    title: "Zoom and reflow",
    text: "Layouts are checked at narrow widths and increased zoom so content and controls remain readable without two-dimensional scrolling.",
  },
  {
    icon: Accessibility,
    title: "Semantics and assistive technology",
    text: "Headings, landmarks, names, states, instructions, errors, and dynamic updates are reviewed with native semantics and screen-reader behavior in mind.",
  },
  {
    icon: ScanSearch,
    title: "Automated checks",
    text: "Axe-based smoke tests help catch repeatable critical and serious problems. Results are reviewed because automation cannot determine full conformance.",
  },
]

export default function AccessibilityPage() {
  return (
    <div className="bg-background">
      <header className="border-b bg-slate-950 text-white">
        <div className="container-wide py-14 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 text-teal-300">
              <Accessibility className="h-6 w-6 shrink-0" aria-hidden="true" />
              <p className="text-sm font-semibold uppercase">Our own accessibility</p>
            </div>
            <h1 className="mt-4 break-words text-4xl font-semibold leading-tight [overflow-wrap:anywhere] sm:text-5xl">
              Accessibility statement
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              How Accessibility.build works toward an accessible website, how compatibility is approached, and how to get help or report a barrier.
            </p>
            <p className="mt-5 text-sm text-slate-400">Last reviewed: {statementLastReviewed}</p>
          </div>
        </div>
      </header>

      <div>
        <section className="border-b" aria-labelledby="status-heading">
          <div className="container-wide py-12 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase text-primary">Current position</p>
                <h2 id="status-heading" className="mt-2 text-3xl font-semibold">At a glance</h2>
                <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
                  We design and test toward WCAG 2.2 Level AA. We are not currently making a formal, site-wide conformance claim or claiming independent certification.
                </p>
              </div>
              <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {summary.map(([term, description]) => (
                  <div key={term} className="min-w-0 border-t pt-4">
                    <dt className="text-sm text-muted-foreground">{term}</dt>
                    <dd className="mt-1 break-words font-semibold [overflow-wrap:anywhere]">{description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <nav className="border-b bg-muted/30" aria-label="Accessibility statement sections">
          <div className="container-wide py-6">
            <p className="text-sm font-semibold">On this page</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-3 text-sm">
              {pageLinks.map(([label, href]) => (
                <li key={href}>
                  <a className="font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary" href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <section id="commitment" className="scroll-mt-24 border-b" aria-labelledby="commitment-heading">
          <div className="container-wide grid gap-10 py-14 lg:grid-cols-[0.7fr_1.3fr] lg:py-16">
            <div>
              <ShieldCheck className="h-7 w-7 text-primary" aria-hidden="true" />
              <h2 id="commitment-heading" className="mt-4 text-3xl font-semibold">Our commitment</h2>
            </div>
            <div className="max-w-3xl space-y-4 text-lg leading-8 text-muted-foreground">
              <p>
                Accessibility.build is committed to making its content, tools, account journeys, and support channels usable by people with disabilities. Accessibility is considered during design, implementation, review, and maintenance rather than treated only as a final check.
              </p>
              <p>
                Material barriers are prioritized according to user impact. When an immediate technical fix is not practical, we will work to provide the information or service through a reasonable accessible alternative.
              </p>
            </div>
          </div>
        </section>

        <section id="scope" className="scroll-mt-24 border-b bg-muted/20" aria-labelledby="scope-heading">
          <div className="container-wide py-14 lg:py-16">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase text-primary">Coverage and boundaries</p>
              <h2 id="scope-heading" className="mt-2 text-3xl font-semibold">What this statement covers</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                This statement covers the website at <a className="font-medium text-foreground underline" href={company.website}>{company.website}</a> and the journeys Accessibility.build can directly design and maintain.
              </p>
            </div>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <div className="border-t pt-5">
                <CheckCircle2 className="h-6 w-6 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
                <h3 className="mt-3 text-xl font-semibold">Included</h3>
                <ul className="mt-4 space-y-3 leading-7 text-muted-foreground">
                  <li>public pages, research, guides, checklists, and WCAG references;</li>
                  <li>free and account-based accessibility tools;</li>
                  <li>sign-in, onboarding, dashboard, billing, and profile journeys we control;</li>
                  <li>contact, support, and professional-service enquiry routes;</li>
                  <li>downloadable resources produced and maintained by Accessibility.build.</li>
                </ul>
              </div>
              <div className="border-t pt-5">
                <CircleAlert className="h-6 w-6 text-amber-700 dark:text-amber-300" aria-hidden="true" />
                <h3 className="mt-3 text-xl font-semibold">Partly outside our control</h3>
                <ul className="mt-4 space-y-3 leading-7 text-muted-foreground">
                  <li>hosted authentication, payment, email, analytics, and form services;</li>
                  <li>linked third-party websites and external documents;</li>
                  <li>user-submitted websites, images, files, code, and other content;</li>
                  <li>browser extensions and unsupported browser or assistive-technology versions.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="testing" className="scroll-mt-24 border-b" aria-labelledby="testing-heading">
          <div className="container-wide py-14 lg:py-16">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase text-primary">Design and evaluation</p>
              <h2 id="testing-heading" className="mt-2 text-3xl font-semibold">How accessibility is supported</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Review combines code-level practices, manual interaction checks, assistive-technology considerations, and automated testing. No single method can establish full WCAG conformance.
              </p>
            </div>
            <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2">
              {practices.map(({ icon: Icon, title, text }) => (
                <article key={title} className="border-t pt-5">
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 leading-7 text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
            <p className="mt-10 max-w-3xl leading-7 text-muted-foreground">
              Additional checks include color contrast, text spacing, motion preferences, labels, instructions, error handling, heading structure, landmarks, and accessible names and states. The <Link className="font-medium text-foreground underline" href="/methodology">audit methodology</Link> explains the broader professional testing process.
            </p>
          </div>
        </section>

        <section id="compatibility" className="scroll-mt-24 border-b" aria-labelledby="compatibility-heading">
          <div className="container-wide grid gap-10 py-14 lg:grid-cols-[0.7fr_1.3fr] lg:py-16">
            <div>
              <MonitorSmartphone className="h-7 w-7 text-primary" aria-hidden="true" />
              <h2 id="compatibility-heading" className="mt-4 text-3xl font-semibold">Compatibility and technical basis</h2>
            </div>
            <div className="max-w-3xl space-y-4 leading-7 text-muted-foreground">
              <p>
                The site is designed for current stable versions of Chrome, Edge, Firefox, and Safari and for common keyboard, screen-reader, zoom, and voice-input use. Results can vary by operating system, browser, assistive technology, extension, and user setting.
              </p>
              <p>
                Accessibility depends on modern HTML, CSS, JavaScript, and WAI-ARIA support. Core information should remain structured and understandable, while some interactive tools require JavaScript to perform their intended function.
              </p>
            </div>
          </div>
        </section>

        <section id="feedback" className="scroll-mt-24 border-b bg-slate-950 text-white" aria-labelledby="feedback-heading">
          <div className="container-wide grid gap-10 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:py-16">
            <div>
              <Mail className="h-7 w-7 text-teal-300" aria-hidden="true" />
              <p className="mt-4 text-sm font-semibold uppercase text-teal-300">Feedback and assistance</p>
              <h2 id="feedback-heading" className="mt-2 text-3xl font-semibold">Report a barrier or request an alternative</h2>
            </div>
            <div>
              <p className="text-lg leading-8 text-slate-300">
                Tell us what you were trying to do, the page or tool involved, what happened, and the browser or assistive technology used. You can also request information in an alternative format or ask for help completing a task.
              </p>
              <p className="mt-4 leading-7 text-slate-400">
                Do not include passwords, payment-card details, or confidential customer information. We aim to acknowledge accessibility feedback within two business days. Resolution time depends on impact, complexity, and third-party involvement.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild className="bg-teal-300 text-slate-950 hover:bg-teal-200">
                  <Link href="/contact?topic=accessibility">
                    Report an accessibility barrier <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-slate-600 bg-transparent text-white hover:bg-slate-900 hover:text-white">
                  <a href={`mailto:${company.accessibilityEmail}?subject=Accessibility%20feedback`}>
                    Email {company.accessibilityEmail} <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
              </div>
              <p className="mt-6 text-sm leading-6 text-slate-400">
                If your report is not acknowledged within two business days, resend it with “Accessibility escalation” in the subject line.
              </p>
            </div>
          </div>
        </section>

        <section id="assessment" className="scroll-mt-24" aria-labelledby="assessment-heading">
          <div className="container-wide py-14 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <ClipboardCheck className="h-7 w-7 text-primary" aria-hidden="true" />
                <h2 id="assessment-heading" className="mt-4 text-3xl font-semibold">Assessment and review record</h2>
              </div>
              <div className="max-w-3xl">
                <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div className="border-t pt-4">
                    <dt className="text-sm text-muted-foreground">Last reviewed</dt>
                    <dd className="mt-1 font-semibold">{statementLastReviewed}</dd>
                  </div>
                  <div className="border-t pt-4">
                    <dt className="text-sm text-muted-foreground">Assessment type</dt>
                    <dd className="mt-1 font-semibold">Internal review and development testing</dd>
                  </div>
                  <div className="border-t pt-4">
                    <dt className="text-sm text-muted-foreground">Independent certification</dt>
                    <dd className="mt-1 font-semibold">Not claimed</dd>
                  </div>
                  <div className="border-t pt-4">
                    <dt className="text-sm text-muted-foreground">Responsible operator</dt>
                    <dd className="mt-1 font-semibold">{company.legalOperator}</dd>
                  </div>
                </dl>
                <p className="mt-8 leading-7 text-muted-foreground">
                  This review clarified the formal status, covered scope, testing approach, compatibility information, feedback route, and escalation process. The statement is reviewed after material website or service changes and when reported barriers show that it is incomplete or inaccurate.
                </p>
                <p className="mt-4 leading-7 text-muted-foreground">
                  Accessibility.build is owned and operated by {company.legalOperator} in {businessLocation}. See the <Link className="font-medium text-foreground underline" href="/trust">Trust Centre</Link>, <Link className="font-medium text-foreground underline" href="/privacy">Privacy Policy</Link>, and <Link className="font-medium text-foreground underline" href="/corrections-policy">Corrections Policy</Link> for related accountability information.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
