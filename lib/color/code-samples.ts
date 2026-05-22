/**
 * Generate ready-to-paste code samples that use the palette.
 * Output: React+Tailwind component, vanilla HTML+CSS, and a usage README.
 */

import type { PaletteScales } from "./scales"
import type { TokenSet } from "./tokens"

export interface CodeSample {
  filename: string
  language: string
  content: string
  title: string
}

export interface CodeSampleInput {
  name: string
  scales: PaletteScales
  tokens: TokenSet
}

/* ─────────────────────────────────────────────────────── React + Tailwind v4 */
export function reactTailwindSample({ name }: CodeSampleInput): CodeSample {
  const content = `// 1. Drop the @theme block (from the Tailwind export) into your app.css:
//
//    @import "tailwindcss";
//
//    @theme {
//      --color-primary-500: …;
//      /* …all stops */
//    }
//
// 2. Use as Tailwind utilities anywhere in your app:

export function CTACard() {
  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-200">
        ${name}
      </span>
      <h2 className="mt-3 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
        Ready to ship?
      </h2>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        These colors are WCAG 2.2 and APCA verified across rest, hover, focus, and disabled states.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:bg-neutral-200 disabled:text-neutral-500"
        >
          Get started
        </button>
        <button
          type="button"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          Docs
        </button>
      </div>
    </article>
  )
}
`
  return { filename: "CTACard.tsx", language: "tsx", title: "React + Tailwind", content }
}

/* ─────────────────────────────────────────────────────── Plain HTML + CSS vars */
export function htmlCssSample({ tokens }: CodeSampleInput): CodeSample {
  const t = tokens.light
  const content = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Palette demo</title>
  <style>
    :root {
      --background: ${t.background};
      --surface: ${t.surface};
      --foreground: ${t.foreground};
      --muted: ${t.muted};
      --border: ${t.border};
      --primary: ${t.primary};
      --primary-hover: ${t.primaryHover};
      --primary-foreground: ${t.primaryForeground};
      --focus: ${t.focus};
      --focus-ring: ${t.focusRing};
      --success: ${t.success};
      --success-surface: ${t.successSurface};
      --danger: ${t.danger};
      --danger-surface: ${t.dangerSurface};
    }
    [data-theme="dark"] {
      --background: ${tokens.dark.background};
      --surface: ${tokens.dark.surface};
      --foreground: ${tokens.dark.foreground};
      --muted: ${tokens.dark.muted};
      --border: ${tokens.dark.border};
      --primary: ${tokens.dark.primary};
      --primary-hover: ${tokens.dark.primaryHover};
      --primary-foreground: ${tokens.dark.primaryForeground};
      --focus: ${tokens.dark.focus};
      --focus-ring: ${tokens.dark.focusRing};
      --success: ${tokens.dark.success};
      --success-surface: ${tokens.dark.successSurface};
      --danger: ${tokens.dark.danger};
      --danger-surface: ${tokens.dark.dangerSurface};
    }
    body { background: var(--background); color: var(--foreground); font-family: system-ui, sans-serif; padding: 2rem; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; max-width: 480px; }
    .btn { background: var(--primary); color: var(--primary-foreground); border: 0; padding: 0.625rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn:hover { background: var(--primary-hover); }
    .btn:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; box-shadow: 0 0 0 4px var(--focus-ring); }
    .muted { color: var(--muted); }
    .alert-success { background: var(--success-surface); color: var(--success); padding: 12px; border-radius: 8px; border-left: 4px solid var(--success); }
  </style>
</head>
<body>
  <article class="card">
    <h1>Hello from your palette</h1>
    <p class="muted">Switch <code>data-theme="dark"</code> on the &lt;html&gt; element to preview dark mode.</p>
    <button class="btn">Primary action</button>
    <p class="alert-success" style="margin-top: 16px">✓ All checks passed.</p>
  </article>
</body>
</html>
`
  return { filename: "palette-demo.html", language: "html", title: "Plain HTML + CSS", content }
}

/* ─────────────────────────────────────────────────────── Stylelint / theme config */
export function shadcnThemeSample({ tokens }: CodeSampleInput): CodeSample {
  const t = tokens.light
  const d = tokens.dark

  // Convert hex → "h s% l%" for shadcn convention. Use approximate values.
  const hslOf = (hex: string): string => {
    const h = hex.replace("#", "")
    const r = parseInt(h.slice(0, 2), 16) / 255
    const g = parseInt(h.slice(2, 4), 16) / 255
    const b = parseInt(h.slice(4, 6), 16) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const l = (max + min) / 2
    let s = 0
    let hue = 0
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      if (max === r) hue = (g - b) / d + (g < b ? 6 : 0)
      else if (max === g) hue = (b - r) / d + 2
      else hue = (r - g) / d + 4
      hue *= 60
    }
    return `${Math.round(hue)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
  }

  const content = `/* Drop into globals.css. Works with shadcn/ui out of the box. */

@layer base {
  :root {
    --background: ${hslOf(t.background)};
    --foreground: ${hslOf(t.foreground)};
    --card: ${hslOf(t.surface)};
    --card-foreground: ${hslOf(t.foreground)};
    --popover: ${hslOf(t.raised)};
    --popover-foreground: ${hslOf(t.foreground)};
    --primary: ${hslOf(t.primary)};
    --primary-foreground: ${hslOf(t.primaryForeground)};
    --secondary: ${hslOf(t.secondary)};
    --secondary-foreground: ${hslOf(t.secondaryForeground)};
    --muted: ${hslOf(t.primarySurface)};
    --muted-foreground: ${hslOf(t.muted)};
    --accent: ${hslOf(t.accent)};
    --accent-foreground: ${hslOf(t.accentForeground)};
    --destructive: ${hslOf(t.danger)};
    --destructive-foreground: ${hslOf(t.dangerForeground)};
    --border: ${hslOf(t.border)};
    --input: ${hslOf(t.border)};
    --ring: ${hslOf(t.focus)};
    --radius: 0.5rem;
  }
  .dark {
    --background: ${hslOf(d.background)};
    --foreground: ${hslOf(d.foreground)};
    --card: ${hslOf(d.surface)};
    --card-foreground: ${hslOf(d.foreground)};
    --popover: ${hslOf(d.raised)};
    --popover-foreground: ${hslOf(d.foreground)};
    --primary: ${hslOf(d.primary)};
    --primary-foreground: ${hslOf(d.primaryForeground)};
    --secondary: ${hslOf(d.secondary)};
    --secondary-foreground: ${hslOf(d.secondaryForeground)};
    --muted: ${hslOf(d.primarySurface)};
    --muted-foreground: ${hslOf(d.muted)};
    --accent: ${hslOf(d.accent)};
    --accent-foreground: ${hslOf(d.accentForeground)};
    --destructive: ${hslOf(d.danger)};
    --destructive-foreground: ${hslOf(d.dangerForeground)};
    --border: ${hslOf(d.border)};
    --input: ${hslOf(d.border)};
    --ring: ${hslOf(d.focus)};
  }
}
`
  return { filename: "globals.css", language: "css", title: "shadcn/ui globals.css", content }
}

