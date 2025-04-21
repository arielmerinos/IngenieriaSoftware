/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3B82F6',
          dark: '#2563EB',
        },
        secondary: {
          light: '#F59E0B',
          dark: '#D97706',
        }
      },
      backgroundColor: {
        primary: {
          DEFAULT: '#FFFFFF',
          dark: '#1F2937',
        },
        secondary: {
          DEFAULT: '#F3F4F6',
          dark: '#111827',
        },
      },
      textColor: {
        primary: {
          DEFAULT: '#111827',
          dark: '#F9FAFB',
        },
        secondary: {
          DEFAULT: '#4B5563',
          dark: '#9CA3AF',
        },
      },
      scale: {
        '102': '1.02',
      },
      animation: {
        'popup-appear': 'popup 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        popup: {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.95) translate(0, 10px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1) translate(0, 0)'
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12)',
        'card-dark-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}