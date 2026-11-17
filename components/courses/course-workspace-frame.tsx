"use client"

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react"
import { ChevronDown, PanelLeftClose, PanelLeftOpen, X } from "lucide-react"
import { SkipLink } from "@/components/skip-link"
import { cn } from "@/lib/utils"

interface WorkspaceFrameProps {
  homeRoute: string
  header: ReactNode
  sections: ReactNode
  outline: ReactNode
  mobileOutline: ReactNode
  children: ReactNode
}

const control = "inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-500 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 dark:border-slate-500 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"

/** Interactive frame only; the course outline and lesson content stay server-rendered. */
export function CourseWorkspaceFrame({ homeRoute, header, sections, outline, mobileOutline, children }: WorkspaceFrameProps) {
  const [desktopExpanded, setDesktopExpanded] = useState(true)
  const [mobileExpanded, setMobileExpanded] = useState(false)
  const desktopToggle = useRef<HTMLButtonElement>(null)
  const mobileToggle = useRef<HTMLButtonElement>(null)
  const preferenceKey = `course-outline:v1:${homeRoute}`

  useEffect(() => {
    // Start open on both server and client; restore the tab's preference after hydration.
    // Only explicit interactions write it, so the initial render cannot overwrite it.
    let expanded = true
    try {
      expanded = window.sessionStorage.getItem(preferenceKey) !== "collapsed"
    } catch {
      // Browser storage is optional; a new course starts with its outline open.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore browser-only state after the hydration-safe first render.
    setDesktopExpanded(expanded)
  }, [preferenceKey])

  function changeDesktopOutline(expanded: boolean) {
    setDesktopExpanded(expanded)
    try {
      window.sessionStorage.setItem(preferenceKey, expanded ? "expanded" : "collapsed")
    } catch {
      // The controls still work when browser storage is unavailable.
    }
  }

  function closeMobile() {
    setMobileExpanded(false)
    mobileToggle.current?.focus()
  }

  function closeWithEscape(event: KeyboardEvent<HTMLDivElement>, mobile: boolean) {
    if (event.key !== "Escape" || event.defaultPrevented) return
    event.preventDefault()
    event.stopPropagation()
    if (mobile) closeMobile()
    else {
      changeDesktopOutline(false)
      desktopToggle.current?.focus()
    }
  }

  function followMobileLesson(event: MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null
    if (!link) return
    setMobileExpanded(false)
    // A current-lesson link may not navigate. Move focus out before its disclosure closes;
    // Next's route focus handling still takes over when the destination changes.
    const content = document.getElementById("course-content")
    if (content) {
      if (!content.hasAttribute("tabindex")) {
        content.setAttribute("tabindex", "-1")
        content.addEventListener("blur", () => content.removeAttribute("tabindex"), { once: true })
      }
      content.focus({ preventScroll: true })
    }
  }

  return (
    <div className="relative min-h-dvh w-full bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100" data-course-workspace>
      <SkipLink targetId="course-content">Skip to course content</SkipLink>
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        {header}
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 border-t border-slate-100 px-3 py-2 dark:border-slate-800 sm:px-4">
          <button
            ref={desktopToggle}
            type="button"
            aria-expanded={desktopExpanded}
            aria-controls="desktop-course-outline"
            onClick={() => changeDesktopOutline(!desktopExpanded)}
            className={cn(control, "hidden lg:inline-flex")}
          >
            {desktopExpanded ? <PanelLeftClose aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-5 w-5" /> : <PanelLeftOpen aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-5 w-5" />}
            {desktopExpanded ? "Hide outline" : "Show outline"}
          </button>
          <button
            ref={mobileToggle}
            type="button"
            aria-expanded={mobileExpanded}
            aria-controls="mobile-course-outline"
            onClick={() => setMobileExpanded((expanded) => !expanded)}
            className={cn(control, "lg:hidden")}
          >
            {mobileExpanded ? <PanelLeftClose aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-5 w-5" /> : <PanelLeftOpen aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-5 w-5" />}
            Course outline
            <ChevronDown aria-hidden="true" focusable="false" strokeWidth={1.75} className={cn("h-4 w-4", mobileExpanded && "rotate-180")} />
          </button>
          {sections}
        </div>
      </header>

      <div
        id="mobile-course-outline"
        hidden={!mobileExpanded}
        onKeyDown={(event) => closeWithEscape(event, true)}
        onClick={followMobileLesson}
        className={cn("border-b border-slate-200 bg-slate-50 px-3 pb-4 dark:border-slate-800 dark:bg-slate-900/40 lg:hidden", !mobileExpanded && "hidden")}
      >
        <div className="flex justify-end pt-2">
          <button type="button" onClick={closeMobile} className={control}>
            <X aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4" />Close outline
          </button>
        </div>
        {mobileOutline}
      </div>

      <div className={cn("min-w-0", desktopExpanded && "lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]")}>
        <div
          id="desktop-course-outline"
          hidden={!desktopExpanded}
          onKeyDown={(event) => closeWithEscape(event, false)}
          className={cn("min-w-0 border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40", desktopExpanded ? "hidden lg:block" : "hidden")}
        >
          <div className="sticky top-4 max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain px-3 py-5">
            {outline}
          </div>
        </div>
        <div id="course-content" className="min-w-0 px-4 py-6 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  )
}
