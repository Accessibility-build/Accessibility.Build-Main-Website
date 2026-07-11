import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  HowToStructuredData,
  FAQStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title:
    "How to Audit a Website for Accessibility (2026): Step-by-Step WCAG Guide",
  description:
    "A practical, step-by-step guide to auditing any website for WCAG 2.2 accessibility compliance. Includes a free checklist, automated and manual testing workflows, common issues to look for, and AI-assisted remediation.",
  keywords: [
    "how to audit a website for accessibility",
    "accessibility audit",
    "WCAG audit",
    "WCAG 2.2 audit",
    "website accessibility audit",
    "accessibility audit checklist",
    "accessibility testing",
    "automated accessibility testing",
    "manual accessibility testing",
    "ADA compliance audit",
    "accessibility remediation",
    "AI accessibility audit",
  ],
  alternates: {
    canonical:
      "https://accessibility.build/guides/how-to-audit-website-accessibility",
  },
  openGraph: {
    title:
      "How to Audit a Website for Accessibility (2026): Step-by-Step WCAG Guide",
    description:
      "A practical, step-by-step guide to auditing any website for WCAG 2.2 accessibility compliance. Free checklist, automated and manual workflows, and AI-assisted remediation.",
    url: "https://accessibility.build/guides/how-to-audit-website-accessibility",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "How to Audit a Website for Accessibility — Step-by-Step Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "How to Audit a Website for Accessibility (2026): Step-by-Step WCAG Guide",
    description:
      "A practical, step-by-step guide to auditing any website for WCAG 2.2 accessibility compliance.",
  },
}

const faqs = [
  {
    question: "What is a website accessibility audit?",
    answer:
      "A website accessibility audit is a structured evaluation of a website against an accessibility standard — most commonly WCAG 2.2 Level AA. It identifies barriers that prevent people with disabilities from perceiving, operating, or understanding the site, and documents each issue with severity, the WCAG criterion it fails, the user impact, and a recommended fix. A complete audit combines automated scanning, manual keyboard and screen reader testing, and code-level review.",
  },
  {
    question: "How long does an accessibility audit take?",
    answer:
      "For a single template-driven marketing site of under 20 unique page types, a thorough WCAG 2.2 AA audit typically takes 20–40 hours of expert time. Large applications with authenticated flows, complex forms, dashboards, and dynamic widgets can take 80–200+ hours. Automated tools can scan thousands of pages in minutes but only catch 30–40% of real WCAG issues, so manual review is always required for a defensible audit.",
  },
  {
    question: "What WCAG version should I audit against in 2026?",
    answer:
      "Audit against WCAG 2.2 Level AA. WCAG 2.2 was published as a W3C Recommendation in October 2023 and is the version referenced by current U.S. Department of Justice Title II rulemaking, the EU European Accessibility Act, and most procurement requirements as of 2026. WCAG 2.2 is fully backward compatible with 2.1 and 2.0, so meeting 2.2 means you also meet the earlier versions.",
  },
  {
    question: "Can I audit a website for accessibility using only automated tools?",
    answer:
      "No. Automated tools like axe-core, Lighthouse, and WAVE catch roughly 30–40% of WCAG failures — primarily missing alt text, color contrast, missing labels, and obvious ARIA misuse. They cannot reliably evaluate whether alt text is meaningful, whether the keyboard tab order is logical, whether focus is managed correctly in dynamic widgets, or whether screen reader announcements make sense. A defensible audit always combines automated scanning with manual keyboard and assistive-technology testing.",
  },
  {
    question: "What's the difference between an accessibility audit and a VPAT?",
    answer:
      "An accessibility audit is the testing and analysis activity itself, producing a list of issues to fix. A VPAT (Voluntary Product Accessibility Template) is a standardized vendor document, published as an Accessibility Conformance Report (ACR), that describes how a product conforms to accessibility standards on a criterion-by-criterion basis. You perform an audit, then use the findings to fill out the VPAT. A VPAT without an underlying audit is essentially unsupported.",
  },
  {
    question: "How often should I re-audit my website?",
    answer:
      "At minimum, run a full WCAG audit once per year and after any major redesign or platform migration. In addition, integrate automated accessibility scanning into your CI pipeline so every pull request is checked, and spot-check newly built components manually before they ship. High-risk sectors (government, healthcare, financial services, education) often require quarterly audits and re-audits after every release.",
  },
  {
    question: "What does an accessibility audit report include?",
    answer:
      "A complete audit report includes: an executive summary with overall conformance status, a per-issue breakdown listing the WCAG criterion failed, severity (critical / high / medium / low), the affected pages or components, a description of the user impact, reproduction steps, screenshots or code snippets, and a recommended remediation. Strong reports also link each issue to the relevant WCAG technique (e.g., H44, ARIA14) and include a prioritized remediation roadmap.",
  },
  {
    question: "How much does an accessibility audit cost?",
    answer:
      "Expert-led WCAG 2.2 AA audits typically cost $5,000–$15,000 for a small marketing site, $15,000–$40,000 for a mid-size application, and $50,000+ for large enterprise platforms with authenticated workflows. AI-assisted tooling can dramatically lower this by handling the triage and remediation drafting, leaving accessibility specialists to focus on judgment calls and assistive-technology verification.",
  },
]

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "How to Audit a Website for Accessibility",
    url: "https://accessibility.build/guides/how-to-audit-website-accessibility",
  },
]

