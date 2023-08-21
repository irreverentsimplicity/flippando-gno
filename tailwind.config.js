/* tailwind.config.js */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'quantico': ['"Quantico"', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
}
