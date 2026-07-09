import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 3.3.4 Error Prevention — Reverse, Check, Confirm",
  description:
    "Complete guide to WCAG 3.3.4 Error Prevention (Legal, Financial, Data). Which pages it covers, the reversible/checked/confirmed rule, code samples, and testing.",
  keywords: [
    "WCAG 3.3.4",
    "Error Prevention",
    "legal financial data",
    "reversible checked confirmed",
    "confirmation step accessibility",
    "checkout review page",
    "undo delete accessibility",
    "3.3.4 test",
    "form submission review",
    "input assistance",
    "Level AA",
    "WCAG 2.2",
    "understandable",
  ],
  alternates: {
    canonical: "/wcag/3-3-4",
  },
  openGraph: {
    title: "WCAG 3.3.4 Error Prevention — Reverse, Check, Confirm",
    description:
      "The definitive guide to WCAG 3.3.4 Error Prevention (Legal, Financial, Data): which submissions it covers, how reversible / checked / confirmed works, review-page code samples, and how to test Level AA.",
    url: "/wcag/3-3-4",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%203.3.4%20Error%20Prevention&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.3.4 Error Prevention guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.3.4 Error Prevention — The Complete Guide",
    description:
      "Legal commitments, financial transactions, and changes to user data must be reversible, checked, or confirmed. What qualifies and how to test 3.3.4 Level AA.",
    images: [
      {
        url: "/api/og?title=WCAG%203.3.4%20Error%20Prevention&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 3.3.4 Error Prevention (Legal, Financial, Data) require?",
    a: "For web pages that cause legal commitments or financial transactions for the user, that modify or delete user-controllable data in data storage systems, or that submit user test responses, at least one of three things must be true: submissions are reversible; data entered by the user is checked for input errors and the user is given an opportunity to correct them; or a mechanism is available for reviewing, confirming, and correcting information before finalizing the submission. It is a Level AA success criterion introduced in WCAG 2.0 and unchanged in WCAG 2.1 and 2.2.",
  },
  {
    q: "Which pages does 3.3.4 apply to?",
    a: "Only high-stakes submissions — the criterion names four categories. Legal commitments: signing a contract, agreeing to binding terms, submitting a legal declaration. Financial transactions: placing an order, paying a bill, transferring money, booking a non-refundable ticket. Modifying or deleting user-controllable data in data storage systems: deleting an account, overwriting a saved profile, bulk-removing records. And submitting test responses: exams and assessments where the answers are final. An ordinary contact form or newsletter signup is not covered by 3.3.4 — though 3.3.1 and 3.3.3 still apply to its error handling.",
  },
  {
    q: "Do I need all three of reversible, checked, and confirmed?",
    a: "No — the normative text says 'at least one of the following is true'. Reversible: the submission can be undone, like a cancellation window for an order or a trash folder for deleted records. Checked: input is validated for errors and the user can correct them before the action completes. Confirmed: the user gets a review step that shows what is about to happen, with a way to correct it, before final submission. Pick the mechanism that fits the interaction; many robust checkouts implement two or all three, but one is sufficient to conform.",
  },
  {
    q: "Does a confirmation dialog ('Are you sure?') satisfy 3.3.4?",
    a: "It can satisfy the 'confirmed' option if it genuinely lets the user review, confirm, and correct the information — meaning it shows what is about to be submitted or deleted, and offers a real path back to fix mistakes. A bare 'Are you sure? OK / Cancel' before deleting 'item 4832' is weak: the user cannot see what item 4832 is. A good confirmation step summarizes the actual data (the order contents and total, the account being closed, the records being deleted) and provides an explicit way to go back and edit.",
  },
  {
    q: "Who benefits from 3.3.4?",
    a: "Everyone makes mistakes, but the criterion exists because some users cannot easily detect theirs. People with motor disabilities hit adjacent keys or double-submit; screen reader users cannot skim a whole form at a glance to spot a slip; users with dyslexia transpose digits in account numbers; people with cognitive or memory limitations may lose track mid-process. For low-stakes actions a mistake is an annoyance. For a wire transfer, a legal agreement, or an irreversible deletion, it can be serious harm — which is why the serious cases get a safety net.",
  },
  {
    q: "How does 3.3.4 relate to 3.3.1, 3.3.3, and 3.3.6?",
    a: "They form the error-handling ladder in Guideline 3.3 Input Assistance. 3.3.1 Error Identification (A) requires detected errors to be identified and described in text. 3.3.3 Error Suggestion (AA) requires suggesting corrections when known. 3.3.4 (AA) adds the reversible/checked/confirmed safety net, but only for legal, financial, data-modifying, and test submissions. 3.3.6 Error Prevention (All) (AAA) extends that same safety net to every page that requires the user to submit information, not just the high-stakes ones.",
  },
]

export default function WCAG334Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "3.3.4 Error Prevention (Legal, Financial, Data)",
            url: "https://accessibility.build/wcag/3-3-4",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 3.3.4 Error Prevention (Legal, Financial, Data): The Complete Guide to Reversible, Checked, and Confirmed Submissions"
        description="The definitive guide to WCAG 3.3.4 Error Prevention: which submissions it covers, how the reversible / checked / confirmed options work, review-step code samples, and testing methods."
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
        image="https://accessibility.build/api/og?title=WCAG%203.3.4%20Error%20Prevention&section=WCAG"
        url="https://accessibility.build/wcag/3-3-4"
        wordCount={2900}
        keywords={[
          "WCAG 3.3.4",
          "Error Prevention",
          "legal financial data",
          "reversible checked confirmed",
          "confirmation step",
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
                    3.3.4 Error Prevention (Legal, Financial, Data)
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
                Guideline 3.3 Input Assistance
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.3.4: Error Prevention (Legal, Financial, Data)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A typo in a search box costs a second. A typo in a wire transfer,
              a signed agreement, or an account deletion can cost far more. For
              these high-stakes submissions, the criterion demands a safety net:{" "}
              <strong className="text-slate-900 dark:text-white">
                the action must be reversible, or the input checked with a
                chance to correct it, or the submission reviewed and confirmed
                before it becomes final
              </strong>
              . At least one of the three — always.
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
              For Web pages that cause legal commitments or financial
              transactions for the user to occur, that modify or delete
              user-controllable data in data storage systems, or that submit
              user test responses, at least one of the following is true:{" "}
              <strong className="text-slate-900 dark:text-white">Reversible:</strong>{" "}
              Submissions are reversible.{" "}
              <strong className="text-slate-900 dark:text-white">Checked:</strong>{" "}
              Data entered by the user is checked for input errors and the user
              is provided an opportunity to correct them.{" "}
              <strong className="text-slate-900 dark:text-white">Confirmed:</strong>{" "}
              A mechanism is available for reviewing, confirming, and correcting
              information before finalizing the submission.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Two scoping facts matter. The criterion applies only to the four
              named categories of submission — not to every form. And the three
              options are alternatives: <em>reversible OR checked OR
              confirmed</em>. Any one of them, done properly, conforms.
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
                  Why error prevention matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#scope">
                  Which submissions are covered
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#three-options">
                  Reversible, checked, confirmed
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
              Why error prevention matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              All users make input errors, but users with disabilities make more
              of them and catch fewer. Someone with a motor impairment may hit
              an adjacent key or trigger a double-submit; someone with dyslexia
              may transpose the digits of an account number; a screen reader
              user cannot visually skim a completed form to sanity-check it the
              way a sighted user does; a user with a memory limitation may not
              recall what they entered three steps ago.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              For most interactions the cost of a slip is trivial — resubmit the
              search, re-type the comment. The criterion exists for the
              interactions where it is not: money leaves an account, a contract
              binds, data is destroyed, an exam is graded. In those cases, an
              undetected error is not an inconvenience but a genuine harm, and
              the interface — not the user&rsquo;s vigilance — must provide the
              protection.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The safety nets it mandates are ones good commerce sites already
              use: order review pages, cancellation windows, undo for deletions,
              validation with a chance to fix. 3.3.4 turns that good practice
              into a requirement wherever the stakes are legal, financial, or
              data loss.
            </p>
          </section>

          {/* Scope */}
          <section aria-labelledby="scope" className="mb-12">
            <h2
              id="scope"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Which submissions are covered
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              3.3.4 does <em>not</em> apply to every form. It applies to pages
              that cause any of four kinds of consequence:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Legal commitments",
                  d: "Actions with legal effect: e-signing a contract, accepting binding terms, submitting a tax filing or legal declaration.",
                },
                {
                  t: "Financial transactions",
                  d: "Purchases, payments, transfers, trades, bookings with fees — anything that moves the user's money or creates a charge.",
                },
                {
                  t: "Changes to user-controllable data",
                  d: "Modifying or deleting the user's stored data: closing an account, overwriting a saved profile or document, bulk-deleting records in an app's storage.",
                },
                {
                  t: "Test responses",
                  d: "Submitting answers to a test or exam, where responses are final once submitted and errors cannot be repaired afterwards.",
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
              A contact form, comment box, or newsletter signup is outside
              3.3.4&rsquo;s scope (its cousins{" "}
              <Link
                href="/wcag/3-3-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                3.3.1
              </Link>{" "}
              and{" "}
              <Link
                href="/wcag/3-3-3"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                3.3.3
              </Link>{" "}
              still govern its error messages). The AAA criterion 3.3.6 extends
              the same protections to all submissions — at AA, focus on the four
              categories above.
            </p>
          </section>

          {/* Three options */}
          <section aria-labelledby="three-options" className="mb-12">
            <h2
              id="three-options"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The three ways to conform
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Satisfy <strong className="text-slate-900 dark:text-white">any one</strong>{" "}
              of these for each covered submission:
            </p>
            <ol className="space-y-4">
              {[
                {
                  t: "Reversible — the action can be undone",
                  d: "Provide a way to reverse the submission after the fact: a cancellation window for orders, a 'trash' stage before permanent deletion with a documented recovery period, an undo for destructive edits. Reversibility is strongest for data operations; genuinely irreversible events (a sent payment, a graded exam) usually need one of the other two options instead.",
                },
                {
                  t: "Checked — input is validated, with a chance to correct",
                  d: "Check the entered data for input errors — malformed account numbers, impossible dates, missing required fields, amounts outside plausible bounds — and give the user the opportunity to fix them before the action completes. Error messages must satisfy 3.3.1 (identified in text) and ideally 3.3.3 (suggest a correction).",
                },
                {
                  t: "Confirmed — review before it becomes final",
                  d: "Insert a review step that shows the user exactly what is about to happen — the actual data: items, amounts, recipient, the records to be deleted — with an explicit way to go back and correct it, before a clearly labelled final action ('Place order and pay', 'Permanently delete account').",
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
                  t: "Checkout with an order review page",
                  d: "Before payment, the user sees a summary of items, quantities, prices, addresses, and payment method, with 'Edit' links for each section and a final 'Place order and pay' button. Confirmed — passes.",
                },
                {
                  pass: true,
                  t: "Deletion with a recovery window",
                  d: "Deleting a project moves it to a trash area where it can be restored for 30 days, and the interface says so. Reversible — passes.",
                },
                {
                  pass: true,
                  t: "Bank transfer with validation and review",
                  d: "The transfer form validates the account number format (checked) and then shows a confirmation screen with recipient name, amount, and date before the final 'Send transfer' (confirmed). Passes with margin.",
                },
                {
                  pass: false,
                  t: "One-click irreversible purchase",
                  d: "A single tap charges the card immediately: no review step, no validation pause, no cancellation window. None of the three options is true — fails.",
                },
                {
                  pass: false,
                  t: "Blind 'Are you sure?' before permanent deletion",
                  d: "'Delete all selected records? OK / Cancel' — without showing which or how many records, and with no recovery. The user cannot meaningfully review or correct, and nothing is reversible. Fails.",
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
              Direct submit vs. a real review step
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The &ldquo;confirmed&rdquo; option means showing the user their
              actual data before the final action — not just interposing a
              second button.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ The first click is the final, charging action -->
<form action="/api/checkout" method="post">
  …payment fields…
  <button type="submit">Buy now</button>
</form>

<!-- ✓ A review page echoes the data, with a way back -->
<main>
  <h1>Review your order</h1>
  <h2>Items</h2>
  <ul>
    <li>Ergonomic keyboard — 1 × $89.00</li>
  </ul>
  <h2>Deliver to</h2>
  <p>Jane Doe, 42 Main St, Springfield
     <a href="/checkout/address">Edit address</a></p>
  <h2>Payment</h2>
  <p>Visa ending 4242 — total $96.12
     <a href="/checkout/payment">Edit payment</a></p>

  <form action="/api/checkout/confirm" method="post">
    <button type="submit">Place order and pay $96.12</button>
  </form>
  <a href="/checkout">Back to checkout</a>
</main>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A deletion that is reversible — and says so
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              For data operations, reversibility is often the cleanest option: a
              trash stage plus an immediate, focusable undo.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Instant, permanent, and vague -->
<button onclick="if(confirm('Are you sure?')) destroyForever(id)">
  Delete
</button>

<!-- ✓ Soft delete with a recovery window and announced undo -->
<button type="button" data-action="move-to-trash" data-id="prj_81">
  Delete project
</button>

<div role="status" class="toast">
  “Marketing site” moved to Trash. Items in Trash are kept
  for 30 days.
  <button type="button" data-action="undo">Undo</button>
</div>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Checked: validate, describe, let the user fix it
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The &ldquo;checked&rdquo; option pairs validation with an
              accessible error message and returns control to the user instead
              of finalizing.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<form action="/api/transfer" method="post" novalidate>
  <label for="iban">Recipient IBAN</label>
  <input id="iban" name="iban" inputmode="text"
         autocomplete="off"
         aria-describedby="iban-error" aria-invalid="true" />
  <p id="iban-error" class="error">
    This IBAN fails its checksum — one digit may be mistyped.
    Compare it with the recipient's details and correct it.
  </p>

  <label for="amount">Amount (USD)</label>
  <input id="amount" name="amount" inputmode="decimal" />

  <!-- Submission is blocked until errors are corrected;
       nothing is transferred while aria-invalid fields remain. -->
  <button type="submit">Continue to review</button>
</form>`}</code>
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
                "A financial or legal submission that completes on the first click, with no review step, no validation opportunity, and no way to reverse it.",
                "A confirmation dialog that names nothing — 'Are you sure? OK / Cancel' — so the user confirms an action they cannot actually review or correct.",
                "Permanent deletion of user data with no trash stage, no undo, and no confirmation that shows what will be destroyed.",
                "A review page that displays the data but offers no way back to correct it — 'confirming' without the required correcting.",
                "Validation that silently rejects or 'corrects' input without telling the user, finalizing a submission that differs from what they intended.",
                "Timed test submissions that auto-finalize mid-answer without warning and without any of the three protections (this also implicates 2.2.1 Timing Adjustable).",
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
              How to test for 3.3.4
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Find the covered submissions",
                  d: "Inventory every flow that creates a legal commitment, moves money, modifies or deletes stored user data, or submits test answers: checkout, payments, transfers, plan changes, account closure, bulk deletes, e-signatures, exams.",
                },
                {
                  t: "Walk each flow to the point of no return",
                  d: "Complete the flow in a test environment and note the exact step where the action becomes final. Everything before that step is where a check or confirmation must live; everything after is where reversal would apply.",
                },
                {
                  t: "Verify at least one protection exists",
                  d: "For each flow, confirm one of: the finished action can genuinely be reversed (try it); input errors are detected with a real opportunity to correct them; or a review step shows the actual data with a working path back to edit before the final, clearly labelled action.",
                },
                {
                  t: "Test the protection with assistive technology",
                  d: "Run the review or error step with a screen reader and keyboard only. The summary must be readable in sequence, error messages must be announced and associated with their fields (3.3.1), and the 'go back and edit' path must be keyboard-operable.",
                },
                {
                  t: "Probe the edge cases",
                  d: "Deliberately submit wrong data: a bad account number, an implausible amount, a double-click on the final button. Confirm the system catches it or the mistake is recoverable — and that the promised reversal window actually works.",
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
              This is flow-level, manual testing — no scanner can judge whether
              an order is reversible. Audit it alongside the rest of Guideline
              3.3 in the full{" "}
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

          <CriterionLinks number="3.3.4" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="error prevention legal financial data reversible checked confirmed order review page confirmation step undo delete account closure input assistance form validation WCAG 3.3.4 Level AA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
