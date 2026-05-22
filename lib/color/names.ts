/**
 * Color name lookup. Finds the closest named color to a given hex by ΔE-OK
 * distance. The dictionary is a curated mix of CSS named colors plus a handful
 * of common design-system color names.
 */

import { deltaEOK } from "./distance"

// Curated dictionary — ~140 colors covering CSS4 + common design names.
// Tuples: [hex, name]
const COLORS: readonly [string, string][] = [
  // Reds / pinks
  ["#fef2f2", "Snow Pink"],
  ["#fecaca", "Coral Mist"],
  ["#fca5a5", "Salmon"],
  ["#f87171", "Light Coral"],
  ["#ef4444", "Crimson"],
  ["#dc2626", "Rose Red"],
  ["#b91c1c", "Garnet"],
  ["#991b1b", "Brick"],
  ["#7f1d1d", "Maroon"],
  ["#ffc0cb", "Pink"],
  ["#ff69b4", "Hot Pink"],
  ["#ff1493", "Deep Pink"],
  ["#db2777", "Rose"],
  ["#be185d", "Raspberry"],
  ["#9d174d", "Berry"],

  // Oranges
  ["#fff7ed", "Cream"],
  ["#fed7aa", "Peach"],
  ["#fdba74", "Apricot"],
  ["#fb923c", "Tangerine"],
  ["#f97316", "Orange"],
  ["#ea580c", "Pumpkin"],
  ["#c2410c", "Rust"],
  ["#9a3412", "Sienna"],
  ["#7c2d12", "Mahogany"],

  // Yellows / ambers
  ["#fef9c3", "Cornsilk"],
  ["#fde68a", "Buttercream"],
  ["#fcd34d", "Marigold"],
  ["#fbbf24", "Amber"],
  ["#f59e0b", "Honey"],
  ["#d97706", "Mustard"],
  ["#b45309", "Bronze"],
  ["#92400e", "Saddle Brown"],
  ["#ffff00", "Yellow"],
  ["#ffd700", "Gold"],

  // Greens
  ["#f0fdf4", "Mint Cream"],
  ["#bbf7d0", "Pistachio"],
  ["#86efac", "Spring"],
  ["#4ade80", "Grass"],
  ["#22c55e", "Emerald"],
  ["#16a34a", "Shamrock"],
  ["#15803d", "Forest"],
  ["#166534", "Pine"],
  ["#14532d", "Hunter"],
  ["#84cc16", "Lime"],
  ["#65a30d", "Olive"],
  ["#10b981", "Jade"],
  ["#059669", "Sea Green"],
  ["#047857", "Teal Green"],
  ["#064e3b", "Deep Forest"],

  // Teals / cyans
  ["#f0fdfa", "Frost"],
  ["#99f6e4", "Mint"],
  ["#5eead4", "Aqua"],
  ["#2dd4bf", "Tropical"],
  ["#14b8a6", "Teal"],
  ["#0d9488", "Lagoon"],
  ["#0f766e", "Deep Teal"],
  ["#115e59", "Midnight Teal"],
  ["#06b6d4", "Cyan"],
  ["#0891b2", "Cerulean"],
  ["#0e7490", "Marine"],
  ["#155e75", "Ocean"],

  // Blues
  ["#eff6ff", "Ice Blue"],
  ["#bfdbfe", "Sky"],
  ["#93c5fd", "Cornflower"],
  ["#60a5fa", "Azure"],
  ["#3b82f6", "Royal Blue"],
  ["#2563eb", "Cobalt"],
  ["#1d4ed8", "Sapphire"],
  ["#1e40af", "Navy"],
  ["#1e3a8a", "Midnight Blue"],
  ["#0ea5e9", "Bright Blue"],
  ["#0284c7", "Lake"],
  ["#075985", "Steel Blue"],

  // Purples / indigos
  ["#eef2ff", "Lavender Mist"],
  ["#c7d2fe", "Periwinkle"],
  ["#a5b4fc", "Iris"],
  ["#818cf8", "Lavender"],
  ["#6366f1", "Indigo"],
  ["#4f46e5", "Royal Purple"],
  ["#4338ca", "Amethyst"],
  ["#3730a3", "Deep Indigo"],
  ["#312e81", "Twilight"],
  ["#a855f7", "Violet"],
  ["#9333ea", "Plum"],
  ["#7e22ce", "Grape"],
  ["#6b21a8", "Eggplant"],
  ["#581c87", "Midnight Plum"],

  // Magentas
  ["#fdf4ff", "Petal"],
  ["#f5d0fe", "Orchid"],
  ["#e879f9", "Magenta"],
  ["#d946ef", "Fuchsia"],
  ["#c026d3", "Hibiscus"],
  ["#a21caf", "Wine"],
  ["#86198f", "Burgundy"],

  // Browns
  ["#a16207", "Caramel"],
  ["#854d0e", "Cocoa"],
  ["#713f12", "Espresso"],
  ["#78350f", "Chestnut"],
  ["#451a03", "Dark Chocolate"],

  // Grays / neutrals
  ["#ffffff", "White"],
  ["#fafafa", "Cloud"],
  ["#f4f4f5", "Pearl"],
  ["#e4e4e7", "Fog"],
  ["#d4d4d8", "Silver"],
  ["#a1a1aa", "Stone"],
  ["#71717a", "Slate"],
  ["#52525b", "Charcoal"],
  ["#3f3f46", "Graphite"],
  ["#27272a", "Onyx"],
  ["#18181b", "Ink"],
  ["#09090b", "Obsidian"],
  ["#000000", "Black"],

  // Warm grays
  ["#fafaf9", "Eggshell"],
  ["#f5f5f4", "Linen"],
  ["#d6d3d1", "Sand"],
  ["#a8a29e", "Taupe"],
  ["#78716c", "Mocha"],
  ["#57534e", "Walnut"],
  ["#44403c", "Bark"],
  ["#292524", "Coffee"],

  // Cool grays
  ["#f1f5f9", "Mist"],
  ["#cbd5e1", "Powder"],
  ["#94a3b8", "Storm"],
  ["#64748b", "Smoke"],
  ["#475569", "Iron"],
  ["#334155", "Gunmetal"],
  ["#1e293b", "Midnight"],
]

const PREFIXES = ["", "Pale ", "Soft ", "Rich ", "Deep ", "Dusty "]

/**
 * Find the closest named color by ΔE-OK distance.
 * Returns the name plus how close the match is (closer = better).
 */
export function nameForHex(hex: string): { name: string; deltaOk: number; exact: boolean } {
  let best = COLORS[0]
  let bestDist = Infinity
  for (const entry of COLORS) {
    const d = deltaEOK(hex, entry[0])
    if (d < bestDist) {
      bestDist = d
      best = entry
    }
  }
  return { name: best[1], deltaOk: bestDist, exact: bestDist < 0.005 }
}

/** Lightness-aware name with an optional modifier prefix. */
export function describeHex(hex: string): string {
  const { name, deltaOk } = nameForHex(hex)
  if (deltaOk < 0.01) return name
  if (deltaOk < 0.04) return PREFIXES[2] + name // Soft X
  if (deltaOk < 0.08) return PREFIXES[1] + name // Pale X
  return name // far match — drop modifier
}
