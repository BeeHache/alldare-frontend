/** @type {import('tailwindcss').Config} */
const sharedConfig = require("@alldare/tailwind-config");

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      ...sharedConfig.theme.extend,
    },
  },
  plugins: [],
};
