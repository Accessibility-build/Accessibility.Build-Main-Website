import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 3.2.5 Change on Request — Complete Guide",
  description:
    "Guide to WCAG 3.2.5 Change on Request: context changes only when users ask — no auto-redirects, auto-refresh, or surprise popups. Examples, code, and testing.",
  keywords: [
    "WCAG 3.2.5",
    "Change on Request",
    "change of context",
    "auto redirect accessibility",
    "auto refresh accessibility",
    "onchange submit",
    "new window warning",
    "predictable navigation",
    "Level AAA",
    "WCAG 2.2",
    "predictable",
  ],
  alternates: {
    canonical: "/wcag/3-2-5",
  },
  openGraph: {
    title: "WCAG 3.2.5 Change on Request — No Surprise Context Changes (Level AAA)",
    description:
      "The definitive guide to WCAG 3.2.5: changes of context happen only when the user requests them, or can be turned off. Auto-redirects, refreshes, popups, and onchange submits — with code and testing.",
    url: "/wcag/3-2-5",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%203.2.5%20Change%20on%20Request&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.2.5 Change on Request guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.2.5 Change on Request — Level AAA Guide",
    description:
      "Changes of context are initiated only by user request, or a mechanism exists to turn them off. Auto-redirects, auto-refresh, popups, and onchange submits explained.",
    images: [
      {
        url: "/api/og?title=WCAG%203.2.5%20Change%20on%20Request&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 3.2.5 Change on Request require?",
    a: "It requires that changes of context — navigating to a new page, opening a new window, moving focus, or significantly rearranging the content — are initiated only by an explicit user request, or that a mechanism is available to turn such automatic changes off. It is a Level AAA success criterion under Guideline 3.2 Predictable. In short: the page changes when the user asks it to, not when a timer, a script, or an incidental interaction decides.",
  },
  {
    q: "What exactly counts as a 'change of context'?",
    a: "WCAG defines it as a major change in the content of the page that, if made without user awareness, can disorient users. The defined categories are: change of user agent (e.g. launching another application), change of viewport (new window or tab, or a significant scroll/jump), change of focus, and changes of content that alter the meaning of the page (such as replacing the main content region). Ordinary content updates — expanding an accordion, showing a validation message, updating a live region — are not changes of context.",
  },
  {
    q: "How is 3.2.5 different from 3.2.1 On Focus and 3.2.2 On Input?",
    a: "3.2.1 (A) says receiving focus must not trigger a change of context. 3.2.2 (A) says changing a setting (typing, selecting an option) must not trigger one unless the user was warned beforehand. 3.2.5 (AAA) generalizes both and removes the warning loophole: no context change from any cause — timers, focus, input, page load — unless the user explicitly requested it or can switch the behavior off. A select that submits on change with advance warning passes 3.2.2 but still fails 3.2.5.",
  },
  {
    q: "Do automatic redirects fail 3.2.5?",
    a: "Client-side timed redirects do — a page that waits five seconds and then sends you elsewhere is a context change nobody requested. The conforming pattern is either a server-side redirect (instant, before the page renders, so the user never experiences a change) or a page that presents a link the user activates themselves. The same logic applies to auto-refresh: use server-side technologies or let the user request the update, rather than reloading on a timer they cannot stop.",
  },
  {
    q: "Can I still open links in a new window or tab under 3.2.5?",
    a: "Yes — when the user is the one requesting it. Clicking a link is a user request; the debate is whether the user knows the request includes a new window. Best practice is to open in the same tab by default and, where a new window is genuinely justified, say so in the link's accessible name ('opens in new window'). A new window that opens spontaneously — on page load, on a timer, or as an advertising popup — is a clear failure.",
  },
  {
    q: "How do 'turn it off' mechanisms satisfy 3.2.5?",
    a: "The criterion offers an alternative to strict user-initiation: a mechanism to disable the automatic changes. Examples: a live sports score page that auto-refreshes but offers a visible 'Pause automatic updates' toggle; a kiosk flow with auto-advance that can be switched to manual; a preference that stops articles from auto-loading the next story. The mechanism must be easy to find and itself accessible — burying the switch three menus deep defeats the purpose.",
  },
]

export default function WCAG325Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 3.2.5: Change on Request"
        description="Changes of context are initiated only by user request or a mechanism is available to turn off such changes"
        criteria="3.2.5"
        level="AAA"
        principle="Understandable"
        guideline="3.2 Predictable"
        url="https://accessibility.build/wcag/3-2-5"
        category="Predictable"
        relatedCriteria={["3.2.1", "3.2.2", "2.2.1", "2.2.2"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="3.2.5 Change on Request" />

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
                Capstone of Guideline 3.2
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.2.5: Change on Request
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Nothing disorients a user faster than a page that acts on its own — a
              redirect mid-read, a popup stealing focus, a form that submits because
              you touched a dropdown. This criterion states the whole philosophy of
              predictable design in one line:{" "}
              <strong className="text-slate-900 dark:text-white">
                the context changes only when the user asks it to
              </strong>{" "}
              — or the user can turn the automatic behavior off.
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
              Changes of context are initiated only by user request or a mechanism is
              available to turn off such changes.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Two routes to conformance: make every context change user-initiated, or —
              where automation is genuinely valuable, like live-updating data — give
              the user an accessible switch to disable it.
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
                  What counts as a change of context
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
                  Relationship to 3.2.1 and 3.2.2
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
                  t: "Screen reader users",
                  d: "A screen reader narrates one place at a time. When the page swaps underneath — a redirect, a focus jump, a refreshed region — the narration is yanked to somewhere new with no explanation, and the user must rebuild their mental map from scratch.",
                },
                {
                  t: "Screen magnifier users",
                  d: "Someone viewing the page at 400% sees a small window onto it. An unrequested change happening outside that window is simply invisible — the page appears to have transformed by magic.",
                },
                {
                  t: "People with cognitive disabilities",
                  d: "Unexpected changes break concentration and can be genuinely distressing. Predictability — the page does what I asked, and only that — is a core cognitive accessibility principle.",
                },
                {
                  t: "People who need more time",
                  d: "Auto-refresh and timed redirects assume everyone reads at the same speed. Users with motor or reading disabilities lose their place, their form input, or the content itself when the timer fires first.",
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
              What counts as a change of context
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              WCAG defines a change of context as a major change that, made without
              the user&rsquo;s awareness, can disorient them. Four categories:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  t: "Change of viewport",
                  d: "Opening a new window or tab, launching another application, or jumping the scroll position substantially.",
                },
                {
                  t: "Change of focus",
                  d: "Moving keyboard focus somewhere the user did not put it — into a dialog, onto a different field, back to the top of the page.",
                },
                {
                  t: "Navigation",
                  d: "Loading a different page: redirects, auto-submitting forms, links followed by script rather than by click.",
                },
                {
                  t: "Content that changes meaning",
                  d: "Replacing or rearranging the main content so the page effectively becomes a different page — not minor updates like an expanding accordion.",
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              A <em>user request</em> is an explicit, intentional action whose purpose
              is that change: activating a link or button, submitting a form via its
              submit control, choosing &ldquo;open in new tab.&rdquo; Merely focusing
              an element, typing into a field, or selecting an option in a dropdown is
              <em> not</em> a request to navigate — those are settings, and acting on
              them is exactly what this criterion prohibits.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The escape hatch: where automatic changes are central to the experience
              (live dashboards, auction pages, transit boards), provide an accessible
              mechanism — a pause button, a preference, a setting — that turns the
              automatic updates off. There are no other exceptions.
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
                  ✓ Passes 3.2.5
                </h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A country selector with an explicit &ldquo;Go&rdquo; button — the
                    dropdown itself changes nothing.
                  </li>
                  <li>
                    A moved page handled by an HTTP 301 server-side redirect — the user
                    never experiences a mid-page jump.
                  </li>
                  <li>
                    A live scoreboard that auto-updates but has a prominent, accessible
                    &ldquo;Pause updates&rdquo; toggle.
                  </li>
                  <li>
                    A PDF link labelled &ldquo;Annual report (PDF, opens in new
                    window)&rdquo; — the new viewport is part of what the user
                    knowingly requested.
                  </li>
                  <li>
                    A dialog that opens — and moves focus — only when the user clicks
                    the button that summons it.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 3.2.5
                </h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    <code className="font-mono">&lt;meta http-equiv=&quot;refresh&quot;&gt;</code>{" "}
                    redirecting or reloading the page on a timer with no off switch.
                  </li>
                  <li>
                    A language dropdown that navigates the instant an option is
                    selected (onchange submit).
                  </li>
                  <li>
                    A newsletter modal that opens by itself after eight seconds and
                    steals keyboard focus.
                  </li>
                  <li>
                    A news homepage that silently reloads every 60 seconds, losing the
                    reader&rsquo;s scroll position.
                  </li>
                  <li>
                    A carousel whose rotation replaces the page&rsquo;s main content
                    region with no pause control.
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
              Select menus: add a real submit control
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Selecting an option is adjusting a setting, not requesting navigation.
              Keyboard users who arrow through options in an onchange-submitting
              select are ripped away on the very first arrow press.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Navigates the moment an option is chosen -->
<select onchange="location = this.value">
  <option value="/en">English</option>
  <option value="/fr">Français</option>
</select>

<!-- ✓ The user requests the change explicitly -->
<form action="/set-language" method="get">
  <label for="lang">Language</label>
  <select id="lang" name="lang">
    <option value="en">English</option>
    <option value="fr">Français</option>
  </select>
  <button type="submit">Apply</button>
</form>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Redirects: do them server-side, or hand the user a link
            </h3>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Timed client-side redirect: a context change on a timer -->
<meta http-equiv="refresh" content="5;url=https://example.com/new-home">

<!-- ✓ Server-side (Next.js): the user never sees an intermediate page -->
// next.config.js
async redirects() {
  return [
    { source: "/old-home", destination: "/new-home", permanent: true },
  ]
}

<!-- ✓ Or let the user initiate it -->
<p>This page has moved.
   <a href="/new-home">Continue to the new page</a></p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Live updates with an off switch
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When automatic updating is the feature, the pause mechanism is what
              earns conformance — make it visible, keyboard-operable, and honest.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<button type="button" aria-pressed="false" id="pause-updates">
  Pause automatic updates
</button>
<div id="scores" aria-live="polite">…</div>

<script>
  let timer = setInterval(refreshScores, 30000)
  const btn = document.getElementById("pause-updates")
  btn.addEventListener("click", () => {
    const paused = btn.getAttribute("aria-pressed") === "true"
    btn.setAttribute("aria-pressed", String(!paused))
    btn.textContent = paused
      ? "Pause automatic updates"
      : "Resume automatic updates"
    if (paused) timer = setInterval(refreshScores, 30000)
    else clearInterval(timer)
  })
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
                "Timed client-side redirects (meta refresh or setTimeout + location) that move the user with no action on their part and no way to opt out.",
                "Pages that auto-refresh on an interval, discarding scroll position, focus, and half-typed form input.",
                "Select menus, radio groups, or checkboxes that submit a form or navigate as a side effect of being set.",
                "Popups, modals, chat widgets, and cookie walls that open unprompted and capture keyboard focus.",
                "Opening new windows on page load or on a timer, rather than in response to an informed user action.",
                "Focus being moved by script when the user did not trigger anything — e.g. yanking focus to an error summary while the user is still typing.",
                "Single-page apps that replace the main content region in response to background events (websocket pushes) with neither user request nor a disable mechanism.",
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
              How to test for 3.2.5
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Load the page and wait — touch nothing",
                  d: "Sit on the page for a few minutes. Watch for redirects, reloads, popups, focus movement, or the main content rearranging itself. Any context change during this idle period was, by definition, not user-requested.",
                },
                {
                  t: "Grep for the usual suspects",
                  d: "Search the source for meta http-equiv=\"refresh\", window.open outside click handlers, location assignments inside setTimeout/setInterval, and submit() or navigation calls inside change/focus/blur handlers.",
                },
                {
                  t: "Operate every form control by keyboard",
                  d: "Tab to each select, radio group, and checkbox and change its value with arrow keys and Space. The page must not navigate, submit, open windows, or move focus as you do. Only activating an explicit submit control may cause the change.",
                },
                {
                  t: "Follow links and buttons, watching the viewport",
                  d: "Confirm windows and tabs open only from explicit activation, and that anything opening a new viewport says so in its accessible name. Dialogs may move focus only as the direct result of the user summoning them.",
                },
                {
                  t: "Hunt for the off switch on anything automatic",
                  d: "Where content legitimately auto-updates, verify a mechanism exists to turn it off, that it is discoverable near the updating content, keyboard-accessible, and that it genuinely stops the context changes.",
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
              Automated tools flag meta refresh but little else here — the rest is
              behavioral testing. Record what you find in your{" "}
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
              Relationship to 3.2.1 and 3.2.2
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Guideline 3.2 Predictable escalates in three steps.{" "}
              <Link href="/wcag/3-2-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.2.1 On Focus
              </Link>{" "}
              (A) forbids context changes when a component merely receives focus.{" "}
              <Link href="/wcag/3-2-2" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.2.2 On Input
              </Link>{" "}
              (A) forbids them when a setting is changed — unless the user was advised
              of the behavior beforehand. 3.2.5 (AAA) closes every remaining gap: it
              covers changes triggered by <em>anything</em> — timers, page load,
              background events — and drops 3.2.2&rsquo;s advance-warning loophole. A
              flow that passes 3.2.5 automatically passes both Level A siblings.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The timing dimension connects to Guideline 2.2:{" "}
              <Link href="/wcag/2-2-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                2.2.1 Timing Adjustable
              </Link>{" "}
              (A) governs time limits (including redirect delays), and{" "}
              <Link href="/wcag/2-2-2" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                2.2.2 Pause, Stop, Hide
              </Link>{" "}
              (A) covers moving and auto-updating content. An auto-refreshing page
              frequently fails all three at once — and one &ldquo;pause
              updates&rdquo; control frequently fixes all three at once.
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

          <CriterionLinks number="3.2.5" />
        </article>
      </div>
    </>
  )
}
