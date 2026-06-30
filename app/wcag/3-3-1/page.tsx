import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title:
    "WCAG 3.3.1 Error Identification — Accessible Form Errors Guide (Level A)",
  description:
    "Complete guide to WCAG 3.3.1 Error Identification. Learn how to identify the field in error and describe it in text, why color alone fails, aria-invalid and aria-describedby, error summaries, live regions, code examples, testing methods, and common mistakes.",
  keywords: [
    "WCAG 3.3.1",
    "Error Identification",
    "accessible form errors",
    "form validation accessibility",
    "aria-invalid",
    "aria-describedby error",
    "error message accessibility",
    "inline validation accessibility",
    "error summary",
    "role alert",
    "aria-live errors",
    "Level A",
    "WCAG 2.2",
    "accessible forms",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/3-3-1",
  },
  openGraph: {
    title:
      "WCAG 3.3.1 Error Identification — Accessible Form Errors Guide (Level A)",
    description:
      "The definitive guide to WCAG 3.3.1 Error Identification: identify which field is wrong, describe the error in text, wire up aria-invalid and aria-describedby, build an accessible error summary, copy-ready code, and testing.",
    url: "https://accessibility.build/wcag/3-3-1",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "WCAG 3.3.1 Error Identification guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.3.1 Error Identification — Accessible Form Errors",
    description:
      "Identify the field in error and describe it in text: aria-invalid, aria-describedby, error summaries, live regions, and how to test for WCAG 3.3.1 Level A.",
  },
}

const requirements = [
  {
    name: "Identify which item is in error",
    summary: "Point the user to the specific field that failed.",
    detail:
      "When validation rejects input, the user must be able to tell exactly which control caused the problem — not just that 'the form has errors somewhere'. The field is identified by associating its error message with the control, by moving focus to it, and (for visual users) by a clear visible marker on the field itself.",
  },
  {
    name: "Describe the error in text",
    summary: "Say what is wrong in words, not a red border alone.",
    detail:
      "The description must be available as text. 'Email is required' or 'Enter a date as DD/MM/YYYY' tells the user both what went wrong and, ideally, how to fix it. A red outline, a colour change, or an icon with no text equivalent does not satisfy 3.3.1 because it is not perceivable to screen reader users and not perceivable to users who cannot distinguish the colour.",
  },
  {
    name: "Only when the error is automatically detected",
    summary: "3.3.1 applies to errors your code can catch.",
    detail:
      "The criterion is scoped to input errors that are automatically detected — a missing required field, text in a number field, an email without an @, a date outside the allowed range. It does not require you to catch mistakes a machine cannot know about, such as the user typing a real but wrong street name.",
  },
]

