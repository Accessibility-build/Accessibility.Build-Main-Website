import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 3.3.7 Redundant Entry — No Re-entering Information",
  description:
    "Complete guide to WCAG 3.3.7 Redundant Entry. Learn why multi-step processes must not force users to re-enter information they already provided, the three exceptions, autofill and 'same as' patterns, copy-ready code, testing methods, and common mistakes.",
  keywords: [
    "WCAG 3.3.7",
    "Redundant Entry",
    "re-enter information",
    "multi-step form accessibility",
    "checkout accessibility",
    "autofill",
    "autocomplete",
    "billing shipping same as",
    "form memory",
    "cognitive accessibility",
    "Level A",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/3-3-7",
  },
  openGraph: {
    title:
      "WCAG 3.3.7 Redundant Entry — Don't Make Users Re-enter Information (Level A)",
    description:
      "The definitive guide to WCAG 3.3.7: information a user already entered in a process must be auto-populated or available to select, not re-typed. Patterns, code, and testing.",
    url: "https://accessibility.build/wcag/3-3-7",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/api/og?title=WCAG%203.3.7%20Redundant%20Entry&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.3.7 Redundant Entry guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.3.7 Redundant Entry — Don't Make Users Re-enter Information",
    description:
      "New in WCAG 2.2: don't force users to re-enter information they already gave you in the same process. The three exceptions, code, and how to test.",
  },
}

const whatCounts = [
  {
    name: "Re-typing an email or address across steps",
    detail:
      "A checkout that asks for a shipping address on step 2 and then demands the same address be typed again on step 4 is redundant entry. The information was already provided in this process, so it must be auto-populated or offered as a selectable value instead of retyped.",
  },
  {
    name: "\"Confirm your answer\" fields that require memory",
    detail:
      "Asking a user to type a value on one screen and then reproduce it from memory on a later screen — outside of the allowed exceptions — is redundant entry. The earlier value should be shown or pre-filled so the user is not re-supplying information the system already holds.",
  },
  {
    name: "Multi-page applications that forget earlier answers",
    detail:
      "A loan, benefits, or onboarding wizard that collects your name and date of birth on page 1 and then presents empty name and date-of-birth fields again on page 5 forces redundant entry. Carry the earlier answers forward.",
  },
  {
    name: "Ignoring a value the user can obviously reuse",
    detail:
      "When billing and shipping are usually identical, forcing the user to key the same address twice with no 'same as shipping' shortcut is the textbook redundant-entry failure. Offer a way to reuse the value.",
  },
]

const exceptions = [
  {
    name: "Re-entering is essential",
    summary: "The re-entry is fundamental to the activity.",
    detail:
      "If asking for the information again is intrinsic to what the step does, it is allowed. A memory or recall game that tests whether you remember a value, or a step whose entire purpose is to confirm you can reproduce something, cannot pre-fill the answer without defeating itself.",
  },
  {
    name: "Ensuring security of the content",
    summary: "Re-entry protects the security of the content.",
    detail:
      "A step may require re-entry when doing otherwise would undermine security. Asking the user to re-type a password to confirm a sensitive change, or to re-enter a code that must not be cached, is permitted because pre-filling it would weaken the protection the step exists to provide.",
  },
  {
    name: "Previously entered information is no longer valid",
    summary: "The earlier information has expired or been invalidated.",
    detail:
      "If the value the user gave earlier is no longer valid — a one-time code that has expired, a session that has timed out, or data the system has since discarded — then asking for it again is not redundant, because there is nothing valid left to reuse.",
  },
]

