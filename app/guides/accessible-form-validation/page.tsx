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
  ShieldAlert,
  Clock,
  ShieldCheck,
  ListChecks,
  Link2,
  Megaphone,
  Lightbulb,
  Repeat,
  KeyRound,
  Code2,
  AlertTriangle,
  Sparkles,
} from "lucide-react"

const pageTitle =
  "Accessible Form Validation & Error Handling Guide (WCAG 3.3.x)"
const pageDescription =
  "Handle form errors so everyone can recover: when to validate (submit vs blur vs input), tying an error to its field with aria-invalid and aria-describedby, the error-summary pattern with focus management, announcing inline errors through live regions without the double-announcement trap, error suggestion and prevention, WCAG 2.2's Redundant Entry and Accessible Authentication, and React — with copy-ready code mapped to WCAG 3.3.1 through 3.3.9."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible form validation",
    "accessible error messages",
    "form error accessibility",
    "aria-invalid",
    "aria-describedby",
    "error summary pattern",
    "aria-errormessage",
    "form validation accessibility",
    "wcag 3.3.1 error identification",
    "wcag 3.3.3 error suggestion",
    "wcag 3.3.4 error prevention",
    "wcag 3.3.7 redundant entry",
    "wcag 3.3.8 accessible authentication",
    "inline validation accessibility",
    "aria-live form errors",
    "when to validate a form",
    "accessible form errors react",
    "screen reader form errors",
    "role alert form",
  ],
  alternates: {
    canonical: "/guides/accessible-form-validation",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-form-validation",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Form Validation & Error Handling")}&section=Guide`,
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
        url: `/api/og?title=${encodeURIComponent("Accessible Form Validation & Error Handling")}&section=Guide`,
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
    name: "Accessible Form Validation & Error Handling",
    url: "https://accessibility.build/guides/accessible-form-validation",
  },
]

const faqs = [
  {
    question: "When should a form validate — on submit, on blur, or as the user types?",
    answer:
      "Validate on submit for everyone, because it is the one moment you can guarantee the user has finished. Validating on every keystroke is hostile: it flags an email address as invalid while the user is halfway through typing it, and a screen reader user hears a stream of \"invalid\" announcements. Validating on blur is gentler but still fires the first time someone tabs through an empty required field they fully intend to fill in. The pattern that respects everyone is a hybrid: run full validation when the form is submitted, and only after that first failed submit start re-checking an individual field as the user edits it — so the error clears the instant it is fixed, but no field is ever marked wrong before the user has tried to send the form. Reserve genuinely live feedback (a password-strength meter, a username-availability check) for cases where the user expects it, debounce it, and announce it through a single polite live region rather than firing on each character.",
  },
  {
    question: "How do I tie an error message to the field it belongs to?",
    answer:
      "Do three things to every field in error, and a red border is none of them. Set aria-invalid=\"true\" on the control so assistive technology reports it as invalid; render the error as real text (not an icon or colour alone) so it survives 1.4.1 Use of Color; and point the field's aria-describedby at that message's id so a screen reader reads the error whenever focus reaches the field. If the field also has a hint, list both ids in aria-describedby in reading order — hint first, then error. When the field is corrected, set aria-invalid to \"false\" (or remove it) and remove the error text so the two never drift out of sync. This wiring is what satisfies 3.3.1 Error Identification: the error is identified in text and programmatically associated with the field, not just shown as a visual style.",
  },
  {
    question: "What is the error summary pattern, and why use it?",
    answer:
      "An error summary is a block at the top of the form, rendered after a failed submit, that lists every error as a link pointing to the field that caused it. It solves a problem an inline-only approach does not: a keyboard or screen reader user who submits a long form and lands back at the top has no idea what went wrong or where. The summary gives them the full count and, because each item is a link to the field's id, a one-key jump to fix it. The load-bearing detail is focus: give the summary tabindex=\"-1\" and move focus to it on submit, so the user is taken to the list and a screen reader reads it. Move focus to the summary or use role=\"alert\" on it, but not both — doing both announces the summary twice. This is the on-submit half of 3.3.1; pair it with the per-field aria-describedby messages for when the user reaches each field.",
  },
  {
    question: "Why do my form errors get announced twice by a screen reader?",
    answer:
      "The usual cause is making the same element do two jobs: the per-field error node is both the target of aria-describedby and an aria-live region. When you populate it, the live region announces it once, and then focus reaching the field announces it again through the description. Pick one channel per moment. On submit, move focus to the error summary (or the first invalid field) — focus landing there reads the message once, so the individual error nodes do not need to be live regions at all. For feedback while the user types, use a single dedicated polite live region for the whole form rather than marking every error paragraph aria-live. The rule of thumb: aria-describedby is read when focus arrives; aria-live is read when content changes; if an element has both, you get both.",
  },
  {
    question: "What is WCAG 3.3.7 Redundant Entry?",
    answer:
      "Redundant Entry (Level A, new in WCAG 2.2) says that within a single process — a checkout, a multi-step application — you must not ask the user to re-enter information they already provided in that same process, unless re-entering it is essential, the earlier information is no longer valid, or auto-populating it would undermine security (a password confirmation is the classic exception). It is a cognitive-accessibility requirement: re-typing an address you gave two steps ago is exactly the kind of memory-and-transcription burden that trips up users with cognitive disabilities, and it is a friction point for everyone. Satisfy it by carrying data forward between steps, offering a \"same as billing address\" control, auto-populating from earlier answers, and using autocomplete tokens so the browser can fill known values. The simplest test: complete your own multi-step flow and count how many times you type the same fact.",
  },
  {
    question: "What does WCAG 3.3.8 Accessible Authentication require?",
    answer:
      "Accessible Authentication (Minimum) (Level AA, new in WCAG 2.2) says a login step must not depend on a cognitive function test — remembering a password, solving a puzzle, transcribing characters, or identifying them from a distorted image — unless an accessible alternative is provided, the test can be completed with the help of another mechanism, or it is object- or personal-content recognition. In practice that means: let the browser and password managers fill the password field (never block paste with onpaste handlers, and never disable autocomplete on password inputs), support passkeys and WebAuthn or an email or SMS magic link so the user is not forced to recall a secret, and drop character-transcription CAPTCHAs in favour of the allowed exceptions or a non-cognitive check. The enhanced version, 3.3.9 (Level AAA), removes even the object- and personal-content-recognition exceptions. The core idea is that authenticating should not require the user to remember or retype anything.",
  },
  {
    question: "Should I turn off the browser's native form validation?",
    answer:
      "Native constraint validation (required, type=\"email\", pattern, and the browser bubbles) is a real accessibility asset — it works with no JavaScript and is keyboard-operable — but the default error bubbles are inconsistent between browsers, vanish quickly, are hard to style, and are not reliably announced by every screen reader. The common approach is to keep the constraint attributes on your inputs (they document intent and act as a fallback) but add novalidate to the <form> so you can take over the messaging with the Constraint Validation API, rendering your own text errors, aria-invalid, describedby, and summary. That gives you a consistent, well-announced, styleable experience while the underlying validity state (checkValidity(), validity.valueMissing, and friends) still does the detection work for you. If you have no JavaScript at all, leave native validation on — imperfect built-in errors beat none.",
  },
  {
    question: "How do I test whether my form errors are accessible?",
    answer:
      "Submit the form with the keyboard alone and a screen reader running, and leave every field wrong. Focus should move to an error summary or the first invalid field, and the screen reader should announce that something failed and how many — not leave you silent at the top of the page. Tab through the fields: each invalid one should announce its label, that it is invalid, and its specific error message, because aria-invalid and aria-describedby are wired up. Fix one field and confirm the error clears and is not re-announced on a loop. Turn the screen off or set the display to greyscale and confirm you can still tell which fields are wrong — errors must not rely on colour (1.4.1). Check that the error text says what to do (\"Enter a date as DD/MM/YYYY\"), not just that something is wrong (3.3.3). Then layer axe-core on top for the mechanical checks, but the keyboard-and-screen-reader submit is the test that decides whether a user can actually recover.",
  },
]

const antiPatterns = [
  {
    bad: "The only sign of an error is a red border or a red asterisk.",
    why: "Colour alone is invisible to a screen reader and to many colour-blind users, so they cannot tell which field failed or why (1.4.1, 3.3.1).",
    fix: "Add a text message, set aria-invalid=\"true\", and tie the message to the field with aria-describedby. Colour becomes a redundant extra cue, not the only one.",
  },
  {
    bad: "Validation fires on every keystroke, flagging fields the user is still typing.",
    why: "The user is told their half-typed email is invalid, and a screen reader user hears \"invalid\" repeatedly — noise that punishes people for making progress (3.3.1, 4.1.3).",
    fix: "Validate on submit; only re-check a field live after the first failed submit, and only to clear its error once it is fixed.",
  },
  {
    bad: "On submit the page reloads or updates but focus stays put and nothing is announced.",
    why: "A keyboard or screen reader user has no idea the submit failed, what went wrong, or where to fix it — they are stranded (3.3.1, 4.1.3, 2.4.3).",
    fix: "Render an error summary, move focus to it (tabindex=\"-1\"), and link each item to its field. Announce it once, through the focus move or role=\"alert\", not both.",
  },
  {
    bad: "The error message just says \"Invalid\" or \"This field is required.\"",
    why: "It identifies that something is wrong but not how to fix it, which fails 3.3.3 when a correct value is known and is a barrier for users who cannot guess the expected format.",
    fix: "Describe the fix: \"Enter an email in the format name@example.com\" or \"Password must be at least 12 characters.\" Suggest a value whenever you can determine one.",
  },
  {
    bad: "The per-field error node is both an aria-describedby target and an aria-live region.",
    why: "It is announced twice — once as a live change, once when focus reaches the field — so the user hears every error doubled (4.1.3).",
    fix: "Use aria-describedby for on-focus reading and a single shared polite live region for on-change announcements. One element should not do both jobs.",
  },
  {
    bad: "The password field blocks paste and disables autocomplete, and login hides behind a character CAPTCHA.",
    why: "It forces the user to recall and retype a secret and pass a cognitive-function test, blocking password managers and failing 3.3.8 Accessible Authentication.",
    fix: "Allow paste and autocomplete, support passkeys/WebAuthn or a magic link, and replace transcription CAPTCHAs with an allowed check or an accessible alternative.",
  },
]

export default function AccessibleFormValidationGuidePage() {
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
                    Accessible Form Validation
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
                Forms &amp; WCAG Guide &bull; Updated July 2026
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Accessible Form Validation &amp; Error Handling
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Error handling is where most forms fail their users. This guide
                covers the part every checklist glosses over: <em>when</em> to
                validate, how to tie an error to its field with{" "}
                <code>aria-invalid</code> and <code>aria-describedby</code>, the
                error-summary pattern and its focus move, announcing inline
                errors through live regions without double-speaking, suggesting
                the fix, preventing the costly mistake, and WCAG&nbsp;2.2&apos;s
                Redundant Entry and Accessible Authentication — with copy-ready
                code mapped to WCAG&nbsp;3.3.1 through 3.3.9.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Where Forms Fail Their Users
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A form that everyone can fill in and no one can recover from is
                  still a broken form. The moment a submission fails, an
                  invisible contract is tested: does the interface tell the user{" "}
                  <em>that</em> something went wrong, <em>which</em> field, and{" "}
                  <em>how</em> to fix it — in a way a screen reader will read, a
                  keyboard will reach, and a colour-blind user will see? Most
                  forms answer with a red border and nothing else, and that is a
                  red border away from useless.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is the deep dive on the error side of forms. If you are
                  building a form from scratch — labels, structure, grouping,
                  autocomplete — start with the{" "}
                  <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible forms guide
                  </Link>
                  , which covers the whole control. This guide zooms in on the
                  single most-failed part of it: the validation and
                  error-handling lifecycle, from the moment you decide{" "}
                  <em>when</em> to check a field to the confirmation step that
                  keeps a user from an irreversible mistake.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nearly all of it lives in one cluster of the standard — the{" "}
                  <strong className="text-slate-900 dark:text-white">
                    WCAG 3.3 &ldquo;Input Assistance&rdquo; guidelines
                  </strong>
                  , success criteria 3.3.1 through 3.3.9 — plus{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.3 Status Messages
                  </Link>{" "}
                  for the announcements and{" "}
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1 Use of Color
                  </Link>{" "}
                  for never relying on red alone. We will take them in the order
                  a real form meets them.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The WCAG 2.2 Criteria Your Validation Must Satisfy
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that accessible form validation and
                    error handling must satisfy and what each requires
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
                        What your form must do
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.1 Error Identification
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every error is described in text and programmatically tied to the field that caused it — not shown by colour or an icon alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.2 Labels or Instructions
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Fields carry visible labels and any format or requirement is stated up front, so many errors never happen in the first place.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.3 Error Suggestion
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">When a correct value is known, the message suggests it — the expected format or a valid option — rather than only saying something is wrong.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.4 Error Prevention (Legal, Financial, Data)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Submissions with legal or financial weight, or that change user data, are reversible, checked, or confirmed before they take effect.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.7 Redundant Entry
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Information the user already gave earlier in the same process is not asked for again, unless re-entry is essential.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.8 Accessible Authentication
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Logging in does not depend on remembering a password, transcribing characters, or solving a puzzle without an accessible alternative.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.3 Status Messages
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Error counts and success confirmations are announced to a screen reader without moving focus — through a live region.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.1 Use of Color
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">An error is never signalled by colour alone; a text message and aria-invalid carry the meaning that red only reinforces.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Two more sit above these at Level AAA and are worth reaching for:{" "}
                <Link href="/wcag/3-3-6" className="text-blue-600 dark:text-blue-400 hover:underline">
                  3.3.6 Error Prevention (All)
                </Link>{" "}
                extends the reversible-checked-confirmed safety net to{" "}
                <em>every</em> submission, and{" "}
                <Link href="/wcag/3-3-9" className="text-blue-600 dark:text-blue-400 hover:underline">
                  3.3.9 Accessible Authentication (Enhanced)
                </Link>{" "}
                removes the object-recognition exception from 3.3.8. The
                criterion forms fail most often is{" "}
                <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  3.3.1
                </Link>
                , because the error lives in a CSS class and never reaches the
                accessibility tree at all.
              </p>
            </div>
          </section>

          {/* 1. When to validate */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Clock className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. When to Validate: Timing Is the Whole Game
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Before a single line of ARIA, decide <em>when</em> your form
                checks a field. Get this wrong and no amount of correct markup
                saves you — you will announce errors for fields the user is still
                typing, or say nothing until it is too late. There are three
                moments you can validate, and the accessible answer is not to
                pick one but to sequence them.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                The three moments, and what each costs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">On every keystroke</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Hostile by default.</strong>{" "}
                      Flags an email as invalid while it is half-typed and, with
                      a live region, machine-guns &ldquo;invalid&rdquo; at a
                      screen reader user. Reserve it for feedback the user{" "}
                      <em>asked</em> for — a strength meter — and debounce it.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">On blur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Gentler, still premature.</strong>{" "}
                      Fires the first time someone tabs out of an empty required
                      field they fully intend to return to, and can trap a
                      keyboard user who is only passing through.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 dark:border-blue-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">On submit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">The one honest moment.</strong>{" "}
                      It is the only point you can be sure the user has finished.
                      Always validate here — and make it the anchor the other two
                      moments defer to.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                The pattern that respects everyone
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Validate fully on submit. Then, and only for a field already in
                an error state, re-check it as the user edits so the error clears
                the moment it is fixed. No field is ever marked wrong before the
                user has tried to send the form, and no corrected field keeps a
                stale error. This is sometimes called{" "}
                <em>reward early, punish late</em>.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`const form = document.querySelector("form")
