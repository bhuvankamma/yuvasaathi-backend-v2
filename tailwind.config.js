// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This is a common setup for React, make sure your paths match your project
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};