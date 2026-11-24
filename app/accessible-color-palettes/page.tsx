import Link from "next/link"
import { GuideShell, guideMetadata } from "@/components/guides/guide-shell"
import { CodeExample } from "@/components/guides/code-example"
import type { FaqItem } from "@/components/seo/faq-section"
import {
  uiPalettes,
  chartPalettes,
  checkUiTheme,
  checkChartPalette,
  simulateHex,
  type UiTheme,
} from "@/lib/data/accessible-palettes"
import { CVD_LABELS } from "@/lib/color/cvd"
import { distinguishability } from "@/lib/color/distance"

// Search Console, Nov 2026: singular queries ("accessible color palette generator") rank 4 to 8,
// but plural and example queries ("accessible color palettes" 24th, "accessible colour palettes"
// 22nd, "accessible color combinations" 24th, "wcag 2.2 aa compliant color palettes for dark and
// light mode") wanted ready-made palettes, which the site did not have. Every number on this page
// is computed at build time from lib/data/accessible-palettes.ts.

const route = "/accessible-color-palettes"
const title = "Accessible Color Palettes: WCAG-Tested Light and Dark Sets"
const description = `${uiPalettes.length} ready-made accessible color palettes with light and dark modes, every pairing checked against WCAG 2.2, plus color-blind-safe chart palettes. Copy the CSS.`
const datePublished = "2026-11-24"

export const metadata = guideMetadata({
  route,
  title,
  description,
  datePublished,
  keywords: [
    "accessible color palettes",
    "accessible colour palettes",
    "accessible color combinations",
    "wcag color palette",
    "wcag compliant color palettes dark and light mode",
    "color blind friendly palette",
    "accessible color palette examples",
    "accessible brand colors",
  ],
})

const faqs: FaqItem[] = [
  {
    question: "What makes a color palette accessible?",
    answer:
      "Its pairings meet WCAG contrast: at least 4.5:1 for normal text and 3:1 for large text, input borders and other interface boundaries (WCAG 2.2 AA). A palette is not accessible on its own; the pairs you actually put together are. These palettes list the intended pairs and the ratio each one achieves.",
  },
  {
    question: "Are these palettes WCAG 2.2 AA compliant?",
    answer:
      "Every listed pairing meets or exceeds its WCAG 2.2 target, and body text meets AAA (7:1). Compliance still depends on how you use them: pair colors only as listed, do not put muted text on the primary color, and never use color as the only way to convey meaning (WCAG 1.4.1).",
  },
  {
    question: "What are color-blind-friendly palettes for charts?",
    answer:
      "Okabe-Ito and Paul Tol's palettes were designed so series stay distinguishable for people with protanopia and deuteranopia, the most common color vision deficiencies. The tables show the closest pair of colors under each simulated deficiency. Still label series directly or add patterns, because no palette works for everyone.",
  },
  {
    question: "Can I use these palettes commercially?",
    answer:
      "Yes. The UI palettes on this page are free to use in any project. Okabe-Ito and Paul Tol's palettes are published by their authors for free use; credit them where you can.",
  },
]

const sections = [
  { id: "ui-palettes", title: "UI palettes (light and dark)" },
  { id: "chart-palettes", title: "Color-blind-safe chart palettes" },
  { id: "how-tested", title: "How these were tested" },
  { id: "make-your-own", title: "Make your own" },
]

const ROLE_LABELS: Record<keyof UiTheme, string> = {
  bg: "Background",
  surface: "Surface",
  text: "Text",
  muted: "Muted text",
  primary: "Primary",
  onPrimary: "On primary",
  link: "Link",
  border: "Border",
}

function ratio(n: number) {
  return `${n.toFixed(2)}:1`
}

function Preview({ t, label }: { t: UiTheme; label: string }) {
  return (
    <figure className="m-0">
      <div
        aria-hidden="true"
        className="rounded-lg p-5"
        style={{ backgroundColor: t.bg, color: t.text, border: `1px solid ${t.border}` }}
      >
        <p className="text-lg font-semibold" style={{ color: t.text }}>
          Order summary
        </p>
        <p className="mt-1 text-sm" style={{ color: t.muted }}>
          Arrives in 2 to 3 working days
        </p>
        <div className="mt-4 rounded-md p-3" style={{ backgroundColor: t.surface }}>
          <p className="text-sm" style={{ color: t.text }}>
            Total <strong>$48.00</strong>
          </p>
          <p className="text-xs" style={{ color: t.muted }}>
            Includes tax
          </p>
        </div>
        <div
          className="mt-4 rounded-md px-3 py-2 text-sm"
          style={{ border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.muted }}
        >
          Promo code
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span
            className="inline-block rounded-md px-4 py-2 text-sm font-semibold"
            style={{ backgroundColor: t.primary, color: t.onPrimary }}
          >
            Checkout
          </span>
          <span className="text-sm underline underline-offset-4" style={{ color: t.link }}>
            Edit basket
          </span>
        </div>
      </div>
      <figcaption className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {label}: an example checkout card using every role in the palette
      </figcaption>
    </figure>
  )
}

