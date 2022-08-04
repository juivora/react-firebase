/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: "media",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
}
