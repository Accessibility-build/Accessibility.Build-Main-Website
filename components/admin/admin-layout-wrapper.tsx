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
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading...</div>}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
