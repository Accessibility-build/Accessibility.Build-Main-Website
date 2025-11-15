"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'

export function DashboardRefreshButton() {
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    router.refresh()
    // Reset refreshing state after a short delay
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
      <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
      Refresh Data
    </Button>
  )
}

