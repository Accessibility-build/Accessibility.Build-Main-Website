import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 4.1.3 Status Messages — ARIA Live Regions Guide",
  description:
    "Complete guide to WCAG 4.1.3 Status Messages. Learn how to announce form errors, success toasts, search results, and loading states to screen readers with role=\"status\", role=\"alert\", and aria-live — with copy-ready code, testing methods, and common mistakes.",
  keywords: [
    "WCAG 4.1.3",
    "Status Messages",
    "aria-live",
    "role status",
    "role alert",
    "aria-live polite",
    "aria-live assertive",
    "live region",
    "screen reader announcements",
    "toast accessibility",
    "form validation accessibility",
    "Level AA",
    "WCAG 2.2",
    "dynamic content accessibility",
    "aria-atomic",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/4-1-3",
  },
  openGraph: {
    title:
      "WCAG 4.1.3 Status Messages — ARIA Live Regions Guide (Level AA)",
    description:
      "The definitive guide to WCAG 4.1.3 Status Messages: how to announce form errors, success toasts, result counts, and loading states to screen readers with role=\"status\", role=\"alert\", and aria-live, with copy-ready code and testing steps.",
    url: "https://accessibility.build/wcag/4-1-3",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/api/og?title=WCAG%204.1.3%20Status%20Messages&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 4.1.3 Status Messages guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 4.1.3 Status Messages — ARIA Live Regions",
    description:
      "Announce dynamic changes — errors, toasts, result counts, loading — to screen readers without moving focus. How to use role=\"status\", role=\"alert\", and aria-live to meet WCAG 4.1.3 Level AA.",
  },
}

const requirements = [
  {
    name: "The message reports a status, not a routine UI change",
    summary:
      "4.1.3 covers messages about the outcome of an action, progress, or the state of the app — not every text change on the page.",
    detail:
      "A status message tells the user something happened: a form was submitted, a search returned 14 results, an item was added to the cart, an error occurred, or a file is still uploading. It is information the user needs but that does not, on its own, deserve to interrupt their work by stealing focus. Plain content updates that are not about status — a clock ticking, a value the user typed echoing back — are out of scope.",
  },
  {
    name: "It must be announced without receiving focus",
    summary:
      "Sighted users see the new message appear; screen reader users must be told about it without the page yanking their focus to it.",
    detail:
      "The whole point of 4.1.3 is the no-focus-change constraint. You are not allowed to solve the problem by moving focus to the message (that would disrupt the user's place and is often worse). Instead the message must be exposed through an ARIA live region or an appropriate role so assistive technology speaks it while the user stays where they are. If announcing it requires moving focus, the design does not meet 4.1.3.",
  },
  {
    name: "Use the right politeness and role for the urgency",
    summary:
      "Routine confirmations are polite (role=\"status\"); errors that need immediate attention are assertive (role=\"alert\").",
    detail:
      "role=\"status\" (equivalent to aria-live=\"polite\") queues the announcement so it does not interrupt whatever the screen reader is currently saying — right for success toasts, result counts, and saved confirmations. role=\"alert\" (equivalent to aria-live=\"assertive\") interrupts immediately — reserve it for errors and time-sensitive warnings. Over-using assertive live regions is itself a barrier because it constantly cuts the user off.",
  },
]

const exceptions = [
  "Status messages are a WCAG 2.1 addition (Level AA). The criterion applies to messages that do not move focus; if your design legitimately moves focus to convey the change (for example focusing a newly-opened dialog and reading its content), 4.1.3 is not the criterion in play — but that focus move must still be appropriate and meet 2.4.3 Focus Order and related criteria.",
  "There is no exception for \"the user can see it\". Visibility to sighted users is exactly the gap 4.1.3 closes — if a change of status is presented visually, it must also be available to assistive technology without a focus change.",
]

