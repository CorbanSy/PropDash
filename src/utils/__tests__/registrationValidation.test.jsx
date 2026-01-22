import { describe, it, expect } from 'vitest'
import {
  validatePassword,
  validatePasswordMatch,
  validateEmail,
  validateRegistrationForm,
  parseSupabaseAuthError,
  validatePhoneNumber,
  formatRegistrationData,
} from '../registrationValidation'

describe('validatePassword', () => {
  it('should accept valid passwords', () => {
    expect(validatePassword('password123')).toEqual({
      isValid: true,
      error: null,
    })
    expect(validatePassword('123456')).toEqual({
      isValid: true,
      error: null,
    })
  })

  it('should reject passwords under 6 characters', () => {
    const result = validatePassword('12345')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Password must be at least 6 characters long')
  })

  it('should reject empty passwords', () => {
    const result = validatePassword('')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Password is required')
  })

  it('should reject null/undefined passwords', () => {
    expect(validatePassword(null).isValid).toBe(false)
    expect(validatePassword(undefined).isValid).toBe(false)
  })
})

describe('validatePasswordMatch', () => {
  it('should pass when passwords match', () => {
    expect(validatePasswordMatch('password123', 'password123')).toEqual({
      isValid: true,
      error: null,
    })
  })

  it('should fail when passwords do not match', () => {
    const result = validatePasswordMatch('password123', 'different')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Passwords do not match')
  })

  it('should be case-sensitive', () => {
    const result = validatePasswordMatch('Password', 'password')
    expect(result.isValid).toBe(false)
  })
})

describe('validateEmail', () => {
  it('should accept valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('test.user@company.co.uk')).toBe(true)
    expect(validateEmail('admin+tag@domain.com')).toBe(true)
  })

  it('should reject invalid email addresses', () => {
    expect(validateEmail('notanemail')).toBe(false)
    expect(validateEmail('missing@domain')).toBe(false)
    expect(validateEmail('@example.com')).toBe(false)
    expect(validateEmail('user@')).toBe(false)
    expect(validateEmail('user @example.com')).toBe(false) // space
  })

  it('should handle empty/null values', () => {
    expect(validateEmail('')).toBe(false)
    expect(validateEmail(null)).toBe(false)
    expect(validateEmail(undefined)).toBe(false)
  })
})

