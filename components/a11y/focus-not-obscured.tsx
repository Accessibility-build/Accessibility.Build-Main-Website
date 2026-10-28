"use client"

import { useEffect } from "react"

const GAP = 8
// Bars that start within this distance of the current clear line stack with it
// (the header, then the tools bar or a research page's section nav beneath it).
const STACK_TOLERANCE = 24

type Bar = { rect: DOMRect; el: Element }

/**
 * Sticky or fixed elements shaped like a horizontal bar: at least half the
 * viewport wide and no more than a third of it tall. Full-screen overlays
 * (menus, dialogs) fall outside the shape and are left alone.
 */
function findBars(): Bar[] {
  const bars: Bar[] = []
  const consider = (el: Element) => {
    const position = getComputedStyle(el).position
    if (position !== "sticky" && position !== "fixed") return
    const rect = el.getBoundingClientRect()
    if (rect.width < window.innerWidth / 2 || !rect.height || rect.height > window.innerHeight / 3) return
    bars.push({ rect, el })
  }
  document.querySelectorAll('header, nav, [class*="sticky"], [class*="fixed"]').forEach(consider)
  // Floating controls such as the "Ask Curb" button are not bar-shaped, but they
  // cover whatever scrolls under the bottom-right corner. The open assistant
  // panel is too tall to scroll clear of; Escape closes it from anywhere instead.
  document.querySelectorAll("[data-floating-control]").forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.width && rect.height && rect.height <= window.innerHeight / 3) bars.push({ rect, el })
  })
  return bars
}

/**
 * WCAG 2.4.11 Focus Not Obscured. The sticky header, the tools bar, research
 * section navs, the consent banner and the "Ask Curb" button all sit on top of
 * the page, and the browser happily scrolls a newly focused element in behind
 * them (tabbing backwards put links entirely under the header). After each
 * keyboard focus this nudges the page just far enough to clear them.
 *
 * CSS scroll-padding would cover the top bars, but it also shifts every in-page
 * anchor jump, and the site's scroll-mt-* offsets are tuned without it.
 */
export function FocusNotObscured() {
  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement) || !target.matches(":focus-visible")) return

      // Let the browser finish its own scroll-into-view first.
      requestAnimationFrame(() => {
        // Scrolling can bring a bar back: from the footer, clearing the header
        // scrolls up into <main>, where the tools bar sticks again on top of the
        // element. Sticky positions update synchronously, so measure again.
        for (let pass = 0; pass < 3; pass++) {
          const rect = target.getBoundingClientRect()
          const bars = findBars().filter(
            ({ rect: bar, el }) => !el.contains(target) && bar.left < rect.right && bar.right > rect.left,
          )

          let topInset = 0
          for (const { rect: bar } of [...bars].sort((a, b) => a.rect.top - b.rect.top)) {
            if (bar.top < window.innerHeight / 2 && bar.top <= topInset + STACK_TOLERANCE) {
              topInset = Math.max(topInset, bar.bottom)
            }
          }
          let bottomInset = window.innerHeight
          for (const { rect: bar } of [...bars].sort((a, b) => b.rect.bottom - a.rect.bottom)) {
            if (bar.bottom > window.innerHeight / 2 && bar.bottom >= bottomInset - STACK_TOLERANCE) {
              bottomInset = Math.min(bottomInset, bar.top)
            }
          }

          let delta = 0
          if (rect.top < topInset + GAP) delta = rect.top - topInset - GAP
          else if (rect.bottom > bottomInset - GAP) {
            if (rect.height < bottomInset - topInset - 2 * GAP) {
              // Fits in the clear area: lift its bottom above the bottom bars.
              delta = rect.bottom - bottomInset + GAP
            } else if (rect.top > bottomInset - 3 * GAP) {
              // Taller than the clear area (a scrollable table region) and its
              // top is hidden: bring the top into view.
              delta = rect.top - topInset - GAP
            }
          }
          if (Math.abs(delta) < 1) break
          window.scrollBy({ top: delta, behavior: "instant" })
        }
      })
    }

    document.addEventListener("focusin", onFocusIn)
    return () => document.removeEventListener("focusin", onFocusIn)
  }, [])

  return null
}
