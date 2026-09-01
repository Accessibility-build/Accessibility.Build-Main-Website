import type { Metadata } from "next"
import Link from "next/link"
import {
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  SlidersHorizontal,
  Keyboard,
  ShieldCheck,
  ListChecks,
  Layers,
  GitBranch,
  AlertTriangle,
  Code2,
  Contrast,
  Sparkles,
  Hand,
  MessageSquare,
  Move,
} from "lucide-react"
import { PageByline } from "@/components/seo/page-byline"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { clampDescription } from "@/lib/metadata"

const pageTitle = "Accessible Slider & Range Input Guide (role=slider)"
const pageDescription =
  "Build accessible sliders and range inputs the right way: the native <input type=\"range\"> that gives you role=slider, keyboard, and a click-to-set drag alternative for free; the full arrow / Home / End / Page keyboard contract; aria-valuenow, aria-valuemin, aria-valuemax and the aria-valuetext property that turns \"2\" into \"Medium\"; the 2.5.7 Dragging Movements requirement; dual-thumb range sliders; and React — with copy-ready code mapped to WCAG 2.2."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "accessible slider",
    "accessible range input",
    "accessible range slider",
    "role slider",
    "aria-valuenow",
    "aria-valuetext",
    "aria-valuemin aria-valuemax",
    "input type range accessibility",
    "slider keyboard accessibility",
    "dual thumb range slider accessibility",
    "price range slider accessibility",
    "volume slider accessibility",
    "wai-aria slider pattern",
    "slider screen reader",
    "dragging movements 2.5.7",
    "react accessible slider",
    "wcag slider",
  ],
  alternates: {
    canonical: "/guides/accessible-slider",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-slider",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Slider & Range Input Guide")}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Slider & Range Input Guide")}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Accessible Slider & Range Input Guide",
    url: "https://accessibility.build/guides/accessible-slider",
  },
]

const faqs = [
  {
    question: "What is the difference between a slider and a range input?",
    answer:
      "They are two names for the same control at different layers. \"Slider\" is the ARIA role — role=\"slider\" — that describes a widget for choosing a value from within a range by moving a thumb. \"Range input\" is the HTML element, <input type=\"range\">, that the browser renders as a slider and exposes with that same role automatically. So every native range input is a slider, but not every slider is a range input: you can also build one from a plain element with role=\"slider\" and manage its value yourself. The practical advice is to start with the native range input, because it gives you the slider role, keyboard operation, and a click-to-set pointer alternative without any JavaScript, and only drop to a custom role=\"slider\" widget when the native element genuinely cannot do what you need.",
  },
  {
    question: "How do I make an accessible slider in HTML?",
    answer:
      "Use <input type=\"range\"> with a real <label>, and set min, max, step, and value. That single element is announced as a slider, is operable with the arrow keys, Home, End, Page Up and Page Down, can be set by clicking anywhere on the track, and exposes its value to assistive technology through aria-valuenow, aria-valuemin, and aria-valuemax for you. If the numeric value would not make sense read aloud on its own — a rating of \"2\" that really means \"Fair\", or \"50\" that means \"$50\" — add aria-valuetext with the human-readable version. Only build a custom slider from a div with role=\"slider\" when you need behaviour the native element cannot provide, such as two thumbs on one track, and in that case you take on the keyboard handling and the click-to-set alternative yourself.",
  },
  {
    question: "Which keys operate a slider?",
    answer:
      "A slider has the richest keyboard contract of any single control. The Right and Up arrows increase the value by one step; the Left and Down arrows decrease it by one step. Home jumps to the minimum and End jumps to the maximum. Page Up and Page Down move by a larger step — typically ten percent of the range or a defined jump — so a user does not have to press an arrow a hundred times to cross a wide scale. A native range input implements all of these for you. If you build a custom slider you must add every one of them in a keydown handler, and you must call preventDefault so the arrow keys move the thumb instead of scrolling the page. The slider itself is a single Tab stop: Tab moves to it, the arrows adjust it, and Tab moves away.",
  },
  {
    question: "What is aria-valuetext and when do I need it?",
    answer:
      "aria-valuetext supplies a human-readable string for the slider's current value, and a screen reader announces it in place of the raw number in aria-valuenow. You need it whenever the number on its own does not communicate the value. A slider whose positions mean Small, Medium and Large should announce \"Medium\", not \"2\". A price slider should announce \"$1,500\", not \"1500\". A slider that picks a day should announce \"Wednesday\", not \"3\". Without aria-valuetext the screen reader reads the bare number, which is often meaningless or even misleading. The rule of thumb: if you would not print the raw aria-valuenow number next to the slider as its visible label, you owe the user an aria-valuetext. When the number genuinely is the value — a percentage, a plain 0-to-100 volume — you can leave aria-valuetext off and let aria-valuenow speak for itself.",
  },
  {
    question: "Does a slider need a live region to announce its value?",
    answer:
      "No, and adding one is a common mistake. When a slider has focus and its aria-valuenow or aria-valuetext changes, screen readers announce the new value automatically as part of the slider role — that is exactly what the role is for. If you also place the value inside an aria-live region, the change is announced twice, which is noisy and confusing. Keep the value on the slider through aria-valuenow and aria-valuetext, show it visibly next to the control for sighted users, and let the slider role do the announcing. The one time a status message helps is when moving the slider changes something elsewhere on the page that is not the slider's own value — a total price recalculating, results filtering — and even then you announce that downstream change, not the slider value itself.",
  },
  {
    question: "How does a slider satisfy WCAG 2.5.7 Dragging Movements?",
    answer:
      "WCAG 2.5.7, new in WCAG 2.2, requires that any action you can perform by dragging can also be performed with a single pointer action that involves no dragging — a plain click or tap. A slider is the textbook draggable control, so it is squarely in scope. A native <input type=\"range\"> passes automatically, because the browser lets you click anywhere on the track to move the thumb there and the dragging behaviour is provided by the user agent. The moment you build a custom slider from divs and pointer events you lose that exception and must add the single-pointer alternative yourself: let a click on the track jump the thumb to that position, or provide plus and minus buttons that step the value. Note that keyboard support alone does not satisfy 2.5.7 — that is a separate requirement, 2.1.1 Keyboard. A mouse or touch user who cannot perform a sustained drag still needs a click-based way to set the value.",
  },
  {
    question: "How do I build an accessible two-handle range slider?",
    answer:
      "A dual-thumb range slider — the kind used for a minimum-and-maximum price filter — is built as two separate sliders that share one track. Each thumb is its own focusable element with role=\"slider\", its own aria-valuenow, and its own accessible name, such as \"Minimum price\" and \"Maximum price\", so a screen reader user knows which handle they are moving. The trick that keeps the two from crossing is dynamic bounds: the lower thumb's aria-valuemax is set to the current value of the upper thumb, and the upper thumb's aria-valuemin is set to the current value of the lower thumb, updated every time either one moves. Each thumb is a single Tab stop, so the user tabs to the minimum handle, adjusts it with the arrows, tabs to the maximum handle, and adjusts that. Because this involves state that must stay consistent across two constrained sliders, it is the clearest case for reaching for a well-tested headless library rather than hand-rolling it.",
  },
  {
    question: "How do I test a slider for accessibility?",
    answer:
      "Start with the keyboard. Tab to the slider and confirm it takes focus with a visible indicator. Press the arrow keys and confirm the value changes by one step in the expected direction; press Home and End and confirm it jumps to the minimum and maximum; press Page Up and Page Down and confirm a larger jump. Then listen with a screen reader: you should hear the slider's name, that it is a slider, and its current value — and if the raw number is not meaningful, you should hear the aria-valuetext string instead. Next, put the mouse down: click a point on the track and confirm the thumb jumps there without a drag, which is your 2.5.7 check. Finally, look at the visuals — confirm the thumb, the track, and the filled portion each reach 3:1 contrast against what they sit on, that the thumb is at least 24 by 24 CSS pixels, and that the current value is shown as visible text and not conveyed by colour alone.",
  },
]

