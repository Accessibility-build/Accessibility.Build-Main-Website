import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { PageByline } from "@/components/seo/page-byline"
import { FaqSection, type FaqItem } from "@/components/seo/faq-section"
import { CodeSample } from "@/components/recipes/code-sample"
import { clampDescription } from "@/lib/metadata"
import { cn } from "@/lib/utils"
import { getRecipe, recipeRoute } from "@/lib/recipes"
import { Backfires } from "./backfires"
import { Inspector } from "./inspector"
import { TapTest } from "./tap-test"
import styles from "./hit.module.css"

const recipe = getRecipe("invisible-hit-area")
const route = recipeRoute(recipe.slug)
const pageTitle = "The Invisible Hit Area: 24px Targets, Same Look"
const pageDescription =
  "Small icon buttons fail WCAG 2.5.8 Target Size. One transparent pseudo-element grows the area that takes the tap while the icon stays the same size. Inspect hit areas, run a tap test, check the spacing exception, and see where the trick backfires."
const ogImage = `/api/og?title=${encodeURIComponent(pageTitle)}&section=Recipe`

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "target size",
    "wcag 2.5.8",
    "target size minimum",
    "24px target size",
    "44px touch target",
    "increase click area css",
    "pseudo-element hit area",
    "icon button target size",
    "spacing exception 2.5.8",
    "wcag 2.5.5 target size enhanced",
    "touch target accessibility",
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

const recipeCss = `/* The invisible hit area: a 16px icon button, a 24px target */
.icon-button {
  /* The hit area is measured from the button. */
  position: relative;
}
.icon-button::before {
  content: "";
  position: absolute;
  /* (24 - 16) / 2: reach 4px past the button on every side. */
  inset: -4px;
  /* Keep the target the same shape as the button. */
  border-radius: inherit;
}`

const sizesCss = `/* Any visible size, any target: inset = (target - visible) / 2 */
.icon-button--20::before { inset: -2px; }   /* 20px icon, 24px target */
.icon-button--aaa::before { inset: -14px; } /* 16px icon, 44px target */`

const faqs: FaqItem[] = [
  {
    question: "Does an invisible hit area count for WCAG 2.5.8?",
    answer:
      "Yes. WCAG 2.2 defines a target as the region of the display that will accept a pointer action, and a click or tap on a button's ::before is a click on the button. W3C's Understanding document for 2.5.8 itself notes it can help to increase the active target area without increasing the visible size. Overlapping areas do not count, so keep neighbouring hit areas apart.",
  },
  {
    question: "Why not just leave 8px between 16px icons?",
    answer:
      "For AA that works: 16px icons whose centres are 24px apart pass 2.5.8 through the spacing exception. But each icon is still a 16px thing to hit, the exception does not exist in 2.5.5 (AAA), and it does nothing for a lone small button sitting against other controls. The hit area makes the target itself bigger.",
  },
  {
    question: "Does it work for touch, pen and mouse?",
    answer:
      "Yes. Pointer events on a pseudo-element go to the element it belongs to, whatever the pointer. Keyboard users are not affected by target size at all; what they need is a visible focus indicator.",
  },
  {
    question: "Why does my accessibility checker still flag the button?",
    answer:
      "Most automated checkers, axe included, measure the element's own box and do not add its pseudo-elements. Verify the real target by hand, or use padding with min-width and min-height (W3C technique C42), which tools can measure but which takes space in the layout.",
  },
]

