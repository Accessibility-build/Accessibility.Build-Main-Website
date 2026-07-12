"use client"

import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import {
  Activity,
  ArrowUpRight,
  ChevronRight,
  CircleDollarSign,
  Coins,
  Gauge,
  History,
  House,
  MailPlus,
  Menu,
  SearchCheck,
  ShieldCheck,
  TriangleAlert,
  UsersRound,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

type AdminLayoutProps = {
  children: ReactNode
}

type AdminNavItem = {
  name: string
  description: string
  href: string
  icon: LucideIcon
}

type AdminNavGroup = {
  label: string
  items: AdminNavItem[]
}

const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", description: "Health and activity", href: "/admin", icon: Gauge },
    ],
  },
  {
    label: "People and revenue",
    items: [
      { name: "Users", description: "Accounts and access", href: "/admin/users", icon: UsersRound },
      { name: "Credits", description: "Balances and grants", href: "/admin/credits", icon: Coins },
      { name: "Billing", description: "Orders and payments", href: "/admin/billing", icon: CircleDollarSign },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Tool analytics", description: "Usage and reliability", href: "/admin/tools", icon: Wrench },
      { name: "Marketing", description: "Audience and campaigns", href: "/admin/marketing", icon: MailPlus },
      { name: "SEO review", description: "Content and crawl checks", href: "/admin/seo-dashboard", icon: SearchCheck },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { name: "Audit log", description: "Administrative actions", href: "/admin/audit-log", icon: History },
      { name: "Diagnostics", description: "Runtime error snapshot", href: "/admin/error-report", icon: TriangleAlert },
    ],
  },
]

const allAdminNavItems = adminNavGroups.flatMap((group) => group.items)

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`))
}

function AdminNavigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-6" aria-label="Admin navigation">
      {adminNavGroups.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-500">{group.label}</p>
          <ul className="mt-2 space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon
              const active = isActiveRoute(pathname, item.href)

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex min-h-12 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-300 dark:focus-visible:ring-offset-slate-950",
                      active
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
                    )}
                    onClick={onNavigate}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{item.name}</span>
                      <span className={cn("block truncate text-xs", active ? "text-slate-300 dark:text-slate-600" : "text-slate-500")}>{item.description}</span>
                    </span>
                    <ChevronRight className={cn("h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100", active && "opacity-100")} aria-hidden="true" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function AdminSidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress

  return (
    <div className="flex h-full min-h-0 flex-col bg-white dark:bg-slate-950">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950">
          <Logo className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-950 dark:text-white">Accessibility.build</p>
          <p className="text-xs text-slate-500">Administration</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        <AdminNavigation pathname={pathname} onNavigate={onNavigate} />
      </div>

      <div className="shrink-0 border-t border-slate-200 p-3 dark:border-slate-800">
        {email ? (
          <p className="mb-2 truncate px-3 text-xs text-slate-500" title={email}>Signed in as {email}</p>
        ) : null}
        <Link
          href="/"
          className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
          onClick={onNavigate}
        >
          <House className="h-4 w-4" aria-hidden="true" />
          Return to website
          <ArrowUpRight className="ml-auto h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const currentItem = allAdminNavItems.find((item) => isActiveRoute(pathname, item.href)) ?? allAdminNavItems[0]

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-950 dark:bg-slate-950 dark:text-white">
      <a href="#admin-main-content" className="sr-only z-[70] rounded-md bg-white px-4 py-3 font-semibold text-slate-950 shadow focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to admin content
      </a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 md:block dark:border-slate-800" aria-label="Admin sidebar">
        <AdminSidebarContent pathname={pathname} />
      </aside>

      <div className="min-w-0 md:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 md:hidden" aria-label="Open admin navigation">
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[min(20rem,88vw)] p-0 sm:max-w-xs">
                <SheetHeader className="sr-only">
                  <SheetTitle>Admin navigation</SheetTitle>
                </SheetHeader>
                <AdminSidebarContent pathname={pathname} onNavigate={() => setMobileNavOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-slate-500">Admin / {currentItem.name}</p>
              <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{currentItem.description}</p>
            </div>

            <div className="hidden items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 sm:flex dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Restricted
            </div>
            <Button asChild variant="ghost" size="icon" className="h-10 w-10" title="Open service status">
              <Link href="/status" aria-label="Open service status">
                <Activity className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <main id="admin-main-content" tabIndex={-1} className="min-w-0 p-4 outline-none sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
