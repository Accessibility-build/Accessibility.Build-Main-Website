import type { Metadata } from "next"
import Link from "next/link"
import AccessibilityCodeGenerator from "@/components/tools/accessibility-code-generator"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection, type FaqItem } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "AI Accessibility Code Generator",
  description: "Generate HTML, React, and Vue component drafts with accessibility requirements, keyboard behavior, ARIA guidance, and review notes.",
  keywords: [
    "accessibility code generator",
    "WCAG compliant components",
    "accessible HTML",
    "React accessibility",
    "Vue accessibility",
    "ARIA labels",
    "AI code generation",
    "accessible components"
  ],
  openGraph: {
    title: "AI Accessibility Code Generator - WCAG Compliant Components",
    description: "Generate accessible component drafts with keyboard, semantics, ARIA, and testing guidance for HTML, React, and Vue.",
    type: "website",
    url: "https://accessibility.build/tools/accessibility-code-generator",
    images: [
      {
        url: "https://accessibility.build/images/tools/code-generator-og.png",
        width: 1200,
        height: 630,
        alt: "AI Accessibility Code Generator Tool"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Accessibility Code Generator - WCAG Components",
    description: "Generate HTML, React, and Vue component drafts with accessibility and testing guidance.",
    images: ["https://accessibility.build/images/tools/code-generator-og.png"]
  },
  alternates: {
    canonical: "/tools/accessibility-code-generator"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Accessibility Code Generator", url: "https://accessibility.build/tools/accessibility-code-generator" }
]

// Rendered on the page AND emitted as FAQPage schema by <FaqSection>, from this
// one array, so the two can never drift apart.
const faqs: FaqItem[] = [
  {
    question: "Is the generated code production ready?",
    answer:
      "Treat it as a reviewed first draft, not a finished component. The model is instructed to produce runnable code with keyboard handling and ARIA, and the server checks that the response has the right shape, but nothing runs or tests the code before you see it. Wire it into your project, tab through it, try it with a screen reader, and run an automated checker before shipping.",
  },
  {
    question: "How much does a generation cost?",
    answer:
      "Two credits per generation for signed-in users. Guests can try the tool a limited number of times from the shared daily allowance before signing in. Unlimited access accounts are not charged.",
  },
  {
    question: "Which frameworks and component types are supported?",
    answer:
      "Ten targets: plain HTML and CSS, React, React with TypeScript, Vue, Vue 3 with TypeScript, Angular, Svelte, Next.js App Router, Tailwind CSS, and shadcn/ui. Eighteen component types are offered, from buttons, forms, and modals through tabs, carousels, accordions, dropdowns, tooltips, data tables, skip links, breadcrumbs, search, pagination, alerts, toggles, progress bars, and comboboxes.",
  },
  {
    question: "Why do some result cards say no items were provided?",
    answer:
      "The model is required to return every section, but it is told to pad a list with empty entries rather than invent content when it has nothing substantive to say, and the interface shows an empty list as 'No items provided'. If several cards are empty, or the code block itself is blank, the request was too vague or too long for a useful answer. Try again with a shorter, more specific description of the behaviour you need.",
  },
  {
    question: "Should I pick WCAG 2.2 or an earlier version?",
    answer:
      "Pick 2.2 unless a contract or policy names an earlier version. WCAG 2.2 is backwards compatible with 2.1 and 2.0 apart from removing 4.1.1 Parsing, and it adds criteria that matter for components, including 2.4.11 Focus Not Obscured (Minimum), 2.5.7 Dragging Movements, and 2.5.8 Target Size (Minimum). Level AA is the target referenced by most laws and procurement rules.",
  },
]

export default function AccessibilityCodeGeneratorPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="AI Accessibility Code Generator"
        description="Generate HTML, React, and Vue component drafts with accessibility requirements and review guidance."
        url="https://accessibility.build/tools/accessibility-code-generator"
        applicationCategory="DeveloperApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        accessibilityFeatures={[
          "screenReaderSupport",
          "keyboardNavigation",
          "highContrastDisplay",
          "codeGeneration"
        ]}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container-wide py-16">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI Accessibility Code Generator
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Generate accessible component drafts with structured AI analysis. Get detailed
              code intended to support WCAG 2.2 implementation, with explanations, examples, and review guidance.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>WCAG-Informed Output</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Multiple Frameworks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>AI-Powered</span>
              </div>
            </div>
          </div>

          <AccessibilityCodeGenerator />

          {/* Supporting guidance */}
          <div className="mt-16 max-w-3xl mx-auto space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What the Code Generator Does
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You describe a UI component, choose a framework and a WCAG
                target, and a hosted large language model drafts the component
                for you. The prompt it receives is not a generic coding request:
                it names the WCAG version and conformance level you picked,
                spells out which success criteria that version adds, and demands
                a fixed JSON structure with the code, an explanation of the
                accessibility decisions, usage examples, and lists of the
                criteria addressed, tests to run, mistakes to avoid, and
                follow-up improvements.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The response streams back as it is written, and the server
                parses it as JSON before handing it over; a reply that is not
                valid JSON becomes an error message rather than a broken page.
                The contents of each section are not verified. What you see has
                the right shape, but it has not passed an accessibility test;
                that part is yours.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                How to Use It
              </h2>
              <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2">
                <li>
                  <strong className="text-slate-900 dark:text-white">Pick the component type and framework.</strong>{" "}
                  The type steers which interaction pattern the model follows, so
                  choose Combobox rather than Dropdown if the user can type, and
                  Modal rather than Alert if the user must respond before
                  continuing.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Set the WCAG version and level.</strong>{" "}
                  The defaults, WCAG 2.2 at Level AA, are right for almost every
                  project. Level AAA asks the model for 7:1 contrast tokens and
                  extra cognitive support; Level A drops the AA criteria.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Describe the behaviour, not the look.</strong>{" "}
                  Say what the component does, what states it has, and what
                  happens on error. &ldquo;A date picker that opens on click,
                  supports arrow keys between days, and returns focus to the
                  input on close&rdquo; produces a far better draft than
                  &ldquo;a nice date picker&rdquo;.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Generate, then review the sections in order.</strong>{" "}
                  Read the code, then the testing guide, and run those tests
                  before you read the WCAG compliance list. The list describes
                  what the model intended, and the tests tell you whether it
                  succeeded.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                The WCAG 2.2 Criteria It Targets
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Interactive components fail a predictable cluster of success
                criteria, and the prompt is built around them. Expect the draft
                and its compliance list to address:
              </p>
              <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-2 mb-4">
                <li>
                  <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">2.1.1 Keyboard</Link>{" "}
                  and{" "}
                  <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">2.1.2 No Keyboard Trap</Link>{" "}
                  (Level A): every action reachable by keyboard, and focus able
                  to leave.
                </li>
                <li>
                  <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">4.1.2 Name, Role, Value</Link>{" "}
                  (Level A): native elements or correct ARIA roles, accessible
                  names, and state attributes such as aria-expanded and
                  aria-selected.
                </li>
                <li>
                  <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">1.3.1 Info and Relationships</Link>{" "}
                  (Level A): labels associated with fields, groups, headings, and
                  list structure expressed in markup.
                </li>
                <li>
                  <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.3 Focus Order</Link>{" "}
                  and{" "}
                  <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.7 Focus Visible</Link>{" "}
                  (Level A and AA): focus moved deliberately in dialogs and
                  menus, and never hidden by CSS.
                </li>
                <li>
                  <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">3.3.1 Error Identification</Link>{" "}
                  and{" "}
                  <Link href="/wcag/3-3-2" className="text-blue-600 dark:text-blue-400 hover:underline">3.3.2 Labels or Instructions</Link>{" "}
                  (Level A) for forms, with{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">4.1.3 Status Messages</Link>{" "}
                  (Level AA) for anything announced through a live region.
                </li>
                <li>
                  The criteria new in WCAG 2.2 that the prompt calls out by
                  number when you choose 2.2:{" "}
                  <Link href="/wcag/2-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.11 Focus Not Obscured (Minimum)</Link>,{" "}
                  <Link href="/wcag/2-5-7" className="text-blue-600 dark:text-blue-400 hover:underline">2.5.7 Dragging Movements</Link>,{" "}
                  <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">2.5.8 Target Size (Minimum)</Link>,{" "}
                  <Link href="/wcag/3-2-6" className="text-blue-600 dark:text-blue-400 hover:underline">3.2.6 Consistent Help</Link>,{" "}
                  <Link href="/wcag/3-3-7" className="text-blue-600 dark:text-blue-400 hover:underline">3.3.7 Redundant Entry</Link>, and{" "}
                  <Link href="/wcag/3-3-8" className="text-blue-600 dark:text-blue-400 hover:underline">3.3.8 Accessible Authentication (Minimum)</Link>.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                The compliance list in the output pairs each criterion number
                with a one-line justification. Check the numbers against the
                criterion pages linked above; models occasionally cite a
                plausible-sounding number that does not match the requirement
                they describe.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What It Cannot Do
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The generator never executes, renders, or tests the code. It
                cannot see your design system, your existing focus styles, or
                the page the component will live in, so it cannot know whether
                the contrast tokens it suggests actually meet 1.4.3 in your
                theme or whether its focus ring will be visible on your
                background. It cannot verify its own WCAG claims. And like any
                language model it can produce ARIA that is syntactically valid
                and semantically wrong, such as a role that conflicts with the
                native element or a live region that fires on every keystroke.
              </p>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                  Every draft needs a manual review before it ships
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  At minimum: operate the whole component with Tab, Shift+Tab,
                  Enter, Space, Escape, and the arrow keys; listen to it with a
                  screen reader; check contrast and focus visibility in your
                  real theme; and run an automated checker on the rendered
                  result. The{" "}
                  <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                    keyboard accessibility guide
                  </Link>{" "}
                  covers what to expect from each key, and the{" "}
                  <Link href="/learn" className="text-blue-600 dark:text-blue-400 hover:underline">
                    interactive pattern demos
                  </Link>{" "}
                  show working modal, table, search, pagination, and carousel
                  behaviour to compare against.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Reading the Output
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The result opens with the component code and a quick-actions bar
                for copying or downloading it with the right file extension for
                your framework. Detailed Code Analysis explains the choices in
                three tabs: a walkthrough of the code, the accessibility context
                behind it, and a real-world scenario. Implementation Examples
                shows basic usage, an advanced configuration, and a fuller
                integration.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The four summary cards are the review aids. Accessibility
                Features lists what the code claims to implement, WCAG
                Compliance lists the criteria and why, Testing Guide gives two
                to six concrete checks, and Best Practices records the
                conventions applied. Common Mistakes to Avoid and Enhancement
                Suggestions follow, and the Implementation Summary closes with
                ordered integration steps and your credit balance. If several
                cards read &ldquo;No items provided&rdquo;, the model padded a
                thin response; regenerate with more detail rather than trusting
                the code alone.
              </p>
            </section>

            <FaqSection faqs={faqs} />
          </div>

          <div className="mt-16">
            <RelatedContent
              content="accessibility code components ARIA React Vue HTML WCAG keyboard focus management dialog combobox pattern"
              title="Related Tools & Resources"
              maxItems={3}
              showDescriptions={true}
            />
          </div>
        </div>
      </div>
    </>
  )
}