const faqs = [
  {
    q: "What does WCAG 3.3.7 Redundant Entry require?",
    a: "WCAG 3.3.7 requires that information a user has already entered in the same process is either auto-populated or available for the user to select, rather than requiring them to enter it again. It applies within a single multi-step process (like a checkout or an application wizard). It is a Level A success criterion, new in WCAG 2.2. Three exceptions apply: when re-entering is essential to the activity, when it is needed for security, or when the previously entered information is no longer valid.",
  },
  {
    q: "Does 3.3.7 ban 'confirm password' and 'confirm email' fields?",
    a: "Not automatically. A confirm-password field can fall under the security exception, and confirm-email fields are frequently justified as protecting against typos that would lock a user out of their account. That said, the accessible best practice is often to drop the confirmation field entirely and instead offer a 'show password' toggle or send a verification email — which removes the redundant typing for everyone. If you keep a confirmation field, lean on the security or essential exception and make sure it is intentional, not a habit.",
  },
  {
    q: "How is 3.3.7 different from autocomplete (1.3.5 Identify Input Purpose)?",
    a: "1.3.5 Identify Input Purpose (AA) is about tagging fields with the right autocomplete tokens so the browser and assistive tech can identify and fill common personal data — it is about a single field's metadata. 3.3.7 Redundant Entry (A) is about the flow: information the user gave you earlier in this same process must not be demanded again. You can satisfy 3.3.7 by auto-populating from the earlier step even for data the browser would never autofill (like a custom project name), and you can satisfy it without relying on browser autofill at all.",
  },
  {
    q: "Does 3.3.7 require me to store personal data or use browser autofill?",
    a: "No. 3.3.7 does not force you to persist data across sessions or to rely on the browser's autofill. It only concerns information already entered within the current process. You can meet it by carrying values forward in the page or server-side session for the duration of the flow, or by offering the earlier value as a selectable option — you do not have to save anything permanently, and you can honor it while respecting privacy.",
  },
  {
    q: "Why is redundant entry an accessibility problem, not just an annoyance?",
    a: "Re-entering data is a disproportionate barrier for people with cognitive disabilities (who may not remember the exact value), motor disabilities (for whom every keystroke is costly or painful), and people using screen readers or switch access (for whom navigating back to find and copy a value is slow and error-prone). What reads as a minor inconvenience for one user can be the difference between completing a task and abandoning it for another. Reducing redundant entry lowers errors and abandonment for everyone.",
  },
  {
    q: "Does 'available to select' satisfy 3.3.7, or must the field be auto-filled?",
    a: "Either satisfies it. The criterion is met if the information is auto-populated OR available for the user to select. A 'Same as shipping address' checkbox, a dropdown of previously entered values, or a review screen where earlier answers are pre-filled all count. You do not have to silently auto-fill everything — offering an explicit, easy way to reuse the earlier value is fully compliant and often clearer.",
  },
  {
    q: "Does 3.3.7 apply across separate visits or only within one process?",
    a: "Only within one process. The criterion scopes to 'the same process' — a single, continuous multi-step activity such as one checkout or one application. It does not require you to remember what a user typed last week or in a previous session. Once the process ends, or the earlier information is no longer valid (an expired code, a timed-out session), 3.3.7 no longer obliges you to reuse it.",
  },
]

