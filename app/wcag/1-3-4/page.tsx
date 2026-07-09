import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 1.3.4 Orientation — Portrait and Landscape",
  description:
    "WCAG 1.3.4 Orientation explained: content must work in portrait and landscape unless one orientation is essential. Media query examples and testing steps.",
  keywords: [
    "WCAG 1.3.4",
    "Orientation",
    "portrait landscape accessibility",
    "screen orientation lock",
    "rotate your device overlay",
    "orientation media query",
    "mounted device accessibility",
    "1.3.4 test",
    "Level AA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/1-3-4",
  },
  openGraph: {
    type: "website",
    title: "WCAG 1.3.4 Orientation — Portrait and Landscape",
    description:
      "Content must not restrict its view and operation to a single display orientation unless essential. Who it helps, the essential exception, CSS examples, testing.",
    url: "/wcag/1-3-4",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%201.3.4%20Orientation&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.3.4 Orientation guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.3.4 Orientation — Portrait and Landscape",
    description:
      "Content must not restrict its view and operation to a single display orientation unless essential. Who it helps, the essential exception, CSS examples, testing.",
    images: ["/api/og?title=WCAG%201.3.4%20Orientation&section=WCAG"],
  },
}

const faqs = [
  {
    q: "What does WCAG 1.3.4 Orientation require?",
    a: "It requires that content does not restrict its view and operation to a single display orientation, such as portrait or landscape, unless a specific display orientation is essential. In other words: whichever way the user's device is turned, your content must display and function. You do not have to make both orientations look identical — layouts can and should adapt — but you cannot lock users into one orientation or show a 'please rotate your device' wall. It was introduced in WCAG 2.1 at Level AA and is unchanged in WCAG 2.2.",
  },
  {
    q: "Who is harmed when a site forces one orientation?",
    a: "Chiefly people whose device orientation is fixed. Wheelchair users often have a phone or tablet mounted to the chair in a set orientation; people with limited hand or arm mobility may have a device mounted on a bed frame or stand they cannot easily adjust; some people with dexterity impairments physically cannot rotate a device quickly or at all. For them, 'just rotate your phone' is not an option — a portrait-locked app on a landscape-mounted tablet is simply unusable.",
  },
  {
    q: "What counts as 'essential' under the orientation exception?",
    a: "An orientation is essential only when the content fundamentally cannot serve its purpose the other way. The Understanding document's examples include a bank check for mobile deposit (checks have a fixed landscape aspect ratio) and a piano keyboard application (a usable keyboard needs landscape width). Slides projected for an audience and some VR content are also cited. What is never essential: your designer preferring portrait, the layout being 'not optimized' for landscape yet, or analytics saying most users hold phones vertically.",
  },
  {
    q: "Does 1.3.4 mean both orientations must show the same layout?",
    a: "No. Adapting the layout is encouraged — showing more columns in landscape, rearranging panels, moving navigation — as long as the same content and functionality are available and operable in both orientations. What fails is restriction: blocking one orientation, hiding content or controls in it, or rendering an interface that cannot actually be used when rotated. Responsive design that reflows with orientation is exactly the intended solution.",
  },
  {
    q: "Is using the Screen Orientation API to lock orientation always a failure?",
    a: "Locking the content to one orientation fails 1.3.4 unless the essential exception genuinely applies. Web apps can attempt screen.orientation.lock() (and hybrid/native wrappers have manifest settings like 'orientation': 'portrait'); using those to hard-lock a general-purpose app is the canonical failure. Note the flip side: if the user has locked their own device's orientation in system settings, that is the user's choice and not your failure — the criterion governs restrictions the content imposes.",
  },
  {
    q: "How do I test 1.3.4 quickly?",
    a: "On a real phone or tablet with device auto-rotate enabled, load each key screen and rotate between portrait and landscape. Verify all content is visible, nothing is cut off, no overlay demands a specific orientation, and every task can be completed both ways. In desktop DevTools, toggle the device emulator's rotate button for a fast first pass — but confirm on real hardware, because emulators don't run the native-wrapper or manifest-level locks that cause many real-world failures. Also grep the codebase for orientation.lock and orientation manifest keys.",
  },
]

const passFailExamples = [
  {
    verdict: "pass" as const,
    t: "Responsive app that reflows on rotation",
    d: "A messaging app shows a single conversation column in portrait and adds the conversation list beside it in landscape. Different layouts, same content and functions — exactly what the criterion intends.",
  },
  {
    verdict: "pass" as const,
    t: "Check-deposit capture screen locked to landscape",
    d: "A banking app locks only its check-photo screen to landscape because a check's fixed aspect ratio makes landscape capture essential. The rest of the app works in both orientations.",
  },
  {
    verdict: "fail" as const,
    t: "'Please rotate your device' overlay",
    d: "A dashboard shows a full-screen overlay in portrait telling users to switch to landscape, hiding all content behind it. Users with mounted devices can never get past it.",
  },
  {
    verdict: "fail" as const,
    t: "Web app calls screen.orientation.lock('portrait')",
    d: "A quiz app locks itself to portrait for visual polish. On a landscape-mounted tablet the content renders sideways, restricting view and operation to one orientation without an essential reason.",
  },
  {
    verdict: "fail" as const,
    t: "Landscape hides the submit button",
    d: "A form works in portrait, but in landscape a fixed header and keyboard leave the submit button unreachable and non-scrollable. The orientation isn't blocked, but operation in it is — still a failure.",
  },
]

