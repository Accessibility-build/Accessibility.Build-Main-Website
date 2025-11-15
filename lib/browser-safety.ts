/**
 * Browser Safety Utilities
 * Handles browser extension errors and prevents them from affecting the application
 */

// Defensive check for browser extension errors
export const initializeBrowserSafety = () => {
  if (typeof window === 'undefined') return

  // Prevent Arc browser extension errors from breaking the app
  window.addEventListener('error', (event) => {
    // Check if error is from browser extension
    if (event.filename && (
      event.filename.includes('extension://') ||
      event.filename.includes('moz-extension://') ||
      event.filename.includes('safari-extension://') ||
      event.message?.includes('sendElementToArc') ||
      event.message?.includes('reading \'search\'')
    )) {
      // Suppress browser extension errors
      event.preventDefault()
      event.stopPropagation()
      
      // Log to console for debugging but don't crash the app
      console.warn('Browser extension error suppressed:', event.message)
      return false
    }
  })

  // Handle unhandled promise rejections from extensions
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('sendElementToArc') ||
        event.reason?.toString?.()?.includes('extension')) {
      event.preventDefault()
      console.warn('Browser extension promise rejection suppressed:', event.reason)
      return false
    }
  })
}

// Safe property access to prevent extension errors
export const safePropertyAccess = (obj: any, path: string, defaultValue: any = undefined) => {
  try {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue
    }, obj)
  } catch {
    return defaultValue
  }
}

// Safe function execution wrapper
export const safeExecute = (fn: () => any, defaultReturn: any = null, suppressErrors = true) => {
  try {
    return fn()
  } catch (error) {
    if (suppressErrors) {
      console.warn('Safe execution caught error:', error)
      return defaultReturn
    }
    throw error
  }
} 