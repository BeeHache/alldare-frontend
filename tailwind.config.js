/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#1e293b',
        accent: '#60a5fa',
        surface: '#0f172a',
        background: '#020617',
      }
    },
  },
  plugins: [],
}
