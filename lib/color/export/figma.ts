import { FAMILY_NAMES, STOPS } from "../scales"
import type { SemanticTokens } from "../tokens"
import { type ExportFile, type ExportInput, kebab } from "./types"

/**
 * Tokens Studio for Figma JSON — the most-used bridge into Figma Variables.
 * Import via Tokens Studio plugin → "Tools" → "Import" → paste JSON.
 */
export function exportFigma(input: ExportInput): ExportFile {
  const { name, scales, tokens } = input
  const slug = kebab(name)

  const global: Record<string, unknown> = {}
  for (const family of FAMILY_NAMES) {
    const stops: Record<string, unknown> = {}
    for (const stop of STOPS) {
      stops[String(stop)] = { value: scales[family][stop], type: "color" }
    }
    global[family] = stops
  }

  const semanticLight = semanticForFigma(tokens.light)
  const semanticDark = semanticForFigma(tokens.dark)

  const doc = {
    global,
    "semantic/light": semanticLight,
    "semantic/dark": semanticDark,
    $themes: [
      { id: "light", name: "Light", selectedTokenSets: { global: "enabled", "semantic/light": "enabled" } },
      { id: "dark", name: "Dark", selectedTokenSets: { global: "enabled", "semantic/dark": "enabled" } },
    ],
    $metadata: {
      tokenSetOrder: ["global", "semantic/light", "semantic/dark"],
    },
  }

  return {
    filename: `${slug}.figma.json`,
    language: "json",
    content: JSON.stringify(doc, null, 2) + "\n",
  }
}

function semanticForFigma(t: SemanticTokens): Record<string, unknown> {
  const keys = Object.keys(t).filter(
    (k) => k !== "mode" && k !== "chartColors"
  ) as (keyof SemanticTokens)[]
  const out: Record<string, unknown> = {}
  for (const k of keys) {
    const value = t[k]
    if (typeof value === "string") {
      out[k] = { value, type: "color" }
    }
  }
  const chart: Record<string, unknown> = {}
  t.chartColors.forEach((c, i) => {
    chart[String(i + 1)] = { value: c, type: "color" }
  })
  out.chart = chart
  return out
}
