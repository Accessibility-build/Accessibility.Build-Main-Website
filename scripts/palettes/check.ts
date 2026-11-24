// Fails (exit 1) if any palette in lib/data/accessible-palettes.ts misses its WCAG targets.
// Run: npx tsx --tsconfig tsconfig.json scripts/palettes/check.ts
import { uiPalettes, chartPalettes, checkUiTheme, checkChartPalette } from "@/lib/data/accessible-palettes"

let failures = 0
for (const p of uiPalettes) {
  for (const mode of ["light", "dark"] as const) {
    for (const c of checkUiTheme(p[mode])) {
      const line = `${p.slug}/${mode} ${c.label}: ${c.ratio.toFixed(2)}:1 (need ${c.target}) Lc ${c.apca.toFixed(1)}`
      if (!c.pass) { failures++; console.log("FAIL", line) }
      else if (process.argv.includes("-v")) console.log("ok  ", line)
    }
  }
}
for (const p of chartPalettes) {
  for (const c of checkChartPalette(p)) console.log(`${p.slug} ${c.type}: closest ${c.closest.a}/${c.closest.b} dE ${c.closest.deltaOk.toFixed(3)}`)
}
if (failures) { console.error(`${failures} failing pairings`); process.exit(1) }
console.log("all UI palettes pass")
