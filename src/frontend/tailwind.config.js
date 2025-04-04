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
    },
  },
  plugins: [],
}
