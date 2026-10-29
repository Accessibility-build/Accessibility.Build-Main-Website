import type { Recipe } from "@/lib/recipes"

/** Decorative card art for each recipe, shared by the /recipes index and the home page section. */
export function RecipeArt({ recipe, className = "" }: { recipe: Recipe; className?: string }) {
  if (recipe.slug === "invisible-hit-area") {
    return (
      <div
        aria-hidden="true"
        className={`relative flex items-center justify-center overflow-hidden ${className}`}
        style={{
          backgroundColor: "#0b2545",
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 0.08) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.08) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      >
        {/* A 16px icon inside its dashed 24px hit area, with dimension ticks. */}
        <span className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-dashed border-amber-300">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl font-black leading-none text-[#0b2545]">
            ×
          </span>
        </span>
        <span className="absolute bottom-3 right-4 font-mono text-xs font-semibold text-amber-200">16 → 24px</span>
      </div>
    )
  }
  // Default: the two-tone focus ring across a white and black split.
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center ${className}`}
      style={{ background: `linear-gradient(105deg, ${recipe.art[0]} 0 50%, ${recipe.art[1]} 50% 100%)` }}
    >
      <span className="rounded-full bg-[#767676] px-6 py-3 font-bold text-white outline outline-2 outline-white [box-shadow:0_0_0_4px_#000]">
        Focus
      </span>
    </div>
  )
}