let hasSubmitted = false

form.addEventListener("submit", (event) => {
  hasSubmitted = true
  const errors = validate(form)          // your rules -> [{ field, message }]
  if (errors.length > 0) {
    event.preventDefault()
    showErrors(errors)                   // per-field messages + summary (sections 2-3)
    focusSummary()                       // move focus so it is announced once
  }
})

// Only start live-validating AFTER the first failed submit,
// and only to clear an error the user is actively fixing.
form.addEventListener("input", (event) => {
  if (!hasSubmitted) return
  const field = event.target
  if (field.getAttribute("aria-invalid") === "true") {
    revalidateField(field)               // remove the error the instant it passes
  }
})`}</code></pre>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>The best error is the one that never happens.</strong>{" "}
                    Before you tune validation timing, prevent the error at the
                    source — a visible label, a stated format, and a sensible
                    input type and{" "}
                    <Link href="/guides/accessible-forms" className="underline">
                      autocomplete
                    </Link>{" "}
                    token satisfy{" "}
                    <Link href="/wcag/3-3-2" className="underline">
                      3.3.2 Labels or Instructions
                    </Link>{" "}
                    and quietly delete whole categories of mistake.
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* 2. Tie error to field */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Link2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Tie the Error to Its Field
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This is the heart of{" "}
                <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  3.3.1
                </Link>
                , and it is three moves, none of which is a colour. Mark the
                field invalid, write the error as real text, and connect the two
                so a screen reader reads the message when focus reaches the
                field.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<label for="email">Email address</label>

<!-- A hint stated up front prevents errors (3.3.2). -->
<p id="email-hint" class="hint">We'll email your receipt here.</p>

<input
  type="email"
  id="email"
  name="email"
  autocomplete="email"
  required
  aria-invalid="true"
  aria-describedby="email-hint email-error"   <!-- hint first, then error, in reading order -->
/>

<!-- Real text, not an icon or a colour. This is the error itself. -->
<p id="email-error" class="error">
  Enter an email address in the format name@example.com.
</p>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
                Because <code>aria-describedby</code> lists the error&apos;s{" "}
                <code>id</code>, a screen reader reads the message every time the
                field gains focus. <code>aria-invalid=&quot;true&quot;</code>{" "}
                reports the field as invalid so the user hears &ldquo;invalid&rdquo;
                on the control itself. When the field is corrected, set{" "}
                <code>aria-invalid</code> to <code>&quot;false&quot;</code> and
                drop the error id from <code>aria-describedby</code> (or remove
                the error node) so the description and the state never
                contradict each other.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                required, aria-required, and the native-validation decision
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Use the native <code>required</code> attribute on real form
                controls — it sets the invalid state for free and is exposed to
                assistive technology without any ARIA. Reserve{" "}
                <code>aria-required=&quot;true&quot;</code> for custom widgets
                that cannot take the native attribute. The browser&apos;s own
                constraint validation (<code>required</code>,{" "}
                <code>type=&quot;email&quot;</code>, <code>pattern</code>) is an
                asset, but its default error bubbles are inconsistent and poorly
                announced. The usual move is to keep the constraint attributes as
                documentation and a no-JavaScript fallback, add{" "}
                <code>novalidate</code> to the <code>&lt;form&gt;</code>, and take
                over the messaging yourself using the same validity state:
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<form novalidate>  <!-- keep the attributes, control the messages -->
  ...
</form>

// The Constraint Validation API still detects the problems for you:
if (!emailInput.validity.valid) {
  if (emailInput.validity.valueMissing) message = "Enter your email address."
  else if (emailInput.validity.typeMismatch) message =
    "Enter an email address in the format name@example.com."
}`}</code></pre>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-blue-100 leading-relaxed flex gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong>
                      <code>aria-errormessage</code> exists — but{" "}
                      <code>aria-describedby</code> is the safer default.
                    </strong>{" "}
                    ARIA has a purpose-built pairing:{" "}
                    <code>aria-invalid=&quot;true&quot;</code> plus{" "}
                    <code>aria-errormessage</code> pointing at the message. It is
                    semantically precise, but screen-reader and browser support
                    has lagged, and the message is only exposed while{" "}
                    <code>aria-invalid</code> is true. Until support is
                    universal, <code>aria-describedby</code> is read more
                    reliably across the board — which is why the examples here use
                    it. If you adopt <code>aria-errormessage</code>, test it in
                    your target screen readers first.
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* 3. Error summary */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. The Error Summary: The On-Submit Workflow
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Per-field messages are read when the user <em>reaches</em> each
                field — but on submit, a keyboard or screen reader user is often
                dropped back at the top of a long form with no idea what failed.
                The error summary fixes that: a block at the top, rendered after
                a failed submit, that names every problem as a link to the field
                that caused it. It is the pattern the{" "}
                <a
                  href="https://design-system.service.gov.uk/components/error-summary/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  GOV.UK Design System
                </a>{" "}
                popularised, and it is the most reliable way to satisfy the
                on-submit half of 3.3.1.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<!-- Rendered at the top of the form only after a failed submit. -->
