"use client"

import { useState, useRef } from "react"
import {
  ArrowRight,
  Keyboard,
  SkipForward,
} from "lucide-react"

interface FocusEvent {
  element: string
  timestamp: number
  action: "focus" | "skip"
}

export default function BypassBlocksDemo() {
  const [focusHistory, setFocusHistory] = useState<FocusEvent[]>([])
  const [isNavigating, setIsNavigating] = useState(false)
  const [skipLinkVisible, setSkipLinkVisible] = useState(false)

  const mainContentRef = useRef<HTMLElement>(null)
  const navigationRef = useRef<HTMLElement>(null)

  const trackFocus = (element: string, action: "focus" | "skip" = "focus") => {
    setFocusHistory((prev) => [
      ...prev.slice(-9),
      { element, timestamp: Date.now(), action },
    ])
  }

  const handleSkipToContent = (e: React.MouseEvent) => {
    e.preventDefault()
    if (mainContentRef.current) {
      mainContentRef.current.focus()
      mainContentRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      trackFocus("Main content", "skip")
      setSkipLinkVisible(false)
    }
  }

  const handleSkipToNav = (e: React.MouseEvent) => {
    e.preventDefault()
    if (navigationRef.current) {
      navigationRef.current.focus()
      navigationRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      trackFocus("Navigation", "skip")
      setSkipLinkVisible(false)
    }
  }

  const simulateWithoutSkip = () => {
    setIsNavigating(true)
    setFocusHistory([])
    const elements = [
      "Logo",
      "Home link",
      "About link",
      "Services link",
      "Products link",
      "Blog link",
      "Contact link",
      "Search button",
      "Main content",
    ]
    elements.forEach((element, index) => {
      setTimeout(() => {
        trackFocus(element)
        if (index === elements.length - 1) setIsNavigating(false)
      }, (index + 1) * 600)
    })
  }

  const simulateWithSkip = () => {
    setIsNavigating(true)
    setFocusHistory([])
    const elements = ["Skip to content link", "Main content", "Article heading"]
    elements.forEach((element, index) => {
      setTimeout(() => {
        trackFocus(element, index === 1 ? "skip" : "focus")
        if (index === elements.length - 1) setIsNavigating(false)
      }, (index + 1) * 700)
    })
  }

  return (
    <div className="space-y-6">
      {/* Live skip link */}
      <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <a
          href="#demo-main-content"
          className={`absolute left-4 z-50 rounded-md bg-slate-900 px-4 py-2 font-medium text-white transition-all duration-300 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 ${
            skipLinkVisible ? "top-4" : "-top-12"
          }`}
          onFocus={() => setSkipLinkVisible(true)}
          onBlur={() => setSkipLinkVisible(false)}
          onClick={handleSkipToContent}
        >
          Skip to main content
        </a>
        <a
          href="#demo-navigation"
          className={`absolute left-4 z-50 rounded-md bg-slate-900 px-4 py-2 font-medium text-white transition-all duration-300 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 ${
            skipLinkVisible ? "top-16" : "-top-12"
          }`}
          onFocus={() => setSkipLinkVisible(true)}
          onBlur={() => setSkipLinkVisible(false)}
          onClick={handleSkipToNav}
        >
          Skip to navigation
        </a>

        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Try a real skip link
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
          Click inside this box, then press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">Tab</kbd>.
          Two skip links appear at the top-left. Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">Enter</kbd>{" "}
          on one to jump straight past the repeated navigation to the content or nav landmark below.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <nav
            ref={navigationRef}
            id="demo-navigation"
            tabIndex={-1}
            aria-label="Sample site navigation"
            className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-4 focus:outline focus:outline-2 focus:outline-blue-600"
            onFocus={() => trackFocus("Navigation")}
          >
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 text-sm">
              Repeated navigation
            </h4>
            <div className="flex flex-wrap gap-2">
              {["Home", "About", "Services", "Products", "Blog", "Contact"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded bg-slate-200 dark:bg-slate-700 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline focus:outline-2 focus:outline-blue-600"
                  onFocus={() => trackFocus(`${item} link`)}
                >
                  {item}
                </button>
              ))}
            </div>
          </nav>

          <main
            ref={mainContentRef}
            id="demo-main-content"
            tabIndex={-1}
            className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4 focus:outline focus:outline-2 focus:outline-green-600"
            onFocus={() => trackFocus("Main content")}
          >
            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 text-sm">
              Main content landmark
            </h4>
            <p className="text-sm text-green-800/90 dark:text-green-300/90">
              A skip link sends keyboard and screen reader users straight here, bypassing
              the navigation they have already heard on every other page.
            </p>
          </main>
        </div>
      </div>

      {/* Simulated comparison */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Compare the tab journey
        </h3>
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            type="button"
            onClick={simulateWithoutSkip}
            disabled={isNavigating}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:bg-slate-400"
          >
            <Keyboard className="h-4 w-4" />
            Without skip link
          </button>
          <button
            type="button"
            onClick={simulateWithSkip}
            disabled={isNavigating}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:bg-slate-400"
          >
            <SkipForward className="h-4 w-4" />
            With skip link
          </button>
        </div>
        <div
          className="h-56 overflow-y-auto rounded-lg bg-slate-50 dark:bg-slate-900/40 p-4"
          aria-live="polite"
        >
          {focusHistory.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Press a button to watch each Tab stop. Notice how many stops the skip link saves.
            </p>
          ) : (
            <ul className="space-y-2">
              {focusHistory.map((event, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-2 rounded p-2 text-sm ${
                    event.action === "skip"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}
                >
                  {event.action === "skip" ? (
                    <SkipForward className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  <span className="font-medium">{event.element}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
