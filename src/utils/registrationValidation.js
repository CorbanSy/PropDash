/**
 * Registration Validation Utilities
 * Extract validation logic for easier testing
 */

// Validate password meets requirements
export function validatePassword(password) {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }
  
  if (password.length < 6) {
    return { 
      isValid: false, 
      error: 'Password must be at least 6 characters long' 
    }
  }
  
  return { isValid: true, error: null }
}

// Validate passwords match
export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return { 
      isValid: false, 
      error: 'Passwords do not match' 
    }
  }
  
  return { isValid: true, error: null }
}

// Validate registration form data
export function validateRegistrationForm(formData, userType = 'provider') {
  const errors = {}
  
  // Name validation
  const nameField = userType === 'provider' ? 'name' : 'name'
  if (!formData[nameField] || formData[nameField].trim() === '') {
    errors[nameField] = userType === 'provider' 
      ? 'Business name is required'
      : 'Full name is required'
  }
  
  // Email validation
  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'Email is required'
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  // Password validation
  const passwordValidation = validatePassword(formData.password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error
  }
  
  // Confirm password validation
  const matchValidation = validatePasswordMatch(
    formData.password, 
    formData.confirmPassword
  )
  if (!matchValidation.isValid) {
    errors.confirmPassword = matchValidation.error
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

// Parse Supabase auth errors into user-friendly messages
export function parseSupabaseAuthError(error) {
  if (!error) return null
  
  const errorCode = error.code
  const errorMessage = error.message?.toLowerCase() || ''
  
  // Handle specific error codes
  if (errorCode === 'user_already_exists') {
    return 'This email is already registered. Please use a different email or try logging in.'
  }
  
  if (errorCode === 'email_address_invalid') {
    return 'Please enter a valid email address.'
  }
  
  if (errorCode === 'weak_password' || errorMessage.includes('password')) {
    return 'Password does not meet requirements. It must be at least 6 characters long.'
  }
  
  if (errorCode === 'email_not_confirmed') {
    return 'Please check your email and confirm your account before logging in.'
  }
  
  if (errorCode === 'invalid_credentials') {
    return 'Invalid email or password. Please try again.'
  }
  
  // Return original message if no specific handling
  return error.message || 'An error occurred. Please try again.'
}

// Validate phone number (US format)
export function validatePhoneNumber(phone) {
  if (!phone || phone.trim() === '') {
    return { isValid: true, error: null } // Phone is optional
  }
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Check if it's 10 digits (US number)
  if (cleaned.length !== 10) {
    return {
      isValid: false,
      error: 'Phone number must be 10 digits',
    }
  }
  
  return { isValid: true, error: null }
}

// Format registration data for Supabase
export function formatRegistrationData(formData, userType) {
  const baseData = {
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
  }
  
  if (userType === 'provider') {
    return {
      ...baseData,
      options: {
        data: {
          name: formData.name.trim(),
          user_type: 'provider',
        },
      },
    }
  }
  
  if (userType === 'customer') {
    return {
      ...baseData,
      options: {
        data: {
          full_name: formData.name.trim(),
          user_type: 'customer',
        },
      },
    }
  }
  
  return baseData
}