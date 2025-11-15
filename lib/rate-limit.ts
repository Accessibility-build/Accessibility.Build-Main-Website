import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limiting store (no Redis needed)
interface RateLimitEntry {
  count: number
  resetTime: number
}

class MemoryRateLimitStore {
  private store = new Map<string, RateLimitEntry>()
  private readonly windowMs: number

  constructor(windowMs: number = 60 * 60 * 1000) { // Default 1 hour
    this.windowMs = windowMs
    
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  async increment(key: string): Promise<{ totalHits: number; timeToExpire?: number }> {
    const now = Date.now()
    const resetTime = now + this.windowMs
    
    const entry = this.store.get(key)
    
    if (!entry || entry.resetTime <= now) {
      // Create new entry or reset expired one
      this.store.set(key, { count: 1, resetTime })
      return { totalHits: 1, timeToExpire: Math.floor(this.windowMs / 1000) }
    }
    
    // Increment existing entry
    entry.count++
    this.store.set(key, entry)
    
    const timeToExpire = Math.floor((entry.resetTime - now) / 1000)
    return { totalHits: entry.count, timeToExpire }
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime <= now) {
        this.store.delete(key)
      }
    }
  }

  getStats(): { totalKeys: number; memoryUsage: string } {
    return {
      totalKeys: this.store.size,
      memoryUsage: `~${Math.round(this.store.size * 50 / 1024)}KB` // Rough estimate
    }
  }
}

// Global rate limit stores
const generalStore = new MemoryRateLimitStore(60 * 60 * 1000) // 1 hour
const auditStore = new MemoryRateLimitStore(60 * 60 * 1000) // 1 hour
const creditStore = new MemoryRateLimitStore(60 * 60 * 1000) // 1 hour

// Create rate limiter function
export const createRateLimit = (options: {
  max: number
  windowMs: number
  message?: string
  keyGenerator?: (req: NextRequest) => string
  store?: MemoryRateLimitStore
}) => {
  const store = options.store || new MemoryRateLimitStore(options.windowMs)
  
  return async (req: NextRequest): Promise<NextResponse | null> => {
    const key = options.keyGenerator 
      ? options.keyGenerator(req)
      : getClientIdentifier(req)
    
    try {
      const { totalHits, timeToExpire } = await store.increment(key)
      
      // Add rate limit headers
      const headers = new Headers()
      headers.set('X-RateLimit-Limit', options.max.toString())
      headers.set('X-RateLimit-Remaining', Math.max(0, options.max - totalHits).toString())
      headers.set('X-RateLimit-Reset', timeToExpire ? (Date.now() + timeToExpire * 1000).toString() : '')
      
      if (totalHits > options.max) {
        return new NextResponse(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: options.message || `Too many requests. Limit: ${options.max} per hour.`,
            retryAfter: timeToExpire
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': timeToExpire?.toString() || '3600',
              ...Object.fromEntries(headers.entries())
            }
          }
        )
      }
      
      return null // Allow request to proceed
    } catch (error) {
      console.error('Rate limiting error:', error)
      return null // Allow request on error (fail open)
    }
  }
}

// Specific rate limiters for different endpoints
export const generalApiRateLimit = createRateLimit({
  max: 100, // 100 requests per hour
  windowMs: 60 * 60 * 1000,
  message: 'Too many API requests. Please try again later.',
  store: generalStore
})

export const auditRateLimit = createRateLimit({
  max: 10, // 10 audits per hour per user
  windowMs: 60 * 60 * 1000,
  message: 'Too many audit requests. Limit: 10 audits per hour.',
  store: auditStore,
  keyGenerator: (req) => {
    const userId = getUserId(req)
    return userId ? `audit:${userId}` : getClientIdentifier(req)
  }
})

export const creditSystemRateLimit = createRateLimit({
  max: 50, // 50 credit operations per hour
  windowMs: 60 * 60 * 1000,
  message: 'Too many credit system requests.',
  store: creditStore,
  keyGenerator: (req) => {
    const userId = getUserId(req)
    return userId ? `credits:${userId}` : getClientIdentifier(req)
  }
})

export const aiAnalysisRateLimit = createRateLimit({
  max: 25, // 25 AI analysis requests per hour
  windowMs: 60 * 60 * 1000,
  message: 'Too many AI analysis requests.',
  store: generalStore
})

// Helper functions
function getClientIdentifier(req: NextRequest): string {
  // Try to get user ID first, then fall back to IP
  const userId = getUserId(req)
  if (userId) return `user:${userId}`
  
  // Get IP address with proxy support
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
             req.headers.get('x-real-ip') || 
             'unknown'
  
  return `ip:${ip}`
}

function getUserId(req: NextRequest): string | null {
  // Extract user ID from Clerk session or authorization header
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    // In a real implementation, you'd decode the JWT token
    // For now, return null to fall back to IP-based limiting
    return null
  }
  
  // You could also check for Clerk session cookies here
  return null
}

// Slow down middleware for additional protection
export const createSlowDown = (options: {
  delayAfter: number
  delayMs: number
  maxDelayMs: number
}) => {
  const store = new MemoryRateLimitStore(60 * 60 * 1000) // 1 hour window
  
  return async (req: NextRequest): Promise<number> => {
    const key = getClientIdentifier(req)
    
    try {
      const { totalHits } = await store.increment(key)
      
      if (totalHits <= options.delayAfter) {
        return 0 // No delay
      }
      
      const delayIncrement = (totalHits - options.delayAfter) * options.delayMs
      return Math.min(delayIncrement, options.maxDelayMs)
      
    } catch (error) {
      console.error('Slow down middleware error:', error)
      return 0 // No delay on error
    }
  }
}

// Audit-specific slow down
export const auditSlowDown = createSlowDown({
  delayAfter: 5, // Start slowing down after 5 requests
  delayMs: 1000, // Add 1 second delay per request
  maxDelayMs: 10000, // Maximum 10 second delay
})

// Get rate limiting statistics
export function getRateLimitStats() {
  return {
    general: generalStore.getStats(),
    audit: auditStore.getStats(),
    credit: creditStore.getStats(),
    totalMemoryUsage: `~${Math.round((generalStore.getStats().totalKeys + auditStore.getStats().totalKeys + creditStore.getStats().totalKeys) * 50 / 1024)}KB`
  }
} 