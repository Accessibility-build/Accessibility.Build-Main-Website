import { accessibilityChecker } from '../accessibility-checker'

// Mock the error logger
jest.mock('../error-logger', () => ({
  errorLogger: {
    logAccessibilityViolation: jest.fn(),
  },
}))

describe('Accessibility Checker', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('checkMissingAltText', () => {
    it('should log violation when image has no alt text', () => {
      const mockImage = document.createElement('img')
      mockImage.src = 'test.jpg'
      // No alt attribute set

      accessibilityChecker.checkMissingAltText(mockImage, {
        component: 'TestComponent',
        path: '/test',
      })

      const { errorLogger } = require('../error-logger')
      expect(errorLogger.logAccessibilityViolation).toHaveBeenCalledWith(
        'Image is missing alt text',
        expect.objectContaining({
          wcagCriterion: '1.1.1',
          impact: 'serious',
          component: 'TestComponent',
          path: '/test',
        })
      )
    })

    it('should not log violation when image has alt text', () => {
      const mockImage = document.createElement('img')
      mockImage.src = 'test.jpg'
      mockImage.alt = 'Test image description'

      accessibilityChecker.checkMissingAltText(mockImage)

      const { errorLogger } = require('../error-logger')
      expect(errorLogger.logAccessibilityViolation).not.toHaveBeenCalled()
    })
  })

  describe('calculateContrastRatio', () => {
    it('should calculate contrast ratio correctly for black and white', () => {
      const ratio = accessibilityChecker.calculateContrastRatio('#000000', '#ffffff')
      expect(ratio).toBeCloseTo(21, 1) // Should be exactly 21:1
    })

    it('should calculate contrast ratio for same colors', () => {
      const ratio = accessibilityChecker.calculateContrastRatio('#ff0000', '#ff0000')
      expect(ratio).toBeCloseTo(1, 1) // Should be 1:1
    })

    it('should handle 3-digit hex colors', () => {
      const ratio = accessibilityChecker.calculateContrastRatio('#000', '#fff')
      expect(ratio).toBeCloseTo(21, 1)
    })
  })

  describe('hexToRgb', () => {
    it('should convert 6-digit hex to RGB', () => {
      const result = accessibilityChecker.hexToRgb('#ff0000')
      expect(result).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should convert 3-digit hex to RGB', () => {
      const result = accessibilityChecker.hexToRgb('#f00')
      expect(result).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should handle hex without #', () => {
      const result = accessibilityChecker.hexToRgb('ff0000')
      expect(result).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should return null for invalid hex', () => {
      const result = accessibilityChecker.hexToRgb('invalid')
      expect(result).toBeNull()
    })
  })

  describe('checkColorContrast', () => {
    it('should log violation for insufficient contrast', () => {
      // Light gray on white - should fail contrast
      accessibilityChecker.checkColorContrast(
        '#cccccc', '#ffffff', 16, false, '<p>Test text</p>'
      )

      const { errorLogger } = require('../error-logger')
      expect(errorLogger.logAccessibilityViolation).toHaveBeenCalledWith(
        expect.stringContaining('Insufficient color contrast'),
        expect.objectContaining({
          wcagCriterion: '1.4.3',
          impact: 'serious',
        })
      )
    })

    it('should not log violation for sufficient contrast', () => {
      // Black on white - should pass contrast
      accessibilityChecker.checkColorContrast(
        '#000000', '#ffffff', 16, false, '<p>Test text</p>'
      )

      const { errorLogger } = require('../error-logger')
      expect(errorLogger.logAccessibilityViolation).not.toHaveBeenCalled()
    })
  })
}) 