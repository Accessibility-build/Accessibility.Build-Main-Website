"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CircleHelp,
  CreditCard,
  FileText,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const topics = ["All", "Getting started", "Tools", "Standards", "Account and billing", "Services"] as const
type Topic = (typeof topics)[number]

const resources = [
  { title: "Start an accessibility audit", description: "A step-by-step workflow for scope, automated checks, manual testing, evidence, and reporting.", topic: "Getting started", href: "/guides/how-to-audit-website-accessibility", icon: Sparkles },
  { title: "Choose an accessibility tool", description: "Compare all available audit, content, design, planning, and developer utilities.", topic: "Tools", href: "/tools", icon: Wrench },
  { title: "Use the contrast checker", description: "Test foreground and background colors against WCAG 2.2 contrast requirements.", topic: "Tools", href: "/tools/contrast-checker", icon: ShieldCheck },
  { title: "Review AI-generated alt text", description: "Generate a draft, then verify purpose, context, repetition, and decorative-image handling.", topic: "Tools", href: "/tools/alt-text-generator", icon: FileText },
  { title: "Understand WCAG 2.2", description: "Browse every success criterion with plain-language requirements, examples, and testing methods.", topic: "Standards", href: "/wcag", icon: BookOpen },
  { title: "Use the WCAG 2.2 checklist", description: "Track Level A and AA criteria interactively or download a spreadsheet.", topic: "Standards", href: "/checklists/wcag-2-2", icon: ShieldCheck },
  { title: "Manage credits and receipts", description: "Review one-time credit packs, payment history, receipts, refunds, and billing support.", topic: "Account and billing", href: "/pricing", icon: CreditCard },
  { title: "Manage your account", description: "Update profile, authentication methods, security settings, and connected accounts.", topic: "Account and billing", href: "/profile", icon: CircleHelp },
  { title: "Review service options", description: "Compare accessibility audits, remediation, design reviews, training, documentation, and user testing.", topic: "Services", href: "/services", icon: Sparkles },
  { title: "Prepare a project brief", description: "Share service needs, URLs, technology, deliverable format, timeline, budget, and procurement requirements.", topic: "Services", href: "/contact", icon: FileText },
] satisfies Array<{ title: string; description: string; topic: Exclude<Topic, "All">; href: string; icon: typeof BookOpen }>

const faqs = [
  ["Do automated tools prove WCAG conformance?", "No. Automated checks detect only some issue types. Keyboard, screen-reader, zoom, reflow, content, and task-based manual review remain necessary."],
  ["Which standard should I use now?", "Use the standard required by your legal, policy, contractual, or procurement context. WCAG 2.2 is the current W3C Recommendation; WCAG 3 remains a developing draft."],
  ["Where are my tool and credit records?", "Signed-in users can review credit and recent tool-usage records on the dashboard. URL audit history is available inside the URL Accessibility Auditor."],
  ["Can I request a spreadsheet instead of a web report?", "Yes. Professional service deliverables can be prepared as a spreadsheet, PDF, or private web report when agreed in the project scope."],
]

export function HelpCenterClient() {
  const [query, setQuery] = useState("")
  const [topic, setTopic] = useState<Topic>("All")

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return resources.filter((resource) => {
      const topicMatches = topic === "All" || resource.topic === topic
      const queryMatches = !normalized || `${resource.title} ${resource.description} ${resource.topic}`.toLowerCase().includes(normalized)
      return topicMatches && queryMatches
    })
  }, [query, topic])

  return (
    <div className="bg-background">
      <header className="border-b bg-slate-950 text-white">
        <div className="container-wide py-16 lg:py-20">
          <p className="text-sm font-semibold uppercase text-teal-300">Help center</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-6xl">Find a working answer</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Search current tool guidance, WCAG references, account information, billing support, and professional service resources.
          </p>
          <div className="relative mt-8 max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <label htmlFor="help-search" className="sr-only">Search help resources</label>
            <Input id="help-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools, billing, WCAG, or services" className="h-12 border-slate-700 bg-slate-900 pl-12 text-white placeholder:text-slate-400" />
          </div>
        </div>
      </header>

      <div className="container-wide py-12 lg:py-16">
        <section aria-labelledby="help-resources-heading">
          <div className="flex flex-col gap-6 border-b pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 id="help-resources-heading" className="text-3xl font-semibold">Help resources</h2>
              <p className="mt-2 text-muted-foreground" aria-live="polite">{filtered.length} {filtered.length === 1 ? "resource" : "resources"} shown</p>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Filter help resources by topic">
              {topics.map((item) => (
                <Button key={item} type="button" variant={topic === item ? "default" : "outline"} size="sm" onClick={() => setTopic(item)} aria-pressed={topic === item}>
                  {item}
                </Button>
              ))}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-px border-x border-b bg-border md:grid-cols-2">
              {filtered.map((resource) => {
                const Icon = resource.icon
                return (
                  <article key={resource.href} className="flex min-h-52 flex-col bg-background p-6">
                    <div className="flex items-center gap-3 text-sm font-semibold text-primary"><Icon className="h-5 w-5" aria-hidden="true" />{resource.topic}</div>
                    <h3 className="mt-4 text-xl font-semibold">{resource.title}</h3>
                    <p className="mt-2 flex-1 leading-7 text-muted-foreground">{resource.description}</p>
                    <Link href={resource.href} className="mt-5 inline-flex items-center font-semibold text-primary underline-offset-4 hover:underline">Open resource <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="border-x border-b p-10 text-center">
              <p className="font-semibold">No matching help resources</p>
              <p className="mt-2 text-muted-foreground">Try a broader term or clear the selected topic.</p>
              <Button type="button" variant="outline" className="mt-5" onClick={() => { setQuery(""); setTopic("All") }}>Clear filters</Button>
            </div>
          )}
        </section>

        <section aria-labelledby="help-faq-heading" className="border-b py-12">
          <h2 id="help-faq-heading" className="text-3xl font-semibold">Common questions</h2>
          <dl className="mt-8 grid gap-8 md:grid-cols-2">
            {faqs.map(([question, answer]) => <div key={question} className="border-t pt-5"><dt className="font-semibold">{question}</dt><dd className="mt-2 leading-7 text-muted-foreground">{answer}</dd></div>)}
          </dl>
        </section>

        <section className="py-12" aria-labelledby="support-heading">
          <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
          <h2 id="support-heading" className="mt-3 text-3xl font-semibold">Need a direct response?</h2>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Send the affected URL, tool name, approximate time, browser, and a non-sensitive description. Do not include credentials, payment-card details, or private customer data.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild><Link href="/contact"><Mail className="mr-2 h-4 w-4" />Contact Accessibility.build</Link></Button>
            <Button variant="outline" asChild><a href="mailto:contact@accessibility.build">Email directly</a></Button>
          </div>
        </section>
      </div>
    </div>
  )
}
