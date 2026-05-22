import type { ScaleRoleKey } from "../scale"
// types implied via ExportInput
import { type ExportFile, type ExportInput, kebab } from "./types"

const ROLES: ScaleRoleKey[] = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "lead",
  "body",
  "small",
  "caption",
  "code",
]

export function exportTailwindV4(input: ExportInput): ExportFile {
  const { name, tokens } = input
  const slug = kebab(name)

  const lines: string[] = [`/* ${name} — Tailwind v4 @theme */`, "@theme {"]
  lines.push(`  --font-sans: ${tokens.fonts.sans};`)
  lines.push(`  --font-serif: ${tokens.fonts.serif};`)
  lines.push(`  --font-mono: ${tokens.fonts.mono};`)
  lines.push(`  --font-display: ${tokens.fonts.display};`)
  for (const role of ROLES) {
    const s = tokens.styles[role]
    lines.push(`  --text-${role}: ${s.fontSize};`)
    lines.push(`  --text-${role}--line-height: ${s.lineHeight};`)
    lines.push(`  --text-${role}--letter-spacing: ${s.letterSpacingEm}em;`)
    lines.push(`  --text-${role}--font-weight: ${s.fontWeight};`)
  }
  lines.push("}")

  return {
    filename: `${slug}.typography.theme.css`,
    language: "css",
    content: lines.join("\n") + "\n",
  }
}

export function exportTailwindV3(input: ExportInput): ExportFile {
  const { name, tokens } = input
  const slug = kebab(name)

  const fontSize: string[] = []
  for (const role of ROLES) {
    const s = tokens.styles[role]
    fontSize.push(
      `        "${role}": ["${s.fontSize}", { lineHeight: "${s.lineHeight}", letterSpacing: "${s.letterSpacingEm}em", fontWeight: "${s.fontWeight}" }],`
    )
  }

  const content = `// ${name} — Tailwind v3 config extension
// Merge into your tailwind.config.ts under \`theme.extend\`.

import type { Config } from "tailwindcss"

const config: Partial<Config> = {
  theme: {
    extend: {
      fontFamily: {
        sans: ${JSON.stringify(tokens.fonts.sans.split(/\s*,\s*/))},
        serif: ${JSON.stringify(tokens.fonts.serif.split(/\s*,\s*/))},
        mono: ${JSON.stringify(tokens.fonts.mono.split(/\s*,\s*/))},
        display: ${JSON.stringify(tokens.fonts.display.split(/\s*,\s*/))},
      },
      fontSize: {
${fontSize.join("\n")}
      },
    },
  },
}

export default config
`
  return { filename: `tailwind.${slug}.typography.config.ts`, language: "typescript", content }
}
