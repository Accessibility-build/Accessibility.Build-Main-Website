'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

/** Floating button that appears after scrolling and returns to the top. */
export function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-50 rounded-full bg-slate-900 p-3 text-white shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
