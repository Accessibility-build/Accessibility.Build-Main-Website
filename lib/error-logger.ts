/**
 * Error Logger Utility
 *
 * A comprehensive error logging system for Accessibility.build
 * Captures, categorizes, and logs errors with detailed context
 */

export type ErrorSeverity = "critical" | "major" | "minor" | "accessibility"

export interface ErrorLogEntry {
  id: string
  timestamp: string
  message: string
  severity: ErrorSeverity
  component?: string
  path?: string
  stack?: string
  context?: Record<string, any>
  userAgent?: string
  accessibilityViolation?: {
    wcagCriterion?: string
    impact?: "critical" | "serious" | "moderate" | "minor"
    element?: string
  }
}

class ErrorLogger {
  private static instance: ErrorLogger
  private logs: ErrorLogEntry[] = []
  private isProduction = process.env.NODE_ENV === "production"
  private maxLogSize = 100

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  /**
   * Log an error with detailed context
   */
  public logError(
    message: string,
    severity: ErrorSeverity,
    options?: {
      component?: string
      path?: string
      error?: Error
      context?: Record<string, any>
      userAgent?: string
      accessibilityViolation?: {
        wcagCriterion?: string
        impact?: "critical" | "serious" | "moderate" | "minor"
        element?: string
      }
    },
  ): ErrorLogEntry {
    const timestamp = new Date().toISOString()
    const id = this.generateErrorId()

    const logEntry: ErrorLogEntry = {
      id,
      timestamp,
      message,
      severity,
      component: options?.component,
      path: options?.path || (typeof window !== "undefined" ? window.location.pathname : undefined),
      stack: options?.error?.stack,
      context: options?.context,
      userAgent: options?.userAgent || (typeof window !== "undefined" ? window.navigator.userAgent : undefined),
      accessibilityViolation: options?.accessibilityViolation,
    }

    // Add to local logs
    this.logs.unshift(logEntry)

    // Trim logs if they exceed max size
    if (this.logs.length > this.maxLogSize) {
      this.logs = this.logs.slice(0, this.maxLogSize)
    }

    // Console logging in development
    if (!this.isProduction) {
      this.consoleLogError(logEntry)
    }

    // In production, we would send to a logging service
    if (this.isProduction) {
      this.sendToLoggingService(logEntry)
    }

    return logEntry
  }

  /**
   * Log a critical error
   */
  public logCriticalError(message: string, options?: any): ErrorLogEntry {
    return this.logError(message, "critical", options)
  }

  /**
   * Log a major error
   */
  public logMajorError(message: string, options?: any): ErrorLogEntry {
    return this.logError(message, "major", options)
  }

  /**
   * Log a minor error
   */
  public logMinorError(message: string, options?: any): ErrorLogEntry {
    return this.logError(message, "minor", options)
  }

  /**
   * Log an accessibility violation
   */
  public logAccessibilityViolation(
    message: string,
    options: {
      wcagCriterion: string
      impact: "critical" | "serious" | "moderate" | "minor"
      element?: string
      component?: string
      path?: string
    },
  ): ErrorLogEntry {
    return this.logError(message, "accessibility", {
      ...options,
      accessibilityViolation: {
        wcagCriterion: options.wcagCriterion,
        impact: options.impact,
        element: options.element,
      },
    })
  }

  /**
   * Get all logged errors
   */
  public getLogs(): ErrorLogEntry[] {
    return [...this.logs]
  }

  /**
   * Get logs filtered by severity
   */
  public getLogsBySeverity(severity: ErrorSeverity): ErrorLogEntry[] {
    return this.logs.filter((log) => log.severity === severity)
  }

  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logs = []
  }

  /**
   * Generate a unique error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * Format and log error to console in development
   */
  private consoleLogError(logEntry: ErrorLogEntry): void {
    const severityColors = {
      critical: "\x1b[31m", // Red
      major: "\x1b[33m", // Yellow
      minor: "\x1b[36m", // Cyan
      accessibility: "\x1b[35m", // Magenta
    }

    const resetColor = "\x1b[0m"
    const color = severityColors[logEntry.severity] || resetColor

    console.group(`${color}[${logEntry.severity.toUpperCase()}]${resetColor} ${logEntry.message}`)
    console.log(`Timestamp: ${logEntry.timestamp}`)
    console.log(`ID: ${logEntry.id}`)

    if (logEntry.component) console.log(`Component: ${logEntry.component}`)
    if (logEntry.path) console.log(`Path: ${logEntry.path}`)

    if (logEntry.accessibilityViolation) {
      console.group("Accessibility Violation:")
      console.log(`WCAG Criterion: ${logEntry.accessibilityViolation.wcagCriterion}`)
      console.log(`Impact: ${logEntry.accessibilityViolation.impact}`)
      if (logEntry.accessibilityViolation.element) {
        console.log(`Element: ${logEntry.accessibilityViolation.element}`)
      }
      console.groupEnd()
    }

    if (logEntry.context) {
      console.group("Context:")
      console.log(logEntry.context)
      console.groupEnd()
    }

    if (logEntry.stack) {
      console.group("Stack Trace:")
      console.log(logEntry.stack)
      console.groupEnd()
    }

    console.groupEnd()
  }

  /**
   * Send error to a logging service in production
   * This is a placeholder for actual implementation
   */
  private sendToLoggingService(logEntry: ErrorLogEntry): void {
    // In a real implementation, this would send the error to a service like Sentry, LogRocket, etc.
    // For now, we'll just simulate it
    if (typeof window !== "undefined") {
      // This would be replaced with actual API call to logging service
      setTimeout(() => {
        // console.log(`[LOGGING SERVICE] Error logged: ${logEntry.id}`)
      }, 0)
    }
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance()

// Error boundary helper
export function logErrorToService(error: Error, componentStack?: string): void {
  errorLogger.logCriticalError(error.message, {
    error,
    context: { componentStack },
  })
}
