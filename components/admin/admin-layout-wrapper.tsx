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
      <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading...</div>}>
        {children}
      </Suspense>
    )
  }

  // For non-admin routes, render with the main site header and footer
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading...</div>}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  )
} 