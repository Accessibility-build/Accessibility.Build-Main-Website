'use client'

import { useEffect } from 'react'
import { initializeBrowserSafety } from '@/lib/browser-safety'

export function BrowserSafetyProvider() {
  useEffect(() => {
    // Initialize browser safety measures to prevent extension errors
    initializeBrowserSafety()
  }, [])

  return null // This component doesn't render anything
} 