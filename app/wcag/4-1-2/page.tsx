import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title:
    "WCAG 4.1.2 Name, Role, Value — The Complete Guide for Developers (Level A)",
  description:
    "Complete guide to WCAG 4.1.2 Name, Role, Value: what name, role, state, and value mean, how the accessible name is computed, native HTML vs ARIA, copy-ready code examples, the most common failures, and how to test with the accessibility tree.",
  keywords: [
    "WCAG 4.1.2",
    "Name Role Value",
    "accessible name",
    "accessible name computation",
    "ARIA role",
    "aria-label",
    "aria-labelledby",
    "aria-pressed",
    "programmatically determinable",
    "custom component accessibility",
    "accessibility tree",
    "Level A",
    "screen reader",
    "WCAG 2.2",
    "robust accessibility",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/4-1-2",
  },
  openGraph: {
    title:
      "WCAG 4.1.2 Name, Role, Value — The Complete Guide for Developers (Level A)",
    description:
      "The definitive guide to WCAG 4.1.2 Name, Role, Value: name, role, state and value, the accessible name computation, native HTML vs ARIA, copy-ready code, and testing with the accessibility tree.",
    url: "https://accessibility.build/wcag/4-1-2",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "WCAG 4.1.2 Name, Role, Value guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 4.1.2 Name, Role, Value — The Complete Developer Guide",
    description:
      "Learn what name, role, state and value mean, how the accessible name is computed, native HTML vs ARIA, and how to test 4.1.2 with the accessibility tree.",
  },
}

const parts = [
  {
    name: "Name",
    summary:
      "The accessible name — what a screen reader announces to identify the control.",
    detail:
      "Every interactive component needs a programmatically determinable name that conveys its purpose. A button that closes a dialog needs the name “Close”; a search field needs the name “Search”. The browser computes this name from sources such as a <label>, the element's text content, an aria-label, or an aria-labelledby reference. An icon-only button with no text and no label has an empty accessible name, which fails 4.1.2.",
  },
  {
    name: "Role",
    summary:
      "What kind of component it is — button, link, checkbox, tab, dialog.",
    detail:
      "The role tells assistive technology how the component behaves and how the user can operate it. Native elements expose their role automatically: a <button> has the role “button”, an <a href> has the role “link”. When you build a control from a generic <div> or <span>, it has no implied role, so you must supply one with the role attribute — and then re-implement all the keyboard and state behavior the native element gave you for free.",
  },
  {
    name: "State",
    summary:
      "The current condition of the component — pressed, checked, expanded, selected, disabled.",
    detail:
      "States change as the user interacts. A toggle button is pressed or not pressed (aria-pressed); a disclosure is expanded or collapsed (aria-expanded); a checkbox is checked or unchecked. States must be programmatically determinable and must update as they change so a screen reader announces the new state. A visual-only state change — for example, a button that merely changes color — is invisible to assistive technology.",
  },
  {
    name: "Value & Properties",
    summary:
      "The component's current value and any extra properties assistive tech needs.",
    detail:
      "Components that hold a value must expose it: a slider exposes aria-valuenow/min/max, a combobox exposes its selected text. Properties describe relationships and constraints that do not change as often as states — aria-required, aria-haspopup, aria-controls, or aria-describedby pointing at help text. Together, name, role, state, value, and properties give assistive technology a complete, accurate picture of the control.",
  },
]

