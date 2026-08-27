/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'jersey-20': ['"Jersey 20"', 'sans-serif'],
      },
      colors: {
        'gdg-blue': 'var(--gdg-blue)',
        'gdg-red': 'var(--gdg-red)',
        'gdg-yellow': 'var(--gdg-yellow)',
        'gdg-green': 'var(--gdg-green)',
      },
    },
  },
  plugins: [],
}