const faqs = [
  {
    q: "What does WCAG 3.3.1 Error Identification require?",
    a: "WCAG 3.3.1 requires that when an input error is automatically detected, the item in error is identified and the error is described to the user in text. In plain terms: if your validation rejects something, you must tell the user which field is wrong and what is wrong with it, using text — not just a red border or a colour change. It is a Level A success criterion, the most essential conformance level.",
  },
  {
    q: "Is a red border enough to flag a form error?",
    a: "No. A red border or colour change alone fails 3.3.1 because the error is not described in text, and it also fails 1.4.1 Use of Color because colour is the only thing conveying the error. A red border is fine as an additional cue, but it must be accompanied by a text message that names the problem (for example, 'Enter a valid email address') and that message must be programmatically associated with the field so a screen reader announces it.",
  },
  {
    q: "How do aria-invalid and aria-describedby work together for errors?",
    a: "Set aria-invalid=\"true\" on a control when its value is invalid so assistive technology announces the field as being in an error state. Then point aria-describedby at the id of the element that holds the error text, so the message is announced together with the field when it receives focus. Remove aria-invalid (or set it to false) and clear the description once the value becomes valid. Together they identify the field and describe the error — exactly what 3.3.1 asks for.",
  },
  {
    q: "Should I show errors inline, on submit, or both?",
    a: "Both patterns can meet 3.3.1; what matters is that the error is identified and described in text and is reachable by keyboard and screen reader. A common accessible approach is to validate on submit, render a focusable error summary at the top of the form that links to each invalid field, and also show an inline message next to each field tied with aria-describedby. If you validate inline as the user types or leaves a field, avoid announcing an error before the user has finished — premature, rapidly-changing announcements are disorienting.",
  },
  {
    q: "How do I make a dynamically inserted error message get announced?",
    a: "If an error message appears without a page reload — for example after an asynchronous submit — wrap it in a live region so screen readers announce it. Use role=\"alert\" (which maps to an assertive live region) for a single urgent message, or an element with aria-live=\"assertive\" / aria-live=\"polite\" that is present in the DOM before you inject the text. For a list of errors, moving keyboard focus to a focusable error summary heading is the most reliable way to make sure the user lands on the errors.",
  },
  {
    q: "How is 3.3.1 different from 3.3.2, 3.3.3, and 4.1.3?",
    a: "They form the form-handling family. 3.3.2 Labels or Instructions is about preventing errors up front with clear labels and hints. 3.3.1 Error Identification (Level A) covers identifying and describing an error once it happens. 3.3.3 Error Suggestion (Level AA) goes further and asks you to suggest a correction when you know one. 4.1.3 Status Messages (Level AA) covers announcing status — including error counts — without moving focus, via live regions. A well-built form satisfies all four together.",
  },
]

