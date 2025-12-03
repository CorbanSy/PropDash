// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Provider Theme (Professional blue/slate)
        provider: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',  // Main provider color
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Customer Theme (Professional teal)
        customer: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',  // Main customer color
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'provider': '0 4px 20px -4px rgba(71, 85, 105, 0.15)',
        'customer': '0 4px 20px -4px rgba(13, 148, 136, 0.15)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 12px -2px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}