/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], // purge ko content se replace kiya
//   darkMode: 'media', // ya 'class', ya remove kar sakte ho
  theme: {
    extend: {},
  },
  plugins: [],
};
