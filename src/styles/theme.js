// src/styles/theme.js

// Corporate Professional Theme
// Sophisticated, refined, premium business aesthetic
export const theme = {
  // Buttons - Solid, sophisticated colors
  button: {
    // Primary action buttons (Deep Navy)
    primary: 'bg-primary-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all shadow-sm hover:shadow-md',
    
    // Accent buttons (Deep Teal - for special actions)
    accent: 'bg-accent-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-accent-700 active:bg-accent-800 transition-all shadow-sm hover:shadow-md',
    
    // Secondary buttons (Charcoal outline)
    secondary: 'border-2 border-secondary-400 text-secondary-700 px-5 py-3 rounded-lg font-semibold hover:bg-secondary-50 active:bg-secondary-100 transition-all',
    
    // Success/Money buttons (Forest Green)
    success: 'bg-success-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-success-700 active:bg-success-800 transition-all shadow-sm hover:shadow-md',
    
    // Danger buttons (Deep Red)
    danger: 'bg-error-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-error-700 active:bg-error-800 transition-all shadow-sm',
    dangerOutline: 'border-2 border-error-500 text-error-600 px-5 py-3 rounded-lg font-semibold hover:bg-error-50 transition-all',
    
    // Ghost/text buttons
    ghost: 'text-secondary-700 px-5 py-3 rounded-lg font-semibold hover:bg-secondary-100 transition-all',
    
    // Premium button (for VIP features)
    premium: 'bg-gradient-to-r from-premium-600 to-premium-800 text-white px-5 py-3 rounded-lg font-bold hover:from-premium-700 hover:to-premium-900 transition-all shadow-md hover:shadow-lg',
  },

  // Cards - Clean, professional depth
  card: {
    base: 'bg-white rounded-xl border border-secondary-200 shadow-card',
    hover: 'hover:shadow-card-hover hover:border-secondary-300 transition-all cursor-pointer',
    interactive: 'hover:border-accent-300 transition-all',
    padding: 'p-6',
    paddingLg: 'p-8',
    paddingSm: 'p-4',
    
    // Highlighted cards
    highlight: 'bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200',
    earnings: 'bg-gradient-to-br from-success-50 to-emerald-50 border-success-200',
    premium: 'bg-gradient-to-br from-premium-50 to-purple-50 border-premium-300',
    gold: 'bg-gradient-to-br from-gold-50 to-yellow-50 border-gold-300',
  },

  // Inputs - Professional, accessible
  input: {
    base: 'w-full border-2 border-secondary-300 rounded-lg px-4 py-3 bg-white text-secondary-900 placeholder:text-secondary-400',
    focus: 'focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition-all',
    error: 'border-error-400 focus:ring-error-500 focus:border-error-500',
    success: 'border-success-400 focus:ring-success-500 focus:border-success-500',
    disabled: 'bg-secondary-50 text-secondary-400 cursor-not-allowed',
  },

  // Status Badges - Sophisticated colors
  badge: {
    // Success states (Forest Green)
    success: 'bg-success-100 text-success-800 border border-success-300',
    
    // Warning states (Burnt Orange)
    warning: 'bg-warning-100 text-warning-800 border border-warning-300',
    pending: 'bg-warning-100 text-warning-800 border border-warning-300',
    
    // Error states (Deep Red)
    error: 'bg-error-100 text-error-800 border border-error-300',
    
    // Info states (Navy)
    info: 'bg-primary-100 text-primary-800 border border-primary-300',
    
    // Accent states (Teal)
    accent: 'bg-accent-100 text-accent-800 border border-accent-300',
    
    // Neutral states (Charcoal)
    neutral: 'bg-secondary-100 text-secondary-800 border border-secondary-300',
    
    // Premium (Purple - use sparingly)
    premium: 'bg-gradient-to-r from-premium-600 to-purple-700 text-white border-0 font-bold shadow-sm',
    
    // Gold VIP (very rare)
    gold: 'bg-gradient-to-r from-gold-600 to-yellow-600 text-white border-0 font-bold shadow-md',
  },

  // Stat Cards - Sophisticated, muted backgrounds
  statCard: {
    primary: 'bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200',
    accent: 'bg-gradient-to-br from-accent-50 to-teal-50 border-accent-200',
    success: 'bg-gradient-to-br from-success-50 to-emerald-50 border-success-200',
    warning: 'bg-gradient-to-br from-warning-50 to-orange-50 border-warning-200',
    neutral: 'bg-gradient-to-br from-secondary-50 to-slate-50 border-secondary-200',
    premium: 'bg-gradient-to-br from-premium-50 to-purple-50 border-premium-200',
  },

  // Typography - Professional hierarchy
  text: {
    h1: 'text-3xl font-bold text-secondary-900 tracking-tight',
    h2: 'text-2xl font-bold text-secondary-900 tracking-tight',
    h3: 'text-xl font-semibold text-secondary-800',
    h4: 'text-lg font-semibold text-secondary-800',
    body: 'text-secondary-700 leading-relaxed',
    bodyLarge: 'text-lg text-secondary-700 leading-relaxed',
    label: 'text-sm font-semibold text-secondary-700',
    caption: 'text-xs text-secondary-500',
    muted: 'text-sm text-secondary-500',
    disabled: 'text-secondary-400',
  },

  // Navigation - Clean, professional
  nav: {
    link: 'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
    linkActive: 'bg-primary-100 text-primary-800 font-semibold shadow-sm',
    linkInactive: 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900',
  },

  // Alerts - Clear, professional
  alert: {
    success: 'bg-success-50 border-2 border-success-300 text-success-900 p-4 rounded-lg shadow-sm',
    warning: 'bg-warning-50 border-2 border-warning-300 text-warning-900 p-4 rounded-lg shadow-sm',
    error: 'bg-error-50 border-2 border-error-300 text-error-900 p-4 rounded-lg shadow-sm',
    info: 'bg-primary-50 border-2 border-primary-300 text-primary-900 p-4 rounded-lg shadow-sm',
    accent: 'bg-accent-50 border-2 border-accent-300 text-accent-900 p-4 rounded-lg shadow-sm',
  },

  // Tables - Professional data display
  table: {
    header: 'bg-secondary-100 text-secondary-900 font-semibold text-sm border-b-2 border-secondary-300',
    row: 'border-b border-secondary-200 hover:bg-secondary-50 transition-colors',
    cell: 'px-4 py-3 text-secondary-800',
  },

  // Gradients - USE VERY SPARINGLY (premium moments only)
  gradient: {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-800',
    accent: 'bg-gradient-to-r from-accent-600 to-accent-800',
    success: 'bg-gradient-to-r from-success-600 to-success-800',
    premium: 'bg-gradient-to-r from-premium-600 to-purple-800',
    gold: 'bg-gradient-to-r from-gold-600 to-yellow-700',
    hero: 'bg-gradient-to-r from-primary-700 via-accent-700 to-primary-800', // Landing page only
  },
};