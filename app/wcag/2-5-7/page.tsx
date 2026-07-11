import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 2.5.7 Dragging Movements — Pointer Alternatives",
  description:
    "Complete guide to WCAG 2.5.7 Dragging Movements, new in WCAG 2.2. Learn why every drag action needs a single-pointer alternative, the two exceptions, accessible patterns for sliders, sortable lists and maps, code examples, testing methods, and common mistakes.",
  keywords: [
    "WCAG 2.5.7",
    "Dragging Movements",
    "drag and drop accessibility",
    "single pointer alternative",
    "WCAG 2.2",
    "Level AA",
    "accessible drag and drop",
    "sortable list accessibility",
    "slider accessibility",
    "pointer input accessibility",
    "motor disability accessibility",
    "touch accessibility",
    "kanban accessibility",
    "reorder list accessibility",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/2-5-7",
  },
  openGraph: {
    title:
      "WCAG 2.5.7 Dragging Movements — Single-Pointer Alternatives Guide (Level AA)",
    description:
      "The definitive guide to WCAG 2.5.7 Dragging Movements: why every drag needs a single-pointer alternative, the two exceptions, accessible patterns, copy-ready code, and testing methods.",
    url: "https://accessibility.build/wcag/2-5-7",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/api/og?title=WCAG%202.5.7%20Dragging%20Movements&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.5.7 Dragging Movements guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.5.7 Dragging Movements — Single-Pointer Alternatives",
    description:
      "Learn why every drag action needs a single-pointer alternative, the two exceptions, accessible patterns, and how to test for WCAG 2.2 Level AA.",
  },
}

const exceptions = [
  {
    name: "Essential",
    summary:
      "The dragging movement is essential to the function, or is determined by the user agent.",
    detail:
      "If the drag is genuinely essential — meaning the outcome cannot be achieved any other way without fundamentally changing the activity — it is exempt. A freehand digital drawing or signature is the classic example: the path the pointer travels is the information itself, so there is no meaningful single-tap equivalent. Movements that the user agent (browser or platform) provides, such as the native scrollbar thumb, are also covered. Be honest with this exception: reordering a list, adjusting a slider, or moving a card between columns is almost never essential, because a tap-based alternative produces the same result.",
  },
  {
    name: "User-agent control",
    summary:
      "The drag is handled entirely by the browser and not built by the author.",
    detail:
      "When the dragging behavior comes from a default control the browser renders and you have not re-implemented it, the responsibility sits with the user agent, not you. A native range input's thumb or a browser scrollbar are examples. The moment you build a custom slider, custom scrollbar, or custom drag handle with JavaScript and pointer events, this exception no longer applies and you must supply a single-pointer alternative yourself.",
  },
]

const faqs = [
  {
    q: "What does WCAG 2.5.7 Dragging Movements require?",
    a: "WCAG 2.5.7 requires that any functionality operated by a dragging movement can also be operated by a single pointer without dragging — unless the dragging is essential or is handled by the user agent. A dragging movement means pressing down on a target, moving the pointer while it stays down, and releasing at a different location. The single-pointer alternative is typically a tap, click, or press. It is a Level AA success criterion added in WCAG 2.2.",
  },
  {
    q: "Is WCAG 2.5.7 the same as keyboard accessibility (2.1.1)?",
    a: "No, they are separate criteria and satisfying one does not satisfy the other. WCAG 2.1.1 Keyboard requires that functionality is operable with a keyboard. WCAG 2.5.7 Dragging Movements is specifically about pointer input — it requires a single-pointer (tap or click) alternative to dragging, which helps people who use a mouse, touchscreen, head pointer, or eye-gaze but struggle with the sustained, precise motion a drag demands. A drag-and-drop feature needs both a keyboard path (for 2.1.1) and a single-pointer path (for 2.5.7).",
  },
  {
    q: "Does a slider built with an input type=range pass WCAG 2.5.7?",
    a: "A native range input passes under the User-agent control exception because the browser provides the thumb and its dragging behavior, and it can also be operated with clicks on the track and arrow keys. If you replace it with a custom slider built from divs and pointer-event handlers, the exception no longer applies: you must add a single-pointer alternative such as clicking a point on the track to move the thumb, or plus and minus buttons that step the value.",
  },
  {
    q: "How do I make a drag-and-drop list accessible for 2.5.7?",
    a: "Keep the drag if you like, but add a single-pointer alternative that produces the same result. Common patterns are up and down (or move-to) buttons on each item, a 'move to' menu that lets the user pick a destination with a tap, or click-to-select then click-to-place. None of these require holding a pointer down and moving it. Remember to also provide a keyboard path and to announce the new position with a live region so screen reader users get feedback.",
  },
  {
    q: "Does 2.5.7 mean I have to remove drag-and-drop?",
    a: "No. The criterion does not ban dragging — it requires that dragging is not the only way. You can keep a rich drag interface for the people who prefer it and simply add a non-drag path (buttons, menus, or tap-to-place) alongside it. Both can coexist in the same component.",
  },
  {
    q: "How do I test for WCAG 2.5.7 compliance?",
    a: "Inventory every feature that uses dragging: sliders, sortable and reorderable lists, kanban boards, carousels dragged by hand, resizable panels, map panning, drag-to-select, and signature or drawing fields. For each one, try to complete the same task using only single taps or clicks — no press-and-move. If you cannot, it fails unless the drag is genuinely essential. Automated tools rarely detect this reliably, so manual testing with a mouse and on a touchscreen is required.",
  },
]

