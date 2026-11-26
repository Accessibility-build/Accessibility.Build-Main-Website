"use client"
import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { wButton } from "./ui"

export function ReducedMotion() {
  const [osReduce, setOsReduce] = useState(false)
  const [simulate, setSimulate] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [phase, setPhase] = useState<"rest" | "start" | "run">("rest")
  const [confirmFull, setConfirmFull] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const set = () => { setOsReduce(mq.matches); if (mq.matches) setSimulate(true) }
    set()
    mq.addEventListener("change", set)
    return () => mq.removeEventListener("change", set)
  }, [])
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  const reduced = simulate
  // The card rests fully visible. Playing jumps to the start pose, then animates back to rest.
  const run = (isReduced: boolean) => {
    setPlaying(true)
    setPhase("start")
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase("run")))
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => { setPlaying(false); setPhase("rest") }, isReduced ? 800 : 1500)
  }
  const play = () => {
    if (!reduced && osReduce && !confirmFull) { setConfirmFull(true); return }
    run(reduced)
  }
  const stop = () => { if (timer.current) clearTimeout(timer.current); setPlaying(false); setPhase("rest") }
  const motion = phase === "start"
    ? reduced ? { opacity: 0, transition: "none" } : { transform: "translateX(-60%) scale(1.25)", opacity: 0, transition: "none" }
    : phase === "run"
      ? reduced ? { opacity: 1, transition: "opacity 600ms ease" } : { transform: "none", opacity: 1, transition: "transform 1200ms cubic-bezier(.2,.8,.2,1), opacity 1200ms" }
      : { opacity: 1 }
  return (
    <div className="space-y-4">
      <p className="text-sm">Your device setting: <strong>{osReduce ? "reduce motion is on" : "no preference for reduced motion"}</strong>.</p>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex min-h-11 cursor-pointer items-center gap-3 font-semibold"><input type="checkbox" checked={simulate} onChange={(e) => { setSimulate(e.target.checked); setConfirmFull(false) }} className="h-5 w-5 accent-blue-700" />Simulate prefers-reduced-motion: reduce</label>
        <button type="button" className={wButton} onClick={playing ? stop : play}>{playing ? <Pause aria-hidden="true" focusable="false" className="h-4 w-4" /> : <Play aria-hidden="true" focusable="false" className="h-4 w-4" />}{playing ? "Stop" : "Play the entrance animation"}</button>
      </div>
      {confirmFull ? (
        <div role="alert" className="rounded-lg border border-amber-400 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
          Your device asks for reduced motion. The full animation slides and zooms for about one second.{" "}
          <button type="button" className="font-semibold underline" onClick={() => { setConfirmFull(false); run(false) }}>Play it anyway</button>{" "}or keep the simulation on.
        </div>
      ) : null}
      <div className="overflow-hidden rounded-lg border border-slate-300 bg-white p-6 dark:border-slate-700">
        <div style={motion} className="max-w-sm rounded-xl bg-blue-800 p-5 text-white shadow">
          <p className="text-sm font-semibold uppercase tracking-wider">New</p>
          <p className="mt-1 text-xl font-bold">Spring timetable is live</p>
          <p className="mt-1 text-sm">Plan your journey with the updated routes.</p>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {reduced
          ? "Reduced version: the card fades in without moving. The message and the moment of attention are kept; the large movement that can trigger dizziness or nausea in people with vestibular disorders is removed."
          : "Full version: the card slides and zooms in. Movement like this, especially large or parallax motion, can cause discomfort for people with vestibular disorders."}{" "}
        Design the reduced version deliberately; do not just delete feedback that carries meaning.
      </p>
      <p aria-live="polite" className="sr-only">{playing ? (reduced ? "Playing the reduced fade." : "Playing the full slide and zoom.") : ""}</p>
    </div>
  )
}
