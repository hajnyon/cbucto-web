/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.njk'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        'slide-in-from-top': {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-zoom': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'slide-in': 'slide-in-from-top 0.3s ease-out',
        'fade-zoom': 'fade-zoom 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
