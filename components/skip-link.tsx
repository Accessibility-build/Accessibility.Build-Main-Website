"use client"

import type { ReactNode } from "react"

interface SkipLinkProps {
  targetId?: string
  className?: string
  children?: ReactNode
}

// The target gets tabindex="-1" only for the jump, and loses it again on blur. A permanent
// tabindex="-1" on <main> made every click on plain text focus <main>, so the next Tab restarted
// at the top of the page instead of carrying on from where the user clicked. Before hydration the
// plain fragment link still works: browsers move the Tab starting point to the target.
export function SkipLink({
  targetId = "main-content",
  className = "skip-link",
  children = "Skip to main content",
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={className}
      onClick={() => {
        const target = document.getElementById(targetId)
        if (!target) return
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1")
          target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true })
        }
        target.focus()
      }}
    >
      {children}
    </a>
  )
}
