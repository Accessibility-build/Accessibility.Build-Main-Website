"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Verdict } from "./verdict"
import { wButton, wInput } from "./ui"

type Level = "p" | "h1" | "h2" | "h3" | "h4"
const BLOCKS: Array<{ id: string; text: string; look: string; expected: Level; why: string }> = [
  { id: "title", text: "Spring timetable", look: "text-2xl font-bold", expected: "h1", why: "The page topic: the one H1." },
  { id: "intro", text: "New routes start on 6 April. Check your journey before you travel.", look: "text-base", expected: "p", why: "Body text, not a heading." },
  { id: "changes", text: "Route changes", look: "text-lg font-bold", expected: "h2", why: "A main section of the page." },
  { id: "weekday", text: "Weekday services", look: "text-base font-bold", expected: "h3", why: "A subsection of Route changes." },
  { id: "weekend", text: "Weekend services", look: "text-base font-bold", expected: "h3", why: "Also a subsection of Route changes, so the same level as Weekday services." },
  { id: "note", text: "Note: Platform 4 is closed for repairs.", look: "text-base font-bold", expected: "p", why: "Bold styling for emphasis does not make it a heading; it does not introduce a section." },
  { id: "access", text: "Step-free access", look: "text-lg font-bold", expected: "h2", why: "A new main section at the same level as Route changes." },
  { id: "help", text: "Contact us", look: "text-lg font-bold", expected: "h2", why: "Another main section." },
]

export function HeadingOutline({ idPrefix }: { idPrefix: string }) {
  const [levels, setLevels] = useState<Record<string, Level>>(Object.fromEntries(BLOCKS.map((b) => [b.id, "p"])) as Record<string, Level>)
  const [checked, setChecked] = useState(false)
  const headings = BLOCKS.filter((b) => levels[b.id] !== "p").map((b) => ({ ...b, n: Number(levels[b.id][1]) }))
  const h1s = headings.filter((h) => h.n === 1).length
  const skips = headings.filter((h, i) => (i === 0 ? h.n !== 1 : h.n - headings[i - 1].n > 1))
  const rules = [
    { label: "Exactly one H1 for the page topic", pass: h1s === 1 },
    { label: "No skipped levels (an H3 follows an H2, not an H1)", pass: headings.length > 0 && skips.length === 0 },
    { label: "Every block matches its role in the structure", pass: BLOCKS.every((b) => levels[b.id] === b.expected) },
  ]
  return (
    <div className="space-y-4">
      <p className="text-sm">Choose a level for each block of this page design. The outline shows what screen reader users get when they list the headings.</p>
      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <ol role="list" className="space-y-2 rounded-lg border border-slate-300 bg-white p-4 text-slate-900">
          {BLOCKS.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-0">
              <span className={cn(b.look, "min-w-0 flex-1")}>{b.text}</span>
              <span className="flex items-center gap-2">
                <label htmlFor={`${idPrefix}-${b.id}`} className="sr-only">Level for: {b.text}</label>
                <select id={`${idPrefix}-${b.id}`} value={levels[b.id]} onChange={(e) => { setLevels((p) => ({ ...p, [b.id]: e.target.value as Level })); setChecked(false) }} className={cn(wInput, "mt-0 w-36 bg-white text-slate-950")}>
                  <option value="p">Paragraph</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="h4">Heading 4</option>
                </select>
                {checked ? <Verdict pass={levels[b.id] === b.expected} passText="Right" failText="Check" /> : null}
              </span>
            </li>
          ))}
        </ol>
        <div className="rounded-lg border border-slate-300 p-4 dark:border-slate-700">
          <p className="font-semibold">Heading outline</p>
          {headings.length ? (
            <ul className="mt-2 space-y-1 text-sm">
              {headings.map((h) => <li key={h.id} style={{ paddingLeft: `${(h.n - 1) * 1.25}rem` }}><span className="font-mono text-slate-600 dark:text-slate-400">H{h.n}</span> {h.text}{skips.includes(h) ? <span className="ml-2 font-semibold text-red-800 dark:text-red-300">(skips a level)</span> : null}</li>)}
            </ul>
          ) : <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">No headings yet. A page with no headings gives screen reader users nothing to navigate by.</p>}
        </div>
      </div>
      <button type="button" className={wButton} onClick={() => setChecked(true)}>Check my structure</button>
      <div aria-live="polite">
        {checked ? (
          <div className="space-y-2 rounded-lg border border-slate-300 p-4 text-sm dark:border-slate-700">
            <ul className="space-y-1">{rules.map((r) => <li key={r.label} className="flex items-start gap-2"><Verdict pass={r.pass} passText="Yes" failText="No" /><span>{r.label}</span></li>)}</ul>
            <details><summary className="cursor-pointer font-semibold">Show the intended structure and why</summary>
              <ul className="mt-2 list-disc space-y-1 pl-6">{BLOCKS.map((b) => <li key={b.id}><strong>{b.text}</strong>: {b.expected === "p" ? "paragraph" : `heading ${b.expected[1]}`}. {b.why}</li>)}</ul>
            </details>
            <p className="text-slate-600 dark:text-slate-400">Headings support 1.3.1 Info and Relationships and 2.4.6 Headings and Labels. Annotate the level on every heading in your design; visual size alone does not tell developers the structure.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
