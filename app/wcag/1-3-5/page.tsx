import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 1.3.5 Identify Input Purpose — Autocomplete",
  description:
    "WCAG 1.3.5 Identify Input Purpose explained: user-data fields need programmatic purpose via HTML autocomplete tokens. Token list, code examples, testing.",
  keywords: [
    "WCAG 1.3.5",
    "Identify Input Purpose",
    "autocomplete attribute",
    "input purposes",
    "autofill accessibility",
    "form field purpose",
    "cognitive accessibility forms",
    "1.3.5 test",
    "Level AA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/1-3-5",
  },
  openGraph: {
    type: "website",
    title: "WCAG 1.3.5 Identify Input Purpose — Autocomplete",
    description:
      "Fields collecting information about the user must expose their purpose programmatically — in practice, HTML autocomplete tokens. Scope, code examples, testing.",
    url: "/wcag/1-3-5",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%201.3.5%20Identify%20Input%20Purpose&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.3.5 Identify Input Purpose guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.3.5 Identify Input Purpose — Autocomplete",
    description:
      "Fields collecting information about the user must expose their purpose programmatically — in practice, HTML autocomplete tokens. Scope, code examples, testing.",
    images: [
      "/api/og?title=WCAG%201.3.5%20Identify%20Input%20Purpose&section=WCAG",
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 1.3.5 Identify Input Purpose require?",
    a: "It requires that the purpose of each input field collecting information about the user can be programmatically determined — but only when two conditions hold: the field serves a purpose identified in WCAG's 'Input Purposes for User Interface Components' list (53 purposes such as name, email, tel, street-address, bday, cc-number), and the technology supports identifying the expected meaning of form input (in HTML, the autocomplete attribute does exactly this). In practice: put the correct autocomplete token on every field that asks for the user's own listed information. Introduced in WCAG 2.1 at Level AA, unchanged in 2.2.",
  },
  {
    q: "Which fields are in scope for 1.3.5?",
    a: "Only fields collecting information about the user filling in the form, and only when the data type appears in WCAG's fixed list of 53 input purposes. Your email, your name, your phone, your shipping address, your card number: in scope. A field asking for someone else's details — a gift recipient's address, an emergency contact's phone — is not information about the user, so it is out of scope. Likewise fields whose purpose is not on the list at all (a search query, a product review, a coupon code) are out of scope, no matter who they concern.",
  },
  {
    q: "Why does 1.3.5 matter — isn't a visible label enough?",
    a: "Labels serve people who can read and interpret them. 1.3.5 serves people for whom machine-readable purpose unlocks help: browsers autofill the field so users with memory or dexterity limitations don't have to recall and retype their address or card number, password managers and assistive tools can act on the field's meaning, and specialized tools can render familiar icons next to fields (a phone symbol on every telephone field) for people with cognitive disabilities or aphasia who recognize symbols more easily than words. The visible label is for humans; the token is for software helping humans.",
  },
  {
    q: "Does autocomplete=\"off\" fail 1.3.5?",
    a: "On an in-scope field, yes — autocomplete=\"off\" (or a missing/incorrect token) means the field's purpose is not programmatically determined, and it also suppresses the autofill that users with cognitive and motor disabilities rely on. Teams often disable autofill on login or payment forms citing security, but browsers largely ignore autocomplete=\"off\" for saved credentials anyway, and WCAG provides no security exception. If a field asks for the user's own listed data, give it the correct token.",
  },
  {
    q: "What's the difference between 1.3.5 and 1.3.6 Identify Purpose?",
    a: "1.3.5 (Level AA) covers input fields collecting user information and is satisfied with autocomplete tokens. 1.3.6 Identify Purpose (Level AAA, also new in 2.1) is much broader: in content implemented with markup, the purpose of user interface components, icons, and regions must be programmatically determinable — enabling personalization tools to swap symbols and hide non-essential content across the whole page. AA conformance requires only 1.3.5.",
  },
  {
    q: "Do autocomplete tokens affect the accessible name or how screen readers announce a field?",
    a: "No — the token identifies purpose to software; it does not label the field. The accessible name still comes from the <label>, aria-label, or equivalent (covered by 3.3.2, 2.4.6, and 4.1.2). A field can pass 1.3.5 with a perfect token and still fail labeling criteria, or vice versa. Treat them as separate layers: human-readable label, machine-readable purpose — in-scope fields need both.",
  },
]

