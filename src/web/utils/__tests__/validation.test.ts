import {
  validateBuildNumber,
  validateOrderNumber,
  validateString,
  validateCost,
} from '../validation'

describe('validation utils', () => {
  describe('validateBuildNumber', () => {
    it('should return true for valid build numbers', () => {
      const validBuildNumbers = ['ABC12-123', '12345-999', 'XY9Z8-001']

      validBuildNumbers.forEach((buildNumber) => {
        expect(validateBuildNumber(buildNumber)).toBe(true)
      })
    })

    it('should return false for invalid build numbers', () => {
      const invalidBuildNumbers = [
        'ABC12-1234', // too many digits after hyphen
        'ABC123-123', // too many characters before hyphen
        'ABC12_123', // wrong separator
        'abc12-123', // lowercase not allowed
        'ABC12-12', // too few digits after hyphen
        'ABCD-123', // too few characters before hyphen
        '', // empty string
        'ABC12', // missing hyphen and numbers
        'ABC12-abc', // letters after hyphen
        'ABC 12-123', // contains space
      ]

      invalidBuildNumbers.forEach((buildNumber) => {
        expect(validateBuildNumber(buildNumber)).toBe(false)
      })
    })

    it('should handle undefined input by using empty string default', () => {
      expect(validateBuildNumber()).toBe(false)
    })
  })

  describe('validateOrderNumber', () => {
    it('should return true for valid order numbers', () => {
      expect(validateOrderNumber('123-4567890-1234567')).toBe(true)
      expect(validateOrderNumber('999-0000000-9999999')).toBe(true)
    })

    it('should return false for invalid order numbers', () => {
      expect(validateOrderNumber('123-456-789')).toBe(false)
      expect(validateOrderNumber('12-4567890-1234567')).toBe(false)
      expect(validateOrderNumber('1234-4567890-1234567')).toBe(false)
      expect(validateOrderNumber('')).toBe(false)
      expect(validateOrderNumber('abc-defghij-klmnopq')).toBe(false)
    })

    it('should handle undefined input', () => {
      expect(validateOrderNumber()).toBe(false)
    })
  })

  describe('validateString', () => {
    it('should return true for non-empty strings', () => {
      expect(validateString('hello')).toBe(true)
      expect(validateString(' ')).toBe(true)
    })

    it('should return false for empty strings', () => {
      expect(validateString('')).toBe(false)
    })

    it('should handle undefined input', () => {
      expect(validateString()).toBe(false)
    })
  })

  describe('validateCost', () => {
    it('should return true for positive numbers', () => {
      expect(validateCost(10)).toBe(true)
      expect(validateCost(0.01)).toBe(true)
    })

    it('should return false for zero', () => {
      expect(validateCost(0)).toBe(false)
    })

    it('should return false for negative numbers', () => {
      expect(validateCost(-1)).toBe(false)
      expect(validateCost(-0.01)).toBe(false)
    })

    it('should handle undefined input', () => {
      expect(validateCost()).toBe(false)
    })
  })
})
