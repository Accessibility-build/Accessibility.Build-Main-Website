"use client"
import { useEffect, useRef, useState } from "react"
import { Verdict } from "./verdict"

const COPY = "Free returns within 30 days. Pack the item in its original box, print the label from your account and drop it at any collection point."

function Card({ title, fixed, spaced, onClip }: { title: string; fixed: boolean; spaced: boolean; onClip: (clipped: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => onClip(el.scrollHeight > el.clientHeight + 1)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [spaced, fixed, onClip])
  const spacing = spaced ? { lineHeight: 1.5, letterSpacing: "0.12em", wordSpacing: "0.16em" } : { lineHeight: 1.25 }
  return (
    <div className="rounded-lg border border-slate-300 bg-white p-0 text-slate-900 dark:border-slate-700">
      <p className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold">{title}</p>
      <div ref={ref} className="p-4" style={{ height: fixed ? 132 : undefined, overflow: fixed ? "hidden" : "visible", fontSize: 16, ...spacing }}>
        <p className="font-semibold" style={{ marginBottom: spaced ? "2em" : "0.5em" }}>Returns</p>
        <p style={{ marginBottom: spaced ? "2em" : 0 }}>{COPY}</p>
      </div>
    </div>
  )
}

export function TextSpacing() {
  const [spaced, setSpaced] = useState(false)
  const [clip, setClip] = useState<{ fixed: boolean; flex: boolean }>({ fixed: false, flex: false })
  return (
    <div className="space-y-4">
      <label className="flex min-h-11 cursor-pointer items-center gap-3 font-semibold"><input type="checkbox" checked={spaced} onChange={(e) => setSpaced(e.target.checked)} className="h-5 w-5 accent-blue-700" />Apply the 1.4.12 text spacing values</label>
      <p className="text-sm text-slate-700 dark:text-slate-300">Line height 1.5 times the font size, paragraph spacing 2 times, letter spacing 0.12 times, word spacing 0.16 times. People apply these with a browser extension or user style sheet; your design must not lose content when they do.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Card title="Card with a fixed height" fixed spaced={spaced} onClip={(c) => setClip((p) => (p.fixed === c ? p : { ...p, fixed: c }))} />
          <p className="flex items-center gap-2 text-sm"><Verdict pass={!clip.fixed} passText="All text visible" failText="Text is cut off" /></p>
        </div>
        <div className="space-y-2">
          <Card title="Card that grows with its content" fixed={false} spaced={spaced} onClip={(c) => setClip((p) => (p.flex === c ? p : { ...p, flex: c }))} />
          <p className="flex items-center gap-2 text-sm"><Verdict pass={!clip.flex} passText="All text visible" failText="Text is cut off" /></p>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">{spaced ? `Spacing applied. Fixed-height card: ${clip.fixed ? "text cut off" : "all text visible"}. Flexible card: all text visible.` : "Spacing removed."}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">Design containers to grow (min-height, not height) and avoid truncating with ellipses where the full text matters.</p>
    </div>
  )
}
