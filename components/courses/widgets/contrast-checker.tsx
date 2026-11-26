"use client"
import { useState } from "react"
import { ArrowLeftRight, Wand2 } from "lucide-react"
import { contrast, formatRatio, parseHex, suggest } from "./color"
import { useAnnouncer } from "./use-announcer"
import { Verdict } from "./verdict"
import { wButton, wInput, wLabel, wPanel } from "./ui"

function ColorField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  const [text, setText] = useState(value)
  const [shown, setShown] = useState(value)
  if (shown !== value) { setShown(value); setText(value) }
  const valid = Boolean(parseHex(text))
  return (
    <div>
      <label htmlFor={`${id}-hex`} className={wLabel}>{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <input type="color" aria-label={`${label}, color picker`} value={parseHex(value) ? value : "#000000"} onChange={(e) => onChange(e.target.value)} className="h-11 w-14 shrink-0 cursor-pointer rounded-md border border-slate-500 bg-white p-1 dark:bg-slate-900" />
        <input
          id={`${id}-hex`}
          value={text}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={!valid}
          aria-describedby={valid ? undefined : `${id}-err`}
          onChange={(e) => { setText(e.target.value); const v = e.target.value.trim(); if (parseHex(v)) onChange(v.startsWith("#") ? v : `#${v}`) }}
          className={wInput + " mt-0 font-mono"}
        />
      </div>
      {!valid ? <p id={`${id}-err`} className="mt-1 text-sm font-medium text-red-800 dark:text-red-300">Enter a hex color such as #1a1a1a or #fff.</p> : null}
    </div>
  )
}

export function ContrastChecker({ preset, idPrefix }: { preset?: Record<string, string>; idPrefix: string }) {
  const [fg, setFg] = useState(preset?.fg && parseHex(preset.fg) ? preset.fg : "#767676")
  const [bg, setBg] = useState(preset?.bg && parseHex(preset.bg) ? preset.bg : "#ffffff")
  const ratio = contrast(fg, bg) ?? 1
  const rows: Array<[string, string, number]> = [
    ["Normal text, AA", "1.4.3", 4.5],
    ["Large text, AA", "1.4.3", 3],
    ["Normal text, AAA", "1.4.6", 7],
    ["Large text, AAA", "1.4.6", 4.5],
    ["UI components and graphics, AA", "1.4.11", 3],
  ]
  const spoken = useAnnouncer(`Contrast ${formatRatio(ratio)}. Normal text AA ${ratio >= 4.5 ? "passes" : "fails"}. Large text and graphics ${ratio >= 3 ? "pass" : "fail"}.`)
  const fix = ratio < 4.5 ? suggest(fg, bg, 4.5) : null
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <ColorField id={`${idPrefix}-fg`} label="Text or graphic color" value={fg} onChange={setFg} />
        <button type="button" className={wButton} onClick={() => { setFg(bg); setBg(fg) }}><ArrowLeftRight aria-hidden="true" focusable="false" className="h-4 w-4" />Swap</button>
        <ColorField id={`${idPrefix}-bg`} label="Background color" value={bg} onChange={setBg} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
          <svg role="img" aria-label={`Preview of ${fg} text, a large heading, an outlined button and a search icon on ${bg}. The ratio and results are listed next to it.`} viewBox="0 0 320 170" className="block h-auto w-full">
            <rect width="320" height="170" fill={bg} />
            <g fill={fg} fontFamily="system-ui, sans-serif">
              <text x="20" y="30" fontSize="13" fontWeight="600">Preview</text>
              <text x="20" y="56" fontSize="16">Normal text at 16 pixels reads like this.</text>
              <text x="20" y="92" fontSize="24" fontWeight="700">Large bold heading</text>
            </g>
            <rect x="21" y="113" width="132" height="38" rx="6" fill="none" stroke={fg} strokeWidth="2" />
            <text x="35" y="137" fill={fg} fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="600">Outlined button</text>
            <g fill="none" stroke={fg} strokeWidth="2.5" transform="translate(172 116)"><circle cx="13" cy="13" r="9" /><path d="m30 30-10-10" /></g>
          </svg>
        </div>
        <div className={wPanel}>
          <p className="text-sm font-semibold">Contrast ratio</p>
          <p className="text-4xl font-bold tabular-nums">{formatRatio(ratio)}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Shown to two decimals, never rounded up: 4.49:1 fails a 4.5:1 requirement.</p>
        </div>
      </div>
      <div role="region" aria-label="Contrast results" tabIndex={0} className="overflow-x-auto rounded-lg border border-slate-300 dark:border-slate-700">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Results for {fg} on {bg}</caption>
          <thead className="bg-slate-100 dark:bg-slate-800"><tr><th scope="col" className="p-3">Use</th><th scope="col" className="hidden p-3 sm:table-cell">Success criterion</th><th scope="col" className="p-3">Needs</th><th scope="col" className="p-3">Result</th></tr></thead>
          <tbody>
            {rows.map(([use, sc, need]) => (
              <tr key={use} className="border-t border-slate-200 dark:border-slate-800"><th scope="row" className="p-3 font-medium">{use}<span className="block text-xs font-normal text-slate-600 dark:text-slate-400 sm:hidden">{sc}</span></th><td className="hidden p-3 sm:table-cell">{sc}</td><td className="p-3 tabular-nums">{need}:1</td><td className="p-3"><Verdict pass={ratio >= need} /></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      {fix ? (
        <p className="flex flex-wrap items-center gap-3 text-sm">
          <span>Closest text color that reaches 4.5:1 on this background: <code className="font-mono font-semibold">{fix}</code>.</span>
          <button type="button" className={wButton} onClick={() => setFg(fix)}><Wand2 aria-hidden="true" focusable="false" className="h-4 w-4" />Use {fix}</button>
        </p>
      ) : null}
      <p className="text-sm text-slate-600 dark:text-slate-400">Large text means at least 18 point (about 24 CSS pixels) regular, or 14 point (about 18.66 CSS pixels) bold. A passing ratio is one check, not proof that text is readable in every state.</p>
      <p aria-live="polite" className="sr-only">{spoken}</p>
    </div>
  )
}
