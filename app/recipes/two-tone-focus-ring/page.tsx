import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { PageByline } from "@/components/seo/page-byline"
import { FaqSection, type FaqItem } from "@/components/seo/faq-section"
import { clampDescription } from "@/lib/metadata"
import { cn } from "@/lib/utils"
import { getRecipe, recipeRoute } from "@/lib/recipes"
import { CodeSample } from "@/components/recipes/code-sample"
import { FailureCases } from "./failure-cases"
import { LabProvider } from "./lab-context"
import { PairBuilder } from "./pair-builder"
import { RingLab } from "./ring-lab"
import { SwatchWall } from "./swatch-wall"
import styles from "./rings.module.css"

const recipe = getRecipe("two-tone-focus-ring")
const route = recipeRoute(recipe.slug)
const pageTitle = "The Two-Tone Focus Ring: 3:1 on Any Background"
const pageDescription =
  "A focus indicator made of two contrasting bands, so one of them always stands out. Try to break it on any background, build an on-brand pair with W3C's 9:1 rule, copy the CSS, and see the five places it still fails."
const ogImage = `/api/og?title=${encodeURIComponent(pageTitle)}&section=Recipe`

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "two-tone focus indicator",
    "two color focus indicator",
    "focus ring css",
    "focus indicator contrast",
    "wcag focus indicator",
    "focus-visible outline box-shadow",
    "technique c40",
    "focus appearance 2.4.13",
    "non-text contrast focus indicator",
    "accessible focus styles",
    "focus ring on dark background",
    "forced colors focus",
  ],
  alternates: { canonical: route },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: route,
    type: "article",
    siteName: "Accessibility.build",
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Accessibility Recipes", url: "https://accessibility.build/recipes" },
  { name: recipe.title, url: `https://accessibility.build${route}` },
]

const recipeCss = `/* The two-tone focus ring (W3C technique C40) */
:focus-visible {
  /* Inner band. An outline survives forced-colours mode. */
  outline: 2px solid #fff;
  /* Both bands sit on the background, outside the component. */
  outline-offset: 0;
  /* Outer band: 2px of black around the white. */
  box-shadow: 0 0 0 4px #000;
}`

const elevationCss = `/* A card that already has a shadow keeps it */
.card:focus-visible {
  box-shadow: 0 0 0 4px #000, 0 8px 24px rgb(0 0 0 / 0.15);
}`

const faqs: FaqItem[] = [
  {
    question: "Does a two-tone focus ring meet WCAG?",
    answer:
      "It is W3C's sufficient technique C40 for 1.4.11 Non-text Contrast (for the focus state), 2.4.7 Focus Visible and 2.4.13 Focus Appearance, provided each band is at least 2px thick, the two colours contrast at least 9:1 with each other, and the ring sits over one solid background. It does nothing for 2.4.11 Focus Not Obscured or for the order focus moves in.",
  },
  {
    question: "Why not use a thicker single-colour ring instead?",
    answer:
      "Thickness does not fix contrast. Every single colour has backgrounds it disappears against: a 2px or a 6px ring in #2563eb is still 1:1 on a #2563eb button bar. Two bands that contrast with each other cannot both disappear at once.",
  },
  {
    question: "Which band should go on the inside?",
    answer:
      "Either works for contrast. Make the inner band the outline and the outer band the box-shadow, as in the recipe, because the outline is the part that survives forced-colours mode, where the browser repaints it in the user's own colour.",
  },
  {
    question: "Does it work on photos and gradients?",
    answer:
      "Not with a guarantee. The maths covers one solid colour at a time. On a photo or gradient each band may cross a colour close to its own. The two bands still contrast 21:1 with each other, which usually keeps the ring visible, but check those places by eye.",
  },
]