const passFailExamples = [
  {
    verdict: "pass" as const,
    t: "Checkout with full autocomplete tokens",
    d: "Name, email, phone, address, and card fields each carry the matching token (name, email, tel, street-address, postal-code, cc-number, cc-exp). The browser offers to fill everything, and tools can identify every field's meaning.",
  },
  {
    verdict: "pass" as const,
    t: "Shipping vs billing distinguished with modifiers",
    d: "The form uses autocomplete=\"shipping street-address\" and autocomplete=\"billing street-address\", so both the purpose and which address it is are programmatically clear.",
  },
  {
    verdict: "pass" as const,
    t: "Search box without a token",
    d: "A site search field has no autocomplete token. A search query is not information about the user and is not among the 53 listed purposes, so 1.3.5 simply does not apply to it.",
  },
  {
    verdict: "fail" as const,
    t: "Registration form with no tokens",
    d: "A sign-up form asks for the user's name, email, and phone using plain <input type=\"text\"> fields with no autocomplete attributes. All three purposes are on the list; none is programmatically determined.",
  },
  {
    verdict: "fail" as const,
    t: "autocomplete=\"off\" on the user's own data",
    d: "An account-profile form sets autocomplete=\"off\" on the user's address and birth date 'to keep data clean'. The purposes are listed and about the user, so suppressing them fails the criterion.",
  },
]

