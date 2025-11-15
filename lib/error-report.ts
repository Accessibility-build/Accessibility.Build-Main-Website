import { errorLogger, type ErrorLogEntry } from "./error-logger"

/**
 * Error Report Utility
 *
 * Generates comprehensive error reports for the application
 */

export interface ErrorReportOptions {
  includeAccessibilityIssues?: boolean
  includeMinorIssues?: boolean
  startDate?: Date
  endDate?: Date
}

export interface ErrorReport {
  summary: {
    total: number
    critical: number
    major: number
    minor: number
    accessibility: number
    timeRange: {
      start: string
      end: string
    }
  }
  criticalErrors: ErrorLogEntry[]
  majorErrors: ErrorLogEntry[]
  minorErrors: ErrorLogEntry[]
  accessibilityIssues: ErrorLogEntry[]
  mostFrequentComponents: Array<{ component: string; count: number }>
  mostFrequentPaths: Array<{ path: string; count: number }>
}

export function generateErrorReport(options: ErrorReportOptions = {}): ErrorReport {
  const {
    includeAccessibilityIssues = true,
    includeMinorIssues = true,
    startDate = new Date(0), // Beginning of time
    endDate = new Date(), // Now
  } = options

  // Get all logs
  const allLogs = errorLogger.getLogs()

  // Filter logs by date range
  const logsInRange = allLogs.filter((log) => {
    const logDate = new Date(log.timestamp)
    return logDate >= startDate && logDate <= endDate
  })

  // Filter by severity
  const criticalErrors = logsInRange.filter((log) => log.severity === "critical")
  const majorErrors = logsInRange.filter((log) => log.severity === "major")
  const minorErrors = includeMinorIssues ? logsInRange.filter((log) => log.severity === "minor") : []
  const accessibilityIssues = includeAccessibilityIssues
    ? logsInRange.filter((log) => log.severity === "accessibility")
    : []

  // Count errors by component
  const componentCounts = new Map<string, number>()
  logsInRange.forEach((log) => {
    if (log.component) {
      const count = componentCounts.get(log.component) || 0
      componentCounts.set(log.component, count + 1)
    }
  })

  // Count errors by path
  const pathCounts = new Map<string, number>()
  logsInRange.forEach((log) => {
    if (log.path) {
      const count = pathCounts.get(log.path) || 0
      pathCounts.set(log.path, count + 1)
    }
  })

  // Sort components by frequency
  const mostFrequentComponents = Array.from(componentCounts.entries())
    .map(([component, count]) => ({ component, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Sort paths by frequency
  const mostFrequentPaths = Array.from(pathCounts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Generate summary
  const summary = {
    total: logsInRange.length,
    critical: criticalErrors.length,
    major: majorErrors.length,
    minor: minorErrors.length,
    accessibility: accessibilityIssues.length,
    timeRange: {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    },
  }

  return {
    summary,
    criticalErrors,
    majorErrors,
    minorErrors,
    accessibilityIssues,
    mostFrequentComponents,
    mostFrequentPaths,
  }
}

/**
 * Generate a human-readable error report
 */
export function generateHumanReadableReport(options: ErrorReportOptions = {}): string {
  const report = generateErrorReport(options)

  let output = `# Error Report\n\n`

  // Summary
  output += `## Summary\n\n`
  output += `- **Total Errors:** ${report.summary.total}\n`
  output += `- **Critical Errors:** ${report.summary.critical}\n`
  output += `- **Major Errors:** ${report.summary.major}\n`
  output += `- **Minor Errors:** ${report.summary.minor}\n`
  output += `- **Accessibility Issues:** ${report.summary.accessibility}\n`
  output += `- **Time Range:** ${new Date(report.summary.timeRange.start).toLocaleString()} to ${new Date(report.summary.timeRange.end).toLocaleString()}\n\n`

  // Most frequent components
  if (report.mostFrequentComponents.length > 0) {
    output += `## Most Frequent Components\n\n`
    report.mostFrequentComponents.forEach(({ component, count }) => {
      output += `- **${component}:** ${count} errors\n`
    })
    output += `\n`
  }

  // Most frequent paths
  if (report.mostFrequentPaths.length > 0) {
    output += `## Most Frequent Paths\n\n`
    report.mostFrequentPaths.forEach(({ path, count }) => {
      output += `- **${path}:** ${count} errors\n`
    })
    output += `\n`
  }

  // Critical errors
  if (report.criticalErrors.length > 0) {
    output += `## Critical Errors\n\n`
    report.criticalErrors.forEach((error) => {
      output += `### ${error.message}\n`
      output += `- **ID:** ${error.id}\n`
      output += `- **Timestamp:** ${new Date(error.timestamp).toLocaleString()}\n`
      if (error.component) output += `- **Component:** ${error.component}\n`
      if (error.path) output += `- **Path:** ${error.path}\n`
      output += `\n`
    })
  }

  // Major errors
  if (report.majorErrors.length > 0) {
    output += `## Major Errors\n\n`
    report.majorErrors.forEach((error) => {
      output += `### ${error.message}\n`
      output += `- **ID:** ${error.id}\n`
      output += `- **Timestamp:** ${new Date(error.timestamp).toLocaleString()}\n`
      if (error.component) output += `- **Component:** ${error.component}\n`
      if (error.path) output += `- **Path:** ${error.path}\n`
      output += `\n`
    })
  }

  // Accessibility issues
  if (report.accessibilityIssues.length > 0) {
    output += `## Accessibility Issues\n\n`
    report.accessibilityIssues.forEach((error) => {
      output += `### ${error.message}\n`
      output += `- **ID:** ${error.id}\n`
      output += `- **Timestamp:** ${new Date(error.timestamp).toLocaleString()}\n`
      if (error.component) output += `- **Component:** ${error.component}\n`
      if (error.path) output += `- **Path:** ${error.path}\n`
      if (error.accessibilityViolation) {
        output += `- **WCAG Criterion:** ${error.accessibilityViolation.wcagCriterion}\n`
        output += `- **Impact:** ${error.accessibilityViolation.impact}\n`
        if (error.accessibilityViolation.element) {
          output += `- **Element:** \`${error.accessibilityViolation.element}\`\n`
        }
      }
      output += `\n`
    })
  }

  // Minor errors (if included)
  if (report.minorErrors.length > 0) {
    output += `## Minor Errors\n\n`
    report.minorErrors.forEach((error) => {
      output += `### ${error.message}\n`
      output += `- **ID:** ${error.id}\n`
      output += `- **Timestamp:** ${new Date(error.timestamp).toLocaleString()}\n`
      if (error.component) output += `- **Component:** ${error.component}\n`
      if (error.path) output += `- **Path:** ${error.path}\n`
      output += `\n`
    })
  }

  return output
}
