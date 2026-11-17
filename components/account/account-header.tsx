"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { ArrowUpRight, LayoutDashboard } from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-slate-950"

/** Small account navigation; the dashboard's server page owns access and data. */
export function AccountHeader() {
  return (
    <header data-account-header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Accessibility.build home" className={cn("inline-flex min-h-[44px] items-center gap-2.5 rounded-lg text-sm font-bold tracking-tight text-slate-950 dark:text-white sm:text-base", focus)}>
          <Logo className="h-7 w-7" />Accessibility.build
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <nav aria-label="Account navigation">
            <ul className="flex items-center gap-1 sm:gap-2" role="list">
              <li><Link href="/dashboard" aria-current="page" className={cn("inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-slate-100 px-2 text-sm font-semibold text-slate-950 dark:bg-slate-900 dark:text-white sm:px-3", focus)}><LayoutDashboard aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" />Dashboard</Link></li>
              <li><Link href="/tools" className={cn("inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white sm:px-3", focus)}>All tools<ArrowUpRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="hidden h-4 w-4 shrink-0 sm:block" /></Link></li>
            </ul>
          </nav>
          <div className="flex min-h-[44px] min-w-[44px] items-center justify-center border-l border-slate-200 pl-3 dark:border-slate-800 sm:pl-5">
            <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonTrigger: "min-h-[44px] min-w-[44px] justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-slate-950", avatarBox: "h-8 w-8" } }} />
          </div>
        </div>
      </div>
    </header>
  )
}
