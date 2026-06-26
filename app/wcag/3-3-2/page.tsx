import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title:
    "WCAG 3.3.2 Labels or Instructions — Accessible Form Labels Guide (Level A)",
  description:
    "Complete guide to WCAG 3.3.2 Labels or Instructions. Learn how to label every form field, the four ways to associate a label, why placeholders are not labels, required-field and format hints, code examples, testing methods, and common mistakes.",
  keywords: [
    "WCAG 3.3.2",
    "Labels or Instructions",
    "form labels accessibility",
    "accessible forms",
    "label association",
    "form field label",
    "missing form label",
    "placeholder not a label",
    "required field accessibility",
    "aria-label form",
    "Level A",
    "WCAG 2.2",
    "input label",
    "fieldset legend",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/3-3-2",
  },
  openGraph: {
    title:
      "WCAG 3.3.2 Labels or Instructions — Accessible Form Labels Guide (Level A)",
    description:
      "The definitive guide to WCAG 3.3.2 Labels or Instructions: how to label every form control, the four association methods, the placeholder trap, required and format hints, copy-ready code, and testing.",
    url: "https://accessibility.build/wcag/3-3-2",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "WCAG 3.3.2 Labels or Instructions guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.3.2 Labels or Instructions — Accessible Form Labels",
    description:
      "Label every form field the right way: the four association methods, why placeholders fail, required and format hints, and how to test for WCAG 3.3.2 Level A.",
  },
}

const methods = [
  {
    name: "Wrap the control in a <label>",
    summary: "Implicit association — no id needed.",
    detail:
      "Put the input inside the label element. The browser links them automatically, so you do not need a matching id and for attribute. This is the most resilient method because there is nothing to keep in sync, but it offers less layout flexibility because the label and control share one element.",
  },
  {
    name: "Connect <label for> to an id",
    summary: "Explicit association — the most common and flexible.",
    detail:
      "Give the input an id and point the label's for attribute at it. Clicking the label focuses (or toggles) the control, and screen readers announce the label when the field receives focus. This is the workhorse pattern: it works with any layout and is supported everywhere.",
  },
  {
    name: "aria-labelledby pointing at visible text",
    summary: "Reuse on-screen text as the accessible name.",
    detail:
      "When the visible label is some other element — a heading, a table cell, a span — reference its id with aria-labelledby. You can list several ids and they are concatenated in order. Prefer this over aria-label because the name stays visible and is covered by translation and copy edits.",
  },
  {
    name: "aria-label as a last resort",
    summary: "An invisible name when no visible text exists.",
    detail:
      "aria-label supplies an accessible name directly in markup with no visible counterpart. Use it only when a visible label genuinely is not possible — for example, a search field whose purpose is obvious from a magnifying-glass icon. Because it is invisible, sighted users get no benefit and it is easy for it to drift out of date or escape translation.",
  },
]