describe('validateRegistrationForm', () => {
  describe('Provider registration', () => {
    it('should pass validation for valid provider data', () => {
      const formData = {
        name: 'Professional Services LLC',
        email: 'provider@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }
      
      const result = validateRegistrationForm(formData, 'provider')
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should fail when business name is missing', () => {
      const formData = {
        name: '',
        email: 'provider@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }
      
      const result = validateRegistrationForm(formData, 'provider')
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBe('Business name is required')
    })

    it('should fail when email is invalid', () => {
      const formData = {
        name: 'Business Name',
        email: 'invalid-email',
        password: 'password123',
        confirmPassword: 'password123',
      }
      
      const result = validateRegistrationForm(formData, 'provider')
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe('Please enter a valid email address')
    })

    it('should fail when password is too short', () => {
      const formData = {
        name: 'Business Name',
        email: 'provider@example.com',
        password: '12345',
        confirmPassword: '12345',
      }
      
      const result = validateRegistrationForm(formData, 'provider')
      expect(result.isValid).toBe(false)
      expect(result.errors.password).toBe('Password must be at least 6 characters long')
    })

    it('should fail when passwords do not match', () => {
      const formData = {
        name: 'Business Name',
        email: 'provider@example.com',
        password: 'password123',
        confirmPassword: 'different123',
      }
      
      const result = validateRegistrationForm(formData, 'provider')
      expect(result.isValid).toBe(false)
      expect(result.errors.confirmPassword).toBe('Passwords do not match')
    })

    it('should return multiple errors when multiple fields are invalid', () => {
      const formData = {
        name: '',
        email: 'invalid',
        password: '123',
        confirmPassword: '456',
      }
      
      const result = validateRegistrationForm(formData, 'provider')
      expect(result.isValid).toBe(false)
      expect(Object.keys(result.errors).length).toBeGreaterThan(1)
    })
  })

  describe('Customer registration', () => {
    it('should pass validation for valid customer data', () => {
      const formData = {
        name: 'John Smith',
        email: 'customer@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }
      
      const result = validateRegistrationForm(formData, 'customer')
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should fail when full name is missing', () => {
      const formData = {
        name: '',
        email: 'customer@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }
      
      const result = validateRegistrationForm(formData, 'customer')
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBe('Full name is required')
    })
  })
})

describe('parseSupabaseAuthError', () => {
  it('should handle user_already_exists error', () => {
    const error = { code: 'user_already_exists', message: 'User already exists' }
    expect(parseSupabaseAuthError(error)).toBe(
      'This email is already registered. Please use a different email or try logging in.'
    )
  })

  it('should handle email_address_invalid error', () => {
    const error = { code: 'email_address_invalid', message: 'Invalid email' }
    expect(parseSupabaseAuthError(error)).toBe('Please enter a valid email address.')
  })

  it('should handle weak_password error', () => {
    const error = { code: 'weak_password', message: 'Password is too weak' }
    expect(parseSupabaseAuthError(error)).toBe(
      'Password does not meet requirements. It must be at least 6 characters long.'
    )
  })

  it('should handle password-related errors by message', () => {
    const error = { message: 'Password strength error' }
    expect(parseSupabaseAuthError(error)).toBe(
      'Password does not meet requirements. It must be at least 6 characters long.'
    )
  })

  it('should handle email_not_confirmed error', () => {
    const error = { code: 'email_not_confirmed', message: 'Email not confirmed' }
    expect(parseSupabaseAuthError(error)).toBe(
      'Please check your email and confirm your account before logging in.'
    )
  })

  it('should handle invalid_credentials error', () => {
    const error = { code: 'invalid_credentials', message: 'Invalid credentials' }
    expect(parseSupabaseAuthError(error)).toBe(
      'Invalid email or password. Please try again.'
    )
  })

  it('should return original message for unknown errors', () => {
    const error = { message: 'Some unknown error' }
    expect(parseSupabaseAuthError(error)).toBe('Some unknown error')
  })

  it('should handle null error', () => {
    expect(parseSupabaseAuthError(null)).toBe(null)
  })

  it('should provide fallback message when no message exists', () => {
    const error = { code: 'unknown_error' }
    expect(parseSupabaseAuthError(error)).toBe('An error occurred. Please try again.')
  })
})

describe('validatePhoneNumber', () => {
  it('should accept valid 10-digit phone numbers', () => {
    expect(validatePhoneNumber('1234567890')).toEqual({
      isValid: true,
      error: null,
    })
    expect(validatePhoneNumber('(555) 123-4567')).toEqual({
      isValid: true,
      error: null,
    })
    expect(validatePhoneNumber('555-123-4567')).toEqual({
      isValid: true,
      error: null,
    })
  })

  it('should accept empty phone (optional field)', () => {
    expect(validatePhoneNumber('')).toEqual({
      isValid: true,
      error: null,
    })
    expect(validatePhoneNumber('   ')).toEqual({
      isValid: true,
      error: null,
    })
  })

  it('should reject invalid phone numbers', () => {
    const result = validatePhoneNumber('123')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Phone number must be 10 digits')
  })

  it('should reject phone numbers with too many digits', () => {
    const result = validatePhoneNumber('12345678901')
    expect(result.isValid).toBe(false)
  })
})

describe('formatRegistrationData', () => {
  it('should format provider registration data', () => {
    const formData = {
      name: '  Professional Services LLC  ',
      email: '  PROVIDER@EXAMPLE.COM  ',
      password: 'password123',
    }
    
    const result = formatRegistrationData(formData, 'provider')
    
    expect(result.email).toBe('provider@example.com') // lowercase, trimmed
    expect(result.password).toBe('password123')
    expect(result.options.data.name).toBe('Professional Services LLC') // trimmed
    expect(result.options.data.user_type).toBe('provider')
  })

  it('should format customer registration data', () => {
    const formData = {
      name: '  John Smith  ',
      email: '  CUSTOMER@EXAMPLE.COM  ',
      password: 'password123',
    }
    
    const result = formatRegistrationData(formData, 'customer')
    
    expect(result.email).toBe('customer@example.com')
    expect(result.password).toBe('password123')
    expect(result.options.data.full_name).toBe('John Smith')
    expect(result.options.data.user_type).toBe('customer')
  })

  it('should handle unknown user types gracefully', () => {
    const formData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    }
    
    const result = formatRegistrationData(formData, 'unknown')
    
    expect(result.email).toBe('test@example.com')
    expect(result.password).toBe('password123')
    expect(result.options).toBeUndefined()
  })
})

describe('Real-world registration scenarios', () => {
  it('should validate complete provider registration flow', () => {
    const formData = {
      name: 'ABC Plumbing Services',
      email: 'contact@abcplumbing.com',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
    }
    
    // Validate form
    const validation = validateRegistrationForm(formData, 'provider')
    expect(validation.isValid).toBe(true)
    
    // Format for Supabase
    const formatted = formatRegistrationData(formData, 'provider')
    expect(formatted.options.data.user_type).toBe('provider')
    expect(formatted.email).toBe('contact@abcplumbing.com')
  })

  it('should validate complete customer registration flow', () => {
    const formData = {
      name: 'Jane Doe',
      email: 'jane.doe@gmail.com',
      password: 'MyPassword2024',
      confirmPassword: 'MyPassword2024',
    }
    
    // Validate form
    const validation = validateRegistrationForm(formData, 'customer')
    expect(validation.isValid).toBe(true)
    
    // Format for Supabase
    const formatted = formatRegistrationData(formData, 'customer')
    expect(formatted.options.data.user_type).toBe('customer')
    expect(formatted.options.data.full_name).toBe('Jane Doe')
  })

  it('should handle common user mistakes', () => {
    // Password too short
    let formData = {
      name: 'Test User',
      email: 'test@example.com',
      password: '12345', // Too short!
      confirmPassword: '12345',
    }
    let validation = validateRegistrationForm(formData)
    expect(validation.isValid).toBe(false)
    expect(validation.errors.password).toBeTruthy()

    // Passwords don't match
    formData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password456', // Different!
    }
    validation = validateRegistrationForm(formData)
    expect(validation.isValid).toBe(false)
    expect(validation.errors.confirmPassword).toBeTruthy()

    // Invalid email
    formData = {
      name: 'Test User',
      email: 'not-an-email', // Invalid!
      password: 'password123',
      confirmPassword: 'password123',
    }
    validation = validateRegistrationForm(formData)
    expect(validation.isValid).toBe(false)
    expect(validation.errors.email).toBeTruthy()
  })
})