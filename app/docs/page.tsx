import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Braces,
  CheckCircle2,
  Code2,
  Download,
  FileJson,
  Laptop,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Developer Resources",
  description:
    "Practical Accessibility.build resources for accessible frontend development, local tools, WCAG testing, structured exports, and the macOS desktop app.",
  alternates: { canonical: "/docs" },
}

const resources = [
  {
    title: "React accessibility guide",
    description: "Semantic JSX, forms, focus management, modal behavior, live regions, and automated testing.",
    href: "/guides/react-accessibility",
    icon: Code2,
    action: "Read the React guide",
  },
  {
    title: "WCAG 2.2 implementation guides",
    description: "Requirements, examples, testing methods, and common failures for every WCAG 2.2 success criterion.",
    href: "/wcag",
    icon: BookOpen,
    action: "Browse WCAG guides",
  },
  {
    title: "Accessible component patterns",
    description: "Working examples for modals, tables, carousels, pagination, and search interfaces.",
    href: "/learn",
    icon: Braces,
    action: "Explore patterns",
  },
  {
    title: "Structured tool exports",
    description: "Create JSON, CSV, spreadsheet, PDF, HTML, Markdown, and design-token outputs where each tool supports them.",
    href: "/tools",
    icon: FileJson,
    action: "Open the tools",
  },
  {
    title: "WCAG checklist downloads",
    description: "Use the interactive checklist or download a spreadsheet for implementation and review work.",
    href: "/checklists/wcag-2-2",
    icon: Download,
    action: "Open the checklist",
  },
  {
    title: "macOS desktop toolkit",
    description: "Run contrast checks, annotate issue captures, and simulate color-vision conditions locally on your Mac.",
    href: "/desktop",
    icon: Laptop,
    action: "View the desktop app",
  },
]

export default function DeveloperResourcesPage() {
  return (
    <div className="bg-background">
      <header className="border-b bg-slate-950 text-white">
        <div className="container-wide py-16 lg:py-20">
          <p className="text-sm font-semibold uppercase text-teal-300">Developer resources</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
            Build and verify accessible interfaces
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Use implementation guides, working patterns, local utilities, checklists, and structured exports without depending on a proprietary integration.
          </p>
        </div>
      </header>

      <div className="container-wide py-14 lg:py-20">
        <section aria-labelledby="availability-heading" className="border-b pb-12">
          <div className="flex max-w-4xl items-start gap-4 border border-slate-300 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden="true" />
            <div>
              <h2 id="availability-heading" className="text-xl font-semibold">Integration availability</h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                Accessibility.build does not currently offer a public REST API, API keys, or official language SDKs. Public documentation will be added only when a supported integration is available and its behavior can be tested end to end.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="resources-heading" className="py-12">
          <div className="max-w-3xl">
            <h2 id="resources-heading" className="text-3xl font-semibold">Resources available now</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Each destination below is maintained as part of the current website or desktop release.
            </p>
          </div>
          <div className="mt-8 grid gap-px border bg-border md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => {
              const Icon = resource.icon
              return (
                <article key={resource.href} className="flex min-h-64 flex-col bg-background p-6">
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-semibold">{resource.title}</h3>
                  <p className="mt-3 flex-1 leading-7 text-muted-foreground">{resource.description}</p>
                  <Link href={resource.href} className="mt-6 inline-flex items-center font-semibold text-primary underline-offset-4 hover:underline">
                    {resource.action} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              )
            })}
          </div>
        </section>

        <section className="border-t pt-12" aria-labelledby="workflow-heading">
          <h2 id="workflow-heading" className="text-3xl font-semibold">A practical workflow</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["1", "Check", "Use automated tools to identify detectable issues and collect reproducible evidence."],
              ["2", "Verify", "Test keyboard behavior, screen-reader output, zoom, reflow, and relevant manual requirements."],
              ["3", "Document", "Export findings in the format your implementation or procurement process can use."],
            ].map(([number, title, description]) => (
              <li key={number} className="border-t pt-5">
                <span className="text-sm font-semibold text-primary">Step {number}</span>
                <h3 className="mt-2 text-xl font-semibold">{title}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{description}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/tools"><CheckCircle2 className="mr-2 h-4 w-4" />Choose a tool</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Discuss implementation support</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
