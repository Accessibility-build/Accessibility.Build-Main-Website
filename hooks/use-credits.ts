"use client"

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'

interface CreditStats {
  currentCredits: number
  totalCreditsEarned: number
  totalCreditsUsed: number
}

export function useCredits() {
  const { isSignedIn } = useUser()
  const [credits, setCredits] = useState<CreditStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCredits = useCallback(async () => {
    if (!isSignedIn) {
      setCredits(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/credits')
      
      if (!response.ok) {
        throw new Error('Failed to fetch credits')
      }

      const data = await response.json()
      setCredits(data)
    } catch (err) {
      console.error('Error fetching credits:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch credits')
    } finally {
      setIsLoading(false)
    }
  }, [isSignedIn])

  // Fetch credits when user signs in
  useEffect(() => {
    fetchCredits()
  }, [fetchCredits])

  // Refresh credits function that can be called after credit usage
  const refreshCredits = useCallback(() => {
    fetchCredits()
  }, [fetchCredits])

  return {
    credits,
    isLoading,
    error,
    refreshCredits
  }
} 