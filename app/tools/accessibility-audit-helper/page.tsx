import type { Metadata } from "next"
import Link from "next/link"
import AccessibilityAuditHelper from "@/components/tools/accessibility-audit-helper"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection, type FaqItem } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "AI Accessibility Audit Helper | Issue Analysis",
  description:
    "Describe an accessibility issue, add code and stack context, and receive AI-assisted WCAG references, implementation ideas, and testing considerations.",
  keywords: [
    "accessibility audit",
    "WCAG compliance",
    "accessibility issues",
    "code recommendations",
    "accessibility issue analysis",
    "AI accessibility",
    "accessibility analysis",
    "accessibility consulting",
    "accessibility fixes",
    "accessibility testing",
    "inclusive design",
    "web accessibility"
  ],
  openGraph: {
    title: "AI Accessibility Audit Helper | Issue Analysis",
    description: "Analyze accessibility issues with AI-assisted WCAG references, implementation ideas, and testing considerations.",
    type: "website",
    url: "https://accessibility.build/tools/accessibility-audit-helper",
    images: [
      {
        url: "https://accessibility.build/images/tools/audit-helper-og.png",
        width: 1200,
        height: 630,
        alt: "AI Accessibility Audit Helper Interface"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Accessibility Audit Helper | Issue Analysis",
    description: "Analyze accessibility issues with AI-assisted WCAG references, implementation ideas, and testing considerations.",
    images: ["https://accessibility.build/images/tools/audit-helper-twitter.png"]
  },
  alternates: {
    canonical: "/tools/accessibility-audit-helper"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Accessibility Audit Helper", url: "https://accessibility.build/tools/accessibility-audit-helper" }
]

// Rendered on the page AND emitted as FAQPage schema by <FaqSection>, from this
// one array, so the two can never drift apart.
const faqs: FaqItem[] = [
  {
    question: "How is this different from the URL Accessibility Auditor?",
    answer:
      "The URL auditor loads a live page and runs axe-core against it, so it finds issues you did not know about but only the ones an automated rule can detect. The audit helper starts from an issue you already know about, described in words and optionally code, and explains it: which criteria apply, who it affects, how to fix it, and how to test the fix. Use the auditor to find, and the helper to understand and resolve.",
  },
  {
    question: "What should I put in the issue description?",
    answer:
      "Describe what a user tried to do, what happened, and what you expected. Name the assistive technology if you know it, for example NVDA with Firefox or VoiceOver on iOS. Paste the smallest code snippet that reproduces the problem rather than a whole page, and pick the tech stack and component type so the fix comes back in the right idiom. Vague descriptions produce generic answers.",
  },
  {
    question: "Are the WCAG references and links reliable?",
    answer:
      "Mostly, but verify them. The model is asked to cite criteria in the form '1.4.3 Contrast (Minimum)' with a level, and to link to the W3C Understanding documents and ARIA Authoring Practices patterns, but it fills in those slugs itself. Check every criterion number against the site's WCAG pages and follow each link before quoting it in a report.",
  },
  {
    question: "Can it audit my whole site or a URL?",
    answer:
      "No. It never fetches a page. It reasons only from the text and code you paste, which is what makes it useful for issues on pages behind a login or in components that are not deployed yet, and useless for discovering issues you have not described.",
  },
  {
    question: "How much does an analysis cost?",
    answer:
      "One credit per analysis for signed-in users. Guests get a small number of free analyses from the shared daily allowance before they need to sign in. Unlimited access accounts are not charged and can choose which model runs the analysis.",
  },
]

export default function AccessibilityAuditHelperPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="AI Accessibility Audit Helper"
        description="AI-assisted accessibility issue analysis with WCAG references, implementation ideas, and testing considerations."
        url="https://accessibility.build/tools/accessibility-audit-helper"
        applicationCategory="DeveloperApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        accessibilityFeatures={[
          "screenReaderSupport",
          "keyboardNavigation",
          "highContrastDisplay"
        ]}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <AccessibilityAuditHelper />

        <div className="container-wide py-12">
          {/* Supporting guidance */}
          <div className="max-w-3xl mx-auto space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What the Audit Helper Does
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The audit helper turns a described accessibility problem into a
                structured write-up. You give it a description of the issue, an
                optional code snippet, and the technology and component
                involved; a hosted language model returns a bug-ticket style
                analysis with a title, a severity, the current and expected
                behaviour, the effect on users, the WCAG success criteria
                involved, a recommended fix with example code, ordered
                implementation steps, a testing checklist, and links to further
                reading.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The response streams in as it is written, so you see the
                sections complete one by one, and it falls back to a single
                request if streaming fails. The server checks that every
                required section is present and that the severity is one of
                critical, high, medium, or low before returning it; a missing
                severity defaults to medium.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                How to Use It
              </h2>
              <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2">
                <li>
                  <strong className="text-slate-900 dark:text-white">Describe the issue as a user experienced it.</strong>{" "}
                  &ldquo;Screen reader users hear &lsquo;button&rsquo; for every
                  icon in the toolbar&rdquo; gives the model the symptom, the
                  audience, and the component in one sentence.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Paste the relevant code.</strong>{" "}
                  With a snippet, the model reviews your actual markup and
                  returns a corrected version. Without one, it explains the
                  pattern from semantic HTML up to the ARIA needed and offers
                  more than one approach.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Choose the stack and component type.</strong>{" "}
                  Both are optional but they shape the example code, so a React
                  team gets JSX and a WordPress team gets PHP templates and
                  plain HTML.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Run the analysis and verify it.</strong>{" "}
                  Read the WCAG section against the linked criterion pages,
                  apply the fix, then work through the testing checklist before
                  you close the ticket.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What the Analysis Covers and Its WCAG 2.2 References
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The model is prompted to name each criterion by number and
                title, state its level, and explain why it applies to your
                issue, and to write the testing checklist around the things
                automated tools miss: screen reader behaviour, keyboard
                operation, 200 percent zoom, voice control, and mobile screen
                readers. The criteria that come up most often for the component
                types in the form are:
              </p>
              <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-2 mb-4">
                <li>
                  Navigation, buttons, dropdowns, tabs, and accordions:{" "}
                  <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">2.1.1 Keyboard</Link>,{" "}
                  <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.3 Focus Order</Link>,{" "}
                  <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.7 Focus Visible</Link>, and{" "}
                  <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">4.1.2 Name, Role, Value</Link>.
                </li>
                <li>
                  Forms:{" "}
                  <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">1.3.1 Info and Relationships</Link>,{" "}
                  <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">3.3.1 Error Identification</Link>,{" "}
                  <Link href="/wcag/3-3-2" className="text-blue-600 dark:text-blue-400 hover:underline">3.3.2 Labels or Instructions</Link>,{" "}
                  <Link href="/wcag/3-3-3" className="text-blue-600 dark:text-blue-400 hover:underline">3.3.3 Error Suggestion</Link>, and{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">4.1.3 Status Messages</Link>.
                </li>
                <li>
                  Modals and dialogs:{" "}
                  <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">2.1.2 No Keyboard Trap</Link>{" "}
                  alongside the focus criteria above.
                </li>
                <li>
                  Images and videos:{" "}
                  <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">1.1.1 Non-text Content</Link>,{" "}
                  <Link href="/wcag/1-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">1.2.2 Captions (Prerecorded)</Link>, and{" "}
                  <Link href="/wcag/1-2-5" className="text-blue-600 dark:text-blue-400 hover:underline">1.2.5 Audio Description (Prerecorded)</Link>.
                </li>
                <li>
                  Carousels:{" "}
                  <Link href="/wcag/2-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">2.2.2 Pause, Stop, Hide</Link>; tables:{" "}
                  <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">1.3.1</Link>{" "}
                  again, for header and cell relationships.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                WCAG 2.2 has 86 success criteria, and the model can reference
                any of them. The site&apos;s criterion pages give you the normative
                text to check its reasoning against.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What It Cannot Do
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The helper never sees your page. It cannot confirm that the
                issue you describe actually exists, cannot find issues you did
                not mention, and cannot test the fix it proposes. Its severity
                rating is the model&apos;s reading of your description, not a
                measurement, so two differently worded reports of the same bug
                can come back with different severities. Its links are
                constructed from the criterion and pattern names it chooses,
                and occasionally point at a slug that does not exist.
              </p>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                  An analysis is not an audit finding until a person has confirmed it
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Reproduce the issue with the assistive technology named in the
                  report, apply the fix, and run the testing checklist yourself.
                  If the write-up is going into a formal report or an
                  accessibility statement, cross-check each criterion against
                  the{" "}
                  <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    WCAG 2.2 checklist
                  </Link>{" "}
                  and follow the{" "}
                  <Link href="/guides/how-to-audit-website-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                    audit methodology guide
                  </Link>{" "}
                  for the parts of the page the helper never looked at.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Reading the Output
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The first card is the ticket: a plain title, a severity badge,
                the user impact as a subtitle, and side-by-side Current Problem
                and Expected Solution boxes you can paste into an issue tracker.
                WCAG Criteria and Review Requirements lists each criterion with
                its level and the reason it applies. Review Recommendations is
                the narrative fix, and Code Solution, when present, is the
                corrected markup with a copy button.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Implementation Steps is an ordered list you can hand to a
                developer, and Testing Checklist is the acceptance criteria: use
                it to decide when the fix is done, not just whether it was
                attempted. Related Resources closes with the external reading
                the model chose. Your remaining credit balance and, for guests,
                your remaining trial uses are shown above the form once an
                analysis completes.
              </p>
            </section>

            <FaqSection faqs={faqs} />
          </div>

          <div className="mt-16">
            <RelatedContent
              content="accessibility audit WCAG compliance code remediation testing screen reader keyboard issue analysis manual testing"
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
