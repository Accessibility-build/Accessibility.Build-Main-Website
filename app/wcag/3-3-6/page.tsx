import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 3.3.6 Error Prevention (All) — Full Guide",
  description:
    "Guide to WCAG 3.3.6 Error Prevention (All): every submission must be reversible, checked, or confirmed — not just legal and financial ones. Code and testing.",
  keywords: [
    "WCAG 3.3.6",
    "Error Prevention All",
    "reversible checked confirmed",
    "form confirmation step",
    "review before submit",
    "undo submission accessibility",
    "form validation accessibility",
    "input assistance",
    "Level AAA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/3-3-6",
  },
  openGraph: {
    title: "WCAG 3.3.6 Error Prevention (All) — Reversible, Checked, or Confirmed (Level AAA)",
    description:
      "The definitive guide to WCAG 3.3.6: every page that submits user information must make it reversible, checked for errors, or confirmable before commit. Patterns, code, and testing.",
    url: "/wcag/3-3-6",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%203.3.6%20Error%20Prevention%20(All)&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.3.6 Error Prevention (All) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.3.6 Error Prevention (All) — Level AAA Guide",
    description:
      "Reversible, checked, or confirmed: WCAG 3.3.6 extends error prevention from legal and financial forms to every submission. How to implement and test it.",
    images: [
      {
        url: "/api/og?title=WCAG%203.3.6%20Error%20Prevention%20(All)&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 3.3.6 Error Prevention (All) require?",
    a: "For any web page that requires the user to submit information, at least one of three things must be true: the submission is reversible (it can be undone), the data is checked for input errors and the user gets a chance to correct them, or a mechanism lets the user review, confirm, and correct the information before finalizing. It is a Level AAA success criterion under Guideline 3.3 Input Assistance. You need one of the three per submission, not all three.",
  },
  {
    q: "How is 3.3.6 different from 3.3.4 Error Prevention (Legal, Financial, Data)?",
    a: "The requirement — reversible, checked, or confirmed — is identical. The difference is scope. 3.3.4 (Level AA) applies only to high-stakes submissions: legal commitments, financial transactions, modifications or deletions of user-controllable data, and test responses. 3.3.6 (AAA) applies the same protection to every page that requires submitting information: comments, profile edits, RSVPs, search preferences, support tickets — all of it. If you meet 3.3.6, you have met 3.3.4 automatically.",
  },
  {
    q: "Do I need reversible AND checked AND confirmed to pass?",
    a: "No — any one of the three per submission satisfies the criterion. In practice they suit different situations: 'checked' (inline validation plus the chance to fix) fits low-stakes forms; 'confirmed' (a review step) fits multi-field or consequential submissions; 'reversible' (undo, cancellation windows, soft-delete) fits destructive actions. Many well-designed flows layer two of them anyway — validation plus a review page — but one is enough for conformance.",
  },
  {
    q: "Does a browser 'Are you sure?' dialog count as a confirmation step?",
    a: "A native confirm() dialog can technically provide a confirmation opportunity for a simple action like a deletion, but it is weak: it usually restates nothing (the user cannot review what they typed), and it trains users to click through. A real review step shows the actual data — 'You are about to post this comment / delete these 3 files' — with edit and cancel paths. For anything beyond a single obvious action, prefer a genuine review-and-confirm page or an undo window over a reflexive dialog.",
  },
  {
    q: "What does 'reversible' mean concretely on the web?",
    a: "The action can be undone after submission. Patterns include: soft-deletion with a trash folder and a restore option, an undo toast with a genuine grace period ('Message sent — Undo'), an order cancellation window before fulfillment starts, and edit/withdraw controls on posted content. The reversal path must be findable and usable — an undo that exists only in an unannounced toast that vanishes in two seconds does not meaningfully make the action reversible for people who need more time.",
  },
  {
    q: "Who benefits most from 3.3.6?",
    a: "Everyone makes input errors, but the criterion exists because some users cannot reliably catch their own. People with motor disabilities mis-hit keys and controls; people with dyslexia transpose characters and numbers; people with cognitive disabilities, memory impairments, or attention difficulties may not notice a wrong field until after submitting; screen reader users can't visually scan the whole form one last time before pressing submit. A check, a review step, or an undo converts each of those slips from a permanent consequence into a correctable moment.",
  },
]

export default function WCAG336Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 3.3.6: Error Prevention (All)"
        description="For web pages that require the user to submit information, submissions are reversible, checked, or confirmed"
        criteria="3.3.6"
        level="AAA"
        principle="Understandable"
        guideline="3.3 Input Assistance"
        url="https://accessibility.build/wcag/3-3-6"
        category="Input Assistance"
        relatedCriteria={["3.3.4", "3.3.1", "3.3.3", "3.3.5"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="3.3.6 Error Prevention (All)" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Level AAA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 3: Understandable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Extends 3.3.4 to every form
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.3.6: Error Prevention (All)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              At Level AA, WCAG protects users from irreversible mistakes on legal and
              financial forms. This criterion asks a simple question: why only those?{" "}
              <strong className="text-slate-900 dark:text-white">
                Every submission of user information must be reversible, checked for
                errors, or confirmable before it is finalized
              </strong>
              . One safety net, three ways to weave it, applied everywhere.
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
            <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-purple-500 pl-4">
              For Web pages that require the user to submit information, at least one
              of the following is true:
              <span className="block mt-3">
                <strong>Reversible</strong> — Submissions are reversible.
              </span>
              <span className="block mt-2">
                <strong>Checked</strong> — Data entered by the user is checked for
                input errors and the user is provided an opportunity to correct them.
              </span>
              <span className="block mt-2">
                <strong>Confirmed</strong> — A mechanism is available for reviewing,
                confirming, and correcting information before finalizing the
                submission.
              </span>
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              &ldquo;At least one&rdquo; is the operative phrase — pick the mechanism
              that fits the form. The only scoping condition is that the page requires
              the user to submit information; there are no carve-outs by topic or
              stakes at this level.
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
                  Reversible, checked, confirmed
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#pass-fail">
                  Pass and fail examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#failures">
                  Common failures
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#testing">
                  How to test
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#siblings">
                  Relationship to 3.3.4 and the 3.3.x cluster
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Input errors are universal, but the ability to notice and recover from
              them is not. The criterion levels that field:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  t: "People with motor disabilities",
                  d: "Tremor, fatigue, or switch access make mis-keys and accidental activations routine. A review step or undo means a slipped finger is a nuisance, not a consequence.",
                },
                {
                  t: "People with dyslexia and dyscalculia",
                  d: "Transposed letters and digits (0161 vs 0611) are hard to self-detect. Validation that checks plausibility, and review screens that present data in a fresh format, both catch what proofreading misses.",
                },
                {
                  t: "People with cognitive and memory disabilities",
                  d: "Multi-field forms tax working memory; the wrong date or option may feel right in the moment. An explicit confirmation pass externalizes the checking the brain could not do inline.",
                },
                {
                  t: "Screen reader and magnification users",
                  d: "There is no at-a-glance final scan of a form when you experience it one field at a time. A structured review page rebuilds that overview in an accessible, linear form.",
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

          {/* Requirement */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Reversible, checked, confirmed — choosing your mechanism
            </h2>
            <ul className="space-y-3 mb-4">
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-purple-500 font-bold">
                  1
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">Reversible</strong>{" "}
                  suits destructive or dispatching actions: deletions that go to a
                  recoverable trash, sent messages with an undo window, cancellable
                  orders. The undo path must be discoverable and give users enough
                  time to use it.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-purple-500 font-bold">
                  2
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">Checked</strong>{" "}
                  suits everyday forms: validate the input (formats, ranges, required
                  fields, plausibility), report errors accessibly, and let the user
                  correct and resubmit. Checking must be paired with the opportunity
                  to fix — validation that simply rejects is not enough.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-purple-500 font-bold">
                  3
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">Confirmed</strong>{" "}
                  suits consequential or multi-step submissions: before finalizing,
                  show everything the user entered on a review screen with working
                  &ldquo;change&rdquo; links, then require an explicit confirm action.
                  A checkbox (&ldquo;I have reviewed my information&rdquo;) before the
                  submit button is the minimal version for single-step forms.
                </span>
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Note that validation cannot catch everything — a mistyped but valid
              phone number sails through any checker. That is why review steps and
              reversibility matter even on forms with excellent validation: the three
              mechanisms cover different classes of error, and the criterion lets you
              choose the one matching the risk.
            </p>
          </section>

          {/* Pass / fail */}
          <section aria-labelledby="pass-fail" className="mb-12">
            <h2
              id="pass-fail"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Pass and fail examples
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3">
                  ✓ Passes 3.3.6
                </h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A support-ticket form that validates each field and lists any
                    errors with links back to the fields (checked).
                  </li>
                  <li>
                    A survey ending on a &ldquo;Review your answers&rdquo; page with an
                    Edit link beside every response (confirmed).
                  </li>
                  <li>
                    Deleting a photo moves it to a trash folder recoverable for 30
                    days (reversible).
                  </li>
                  <li>
                    A comment box whose posted comments carry Edit and Delete controls
                    for the author (reversible).
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 3.3.6
                </h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    An RSVP form that submits instantly with no validation, no review,
                    and no way to change the response afterwards.
                  </li>
                  <li>
                    A profile editor that saves on every keystroke with no undo and no
                    confirmation of the final state.
                  </li>
                  <li>
                    A &ldquo;Delete account&rdquo; button that acts immediately —
                    irreversible, unchecked, unconfirmed.
                  </li>
                  <li>
                    Validation that rejects a submission but wipes the form, giving no
                    real opportunity to correct (fails the spirit of
                    &ldquo;checked&rdquo; and 3.3.1 besides).
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Code */}
          <section aria-labelledby="code" className="mb-12">
            <h2
              id="code"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Code examples
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Checked: accessible validation with a correction path
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Report errors in an announced summary that links to each field, keep the
              user&rsquo;s input intact, and identify errors in text (per 3.3.1).
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<div role="alert" tabindex="-1" id="error-summary" hidden>
  <h2>There are 2 problems with your submission</h2>
  <ul>
    <li><a href="#email">Email address is missing an @ sign</a></li>
    <li><a href="#date">Event date must be in the future</a></li>
  </ul>
</div>

<label for="email">Email address</label>
<input id="email" type="email" aria-describedby="email-error"
       aria-invalid="true" value="jamie.example.com" />
<p id="email-error" class="error">
  Enter an email address in the format name@example.com
</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Confirmed: a review step before finalizing
            </h3>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<h1>Check your answers before submitting</h1>
<dl>
  <div>
    <dt>Full name</dt>
    <dd>Jamie Rivera</dd>
    <dd><a href="/apply/name">Change<span class="sr-only"> full name</span></a></dd>
  </div>
  <div>
    <dt>Date of birth</dt>
    <dd>4 July 1990</dd>
    <dd><a href="/apply/dob">Change<span class="sr-only"> date of birth</span></a></dd>
  </div>
</dl>

<form action="/apply/submit" method="post">
  <button type="submit">Confirm and submit application</button>
</form>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Reversible: a real undo window
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Announce the undo, give it generous time, and expose a persistent
              recovery route (a trash folder) for users who miss the toast.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<div role="status" class="toast">
  Item moved to trash.
  <button type="button" onclick="undoDelete('item-42')">Undo</button>
</div>

<script>
  // Soft-delete: flag now, purge later. The trash page offers
  // "Restore" for 30 days, so recovery never depends on
  // catching a transient toast.
  async function undoDelete(id) {
    await fetch(\`/api/items/\${id}/restore\`, { method: "POST" })
    document.querySelector(".toast").textContent = "Item restored."
  }
</script>`}</code>
            </pre>
          </section>

          {/* Common failures */}
          <section aria-labelledby="failures" className="mb-12">
            <h2
              id="failures"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "Ordinary forms — comments, RSVPs, settings, tickets — that submit irrevocably with no validation, review, or undo, because 'it's not a financial form'.",
                "Destructive actions (delete, unsubscribe, cancel) that execute immediately and permanently on a single click.",
                "Validation that rejects the submission but discards everything the user typed, forcing full re-entry instead of correction.",
                "Review pages whose 'Change' links lose the rest of the entered data, punishing the user for reviewing.",
                "Undo offered only as a 2-second toast with no persistent recovery path — technically reversible, practically not.",
                "Confirmation dialogs that don't display the data being confirmed, reducing 'review and confirm' to a reflex click.",
                "Auto-submitting the form when the last field is filled, removing the user's explicit submit moment entirely (also a 3.2.2 problem).",
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
              How to test for 3.3.6
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory every submission on the page",
                  d: "Forms, comment boxes, settings toggles that persist, delete buttons, multi-step wizards. Anything that sends user information somewhere is in scope — not just the checkout.",
                },
                {
                  t: "For each, identify which of the three mechanisms applies",
                  d: "Is it reversible (find the undo/restore path)? Checked (submit bad data and see what happens)? Confirmed (look for the review step)? At least one must be demonstrably present.",
                },
                {
                  t: "Submit deliberately wrong data",
                  d: "Type an impossible date, a malformed email, digits in a name field. Verify errors are detected, described in text, associated with their fields, and that your other input survives for correction.",
                },
                {
                  t: "Exercise the confirmation path end to end",
                  d: "On review screens, use every Change link and verify data persists; confirm with a screen reader that the review content and the confirm control are properly announced.",
                },
                {
                  t: "Attempt to reverse what claims to be reversible",
                  d: "Delete, then restore. Send, then undo. Time the window and check a persistent route (trash, history, cancellation page) exists for users who need longer than a toast.",
                },
              ].map((step, i) => (
                <li
                  key={step.t}
                  className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
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
              This is flow testing, not markup linting — automated tools cannot tell
              whether an undo exists. Work it into your{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>{" "}
              alongside the rest of the 3.3.x cluster.
            </p>
          </section>

          {/* Relationship */}
          <section aria-labelledby="siblings" className="mb-12">
            <h2
              id="siblings"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Relationship to 3.3.4 and the Input Assistance cluster
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              3.3.6 is{" "}
              <Link href="/wcag/3-3-4" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.3.4 Error Prevention (Legal, Financial, Data)
              </Link>{" "}
              (AA) with the scope limit removed: identical reversible / checked /
              confirmed options, applied to every information submission instead of
              only high-stakes ones. If your design system bakes validation and review
              patterns into its standard form components, the jump from AA to AAA here
              costs almost nothing.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The rest of Guideline 3.3 supplies the machinery:{" "}
              <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.3.1 Error Identification
              </Link>{" "}
              (A) makes detected errors visible in text,{" "}
              <Link href="/wcag/3-3-3" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.3.3 Error Suggestion
              </Link>{" "}
              (AA) requires fixes to be suggested,{" "}
              <Link href="/wcag/3-3-2" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.3.2 Labels or Instructions
              </Link>{" "}
              (A) and{" "}
              <Link href="/wcag/3-3-5" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.3.5 Help
              </Link>{" "}
              (AAA) prevent errors upstream. Together they describe one lifecycle:
              help users enter data correctly, catch what goes wrong, explain it, and
              make nothing irreversible by accident.
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

          <CriterionLinks number="3.3.6" />
        </article>
      </div>
    </>
  )
}
