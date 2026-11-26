"use client"
import { useEffect, useRef, useState } from "react"
import { Square, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { wButton, wLabel } from "./ui"

const FIXES = [
  { id: "heading", label: "Product name is marked up as a heading (level 2)" },
  { id: "alt", label: "Product photo has a text alternative" },
  { id: "divider", label: "Decorative divider is hidden from screen readers" },
  { id: "price", label: "Old price, new price and sale label are read as one phrase" },
  { id: "wishlist", label: "Heart icon button has a name and a pressed state" },
  { id: "cta", label: "Main action says what it does instead of “Click here”" },
] as const
type FixId = (typeof FIXES)[number]["id"]

function announcements(on: Record<FixId, boolean>) {
  const list: Array<{ part: string; text: string; problem: boolean }> = []
  list.push(on.alt ? { part: "photo", text: "Image, navy 24 litre daypack with a padded laptop sleeve", problem: false } : { part: "photo", text: "Image, IMG underscore 4821 dot jpg", problem: true })
  list.push(on.heading ? { part: "title", text: "Heading level 2, Trail Daypack 24 L", problem: false } : { part: "title", text: "Trail Daypack 24 L", problem: true })
  if (!on.divider) list.push({ part: "divider", text: "Image, divider swirl", problem: true })
  if (on.price) list.push({ part: "price", text: "Sale. Was 119 dollars, now 89 dollars", problem: false })
  else list.push({ part: "price", text: "89 dollars", problem: true }, { part: "price", text: "Deleted, 119 dollars", problem: true }, { part: "price", text: "Sale", problem: true })
  list.push(on.wishlist ? { part: "wishlist", text: "Save Trail Daypack to wishlist, toggle button, not pressed", problem: false } : { part: "wishlist", text: "Button", problem: true })
  list.push(on.cta ? { part: "cta", text: "Add Trail Daypack to bag, button", problem: false } : { part: "cta", text: "Click here, link", problem: true })
  return list
}

export function ScreenReaderPreview({ idPrefix }: { idPrefix: string }) {
  const [on, setOn] = useState<Record<FixId, boolean>>({ heading: false, alt: false, divider: false, price: false, wishlist: false, cta: false })
  const [speaking, setSpeaking] = useState<number | null>(null)
  const [canSpeak, setCanSpeak] = useState(false)
  const cancelled = useRef(false)
  useEffect(() => { setCanSpeak(typeof window !== "undefined" && "speechSynthesis" in window); return () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel() } }, [])
  const items = announcements(on)
  const fixed = Object.values(on).filter(Boolean).length
  const highlight = speaking !== null ? items[speaking]?.part : null

  function speak() {
    if (!canSpeak) return
    window.speechSynthesis.cancel(); cancelled.current = false
    const next = (i: number) => {
      if (cancelled.current || i >= items.length) { setSpeaking(null); return }
      setSpeaking(i)
      const u = new SpeechSynthesisUtterance(items[i].text)
      u.rate = 1.05
      u.onend = () => next(i + 1)
      u.onerror = () => setSpeaking(null)
      window.speechSynthesis.speak(u)
    }
    next(0)
  }
  function stop() { cancelled.current = true; window.speechSynthesis.cancel(); setSpeaking(null) }

  const ringFor = (part: string) => (highlight === part ? "outline outline-[3px] outline-offset-2 outline-amber-500" : "")
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div role="img" aria-label="Product card: photo of a navy daypack with a heart button in its corner, the name Trail Daypack 24 L in large bold text, a decorative swirl divider, the price 89 dollars next to 119 dollars struck through and a red Sale tag, and a dark button labelled Click here." className="rounded-lg border border-slate-300 bg-white p-4 text-slate-900">
          <div aria-hidden="true">
            <div className={cn("relative h-36 rounded-md bg-gradient-to-br from-sky-300 to-blue-900", ringFor("photo"))}>
              <span className={cn("absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg", ringFor("wishlist"))}>♡</span>
            </div>
            <p className={cn("mt-3 text-xl font-bold", ringFor("title"))}>Trail Daypack 24 L</p>
            <p className={cn("my-2 text-center text-slate-500", ringFor("divider"))}>~ ~ ~</p>
            <p className={cn("flex items-center gap-2", ringFor("price"))}><span className="text-lg font-bold">$89</span><span className="text-slate-600 line-through">$119</span><span className="rounded bg-red-700 px-2 py-0.5 text-xs font-bold text-white">Sale</span></p>
            <p className={cn("mt-3 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white", ringFor("cta"))}>{on.cta ? "Add to bag" : "Click here"}</p>
          </div>
        </div>
        <div className="rounded-lg border border-slate-300 bg-slate-950 p-4 text-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">What a screen reader announces, in order</p>
          <ol className="mt-3 space-y-2 font-mono text-sm">
            {items.map((a, i) => (
              <li key={`${a.part}-${i}`} className={cn("rounded px-2 py-1", speaking === i ? "bg-amber-400 text-slate-950" : a.problem ? "bg-slate-800" : "")}>
                <span className="sr-only">{a.problem ? "Problem: " : "Clear: "}</span>“{a.text}”{a.problem ? <span aria-hidden="true" className="ml-2 text-amber-300">⚠</span> : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <fieldset>
        <legend className={wLabel}>Design fixes ({fixed} of {FIXES.length} applied)</legend>
        <div className="mt-2 grid gap-1 sm:grid-cols-2">
          {FIXES.map((f) => (
            <label key={f.id} className="flex min-h-11 cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" id={`${idPrefix}-${f.id}`} className="mt-0.5 h-5 w-5 shrink-0 accent-blue-700" checked={on[f.id]} onChange={(e) => setOn((p) => ({ ...p, [f.id]: e.target.checked }))} />{f.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-wrap gap-3">
        <button type="button" className={wButton} onClick={speaking === null ? speak : stop} disabled={!canSpeak}>{speaking === null ? <Volume2 aria-hidden="true" className="h-4 w-4" /> : <Square aria-hidden="true" className="h-4 w-4" />}{speaking === null ? "Read it aloud" : "Stop"}</button>
        <button type="button" className={wButton} onClick={() => setOn({ heading: true, alt: true, divider: true, price: true, wishlist: true, cta: true })}>Apply all fixes</button>
        <button type="button" className={wButton} onClick={() => setOn({ heading: false, alt: false, divider: false, price: false, wishlist: false, cta: false })}>Remove all fixes</button>
      </div>
      <p aria-live="polite" className="sr-only">{fixed} of {FIXES.length} fixes applied. {items.length} announcements.</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">{canSpeak ? "Read aloud uses your browser's synthesized voice, not a real screen reader. " : "Your browser does not offer speech, so read the list instead. "}Real screen readers word things differently (NVDA, JAWS, VoiceOver and TalkBack each have their own phrasing), but the problems are the same: a missing name, a missing heading or a jumbled price cannot be fixed by the screen reader. Each fix here is something a designer specifies in the annotations.</p>
    </div>
  )
}
