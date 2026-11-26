"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Verdict } from "./verdict"
import { wInput, wLabel } from "./ui"

type Cue = "none" | "color" | "outline" | "underline" | "icon" | "fill"
const CUES: Array<{ id: Cue; label: string }> = [
  { id: "none", label: "No change" },
  { id: "color", label: "Color change only" },
  { id: "outline", label: "2 px outline ring" },
  { id: "underline", label: "Thick underline bar" },
  { id: "icon", label: "Check icon or text change" },
  { id: "fill", label: "Inverted fill (dark background, light text)" },
]
const STATES = ["hover", "focus", "selected", "disabled"] as const
type State = (typeof STATES)[number]
const STATE_LABEL: Record<State, string> = { hover: "Hover", focus: "Keyboard focus", selected: "Selected", disabled: "Disabled" }

function evaluate(state: State, cue: Cue) {
  switch (state) {
    case "hover": return { pass: true, note: cue === "none" ? "Hover feedback is optional; WCAG does not require it. A subtle change still helps mouse users." : "Fine. Hover is a bonus cue; never rely on it alone, because touch and keyboard users never see it." }
    case "focus": return cue === "outline" || cue === "underline" || cue === "fill"
      ? { pass: true, note: "A clear, sizeable change: meets 2.4.7 Focus Visible and is the kind of indicator 2.4.13 Focus Appearance describes. Check it reaches 3:1 against what is around it." }
      : { pass: false, note: cue === "none" ? "Fails 2.4.7 Focus Visible: keyboard users cannot see where they are." : "A color change alone is often too subtle and fails for people who cannot tell the colors apart. Use an outline ring or a thick bar." }
    case "selected": return cue === "icon" || cue === "underline" || cue === "fill"
      ? { pass: true, note: "Selection is shown by shape, an icon or a strong contrast change, not hue alone: meets 1.4.1 Use of Color. Annotate the state (for example aria-selected) for developers." }
      : { pass: false, note: cue === "none" ? "People cannot tell which item is selected." : cue === "outline" ? "An outline for selection looks the same as focus, so people cannot tell focus and selection apart. Use a different cue." : "Fails 1.4.1 Use of Color: hue alone shows the selection." }
    case "disabled": return { pass: cue !== "none", note: cue === "none" ? "Disabled controls must look different, or people will keep trying to use them." : "Disabled controls are exempt from contrast minimums (1.4.3 and 1.4.11), but keep the text readable and explain why the control is unavailable." }
  }
}

function Preview({ component, state, cue }: { component: string; state: State | "default"; cue: Cue }) {
  const base = "inline-flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold"
  const styles: Record<Cue, string> = {
    none: "border border-slate-500 bg-white text-slate-900",
    color: "border border-blue-500 bg-blue-50 text-blue-900",
    outline: "border border-slate-500 bg-white text-slate-900 outline outline-2 outline-offset-2 outline-blue-800",
    underline: "border border-slate-500 bg-white text-slate-900 shadow-[inset_0_-4px_0_#1e3a8a]",
    icon: "border border-slate-500 bg-white text-slate-900",
    fill: "border border-slate-900 bg-slate-900 text-white",
  }
  const disabled = state === "disabled"
  const cls = state === "default" ? styles.none : disabled ? (cue === "none" ? styles.none : "border border-dashed border-slate-400 bg-slate-100 text-slate-600") : styles[cue]
  const text = component === "tab" ? "Details" : component === "checkbox" ? "Email me updates" : "Save draft"
  return <span className={cn(base, cls)}>{component === "checkbox" ? <span className="flex h-4 w-4 items-center justify-center rounded-sm border-2 border-current text-[10px]">{state === "selected" && cue === "icon" ? "✓" : ""}</span> : state === "selected" && cue === "icon" ? <span>✓</span> : null}{text}{disabled && cue !== "none" ? <span className="sr-only"> (unavailable)</span> : ""}</span>
}

export function ComponentStates({ idPrefix }: { idPrefix: string }) {
  const [component, setComponent] = useState("tab")
  const [cues, setCues] = useState<Record<State, Cue>>({ hover: "color", focus: "color", selected: "color", disabled: "none" })
  const results = STATES.map((s) => ({ state: s, ...evaluate(s, cues[s]) }))
  const needed = results.filter((r) => r.state !== "hover")
  const allPass = needed.every((r) => r.pass)
  return (
    <div className="space-y-4">
      <div className="max-w-xs">
        <label htmlFor={`${idPrefix}-comp`} className={wLabel}>Component</label>
        <select id={`${idPrefix}-comp`} value={component} onChange={(e) => setComponent(e.target.value)} className={wInput}>
          <option value="tab">Tab in a tab list</option>
          <option value="button">Toggle button</option>
          <option value="checkbox">Checkbox</option>
        </select>
      </div>
      {/* One set of controls: rows on wider screens, stacked cards on phones. */}
      <div className="overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
        <div aria-hidden="true" className="hidden grid-cols-[9rem_14rem_11rem_minmax(0,1fr)] gap-4 bg-slate-100 px-4 py-3 text-sm font-semibold dark:bg-slate-800 2xl:grid">
          <span>State</span><span>How it is shown</span><span>Preview</span><span>Result</span>
        </div>
        <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-800">
          <li className="grid gap-3 px-4 py-4 sm:grid-cols-2 sm:items-start sm:gap-4 2xl:grid-cols-[9rem_14rem_11rem_minmax(0,1fr)]">
            <h4 className="text-sm font-semibold">Default</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Starting point</p>
            <div aria-hidden="true" className="rounded-md bg-white p-2"><Preview component={component} state="default" cue="none" /></div>
            <span className="hidden 2xl:block" />
          </li>
          {results.map((r) => (
            <li key={r.state} className="grid gap-3 px-4 py-4 sm:grid-cols-2 sm:items-start sm:gap-4 2xl:grid-cols-[9rem_14rem_11rem_minmax(0,1fr)]">
              <h4 className="text-sm font-semibold">{STATE_LABEL[r.state]}</h4>
              <div>
                <label htmlFor={`${idPrefix}-${r.state}`} className="text-sm text-slate-700 dark:text-slate-300 2xl:sr-only">How the {STATE_LABEL[r.state].toLowerCase()} state is shown</label>
                <select id={`${idPrefix}-${r.state}`} value={cues[r.state]} onChange={(e) => setCues((p) => ({ ...p, [r.state]: e.target.value as Cue }))} className={cn(wInput, "2xl:mt-0")}>
                  {CUES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div aria-hidden="true" className="rounded-md bg-white p-2"><Preview component={component} state={r.state} cue={cues[r.state]} /></div>
              <div className="text-sm"><Verdict pass={r.pass} passText={r.state === "hover" ? "Optional" : "Clear"} failText="Unclear" /><p className="mt-1 text-slate-700 dark:text-slate-300">{r.note}</p></div>
            </li>
          ))}
        </ul>
      </div>
      <p aria-live="polite" className="flex items-center gap-2 text-sm font-semibold"><Verdict pass={allPass} passText="Every required state is distinguishable" failText="Some states need a clearer cue" /></p>
      <p className="text-sm text-slate-600 dark:text-slate-400">Design every state in your component library once, and document it, so each product team does not reinvent it. Check that focus and selected look different from each other, because a focused, selected tab shows both at once.</p>
    </div>
  )
}