const steps = [
  {
    name: "Define the scope and target standard",
    text: "Before testing, decide which standard you are auditing against (WCAG 2.2 Level AA is the 2026 default), which pages or templates are in scope, and which user flows must work end-to-end. A typical scope includes the homepage, top 10 landing pages, primary navigation, search, checkout or signup flow, account dashboard, and any forms. Document the browsers, screen readers, and devices you will test on.",
  },
  {
    name: "Run an automated baseline scan",
    text: "Use axe DevTools, Lighthouse, or WAVE to scan every in-scope page. Automated tools reliably catch missing alt text, low contrast, missing form labels, missing language attributes, duplicate IDs, and obvious ARIA misuse. Export the results — they form your starting issue list, but understand that automated coverage is only 30–40% of WCAG.",
  },
  {
    name: "Perform a keyboard-only walkthrough",
    text: "Unplug your mouse and navigate every in-scope page using Tab, Shift+Tab, Enter, Space, Arrow keys, and Escape. Confirm every interactive element is reachable, focus order is logical, focus indicators are clearly visible, no element traps focus, modals trap and restore focus correctly, and skip links work. Note every failure with the page URL and steps to reproduce.",
  },
  {
    name: "Test with a screen reader",
    text: "Run at least one screen reader pass with NVDA (Windows, free), JAWS (Windows), or VoiceOver (macOS/iOS). Listen for whether headings convey page structure, whether images have meaningful alt text or are correctly marked decorative, whether form fields announce their labels and errors, whether dynamic content updates are announced via live regions, and whether ARIA roles and states match the visible behavior.",
  },
  {
    name: "Check color, contrast, and zoom",
    text: "Verify that body text meets WCAG 1.4.3 contrast ratios (4.5:1 for normal text, 3:1 for large text and UI components), that information is never conveyed by color alone, that text can be resized to 200% without loss of content or functionality, and that the layout reflows cleanly at 320px width and 400% zoom per WCAG 1.4.10.",
  },
  {
    name: "Review forms, errors, and time limits",
    text: "Every input must have a programmatically associated label. Error messages must be announced to assistive technology and clearly identify the field at fault. Required fields must be marked accessibly (not by color alone). Time limits must be adjustable, extendable, or removable per WCAG 2.2.1. CAPTCHAs must have an accessible alternative.",
  },
  {
    name: "Inspect dynamic widgets and ARIA",
    text: "For every custom widget — modals, tabs, accordions, comboboxes, date pickers, carousels — verify it follows the WAI-ARIA Authoring Practices pattern: correct roles, correct states (aria-expanded, aria-selected, aria-current), keyboard interaction model (arrow keys for composite widgets), and focus management. Most real WCAG failures live in custom widgets.",
  },
  {
    name: "Document findings with severity and WCAG mapping",
    text: "For each issue, record: the page or component, the WCAG success criterion failed (e.g., 1.3.1, 2.4.7), the WCAG technique that would fix it (e.g., H44, ARIA14), severity (critical / high / medium / low), the user impact in plain language, reproduction steps, and a recommended code-level fix. This is the deliverable that turns an audit into a remediation plan.",
  },
  {
    name: "Triage, remediate, and re-test",
    text: "Sort findings by severity and frequency. Critical issues (blocking access for entire user groups) ship first. After each fix, re-run the original failing test — not just the automated scan — to confirm the issue is genuinely resolved and no regression has been introduced elsewhere. Add a regression test to CI so the same failure cannot return.",
  },
]

export default function HowToAuditWebsiteAccessibilityPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ArticleStructuredData
        headline="How to Audit a Website for Accessibility (2026): Step-by-Step WCAG Guide"
        description="A practical, step-by-step guide to auditing any website for WCAG 2.2 accessibility compliance. Includes a free checklist, automated and manual testing workflows, common issues, and AI-assisted remediation."
        author={{
          name: "Khushwant Parihar",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-05-17"
        dateModified="2026-05-17"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/guides/how-to-audit-website-accessibility"
        wordCount={2400}
        keywords={[
          "accessibility audit",
          "WCAG 2.2 audit",
          "website accessibility audit",
          "accessibility audit checklist",
          "ADA compliance audit",
          "AI accessibility audit",
        ]}
      />
      <HowToStructuredData
        name="How to Audit a Website for Accessibility"
        description="A nine-step process for performing a WCAG 2.2 Level AA audit on any website, combining automated scanning, manual keyboard testing, screen reader review, and AI-assisted remediation."
        totalTime="PT8H"
        tool={[
          "Web browser",
          "axe DevTools, Lighthouse, or WAVE",
          "Screen reader (NVDA, JAWS, or VoiceOver)",
          "Accessibility.build AI Audit Helper",
        ]}
        steps={steps}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    How to Audit a Website for Accessibility
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-3">
              WCAG 2.2 Audit Guide · Updated May 2026
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
              How to Audit a Website for Accessibility: A Step-by-Step WCAG 2.2
              Guide
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              An accessibility audit is the difference between hoping your site
              is compliant and knowing it is. This guide walks through the
              exact nine-step process accessibility professionals use to audit
              a website against WCAG 2.2 Level AA — what to test, in what
              order, with which tools, and how to document findings that your
              development team can actually fix.
            </p>
          </header>

          <section className="mb-12">
            <div className="rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/30 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Skip the manual triage
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Paste an issue, a code snippet, or a failing axe rule into the
                AI Accessibility Audit Helper and get a structured WCAG
                analysis — severity, user impact, technique IDs, and a
                copy-ready code fix — in under thirty seconds.
              </p>
              <Link
                href="/tools/accessibility-audit-helper"
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Open the AI Audit Helper →
              </Link>
            </div>
          </section>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>What an accessibility audit actually produces</h2>
            <p>
              A real accessibility audit is not a pass/fail score. It is a
              prioritized list of barriers — each tied to a specific{" "}
              <a
                href="https://www.w3.org/WAI/WCAG22/quickref/"
                target="_blank"
                rel="noopener noreferrer"
              >
                WCAG 2.2 success criterion
              </a>
              , a specific user impact, and a specific recommended fix. Audits
              are how organizations turn a vague "make the site accessible"
              ambition into engineering work that can be planned, estimated,
              shipped, and verified. They are also the foundation of every
              defensible{" "}
              <Link href="/tools/accessibility-statement-generator">
                accessibility statement
              </Link>{" "}
              and every credible VPAT.
            </p>

            <h2>The nine-step accessibility audit process</h2>
            <p>
              The steps below follow the same flow used by accessibility
              consulting firms, but compressed into a workflow a single
              developer or product team can execute. Work top-to-bottom — each
              step builds context for the next.
            </p>
          </section>

          <ol className="space-y-6 mb-16">
            {steps.map((step, i) => (
              <li
                key={step.name}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
              >
                <div className="flex items-start gap-4">
                  <div
                    aria-hidden="true"
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center"
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      {step.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>Tools you will need</h2>
            <p>
              You do not need a paid platform to run a competent audit. The
              tools below cover every step in the process.
            </p>
            <ul>
              <li>
                <strong>Automated scanner:</strong>{" "}
                <a
                  href="https://www.deque.com/axe/devtools/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  axe DevTools
                </a>{" "}
                (browser extension) or Lighthouse (built into Chrome DevTools)
                for the baseline scan.
              </li>
              <li>
                <strong>Screen reader:</strong>{" "}
                <a
                  href="https://www.nvaccess.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NVDA
                </a>{" "}
                on Windows is free and is the most widely used screen reader
                worldwide. On macOS, VoiceOver is built in. Pair the screen
                reader with the browser most of its users prefer (NVDA with
                Firefox or Chrome, VoiceOver with Safari).
              </li>
              <li>
                <strong>Contrast checker:</strong> our{" "}
                <Link href="/tools/contrast-checker">contrast checker</Link>{" "}
                for spot-checks, or the contrast panel inside Chrome DevTools.
              </li>
              <li>
                <strong>Heading and structure inspector:</strong> our{" "}
                <Link href="/tools/heading-analyzer">heading analyzer</Link>{" "}
                for verifying logical heading hierarchy.
              </li>
              <li>
                <strong>AI remediation assistant:</strong> the{" "}
                <Link href="/tools/accessibility-audit-helper">
                  AI Audit Helper
                </Link>{" "}
                to turn raw findings into severity-tagged, WCAG-mapped issues
                with code-level fixes.
              </li>
            </ul>

            <h2>The ten most common issues we find</h2>
            <p>
              If you only have time to check ten things, start with these —
              they account for the majority of real WCAG 2.2 AA failures we
              see in production audits.
            </p>
            <ol>
              <li>
                Missing or meaningless alternative text on informative images
                (WCAG 1.1.1)
              </li>
              <li>
                Color contrast below 4.5:1 for body text or 3:1 for UI
                components (WCAG 1.4.3, 1.4.11)
              </li>
              <li>
                Custom controls built with <code>&lt;div&gt;</code> or{" "}
                <code>&lt;span&gt;</code> instead of native buttons and links
                (WCAG 2.1.1, 4.1.2)
              </li>
              <li>
                Missing or incorrect form labels and error associations (WCAG
                1.3.1, 3.3.1, 3.3.2)
              </li>
              <li>Illogical heading order or skipped levels (WCAG 1.3.1)</li>
              <li>Keyboard traps inside modals, carousels, or embeds (WCAG 2.1.2)</li>
              <li>
                Focus indicators removed by <code>outline: none</code> without
                a visible replacement (WCAG 2.4.7)
              </li>
              <li>
                Dynamic content changes that are not announced to assistive
                technology (WCAG 4.1.3)
              </li>
              <li>
                Touch targets smaller than 24 by 24 CSS pixels — a new
                requirement in WCAG 2.2 (WCAG 2.5.8)
              </li>
              <li>
                Drag-and-drop interactions with no single-pointer alternative,
                another WCAG 2.2 addition (WCAG 2.5.7)
              </li>
            </ol>

            <h2>How AI fits into a modern accessibility audit</h2>
            <p>
              Large language models do not replace expert review, but they
              dramatically compress the most time-consuming parts of an audit:
              mapping a symptom to the correct WCAG criterion, writing a
              plain-language user impact, and drafting a code-level fix that
              the engineering team can apply. A human still needs to verify
              behavior with assistive technology, but the AI handles the
              triage and the writing. Our{" "}
              <Link href="/tools/accessibility-audit-helper">
                AI Accessibility Audit Helper
              </Link>{" "}
              is built exactly for this loop — paste a finding in plain
              English or as a code snippet, and get back a structured analysis
              you can hand straight to a developer.
            </p>

            <h2>What to do after the audit</h2>
            <p>
              An audit report on a shelf does nothing. The output should feed
              three downstream artifacts: a prioritized remediation backlog (a
              Jira or Linear project), an updated{" "}
              <Link href="/tools/accessibility-statement-generator">
                accessibility statement
              </Link>{" "}
              that honestly reflects the site&apos;s current conformance, and a
              CI configuration that prevents the highest-frequency failures
              from coming back. Treat the audit as the start of an ongoing
              practice, not a one-time event — accessibility regressions are
              the rule, not the exception.
            </p>
          </section>

          <section className="mb-16">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Run your first audit in the next hour
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Use the AI Audit Helper to map findings to WCAG criteria and
                generate code-level fixes, then verify with the URL Auditor,
                Heading Analyzer, and Contrast Checker.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/tools/accessibility-audit-helper"
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  AI Audit Helper
                </Link>
                <Link
                  href="/tools/url-accessibility-auditor"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  URL Auditor
                </Link>
                <Link
                  href="/tools/contrast-checker"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Contrast Checker
                </Link>
                <Link
                  href="/checklists"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  WCAG Checklists
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
                >
                  <summary className="cursor-pointer text-lg font-semibold text-slate-900 dark:text-white list-none flex justify-between items-start gap-4">
                    <span>{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0"
                    >
                      ▾
                    </span>
                  </summary>
                  <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </article>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="accessibility audit WCAG 2.2 testing remediation checklist screen reader keyboard contrast forms ARIA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
