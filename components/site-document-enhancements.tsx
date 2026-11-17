"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { isCourseLearningPath } from "@/lib/courses/routes"

const SCRIPT_ID = "site-document-enhancements"

/** Entering a course starts a fresh document, isolating third-party site observers. */
export function courseEntryUrl(event: MouseEvent, currentUrl: string): string | null {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null
  const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null
  if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return null
  try {
    const current = new URL(currentUrl)
    const target = new URL(anchor.href, current)
    return target.origin === current.origin && !isCourseLearningPath(current.pathname) && isCourseLearningPath(target.pathname) ? target.href : null
  } catch { return null }
}

/** The document viewer has no teardown API; it must never share a document with a course. */
export function SiteDocumentEnhancements() {
  const pathname = usePathname()

  useEffect(() => {
    const enterCourse = (event: MouseEvent) => {
      const target = courseEntryUrl(event, window.location.href)
      if (!target) return
      event.preventDefault()
      event.stopImmediatePropagation()
      window.location.assign(target)
    }
    document.addEventListener("click", enterCourse, true)
    return () => document.removeEventListener("click", enterCourse, true)
  }, [])

  useEffect(() => {
    const existing = document.getElementById(SCRIPT_ID)
    if (isCourseLearningPath(pathname)) {
      // Also cover programmatic navigation into the workspace. Removing the old
      // script node cannot disconnect its MutationObserver or injected dialogs.
      if (existing) window.location.reload()
      return
    }
    if (!pathname || existing) return
    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.async = true
    script.src = "https://docaccessible.com/site/v1.js"
    script.dataset.siteKey = "site_pk_peMrEUBgXgeHh-6UXiSc2AQehswRWGUR"
    document.body.appendChild(script)
  }, [pathname])

  return null
}
