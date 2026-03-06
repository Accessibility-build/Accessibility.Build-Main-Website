"use client"

import { useState, useEffect, useCallback } from "react"
import { List } from "lucide-react"
import { cn } from "@/lib/utils"

interface TocSection {
  id: string
  title: string
  level?: number
}

interface GuideTocProps {
  sections: TocSection[]
  className?: string
}

export function GuideToc({ sections, className }: GuideTocProps) {
  const [activeId, setActiveId] = useState<string>("")

  // Track which section is in the viewport using Intersection Observer
  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Find the topmost section that is currently intersecting
      const intersecting = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

      if (intersecting.length > 0) {
        setActiveId(intersecting[0].target.id)
      }
    }

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "-80px 0px -60% 0px",
      threshold: [0, 0.5, 1],
    })

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [sections])

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 96 // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }, [])

  if (sections.length === 0) return null

  return (
    <nav
      className={cn(
        "hidden lg:block sticky top-24",
        className
      )}
      aria-label="Table of contents"
    >
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              On this page
            </h4>
          </div>
        </div>

        {/* Section links */}
        <div className="p-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          <ul className="space-y-0.5" role="list">
            {sections.map((section) => {
              const isActive = activeId === section.id
              const isIndented = section.level === 2

              return (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "relative w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200",
                      isIndented && "pl-6",
                      isActive
                        ? "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 font-medium"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 dark:bg-blue-400 rounded-r-full"
                        aria-hidden="true"
                      />
                    )}
                    <span className="leading-snug">{section.title}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </nav>
  )
}