export default function WCAG331Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "3.3.1 Error Identification",
            url: "https://accessibility.build/wcag/3-3-1",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 3.3.1 Error Identification: The Complete Accessible Form Errors Guide"
        description="The definitive guide to WCAG 3.3.1 Error Identification: how to identify the field in error and describe the problem in text, aria-invalid and aria-describedby, accessible error summaries, live regions, code examples, testing methods, and common mistakes."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-06-26"
        dateModified="2026-06-26"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/wcag/3-3-1"
        wordCount={2800}
        keywords={[
          "WCAG 3.3.1",
          "Error Identification",
          "accessible form errors",
          "aria-invalid",
          "aria-describedby error",
          "error summary",
          "Level A",
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
                    3.3.1 Error Identification
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                Level A
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 3: Understandable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Core of accessible forms
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.3.1: Error Identification
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              When a form rejects what someone typed, you must tell them{" "}
              <strong className="text-slate-900 dark:text-white">
                which field is wrong and what is wrong with it, in text
              </strong>
              . This Level A criterion is what stops a failed form from becoming
              a dead end — a red border with no message leaves screen reader
              users, colour-blind users, and anyone in a hurry stuck, with no way
              to find or fix the problem.
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
              If an input error is automatically detected, the item that is in
              error is identified and the error is described to the user in text.
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
                  Why error identification matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what">
                  What 3.3.1 actually requires
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#color">
                  Why colour or an icon alone fails
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#patterns">
                  Two patterns: inline and summary
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
              Why error identification matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Forms are where tasks succeed or fail: signing up, checking out,
              booking, paying, applying. The moment validation rejects an entry,
              the user needs three things — to know <em>that</em> something is
              wrong, <em>which</em> field is wrong, and <em>how</em> to fix it. If
              your form only turns a border red, a sighted user with full colour
              vision might puzzle it out. A screen reader user hears nothing
              change. A colour-blind user sees no change at all. Everyone else has
              to hunt up and down a long form guessing which field the computer
              objected to.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The cost is concrete: abandoned checkouts, failed applications, and
              support tickets. Error handling is consistently one of the weakest
              areas of real-world forms, and because the fix is well understood,
              3.3.1 is a high-impact criterion to get right. Good error
              identification also helps people with cognitive disabilities, users
              on small screens, and anyone moving quickly — it is a usability win
              far beyond compliance.
            </p>
          </section>

          {/* What */}
          <section aria-labelledby="what" className="mb-12">
            <h2
              id="what"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What 3.3.1 actually requires
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              The criterion has three moving parts. Meet all of them and a
              rejected form becomes recoverable instead of a dead end.
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
                <strong>Note:</strong> 3.3.1 asks you to{" "}
                <em>identify and describe</em> the error. It does not, at Level A,
                require you to <em>suggest a fix</em> — that is the job of{" "}
                <Link href="/wcag/3-3-3" className="underline font-medium">
                  3.3.3 Error Suggestion
                </Link>{" "}
                at Level AA. But describing
                an error well almost always means hinting at the fix, so you often
                satisfy both at once.
              </p>
            </div>
          </section>

          {/* Color */}
          <section aria-labelledby="color" className="mb-12">
            <h2
              id="color"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Why colour or an icon alone fails
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The most common 3.3.1 failure is signalling an error with styling
              but no words. It breaks in several ways:
            </p>
            <ul className="space-y-3 mb-2">
              {[
                "A red border or red text is invisible to screen reader users — there is no text for the assistive technology to read, so the error simply does not exist for them.",
                "Colour alone also fails 1.4.1 Use of Color: people with colour-vision deficiencies may not perceive red versus the default border, so the only cue is lost.",
                "An error icon with no accessible label or adjacent text is announced as nothing, or as 'graphic', telling the user neither which field nor what is wrong.",
                "A message that is on screen but not programmatically associated with its field (just sitting nearby in the layout) is not reliably announced when the user reaches the control.",
              ].map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-rose-500 font-bold">
                    ✗
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
              The fix is to always pair the visual cue with a text message that
              names the problem, mark the field with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-invalid=&quot;true&quot;
              </code>
              , and connect the message to the field with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-describedby
              </code>
              . Use colour and icons as <em>additional</em> reinforcement, never
              as the only signal.
            </p>
          </section>

          {/* Patterns */}
          <section aria-labelledby="patterns" className="mb-12">
            <h2
              id="patterns"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Two patterns: inline messages and an error summary
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Two well-tested patterns satisfy 3.3.1. The most robust forms use
              both together.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Inline field messages
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  A text message sits beside each invalid control, tied to it with{" "}
                  <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">
                    aria-describedby
                  </code>{" "}
                  and flagged with{" "}
                  <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">
                    aria-invalid
                  </code>
                  . When the user focuses the field, they hear both the label and
                  the error. This is precise and keeps the fix next to the field.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Error summary at the top
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  On submit, a focusable summary box lists every error as links
                  that jump to the field. Move keyboard focus to its heading so
                  the user lands on the list immediately. This is the GOV.UK
                  pattern and is especially valuable on long forms.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              A note on timing: validating <em>inline as the user types</em> can
              announce an error before they have finished entering a value, which
              is jarring with a screen reader. Prefer validating when the user
              leaves a field or submits, and reserve assertive announcements for
              genuine, settled errors.
            </p>
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
              An accessible field in its error state
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The core pattern: a real label, an error message with an{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                id
              </code>
              , and the field wired to it with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-invalid
              </code>{" "}
              and{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-describedby
              </code>
              .
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<label for="email">Email address</label>
<input
  type="email"
  id="email"
  name="email"
  autocomplete="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<!-- Text message, not colour alone. Announced with the field. -->
<p id="email-error" class="field-error">
  <span aria-hidden="true">⚠ </span>
  Enter a valid email address, for example name@example.com
</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A focusable error summary
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              On submit, render this above the form and move focus to it so the
              user lands on the list of problems. Each link jumps to the field.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<div role="alert" tabindex="-1" id="error-summary" class="error-summary">
  <h2>There is a problem</h2>
  <ul>
    <li><a href="#email">Enter a valid email address</a></li>
    <li><a href="#password">Password must be at least 12 characters</a></li>
  </ul>
</div>

<script>
  // After validation fails, send focus to the summary
  document.getElementById('error-summary').focus()
</script>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Announce a dynamically inserted error with a live region
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When the message appears without a reload, a live region present in
              the DOM <em>before</em> the text is injected gets announced
              reliably.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- Render this empty container up front -->
<p id="status" aria-live="assertive" class="sr-only"></p>

<script>
  // Then populate it when an async submit is rejected
  document.getElementById('status').textContent =
    '2 fields need attention. See the messages above.'
</script>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Accessible React field with error handling
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A reusable field that toggles{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-invalid
              </code>{" "}
              and only describes the field with the error id when an error is
              present.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function Field({ id, label, error, ...props }) {
  const errorId = \`\${id}-error\`
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="field-error">
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}
    </div>
  )
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
                "Signalling errors with a red border or red text only, with no text message describing what is wrong.",
                "Showing an error message visually but not associating it with the field via aria-describedby, so screen readers never announce it.",
                "Forgetting aria-invalid, so the field is not announced as being in an error state even when a message exists.",
                "Leaving aria-invalid=\"true\" or stale describedby messages in place after the user corrects the value.",
                "An error icon with no accessible name or adjacent text — announced as nothing, conveying neither field nor problem.",
                "Inserting an error message into the page without a live region or a focus move, so a screen reader user never learns it appeared.",
                "Validating aggressively on every keystroke, announcing 'invalid' before the user has finished typing the value.",
                "A vague summary ('Please fix the errors below') with no link to, or naming of, the specific fields that failed.",
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
              How to test for 3.3.1
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Submit the form with deliberate errors",
                  d: "Leave required fields blank, enter an email without an @, type letters in a number field. Confirm the form is rejected and that each problem produces a clear text message — not only a colour change.",
                },
                {
                  t: "Listen with a screen reader",
                  d: "Using NVDA, JAWS, or VoiceOver, submit an invalid form and confirm you are told that errors exist, which fields they are on, and what is wrong. Tab to each invalid field and verify the error is announced with the field.",
                },
                {
                  t: "Turn off colour perception",
                  d: "View the form in greyscale (or imagine red looks like grey). Every error must still be identifiable from text and shape, satisfying 1.4.1 Use of Color as well as 3.3.1.",
                },
                {
                  t: "Check the accessible state in DevTools",
                  d: "Inspect each invalid control's Accessibility pane: confirm aria-invalid is true and the description resolves to the visible error text, and that both clear once the value becomes valid.",
                },
                {
                  t: "Test keyboard-only recovery",
                  d: "Without a mouse, submit, reach the error summary or first invalid field, read the message, fix it, and resubmit successfully — all from the keyboard.",
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
              Audit a live form with the{" "}
              <Link
                href="/tools/url-accessibility-auditor"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                URL Accessibility Auditor
              </Link>{" "}
              and learn the manual screen reader steps in the{" "}
              <Link
                href="/guides/screen-reader-testing"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Screen Reader Testing Guide
              </Link>
              .
            </p>
          </section>

          {/* Related criteria */}
          <section aria-labelledby="related-criteria" className="mb-12">
            <h2
              id="related-criteria"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Related success criteria
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/3-3-2"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    3.3.2 Labels or Instructions
                  </Link>{" "}
                  — A
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  The prevention side of the same problem: clear labels and
                  instructions up front mean fewer errors to identify later. 3.3.1
                  handles the errors that still slip through.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/1-4-1"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    1.4.1 Use of Color
                  </Link>{" "}
                  — A
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Requires that colour is never the only way information is
                  conveyed — so a red border alone fails here too. Pair every
                  colour cue with text.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/4-1-2"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    4.1.2 Name, Role, Value
                  </Link>{" "}
                  — A
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Governs how state — including the invalid state set by
                  aria-invalid — is exposed to assistive technology so the error
                  is actually announced.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  4.1.3 Status Messages — AA
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Covers announcing status — such as an error count — through live
                  regions without moving focus, the AA partner to 3.3.1&apos;s
                  Level A baseline.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              Browse every criterion in the{" "}
              <Link
                href="/wcag"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG Success Criteria hub
              </Link>{" "}
              or work through the full{" "}
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
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="error identification accessible form errors form validation aria-invalid aria-describedby error message error summary role alert aria-live live region inline validation WCAG 3.3.1 Level A form accessibility screen reader"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
