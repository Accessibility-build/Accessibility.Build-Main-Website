import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 3.3.3 Error Suggestion — Suggest Fixes for Errors",
  description:
    "Complete guide to WCAG 3.3.3 Error Suggestion. Learn how to suggest corrections when a form error is detected, when the security/purpose exception applies, accessible suggestion patterns, aria-describedby and live regions, copy-ready code, testing methods, and common mistakes.",
  keywords: [
    "WCAG 3.3.3",
    "Error Suggestion",
    "suggest correction form error",
    "form validation accessibility",
    "accessible error messages",
    "error recovery accessibility",
    "aria-describedby",
    "helpful error messages",
    "Level AA",
    "WCAG 2.2",
    "accessible forms",
    "input assistance",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/3-3-3",
  },
  openGraph: {
    title:
      "WCAG 3.3.3 Error Suggestion — Suggest Fixes for Form Errors (Level AA)",
    description:
      "The definitive guide to WCAG 3.3.3 Error Suggestion: when you know what is wrong, suggest how to fix it — without compromising security. Patterns, copy-ready code, and testing.",
    url: "https://accessibility.build/wcag/3-3-3",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/api/og?title=WCAG%203.3.3%20Error%20Suggestion&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.3.3 Error Suggestion guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.3.3 Error Suggestion — Suggest Fixes for Form Errors",
    description:
      "When an error is detected and you know the fix, suggest it in text: accessible suggestion patterns, the security exception, code, and how to test for WCAG 3.3.3 Level AA.",
  },
}

const requirements = [
  {
    name: "An input error is detected",
    summary: "The trigger is the same as 3.3.1 — a problem your code can catch.",
    detail:
      "3.3.3 only applies once an input error has been automatically detected: a required field left blank, an email without an @, a date outside the allowed range, a postcode in the wrong format. If your code cannot tell that something is wrong, the criterion does not ask you to invent a suggestion.",
  },
  {
    name: "You know a suggestion for correction",
    summary: "If the fix is knowable, you must offer it.",
    detail:
      "When the cause of the error is something your application can determine — the field is required, the format is wrong, the value is out of range, the date does not exist — you must provide that suggestion to the user in text. 'Enter a date in the format DD/MM/YYYY' or 'Password must be at least 12 characters' tells the user not just that something failed but exactly how to put it right.",
  },
  {
    name: "Unless it would jeopardise security or purpose",
    summary: "Security and content purpose come first.",
    detail:
      "There is one exception: you are not required to suggest a correction if doing so would jeopardise the security or purpose of the content. The classic example is a login form — revealing 'that password is wrong but the username is correct' would leak information to an attacker. A test question is another: suggesting the answer would defeat its purpose. In these cases a generic message is acceptable.",
  },
]

const faqs = [
  {
    q: "What does WCAG 3.3.3 Error Suggestion require?",
    a: "WCAG 3.3.3 requires that when an input error is automatically detected and you know how to correct it, you suggest the correction to the user in text — unless doing so would jeopardise the security or purpose of the content. In plain terms: do not just say 'invalid date', say 'Enter a date in the format DD/MM/YYYY'. It is a Level AA success criterion and the natural next step after 3.3.1 Error Identification.",
  },
  {
    q: "How is 3.3.3 different from 3.3.1 Error Identification?",
    a: "They are a pair. 3.3.1 Error Identification (Level A) requires you to identify which field is wrong and describe that an error exists, in text. 3.3.3 Error Suggestion (Level AA) goes one step further: when you can work out how to fix the error, you must suggest the fix. 3.3.1 is 'the date is invalid'; 3.3.3 is 'the date is invalid — enter it as DD/MM/YYYY'. A well-written error message usually satisfies both at once, because describing an error clearly almost always implies the correction.",
  },
  {
    q: "When can I skip suggesting a correction?",
    a: "Only when suggesting it would jeopardise the security or purpose of the content. On a sign-in form, you should not say 'the password is wrong but the email exists' because that confirms which accounts are valid to an attacker — a generic 'Email or password is incorrect' is the accessible and secure answer. On a quiz or test, suggesting the right answer would defeat the purpose. Outside these narrow cases, if you know the fix, you must offer it.",
  },
  {
    q: "Does a generic message like 'Invalid input' meet 3.3.3?",
    a: "Usually not. If your validation knows why the input was rejected — wrong format, out of range, required — then 'Invalid input' withholds a suggestion you are capable of giving, which fails 3.3.3. The message should name the problem and point to the fix: 'Enter an amount between £1 and £500' rather than 'Invalid amount'. A generic message is only acceptable when the security or purpose exception applies, or when your code genuinely cannot determine the cause.",
  },
  {
    q: "Where should the suggested correction appear?",
    a: "Put the suggestion in the same text message that identifies the error, and associate it with the field using aria-describedby so a screen reader announces it when the field receives focus. For errors surfaced after submit, include the suggestion in the error summary links too. The suggestion is just well-written error text — it does not need a separate mechanism, only that the words tell the user what to do next and that those words are programmatically connected to the control.",
  },
  {
    q: "How does 3.3.3 relate to 3.3.4 and 4.1.3?",
    a: "They are part of the same form-handling family. 3.3.2 Labels or Instructions prevents errors up front. 3.3.1 Error Identification names an error once it happens. 3.3.3 Error Suggestion adds the fix. 3.3.4 Error Prevention (Legal, Financial, Data) requires review, confirmation, or reversal for high-stakes submissions. 4.1.3 Status Messages covers announcing error counts and status via live regions without moving focus. Build all of them together and your forms become genuinely recoverable.",
  },
]

