"use client"

import Link from "next/link"
import {
  Accessibility,
  ArrowRight,
  ArrowUp,
  BarChart3,
  BadgeCheck,
  BookA,
  BookOpen,
  BookOpenCheck,
  BookOpenText,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CircleCheck,
  Clock3,
  Contrast,
  Cookie,
  ExternalLink,
  FileCheck2,
  FileText,
  Gavel,
  Heading,
  ImageIcon,
  Info,
  Landmark,
  LibraryBig,
  ListChecks,
  Linkedin,
  LockKeyhole,
  Mail,
  MapPin,
  Microscope,
  Network,
  Newspaper,
  PenLine,
  ReceiptText,
  Scale,
  ScanSearch,
  ScrollText,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { NewsletterSignup } from "@/components/newsletter-signup"
import ClientOnly from "@/components/client-only"
import { Logo } from "@/components/logo"
import { company } from "@/lib/company"

interface FooterLink {
  href: string
  label: string
  icon: LucideIcon
}

const toolLinks: FooterLink[] = [
  { href: "/tools/accessibility-audit-helper", label: "Accessibility Auditor", icon: ScanSearch },
  { href: "/tools/alt-text-generator", label: "AI Alt Text Generator", icon: ImageIcon },
  { href: "/tools/contrast-checker", label: "Contrast Checker", icon: Contrast },
  { href: "/tools/heading-analyzer", label: "Heading Analyzer", icon: Heading },
  { href: "/tools/scope-checker", label: "Scope Checker", icon: ListChecks },
  { href: "/tools/accessibility-roi-calculator", label: "ROI Calculator", icon: Calculator },
]

const researchLinks: FooterLink[] = [
  { href: "/research", label: "Research Hub", icon: LibraryBig },
  { href: "/research/state-of-accessibility", label: "State of Accessibility", icon: BarChart3 },
  { href: "/research/accessibility-lawsuits", label: "Lawsuit Tracker", icon: Gavel },
  { href: "/compliance", label: "Compliance & Laws", icon: Scale },
  { href: "/wcag-3", label: "WCAG 3.0 Guide", icon: BookOpen },
  { href: "/industries", label: "Industry Guidance", icon: Building2 },
]

const learningLinks: FooterLink[] = [
  { href: "/wcag", label: "WCAG Success Criteria", icon: BookOpenCheck },
  { href: "/checklists/wcag-2-2", label: "WCAG 2.2 Checklist", icon: ListChecks },
  { href: "/guides", label: "Implementation Guides", icon: BookOpenText },
  { href: "/glossary", label: "Accessibility Glossary", icon: BookA },
  { href: "/blog", label: "Accessibility Blog", icon: Newspaper },
  { href: "/resources", label: "Learning Resources", icon: LibraryBig },
]

const companyLinks: FooterLink[] = [
  { href: "/services", label: "Professional Services", icon: BriefcaseBusiness },
  { href: "/about", label: "About", icon: Info },
  { href: "/authors/khushwant-parihar", label: "Founder Profile", icon: UserRound },
  { href: "/sample-audit-report", label: "Sample Audit Report", icon: FileText },
  { href: "/methodology", label: "Audit Methodology", icon: Microscope },
  { href: "/trust", label: "Trust Centre", icon: ShieldCheck },
  { href: "/procurement", label: "Procurement", icon: Landmark },
  { href: "/contact", label: "Contact", icon: Mail },
]

const legalLinks: FooterLink[] = [
  { href: "/accessibility", label: "Accessibility Statement", icon: Accessibility },
  { href: "/privacy", label: "Privacy Policy", icon: LockKeyhole },
  { href: "/cookies", label: "Cookie Policy", icon: Cookie },
  { href: "/terms", label: "Terms of Service", icon: ScrollText },
  { href: "/refund", label: "Refund Policy", icon: ReceiptText },
  { href: "/editorial-policy", label: "Editorial Policy", icon: PenLine },
  { href: "/corrections-policy", label: "Corrections Policy", icon: CircleCheck },
  { href: "/subprocessors", label: "Subprocessors", icon: Network },
]

const trustSignals = [
  { icon: BadgeCheck, value: "Founder-owned", label: "Named delivery accountability" },
  { icon: FileCheck2, value: "GST-registered", label: "Indian sole proprietorship" },
  { icon: ScanSearch, value: "Human-reviewed", label: "Manual and automated testing" },
  { icon: BookOpenCheck, value: "WCAG 2.2", label: "Standards-aligned methodology" },
]

const linkClassName =
  "group inline-flex min-h-8 items-center gap-2 py-1 text-sm leading-6 text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer id="site-footer" className="border-t border-slate-800 bg-slate-950 text-slate-100">
      <div className="container-wide">
        <div className="grid gap-10 py-12 lg:grid-cols-12 lg:gap-12 lg:py-16">
          <div className="min-w-0 lg:col-span-7">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                aria-label="Accessibility.build home"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-white text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <Logo className="h-8 w-8" />
              </Link>
              <div>
                <p className="text-sm font-medium text-teal-300">Independent accessibility practice</p>
                <h2 className="mt-1 text-3xl font-semibold text-white sm:text-4xl">Accessibility.build</h2>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Founder-led accessibility audits, remediation support, training, and practical guidance with defined scope, reproducible evidence, and reporting your team can use.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="w-full justify-between bg-white text-slate-950 hover:bg-slate-200 sm:w-auto sm:min-w-48">
                <Link href="/contact">
                  Discuss a project <ArrowRight className="ml-3 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full justify-start border-slate-700 bg-transparent text-white hover:bg-slate-900 hover:text-white sm:w-auto sm:min-w-48">
                <Link href="/services">
                  <BriefcaseBusiness className="mr-2 h-4 w-4" aria-hidden="true" /> Explore services
                </Link>
              </Button>
            </div>

            <div className="mt-8 grid max-w-3xl gap-3 text-sm text-slate-400 sm:grid-cols-3">
              <a href={`mailto:${company.email}`} className="inline-flex min-h-10 min-w-0 items-center gap-2 border-t border-slate-800 pt-3 text-slate-200 hover:text-white sm:border-t-0 sm:pt-0">
                <Mail className="h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" />
                <span className="min-w-0 break-all">{company.email}</span>
              </a>
              <span className="inline-flex min-h-10 items-center gap-2 border-t border-slate-800 pt-3 sm:border-t-0 sm:pt-0">
                <Clock3 className="h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" /> {company.responseTime}
              </span>
              <span className="inline-flex min-h-10 items-center gap-2 border-t border-slate-800 pt-3 sm:border-t-0 sm:pt-0">
                <MapPin className="h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" /> {company.location.city}, {company.location.country}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <p className="text-sm font-medium text-teal-300">The Accessibility.build Brief</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Practical accessibility updates for working teams</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">
              A concise email covering important WCAG changes, implementation guidance, original research, and useful new tools.
            </p>

            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-300" aria-label="Newsletter topics">
              <li className="inline-flex items-center gap-1.5"><BookOpenCheck className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" /> Standards updates</li>
              <li className="inline-flex items-center gap-1.5"><Microscope className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" /> Practical research</li>
              <li className="inline-flex items-center gap-1.5"><ScanSearch className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" /> Testing guidance</li>
            </ul>

            <ClientOnly
              fallback={
                <div className="mt-5 space-y-3" aria-hidden="true">
                  <div className="h-12 animate-pulse border border-slate-700 bg-slate-900" />
                  <div className="h-4 w-2/3 animate-pulse bg-slate-800" />
                </div>
              }
            >
              <NewsletterSignup
                source="footer"
                compact={true}
                placeholder="Email address"
                buttonText="Join the brief"
                className="mt-5 [&_form]:flex-col sm:[&_form]:flex-row [&_input]:h-12 [&_input]:min-w-0 [&_input]:rounded-md [&_input]:border-slate-700 [&_input]:bg-slate-900 [&_input]:text-white [&_input]:placeholder:text-slate-400 [&_button]:h-12 [&_button]:w-full [&_button]:rounded-md [&_button]:bg-teal-400 [&_button]:px-5 [&_button]:font-semibold [&_button]:text-slate-950 [&_button:hover]:bg-teal-300 sm:[&_button]:w-auto [&_.alert]:border-slate-700"
              />
            </ClientOnly>

            <div className="mt-4 flex flex-col items-start gap-2 border-t border-slate-800 pt-4 text-xs leading-5 text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <p>Sent occasionally. Unsubscribe at any time.</p>
              <Link href="/privacy" className="inline-flex min-h-8 items-center gap-1.5 font-medium text-slate-200 hover:text-white">
                <LockKeyhole className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" /> How your email is handled
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 border-y border-slate-800 sm:grid-cols-4">
          {trustSignals.map(({ icon: Icon, value, label }, index) => (
            <div
              key={value}
              className={`flex min-w-0 items-start gap-3 px-4 py-5 sm:px-5 ${index % 2 === 0 ? "border-r border-slate-800" : ""} ${index < 2 ? "border-b border-slate-800 sm:border-b-0" : ""} sm:border-r sm:last:border-r-0`}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" aria-hidden="true" />
              <div className="min-w-0">
                <p className="font-semibold text-white">{value}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          {[
            { label: "Tools", links: toolLinks },
            { label: "Research", links: researchLinks },
            { label: "Learn", links: learningLinks },
            { label: "Company", links: companyLinks },
            { label: "Legal", links: legalLinks },
          ].map((group) => (
            <nav key={group.label} aria-label={`${group.label} links`}>
              <h3 className="text-sm font-semibold text-white">{group.label}</h3>
              <ul className="mt-4 space-y-1">
                {group.links.map((item) => {
                  const Icon = item.icon
                  return (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClassName}>
                      <Icon className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-teal-300" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                  )
                })}
              </ul>
            </nav>
          ))}
        </div>

        <div className="grid gap-6 border-t border-slate-800 py-7 text-xs leading-5 text-slate-400 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0 border-l-2 border-teal-400 pl-4">
            <p className="font-semibold text-white">&copy; {currentYear} Accessibility.build. All rights reserved.</p>
            <p className="mt-1 max-w-3xl">
              Owned and operated by {company.legalOperator}, a GST-registered Indian {company.businessType.toLowerCase()}. GSTIN {company.gstin}.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <a
              href={company.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-800 px-3 text-slate-300 hover:border-slate-700 hover:bg-slate-900 hover:text-white"
            >
              <Linkedin className="h-4 w-4 text-teal-300" aria-hidden="true" /> LinkedIn
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
            <a
              href="https://www.w3.org/WAI/WCAG22/quickref/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-800 px-3 text-slate-300 hover:border-slate-700 hover:bg-slate-900 hover:text-white"
            >
              <BookOpenCheck className="h-4 w-4 text-teal-300" aria-hidden="true" />
              WCAG reference
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="h-10 justify-center rounded-md border border-slate-800 px-3 text-xs text-slate-300 hover:border-slate-700 hover:bg-slate-900 hover:text-white"
            >
              Back to top <ArrowUp className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
