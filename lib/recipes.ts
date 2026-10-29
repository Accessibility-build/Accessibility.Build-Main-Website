/**
 * Accessibility Recipes: small, tested techniques, each with a live demo and an honest list of
 * where it stops working. Every recipe page owns its own layout; this registry only feeds the
 * /recipes index, the site route table and related links.
 */
export interface Recipe {
  slug: string
  title: string
  /** One-line promise shown under the title on the index card. */
  dek: string
  /** Meta description and index card summary. */
  description: string
  /** First publication date, YYYY-MM-DD. */
  publishedAt: string
  /** "Serves": where the technique works. */
  serves: string
  /** "Prep": how much code it takes. */
  prep: string
  /** WCAG 2.2 success criteria the recipe addresses. */
  criteria: { id: string; name: string; level: "A" | "AA" | "AAA" }[]
  /** Two colours for the index card art. */
  art: [string, string]
}

export const recipes: Recipe[] = [
  {
    slug: "two-tone-focus-ring",
    title: "The Two-Tone Focus Ring",
    dek: "One focus style that keeps 3:1 contrast on any solid background.",
    description:
      "A focus indicator built from two contrasting bands, so one of them always stands out. Try to break it on any background, build your own colour pair with the 9:1 rule, copy the CSS, and see the five places it still fails.",
    publishedAt: "2026-10-29",
    serves: "Any solid background",
    prep: "Two CSS declarations",
    criteria: [
      { id: "1.4.11", name: "Non-text Contrast", level: "AA" },
      { id: "2.4.7", name: "Focus Visible", level: "AA" },
      { id: "2.4.13", name: "Focus Appearance", level: "AAA" },
    ],
    art: ["#ffffff", "#000000"],
  },
]

export const recipeRoute = (slug: string) => `/recipes/${slug}`

export function getRecipe(slug: string): Recipe {
  const recipe = recipes.find((r) => r.slug === slug)
  if (!recipe) throw new Error(`Unknown recipe: ${slug}`)
  return recipe
}
