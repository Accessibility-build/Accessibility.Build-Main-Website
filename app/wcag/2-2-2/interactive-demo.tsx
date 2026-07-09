"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, EyeOff, Eye } from "lucide-react"

const slides = [
  {
    title: "Breaking News",
    body: "New accessibility guidelines published for auto-playing content.",
  },
  {
    title: "Technology Update",
    body: "Framework adds prefers-reduced-motion support out of the box.",
  },
  {
    title: "Community Event",
    body: "Join us for Global Accessibility Awareness Day next month.",
  },
]

const ticker = [
  "AAPL 150.25 ▲ 2.5%",
  "MSFT 280.75 ▼ 1.2%",
  "GOOG 2650.00 ▲ 0.8%",
  "AMZN 3200.50 ▲ 1.5%",
]

export default function MotionDemo() {
  const [playing, setPlaying] = useState(true)
  const [hidden, setHidden] = useState(false)
  const [slide, setSlide] = useState(0)
  const [tick, setTick] = useState(0)
  const carouselRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Respect prefers-reduced-motion: start paused if the user asked for less motion.
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPlaying(false)
    }
  }, [])

  useEffect(() => {
    if (!playing || hidden) return
    carouselRef.current = setInterval(() => {
      setSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    tickerRef.current = setInterval(() => {
      setTick((prev) => (prev + 1) % ticker.length)
    }, 1500)
    return () => {
      if (carouselRef.current) clearInterval(carouselRef.current)
      if (tickerRef.current) clearInterval(tickerRef.current)
    }
  }, [playing, hidden])

  if (hidden) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          The moving content has been hidden. Hiding is a valid remedy under 2.2.2 —
          the auto-updating region is now gone entirely, so it can no longer distract
          from the rest of the page.
        </p>
        <Button onClick={() => setHidden(false)} className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Show moving content
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
        Auto-advancing carousel and live ticker
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
        Both regions start moving automatically. The controls below let you pause,
        resume, or hide them — the mechanism 2.2.2 requires.
      </p>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Button
          onClick={() => setPlaying((p) => !p)}
          variant={playing ? "default" : "outline"}
          className="flex items-center gap-2"
          aria-pressed={!playing}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Pause motion" : "Resume motion"}
        </Button>
        <Button
          onClick={() => setHidden(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <EyeOff className="h-4 w-4" />
          Hide
        </Button>
        <span
          className={`inline-flex items-center gap-2 text-sm font-medium ${
            playing
              ? "text-green-700 dark:text-green-400"
              : "text-slate-600 dark:text-slate-400"
          }`}
          role="status"
          aria-live="polite"
        >
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full ${
              playing ? "bg-green-500 animate-pulse" : "bg-slate-400"
            }`}
          />
          {playing ? "Playing" : "Paused"}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Carousel */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="relative h-36 bg-slate-100 dark:bg-slate-900 p-5 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-wide text-slate-400 mb-1">
              News carousel
            </span>
            <h4 className="font-semibold text-lg text-slate-900 dark:text-white">
              {slides[slide].title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {slides[slide].body}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-slate-800/50">
            {slides.map((s, i) => (
              <span
                key={s.title}
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${
                  i === slide ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Ticker */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="h-36 bg-slate-900 text-green-400 font-mono p-5 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-wide text-slate-500 mb-2">
              Stock ticker
            </span>
            {playing ? (
              <div className="text-lg whitespace-nowrap overflow-hidden">
                {ticker[tick]}
              </div>
            ) : (
              <div className="text-slate-500">Updates paused</div>
            )}
          </div>
          <div className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400">
            Auto-updates every 1.5s while playing
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        Note that pausing on hover or focus alone would not satisfy 2.2.2 — a
        keyboard user who never hovers, and a reader who wants the motion gone for
        good, both need a persistent, discoverable control like the buttons above.
      </p>
    </div>
  )
}
