// src/styles/theme.js

// Trust-First Professional Theme
// Clean, minimal, business-focused design system
export const theme = {
  // Buttons - Clean, solid colors (minimal gradients)
  button: {
    // Primary action buttons (Trust Blue)
    primary: 'bg-primary-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary-700 transition shadow-sm hover:shadow-md',
    
    // Secondary buttons (Slate outline)
    secondary: 'border-2 border-secondary-300 text-secondary-700 px-5 py-3 rounded-lg font-semibold hover:bg-secondary-50 transition',
    
    // Success/Money buttons (Emerald - for payouts, earnings)
    success: 'bg-success-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-success-700 transition shadow-sm hover:shadow-md',
    
    // Danger buttons (Red - minimal use)
    danger: 'bg-error-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-error-700 transition shadow-sm',
    dangerOutline: 'border-2 border-error-400 text-error-600 px-5 py-3 rounded-lg font-semibold hover:bg-error-50 transition',
    
    // Ghost/text buttons
    ghost: 'text-secondary-700 px-5 py-3 rounded-lg font-semibold hover:bg-secondary-100 transition',
    
    // DEPRECATED (for backwards compatibility - migrate to primary/secondary)
    provider: 'bg-primary-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary-700 transition shadow-sm',
    customer: 'bg-success-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-success-700 transition shadow-sm',
    outline: 'border-2 border-secondary-700 text-secondary-700 px-5 py-3 rounded-lg font-semibold hover:bg-secondary-50 transition',
  },

  // Cards - Clean, minimal (white on slate-50 background)
  card: {
    base: 'bg-white rounded-lg border border-secondary-200 shadow-sm',
    hover: 'hover:shadow-md transition-shadow cursor-pointer',
    interactive: 'hover:border-secondary-300 transition-all',
    padding: 'p-6',
    paddingLg: 'p-8',
    paddingSm: 'p-4',
    
    // Highlighted cards (use sparingly)
    highlight: 'bg-primary-50 border-primary-200',
    earnings: 'bg-success-50 border-success-200',
    vip: 'bg-gradient-to-br from-vip-50 to-purple-50 border-vip-200',
  },

  // Inputs - Professional, accessible
  input: {
    base: 'w-full border-2 border-secondary-300 rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition bg-white text-secondary-900 placeholder:text-secondary-400',
    focus: 'focus:ring-primary-600 focus:border-primary-600',
    error: 'border-error-400 focus:ring-error-500 focus:border-error-500',
    success: 'border-success-400 focus:ring-success-500 focus:border-success-500',
    disabled: 'bg-secondary-100 text-secondary-500 cursor-not-allowed',
  },

  // Status Badges - Clear, professional
  badge: {
    // Success states (Emerald)
    success: 'bg-success-100 text-success-800 border border-success-200',
    
    // Warning states (Amber)
    warning: 'bg-warning-100 text-warning-800 border border-warning-200',
    pending: 'bg-warning-100 text-warning-800 border border-warning-200',
    
    // Error states (Red)
    error: 'bg-error-100 text-error-800 border border-error-200',
    
    // Info states (Blue)
    info: 'bg-primary-100 text-primary-800 border border-primary-200',
    
    // Neutral states (Slate)
    neutral: 'bg-secondary-100 text-secondary-800 border border-secondary-200',
    
    // VIP/Premium (Purple - use sparingly)
    vip: 'bg-gradient-to-r from-vip-600 to-purple-600 text-white border-0 font-bold shadow-sm',
  },

  // Stat Cards - Minimal, professional
  statCard: {
    primary: 'bg-primary-50 border-primary-200',
    success: 'bg-success-50 border-success-200',
    warning: 'bg-warning-50 border-warning-200',
    neutral: 'bg-secondary-50 border-secondary-200',
    vip: 'bg-vip-50 border-vip-200',
  },

  // Typography - Professional, readable
  text: {
    h1: 'text-3xl font-bold text-secondary-900 tracking-tight',
    h2: 'text-2xl font-bold text-secondary-900 tracking-tight',
    h3: 'text-xl font-semibold text-secondary-900',
    h4: 'text-lg font-semibold text-secondary-800',
    body: 'text-secondary-700 leading-relaxed',
    bodyLarge: 'text-lg text-secondary-700 leading-relaxed',
    label: 'text-sm font-semibold text-secondary-700',
    caption: 'text-xs text-secondary-500',
    muted: 'text-sm text-secondary-500',
    disabled: 'text-secondary-400',
  },

  // Navigation - Clean, minimal
  nav: {
    link: 'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition',
    linkActive: 'bg-primary-50 text-primary-700 font-semibold',
    linkInactive: 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900',
  },

  // Alerts/Notifications - Clear, actionable
  alert: {
    success: 'bg-success-50 border-2 border-success-200 text-success-800 p-4 rounded-lg',
    warning: 'bg-warning-50 border-2 border-warning-200 text-warning-800 p-4 rounded-lg',
    error: 'bg-error-50 border-2 border-error-200 text-error-800 p-4 rounded-lg',
    info: 'bg-primary-50 border-2 border-primary-200 text-primary-800 p-4 rounded-lg',
  },

  // Tables
  table: {
    header: 'bg-secondary-50 text-secondary-700 font-semibold text-sm',
    row: 'border-b border-secondary-200 hover:bg-secondary-50 transition',
    cell: 'px-4 py-3 text-secondary-900',
  },

  // Gradients - USE SPARINGLY (only for landing page or special moments)
  gradient: {
    primary: 'bg-gradient-to-r from-primary-600 to-blue-700',
    success: 'bg-gradient-to-r from-success-600 to-emerald-700',
    vip: 'bg-gradient-to-r from-vip-600 to-purple-600',
    hero: 'bg-gradient-to-r from-primary-600 via-purple-600 to-success-600', // Landing page hero only
    
    // DEPRECATED
    provider: 'bg-gradient-to-r from-secondary-700 to-primary-700',
    customer: 'bg-gradient-to-r from-success-700 to-cyan-700',
    providerHover: 'hover:from-secondary-800 hover:to-primary-800',
    customerHover: 'hover:from-success-800 hover:to-cyan-800',
  },
};