export default function WCAG257Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "2.5.7 Dragging Movements",
            url: "https://accessibility.build/wcag/2-5-7",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 2.5.7 Dragging Movements: The Complete Single-Pointer Alternative Guide"
        description="The definitive guide to WCAG 2.5.7 Dragging Movements, new in WCAG 2.2: why every drag needs a single-pointer alternative, the two exceptions, accessible patterns for sliders, sortable lists and maps, code examples, testing methods, and common mistakes."
        author={{
          name: "Khushwant Parihar",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-02"
        dateModified="2026-07-02"
        image="https://accessibility.build/api/og?title=WCAG%202.5.7%20Dragging%20Movements&section=WCAG"
        url="https://accessibility.build/wcag/2-5-7"
        wordCount={2700}
        keywords={[
          "WCAG 2.5.7",
          "Dragging Movements",
          "drag and drop accessibility",
          "single pointer alternative",
          "WCAG 2.2",
          "Level AA",
          "sortable list accessibility",
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
                    2.5.7 Dragging Movements
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Level AA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                New in WCAG 2.2
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 2: Operable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.5.7: Dragging Movements
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              All functionality that uses a dragging movement can also be
              operated by a{" "}
              <strong className="text-slate-900 dark:text-white">
                single pointer without dragging
              </strong>
              , unless dragging is essential or is determined by the user agent.
              Meeting this Level AA criterion means people who cannot press,
              hold, and precisely move a pointer — because of tremor, limited
              dexterity, or the input device they use — can still complete the
              same task with a simple tap or click.
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
              All functionality that uses a dragging movement for operation can
              be achieved by a single pointer without dragging, unless dragging
              is <strong>essential</strong> or the functionality is determined
              by the <strong>user agent</strong> and not modified by the author.
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
                  Why dragging alternatives matter
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what">
                  What counts as a dragging movement
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#exceptions">
                  The two exceptions
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#patterns">
                  Accessible patterns
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
              Why dragging alternatives matter
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              A dragging movement is one of the most demanding actions an
              interface can ask for. The user has to acquire a small target,
              press and hold the pointer down, move it accurately along a path,
              and release at exactly the right place — all in one uninterrupted
              gesture. That coordination is difficult or impossible for a large
              number of people: those with hand tremor, arthritis,
              Parkinson&apos;s disease, or muscular conditions; people using a
              head pointer, mouth stick, eye-gaze, or single-switch input; and
              anyone whose device makes sustained precise motion awkward, such as
              a trackpad user with a repetitive strain injury or someone on a
              touchscreen in a moving vehicle.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              When dragging is the <em>only</em> way to reorder a list, set a
              value, or move a card, those users are locked out of the feature
              entirely. WCAG 2.5.7 fixes this without banning drag: it simply
              requires that a single-pointer alternative — a tap or click that
              needs no holding and no travel — reaches the same outcome. That
              alternative benefits everyone, including people on small screens
              where an accidental drag is easy to trigger.
            </p>
          </section>

          {/* What */}
          <section aria-labelledby="what" className="mb-12">
            <h2
              id="what"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What counts as a dragging movement
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              A dragging movement, in WCAG terms, is an operation where you set
              the pointer down on a starting point, keep it pressed while moving,
              and lift it at a different end point — and the difference between
              those two points is what triggers the action. Three details decide
              whether 2.5.7 applies:
            </p>
            <ul className="space-y-4 mb-6">
              <li className="flex gap-3">
                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-bold flex items-center justify-center">
                  1
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    The path is what matters, not just the endpoints.
                  </strong>{" "}
                  If the interaction depends on the pointer travelling from A to
                  B while pressed — a slider thumb, a sortable row, a card moving
                  between columns — it is a dragging movement and needs an
                  alternative.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-bold flex items-center justify-center">
                  2
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    A single-pointer alternative means one tap or click.
                  </strong>{" "}
                  The alternative must not itself require dragging or a path-based
                  gesture. Tapping a &ldquo;move up&rdquo; button, clicking a
                  destination, or choosing from a menu all qualify; a two-finger
                  swipe or a different drag does not.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-bold flex items-center justify-center">
                  3
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Path-based gestures are a different criterion.
                  </strong>{" "}
                  Multi-point or directional gestures such as pinch-to-zoom or a
                  two-finger swipe are covered by 2.5.1 Pointer Gestures. 2.5.7 is
                  specifically about drag-and-hold operations that move something
                  from one place to another.
                </p>
              </li>
            </ul>
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-5">
              <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <strong>Rule of thumb:</strong> for every place a user can
                drag something, ask &ldquo;can I reach the exact same result
                with a single tap or click?&rdquo; If the answer is no, you owe
                that feature a non-drag alternative.
              </p>
            </div>
          </section>

          {/* Exceptions */}
          <section aria-labelledby="exceptions" className="mb-12">
            <h2
              id="exceptions"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The two exceptions
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              A dragging movement may lack a single-pointer alternative and still
              conform only if one of these two exceptions genuinely applies. Both
              are narrow — most drag features in real products do not qualify.
            </p>
            <div className="space-y-4">
              {exceptions.map((ex, i) => (
                <div
                  key={ex.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                    {i + 1}. {ex.name}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 font-medium mb-2">
                    {ex.summary}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ex.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Patterns */}
          <section aria-labelledby="patterns" className="mb-12">
            <h2
              id="patterns"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Accessible patterns for common drag features
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                  Sortable / reorderable lists
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Add explicit &ldquo;Move up&rdquo; and &ldquo;Move down&rdquo;
                  buttons (or a &ldquo;Move to…&rdquo; menu) on each row. The drag
                  handle can stay for pointer users who prefer it; the buttons
                  give everyone else a single-tap path. Announce each move with a
                  live region so screen reader users hear the new position.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                  Kanban boards
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Provide a &ldquo;Move to column&rdquo; control on each card — a
                  menu or set of buttons naming each column. A user selects the
                  destination with one tap instead of dragging the card across
                  the board.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                  Custom sliders and range controls
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Let users click anywhere on the track to jump the thumb to that
                  point, and add stepper buttons (− / +) for fine adjustment.
                  Better still, build on a native{" "}
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                    &lt;input type=&quot;range&quot;&gt;
                  </code>{" "}
                  which already supports clicking and arrow keys.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                  Maps and pannable canvases
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Offer directional pan buttons (up, down, left, right) and zoom
                  in/out buttons so the view can be moved without dragging. Most
                  mapping libraries include these controls — make sure they are
                  enabled and reachable.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                  Color pickers and 2-D selectors
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Alongside the draggable swatch area, provide numeric inputs
                  (hue, saturation, RGB, or HEX) so a value can be entered or
                  clicked without dragging the selector.
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
              Reorderable list with move buttons (React)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Keep your drag-and-drop if you have it, but add single-pointer
              move controls that produce the identical result and announce the
              change to assistive technology.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function ReorderableList({ items, setItems }) {
  const [status, setStatus] = useState("")

  function move(index, direction) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    setItems(next)
    setStatus(\`\${next[target].label} moved to position \${target + 1}\`)
  }

  return (
    <ul>
      {items.map((item, i) => (
        <li key={item.id} className="flex items-center gap-2">
          <span className="flex-1">{item.label}</span>
          {/* Single-pointer alternatives to dragging */}
          <button
            type="button"
            onClick={() => move(i, -1)}
            disabled={i === 0}
            aria-label={\`Move \${item.label} up\`}
            className="min-w-[44px] min-h-[44px]"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => move(i, 1)}
            disabled={i === items.length - 1}
            aria-label={\`Move \${item.label} down\`}
            className="min-w-[44px] min-h-[44px]"
          >
            ↓
          </button>
        </li>
      ))}
      {/* Live region announces the new position */}
      <li aria-live="polite" className="sr-only">
        {status}
      </li>
    </ul>
  )
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Custom slider: click the track as a drag alternative
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              If you must build a custom slider, let a single click on the track
              set the value, and expose stepper buttons for precision. A native
              range input is still the better default.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function Slider({ value, min, max, onChange }) {
  function handleTrackClick(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    onChange(Math.round(min + ratio * (max - min)))
  }

  return (
    <div className="flex items-center gap-2">
      <button type="button" aria-label="Decrease"
        onClick={() => onChange(Math.max(min, value - 1))}>−</button>

      {/* Clicking the track jumps the thumb — no drag needed */}
      <div
        role="slider"
        tabIndex={0}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        onClick={handleTrackClick}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onChange(Math.min(max, value + 1))
          if (e.key === "ArrowLeft") onChange(Math.max(min, value - 1))
        }}
        className="relative h-2 flex-1 bg-slate-200"
      >
        <span
          className="absolute h-4 w-4 -translate-x-1/2 rounded-full bg-blue-600"
          style={{ left: \`\${((value - min) / (max - min)) * 100}%\` }}
        />
      </div>

      <button type="button" aria-label="Increase"
        onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  )
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Prefer the native range input
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The simplest way to satisfy 2.5.7 for a slider is to not build one:
              a native range input passes under the User-agent control exception
              and supports clicking and keyboard out of the box.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<label for="volume">Volume</label>
<input
  type="range"
  id="volume"
  min="0"
  max="100"
  value="50"
/>
<!-- Browser provides click-on-track and arrow-key operation,
     so no custom single-pointer alternative is required. -->`}</code>
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
                "Shipping a drag-and-drop reorder, kanban, or slider with no non-drag path at all — the single most frequent 2.5.7 failure.",
                "Offering a keyboard alternative but no single-pointer one. Keyboard support satisfies 2.1.1, not 2.5.7; a mouse or touch user who cannot drag still needs a tap-based option.",
                "Making the 'alternative' another gesture — a swipe or a second drag. The alternative must be a single tap or click with no path.",
                "Over-claiming the Essential exception for features like sortable lists or sliders. Those have obvious tap-based equivalents, so the exception does not apply.",
                "Re-implementing a scrollbar or slider in JavaScript and assuming the User-agent control exception still covers it. Once you build it yourself, you own the alternative.",
                "Forgetting to announce the result of the single-pointer action. Moving an item should update a live region so screen reader users get the same feedback drag users see.",
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
              How to test for 2.5.7
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory every drag interaction",
                  d: "List all features operated by dragging: sliders, sortable and reorderable lists, kanban boards, hand-dragged carousels, resizable panels, map panning, drag-to-select, and drawing or signature fields.",
                },
                {
                  t: "Try each task with single taps or clicks only",
                  d: "For every drag feature, attempt the same outcome using only single presses — no holding and moving. If a control lets you complete it, it passes; if dragging is the only route, it likely fails.",
                },
                {
                  t: "Confirm the alternative is truly single-pointer",
                  d: "Check that the alternative is not itself a gesture or a second drag. A tap on a button, a click on a destination, or a menu selection all qualify.",
                },
                {
                  t: "Judge the exceptions honestly",
                  d: "Only accept a missing alternative when dragging is genuinely essential (freehand drawing, signatures) or entirely user-agent-provided (a native range or scrollbar you have not re-implemented).",
                },
                {
                  t: "Test with mouse and touch",
                  d: "Automated tools rarely detect dragging alternatives, so verify manually on a desktop pointer and on a real touchscreen. Confirm feedback is announced to screen readers.",
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
              Run a full sweep with our{" "}
              <Link
                href="/tools/mobile-accessibility-checker"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Mobile Accessibility Checker
              </Link>{" "}
              and audit a live URL with the{" "}
              <Link
                href="/tools/url-accessibility-auditor"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                URL Accessibility Auditor
              </Link>
              .
            </p>
          </section>

          {/* Related criteria */}
          <div id="related-criteria">
            <CriterionLinks number="2.5.7" />
          </div>

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
            content="dragging movements drag and drop single pointer alternative sortable list kanban slider reorder pointer input motor disability touch accessibility WCAG 2.2 2.5.7 keyboard accessibility target size"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
