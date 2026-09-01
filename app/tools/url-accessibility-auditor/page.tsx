import type { Metadata } from "next"
import Link from "next/link"
import UrlAccessibilityAuditor from "@/components/tools/url-accessibility-auditor"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection, type FaqItem } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "URL Accessibility Auditor | axe-core + AI",
  description:
    "Run an automated axe-core scan against a public URL, organize findings by impact and WCAG mapping, and review AI-assisted remediation ideas.",
  keywords: [
    "url accessibility audit",
    "website accessibility testing",
    "axe-core accessibility",
    "WCAG compliance checker",
    "accessibility violations",
    "AI accessibility analysis",
    "accessibility report",
    "accessibility scanner",
    "web accessibility audit",
    "accessibility testing tool",
    "WCAG 2.1 compliance",
    "accessibility score",
    "automated accessibility testing"
  ],
  openGraph: {
    title: "URL Accessibility Auditor | Comprehensive Testing with AI Analysis",
    description: "Run an axe-core scan against a public URL and review prioritized findings with AI-assisted remediation ideas.",
    type: "website",
    url: "https://accessibility.build/tools/url-accessibility-auditor",
    images: [
      {
        url: "https://accessibility.build/images/tools/url-auditor-og.png",
        width: 1200,
        height: 630,
        alt: "URL Accessibility Auditor Interface"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Accessibility Auditor | Comprehensive Testing with AI Analysis",
    description: "Run an axe-core scan against a public URL and review prioritized findings with AI-assisted remediation ideas.",
    images: ["https://accessibility.build/images/tools/url-auditor-twitter.png"]
  },
  alternates: {
    canonical: "/tools/url-accessibility-auditor"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "URL Accessibility Auditor", url: "https://accessibility.build/tools/url-accessibility-auditor" }
]

// Rendered on the page AND emitted as FAQPage schema by <FaqSection>, from this
// one array, so the two can never drift apart.
const faqs: FaqItem[] = [
  {
    question: "What does the accessibility score mean?",
    answer:
      "It is a triage number, not a conformance measure. The scan starts at 100 and subtracts 10 for each critical violation, 5 for each serious, 2 for each moderate, and 1 for each minor, with a floor of 0. A 100 means axe-core found no violations among the rules it ran on that page load; it does not mean the page conforms to WCAG, because most success criteria need a person to judge them.",
  },
  {
    question: "Why does the violation count change between runs of the same URL?",
    answer:
      "Pages are not static. Cookie banners, rotating promotions, A/B tests, lazy-loaded sections, and third-party embeds change what is in the DOM when the scan runs, and contrast checks depend on which fonts and images had loaded. Run the page two or three times and anchor on the findings that appear every time; treat the ones that come and go as leads to confirm by hand.",
  },
  {
    question: "Can it scan pages behind a login or a whole site?",
    answer:
      "No on both counts. The auditor loads one public URL in a fresh headless browser with no cookies, so anything behind authentication shows the login page instead. It scans only that page in its initial state. Use the Scope Checker to inventory a site, then audit a representative sample of URLs one at a time.",
  },
  {
    question: "How much does an audit cost?",
    answer:
      "Five credits per audit, and you need to be signed in. Unlimited access accounts are not charged. Completed audits are saved to your history so you can reopen them without paying again.",
  },
  {
    question: "Does it cover WCAG 2.2?",
    answer:
      "The scan runs axe-core rules tagged for WCAG 2.0 and 2.1 at Levels A and AA, the WCAG 2.2 Level AA tags, and axe's best-practice rules. In practice that adds automated coverage for 2.5.8 Target Size (Minimum); the other 2.2 criteria, such as 2.4.11 Focus Not Obscured, 3.2.6 Consistent Help, and 3.3.8 Accessible Authentication, cannot be judged by an automated rule and need manual review.",
  },
]

export default function UrlAccessibilityAuditorPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="URL Accessibility Auditor"
        description="Automated axe-core URL scanning with prioritized findings, WCAG mappings, and AI-assisted remediation ideas."
        url="https://accessibility.build/tools/url-accessibility-auditor"
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
          "automatedTesting"
        ]}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <UrlAccessibilityAuditor />

        <div className="container-wide py-12">
          {/* Supporting guidance */}
          <div className="max-w-3xl mx-auto space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What the URL Accessibility Auditor Does
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The auditor opens the URL you give it in a headless Chromium
                browser on our server, waits for the page to load at a
                1920 by 1080 desktop viewport, and runs axe-core, the
                open-source rules engine behind most automated accessibility
                checkers. Every violation axe reports is stored with its impact
                level, the WCAG tags axe assigns to the rule, the CSS selector
                and HTML of the first offending element, and a link to the rule
                documentation.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Two layers sit on top of the raw scan. A weighted score turns
                the violation counts into a single number for tracking progress
                between runs, and a language model writes a short
                business-oriented summary, with quick wins, from the score, the
                counts, and the top three findings. Both are conveniences for
                reading the results; the findings table is the audit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                How to Use It
              </h2>
              <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2">
                <li>
                  <strong className="text-slate-900 dark:text-white">Sign in.</strong>{" "}
                  Audits cost five credits and are saved to your account. New
                  accounts start with free credits.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Enter a full public URL.</strong>{" "}
                  Include the scheme, for example https://example.com/pricing.
                  Pick the page you actually want to test; the scan does not
                  follow links.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Wait for the three stages.</strong>{" "}
                  Page load and axe scan, AI summary, then report assembly. Most
                  pages finish in under a minute; the page load itself times out
                  after 30 seconds, so a very slow site fails rather than
                  hanging.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Work the findings table.</strong>{" "}
                  Sort by impact, open each rule&apos;s help link, and locate the
                  element with the selector. Re-run after fixing to confirm the
                  count drops, and use Audit History to compare runs.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What It Checks and the WCAG 2.2 Criteria It Maps To
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The scan runs the axe-core rules tagged wcag2a, wcag2aa,
                wcag21a, wcag21aa, wcag22aa, and best-practice. Each violation
                carries the criterion tags axe attaches to the rule, which is
                where the WCAG mapping in the table comes from. The rules that
                fire most often on real sites, and the criteria they map to,
                include:
              </p>
              <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-2 mb-4">
                <li>
                  Missing alternative text on images and inputs:{" "}
                  <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">1.1.1 Non-text Content</Link>.
                </li>
                <li>
                  Insufficient text contrast:{" "}
                  <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">1.4.3 Contrast (Minimum)</Link>.
                </li>
                <li>
                  Form fields, buttons, and links without an accessible name,
                  and invalid ARIA attributes or roles:{" "}
                  <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">4.1.2 Name, Role, Value</Link>, with link text also mapped to{" "}
                  <Link href="/wcag/2-4-4" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.4 Link Purpose (In Context)</Link>.
                </li>
                <li>
                  Broken list and table structure:{" "}
                  <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">1.3.1 Info and Relationships</Link>.
                </li>
                <li>
                  Missing or invalid page language:{" "}
                  <Link href="/wcag/3-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">3.1.1 Language of Page</Link>; missing document title:{" "}
                  <Link href="/wcag/2-4-2" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.2 Page Titled</Link>; no skip link or landmarks:{" "}
                  <Link href="/wcag/2-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.1 Bypass Blocks</Link>.
                </li>
                <li>
                  Small click targets under the WCAG 2.2 rule set:{" "}
                  <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">2.5.8 Target Size (Minimum)</Link>.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Best-practice rules, such as heading order and landmark
                conventions, appear in the results without a WCAG tag. They are
                worth fixing but are not conformance failures on their own.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What It Cannot Check
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Automated rules detect a minority of WCAG failures, and this
                scan has specific blind spots you should plan around:
              </p>
              <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">Only the initial page state.</strong>{" "}
                  Nothing is clicked, typed, or scrolled. Menus, modals, form
                  validation, and anything revealed by interaction are not
                  examined, so{" "}
                  <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">3.3.1 Error Identification</Link>{" "}
                  and dialog focus behaviour are out of reach.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">No keyboard or focus testing.</strong>{" "}
                  <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">2.1.1 Keyboard</Link>,{" "}
                  <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.3 Focus Order</Link>, and{" "}
                  <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.7 Focus Visible</Link>{" "}
                  need a person at a keyboard.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Presence, not quality.</strong>{" "}
                  The scan can tell that an image has alt text, not whether the
                  text is meaningful, and that a video element exists, not
                  whether its captions are accurate.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Desktop viewport only.</strong>{" "}
                  Reflow at 320 CSS pixels wide (
                  <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">1.4.10 Reflow</Link>
                  ) and mobile layouts are not exercised.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">One page, no login.</strong>{" "}
                  Cross-page criteria such as{" "}
                  <Link href="/wcag/3-2-3" className="text-blue-600 dark:text-blue-400 hover:underline">3.2.3 Consistent Navigation</Link>{" "}
                  and anything behind authentication are outside the scan.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Needs-review results are not shown.</strong>{" "}
                  axe also returns checks it could not decide, for instance
                  contrast on text over a background image. The report lists
                  only confirmed violations, so those items are silently
                  absent.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                A clean scan is the point where manual testing starts, not where
                it ends. The{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  automated versus manual testing guide
                </Link>{" "}
                explains what each method catches, and the{" "}
                <Link href="/guides/how-to-audit-website-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  step-by-step audit guide
                </Link>{" "}
                walks through the manual checks.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Reading the Output
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Impact levels come straight from axe-core: critical and serious
                findings usually block a task for someone, moderate findings
                make a task harder, and minor findings are polish. The score
                subtracts 10, 5, 2, and 1 points respectively per finding from
                100 and stops at 0, so a single page with ten critical issues
                scores zero, and a score of 90 or above is labelled Excellent in
                the interface. Use the number to compare the same page over
                time, not to compare different pages, which have different
                amounts of content to fail.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Each row in the findings table names the axe rule, its
                description, the WCAG tags, the selector of the first element
                that failed, and the fix suggestion from the rule&apos;s help
                text. Only the first matching element is stored per rule, so a
                rule that fired on forty images shows one selector; fix the
                pattern, not the instance. The AI Intelligence Analysis panel
                is generated from the score, the counts, and the top three
                findings only, which makes it a readable narrative for
                stakeholders rather than a complete plan.
              </p>
            </section>

            <FaqSection faqs={faqs} />
          </div>

          <div className="mt-16">
            <RelatedContent
              content="accessibility audit axe-core WCAG compliance testing automated analysis manual testing keyboard screen reader scope checker"
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
