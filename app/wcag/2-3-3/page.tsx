import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { FAQStructuredData } from "@/components/seo/structured-data"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 2.3.3 Animation from Interactions — Reduce Motion",
  description:
    "WCAG 2.3.3 explained: motion animation triggered by interaction must be disableable unless essential. prefers-reduced-motion CSS and JS patterns, plus testing.",
  keywords: [
    "WCAG 2.3.3",
    "Animation from Interactions",
    "prefers-reduced-motion",
    "reduce motion",
    "parallax accessibility",
    "vestibular disorders",
    "motion animation",
    "Level AAA",
    "WCAG 2.1 new criteria",
  ],
  alternates: {
    canonical: "/wcag/2-3-3",
  },
  openGraph: {
    title: "WCAG 2.3.3 Animation from Interactions — Reduce Motion",
    description:
      "Motion animation triggered by interaction must be disableable unless essential. The prefers-reduced-motion technique in CSS and JS, with testing steps.",
    url: "/wcag/2-3-3",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%202.3.3%20Animation%20from%20Interactions&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.3.3 Animation from Interactions guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.3.3 Animation from Interactions — Reduce Motion",
    description:
      "Parallax, scroll-zoom, and other interaction-triggered motion must be disableable unless essential. prefers-reduced-motion patterns and testing.",
    images: [
      {
        url: "/api/og?title=WCAG%202.3.3%20Animation%20from%20Interactions&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    question: "What does WCAG 2.3.3 Animation from Interactions require?",
    answer:
      "It requires that motion animation triggered by interaction can be disabled, unless the animation is essential to the functionality or the information being conveyed. 'Triggered by interaction' means the motion happens because the user did something — scrolled, clicked, hovered, dragged — where the user's action did not inherently require that motion. Parallax scrolling is the canonical example: the user asked to scroll; the layered drifting of background images is an added effect that must be disableable.",
  },
  {
    question: "What is 'motion animation', exactly?",
    answer:
      "The WCAG definition is the addition of steps between conditions to create the illusion of movement, or to create a sense of smooth transition — think elements sliding, zooming, drifting, or the viewport gliding. Changes of color, blurring, and opacity fades are explicitly not motion animation, so a simple crossfade is fine even with reduce-motion on. The harm model is vestibular: it is movement across the visual field, especially large or parallax movement, that triggers dizziness and nausea.",
  },
  {
    question: "Is honoring prefers-reduced-motion enough to conform?",
    answer:
      "Yes — respecting the operating system's reduce-motion setting via the prefers-reduced-motion media query is the primary documented technique (C39). Every major OS exposes the setting and every modern browser reports it. A site-level motion toggle is a valuable addition (it helps users who don't know about the OS setting), but the media query is the baseline: if your interaction-triggered motion ignores prefers-reduced-motion, users have no reliable way to disable it.",
  },
  {
    question: "When is animation 'essential' and therefore exempt?",
    answer:
      "Essential means removing the animation would fundamentally change the information or functionality — not merely make it less delightful. Examples that plausibly qualify: the motion of pieces in an animation-based game, a physics simulation being taught, or a page-position indicator whose movement is the information. Examples that do not qualify: parallax backgrounds, scroll-triggered reveals, magnetic hover effects, springy page transitions, and zooming hero images. If the same information can be shown at rest, the animation is decoration and must be disableable.",
  },
  {
    question: "How does 2.3.3 differ from 2.2.2 Pause, Stop, Hide and 2.3.1/2.3.2?",
    answer:
      "2.2.2 (A) covers content that moves by itself — carousels, tickers, autoplaying video — and requires pause/stop/hide controls. 2.3.1 (A) and 2.3.2 (AAA) cover flashing, which is a seizure risk. 2.3.3 (AAA) fills the remaining gap: motion that happens in response to the user's own interaction. A parallax page never 'auto-plays' (so 2.2.2 does not catch it) and never flashes (so 2.3.x flashing rules do not catch it), yet it is one of the most common triggers of vestibular symptoms — that is precisely why 2.3.3 was added in WCAG 2.1.",
  },
  {
    question: "Who is affected by interaction-triggered motion?",
    answer:
      "People with vestibular (inner-ear) disorders — including vestibular migraine, Ménière's disease, and post-concussion syndrome — for whom moving visual fields can cause dizziness, nausea, headaches, and disorientation severe enough to require lying down. An estimated large share of adults experience vestibular dysfunction at some point. Motion sensitivity also affects people with migraine disorders and some autistic users. Unlike a seizure trigger, the reaction can build over seconds, but it can end computer use for hours.",
  },
]

export default function WCAG233Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.3.3: Animation from Interactions"
        description="Motion animation triggered by interaction can be disabled, unless the animation is essential to the functionality or the information being conveyed."
        criteria="2.3.3"
        level="AAA"
        principle="Operable"
        guideline="2.3 Seizures and Physical Reactions"
        url="https://accessibility.build/wcag/2-3-3"
        category="Seizures and Physical Reactions"
        relatedCriteria={["2.3.1", "2.3.2", "2.2.2"]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="2.3.3 Animation from Interactions" />

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
              WCAG 2.3.3: Animation from Interactions
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              The user scrolls; the page answers with parallax layers, zooming
              heroes, and elements swooping in from the sides. For someone with a
              vestibular disorder, that answer can mean minutes — or hours — of
              dizziness and nausea.{" "}
              <strong className="text-slate-900 dark:text-white">
                Motion animation triggered by interaction must be disableable, unless
                the animation is essential
              </strong>
              . In practice, one CSS media query —{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-lg">
                prefers-reduced-motion
              </code>{" "}
              — carries most of the load.
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
              Motion animation triggered by interaction can be disabled, unless the
              animation is essential to the functionality or the information being
              conveyed.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Two defined terms do the work. <em>Motion animation</em>: adding steps
              between conditions to create the illusion of movement or smooth
              transition — movement, not color changes, blurs, or opacity fades.{" "}
              <em>Essential</em>: if removed, the information or functionality would
              fundamentally change. Decoration is never essential.
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
              <li><a className="hover:underline" href="#scope">What the criterion covers</a></li>
              <li><a className="hover:underline" href="#code">prefers-reduced-motion in practice</a></li>
              <li><a className="hover:underline" href="#examples">Pass and fail examples</a></li>
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
              The vestibular system in the inner ear tells the brain how the body is
              moving. When the eyes report large-scale motion that the inner ear does
              not feel — exactly what parallax and scroll-linked effects produce —
              the mismatch can cause real, physical illness:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  t: "People with vestibular disorders",
                  d: "Vestibular migraine, Ménière's disease, labyrinthitis, post-concussion syndrome. Symptoms include vertigo, nausea, headaches, and disorientation that can last hours after exposure.",
                },
                {
                  t: "People with migraine disorders",
                  d: "Moving backgrounds and animated transitions are documented migraine triggers for many people, independent of any vestibular diagnosis.",
                },
                {
                  t: "Some autistic users and people with ADHD",
                  d: "Ambient and reactive motion can be overwhelming or make it impossible to focus on the actual content.",
                },
                {
                  t: "Anyone prone to motion sickness",
                  d: "The same mechanism as car sickness — visual motion without physical motion — operating in reverse.",
                },
              ].map((item) => (
                <div key={item.t} className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.t}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              These users typically enable &ldquo;Reduce motion&rdquo; in their OS
              settings once — and then depend on every site to honor it. The
              criterion turns that dependency into a requirement.
            </p>
          </section>

          {/* Scope */}
          <section aria-labelledby="scope" className="mb-12">
            <h2 id="scope" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              What the criterion covers — and what it doesn&rsquo;t
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">
                  In scope: interaction-triggered motion
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>Parallax scrolling — layers moving at different speeds as the user scrolls.</li>
                  <li>Scroll-triggered reveals: elements sliding, zooming, or rotating into view.</li>
                  <li>Scroll-linked effects: heroes that scale, pin, or morph with scroll position.</li>
                  <li>Hover- and click-triggered movement: magnetic buttons, springy cards, shake effects.</li>
                  <li>Animated page transitions that fly or slide content when a link is activated.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                  Out of scope (for this criterion)
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>Color changes, opacity fades, and blurs — explicitly not motion animation.</li>
                  <li>Autoplaying motion (carousels, background video) — that is 2.2.2 Pause, Stop, Hide territory.</li>
                  <li>Flashing — covered by 2.3.1 and 2.3.2.</li>
                  <li>The scrolling itself: content moving because the user scrolls is the interaction, not an added animation.</li>
                  <li>Essential animation, where motion is the information — rare, and never mere decoration.</li>
                </ul>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              &ldquo;Can be disabled&rdquo; does not require removing your animations
              for everyone. It requires a working off-switch: honoring the OS-level
              reduce-motion signal, offering a site toggle, or both. Users who enjoy
              motion keep it; users it harms escape it.
            </p>
          </section>

          {/* Code */}
          <section aria-labelledby="code" className="mb-12">
            <h2 id="code" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              prefers-reduced-motion in practice
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              CSS: neutralize motion, keep meaning
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Prefer replacing movement with an instant or fading equivalent rather
              than deleting feedback entirely. A robust site-wide baseline plus
              targeted overrides:
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* Motion is the default experience… */
.card { transition: transform 300ms ease; }
.card:hover { transform: translateY(-8px); }

.hero__bg { animation: drift 30s linear infinite alternate; }

/* …but it can be disabled. */
@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
  .card:hover { transform: none; box-shadow: 0 0 0 2px currentColor; }

  .hero__bg { animation: none; }

  /* Blunt but effective site-wide guard */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              JavaScript: gate animation libraries and scroll effects
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              JS-driven parallax, GSAP/ScrollTrigger scenes, and smooth-scroll
              libraries bypass CSS — gate them explicitly and react to live changes:
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function setupEffects() {
  if (motionQuery.matches) {
    // Reduced: static layout, content fully present, no scroll-linking
    document.documentElement.classList.add("reduced-motion");
    parallax?.destroy();
    return;
  }
  parallax = new ParallaxController("[data-parallax]");
  initScrollReveals(); // ensure reveals default to visible without JS motion
}

setupEffects();
// Users can flip the OS setting mid-session — respond without a reload
motionQuery.addEventListener("change", setupEffects);`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A site-level toggle for users who don&rsquo;t know the OS setting
            </h3>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<button type="button" id="motion-toggle" aria-pressed="false">
  Reduce motion
</button>

<script>
  const saved = localStorage.getItem("reduceMotion") === "true";
  applyMotionPreference(saved);

  motionToggle.addEventListener("click", () => {
    const next = motionToggle.getAttribute("aria-pressed") !== "true";
    motionToggle.setAttribute("aria-pressed", String(next));
    localStorage.setItem("reduceMotion", String(next));
    applyMotionPreference(next);
  });

  function applyMotionPreference(reduce) {
    document.documentElement.classList.toggle("reduced-motion", reduce);
  }
</script>

<style>
  /* Same rules fire for the OS signal and the site toggle */
  .reduced-motion .hero__bg { animation: none; }
</style>`}</code>
            </pre>
          </section>

          {/* Examples */}
          <section aria-labelledby="examples" className="mb-12">
            <h2 id="examples" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Pass and fail examples
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">✓ Passes 2.3.3</h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A marketing site with rich parallax that collapses to a static layout when prefers-reduced-motion is set.</li>
                  <li>Scroll reveals that become simple opacity fades (not movement) under reduce-motion.</li>
                  <li>An app with an in-product &ldquo;reduce motion&rdquo; setting that persists and covers all transitions.</li>
                  <li>A physics-teaching demo whose motion is the lesson — plausibly essential — offered alongside a step-frame mode anyway.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">✗ Fails 2.3.3</h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A portfolio with heavy scroll-jacking and parallax that ignores prefers-reduced-motion entirely.</li>
                  <li>Reveal-on-scroll cards that still slide 100px into place with the OS setting on.</li>
                  <li>&ldquo;Smooth scroll&rdquo; libraries that keep animating anchor jumps under reduce-motion.</li>
                  <li>A reduce-motion implementation that hides the animated content instead of showing it at rest — content must remain available.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Common failures */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2 id="mistakes" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "Not querying prefers-reduced-motion at all — still the default state of most parallax and scroll-animation implementations.",
                "Covering CSS animations but not JS-driven ones: GSAP timelines, ScrollTrigger scenes, Lottie files, and smooth-scroll libraries keep moving.",
                "Reveal-on-scroll elements that stay invisible under reduce-motion because the 'reveal' animation never runs — always default content to visible.",
                "Only reducing durations ('faster is fine, right?') — a 100ms parallax lurch is still motion; replace movement with fades or nothing.",
                "Ignoring live preference changes, so users must reload after flipping the OS switch mid-session.",
                "Claiming brand delight as 'essential' — essential means the information or functionality would fundamentally change, not the vibe.",
                "A site toggle that exists but is buried, unlabeled, or forgets its state on the next page load.",
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
              How to test for 2.3.3
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Catalog interaction-triggered motion",
                  d: "Scroll every key page slowly, hover interactive elements, trigger transitions. Note each place where content moves because of your action: parallax, reveals, scroll-linked scaling, springy hovers, animated route changes.",
                },
                {
                  t: "Enable reduce-motion at the OS level",
                  d: "macOS: System Settings → Accessibility → Display → Reduce motion. Windows: Settings → Accessibility → Visual effects → Animation effects off. Or emulate prefers-reduced-motion in Chrome DevTools Rendering panel.",
                },
                {
                  t: "Repeat the walkthrough",
                  d: "Every cataloged motion should now be gone or replaced with a non-motion equivalent (instant change or fade). Anything still sliding, zooming, or drifting is a failure — check JS-driven effects especially.",
                },
                {
                  t: "Verify content survives the reduction",
                  d: "Confirm nothing is missing: scroll-revealed sections must be visible, functionality reachable, and layout intact. Disabling animation must never disable content.",
                },
                {
                  t: "Test the live change and any site toggle",
                  d: "Flip the OS setting while the page is open — well-built pages respond without reload. If a site-level toggle exists, confirm it covers the same effects and persists across pages and visits.",
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
              Automated tools can detect whether a stylesheet mentions
              prefers-reduced-motion, but only a manual walkthrough proves the motion
              actually stops. Fold this into the full{" "}
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

          <CriterionLinks number="2.3.3" />
        </article>
      </div>
    </>
  )
}
