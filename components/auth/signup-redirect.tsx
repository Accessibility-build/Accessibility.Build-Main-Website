"use client"

import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export function SignUpRedirect() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && user) {
      // Check if this is a new user (recently created account)
      const userCreatedAt = user.createdAt ? new Date(user.createdAt) : null
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      
      // If user was created in the last 5 minutes, redirect to welcome page
      if (userCreatedAt && userCreatedAt > fiveMinutesAgo) {
        router.push('/welcome')
      }
    }
  }, [isLoaded, user, router])

  return null
} 