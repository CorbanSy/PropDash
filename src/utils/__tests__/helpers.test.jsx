import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  formatPhoneNumber,
  formatCurrency,
  calculateQuoteTotal,
  calculateDiscount,
  formatDate,
  truncateText,
  getInitials,
  validateRequiredFields,
} from '../helpers'

describe('validateEmail', () => {
  it('should validate correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('user.name@domain.co.uk')).toBe(true)
    expect(validateEmail('test+tag@example.com')).toBe(true)
  })

  it('should reject invalid email addresses', () => {
    expect(validateEmail('notanemail')).toBe(false)
    expect(validateEmail('missing@domain')).toBe(false)
    expect(validateEmail('@example.com')).toBe(false)
    expect(validateEmail('user@')).toBe(false)
    expect(validateEmail('')).toBe(false)
    expect(validateEmail(null)).toBe(false)
  })
})

describe('formatPhoneNumber', () => {
  it('should format 10-digit phone numbers', () => {
    expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890')
    expect(formatPhoneNumber('5555551234')).toBe('(555) 555-1234')
  })

  it('should handle phone numbers with formatting', () => {
    expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890')
    expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890')
  })

  it('should return original input for invalid lengths', () => {
    expect(formatPhoneNumber('123')).toBe('123')
    expect(formatPhoneNumber('12345678901')).toBe('12345678901')
  })

  it('should handle empty input', () => {
    expect(formatPhoneNumber('')).toBe('')
    expect(formatPhoneNumber(null)).toBe('')
  })
})

describe('formatCurrency', () => {
  it('should format numbers as USD currency by default', () => {
    expect(formatCurrency(100)).toBe('$100.00')
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
    expect(formatCurrency(0.99)).toBe('$0.99')
  })

  it('should handle zero and negative amounts', () => {
    expect(formatCurrency(0)).toBe('$0.00')
    expect(formatCurrency(-50)).toBe('-$50.00')
  })

  it('should handle null/undefined', () => {
    expect(formatCurrency(null)).toBe('$0.00')
    expect(formatCurrency(undefined)).toBe('$0.00')
  })

  it('should format different currencies', () => {
    expect(formatCurrency(100, 'EUR')).toBe('€100.00')
    expect(formatCurrency(100, 'GBP')).toBe('£100.00')
  })
})

describe('calculateQuoteTotal', () => {
  it('should calculate total with tax', () => {
    expect(calculateQuoteTotal(100, 0.1)).toBe(110) // 10% tax
    expect(calculateQuoteTotal(50, 0.08)).toBe(54) // 8% tax
  })

  it('should handle zero tax rate', () => {
    expect(calculateQuoteTotal(100, 0)).toBe(100)
    expect(calculateQuoteTotal(100)).toBe(100) // default 0
  })

  it('should handle invalid inputs', () => {
    expect(calculateQuoteTotal(0, 0.1)).toBe(0)
    expect(calculateQuoteTotal(-100, 0.1)).toBe(0)
    expect(calculateQuoteTotal(null, 0.1)).toBe(0)
  })

  it('should throw error for invalid tax rates', () => {
    expect(() => calculateQuoteTotal(100, -0.1)).toThrow('Tax rate must be between 0 and 1')
    expect(() => calculateQuoteTotal(100, 1.5)).toThrow('Tax rate must be between 0 and 1')
  })
})

describe('calculateDiscount', () => {
  it('should calculate discount correctly', () => {
    expect(calculateDiscount(100, 10)).toBe(90) // 10% off
    expect(calculateDiscount(50, 20)).toBe(40) // 20% off
    expect(calculateDiscount(75, 50)).toBe(37.5) // 50% off
  })

  it('should handle edge cases', () => {
    expect(calculateDiscount(100, 0)).toBe(100) // no discount
    expect(calculateDiscount(100, 100)).toBe(0) // 100% off
  })

  it('should handle invalid inputs', () => {
    expect(calculateDiscount(0, 10)).toBe(0)
    expect(calculateDiscount(-100, 10)).toBe(0)
    expect(calculateDiscount(100, -10)).toBe(100) // invalid discount
    expect(calculateDiscount(100, 150)).toBe(100) // invalid discount > 100%
  })
})

describe('formatDate', () => {
  it('should format dates in short format', () => {
    const date = new Date('2024-01-15')
    const formatted = formatDate(date, 'short')
    expect(formatted).toMatch(/1\/15\/2024/)
  })

  it('should format dates in long format', () => {
    const date = new Date('2024-01-15')
    const formatted = formatDate(date, 'long')
    expect(formatted).toContain('January')
    expect(formatted).toContain('2024')
  })

  it('should handle ISO format', () => {
    const date = new Date('2024-01-15')
    const formatted = formatDate(date, 'iso')
    expect(formatted).toContain('2024-01-15')
  })

  it('should handle invalid dates', () => {
    expect(formatDate('invalid-date')).toBe('Invalid date')
    expect(formatDate(null)).toBe('')
    expect(formatDate('')).toBe('')
  })
})

describe('truncateText', () => {
  it('should truncate long text', () => {
    const longText = 'This is a very long text that needs to be truncated'
    expect(truncateText(longText, 20)).toBe('This is a very long ...')
  })

  it('should not truncate short text', () => {
    expect(truncateText('Short text', 50)).toBe('Short text')
  })

  it('should use default max length', () => {
    const text = 'a'.repeat(60)
    const result = truncateText(text)
    expect(result.length).toBe(53) // 50 + '...'
  })

  it('should handle empty input', () => {
    expect(truncateText('')).toBe('')
    expect(truncateText(null)).toBe('')
  })
})

describe('getInitials', () => {
  it('should get initials from full name', () => {
    expect(getInitials('John Doe')).toBe('JD')
    expect(getInitials('Jane Smith')).toBe('JS')
  })

  it('should handle single name', () => {
    expect(getInitials('John')).toBe('J')
  })

  it('should handle multiple names', () => {
    expect(getInitials('John Michael Doe')).toBe('JD') // first and last
  })

  it('should handle empty input', () => {
    expect(getInitials('')).toBe('')
    expect(getInitials(null)).toBe('')
  })

  it('should handle extra whitespace', () => {
    expect(getInitials('  John   Doe  ')).toBe('JD')
  })
})

describe('validateRequiredFields', () => {
  it('should validate all required fields are present', () => {
    const data = {
      name: 'John',
      email: 'john@example.com',
      phone: '1234567890',
    }
    const required = ['name', 'email', 'phone']
    
    const result = validateRequiredFields(data, required)
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('should return errors for missing fields', () => {
    const data = {
      name: 'John',
      email: '',
    }
    const required = ['name', 'email', 'phone']
    
    const result = validateRequiredFields(data, required)
    expect(result.isValid).toBe(false)
    expect(result.errors).toHaveProperty('email')
    expect(result.errors).toHaveProperty('phone')
  })

  it('should handle whitespace-only values as missing', () => {
    const data = {
      name: '   ',
      email: 'test@example.com',
    }
    const required = ['name', 'email']
    
    const result = validateRequiredFields(data, required)
    expect(result.isValid).toBe(false)
    expect(result.errors).toHaveProperty('name')
  })

  it('should handle empty required fields array', () => {
    const data = { name: 'John' }
    const result = validateRequiredFields(data, [])
    
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })
})