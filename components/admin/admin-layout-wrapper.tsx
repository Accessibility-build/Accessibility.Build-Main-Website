"use client"

import { usePathname } from 'next/navigation'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Suspense } from "react"

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const pathname = usePathname()

  // Check if we're on an admin route
  const isAdminRoute = pathname?.startsWith('/admin')

  // For admin routes, render children directly (AdminLayout will handle its own layout)
  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300" role="status">Loading administration...</div>}>
        {children}
      </Suspense>
    )
  }

  // Everything else (including blog posts) uses the full site header and footer.
  //
  // There is deliberately NO Suspense boundary around {children} here. With one,
  // React streamed every page's content out of order: the served HTML had
  // <main> holding only the "Loading..." fallback, and the real page sat in a
  // <div hidden id="S:0"> after the footer, swapped in by an inline script.
  // Readability-style extractors (used by many crawlers and reader modes) skip
  // nodes with the hidden attribute, so they saw a page consisting of the word
  // "Loading...", and the main landmark announced the same to assistive
  // technology until hydration. Components that call useSearchParams() carry
  // their own local Suspense boundary instead (see pricing-auto-checkout,
  // billing-status-banner, and the ROI calculator client).
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
    </div>
  )
}
