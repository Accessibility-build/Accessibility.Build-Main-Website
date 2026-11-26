"use client"
import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Verdict } from "./verdict"
import { wButton, wInput, wLabel } from "./ui"

type Scenario = {
  id: string
  label: string
  context: string
  draw: ReactNode
  decorative: boolean
  /** Each group needs at least one match (lower case, regular expressions). */
  must: Array<{ label: string; any: RegExp }>
  avoid?: Array<{ label: string; re: RegExp }>
  maxLength: number
  model: string
}

const SCENARIOS: Scenario[] = [
  {
    id: "product", label: "Product photo", decorative: false, maxLength: 150,
    context: "A shop page sells this backpack. The photo is the only place the color and the laptop sleeve are shown; the name and price are text next to it.",
    draw: <svg viewBox="0 0 160 110" className="h-full w-full"><rect width="160" height="110" fill="#e0f2fe" /><rect x="52" y="18" width="56" height="78" rx="14" fill="#1e3a8a" /><rect x="60" y="30" width="40" height="34" rx="6" fill="#3b5bab" /><rect x="70" y="10" width="20" height="14" rx="6" fill="none" stroke="#1e3a8a" strokeWidth="4" /></svg>,
    must: [{ label: "Says what it is (a backpack or daypack)", any: /backpack|daypack|bag|rucksack/ }, { label: "Includes the color (navy)", any: /navy|blue/ }, { label: "Mentions the laptop sleeve", any: /laptop|sleeve/ }],
    model: "Navy daypack with a padded laptop sleeve",
  },
  {
    id: "decorative", label: "Decorative swirl", decorative: true, maxLength: 0,
    context: "A thin swirl sits between two paragraphs on a blog post. It adds style and carries no information.",
    draw: <svg viewBox="0 0 160 110" className="h-full w-full"><rect width="160" height="110" fill="#ffffff" /><path d="M20 55 C 50 25, 70 85, 100 55 S 140 40, 140 55" fill="none" stroke="#6b7280" strokeWidth="3" /></svg>,
    must: [], model: "Mark it decorative: empty alt (alt=\"\"), so screen readers skip it.",
  },
  {
    id: "icon-link", label: "Icon-only link", decorative: false, maxLength: 40,
    context: "A magnifier icon in the header is a link that opens the search page. It has no visible text.",
    draw: <svg viewBox="0 0 160 110" className="h-full w-full"><rect width="160" height="110" fill="#f3f4f6" /><circle cx="74" cy="50" r="20" fill="none" stroke="#111827" strokeWidth="6" /><path d="m88 64 18 18" stroke="#111827" strokeWidth="7" strokeLinecap="round" /></svg>,
    must: [{ label: "Names the function (search)", any: /search/ }],
    avoid: [{ label: "Describes the picture instead of the function (magnifier, magnifying glass, icon)", re: /magnif|glass|icon/ }],
    model: "Search",
  },
  {
    id: "chart", label: "Chart", decorative: false, maxLength: 160,
    context: "A report shows a bar chart of quarterly sales: Q1 $40k, Q2 $44k, Q3 $46k, Q4 $48k. A data table with the same numbers follows the chart.",
    draw: <svg viewBox="0 0 160 110" className="h-full w-full"><rect width="160" height="110" fill="#ffffff" /><line x1="20" y1="95" x2="150" y2="95" stroke="#374151" /><rect x="30" y="55" width="20" height="40" fill="#1d4ed8" /><rect x="60" y="51" width="20" height="44" fill="#1d4ed8" /><rect x="90" y="49" width="20" height="46" fill="#1d4ed8" /><rect x="120" y="47" width="20" height="48" fill="#1d4ed8" /></svg>,
    must: [{ label: "Says what is measured (sales)", any: /sales|revenue/ }, { label: "Gives the main finding (it rises)", any: /ris|increas|grew|grow|up |upward|climb/ }, { label: "Includes the range or change ($40k to $48k, or 20%)", any: /40|48|20 ?%|20 percent/ }],
    model: "Bar chart: quarterly sales rose steadily from $40k in Q1 to $48k in Q4, a 20% increase. Full figures in the table below.",
  },
  {
    id: "logo", label: "Logo link", decorative: false, maxLength: 40,
    context: "The Northwind logo (an image) in the header links to the home page.",
    draw: <svg viewBox="0 0 160 110" className="h-full w-full"><rect width="160" height="110" fill="#ffffff" /><circle cx="44" cy="55" r="18" fill="#047857" /><text x="70" y="62" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="700" fill="#111827">Northwind</text></svg>,
    must: [{ label: "Includes the company name (Northwind)", any: /northwind/ }],
    avoid: [{ label: "Uses the word logo, which adds nothing for most users", re: /\blogo\b/ }],
    model: "Northwind home",
  },
]

