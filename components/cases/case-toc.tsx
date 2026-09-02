"use client"

import { useEffect, useRef, useState } from "react"

interface TocEntry {
  id: string
  label: string
}

/**
 * Sticky contents rail with a reading-progress bar, for a long study.
 *
 * The current-section highlight is driven by IntersectionObserver rather than a
 * scroll handler, and the link that matches carries aria-current="location", so
 * the state is exposed rather than only painted. The progress bar is decorative
 * and hidden from assistive technology: the same information is already in the
 * highlighted link, and a percentage that changes on every scroll tick would be
 * noise in a screen reader.
 */
export function CaseToc({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string>(entries[0]?.id ?? "")
  const [progress, setProgress] = useState(0)
  const ticking = useRef(false)

  useEffect(() => {
    const sections = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target.id) setActiveId(visible[0].target.id)
      },
      // Bias the band toward the top of the viewport so the highlighted entry is
      // the section being read, not one just scrolled past.
      { rootMargin: "-88px 0px -55% 0px", threshold: 0 },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [entries])

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const doc = document.documentElement
        const max = doc.scrollHeight - doc.clientHeight
        setProgress(max > 0 ? Math.min(100, Math.max(0, (doc.scrollTop / max) * 100)) : 0)
        ticking.current = false
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      {/* Reading progress. Decorative: the same position is conveyed by the
          current-section link below. */}
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-40 h-0.5 bg-transparent"
      >
        <div
          className="h-full bg-teal-700 transition-[width] duration-150 ease-out motion-reduce:transition-none dark:bg-teal-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      <nav aria-labelledby="case-toc-heading" className="hidden lg:block">
        <div className="sticky top-24">
          <h2
            id="case-toc-heading"
            className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400"
          >
            On this page
          </h2>
          <ul className="mt-4 space-y-0 border-l border-slate-200 dark:border-slate-800">
            {entries.map((entry) => {
              const isActive = entry.id === activeId
              return (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
                      isActive
                        ? "border-teal-700 font-semibold text-slate-900 dark:border-teal-400 dark:text-white"
                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-white"
                    }`}
                  >
                    {entry.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </>
  )
}
