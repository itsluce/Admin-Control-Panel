/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fefdf5',
          100: '#fef9e6',
          200: '#fdf2cc',
          300: '#fbe7a3',
          400: '#f8d870',
          500: '#f5c542',
          600: '#eab308',
          700: '#ca8a04',
          800: '#a16207',
          900: '#854d0e',
          950: '#713f12',
        },
        dark: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#0a0a0a',
        },
        gold: {
          50: '#fefdf5',
          100: '#fef9e6',
          200: '#fdf2cc',
          300: '#fbe7a3',
          400: '#f8d870',
          500: '#f5c542',
          600: '#eab308',
          700: '#ca8a04',
          800: '#a16207',
          900: '#854d0e',
          950: '#713f12',
        },
        black: '#0a0a0a',
        white: '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'gold': '0 4px 14px 0 rgba(234, 179, 8, 0.39)',
        'gold-lg': '0 10px 25px 0 rgba(234, 179, 8, 0.3)',
        'dark': '0 4px 14px 0 rgba(0, 0, 0, 0.2)',
        'dark-lg': '0 10px 25px 0 rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '.8',
            transform: 'scale(1.05)',
          },
        },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #f5c542 0%, #eab308 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable to prevent conflicts with MUI
  },
}