const faqs = [
  {
    q: "What does WCAG 4.1.2 Name, Role, Value require?",
    a: "WCAG 4.1.2 requires that for every user-interface component — links, form controls, buttons, custom widgets — the name and role can be programmatically determined; states, properties, and values that the user can set can be programmatically set; and any changes to those items are made available to assistive technologies such as screen readers. In plain terms: assistive tech must be able to tell what each control is (role), what it is called (name), and its current condition (state/value), and must be notified when those change. It is a Level A success criterion, the most foundational conformance level.",
  },
  {
    q: "What is the difference between an accessible name and a label?",
    a: "A label is one possible source of the accessible name; the accessible name is the final computed string a screen reader announces. The browser runs an algorithm called the accessible name computation that looks at several sources in priority order — aria-labelledby first, then aria-label, then the native label (a <label> element or the element's own text content), then attributes such as title or placeholder as a last resort. The string it produces is the accessible name. So a form field labeled with a <label>, an icon button named with aria-label, and a link named by its text content all end up with an accessible name, just computed from different sources.",
  },
  {
    q: "Do native HTML elements satisfy 4.1.2 automatically?",
    a: "Native interactive elements give you the correct role and the built-in state and value handling for free, which is most of 4.1.2 — a <button>, <a href>, <input>, <select>, and <textarea> all expose a proper role and report their states and values to assistive technology without any ARIA. You still have to provide an accessible name: a visible <label> for form fields, visible text or aria-label for buttons and links. The guidance is to use native elements first and only reach for ARIA when no native element does the job, because hand-built widgets must re-create every behavior the browser would have handled.",
  },
  {
    q: "Why is 4.1.2 the most commonly failed WCAG criterion?",
    a: "Because it is failed by the most frequent real-world defects: unlabeled form fields, empty links (a linked icon or image with no alt text or accessible name), and buttons with no text. The annual WebAIM Million analysis of the top one million home pages consistently finds missing form labels, empty links, and empty buttons among the most common accessibility errors — and all three are 4.1.2 (and often 1.1.1 or 1.3.1) failures. Custom JavaScript widgets built from <div> and <span> without roles, names, or state attributes are another major source.",
  },
  {
    q: "Is using a div with an onClick handler a 4.1.2 failure?",
    a: "By itself, yes. A clickable <div> has no role (assistive tech does not know it is a button), usually no accessible name, no keyboard operability, and no focus. To make it pass you would need role=\"button\", an accessible name, tabindex=\"0\", and key handlers for Enter and Space — at which point you have manually rebuilt a native <button>. The accessible, robust, and far simpler fix is to use a real <button> element, which provides the role, focusability, and keyboard activation automatically.",
  },
  {
    q: "How do I test for WCAG 4.1.2?",
    a: "Inspect the accessibility tree in your browser DevTools (the Accessibility panel in Chrome, Firefox, or Edge) and confirm each interactive element shows the correct role, a meaningful name, and accurate states. Run an automated scanner such as axe DevTools or Lighthouse to catch empty buttons, unlabeled fields, and missing names at scale. Then verify with a real screen reader — NVDA or VoiceOver — by tabbing through every control and confirming it announces a sensible name, role, and current state, and that toggling a control announces the new state.",
  },
]

