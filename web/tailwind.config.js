/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,html}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#000000',
          inverted: '#ffffff',
          gold: '#9c7c38',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        tiro: ['\"Tiro Devanagari Hindi\"', 'serif'],
      },
    },
  },
  plugins: [],
};
