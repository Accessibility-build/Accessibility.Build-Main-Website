"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { logErrorToService } from "@/lib/error-logger"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to our reporting service
    console.error("Application error:", error)
    logErrorToService(error)
  }, [error])

  return (
    <div className="container-wide flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center py-20">
      <div className="space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Something went wrong</h1>
          <p className="text-muted-foreground">
            We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Return home</Link>
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 text-left p-4 bg-muted rounded-md overflow-auto max-h-[300px]">
            <p className="font-mono text-sm text-muted-foreground mb-2">Error details (only visible in development):</p>
            <pre className="font-mono text-xs whitespace-pre-wrap break-words">{error.message}</pre>
            {error.stack && (
              <pre className="font-mono text-xs whitespace-pre-wrap break-words mt-2 text-muted-foreground">
                {error.stack}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
