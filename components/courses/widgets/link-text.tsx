"use client"
import { useState } from "react"
import { Verdict } from "./verdict"
import { wButton, wInput } from "./ui"

const LINKS = [
  { id: "pdf", before: "The spring timetable is ready.", text: "Click here", after: "", target: "Downloads the timetable as a 2 MB PDF", needsFormat: true, model: "Download the spring timetable (PDF, 2 MB)" },
  { id: "card", before: "Station upgrades finished early. Lifts now serve every platform at Central.", text: "Read more", after: "", target: "Opens the full news story about the Central station upgrade", needsFormat: false, model: "Read about the Central station upgrade" },
  { id: "url", before: "Plan your journey with", text: "https://www.northwind-rail.example/journey-planner?ref=home", after: ".", target: "Opens the journey planner", needsFormat: false, model: "the journey planner" },
  { id: "here", before: "Need help? Contact us", text: "here", after: ".", target: "Opens the contact page", needsFormat: false, model: "Contact our help team" },
  { id: "learn", before: "Some stations have changed their step-free routes.", text: "Learn more", after: "", target: "Opens the step-free access guide", needsFormat: false, model: "See step-free routes by station" },
]
const VAGUE = /^(click here|here|read more|more|learn more|link|this|this link|go|details|info)$/i

export function LinkText({ idPrefix }: { idPrefix: string }) {
  const [text, setText] = useState<Record<string, string>>(Object.fromEntries(LINKS.map((l) => [l.id, l.text])))
  const [checked, setChecked] = useState(false)
  const values = LINKS.map((l) => text[l.id].trim())
  const results = LINKS.map((l, i) => {
    const t = values[i]
    const problems: string[] = []
    if (!t) problems.push("The link has no text.")
    else if (VAGUE.test(t)) problems.push("Vague: out of context, it does not say where it goes.")
    if (/^https?:\/\//i.test(t)) problems.push("A raw web address is long to listen to and hard to understand.")
    if (/click/i.test(t)) problems.push("“Click” assumes a mouse; describe the destination instead.")
    if (l.needsFormat && !/pdf/i.test(t)) problems.push("Say it is a PDF, so people know a file will download.")
    if (t.length > 90) problems.push("Long: keep link text short and front-load the key words.")
    if (values.filter((v) => v.toLowerCase() === t.toLowerCase()).length > 1) problems.push("Another link has the same text but a different destination.")
    return { ...l, problems }
  })
  const good = results.filter((r) => !r.problems.length).length
  return (
    <div className="space-y-4">
      <p className="text-sm">Rewrite each link so it makes sense on its own, as it does when a screen reader user lists all the links on a page.</p>
      <ol role="list" className="space-y-4">
        {LINKS.map((l, i) => (
          <li key={l.id} className="rounded-lg border border-slate-300 p-4 dark:border-slate-700">
            <p className="text-sm text-slate-700 dark:text-slate-300">{l.before} <span className="font-semibold text-blue-800 underline dark:text-blue-300">{values[i] || "(empty)"}</span>{l.after}</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Destination: {l.target}</p>
            <label htmlFor={`${idPrefix}-${l.id}`} className="mt-2 block text-sm font-semibold">Link text {i + 1}</label>
            <input id={`${idPrefix}-${l.id}`} value={text[l.id]} onChange={(e) => { setText((p) => ({ ...p, [l.id]: e.target.value })); setChecked(false) }} className={wInput} />
            {checked ? (
              <div className="mt-2 text-sm" aria-live="polite">
                <p className="flex items-center gap-2"><Verdict pass={!results[i].problems.length} passText="Clear" failText="Needs work" /></p>
                {results[i].problems.length ? <ul className="mt-1 list-disc pl-6">{results[i].problems.map((p) => <li key={p}>{p}</li>)}</ul> : null}
                <p className="mt-1 text-slate-600 dark:text-slate-400">One good answer: “{l.model}”</p>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      <button type="button" className={wButton} onClick={() => setChecked(true)}>Check my links</button>
      {checked ? <p aria-live="polite" className="text-sm font-semibold">{good} of {LINKS.length} links are clear. 2.4.4 Link Purpose (In Context) is Level A; making links clear on their own (2.4.9, AAA) helps everyone who scans.</p> : null}
    </div>
  )
}
