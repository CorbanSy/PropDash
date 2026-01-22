import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  validateLoginForm,
  validateEmail,
  parseLoginError,
  formatLoginData,
  validateUserType,
  getRedirectPath,
  rememberEmail,
  getRememberedEmail,
  clearRememberedEmail,
  isSessionValid,
} from '../loginValidation'

describe('validateLoginForm', () => {
  it('should pass validation for valid login data', () => {
    const formData = {
      email: 'user@example.com',
      password: 'password123',
    }
    
    const result = validateLoginForm(formData)
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('should fail when email is missing', () => {
    const formData = {
      email: '',
      password: 'password123',
    }
    
    const result = validateLoginForm(formData)
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBe('Email is required')
  })

  it('should fail when email is invalid', () => {
    const formData = {
      email: 'not-an-email',
      password: 'password123',
    }
    
    const result = validateLoginForm(formData)
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBe('Please enter a valid email address')
  })

  it('should fail when password is missing', () => {
    const formData = {
      email: 'user@example.com',
      password: '',
    }
    
    const result = validateLoginForm(formData)
    expect(result.isValid).toBe(false)
    expect(result.errors.password).toBe('Password is required')
  })

  it('should return multiple errors for multiple issues', () => {
    const formData = {
      email: 'invalid',
      password: '',
    }
    
    const result = validateLoginForm(formData)
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBeTruthy()
    expect(result.errors.password).toBeTruthy()
  })

  it('should trim whitespace from email', () => {
    const formData = {
      email: '  user@example.com  ',
      password: 'password123',
    }
    
    const result = validateLoginForm(formData)
    expect(result.isValid).toBe(true)
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
  })

  it('should handle empty/null values', () => {
    expect(validateEmail('')).toBe(false)
    expect(validateEmail(null)).toBe(false)
    expect(validateEmail(undefined)).toBe(false)
  })
})

describe('parseLoginError', () => {
  it('should handle invalid credentials error', () => {
    const error = { code: 'invalid_credentials', message: 'Invalid credentials' }
    expect(parseLoginError(error)).toBe('Invalid email or password. Please try again.')
  })

  it('should handle invalid login credentials message', () => {
    const error = { message: 'Invalid login credentials' }
    expect(parseLoginError(error)).toBe('Invalid email or password. Please try again.')
  })

  it('should handle email not confirmed error', () => {
    const error = { code: 'email_not_confirmed', message: 'Email not confirmed' }
    expect(parseLoginError(error)).toBe(
      'Please check your email and confirm your account before logging in.'
    )
  })

  it('should handle user not found error', () => {
    const error = { code: 'user_not_found', message: 'User not found' }
    expect(parseLoginError(error)).toBe(
      'No account found with this email. Please check your email or register for a new account.'
    )
  })

  it('should handle rate limit errors', () => {
    const error = { code: 'too_many_requests', message: 'Too many requests' }
    expect(parseLoginError(error)).toBe(
      'Too many login attempts. Please wait a few minutes and try again.'
    )
  })

  it('should handle network errors', () => {
    const error = { message: 'Network error occurred' }
    expect(parseLoginError(error)).toBe(
      'Network error. Please check your internet connection and try again.'
    )
  })

  it('should return original message for unknown errors', () => {
    const error = { message: 'Some unknown error' }
    expect(parseLoginError(error)).toBe('Some unknown error')
  })

  it('should handle null error', () => {
    expect(parseLoginError(null)).toBe(null)
  })

  it('should provide fallback message when no message exists', () => {
    const error = { code: 'unknown_error' }
    expect(parseLoginError(error)).toBe('Login failed. Please try again.')
  })
})

describe('formatLoginData', () => {
  it('should format login data correctly', () => {
    const formData = {
      email: '  USER@EXAMPLE.COM  ',
      password: 'MyPassword123',
    }
    
    const result = formatLoginData(formData)
    
    expect(result.email).toBe('user@example.com') // lowercase, trimmed
    expect(result.password).toBe('MyPassword123') // not modified
  })

  it('should handle already formatted data', () => {
    const formData = {
      email: 'user@example.com',
      password: 'password',
    }
    
    const result = formatLoginData(formData)
    
    expect(result.email).toBe('user@example.com')
    expect(result.password).toBe('password')
  })
})

describe('validateUserType', () => {
  it('should pass when user type matches expected type', () => {
    const user = {
      id: 'test-id',
      user_metadata: { user_type: 'provider' },
    }
    
    const result = validateUserType(user, 'provider')
    expect(result.isValid).toBe(true)
    expect(result.error).toBe(null)
  })

  it('should fail when user type does not match', () => {
    const user = {
      id: 'test-id',
      user_metadata: { user_type: 'customer' },
    }
    
    const result = validateUserType(user, 'provider')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('customer')
    expect(result.correctLoginPage).toBe('/login/client')
  })

  it('should provide correct login page for provider', () => {
    const user = {
      id: 'test-id',
      user_metadata: { user_type: 'provider' },
    }
    
    const result = validateUserType(user, 'customer')
    expect(result.isValid).toBe(false)
    expect(result.correctLoginPage).toBe('/login/professional')
  })

  it('should fail when user is null', () => {
    const result = validateUserType(null, 'provider')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('No user data received')
  })

  it('should fail when user_metadata is missing', () => {
    const user = { id: 'test-id' }
    
    const result = validateUserType(user, 'provider')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('User type not found')
  })

  it('should fail when user_type is missing', () => {
    const user = {
      id: 'test-id',
      user_metadata: {},
    }
    
    const result = validateUserType(user, 'provider')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('User type not found')
  })
})

describe('getRedirectPath', () => {
  it('should return provider dashboard for provider users', () => {
    const user = {
      user_metadata: { user_type: 'provider' },
    }
    
    expect(getRedirectPath(user)).toBe('/provider')
  })

  it('should return customer dashboard for customer users', () => {
    const user = {
      user_metadata: { user_type: 'customer' },
    }
    
    expect(getRedirectPath(user)).toBe('/customer/dashboard')
  })

  it('should return home for null user', () => {
    expect(getRedirectPath(null)).toBe('/')
  })

  it('should return home for user without metadata', () => {
    const user = { id: 'test-id' }
    expect(getRedirectPath(user)).toBe('/')
  })

  it('should return home for unknown user type', () => {
    const user = {
      user_metadata: { user_type: 'unknown' },
    }
    
    expect(getRedirectPath(user)).toBe('/')
  })
})

describe('rememberEmail', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should store email in localStorage when remember is true', () => {
    rememberEmail('user@example.com', true)
    expect(localStorage.getItem('remembered_email')).toBe('user@example.com')
  })

  it('should remove email from localStorage when remember is false', () => {
    localStorage.setItem('remembered_email', 'user@example.com')
    rememberEmail('user@example.com', false)
    expect(localStorage.getItem('remembered_email')).toBe(null)
  })

  it('should trim and lowercase email before storing', () => {
    rememberEmail('  USER@EXAMPLE.COM  ', true)
    expect(localStorage.getItem('remembered_email')).toBe('user@example.com')
  })

  it('should default to remember=true', () => {
    rememberEmail('user@example.com')
    expect(localStorage.getItem('remembered_email')).toBe('user@example.com')
  })

  it('should not store empty email', () => {
    rememberEmail('', true)
    expect(localStorage.getItem('remembered_email')).toBe(null)
  })
})

