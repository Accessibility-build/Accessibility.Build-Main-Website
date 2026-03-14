"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/newsletter-signup";
import ClientOnly from "@/components/client-only";
import { Logo } from "@/components/logo";
import {
  ArrowUp,
  ExternalLink,
  Heart,
  Linkedin,
  Shield,
} from "lucide-react";
import { footerTrustSignals } from "@/lib/public-metrics";

const toolLinks = [
  { href: "/tools/accessibility-audit-helper", label: "Accessibility Auditor" },
  { href: "/tools/alt-text-generator", label: "AI Alt Text Generator" },
  { href: "/tools/contrast-checker", label: "Contrast Checker" },
  { href: "/tools/heading-analyzer", label: "Heading Analyzer" },
  { href: "/tools/scope-checker", label: "Scope Checker" },
  { href: "/tools/accessibility-roi-calculator", label: "ROI Calculator" },
];

const researchLinks = [
  { href: "/research", label: "Research Hub" },
  { href: "/research/state-of-accessibility", label: "State of Accessibility 2026" },
  { href: "/research/accessibility-lawsuits", label: "Lawsuit Tracker 2026" },
  { href: "/wcag-3", label: "WCAG 3.0 Guide" },
  { href: "/guides", label: "Guides Hub" },
  { href: "/guides/keyboard-accessibility", label: "Keyboard Accessibility" },
  { href: "/guides/screen-reader-testing", label: "Screen Reader Testing" },
  { href: "/blog", label: "Accessibility Blog" },
  { href: "/resources", label: "Learning Resources" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Support" },
  { href: "/faq", label: "FAQ & Help" },
  { href: "/sitemap-page", label: "Sitemap" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refund", label: "Refund Policy" },
];

const socialLinks = [
  {
    href: "https://linkedin.com/company/accessibilitybuild",
    label: "Connect on LinkedIn",
    icon: Linkedin,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#040708] dark:text-slate-100">
      <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,148,136,0.14),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(13,94,94,0.4),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-50 [background:repeating-linear-gradient(90deg,rgba(15,118,110,0.12)_0,rgba(15,118,110,0.12)_90px,transparent_90px,transparent_200px)] dark:opacity-40 dark:[background:repeating-linear-gradient(90deg,rgba(0,76,76,0.26)_0,rgba(0,76,76,0.26)_120px,transparent_120px,transparent_220px)]" />
      <div className="pointer-events-none absolute inset-y-0 right-[-20%] hidden w-[70%] opacity-30 lg:block [background:repeating-linear-gradient(112deg,rgba(2,90,90,0.2)_0,rgba(2,90,90,0.2)_120px,transparent_120px,transparent_240px)] dark:opacity-35 dark:[background:repeating-linear-gradient(112deg,rgba(2,90,90,0.35)_0,rgba(2,90,90,0.35)_140px,transparent_140px,transparent_260px)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent dark:from-[#040708] dark:via-transparent dark:to-transparent" />

      <div className="relative container-wide py-8 md:py-12">
        <div className="border-b border-slate-300 py-8 md:py-10 dark:border-slate-800">
          <div className="flex items-end gap-4 overflow-hidden">
            <div className="hidden sm:flex sm:items-end sm:pb-2" aria-hidden="true">
              <div className="rounded-2xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/70">
                <Logo className="h-14 w-14" />
              </div>
            </div>
            <h3 className="text-[clamp(2.4rem,9vw,7rem)] font-semibold leading-[0.9] tracking-[-0.03em] text-slate-900 dark:text-slate-50">
              <span className="block xl:inline">Accessibility</span>
              <span className="block text-slate-700 xl:ml-4 xl:inline dark:text-slate-100">.build</span>
            </h3>
          </div>
        </div>

        <div className="grid gap-10 border-b border-slate-300 py-10 lg:grid-cols-12 dark:border-slate-800">
          <div className="lg:col-span-4">
            <p className="max-w-md text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              Professional accessibility platform with AI-powered tools, WCAG
              compliance testing, and comprehensive resources for building
              inclusive digital experiences.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100/80 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              WCAG 2.2 Compliant
            </div>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-9 w-9 items-center justify-center border border-slate-300 bg-white/80 text-slate-700 transition-colors hover:border-slate-500 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Contact Support
            </h3>
            <div className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <a
                href="mailto:accessibilitybuild@gmail.com"
                className="block w-fit transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                accessibilitybuild@gmail.com
              </a>
              <p>24-48 hours during business days</p>
              <p>Remote team serving clients worldwide</p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Stay Updated
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Get the latest accessibility insights, WCAG updates, and tool
              announcements.
            </p>

            <ClientOnly
              fallback={
                <div className="space-y-3">
                  <div className="h-12 animate-pulse border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-900/50" />
                  <div className="h-4 w-2/3 animate-pulse bg-slate-300/80 dark:bg-slate-800/80" />
                </div>
              }
            >
              <NewsletterSignup
                source="footer"
                compact={true}
                placeholder="Enter your email"
                buttonText="Subscribe"
                className="mt-4 [&_input]:h-12 [&_input]:rounded-none [&_input]:border-slate-300 [&_input]:bg-white/80 [&_input]:text-slate-900 dark:[&_input]:border-slate-700 dark:[&_input]:bg-transparent dark:[&_input]:text-slate-100 [&_button]:h-12 [&_button]:rounded-none [&_button]:bg-slate-900 [&_button]:px-6 [&_button]:text-xs [&_button]:font-semibold [&_button]:uppercase [&_button]:tracking-[0.14em] [&_button]:text-slate-100 [&_button:hover]:bg-slate-700 dark:[&_button]:bg-slate-100 dark:[&_button]:text-slate-900 dark:[&_button:hover]:bg-slate-200 [&_.alert]:border-slate-300 dark:[&_.alert]:border-slate-700"
              />
            </ClientOnly>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {footerTrustSignals.map((signal) => (
                <div key={signal.id} className="border border-slate-300 bg-white/80 p-3 text-center dark:border-slate-700 dark:bg-slate-900/60">
                  <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{signal.value}</div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    {signal.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8 border-b border-slate-300 py-8 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800">
          <nav aria-label="Tools links">
            <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Tools
            </h4>
            <ul className="space-y-2">
              {toolLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Research and guides links">
            <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Research & Guides
            </h4>
            <ul className="space-y-2">
              {researchLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company links">
            <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Company
            </h4>
            <ul className="space-y-2">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal links">
            <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 py-6 text-xs text-slate-600 md:flex-row md:items-center md:justify-between dark:text-slate-400">
          <p>&copy; {currentYear} Accessibility.build. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
              Made with <Heart className="h-3.5 w-3.5 text-red-400" /> for
              inclusive web
            </p>
            <Link
              href="https://www.w3.org/WAI/WCAG22/quickref/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              WCAG 2.2 Guidelines
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="h-8 px-2 text-xs text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            >
              Back to top
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
