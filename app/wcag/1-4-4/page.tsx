import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 1.4.4 Resize Text — 200% Zoom Without Breakage",
  description:
    "WCAG 1.4.4 Resize Text explained: text must scale to 200% without losing content or function. Requirements, exceptions, CSS examples, and how to test.",
  keywords: [
    "WCAG 1.4.4",
    "Resize Text",
    "text resize 200%",
    "browser zoom accessibility",
    "text scaling",
    "rem vs px accessibility",
    "user-scalable no",
    "low vision text size",
    "1.4.4 test",
    "Level AA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/1-4-4",
  },
  openGraph: {
    type: "website",
    title: "WCAG 1.4.4 Resize Text — 200% Zoom Without Breakage",
    description:
      "Text must be resizable up to 200% without assistive technology and without loss of content or functionality. Requirements, CSS examples, and testing steps.",
    url: "/wcag/1-4-4",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%201.4.4%20Resize%20Text&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.4.4 Resize Text guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.4.4 Resize Text — 200% Zoom Without Breakage",
    description:
      "Text must be resizable up to 200% without assistive technology and without loss of content or functionality. Requirements, CSS examples, and testing steps.",
    images: ["/api/og?title=WCAG%201.4.4%20Resize%20Text&section=WCAG"],
  },
}

const faqs = [
  {
    q: "What does WCAG 1.4.4 Resize Text require?",
    a: "It requires that, except for captions and images of text, text can be resized without assistive technology up to 200 percent without loss of content or functionality. In plain terms: when a user doubles the size of the text — with browser zoom or a text-size setting, not a screen magnifier — everything must still be readable and every feature must still work. Nothing may be clipped, overlapped, truncated, or hidden, and no control may become unusable. It is a Level AA success criterion in WCAG 2.0, 2.1, and 2.2.",
  },
  {
    q: "Does browser zoom count, or does 1.4.4 require text-only resizing?",
    a: "Browser zoom counts. The criterion is satisfied if any mechanism provided by the user agent — full-page zoom, text-only scaling, or a text-size control offered by the page itself — lets the user reach 200% text size without breakage. Because every modern browser ships full-page zoom, the most common test is simply pressing Ctrl/Cmd and + until the browser reports 200% and checking that nothing is lost. Text-only scaling (a Firefox option) is a stricter, useful additional check because it stresses fixed-height containers harder.",
  },
  {
    q: "What are the exceptions to 1.4.4?",
    a: "The normative text names exactly two: captions and images of text. Captions on video are rendered inside the video frame, so their size is governed by the player rather than page zoom. Images of text cannot be resized cleanly because they pixelate — they are instead restricted by 1.4.5 Images of Text, which pushes you to use real text in the first place. Everything else — body copy, headings, navigation, form labels, text inside buttons and inputs — must resize to 200% without loss.",
  },
  {
    q: "Does 'without assistive technology' mean screen magnifiers don't count?",
    a: "Correct. The phrase means users must not be forced to buy or install assistive technology such as a dedicated screen magnifier to read the text. The resizing has to be achievable with what the platform and browser already provide — browser zoom, text scaling settings, or a control on the page. If your page only stays usable when viewed through third-party magnification software, it fails.",
  },
  {
    q: "How is 1.4.4 different from 1.4.10 Reflow?",
    a: "They are complementary. 1.4.4 (WCAG 2.0) says text at 200% must not lose content or functionality — horizontal scrolling is tolerated as long as nothing breaks. 1.4.10 Reflow (added in WCAG 2.1) goes further: at 400% zoom on a 1280px-wide viewport (equivalent to 320 CSS pixels), content must reflow into a single column with no two-dimensional scrolling, except for content like data tables and maps that needs two dimensions. Build with relative units and responsive layout and you will usually satisfy both at once.",
  },
  {
    q: "Does using px for font-size automatically fail 1.4.4?",
    a: "No. Browser full-page zoom scales px text just like rem text, so px font sizes alone are not a failure. The problems come from what surrounds the text: fixed pixel heights with overflow hidden that clip enlarged text, layouts that overlap at 200%, viewport-unit (vw) font sizes that ignore zoom entirely, and viewport meta tags that disable zoom on mobile (user-scalable=no or maximum-scale=1). Relative units like rem are still the more robust choice because they also respect the user's default text-size setting.",
  },
]