const keyboardRows = [
  {
    key: "Right / Up arrow",
    action:
      "Increases the value by one step. Up increases even on a horizontal slider, matching the native range input.",
  },
  {
    key: "Left / Down arrow",
    action:
      "Decreases the value by one step. On a vertical slider (aria-orientation=\"vertical\") Up still increases and Down still decreases.",
  },
  {
    key: "Home",
    action: "Jumps to the minimum value (aria-valuemin).",
  },
  {
    key: "End",
    action: "Jumps to the maximum value (aria-valuemax).",
  },
  {
    key: "Page Up",
    action:
      "Increases by a larger step — commonly 10% of the range — so a user can cross a wide scale quickly.",
  },
  {
    key: "Page Down",
    action: "Decreases by the same larger step.",
  },
  {
    key: "Tab / Shift + Tab",
    action:
      "Moves focus to the slider and away from it. A single-thumb slider is one Tab stop; the arrows do the adjusting.",
  },
]

const attributeRows = [
  {
    element: "The thumb / slider control",
    role: 'role="slider" (implicit on <input type="range">)',
    attrs:
      "The focusable element the user operates. On a native range input the browser supplies the role; on a custom slider you add role=\"slider\" and tabindex=\"0\".",
  },
  {
    element: "Current value",
    role: "aria-valuenow",
    attrs:
      "The numeric value now. Required on role=\"slider\". Mapped from the value attribute for you on a native range input; set by hand on a custom one.",
  },
  {
    element: "Range bounds",
    role: "aria-valuemin / aria-valuemax",
    attrs:
      "The lowest and highest values the slider allows. Required. On a dual-thumb slider these are updated dynamically so the two thumbs cannot cross.",
  },
  {
    element: "Human-readable value",
    role: "aria-valuetext",
    attrs:
      "The value spoken to assistive technology when the raw number is not self-explanatory — \"Medium\", \"$50\", \"Wednesday\". Optional but often essential.",
  },
  {
    element: "Accessible name",
    role: "<label>, aria-labelledby, or aria-label",
    attrs:
      "Names what the slider controls (\"Volume\", \"Minimum price\"). On a dual-thumb slider each thumb needs its own name.",
  },
  {
    element: "Orientation",
    role: 'aria-orientation="vertical"',
    attrs:
      "Only when the slider is vertical. Horizontal is the default and needs no attribute.",
  },
  {
    element: "The track and filled portion",
    role: "Decorative (CSS)",
    attrs:
      "Presentational. Draw them with CSS; the value is carried by aria-valuenow, not by the width of a coloured bar alone.",
  },
]