const faqs = [
  {
    q: "What does WCAG 3.3.2 Labels or Instructions require?",
    a: "WCAG 3.3.2 requires that labels or instructions are provided when content requires user input. In practice this means every form control — text inputs, selects, checkboxes, radio buttons, file pickers, and so on — must have a label that describes what to enter, and any non-obvious requirements (a date format, a password rule, which fields are required) must be communicated as instructions. It is a Level A success criterion, the lowest and most essential conformance level.",
  },
  {
    q: "Is a placeholder the same as a label?",
    a: "No. A placeholder is not a label and does not satisfy 3.3.2 on its own. Placeholder text disappears the moment a user starts typing, so it cannot serve as a persistent label; it is not reliably exposed to all assistive technology as the accessible name; and its low-contrast styling commonly fails 1.4.3 Contrast (Minimum). Use a real, persistent visible label and reserve the placeholder for an optional example of the expected input.",
  },
  {
    q: "Do labels have to be visible, or is aria-label enough?",
    a: "WCAG 3.3.2 at Level A is satisfied by a programmatically associated label even if it is provided only with aria-label, but a visible label is strongly preferred and is what most teams should ship. Visible labels help sighted users — including people with cognitive disabilities — and a separate criterion, 2.4.6 Headings and Labels (also AA), expects labels to be descriptive. Reserve invisible aria-label names for the rare cases where a visible label truly is not feasible.",
  },
  {
    q: "How do I mark required fields accessibly?",
    a: "State the requirement in a way that is both visible and programmatic. Add the word 'required' or a legend explaining the asterisk to the visible label, and expose the state to assistive technology with the HTML required attribute (or aria-required=\"true\" on custom controls). Do not rely on a red asterisk or color alone — that fails users who cannot perceive the color and is not announced unless the asterisk's meaning is in the accessible name or an associated instruction.",
  },
  {
    q: "How is 3.3.2 different from 1.3.1, 4.1.2, and 3.3.1?",
    a: "They overlap but test different things. 3.3.2 Labels or Instructions is about whether a label or instruction is present and understandable for input. 1.3.1 Info and Relationships is about whether that label is programmatically associated with its control. 4.1.2 Name, Role, Value is about whether the control exposes a correct accessible name and role to assistive tech. 3.3.1 Error Identification covers what happens after a mistake. A missing form label often triggers failures under several of these at once.",
  },
  {
    q: "How do I label a group of radio buttons or checkboxes?",
    a: "Wrap the group in a fieldset and give it a legend that asks the overall question (for example, 'Shipping method'). Each individual radio or checkbox still needs its own label. The legend provides the group-level context that screen readers announce alongside each option, so a user hears 'Shipping method, Standard, radio button' rather than just 'Standard'.",
  },
]

