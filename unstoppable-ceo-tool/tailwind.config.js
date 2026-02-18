/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF7',
          100: '#FAF8F0',
          200: '#F5F1E3',
          300: '#EEE7CA',
          400: '#E5D9A8',
          500: '#D4C78A',
          600: '#B8A86A',
          700: '#8F7F4A',
          800: '#665A35',
          900: '#3D3620',
        },
        navy: {
          DEFAULT: '#1a2744',
          dark: '#0f1729',
          light: '#2a3a5c',
        },
        score: {
          red: '#ef4444',
          yellow: '#f59e0b',
          green: '#22c55e',
        },
        accent: {
          lime: '#c8ff00',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(200, 255, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(200, 255, 0, 0.6)' },
        },
      },
      boxShadow: {
        'cream': '0 4px 20px rgba(238, 231, 202, 0.5)',
        'navy': '0 4px 20px rgba(26, 39, 68, 0.2)',
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 25px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 40px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
