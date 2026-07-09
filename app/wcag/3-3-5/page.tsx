import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 3.3.5 Help — Context-Sensitive Help Guide",
  description:
    "Guide to WCAG 3.3.5 Help: providing context-sensitive help for forms — field-level instructions, help links, and assistants — with code, examples, and testing.",
  keywords: [
    "WCAG 3.3.5",
    "Help",
    "context-sensitive help",
    "form help accessibility",
    "field level instructions",
    "help link accessibility",
    "input assistance",
    "aria-describedby help",
    "Level AAA",
    "WCAG 2.2",
    "input assistance",
  ],
  alternates: {
    canonical: "/wcag/3-3-5",
  },
  openGraph: {
    title: "WCAG 3.3.5 Help — Context-Sensitive Help for Forms (Level AAA)",
    description:
      "The definitive guide to WCAG 3.3.5: make context-sensitive help available wherever users must provide input — field hints, help links, examples, and assistants. Code and testing included.",
    url: "/wcag/3-3-5",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%203.3.5%20Help&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.3.5 Help guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.3.5 Help — Context-Sensitive Help (Level AAA)",
    description:
      "Context-sensitive help must be available where users enter information. Field-level hints, help links, examples, and assistants — implementation and testing for 3.3.5.",
    images: [
      {
        url: "/api/og?title=WCAG%203.3.5%20Help&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 3.3.5 Help require?",
    a: "The normative text is three words: 'Context-sensitive help is available.' It means that when content requires user input — typically forms — help specific to the task and the field must be reachable at the point where the user needs it. That can be persistent field-level instructions, a help link next to the form or field, an example of the expected input, or an assistant. It is a Level AAA success criterion under Guideline 3.3 Input Assistance, applying at the page level: help for the function performed on that page.",
  },
  {
    q: "What makes help 'context-sensitive' rather than just help?",
    a: "Context-sensitive help answers the question the user has at the exact moment they have it: 'what goes in this field?', 'where do I find my policy number?', 'what format does this date want?'. A generic help center homepage, a site-wide FAQ, or a support email address is help, but not context-sensitive — the user must leave their task, search, and map generic answers back to their situation. The help must be tied to the specific input or task, and reachable from it.",
  },
  {
    q: "How is 3.3.5 Help different from 3.3.2 Labels or Instructions?",
    a: "3.3.2 (Level A) requires labels or instructions when content requires user input — the baseline 'tell people what to enter'. 3.3.5 (AAA) goes further: beyond the label, help must be available for users who need more than the label gives — clarification of purpose, format examples, where to find the requested information, or what happens with it. Think of 3.3.2 as the field's name tag and 3.3.5 as the knowledgeable colleague standing next to the form.",
  },
  {
    q: "Does every form field need a help icon to pass 3.3.5?",
    a: "No. The Understanding document is explicit that when a field's label is sufficient — 'First name', 'Email' — no additional help is required for it. The criterion targets input that people plausibly struggle with: unfamiliar identifiers (tax numbers, policy references), fields with strict formats, questions with legal or financial consequences, and multi-step tasks. Also, help can live at the form or page level (a 'Help with this form' link) rather than as per-field icons, as long as it actually covers the fields users get stuck on.",
  },
  {
    q: "What forms of help satisfy 3.3.5?",
    a: "The documented sufficient techniques include: instructions or hint text placed with the field, a help link on every page or beside the form that leads to task-specific help, examples of expected input ('e.g. AB-123456'), spell checking and suggestions for text input, and live assistants (human chat or a well-built automated assistant). Whatever the form, the help mechanism must itself be accessible — keyboard reachable, announced to screen readers, and dismissible per 1.4.13 if it appears on hover or focus.",
  },
  {
    q: "Why is context-sensitive help an accessibility issue and not just good UX?",
    a: "Because the cost of missing help is not evenly distributed. People with cognitive and learning disabilities may be unable to infer what an ambiguous field wants; people with memory impairments may not recall where to find an account number they've used before; people with anxiety may abandon a form rather than risk an error with legal consequences; screen reader users cannot skim the page for incidental clues sighted users pick up. Help available in context turns each of these hard stops into a recoverable moment — which is why it sits in the Input Assistance guideline alongside error prevention.",
  },
]

export default function WCAG335Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 3.3.5: Help"
        description="Context-sensitive help is available when content requires user input"
        criteria="3.3.5"
        level="AAA"
        principle="Understandable"
        guideline="3.3 Input Assistance"
        url="https://accessibility.build/wcag/3-3-5"
        category="Input Assistance"
        relatedCriteria={["3.3.1", "3.3.2", "3.3.3", "3.3.6"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="3.3.5 Help" />

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
                Input assistance
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.3.5: Help
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A label tells you a field is called &ldquo;Policy number.&rdquo; It does
              not tell you where on earth to find your policy number. This criterion
              fills that gap:{" "}
              <strong className="text-slate-900 dark:text-white">
                wherever users must provide input, help specific to that task must be
                available
              </strong>{" "}
              — field instructions, examples, help links, or an assistant — right where
              the confusion happens.
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
              Context-sensitive help is available.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Three words, but with precise scope: it applies to content that requires
              user input, and &ldquo;context-sensitive&rdquo; means the help addresses
              the specific function being performed — not a generic support portal. If
              a form is so simple that its labels are all the help anyone needs, that
              already satisfies the criterion.
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
                  What the requirement covers
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#pass-fail">
                  Pass and fail examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code: accessible help patterns
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
                  Relationship to 3.3.1–3.3.6
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
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  t: "People with cognitive and learning disabilities",
                  d: "An ambiguous field is a wall, not a puzzle. Inline explanations and examples remove the inference step — the difference between completing a benefits application and abandoning it.",
                },
                {
                  t: "People with memory impairments",
                  d: "Requests for identifiers — account numbers, reference codes, previous addresses — assume recall. Help that says where to find the information replaces memory with a procedure.",
                },
                {
                  t: "People with anxiety, and first-time users",
                  d: "Forms with legal or financial weight are frightening when a question is unclear. Knowing help is one keystroke away lowers the stakes of every field.",
                },
                {
                  t: "Screen reader users",
                  d: "Sighted users skim the whole page for clues; screen reader users hear the form linearly. Help programmatically associated with each field (aria-describedby) arrives exactly when the field does.",
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The business case writes itself: every field a user cannot answer is a
              support ticket, a phone call, or an abandoned conversion. Context help is
              one of the few accessibility measures with an immediately measurable
              completion-rate payoff.
            </p>
          </section>

          {/* Requirement */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What the requirement covers
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The criterion applies when content requires user input. Any of these
              forms of help can satisfy it — choose per field or per form, matching the
              difficulty of the question:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  t: "Field-level instructions",
                  d: "Persistent hint text with the field: what the value is, where to find it, what format it takes. The workhorse technique — no interaction required.",
                },
                {
                  t: "Examples of expected input",
                  d: "“e.g. AB-1234567” or a completed sample row. Examples communicate format faster than any description, especially across languages.",
                },
                {
                  t: "Help links",
                  d: "A link beside the field or form leading to task-specific help — “Where is my policy number?” — provided consistently so users learn to expect it.",
                },
                {
                  t: "Assistants and spell checking",
                  d: "A human chat, a well-built automated assistant scoped to the task, or spell checking with suggestions for free-text input all count as help mechanisms.",
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Two boundary notes. First, if labels alone genuinely suffice (a
              two-field newsletter signup), the criterion is met without extra
              apparatus. Second, don&rsquo;t confuse this with WCAG 2.2&rsquo;s{" "}
              <em>3.2.6 Consistent Help</em> (A), which requires help mechanisms you
              already offer to appear in a consistent place across pages — 3.3.5
              requires the help to <em>exist</em> and be context-specific.
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
                  ✓ Passes 3.3.5
                </h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A tax form where every unfamiliar field has hint text plus a
                    &ldquo;Where do I find this?&rdquo; link with a screenshot of the
                    source document.
                  </li>
                  <li>
                    An insurance claim with an &ldquo;Example claim&rdquo; the user can
                    view at any point, and a live-chat assistant.
                  </li>
                  <li>
                    A date field showing its expected format and an example:
                    &ldquo;Date of birth (DD/MM/YYYY), e.g. 04/07/1990&rdquo;.
                  </li>
                  <li>
                    A simple contact form whose labels (&ldquo;Name&rdquo;,
                    &ldquo;Email&rdquo;, &ldquo;Message&rdquo;) are all the help anyone
                    could need.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 3.3.5
                </h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A government application asking for a &ldquo;Form 27B/6 reference
                    number&rdquo; with no explanation of what that is or where it
                    lives.
                  </li>
                  <li>
                    A checkout whose only &ldquo;help&rdquo; is a footer link to a
                    generic FAQ homepage unrelated to the checkout task.
                  </li>
                  <li>
                    Help text hidden in a tooltip that only appears on mouse hover —
                    unreachable by keyboard and touch (also fails 1.4.13).
                  </li>
                  <li>
                    A complex eligibility questionnaire where wrong interpretations
                    have legal consequences, offered with no guidance at all.
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
              Code: accessible help patterns
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Persistent hint text, programmatically associated
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Connect the help to the field with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">aria-describedby</code>{" "}
              so screen readers announce it when the field gets focus. Visible,
              persistent text beats any disclosure widget.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<label for="policy">Policy number</label>
<input id="policy" type="text" inputmode="numeric"
       aria-describedby="policy-help" autocomplete="off" />
<p id="policy-help" class="hint">
  10 digits, printed in the top-right corner of your policy
  documents and renewal letters. Example: 4402318876.
</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A keyboard-accessible help disclosure
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When the explanation is too long to sit inline, use a real button and a
              disclosure region — never a hover-only tooltip. This stays operable by
              keyboard, touch, and voice control.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<label for="utr">Unique Taxpayer Reference (UTR)</label>
<input id="utr" type="text" aria-describedby="utr-help" />
<button type="button" aria-expanded="false" aria-controls="utr-help"
        onclick="toggleHelp(this)">
  Help: where to find your UTR
</button>
<div id="utr-help" hidden>
  <p>Your UTR is a 10-digit number on letters from the tax
     office about your Self Assessment, and in your online
     tax account under "Profile".</p>
  <p><a href="/help/find-utr">Full guide with pictures</a></p>
</div>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A form-level help link, placed consistently
            </h3>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<form aria-labelledby="claim-heading">
  <h2 id="claim-heading">Submit an expense claim</h2>
  <p>
    <a href="/help/expense-claims">
      Help with this form: allowed expenses, receipts, and deadlines
    </a>
  </p>
  <!-- fields … -->
</form>`}</code>
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
                "Requesting obscure identifiers or domain jargon with no explanation of what they mean or where users can find them.",
                "Pointing 'Help' at a generic support homepage or FAQ that never mentions the task the user is actually stuck on.",
                "Hover-only tooltips as the sole help mechanism — invisible to keyboard and touch users, and non-conformant with 1.4.13 besides.",
                "Placeholder text as help: it vanishes on typing, exactly when the user needs to re-check the format.",
                "Help icons with no accessible name ('button, unlabeled') so screen reader users cannot even discover help exists.",
                "Help content written at a higher reading level than the form itself, defeating its own purpose (see 3.1.5).",
                "A chat assistant as the only help path, presented in a widget that is not keyboard-operable or screen reader compatible.",
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
              How to test for 3.3.5
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "List every input the page requires",
                  d: "Inventory the form fields and interactive inputs. For each, ask the honest question: could a first-time user, unfamiliar with your organization's vocabulary, answer this from the label alone?",
                },
                {
                  t: "For each hard field, locate the help",
                  d: "Find the hint text, example, help link, or assistant that addresses that specific field or task. It must be discoverable from the field — help that exists somewhere on the site but is not reachable in context does not count.",
                },
                {
                  t: "Check the help is genuinely context-sensitive",
                  d: "Follow each help link. Does it answer this task's questions (what the value is, where to find it, what format, what happens next), or does it dump the user on a generic portal to fend for themselves?",
                },
                {
                  t: "Operate every help mechanism by keyboard and screen reader",
                  d: "Tab to help buttons and links, open them with Enter/Space, and confirm hint text is announced with its field via aria-describedby. Hover-only tooltips and unlabeled icon buttons fail here.",
                },
                {
                  t: "Read the help itself for plainness",
                  d: "Help written in the same bureaucratic register as the form helps nobody. Check it against plain-language standards — short sentences, concrete instructions, an example.",
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
              This is a manual, judgment-based review — automated tools can verify an
              aria-describedby wiring but not whether the words help. Track it in your{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>
              .
            </p>
          </section>

          {/* Relationship */}
          <section aria-labelledby="siblings" className="mb-12">
            <h2
              id="siblings"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Relationship to the Input Assistance cluster
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Guideline 3.3 forms a safety net around user input, and 3.3.5 is its
              proactive layer.{" "}
              <Link href="/wcag/3-3-2" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.3.2 Labels or Instructions
              </Link>{" "}
              (A) guarantees the baseline label;{" "}
              <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.3.1 Error Identification
              </Link>{" "}
              (A) and{" "}
              <Link href="/wcag/3-3-3" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.3.3 Error Suggestion
              </Link>{" "}
              (AA) handle the moment after a mistake — naming it and suggesting a fix.
              3.3.5 works <em>before</em> the mistake: good context help prevents the
              error from ever being made, which is cheaper for everyone than the best
              error message.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              At the far end of the pipeline,{" "}
              <Link href="/wcag/3-3-4" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.3.4 Error Prevention (Legal, Financial, Data)
              </Link>{" "}
              (AA) and its AAA extension{" "}
              <Link href="/wcag/3-3-6" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.3.6 Error Prevention (All)
              </Link>{" "}
              add review-and-confirm safety at submission. A form that provides help
              (3.3.5), labels well (3.3.2), explains errors (3.3.1, 3.3.3), and lets
              users confirm before committing (3.3.6) is the complete Input Assistance
              story.
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

          <CriterionLinks number="3.3.5" />
        </article>
      </div>
    </>
  )
}
