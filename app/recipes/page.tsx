import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { clampDescription } from "@/lib/metadata"
import { recipeRoute, recipes } from "@/lib/recipes"
import { RecipeArt } from "@/components/recipes/recipe-art"

const pageTitle = "Accessibility Recipes: Small Techniques, Live Demos"
const pageDescription =
  "Small accessibility techniques you can copy today. Every recipe comes with a live demo you can try to break, the code, the WCAG criteria it serves, and an honest list of where it stops working."
const ogImage = `/api/og?title=${encodeURIComponent("Accessibility Recipes")}&section=Recipes`

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: ["accessibility recipes", "accessibility techniques", "accessible css", "wcag techniques", "accessibility demos", "accessibility code examples"],
  alternates: { canonical: "/recipes" },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/recipes",
    type: "website",
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
]

const anatomy = [
  ["The problem", "One specific barrier, in plain words."],
  ["The technique", "The smallest change that removes it."],
  ["A demo to break", "Try it yourself before you trust it."],
  ["The code", "Ready to copy, with every line explained."],
  ["Where it fails", "The cases it does not cover, with their fixes."],
]

// The two-tone ring, as Tailwind utilities, for links on this page.
const ring =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white focus-visible:shadow-[0_0_0_4px_#000]"

export default function RecipesIndex() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <div className="bg-white pt-12 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="py-3">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className={`underline underline-offset-2 hover:decoration-2 ${ring}`}>
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-slate-900 dark:text-white">
                Accessibility Recipes
              </li>
            </ol>
          </nav>

          <header className="pb-14 pt-8">
            <p className="font-mono text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
              Small techniques, tested
            </p>
            <h1 className="mt-3 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-slate-900 sm:text-7xl dark:text-white">
              Accessibility Recipes
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-700 dark:text-slate-300">
              Techniques you can copy today. Every recipe comes with a live demo you can try to break, the code, and an honest list of
              where it stops working.
            </p>
          </header>

          <section aria-labelledby="anatomy" className="border-t-2 border-slate-900 py-12 dark:border-white">
            <h2 id="anatomy" className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              How every recipe is written
            </h2>
            <ol className="mt-6 grid gap-px overflow-hidden rounded-3xl border-2 border-slate-900 bg-slate-900 sm:grid-cols-2 lg:grid-cols-5 dark:border-white dark:bg-white">
              {anatomy.map(([title, body], i) => (
                <li key={title} className="bg-white p-5 dark:bg-slate-950">
                  <span aria-hidden="true" className="font-mono text-sm font-bold text-slate-500 dark:text-slate-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-1 font-bold text-slate-900 dark:text-white">{title}</p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="menu" className="border-t-2 border-slate-900 pb-20 pt-12 dark:border-white">
            <h2 id="menu" className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              On the menu
            </h2>
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {recipes.map((recipe, i) => (
                <li
                  key={recipe.slug}
                  className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-slate-900 bg-white transition-shadow hover:shadow-[8px_8px_0_0_#0f172a] dark:border-white dark:bg-slate-950 dark:hover:shadow-[8px_8px_0_0_#ffffff]"
                >
                  <RecipeArt recipe={recipe} className="h-44 border-b-2 border-slate-900 dark:border-white" />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-mono text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                      No. {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                      <Link
                        href={recipeRoute(recipe.slug)}
                        className={`after:absolute after:inset-0 after:content-[''] hover:underline hover:underline-offset-4 ${ring}`}
                      >
                        {recipe.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-slate-700 dark:text-slate-300">{recipe.dek}</p>
                    <dl className="mt-auto grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 pt-6 text-sm">
                      <dt className="font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Serves</dt>
                      <dd className="text-slate-900 dark:text-white">{recipe.serves}</dd>
                      <dt className="font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Prep</dt>
                      <dd className="text-slate-900 dark:text-white">{recipe.prep}</dd>
                      <dt className="font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">WCAG</dt>
                      <dd className="text-slate-900 dark:text-white">{recipe.criteria.map((c) => c.id).join(", ")}</dd>
                    </dl>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
