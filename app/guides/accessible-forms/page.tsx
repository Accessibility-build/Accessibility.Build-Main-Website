import type { Metadata } from "next"
import Link from "next/link"
import {
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Tag,
  AlertCircle,
  Group,
  KeyRound,
  Ear,
  Wand2,
  ListChecks,
  ShieldCheck,
  Send,
} from "lucide-react"

const pageTitle = "Accessible Forms Guide"
const pageDescription =
  "Build forms that everyone can complete. Labels, required fields, inline validation, accessible error messages, fieldset grouping, autocomplete, and multi-step patterns with full keyboard and screen reader support — mapped to WCAG 2.2 AA."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible forms",
    "form accessibility",
    "accessible form validation",
    "accessible error messages",
    "form label accessibility",
    "aria-describedby form errors",
    "wcag forms",
    "accessible required fields",
    "fieldset legend accessibility",
    "autocomplete accessibility",
    "accessible multi-step forms",
    "screen reader forms",
    "keyboard accessible forms",
    "aria-invalid",
    "error prevention wcag",
  ],
  alternates: {
    canonical: "/guides/accessible-forms",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-forms",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Accessible Forms Guide",
    url: "https://accessibility.build/guides/accessible-forms",
  },
]

const faqs = [
  {
    question: "What makes a form accessible?",
    answer:
      "An accessible form can be perceived, understood, and operated by everyone — including people using a keyboard, a screen reader, voice control, or a screen magnifier. In practice that means every control has a programmatically associated label, the required state and input format are communicated in text (not color alone), validation errors are announced and tied to the field that caused them, related controls are grouped with fieldset and legend, autocomplete tokens are set on personal-data fields, and the whole form can be completed and submitted using only the keyboard. These map directly to WCAG 2.2 success criteria such as 1.3.1, 3.3.1, 3.3.2, 3.3.3, and 4.1.2.",
  },
  {
    question: "Should I use placeholder text instead of a label?",
    answer:
      "No. A placeholder is not a substitute for a label. Placeholder text disappears as soon as the user starts typing, so it fails users with memory or cognitive disabilities, it is not reliably announced by every screen reader, and its default low-contrast gray often fails WCAG 1.4.3 contrast. Always provide a persistent, visible <label> associated with the input via the for/id relationship. Use the placeholder only for a supplementary example format (for example, MM/YYYY), never for the field name itself.",
  },
  {
    question: "How do I make form validation errors accessible?",
    answer:
      "Do four things. First, describe the error in specific text (for example, \"Enter a valid email address such as name@example.com\"), not just a red border. Second, associate the message with its field using aria-describedby so screen readers read it when the field is focused. Third, set aria-invalid=\"true\" on the failed field so assistive tech reports it as invalid. Fourth, when errors appear after submission, move focus to the first invalid field or to an error summary, and expose the summary in an ARIA live region so it is announced. This satisfies WCAG 3.3.1 Error Identification and 3.3.3 Error Suggestion.",
  },
  {
    question: "When should I use fieldset and legend?",
    answer:
      "Use <fieldset> with a <legend> whenever several controls form a single logical group that needs a shared label. The classic case is a set of radio buttons or checkboxes: the legend (\"Shipping method\") gives the group its question, and each input keeps its own label (\"Standard\", \"Express\"). Screen readers announce the legend together with each option so the choice makes sense out of context. It is also useful for grouping related fields such as a billing address block. This supports WCAG 1.3.1 Info and Relationships.",
  },
  {
    question: "What is the autocomplete attribute and why does it matter for accessibility?",
    answer:
      "The autocomplete attribute tells the browser (and assistive tech) the semantic purpose of a field — autocomplete=\"email\", \"given-name\", \"tel\", \"postal-code\", and so on. WCAG 2.2 success criterion 1.3.5 Identify Input Purpose requires these tokens on fields that collect the user's own information. They let browsers and password managers autofill accurately, help people with cognitive and motor disabilities avoid re-typing, and allow personalization tools to add familiar icons. It is a small attribute with a large usability payoff, so add it to every personal-data field.",
  },
  {
    question: "How do I make a required field accessible?",
    answer:
      "Mark it two ways so no single sense is required. Add the required attribute (or aria-required=\"true\" for custom controls) so assistive tech announces \"required\", and also indicate it visually in the label text — either the word \"(required)\" or an asterisk whose meaning you explain once at the top of the form. Never rely on color alone or on placeholder-only cues. Tell users up front which fields are mandatory, and prefer marking the few required fields rather than the many optional ones when most fields are needed.",
  },
  {
    question: "Are HTML5 native form controls better than custom ones for accessibility?",
    answer:
      "Almost always, yes. Native controls — <input>, <select>, <textarea>, <button> — come with built-in keyboard behavior, focus management, form semantics, and screen reader support that you would otherwise have to rebuild with ARIA and get exactly right. Build custom widgets (comboboxes, date pickers, custom selects) only when a genuine requirement can't be met natively, and when you do, follow the ARIA Authoring Practices patterns closely and test with real assistive technology.",
  },
]