describe('getRememberedEmail', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should return stored email', () => {
    localStorage.setItem('remembered_email', 'user@example.com')
    expect(getRememberedEmail()).toBe('user@example.com')
  })

  it('should return empty string when no email stored', () => {
    expect(getRememberedEmail()).toBe('')
  })
})

describe('clearRememberedEmail', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should remove remembered email from localStorage', () => {
    localStorage.setItem('remembered_email', 'user@example.com')
    clearRememberedEmail()
    expect(localStorage.getItem('remembered_email')).toBe(null)
  })

  it('should not throw error when no email is stored', () => {
    expect(() => clearRememberedEmail()).not.toThrow()
  })
})

describe('isSessionValid', () => {
  it('should return true for valid session', () => {
    const futureTime = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
    const session = {
      expires_at: futureTime,
    }
    
    expect(isSessionValid(session)).toBe(true)
  })

  it('should return false for expired session', () => {
    const pastTime = Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
    const session = {
      expires_at: pastTime,
    }
    
    expect(isSessionValid(session)).toBe(false)
  })

  it('should return false for null session', () => {
    expect(isSessionValid(null)).toBe(false)
  })

  it('should return true for session without expiry time', () => {
    const session = {}
    expect(isSessionValid(session)).toBe(true)
  })

  it('should handle session expiring right now', () => {
    const now = Math.floor(Date.now() / 1000)
    const session = {
      expires_at: now,
    }
    
    // Should be false since expiry time has passed
    expect(isSessionValid(session)).toBe(false)
  })
})

