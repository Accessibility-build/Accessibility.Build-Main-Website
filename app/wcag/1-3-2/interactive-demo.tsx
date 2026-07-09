"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Volume2, Eye, EyeOff } from "lucide-react"

type Layout = "good" | "bad"

// A three-block news article: headline, body, and a "read more" footer.
// The GOOD layout keeps source order = visual order.
// The BAD layout uses CSS (absolute positioning) to float the headline to the
// top visually while leaving it LAST in the DOM, so assistive tech reads it out
// of sequence.
const HEADLINE = {
  id: "headline",
  visual: "Breaking News: New Accessibility Guidelines Released",
  sub: "Published today by the W3C",
}
const BODY = {
  id: "body",
  text: "The World Wide Web Consortium (W3C) has announced new accessibility guidelines that make the web more inclusive for everyone.",
}
const FOOTER = {
  id: "footer",
  text: "Read more about these updates on the W3C website.",
}

// Reading order as a screen reader / keyboard would encounter it (DOM order).
const GOOD_ORDER = [HEADLINE.visual, HEADLINE.sub, BODY.text, FOOTER.text]
const BAD_ORDER = [FOOTER.text, BODY.text, HEADLINE.visual, HEADLINE.sub]

export default function MeaningfulSequenceDemo() {
  const [layout, setLayout] = useState<Layout>("good")
  const [showDom, setShowDom] = useState(false)

  const order = layout === "good" ? GOOD_ORDER : BAD_ORDER

  const speak = (elements: string[]) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(
      `Reading order: ${elements.join(". ")}`
    )
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
        Reading order explorer
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
        Both layouts look almost identical on screen, but the source (DOM) order
        differs. Toggle the DOM order to see what a screen reader and the keyboard
        actually follow.
      </p>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          size="sm"
          variant={layout === "good" ? "default" : "outline"}
          onClick={() => setLayout("good")}
        >
          Good reading order
        </Button>
        <Button
          size="sm"
          variant={layout === "bad" ? "default" : "outline"}
          onClick={() => setLayout("bad")}
        >
          Poor reading order
        </Button>
        <Button size="sm" variant="outline" onClick={() => setShowDom((v) => !v)}>
          {showDom ? (
            <EyeOff className="h-4 w-4 mr-1" />
          ) : (
            <Eye className="h-4 w-4 mr-1" />
          )}
          {showDom ? "Hide" : "Show"} DOM order
        </Button>
      </div>

      {/* Visual rendering of the chosen layout */}
      {layout === "good" ? (
        <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-5">
          <h4 className="font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" /> Source order matches visual order
          </h4>
          <div className="relative rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-4">
            {showDom && (
              <span className="absolute top-2 right-2 rounded bg-green-100 dark:bg-green-900/40 px-2 py-1 text-xs font-medium text-green-800 dark:text-green-200">
                DOM: 1 → 2 → 3
              </span>
            )}
            <header className={`rounded p-4 bg-blue-50 dark:bg-blue-950/30 ${showDom ? "ring-2 ring-green-500" : ""}`}>
              {showDom && <span className="text-green-600 font-bold text-sm">1. </span>}
              <span className="font-bold text-slate-900 dark:text-white">{HEADLINE.visual}</span>
              <span className="block text-sm text-slate-600 dark:text-slate-400">{HEADLINE.sub}</span>
            </header>
            <section className={`rounded p-4 bg-slate-50 dark:bg-slate-800 ${showDom ? "ring-2 ring-green-500" : ""}`}>
              {showDom && <span className="text-green-600 font-bold text-sm">2. </span>}
              <span className="text-slate-700 dark:text-slate-300">{BODY.text}</span>
            </section>
            <footer className={`rounded p-4 bg-slate-100 dark:bg-slate-800/60 ${showDom ? "ring-2 ring-green-500" : ""}`}>
              {showDom && <span className="text-green-600 font-bold text-sm">3. </span>}
              <span className="text-sm text-slate-700 dark:text-slate-300">{FOOTER.text}</span>
            </footer>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
          <h4 className="font-semibold text-rose-800 dark:text-rose-300 mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5" /> CSS moves the headline; source order is scrambled
          </h4>
          <div className="relative rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
            {showDom && (
              <span className="absolute top-2 right-2 rounded bg-rose-100 dark:bg-rose-900/40 px-2 py-1 text-xs font-medium text-rose-800 dark:text-rose-200">
                DOM: 1 → 2 → 3
              </span>
            )}
            {/* Headline is visually first via absolute positioning, but last in the DOM */}
            <div
              className={`absolute left-5 right-5 top-5 rounded p-4 bg-blue-50 dark:bg-blue-950/30 ${showDom ? "ring-2 ring-rose-500" : ""}`}
            >
              {showDom && <span className="text-rose-600 font-bold text-sm">3. </span>}
              <span className="font-bold text-slate-900 dark:text-white">{HEADLINE.visual}</span>
              <span className="block text-sm text-slate-600 dark:text-slate-400">{HEADLINE.sub}</span>
            </div>
            <div className="mt-24 space-y-4">
              <footer className={`rounded p-4 bg-slate-100 dark:bg-slate-800/60 ${showDom ? "ring-2 ring-rose-500" : ""}`}>
                {showDom && <span className="text-rose-600 font-bold text-sm">1. </span>}
                <span className="text-sm text-slate-700 dark:text-slate-300">{FOOTER.text}</span>
              </footer>
              <section className={`rounded p-4 bg-slate-50 dark:bg-slate-800 ${showDom ? "ring-2 ring-rose-500" : ""}`}>
                {showDom && <span className="text-rose-600 font-bold text-sm">2. </span>}
                <span className="text-slate-700 dark:text-slate-300">{BODY.text}</span>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Screen reader reading-order simulation */}
      <div className="mt-6 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between gap-4 mb-3">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            Screen reader / keyboard follows the DOM in this order:
          </p>
          <Button
            size="sm"
            variant={layout === "good" ? "default" : "destructive"}
            onClick={() => speak(order)}
          >
            <Volume2 className="h-4 w-4 mr-2" /> Hear it
          </Button>
        </div>
        <ol className="space-y-1 text-sm text-slate-700 dark:text-slate-300 list-decimal list-inside">
          {order.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
        <p
          className={`mt-3 text-sm ${
            layout === "good"
              ? "text-green-700 dark:text-green-300"
              : "text-rose-700 dark:text-rose-300"
          }`}
        >
          {layout === "good"
            ? "The sequence makes sense read linearly: headline, then story, then “read more.” DOM order matches the meaning."
            : "The headline is announced last, after the “read more” link and the story — the sequence no longer conveys the intended meaning."}
        </p>
      </div>
    </div>
  )
}
