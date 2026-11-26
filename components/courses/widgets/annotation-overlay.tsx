"use client"
import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type Layer = "headings" | "landmarks" | "order" | "names"
const LAYERS: Array<{ id: Layer; label: string; badge: string }> = [
  { id: "headings", label: "Headings and levels", badge: "bg-purple-700" },
  { id: "landmarks", label: "Landmarks", badge: "bg-teal-700" },
  { id: "order", label: "Focus order", badge: "bg-blue-700" },
  { id: "names", label: "Accessible names", badge: "bg-orange-700" },
]
const NOTES: Record<Layer, string[]> = {
  headings: ["H1: Find a recipe", "H2: Popular this week", "H2: Newsletter (footer)"],
  landmarks: ["header (banner) with nav labelled Main", "search region around the search form", "main", "footer (contentinfo)"],
  order: ["1 Skip link", "2 Logo", "3 Recipes", "4 Saved", "5 Search field", "6 Search button", "7 First recipe card", "8 Second recipe card", "9 Newsletter email"],
  names: ["Search button (magnifier icon): \"Search recipes\"", "Saved link (heart icon): \"Saved recipes, 3\"", "Recipe card image: alt empty, title link names the card", "Email field label: \"Email for the newsletter\""],
}

function Badge({ on, layer, children, className }: { on: boolean; layer: Layer; children: ReactNode; className?: string }) {
  if (!on) return null
  const color = LAYERS.find((l) => l.id === layer)!.badge
  return <span aria-hidden="true" className={cn("pointer-events-none absolute z-10 whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-bold leading-4 text-white shadow", color, className)}>{children}</span>
}

export function AnnotationOverlay({ idPrefix }: { idPrefix: string }) {
  const [on, setOn] = useState<Record<Layer, boolean>>({ headings: true, landmarks: false, order: false, names: false })
  const box = (layer: Layer) => (on[layer] ? (layer === "landmarks" ? "outline outline-2 outline-offset-2 outline-teal-700" : "") : "")
  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="text-sm font-semibold">Annotation layers</legend>
        <div className="mt-1 flex flex-wrap gap-x-6">
          {LAYERS.map((l) => (
            <label key={l.id} className="flex min-h-11 cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={on[l.id]} onChange={(e) => setOn((p) => ({ ...p, [l.id]: e.target.checked }))} className="h-5 w-5 accent-blue-700" />
              <span aria-hidden="true" className={cn("h-3 w-3 rounded-sm", l.badge)} />{l.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div role="img" aria-label="Mock recipe website home page with the selected annotation layers drawn on top. The annotations are listed in text below." className="overflow-hidden rounded-lg border border-slate-300 bg-white p-4 pt-6 text-slate-900 dark:border-slate-700">
        <div className={cn("relative flex flex-wrap items-center justify-between gap-3 rounded-md bg-emerald-900 px-4 py-3 text-white", box("landmarks"))}>
          <Badge on={on.landmarks} layer="landmarks" className="-top-5 left-0">header / nav</Badge>
          <span className="relative font-bold"><Badge on={on.order} layer="order" className="-left-3 -top-4">2</Badge>Fresh Table</span>
          <span className="flex gap-4 text-sm">
            <span className="relative"><Badge on={on.order} layer="order" className="-left-3 -top-4">3</Badge>Recipes</span>
            <span className="relative">♥ 3<Badge on={on.order} layer="order" className="-left-3 -top-4">4</Badge><Badge on={on.names} layer="names" className="right-0 top-5">“Saved recipes, 3”</Badge></span>
          </span>
        </div>
        <div className={cn("relative mt-8 flex gap-2", box("landmarks"))}>
          <Badge on={on.landmarks} layer="landmarks" className="-top-5 left-0">search</Badge>
          <span className="relative flex-1 rounded border border-slate-500 px-3 py-2 text-sm text-slate-600"><Badge on={on.order} layer="order" className="-left-2 -top-3">5</Badge>Search 2,000 recipes</span>
          <span className="relative rounded bg-emerald-800 px-3 py-2 text-white">⌕<Badge on={on.order} layer="order" className="-left-2 -top-3">6</Badge><Badge on={on.names} layer="names" className="right-0 top-10">“Search recipes”</Badge></span>
        </div>
        <div className={cn("relative mt-12 rounded-md p-1", box("landmarks"))}>
          <Badge on={on.landmarks} layer="landmarks" className="-top-5 left-0">main</Badge>
          <p className="relative text-2xl font-bold"><Badge on={on.headings} layer="headings" className="-top-3 right-0">H1</Badge>Find a recipe</p>
          <p className="relative mt-3 text-lg font-semibold"><Badge on={on.headings} layer="headings" className="-top-2 right-0">H2</Badge>Popular this week</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {["Lemon orzo", "Miso aubergine"].map((t, i) => (
              <div key={t} className="relative rounded-md border border-slate-300 p-3">
                <Badge on={on.order} layer="order" className="-left-2 -top-3">{7 + i}</Badge>
                {i === 0 ? <Badge on={on.names} layer="names" className="right-1 top-1">img alt=""</Badge> : null}
                <div aria-hidden="true" className="h-14 rounded bg-amber-200" />
                <p className="mt-2 font-semibold underline">{t}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={cn("relative mt-8 rounded-md bg-slate-100 p-3", box("landmarks"))}>
          <Badge on={on.landmarks} layer="landmarks" className="-top-5 left-0">footer</Badge>
          <p className="relative font-semibold"><Badge on={on.headings} layer="headings" className="-top-2 right-0">H2</Badge>Newsletter</p>
          <span className="relative mt-2 block rounded border border-slate-500 bg-white px-3 py-2 text-sm text-slate-600"><Badge on={on.order} layer="order" className="-left-2 -top-3">9</Badge><Badge on={on.names} layer="names" className="right-1 top-1">label “Email for the newsletter”</Badge>you@example.com</span>
        </div>
        <Badge on={on.order} layer="order" className="left-2 top-1">1 skip link</Badge>
      </div>
      <div aria-live="polite" id={`${idPrefix}-notes`}>
        {LAYERS.filter((l) => on[l.id]).map((l) => (
          <div key={l.id} className="mt-3">
            <h4 className="text-sm font-semibold">{l.label}</h4>
            <ul className="mt-1 list-disc space-y-0.5 pl-6 text-sm">{NOTES[l.id].map((n) => <li key={n}>{n}</li>)}</ul>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">Annotations tell developers what the visuals cannot: structure, order and names. Each layer here is something a design handoff should specify.</p>
    </div>
  )
}