describe('Real-world login scenarios', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should handle complete provider login flow', () => {
    const formData = {
      email: '  PROVIDER@EXAMPLE.COM  ',
      password: 'SecurePassword123',
    }
    
    // 1. Validate form
    const validation = validateLoginForm(formData)
    expect(validation.isValid).toBe(true)
    
    // 2. Format data for Supabase
    const loginData = formatLoginData(formData)
    expect(loginData.email).toBe('provider@example.com')
    
    // 3. Simulate successful login
    const user = {
      id: 'provider-id',
      email: 'provider@example.com',
      user_metadata: { user_type: 'provider' },
    }
    
    // 4. Validate user type
    const typeValidation = validateUserType(user, 'provider')
    expect(typeValidation.isValid).toBe(true)
    
    // 5. Get redirect path
    const redirectPath = getRedirectPath(user)
    expect(redirectPath).toBe('/provider')
  })

  it('should handle complete customer login flow', () => {
    const formData = {
      email: 'customer@example.com',
      password: 'MyPassword456',
    }
    
    // Validate and format
    const validation = validateLoginForm(formData)
    expect(validation.isValid).toBe(true)
    
    const loginData = formatLoginData(formData)
    expect(loginData.email).toBe('customer@example.com')
    
    // Simulate login
    const user = {
      id: 'customer-id',
      email: 'customer@example.com',
      user_metadata: { user_type: 'customer' },
    }
    
    const typeValidation = validateUserType(user, 'customer')
    expect(typeValidation.isValid).toBe(true)
    
    const redirectPath = getRedirectPath(user)
    expect(redirectPath).toBe('/customer/dashboard')
  })

  it('should handle wrong login page scenario', () => {
    const formData = {
      email: 'provider@example.com',
      password: 'password',
    }
    
    // Validate form
    const validation = validateLoginForm(formData)
    expect(validation.isValid).toBe(true)
    
    // User logs in on customer page but is a provider
    const user = {
      id: 'provider-id',
      user_metadata: { user_type: 'provider' },
    }
    
    const typeValidation = validateUserType(user, 'customer')
    expect(typeValidation.isValid).toBe(false)
    expect(typeValidation.correctLoginPage).toBe('/login/professional')
  })

  it('should handle remember me functionality', () => {
    const email = 'user@example.com'
    
    // User checks "Remember me"
    rememberEmail(email, true)
    
    // Next time they visit, email is pre-filled
    const rememberedEmail = getRememberedEmail()
    expect(rememberedEmail).toBe(email)
    
    // User unchecks "Remember me" and logs out
    clearRememberedEmail()
    expect(getRememberedEmail()).toBe('')
  })

  it('should handle invalid credentials error', () => {
    const error = {
      code: 'invalid_credentials',
      message: 'Invalid login credentials',
    }
    
    const errorMessage = parseLoginError(error)
    expect(errorMessage).toBe('Invalid email or password. Please try again.')
  })

  it('should handle session validation', () => {
    // Active session
    const activeSession = {
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    }
    expect(isSessionValid(activeSession)).toBe(true)
    
    // Expired session
    const expiredSession = {
      expires_at: Math.floor(Date.now() / 1000) - 100,
    }
    expect(isSessionValid(expiredSession)).toBe(false)
  })
})