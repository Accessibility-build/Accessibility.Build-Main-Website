import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { FAQStructuredData } from "@/components/seo/structured-data"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 2.2.5 Re-authenticating — No Data Loss on Login",
  description:
    "WCAG 2.2.5 Re-authenticating explained: when a session expires, users must be able to continue without losing data after logging back in. Patterns and testing.",
  keywords: [
    "WCAG 2.2.5",
    "Re-authenticating",
    "session expiry data loss",
    "preserve form data",
    "session timeout accessibility",
    "re-authentication",
    "Level AAA",
    "WCAG 2.2",
    "enough time",
  ],
  alternates: {
    canonical: "/wcag/2-2-5",
  },
  openGraph: {
    title: "WCAG 2.2.5 Re-authenticating — No Data Loss on Login",
    description:
      "When an authenticated session expires, the user can continue the activity without loss of data after re-authenticating. Server and client patterns that make it work.",
    url: "/wcag/2-2-5",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%202.2.5%20Re-authenticating&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.2.5 Re-authenticating guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.2.5 Re-authenticating — No Data Loss on Login",
    description:
      "Session expired mid-task? Users must be able to log back in and continue without losing data. How to build it and how to test it.",
    images: [
      {
        url: "/api/og?title=WCAG%202.2.5%20Re-authenticating&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    question: "What does WCAG 2.2.5 Re-authenticating require?",
    answer:
      "It requires that when an authenticated session expires, the user can continue the activity without loss of data after re-authenticating. Sessions are allowed to expire — security policies are untouched — but expiry must not destroy the user's work. If someone spends forty minutes writing a support request, gets logged out, and signs back in, their draft must still be there and the flow must continue where it left off.",
  },
  {
    question: "Does 2.2.5 prevent me from using session timeouts?",
    answer:
      "No. The criterion explicitly accommodates security-driven session expiry; it regulates the consequence, not the timeout. You may end sessions as aggressively as your security model demands, provided the user's in-progress data survives the round trip through the login screen. This is what makes 2.2.5 compatible with banking, healthcare, and government applications that require short sessions.",
  },
  {
    question: "How do sites typically preserve data across re-authentication?",
    answer:
      "Two W3C-documented approaches: (1) server-side — encode or temporarily store the submitted data when the server detects the expired session, run the user through re-authentication, then complete or re-display the original submission (techniques G105 and G181); (2) client-side — keep the work in the browser (unsent form state, local drafts) and re-authenticate in a separate tab, overlay, or iframe so the original page never unloads. Auto-saving drafts continuously is the most robust pattern because it also covers crashes and accidental navigation.",
  },
  {
    question: "What about sensitive data that should not be stored?",
    answer:
      "The W3C guidance acknowledges this: where data must not be retained (say, payment details on a shared terminal), re-encountering the form is acceptable if the data could not legitimately be saved — but the design should still minimize loss, for example by preserving the non-sensitive fields and clearly telling users what they will need to re-enter. The spirit of the criterion is that users never silently lose work they could reasonably expect to be kept.",
  },
  {
    question: "How does 2.2.5 relate to 2.2.1 Timing Adjustable and 2.2.6 Timeouts?",
    answer:
      "They cover three moments of the same lifecycle. 2.2.1 (Level A) requires that time limits, including session limits, can be turned off, adjusted, or extended before they fire — though it has an 'essential' exception that security timeouts often use. 2.2.6 (AAA) requires warning users up front how much inactivity causes data loss. 2.2.5 (AAA) handles the aftermath: once expiry happens, re-login must restore the user's context and data. A well-built app satisfies all three with one architecture: warn, extend, auto-save, restore.",
  },
  {
    question: "Who benefits most from 2.2.5?",
    answer:
      "Anyone who works slower than the session clock: screen reader users navigating long forms linearly, people with motor disabilities for whom each field takes longer to complete, people with cognitive disabilities who need pauses or re-reads, and people who are simply interrupted — a parent, a nurse on shift, anyone on a shared computer that enforces short sessions. Losing thirty minutes of effort is discouraging for anyone; for users for whom that effort was physically expensive, it can mean abandoning the task permanently.",
  },
]

export default function WCAG225Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.2.5: Re-authenticating"
        description="When an authenticated session expires, the user can continue the activity without loss of data after re-authenticating."
        criteria="2.2.5"
        level="AAA"
        principle="Operable"
        guideline="2.2 Enough Time"
        url="https://accessibility.build/wcag/2-2-5"
        category="Enough Time"
        relatedCriteria={["2.2.1", "2.2.3", "2.2.6"]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="2.2.5 Re-authenticating" />

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
              WCAG 2.2.5: Re-authenticating
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              You spend forty minutes on a form. The session expires. You log back in
              — and everything is gone. That experience is exactly what this
              criterion forbids.{" "}
              <strong className="text-slate-900 dark:text-white">
                Sessions may expire, but re-authenticating must return the user to
                their activity with their data intact
              </strong>
              . Security keeps its timeouts; users keep their work.
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
              When an authenticated session expires, the user can continue the
              activity without loss of data after re-authenticating.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Note the framing: the criterion does not restrict <em>when</em> or{" "}
              <em>why</em> sessions expire. It restricts what expiry is allowed to
              cost the user — nothing.
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
              <li><a className="hover:underline" href="#patterns">Implementation patterns</a></li>
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Session lengths are calibrated to an imagined average user. Real users
              routinely take longer:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  t: "Screen reader users",
                  d: "A long form is traversed field by field, with each label, hint, and error read aloud. Twenty-minute sessions expire mid-form as a matter of routine.",
                },
                {
                  t: "People with motor disabilities",
                  d: "Switch access or on-screen keyboards can multiply input time by ten. Re-entering lost data is not an annoyance — it is a physically expensive ordeal.",
                },
                {
                  t: "People with cognitive disabilities",
                  d: "Reading assistance, breaks, and double-checking take time. Fear of the session clock adds anxiety that makes errors more likely.",
                },
                {
                  t: "Anyone who gets interrupted",
                  d: "Caregivers, workers on call, people on shared or public machines with enforced short sessions. Life happens mid-task.",
                },
              ].map((item) => (
                <div key={item.t} className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.t}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              When lost work must be redone, the cost lands hardest on the users for
              whom the work was slowest — a perfectly regressive penalty. 2.2.5
              removes it.
            </p>
          </section>

          {/* Patterns */}
          <section aria-labelledby="patterns" className="mb-12">
            <h2 id="patterns" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Implementation patterns
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The W3C documents both server-side and client-side routes. Most robust
              products combine them.
            </p>
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  1. Server-side: park the submission, re-authenticate, resume
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  When a request arrives with an expired session, do not discard the
                  payload. Store it temporarily (or round-trip it as hidden encoded
                  data), send the user through login, then complete the original
                  action or re-display the form pre-filled. This is W3C techniques
                  G105 (saving data so it can be used after re-authentication) and
                  G181 (encoding user data in the re-authorization flow).
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  2. Client-side: re-authenticate without unloading the page
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Detect expiry and open the login step in a dialog or new tab while
                  the original page — and everything typed into it — stays alive.
                  After login succeeds, retry the pending request. The user may never
                  even perceive an interruption.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  3. Continuous auto-save of drafts
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Persist work-in-progress every few seconds — to the server keyed to
                  the account, or locally as a fallback. On the next authenticated
                  visit, restore the draft and tell the user. This pattern also
                  satisfies the data-preservation route of{" "}
                  <Link href="/wcag/2-2-6" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.2.6 Timeouts
                  </Link>{" "}
                  if drafts are kept for more than 20 hours.
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
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">✓ Passes 2.2.5</h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A webmail client that keeps the half-written email in the compose window while the user re-logs-in via a dialog, then sends it.</li>
                  <li>A government benefits application that auto-saves each section; after re-authentication the user lands on the section they left.</li>
                  <li>A checkout that detects an expired session on submit, stores the order payload, and completes the order right after login.</li>
                  <li>A CMS that restores an unsaved draft — with a visible &ldquo;draft restored&rdquo; notice — when the author signs back in.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">✗ Fails 2.2.5</h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>Submitting a long form after expiry redirects to the login page and the payload is discarded.</li>
                  <li>Logging back in always lands on the dashboard; the multi-step wizard restarts at step one.</li>
                  <li>A survey platform that invalidates all answered questions when the session token lapses.</li>
                  <li>An expiry dialog whose only option is &ldquo;Log in again&rdquo; and which reloads the page, wiping the unsaved editor content.</li>
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
              Retry the failed request after in-place re-authentication
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Intercept the 401, hold the payload, re-authenticate in a dialog, and
              replay — the page, and the user&rsquo;s work, never unloads.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`async function submitWithReauth(url, payload) {
  let res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 401) {
    // Session expired: data stays in memory, page stays put.
    await openLoginDialog(); // accessible modal; resolves on success
    res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload), // ✓ same payload, nothing lost
      headers: { "Content-Type": "application/json" },
    });
  }
  return res;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Auto-save and restore a draft
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Continuous draft persistence makes session expiry (and crashes, and
              accidental tabs closed) a non-event. Tell the user when a draft is
              restored.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`const form = document.querySelector("#application-form");
const DRAFT_KEY = \`draft:\${form.dataset.formId}\`;

// Save on every change, debounced
let t;
form.addEventListener("input", () => {
  clearTimeout(t);
  t = setTimeout(() => {
    const data = Object.fromEntries(new FormData(form));
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    // Also POST to /drafts when the session is alive, so the
    // draft follows the account across devices.
  }, 800);
});

// Restore after (re-)login
const draft = localStorage.getItem(DRAFT_KEY);
if (draft) {
  for (const [name, value] of Object.entries(JSON.parse(draft))) {
    const field = form.elements.namedItem(name);
    if (field) field.value = value;
  }
  announce("We restored your unsaved draft from your last visit.");
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Server-side: park the payload through the login round-trip
            </h3>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// Express-style sketch of W3C technique G105
app.post("/applications", (req, res) => {
  if (!req.session.user) {
    // ✓ Park the submission instead of discarding it
    const parkId = crypto.randomUUID();
    parkedSubmissions.set(parkId, { body: req.body, expires: in20Hours() });
    return res.redirect(\`/login?resume=\${parkId}\`);
  }
  saveApplication(req.session.user, req.body);
});

app.post("/login", async (req, res) => {
  const user = await authenticate(req.body);
  const parked = parkedSubmissions.get(req.query.resume);
  if (parked) {
    saveApplication(user, parked.body); // ✓ complete the original action
    return res.redirect("/applications/confirmation");
  }
  res.redirect("/dashboard");
});`}</code>
            </pre>
          </section>

          {/* Common failures */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2 id="mistakes" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "Redirecting an expired-session POST to the login page and dropping the request body — the single most common failure mode.",
                "Full-page reload after re-login that discards unsent client state (rich-text editors, multi-step wizards, file selections).",
                "Restoring the session but not the place: the user is authenticated again but dumped at the home page with the wizard reset.",
                "Auto-save that only runs on explicit 'Save' — the criterion is about the data present when expiry strikes, which is precisely the unsaved part.",
                "Draft restoration that exists but is silent, so users assume the work is gone and start over anyway.",
                "CSRF token rotation on re-login that invalidates the held form, producing a cryptic error that costs the data after all.",
                "Preserving data on desktop flows but not in the places sessions are shortest — banking-style apps, kiosks, and shared-terminal modes.",
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
              How to test for 2.2.5
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Force an expiry mid-task",
                  d: "Start every significant authenticated activity — long form, editor, checkout, wizard — then kill the session (wait it out, delete the cookie, or invalidate it server-side). This is the whole test setup; the next steps are observations.",
                },
                {
                  t: "Try to continue via the normal path",
                  d: "Interact with the page or submit. Follow whatever re-authentication flow appears, exactly as a user would. No developer tools, no back-button tricks.",
                },
                {
                  t: "Verify the data survived",
                  d: "After logging back in, check every field, selection, uploaded file, and step position. 'Mostly restored' is a failure — the criterion says without loss of data.",
                },
                {
                  t: "Verify the activity continues",
                  d: "You should resume where you were: same wizard step, same editor state, or the parked action completed automatically. Landing authenticated-but-lost on a dashboard fails the 'continue the activity' clause.",
                },
                {
                  t: "Repeat with assistive technology",
                  d: "Run one pass with a screen reader: the expiry notice must be announced, the login dialog must be operable, and the restoration message must be perceivable — silent recovery helps nobody who cannot see it.",
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
              This criterion is untestable by automated scanners — it lives entirely
              in application behavior. Fold it into QA scenarios and the full{" "}
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

          <CriterionLinks number="2.2.5" />
        </article>
      </div>
    </>
  )
}