<div class="error-summary" id="error-summary" tabindex="-1">
  <h2 class="error-summary__title">There is a problem</h2>
  <ul>
    <li><a href="#email">Enter an email address in the format name@example.com</a></li>
    <li><a href="#password">Password must be at least 12 characters</a></li>
  </ul>
</div>`}</code></pre>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100 mt-4"><code>{`function focusSummary() {
  const summary = document.getElementById("error-summary")
  summary.focus()   // tabindex="-1" makes the container programmatically focusable
}

// Each summary link jumps to its field by matching id; also focus the field
// so the landing is reliable across browsers.
summary.addEventListener("click", (event) => {
  const link = event.target.closest("a")
  if (!link) return
  const field = document.querySelector(link.getAttribute("href"))
  if (field) { event.preventDefault(); field.focus() }
})`}</code></pre>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>Announce the summary once — pick one channel.</strong>{" "}
                    Moving focus to the summary (via <code>tabindex=&quot;-1&quot;</code>)
                    makes a screen reader read it because focus landed there, and
                    it scrolls the summary into view for sighted keyboard users.
                    Adding <code>role=&quot;alert&quot;</code> makes it announce{" "}
                    <em>as a live region too</em> — so a summary that both takes
                    focus and carries <code>role=&quot;alert&quot;</code> is read
                    twice. Move focus <em>or</em> use <code>role=&quot;alert&quot;</code>,
                    not both. The focus move is usually the better choice because
                    it also positions the user to act.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Keep each summary item&apos;s wording identical to the field&apos;s
                own error message so the user is not solving two different
                riddles, and order the items to match the visual order of the
                fields. The summary and the per-field messages are two views of
                the same data — generate both from one list of errors so they can
                never disagree.
              </p>
            </div>
          </section>

          {/* 4. Live regions */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Megaphone className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. Announce Inline Errors Without Stealing Focus
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Sometimes an error or a status appears without a submit and
                without moving focus — a debounced &ldquo;username is
                taken&rdquo;, a &ldquo;saved&rdquo; confirmation, a running count
                of problems. Those changes must reach a screen reader through an{" "}
                <strong className="text-slate-900 dark:text-white">
                  ARIA live region
                </strong>
                , which is exactly what{" "}
                <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.3 Status Messages
                </Link>{" "}
                requires.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<!-- One shared, always-present region. It must exist in the DOM BEFORE
     you write to it, or the first message is missed. -->
<div id="form-status" aria-live="polite" class="sr-only"></div>

// Writing text into it announces that text, without moving focus.
document.getElementById("form-status").textContent =
  "2 problems found. See the list at the top of the form."`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
                Use <code>aria-live=&quot;polite&quot;</code> for almost
                everything — it waits for the screen reader to finish its current
                sentence. Reserve <code>aria-live=&quot;assertive&quot;</code>{" "}
                (or <code>role=&quot;alert&quot;</code>, which implies it) for a
                message the user must hear immediately, because it interrupts. A
                validation error the user just caused is usually fine to announce
                politely.
              </p>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>The double-announcement trap.</strong> Do not make a
                    per-field error node <em>both</em> an{" "}
                    <code>aria-describedby</code> target <em>and</em> an{" "}
                    <code>aria-live</code> region. When you populate it, the live
                    region announces it once; then focus reaching the field
                    announces it again through the description — every error,
                    doubled. Keep the roles separate:{" "}
                    <code>aria-describedby</code> for on-focus reading, one shared
                    polite region for on-change announcements. If you already move
                    focus to a summary or the first invalid field on submit, the
                    error nodes need no live behaviour at all.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Live regions are their own small discipline — atomic updates,
                clearing before re-announcing, <code>role=&quot;status&quot;</code>{" "}
                versus <code>role=&quot;alert&quot;</code>. The{" "}
                <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Status Messages guide
                </Link>{" "}
                covers the full set of rules and the toast, result-count, and
                loading-state patterns that build on them.
              </p>
            </div>
          </section>

          {/* 5. Suggest & prevent */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Lightbulb className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Suggest the Fix, and Prevent the Costly Mistake
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Identifying an error is the floor, not the ceiling. Two more
                criteria ask the message to <em>help</em>, and the form to
                protect the user from a mistake that is expensive to undo.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                3.3.3 Error Suggestion: say how to fix it
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you can determine a correct value, the message must offer it
                — the expected format, the valid range, the nearest match — not
                merely announce that the input is wrong.{" "}
                <strong className="text-slate-900 dark:text-white">&ldquo;Invalid date&rdquo;</strong>{" "}
                fails; <strong className="text-slate-900 dark:text-white">&ldquo;Enter a date as DD/MM/YYYY, for example 09/06/2026&rdquo;</strong>{" "}
                passes. The one exception is where revealing the suggestion would
                undermine security or purpose — a login form should say{" "}
                <em>&ldquo;Your email or password was incorrect&rdquo;</em> rather
                than confirming which half was right.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                3.3.4 Error Prevention: reversible, checked, or confirmed
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When a submission carries legal weight, moves money, or changes
                or deletes data the user controls, at least one of three
                safeguards must be in place. This is not screen-reader-specific —
                it protects users with cognitive disabilities, motor
                disabilities, and everyone else from an irreversible slip.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Reversible</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The submission can be undone — a cancellation window on an
                      order, a &ldquo;delete&rdquo; that trashes rather than
                      destroys.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Checked</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Input is validated for errors and the user gets a chance to
                      correct them before the submission takes effect.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Confirmed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A review step shows everything the user entered and asks
                      them to confirm before it is final — the classic checkout
                      &ldquo;Review your order&rdquo; page.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A review-and-confirm step is the most common answer and the most
                useful, because it doubles as a place to read back every value
                one last time. If you can, aim for{" "}
                <Link href="/wcag/3-3-6" className="text-blue-600 dark:text-blue-400 hover:underline">
                  3.3.6 Error Prevention (All)
                </Link>{" "}
                and extend the same safety net to every submission, not just the
                legal and financial ones.
              </p>
            </div>
          </section>

          {/* 6. Redundant entry */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Repeat className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. Do Not Ask Twice: Redundant Entry
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <Link href="/wcag/3-3-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                  3.3.7 Redundant Entry
                </Link>{" "}
                (Level A, new in WCAG 2.2) is a cognitive-accessibility
                requirement that reads like plain courtesy: within a single
                process, do not make the user enter the same information twice.
                Re-typing an address you gave two steps ago is exactly the
                memory-and-transcription load that trips up users with cognitive
                disabilities — and a friction point for everyone on a phone.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The criterion allows three exceptions: when re-entry is{" "}
                <em>essential</em> (confirming a password, a deliberate security
                re-check), when the earlier information is{" "}
                <em>no longer valid</em>, or when auto-populating it would{" "}
                <em>undermine security</em>. Everything else should be carried
                forward. Practical techniques:
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6 mb-4">
                <li>
                  Offer a{" "}
                  <strong className="text-slate-900 dark:text-white">&ldquo;same as billing address&rdquo;</strong>{" "}
                  control that copies the earlier values rather than asking for
                  them again.
                </li>
                <li>
                  Carry data between the steps of a multi-step form, and show it
                  back to the user rather than making them re-key it.
                </li>
                <li>
                  Use <code>autocomplete</code> tokens (
                  <code>autocomplete=&quot;email&quot;</code>,{" "}
                  <code>&quot;street-address&quot;</code>,{" "}
                  <code>&quot;tel&quot;</code>) so the browser and password
                  managers can fill values the user has stored — which also helps{" "}
                  <Link href="/wcag/1-3-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.3.5 Identify Input Purpose
                  </Link>
                  .
                </li>
                <li>
                  Where a value must be re-selected rather than re-typed, let the
                  user pick it from what they entered before instead of recalling
                  it.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                The test is simple: complete your own multi-step flow and count
                how many times you type the same fact. Every count above the
                essential ones is a 3.3.7 problem.
              </p>
            </div>
          </section>

          {/* 7. Accessible authentication */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <KeyRound className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. Accessible Authentication
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The login step is a form too, and{" "}
                <Link href="/wcag/3-3-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                  3.3.8 Accessible Authentication (Minimum)
                </Link>{" "}
                (Level AA, new in WCAG 2.2) governs it. The rule: a login process
                must not rely on a{" "}
                <strong className="text-slate-900 dark:text-white">cognitive function test</strong>{" "}
                — remembering a password, transcribing characters, solving a
                puzzle, or reading distorted text — unless an accessible
                alternative is offered, a mechanism helps complete it, or the
                test is object- or personal-content recognition.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The most common way sites fail it is by fighting the very tools
                that make authentication accessible. Fixes are mostly a matter of
                getting out of the way:
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6 mb-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">Allow paste into password fields.</strong>{" "}
                  Never attach an <code>onpaste</code> handler that blocks it —
                  it breaks password managers and forces recall and retyping, the
                  exact burden the criterion forbids.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Keep <code>autocomplete</code> on.</strong>{" "}
                  Use <code>autocomplete=&quot;current-password&quot;</code> and{" "}
                  <code>&quot;new-password&quot;</code> so browsers and managers
                  can fill and generate credentials.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Support passkeys / WebAuthn.</strong>{" "}
                  A biometric or device passkey is authentication with nothing to
                  remember — the cleanest way to pass, and increasingly expected.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Offer an email or SMS link, or OAuth.</strong>{" "}
                  A magic link or a &ldquo;sign in with&rdquo; button removes the
                  recall step entirely.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Drop transcription CAPTCHAs.</strong>{" "}
                  Reading distorted characters is a cognitive-function test.
                  Object-recognition (&ldquo;select the buses&rdquo;) and
                  personal-content checks are the allowed exceptions at AA — but{" "}
                  <Link href="/wcag/3-3-9" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.3.9 (Enhanced, AAA)
                  </Link>{" "}
                  removes even the object one.
                </li>
              </ul>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-blue-100 leading-relaxed flex gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    The through-line of 3.3.8 is that{" "}
                    <strong>the user should not have to remember or retype a secret</strong>
                    . If your login can be completed by a password manager, a
                    passkey, or a link in an email, you have satisfied it — and
                    made the experience better for everyone at the same time.
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* 8. React */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                8. Validation in React
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In React the state moves into hooks, but the accessibility
                contract does not change: <code>aria-invalid</code>, a text
                message, and <code>aria-describedby</code> tying them together.
                Use <code>useId</code> to generate the paired ids so a component
                can appear more than once on a page without collisions.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`function EmailField({ value, onChange, error }) {
  const id = useId()
  const hintId = id + "-hint"
  const errorId = id + "-error"
  const invalid = Boolean(error)

  return (
    <div>
      <label htmlFor={id}>Email address</label>
      <p id={hintId} className="hint">We'll email your receipt here.</p>

      <input
        id={id}
        type="email"
        value={value}
        onChange={onChange}
        autoComplete="email"
        required
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? hintId + " " + errorId : hintId}
      />

      {invalid && (
        <p id={errorId} className="error">{error}</p>
      )}
    </div>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Note <code>aria-invalid=&#123;invalid || undefined&#125;</code>:
                passing <code>undefined</code> removes the attribute entirely
                when the field is valid, rather than leaving{" "}
                <code>aria-invalid=&quot;false&quot;</code> hanging around. A
                library such as{" "}
                <strong className="text-slate-900 dark:text-white">React Hook Form</strong>{" "}
                or <strong className="text-slate-900 dark:text-white">Formik</strong>{" "}
                manages the error <em>state</em> for you, but it does not wire the
                ARIA — you still own <code>aria-invalid</code>,{" "}
                <code>aria-describedby</code>, the summary, and the focus move.{" "}
                <strong className="text-slate-900 dark:text-white">React Aria&apos;s form and field hooks</strong>{" "}
                go further and handle the wiring for you. Whichever you choose,
                verify it against the workflow below. The same principles carry to
                the other frameworks — see the{" "}
                <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  React
                </Link>
                ,{" "}
                <Link href="/guides/vue-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Vue
                </Link>
                , and{" "}
                <Link href="/guides/angular-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Angular
                </Link>{" "}
                accessibility guides.
              </p>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldAlert className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How to Test Accessible Form Validation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A scanner can confirm an input has a label; it cannot tell you
                whether a user can recover from a failed submit. That is a
                hands-on test, and it takes a couple of minutes.
              </p>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Submit it broken, with the keyboard and a screen reader.</strong>{" "}
                  Leave every field wrong and press the submit button. Focus
                  should move to an error summary or the first invalid field, and
                  the screen reader should announce that the submit failed and
                  how many problems there are — not leave you silent at the top.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Tab through the invalid fields.</strong>{" "}
                  Each should announce its label, that it is invalid, and its
                  specific message — proof that <code>aria-invalid</code> and{" "}
                  <code>aria-describedby</code> are wired. Use the commands in the{" "}
                  <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    NVDA
                  </Link>{" "}
                  and{" "}
                  <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    VoiceOver
                  </Link>{" "}
                  guides.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Fix one field and listen.</strong>{" "}
                  The error should clear as soon as the value is valid, and it
                  should not be re-announced on every keystroke — the
                  reward-early, punish-late timing from section 1.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Turn off colour.</strong>{" "}
                  Switch the display to greyscale and confirm you can still tell
                  which fields failed and why — the meaning is in text, not in red
                  (
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Read the messages aloud.</strong>{" "}
                  Do they say what to do, or only that something is wrong? Every
                  message should suggest the fix where one is known (
                  <Link href="/wcag/3-3-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.3.3
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Try to break the login.</strong>{" "}
                  Paste into the password field, let a password manager fill it,
                  and check nothing blocks either — and that no
                  character-transcription CAPTCHA stands in the way (
                  <Link href="/wcag/3-3-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.3.8
                  </Link>
                  ).
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Layer <code>axe-core</code> on top for the mechanical checks — see{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  automated vs manual testing
                </Link>{" "}
                — and scan the live page with the{" "}
                <Link href="/tools/url-accessibility-auditor" className="text-blue-600 dark:text-blue-400 hover:underline">
                  URL accessibility auditor
                </Link>{" "}
                to catch a missing name or an unassociated error before it ships.
              </p>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Validation Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common accessible form validation anti-patterns, why they
                    fail, and the fix
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

          {/* Checklist */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Accessible Form Validation Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Right timing.</strong>{" "}
                  Full validation on submit; live re-checking only after a failed
                  submit, and only to clear a field the user is fixing — never on
                  every keystroke.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Error tied to field.</strong>{" "}
                  <code>aria-invalid=&quot;true&quot;</code>, a real text message,
                  and <code>aria-describedby</code> connecting them (
                  <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.3.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Not colour alone.</strong>{" "}
                  Every error survives greyscale — the meaning is in text, red is
                  a redundant cue (
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Summary with focus.</strong>{" "}
                  An error summary on submit, focus moved to it (
                  <code>tabindex=&quot;-1&quot;</code>), each item a link to its
                  field — announced once, not twice.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Announcements, not double-speak.</strong>{" "}
                  On-change statuses go through one shared polite live region; no
                  node is both an <code>aria-describedby</code> target and a live
                  region (
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.3
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Messages suggest the fix.</strong>{" "}
                  Expected format or a valid value where one is known, not just
                  &ldquo;invalid&rdquo; (
                  <Link href="/wcag/3-3-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.3.3
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Costly actions protected.</strong>{" "}
                  Legal, financial, or data-changing submissions are reversible,
                  checked, or confirmed (
                  <Link href="/wcag/3-3-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.3.4
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">No redundant entry, accessible login.</strong>{" "}
                  Data carried forward across steps (
                  <Link href="/wcag/3-3-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.3.7
                  </Link>
                  ); paste, autocomplete, and passkeys allowed, no transcription
                  CAPTCHA (
                  <Link href="/wcag/3-3-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.3.8
                  </Link>
                  ).
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Work through the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                to see form validation in the context of every other
                requirement, and the{" "}
                <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessible forms guide
                </Link>{" "}
                for labels, grouping, and structure.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Form on a Live Page
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Scan any page with our free axe-core-powered auditor to catch
                  an input with no label, an error that is not associated with
                  its field, or a validation state that lives only in CSS — then
                  run the broken-submit test above for the failures no scanner can
                  see.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/accessible-forms">
                      Accessible Forms Guide
                    </Link>
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
                content="accessible form validation error handling error messages aria-invalid aria-describedby aria-errormessage error summary pattern role alert live region aria-live status messages error identification error suggestion error prevention redundant entry accessible authentication passkey webauthn captcha novalidate constraint validation required fields inline validation when to validate on submit on blur react hook form focus management wcag 3.3.1 3.3.2 3.3.3 3.3.4 3.3.6 3.3.7 3.3.8 3.3.9 4.1.3 1.4.1 accessible forms"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/accessible-form-validation"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
