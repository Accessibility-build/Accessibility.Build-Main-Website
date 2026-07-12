"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { ArrowRight, Sparkles, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface TrialStatus {
  tool: string
  allowed: boolean
  remaining: number
  message: string
  resetTime: string
}

const DAILY_LIMIT = 5

export default function TrialStatusBanner() {
  const { isSignedIn } = useUser()
  const [trialStatus, setTrialStatus] = useState<TrialStatus[]>([])

  useEffect(() => {
    if (isSignedIn) return

    const controller = new AbortController()
    fetch("/api/trial-status", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setTrialStatus(data)
      })
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Failed to fetch trial status:", error)
        }
      })

    return () => controller.abort()
  }, [isSignedIn])

  if (isSignedIn || trialStatus.length === 0) return null

  const remaining = Math.min(...trialStatus.map((status) => status.remaining))
  const used = Math.max(0, DAILY_LIMIT - remaining)

  return (
    <section
      aria-labelledby="guest-access-heading"
      className="rounded-lg border border-teal-200 bg-teal-50 p-5 dark:border-teal-900 dark:bg-teal-950/30"
    >
      <div className="grid max-w-3xl gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-teal-700 dark:bg-slate-900 dark:text-teal-300">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id="guest-access-heading" className="font-semibold text-slate-950 dark:text-white">
              Guest trial access
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {remaining > 0
                ? `${remaining} of ${DAILY_LIMIT} shared AI tool uses remain today.`
                : "Today's guest allowance has been used."}
            </p>
            <Progress
              value={(used / DAILY_LIMIT) * 100}
              aria-label={`${used} of ${DAILY_LIMIT} guest uses consumed`}
              className="mt-3 h-1.5 max-w-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button asChild size="sm" className="bg-teal-700 text-white hover:bg-teal-800">
            <Link href="/sign-up">
              <UserPlus aria-hidden="true" />
              Create account
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/sign-in">
              Sign in
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
