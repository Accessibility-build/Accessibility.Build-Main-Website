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
  
  // Check if we're on a blog post page (but not the blog listing page)
  const isBlogPostPage = pathname?.startsWith('/blog/') && pathname !== '/blog'

  // For admin routes, render children directly (AdminLayout will handle its own layout)
  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading...</div>}>
        {children}
      </Suspense>
    )
  }

  // Blog post pages keep their own minimal reading header (no global nav) for a
  // distraction-free read, but still get the full site footer so readers can
  // navigate onward and the footer's internal links are preserved.
  if (isBlogPostPage) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <main id="main-content" className="flex-1">
          <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading...</div>}>
            {children}
          </Suspense>
        </main>
        <Footer />
      </div>
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