export default function WCAG134Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.3.4: Orientation"
        description="Content does not restrict its view to a single display orientation."
        criteria="1.3.4"
        level="AA"
        principle="Perceivable"
        guideline="1.3 Adaptable"
        url="https://accessibility.build/wcag/1-3-4"
        category="Adaptable"
        relatedCriteria={["1.3.5", "1.4.10", "1.4.4"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="1.3.4 Orientation" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Level AA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 1: Perceivable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                New in WCAG 2.1
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.3.4: Orientation
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              &ldquo;Please rotate your device&rdquo; assumes the user can. Many
              cannot — their tablet is mounted to a wheelchair, a bed frame, or
              an arm stand in one fixed position. This criterion is direct:{" "}
              <strong className="text-slate-900 dark:text-white">
                content must display and operate in both portrait and landscape
              </strong>
              , unless a specific orientation is genuinely essential to what the
              content does.
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
              Content does not restrict its view and operation to a single
              display orientation, such as portrait or landscape, unless a
              specific display orientation is essential.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Note the pairing: <em>view and operation</em>. It is not enough
              that content technically renders when rotated — it must also
              remain usable. And the exception is deliberately narrow:{" "}
              <em>essential</em> means the content cannot fulfill its purpose in
              the other orientation, not that one orientation was designed
              first.
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
                  The requirement and the essential exception
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              This criterion exists because for a significant group of users,
              device orientation is not a preference — it is fixed by their
              equipment:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "People with mounted devices",
                  d: "Wheelchair users commonly have a phone or tablet fixed to the chair; others mount devices to beds, desks, or hospital equipment. The mount's orientation is the orientation.",
                },
                {
                  t: "People with limited dexterity or strength",
                  d: "Rotating a device requires grip, wrist rotation, and coordination. For users with tremor, arthritis, paralysis, or limb difference, a forced rotation can be difficult or impossible.",
                },
                {
                  t: "People with low vision",
                  d: "Some users deliberately choose landscape for longer line lengths at large text sizes. A portrait-locked experience takes that adaptation away.",
                },
                {
                  t: "Everyone with a propped-up device",
                  d: "A phone in a car mount, a tablet in a kitchen stand, a device lying flat where auto-rotate misfires — orientation flexibility is universal design in the most literal sense.",
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
              The requirement and the essential exception
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The rule covers both halves of the user experience in each
              orientation:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "View: all content renders in both orientations. No orientation shows a blocking overlay, blank screen, sideways layout, or cut-off regions with no way to reach them.",
                "Operation: every task can be completed in both orientations. Controls remain reachable and usable — a visible layout with an unreachable submit button still fails.",
                "No forced lock: the content itself must not pin the orientation via the Screen Orientation API, app-manifest orientation settings, or CSS that only functions one way.",
              ].map((r) => (
                <li
                  key={r}
                  className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <span aria-hidden="true" className="text-blue-500 font-bold">
                    →
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {r}
                  </span>
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              When is an orientation &ldquo;essential&rdquo;?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Rarely. The Understanding document offers a short list of the kind
              of content that qualifies: a{" "}
              <strong className="text-slate-900 dark:text-white">
                bank check capture screen
              </strong>{" "}
              (checks have a fixed landscape geometry), a{" "}
              <strong className="text-slate-900 dark:text-white">
                piano keyboard application
              </strong>{" "}
              (a playable keyboard needs landscape width), projector{" "}
              <strong className="text-slate-900 dark:text-white">slides</strong>
              , and some{" "}
              <strong className="text-slate-900 dark:text-white">
                virtual reality
              </strong>{" "}
              content. Even then, scope the lock to the specific screen that
              needs it — the check capture view, not the whole banking app.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              What does not qualify: brand preference, an unfinished landscape
              layout, &ldquo;most users hold their phones this way,&rdquo; or a
              game that was simply designed portrait-first. If the purpose of
              the content survives rotation, the orientation is not essential.
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
            <ul className="space-y-3">
              {passFailExamples.map((ex) => (
                <li
                  key={ex.t}
                  className={
                    ex.verdict === "pass"
                      ? "flex gap-3 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-4"
                      : "flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                  }
                >
                  <span
                    aria-hidden="true"
                    className={
                      ex.verdict === "pass"
                        ? "text-emerald-600 font-bold"
                        : "text-rose-500 font-bold"
                    }
                  >
                    {ex.verdict === "pass" ? "✓" : "✗"}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">
                      {ex.verdict === "pass" ? "Pass — " : "Fail — "}
                      {ex.t}.
                    </strong>{" "}
                    {ex.d}
                  </span>
                </li>
              ))}
            </ul>
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
              Adapt with orientation media queries — never block
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                orientation
              </code>{" "}
              media feature is your friend when used to <em>rearrange</em>{" "}
              content, and a failure when used to hide it.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✗ Failing: portrait users get a wall instead of the app */
@media (orientation: portrait) {
  .app        { display: none; }
  .rotate-nag { display: flex; }   /* "Please rotate your device" */
}

/* ✓ Passing: both orientations work; layout adapts */
.gallery {
  display: grid;
  grid-template-columns: 1fr;      /* portrait: single column */
}
@media (orientation: landscape) {
  .gallery {
    grid-template-columns: 1fr 1fr; /* landscape: two columns */
  }
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Don&rsquo;t lock orientation in JavaScript or the manifest
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Search your codebase for these — they are the programmatic
              versions of the rotate-your-device wall.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// ✗ Failing: hard-locks a general-purpose app to portrait
await screen.orientation.lock("portrait");

/* ✗ Failing: PWA manifest pinning every screen to one orientation */
{
  "name": "My App",
  "display": "standalone",
  "orientation": "portrait"
}

/* ✓ Passing: let the platform rotate freely */
{
  "name": "My App",
  "display": "standalone"
  /* omit "orientation", or use "any" */
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Design for short viewports, not just narrow ones
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Most landscape breakage is really a short-viewport bug: a phone in
              landscape is ~400px tall, and fixed headers plus non-scrolling
              containers swallow the content. Test with height, not only width.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✓ Keep tall fixed chrome from eating short landscape viewports */
@media (orientation: landscape) and (max-height: 500px) {
  .site-header { position: static; }   /* stop pinning the header */
  .modal {
    max-height: 90dvh;                 /* dynamic viewport height */
    overflow-y: auto;                  /* content scrolls, not vanishes */
  }
}`}</code>
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
                "Full-screen 'please rotate your device' overlays that hide all content in one orientation.",
                "Calling screen.orientation.lock() (or equivalent wrapper APIs) to pin a general-purpose app to one orientation.",
                "Setting \"orientation\": \"portrait\" (or landscape) in a PWA or hybrid app manifest without an essential reason.",
                "Modals and menus that cannot scroll in landscape on phones, leaving confirm buttons below a short viewport with no way to reach them.",
                "Fixed headers, footers, and cookie banners that together consume a short landscape viewport, hiding the actual content.",
                "Interactive canvases or games that only wire up touch coordinates for one orientation and misregister taps in the other.",
                "Claiming 'essential' for what is really a design preference — a portrait-first layout is a choice, not an essential orientation.",
                "Testing rotation only on the home screen: the failure is usually three screens deep, in the checkout modal or the video player.",
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
              How to test for 1.3.4
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Rotate a real device through your key journeys",
                  d: "With auto-rotate on, walk the critical flows — sign-up, search, checkout, media playback — in portrait, then repeat in landscape. Every step must be completable both ways.",
                },
                {
                  t: "Look for blocking behavior, not just broken layout",
                  d: "Watch specifically for rotate-nag overlays, blank screens, sideways-rendered content, and screens that snap back or refuse to rotate. Any content-imposed restriction is a failure candidate.",
                },
                {
                  t: "Check operation in the risky spots",
                  d: "In each orientation, open modals, dropdowns, and on-screen-keyboard flows. Confirm buttons remain reachable (scrolling counts) and nothing interactive is trapped off-screen in the short landscape viewport.",
                },
                {
                  t: "Audit the code for locks",
                  d: "Search for screen.orientation.lock, orientationchange hacks, \"orientation\" keys in web app manifests, and @media (orientation: …) blocks that set display: none on primary content. Each hit needs an essential justification or a fix.",
                },
                {
                  t: "Use emulators for breadth, hardware for truth",
                  d: "DevTools device mode's rotate toggle catches CSS-level problems fast across many viewport sizes. But manifest and API locks only manifest on real devices or installed PWAs, so finish on hardware.",
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
              Orientation problems cluster with the other responsive criteria —
              if a screen fails here it often fails{" "}
              <Link
                href="/wcag/1-4-10"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.4.10 Reflow
              </Link>{" "}
              too. Track both in the{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>
              .
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

          <CriterionLinks number="1.3.4" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="orientation portrait landscape rotate device screen orientation lock mounted device wheelchair tablet media query responsive short viewport essential orientation WCAG 1.3.4 Level AA adaptable"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
