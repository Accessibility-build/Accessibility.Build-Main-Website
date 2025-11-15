// Performance Monitoring & Core Web Vitals
// Real User Monitoring (RUM) for Accessibility.build

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  url: string
}

interface CoreWebVitals {
  lcp?: PerformanceMetric // Largest Contentful Paint
  fid?: PerformanceMetric // First Input Delay
  cls?: PerformanceMetric // Cumulative Layout Shift
  fcp?: PerformanceMetric // First Contentful Paint
  ttfb?: PerformanceMetric // Time to First Byte
}

// Core Web Vitals thresholds (in milliseconds)
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 }
}

/**
 * Determine performance rating based on value and thresholds
 */
function getPerformanceRating(
  metric: keyof typeof THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

/**
 * Report performance metrics to analytics
 */
function reportMetric(metric: PerformanceMetric): void {
  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`${metric.name}: ${metric.value}ms (${metric.rating})`)
  }

  // Store in localStorage for debugging
  try {
    const existingMetrics = JSON.parse(localStorage.getItem('performance-metrics') || '[]')
    existingMetrics.push(metric)
    
    // Keep only last 10 metrics
    if (existingMetrics.length > 10) {
      existingMetrics.splice(0, existingMetrics.length - 10)
    }
    
    localStorage.setItem('performance-metrics', JSON.stringify(existingMetrics))
  } catch (e) {
    // Ignore localStorage errors
  }
}

/**
 * Initialize Core Web Vitals monitoring
 */
export function initializeCoreWebVitals(): void {
  if (typeof window === 'undefined') return

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      
      if (lastEntry) {
        const metric: PerformanceMetric = {
          name: 'LCP',
          value: lastEntry.startTime,
          rating: getPerformanceRating('LCP', lastEntry.startTime),
          timestamp: Date.now(),
          url: window.location.href
        }
        
        reportMetric(metric)
      }
    })

    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch (e) {
      console.warn('LCP observation failed:', e)
    }
  }
}

/**
 * Initialize all performance monitoring
 */
export function initializePerformanceMonitoring(): void {
  if (typeof window === 'undefined') return

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCoreWebVitals)
  } else {
    initializeCoreWebVitals()
  }
} 