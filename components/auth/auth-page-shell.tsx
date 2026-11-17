import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Download, ScanSearch } from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-4 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-slate-950"

interface AuthPageShellProps {
  mode: "sign-in" | "sign-up"
  children: ReactNode
}

/** Clerk owns the form and its changing verification/recovery headings. */
export function AuthPageShell({ mode, children }: AuthPageShellProps) {
  const isSignUp = mode === "sign-up"

  return (
    <div data-auth-page={mode} className="flex min-h-dvh w-full min-w-0 flex-col bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-5 sm:px-8 sm:py-7">
        <Link href="/" aria-label="Accessibility.build home" className={cn("inline-flex min-h-11 items-center gap-2.5 rounded-lg text-base font-semibold tracking-tight", focus)}>
          <Logo className="h-8 w-8" />
          <span>Accessibility<span className="text-slate-500 dark:text-slate-400">.build</span></span>
        </Link>
        <Link href="/" className={cn("inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white", focus)}>
          <ArrowLeft aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" />
          Back to website
        </Link>
      </header>

      <div className="flex flex-1 items-center px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto grid w-full max-w-5xl min-w-0 items-center gap-16 lg:grid-cols-[minmax(0,26rem)_minmax(0,20rem)] lg:justify-center lg:gap-20">
          <section aria-label={isSignUp ? "Create an account" : "Sign in"} className="mx-auto w-full min-w-0 max-w-md lg:mx-0">
            <p className="mb-4 text-sm font-semibold text-blue-700 dark:text-blue-300">{isSignUp ? "Create your account" : "Welcome back"}</p>
            {children}
            <p className="mt-6 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-400">
              {isSignUp ? "Welcome credits are included. No payment details required." : "Bought a course or template? Sign in with the email you used at checkout."}
            </p>
          </section>

          <aside className="hidden border-l border-slate-200 py-2 pl-10 dark:border-slate-800 lg:block" aria-labelledby="auth-workspace-heading">
            <h2 id="auth-workspace-heading" className="text-2xl font-semibold leading-tight tracking-tight">Your accessibility workspace</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Keep your tools, learning, and purchases together.</p>
            <ul className="mt-8 space-y-6">
              {[
                { icon: ScanSearch, title: "Check and improve", description: "Use accessibility tools and review your recent activity." },
                { icon: BookOpen, title: "Keep learning", description: "Return to your purchased courses and saved progress." },
                { icon: Download, title: "Find your resources", description: "Access purchased templates and manage your credits." },
              ].map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-3">
                  <Icon aria-hidden="true" focusable="false" strokeWidth={1.75} className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-5 py-5 text-sm text-slate-600 dark:text-slate-400 sm:px-8">
        <p>Accessibility.build</p>
        <nav aria-label="Account support">
          <ul className="flex flex-wrap gap-x-5">
            {[{ href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }, { href: "/contact", label: "Get help" }].map((link) => (
              <li key={link.href}><Link href={link.href} className={cn("inline-flex min-h-11 items-center rounded hover:text-slate-950 hover:underline hover:underline-offset-4 dark:hover:text-white", focus)}>{link.label}</Link></li>
            ))}
          </ul>
        </nav>
      </footer>
    </div>
  )
}
