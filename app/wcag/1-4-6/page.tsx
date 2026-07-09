import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 1.4.6 Contrast (Enhanced) — 7:1 Ratio Guide",
  description:
    "WCAG 1.4.6 requires 7:1 text contrast (4.5:1 for large text) at Level AAA. The exact thresholds, exceptions, AAA vs AA differences, CSS examples, and testing.",
  keywords: [
    "WCAG 1.4.6",
    "Contrast Enhanced",
    "7:1 contrast ratio",
    "AAA contrast",
    "enhanced contrast text",
    "large text 4.5:1",
    "contrast ratio checker",
    "low vision contrast",
    "Level AAA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/1-4-6",
  },
  openGraph: {
    title: "WCAG 1.4.6 Contrast (Enhanced) — The 7:1 AAA Contrast Guide",
    description:
      "Level AAA contrast: 7:1 for normal text, 4.5:1 for large text, with exceptions for logos and incidental text. Thresholds, CSS palettes, and how to test.",
    url: "/wcag/1-4-6",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%201.4.6%20Contrast%20(Enhanced)&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.4.6 Contrast (Enhanced) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.4.6 Contrast (Enhanced) — The 7:1 AAA Guide",
    description:
      "Level AAA contrast: 7:1 for normal text, 4.5:1 for large text, with exceptions for logos and incidental text. Thresholds, CSS palettes, and testing.",
    images: ["/api/og?title=WCAG%201.4.6%20Contrast%20(Enhanced)&section=WCAG"],
  },
}

const faqs = [
  {
    q: "What does WCAG 1.4.6 Contrast (Enhanced) require?",
    a: "It requires the visual presentation of text and images of text to have a contrast ratio of at least 7:1, except that large-scale text (and images of large-scale text) needs at least 4.5:1. Three categories are exempt: incidental text (inactive controls, pure decoration, text invisible to everyone, or text inside a picture with significant other visual content) and logotypes — text in a logo or brand name has no contrast requirement. It is the Level AAA counterpart of 1.4.3 Contrast (Minimum), introduced in WCAG 2.0.",
  },
  {
    q: "What counts as large text for the 4.5:1 threshold?",
    a: "Large-scale text is at least 18 point (24 CSS pixels) at normal weight, or at least 14 point (about 18.66 CSS pixels) when bold. At those sizes the letterforms are easier to resolve, so the ratio relaxes to 4.5:1 — the same number that normal text needs at Level AA. Note these are effective rendered sizes: a 24px heading qualifies, a 16px bold label does not.",
  },
  {
    q: "How is 1.4.6 different from 1.4.3 Contrast (Minimum)?",
    a: "The structure is identical; only the numbers change. Level AA (1.4.3) requires 4.5:1 for normal text and 3:1 for large text. Level AAA (1.4.6) raises both bands: 7:1 for normal text and 4.5:1 for large text. The exceptions (incidental text and logotypes) are the same. One more difference worth knowing: the AA requirement for non-text elements like UI component boundaries comes from 1.4.11 (3:1) and does not change at AAA — 1.4.6 covers text only.",
  },
  {
    q: "Why 7:1 — where does the number come from?",
    a: "The 4.5:1 AA level was calibrated to compensate for the contrast sensitivity typically lost by users with 20/40 vision. The 7:1 AAA level extends that compensation to users with roughly 20/80 acuity — people with more significant low vision who do not use assistive technology such as screen magnifiers. For them, text that passes AA can still be genuinely hard to read; 7:1 restores about the same effective legibility.",
  },
  {
    q: "Do black-on-white and common dark themes pass 7:1?",
    a: "Pure black on white is 21:1, and near-black pairs like #1e293b on #ffffff (about 15:1) pass comfortably. Where designs fail AAA is mid-grey body text: the popular #6b7280 on white is roughly 4.8:1 — fine for AA, well short of 7:1. On dark themes, light-grey text such as #cbd5e1 on #0f172a passes (about 12:1), but dimmed secondary text often drops below 7:1. Always measure; intuition is unreliable near the threshold.",
  },
  {
    q: "Should I aim for AAA contrast everywhere?",
    a: "For body text, it is one of the cheapest AAA upgrades available — usually just darkening a few grey tokens. W3C does not recommend requiring AAA wholesale, and brand constraints may keep some accent-colored text at AA. A pragmatic policy many teams adopt: 7:1 for body and long-form reading text, at least 4.5:1 everywhere else, and an optional high-contrast theme (a mechanism to achieve enhanced contrast also satisfies the intent, per the Understanding document's sufficient techniques).",
  },
]

