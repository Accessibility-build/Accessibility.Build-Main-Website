import { errorLogger } from "./error-logger"

/**
 * Accessibility Checker Utility
 *
 * Provides functions to check for common accessibility issues
 * and log them appropriately
 */

interface AccessibilityCheckOptions {
  component?: string
  path?: string
  element?: string
}

export const accessibilityChecker = {
  /**
   * Check for missing alt text on images
   */
  checkMissingAltText(element: HTMLImageElement, options?: AccessibilityCheckOptions): void {
    if (!element.alt) {
      errorLogger.logAccessibilityViolation("Image is missing alt text", {
        wcagCriterion: "1.1.1",
        impact: "serious",
        element: element.outerHTML,
        component: options?.component,
        path: options?.path,
      })
    }
  },

  /**
   * Check for insufficient color contrast
   */
  checkColorContrast(
    foreground: string,
    background: string,
    fontSize: number,
    isBold: boolean,
    elementInfo: string,
    options?: AccessibilityCheckOptions,
  ): void {
    // This is a simplified check - in a real implementation, we would calculate actual contrast ratio
    const contrastRatio = this.calculateContrastRatio(foreground, background)

    // WCAG AA requires 4.5:1 for normal text and 3:1 for large text
    const isLargeText = (isBold && fontSize >= 14) || fontSize >= 18
    const requiredRatio = isLargeText ? 3 : 4.5

    if (contrastRatio < requiredRatio) {
      errorLogger.logAccessibilityViolation(
        `Insufficient color contrast: ${contrastRatio.toFixed(2)}:1 (required: ${requiredRatio}:1)`,
        {
          wcagCriterion: "1.4.3",
          impact: "serious",
          element: elementInfo,
          component: options?.component,
          path: options?.path,
        },
      )
    }
  },

  /**
   * Check for missing form labels
   */
  checkFormLabels(formElement: HTMLFormElement, options?: AccessibilityCheckOptions): void {
    const inputs = formElement.querySelectorAll("input, select, textarea")

    inputs.forEach((input) => {
      const inputElement = input as HTMLInputElement
      const inputId = inputElement.id

      if (!inputId) {
        errorLogger.logAccessibilityViolation("Form control is missing an ID", {
          wcagCriterion: "3.3.2",
          impact: "moderate",
          element: inputElement.outerHTML,
          component: options?.component,
          path: options?.path,
        })
        return
      }

      const hasLabel = !!formElement.querySelector(`label[for="${inputId}"]`)
      const hasAriaLabel = !!inputElement.getAttribute("aria-label")
      const hasAriaLabelledBy = !!inputElement.getAttribute("aria-labelledby")

      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy && inputElement.type !== "hidden") {
        errorLogger.logAccessibilityViolation("Form control is missing an associated label", {
          wcagCriterion: "3.3.2",
          impact: "serious",
          element: inputElement.outerHTML,
          component: options?.component,
          path: options?.path,
        })
      }
    })
  },

  /**
   * Check for proper heading hierarchy
   */
  checkHeadingHierarchy(document: Document, options?: AccessibilityCheckOptions): void {
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"))

    let previousLevel = 0

    headings.forEach((heading) => {
      const level = Number.parseInt(heading.tagName.charAt(1))

      // Check if heading level is skipped (e.g., h1 to h3)
      if (previousLevel > 0 && level > previousLevel + 1) {
        errorLogger.logAccessibilityViolation(`Heading hierarchy skipped from h${previousLevel} to h${level}`, {
          wcagCriterion: "1.3.1",
          impact: "moderate",
          element: heading.outerHTML,
          component: options?.component,
          path: options?.path,
        })
      }

      previousLevel = level
    })
  },

  /**
   * Calculate contrast ratio between two colors
   * This is a simplified implementation
   */
  calculateContrastRatio(foreground: string, background: string): number {
    // Convert hex to RGB
    const fgRGB = this.hexToRgb(foreground)
    const bgRGB = this.hexToRgb(background)

    if (!fgRGB || !bgRGB) return 21 // Default to maximum if conversion fails

    // Calculate luminance
    const fgLuminance = this.calculateLuminance(fgRGB)
    const bgLuminance = this.calculateLuminance(bgRGB)

    // Calculate contrast ratio
    const lighter = Math.max(fgLuminance, bgLuminance)
    const darker = Math.min(fgLuminance, bgLuminance)

    return (lighter + 0.05) / (darker + 0.05)
  },

  /**
   * Convert hex color to RGB
   */
  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    // Remove # if present
    hex = hex.replace(/^#/, "")

    // Parse hex
    const bigint = Number.parseInt(hex, 16)

    // Handle different hex formats
    if (hex.length === 3) {
      // 3-digit hex
      const r = ((bigint >> 8) & 15) * 17
      const g = ((bigint >> 4) & 15) * 17
      const b = (bigint & 15) * 17
      return { r, g, b }
    } else if (hex.length === 6) {
      // 6-digit hex
      const r = (bigint >> 16) & 255
      const g = (bigint >> 8) & 255
      const b = bigint & 255
      return { r, g, b }
    }

    return null
  },

  /**
   * Calculate luminance of RGB color
   */
  calculateLuminance(rgb: { r: number; g: number; b: number }): number {
    // Convert RGB to sRGB
    const sRGB = {
      r: rgb.r / 255,
      g: rgb.g / 255,
      b: rgb.b / 255,
    }

    // Apply gamma correction
    const gammaCorrect = (value: number) => {
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
    }

    const r = gammaCorrect(sRGB.r)
    const g = gammaCorrect(sRGB.g)
    const b = gammaCorrect(sRGB.b)

    // Calculate luminance
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  },
}