export default function WCAG135Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.3.5: Identify Input Purpose"
        description="The purpose of input fields can be programmatically determined."
        criteria="1.3.5"
        level="AA"
        principle="Perceivable"
        guideline="1.3 Adaptable"
        url="https://accessibility.build/wcag/1-3-5"
        category="Adaptable"
        relatedCriteria={["1.3.1", "1.3.4", "3.3.2"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="1.3.5 Identify Input Purpose" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Level AA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 1: Perceivable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                New in WCAG 2.1
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.3.5: Identify Input Purpose
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Your label tells a human what a field wants; this criterion makes
              the field tell <em>software</em>.{" "}
              <strong className="text-slate-900 dark:text-white">
                Fields that collect information about the user must expose
                their purpose programmatically
              </strong>{" "}
              — which on the web means the HTML{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-lg">
                autocomplete
              </code>{" "}
              attribute. One token per field, and browsers can autofill,
              password managers can help, and assistive tools can show familiar
              icons instead of unfamiliar words.
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
              The purpose of each input field collecting information about the
              user can be programmatically determined when: the input field
              serves a purpose identified in the Input Purposes for User
              Interface Components section; and the content is implemented
              using technologies with support for identifying the expected
              meaning for form input data.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Both conditions gate the requirement. The field must (a) collect
              information <em>about the user</em> and (b) match one of the{" "}
              <strong>53 input purposes</strong> WCAG enumerates — the same
              vocabulary as HTML&rsquo;s autofill tokens. HTML supports
              identifying input meaning via{" "}
              <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                autocomplete
              </code>
              , so for HTML forms the criterion is squarely in effect.
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
                <a className="hover:underline" href="#who">
                  Who this helps
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#requirement">
                  Scope: which fields and which purposes
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

          {/* Who this helps */}
          <section aria-labelledby="who" className="mb-12">
            <h2
              id="who"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Who this helps
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "People with memory and cognitive disabilities",
                  d: "Recalling and typing an address, a phone number, or a card number is a genuine barrier. With correct tokens the browser fills it once and forever — the form stops depending on recall.",
                },
                {
                  t: "People with language impairments or aphasia",
                  d: "Personalization tools can read the token and add a familiar icon — a phone symbol, an envelope, a house — beside each field. Symbols the user already knows replace labels they may struggle to decode.",
                },
                {
                  t: "People with motor disabilities",
                  d: "Every autofilled field is dozens of keystrokes or switch activations saved. For someone typing with a head pointer or an on-screen keyboard, autofill turns a ten-minute form into seconds.",
                },
                {
                  t: "Everyone on a phone at checkout",
                  d: "Correct tokens are also just good commerce: browsers fill entire address and payment forms in one tap, cutting errors and abandonment. The accessible markup and the conversion optimization are the same attribute.",
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
          </section>

          {/* Requirement / scope */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Scope: which fields and which purposes
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              A field is in scope only when it collects information{" "}
              <strong className="text-slate-900 dark:text-white">
                about the user
              </strong>{" "}
              filling in the form <em>and</em> its purpose appears in
              WCAG&rsquo;s fixed list of 53 input purposes. The most common
              tokens by group:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  t: "Identity",
                  d: "name, given-name, family-name, honorific-prefix, nickname, username, new-password, current-password, bday, sex, organization, organization-title, photo, language",
                },
                {
                  t: "Contact",
                  d: "email, tel (plus tel-national, tel-local and other parts), url, impp",
                },
                {
                  t: "Address",
                  d: "street-address, address-line1/2/3, address-level1 (state), address-level2 (city), postal-code, country, country-name",
                },
                {
                  t: "Payment & transaction",
                  d: "cc-name, cc-number, cc-exp, cc-exp-month, cc-exp-year, cc-csc, cc-type, transaction-currency, transaction-amount",
                },
              ].map((item) => (
                <div
                  key={item.t}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {item.t}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-mono">
                    {item.d}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Out of scope, and therefore requiring no token: fields about{" "}
              <em>other people</em> (a gift recipient&rsquo;s address, an
              emergency contact), and fields whose purpose is not on the list
              (search queries, comments, quantities, coupon codes). The list is
              closed — you cannot invent tokens, and you should not force a
              wrong token onto an unlisted field.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Tokens compose with modifiers:{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                shipping
              </code>{" "}
              /{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                billing
              </code>{" "}
              prefixes distinguish address groups, and{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                section-*
              </code>{" "}
              names separate repeated blocks (e.g. two travelers on one
              booking). This layer is about machine-readable{" "}
              <em>purpose</em> — the human-readable label is still governed by{" "}
              <Link
                href="/wcag/3-3-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                3.3.2 Labels or Instructions
              </Link>{" "}
              and{" "}
              <Link
                href="/wcag/2-4-6"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.6 Headings and Labels
              </Link>
              .
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
            <ul className="space-y-3">
              {passFailExamples.map((ex) => (
                <li
                  key={ex.t}
                  className={
                    ex.verdict === "pass"
                      ? "flex gap-3 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-4"
                      : "flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                  }
                >
                  <span
                    aria-hidden="true"
                    className={
                      ex.verdict === "pass"
                        ? "text-emerald-600 font-bold"
                        : "text-rose-500 font-bold"
                    }
                  >
                    {ex.verdict === "pass" ? "✓" : "✗"}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">
                      {ex.verdict === "pass" ? "Pass — " : "Fail — "}
                      {ex.t}.
                    </strong>{" "}
                    {ex.d}
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
              A registration form, before and after
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The type attribute and a good label are not enough — the{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                autocomplete
              </code>{" "}
              token is what makes the purpose programmatic.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Failing: purposes on the list, none programmatically identified -->
<label for="n">Full name</label>
<input id="n" type="text" />
<label for="e">Email</label>
<input id="e" type="email" autocomplete="off" />
<label for="p">Phone</label>
<input id="p" type="text" />

<!-- ✓ Passing: one correct token per field -->
<label for="name">Full name</label>
<input id="name" type="text" autocomplete="name" />
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email" />
<label for="tel">Phone</label>
<input id="tel" type="tel" autocomplete="tel" />
<label for="bday">Date of birth</label>
<input id="bday" type="date" autocomplete="bday" />`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Shipping, billing, and payment at checkout
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Modifier prefixes tell software <em>which</em> address each field
              belongs to; the cc-* family covers the payment card.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<fieldset>
  <legend>Shipping address</legend>
  <input autocomplete="shipping street-address" ... />
  <input autocomplete="shipping address-level2" ... />  <!-- city -->
  <input autocomplete="shipping postal-code" ... />
  <select autocomplete="shipping country">…</select>
</fieldset>

<fieldset>
  <legend>Billing address</legend>
  <input autocomplete="billing street-address" ... />
  <input autocomplete="billing postal-code" ... />
</fieldset>

<fieldset>
  <legend>Payment</legend>
  <input autocomplete="cc-name" ... />
  <input autocomplete="cc-number" inputmode="numeric" ... />
  <input autocomplete="cc-exp" placeholder="MM/YY" ... />
  <input autocomplete="cc-csc" inputmode="numeric" ... />
</fieldset>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Repeated groups with section-*
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When one form collects the same user-related purposes more than
              once, name each block so autofill does not smear one
              person&rsquo;s data across both.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<h2>Your details</h2>
<input autocomplete="section-primary name" ... />
<input autocomplete="section-primary email" ... />

<h2>Frequent flyer account holder (you, on a second program)</h2>
<input autocomplete="section-loyalty name" ... />
<input autocomplete="section-loyalty email" ... />

<!-- Note: a field about someone ELSE (gift recipient, emergency
     contact) is out of scope for 1.3.5 — no token is required. -->`}</code>
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
                "No autocomplete attributes at all on registration, checkout, or profile forms that collect the user's own listed data.",
                "autocomplete=\"off\" on in-scope fields 'for security' or 'data quality' — it removes the programmatic purpose and the autofill help.",
                "Wrong tokens: autocomplete=\"name\" on an email field, or made-up values like autocomplete=\"phone\" (the token is tel) that browsers ignore.",
                "Relying on type=\"email\" or type=\"tel\" alone — input types hint at format, but the WCAG-listed purpose is conveyed by the autocomplete token.",
                "Custom JavaScript form controls that render as <div>s with no underlying input capable of carrying an autocomplete attribute.",
                "Shipping and billing addresses with identical bare tokens, so software cannot tell which street-address is which (use the shipping/billing modifiers).",
                "Breaking autofill with per-field masking scripts that clear or reformat programmatically filled values, defeating the purpose the token declared.",
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
              How to test for 1.3.5
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "List every field that asks about the user",
                  d: "Walk each form and mark the fields collecting the user's own information. For each, check WCAG's input-purposes list (it mirrors the HTML autofill tokens). On the list → in scope; about someone else or unlisted → out of scope.",
                },
                {
                  t: "Inspect the markup for correct tokens",
                  d: "In DevTools, verify each in-scope field carries the correct autocomplete token — not a misspelling, not a near-miss (phone vs tel), not autocomplete=\"off\". Check that modifiers (shipping/billing, section-*) are used where groups repeat.",
                },
                {
                  t: "Run automated checks",
                  d: "axe DevTools and Lighthouse include an autocomplete-valid rule that flags malformed or inappropriate tokens. Automated tools catch invalid values well; they cannot decide scope (is this field about the user?), so keep step 1 human.",
                },
                {
                  t: "Test real autofill behavior",
                  d: "With a browser profile that has a saved address and card, open the form and trigger autofill. Every in-scope field should be offered the right data, and the filled values should survive your validation and masking scripts.",
                },
                {
                  t: "Confirm labels are still doing their own job",
                  d: "Tokens don't label. Tab through with a screen reader and confirm each field still announces a descriptive name — 1.3.5 works alongside 3.3.2 and 2.4.6, not instead of them.",
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
              This is one of the most mechanical AA criteria to fix — usually
              one attribute per field. Sweep your forms, then continue through
              the{" "}
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

          <CriterionLinks number="1.3.5" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="identify input purpose autocomplete attribute autofill tokens input purposes form fields user information shipping billing section cc-number cognitive accessibility personalization WCAG 1.3.5 Level AA adaptable"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
