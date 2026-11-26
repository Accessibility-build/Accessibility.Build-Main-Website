import type { Metadata } from "next"
import Link from "next/link"
import UrlAccessibilityAuditor from "@/components/tools/url-accessibility-auditor"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection, type FaqItem } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"

// The audit runs as a server action on this page: page load, axe-core, the keyboard pass, reflow and
// text spacing take 30 to 60 seconds on most sites, and the scan stops itself at about 90.
export const maxDuration = 120

const description =
  "Audit a page against WCAG 2.2: axe-core plus a keyboard pass, 320 px reflow, text spacing, reduced motion and checks axe skips. Free daily scan."

export const metadata: Metadata = {
  title: "URL Accessibility Auditor: axe-core, Keyboard and Reflow",
  description,
  keywords: [
    "url accessibility audit",
    "website accessibility checker",
    "WCAG 2.2 checker",
    "axe-core scanner",
    "keyboard accessibility test",
    "focus visible checker",
    "reflow 320px test",
    "text spacing test",
    "accessibility report",
    "free accessibility scan",
  ],
  openGraph: {
    title: "URL Accessibility Auditor: more than an axe-core scan",
    description,
    type: "website",
    url: "https://accessibility.build/tools/url-accessibility-auditor",
    images: [
      {
        url: "https://accessibility.build/images/tools/url-auditor-og.png",
        width: 1200,
        height: 630,
        alt: "URL Accessibility Auditor report with score, findings and WCAG coverage map",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Accessibility Auditor: more than an axe-core scan",
    description,
    images: ["https://accessibility.build/images/tools/url-auditor-twitter.png"],
  },
  alternates: {
    canonical: "/tools/url-accessibility-auditor",
  },
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
    question: "How is this different from other axe-core scanners?",
    answer:
      "axe-core only reads the page as it loads. This auditor also uses the page the way people do: it presses Tab through it and compares screenshots at every stop to find controls with no visible focus, controls hidden behind sticky headers and keyboard traps; it narrows the window to 320 pixels to test reflow; it applies the WCAG 1.4.12 text spacing and looks for text that gets cut off; it turns on the reduced-motion preference and checks whether looping animations stop; and it looks for patterns axe-core passes, such as alt text that is a file name, clickable elements a keyboard cannot reach, placeholder-only labels and personal-data fields without autocomplete.",
  },
  {
    question: "What does the accessibility score mean?",
    answer:
      "It is a triage number, not a conformance measure. The scan starts at 100 and subtracts 10 for each critical failing rule, 5 for each serious, 2 for each moderate and 1 for each minor, with a floor of 0. Failing rules from axe-core and from our own checks both count; items marked needs review do not. A 100 means no automated check found a confirmed failure on that page load. It does not mean the page conforms to WCAG, because most success criteria need a person to judge them.",
  },
  {
    question: "What is the difference between a violation and needs review?",
    answer:
      "A violation is a confirmed failure, such as an image with no alt attribute or a control that shows no focus indicator. Needs review is something a check noticed but cannot decide: contrast over a background image, link text like \"read more\" that may get its meaning from the surrounding paragraph, or a video that may or may not contain speech. Review items are listed separately and are never counted in the score.",
  },
  {
    question: "Why does the result change between runs of the same URL?",
    answer:
      "Pages are not static. Cookie banners, rotating promotions, A/B tests, lazy-loaded sections and third-party embeds change what is in the page when the scan runs, and a pop-up that grabs focus can cut the keyboard pass short. Run the page two or three times and anchor on the findings that appear every time; treat the ones that come and go as leads to confirm by hand.",
  },
  {
    question: "Can it scan pages behind a login or a whole site?",
    answer:
      "No on both counts. The auditor loads one public URL in a fresh headless browser with no cookies, so anything behind authentication shows the login page instead. It scans only that page in its initial state. Use the Scope Checker to inventory a site, then audit a representative sample of URLs one at a time.",
  },
  {
    question: "How much does an audit cost?",
    answer:
      "One scan a day is free without an account: you get the score, every check and the three most severe findings, and can unlock the rest with a work email. Signed in, an audit costs five credits, new accounts start with 100, and completed audits are saved to your history so you can reopen them without paying again. Unlimited access accounts are not charged.",
  },
  {
    question: "Does it cover WCAG 2.2?",
    answer:
      "Yes, as far as automation can. axe-core's WCAG 2.2 rules cover 2.5.8 Target Size (Minimum), and the keyboard pass checks 2.4.11 Focus Not Obscured (Minimum) by looking at what covers each focused control. The report's coverage map shows every Level A and AA criterion and whether the scan could test it on your page. The other 2.2 additions, such as 3.2.6 Consistent Help, 3.3.7 Redundant Entry, 3.3.8 Accessible Authentication and 2.5.7 Dragging Movements, need a person, and appear in the manual testing plan when the page has the content they apply to.",
  },
]

export default function UrlAccessibilityAuditorPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="URL Accessibility Auditor"
        description="Automated WCAG 2.2 page audit: axe-core plus a keyboard pass, reflow, text spacing, reduced motion and DOM checks, with a coverage map and manual testing plan."
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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
        <UrlAccessibilityAuditor />

        <div className="container-wide py-12">
          <div className="max-w-3xl mx-auto space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What the URL Accessibility Auditor Does
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The auditor opens the URL you give it in headless Chrome on our
                server at a 1280 by 800 desktop size, scrolls it so lazy content
                loads, and then works through seven steps in an order where no
                step disturbs the one before it:
              </p>
              <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2 mb-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">axe-core.</strong>{" "}
                  The open-source rules engine behind most automated checkers,
                  with its WCAG 2.0, 2.1 and 2.2 A and AA rules, best practices,
                  and five rules axe ships switched off (label in name,
                  orientation lock, paragraphs styled as headings and two table
                  checks).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Page checks.</strong>{" "}
                  Patterns axe-core passes: alt text that is a file name or the
                  word &quot;image&quot;, elements that look clickable but cannot
                  be reached by keyboard, ARIA roles on elements that cannot take
                  focus, placeholder-only labels, required markers that are not
                  announced, personal-data fields without autocomplete, vague link
                  text, video without captions, autoplaying video with no
                  controls, tiny and justified text, and lists faked with
                  paragraphs.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Reduced motion.</strong>{" "}
                  Looping animations are counted, the operating system&apos;s
                  reduce-motion preference is switched on, and anything still
                  moving is reported.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Keyboard pass.</strong>{" "}
                  The engine from our{" "}
                  <Link href="/tools/focus-order-checker" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">Focus Order Checker</Link>{" "}
                  presses Tab up to 80 times. At every stop it compares
                  screenshots with and without focus to judge whether focus is
                  visible, checks whether a sticky header or banner covers the
                  focused control, and detects keyboard traps.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Text spacing.</strong>{" "}
                  The line, letter, word and paragraph spacing from{" "}
                  <Link href="/wcag/1-4-12" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">1.4.12 Text Spacing</Link>{" "}
                  is applied and containers that start cutting off text are
                  listed.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Reflow.</strong>{" "}
                  The window is narrowed to 320 CSS pixels, the width{" "}
                  <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">1.4.10 Reflow</Link>{" "}
                  names, and the elements that make the page scroll sideways are
                  listed, ignoring tables, code and media, which are exempt.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Report.</strong>{" "}
                  Findings are grouped by rule with every affected element, a
                  coverage map marks each WCAG 2.2 A and AA criterion as failed,
                  to review, tested or manual, and a testing plan lists the
                  manual checks this page needs. A language model writes a short
                  summary from the findings only.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                How to Use It
              </h2>
              <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2">
                <li>
                  <strong className="text-slate-900 dark:text-white">Start without an account, or sign in.</strong>{" "}
                  One scan a day is free and shows the score, every check and the
                  three most severe findings. Signed in, audits cost five credits,
                  show everything, and are saved to your account. New accounts
                  start with 100 credits.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Enter a public page address.</strong>{" "}
                  example.com works as well as https://example.com/pricing. Pick
                  the page you actually want to test; the scan does not follow
                  links.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Wait 30 to 60 seconds.</strong>{" "}
                  The keyboard pass is the slow part. A page that takes more than
                  25 seconds to load fails rather than hanging, and steps that do
                  not fit in the time are skipped and named in the report.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Work the report.</strong>{" "}
                  Start with critical and serious violations, copy each
                  element&apos;s selector to find it in your code, then go through
                  the needs-review tab and the manual testing plan. Download the
                  findings as PDF, Excel or CSV, and re-run after fixing to
                  confirm.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What It Cannot Check
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Driving the page catches more than reading it, but a machine
                still cannot judge most of WCAG. Plan around these limits:
              </p>
              <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">Tab only, first state only.</strong>{" "}
                  The keyboard pass presses Tab; it does not open menus, operate
                  sliders or submit forms, so{" "}
                  <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">3.3.1 Error Identification</Link>{" "}
                  and how dialogs handle focus still need a person.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Presence, not meaning.</strong>{" "}
                  The scan can tell that alt text is a file name, but not whether
                  a real description is accurate, and that a captions track
                  exists, but not whether the captions match the speech.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">One page, no login.</strong>{" "}
                  Cross-page criteria such as{" "}
                  <Link href="/wcag/3-2-3" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">3.2.3 Consistent Navigation</Link>{" "}
                  and anything behind authentication are outside the scan.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Embedded frames.</strong>{" "}
                  Video players, maps and chat widgets in iframes from other
                  sites are not inspected, and a pop-up that holds focus can end
                  the keyboard pass early. The report says when that happened.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Screen reader output.</strong>{" "}
                  The heading outline and accessible names are shown, but what a
                  screen reader actually announces depends on the reader and the
                  browser. The{" "}
                  <Link href="/tools/screen-reader-simulator" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">Screen Reader Simulator</Link>{" "}
                  gives a closer preview.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                A clean scan is the point where manual testing starts, not where
                it ends. The{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">automated versus manual testing guide</Link>{" "}
                explains what each method catches, and the{" "}
                <Link href="/guides/how-to-audit-website-accessibility" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">step-by-step audit guide</Link>{" "}
                walks through the manual checks.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Reading the Output
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Impact levels come from axe-core for its rules and follow the
                same scale for ours: critical and serious findings usually block
                a task for someone, moderate findings make a task harder, and
                minor findings are polish. Each finding names its rule, the WCAG
                criteria it maps to, which engine found it, and up to fifteen of
                the affected elements with their selectors and HTML; the count
                covers every element. Fix the pattern, not just the instances
                listed.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Use the score to compare the same page over time, not to compare
                different pages, which have different amounts of content to
                fail. The coverage map is the honest view: on a typical page,
                automated checks reach about two in five of the Level A and AA
                criteria, and the manual testing plan is there for the rest.
              </p>
            </section>

            <FaqSection faqs={faqs} />
          </div>

          <div className="mt-16">
            <RelatedContent
              content="accessibility audit axe-core WCAG compliance testing automated analysis manual testing keyboard focus order screen reader scope checker"
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