export default function WCAG337Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          {
            name: "WCAG Success Criteria",
            url: "https://accessibility.build/wcag",
          },
          {
            name: "3.3.7 Redundant Entry",
            url: "https://accessibility.build/wcag/3-3-7",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 3.3.7 Redundant Entry: The Complete Guide to Not Making Users Re-enter Information"
        description="The definitive guide to WCAG 3.3.7 Redundant Entry: why multi-step processes must not force users to re-enter information they already provided, the three exceptions, autofill and 'same as' patterns, code examples, testing methods, and common mistakes."
        author={{
          name: "Khushwant Parihar",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-03"
        dateModified="2026-07-03"
        image="https://accessibility.build/api/og?title=WCAG%203.3.7%20Redundant%20Entry&section=WCAG"
        url="https://accessibility.build/wcag/3-3-7"
        wordCount={2800}
        keywords={[
          "WCAG 3.3.7",
          "Redundant Entry",
          "re-enter information",
          "multi-step form accessibility",
          "checkout accessibility",
          "autofill",
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
                    3.3.7 Redundant Entry
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Level A
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 3: Understandable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                New in WCAG 2.2
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.3.7: Redundant Entry
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              If a user already told you something in a process, don&apos;t make
              them{" "}
              <strong className="text-slate-900 dark:text-white">
                type it again
              </strong>
              . This Level A criterion, new in WCAG 2.2, says information a user
              previously entered in the same process must be either{" "}
              <em>auto-populated</em> or <em>available for them to select</em> —
              unless re-entry is essential, needed for security, or the earlier
              value is no longer valid. It is one of the easiest wins in the whole
              standard, and it lowers errors and abandonment for everyone.
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
              Information previously entered by or provided to the user that is
              required to be entered again in the same process is either{" "}
              <strong>auto-populated</strong> or{" "}
              <strong>available for the user to select</strong>. Except when:
              re-entering the information is <strong>essential</strong>;
              re-entering the information is required to ensure the{" "}
              <strong>security</strong> of the content; or previously entered
              information is <strong>no longer valid</strong>.
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
                  Why redundant entry matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what-counts">
                  What counts as redundant entry
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#exceptions">
                  The three exceptions
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#patterns">
                  Patterns that satisfy 3.3.7
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
              Why redundant entry matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Being asked to type the same information twice feels like a minor
              annoyance to many people. For others, it is a wall. A person with a
              cognitive or memory disability may not recall the exact value they
              entered three steps ago — the precise spelling of a street, the
              format of a reference number — and re-typing invites errors that
              can fail validation and stall the whole task. A person with a motor
              disability, using switch access or an on-screen keyboard, pays a
              real physical cost for every keystroke; re-keying a full address is
              not trivial, it is exhausting. A screen reader user must navigate
              back through earlier steps to find and re-copy a value, which is
              slow and easy to get wrong.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              3.3.7 removes that barrier by making a simple demand: if the system
              already has the information, reuse it. Carry it forward, or give the
              user a one-tap way to select it. The payoff is broad — fewer typos,
              fewer failed validations, fewer abandoned checkouts and
              applications, and a faster path for every user, not only those with
              disabilities. It sits alongside the other{" "}
              <Link
                href="/wcag/3-3-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Input Assistance criteria
              </Link>{" "}
              and, because WCAG 2.2 AA is the reference standard for the{" "}
              <Link
                href="/guides/section-504-web-accessibility-deadline"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                DOJ Title II rule
              </Link>{" "}
              and the European Accessibility Act, it is also a compliance target.
            </p>
          </section>

          {/* What counts */}
          <section aria-labelledby="what-counts" className="mb-12">
            <h2
              id="what-counts"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What counts as redundant entry
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Redundant entry is any point in a multi-step process where the user
              is required to supply information they already gave you in that same
              process. The scope is the process — one checkout, one application,
              one onboarding flow — not the user&apos;s entire history with your
              site. Here is what typically trips it:
            </p>
            <div className="space-y-4">
              {whatCounts.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {c.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {c.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Exceptions */}
          <section aria-labelledby="exceptions" className="mb-12">
            <h2
              id="exceptions"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The three exceptions
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              A step that requires re-entry still passes 3.3.7 if one of these
              applies. Use them deliberately — they are narrow, and &quot;we
              always ask twice&quot; is not one of them.
            </p>
            <div className="space-y-4">
              {exceptions.map((e, i) => (
                <div
                  key={e.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                    {i + 1}. {e.name}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 font-medium mb-2">
                    {e.summary}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {e.detail}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5">
              <p className="text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong>Watch the &quot;confirm&quot; habit:</strong> a
                confirm-email or confirm-password field is only exempt when it
                genuinely rests on the security or essential exception. Many teams
                add them out of habit. Where a &quot;show password&quot; toggle or
                a verification email would do the job, dropping the confirmation
                field removes the redundant typing for everyone and is the
                stronger design.
              </p>
            </div>
          </section>

          {/* Patterns */}
          <section aria-labelledby="patterns" className="mb-12">
            <h2
              id="patterns"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Patterns that satisfy 3.3.7
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              The criterion offers two routes: <strong>auto-populate</strong> the
              value, or make it <strong>available to select</strong>. Both are
              compliant — pick whichever is clearer for the step.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 mb-3">
                  Auto-populate
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Pre-fill a review screen with everything entered so far.</li>
                  <li>
                    Carry name, email, and address forward from an earlier step.
                  </li>
                  <li>
                    Default billing to the shipping address, editable if needed.
                  </li>
                  <li>Persist answers in session while the wizard is in progress.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300 mb-3">
                  Available to select
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>
                    A &quot;Same as shipping address&quot; checkbox that fills the
                    billing fields.
                  </li>
                  <li>A dropdown of addresses already entered in this flow.</li>
                  <li>
                    A &quot;Use the email from step 1&quot; button next to a field.
                  </li>
                  <li>
                    A saved-values chooser the user picks from instead of typing.
                  </li>
                </ul>
              </div>
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
              A &quot;same as shipping&quot; checkbox that reuses the earlier value
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The most common redundant-entry fix: give the user an explicit,
              accessible control to reuse an address they already entered, rather
              than re-typing it. The checkbox has a real label, and toggling it
              fills (and disables editing of) the billing fields.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<fieldset>
  <legend>Billing address</legend>

  <label>
    <input type="checkbox" id="same-as-shipping" checked />
    Same as shipping address
  </label>

  <label for="billing-address">Street address</label>
  <input id="billing-address" name="billingAddress"
         autocomplete="billing street-address" />
</fieldset>

<script>
  const box = document.getElementById("same-as-shipping")
  const billing = document.getElementById("billing-address")
  function sync() {
    if (box.checked) {
      billing.value = document.getElementById("shipping-address").value
      billing.readOnly = true
    } else {
      billing.readOnly = false
    }
  }
  box.addEventListener("change", sync)
  sync() // apply on load
</script>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Carrying an answer forward in a multi-step wizard
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When a later step needs a value from an earlier one, pre-fill it
              from state you already hold. The field stays editable, but the user
              is not forced to reproduce it from memory.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// React: pre-fill step 3 from data collected in step 1
function ContactStep({ formData, onChange }) {
  return (
    <>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        // auto-populated from what the user entered earlier
        value={formData.email}
        onChange={(e) => onChange("email", e.target.value)}
      />
    </>
  )
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A review step that pre-fills every earlier answer
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A confirmation screen should show what the user entered, editable in
              place — never present empty fields that ask them to type it all over
              again.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<h2>Review your details</h2>
<!-- Values are auto-populated from earlier steps -->
<dl>
  <dt>Name</dt>   <dd>Jordan Rivera</dd>
  <dt>Email</dt>  <dd>jordan@example.com</dd>
  <dt>Address</dt><dd>221B Baker Street, London</dd>
</dl>
<a href="/checkout/details">Edit these details</a>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Anti-pattern: empty fields that demand re-entry
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              This is the classic 3.3.7 failure — a later step that ignores what
              the user already provided and forces them to key it again.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- DON'T: user already entered this on step 1 -->
<h2>Almost done — re-enter your address to confirm</h2>
<label for="addr">Street address</label>
<input id="addr" name="address" value="" />
<!-- No 'same as', no pre-fill, no security or essential
     reason — this fails WCAG 3.3.7 -->`}</code>
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
                "Making users re-type their shipping address as the billing address with no 'same as' option.",
                "Presenting empty fields on a review or confirmation step instead of pre-filling what was already entered.",
                "Adding a 'confirm email' or 'confirm password' field out of habit, without a genuine security or essential justification.",
                "Losing earlier answers when a multi-step form validation error sends the user back a step.",
                "Forcing re-entry of the same reference number, order ID, or account number across pages of one process.",
                "Assuming 3.3.7 requires browser autofill — you can meet it by carrying values in session, no autofill needed.",
                "Auto-filling a value but locking it so the user cannot correct it when it is genuinely wrong.",
                "Treating a long, continuous application as separate 'processes' to dodge the requirement when it is clearly one flow.",
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
              How to test for 3.3.7
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Map the whole process step by step",
                  d: "Write down every field the user fills across the entire flow — checkout, application, onboarding. Note which pieces of information appear more than once.",
                },
                {
                  t: "Flag every repeated field",
                  d: "For each value that is requested a second time, ask: is it auto-populated, or is there a clear way to select the earlier value? If the user has to re-type it, you have a potential failure.",
                },
                {
                  t: "Check each repeat against the three exceptions",
                  d: "A required re-entry only passes if it is essential to the activity, needed for security, or the earlier value is no longer valid. 'It's just how our form works' is not an exception.",
                },
                {
                  t: "Trigger a validation error and go back",
                  d: "Force a validation error partway through and navigate back. Confirm earlier answers are preserved and not wiped — losing them is a real-world 3.3.7 failure users hit constantly.",
                },
                {
                  t: "Test the reuse controls with a keyboard and screen reader",
                  d: "Operate every 'same as' checkbox, dropdown, or 'use previous value' button with the keyboard alone, and confirm a screen reader announces its label and state. The shortcut must itself be accessible.",
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
              Redundant entry is a manual, flow-level check that automated tools
              rarely catch — but you can pair it with a scan from the{" "}
              <Link
                href="/tools/url-accessibility-auditor"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                URL Accessibility Auditor
              </Link>{" "}
              and confirm assistive-technology behavior using the{" "}
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
            <CriterionLinks number="3.3.7" />
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
            content="redundant entry re-enter information multi-step form checkout wizard autofill autocomplete same as shipping billing address auto-populate available to select cognitive accessibility WCAG 3.3.7 Level A WCAG 2.2 input assistance forms"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