const faqs = [
  {
    q: "What does WCAG 4.1.3 Status Messages require?",
    a: "WCAG 4.1.3 (Level AA, added in WCAG 2.1) requires that status messages — text that reports the success or result of an action, the app's state, or progress — can be presented to assistive technology without receiving focus. In practice that means using an ARIA live region: role=\"status\" or aria-live=\"polite\" for routine confirmations and result counts, and role=\"alert\" or aria-live=\"assertive\" for errors and urgent warnings. The screen reader announces the change while the user stays exactly where they are.",
  },
  {
    q: "What is the difference between role=\"status\" and role=\"alert\"?",
    a: "role=\"status\" maps to aria-live=\"polite\": the announcement waits until the screen reader finishes what it is currently saying, so it never interrupts the user. Use it for success messages, \"saved\", search result counts, and loading-complete notices. role=\"alert\" maps to aria-live=\"assertive\": it interrupts immediately. Reserve it for errors and time-sensitive information the user must hear right away. Both roles create an implicit live region, so you do not also need to add aria-live — using the role is usually the simplest and most reliable choice.",
  },
  {
    q: "Why doesn't my aria-live region get announced?",
    a: "The most common reason is that the live region was added to the DOM at the same moment as its text. Screen readers only announce changes to a live region that already existed when the change happened. The reliable pattern is to render the empty container (the element with role=\"status\" or aria-live) on initial page load, then inject the text into it later. Other frequent causes: the region is display:none (move it offscreen with a visually-hidden class instead), the text is set before the browser has registered the region, or two updates fire so fast the first is lost — debounce them into one update.",
  },
  {
    q: "How do I announce form validation errors for 4.1.3?",
    a: "There are two complementary techniques. On submit, if you do not move focus to the first invalid field, put the error summary in a live region — role=\"alert\" for an immediate, assertive announcement — so the screen reader reads it without a focus change. For inline per-field errors, associate the error text with the input using aria-describedby and set aria-invalid=\"true\"; that satisfies 3.3.1 Error Identification when the field receives focus. Many robust forms do both: move focus to an error summary on submit and wire up aria-describedby on each field.",
  },
  {
    q: "Does showing a toast notification automatically meet 4.1.3?",
    a: "No. A toast is only accessible if its container is a live region that existed before the toast text appeared. The common failure is mounting the toast element and its text together, which screen readers miss. Render a persistent live-region container (role=\"status\" for routine toasts, role=\"alert\" for errors) once, then push each toast's text into it. Also keep toasts on screen long enough to be read, or provide a place users can review them, because an auto-dismissing toast that vanishes in two seconds can be gone before the announcement finishes.",
  },
  {
    q: "Is 4.1.3 the same as 3.3.1 Error Identification?",
    a: "They overlap but are distinct. 3.3.1 Error Identification (Level A) requires that input errors are identified and described in text. 4.1.3 Status Messages (Level AA) governs how a status — including an error message that appears dynamically — is conveyed to assistive technology without moving focus. A form error often needs both: the error text must exist and describe the problem (3.3.1), and if it appears without a focus change it must be in a live region so screen readers announce it (4.1.3).",
  },
]

