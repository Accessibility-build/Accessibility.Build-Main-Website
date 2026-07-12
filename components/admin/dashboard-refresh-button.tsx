"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardRefreshButton() {
  const router = useRouter()
  const [refreshing, startRefresh] = useTransition()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => startRefresh(() => router.refresh())}
      disabled={refreshing}
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
      {refreshing ? "Refreshing" : "Refresh data"}
    </Button>
  )
}