const antiPatterns = [
  {
    bad: "A <div> with an onMouseDown that moves a thumb, and no role.",
    why: "Assistive technology sees no control — no slider role, no value, no keyboard. A screen reader user never learns the slider exists or what it is set to (4.1.2, 2.1.1).",
    fix: "Use <input type=\"range\">, or a <div role=\"slider\"> with tabindex, aria-valuenow/min/max, and a full keydown handler.",
  },
  {
    bad: "role=\"slider\" with aria-valuenow but no aria-valuemin or aria-valuemax.",
    why: "The slider announces a value with no context — \"70\" out of what? Both bounds are required for the role to be valid and meaningful (4.1.2).",
    fix: "Always set aria-valuemin and aria-valuemax alongside aria-valuenow.",
  },
  {
    bad: "A rating slider announces \"2\" for a position that means \"Fair\".",
    why: "The raw number is meaningless or misleading to a screen reader user, who cannot see the labels the number maps to (1.3.1, 4.1.2).",
    fix: "Add aria-valuetext=\"Fair\" so the human-readable value is spoken instead of the number.",
  },
  {
    bad: "A custom slider you can drag but cannot set by clicking the track.",
    why: "A mouse or touch user who cannot perform a sustained drag has no way to set the value. Keyboard support does not cover this (2.5.7).",
    fix: "Let a single click on the track jump the thumb there, or add plus/minus buttons — the same alternative a native range gives for free.",
  },
  {
    bad: "The slider value is wrapped in an aria-live region so it is announced.",
    why: "The slider role already announces value changes on focus, so the live region double-announces — noisy and confusing (4.1.3 misuse).",
    fix: "Remove the live region; keep the value in aria-valuenow / aria-valuetext and let the slider role speak.",
  },
  {
    bad: "A thin thumb and a pale track, filled and unfilled in two close greys.",
    why: "Low-vision users cannot find the thumb or read where the value sits; the boundaries fall below 3:1 (1.4.11).",
    fix: "Give the thumb, the track, and the filled/unfilled boundary at least 3:1, and make the thumb at least 24×24 (2.5.8).",
  },
  {
    bad: "Arrow keys scroll the page instead of moving the thumb.",
    why: "A custom slider that does not call preventDefault on the arrow keys is effectively inoperable by keyboard (2.1.1).",
    fix: "In the keydown handler, handle the arrow / Home / End / Page keys and call event.preventDefault() for each.",
  },
]

