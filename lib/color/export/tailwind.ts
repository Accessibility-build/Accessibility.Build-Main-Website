import { FAMILY_NAMES, STOPS } from "../scales"
import { type ExportFile, type ExportInput, kebab, prefixed } from "./types"

/**
 * Tailwind v4 — `@theme` block in app.css.
 * Drop into `globals.css` underneath `@import "tailwindcss";`.
 */
export function exportTailwindV4(input: ExportInput): ExportFile {
  const { name, scales, prefix } = input
  const slug = kebab(name)

  const lines: string[] = [`/* ${name} — Tailwind v4 @theme */`, "@theme {"]
  for (const family of FAMILY_NAMES) {
    for (const stop of STOPS) {
      lines.push(`  --color-${prefixed(prefix, `${family}-${stop}`)}: ${scales[family][stop]};`)
    }
  }
  lines.push("}")
  return { filename: `${slug}.theme.css`, language: "css", content: lines.join("\n") + "\n" }
}

/**
 * Tailwind v3 — `tailwind.config.ts` extension.
 * Spread into `theme.extend.colors`.
 */
export function exportTailwindV3(input: ExportInput): ExportFile {
  const { name, scales, prefix } = input
  const slug = kebab(name)
  const ns = prefix ? `${prefix}` : null

  const colorBlock: string[] = []
  for (const family of FAMILY_NAMES) {
    colorBlock.push(`      "${family}": {`)
    for (const stop of STOPS) {
      colorBlock.push(`        "${stop}": "${scales[family][stop]}",`)
    }
    colorBlock.push(`      },`)
  }

  const body = ns
    ? `      "${ns}": {\n${colorBlock.map((l) => "  " + l).join("\n")}\n      },`
    : colorBlock.join("\n")

  const content = `// ${name} — Tailwind v3 config extension
// Merge into your tailwind.config.ts under \`theme.extend.colors\`.

import type { Config } from "tailwindcss"

const config: Partial<Config> = {
  theme: {
    extend: {
      colors: {
${body}
      },
    },
  },
}

export default config
`
  return { filename: `tailwind.${slug}.config.ts`, language: "typescript", content }
}
