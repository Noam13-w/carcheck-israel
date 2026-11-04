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
          950: '#14123d',
        },
        surface: {
          light: '#f7f8fc',
          card: '#ffffff',
          glass: 'rgba(255, 255, 255, 0.85)',
        },
        ilplate: {
          yellow: '#f9d616',
          yellowDark: '#e5c20d',
          blue: '#0038b8',
          blueDark: '#002984',
        }
      },
      fontFamily: {
        sans: ['Rubik', 'Assistant', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Rubik', 'Assistant', 'sans-serif'],
        mono: ['Ubuntu Mono', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px 0 rgba(20, 18, 61, 0.04)',
        'soft-md': '0 8px 24px -4px rgba(20, 18, 61, 0.06), 0 2px 6px -1px rgba(20, 18, 61, 0.02)',
        'card': '0 12px 36px -6px rgba(20, 18, 61, 0.06), 0 4px 12px -2px rgba(20, 18, 61, 0.02)',
        'card-hover': '0 24px 48px -12px rgba(75, 69, 230, 0.16), 0 8px 20px -4px rgba(20, 18, 61, 0.06)',
        'search-pill': '0 20px 50px -10px rgba(75, 69, 230, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.9), 0 10px 20px -5px rgba(0, 0, 0, 0.05)',
        'btn-primary': '0 10px 25px -5px rgba(75, 69, 230, 0.5), 0 4px 10px -2px rgba(75, 69, 230, 0.3)',
        'btn-hover': '0 14px 30px -5px rgba(75, 69, 230, 0.6), 0 6px 14px -2px rgba(75, 69, 230, 0.35)',
        'plate': 'inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)',
        'glow-indigo': '0 0 40px -5px rgba(75, 69, 230, 0.25)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
