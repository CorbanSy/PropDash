// src/components/ProviderDashboard/Settings/utils/settingsHelpers.js
import { supabase } from "../../../../lib/supabaseClient";

/**
 * Upload file to Supabase Storage
 */
export const uploadFile = async (file, bucket, folder, userId) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${folder}_${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return {
    path: fileName,
    url: urlData.publicUrl,
  };
};

/**
 * Delete file from Supabase Storage
 */
export const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
};

/**
 * Create signed URL for secure file access
 */
export const createSignedUrl = async (bucket, path, expiresIn = 60) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;
  return data.signedUrl;
};

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
 * Generate random 6-digit code
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Validate ZIP code
 */
export const validateZipCode = (zip) => {
  return /^\d{5}(-\d{4})?$/.test(zip);
};

/**
 * Log audit event
 */
export const logAuditEvent = async (providerId, eventType, description, metadata = null) => {
  // Get user agent
  const userAgent = navigator.userAgent;

  await supabase.from("audit_logs").insert({
    provider_id: providerId,
    event_type: eventType,
    description,
    metadata,
    ip_address: null, // Would come from backend
    user_agent: userAgent,
  });
};

/**
 * Services list
 */
export const servicesList = [
  { id: "plumbing", name: "Plumbing", category: "Home Services" },
  { id: "electrical", name: "Electrical", category: "Home Services" },
  { id: "hvac", name: "HVAC", category: "Home Services" },
  { id: "painting", name: "Painting", category: "Home Improvement" },
  { id: "drywall", name: "Drywall Repair", category: "Home Improvement" },
  { id: "carpentry", name: "Carpentry", category: "Home Improvement" },
  { id: "flooring", name: "Flooring", category: "Home Improvement" },
  { id: "tiling", name: "Tiling", category: "Home Improvement" },
  { id: "roofing", name: "Roofing", category: "Exterior" },
  { id: "gutters", name: "Gutters", category: "Exterior" },
  { id: "fencing", name: "Fencing", category: "Exterior" },
  { id: "landscaping", name: "Landscaping", category: "Exterior" },
  { id: "assembly", name: "Furniture Assembly", category: "Assembly" },
  { id: "tv_mounting", name: "TV Mounting", category: "Assembly" },
  { id: "cleaning", name: "Cleaning", category: "Maintenance" },
  { id: "pressure_washing", name: "Pressure Washing", category: "Maintenance" },
  { id: "appliance_install", name: "Appliance Installation", category: "Installation" },
  { id: "smart_home", name: "Smart Home Installation", category: "Installation" },
];

/**
 * Group services by category
 */
export const groupServicesByCategory = () => {
  const grouped = {};
  servicesList.forEach(service => {
    if (!grouped[service.category]) {
      grouped[service.category] = [];
    }
    grouped[service.category].push(service);
  });
  return grouped;
};