import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { FAQStructuredData } from "@/components/seo/structured-data"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 2.1.3 Keyboard (No Exception) — Full Keyboard Use",
  description:
    "WCAG 2.1.3 Keyboard (No Exception) explained: every function must work from a keyboard, with no path-based exception. Examples, code, testing steps, and FAQs.",
  keywords: [
    "WCAG 2.1.3",
    "Keyboard No Exception",
    "keyboard accessibility",
    "keyboard operable",
    "drag and drop keyboard alternative",
    "path-dependent input",
    "Level AAA",
    "WCAG 2.2",
    "keyboard interface",
  ],
  alternates: {
    canonical: "/wcag/2-1-3",
  },
  openGraph: {
    title: "WCAG 2.1.3 Keyboard (No Exception) — Full Keyboard Use",
    description:
      "Every function must be operable through a keyboard interface — with no exception for path-dependent input. What changes versus 2.1.1, code patterns, and how to test.",
    url: "/wcag/2-1-3",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%202.1.3%20Keyboard%20%28No%20Exception%29&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.1.3 Keyboard (No Exception) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.1.3 Keyboard (No Exception) — Full Keyboard Use",
    description:
      "The AAA version of the keyboard rule: all functionality keyboard-operable, no path-dependent exception. Examples, code, and testing steps.",
    images: [
      {
        url: "/api/og?title=WCAG%202.1.3%20Keyboard%20%28No%20Exception%29&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    question: "What does WCAG 2.1.3 Keyboard (No Exception) require?",
    answer:
      "It requires that all functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes — full stop. It is the Level AAA version of 2.1.1 Keyboard, and it removes the one exception 2.1.1 allows: functionality that depends on the path of the user's movement. Under 2.1.3, even path-dependent features such as freehand drawing must have some keyboard-operable way to achieve the same result.",
  },
  {
    question: "How is 2.1.3 different from 2.1.1 Keyboard?",
    answer:
      "The normative text is almost identical. 2.1.1 (Level A) ends with an exception: 'except where the underlying function requires input that depends on the path of the user's movement and not just the endpoints.' 2.1.3 (Level AAA) deletes that clause. So under 2.1.1 a signature pad or freehand drawing tool may be mouse-only; under 2.1.3 it may not — you must provide a keyboard-operable alternative that accomplishes the same underlying task, or the page cannot claim AAA conformance for that functionality.",
  },
  {
    question: "Does 2.1.3 mean I cannot use drag-and-drop at all?",
    answer:
      "No. You can keep drag-and-drop as a convenience — pointer interactions are fine and often faster for mouse users. What 2.1.3 requires is that everything drag-and-drop achieves can also be achieved with the keyboard alone: reordering with arrow keys, a 'move to' menu, cut-and-paste commands, or grab/drop key patterns. The pointer path is an enhancement; the keyboard path is the requirement.",
  },
  {
    question: "What does 'without requiring specific timings for individual keystrokes' mean?",
    answer:
      "It means the interface must not depend on how fast or in what rhythm keys are pressed. A control that only activates if two keys are pressed within 200 milliseconds of each other, or that requires holding a key for an exact duration, fails. Users with motor disabilities may type one key at a time with long pauses, often through alternate input hardware that emulates a keyboard. Note this phrase appears in both 2.1.1 and 2.1.3 — it is not the difference between them.",
  },
  {
    question: "Can any website realistically meet 2.1.3?",
    answer:
      "Most can. The vast majority of web functionality — navigation, forms, media controls, editors, sortable lists, sliders, maps — has well-established keyboard patterns. The genuinely hard cases are path-dependent by nature: freehand drawing, handwritten signatures, gesture-based games. Even there, alternatives exist: typed signatures, shape palettes with keyboard placement and arrow-key nudging, or parameter-based input. If a feature truly cannot be made keyboard-operable, the page simply cannot conform at Level AAA — which is one reason AAA is a target for specific pages, not usually entire sites.",
  },
  {
    question: "Does using a touchscreen or voice control satisfy 2.1.3?",
    answer:
      "No. The criterion is specifically about a keyboard interface, because the keyboard is the universal fallback that almost every assistive technology can emulate — sip-and-puff devices, switch access, on-screen keyboards, and speech input all generate keyboard events. If something works only by touch gesture or only by voice, users of those keyboard-emulating technologies are locked out. Supporting the keyboard interface is what makes all the others work.",
  },
]

export default function WCAG213Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.1.3: Keyboard (No Exception)"
        description="All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes, with no exception for path-dependent input."
        criteria="2.1.3"
        level="AAA"
        principle="Operable"
        guideline="2.1 Keyboard Accessible"
        url="https://accessibility.build/wcag/2-1-3"
        category="Keyboard Accessible"
        relatedCriteria={["2.1.1", "2.1.2", "2.1.4"]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="2.1.3 Keyboard (No Exception)" />

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
                Guideline 2.1 Keyboard Accessible
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.1.3: Keyboard (No Exception)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              The Level A keyboard rule, 2.1.1, has exactly one escape hatch:
              functionality that depends on the <em>path</em> of the user&rsquo;s
              movement — freehand drawing, for instance — may be pointer-only. This
              criterion closes that hatch.{" "}
              <strong className="text-slate-900 dark:text-white">
                At Level AAA, every function must be operable from the keyboard, no
                exceptions
              </strong>
              . If a mouse can do it, a keyboard user must be able to do it too.
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
              All functionality of the content is operable through a keyboard
              interface without requiring specific timings for individual keystrokes.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Compare this with{" "}
              <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                2.1.1 Keyboard
              </Link>{" "}
              (Level A): the wording is identical <em>except</em> that 2.1.1 ends with
              &ldquo;…except where the underlying function requires input that depends
              on the path of the user&rsquo;s movement and not just the
              endpoints.&rdquo; 2.1.3 deletes that clause. That deletion is the entire
              criterion.
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
              <li><a className="hover:underline" href="#versus">2.1.3 vs. 2.1.1: what changes</a></li>
              <li><a className="hover:underline" href="#examples">Pass and fail examples</a></li>
              <li><a className="hover:underline" href="#code">Code examples</a></li>
              <li><a className="hover:underline" href="#mistakes">Common failures</a></li>
              <li><a className="hover:underline" href="#testing">How to test</a></li>
              <li><a className="hover:underline" href="#faq">FAQ</a></li>
            </ul>
          </nav>

          {/* Who this helps */}
          <section aria-labelledby="who" className="mb-12">
            <h2 id="who" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Who this helps
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The keyboard interface is the universal adapter of assistive technology.
              People who cannot use a mouse — because of tremor, paralysis, missing
              limbs, chronic pain, or low vision that makes tracking a pointer
              impossible — almost always operate the web through something that emits
              keyboard events:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  t: "Switch access users",
                  d: "One or two physical switches, driven by head, hand, or breath, scanning through keyboard-focusable controls.",
                },
                {
                  t: "Screen reader users",
                  d: "Blind users cannot follow a pointer path at all — the keyboard is the only way they operate content.",
                },
                {
                  t: "Alternate keyboard users",
                  d: "Sip-and-puff devices, eye-gaze systems, and on-screen keyboards that emulate keystrokes.",
                },
                {
                  t: "People with tremor or fatigue",
                  d: "Steady dragging along a path is far harder than pressing discrete keys, one at a time, at any pace.",
                },
              ].map((item) => (
                <div key={item.t} className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.t}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              For these users, a feature that is pointer-only is not merely
              inconvenient — it does not exist. 2.1.3 says that at the highest
              conformance level, nothing on the page is allowed to not exist for them.
            </p>
          </section>

          {/* Versus 2.1.1 */}
          <section aria-labelledby="versus" className="mb-12">
            <h2 id="versus" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              2.1.3 vs. 2.1.1: what actually changes
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Under 2.1.1, a &ldquo;path-dependent&rdquo; function — one where the
              route the pointer travels matters, not just where it starts and ends —
              is exempt. Classic examples: freehand drawing in a paint tool, a
              handwritten signature pad, steering in a driving game. Everything else
              already had to be keyboard-operable at Level A.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              2.1.3 removes the exemption. Three things follow:
            </p>
            <ul className="space-y-3 mb-4">
              {[
                "Drag-and-drop was never exempt — dragging a card between columns depends only on start and end points, so it already needed a keyboard alternative under 2.1.1. 2.1.3 changes nothing there; it just makes the requirement easier to remember: everything, always.",
                "Genuinely path-dependent features now need an equivalent. A signature pad needs a typed-signature option; a freehand annotation tool needs keyboard-placeable shapes or text notes that serve the same purpose.",
                "The keystroke-timing clause stays. Neither criterion allows interfaces that require specific timings for individual keystrokes — that protection exists at Level A and simply carries through.",
              ].map((m) => (
                <li key={m} className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                  <span aria-hidden="true" className="text-purple-500 font-bold">→</span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Also related but distinct:{" "}
              <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                2.1.2 No Keyboard Trap
              </Link>{" "}
              (A) ensures focus can always leave a component, and{" "}
              <Link href="/wcag/2-5-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                2.5.7 Dragging Movements
              </Link>{" "}
              (AA) requires a single-pointer alternative to dragging. 2.1.3 sits above
              all of them: total keyboard operability.
            </p>
          </section>

          {/* Examples */}
          <section aria-labelledby="examples" className="mb-12">
            <h2 id="examples" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Pass and fail examples
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                  ✓ Passes 2.1.3
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A kanban board where cards can be dragged with a mouse <em>and</em> moved with arrow keys after pressing Space to &ldquo;grab&rdquo; them.</li>
                  <li>A signature step that offers &ldquo;Draw&rdquo; and &ldquo;Type your name&rdquo; options with equal legal standing.</li>
                  <li>A map that pans with arrow keys, zooms with +/−, and exposes search and location lists as focusable controls.</li>
                  <li>A diagram editor where shapes are inserted from a keyboard-navigable palette and nudged with arrow keys.</li>
                  <li>A slider operable with arrow keys, Home, End, Page Up, and Page Down.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">
                  ✗ Fails 2.1.3
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A signature pad that only accepts pointer strokes — this passes 2.1.1 via the path exception, but fails 2.1.3.</li>
                  <li>A freehand highlighter for annotating documents with no typed-comment or keyboard-placed alternative.</li>
                  <li>A file-upload area that responds only to drag-and-drop, with no browse button.</li>
                  <li>A custom dropdown that opens on hover and cannot be opened or navigated by keyboard.</li>
                  <li>A gesture-drawn unlock pattern with no PIN or password alternative.</li>
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
              Keyboard alternative to drag-and-drop reordering
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The grab-and-move pattern: Space (or Enter) picks up the item, arrow
              keys move it, Space drops it, Escape cancels. Announce each move to a
              live region so screen reader users hear the result.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<ul role="listbox" aria-label="Task order">
  <li role="option" tabindex="0" aria-describedby="reorder-hint">
    Write launch email
  </li>
  <!-- … -->
</ul>
<p id="reorder-hint" class="sr-only">
  Press Space to grab, arrow keys to move, Space to drop, Escape to cancel.
</p>
<div aria-live="polite" class="sr-only" id="move-status"></div>

<script>
  let grabbed = null;
  list.addEventListener("keydown", (e) => {
    const item = e.target.closest("[role='option']");
    if (!item) return;
    if (e.key === " ") {
      e.preventDefault();
      grabbed = grabbed ? null : item; // grab / drop
      status.textContent = grabbed
        ? \`\${item.textContent} grabbed\`
        : \`\${item.textContent} dropped\`;
    }
    if (grabbed && e.key === "ArrowUp" && item.previousElementSibling) {
      item.parentNode.insertBefore(item, item.previousElementSibling);
      item.focus();
      status.textContent = \`Moved up to position \${position(item)}\`;
    }
    if (grabbed && e.key === "ArrowDown" && item.nextElementSibling) {
      item.parentNode.insertBefore(item.nextElementSibling, item);
      item.focus();
      status.textContent = \`Moved down to position \${position(item)}\`;
    }
  });
</script>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A typed alternative to a path-dependent signature
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Keep the canvas for pointer users; make the keyboard route a first-class
              equal, not a degraded fallback.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<fieldset>
  <legend>Sign this document</legend>

  <div role="radiogroup" aria-label="Signature method">
    <label><input type="radio" name="sig-mode" value="draw" /> Draw signature</label>
    <label><input type="radio" name="sig-mode" value="type" checked /> Type signature</label>
  </div>

  <!-- Pointer path (optional enhancement) -->
  <canvas id="sig-pad" width="400" height="120" hidden></canvas>

  <!-- Keyboard path (always available) -->
  <label for="sig-text">Type your full legal name</label>
  <input id="sig-text" type="text" autocomplete="name" />
  <p>Your typed name will be rendered as your signature.</p>
</fieldset>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Never rely on hover or pointer events alone
            </h3>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✗ Reveal only on hover — keyboard users never see it */
.card .actions { display: none; }
.card:hover .actions { display: flex; }

/* ✓ Reveal on hover AND keyboard focus within the card */
.card:hover .actions,
.card:focus-within .actions { display: flex; }`}</code>
            </pre>
          </section>

          {/* Common failures */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2 id="mistakes" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "Treating the 2.1.1 path exception as permanent — shipping a drawing, sketching, or signature feature with no keyboard-operable equivalent and still claiming AAA.",
                "Drag-only interactions: file dropzones, sortable lists, sliders, or map pins that respond to pointer drags but ignore the keyboard entirely.",
                "Custom widgets built from <div> and <span> with click handlers but no tabindex, no keydown handling, and no focus styles.",
                "Actions that appear only on mouse hover (row action buttons, tooltips, mega-menus) with no focus-based equivalent.",
                "Requiring rapid or precisely-timed key presses — double-tap shortcuts with tight windows, or hold-to-confirm patterns with no alternative.",
                "Canvas- or WebGL-based UI that paints its own controls and never exposes them as focusable, operable elements.",
                "Keyboard alternatives that exist but are hidden behind a pointer-only affordance, such as an options menu that itself opens only on right-click.",
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
              How to test for 2.1.3
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Unplug the mouse",
                  d: "Literally, if you can. Put the pointer away and attempt to complete every task the page offers using only Tab, Shift+Tab, Enter, Space, arrow keys, and Escape. Anything you cannot do is a candidate failure.",
                },
                {
                  t: "Inventory every function, not every element",
                  d: "The unit of testing is functionality: 'reorder tasks', 'sign the contract', 'crop the image'. For each function, ask whether some keyboard-only route achieves the same outcome — it does not have to be the same mechanics.",
                },
                {
                  t: "Hunt the path-dependent features specifically",
                  d: "Drawing surfaces, signature pads, annotation tools, gesture inputs, games. These pass 2.1.1 without a keyboard route, so they are exactly where 2.1.3 failures hide. Each needs an equivalent alternative.",
                },
                {
                  t: "Check for timing dependence",
                  d: "Operate slowly. Press keys one at a time with long pauses. If any interaction requires speed — chorded keys within a window, hold durations, rapid double-presses — it fails unless an untimed alternative exists.",
                },
                {
                  t: "Verify with a screen reader",
                  d: "Run through the same tasks with NVDA or VoiceOver. This confirms the keyboard routes are also perceivable: focus is visible and announced, state changes are reported, and instructions for custom key patterns are exposed.",
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
              Automated scanners can flag missing tabindex or click-only handlers, but
              only a human can judge whether a keyboard route truly accomplishes the
              same function. Work through the full{" "}
              <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                WCAG 2.2 checklist
              </Link>{" "}
              alongside this criterion.
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

          <CriterionLinks number="2.1.3" />
        </article>
      </div>
    </>
  )
}