const sources = [
  { label: "W3C: Technique C40, Creating a two-color focus indicator", href: "https://www.w3.org/WAI/WCAG22/Techniques/css/C40" },
  { label: "W3C: Understanding 1.4.11 Non-text Contrast", href: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html" },
  { label: "W3C: Understanding 2.4.7 Focus Visible", href: "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html" },
  { label: "W3C: Understanding 2.4.11 Focus Not Obscured (Minimum)", href: "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html" },
  { label: "W3C: Understanding 2.4.13 Focus Appearance", href: "https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html" },
  { label: "W3C: CSS Color Adjustment Level 1, properties affected by forced colors mode", href: "https://www.w3.org/TR/css-color-adjust-1/" },
  { label: "MDN: forced-colors media feature", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors" },
]

const moreOnFocus = [
  { href: "/wcag/2-4-7", label: "2.4.7 Focus Visible", note: "The AA rule every focusable element has to meet." },
  { href: "/wcag/1-4-11", label: "1.4.11 Non-text Contrast", note: "Where the 3:1 for focus indicators comes from." },
  { href: "/wcag/2-4-13", label: "2.4.13 Focus Appearance", note: "The AAA size and change-of-contrast test." },
  { href: "/wcag/2-4-11", label: "2.4.11 Focus Not Obscured", note: "Sticky headers, banners and what covers focus." },
  { href: "/guides/focus-management", label: "Focus management guide", note: "Moving focus in dialogs, routes and widgets." },
  { href: "/tools/contrast-checker", label: "Contrast checker", note: "Check any ring colour against any background." },
]

const code = "rounded bg-slate-100 px-1 font-mono text-[0.9em] text-slate-900 dark:bg-slate-800 dark:text-slate-100"

function Section({ number, id, title, children }: { number: string; id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t-2 border-slate-900 py-14 dark:border-white">
      <div className="mb-8 flex items-baseline gap-4">
        <span aria-hidden="true" className="font-mono text-4xl font-bold text-slate-500 sm:text-5xl dark:text-slate-400">
          {number}
        </span>
        <h2 id={id} className="scroll-mt-28 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

export default function TwoToneFocusRingRecipe() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema route={route} title={pageTitle} description={pageDescription} datePublished={recipe.publishedAt} section="Recipe" />

      <LabProvider>
        <div className={cn(styles.page, "bg-white pt-12 dark:bg-slate-950")}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="py-3">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/" className="underline underline-offset-2 hover:decoration-2">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/recipes" className="underline underline-offset-2 hover:decoration-2">
                    Accessibility Recipes
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-slate-900 dark:text-white">
                  {recipe.title}
                </li>
              </ol>
            </nav>
          </div>

          <article>
            <header className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
              <p className="font-mono text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                Accessibility Recipe No. 01
              </p>
              <h1 className="mt-3 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-slate-900 sm:text-7xl dark:text-white">
                The two-tone focus ring
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-700 dark:text-slate-300">
                One focus style that keeps at least 3:1 contrast on every solid background. Here is the recipe, the maths that makes it
                work, and the five places it still fails.
              </p>
              <PageByline route={route} className="mt-6" />
            </header>

            {/* The plate: one ring across a white and a black half. */}
            <figure className="m-0">
              <div
                className="relative flex h-64 items-center justify-center border-y-2 border-slate-900 sm:h-80 dark:border-white"
                style={{ background: "linear-gradient(105deg, #ffffff 0 50%, #000000 50% 100%)" }}
              >
                <a
                  href="#lab"
                  className={cn(
                    "relative inline-flex min-h-16 items-center rounded-full bg-[#767676] px-8 text-lg font-bold text-white no-underline sm:px-12 sm:text-xl",
                    styles.twoTonePreview,
                  )}
                >
                  Try to break it
                </a>
              </div>
              <figcaption className="mx-auto max-w-6xl px-4 pt-3 text-sm text-slate-600 sm:px-6 lg:px-8 dark:text-slate-400">
                One ring, two backgrounds. On white the black band shows; on black the white band does. The button is #767676, the grey
                where black and white come closest to a tie.
              </figcaption>
            </figure>

            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <dl className="my-12 grid grid-cols-1 overflow-hidden rounded-3xl border-2 border-slate-900 sm:grid-cols-2 lg:grid-cols-4 dark:border-white">
                {[
                  ["Serves", <>{recipe.serves}</>],
                  ["Prep", <>{recipe.prep}</>],
                  [
                    "Pairs with",
                    <>
                      {recipe.criteria.map((c, i) => (
                        <span key={c.id}>
                          {i > 0 && ", "}
                          <Link href={`/wcag/${c.id.replace(/\./g, "-")}`} className="underline underline-offset-2 hover:decoration-2">
                            {c.id} {c.name}
                          </Link>
                          {c.level === "AAA" && " (AAA)"}
                        </span>
                      ))}
                    </>,
                  ],
                  [
                    "From",
                    <>
                      <a href="https://www.w3.org/WAI/WCAG22/Techniques/css/C40" className="underline underline-offset-2 hover:decoration-2">
                        W3C technique C40
                      </a>
                    </>,
                  ],
                ].map(([label, value], i) => (
                  <div
                    key={i}
                    className="border-b-2 border-dashed border-slate-300 p-5 last:border-b-0 sm:[&:nth-child(odd)]:border-r-2 lg:border-b-0 lg:border-r-2 lg:last:border-r-0 dark:border-slate-700"
                  >
                    <dt className="font-mono text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">{label}</dt>
                    <dd className="mt-2 text-lg font-semibold leading-snug text-slate-900 dark:text-white">{value}</dd>
                  </div>
                ))}
              </dl>

              <Section number="01" id="taste-test" title="Taste test: Tab across twelve backgrounds">
                <div className="mb-8 max-w-3xl space-y-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                  <p>
                    Press Tab to walk the wall. Start with the single blue ring, the style most sites ship, including this one. It
                    reaches 3:1 on only 3 of the 11 solid colours: Paper, Ink and Sunflower. On Focus blue it is gone entirely. Then
                    switch to the two-tone ring and walk it again.
                  </p>
                  <p>Each tile lists both rings&apos; contrast against it. The minimum for a focus indicator is 3:1.</p>
                </div>
                <SwatchWall />
              </Section>

              <Section number="02" id="lab" title="Why it can't lose">
                <div className="mb-8 grid gap-8 lg:grid-cols-2">
                  <div className="max-w-prose space-y-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    <p>
                      Every colour has a contrast ratio against white and another against black. Multiply the two and you always get 21,
                      the contrast between white and black themselves.
                    </p>
                    <p>
                      If two numbers multiply to 21, they cannot both be small. The worst case is when they are equal, at the square root
                      of 21: <strong className="text-slate-900 dark:text-white">4.58:1</strong>. So on any solid background, the better band
                      of a black and white ring has at least 4.58:1, comfortably over the 3:1 a focus indicator needs.
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 p-6 font-mono text-slate-900 dark:bg-slate-900 dark:text-white">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">The working</p>
                    <p className="mt-4 text-sm leading-7">
                      against white = 1.05 ÷ (L + 0.05)
                      <br />
                      against black = (L + 0.05) ÷ 0.05
                      <br />
                      white × black = 1.05 ÷ 0.05 = <strong>21</strong>
                      <br />
                      worst case = √21 ≈ <strong>4.58</strong>
                    </p>
                    <p className="mt-4 font-sans text-sm text-slate-700 dark:text-slate-300">
                      L is the background&apos;s relative luminance, from 0 for black to 1 for white. It cancels out, which is the whole
                      trick.
                    </p>
                  </div>
                </div>
                <p className="mb-6 max-w-3xl text-lg text-slate-700 dark:text-slate-300">
                  Now try to break it. Drag the sliders, type any hex colour, or load a tile from the wall. The single blue ring fails all
                  over the place. The two-tone ring never drops below 3:1, and the last line never moves off 21.
                </p>
                <RingLab />
              </Section>

              <Section number="03" id="recipe" title="The recipe">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Ingredients</h3>
                      <ul className="mt-3 space-y-3 text-lg text-slate-800 dark:text-slate-200">
                        <li>
                          One <code className={code}>outline</code> for the inner band.
                        </li>
                        <li>
                          One <code className={code}>box-shadow</code> for the outer band, reaching 2px further.
                        </li>
                        <li>Two colours at least 9:1 apart. Black and white are 21:1.</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Method</h3>
                      <ol className="mt-3 list-decimal space-y-3 pl-6 text-lg text-slate-800 marker:font-mono marker:font-bold dark:text-slate-200">
                        <li>
                          Put it on <code className={code}>:focus-visible</code>, so keyboard focus always shows it and a mouse click does
                          not.
                        </li>
                        <li>
                          Keep <code className={code}>outline-offset: 0</code>. Both bands then sit on the background outside the
                          component, which is the only place W3C&apos;s guarantee covers.
                        </li>
                        <li>Make each band at least 2px thick. That also meets the size test in 2.4.13 Focus Appearance.</li>
                        <li>
                          Never write <code className={code}>outline: none</code> to swap in a shadow-only ring. Forced-colours mode removes
                          shadows, and the ring with them.
                        </li>
                      </ol>
                    </div>
                  </div>
                  <div className="min-w-0 space-y-6">
                    <CodeSample code={recipeCss} filename="focus-ring.css" />
                    <div className="rounded-2xl border border-slate-300 p-5 dark:border-slate-700">
                      <h3 className="font-bold text-slate-900 dark:text-white">Serving notes</h3>
                      <ul className="mt-3 space-y-3 text-slate-700 dark:text-slate-300">
                        <li>
                          Components that already use <code className={code}>box-shadow</code> for elevation lose it on focus. List both
                          shadows, ring first.
                        </li>
                        <li>
                          A global rule loses to component styles. Search the codebase for <code className={code}>outline: none</code>,{" "}
                          <code className={code}>outline: 0</code> and Tailwind&apos;s <code className={code}>outline-none</code>.
                        </li>
                        <li>Outlines follow border-radius in current browsers, so the ring hugs pills and rounded cards.</li>
                      </ul>
                    </div>
                    <CodeSample code={elevationCss} filename="card.css" />
                  </div>
                </div>
              </Section>

              <Section number="04" id="on-brand" title="Make it on-brand: the 9:1 rule">
                <div className="mb-8 max-w-3xl space-y-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                  <p>
                    Black and white are not the only pair. W3C&apos;s technique C40 gives the general rule: if the two colours contrast at
                    least 9:1 with each other, at least one of them reaches 3:1 against any solid background.
                  </p>
                  <p>
                    It is the same maths. The background that hurts most sits halfway between the two colours, where each band gets the
                    square root of the pair&apos;s contrast. The square root of 9 is 3. Pick a pair below and the builder shows that worst
                    background and writes the CSS.
                  </p>
                </div>
                <PairBuilder />
              </Section>

              <Section number="05" id="limits" title="When the recipe won't save you">
                <p className="mb-8 max-w-3xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                  The recipe fixes one problem: a focus indicator without enough contrast. These five survive it. Each one has a broken
                  and a fixed version to try with the keyboard.
                </p>
                <FailureCases />
              </Section>

              <Section number="06" id="checklist" title="Taste it before you serve it">
                <ol className="grid gap-4 md:grid-cols-2">
                  {[
                    "Tab through every page template with the keyboard alone. Every stop shows the ring.",
                    "Search for outline: none, outline: 0 and outline-none. Each one needs a reason or a replacement.",
                    "Check the ring over photos, gradients and video by eye. The guarantee covers solid colours only.",
                    "Turn on forced colours (Windows contrast themes, or the DevTools emulation) and Tab again.",
                    "Shift and Tab backwards through long pages and scroll areas. Nothing focused may hide under a sticky header or banner.",
                    "Zoom to 200% and 400%. The ring should grow with the page and stay unclipped.",
                  ].map((item, i) => (
                    <li key={item} className="flex gap-4 rounded-2xl border border-slate-300 p-5 dark:border-slate-700">
                      <span aria-hidden="true" className="font-mono text-2xl font-bold text-slate-500 dark:text-slate-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-slate-800 dark:text-slate-200">{item}</span>
                    </li>
                  ))}
                </ol>
              </Section>

              <section aria-labelledby="questions" className="border-t-2 border-slate-900 py-14 dark:border-white">
                <h2 id="questions" className="mb-6 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Questions
                </h2>
                <FaqSection faqs={faqs} title={null} />
              </section>

              <section aria-labelledby="more" className="border-t-2 border-slate-900 py-14 dark:border-white">
                <h2 id="more" className="mb-6 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  More on focus
                </h2>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {moreOnFocus.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group flex h-full flex-col rounded-2xl border border-slate-300 p-5 no-underline hover:border-slate-900 dark:border-slate-700 dark:hover:border-white"
                      >
                        <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                          {item.label}
                          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                        </span>
                        <span className="mt-1 text-sm text-slate-700 dark:text-slate-300">{item.note}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="sources" className="border-t-2 border-slate-900 py-14 dark:border-white">
                <h2 id="sources" className="mb-6 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Sources
                </h2>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  {sources.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} className="underline underline-offset-2 hover:decoration-2">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-10">
                  <Link href="/recipes" className="font-semibold text-slate-900 underline underline-offset-2 hover:decoration-2 dark:text-white">
                    All Accessibility Recipes
                  </Link>
                </p>
              </section>
            </div>
          </article>
        </div>
      </LabProvider>
    </>
  )
}
