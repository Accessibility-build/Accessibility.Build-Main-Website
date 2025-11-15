"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  Shield,
  Menu,
  X,
  FileText,
  CreditCard,
  Activity,
  LogOut
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const adminNavItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users
  },
  {
    name: 'Tool Analytics',
    href: '/admin/tools',
    icon: BarChart3
  },
  {
    name: 'Credits',
    href: '/admin/credits',
    icon: CreditCard
  },
  {
    name: 'Audit Log',
    href: '/admin/audit-log',
    icon: Activity
  },
  {
    name: 'Error Report',
    href: '/admin/error-report',
    icon: FileText
  },
  {
    name: 'SEO Dashboard',
    href: '/admin/seo-dashboard',
    icon: Settings
  }
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">Admin Panel</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-200 dark:border-slate-700 p-4">
          <Link 
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Back to Site
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                Admin Mode
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 