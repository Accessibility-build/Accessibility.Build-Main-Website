'use client'

import { useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import posthog from 'posthog-js'

export function PostHogUserSync() {
  const { isSignedIn, user, isLoaded } = useUser()
  const prevSignedIn = useRef<boolean | undefined>(undefined)

  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn && user) {
      posthog.identify(user.id, {
        createdAt: user.createdAt?.toISOString(),
      })
    } else if (prevSignedIn.current === true && !isSignedIn) {
      posthog.reset()
    }

    prevSignedIn.current = isSignedIn ?? false
  }, [isSignedIn, user, isLoaded])

  return null
}
