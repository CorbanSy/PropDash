/**
 * Login Validation Utilities
 * Reusable validation logic for login forms
 */

// Validate login form data
export function validateLoginForm(formData) {
  const errors = {}
  
  // Email validation
  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'Email is required'
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  // Password validation
  if (!formData.password || formData.password.trim() === '') {
    errors.password = 'Password is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Simple email validation
export function validateEmail(email) {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Parse Supabase auth errors for login
export function parseLoginError(error) {
  if (!error) return null
  
  const errorCode = error.code
  const errorMessage = error.message?.toLowerCase() || ''
  
  // Handle specific login error codes
  if (errorCode === 'invalid_credentials' || errorMessage.includes('invalid login credentials')) {
    return 'Invalid email or password. Please try again.'
  }
  
  if (errorCode === 'email_not_confirmed') {
    return 'Please check your email and confirm your account before logging in.'
  }
  
  if (errorCode === 'user_not_found') {
    return 'No account found with this email. Please check your email or register for a new account.'
  }
  
  if (errorCode === 'too_many_requests' || errorMessage.includes('rate limit')) {
    return 'Too many login attempts. Please wait a few minutes and try again.'
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Network error. Please check your internet connection and try again.'
  }
  
  // Return original message if no specific handling
  return error.message || 'Login failed. Please try again.'
}

// Prepare login data for Supabase
export function formatLoginData(formData) {
  return {
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
  }
}

// Validate user type matches expected type after login
export function validateUserType(user, expectedType) {
  if (!user) {
    return {
      isValid: false,
      error: 'No user data received',
    }
  }
  
  const userType = user.user_metadata?.user_type
  
  if (!userType) {
    return {
      isValid: false,
      error: 'User type not found. Please contact support.',
    }
  }
  
  if (userType !== expectedType) {
    const correctLoginPage = userType === 'provider' 
      ? '/login/professional' 
      : '/login/client'
      
    return {
      isValid: false,
      error: `This account is registered as a ${userType}. Please use the ${userType} login page.`,
      correctLoginPage,
    }
  }
  
  return {
    isValid: true,
    error: null,
  }
}

// Get redirect path based on user type
export function getRedirectPath(user) {
  if (!user || !user.user_metadata) {
    return '/'
  }
  
  const userType = user.user_metadata.user_type
  
  if (userType === 'provider') {
    return '/provider'
  }
  
  if (userType === 'customer') {
    return '/customer/dashboard'
  }
  
  // Default fallback
  return '/'
}

// Remember me functionality - store email (NOT password!)
export function rememberEmail(email, remember = true) {
  if (remember && email) {
    localStorage.setItem('remembered_email', email.trim().toLowerCase())
  } else {
    localStorage.removeItem('remembered_email')
  }
}

// Get remembered email
export function getRememberedEmail() {
  return localStorage.getItem('remembered_email') || ''
}

// Clear remembered email
export function clearRememberedEmail() {
  localStorage.removeItem('remembered_email')
}

// Validate session is still active
export function isSessionValid(session) {
  if (!session) return false
  
  // Check if session has expired
  if (session.expires_at) {
    const expiresAt = new Date(session.expires_at * 1000)
    const now = new Date()
    
    return expiresAt > now
  }
  
  // If no expiry time, assume valid (fallback)
  return true
}