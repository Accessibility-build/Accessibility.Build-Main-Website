import Link from "next/link"
import {
  Bot,
  CheckCircle2,
  ClipboardCheck,
  FileOutput,
  Keyboard,
  Repeat2,
  ScanSearch,
  TriangleAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createMetadata } from "@/lib/metadata"
import { company } from "@/lib/company"

export const metadata = createMetadata({
  title: "Accessibility Audit Methodology",
  path: "/methodology",
  description:
    "How Accessibility.build scopes, tests, documents, prioritizes, and retests web accessibility engagements using manual, assistive-technology, and automated evaluation.",
  keywords: [
    "accessibility audit methodology",
    "manual WCAG testing process",
    "screen reader audit methodology",
    "Accessibility.build methodology",
  ],
  authors: [{ name: company.legalOperator, url: company.founderWebsite }],
})

const workflow = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Scope and success conditions",
    text: "Define the product, page or workflow sample, target standard, conformance level, supported platforms, account states, exclusions, deliverables, and retest terms.",
  },
  {
    icon: ScanSearch,
    step: "02",
    title: "Automated and structural review",
    text: "Use automated rules and code inspection to identify efficiently detectable issues, then validate findings before reporting them.",
  },
  {
    icon: Keyboard,
    step: "03",
    title: "Manual interaction testing",
    text: "Test keyboard operation, focus, forms, errors, semantics, zoom, reflow, contrast, pointer interactions, media, dynamic updates, and relevant screen-reader behavior.",
  },
  {
    icon: FileOutput,
    step: "04",
    title: "Evidence and reporting",
    text: "Document reproducible steps, expected and actual behavior, user impact, relevant WCAG mapping, severity, screenshots or code context, and remediation direction.",
  },
  {
    icon: Repeat2,
    step: "05",
    title: "Remediation and retest",
    text: "Support implementation as agreed, retest the original failure against the defined environment, and distinguish fixed, partially fixed, not fixed, and not retested outcomes.",
  },
]

const deliverables = [
  "executive summary with scope, limitations, risk themes, and recommended priorities",
  "issue register with reproducible evidence and WCAG references",
  "severity and user-impact classification",
  "browser and assistive-technology matrix used for the engagement",
  "remediation guidance appropriate to the agreed package",
  "retest status when retesting is included",
]

export default function MethodologyPage() {
  return (
    <div className="bg-background">
      <section className="border-b bg-slate-950 text-white">
        <div className="container-wide py-16 lg:py-24">
          <p className="text-sm font-semibold uppercase text-teal-300">Professional practice</p>
          <h1 className="mt-3 max-w-5xl break-words text-4xl font-semibold leading-tight [overflow-wrap:anywhere] sm:text-6xl">Accessibility audit methodology</h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">
            A transparent process for turning accessibility requirements into reproducible findings, practical fixes, and accountable retest outcomes.
          </p>
        </div>
      </section>

      <section className="container-wide py-16 lg:py-20" aria-labelledby="workflow-heading">
        <div className="max-w-3xl">
          <h2 id="workflow-heading" className="text-4xl font-semibold">How an engagement works</h2>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            The exact sample and technology matrix vary by product and package. They are agreed in writing rather than implied by a generic “full compliance” promise.
          </p>
        </div>
        <ol className="mt-12 space-y-0 border-t">
          {workflow.map(({ icon: Icon, step, title, text }) => (
            <li key={step} className="grid gap-4 border-b py-8 md:grid-cols-[4rem_1fr_2fr] md:items-start">
              <span className="text-sm font-semibold text-primary">{step}</span>
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <h3 className="font-semibold">{title}</h3>
              </div>
              <p className="leading-7 text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y bg-muted/30">
        <div className="container-wide grid gap-12 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <Bot className="h-7 w-7 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-semibold">Automation and AI</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Automated rules are useful for speed and repeatability. AI may help organize information or draft explanations. Neither replaces manual interaction testing, user-impact analysis, or professional judgment.
            </p>
            <p className="mt-4 leading-7 text-muted-foreground">
              Potential automated findings are validated before they are represented as confirmed issues. Tool output alone is not described as certification or proof of legal compliance.
            </p>
          </div>
          <div>
            <TriangleAlert className="h-7 w-7 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-semibold">What an audit does not guarantee</h2>
            <ul className="mt-5 space-y-3 leading-7 text-muted-foreground">
              <li>It does not guarantee that every possible barrier has been found outside the agreed sample.</li>
              <li>It is not legal advice and does not replace advice from qualified counsel.</li>
              <li>It represents the tested version, environment, standard, and date.</li>
              <li>It does not prevent future regressions after product or content changes.</li>
              <li>A conformance statement requires appropriate scope and evidence, not merely an issue count.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container-wide grid gap-12 py-16 lg:grid-cols-2 lg:py-20">
        <div>
          <CheckCircle2 className="h-7 w-7 text-primary" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-semibold">Typical deliverables</h2>
          <ul className="mt-6 space-y-3 leading-7 text-muted-foreground">
            {deliverables.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <aside className="border bg-slate-50 p-8 dark:bg-slate-950">
          <h2 className="text-2xl font-semibold">Standards and test coverage</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            WCAG 2.2 Level A and AA are the common technical baseline. Section 508, EN 301 549, and jurisdiction-specific expectations may be mapped when included in scope. Screen-reader and browser combinations are selected for the audience and product rather than promising every possible combination.
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            The named practitioner responsible for delivery is {company.legalOperator}. Specialist participation, if required, is disclosed during scoping.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/services/accessibility-audits">View audit packages</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Discuss scope</Link>
            </Button>
          </div>
        </aside>
      </section>
    </div>
  )
}
