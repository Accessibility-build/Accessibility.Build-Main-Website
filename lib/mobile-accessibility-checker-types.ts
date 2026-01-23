export type DeviceConfig = {
  width: number
  height: number
  isMobile: boolean
  hasTouch: boolean
}

export const MOBILE_ACCESSIBILITY_AUDIT_DEVICES: Record<string, DeviceConfig> = {
  "iPhone 14": { width: 390, height: 844, isMobile: true, hasTouch: true },
  "iPhone 14 Plus": { width: 428, height: 926, isMobile: true, hasTouch: true },
  "Samsung Galaxy S23": { width: 360, height: 780, isMobile: true, hasTouch: true },
  "iPad": { width: 768, height: 1024, isMobile: true, hasTouch: true },
  "iPad Pro": { width: 1024, height: 1366, isMobile: true, hasTouch: true },
  "Google Pixel 7": { width: 393, height: 851, isMobile: true, hasTouch: true }
}

export type TouchTargetIssue = {
  element: string
  size: { width: number; height: number }
  position: { x: number; y: number }
  severity: 'error' | 'warning'
  recommendation: string
}

export type MobileAccessibilityAuditResult = {
  device: string
  viewport: { width: number; height: number }
  touchTargets: {
    total: number
    passing: number
    failing: number
    issues: TouchTargetIssue[]
  }
  performance: {
    loadTime: number
    cumulativeLayoutShift: number
    firstContentfulPaint: number
  }
  accessibility: {
    score: number
    issues: string[]
    screenReaderCompatibility: boolean
  }
  mobileFriendly: {
    hasViewportMeta: boolean
    textReadable: boolean
    linksClickable: boolean
    contentFitsViewport: boolean
  }
}
