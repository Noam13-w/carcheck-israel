/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f5ff',
          100: '#e9ebff',
          200: '#d5d8ff',
          300: '#b3b7ff',
          400: '#888bff',
          500: '#5e5ce6',
          600: '#4b45e6',
          700: '#3d36c7',
          800: '#332ea1',
          900: '#2c297f',
          950: '#191746',
        },
        surface: {
          light: '#f7f8fc',
          card: '#ffffff',
        },
        ilplate: {
          yellow: '#f9d616',
          blue: '#0038b8',
        }
      },
      fontFamily: {
        sans: ['Rubik', 'Assistant', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Rubik', 'Assistant', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 30px -5px rgba(25, 23, 70, 0.06), 0 4px 12px -2px rgba(25, 23, 70, 0.03)',
        'card-hover': '0 18px 40px -8px rgba(75, 69, 230, 0.14), 0 6px 16px -3px rgba(25, 23, 70, 0.05)',
        'search-bar': '0 16px 45px -10px rgba(25, 23, 70, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.85)',
        'btn-primary': '0 8px 22px -4px rgba(75, 69, 230, 0.45)',
      }
    },
  },
  plugins: [],
}
