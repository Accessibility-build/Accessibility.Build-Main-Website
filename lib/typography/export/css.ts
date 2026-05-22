import type { ScaleRoleKey } from "../scale"
import type { TypographyTokens, TypeStyle } from "../tokens"
import { type ExportFile, type ExportInput, kebab, prefixed } from "./types"

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

function fontFamilyForStyle(t: TypographyTokens, style: TypeStyle): string {
  return t.fonts[style.fontFamily]
}

function utilityClass(role: ScaleRoleKey, t: TypographyTokens): string {
  const s = t.styles[role]
  return `.type-${role} {
  font-family: ${fontFamilyForStyle(t, s)};
  font-size: ${s.fontSize};
  line-height: ${s.lineHeight};
  letter-spacing: ${s.letterSpacingEm}em;
  font-weight: ${s.fontWeight};
}`
}

export function exportCSS(input: ExportInput): ExportFile {
  const { name, tokens, prefix } = input
  const slug = kebab(name)

  const imports = tokens.fontImports.length
    ? tokens.fontImports.map((u) => `@import url("${u}");`).join("\n") + "\n\n"
    : ""

  const rootVars: string[] = []
  rootVars.push(`  --${prefixed(prefix, "font-sans")}: ${tokens.fonts.sans};`)
  rootVars.push(`  --${prefixed(prefix, "font-serif")}: ${tokens.fonts.serif};`)
  rootVars.push(`  --${prefixed(prefix, "font-mono")}: ${tokens.fonts.mono};`)
  rootVars.push(`  --${prefixed(prefix, "font-display")}: ${tokens.fonts.display};`)
  for (const role of ROLES) {
    const s = tokens.styles[role]
    rootVars.push(`  --${prefixed(prefix, `font-size-${role}`)}: ${s.fontSize};`)
    rootVars.push(`  --${prefixed(prefix, `line-height-${role}`)}: ${s.lineHeight};`)
    rootVars.push(`  --${prefixed(prefix, `letter-spacing-${role}`)}: ${s.letterSpacingEm}em;`)
    rootVars.push(`  --${prefixed(prefix, `font-weight-${role}`)}: ${s.fontWeight};`)
  }
  rootVars.push(`  --${prefixed(prefix, "paragraph-spacing")}: ${tokens.paragraphSpacing};`)
  rootVars.push(`  --${prefixed(prefix, "body-max-width")}: ${tokens.bodyMaxWidth};`)

  const content = `/* ${name} — Accessible Typography Studio */

${imports}:root {
${rootVars.join("\n")}
}

/* Reset + body defaults */
body {
  font-family: var(--${prefixed(prefix, "font-sans")});
  font-size: var(--${prefixed(prefix, "font-size-body")});
  line-height: var(--${prefixed(prefix, "line-height-body")});
  letter-spacing: var(--${prefixed(prefix, "letter-spacing-body")});
  font-weight: var(--${prefixed(prefix, "font-weight-body")});
}

p { max-width: var(--${prefixed(prefix, "body-max-width")}); margin-block-end: var(--${prefixed(prefix, "paragraph-spacing")}); }

/* Utility classes for each role */
${ROLES.map((r) => utilityClass(r, tokens)).join("\n\n")}
`
  return { filename: `${slug}.typography.css`, language: "css", content }
}
