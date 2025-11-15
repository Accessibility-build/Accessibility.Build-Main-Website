/**
 * Check if user has unlimited access stored in localStorage
 * Returns true if access is valid and not expired (24 hours)
 */
export function hasUnlimitedAccess(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const unlimitedAccess = localStorage.getItem('unlimited_access')
    const accessTimestamp = localStorage.getItem('unlimited_access_timestamp')
    
    if (unlimitedAccess !== 'true' || !accessTimestamp) {
      return false
    }

    // Check if access is still valid (24 hours)
    const timestamp = parseInt(accessTimestamp)
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000
    
    if (now - timestamp >= twentyFourHours) {
      // Access expired, remove from storage
      localStorage.removeItem('unlimited_access')
      localStorage.removeItem('unlimited_access_timestamp')
      return false
    }

    return true
  } catch (error) {
    console.error('Error checking unlimited access:', error)
    return false
  }
}

/**
 * Get remaining time for unlimited access in milliseconds
 */
export function getUnlimitedAccessRemainingTime(): number {
  if (typeof window === 'undefined') return 0

  try {
    const accessTimestamp = localStorage.getItem('unlimited_access_timestamp')
    
    if (!accessTimestamp) return 0

    const timestamp = parseInt(accessTimestamp)
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000
    const elapsed = now - timestamp
    
    return Math.max(0, twentyFourHours - elapsed)
  } catch (error) {
    console.error('Error getting remaining time:', error)
    return 0
  }
}

/**
 * Format remaining time as human readable string
 */
export function formatRemainingTime(timeMs: number): string {
  if (timeMs <= 0) return '0 minutes'

  const hours = Math.floor(timeMs / (60 * 60 * 1000))
  const minutes = Math.floor((timeMs % (60 * 60 * 1000)) / (60 * 1000))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
} 