/* ─────────────────────────────────────────────────────── README / usage docs */
export function readmeSample(input: CodeSampleInput): CodeSample {
  const content = `# ${input.name}

Accessible color system — 88 OKLCH stops + semantic tokens — generated by Accessible Palette Studio.

## What's included

- 8 families × 11 stops (\`primary-50\` … \`primary-950\` × \`primary | secondary | accent | neutral | success | warning | danger | info\`)
- Semantic tokens for both light and dark mode (\`--background\`, \`--surface\`, \`--foreground\`, \`--primary\`, \`--primary-hover\`, \`--primary-foreground\`, \`--focus\`, \`--focus-ring\`, \`--border\`, \`--success/--warning/--danger/--info\` + matching \`--*-surface\` and \`--*-foreground\`)
- All pairings tested against WCAG 2.2 + APCA before export

## Files

| File | Purpose |
| --- | --- |
| \`tailwind.theme.css\` | Tailwind v4 \`@theme\` block — drop into globals.css |
| \`tailwind.config.ts\` | Tailwind v3 config extension |
| \`palette.css\` | Vanilla CSS variables (light + dark mode) |
| \`palette.tokens.json\` | W3C Design Tokens Community Group format |
| \`palette.figma.json\` | Tokens Studio import for Figma Variables |
| \`Palette.swift\` | UIColor extension for iOS / SwiftUI |
| \`Palette.kt\` | Jetpack Compose Color object for Android |

## Quick start

\`\`\`tsx
// React + Tailwind v4
<button className="bg-primary-600 text-white hover:bg-primary-700">Submit</button>

// Vanilla CSS
<button style="background: var(--primary); color: var(--primary-foreground)">Submit</button>
\`\`\`

## Dark mode

Either set \`data-theme="dark"\` on \`<html>\`, or rely on \`prefers-color-scheme: dark\` — both
are handled by the generated CSS.

## Accessibility notes

- Body text pairs (\`--foreground\` on \`--background\` / \`--surface\`) meet **WCAG 2.2 AA** (≥ 4.5:1)
  and **APCA Lc ≥ 75** for fluent reading.
- Focus rings (\`--focus\`) meet **WCAG 1.4.11** (≥ 3:1 against adjacent backgrounds).
- Disabled states are flagged informationally — WCAG 2.2 exempts them, but APCA still surfaces
  any unreadable combinations.

_Generated by [Accessible Palette Studio](https://accessibility.build/tools/accessible-palette-studio)._
`
  return { filename: "README.md", language: "markdown", title: "README", content }
}

export function allSamples(input: CodeSampleInput): CodeSample[] {
  return [
    reactTailwindSample(input),
    shadcnThemeSample(input),
    htmlCssSample(input),
    readmeSample(input),
  ]
}