export default function WCAG332Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "3.3.2 Labels or Instructions",
            url: "https://accessibility.build/wcag/3-3-2",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 3.3.2 Labels or Instructions: The Complete Accessible Form Labels Guide"
        description="The definitive guide to WCAG 3.3.2 Labels or Instructions: how to label every form control, the four association methods, the placeholder trap, required and format hints, code examples, testing methods, and common mistakes."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-06-25"
        dateModified="2026-06-25"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/wcag/3-3-2"
        wordCount={2700}
        keywords={[
          "WCAG 3.3.2",
          "Labels or Instructions",
          "form labels accessibility",
          "accessible forms",
          "placeholder not a label",
          "Level A",
          "required field accessibility",
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
                    3.3.2 Labels or Instructions
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
                Top-5 WebAIM Million failure
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.3.2: Labels or Instructions
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Whenever content requires user input, provide{" "}
              <strong className="text-slate-900 dark:text-white">
                labels or instructions
              </strong>{" "}
              so people know what to enter and how. This Level A criterion is the
              foundation of accessible forms — a missing or unclear form label is
              one of the most common accessibility failures on the web, and it
              blocks screen reader users, voice-control users, and anyone who needs
              extra guidance from completing a task.
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
              Labels or instructions are provided when content requires user input.
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
                  Why labels and instructions matter
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what">
                  What 3.3.2 actually requires
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#methods">
                  Four ways to label a control
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#placeholder">
                  Why a placeholder is not a label
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
              Why labels and instructions matter
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              A form field with no label is a blank box. A sighted user can often
              guess its purpose from surrounding layout, but a screen reader user
              hears only &ldquo;edit text, blank&rdquo; — no clue whether to type a
              name, an email, or a phone number. Voice-control users cannot say
              &ldquo;click&rdquo; the field by name because it has no name. People
              with cognitive disabilities lose the persistent reminder of what each
              field is for. The result is abandoned checkouts, failed sign-ups, and
              forms that simply cannot be completed.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              This is not a rare edge case. Missing form input labels is one of the
              most frequently detected failures across the web — the annual WebAIM
              Million analysis consistently ranks unlabeled form controls among the
              top accessibility errors on home pages. Because labels are
              foundational and the fix is well understood, 3.3.2 is one of the
              highest-impact, lowest-effort criteria to get right.
            </p>
          </section>

          {/* What */}
          <section aria-labelledby="what" className="mb-12">
            <h2
              id="what"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What 3.3.2 actually requires
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The criterion has two parts — a <strong>label</strong> and, where
              needed, <strong>instructions</strong>:
            </p>
            <ul className="space-y-4 mb-6">
              <li className="flex gap-3">
                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-bold flex items-center justify-center">
                  1
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Every control that takes input has a label.
                  </strong>{" "}
                  Text fields, textareas, selects, checkboxes, radio buttons,
                  file inputs, sliders, and switches all need a label that
                  describes what they are for. The label should be present before
                  the user interacts and should stay visible.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-bold flex items-center justify-center">
                  2
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Non-obvious requirements are explained.
                  </strong>{" "}
                  If a field has a required format (a date as DD/MM/YYYY), a
                  constraint (password must be 12+ characters), or a required/optional
                  status, that information must be available <em>before</em> the
                  user submits — not only afterward as an error message.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-bold flex items-center justify-center">
                  3
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Instructions are positioned where they help.
                  </strong>{" "}
                  Guidance should appear near or before the control it describes and
                  be programmatically connected with{" "}
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                    aria-describedby
                  </code>{" "}
                  so assistive technology announces it with the field.
                </p>
              </li>
            </ul>
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-5">
              <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <strong>Note:</strong> 3.3.2 only asks that a label or instruction
                is <em>present</em>. Whether that label is <em>programmatically
                associated</em> with the control is governed by{" "}
                <Link
                  href="/wcag/1-3-1"
                  className="underline font-medium"
                >
                  1.3.1 Info and Relationships
                </Link>
                , and whether the control exposes a correct accessible name and role
                is governed by{" "}
                <Link href="/wcag/4-1-2" className="underline font-medium">
                  4.1.2 Name, Role, Value
                </Link>
                . A well-built form satisfies all three at once.
              </p>
            </div>
          </section>

          {/* Methods */}
          <section aria-labelledby="methods" className="mb-12">
            <h2
              id="methods"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Four ways to label a control
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              There are four reliable techniques, listed roughly in order of
              preference. The first two use a real, visible{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                &lt;label&gt;
              </code>{" "}
              and should be your default; the ARIA methods exist for the cases the
              native element cannot cover.
            </p>
            <div className="space-y-4">
              {methods.map((m, i) => (
                <div
                  key={m.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                    {i + 1}. {m.name}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 font-medium mb-2">
                    {m.summary}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {m.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Placeholder */}
          <section aria-labelledby="placeholder" className="mb-12">
            <h2
              id="placeholder"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Why a placeholder is not a label
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The single most common 3.3.2 mistake is using placeholder text in
              place of a label to save vertical space. It breaks in four ways:
            </p>
            <ul className="space-y-3 mb-2">
              {[
                "It vanishes on input. The moment the user types a character, the placeholder disappears — so the reminder of what the field is for is gone exactly when it is needed, which is especially hard for people with memory and attention disabilities.",
                "It is unreliable as an accessible name. Browser and screen reader support for treating placeholder as the accessible name is inconsistent, so some users get no name at all.",
                "It usually fails contrast. Default placeholder styling is light gray and commonly falls below the 4.5:1 ratio required by 1.4.3 Contrast (Minimum).",
                "It looks like a pre-filled value. Users frequently mistake placeholder text for an already-entered answer and skip the field.",
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
              Keep a persistent visible label and, if it adds value, use the
              placeholder for a short example of the expected format (for example,{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                name@example.com
              </code>
              ) — never as the only label.
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
              The default: a visible label tied to the input
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              An explicit{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                for
              </code>
              /
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                id
              </code>{" "}
              pairing works in every layout and makes the label clickable.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- Explicit association: label[for] -> input[id] -->
<label for="email">Email address</label>
<input type="email" id="email" name="email" autocomplete="email" />

<!-- Implicit association: input nested in label, no id needed -->
<label>
  Email address
  <input type="email" name="email" autocomplete="email" />
</label>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Add instructions with aria-describedby
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Format hints, required status, and constraints belong in a hint
              element that is announced together with the field.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<label for="pwd">Password (required)</label>
<input
  type="password"
  id="pwd"
  name="password"
  required
  aria-describedby="pwd-hint"
/>
<p id="pwd-hint">Use at least 12 characters, including a number and a symbol.</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Group related controls with fieldset and legend
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A set of radio buttons or checkboxes needs a group label as well as a
              label on each option.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<fieldset>
  <legend>Shipping method</legend>

  <label>
    <input type="radio" name="ship" value="standard" />
    Standard (3–5 business days)
  </label>

  <label>
    <input type="radio" name="ship" value="express" />
    Express (next business day)
  </label>
</fieldset>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Accessible React field with label and hint
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A reusable field that always renders a visible label, wires up the
              hint, and exposes required state to assistive technology.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function Field({ id, label, hint, required, ...props }) {
  const hintId = hint ? \`\${id}-hint\` : undefined
  return (
    <div>
      <label htmlFor={id}>
        {label}{required && <span aria-hidden="true"> *</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      <input
        id={id}
        required={required}
        aria-describedby={hintId}
        {...props}
      />
      {hint && <p id={hintId}>{hint}</p>}
    </div>
  )
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              An icon-only control that needs an invisible name
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When a visible label genuinely is not feasible — a compact search box
              marked only by an icon — supply the name with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-label
              </code>
              .
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<input
  type="search"
  name="q"
  aria-label="Search articles"
  placeholder="Search…"
/>`}</code>
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
                "Using a placeholder as the only label. It disappears on input, often fails contrast, and is not reliably exposed as the accessible name.",
                "A visible label that is not associated with its control — sitting next to the input with no for/id link, so screen readers never announce it.",
                "Mismatched for and id values (a typo, or an id reused on the page) that silently break the association even though the markup looks right.",
                "Marking required fields with a red asterisk or color alone, with no text equivalent and no required / aria-required attribute.",
                "Putting format instructions only in an error message that appears after submission, instead of before the user fills the field.",
                "Radio or checkbox groups with no fieldset and legend, so each option is announced without the question it answers.",
                "Relying on a nearby heading or table position for meaning without connecting it to the field with aria-labelledby or aria-describedby.",
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
              How to test for 3.3.2
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Click each visible label",
                  d: "Clicking a properly associated text-input label should move focus into the field; clicking a checkbox or radio label should toggle it. If nothing happens, the label is not associated.",
                },
                {
                  t: "Tab through with a screen reader",
                  d: "Using NVDA, JAWS, or VoiceOver, tab to every control and confirm a clear name is announced — not 'edit text, blank'. Listen for required state and any hint text too.",
                },
                {
                  t: "Inspect the accessible name",
                  d: "In browser DevTools, check the Accessibility pane for each control's computed name and description. Confirm the name comes from a real label, not a placeholder.",
                },
                {
                  t: "Run automated checks",
                  d: "axe DevTools, Lighthouse, and WAVE flag missing and empty form labels reliably — this is one failure automation catches well. Treat a clean automated pass as the floor, not the finish line.",
                },
                {
                  t: "Check instructions and required hints",
                  d: "Verify that format requirements and required status are visible before submission and are connected with aria-describedby so they are announced with the field.",
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
              and learn the manual steps in the{" "}
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
                    href="/wcag/1-3-1"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    1.3.1 Info and Relationships
                  </Link>{" "}
                  — A
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Requires that the label–control relationship is programmatically
                  determinable. 3.3.2 says a label exists; 1.3.1 says it is wired
                  up correctly.
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
                  Governs whether each control exposes a correct accessible name and
                  role to assistive technology — the engine that turns a label into
                  a spoken field name.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/3-3-1"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    3.3.1 Error Identification
                  </Link>{" "}
                  — A
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  The sibling forms criterion: when input is rejected, the error
                  must be identified in text. Clear labels up front reduce errors;
                  3.3.1 handles them when they happen.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  2.4.6 Headings and Labels — AA
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Raises the bar at Level AA: labels must not only exist but also be
                  descriptive enough to convey the field&apos;s topic or purpose.
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
            content="labels or instructions form labels accessible forms input label placeholder not a label required field fieldset legend aria-label aria-describedby WCAG 3.3.2 Level A form accessibility screen reader"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
