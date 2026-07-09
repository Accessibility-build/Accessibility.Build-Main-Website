import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { FAQStructuredData } from "@/components/seo/structured-data"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 2.2.6 Timeouts — Warn Users About Data Loss",
  description:
    "WCAG 2.2.6 Timeouts explained: warn users how long inactivity can last before data is lost, unless data is preserved over 20 hours. Patterns, wording, testing.",
  keywords: [
    "WCAG 2.2.6",
    "Timeouts",
    "inactivity timeout warning",
    "data loss warning",
    "20 hours data preservation",
    "session timeout accessibility",
    "Level AAA",
    "WCAG 2.1 new criteria",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/2-2-6",
  },
  openGraph: {
    title: "WCAG 2.2.6 Timeouts — Warn Users About Data Loss",
    description:
      "Users must be warned of the duration of inactivity that causes data loss — unless data is preserved for more than 20 hours. How to conform, with examples.",
    url: "/wcag/2-2-6",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%202.2.6%20Timeouts&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.2.6 Timeouts guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.2.6 Timeouts — Warn Users About Data Loss",
    description:
      "Warn users up front how much inactivity causes data loss, or preserve their data for more than 20 hours. Examples and testing steps.",
    images: [
      {
        url: "/api/og?title=WCAG%202.2.6%20Timeouts&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    question: "What does WCAG 2.2.6 Timeouts require?",
    answer:
      "It requires that users are warned of the duration of any user inactivity that could cause data loss, unless the data is preserved for more than 20 hours when the user does not take any actions. You have two ways to conform: tell users at the start of a task how long they can be inactive before their work is discarded (for example, 'Your information is kept for 30 minutes of inactivity'), or simply preserve their data for more than 20 hours so no warning is needed. It is a Level AAA criterion added in WCAG 2.1.",
  },
  {
    question: "Why 20 hours specifically?",
    answer:
      "The Working Group chose 20 hours so that a user can step away for a full day — sleep included — and return to find their work intact. If data survives more than 20 hours of inactivity, an inactivity timeout effectively cannot ambush anyone mid-task, so the warning becomes unnecessary and the exception applies. Anything shorter, even 'generous' windows like 8 or 12 hours, still requires the up-front warning.",
  },
  {
    question: "Where and when should the warning appear?",
    answer:
      "At the start of the process, before the user invests effort — not only in a last-minute countdown dialog. The W3C's intent is that users can decide in advance whether they can complete the task in the available rhythm, and plan around it. Good placements: a note at the top of the form or checkout ('You can be inactive for up to 15 minutes without losing your progress'), on the login page for session-based apps, or in a persistent help area referenced from the flow.",
  },
  {
    question: "How is 2.2.6 different from 2.2.1 Timing Adjustable?",
    answer:
      "2.2.1 (Level A) is about controlling time limits: users must be able to turn off, adjust, or extend them, but security-essential session limits often fall under its exceptions. 2.2.6 (AAA) attacks the residual harm: whatever timeout remains must be disclosed up front if it can destroy data — or defused entirely by preserving data for more than 20 hours. 2.2.5 Re-authenticating (AAA) then covers restoring data across the re-login itself. The three together: control the limit, disclose the limit, survive the limit.",
  },
  {
    question: "Does auto-saving data satisfy 2.2.6 without any warning?",
    answer:
      "Yes, if the saved data genuinely persists for more than 20 hours of inactivity. Auto-saving drafts server-side keyed to the account is the cleanest route: the timeout can still log the user out for security, but their work waits for them past the 20-hour mark, so the exception applies and no warning is required. Watch the details: the preservation must cover everything the user entered, not just some fields, and purge policies shorter than 20 hours void the exception.",
  },
  {
    question: "Does 2.2.6 apply to privacy-driven timeouts, like clearing a screen on a shared kiosk?",
    answer:
      "The criterion still applies — inactivity that discards the user's entered data is exactly its subject — but conformance can be achieved with the warning route: state clearly at the start that, for privacy, the form clears after N minutes of inactivity. The W3C notes that privacy regulations or genuine security constraints may shape how data can be retained; where retention is inappropriate, disclosure is the conforming path.",
  },
]

export default function WCAG226Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.2.6: Timeouts"
        description="Users are warned of the duration of any user inactivity that could cause data loss, unless the data is preserved for more than 20 hours when the user does not take any actions."
        criteria="2.2.6"
        level="AAA"
        principle="Operable"
        guideline="2.2 Enough Time"
        url="https://accessibility.build/wcag/2-2-6"
        category="Enough Time"
        relatedCriteria={["2.2.1", "2.2.3", "2.2.5"]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="2.2.6 Timeouts" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Level AAA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 2: Operable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                New in WCAG 2.1
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.2.6: Timeouts
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Inactivity timeouts are invisible until they strike. A user pauses to
              find a document, help a child, or rest — and returns to a cleared form.
              This criterion offers a simple bargain:{" "}
              <strong className="text-slate-900 dark:text-white">
                either warn users up front how long they can be inactive before
                losing data, or keep their data safe for more than 20 hours
              </strong>
              . Warn, or preserve. Pick one.
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
              Users are warned of the duration of any user inactivity that could
              cause data loss, unless the data is preserved for more than 20 hours
              when the user does not take any actions.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Two conforming routes, one criterion. The scope is specifically{" "}
              <em>inactivity</em> that causes <em>data loss</em> — a timeout that
              logs you out but keeps your work (see{" "}
              <Link href="/wcag/2-2-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                2.2.5 Re-authenticating
              </Link>
              ) does not lose data and needs no warning under this criterion.
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
              <li><a className="hover:underline" href="#routes">The two conforming routes</a></li>
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
              This criterion was added in WCAG 2.1 largely for people with cognitive
              and learning disabilities, and it protects anyone whose pace does not
              match the developer&rsquo;s timeout constant:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  t: "People with cognitive disabilities",
                  d: "Locating documents, processing instructions, or taking a needed break can consume an entire inactivity window. Knowing the limit in advance lets them prepare — or choose a better moment.",
                },
                {
                  t: "People with attention or memory disabilities",
                  d: "Task-switching is common and returning takes time. An undisclosed timeout converts a normal pause into lost work and a restarted task.",
                },
                {
                  t: "People with motor disabilities",
                  d: "Pauses for rest or repositioning are part of operating a device. 'Inactivity' often just means 'recovering'.",
                },
                {
                  t: "Anyone gathering information mid-form",
                  d: "Passport numbers, insurance details, bank statements — forms routinely demand documents users must go and find.",
                },
              ].map((item) => (
                <div key={item.t} className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.t}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The damage from a surprise timeout is not just repeated work — it is
              the erosion of trust that makes people abandon essential online tasks
              like benefits applications and medical forms.
            </p>
          </section>

          {/* Routes */}
          <section aria-labelledby="routes" className="mb-12">
            <h2 id="routes" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              The two conforming routes
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Route 1: Warn up front
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-2">
                  State the inactivity duration <em>at the start</em> of the task, in
                  plain language, where it cannot be missed:
                </p>
                <p className="rounded-lg bg-slate-100 dark:bg-slate-800 p-3 text-sm text-slate-700 dark:text-slate-300 italic">
                  &ldquo;For your security this form times out after 15 minutes of
                  inactivity, and unsaved information is deleted.&rdquo;
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-2">
                  The number must be accurate and cover the whole flow. A countdown
                  dialog near expiry is a good companion (and helps with 2.2.1), but
                  on its own it is not the up-front warning this criterion intends.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Route 2: Preserve for &gt; 20 hours
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-2">
                  Keep everything the user entered for more than 20 hours of
                  inactivity — server-side drafts keyed to the account are the
                  reliable version. Then the exception applies and no warning is
                  needed at all.
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  The session may still expire for security; what must survive is
                  the <em>data</em>. Pair with{" "}
                  <Link href="/wcag/2-2-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.2.5
                  </Link>{" "}
                  so re-login restores it seamlessly.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Route 2 is strictly better for users and increasingly cheap to build —
              which is why &ldquo;auto-save everything&rdquo; has become the default
              recommendation for long transactional flows.
            </p>
          </section>

          {/* Examples */}
          <section aria-labelledby="examples" className="mb-12">
            <h2 id="examples" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Pass and fail examples
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">✓ Passes 2.2.6</h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A tax filing service that auto-saves every entry to the account and keeps drafts for weeks — no warning needed.</li>
                  <li>A visa application whose first page states: &ldquo;Your session ends after 25 minutes of inactivity and unsaved answers are lost.&rdquo;</li>
                  <li>A checkout that keeps the cart and address data for 30 days, even though the login session lasts 20 minutes.</li>
                  <li>A kiosk form that explains at the start: &ldquo;For privacy, this screen clears after 2 minutes without input.&rdquo;</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">✗ Fails 2.2.6</h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A 40-field insurance form that silently discards everything after 20 minutes idle, with no mention anywhere.</li>
                  <li>A warning that exists only as a 60-second countdown modal — users who stepped away never see it.</li>
                  <li>&ldquo;Drafts are saved&rdquo; — but purged after 12 hours of inactivity, short of the 20-hour bar, with no disclosed duration.</li>
                  <li>A stated limit of 30 minutes while the real limit is 10 — an inaccurate warning is not a warning.</li>
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
              An up-front, unmissable timeout disclosure
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Put the disclosure in the natural reading order at the top of the task,
              not in a tooltip or footer.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<form aria-describedby="timeout-note">
  <h2>Apply for a parking permit</h2>
  <p id="timeout-note" class="notice">
    <strong>Heads up:</strong> for security, this form times out after
    <strong>15 minutes of inactivity</strong> and unsaved information is
    deleted. You can save a draft at any point with the “Save and continue
    later” button.
  </p>
  <!-- fields… -->
</form>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Route 2 in practice: durable server-side drafts
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Persist continuously with a retention comfortably past 20 hours; the
              security session can stay short.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// Client: debounce-save every change
form.addEventListener("input", debounce(async () => {
  await fetch("/api/drafts/permit-application", {
    method: "PUT",
    body: JSON.stringify(Object.fromEntries(new FormData(form))),
  });
}, 1000));

// Server: retention policy is the conformance point
// ✓ Keep drafts for 30 days — comfortably > 20 hours,
//   so the 2.2.6 exception applies and no warning is required.
await db.drafts.upsert({
  userId,
  formId: "permit-application",
  data,
  expiresAt: daysFromNow(30),
});`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Companion countdown warning (supports 2.2.1 as well)
            </h3>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- Announced immediately: imminent data loss is emergency-grade -->
<div role="alertdialog" aria-labelledby="to-title" aria-describedby="to-desc">
  <h2 id="to-title">Still there?</h2>
  <p id="to-desc">
    Your session ends in 2 minutes. Unsaved changes will be kept for
    30 days in your drafts.
  </p>
  <button type="button">Stay signed in</button>
  <button type="button">Save and sign out</button>
</div>`}</code>
            </pre>
          </section>

          {/* Common failures */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2 id="mistakes" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "No disclosure at all: the inactivity limit exists only in server config, and users discover it by losing work.",
                "Warning only at the last minute — a countdown modal cannot warn the user who already walked away, which is the very scenario the criterion targets.",
                "Vague wording ('your session may expire') without the duration; the criterion explicitly requires the duration of inactivity.",
                "Understating or misstating the limit, including forgetting that intermediate saves reset some timers but not others.",
                "Draft preservation that quietly expires at 4, 8, or 12 hours — short of 20 — while the team believes the exception applies.",
                "Preserving only part of the data (form fields but not uploads, or answers but not the user's position in a long wizard).",
                "Burying the disclosure in terms of service or a help page that the task flow never references.",
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
              How to test for 2.2.6
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Establish the real timeout behavior",
                  d: "For each flow that accepts user input, determine from the team or by observation: how long can the user be inactive before entered data is discarded? Include client-side clears, session expiry, and draft purge policies.",
                },
                {
                  t: "Check the exception first",
                  d: "If data provably survives more than 20 hours of inactivity — verify the retention policy end to end, including uploads and wizard position — the criterion is satisfied and you are done.",
                },
                {
                  t: "Otherwise, find the up-front warning",
                  d: "Look at the start of the task, before meaningful effort is invested. The warning must state the duration of allowable inactivity, in visible text (not a tooltip, footer, or buried policy).",
                },
                {
                  t: "Verify the stated duration is accurate",
                  d: "Time it. Enter data, go idle, and confirm the data survives until the stated limit and the warning matches reality across the whole flow, not just the first page.",
                },
                {
                  t: "Test perception with assistive technology",
                  d: "Confirm a screen reader encounters the disclosure in reading order, and that any countdown dialog is announced (role='alertdialog'), focusable, and operable by keyboard.",
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
              Like the rest of the 2.2.x AAA criteria, this is behavioral testing that
              no scanner can perform. Keep it in your manual audit script and the full{" "}
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

          <CriterionLinks number="2.2.6" />
        </article>
      </div>
    </>
  )
}