const COMMON_AVOID = [{ label: "Starts with “image of”, “picture of” or “photo of” (screen readers already say image)", re: /^(an? )?(image|picture|photo|graphic) (of|showing)/ }]

export function AltTextWriter({ idPrefix }: { idPrefix: string }) {
  const [current, setCurrent] = useState(SCENARIOS[0].id)
  const [text, setText] = useState<Record<string, string>>({})
  const [decorative, setDecorative] = useState<Record<string, boolean>>({})
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const s = SCENARIOS.find((x) => x.id === current)!
  const value = (text[s.id] ?? "").trim()
  const lower = value.toLowerCase()
  const isDecorative = Boolean(decorative[s.id])
  const results: Array<{ label: string; pass: boolean }> = s.decorative
    ? [{ label: "Marked as decorative", pass: isDecorative }, { label: "No alt text written", pass: !value }]
    : [
        { label: "Not marked as decorative (it carries information)", pass: !isDecorative },
        ...s.must.map((m) => ({ label: m.label, pass: m.any.test(lower) })),
        ...[...COMMON_AVOID, ...(s.avoid ?? [])].map((a) => ({ label: `Avoids: ${a.label}`, pass: !a.re.test(lower) })),
        { label: `Concise (${value.length} of about ${s.maxLength} characters)`, pass: value.length > 0 && value.length <= s.maxLength },
      ]
  const passed = results.every((r) => r.pass)
  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Images to describe" className="flex flex-wrap gap-2">
        {SCENARIOS.map((x) => (
          <button key={x.id} role="tab" type="button" id={`${idPrefix}-tab-${x.id}`} aria-selected={x.id === current} aria-controls={`${idPrefix}-panel`} tabIndex={x.id === current ? 0 : -1}
            onClick={() => setCurrent(x.id)}
            onKeyDown={(e) => { const i = SCENARIOS.findIndex((y) => y.id === current); const n = e.key === "ArrowRight" ? (i + 1) % SCENARIOS.length : e.key === "ArrowLeft" ? (i - 1 + SCENARIOS.length) % SCENARIOS.length : -1; if (n >= 0) { e.preventDefault(); setCurrent(SCENARIOS[n].id); document.getElementById(`${idPrefix}-tab-${SCENARIOS[n].id}`)?.focus() } }}
            className={cn(wButton, x.id === current && "border-blue-700 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-100")}>
            {x.label}{checked[x.id] ? " ✓" : ""}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${idPrefix}-panel`} aria-labelledby={`${idPrefix}-tab-${s.id}`} className="grid gap-4 md:grid-cols-[14rem_1fr]">
        <div className="overflow-hidden rounded-lg border border-slate-300 bg-white" style={{ aspectRatio: "160 / 110" }} aria-hidden="true">{s.draw}</div>
        <div className="space-y-3">
          <p className="text-sm text-slate-700 dark:text-slate-300"><strong>Context:</strong> {s.context}</p>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={isDecorative} onChange={(e) => setDecorative((p) => ({ ...p, [s.id]: e.target.checked }))} className="h-5 w-5 accent-blue-700" />This image is decorative (alt text left empty)</label>
          <div>
            <label htmlFor={`${idPrefix}-alt`} className={wLabel}>Alt text</label>
            <textarea id={`${idPrefix}-alt`} rows={2} disabled={isDecorative} value={text[s.id] ?? ""} onChange={(e) => setText((p) => ({ ...p, [s.id]: e.target.value }))} className={cn(wInput, "min-h-[4.5rem] disabled:opacity-60")} />
          </div>
          <button type="button" className={wButton} onClick={() => setChecked((p) => ({ ...p, [s.id]: true }))}>Check my alt text</button>
        </div>
      </div>
      <div aria-live="polite">
        {checked[s.id] ? (
          <div className="space-y-2 rounded-lg border border-slate-300 p-4 dark:border-slate-700">
            <p className="flex items-center gap-2 font-semibold"><Verdict pass={passed} passText="Good alt text" failText="Not there yet" /></p>
            <ul className="space-y-1 text-sm">{results.map((r) => <li key={r.label} className="flex items-start gap-2"><Verdict pass={r.pass} passText="Yes" failText="No" /><span>{r.label}</span></li>)}</ul>
            <p className="text-sm"><strong>One good answer:</strong> {s.model}</p>
          </div>
        ) : null}
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">The feedback checks for key information and common mistakes; it cannot judge every good answer. Alt text depends on context: the same photo needs different alt text on a shop page and in a news story.</p>
    </div>
  )
}
