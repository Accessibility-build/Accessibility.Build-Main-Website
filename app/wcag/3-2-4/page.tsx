import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 3.2.4 Consistent Identification — Same Name",
  description:
    "Complete guide to WCAG 3.2.4 Consistent Identification. Why same-function components need consistent labels, icons, and alt text across pages, plus how to test.",
  keywords: [
    "WCAG 3.2.4",
    "Consistent Identification",
    "consistent labels",
    "consistent icons",
    "consistent alt text",
    "same functionality same name",
    "3.2.4 test",
    "predictable components",
    "accessible name consistency",
    "set of web pages",
    "Level AA",
    "WCAG 2.2",
    "predictable",
  ],
  alternates: {
    canonical: "/wcag/3-2-4",
  },
  openGraph: {
    title: "WCAG 3.2.4 Consistent Identification — Same Name",
    description:
      "The definitive guide to WCAG 3.2.4: components with the same functionality must be identified consistently across pages — labels, icons, alt text, and accessible names — with examples and testing steps for Level AA.",
    url: "/wcag/3-2-4",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%203.2.4%20Consistent%20Identification&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.2.4 Consistent Identification guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.2.4 Consistent Identification — The Complete Guide",
    description:
      "Components with the same functionality must be identified consistently across a set of pages. What that covers, pass/fail examples, and how to test 3.2.4 Level AA.",
    images: [
      {
        url: "/api/og?title=WCAG%203.2.4%20Consistent%20Identification&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 3.2.4 Consistent Identification require?",
    a: "It requires that components with the same functionality within a set of web pages are identified consistently. If a magnifying-glass icon triggers search on one page, the same function must not be labelled 'Find' with a binoculars icon on another. Identification covers everything that names a component to users: visible text labels, icons, alt text on image controls, and accessible names such as aria-label. It is a Level AA success criterion under Guideline 3.2 Predictable, introduced in WCAG 2.0 and unchanged in 2.1 and 2.2.",
  },
  {
    q: "Does 'consistent' mean the labels must be identical?",
    a: "Consistent means users can recognize the same function, which usually means identical — but not always. Context-sensitive variations are acceptable when they serve clarity: a 'Next' button might read 'Next step' in a wizard and 'Next page' in search results without confusion, and W3C's own example allows an arrow icon labelled 'go to page 4' on one page and 'go to page 5' on another, because the function (go to the named page) is identified the same way. What fails is arbitrary variation: 'Search' here, 'Find' there, 'Go' elsewhere for the identical function.",
  },
  {
    q: "Does 3.2.4 apply within a single page or only across pages?",
    a: "The normative text scopes it to a set of web pages, so strictly it is a cross-page requirement — the same function must be identified the same way on page after page. Within one page, wildly inconsistent naming of the same function is still a usability problem and often trips other criteria (such as 2.4.6 Headings and Labels if labels stop being descriptive), but the 3.2.4 audit itself compares pages across the site. Note the flip side: two components that do different things should not share the same label either, or users cannot tell them apart.",
  },
  {
    q: "Does consistent identification cover icons and alt text, not just visible text?",
    a: "Yes. Identification includes every cue users rely on to recognize a component: the visible label, the icon or image, and the text alternative exposed to assistive technology. A classic failure pattern is the same printer icon carrying alt=\"Print\" on one page and alt=\"Print this page\" on a second — that inconsistency is tolerable — but alt=\"Printer\" (naming the picture, not the function) or a completely different name like \"Output\" on a third breaks recognition for screen reader users. Keep the accessible name for a repeated function stable everywhere it appears.",
  },
  {
    q: "Who benefits from consistent identification?",
    a: "People who learn interfaces through repetition benefit most. Screen reader users recognize functions by their announced names — a stable name means the 'Save' they trusted on one page is the same 'Save' everywhere. Users with cognitive limitations avoid re-deciphering controls on every page; many rely on recognizing a familiar icon-plus-label pair. People who use text-to-speech, symbols, or limited reading vocabulary often have one memorized term per function. Every unnecessary synonym multiplies their cognitive load.",
  },
  {
    q: "How is 3.2.4 different from 3.2.3 Consistent Navigation?",
    a: "Both sit under Guideline 3.2 Predictable at Level AA and they audit different dimensions. 3.2.3 is about position: navigational mechanisms repeated across pages keep the same relative order. 3.2.4 is about naming: any components with the same functionality — navigation or not — are identified the same way across pages. A site can pass one and fail the other: a menu in a fixed order whose search button is labelled 'Search' on some pages and 'Find' on others passes 3.2.3 and fails 3.2.4.",
  },
]

export default function WCAG324Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "3.2.4 Consistent Identification",
            url: "https://accessibility.build/wcag/3-2-4",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 3.2.4 Consistent Identification: The Complete Guide to Naming Same-Function Components Consistently"
        description="The definitive guide to WCAG 3.2.4 Consistent Identification: why components with the same functionality need the same labels, icons, alt text, and accessible names across pages, with examples and testing methods."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-09"
        dateModified="2026-07-09"
        image="https://accessibility.build/api/og?title=WCAG%203.2.4%20Consistent%20Identification&section=WCAG"
        url="https://accessibility.build/wcag/3-2-4"
        wordCount={2700}
        keywords={[
          "WCAG 3.2.4",
          "Consistent Identification",
          "consistent labels",
          "consistent icons",
          "accessible name consistency",
          "Level AA",
        ]}
      />

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
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
                    href="/wcag"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    WCAG Success Criteria
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    3.2.4 Consistent Identification
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Level AA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 3: Understandable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Guideline 3.2 Predictable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.2.4: Consistent Identification
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              If it does the same thing, call it the same thing. This criterion
              requires that{" "}
              <strong className="text-slate-900 dark:text-white">
                components with the same functionality are identified
                consistently across a set of pages
              </strong>{" "}
              — the same visible label, the same icon, the same alt text, the
              same accessible name. A function that answers to
              &ldquo;Search&rdquo; on Monday&rsquo;s page and
              &ldquo;Find&rdquo; on Tuesday&rsquo;s forces every user to learn
              your interface twice.
            </p>
          </header>

          {/* Official text callout */}
          <section
            aria-labelledby="official-text"
            className="mb-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-6"
          >
            <h2
              id="official-text"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3"
            >
              The success criterion, in full
            </h2>
            <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-blue-500 pl-4">
              Components that have the same functionality within a set of Web
              pages are identified consistently.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              &ldquo;Identified&rdquo; covers every way a component announces
              itself: visible text, iconography, text alternatives, and
              accessible names. &ldquo;Within a set of Web pages&rdquo; scopes
              the comparison across the pages of a site — this is a cross-page
              consistency check, and there are no exceptions.
            </p>
          </section>

          {/* On this page */}
          <nav
            aria-label="On this page"
            className="mb-12 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              On this page
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-blue-600 dark:text-blue-400">
              <li>
                <a className="hover:underline" href="#why">
                  Why consistent naming matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#scope">
                  What must stay consistent
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#examples">
                  Pass and fail examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#mistakes">
                  Common failures
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#testing">
                  How to test
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#faq">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          {/* Why */}
          <section aria-labelledby="why" className="mb-12">
            <h2
              id="why"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Why consistent naming matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Recognition is cheaper than comprehension. Once a user has learned
              that the disk icon labelled &ldquo;Save&rdquo; stores their work,
              every later encounter costs them nothing — they recognize it and
              act. Rename it &ldquo;Store&rdquo; on the next page and the shortcut
              breaks: now they must stop, read, and reason about whether this
              new thing is the old thing. For most users that is friction; for
              some it is a wall.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Screen reader users are hit hardest, because the accessible name{" "}
              <em>is</em> the component to them. Searching a page for the
              &ldquo;Save&rdquo; button fails when this template calls it
              &ldquo;Store&rdquo;. Users with cognitive limitations — including
              people who memorize one term per function, users of symbol-based
              communication, and people with limited reading vocabulary —
              depend on stable naming the same way. And users of speech
              recognition software literally invoke controls by name:
              &ldquo;click Search&rdquo; does nothing if the button is called
              &ldquo;Find&rdquo; here.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              There is a corollary the Understanding document calls out: things
              that <em>do different jobs</em> must <em>not</em> share a name.
              If a checkmark icon means &ldquo;approved&rdquo; in one view and
              &ldquo;task complete&rdquo; in another, its text alternative must
              differ to match the function. Consistency binds name to function
              in both directions.
            </p>
          </section>

          {/* Scope */}
          <section aria-labelledby="scope" className="mb-12">
            <h2
              id="scope"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What must stay consistent
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              &ldquo;Identification&rdquo; is every signal a user might use to
              recognize the component:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Visible text labels",
                  d: "Button text, link text, and field labels for the same function: always 'Search', not a rotation of 'Search', 'Find', and 'Go'.",
                },
                {
                  t: "Icons",
                  d: "The same function keeps the same icon across pages. Swapping a magnifying glass for binoculars mid-site breaks visual recognition.",
                },
                {
                  t: "Text alternatives",
                  d: "Alt text on image buttons and icons naming the same function should match — and should name the function ('Print'), not the picture ('Printer icon').",
                },
                {
                  t: "Accessible names",
                  d: "aria-label / aria-labelledby values for the same control across templates. Speech-input users invoke controls by these names.",
                },
              ].map((item) => (
                <div
                  key={item.t}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {item.t}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {item.d}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-6">
              Consistent does not mean robotic. Context-appropriate precision is
              allowed: a pagination arrow labelled &ldquo;Go to page 4&rdquo; on
              one page and &ldquo;Go to page 5&rdquo; on the next identifies the
              same function the same way. The test is whether a user who learned
              the component once will recognize it instantly the next time.
            </p>
          </section>

          {/* Pass / fail examples */}
          <section aria-labelledby="examples" className="mb-12">
            <h2
              id="examples"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Pass and fail examples
            </h2>
            <div className="space-y-4">
              {[
                {
                  pass: true,
                  t: "One 'Search' everywhere",
                  d: "Every page's header search uses the same magnifying-glass icon with the accessible name 'Search'. Users recognize it instantly on any page. Passes.",
                },
                {
                  pass: true,
                  t: "Wizard buttons with contextual precision",
                  d: "A checkout labels its advance button 'Continue to shipping', then 'Continue to payment'. The identification pattern — 'Continue to <next step>' — is consistent and clearer than a bare 'Next'. Passes.",
                },
                {
                  pass: true,
                  t: "Same icon, different function, different name",
                  d: "A checkmark icon means 'approved' in the review queue and 'complete' in the task list, and its alt text differs accordingly. Different functions correctly get different names. Passes.",
                },
                {
                  pass: false,
                  t: "Download by any other name",
                  d: "PDF download links read 'Download' in the docs section, 'Get PDF' on product pages, and 'Save file' in support articles — same function, three identities. Fails.",
                },
                {
                  pass: false,
                  t: "Drifting alt text on an icon button",
                  d: "The same print function is alt=\"Print\" on one template, alt=\"Printer\" on another, and has no alt on a third. Screen reader users cannot recognize it as one function. Fails.",
                },
              ].map((ex) => (
                <div
                  key={ex.t}
                  className={`rounded-xl border p-5 ${
                    ex.pass
                      ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20"
                      : "border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20"
                  }`}
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={ex.pass ? "text-emerald-600" : "text-rose-500"}
                    >
                      {ex.pass ? "✓" : "✗"}
                    </span>
                    {ex.t}
                    <span className="sr-only">
                      {ex.pass ? "(passes)" : "(fails)"}
                    </span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {ex.d}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Code examples */}
          <section aria-labelledby="code" className="mb-12">
            <h2
              id="code"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Code examples
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Inconsistent vs. consistent identification
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The same search function, hand-coded per template, drifts into
              three identities. Pin one label and one icon for the function
              site-wide.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Same function, three different identities -->
<!-- home template -->
<button><svg aria-hidden="true">…magnifier…</svg> Search</button>
<!-- blog template -->
<button><svg aria-hidden="true">…binoculars…</svg> Find</button>
<!-- docs template -->
<button aria-label="Go"><svg aria-hidden="true">…magnifier…</svg></button>

<!-- ✓ One identity everywhere: same icon, same accessible name -->
<button type="submit">
  <svg aria-hidden="true" focusable="false">…magnifier…</svg>
  Search
</button>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Alt text names the function, identically
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              For repeated image controls, the text alternative is the
              identification screen reader users rely on. Name the function, and
              keep the name stable.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ The same print control drifts between pages -->
<input type="image" src="/icons/print.svg" alt="Print" />      <!-- page A -->
<input type="image" src="/icons/print.svg" alt="Printer" />    <!-- page B -->
<input type="image" src="/icons/print.svg" alt="" />           <!-- page C -->

<!-- ✓ One function, one name, everywhere -->
<input type="image" src="/icons/print.svg" alt="Print this page" />`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Enforce consistency with a shared component
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The structural fix: define each repeated function as one component
              with its label and icon baked in, so templates cannot improvise.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// download-button.tsx — the single source of identity
export function DownloadButton({ href }: { href: string }) {
  return (
    <a href={href} download className="btn">
      <DownloadIcon aria-hidden="true" />
      Download PDF
    </a>
  )
}

// Every template renders <DownloadButton /> — the label,
// icon, and accessible name cannot drift between pages.`}</code>
            </pre>
          </section>

          {/* Common failures */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2
              id="mistakes"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "Synonym drift: the same function labelled 'Search' / 'Find' / 'Go', or 'Download' / 'Get PDF' / 'Save file', on different pages.",
                "The same icon function with different text alternatives across pages — or alt text that names the image ('Magnifying glass') instead of the function ('Search').",
                "Different icons for the same function between templates, usually after a partial redesign or a mixed icon library.",
                "Visible label kept consistent while the accessible name varies (a changing aria-label overriding the same button text), so speech-input and screen reader users get a different identity than sighted users.",
                "Two different functions sharing one label — e.g. 'Submit' for both 'save draft' and 'publish' — so users cannot distinguish them.",
                "Teams editing copy per page in a CMS with no shared component or style guide, letting identical functions accumulate different names over time.",
              ].map((m) => (
                <li
                  key={m}
                  className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-rose-500 font-bold">
                    ✗
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {m}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2
              id="testing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How to test for 3.2.4
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory the repeated functions",
                  d: "List functions that recur across pages: search, print, download, save, share, help, cart, next/previous, close. These are the components 3.2.4 audits.",
                },
                {
                  t: "Sample pages from every template",
                  d: "Pick pages built from each distinct layout — home, listing, detail, blog, docs, account. Naming drift almost always happens between templates and teams, not within one page.",
                },
                {
                  t: "Compare visible labels and icons",
                  d: "For each function, record its visible text and icon on every sampled page. Any arbitrary variation — synonyms, different icons — is a failure. Contextual precision ('Go to page 4' vs 'Go to page 5') is fine.",
                },
                {
                  t: "Compare accessible names",
                  d: "Use the browser's accessibility inspector or a screen reader to read each control's accessible name (label, alt, aria-label). The name for the same function must match across pages, and must match what sighted users see.",
                },
                {
                  t: "Check the inverse: different functions, different names",
                  d: "Scan for distinct functions sharing one identity — the same icon or label doing different jobs in different places. Give each function its own stable name.",
                },
              ].map((step, i) => (
                <li
                  key={step.t}
                  className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {step.t}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              Automated tools cannot compare naming across pages, so this is a
              manual audit — best done once, then locked in with shared
              components and a content style guide. Fold it into the full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>
              .
            </p>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq" className="mb-4">
            <h2
              id="faq"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-6"
            >
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 p-5 [&_summary]:cursor-pointer"
                >
                  <summary className="font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between gap-4">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="text-slate-400 group-open:rotate-180 transition-transform"
                    >
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <CriterionLinks number="3.2.4" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="consistent identification same functionality consistent labels consistent icons alt text accessible name predictable components search button download button WCAG 3.2.4 Level AA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