export default function WCAG333Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "3.3.3 Error Suggestion",
            url: "https://accessibility.build/wcag/3-3-3",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 3.3.3 Error Suggestion: The Complete Guide to Suggesting Fixes for Form Errors"
        description="The definitive guide to WCAG 3.3.3 Error Suggestion: how to suggest a correction when an input error is detected, when the security and purpose exception applies, accessible suggestion patterns, aria-describedby, live regions, code examples, testing methods, and common mistakes."
        author={{
          name: "Khushwant Parihar",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-06-30"
        dateModified="2026-06-30"
        image="https://accessibility.build/api/og?title=WCAG%203.3.3%20Error%20Suggestion&section=WCAG"
        url="https://accessibility.build/wcag/3-3-3"
        wordCount={2700}
        keywords={[
          "WCAG 3.3.3",
          "Error Suggestion",
          "suggest correction form error",
          "accessible error messages",
          "aria-describedby",
          "Level AA",
          "accessible forms",
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
                    3.3.3 Error Suggestion
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
                Helpful form recovery
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.3.3: Error Suggestion
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              When a form rejects an entry and you already know how to fix it,
              you must{" "}
              <strong className="text-slate-900 dark:text-white">
                suggest the correction in text
              </strong>
              . This Level AA criterion turns &quot;invalid date&quot; into
              &quot;enter the date as DD/MM/YYYY&quot; — the difference between a
              user who recovers in seconds and one who abandons the task. The one
              exception: don&apos;t suggest a fix when it would compromise
              security or defeat the purpose of the content.
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
              If an input error is automatically detected and suggestions for
              correction are known, then the suggestions are provided to the
              user, unless it would jeopardize the security or purpose of the
              content.
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
                  Why error suggestion matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what">
                  What 3.3.3 actually requires
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#exception">
                  The security and purpose exception
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#writing">
                  Writing a good suggestion
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
              Why error suggestion matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Knowing <em>that</em> a field is wrong is only half the battle.
              The user still has to work out <em>how</em> to fix it — and if your
              message stops at &quot;invalid&quot;, they are left guessing. Did
              the date need slashes or dashes? Is the phone number too long or
              too short? Should the amount include the currency symbol? Each
              guess is another failed submit, and on a checkout or an application
              that friction is exactly where people give up.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Error suggestion removes the guesswork. It is especially decisive
              for people with cognitive and learning disabilities, for whom a
              vague error is a hard stop, and for screen reader users who cannot
              glance around the form for clues. A suggested correction is also a
              plain usability win — fewer support tickets, fewer abandoned forms,
              and higher completion rates for everyone. Because the suggestion is
              just better-written error text, it is one of the cheapest Level AA
              wins available.
            </p>
          </section>

          {/* What */}
          <section aria-labelledby="what" className="mb-12">
            <h2
              id="what"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What 3.3.3 actually requires
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              The criterion turns on three conditions. When all three hold, a
              suggestion is mandatory at Level AA.
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
                <strong>Note:</strong> 3.3.3 builds directly on{" "}
                <Link href="/wcag/3-3-1" className="underline font-medium">
                  3.3.1 Error Identification
                </Link>
                . First identify the field and describe the problem in text (3.3.1,
                Level A); then, if you know the fix, suggest it (3.3.3, Level AA).
                You usually deliver both in the same sentence, wired to the field
                with the same{" "}
                <code className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 font-mono text-sm">
                  aria-describedby
                </code>
                .
              </p>
            </div>
          </section>

          {/* Exception */}
          <section aria-labelledby="exception" className="mb-12">
            <h2
              id="exception"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The security and purpose exception
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              3.3.3 has one carve-out: you are not required to suggest a
              correction if doing so would <em>jeopardise the security or
              purpose of the content</em>. This is not a loophole for lazy error
              messages — it is a narrow exception for cases where the suggestion
              itself would do harm.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-6">
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-2">
                  Security — sign-in forms
                </h3>
                <p className="text-amber-900/90 dark:text-amber-100/90 leading-relaxed">
                  Saying &quot;that password is wrong&quot; while accepting the
                  email confirms which accounts exist, helping attackers
                  enumerate users. Use a single generic message —{" "}
                  <em>&quot;Email or password is incorrect&quot;</em> — for both
                  fields. This is both secure and still meets 3.3.1, because the
                  user is told an error exists.
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-6">
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-2">
                  Purpose — tests and quizzes
                </h3>
                <p className="text-amber-900/90 dark:text-amber-100/90 leading-relaxed">
                  On an exam, a knowledge check, or a CAPTCHA, suggesting the
                  correct answer would defeat the point of the exercise. Here a
                  generic &quot;incorrect, try again&quot; is acceptable, because
                  the suggestion is exactly what you must withhold.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              Outside these specific situations, the exception does not apply. A
              shipping address, a date of birth, a payment amount, a phone number
              — none of these are security-sensitive in the way a password is, so
              for these you must give the user the format, range, or rule they
              need to succeed.
            </p>
          </section>

          {/* Writing a good suggestion */}
          <section aria-labelledby="writing" className="mb-12">
            <h2
              id="writing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Writing a good suggestion
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              A useful suggestion names the rule the value broke and shows what a
              valid value looks like. Compare:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300 mb-3">
                  Identifies but does not suggest
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>&quot;Invalid date.&quot;</li>
                  <li>&quot;Password not accepted.&quot;</li>
                  <li>&quot;Wrong format.&quot;</li>
                  <li>&quot;Amount not allowed.&quot;</li>
                  <li>&quot;Error in this field.&quot;</li>
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 mb-3">
                  Suggests the correction
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>&quot;Enter the date as DD/MM/YYYY, e.g. 14/03/2026.&quot;</li>
                  <li>
                    &quot;Use at least 12 characters, including a number.&quot;
                  </li>
                  <li>&quot;Enter a UK postcode, e.g. SW1A 1AA.&quot;</li>
                  <li>&quot;Enter an amount between £1 and £500.&quot;</li>
                  <li>&quot;Enter your email, e.g. name@example.com.&quot;</li>
                </ul>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              When the input is one of a fixed set of values, the strongest
              suggestion lists or links to the valid options — for example,
              &quot;We don&apos;t ship to that country. Choose from the supported
              countries list.&quot; Keep the wording plain, avoid jargon, and put
              the suggestion where the error is, so a screen reader announces the
              problem and the fix together.
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
              A field whose error includes the suggested fix
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The message both identifies the error (3.3.1) and suggests the
              correction (3.3.3), tied to the field with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-describedby
              </code>
              .
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<label for="dob">Date of birth</label>
<input
  type="text"
  id="dob"
  name="dob"
  inputmode="numeric"
  autocomplete="bday"
  aria-invalid="true"
  aria-describedby="dob-hint dob-error"
/>
<!-- Persistent hint helps prevent the error (3.3.2) -->
<p id="dob-hint" class="field-hint">For example, 14/03/1990.</p>
<!-- Error names the problem AND suggests the fix (3.3.1 + 3.3.3) -->
<p id="dob-error" class="field-error">
  <span aria-hidden="true">⚠ </span>
  That date isn&apos;t valid. Enter it as DD/MM/YYYY, for example 14/03/1990.
</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              The security exception on a sign-in form
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A single generic message covers both fields, so the form never
              reveals which accounts exist — meeting 3.3.1 without suggesting a
              specific fix.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<div role="alert" id="signin-error" class="error-summary">
  <p>Email or password is incorrect. Check both and try again.</p>
</div>

<label for="email">Email</label>
<input id="email" type="email" autocomplete="username"
       aria-invalid="true" aria-describedby="signin-error" />

<label for="password">Password</label>
<input id="password" type="password" autocomplete="current-password"
       aria-invalid="true" aria-describedby="signin-error" />`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Building a suggestion from the validation rule
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Derive the suggestion from the same rule that detected the error,
              so the message always tells the user how to satisfy it.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function suggestForAmount(value, { min, max }) {
  const n = Number(value)
  if (value.trim() === "") return \`Enter an amount between £\${min} and £\${max}.\`
  if (Number.isNaN(n)) return \`Enter a number, for example £\${min}.\`
  if (n < min) return \`That's below the minimum. Enter at least £\${min}.\`
  if (n > max) return \`That's above the maximum. Enter no more than £\${max}.\`
  return null // valid
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Accessible React field that surfaces a suggestion
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A reusable field that renders a persistent hint plus an error
              message containing the suggested correction, and only describes the
              field with the error id when an error is present.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function Field({ id, label, hint, error, ...props }) {
  const hintId = hint ? \`\${id}-hint\` : undefined
  const errorId = error ? \`\${id}-error\` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {hint && <p id={hintId} className="field-hint">{hint}</p>}
      {error && (
        <p id={errorId} className="field-error">
          <span aria-hidden="true">⚠ </span>
          {/* error string should name the problem and suggest the fix */}
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
                "Stopping at 'invalid' when your validation knows the exact rule that was broken and could state the fix.",
                "Showing the required format only as placeholder text that disappears once the user starts typing — it is gone exactly when the error appears.",
                "Over-applying the security exception to non-sensitive fields like addresses, dates, or amounts to justify vague messages.",
                "Suggesting a correction on a sign-in form that reveals whether the email or the password was the wrong one.",
                "Putting the suggestion in a tooltip or a separate panel that is not associated with the field via aria-describedby, so screen readers never announce it.",
                "Generic catch-all messages ('Something went wrong') for errors whose cause your code already knows.",
                "Jargon-filled suggestions ('value fails regex pattern') that a non-technical user cannot act on.",
                "Suggesting a fix that is itself wrong or out of date because the message text drifted from the actual validation rule.",
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
              How to test for 3.3.3
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Trigger each kind of error on purpose",
                  d: "For every field, submit a wrong format, an out-of-range value, and a blank required entry. For each, confirm the message not only flags the error but tells you how to put it right.",
                },
                {
                  t: "Ask: could the code have suggested the fix?",
                  d: "If your validation knows the rule (format, range, required, allowed values), the message should reflect it. A message that says less than the validation knows is a 3.3.3 gap.",
                },
                {
                  t: "Listen with a screen reader",
                  d: "With NVDA, JAWS, or VoiceOver, move to each invalid field and confirm the suggested correction is announced together with the label and the error — not hidden in a tooltip or detached panel.",
                },
                {
                  t: "Check the security-sensitive forms",
                  d: "On sign-in, password reset, and similar flows, confirm the messages do not reveal which field was wrong or whether an account exists, while still telling the user an error occurred.",
                },
                {
                  t: "Verify the suggestion matches the rule",
                  d: "Confirm the wording in the message agrees with the actual validation — if the rule is 12 characters, the suggestion must say 12, not 8. Drift between the two is a common, quiet failure.",
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
          <div id="related-criteria">
            <CriterionLinks number="3.3.3" />
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
            content="error suggestion suggest correction form error accessible error messages error recovery form validation aria-describedby helpful error messages security exception sign-in WCAG 3.3.3 Level AA form accessibility input assistance screen reader"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
