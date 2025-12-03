// src/styles/theme.js

// Professional, mature theme for business users
export const theme = {
  // Gradient Backgrounds - More subdued, professional
  gradient: {
    // Provider: Deep blue/slate (corporate, trustworthy)
    provider: 'bg-gradient-to-r from-slate-700 to-blue-700',
    providerHover: 'hover:from-slate-800 hover:to-blue-800',
    providerLight: 'bg-gradient-to-br from-slate-600 via-blue-700 to-indigo-700',
    
    // Customer: Professional teal/cyan (approachable, trustworthy)
    customer: 'bg-gradient-to-r from-teal-700 to-cyan-700',
    customerHover: 'hover:from-teal-800 hover:to-cyan-800',
    customerLight: 'bg-gradient-to-br from-teal-600 via-cyan-700 to-blue-700',
    
    // Neutral options
    neutral: 'bg-gradient-to-r from-slate-700 to-slate-800',
    accent: 'bg-gradient-to-r from-indigo-600 to-blue-600',
  },

  // Buttons - Professional, clean
  button: {
    provider: 'bg-gradient-to-r from-slate-700 to-blue-700 text-white px-5 py-3 rounded-lg font-semibold hover:from-slate-800 hover:to-blue-800 transition shadow-lg shadow-slate-500/20',
    customer: 'bg-gradient-to-r from-teal-700 to-cyan-700 text-white px-5 py-3 rounded-lg font-semibold hover:from-teal-800 hover:to-cyan-800 transition shadow-lg shadow-teal-500/20',
    secondary: 'border-2 border-slate-300 text-slate-700 px-5 py-3 rounded-lg font-semibold hover:bg-slate-100 transition',
    danger: 'border-2 border-red-400 text-red-600 px-5 py-3 rounded-lg font-semibold hover:bg-red-50 transition',
    outline: 'border-2 border-slate-700 text-slate-700 px-5 py-3 rounded-lg font-semibold hover:bg-slate-50 transition',
  },

  // Cards - Clean, minimal shadows
  card: {
    base: 'bg-white rounded-lg border border-slate-200 shadow-sm',
    hover: 'hover:shadow-md transition-shadow cursor-pointer',
    interactive: 'hover:border-slate-300 transition-all',
    padding: 'p-6',
    paddingLg: 'p-8',
    paddingSm: 'p-4',
  },

  // Inputs - Professional, accessible
  input: {
    base: 'w-full border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition bg-white',
    provider: 'focus:ring-blue-600 focus:border-blue-600',
    customer: 'focus:ring-teal-600 focus:border-teal-600',
    error: 'border-red-400 focus:ring-red-500 focus:border-red-500',
    disabled: 'bg-slate-100 text-slate-500 cursor-not-allowed',
  },

  // Stat Cards - Muted, professional colors
  statCard: {
    blue: 'bg-blue-50 border-blue-200',
    teal: 'bg-teal-50 border-teal-200',
    slate: 'bg-slate-50 border-slate-200',
    orange: 'bg-orange-50 border-orange-200',
    green: 'bg-emerald-50 border-emerald-200',
  },

  // Status Badges - Clear, professional
  badge: {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-slate-100 text-slate-800 border-slate-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },

  // Typography - Professional, readable
  text: {
    h1: 'text-3xl font-bold text-slate-900 tracking-tight',
    h2: 'text-2xl font-bold text-slate-900 tracking-tight',
    h3: 'text-xl font-semibold text-slate-900',
    h4: 'text-lg font-semibold text-slate-800',
    body: 'text-slate-600 leading-relaxed',
    bodyLarge: 'text-lg text-slate-600 leading-relaxed',
    label: 'text-sm font-semibold text-slate-700',
    caption: 'text-xs text-slate-500',
    muted: 'text-sm text-slate-500',
  },

  // Sidebar/Navigation - Professional
  nav: {
    link: 'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition',
    linkActive: 'bg-blue-50 text-blue-700 font-semibold',
    linkInactive: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    linkCustomerActive: 'bg-teal-50 text-teal-700 font-semibold',
  },

  // Alerts/Notifications - Clear, actionable
  alert: {
    success: 'bg-emerald-50 border-2 border-emerald-200 text-emerald-800 p-4 rounded-lg',
    warning: 'bg-amber-50 border-2 border-amber-200 text-amber-800 p-4 rounded-lg',
    error: 'bg-red-50 border-2 border-red-200 text-red-800 p-4 rounded-lg',
    info: 'bg-blue-50 border-2 border-blue-200 text-blue-800 p-4 rounded-lg',
  },

  // Tables (for future use)
  table: {
    header: 'bg-slate-50 text-slate-700 font-semibold text-sm',
    row: 'border-b border-slate-200 hover:bg-slate-50 transition',
    cell: 'px-4 py-3 text-slate-900',
  },
};