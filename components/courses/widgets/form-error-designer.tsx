"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Verdict } from "./verdict"
import { wLabel } from "./ui"

const OPTIONS = [
  { id: "label", label: "Keep the visible label above the field" },
  { id: "red", label: "Turn the border red (#b91c1c)" },
  { id: "thick", label: "Make the border thicker (2 px)" },
  { id: "icon", label: "Add an error icon" },
  { id: "message", label: "Add an error message under the field" },
  { id: "fix", label: "Make the message say how to fix it" },
  { id: "linked", label: "Annotate: connect the message to the field for screen readers" },
  { id: "summary", label: "Add an error summary at the top of the form" },
] as const
type Opt = (typeof OPTIONS)[number]["id"]

export function FormErrorDesigner({ idPrefix }: { idPrefix: string }) {
  const [on, setOn] = useState<Record<Opt, boolean>>({ label: false, red: true, thick: false, icon: false, message: false, fix: false, linked: false, summary: false })
  const [gray, setGray] = useState(false)
  const set = (id: Opt, v: boolean) => setOn((p) => ({ ...p, [id]: v, ...(id === "message" && !v ? { fix: false, linked: false } : {}) }))
  const message = on.message ? (on.fix ? "Enter an email address like name@example.com" : "Invalid input") : null
  const checks = [
    { sc: "3.3.2 Labels or Instructions (A)", pass: on.label, note: on.label ? "The label stays visible, so people know what the field is even after typing." : "Without a visible label, people lose track of what the field is for, especially once it has a value." },
    { sc: "1.4.1 Use of Color (A)", pass: on.message || on.icon, note: on.message || on.icon ? "The error is shown by text or an icon as well as color." : "Color is the only sign of the error. Turn on “View without color” to see what some people see." },
    { sc: "3.3.1 Error Identification (A)", pass: on.message, note: on.message ? "The error is described in text." : "The error must be described to the user in text, not just signalled." },
    { sc: "3.3.3 Error Suggestion (AA)", pass: on.message && on.fix, note: on.fix ? "The message tells people how to correct the input." : "“Invalid input” names a problem without a fix. When you know how to fix it, say so." },
    { sc: "1.3.1 Info and Relationships (A)", pass: on.message && on.linked, note: on.linked ? "Annotated so developers link the message to the field; screen readers then read it with the field." : "A message that is not connected to its field may never be read when a screen reader user returns to the field." },
    { sc: "Good practice: error summary", pass: on.summary, note: on.summary ? "A summary at the top lists every error with links to the fields, which helps on long forms." : "Not required by WCAG, but GOV.UK and others recommend a linked summary for forms with more than a few fields." },
  ]
  const score = checks.filter((c) => c.pass).length
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <fieldset>
          <legend className={wLabel}>Design the error state for the Email field</legend>
          <div className="mt-2 space-y-1">
            {OPTIONS.map((o) => (
              <label key={o.id} className="flex min-h-11 cursor-pointer items-start gap-3 text-sm">
                <input id={`${idPrefix}-${o.id}`} type="checkbox" checked={on[o.id]} disabled={(o.id === "fix" || o.id === "linked") && !on.message} onChange={(e) => set(o.id, e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-blue-700 disabled:opacity-50" />
                <span className={cn((o.id === "fix" || o.id === "linked") && !on.message && "opacity-60")}>{o.label}</span>
              </label>
            ))}
          </div>
          <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={gray} onChange={(e) => setGray(e.target.checked)} className="h-5 w-5 accent-blue-700" />View without color</label>
        </fieldset>
        <div role="img" aria-label={`Preview of the Email field in its error state. ${on.summary ? "An error summary box at the top lists: Enter an email address. " : ""}${on.label ? "Visible label Email. " : "No visible label. "}The field contains sam@example and has a ${on.thick ? "2 pixel" : "1 pixel"} ${on.red ? "red" : "grey"} border${on.icon ? ", an error icon" : ""}${message ? `, and the message: ${message}` : ""}.`} className="rounded-lg border border-slate-300 bg-white p-5 text-slate-900" style={gray ? { filter: "grayscale(1)" } : undefined}>
          <div aria-hidden="true">
            {on.summary ? <div className="mb-4 rounded-md border-2 border-red-700 p-3 text-sm"><p className="font-bold">There is a problem</p><p className="mt-1 text-blue-800 underline">Enter an email address</p></div> : null}
            {on.label ? <p className="text-sm font-semibold">Email</p> : null}
            <div className="mt-1 flex items-center gap-2 rounded-md bg-white px-3 py-2.5 text-base" style={{ border: `${on.thick ? 2 : 1}px solid ${on.red ? "#b91c1c" : "#6b7280"}` }}>
              <span className="flex-1">sam@example</span>{on.icon ? <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-700 text-xs font-bold text-white">!</span> : null}
            </div>
            {message ? <p className="mt-1.5 text-sm font-medium text-red-800">{message}</p> : null}
          </div>
        </div>
      </div>
      <ul className="space-y-2" aria-live="polite">
        {checks.map((c) => (
          <li key={c.sc} className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800">
            <p className="flex flex-wrap items-center gap-2 font-semibold"><Verdict pass={c.pass} passText="Met" failText="Not yet" />{c.sc}</p>
            <p className="mt-1 text-slate-700 dark:text-slate-300">{c.note}</p>
          </li>
        ))}
      </ul>
      <p className="text-sm font-semibold">{score} of {checks.length} met.</p>
    </div>
  )
}
