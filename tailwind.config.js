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
        // ✨ Corporate Professional Theme - Sophisticated & Refined
        
        // Primary - Deep Navy (corporate trust, financial services)
        primary: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',  // Main primary color
          700: '#334E68',
          800: '#243B53',
          900: '#102A43',
        },

        // Secondary - Charcoal Gray (sophisticated neutrals)
        secondary: {
          50: '#F7F9FA',
          100: '#ECEFF1',
          200: '#CFD8DC',
          300: '#B0BEC5',
          400: '#90A4AE',
          500: '#78909C',
          600: '#607D8B',  // Main secondary
          700: '#546E7A',
          800: '#455A64',
          900: '#37474F',
        },

        // Accent - Deep Teal (modern, sophisticated growth)
        accent: {
          50: '#E0F2F1',
          100: '#B2DFDB',
          200: '#80CBC4',
          300: '#4DB6AC',
          400: '#26A69A',
          500: '#009688',
          600: '#00897B',  // Main accent color
          700: '#00796B',
          800: '#00695C',
          900: '#004D40',
        },

        // Success - Forest Green (sophisticated money/earnings)
        success: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',  // Main success color
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },

        // Warning - Burnt Orange (sophisticated alerts)
        warning: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF9800',
          600: '#FB8C00',  // Main warning color
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
        },

        // Error - Deep Red (professional critical)
        error: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#F44336',
          600: '#E53935',  // Main error color
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
        },

        // Premium - Deep Purple (VIP/premium features - use sparingly)
        premium: {
          50: '#F3E5F5',
          100: '#E1BEE7',
          200: '#CE93D8',
          300: '#BA68C8',
          400: '#AB47BC',
          500: '#9C27B0',
          600: '#8E24AA',  // Main premium color
          700: '#7B1FA2',
          800: '#6A1B9A',
          900: '#4A148C',
        },

        // Gold - For premium badges/highlights (use very sparingly)
        gold: {
          50: '#FFFBF0',
          100: '#FFF4D5',
          200: '#FFEAA7',
          300: '#FFD97D',
          400: '#FFC857',
          500: '#FFB82E',
          600: '#D4A017',  // Sophisticated gold
          700: '#B8860B',
          800: '#9B7006',
          900: '#7D5A00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
}