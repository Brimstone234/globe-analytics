/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#213A57',
        secondary: '#14919B',
        third: '#0B6477',
        fourth: '#0AC1C8',
        fifth: '#45DFB1',
      },
      fontFamily: {
        poppins: ['Gruppo', 'sans-serif'],
        dela: ['Dela Gothic One', 'sans-serif'],
        shadows: ['Shadows Into Light', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

