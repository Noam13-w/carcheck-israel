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
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38aaf7',
          500: '#0e8ee9',
          600: '#0270c7',
          700: '#0359a1',
          800: '#074c85',
          900: '#0c406e',
          950: '#082849',
        },
        ilplate: {
          yellow: '#f9d616',
          blue: '#0038b8',
        }
      },
      fontFamily: {
        sans: ['Assistant', 'Rubik', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
