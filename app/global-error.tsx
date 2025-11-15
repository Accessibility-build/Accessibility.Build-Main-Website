"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            We apologize for the inconvenience. The application has encountered a critical error.
          </p>
          <Button onClick={() => reset()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      </body>
    </html>
  )
}