export default function WCAG413Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "4.1.3 Status Messages",
            url: "https://accessibility.build/wcag/4-1-3",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 4.1.3 Status Messages: The Complete ARIA Live Regions Guide"
        description="The definitive guide to WCAG 4.1.3 Status Messages: how to announce errors, toasts, result counts, and loading states to screen readers with role=status, role=alert, and aria-live, with code examples, testing methods, and common mistakes."
        author={{
          name: "Khushwant Parihar",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-06-29"
        dateModified="2026-06-29"
        image="https://accessibility.build/api/og?title=WCAG%204.1.3%20Status%20Messages&section=WCAG"
        url="https://accessibility.build/wcag/4-1-3"
        wordCount={3100}
        keywords={[
          "WCAG 4.1.3",
          "Status Messages",
          "aria-live",
          "role status",
          "role alert",
          "live region",
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
                    4.1.3 Status Messages
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
                Principle 4: Robust
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                The &quot;aria-live&quot; criterion
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 4.1.3: Status Messages
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              When something changes &mdash; a form is saved, a search returns
              results, an error appears, an upload finishes &mdash; sighted users
              simply see it. Under 4.1.3, screen reader users must be told too,{" "}
              <strong className="text-slate-900 dark:text-white">
                without the page stealing their focus
              </strong>
              . The tool for the job is the{" "}
              <strong className="text-slate-900 dark:text-white">
                ARIA live region
              </strong>
              : <code>role=&quot;status&quot;</code>,{" "}
              <code>role=&quot;alert&quot;</code>, and{" "}
              <code>aria-live</code>.
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
              In content implemented using markup languages, status messages can
              be programmatically determined through role or properties such that
              they can be presented to the user by assistive technologies without
              receiving focus.
            </blockquote>
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
                  Why status messages matter
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what">
                  What 4.1.3 actually requires
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what-counts">
                  What counts as a status message
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#polite-vs-assertive">
                  Polite vs. assertive
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#exceptions">
                  Scope &amp; edge cases
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#mistakes">
                  Common mistakes
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#testing">
                  How to test
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#related-criteria">
                  Related success criteria
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
              Why status messages matter
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Modern interfaces update constantly without reloading the page. You
              click &quot;Save&quot; and a green toast slides in. You type into a
              search box and a result count quietly updates. You submit a form and
              a red error banner appears at the top. For a sighted user these
              moments are obvious. For someone using a screen reader, the new text
              is silent &mdash; the cursor is somewhere else on the page, and
              nothing tells them anything happened.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              That silence is the failure 4.1.3 exists to prevent. The naive fix
              &mdash; move focus to the new message &mdash; is often worse: it rips
              users out of the field they were filling, loses their place, and can
              trap them. The criterion instead requires a way to{" "}
              <strong className="text-slate-900 dark:text-white">
                announce the change in place
              </strong>
              . ARIA live regions do exactly that: the screen reader speaks the new
              text while the user&apos;s focus never moves. Get this right and your
              app feels responsive to everyone; get it wrong and screen reader
              users are left guessing whether their action did anything at all.
            </p>
          </section>

          {/* What */}
          <section aria-labelledby="what" className="mb-12">
            <h2
              id="what"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What 4.1.3 actually requires
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              There are three testable ideas behind the criterion. Get these right
              and dynamic changes reach every user.
            </p>
            <div className="space-y-4">
              {requirements.map((r, i) => (
                <div
                  key={r.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                    {i + 1}. {r.name}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 font-medium mb-2">
                    {r.summary}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {r.detail}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-5">
              <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <strong>The rule of thumb:</strong> if a sighted user would
                notice a change because new text appeared &mdash; and you are{" "}
                <em>not</em> moving focus to it &mdash; that text almost
                certainly belongs in a live region. Render the live-region
                container empty on load, then update its contents when the status
                changes.
              </p>
            </div>
          </section>

          {/* What counts */}
          <section aria-labelledby="what-counts" className="mb-12">
            <h2
              id="what-counts"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What counts as a status message
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              The criterion is about messages that report state or the outcome of
              an action. These are the patterns that almost always need a live
              region:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Success & confirmation",
                  d: "\"Changes saved\", \"Item added to cart\", \"Message sent\" — use role=\"status\" so it is announced politely.",
                },
                {
                  t: "Form & validation errors",
                  d: "\"3 fields need your attention\" appearing on submit without a focus move — use role=\"alert\" for an immediate announcement.",
                },
                {
                  t: "Search & filter result counts",
                  d: "\"14 results found\" updating as the user types or filters. Polite role=\"status\" avoids interrupting every keystroke.",
                },
                {
                  t: "Progress & loading states",
                  d: "\"Uploading… 60%\", \"Loading results\", \"Upload complete\". Announce milestones politely; avoid flooding with every percent.",
                },
              ].map((c) => (
                <div
                  key={c.t}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {c.t}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {c.d}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5">
              <p className="text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong>What is NOT a 4.1.3 status message:</strong> changes that
                already move focus (a dialog that opens and is focused), content
                the user is directly editing and reading back, or a full
                navigation to a new page. And do not turn everything into a live
                region &mdash; an over-chatty interface that announces every minor
                change is as hostile as a silent one. Reserve live regions for
                genuine status.
              </p>
            </div>
          </section>

          {/* Polite vs assertive */}
          <section aria-labelledby="polite-vs-assertive" className="mb-12">
            <h2
              id="polite-vs-assertive"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Polite vs. assertive: choosing the right live region
            </h2>
            <ul className="space-y-3 mb-2">
              {[
                "role=\"status\" (aria-live=\"polite\", aria-atomic=\"true\" by default): the announcement waits for a pause. Use it for the vast majority of status messages — saves, result counts, non-urgent confirmations. It is the safe default.",
                "role=\"alert\" (aria-live=\"assertive\", aria-atomic=\"true\" by default): interrupts the screen reader immediately. Reserve it for errors and warnings the user must hear at once. Over-using assertive regions makes an app exhausting to use.",
                "role=\"log\" / role=\"progressbar\" / role=\"marquee\" / role=\"timer\": specialised live regions for chat logs, progress, and scrolling/auto-updating text. Most teams only need status and alert.",
                "aria-live=\"polite\" or \"assertive\" on a generic element: equivalent to the roles above when you cannot use a semantic role. Pair with aria-atomic=\"true\" if you want the whole region re-read rather than just the changed node.",
              ].map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <span aria-hidden="true" className="text-blue-500 font-bold">
                    &rarr;
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
              When in doubt, choose polite. An interruption you did not need is more
              disruptive than a confirmation that arrives a half-second late. See{" "}
              <Link
                href="/reference/aria"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                the ARIA reference
              </Link>{" "}
              for how these roles map to states and properties.
            </p>
          </section>

          {/* Scope / edge cases */}
          <section aria-labelledby="exceptions" className="mb-12">
            <h2
              id="exceptions"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Scope and edge cases
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              4.1.3 is narrowly scoped to status messages presented without a
              focus change. Two clarifications keep you from misapplying it.
            </p>
            <ul className="space-y-3">
              {exceptions.map((e) => (
                <li
                  key={e}
                  className="flex gap-3 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-emerald-600 font-bold">
                    &#10003;
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {e}
                  </span>
                </li>
              ))}
            </ul>
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
              A polite status region for confirmations
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Render the container on initial load so it already exists when the
              text changes. A visually-hidden region works perfectly when the
              status is also shown elsewhere on screen.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- Rendered EMPTY on page load -->
<div role="status" class="sr-only" id="save-status"></div>

<!-- Later, when the save succeeds, set the text -->
<script>
  document.getElementById('save-status').textContent = 'Changes saved';
</script>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              An assertive alert for a form error summary
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              On submit, if you are not moving focus, an alert region announces
              the error immediately without disturbing the user&apos;s position.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- Persistent container, empty until an error occurs -->
<div role="alert" id="form-errors"></div>

<script>
  // Populate the EXISTING region — do not create it now.
  document.getElementById('form-errors').textContent =
    '3 fields need your attention. See the highlighted inputs below.';
</script>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              React: a reusable announcer
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Mount the live region once near the app root, then push messages
              into it. Clearing and re-setting the text forces screen readers to
              re-announce an identical message.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function Announcer({ message, assertive = false }) {
  return (
    <div
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// The empty <Announcer /> is always in the tree; updating
// "message" state announces the change without moving focus.`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              The visually-hidden utility
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Use a class that hides the region visually but keeps it in the
              accessibility tree &mdash; never <code>display:none</code>, which
              removes it from live-region processing.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}`}</code>
            </pre>
          </section>

          {/* Common mistakes */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2
              id="mistakes"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Common mistakes
            </h2>
            <ul className="space-y-3">
              {[
                "Injecting the live region and its text into the DOM at the same time — screen readers only announce changes to a region that already existed, so the message is silent.",
                "Hiding the region with display:none or visibility:hidden, which removes it from the accessibility tree; use a visually-hidden / sr-only class that keeps it present.",
                "Using role=\"alert\" (assertive) for routine confirmations, constantly interrupting the user — reserve assertive for genuine errors and warnings.",
                "Auto-dismissing a toast before the announcement finishes, so the message disappears mid-sentence; keep it on screen long enough or store it for review.",
                "Re-setting the same text and expecting a re-announcement — identical content does not trigger an update; clear the region first, then set the new text.",
                "Flooding a polite region with rapid updates (every keystroke or every 1% of progress); debounce to meaningful milestones.",
                "Moving focus to the message as the 'fix', which disrupts the user's place — 4.1.3 specifically requires announcement without a focus change.",
                "Relying on title attributes or color-only changes to signal status, which assistive technology does not announce.",
              ].map((m) => (
                <li
                  key={m}
                  className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-rose-500 font-bold">
                    &#10007;
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
              How to test for 4.1.3
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Trigger each status with a screen reader running",
                  d: "Turn on NVDA, JAWS, or VoiceOver, then save a form, submit with errors, run a search, and start an upload. Confirm each change is spoken without your focus moving.",
                },
                {
                  t: "Verify focus never jumps",
                  d: "Keep focus in a known field, trigger the status, and check the cursor stays put. If focus moved, the design is solving the problem the wrong way for 4.1.3.",
                },
                {
                  t: "Inspect the live region in DevTools",
                  d: "Confirm the container exists on initial load (before the message), and that it carries role=\"status\"/\"alert\" or an aria-live value. A region created together with its text is the classic failure.",
                },
                {
                  t: "Check politeness is appropriate",
                  d: "Errors and urgent warnings should interrupt (assertive); confirmations and counts should wait (polite). An interface that interrupts on every save is failing users even if it technically announces.",
                },
                {
                  t: "Test rapid and repeated messages",
                  d: "Fire the same status twice and a burst of quick updates. Make sure repeats re-announce when intended and that fast updates are debounced rather than lost or overwhelming.",
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
              Automated tools can confirm a live region exists but cannot judge
              whether the announcement actually fires or is appropriately
              urgent &mdash; that is a manual, screen-reader test. Build the
              workflow with the{" "}
              <Link
                href="/guides/screen-reader-testing"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Screen Reader Testing guide
              </Link>
              , and scan a live page with the{" "}
              <Link
                href="/tools/url-accessibility-auditor"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                URL Accessibility Auditor
              </Link>
              .
            </p>
          </section>

          {/* Related criteria */}
          <div id="related-criteria">
            <CriterionLinks number="4.1.3" />
          </div>

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
                      &#9662;
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="status messages 4.1.3 aria-live live region role status role alert polite assertive screen reader announcement toast notification form validation error summary result count loading progress dynamic content WCAG Level AA name role value error identification"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
