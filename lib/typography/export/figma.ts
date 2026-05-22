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

/**
 * Tokens Studio for Figma JSON — typography composite tokens.
 * Note: Tokens Studio expects fontSize without unit (px implied) and uses
 *       its own "typography" value shape.
 */
export function exportFigma(input: ExportInput): ExportFile {
  const { name, tokens } = input
  const slug = kebab(name)

  const fontFamilies: Record<string, unknown> = {
    sans: { value: tokens.fonts.sans.split(/\s*,\s*/)[0].replace(/"/g, ""), type: "fontFamilies" },
    serif: { value: tokens.fonts.serif.split(/\s*,\s*/)[0].replace(/"/g, ""), type: "fontFamilies" },
    mono: { value: tokens.fonts.mono.split(/\s*,\s*/)[0].replace(/"/g, ""), type: "fontFamilies" },
    display: { value: tokens.fonts.display.split(/\s*,\s*/)[0].replace(/"/g, ""), type: "fontFamilies" },
  }

  const typography: Record<string, unknown> = {}
  for (const role of ROLES) {
    const s = tokens.styles[role]
    // Figma can't do clamp(), so we send the MAX size in px and let designers verify mobile separately.
    const px = `${Math.round(s.fontSizePx.max * 100) / 100}px`
    typography[role] = {
      value: {
        fontFamily: `{fontFamilies.${s.fontFamily}}`,
        fontSize: px,
        fontWeight: String(s.fontWeight),
        lineHeight: String(Math.round(s.lineHeight * s.fontSizePx.max)),
        letterSpacing: `${(s.letterSpacingEm * s.fontSizePx.max).toFixed(2)}px`,
      },
      type: "typography",
    }
  }

  const doc = {
    global: { fontFamilies, typography },
    $themes: [
      {
        id: "default",
        name: "Default",
        selectedTokenSets: { global: "enabled" },
      },
    ],
    $metadata: { tokenSetOrder: ["global"] },
  }

  return {
    filename: `${slug}.typography.figma.json`,
    language: "json",
    content: JSON.stringify(doc, null, 2) + "\n",
  }
}