export default function WCAG146Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.4.6: Contrast (Enhanced)"
        description="The visual presentation of text and images of text has a contrast ratio of at least 7:1, except for large text (4.5:1), incidental text, and logotypes."
        criteria="1.4.6"
        level="AAA"
        principle="Perceivable"
        guideline="1.4 Distinguishable"
        url="https://accessibility.build/wcag/1-4-6"
        category="Distinguishable"
        relatedCriteria={["1.4.3", "1.4.11", "1.4.8"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="1.4.6 Contrast (Enhanced)" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Level AAA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 1: Perceivable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Guideline 1.4 Distinguishable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.4.6: Contrast (Enhanced)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Level AA contrast compensates for moderately low vision. This AAA criterion
              raises the bar for people with more significant vision loss:{" "}
              <strong className="text-slate-900 dark:text-white">
                text must reach a 7:1 contrast ratio, or 4.5:1 when it is large
              </strong>
              . For most designs it comes down to one change — stop using mid-grey for
              body text.
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
              The visual presentation of text and images of text has a contrast ratio of
              at least 7:1, except for the following: <strong>Large Text</strong> —
              large-scale text and images of large-scale text have a contrast ratio of at
              least 4.5:1; <strong>Incidental</strong> — text or images of text that are
              part of an inactive user interface component, that are pure decoration,
              that are not visible to anyone, or that are part of a picture that contains
              significant other visual content, have no contrast requirement;{" "}
              <strong>Logotypes</strong> — text that is part of a logo or brand name has
              no contrast requirement.
            </blockquote>
          </section>

          {/* Thresholds table */}
          <section aria-labelledby="thresholds" className="mb-12">
            <h2
              id="thresholds"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The thresholds: AAA vs AA at a glance
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  Contrast ratio requirements compared between Level AA and Level AAA
                </caption>
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Text category
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Level AA (1.4.3)
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Level AAA (1.4.6)
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  <tr className="border-t border-slate-200 dark:border-slate-800">
                    <th scope="row" className="px-4 py-3 font-medium">
                      Normal text (under 24px / under 18.66px bold)
                    </th>
                    <td className="px-4 py-3">4.5:1</td>
                    <td className="px-4 py-3 font-semibold">7:1</td>
                  </tr>
                  <tr className="border-t border-slate-200 dark:border-slate-800">
                    <th scope="row" className="px-4 py-3 font-medium">
                      Large text (≥ 18pt/24px, or ≥ 14pt/18.66px bold)
                    </th>
                    <td className="px-4 py-3">3:1</td>
                    <td className="px-4 py-3 font-semibold">4.5:1</td>
                  </tr>
                  <tr className="border-t border-slate-200 dark:border-slate-800">
                    <th scope="row" className="px-4 py-3 font-medium">
                      Incidental text and logotypes
                    </th>
                    <td className="px-4 py-3">No requirement</td>
                    <td className="px-4 py-3">No requirement</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The contrast ratio formula is the same one used at AA — based on the
              relative luminance of the two colors, ranging from 1:1 (identical) to 21:1
              (black on white). The AAA large-text threshold, 4.5:1, is deliberately the
              same number as the AA normal-text threshold: enlarging text buys you the
              same legibility that extra contrast would.
            </p>
          </section>

          {/* Who it helps */}
          <section aria-labelledby="who" className="mb-12">
            <h2
              id="who"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Who this helps
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "People with low vision (~20/80)",
                  d: "The 7:1 ratio was chosen to compensate for the contrast sensitivity lost at roughly 20/80 acuity — users who typically do not run magnification software and rely on the page as rendered.",
                },
                {
                  t: "Older users",
                  d: "Contrast sensitivity declines steadily with age. Enhanced contrast keeps body text readable for elderly readers without forcing zoom.",
                },
                {
                  t: "People with color vision deficiencies",
                  d: "The luminance-based ratio ignores hue, so text that reaches 7:1 stays readable regardless of which colors a user can distinguish.",
                },
                {
                  t: "Everyone in bad conditions",
                  d: "Sunlight glare, cheap panels, night-shifted screens, and low-brightness battery modes all eat contrast. A 7:1 baseline keeps text legible when conditions subtract from it.",
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

          {/* Pass / fail */}
          <section aria-labelledby="examples" className="mb-12">
            <h2
              id="examples"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Real color pairs: pass and fail
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                  ✓ Passes 7:1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>
                    <code className="font-mono">#1e293b</code> on{" "}
                    <code className="font-mono">#ffffff</code> — about 15.0:1
                  </li>
                  <li>
                    <code className="font-mono">#374151</code> on{" "}
                    <code className="font-mono">#ffffff</code> — about 10.3:1
                  </li>
                  <li>
                    <code className="font-mono">#e2e8f0</code> on{" "}
                    <code className="font-mono">#0f172a</code> — about 14.3:1
                  </li>
                  <li>
                    <code className="font-mono">#1d4ed8</code> on{" "}
                    <code className="font-mono">#ffffff</code> — about 7.3:1 (a rare
                    saturated blue that clears AAA)
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">
                  ✗ Fails 7:1 (normal-size text)
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>
                    <code className="font-mono">#6b7280</code> on{" "}
                    <code className="font-mono">#ffffff</code> — about 4.8:1 (passes AA,
                    fails AAA)
                  </li>
                  <li>
                    <code className="font-mono">#2563eb</code> on{" "}
                    <code className="font-mono">#ffffff</code> — about 5.2:1 (link blue:
                    AA yes, AAA no)
                  </li>
                  <li>
                    <code className="font-mono">#dc2626</code> on{" "}
                    <code className="font-mono">#ffffff</code> — about 4.8:1
                  </li>
                  <li>
                    <code className="font-mono">#94a3b8</code> on{" "}
                    <code className="font-mono">#0f172a</code> — about 6.5:1, just under
                    the line
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Code examples */}
          <section aria-labelledby="code" className="mb-12">
            <h2
              id="code"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              CSS patterns for AAA contrast
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              1. Encode the thresholds in your design tokens
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The reliable route to AAA is a palette whose text tokens are measured once
              and reused everywhere — not per-page color choices.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`:root {
  --bg: #ffffff;
  --text-body: #1f2937;      /* 14.7:1 on --bg → AAA normal text */
  --text-secondary: #374151; /* 10.3:1 → AAA, even for fine print */
  --text-large: #4b5563;     /* 7.6:1 — fine anywhere, required ≥4.5:1
                                 only if ≥24px or ≥18.66px bold */
  --link: #1d4ed8;           /* 7.3:1 → AAA for inline links */
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f172a;
    --text-body: #e2e8f0;    /* 14.3:1 on --bg */
    --text-secondary: #cbd5e1; /* 12.0:1 */
    --link: #93c5fd;         /* 9.0:1 */
  }
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              2. Offer a high-contrast theme as a mechanism
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The Understanding document accepts providing a mechanism to switch to an
              enhanced-contrast presentation. Honoring the OS-level preference costs a
              few lines.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* Respect the user's OS contrast preference */
@media (prefers-contrast: more) {
  :root {
    --text-body: #000000;
    --text-secondary: #111827;
    --bg: #ffffff;
    --link: #1e40af;
  }
}

/* Or a user-selectable theme */
[data-theme="high-contrast"] {
  --text-body: #000000;
  --bg: #ffffff;
  --link: #0000ee;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              3. Watch text over images and gradients
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The ratio must hold against the <em>actual</em> pixels behind each letter.
              A scrim guarantees a measurable background.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`.hero {
  position: relative;
  background: url("/hero.jpg") center / cover;
}

