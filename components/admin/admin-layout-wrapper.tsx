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

  // Everything else (including blog posts) uses the full site header and footer
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {/*
          The fallback reserves a full viewport rather than a short 400px box:
          real page content is much taller, so a small placeholder pushed the
          footer down when it resolved and produced a large layout shift (CLS).
        */}
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen" role="status">Loading...</div>}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
