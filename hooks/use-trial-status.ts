import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export interface TrialStatus {
  tool: string
  canUse: boolean
  usageCount: number
  remainingUses: number
  limitReached: boolean
}

export interface AllTrialStatus {
  [key: string]: TrialStatus
}

export function useTrialStatus() {
  const { isSignedIn } = useUser()
  const [trialStatus, setTrialStatus] = useState<AllTrialStatus>({})
  const [isLoading, setIsLoading] = useState(false)

  const fetchTrialStatus = async () => {
    if (isSignedIn) {
      setTrialStatus({})
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/trial-status')
      if (response.ok) {
        const data = await response.json()
        const statusMap: AllTrialStatus = {}
        data.forEach((status: TrialStatus) => {
          statusMap[status.tool] = status
        })
        setTrialStatus(statusMap)
      }
    } catch (error) {
      console.error('Failed to fetch trial status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrialStatus()
  }, [isSignedIn])

  const getTrialStatus = (tool: string): TrialStatus | null => {
    return trialStatus[tool] || null
  }

  const updateTrialStatus = (tool: string, newStatus: TrialStatus) => {
    setTrialStatus(prev => ({
      ...prev,
      [tool]: newStatus
    }))
  }

  return {
    trialStatus,
    isLoading,
    fetchTrialStatus,
    getTrialStatus,
    updateTrialStatus
  }
} 