function cssFor(slug: string, t: UiTheme, dark: UiTheme) {
  const lines = (theme: UiTheme) =>
    (Object.keys(ROLE_LABELS) as (keyof UiTheme)[])
      .map((k) => `  --color-${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${theme[k]};`)
      .join("\n")
  return `/* ${slug} palette from accessibility.build/accessible-color-palettes */\n:root {\n${lines(t)}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n${lines(dark).replace(/^/gm, "  ")}\n  }\n}`
}

export default function AccessibleColorPalettesPage() {
  return (
    <GuideShell
      route={route}
      crumb="Accessible color palettes"
      parent={{ name: "Tools", href: "/tools" }}
      badge="Palette library"
      title={title}
      h1="Accessible color palettes, tested for WCAG 2.2"
      description={description}
      datePublished={datePublished}
      sections={sections}
      faqs={faqs}
      relatedContent="accessible color palette generator color contrast checker color blind friendly design accessible color palettes guide oklch apca dark mode contrast charts"
      intro={
        <p>
          {uiPalettes.length} interface palettes with matching light and dark modes, and {chartPalettes.length}{" "}
          color-blind-safe palettes for charts. Every text and interface pairing below is calculated when this page is
          built, so the numbers you see are the numbers you get. Need a palette from your own brand color? Use the{" "}
          <Link href="/tools/color-palette-generator">accessible color palette generator</Link>.
        </p>
      }
    >
      <h2 id="ui-palettes">UI palettes (light and dark)</h2>
      <p>
        Each palette defines eight roles. Use them only in the listed pairs: body and muted text on the background or
        surface, button text on the primary color, links on the background.
      </p>

      <div className="not-prose space-y-14">
        {uiPalettes.map((p) => {
          const light = checkUiTheme(p.light)
          const dark = checkUiTheme(p.dark)
          const all = [...light, ...dark]
          const minText = Math.min(...all.filter((c) => c.criterion !== "1.4.11").map((c) => c.ratio))
          return (
            <section key={p.slug} aria-labelledby={`palette-${p.slug}`} className="border-t border-slate-200 pt-8 dark:border-slate-700">
              <h3 id={`palette-${p.slug}`} className="text-2xl font-bold text-slate-900 dark:text-white">
                {p.name}
              </h3>
              <p className="mt-1 text-slate-700 dark:text-slate-300">
                {p.mood} Lowest text contrast in either mode: <strong>{ratio(minText)}</strong>.
              </p>

              <div className="mt-5 grid gap-6 md:grid-cols-2">
                <Preview t={p.light} label={`${p.name}, light mode`} />
                <Preview t={p.dark} label={`${p.name}, dark mode`} />
              </div>

              {(["light", "dark"] as const).map((mode) => (
                <ul key={mode} aria-label={`${p.name} ${mode} mode colors`} className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
                  {(Object.keys(ROLE_LABELS) as (keyof UiTheme)[]).map((role) => (
                    <li key={role} className="text-xs text-slate-700 dark:text-slate-300">
                      <span
                        aria-hidden="true"
                        className="block h-10 rounded border border-slate-300 dark:border-slate-600"
                        style={{ backgroundColor: p[mode][role] }}
                      />
                      <span className="mt-1 block font-medium">{ROLE_LABELS[role]}</span>
                      <span className="block font-mono">{p[mode][role]}</span>
                    </li>
                  ))}
                </ul>
              ))}

              <details className="mt-5 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <summary className="cursor-pointer font-medium text-slate-900 dark:text-white">
                  Contrast checks for {p.name}
                </summary>
                <div role="region" aria-label={`${p.name} contrast checks`} tabIndex={0} className="mt-3 overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                  <table className="w-full min-w-[36rem] text-left text-sm text-slate-700 dark:text-slate-300">
                    <caption className="sr-only">WCAG ratio and APCA Lc for each {p.name} pairing</caption>
                    <thead>
                      <tr className="text-slate-900 dark:text-white">
                        <th scope="col" className="py-2 pr-3">Pairing</th>
                        <th scope="col" className="py-2 pr-3">Light</th>
                        <th scope="col" className="py-2 pr-3">Dark</th>
                        <th scope="col" className="py-2 pr-3">WCAG target</th>
                      </tr>
                    </thead>
                    <tbody>
                      {light.map((c, i) => (
                        <tr key={c.label} className="border-t border-slate-200 dark:border-slate-700">
                          <th scope="row" className="py-2 pr-3 font-normal">{c.label}</th>
                          <td className="py-2 pr-3">{ratio(c.ratio)} <span className="text-slate-500 dark:text-slate-400">(Lc {Math.abs(c.apca).toFixed(0)})</span></td>
                          <td className="py-2 pr-3">{ratio(dark[i].ratio)} <span className="text-slate-500 dark:text-slate-400">(Lc {Math.abs(dark[i].apca).toFixed(0)})</span></td>
                          <td className="py-2 pr-3">{c.target}:1, SC {c.criterion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>

              <div className="mt-4">
                <CodeExample code={cssFor(p.slug, p.light, p.dark)} language="css" title={`${p.name} CSS variables`} />
              </div>
            </section>
          )
        })}
      </div>

      <h2 id="chart-palettes">Color-blind-safe chart palettes</h2>
      <p>
        For charts and maps, contrast with the background matters less than whether series can be told apart. Each row
        shows the palette as simulated for a color vision deficiency (Machado, Oliveira and Fernandes, 2009), and the
        closest pair of colors as a perceptual difference in OKLab. Above 0.1 is clearly different; below 0.05 is subtle.
      </p>

      <div className="not-prose space-y-12">
        {chartPalettes.map((p) => {
          const checks = checkChartPalette(p)
          return (
            <section key={p.slug} aria-labelledby={`chart-${p.slug}`} className="border-t border-slate-200 pt-8 dark:border-slate-700">
              <h3 id={`chart-${p.slug}`} className="text-2xl font-bold text-slate-900 dark:text-white">
                {p.name}
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                By <a href={p.creditHref} className="text-blue-700 underline underline-offset-4 dark:text-blue-300">{p.credit}</a>. {p.note}
              </p>
              <div role="region" aria-label={`${p.name} under simulated color vision deficiencies`} tabIndex={0} className="mt-4 overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                <table className="w-full min-w-[40rem] text-left text-sm text-slate-700 dark:text-slate-300">
                  <caption className="sr-only">{p.name} colors as seen with each type of color vision, and the closest pair</caption>
                  <thead>
                    <tr className="text-slate-900 dark:text-white">
                      <th scope="col" className="py-2 pr-3">Vision</th>
                      <th scope="col" className="py-2 pr-3">Colors</th>
                      <th scope="col" className="py-2 pr-3">Closest pair</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checks.map((c) => (
                      <tr key={c.type} className="border-t border-slate-200 dark:border-slate-700">
                        <th scope="row" className="py-2 pr-3 font-normal">{CVD_LABELS[c.type]}</th>
                        <td className="py-2 pr-3">
                          <span className="flex gap-1" aria-hidden="true">
                            {p.colors.map((col) => (
                              <span
                                key={col.hex}
                                className="inline-block h-7 w-7 rounded"
                                style={{ backgroundColor: simulateHex(col.hex, c.type) }}
                              />
                            ))}
                          </span>
                        </td>
                        <td className="py-2 pr-3">
                          {p.colors.find((x) => x.hex === c.closest.a)?.name} and{" "}
                          {p.colors.find((x) => x.hex === c.closest.b)?.name}:{" "}
                          {c.closest.deltaOk.toFixed(3)} ({distinguishability(c.closest.deltaOk)})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul aria-label={`${p.name} hex codes`} className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm text-slate-700 dark:text-slate-300">
                {p.colors.map((c) => (
                  <li key={c.hex}>
                    {c.name} {c.hex}
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      <h2 id="how-tested">How these were tested</h2>
      <ul>
        <li>
          Contrast ratios use the WCAG 2.2 relative luminance formula. Body text targets 7:1 (AAA), muted text and links
          4.5:1 (<Link href="/wcag/1-4-3">1.4.3</Link>), and buttons and input borders 3:1 against the background (
          <Link href="/wcag/1-4-11">1.4.11</Link>).
        </li>
        <li>
          APCA Lc values are shown for reference only; APCA is not part of any WCAG standard. See{" "}
          <Link href="/guides/apca-vs-wcag-contrast">APCA vs WCAG 2 contrast</Link>.
        </li>
        <li>
          Color vision simulations use the Machado 2009 model at full severity, the same model as our{" "}
          <Link href="/tools/website-vision-simulator">vision simulator</Link>. Simulations approximate; test with real
          users where you can.
        </li>
        <li>Never rely on color alone for meaning (<Link href="/wcag/1-4-1">1.4.1</Link>). Pair color with text, icons or patterns.</li>
      </ul>

      <h2 id="make-your-own">Make your own</h2>
      <p>
        Start from your brand color in the <Link href="/tools/color-palette-generator">accessible color palette
        generator</Link>, check any pair in the <Link href="/tools/contrast-checker">contrast checker</Link>, and read the{" "}
        <Link href="/guides/accessible-color-palettes">accessible color palette guide</Link> and{" "}
        <Link href="/guides/color-blind-friendly-design">color-blind-friendly design guide</Link> for the reasoning
        behind these choices.
      </p>
    </GuideShell>
  )
}