const sources = [
  { label: "W3C: Understanding 2.5.8 Target Size (Minimum)", href: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html" },
  { label: "W3C: Understanding 2.5.5 Target Size (Enhanced)", href: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html" },
  { label: "W3C: WCAG 2.2, definition of target", href: "https://www.w3.org/TR/WCAG22/#dfn-targets" },
  { label: "W3C: Technique C42, min-height and min-width on target containers", href: "https://www.w3.org/WAI/WCAG22/Techniques/css/C42" },
]

const more = [
  { href: "/wcag/2-5-8", label: "2.5.8 Target Size (Minimum)", note: "The AA rule, its five exceptions and how to test it." },
  { href: "/wcag/2-5-5", label: "2.5.5 Target Size (Enhanced)", note: "The 44px AAA rule, with no spacing exception." },
  { href: "/tools/target-size-checker", label: "Target size checker", note: "Measure every target on a page at phone width." },
  { href: "/recipes/two-tone-focus-ring", label: "Recipe No. 01: the two-tone focus ring", note: "A focus style that shows on any background." },
]

const code = "rounded bg-slate-100 px-1 font-mono text-[0.9em] text-slate-900 dark:bg-slate-800 dark:text-slate-100"
const blueprint = {
  backgroundColor: "#0b2545",
  backgroundImage:
    "linear-gradient(rgb(255 255 255 / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.07) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
}

function Sheet({ number, id, title, children }: { number: string; id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="py-14">
      <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b-2 border-dashed border-[#0b2545] pb-3 dark:border-amber-300/60">
        <span className="font-mono text-sm font-bold uppercase tracking-widest text-[#0b2545] dark:text-amber-200">Sheet {number}</span>
        <h2 id={id} className="scroll-mt-28 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

export default function InvisibleHitAreaRecipe() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema route={route} title={pageTitle} description={pageDescription} datePublished={recipe.publishedAt} section="Recipe" />

      <div className={cn(styles.page, "bg-white pt-12 dark:bg-slate-950")}>
        <article>
          <header style={blueprint} className="text-white">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <nav aria-label="Breadcrumb" className="py-3">
                <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
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
                  <li aria-current="page" className="text-white">
                    {recipe.title}
                  </li>
                </ol>
              </nav>

              <div className="grid items-center gap-10 pb-14 pt-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                <div>
                  <p className="font-mono text-sm font-semibold uppercase tracking-widest text-amber-200">Accessibility Recipe No. 02</p>
                  <h1 className="mt-3 text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">The invisible hit area</h1>
                  <p className="mt-6 max-w-xl text-xl leading-relaxed text-slate-200">
                    A 24px target without changing how the button looks. One transparent pseudo-element does it. Here is what it
                    fixes, what it does not, and the places it backfires.
                  </p>
                  <PageByline route={route} variant="hero" tone="inverse" className="mt-6" />
                </div>

                {/* The drawing: one 16px icon, its 24px and 44px targets, with dimension labels. */}
                <figure className="m-0">
                  <div className="relative mx-auto flex aspect-square w-full max-w-xs items-center justify-center" aria-hidden="true">
                    <span className="absolute h-[88%] w-[88%] rounded-[28%] border-2 border-dashed border-sky-300" />
                    <span className="absolute h-[48%] w-[48%] rounded-[24%] border-2 border-dashed border-amber-300" />
                    <span className="flex h-[32%] w-[32%] items-center justify-center rounded-[20%] bg-white text-5xl font-black text-[#0b2545]">×</span>
                    <span className="absolute right-0 top-2 font-mono text-xs font-semibold text-sky-200">44px AAA</span>
                    <span className="absolute left-[18%] top-[22%] font-mono text-xs font-semibold text-amber-200">24px AA</span>
                    <span className="absolute bottom-[30%] font-mono text-xs font-semibold text-white">16px icon</span>
                  </div>
                  <figcaption className="mt-3 text-center text-sm text-slate-200">
                    Drawn to scale: the icon never changes, only the area that takes the tap.
                  </figcaption>
                </figure>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <dl className="mt-12 grid grid-cols-1 overflow-hidden rounded-3xl border-2 border-[#0b2545] sm:grid-cols-2 lg:grid-cols-4 dark:border-amber-300/60">
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
                  "Measure with",
                  <>
                    <Link href="/tools/target-size-checker" className="underline underline-offset-2 hover:decoration-2">
                      Target size checker
                    </Link>
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

            <Sheet number="01" id="inspect" title="Inspect the targets">
              <div className="mb-8 max-w-3xl space-y-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                <p>
                  A formatting toolbar of 16px icons, 4px apart, the size a lot of editors ship. Turn the hit area on and the painted
                  boxes show what actually takes the tap, while the icons stay exactly as they were. The verdicts underneath apply
                  the real rules, including the spacing exception and the fact that overlapping area does not count.
                </p>
                <p>Try 24px with the 4px gap, then widen the gap to 8px. Then try 44px and see why AAA is so hard in dense toolbars.</p>
              </div>
              <Inspector />
            </Sheet>

            <Sheet number="02" id="tap-test" title="Why the size matters: the tap test">
              <TapTest />
            </Sheet>

            <Sheet number="03" id="recipe" title="The recipe">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                <div className="space-y-8">
                  <div>
                    <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Ingredients</h3>
                    <ul className="mt-3 space-y-3 text-lg text-slate-800 dark:text-slate-200">
                      <li>
                        <code className={code}>position: relative</code> on the button.
                      </li>
                      <li>
                        One empty <code className={code}>::before</code>, absolutely positioned.
                      </li>
                      <li>
                        A negative <code className={code}>inset</code> of (target minus visible size) divided by two.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Method</h3>
                    <ol className="mt-3 list-decimal space-y-3 pl-6 text-lg text-slate-800 marker:font-mono marker:font-bold dark:text-slate-200">
                      <li>Work out the inset: a 16px icon needs 4px on every side for 24px, or 14px for 44px.</li>
                      <li>Check the neighbours. Hit areas may touch but must not overlap; overlapping area does not count.</li>
                      <li>Make sure no parent clips it. Anything with overflow hidden needs room around the button.</li>
                      <li>Skip links inside sentences. They are exempt, and growing them steals taps from the text around them.</li>
                    </ol>
                  </div>
                </div>
                <div className="min-w-0 space-y-6">
                  <CodeSample code={recipeCss} filename="icon-button.css" />
                  <div className="rounded-2xl border border-slate-300 p-5 dark:border-slate-700">
                    <h3 className="font-bold text-slate-900 dark:text-white">Serving notes</h3>
                    <ul className="mt-3 space-y-3 text-slate-700 dark:text-slate-300">
                      <li>
                        If the button already uses <code className={code}>::before</code> for an icon, use{" "}
                        <code className={code}>::after</code>, or put the hit area on a wrapper.
                      </li>
                      <li>
                        The pseudo-element takes no space in the layout, so the design does not move. That is the whole point, and
                        also why automated checkers miss it.
                      </li>
                      <li>
                        Keyboard users never hit targets; they need a visible focus ring. See{" "}
                        <Link href="/recipes/two-tone-focus-ring" className="underline underline-offset-2 hover:decoration-2">
                          recipe No. 01
                        </Link>
                        .
                      </li>
                    </ul>
                  </div>
                  <CodeSample code={sizesCss} filename="sizes.css" />
                </div>
              </div>
            </Sheet>

            <Sheet number="04" id="backfires" title="Where it backfires">
              <p className="mb-8 max-w-3xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                The trick changes one thing: the area that accepts the pointer. These five details decide whether that helps or
                hurts. The painted areas in each example are the hit areas, and the small examples are drawn two and a half times actual size.
              </p>
              <Backfires />
            </Sheet>

            <Sheet number="05" id="checklist" title="Measure before you ship">
              <ol className="grid gap-4 md:grid-cols-2">
                {[
                  "Turn on a temporary outline for ::before in DevTools and look at every icon button: the painted box is the target.",
                  "Run the target size checker at phone width. Expect flags on pseudo-element hit areas and confirm those by hand.",
                  "Where icons sit close together, check that hit areas meet but never overlap.",
                  "Tap through on a real phone, including the corners of cards and the edges of dialogs.",
                  "Tab through with the keyboard: every icon button still needs a visible focus ring.",
                  "Leave inline links alone, and give paragraphs a line height of at least 1.5.",
                ].map((item, i) => (
                  <li key={item} className="flex gap-4 rounded-2xl border border-slate-300 p-5 dark:border-slate-700">
                    <span aria-hidden="true" className="font-mono text-2xl font-bold text-slate-500 dark:text-slate-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200">{item}</span>
                  </li>
                ))}
              </ol>
            </Sheet>

            <section aria-labelledby="questions" className="border-t-2 border-dashed border-[#0b2545] py-14 dark:border-amber-300/60">
              <h2 id="questions" className="mb-6 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Questions
              </h2>
              <FaqSection faqs={faqs} title={null} />
            </section>

            <section aria-labelledby="more" className="border-t-2 border-dashed border-[#0b2545] py-14 dark:border-amber-300/60">
              <h2 id="more" className="mb-6 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                More on targets
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {more.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex h-full flex-col rounded-2xl border border-slate-300 p-5 no-underline hover:border-slate-900 dark:border-slate-700 dark:hover:border-white"
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

            <section aria-labelledby="sources" className="border-t-2 border-dashed border-[#0b2545] py-14 dark:border-amber-300/60">
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
    </>
  )
}
