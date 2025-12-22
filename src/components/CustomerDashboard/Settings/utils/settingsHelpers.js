//levlpro-mvp\src\components\CustomerDashboard\Settings\utils\settingsHelpers.js

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Validate ZIP code
 */
export const validateZipCode = (zip) => {
  return /^\d{5}(-\d{4})?$/.test(zip);
};

/**
 * Validate address data
 */
export const validateAddress = (address, city, state, zipCode) => {
  const errors = [];

  if (!address?.trim()) {
    errors.push("Street address is required");
  }

  if (!city?.trim()) {
    errors.push("City is required");
  }

  if (!state?.trim()) {
    errors.push("State is required");
  }

  if (!zipCode?.trim()) {
    errors.push("ZIP code is required");
  } else if (!validateZipCode(zipCode)) {
    errors.push("Invalid ZIP code format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Log audit event (for future use)
 */
export const logAuditEvent = async (customerId, eventType, description, metadata = null) => {
  const { supabase } = await import("../../../lib/supabaseClient");
  
  const userAgent = navigator.userAgent;

  await supabase.from("customer_audit_logs").insert({
    customer_id: customerId,
    event_type: eventType,
    description,
    metadata,
    user_agent: userAgent,
  });
};