const antiPatterns = [
  {
    bad: "Placeholder text used as the only label.",
    why: "It vanishes on input and is inconsistently announced.",
    fix: "Add a persistent visible <label> tied to the input with for/id.",
  },
  {
    bad: "Errors shown only with a red border or red text.",
    why: "Color-only cues fail colorblind users and screen readers (WCAG 1.4.1).",
    fix: "Add a text message, aria-describedby, and aria-invalid=\"true\".",
  },
  {
    bad: "A <div> or <span> styled to look like a button for submit.",
    why: "Not focusable or operable by keyboard or assistive tech.",
    fix: "Use a real <button type=\"submit\"> element.",
  },
  {
    bad: "Radio buttons or checkboxes with no shared group label.",
    why: "The question is lost when navigating option by option.",
    fix: "Wrap them in <fieldset> with a descriptive <legend>.",
  },
  {
    bad: "Validation that blocks submit with no explanation of what's wrong.",
    why: "Users cannot recover (WCAG 3.3.1, 3.3.3).",
    fix: "Identify each error in text and suggest a correction.",
  },
  {
    bad: "Auto-advancing focus between segmented inputs (e.g. OTP boxes).",
    why: "It disorients screen reader and switch users and breaks editing.",
    fix: "Use a single labeled input, or make auto-advance optional and reversible.",
  },
]

