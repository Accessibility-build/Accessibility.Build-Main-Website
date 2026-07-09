import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { FAQStructuredData } from "@/components/seo/structured-data"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 2.2.4 Interruptions — Postpone & Suppress Alerts",
  description:
    "WCAG 2.2.4 Interruptions explained: users must be able to postpone or suppress interruptions except emergencies. Notification patterns, code, and testing steps.",
  keywords: [
    "WCAG 2.2.4",
    "Interruptions",
    "postpone notifications",
    "suppress alerts accessibility",
    "auto-updating content",
    "focus stealing",
    "emergency exception",
    "Level AAA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/2-2-4",
  },
  openGraph: {
    title: "WCAG 2.2.4 Interruptions — Postpone & Suppress Alerts",
    description:
      "Interruptions can be postponed or suppressed by the user, except emergencies. Why focus-stealing popups and auto-updating feeds fail, and how to fix them.",
    url: "/wcag/2-2-4",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%202.2.4%20Interruptions&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.2.4 Interruptions guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.2.4 Interruptions — Postpone & Suppress Alerts",
    description:
      "Users must be able to postpone or suppress interruptions, except emergencies. Patterns, code, common failures, and testing.",
    images: [
      {
        url: "/api/og?title=WCAG%202.2.4%20Interruptions&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    question: "What does WCAG 2.2.4 Interruptions require?",
    answer:
      "It requires that interruptions — content updates, alerts, popups, and other events initiated by the page rather than the user — can be postponed or suppressed by the user, except when the interruption involves an emergency. In practice that means giving users a way to defer non-critical notifications until they finish what they are doing, or to switch them off entirely, typically through a preference setting or per-notification controls.",
  },
  {
    question: "What counts as an 'interruption'?",
    answer:
      "Anything the content initiates that redirects the user's attention away from their current activity: toast notifications, chat message popups, newsletter modals that appear mid-read, auto-updating news tickers or feeds that reflow content, alert dialogs announcing new features, automatic page refreshes, and content that moves focus without the user asking. User-initiated updates — clicking 'refresh results' — are not interruptions, because the user chose the moment.",
  },
  {
    question: "What qualifies for the emergency exception?",
    answer:
      "The W3C defines an emergency as a sudden, unexpected situation that could threaten health, safety, or property. Civil emergency alerts, a warning that the user's session is about to end with data loss, a security alert about their account, or a message that an action they took is causing harm all qualify. A sale announcement, a new-message badge, or a cookie banner does not. The bar is danger to the user, not importance to the business.",
  },
  {
    question: "How is 2.2.4 different from 2.2.1 Timing Adjustable and 2.2.2 Pause, Stop, Hide?",
    answer:
      "2.2.1 (A) governs time limits; 2.2.2 (A) governs moving, blinking, scrolling, and auto-updating content that plays alongside other content, requiring pause/stop/hide controls. 2.2.4 (AAA) is broader in one dimension: it covers any interruption of the user's activity — including dialogs, focus moves, and page refreshes that 2.2.2 does not reach — and it requires that users can postpone or suppress them, not merely pause a visual movement. A page can pass 2.2.2 (the ticker has a pause button) and still fail 2.2.4 (a chat popup keeps stealing focus with no way to turn it off).",
  },
  {
    question: "Does an automatic page refresh fail 2.2.4?",
    answer:
      "An automatic refresh or redirect that the user cannot disable is a classic interruption failure: it can move their reading position, reset a form, or yank a screen reader's virtual cursor back to the top of the page. To conform, let users opt out of auto-refresh (or make manual refresh the default), or use targeted live-region updates that add content without disturbing focus or scroll position.",
  },
  {
    question: "Is a notification preferences page enough to pass?",
    answer:
      "Usually, yes — a settings surface where users can suppress or defer each category of non-emergency notification is the canonical technique (W3C technique SCR14 describes making updates user-requestable). Two caveats: the preference must actually cover all interrupting content, and the default experience must not punish users before they find the setting — for example, focus-stealing modals on first page load still interrupt users who have had no chance to opt out.",
  },
]

export default function WCAG224Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.2.4: Interruptions"
        description="Interruptions can be postponed or suppressed by the user, except interruptions involving an emergency."
        criteria="2.2.4"
        level="AAA"
        principle="Operable"
        guideline="2.2 Enough Time"
        url="https://accessibility.build/wcag/2-2-4"
        category="Enough Time"
        relatedCriteria={["2.2.1", "2.2.2", "2.2.3"]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="2.2.4 Interruptions" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Level AAA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 2: Operable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Guideline 2.2 Enough Time
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.2.4: Interruptions
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A toast slides in. A chat window pops open. The news feed reflows and
              the paragraph you were reading jumps off-screen. For many users these
              are minor annoyances; for someone with an attention or memory
              disability, or a screen reader user whose reading position just got
              hijacked, they can end the task entirely.{" "}
              <strong className="text-slate-900 dark:text-white">
                2.2.4 requires that users can postpone or suppress interruptions
              </strong>{" "}
              — with one exception: genuine emergencies.
            </p>
          </header>

          {/* Official text */}
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
              Interruptions can be postponed or suppressed by the user, except
              interruptions involving an emergency.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              &ldquo;Emergency&rdquo; is a defined term: a sudden, unexpected
              situation or occurrence that requires immediate action to preserve
              health, safety, or property. Everything else — however important it
              feels to the product team — must be deferrable or silenceable.
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
              <li><a className="hover:underline" href="#who">Who this helps</a></li>
              <li><a className="hover:underline" href="#scope">What counts as an interruption</a></li>
              <li><a className="hover:underline" href="#examples">Pass and fail examples</a></li>
              <li><a className="hover:underline" href="#code">Code examples</a></li>
              <li><a className="hover:underline" href="#mistakes">Common failures</a></li>
              <li><a className="hover:underline" href="#testing">How to test</a></li>
              <li><a className="hover:underline" href="#faq">FAQ</a></li>
            </ul>
          </nav>

          {/* Who */}
          <section aria-labelledby="who" className="mb-12">
            <h2 id="who" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Who this helps
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  t: "People with attention disabilities",
                  d: "For users with ADHD, an interruption is not a blip — regaining deep focus on the original task can take many minutes, or not happen at all.",
                },
                {
                  t: "People with cognitive or memory disabilities",
                  d: "An alert that replaces the current context can erase working memory of what the user was doing and why.",
                },
                {
                  t: "Screen reader users",
                  d: "Focus-stealing dialogs and live updates can move the reading cursor mid-sentence, forcing the user to hunt for where they were.",
                },
                {
                  t: "People with low vision",
                  d: "Magnification shows a small viewport; content that shifts or reflows under an update means losing one's place completely.",
                },
              ].map((item) => (
                <div key={item.t} className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.t}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The common thread: interruptions cost different users wildly different
              amounts. Letting each user decide when — and whether — to receive them
              equalizes that cost.
            </p>
          </section>

          {/* Scope */}
          <section aria-labelledby="scope" className="mb-12">
            <h2 id="scope" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              What counts as an interruption
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              An interruption is content-initiated, not user-initiated. If the page
              decides the moment, it is an interruption; if the user asked for it, it
              is a response. Typical interrupters:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Toast and banner notifications announcing messages, promotions, or feature launches.",
                "Chat widgets that open themselves or play sounds when an agent 'joins'.",
                "Modals that appear on a timer — newsletter signups, exit-intent overlays, rating prompts.",
                "Auto-updating content: live feeds, tickers, dashboards, and scores that reflow the page.",
                "Automatic page refreshes or redirects that reset scroll position and focus.",
                "Scripted focus moves — anything that relocates keyboard focus without a user action.",
              ].map((m) => (
                <li key={m} className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                  <span aria-hidden="true" className="text-purple-500 font-bold">→</span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              For each of these you need at least one of two affordances:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Postpone</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  The user can defer the interruption to a moment they choose:
                  &ldquo;remind me later,&rdquo; a queued notification center they
                  open when ready, or updates that wait for an explicit
                  &ldquo;show new items&rdquo; action.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Suppress</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  The user can turn the interruption off entirely — per category, in
                  an easy-to-find preferences surface that persists across visits.
                </p>
              </div>
            </div>
          </section>

          {/* Examples */}
          <section aria-labelledby="examples" className="mb-12">
            <h2 id="examples" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Pass and fail examples
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">✓ Passes 2.2.4</h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A news page shows a &ldquo;12 new stories — show them&rdquo; button instead of injecting stories into the feed automatically.</li>
                  <li>A web app&rsquo;s settings include per-category notification toggles: mentions, marketing, tips, sounds.</li>
                  <li>A chat widget stays closed and silent until the user opens it; new-message state is a subtle badge.</li>
                  <li>A &ldquo;session ending in 2 minutes&rdquo; warning interrupts immediately — data loss qualifies as an emergency.</li>
                  <li>A dashboard offers &ldquo;pause live updates&rdquo; and remembers the choice.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">✗ Fails 2.2.4</h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A newsletter modal that opens 20 seconds into reading, every visit, with no way to prevent it.</li>
                  <li>A live-score ticker that reflows the article every few seconds and cannot be paused or disabled.</li>
                  <li>A chat popup that grabs keyboard focus when an agent sends a message mid-form-fill.</li>
                  <li>A page that meta-refreshes every 60 seconds, resetting the screen reader&rsquo;s reading position.</li>
                  <li>&ldquo;New feature&rdquo; announcement dialogs that cannot be dismissed permanently or deferred.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Code */}
          <section aria-labelledby="code" className="mb-12">
            <h2 id="code" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Code examples
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Let users request updates instead of pushing them
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Buffer incoming items and surface a polite, non-focus-stealing control.
              The user decides the moment of interruption.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<div aria-live="polite">
  <button id="show-new" hidden>Show 12 new stories</button>
</div>
<ol id="feed"><!-- existing stories --></ol>

<script>
  const buffer = [];
  socket.on("story", (story) => {
    buffer.push(story);                       // ✓ buffer, don't inject
    showNew.textContent = \`Show \${buffer.length} new stories\`;
    showNew.hidden = false;                   // announced politely, focus untouched
  });

  showNew.addEventListener("click", () => {
    feed.prepend(...buffer.map(render));      // ✓ user chose the moment
    buffer.length = 0;
    showNew.hidden = true;
  });
</script>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A persistent notification-preferences surface
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Suppression must be per-category, persistent, and reachable before the
              first interruption does damage.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<fieldset>
  <legend>Notifications</legend>
  <label>
    <input type="checkbox" name="notif" value="mentions" checked />
    Mentions and replies
  </label>
  <label>
    <input type="checkbox" name="notif" value="tips" />
    Tips and feature announcements
  </label>
  <label>
    <input type="checkbox" name="notif" value="marketing" />
    Offers and promotions
  </label>
  <label>
    <input type="checkbox" name="notif" value="sound" />
    Play a sound with notifications
  </label>
</fieldset>

<script>
  // Respect the stored preference before showing anything
  function maybeNotify(category, payload) {
    const prefs = JSON.parse(localStorage.getItem("notifPrefs") ?? "{}");
    if (prefs[category] === false) return;    // ✓ suppressed by the user
    queueToast(payload);                      // polite live region, no focus move
  }
</script>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Announce without stealing focus
            </h3>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ role="alert" + focus() for a routine update: maximal interruption -->
<div role="alert" tabindex="-1" id="promo">Check out our new plans!</div>
<script>promo.focus()</script>

<!-- ✓ Routine updates: polite live region, focus stays where the user is -->
<div aria-live="polite" id="status"></div>
<script>status.textContent = "Draft saved";</script>

<!-- ✓ Reserve role="alert" (assertive) for genuine emergencies only -->
<div role="alert">Your session expires in 2 minutes. Extend to keep your work.</div>`}</code>
            </pre>
          </section>

          {/* Common failures */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2 id="mistakes" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "Timed marketing modals (newsletter, discount, exit-intent) with no mechanism to postpone or permanently suppress them.",
                "Auto-updating feeds, tickers, and dashboards with no pause or 'update on request' option — often a 2.2.2 failure as well.",
                "Chat and support widgets that open themselves, play sounds, or take focus when the user has not engaged them.",
                "Automatic page refresh via meta refresh or scripted reload that the user cannot disable.",
                "Using assertive live regions (role='alert') for routine, non-emergency messages, forcing screen readers to announce them immediately over the user's current task.",
                "Notification settings that exist but do not persist, reset on each visit, or fail to cover major interrupting surfaces like in-app announcement dialogs.",
                "Treating business-important messages (sales, upgrade prompts) as 'emergencies' — the exception covers threats to health, safety, or property, including imminent data loss, and nothing else.",
              ].map((m) => (
                <li key={m} className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4">
                  <span aria-hidden="true" className="text-rose-500 font-bold">✗</span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2 id="testing" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              How to test for 2.2.4
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Sit on the page and wait",
                  d: "Load key pages and do nothing for several minutes. Note everything that appears, moves, refreshes, sounds, or changes without your input — each one is an interruption to evaluate.",
                },
                {
                  t: "Work through a task while interruptions fire",
                  d: "Fill a long form or read a long article while notifications arrive. Check whether focus ever moves without your action and whether your scroll or reading position is disturbed.",
                },
                {
                  t: "Look for postpone and suppress controls",
                  d: "For every interruption found, verify the user can defer it (notification center, 'show new items', 'remind me later') or disable it (persistent per-category preferences). At least one of the two must exist.",
                },
                {
                  t: "Verify persistence of preferences",
                  d: "Turn notifications off, reload, clear the session, and revisit. Suppression that silently resets is suppression that does not exist.",
                },
                {
                  t: "Audit the emergency claims",
                  d: "For any interruption exempted as an emergency, check it against the definition: immediate action needed to preserve health, safety, or property (including the user's data). Session-expiry warnings qualify; promotions never do.",
                },
              ].map((step, i) => (
                <li key={step.t} className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{step.t}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              Test with a screen reader running: interruptions that look mild visually
              are often severe aurally. Continue with the full{" "}
              <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                WCAG 2.2 checklist
              </Link>
              .
            </p>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq" className="mb-4">
            <h2 id="faq" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.question}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 p-5 [&_summary]:cursor-pointer"
                >
                  <summary className="font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between gap-4">
                    {f.question}
                    <span aria-hidden="true" className="text-slate-400 group-open:rotate-180 transition-transform">
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <CriterionLinks number="2.2.4" />
        </article>
      </div>
    </>
  )
}
