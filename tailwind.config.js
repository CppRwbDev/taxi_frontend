/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9', // Asosiy ko'k rang
          600: '#0284c7',
          900: '#0c4a6e',
        },
        dark: {
          bg: '#121212',
          surface: '#1e1e1e',
          border: '#2c2c2c',
        }
      }
    },
  },
  plugins: [],
}