export default function AccessibleSliderGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema route="/guides/accessible-slider" title={pageTitle} description={pageDescription} datePublished="2026-07-26" />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
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
                    href="/guides"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Accessible Slider
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article>
          {/* Hero */}
          <section className="pt-12 pb-8 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                Component Pattern Guide
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Accessible Slider &amp; Range Input Guide
              </h1>
              <PageByline route="/guides/accessible-slider" className="mb-5" />
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A slider is a value, not two states. This guide covers the native{" "}
                <code>&lt;input type=&quot;range&quot;&gt;</code> that gives you{" "}
                <code>role=&quot;slider&quot;</code>, keyboard operation, and a
                click-to-set drag alternative for free; the full arrow / Home /
                End / Page keyboard contract; the{" "}
                <code>aria-valuetext</code> property that turns &ldquo;2&rdquo;
                into &ldquo;Medium&rdquo;; the 2.5.7 dragging requirement; and
                dual-thumb range sliders — with copy-ready code mapped to WCAG
                2.2.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                The Control With the Longest Keyboard Contract
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A slider looks simple — a rail and a knob you slide — and it is
                  the control developers most often rebuild from{" "}
                  <code>&lt;div&gt;</code>s and mouse events, throwing away
                  everything the browser already does. The result is a widget a
                  mouse user can drag and nobody else can touch: no role, so a
                  screen reader never calls it a slider; no value, so there is
                  nothing to announce; no keyboard, so an arrow-key user is
                  locked out; and no way to set it without a sustained drag, so
                  anyone who cannot hold and move a pointer is stuck.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The slider has an ARIA pattern of its own —{" "}
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/patterns/slider/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    the WAI-ARIA Authoring Practices Slider pattern
                  </a>{" "}
                  — built from{" "}
                  <strong className="text-slate-900 dark:text-white">
                    <code>role=&quot;slider&quot;</code>
                  </strong>{" "}
                  and the four value properties{" "}
                  <strong className="text-slate-900 dark:text-white">
                    <code>aria-valuenow</code>, <code>aria-valuemin</code>,{" "}
                    <code>aria-valuemax</code>
                  </strong>{" "}
                  and <code>aria-valuetext</code>. And unlike almost every other
                  pattern, most of the time you get the whole thing for free from
                  a single native element. Where a{" "}
                  <Link href="/guides/accessible-switch" className="text-blue-600 dark:text-blue-400 hover:underline">
                    switch
                  </Link>{" "}
                  answers on-or-off with one key, a slider chooses a value from a
                  range, so it owns the longest keyboard contract of any single
                  control: two arrow directions, Home, End, and the Page keys.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This guide starts where you should start — with the native
                  range input — then covers what it exposes, the keyboard model
                  in full, the custom <code>role=&quot;slider&quot;</code> build
                  for when native is not enough, the single-pointer alternative
                  that{" "}
                  <Link href="/wcag/2-5-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.7 Dragging Movements
                  </Link>{" "}
                  demands, dual-thumb range sliders, and the visual rules that
                  decide whether the slider is usable once the semantics are
                  right.
                </p>
                <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                  <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      <strong>
                        The shortcut most guides bury: reach for{" "}
                        <code>&lt;input type=&quot;range&quot;&gt;</code> first.
                      </strong>{" "}
                      It is announced as a slider, operable with every key below,
                      settable by clicking the track, and it exposes its value
                      automatically. You only take on the work in the later
                      sections when the native element genuinely cannot do the
                      job — most often for two thumbs on one track.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The WCAG 2.2 Criteria a Slider Must Satisfy
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that a correctly built slider
                    satisfies and what each requires
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Criterion
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Level
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        What the slider must do
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info &amp; Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The current value, the bounds, and the slider role are exposed programmatically, not implied by the position of a coloured bar alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The value can be set with the arrow keys, Home, End, and the Page keys, with no pointer required.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.2 No Keyboard Trap
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Tab moves focus to the slider and away again — the arrows adjust the value, they do not trap focus on the control.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.1 Use of Color
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Where the value sits is shown by thumb position and text, not by a colour cue alone (for example a green-to-red track).</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The thumb shows a clearly visible focus indicator when tabbed to, distinct from its resting appearance.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.11 Non-text Contrast
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The thumb, the track, and the boundary between the filled and unfilled portions each reach at least 3:1 against adjacent colours.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.7 Dragging Movements
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The value can be set without dragging — a click on the track or plus/minus buttons — not by a sustained press-and-move only.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.8 Target Size (Minimum)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The thumb is at least 24 by 24 CSS pixels so it can be operated by touch and imprecise pointers.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The control exposes the slider role, an accessible name, and an aria-valuenow (or aria-valuetext) that tracks the real value.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                <Link href="/wcag/2-5-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.5.7 Dragging Movements
                </Link>{" "}
                is the criterion that catches teams by surprise, because it is
                new in WCAG 2.2 and a slider is its clearest example. Keyboard
                support does not satisfy it — a single click that sets the value,
                with no drag, does. A native range input passes this
                automatically; a custom one does not until you add the
                alternative yourself.
              </p>
            </div>
          </section>

          {/* Decision */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <GitBranch className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Do You Even Need a Slider?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A slider is the right control for choosing an{" "}
                <em>approximate</em> value along a continuous or stepped range
                where the exact number is not critical — volume, brightness, a
                zoom level, a price band. It is a poor control when the user
                needs to enter a <em>precise</em> value, because hitting exactly
                &ldquo;$1,437&rdquo; by sliding is painful for everyone and
                nearly impossible for someone with a motor impairment. Choose the
                control that matches the task before you style anything.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Slider</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      An approximate value on a range where the feel matters more
                      than the exact digit —{" "}
                      <strong className="text-slate-900 dark:text-white">
                        volume, brightness, zoom
                      </strong>
                      . <code>&lt;input type=&quot;range&quot;&gt;</code> or{" "}
                      <code>role=&quot;slider&quot;</code>. This is what the guide
                      covers.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Number input</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A precise value the user knows and wants to type —{" "}
                      <strong className="text-slate-900 dark:text-white">
                        a quantity, an exact price, an age
                      </strong>
                      . <code>&lt;input type=&quot;number&quot;&gt;</code> in the{" "}
                      <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                        forms guide
                      </Link>
                      . Pair it with a slider if you want both.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Spinbutton</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A small set of discrete steps nudged up and down —{" "}
                      <strong className="text-slate-900 dark:text-white">
                        a passenger count, a stepper
                      </strong>
                      . Plus/minus buttons around a value, exposed with{" "}
                      <code>role=&quot;spinbutton&quot;</code> or a native number
                      input.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A powerful combination for precision-sensitive ranges is to pair
                a slider with a linked number field: the slider gives a quick,
                low-effort approximate set, and the number field lets a keyboard
                or screen reader user type the exact value. Keep the two in sync
                and give each its own accessible name. When in doubt, remember
                the slider&apos;s honest job is <em>roughly here</em>, not{" "}
                <em>exactly this</em>.
              </p>
            </div>
          </section>

          {/* Native path */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <SlidersHorizontal className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Start With <code>&lt;input type=&quot;range&quot;&gt;</code>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The native range input is to sliders what the native checkbox is
                to switches: a single element that arrives already accessible.
                The browser announces it as a slider, wires up every key in the
                keyboard table below, lets a mouse or touch user click anywhere
                on the track to jump the thumb, and maps its <code>value</code>,{" "}
                <code>min</code>, and <code>max</code> to{" "}
                <code>aria-valuenow</code>, <code>aria-valuemin</code>, and{" "}
                <code>aria-valuemax</code> for you. That last point also means it
                satisfies{" "}
                <Link href="/wcag/2-5-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.5.7 Dragging Movements
                </Link>{" "}
                under the user-agent exception — the click-to-set behaviour is
                the browser&apos;s, not yours to re-earn.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<!-- A real label, and min/max/step/value on the input. -->
<label for="volume">Volume</label>
<input
  type="range"
  id="volume"
  min="0"
  max="100"
  step="1"
  value="50"
/>
<!-- Show the value as text for sighted users, kept in sync by script.
     Do NOT put this in an aria-live region - the slider role already
     announces the value on focus. -->
<output for="volume" id="volume-output">50</output>`}</code></pre>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100 mt-4"><code>{`/* Give the thumb a real presence: >= 24x24 for target size (2.5.8),
   and >= 3:1 contrast against the track for non-text contrast (1.4.11). */
input[type="range"] {
  inline-size: 100%;
  block-size: 1.5rem;
  cursor: pointer;
}

/* A visible focus ring, distinct from the resting thumb (2.4.7). */
input[type="range"]:focus-visible {
  outline: 3px solid #1d4ed8;
  outline-offset: 4px;
}

/* Thumb + track can be styled per engine (::-webkit-slider-thumb,
   ::-moz-range-thumb). Keep the thumb ceil 24px and give the track a
   visible edge so the fill boundary is not carried by colour alone. */`}</code></pre>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-blue-100 leading-relaxed flex gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong>
                      This version has zero JavaScript for accessibility.
                    </strong>{" "}
                    The label names it, the browser gives it the slider role,
                    every keyboard command, click-to-set, and the value mapping.
                    Your script only <em>reacts</em> to the <code>input</code>{" "}
                    event to update the visible <code>&lt;output&gt;</code> and
                    apply the setting — it never manages the control&apos;s
                    semantics. Styling range inputs used to be the reason people
                    rebuilt them; modern <code>::-webkit-slider-thumb</code> and{" "}
                    <code>::-moz-range-thumb</code> pseudo-elements make that
                    largely unnecessary.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The honest limits of the native element: it is a single thumb
                (no built-in two-handle range), its tick marks via{" "}
                <code>&lt;datalist&gt;</code> are minimally styleable, and a
                genuinely non-linear scale (logarithmic price bands) needs script
                to map positions to values. Those, and only those, are the
                reasons to move to the custom build in section 6.
              </p>
            </div>
          </section>

          {/* Anatomy */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Layers className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Anatomy: Roles, States, and Properties
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A slider carries more <em>value</em> information than any other
                simple control, and that is where its ARIA lives. The rule: the
                element supplies the role, you (or the browser) supply the three
                required value properties, you add{" "}
                <code>aria-valuetext</code> whenever the number is not
                self-explanatory, and you always supply a{" "}
                <strong className="text-slate-900 dark:text-white">name</strong>.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    The elements and attributes in an accessible slider and what
                    each is for
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Element / concept</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Attribute</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {attributeRows.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          {row.element}
                        </th>
                        <td className="px-4 py-3 align-top font-mono text-xs">{row.role}</td>
                        <td className="px-4 py-3 align-top">{row.attrs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Note the three <em>required</em> properties on{" "}
                <code>role=&quot;slider&quot;</code>:{" "}
                <code>aria-valuenow</code>, <code>aria-valuemin</code>, and{" "}
                <code>aria-valuemax</code>. Omitting a bound is a common validity
                failure — the value has no context to be announced against. For
                how each role and property is surfaced to assistive technology,
                see the{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>
                .
              </p>
            </div>
          </section>

          {/* aria-valuetext */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <MessageSquare className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. <code>aria-valuetext</code>: When the Number Isn&apos;t the Value
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This is the property that separates a slider that merely passes an
                automated scan from one a blind user can actually use. When a
                slider&apos;s position maps to something other than a plain
                number, a screen reader reading the raw{" "}
                <code>aria-valuenow</code> announces gibberish: it says
                &ldquo;2&rdquo; for a rating that means &ldquo;Fair&rdquo;, or
                &ldquo;1500&rdquo; for a price that means &ldquo;$1,500&rdquo;.{" "}
                <code>aria-valuetext</code> supplies the human string, and the
                screen reader announces it <em>instead of</em> the number.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<!-- A quality rating: the numbers 1-4 mean nothing spoken aloud. -->
<label id="quality-label">Quality</label>
<div
  role="slider"
  tabindex="0"
  aria-labelledby="quality-label"
  aria-valuemin="1"
  aria-valuemax="4"
  aria-valuenow="2"
  aria-valuetext="Fair"     <!-- announced INSTEAD of "2" -->
></div>`}</code></pre>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100 mt-4"><code>{`// Keep aria-valuetext in step with aria-valuenow whenever the value moves.
const LABELS = ["Poor", "Fair", "Good", "Excellent"]

function setQuality(el, n) {
  el.setAttribute("aria-valuenow", String(n))
  el.setAttribute("aria-valuetext", LABELS[n - 1])  // "Fair"
}

// For a price slider, format the number rather than mapping to words:
//   el.setAttribute("aria-valuetext", "$" + value.toLocaleString())`}</code></pre>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-blue-100 leading-relaxed flex gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong>The test:</strong> if you would not print the raw{" "}
                    <code>aria-valuenow</code> number beside the slider as its
                    visible value, you owe the user an{" "}
                    <code>aria-valuetext</code>. When the number{" "}
                    <em>is</em> the value — a percentage, a plain 0-to-100
                    volume — leave <code>aria-valuetext</code> off and let{" "}
                    <code>aria-valuenow</code> speak for itself.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                On a native <code>&lt;input type=&quot;range&quot;&gt;</code> you
                can set <code>aria-valuetext</code> directly and update it in the{" "}
                <code>input</code> event handler — it is one of the few ARIA
                attributes it is correct to manage by hand on a native control,
                precisely because the browser cannot know that your{" "}
                &ldquo;2&rdquo; means &ldquo;Fair&rdquo;.
              </p>
            </div>
          </section>

          {/* Keyboard */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. The Keyboard Model
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                This is the contract a native range input fulfils for free and a
                custom slider must implement in full. Every key here is expected;
                a slider that responds only to the arrow keys, with no Home, End,
                or Page support, is incomplete and slow to operate across a wide
                range.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Keyboard commands a conformant slider must support
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Key</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Expected behavior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {keyboardRows.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap">
                          {row.key}
                        </th>
                        <td className="px-4 py-3 align-top">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                The detail custom builds trip on is{" "}
                <code>event.preventDefault()</code>: without it, the arrow keys
                and the Page keys scroll the page instead of moving the thumb, so
                the slider is effectively inoperable by keyboard under{" "}
                <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.1.1 Keyboard
                </Link>
                . On the native element this is handled for you. For the wider
                contract every custom control owes, see the{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  keyboard accessibility guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Custom build */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. Building a Custom Slider
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Reach for a custom slider only when the native range input truly
                cannot do the job — most often a two-handle range, or a
                non-linear scale. You take on the role, the value properties, the
                whole keyboard model, and the single-pointer alternative. Here is
                the shape of a conformant single-thumb build.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<label id="zoom-label">Zoom</label>
<div class="slider" id="track">
  <div
    class="slider__thumb"
    role="slider"
    tabindex="0"
    aria-labelledby="zoom-label"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="40"
  ></div>
</div>`}</code></pre>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100 mt-4"><code>{`const track = document.getElementById("track")
const thumb = track.querySelector('[role="slider"]')
const MIN = 0, MAX = 100, STEP = 1, PAGE = 10

function setValue(v) {
  const value = Math.min(MAX, Math.max(MIN, v))
  thumb.setAttribute("aria-valuenow", String(value))
  thumb.style.insetInlineStart = ((value - MIN) / (MAX - MIN)) * 100 + "%"
  applyZoom(value)                    // apply the effect
}

// The full keyboard contract. preventDefault stops the page scrolling.
thumb.addEventListener("keydown", (e) => {
  const now = Number(thumb.getAttribute("aria-valuenow"))
  let next = now
  switch (e.key) {
    case "ArrowRight": case "ArrowUp":   next = now + STEP; break
    case "ArrowLeft":  case "ArrowDown": next = now - STEP; break
    case "PageUp":     next = now + PAGE; break
    case "PageDown":   next = now - PAGE; break
    case "Home":       next = MIN; break
    case "End":        next = MAX; break
    default: return                    // let other keys through
  }
  e.preventDefault()                   // <- without this the page scrolls
  setValue(next)
})

// The single-pointer alternative (2.5.7): click the track to jump there.
track.addEventListener("pointerdown", (e) => {
  const rect = track.getBoundingClientRect()
  const ratio = (e.clientX - rect.left) / rect.width
  setValue(Math.round(MIN + ratio * (MAX - MIN)))
  thumb.focus()
})`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Three details are load-bearing. The{" "}
                <code>role=&quot;slider&quot;</code> and{" "}
                <code>tabindex=&quot;0&quot;</code> go on the{" "}
                <strong className="text-slate-900 dark:text-white">thumb</strong>
                , the element the user operates, not the track. Every branch of
                the keydown handler calls <code>preventDefault</code> so the keys
                move the thumb rather than scrolling. And the{" "}
                <code>pointerdown</code> handler on the track is not a nicety — it
                is what satisfies{" "}
                <Link href="/wcag/2-5-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.5.7 Dragging Movements
                </Link>
                , giving a mouse or touch user a way to set the value with a
                single click and no drag. Add drag on top of it if you like, but
                the click must exist.
              </p>
            </div>
          </section>

          {/* 2.5.7 dragging */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Hand className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. The Single-Pointer Alternative (2.5.7 Dragging Movements)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A slider is the canonical draggable control, which puts it
                squarely under{" "}
                <Link href="/wcag/2-5-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.5.7 Dragging Movements
                </Link>{" "}
                — new in WCAG 2.2. The requirement is precise: anything you can do
                by dragging must also be doable with a single pointer action that
                involves no dragging. Some users cannot hold a button and move at
                the same time; a tremor, a switch device, or a head pointer makes
                a sustained drag impossible.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card className="border-emerald-200 dark:border-emerald-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">Passes 2.5.7</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A native range input (the browser gives click-to-set); or a
                      custom slider where a single click on the track jumps the
                      thumb to that point, or plus/minus buttons step the value.
                      No sustained press-and-move is required.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-red-200 dark:border-red-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-700 dark:text-red-400">Fails 2.5.7</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A custom slider whose thumb can{" "}
                      <em>only</em> be dragged — click the track and nothing
                      happens. Adding keyboard support does not fix it; that is{" "}
                      <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                        2.1.1
                      </Link>
                      , a different requirement for a different group of users.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The trap here is assuming a keyboard alternative covers it. It
                does not: 2.5.7 is about <em>pointer</em> users who cannot drag,
                and a keyboard is not a pointer. The fix is small — the{" "}
                <code>pointerdown</code>-on-track handler from section 6, or a
                pair of stepper buttons — but it must be there. See the full{" "}
                <Link href="/wcag/2-5-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.5.7 Dragging Movements guide
                </Link>{" "}
                for the essential and user-agent exceptions and other draggable
                patterns.
              </p>
            </div>
          </section>

          {/* Dual thumb */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Move className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                8. Dual-Thumb Range Sliders
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The two-handle range — a minimum-and-maximum price filter is the
                everyday example — is the single most common reason to leave the
                native input behind, because{" "}
                <code>&lt;input type=&quot;range&quot;&gt;</code> has only one
                thumb. The accessible model is simple to state: build{" "}
                <strong className="text-slate-900 dark:text-white">
                  two separate sliders that share one track
                </strong>
                , each its own focusable <code>role=&quot;slider&quot;</code>{" "}
                with its own value and its own name.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<div class="range" id="price">
  <!-- Minimum thumb: its max is capped at the maximum thumb's value. -->
  <div
    role="slider"
    tabindex="0"
    aria-label="Minimum price"
    aria-valuemin="0"
    aria-valuemax="800"      <!-- = current value of the max thumb -->
    aria-valuenow="200"
    aria-valuetext="$200"
  ></div>
  <!-- Maximum thumb: its min is floored at the minimum thumb's value. -->
  <div
    role="slider"
    tabindex="0"
    aria-label="Maximum price"
    aria-valuemin="200"      <!-- = current value of the min thumb -->
    aria-valuemax="1000"
    aria-valuenow="800"
    aria-valuetext="$800"
  ></div>
</div>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Two rules make it work. First, give each thumb a{" "}
                <strong className="text-slate-900 dark:text-white">
                  distinct accessible name
                </strong>{" "}
                — &ldquo;Minimum price&rdquo; and &ldquo;Maximum price&rdquo; —
                so a screen reader user always knows which handle has focus.
                Second, keep the thumbs from crossing with{" "}
                <strong className="text-slate-900 dark:text-white">
                  dynamic bounds
                </strong>
                : every time either thumb moves, set the minimum thumb&apos;s{" "}
                <code>aria-valuemax</code> to the maximum thumb&apos;s current
                value, and the maximum thumb&apos;s <code>aria-valuemin</code> to
                the minimum thumb&apos;s current value. Each thumb is its own Tab
                stop, so the user tabs to one, adjusts it with the arrows, tabs
                to the other, and adjusts that.
              </p>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>This is the clearest case to not hand-roll.</strong>{" "}
                    Two constrained sliders sharing state, staying in order, each
                    dragging, clicking, and keyboarding correctly, is a lot of
                    surface area to get right. A well-tested headless library —
                    see section 9 — implements the pattern and its edge cases so
                    you do not re-discover them in production.
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* Non-text contrast */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Contrast className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                9. Making the Value Visible — Contrast and Target Size
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Once the semantics are right, a slider fails visually — and it
                fails for the users least able to absorb it. Three rules keep the
                value readable and operable for everyone.
              </p>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6 mb-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Give the thumb, track, and fill real edges.
                  </strong>{" "}
                  The thumb against its background, and the boundary between the
                  filled and unfilled portions of the track, each need{" "}
                  <strong>3:1</strong> contrast under{" "}
                  <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.11 Non-text Contrast
                  </Link>
                  . A pale thumb on a pale track, or two close greys for filled
                  and unfilled, is the usual miss. A 1px border rescues it.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Make the thumb big enough to hit.
                  </strong>{" "}
                  The thumb is the target, and it must be at least{" "}
                  <strong>24&nbsp;&times;&nbsp;24</strong> CSS pixels for{" "}
                  <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.8 Target Size
                  </Link>{" "}
                  — aim for 44 on touch. A 10px handle looks elegant and is
                  unusable for many.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Show the value, and never in colour alone.
                  </strong>{" "}
                  Print the current value as text next to the slider, and do not
                  encode meaning in track colour by itself — a green-to-red
                  &ldquo;risk&rdquo; track is invisible to a colour-blind user
                  unless the value is also spelled out, which is{" "}
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1 Use of Color
                  </Link>
                  .
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed">
                Verify the real rendered colours — not the values in the design
                file — with the{" "}
                <Link href="/tools/contrast-checker" className="text-blue-600 dark:text-blue-400 hover:underline">
                  contrast checker
                </Link>
                , and confirm the thumb size on a real device with the{" "}
                <Link href="/tools/mobile-accessibility-checker" className="text-blue-600 dark:text-blue-400 hover:underline">
                  mobile accessibility checker
                </Link>
                . Remember any visible value text is held to the stricter{" "}
                <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.4.3 Contrast (Minimum)
                </Link>{" "}
                at 4.5:1.
              </p>
            </div>
          </section>

          {/* React */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                10. Sliders in React
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For a single-thumb slider in React, the native range input is
                still the safest base: a controlled{" "}
                <code>&lt;input type=&quot;range&quot;&gt;</code> whose{" "}
                <code>value</code> comes from state and whose{" "}
                <code>onChange</code> updates it. React keeps the DOM{" "}
                <code>value</code> in sync, so <code>aria-valuenow</code> stays
                correct automatically — you only add{" "}
                <code>aria-valuetext</code> when the number is not the value.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`import { useId, useState } from "react"

const LABELS = ["Poor", "Fair", "Good", "Excellent"]

function QualitySlider() {
  const [value, setValue] = useState(2)
  const id = useId()

  return (
    <div>
      <label htmlFor={id}>Quality</label>
      <input
        id={id}
        type="range"
        min={1}
        max={4}
        step={1}
        value={value}
        // The number 1-4 is meaningless spoken, so give it words.
        aria-valuetext={LABELS[value - 1]}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      {/* Visible value for sighted users - NOT in an aria-live region. */}
      <output htmlFor={id}>{LABELS[value - 1]}</output>
    </div>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                For a two-handle range, non-linear scales, or fully custom
                visuals, do not hand-roll the <code>role=&quot;slider&quot;</code>{" "}
                logic — reach for a headless library that has solved the edge
                cases: Radix UI&apos;s <code>Slider</code> (supports multiple
                thumbs), React Aria&apos;s <code>useSlider</code> /{" "}
                <code>useSliderThumb</code>, or Headless UI. The same principles
                travel to other frameworks — see the{" "}
                <Link href="/guides/vue-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Vue
                </Link>{" "}
                and{" "}
                <Link href="/guides/angular-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Angular
                </Link>{" "}
                guides, and the{" "}
                <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  React accessibility guide
                </Link>{" "}
                for the surrounding patterns. Whatever you ship, verify it against
                the workflow below rather than trusting the README.
              </p>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How to Test an Accessible Slider
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Automated tools catch a missing name, a missing bound, or a role
                that never reached the element. Everything that decides whether
                the slider is actually usable — the keyboard contract, the value
                announcement, the drag alternative — takes a few minutes by hand.
              </p>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Work the keyboard.</strong>{" "}
                  Tab to the slider (visible focus), then arrow keys change the
                  value by one step, Home and End jump to the bounds, and Page
                  Up / Page Down make a larger jump. The page must not scroll
                  while you do it.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Listen with a screen reader.</strong>{" "}
                  You should hear the name, the word &ldquo;slider&rdquo;, and the
                  current value — and where the raw number is not meaningful, the{" "}
                  <code>aria-valuetext</code> string (&ldquo;Fair&rdquo;,
                  &ldquo;$200&rdquo;) instead. The{" "}
                  <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    screen reader testing guide
                  </Link>{" "}
                  has the commands.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Click the track.</strong>{" "}
                  With the mouse, click a point on the track and confirm the thumb
                  jumps there with no drag — your{" "}
                  <Link href="/wcag/2-5-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.7
                  </Link>{" "}
                  check.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Measure the visuals.</strong>{" "}
                  Thumb, track, and fill boundary reach 3:1 (
                  <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.11
                  </Link>
                  ); the thumb is at least 24&nbsp;&times;&nbsp;24 px (
                  <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.8
                  </Link>
                  ); the value shows as text, not colour alone (
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Check for a double-announce.</strong>{" "}
                  If moving the slider makes the screen reader say the value
                  twice, you have wrapped it in a stray{" "}
                  <code>aria-live</code> region — remove it and let the slider
                  role announce.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Layer automated checks on top with <code>axe-core</code>, and see{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  automated vs manual testing
                </Link>{" "}
                for where each fits. Scan the live page with the{" "}
                <Link href="/tools/url-accessibility-auditor" className="text-blue-600 dark:text-blue-400 hover:underline">
                  URL accessibility auditor
                </Link>{" "}
                to catch a missing name, role, or value before it ships.
              </p>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Slider Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common accessible-slider anti-patterns, why they fail, and
                    the fix
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Anti-pattern</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Why it fails</th>
                      <th scope="col" className="px-4 py-3 font-semibold">The fix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {antiPatterns.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          {row.bad}
                        </th>
                        <td className="px-4 py-3 align-top">{row.why}</td>
                        <td className="px-4 py-3 align-top">{row.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Checklist */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Accessible Slider Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Right control.</strong>{" "}
                  The task is an approximate value on a range. If the user needs a
                  precise number, offer a linked number field too.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Native first.</strong>{" "}
                  <code>&lt;input type=&quot;range&quot;&gt;</code> with a real
                  label, unless you genuinely need two thumbs or a non-linear
                  scale.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Role and value.</strong>{" "}
                  <code>role=&quot;slider&quot;</code> with{" "}
                  <code>aria-valuenow</code>, <code>aria-valuemin</code>, and{" "}
                  <code>aria-valuemax</code> — all three (
                  <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.2
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Readable value.</strong>{" "}
                  <code>aria-valuetext</code> wherever the raw number is not the
                  value (&ldquo;Medium&rdquo;, &ldquo;$50&rdquo;).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Full keyboard.</strong>{" "}
                  Arrows, Home, End, Page Up, Page Down all work, and the page
                  never scrolls (
                  <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Drag alternative.</strong>{" "}
                  A single click on the track, or stepper buttons, sets the value
                  without dragging (
                  <Link href="/wcag/2-5-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.7
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Visible and reachable.</strong>{" "}
                  Thumb, track, and fill reach 3:1 (
                  <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.11
                  </Link>
                  ); the thumb is at least 24&nbsp;&times;&nbsp;24 px (
                  <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.8
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">No double-announce.</strong>{" "}
                  The value is not wrapped in a redundant{" "}
                  <code>aria-live</code> region — the slider role announces it.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Work through the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                to see the slider in the context of every other requirement.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Sliders on a Live Page
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Scan any page with our free axe-core-powered auditor to catch a
                  slider with no accessible name, a missing bound, or a value that
                  never reaches assistive technology — then run the keyboard,
                  track-click, and contrast passes above for the failures no
                  scanner can see.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/tools/contrast-checker">
                      Check Track Contrast
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((item, i) => (
                  <details key={i} className="group border rounded-lg p-4 bg-card">
                    <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
                      {item.question}
                      <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">
                        &#9662;
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Related Content */}
          <section className="pb-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <RelatedContent
                content="accessible slider accessible range input role slider aria-valuenow aria-valuemin aria-valuemax aria-valuetext input type range dual thumb range slider price range slider volume slider dragging movements 2.5.7 single pointer alternative keyboard accessibility focus visible non-text contrast target size use of color screen reader react accessible slider switch forms wcag 1.3.1 2.1.1 2.5.7 2.5.8 1.4.11 4.1.2"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/accessible-slider"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
