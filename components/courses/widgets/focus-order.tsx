"use client"
import { useRef, useState } from "react"
import { RotateCcw, Undo2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Verdict } from "./verdict"
import { wButton, wRing } from "./ui"

// A two-column checkout. The logical order follows reading order: header, then the form column, then the summary column.
const ITEMS = [
  { id: "skip", label: "Skip to main content link", area: "top", why: "A skip link is the first stop so keyboard users can bypass the header." },
  { id: "logo", label: "Logo, links to home", area: "header", why: "Header items follow in visual reading order, left to right." },
  { id: "help", label: "Help link", area: "header", why: "Header items follow in visual reading order, left to right." },
  { id: "email", label: "Email field", area: "form", why: "The form is the main task; its fields follow top to bottom." },
  { id: "name", label: "Full name field", area: "form", why: "Fields follow the order they appear in." },
  { id: "card", label: "Card number field", area: "form", why: "Fields follow the order they appear in." },
  { id: "coupon", label: "Coupon code field", area: "summary", why: "The summary column comes after the form column, top to bottom." },
  { id: "pay", label: "Pay now button", area: "summary", why: "The final action comes last, after everything it depends on." },
] as const
const LOGICAL = ITEMS.map((i) => i.id)
type Id = (typeof ITEMS)[number]["id"]

export function FocusOrder() {
  const [order, setOrder] = useState<Id[]>([])
  const [checked, setChecked] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)
  const pick = (id: Id) => { setChecked(false); setOrder((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id])) }
  const pos = (id: Id) => order.indexOf(id) + 1
  const correct = order.length === LOGICAL.length && order.every((id, i) => id === LOGICAL[i])
  const firstWrong = order.findIndex((id, i) => id !== LOGICAL[i])
  const btn = (id: Id, className?: string) => {
    const item = ITEMS.find((i) => i.id === id)!
    const n = pos(id)
    return (
      <button key={id} type="button" aria-pressed={n > 0} onClick={() => pick(id)} className={cn("relative flex min-h-11 w-full items-center gap-2 rounded-md border-2 border-dashed border-slate-500 bg-white px-3 py-2 text-left text-sm text-slate-900 hover:bg-blue-50", n > 0 && "border-solid border-blue-700 bg-blue-50", wRing, className)}>
        <span aria-hidden="true" className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold", n ? "bg-blue-700 text-white" : "border border-slate-400 text-slate-500")}>{n || "·"}</span>
        <span>{item.label}<span className="sr-only">{n ? `, position ${n}` : ", not numbered yet"}</span></span>
      </button>
    )
  }
  return (
    <div className="space-y-4">
      <p className="text-sm">Activate the elements in the order a keyboard user should reach them. Activate a numbered element again to remove it.</p>
      <div className="space-y-3 rounded-lg border border-slate-300 bg-slate-100 p-3 text-slate-900 dark:border-slate-700">
        {btn("skip", "sm:w-1/2")}
        <div className="grid gap-2 rounded-md bg-slate-800 p-2 sm:grid-cols-2" aria-label="Header" role="group">{btn("logo")}{btn("help")}</div>
        <div className="grid gap-3 md:grid-cols-[3fr_2fr]">
          <div role="group" aria-label="Checkout form" className="space-y-2 rounded-md bg-white p-3 shadow-sm"><p className="text-base font-bold">Checkout</p>{btn("email")}{btn("name")}{btn("card")}</div>
          <div role="group" aria-label="Order summary" className="space-y-2 rounded-md bg-white p-3 shadow-sm"><p className="text-base font-bold">Order summary</p><p className="text-sm">2 items, $84.00</p>{btn("coupon")}{btn("pay")}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" className={wButton} disabled={!order.length} onClick={() => { setOrder((o) => o.slice(0, -1)); setChecked(false) }}><Undo2 aria-hidden="true" focusable="false" className="h-4 w-4" />Undo last</button>
        <button type="button" className={wButton} disabled={!order.length} onClick={() => { setOrder([]); setChecked(false) }}><RotateCcw aria-hidden="true" focusable="false" className="h-4 w-4" />Start again</button>
        <button type="button" className={cn(wButton, "border-blue-700 bg-blue-700 text-white hover:bg-blue-800 dark:border-blue-400 dark:bg-blue-400 dark:text-slate-950")} onClick={() => { setChecked(true); requestAnimationFrame(() => resultRef.current?.focus()) }}>Check my order ({order.length} of {ITEMS.length})</button>
      </div>
      <div ref={resultRef} tabIndex={-1} aria-live="polite" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
        {checked ? (
          <div className="space-y-2 rounded-lg border border-slate-300 p-4 text-sm dark:border-slate-700">
            <p className="flex flex-wrap items-center gap-2 font-semibold"><Verdict pass={correct} passText="Logical order" failText="Not yet logical" />{correct ? "Your order matches the visual reading order." : order.length < ITEMS.length ? `Number all ${ITEMS.length} elements first.` : `Position ${firstWrong + 1} should be: ${ITEMS[firstWrong].label}.`}</p>
            {!correct && order.length === ITEMS.length ? <p>{ITEMS[firstWrong].why}</p> : null}
            <details><summary className="cursor-pointer font-semibold">Show the logical order and why</summary><ol className="mt-2 list-decimal space-y-1 pl-6">{ITEMS.map((i) => <li key={i.id}><strong>{i.label}.</strong> {i.why}</li>)}</ol></details>
            <p className="text-slate-600 dark:text-slate-400">2.4.3 Focus Order asks that focus order preserves meaning and operability. Put the same order in your annotations so developers match the DOM to it.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
