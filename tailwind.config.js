/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#0B0F14',
          800: '#121821',
          700: '#1B2330',
          600: '#27303F',
        },
        accent: {
          DEFAULT: '#FF5A1F',
        },
      },
      boxShadow: {
        card: '0 4px 24px -8px rgba(15, 23, 42, 0.08)',
        'card-dark': '0 4px 24px -8px rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'fade-in': 'fadeIn 220ms ease-out',
        'slide-up': 'slideUp 280ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