export default function AccessibleFormsGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
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
                    href="/guides"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Accessible Forms
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article>
          {/* Hero */}
          <section className="pt-12 pb-8 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                Implementation Guide &bull; Updated July 2026
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Accessible Forms: The Complete WCAG 2.2 Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Forms are where most users convert — and where accessibility
                barriers hurt most. This guide walks through labels, required
                fields, inline validation, accessible errors, grouping,
                autocomplete, and multi-step patterns, with copy-ready code that
                works for keyboards and screen readers.
              </p>
            </div>
          </section>

          {/* Why forms matter */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why Form Accessibility Matters
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Forms are the moment a website asks a user to <em>act</em> —
                  sign in, check out, book, apply, contact. When a form is
                  inaccessible, the failure is total: the user cannot complete
                  the task at all. That is why forms dominate real-world
                  accessibility complaints and are among the most frequently
                  cited barriers in ADA web lawsuits. A missing label, an
                  unannounced error, or a keyboard trap in a date picker can
                  quietly turn away a large share of your visitors.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The good news: accessible forms are largely a matter of using
                  the right native HTML and a few ARIA attributes correctly.
                  Nearly everything below is built on four{" "}
                  <Link
                    href="/wcag/3-3-1"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    WCAG 2.2
                  </Link>{" "}
                  ideas: label every control, communicate state in text, help
                  users recover from mistakes, and never require the mouse.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The WCAG 2.2 Criteria That Govern Forms
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that apply to forms, with what each
                    requires
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Criterion
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Level
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        What it requires for forms
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info &amp; Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Labels programmatically associated; groups use fieldset/legend.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.5 Identify Input Purpose
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Set autocomplete tokens on fields collecting user data.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.1 Use of Color
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Errors and required state not shown by color alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-6" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.6 Headings &amp; Labels
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Labels are descriptive and unambiguous.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.1 Error Identification
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Errors identified in text and the item is described.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.2 Labels or Instructions
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Provide labels and instructions when input is required.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.3 Error Suggestion
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Suggest how to fix an error when the fix is known.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.4 Error Prevention
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Legal/financial submissions are reversible, checked, or confirmable.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.7 Redundant Entry
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Don&apos;t make users re-enter info already provided in the process.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.8 Accessible Authentication
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">No cognitive function test (like a puzzle) required to log in.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Custom controls expose a name, role, and current value.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                3.3.7 Redundant Entry, 3.3.8 Accessible Authentication, and the
                dragging/target-size criteria are new in{" "}
                <Link
                  href="/guides/wcag-2-2-aa-requirements"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  WCAG 2.2
                </Link>{" "}
                and matter most for login and checkout forms.
              </p>
            </div>
          </section>

          {/* 1. Labels */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Tag className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Label Every Control
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every input, select, and textarea needs a programmatically
                associated label. The most robust method is an explicit{" "}
                <code>&lt;label&gt;</code> whose <code>for</code> attribute
                matches the input&apos;s <code>id</code>. This gives the field an
                accessible name <em>and</em> makes the label a click target that
                focuses the input.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- Explicit label: preferred -->
<label for="email">Email address</label>
<input type="email" id="email" name="email"
       autocomplete="email" required />

<!-- Instruction that isn't the label? Tie it with aria-describedby -->
<label for="pw">Password</label>
<input type="password" id="pw" name="pw"
       aria-describedby="pw-hint" autocomplete="current-password" />
<p id="pw-hint">Use at least 12 characters.</p>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Avoid using a placeholder as the label — it disappears on input,
                often fails contrast, and is not reliably announced. When a
                visible label is genuinely impossible (for example, a search
                field next to a labeled button), use <code>aria-label</code> or{" "}
                <code>aria-labelledby</code> so the control still has an
                accessible name under{" "}
                <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.2
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 2. Required & instructions */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Required Fields &amp; Instructions
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Communicate the required state in more than one way, and put
                instructions <em>before</em> the input they describe so users
                encounter them in time (
                <Link href="/wcag/3-3-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  3.3.2
                </Link>
                ).
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<label for="name">
  Full name <span aria-hidden="true">*</span>
  <span class="sr-only">(required)</span>
</label>
<input type="text" id="name" name="name" required
       autocomplete="name" />

<!-- Explain the asterisk once, at the top of the form -->
<p>Fields marked * are required.</p>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The native <code>required</code> attribute makes screen readers
                announce &ldquo;required,&rdquo; and the visible text (or a
                clearly explained asterisk) covers sighted users who do not use
                assistive tech. Do not signal required state with color alone —
                that fails{" "}
                <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.4.1 Use of Color
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 3. Validation & errors */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <AlertCircle className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Accessible Validation &amp; Error Messages
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Error handling is where most forms fail their users. A red
                outline means nothing to a screen reader and nothing to a
                colorblind user. Make every error do three things: describe the
                problem in specific text, tie the message to its field, and mark
                the field invalid.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<label for="email">Email address</label>
<input
  type="email"
  id="email"
  name="email"
  autocomplete="email"
  aria-describedby="email-error"
  aria-invalid="true"
/>
<p id="email-error" class="error">
  Enter a valid email address, such as name@example.com.
</p>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
                Because <code>aria-describedby</code> points at the message, a
                screen reader reads the error whenever the field gains focus.
                <code> aria-invalid=&quot;true&quot;</code> reports the field as
                invalid. Set <code>aria-invalid</code> to <code>false</code> (or
                remove it) once the field is corrected.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                On submit: focus and summarize
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When validation runs on submit, do not leave keyboard and screen
                reader users hunting for what went wrong. Render an error summary
                at the top of the form, move focus to it (or to the first
                invalid field), and let each summary item link to its field.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<div role="alert" tabindex="-1" id="error-summary">
  <h2>There are 2 problems with your submission</h2>
  <ul>
    <li><a href="#email">Enter a valid email address</a></li>
    <li><a href="#pw">Password must be at least 12 characters</a></li>
  </ul>
</div>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The <code>role=&quot;alert&quot;</code> live region announces the
                summary the moment it appears; <code>tabindex=&quot;-1&quot;</code>{" "}
                lets you move focus to it programmatically. For validation that
                happens as the user types, prefer validating on{" "}
                <code>blur</code> rather than on every keystroke, and announce
                dynamic messages through a polite live region so you do not
                interrupt typing. This satisfies{" "}
                <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  3.3.1
                </Link>{" "}
                and{" "}
                <Link href="/wcag/3-3-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  3.3.3
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 4. Grouping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Group className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. Group Related Controls
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Radio buttons, checkbox sets, and related field clusters need a
                group label so the shared question survives when a screen reader
                user navigates option by option. Use{" "}
                <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code>.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<fieldset>
  <legend>Shipping method</legend>

  <input type="radio" id="ship-standard" name="ship" value="standard" />
  <label for="ship-standard">Standard (5–7 days)</label>

  <input type="radio" id="ship-express" name="ship" value="express" />
  <label for="ship-express">Express (2 days)</label>
</fieldset>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Screen readers announce &ldquo;Shipping method, Standard, radio
                button 1 of 2&rdquo; — the option makes sense in context. For
                custom radio/checkbox widgets, replicate this with{" "}
                <code>role=&quot;radiogroup&quot;</code> and{" "}
                <code>aria-labelledby</code>. See our{" "}
                <Link
                  href="/reference/aria"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ARIA roles &amp; attributes reference
                </Link>{" "}
                for the exact patterns.
              </p>
            </div>
          </section>

          {/* 5. Autocomplete */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Wand2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Autocomplete &amp; Input Purpose
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                WCAG{" "}
                <Link href="/wcag/1-3-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.3.5 Identify Input Purpose
                </Link>{" "}
                asks you to declare what a field collects so browsers, password
                managers, and personalization tools can help. Use the right{" "}
                <code>autocomplete</code> token and the right{" "}
                <code>type</code>/<code>inputmode</code> so mobile keyboards
                match the data.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<input autocomplete="given-name"   name="fname" ... />
<input autocomplete="family-name"  name="lname" ... />
<input autocomplete="email"        type="email"  inputmode="email" ... />
<input autocomplete="tel"          type="tel"    inputmode="tel" ... />
<input autocomplete="postal-code"  name="zip"    inputmode="numeric" ... />
<input autocomplete="street-address" name="addr" ... />`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Correct autocomplete tokens dramatically reduce typing for people
                with motor and cognitive disabilities and cut form-abandonment
                for everyone.
              </p>
            </div>
          </section>

          {/* 6. Keyboard & screen reader */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                      <KeyRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">Keyboard Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>Every control reachable and operable with Tab, arrows, Space, and Enter.</li>
                      <li>Logical focus order that follows the visual layout.</li>
                      <li>A visible focus indicator on every field and button.</li>
                      <li>No keyboard traps in custom date pickers or comboboxes.</li>
                      <li>Enter submits from a text input as users expect.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      Full detail in the{" "}
                      <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                        keyboard accessibility guide
                      </Link>
                      .
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                      <Ear className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">Screen Reader Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>Each field announces its label, type, and required state.</li>
                      <li>Errors announced and reachable via <code>aria-describedby</code>.</li>
                      <li>Groups announce their <code>legend</code> or group label.</li>
                      <li>Dynamic messages exposed through ARIA live regions.</li>
                      <li>Submit success and failure both announced.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      Test with real AT — see the{" "}
                      <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                        screen reader testing guide
                      </Link>
                      .
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* 7. Multi-step */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Send className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. Multi-Step Forms &amp; Error Prevention
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Long forms — checkout, applications, onboarding — benefit from
                being split into steps, but each step must remain accessible:
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Announce step changes.</strong>{" "}
                  Move focus to the new step&apos;s heading and expose progress
                  (&ldquo;Step 2 of 4&rdquo;) in text, not color alone.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Don&apos;t make users re-enter data.</strong>{" "}
                  Carry values forward; WCAG 2.2&apos;s{" "}
                  <Link href="/wcag/3-3-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.3.7 Redundant Entry
                  </Link>{" "}
                  requires it.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Make submissions recoverable.</strong>{" "}
                  For legal, financial, or data-deleting actions, provide review,
                  confirm, or undo (
                  <Link href="/wcag/3-3-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.3.4 Error Prevention
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Keep authentication accessible.</strong>{" "}
                  Don&apos;t force cognitive puzzles to log in; support paste and
                  password managers (
                  <Link href="/wcag/3-3-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.3.8
                  </Link>
                  ).
                </li>
              </ul>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common form accessibility anti-patterns, why they fail, and
                    the fix
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Anti-pattern</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Why it fails</th>
                      <th scope="col" className="px-4 py-3 font-semibold">The fix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {antiPatterns.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          {row.bad}
                        </th>
                        <td className="px-4 py-3 align-top">{row.why}</td>
                        <td className="px-4 py-3 align-top">{row.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Testing checklist */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                How to Test Your Form
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Keyboard pass.</strong>{" "}
                  Unplug the mouse. Tab through the whole form, operate every
                  control, trigger and dismiss validation, and submit — all
                  without a trap.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Screen reader pass.</strong>{" "}
                  With NVDA, VoiceOver, or JAWS, confirm each field announces its
                  label, required state, and any error.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Automated scan.</strong>{" "}
                  Run the page through our{" "}
                  <Link href="/tools/url-accessibility-auditor" className="text-blue-600 dark:text-blue-400 hover:underline">
                    URL accessibility auditor
                  </Link>{" "}
                  to catch missing labels and low contrast.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Zoom &amp; reflow.</strong>{" "}
                  At 200% zoom and 320px width, confirm nothing is clipped and
                  labels stay attached to fields.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Error recovery.</strong>{" "}
                  Submit an invalid form and confirm errors are announced,
                  focusable, and specific.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Pair this with the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                and the{" "}
                <Link href="/guides/how-to-audit-website-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  website audit guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Form in Seconds
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Run any page with a form through our free axe-core-powered
                  auditor to catch missing labels, unlabeled controls, and
                  contrast failures — then work through the manual checks above.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/reference/aria">Open the ARIA Reference</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((item, i) => (
                  <details key={i} className="group border rounded-lg p-4 bg-card">
                    <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
                      {item.question}
                      <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">
                        &#9662;
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Related Content */}
          <section className="pb-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <RelatedContent
                content="accessible forms labels validation error messages aria-describedby fieldset legend autocomplete keyboard screen reader wcag 3.3.1 3.3.2"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
