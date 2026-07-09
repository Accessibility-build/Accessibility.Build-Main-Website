import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 3.2.2 On Input — Predictable Form Controls",
  description:
    "Complete guide to WCAG 3.2.2 On Input. Why changing a setting must not auto-navigate or submit, the advance-warning exception, select onchange fixes, and how to test.",
  keywords: [
    "WCAG 3.2.2",
    "On Input",
    "change of context",
    "select onchange navigation",
    "auto submit form",
    "predictable forms",
    "dropdown navigation accessibility",
    "checkbox submits form",
    "keyboard accessibility",
    "form accessibility",
    "Level A",
    "WCAG 2.2",
    "understandable",
  ],
  alternates: {
    canonical: "/wcag/3-2-2",
  },
  openGraph: {
    type: "website",
    title: "WCAG 3.2.2 On Input — Predictable Form Controls",
    description:
      "Changing a setting must never auto-navigate or submit without warning. WCAG 3.2.2 explained: select onchange pitfalls, the advance-notice exception, code, and testing.",
    url: "/wcag/3-2-2",
    images: [
      {
        url: "/api/og?title=WCAG%203.2.2%20On%20Input&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.2.2 On Input — Predictable Form Controls",
    description:
      "Picking an option shouldn't teleport the user. WCAG 3.2.2 requirements, the select onchange trap, the advance-warning exception, and how to test.",
  },
}

const faqs = [
  {
    q: "What does WCAG 3.2.2 On Input require?",
    a: "Changing the setting of any user interface component — selecting an option in a dropdown, ticking a checkbox or radio button, typing into a field — must not automatically cause a change of context, unless the user has been advised of that behavior before using the component. Changes of context include loading a new page, submitting a form, opening a new window, and moving focus elsewhere. The user should commit such changes with an explicit action, typically a button. It is a Level A criterion under Guideline 3.2 Predictable, present since WCAG 2.0.",
  },
  {
    q: "What counts as 'changing the setting' of a component?",
    a: "Any change to the component's state or value made while operating it: choosing a select option, toggling a checkbox, picking a radio button, typing a character into a text field, moving a slider. It does not include activation — clicking a button or link is an explicit request, not a settings change, so a button that navigates is perfectly fine. That distinction is the heart of 3.2.2: state changes must be inert; deliberate activations may do anything.",
  },
  {
    q: "Is a select that navigates onchange always a failure?",
    a: "It fails unless users are told beforehand. The notorious pattern — a 'jump menu' that fires location.href the instant an option is highlighted — is especially harsh on keyboard users, because in some browsers pressing the down arrow to browse options changes the selection and triggers navigation before they ever reach the option they wanted. The standard fix is a Go button next to the select. Alternatively, a visible note before the control ('Selecting a language will reload the page') satisfies the advance-warning exception.",
  },
  {
    q: "Does updating page content when a setting changes violate 3.2.2?",
    a: "Not necessarily. The criterion forbids automatic changes of context, not changes of content. Filtering a product list when a checkbox is ticked, updating a price preview, or showing an extra field relevant to a selected option are content updates that generally keep the user oriented — especially when the updated content comes after the control in reading order. It becomes a change of context when the meaning of the page changes or the user is moved: full navigation, form submission, focus jumping, a new window, or a wholesale rearrangement of the page.",
  },
  {
    q: "Are auto-advancing fields (like OTP code inputs) a 3.2.2 problem?",
    a: "They are risky. Automatically moving focus to the next field once a character is typed is a change of context (a change of focus) triggered by changing a setting. The W3C's Understanding document uses exactly this example for the exception: it can conform if the user is advised of the behavior beforehand — for instance, instructions before the fields saying focus will move automatically as digits are entered. Without that advance notice, auto-advance fails, and it causes real problems for users who type, check, and correct as they go.",
  },
  {
    q: "How is 3.2.2 different from 3.2.1 On Focus and 3.2.5 Change on Request?",
    a: "3.2.1 (Level A) covers receiving focus: tabbing onto a component must change nothing. 3.2.2 (Level A) covers operating a component: changing its setting must not auto-trigger a context change unless warned. 3.2.5 Change on Request (Level AAA) goes further: all context changes happen only at the user's explicit request, with no 'we warned you' escape hatch. Meeting 3.2.5's pattern — every context change behind a button — automatically satisfies 3.2.2 and is the most robust design.",
  },
]

export default function WCAG322Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 3.2.2 On Input"
        description="Changing the setting of any user interface component does not automatically cause a change of context unless the user has been advised beforehand"
        criteria="3.2.2"
        level="A"
        principle="Understandable"
        guideline="Predictable"
        url="https://accessibility.build/wcag/3-2-2"
        category="Predictable"
        wordCount={2800}
        timeToRead={9}
        hasInteractiveDemo={false}
        relatedCriteria={["3.2.1", "3.3.2", "2.4.3", "4.1.2"]}
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
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="3.2.2 On Input" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Level A
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 3: Understandable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Guideline 3.2 Predictable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.2.2: On Input
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Choosing an option from a dropdown should not teleport you to another
              page. This criterion requires that{" "}
              <strong className="text-slate-900 dark:text-white">
                changing a control&rsquo;s setting never automatically causes a change
                of context
              </strong>{" "}
              — no auto-navigation, no auto-submit, no stolen focus — unless the user
              was clearly told beforehand. Users adjust settings, then commit with an
              explicit action. That order is what makes forms predictable.
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
              Changing the setting of any user interface component does not
              automatically cause a change of context unless the user has been advised
              of the behavior before using the component.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Two load-bearing phrases: <em>changing the setting</em> (state changes
              while operating a control — not clicks on buttons or links, which are
              explicit requests) and <em>advised before using</em> (a visible notice
              the user encounters ahead of the control, not an explanation after the
              jump has already happened).
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
                <a className="hover:underline" href="#scope">
                  Settings, activations, and the exception
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
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  t: "Keyboard users",
                  d: "Browsing a select with arrow keys changes its value option by option. If onchange navigates, they are yanked away before reaching their choice — the control is unusable without a mouse.",
                },
                {
                  t: "Screen reader users",
                  d: "They hear one option at a time and often step through all of them before deciding. Auto-triggering context changes mid-exploration means never hearing the full list.",
                },
                {
                  t: "People with cognitive disabilities",
                  d: "Predictable cause and effect is essential. When adjusting a value silently commits it and moves the page, users lose track of what happened and why.",
                },
                {
                  t: "People with motor disabilities and low vision",
                  d: "Mis-selections happen constantly — a slipped click, a magnified view hiding the consequences. A separate confirm step turns every mis-selection into a non-event.",
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
              The through-line with{" "}
              <Link
                href="/wcag/3-2-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                3.2.1 On Focus
              </Link>{" "}
              is a single principle: the interface changes context only when the user
              asks it to. 3.2.1 protects looking; 3.2.2 protects adjusting; buttons
              remain the place where things actually happen.
            </p>
          </section>

          {/* Scope */}
          <section aria-labelledby="scope" className="mb-12">
            <h2
              id="scope"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Settings, activations, and the exception
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Auditing 3.2.2 means sorting interactions into three buckets:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Setting changes (covered):
                  </strong>{" "}
                  selecting an option, checking a box, choosing a radio button, typing
                  in a field, moving a slider. These must not auto-cause a change of
                  context — new page, submitted form, new window, moved focus, or a
                  content change that alters the page&rsquo;s meaning.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Activations (not covered):
                  </strong>{" "}
                  clicking a button or link, pressing Enter to submit. These are
                  explicit requests — navigating or submitting in response is exactly
                  what the user asked for.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Warned behaviors (the exception):
                  </strong>{" "}
                  a context change on input is permitted if the user is advised{" "}
                  <em>before using the component</em> — a visible instruction ahead of
                  the control in reading order (and programmatically associated, e.g.
                  via{" "}
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                    aria-describedby
                  </code>
                  ), such as &ldquo;Selecting a country reloads this form.&rdquo;
                </span>
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Content updates that keep the user in place — filtering results,
              revealing a dependent field, updating a total — are usually fine. The
              safest layout puts the updated content <em>after</em> the control in
              reading order, so screen reader users encounter changes downstream of
              where they are, never behind them. Even better, prefer the AAA pattern
              of 3.2.5 Change on Request: put every context change behind an explicit
              button and the question never arises.
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
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-emerald-600 mr-2">
                    ✓
                  </span>
                  Pass: language select with a Go button
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  Users pick a language from the select, review their choice, and
                  press &ldquo;Apply&rdquo; to reload the site in that language. The
                  context change happens on activation, not on input.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-emerald-600 mr-2">
                    ✓
                  </span>
                  Pass: filter checkboxes update results below
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  Ticking &ldquo;In stock only&rdquo; re-filters the product grid that
                  follows the filters. Focus stays on the checkbox, the page&rsquo;s
                  meaning is intact, and a live region announces &ldquo;24 results.&rdquo;
                  A content change, not a context change.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-emerald-600 mr-2">
                    ✓
                  </span>
                  Pass (exception): warned auto-advance
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  Above a 6-box verification code input, visible instructions say:
                  &ldquo;Focus moves to the next box automatically as you type each
                  digit.&rdquo; The user was advised before using the component, so
                  the focus moves conform under the exception.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-rose-500 mr-2">
                    ✗
                  </span>
                  Fail: jump menu navigates onchange
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A &ldquo;Quick links&rdquo; select fires <code>location.href</code>{" "}
                  the moment its value changes. A keyboard user pressing ↓ to scan the
                  options is navigated to the first option&rsquo;s page before seeing
                  the second.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-rose-500 mr-2">
                    ✗
                  </span>
                  Fail: radio button submits the form
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  Choosing a shipping method instantly submits the checkout form with
                  no warning. Users who wanted to compare options have committed to
                  the first one they touched.
                </p>
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
              The jump-menu fix: add a real submit action
            </h3>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Fails: changing the selection navigates immediately -->
<select onchange="location.href = this.value">
  <option value="/docs">Documentation</option>
  <option value="/pricing">Pricing</option>
  <option value="/support">Support</option>
</select>

<!-- ✓ Passes: the user commits the choice with a button -->
<form action="/go" method="get">
  <label for="dest">Go to section</label>
  <select id="dest" name="dest">
    <option value="/docs">Documentation</option>
    <option value="/pricing">Pricing</option>
    <option value="/support">Support</option>
  </select>
  <button type="submit">Go</button>
</form>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Content updates are fine; context changes are not (React)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              An onChange handler may update state that re-renders content after the
              control. It must not navigate, submit, or move focus.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// ✗ Fails: selecting a plan navigates automatically
function PlanPicker() {
  const router = useRouter()
  return (
    <select onChange={(e) => router.push("/checkout?plan=" + e.target.value)}>
      …
    </select>
  )
}

// ✓ Passes: selection updates a summary; a button performs the navigation
function PlanPicker() {
  const router = useRouter()
  const [plan, setPlan] = useState("starter")
  return (
    <>
      <label htmlFor="plan">Plan</label>
      <select id="plan" value={plan} onChange={(e) => setPlan(e.target.value)}>
        <option value="starter">Starter — $9/mo</option>
        <option value="team">Team — $29/mo</option>
      </select>
      <PlanSummary plan={plan} /> {/* content update below the control */}
      <button type="button" onClick={() => router.push("/checkout?plan=" + plan)}>
        Continue to checkout
      </button>
    </>
  )
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Using the exception: advise before the component
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              If a context change on input is genuinely necessary, the warning must
              come first — visible, and programmatically associated.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ Conforms via the exception: user is advised before using the control -->
<p id="country-note">
  Selecting a country reloads this page to show local pricing and tax.
</p>
<label for="country">Country</label>
<select id="country" aria-describedby="country-note"
        onchange="reloadWithCountry(this.value)">
  <option>United States</option>
  <option>Germany</option>
  <option>Japan</option>
</select>

<!-- Better still: avoid needing the exception with an Apply button -->`}</code>
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
                "Jump menus: select elements that navigate onchange with no Go button and no advance warning.",
                "Forms that auto-submit when the last field is filled, a radio button is chosen, or a checkbox is ticked.",
                "Country, language, or currency selectors that reload the page the instant a value changes, with no notice before the control.",
                "Auto-advancing multi-box inputs (verification codes, card numbers, dates) with no instructions telling users focus will move.",
                "Typing in a search field triggering full navigation to a results page after n characters, rather than updating a results region in place.",
                "Opening a new window or modal as a side effect of checking a box or picking an option.",
                "Putting the 'warning' after the control, in a tooltip, or only in text users reach once the jump has already fired — advice must come before use.",
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
              How to test for 3.2.2
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Change every setting without confirming anything",
                  d: "Work through each select, checkbox, radio group, slider, and text field. Change the value and stop. The page must not navigate, submit, open windows, or move focus. Anything beyond an in-place content update is a finding.",
                },
                {
                  t: "Drive selects with the keyboard",
                  d: "Focus each select and press the arrow keys. In several browsers this changes the value option by option — the exact scenario that detonates onchange navigation. If browsing options triggers a jump, it fails.",
                },
                {
                  t: "Type one character in each text field",
                  d: "Watch for auto-submission after a character count, focus leaping to the next field, or navigation from live search. Any of these without prior notice is a failure.",
                },
                {
                  t: "Check claimed warnings",
                  d: "Where a context change on input is intended, verify the advisory text is visible before the control in reading order and associated with it (aria-describedby). A warning discovered after the jump does not count.",
                },
                {
                  t: "Grep for the risky handlers",
                  d: "Search the codebase for onchange/onChange and oninput/onInput containing location.href, router.push, form.submit(), window.open, or .focus(). Each match either needs a button-based redesign or a compliant advance warning.",
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
              Run this together with{" "}
              <Link
                href="/wcag/3-2-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                3.2.1 On Focus
              </Link>{" "}
              in a single keyboard pass — first Tab everywhere (3.2.1), then operate
              everything (3.2.2). The full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>{" "}
              covers the rest of the Predictable guideline.
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

          <CriterionLinks number="3.2.2" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="on input change of context select onchange navigation auto submit form jump menu predictable forms dropdown navigation checkbox submits form advance warning keyboard accessibility WCAG 3.2.2 Level A understandable"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