.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgb(15 23 42 / 0.82); /* dark scrim */
}

.hero h1 {
  position: relative;   /* above the scrim */
  color: #f8fafc;       /* measure against scrim ≈ 13:1 */
}`}</code>
            </pre>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2
              id="testing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How to test for 1.4.6
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Run an automated scan at the AAA level",
                  d: "axe DevTools, WAVE, and Lighthouse can all evaluate contrast; configure or filter for the AAA thresholds (7:1 / 4.5:1). This catches most solid-color text instantly.",
                },
                {
                  t: "Spot-check with an eyedropper tool",
                  d: "Use a contrast checker (e.g. our color contrast tool, or WebAIM's) on representative pairs: body text, secondary text, links, buttons, text in cards and banners. Record the ratios against both thresholds.",
                },
                {
                  t: "Classify text sizes correctly",
                  d: "For every pair below 7:1, check whether the text truly qualifies as large: at least 24 CSS pixels, or at least 18.66 CSS pixels and bold. If yes, it needs 4.5:1; if not, it fails.",
                },
                {
                  t: "Check states and overlays",
                  d: "Hover, focus, visited, disabled-looking-but-active, dark mode, and text over images or gradients — contrast must hold in every rendered state, measured against the actual background behind the glyphs.",
                },
                {
                  t: "Apply the exceptions deliberately",
                  d: "Exclude genuine logotypes, truly inactive controls, and decorative text — and nothing else. 'Our brand grey' on a button label is not a logotype exception.",
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
              Measure any pair instantly with the{" "}
              <Link
                href="/tools/color-contrast-checker"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Color Contrast Checker
              </Link>
              , which reports both the AA and AAA verdicts for normal and large text.
            </p>
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
                "Mid-grey body text (#6b7280-style tokens) that passes AA at 4.5–5:1 but falls well short of 7:1.",
                "Brand-colored links and buttons in saturated blues, reds, or oranges — most sit between 3:1 and 5.5:1 on white.",
                "Counting 16px bold labels as 'large text' — bold text must be at least 18.66 CSS pixels to use the 4.5:1 band.",
                "Placeholder text, captions, and timestamps styled extra-light precisely because they are 'less important'.",
                "Text over hero images with no scrim, where parts of some letters sit on light regions of the photo.",
                "Dark-mode secondary text dimmed for aesthetics until it slides under 7:1 against the dark background.",
              ].map((m) => (
                <li
                  key={m}
                  className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-rose-500 font-bold">
                    ✗
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
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

          <CriterionLinks number="1.4.6" />
        </article>
      </div>
    </>
  )
}