const passFailExamples = [
  {
    verdict: "pass" as const,
    t: "Article zooms cleanly to 200%",
    d: "A blog post uses rem-based type and min-height containers. At 200% browser zoom the text enlarges, containers grow with it, and every link and button remains visible and clickable.",
  },
  {
    verdict: "pass" as const,
    t: "On-page text size control",
    d: "A news site offers an 'A / A+ / A++' widget that scales all page text up to at least 200%. Because a mechanism to reach 200% without loss exists, the criterion is satisfied.",
  },
  {
    verdict: "fail" as const,
    t: "Clipped navigation at 200%",
    d: "A header sets height: 60px with overflow: hidden. At 200% zoom the enlarged menu labels are cut in half and the last two menu items disappear entirely — loss of content and functionality.",
  },
  {
    verdict: "fail" as const,
    t: "Zoom disabled on mobile",
    d: "The viewport meta tag includes user-scalable=no. Users on phones cannot enlarge text at all, so text cannot be resized up to 200% by any user-agent mechanism.",
  },
  {
    verdict: "fail" as const,
    t: "Overlapping text in cards",
    d: "Card titles are absolutely positioned over fixed-size images. At 200% the enlarged titles overlap the card body text, making both unreadable even though nothing is technically hidden.",
  },
]

export default function WCAG144Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.4.4: Resize Text"
        description="Text can be resized up to 200% without loss of content or functionality."
        criteria="1.4.4"
        level="AA"
        principle="Perceivable"
        guideline="1.4 Distinguishable"
        url="https://accessibility.build/wcag/1-4-4"
        category="Distinguishable"
        relatedCriteria={["1.4.5", "1.4.10", "1.4.12"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="1.4.4 Resize Text" />

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
                Guideline 1.4 Distinguishable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.4.4: Resize Text
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Millions of people read the web with the text turned up. This
              criterion guarantees that they can:{" "}
              <strong className="text-slate-900 dark:text-white">
                text must be resizable up to 200% without losing any content or
                functionality
              </strong>
              . If doubling the text size clips a heading, hides a menu item, or
              breaks a button, the page fails — no assistive technology required
              to trigger the problem, and none allowed as the excuse for it.
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
              Except for captions and images of text, text can be resized without
              assistive technology up to 200 percent without loss of content or
              functionality.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Three load-bearing phrases: <em>without assistive technology</em>{" "}
              (the browser or platform must be enough — users cannot be forced to
              install a magnifier), <em>up to 200 percent</em> (double the
              default size), and <em>without loss of content or functionality</em>{" "}
              (nothing clipped, truncated, overlapped, or broken).
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
                  The requirement and its exceptions
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
              The primary audience is people with{" "}
              <strong className="text-slate-900 dark:text-white">
                low vision who do not use screen magnification software
              </strong>
              . That group is enormous: it includes people with mild visual
              impairments, age-related presbyopia, and temporary conditions like
              eye strain or dilated pupils after an eye exam. For most of them,
              bumping the browser zoom to 150% or 200% is the entire coping
              strategy — they never install assistive technology, so the page
              itself has to survive the zoom.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Zoomed text also helps people with reading and cognitive
              disabilities such as dyslexia, who often find larger text easier to
              track line by line, and anyone reading in poor conditions — bright
              sunlight on a phone, a laptop across the room, a presentation
              projected to the back of a hall.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The failure mode is quiet but severe. A page that clips its
              navigation at 200% does not look broken to the developer at 100% —
              but for the user who needs the zoom, half the site simply
              disappears. That is why the criterion insists on{" "}
              <em>no loss of content or functionality</em>, not merely
              &ldquo;still mostly readable.&rdquo;
            </p>
          </section>

          {/* Requirement */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The requirement and its exceptions
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The requirement applies to all text rendered on the page: body
              copy, headings, navigation, form labels, text inside form controls,
              button text, error messages, tooltips. Any user-agent mechanism may
              be used to reach 200% — full-page zoom, text-only scaling, or a
              resize control the page provides itself. The user must not need
              assistive technology, and at 200%:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "No content may be lost — text must not be clipped by fixed-height containers, truncated with ellipses that hide meaning, or pushed behind other elements.",
                "No functionality may be lost — every link, button, form field, and menu must remain visible, reachable, and operable.",
                "Horizontal scrolling is permitted at 200% (unlike 1.4.10 Reflow at 400%), as long as scrolling actually reveals all the content.",
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
              The two exceptions
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Captions
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Captions rendered inside a video frame are sized by the media
                  player, not the page, so page zoom is not expected to scale
                  them. Good players still offer their own caption-size settings.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Images of text
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Text baked into a bitmap pixelates when enlarged, so it is
                  exempt here — but{" "}
                  <Link
                    href="/wcag/1-4-5"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    1.4.5 Images of Text
                  </Link>{" "}
                  separately requires you to use real text instead wherever the
                  technology allows.
                </p>
              </div>
            </div>
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
              Never disable zoom in the viewport meta tag
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The single most damaging anti-pattern is one line of HTML.{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                user-scalable=no
              </code>{" "}
              or{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                maximum-scale=1
              </code>{" "}
              blocks pinch-zoom on mobile, so no user-agent mechanism can enlarge
              the text.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Failing: zoom disabled, text can never reach 200% on mobile -->
<meta name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

<!-- ✓ Passing: users can zoom freely -->
<meta name="viewport" content="width=device-width, initial-scale=1" />`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Let containers grow with their text
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Fixed pixel heights plus{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                overflow: hidden
              </code>{" "}
              is where zoomed text goes to die. Use relative units and{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                min-height
              </code>{" "}
              so boxes expand when the text does.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✗ Failing: enlarged text is clipped at 200% */
.banner {
  height: 60px;
  overflow: hidden;
  font-size: 14px;
}

/* ✓ Passing: the container grows with its content */
.banner {
  min-height: 3.75rem;
  font-size: 0.875rem;   /* rem tracks the user's text-size setting too */
  line-height: 1.5;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Beware viewport-unit font sizes
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Text sized purely in{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                vw
              </code>{" "}
              units does not respond to text scaling and can resist zoom — the
              documented failure F94. If you want fluid type, combine a viewport
              unit with a rem component inside{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                clamp()
              </code>
              .
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✗ Failing: pure vw text ignores the user's text-size preference */
h1 {
  font-size: 4vw;
}

/* ✓ Passing: fluid, but anchored to rem so it still scales for the user */
h1 {
  font-size: clamp(1.5rem, 1rem + 2.5vw, 3rem);
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
                "Disabling zoom with user-scalable=no or maximum-scale=1 in the viewport meta tag, blocking all text resizing on mobile.",
                "Fixed-height containers with overflow: hidden that clip or swallow text once it grows (documented failure F69).",
                "Text-based form controls that do not resize with the surrounding text, leaving labels large but input text tiny (failure F80).",
                "Font sizes in viewport units (vw/vh) alone, which ignore both text scaling and, in some configurations, zoom (failure F94).",
                "Absolutely positioned text blocks that overlap neighboring content at 200%, making both unreadable.",
                "Truncating enlarged text with ellipses so that critical words — prices, dates, button labels — are cut off with no way to reveal them.",
                "Testing only at desktop widths: a layout can pass at 1920px and fail at 1366px, where 200% zoom leaves half the columns off-screen with no scrollbar.",
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
              How to test for 1.4.4
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Zoom the browser to 200%",
                  d: "Press Ctrl/Cmd and + until the browser reports 200% (or set it directly in the browser menu). Walk through the page: read every block of text, open every menu, and confirm nothing is clipped, overlapped, or missing.",
                },
                {
                  t: "Exercise every interactive element at 200%",
                  d: "Content surviving is only half the criterion. Submit the form, open the dropdown, dismiss the modal, use the search box — all while zoomed. A button pushed off-screen with no way to scroll to it is a loss of functionality.",
                },
                {
                  t: "Try text-only scaling",
                  d: "In Firefox, enable View → Zoom → Zoom Text Only and scale to 200%. Text-only scaling stresses fixed-size containers much harder than full-page zoom and quickly exposes clipping and overlap that page zoom hides.",
                },
                {
                  t: "Check the viewport meta tag and pinch-zoom on mobile",
                  d: "View source and look for user-scalable=no or maximum-scale in the viewport meta tag. Then actually pinch-zoom on a real phone — some in-app browsers ignore the tag, so verify the behavior, not just the markup.",
                },
                {
                  t: "Run automated checks, then verify manually",
                  d: "Automated tools (axe, Lighthouse) reliably flag the zoom-blocking viewport meta tag, and Lighthouse flags maximum-scale below 5. But no tool can judge whether your layout loses content at 200% — that verdict requires human eyes at zoom.",
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
              Make the 200% pass part of every visual QA round, and work through
              the full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>{" "}
              for the neighboring criteria — 1.4.10 Reflow and 1.4.12 Text
              Spacing fail in the very same layouts.
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

          <CriterionLinks number="1.4.4" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="resize text 200 percent browser zoom text scaling low vision rem units viewport meta user-scalable pinch zoom reflow text spacing fixed height overflow hidden clipped text WCAG 1.4.4 Level AA distinguishable"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