export default function WCAG412Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "4.1.2 Name, Role, Value",
            url: "https://accessibility.build/wcag/4-1-2",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 4.1.2 Name, Role, Value: The Complete Guide for Developers"
        description="The definitive guide to WCAG 4.1.2 Name, Role, Value: what name, role, state, and value mean, how the accessible name is computed, native HTML vs ARIA, code examples, the most common failures, and how to test with the accessibility tree."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-06-24"
        dateModified="2026-06-24"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/wcag/4-1-2"
        wordCount={2900}
        keywords={[
          "WCAG 4.1.2",
          "Name Role Value",
          "accessible name",
          "ARIA role",
          "aria-label",
          "custom component accessibility",
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
                    4.1.2 Name, Role, Value
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Most commonly failed
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 4: Robust
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 4.1.2: Name, Role, Value
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              For every user-interface component, the{" "}
              <strong className="text-slate-900 dark:text-white">
                name and role must be programmatically determinable
              </strong>
              , the states, properties, and values the user can set must be
              programmatically settable, and any change must be announced to
              assistive technologies. This Level A criterion is the contract
              between your interface and screen readers — and the single
              most-failed success criterion on the web.
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
              For all user interface components (including but not limited to:
              form elements, links and components generated by scripts), the{" "}
              <strong>name</strong> and <strong>role</strong> can be
              programmatically determined; <strong>states</strong>,{" "}
              <strong>properties</strong>, and <strong>values</strong> that can
              be set by the user can be programmatically set; and notification of
              changes to these items is available to user agents, including
              assistive technologies.
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
                  Why name, role, and value matter
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#parts">
                  Name, role, state, value explained
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#naming">
                  How the accessible name is computed
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
              Why name, role, and value matter
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Sighted users read an interface visually: a magnifying-glass icon
              reads as &ldquo;search&rdquo;, a pill that looks pushed-in reads as
              &ldquo;on&rdquo;, an underlined word reads as &ldquo;a link&rdquo;.
              A screen reader user gets none of that visual styling. They rely
              entirely on the <strong>accessibility tree</strong> — a parallel
              structure the browser builds from your HTML and ARIA, exposing each
              control&apos;s name, role, state, and value to assistive technology.
              WCAG 4.1.2 is the requirement that this tree is complete and
              accurate.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              When it is not, controls become unusable. An icon button with no
              accessible name is announced as just &ldquo;button&rdquo; — the user
              cannot tell what it does. A custom toggle built from a{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sm">
                &lt;div&gt;
              </code>{" "}
              is announced as plain text — the user does not know it is
              interactive, cannot reach it with the keyboard, and never hears
              whether it is on or off. These are not edge cases: they are the most
              frequent accessibility errors on the web.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              4.1.2 sits under Principle 4, <em>Robust</em> — content must work
              reliably with the widest range of user agents and assistive
              technologies, now and as they evolve. Exposing a correct name, role,
              and value is how you keep that promise across NVDA, JAWS, VoiceOver,
              TalkBack, and tools that do not exist yet.
            </p>
          </section>

          {/* Parts */}
          <section aria-labelledby="parts" className="mb-12">
            <h2
              id="parts"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Name, role, state, and value explained
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              The criterion bundles four things every interactive component must
              expose. Native HTML supplies most of them automatically; you only
              hand-wire them when you build a custom widget.
            </p>
            <div className="space-y-4">
              {parts.map((p) => (
                <div
                  key={p.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {p.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
                    {p.summary}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {p.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Naming */}
          <section aria-labelledby="naming" className="mb-12">
            <h2
              id="naming"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How the accessible name is computed
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The browser derives an element&apos;s accessible name by running the{" "}
              <strong>accessible name computation</strong> — checking several
              sources in priority order and using the first one that produces a
              non-empty string. Knowing the order tells you exactly which markup
              wins:
            </p>
            <ol className="space-y-3 mb-5">
              {[
                {
                  t: "aria-labelledby",
                  d: "Points at the id(s) of other element(s) whose text becomes the name. Highest priority — it overrides everything below, including visible text.",
                },
                {
                  t: "aria-label",
                  d: "A string you supply directly. Common for icon-only buttons. Overrides native labels and content, so use it deliberately.",
                },
                {
                  t: "Native label / element content",
                  d: "A <label> associated with a form control, or the element's own text content (a button's text, a link's text). This is the default and the most robust source.",
                },
                {
                  t: "title / placeholder (last resort)",
                  d: "Used only when nothing above exists. Unreliable — title is hidden from many users and placeholder disappears on input — so never rely on them as the primary name.",
                },
              ].map((s, i) => (
                <li
                  key={s.t}
                  className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      <code className="text-sm">{s.t}</code>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {s.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              A practical rule follows from this order: prefer a{" "}
              <strong>visible</strong> label or visible text content, because it
              names the control for everyone and keeps the accessible name in sync
              with what sighted users see. Reserve <code className="text-sm">aria-label</code>{" "}
              for controls that have no visible text, like icon buttons. For more
              on the attributes themselves, see the{" "}
              <Link
                href="/reference/aria"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                ARIA Attributes Reference
              </Link>{" "}
              and our{" "}
              <Link
                href="/blog/aria-labels-guide"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                guide to ARIA labels
              </Link>
              .
            </p>
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
              Native element vs. fake button
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The clickable <code className="text-sm">&lt;div&gt;</code> has no
              role, no name, no keyboard support, and no focus. The native{" "}
              <code className="text-sm">&lt;button&gt;</code> supplies all of them
              for free.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- FAILS 4.1.2: no role, no name, not focusable, no keyboard -->
<div class="btn" onclick="save()">
  <svg aria-hidden="true">...</svg>
</div>

<!-- PASSES: real button + accessible name for the icon -->
<button type="button" onclick="save()">
  <svg aria-hidden="true" focusable="false">...</svg>
  <span class="visually-hidden">Save document</span>
</button>

<!-- Or name an icon-only button with aria-label -->
<button type="button" aria-label="Save document" onclick="save()">
  <svg aria-hidden="true" focusable="false">...</svg>
</button>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Form field with a programmatic name
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A placeholder is not a label. Associate a real{" "}
              <code className="text-sm">&lt;label&gt;</code> so the field has an
              accessible name that persists once the user starts typing.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- FAILS 4.1.2: placeholder is not an accessible name -->
<input type="email" placeholder="Email address" />

<!-- PASSES: label is programmatically associated via for/id -->
<label for="email">Email address</label>
<input type="email" id="email" name="email" />`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Custom toggle button that announces its state
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A toggle needs a role, a name, and a <em>state</em> that updates so
              the screen reader announces &ldquo;pressed&rdquo; or &ldquo;not
              pressed&rdquo;. Using a native{" "}
              <code className="text-sm">&lt;button&gt;</code> with{" "}
              <code className="text-sm">aria-pressed</code> is the robust pattern.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function MuteToggle() {
  const [muted, setMuted] = useState(false)
  return (
    <button
      type="button"
      // role "button" comes free from the native element
      aria-pressed={muted}                 // state, announced on change
      aria-label={muted ? "Unmute" : "Mute"} // name reflects the action
      onClick={() => setMuted((m) => !m)}
    >
      <VolumeIcon aria-hidden="true" />
    </button>
  )
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Disclosure with state and relationship
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              <code className="text-sm">aria-expanded</code> exposes the open/closed
              state; <code className="text-sm">aria-controls</code> exposes the
              relationship to the region it shows and hides.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<button
  type="button"
  aria-expanded="false"   // state: collapsed -> updates to "true" on open
  aria-controls="faq-1"   // property: points at the controlled region
>
  Shipping &amp; returns
</button>
<div id="faq-1" hidden>...</div>`}</code>
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
                "Icon-only buttons and links with no accessible name — a screen reader announces just “button” or “link”. Add visible text, a visually-hidden label, or aria-label.",
                "Using a placeholder as the only label. Placeholders disappear on input, fail contrast, and are not a reliable accessible name. Use a real <label>.",
                "Building interactive controls from <div> or <span> with onClick — no role, no focus, no keyboard. Use a native <button> or <a href> instead.",
                "Setting a role but never updating the state. A custom toggle with role but no aria-pressed update never tells the user it changed.",
                "Linked images with no alt text, producing an empty link whose name is just the URL or nothing. Give the image alt text that describes the link's destination.",
                "Overriding a good visible name with a mismatched aria-label, so the visible text and the announced name disagree — confusing for voice-control users (see 2.5.3 Label in Name).",
                "Adding redundant ARIA to native elements (role=\"button\" on a <button>), which adds risk without benefit. Native semantics already satisfy 4.1.2.",
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
              How to test for 4.1.2
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inspect the accessibility tree",
                  d: "Open DevTools and use the Accessibility panel (Chrome, Firefox, Edge). For each interactive element, confirm the computed Name is meaningful, the Role is correct, and the states reflect the current condition.",
                },
                {
                  t: "Tab through every control",
                  d: "Press Tab and check that every interactive element receives focus. Anything you can click with a mouse but cannot reach with the keyboard usually has the wrong role or none at all.",
                },
                {
                  t: "Run an automated scanner",
                  d: "axe DevTools and Lighthouse reliably flag empty buttons, links with no name, and form fields with no label — the bulk of 4.1.2 failures — across a page at once.",
                },
                {
                  t: "Listen with a screen reader",
                  d: "With NVDA or VoiceOver, move to each control and confirm it announces a sensible name, role, and state. Toggle controls and verify the new state (pressed, expanded, checked) is announced.",
                },
                {
                  t: "Check state changes are announced",
                  d: "Activate toggles, accordions, and tabs and confirm the change is reported — not just visually shown. Silent state changes are the most missed part of 4.1.2.",
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
              Audit a live page with the{" "}
              <Link
                href="/tools/url-accessibility-auditor"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                URL Accessibility Auditor
              </Link>
              , generate correct labels with the{" "}
              <Link
                href="/tools/accessibility-code-generator"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Accessibility Code Generator
              </Link>
              , and follow the full process in our{" "}
              <Link
                href="/guides/screen-reader-testing"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Screen Reader Testing guide
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
                  Structure and relationships must be programmatically
                  determinable too. 4.1.2 names the controls; 1.3.1 exposes how
                  they relate to labels, groups, and regions.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/1-1-1"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    1.1.1 Non-text Content
                  </Link>{" "}
                  — A
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Alt text on a linked image is what gives that link its
                  accessible name. Empty alt on a functional image is both a 1.1.1
                  and a 4.1.2 failure.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/2-1-1"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    2.1.1 Keyboard
                  </Link>{" "}
                  — A
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  A correct role is only useful if the control is operable. Custom
                  widgets must be focusable and keyboard-operable as well as
                  correctly named.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  4.1.3 Status Messages — AA
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  The sibling criterion for messages that are not tied to a
                  control — using ARIA live regions so updates are announced
                  without moving focus.
                </p>
              </div>
            </div>
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
            content="name role value accessible name ARIA aria-label aria-labelledby aria-pressed role button custom component accessibility tree screen reader form label programmatically determinable WCAG 4.1.2 robust keyboard"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
